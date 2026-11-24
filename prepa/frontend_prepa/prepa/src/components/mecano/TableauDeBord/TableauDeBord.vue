<script setup>
import EnteteTableauDeBord from './EnteteTableauDeBord.vue'
import CarteStatistique from './CarteStatistique.vue'
import CalendrierPreventif from '@/components/mecano/Calendrier/CalendrierPreventif.vue'

defineProps({
  stats: {
    type: Object,
    default: () => ({ overdue: 0, completed: 0, inProgress: 0, pending: 0, newRequests: 0 }),
  },
  user: { type: String, default: 'Invité' },
})
const emit = defineEmits(['login', 'back-home', 'new-request', 'open-item', 'open-maintenance', 'close'])

</script>

<template>
  <div class="dashboard-overlay" @click.self="$emit('close')">
    <div class="dashboard">
      <EnteteTableauDeBord :user="user">
        <template #actions>
          <button type="button" class="dashboard__close" aria-label="Fermer" @click="$emit('close')">
            <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
              <path d="M5 5l10 10M15 5 5 15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        </template>
      </EnteteTableauDeBord>

      <main class="dashboard__grid">
        <div class="dashboard__col dashboard__col--main">
          <CarteStatistique layout="footer" bar label="MAINTENANCE EN COURS" :value="stats.inProgress">
            <div class="dashboard__table-wrap">
              <table class="dashboard__table" aria-label="Maintenances en cours">
                <thead>
                  <tr>
                    <th>Maintenance</th>
                    <th>Classification</th>
                    <th>Véhicule</th>
                    <!-- <th>Demande</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in stats.inProgressItems" :key="item.maintenanceCode || item.demande_CODE " tabindex="0" @click="emit('open-item', item, 'maintenance')" @keydown.enter="emit('open-item', item, 'maintenance')">
                    <td>{{ item.maintenanceCode || item.demande_CODE }}</td>
                    <td>{{ item.maintenanceClassification || '—' }}</td>
                    <td>{{ item.demande_VOITURE || '—' }}</td>
                    <!-- <td>{{ item.demande_CODE || '—' }}</td> -->
                  </tr>
                  <tr v-if="!stats.inProgressItems?.length"><td colspan="4" class="dashboard__empty">Aucune maintenance en cours</td></tr>
                </tbody>
              </table>
            </div>
          </CarteStatistique>
          <CarteStatistique layout="footer" bar label="DEMANDE EN ATTENTE" :value="stats.pending">
            <div class="dashboard__table-wrap">
              <table class="dashboard__table" aria-label="Demandes en attente">
                <thead>
                  <tr>
                    <th>Demande</th>
                    <th>Véhicule</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in stats.pendingItems" :key="item.demande_CODE " tabindex="0" @click="emit('open-item', item, 'demande')" @keydown.enter="emit('open-item', item, 'demande')">
                    <td>{{ item.demande_CODE  }}</td>
                    <td>{{ item.demande_VOITURE || '—' }}</td>
                    <td>{{ item.demande_TYPE || '—' }}</td>
                  </tr>
                  <tr v-if="!stats.pendingItems?.length"><td colspan="3" class="dashboard__empty">Aucune demande en attente</td></tr>
                </tbody>
              </table>
            </div>
          </CarteStatistique>
        </div>

        <div class="dashboard__col dashboard__col--side">
          <div class="dashboard__kpis">
            <CarteStatistique label="Délai dépassé" :value="stats.overdue" />
            <CarteStatistique label="Maintenance terminées" :value="stats.completed" />
          </div>

          <div class="dashboard__calendar" aria-label="Aperçu du calendrier préventif">
            <CalendrierPreventif @open-maintenance="emit('open-maintenance', $event)" />
          </div>

          <button type="button" class="dashboard__new-request" @click="$emit('new-request')">
            Nouvelle demande
          </button>
        </div>
      </main>

      <footer class="dashboard__footer">
        <button type="button" class="dashboard__back" @click="$emit('back-home')">FERMER</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.dashboard-overlay {
  position: fixed;
  inset: 0;
  z-index: 2100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(14px) saturate(130%);
  -webkit-backdrop-filter: blur(14px) saturate(130%);
}

.dashboard {
  /* Palette du dashboard de sauvegarde, isolée du thème global de l’ERP. */
  --color-bg: #f7faf7;
  --color-surface: #ffffff;
  --color-surface-strong: #f1f6f1;
  --color-border: #dce5dc;
  --color-text: #1a1f1b;
  --color-text-muted: #667166;
  --color-primary: #2e7d32;
  --color-primary-dark: #1b5e20;
  --color-primary-soft: #e8f5e9;
  --radius-md: 15px;
  --radius-sm: 8px;
  --space-1: 8px;
  --space-2: 16px;
  display: flex;
  flex-direction: column;
  width: 95vw;
  max-width: 1440px;
  height: 95vh;
  max-height: 95vh;
  overflow: hidden;
  padding: 0 80px 56px;
  background: var(--color-bg, #fff);
  color: var(--color-text);
  font-family: inherit;
  border-radius: var(--radius-md, 15px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.dashboard__close {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-sm, 8px);
  background: transparent;
  color: var(--color-text, #1a1f1b);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.dashboard__close:hover {
  background: var(--color-primary-soft, #e8f5e9);
}

.dashboard__close:focus-visible {
  outline: 2px solid var(--color-primary, #2e7d32);
  outline-offset: 2px;
}

.dashboard__grid {
  display: grid;
  grid-template-columns: minmax(0, 865fr) minmax(0, 400fr);
  gap: var(--space-1, 8px);
  flex: 1 1 auto;
  min-height: 0;
}

.dashboard__col--main {
  display: flex;
  flex-direction: column;
  gap: var(--space-1, 8px);
  min-height: 0;
}

.dashboard__col--main > * {
  flex: 1 1 0;
  min-height: 0;
}

.dashboard__table-wrap { max-height: 100%; overflow: auto; padding: 4px 8px; color: var(--color-text); font-size: 12px; }
.dashboard__table { width:100%; border-collapse:collapse; table-layout:fixed; }
.dashboard__table th { position:sticky; top:0; padding:5px 8px; background:var(--color-surface); color:var(--color-text-muted); font-size:10px; text-align:left; }
.dashboard__table td { overflow:hidden; padding:6px 8px; border-bottom:1px solid var(--color-border); text-overflow:ellipsis; white-space:nowrap; }
.dashboard__table tbody tr[tabindex] { cursor:pointer; }
.dashboard__table tbody tr[tabindex]:hover { background:var(--color-primary-soft); }
.dashboard__table tbody tr[tabindex]:focus-visible { outline:2px solid var(--color-primary); outline-offset:-2px; }
.dashboard__empty { padding:12px !important; color:var(--color-text-muted); text-align:center; }
.dashboard__calendar { display: block; width: 100%; min-width: 0; min-height: 0; overflow: hidden; text-align: left; }

.dashboard__new-request {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  min-height: 60px;
  padding: 12px 16px;
  border: 1px solid #0b3b17;
  border-radius: var(--radius-md);
  background: #0b3b17;
  color: #ffffff;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.dashboard__new-request:hover {
  border-color: #14532d;
  background: #14532d;
}

.dashboard__new-request:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}


.dashboard__col--side {
  display: grid;
  grid-template-rows: 112px minmax(0, 1fr) 76px;
  gap: var(--space-1, 8px);
  min-height: 0;
}

.dashboard__kpis {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-1, 8px);
}

.dashboard__footer {
  display: flex;
  justify-content: center;
  margin-top: 18px;
}

.dashboard__back {
  min-width: 180px;
  height: 48px;
  border: 1px solid var(--color-primary, #2e7d32);
  border-radius: var(--radius-sm, 8px);
  background: transparent;
  color: var(--color-primary-dark, #1b5e20);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.dashboard__back:hover {
  background: var(--color-primary-soft, #e8f5e9);
  border-color: var(--color-primary-dark, #1b5e20);
}

.dashboard__back:focus-visible {
  outline: 2px solid var(--color-primary, #2e7d32);
  outline-offset: 2px;
}

@media (max-width: 1024px) {
  .dashboard {
    padding: 0 24px 40px;
  }

  .dashboard__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .dashboard__col--main > * {
    min-height: 0;
  }

  .dashboard__col--side { grid-template-rows: 112px minmax(0, 1fr) 76px; }
}
</style>
