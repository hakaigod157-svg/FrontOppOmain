<script setup>
// Vue par jour : bannière, maintenances du jour et créneaux horaires.
// Composant visuel, sans logique de dates.
import MaintenanceDetail from "./MaintenanceDetail.vue";

defineProps({
  // { number, monthShort, longName, weekNumber, isToday }
  day: { type: Object, required: true },
  maintenances: { type: Array, default: () => [] },
  // Créneaux affichés : [{ value: 7, label: "07:00" }, ...]
  hours: { type: Array, required: true }
});

// open-slot : clic sur un créneau horaire (heure)
const emit = defineEmits(["open-slot"]);
</script>

<template>
  <div class="view-day">
    <!-- Bannière du jour sélectionné -->
    <div class="day-view-banner pa-4 d-flex flex-wrap align-center justify-space-between ga-3">
      <div class="d-flex align-center ga-3">
        <div
          class="day-large-number-box text-center"
          :class="{ 'is-today-box': day.isToday }"
        >
          <span class="day-large-num">{{ day.number }}</span>
          <span class="day-large-month text-uppercase">{{ day.monthShort }}</span>
        </div>
        <div>
          <h3 class="text-h6 font-weight-bold mb-0 text-capitalize">
            {{ day.longName }}
          </h3>
          <p class="text-caption text-medium-emphasis mb-0">
            Semaine {{ day.weekNumber }} &bull;
            {{ day.isToday ? "Aujourd'hui" : "Jour sélectionné" }}
          </p>
        </div>
      </div>

      <!-- Info créneaux disponibles -->
      <div class="d-flex align-center ga-2">
        <v-chip
          color="success"
          variant="tonal"
          size="small"
          prepend-icon="mdi-check-circle-outline"
        >
          {{ maintenances.length
            ? `${maintenances.length} maintenance(s) prévue(s)`
            : `Journée libre (${hours.length} créneaux disponibles)` }}
        </v-chip>
      </div>
    </div>

    <v-divider />

    <div v-if="maintenances.length" class="day-maintenance-list pa-4">
      <div class="text-caption text-medium-emphasis mb-2">Maintenances prévues ce jour</div>
      <MaintenanceDetail
        v-for="maintenance in maintenances"
        :key="maintenance.id"
        :maintenance="maintenance"
        variant="day"
      />
    </div>

    <!-- Liste horaire de la journée -->
    <div class="day-schedule-wrapper">
      <div
        v-for="hour in hours"
        :key="'day-hour-' + hour.value"
        class="day-schedule-row"
        @click="emit('open-slot', hour.value)"
      >
        <!-- Heure -->
        <div class="day-schedule-time">
          <span class="time-text">{{ hour.label }}</span>
        </div>

        <!-- Contenu de la plage horaire -->
        <div class="day-schedule-slot">
          <div class="empty-slot-card">
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center ga-2 text-medium-emphasis">
                <v-icon size="small" color="grey">mdi-wrench-clock-outline</v-icon>
                <span class="font-weight-medium">Créneau disponible</span>
              </div>
              <v-btn
                variant="text"
                size="x-small"
                color="primary"
                prepend-icon="mdi-plus"
                class="slot-action-btn"
              >
                Sélectionner
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.day-view-banner {
  background: linear-gradient(to right, #f8fafc, #ffffff);
  border-bottom: 1px solid #e5e7eb;
}

.day-large-number-box {
  width: 60px;
  height: 60px;
  background-color: #f1f5f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;

  &.is-today-box {
    background-color: #2e7d32;
    color: #ffffff;
    border-color: #2e7d32;

    .day-large-num,
    .day-large-month {
      color: #ffffff;
    }
  }
}

.day-large-num {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: #1e293b;
}

.day-large-month {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #64748b;
}

.day-schedule-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px 8px;
}

.day-schedule-row {
  display: flex;
  align-items: stretch;
  min-height: 64px;
  cursor: pointer;
  border-bottom: 1px dashed #e2e8f0;
  padding: 6px 0;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f9fbf9;

    .empty-slot-card {
      border-color: #81c784;
      background-color: #f1f8e9;
    }

    .slot-action-btn {
      opacity: 1;
    }
  }
}

.day-schedule-time {
  width: 90px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16px;
  border-right: 2px solid #e2e8f0;

  .time-text {
    font-size: 1rem;
    font-weight: 700;
    color: #475569;
  }
}

.day-schedule-slot {
  flex: 1;
  padding-left: 16px;
  display: flex;
  align-items: center;
}

.empty-slot-card {
  width: 100%;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  padding: 10px 14px;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.slot-action-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}
</style>
