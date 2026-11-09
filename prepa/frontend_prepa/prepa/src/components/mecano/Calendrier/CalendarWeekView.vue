<script setup>
// Vue hebdomadaire : en-têtes, ligne "Journée" et grille horaire.
// Composant visuel, sans logique de dates.
import MaintenanceChip from "./MaintenanceChip.vue";

defineProps({
  // Chaque jour : { date, dayName, dayNumber, monthShort, isToday, isSelected, maintenances }
  days: { type: Array, required: true },
  // Créneaux affichés : [{ value: 7, label: "07:00" }, ...]
  hours: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  isInWorkHours: { type: Boolean, default: false },
  topPercent: { type: Number, default: 0 }
});

// open-day : clic sur un en-tête · open-slot : clic sur une puce ou un créneau (date, heure)
const emit = defineEmits(["open-day", "open-slot"]);
</script>

<template>
  <div class="view-week">
    <div class="week-scroller">
      <!-- En-tête des jours de la semaine -->
      <div class="week-header-grid">
        <div class="time-header-corner">
          <v-icon size="small">mdi-clock-outline</v-icon>
        </div>
        <div
          v-for="(day, index) in days"
          :key="index"
          class="week-day-header"
          :class="{
            'is-today': day.isToday,
            'is-selected': day.isSelected
          }"
          @click="emit('open-day', day.date)"
          title="Cliquer pour afficher la vue par jour"
        >
          <div class="week-day-name text-capitalize">
            {{ day.dayName }}
          </div>
          <div class="week-day-badge" :class="{ 'today-badge': day.isToday }">
            {{ day.dayNumber }} {{ day.monthShort }}
          </div>
        </div>
      </div>

      <!-- Ligne "Toute la journée" -->
      <div class="all-day-row">
        <div class="all-day-label">Journée</div>
        <div
          v-for="(day, idx) in days"
          :key="'allday-' + idx"
          class="all-day-slot"
        >
          <v-skeleton-loader
            v-if="loading"
            type="chip"
            class="week-cell-skeleton"
          />
          <template v-else>
            <div v-if="day.maintenances.length" class="week-maintenance-list">
              <MaintenanceChip
                v-for="maintenance in day.maintenances"
                :key="maintenance.id"
                :maintenance="maintenance"
                variant="week"
                @select="emit('open-slot', day.date, null)"
              />
            </div>
            <span
              v-else-if="day.date.getDay() !== 0"
              class="empty-badge"
            >
              Aucune intervention
            </span>
          </template>
        </div>
      </div>

      <!-- Grille des heures -->
      <div class="week-body-grid">
        <!-- Colonne des heures -->
        <div class="time-axis-col">
          <div
            v-for="hour in hours"
            :key="'hour-label-' + hour.value"
            class="time-hour-label"
          >
            {{ hour.label }}
          </div>
        </div>

        <!-- 7 Colonnes pour chaque jour de la semaine -->
        <div
          v-for="(day, dayIdx) in days"
          :key="'week-col-' + dayIdx"
          class="week-day-col"
          :class="{ 'is-today-col': day.isToday }"
        >
          <!-- Ligne de l'heure courante (si c'est aujourd'hui) -->
          <div
            v-if="day.isToday && isInWorkHours"
            class="current-time-line"
            :style="{ top: topPercent + '%' }"
          >
            <span class="time-dot"></span>
          </div>

          <!-- Créneaux horaires pour ce jour -->
          <div
            v-for="hour in hours"
            :key="'slot-' + dayIdx + '-' + hour.value"
            class="week-time-slot"
            @click="emit('open-slot', day.date, hour.value)"
          >
            <v-skeleton-loader
              v-if="loading"
              type="text"
              class="week-slot-skeleton"
            />
            <div v-else class="slot-hover-content">
              <v-icon size="x-small">mdi-plus</v-icon>
              <span>Libre ({{ hour.label }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.week-scroller {
  overflow-x: hidden;
  max-width: 100%;
}

.week-header-grid {
  display: grid;
  grid-template-columns: 58px repeat(7, minmax(0, 1fr));
  border-bottom: 2px solid #e0e0e0;
  background-color: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 2;
}

.time-header-corner {
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e5e7eb;
  color: #94a3b8;
}

.week-day-header {
  padding: 10px 4px;
  text-align: center;
  border-right: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
  }

  &.is-today {
    background-color: #f0fdf4;
  }
}

.week-day-name {
  font-size: 0.97rem;
  font-weight: 600;
  color: #64748b;
}

.week-day-badge {
  display: inline-block;
  margin-top: 2px;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  padding: 2px 8px;
  border-radius: 12px;

  &.today-badge {
    background-color: #2e7d32;
    color: #ffffff;
  }
}

.all-day-row {
  display: grid;
  grid-template-columns: 58px repeat(7, minmax(0, 1fr));
  border-bottom: 1px solid #e5e7eb;
  background-color: #fafbfc;
}

.all-day-label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #94a3b8;
  padding: 8px 6px;
  text-align: right;
  border-right: 1px solid #e5e7eb;
}

.all-day-slot {
  padding: 6px;
  border-right: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.week-cell-skeleton {
  width: min(100%, 110px);
  border-radius: 12px;
  overflow: hidden;
}

.week-cell-skeleton :deep(.v-skeleton-loader__chip) {
  margin: 0 auto;
}

.week-maintenance-list {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.empty-badge {
  font-size: 0.85rem;
  color: #9ca3af;
  font-style: italic;
}

.week-body-grid {
  display: grid;
  grid-template-columns: 58px repeat(7, minmax(0, 1fr));
  position: relative;
}

.time-axis-col {
  border-right: 1px solid #e5e7eb;
  background-color: #ffffff;
}

.time-hour-label {
  height: 60px;
  padding-right: 8px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  transform: translateY(-9px);
}

.week-day-col {
  border-right: 1px solid #e5e7eb;
  position: relative;
  background-color: #ffffff;

  &.is-today-col {
    background-color: #fafff8;
  }
}

.current-time-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ef4444;
  z-index: 3;
  pointer-events: none;

  .time-dot {
    position: absolute;
    left: -4px;
    top: -4px;
    width: 10px;
    height: 10px;
    background-color: #ef4444;
    border-radius: 50%;
  }
}

.week-time-slot {
  height: 60px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease;
  position: relative;

  &:hover {
    background-color: #e8f5e9;

    .slot-hover-content {
      opacity: 1;
    }
  }
}

.week-slot-skeleton {
  width: 58%;
  opacity: 0.7;
}

.slot-hover-content {
  opacity: 0;
  font-size: 0.86rem;
  color: #2e7d32;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 3px;
  transition: opacity 0.15s ease;
}
</style>
