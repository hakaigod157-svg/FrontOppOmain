<script setup>
import { computed, onMounted, ref } from 'vue'
import { maintStore } from '@/store/Maintenance/maintenance_store'
import { useEtapeStore } from '@/store/Maintenance/etape_store'
import { useDemandeMaintenance } from '@/store/Maintenance/demande_store'

const props = defineProps({ locale: { type: String, default: 'fr' } })
const emit = defineEmits(['open-maintenance'])
const maintenanceStore = maintStore()
const stepStore = useEtapeStore()
const demandeStore = useDemandeMaintenance()
const viewDate = ref(new Date())
const selectedDate = ref(new Date())
const maintenanceSchedules = ref([])
const newMaintenanceIds = ref(new Set())
const STORAGE_KEY = 'maintenance-calendar-seen-ids'

const monthNames = computed(() => new Intl.DateTimeFormat(props.locale, { month: 'long', year: 'numeric' }).format(viewDate.value))
const weekdays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']
const dateValue = (value) => {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : new Date(value.getFullYear(), value.getMonth(), value.getDate())
  const text = String(value).trim()
  const iso = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  const french = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  const date = iso
    ? new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
    : french
      ? new Date(Number(french[3]), Number(french[2]) - 1, Number(french[1]))
      : new Date(text)
  return Number.isNaN(date.getTime()) ? null : new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
const dayKey = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
const schedulesForDay = (date) => maintenanceSchedules.value.filter(({ dates }) =>
  date.getDay() !== 0 && dates.some((scheduledDate) => dayKey(scheduledDate) === dayKey(date))
)
const selectedMaintenances = computed(() => schedulesForDay(selectedDate.value))

const cells = computed(() => {
  const first = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1)
  const start = new Date(first)
  start.setDate(1 - ((first.getDay() + 6) % 7))
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const daySchedules = schedulesForDay(date)
    const count = daySchedules.length
    const newCount = daySchedules.filter(({ id }) => newMaintenanceIds.value.has(id)).length
    return { date, count, newCount, inMonth: date.getMonth() === viewDate.value.getMonth() }
  })
})

const loadSchedules = async () => {
  // Les listes sont chargées par la page avant le montage du dashboard.
  const ids = maintenanceStore.maintnces.map((m) => String(m.maint_CODE ?? m.MAINT_CODE ?? m.code ?? '')).filter(Boolean)
  let seenIds = []
  try { seenIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { seenIds = [] }
  if (localStorage.getItem(STORAGE_KEY) === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    newMaintenanceIds.value = new Set()
  } else {
    newMaintenanceIds.value = new Set(ids.filter((id) => !seenIds.includes(id)))
  }

  const demandsByCode = new Map(
    (demandeStore.demandes || []).map((demand) => [
      String(demand.demande_CODE ?? demand.DEMANDE_CODE ?? ''),
      demand,
    ])
  )
  const schedules = []
  for (const maintenance of maintenanceStore.maintnces) {
    const id = String(maintenance.maint_CODE ?? maintenance.code ?? maintenance.MAINT_CODE ?? '')
    if (!id) continue
   
    const preparation = await stepStore.getListePrepaMaint(id)
    const dates = [...new Set((Array.isArray(preparation) ? preparation : [])
      .map((step) => dateValue(step.maint_ETAPE_PREVU ?? step.MAINT_ETAPE_PREVU))
      .filter(Boolean)
      .map(dayKey))]
      .map((key) => {
        const [year, month, day] = key.split('-').map(Number)
        return new Date(year, month - 1, day)
      })
    if (dates.length) {
      const demandCode = String(maintenance.maint_DEMANDE  ?? '')
      const demand = demandsByCode.get(demandCode)
      schedules.push({
      id,
      code: maintenance.maint_CODE ?? maintenance.MAINT_CODE ?? id,
      vehicle: maintenance.maint_VOITURE || maintenance.maint_NUMVOITURE || demand?.demande_VOITURE || '',
      type: maintenance.maint_CLASSIFICATION || '',
      dates,
      })
    }
  }
  maintenanceSchedules.value = schedules
}

const shift = (delta) => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + delta, 1)
  selectedDate.value = new Date(viewDate.value)
}
const selectDay = (date) => { selectedDate.value = date }

onMounted(() => {
  loadSchedules()
})
</script>

<template>
  <section class="preventive" aria-label="Aperçu du calendrier préventif">
    <div class="calendar">
      <div class="calendar__nav">
        <button type="button" class="calendar__arrow" aria-label="Mois précédent" @click.stop="shift(-1)">‹</button>
        <strong class="calendar__month">{{ monthNames }}</strong>
        <button type="button" class="calendar__arrow" aria-label="Mois suivant" @click.stop="shift(1)">›</button>
      </div>
      <div class="calendar__grid">
        <span v-for="(day, index) in weekdays" :key="index" class="calendar__weekday">{{ day }}</span>
        <button v-for="cell in cells" :key="dayKey(cell.date)" type="button" class="calendar__cell" :class="{ 'calendar__cell--muted': !cell.inMonth, 'calendar__cell--selected': dayKey(cell.date) === dayKey(selectedDate), 'calendar__cell--today': dayKey(cell.date) === dayKey(new Date()) }" :aria-label="`${cell.date.toLocaleDateString('fr-FR')}, ${cell.count} maintenance(s)`" :aria-pressed="dayKey(cell.date) === dayKey(selectedDate)" @click="selectDay(cell.date)">
          <span class="calendar__date">{{ cell.date.getDate() }}</span>
          <span v-if="cell.count" class="calendar__count" :class="{ 'calendar__count--new': cell.newCount }">{{ cell.count }}</span>
          <span v-else class="calendar__count calendar__count--empty">·</span>
        </button>
      </div>
    </div>
    <section class="day-detail" aria-live="polite">
      <div class="day-detail__heading">
        <h2 class="preventive__title">{{ selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }}</h2>
        <span class="day-detail__total">{{ selectedMaintenances.length }} maintenance{{ selectedMaintenances.length === 1 ? '' : 's' }}</span>
      </div>
      <div v-if="selectedMaintenances.length" class="day-detail__list">
        <button v-for="maintenance in selectedMaintenances" :key="maintenance.id" type="button" class="day-detail__item" @click="emit('open-maintenance', maintenance.code)">
          <span class="day-detail__dot" :class="{ 'day-detail__dot--new': newMaintenanceIds.has(maintenance.id) }" />
          <strong>{{ maintenance.type || 'Classification non renseignée' }}</strong>
          <span>{{ maintenance.vehicle || 'Véhicule non renseigné' }}</span>
        </button>
      </div>
      <p v-else class="day-detail__empty">Aucune maintenance prévue ce jour.</p>
    </section>
  </section>
</template>

<style scoped>
.preventive { display:flex; height:100%; min-height:0; flex-direction:column; gap:10px; padding:14px; border:1px solid var(--color-border); border-radius:var(--radius-md); background:var(--color-surface); }
.calendar { flex:0 0 auto; padding:8px; border-radius:var(--radius-md); background:var(--color-bg); }
.calendar__nav { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; }
.calendar__month { font-size:13px; text-transform:capitalize; }
.calendar__arrow { width:28px; height:28px; border:0; border-radius:6px; background:transparent; color:var(--color-primary-dark); font-size:22px; cursor:pointer; }
.calendar__arrow:hover { background:var(--color-primary-soft); }
.calendar__grid { display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:3px; text-align:center; }
.calendar__weekday { color:var(--color-text-muted); font-size:10px; font-weight:700; padding:3px 0; }
.calendar__cell { min-width:0; height:34px; display:flex; align-items:center; justify-content:center; gap:4px; border:1px solid transparent; border-radius:7px; background:transparent; color:var(--color-text); font:inherit; font-size:11px; cursor:pointer; }
.calendar__cell:hover { background:#f1f8f2; }
.calendar__cell--muted { color:#aab2aa; }
.calendar__cell--selected { border-color:#2e7d32; background:#e8f5e9; font-weight:700; }
.calendar__cell--today .calendar__date { color:#1b5e20; font-weight:800; text-decoration:underline; text-underline-offset:2px; }
.calendar__count { min-width:17px; height:17px; padding:0 4px; border-radius:9px; background:#dcefe0; color:#1b5e20; font-size:9px; line-height:17px; font-weight:800; }
.calendar__count--new { background:#ffca28; color:#4e3900; box-shadow:0 0 0 2px #fff1bd; }
.calendar__count--empty { background:transparent; color:#c5ccc5; }
.day-detail { flex:1 1 auto; min-height:0; display:flex; flex-direction:column; overflow:hidden; padding:10px 12px; border-radius:8px; background:#f8faf8; }
.day-detail__heading { display:flex; justify-content:space-between; align-items:center; gap:8px; padding-bottom:8px; border-bottom:1px solid #e4ebe4; }
.preventive__title { margin:0; color:var(--color-primary-dark); font-size:13px; text-transform:capitalize; }
.day-detail__total { flex:none; color:var(--color-text-muted); font-size:11px; }
.day-detail__list { overflow:auto; padding-top:4px; }
.day-detail__item { width:100%; display:grid; grid-template-columns:8px minmax(52px,auto) 1fr; align-items:center; gap:7px; min-height:32px; border:0; border-bottom:1px solid #e8eee8; background:transparent; color:var(--color-text); font:inherit; font-size:11px; text-align:left; cursor:pointer; }
.day-detail__item:hover { background:#eaf4eb; }
.day-detail__item:focus-visible { outline:2px solid #2e7d32; outline-offset:-2px; }
.day-detail__item strong { color:#244d28; }
.day-detail__item > span:last-child { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--color-text-muted); }
.day-detail__dot { width:7px; height:7px; border-radius:50%; background:#66a66b; }
.day-detail__dot--new { background:#e4a900; }
.day-detail__empty { margin:auto; color:var(--color-text-muted); font-size:12px; text-align:center; }
</style>
