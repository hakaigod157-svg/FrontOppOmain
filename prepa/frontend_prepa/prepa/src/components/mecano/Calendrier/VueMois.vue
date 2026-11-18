<script setup>
import MaintenanceChip from "./MaintenanceChip.vue";

defineProps({
  // Chaque case : { date, dayNumber, isCurrentMonth, isToday, isWeekend, isSelected, maintenances }
  cells: { type: Array, required: true },
  // Noms des 7 jours, Lundi en premier
  weekDayNames: { type: Array, required: true },
  loading: { type: Boolean, default: false }
});

// select-day : clic sur la case · open-day : double clic · open-slot : clic sur une puce
const emit = defineEmits(["select-day", "open-day", "open-slot"]);

// Taille des bulles selon le nombre de maintenances dans la case
const getBubbleLayoutStyle = (maintenanceCount) => {
  const rowCount = Math.max(1, Math.ceil(maintenanceCount / 3));
  const scale = Math.max(0.4, 1 - (rowCount - 1) * 0.15);

  return {
    "--bubble-rows": rowCount,
    "--bubble-scale": scale
  };
};
</script>

<template>
  <div class="view-month">
    <!-- En-tête des jours de la semaine -->
    <div class="month-header-grid">
      <div
        v-for="(dayName, index) in weekDayNames"
        :key="index"
        class="month-header-cell text-capitalize"
        :class="{ 'is-weekend': index >= 5 }"
      >
        <span class="d-none d-md-inline">{{ dayName }}</span>
        <span class="d-inline d-md-none">{{ dayName.slice(0, 3) }}</span>
      </div>
    </div>

    <!-- Grille des jours (42 cases pour un calendrier uniforme) -->
    <div class="month-days-grid">
      <div
        v-for="(cell, index) in cells"
        :key="index"
        class="month-day-cell"
        :class="{
          'is-outside-month': !cell.isCurrentMonth,
          'is-today': cell.isToday,
          'is-selected': cell.isSelected,
          'is-weekend': cell.isWeekend
        }"
        @click="emit('select-day', cell.date)"
        @dblclick="emit('open-day', cell.date)"
      >
        <!-- En-tête du jour -->
        <div class="day-cell-header d-flex align-center justify-space-between">
          <span class="day-number" :class="{ 'today-badge': cell.isToday }">
            {{ cell.dayNumber }}
          </span>
          <span v-if="cell.isToday" class="today-text d-none d-lg-inline">
            Aujourd'hui
          </span>
        </div>

        <!-- Maintenances prévues ce jour -->
        <div
          class="day-cell-body"
          :style="getBubbleLayoutStyle(cell.maintenances.length)"
        >
          <v-skeleton-loader
            v-if="loading"
            type="chip"
            class="calendar-cell-skeleton"
          />
          <template v-else>
            <MaintenanceChip
              v-for="maintenance in cell.maintenances"
              :key="maintenance.id"
              :maintenance="maintenance"
              variant="month"
              @select="emit('open-slot', cell.date)"
            />
            <div v-if="!cell.maintenances.length" class="empty-cell-hint">
              <v-icon size="x-small" class="hint-icon">mdi-plus</v-icon>
              <span class="hint-text">Libre</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.view-month {
  width: 100%;
}

.month-header-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  background-color: #f4f6f8;
  border-bottom: 1px solid #e5e7eb;
}

.month-header-cell {
  padding: 10px 8px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;

  &.is-weekend {
    color: #9ca3af;
    background-color: #f0f2f5;
  }
}

.month-days-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-template-rows: repeat(6, minmax(0, 1fr));
  height: min(780px, max(340px, calc(100dvh - 310px)));
  background-color: #e5e7eb;
  gap: 1px; /* Créer des bordures nettes entre cellules */
}

.month-day-cell {
  background-color: #ffffff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
  min-height: 0;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #f9fbf9;
    box-shadow: inset 0 0 0 1px #81c784;

    .empty-cell-hint {
      opacity: 1;
    }
  }

  &.is-outside-month {
    background-color: #fafafa;
    color: #a0aec0;
  }

  &.is-weekend {
    background-color: #fcfcfc;
  }

  &.is-selected {
    background-color: #f1f8e9;
    box-shadow: inset 0 0 0 2px #4caf50;
  }

  &.is-today {
    background-color: #fafff8;
  }
}

.day-cell-header {
  font-size: 1rem;
  font-weight: 600;
}

.day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #374151;

  &.today-badge {
    background-color: #2e7d32;
    color: #ffffff !important;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(46, 125, 50, 0.3);
  }
}

.today-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2e7d32;
  background-color: #e8f5e9;
  padding: 2px 6px;
  border-radius: 4px;
}

.day-cell-body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(var(--bubble-rows, 1), minmax(0, 1fr));
  align-content: start;
  align-items: stretch;
  gap: 3px;
  padding-top: 4px;
  overflow: hidden;
}

.calendar-cell-skeleton {
  grid-column: 1 / -1;
  width: min(100%, 110px);
  border-radius: 12px;
  overflow: hidden;
}

.calendar-cell-skeleton :deep(.v-skeleton-loader__chip) {
  margin: 0;
}

.empty-cell-hint {
  opacity: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  color: #66bb6a;
  background-color: #e8f5e9;
  padding: 3px 8px;
  border-radius: 12px;
  transition: opacity 0.2s ease;
}
</style>
