<script setup>
// Bloc détaillé d'une maintenance : vue jour (variant="day")
// et dialogue de créneau (variant="dialog").
// Composant visuel : tous les libellés (title, period, statusLabel) arrivent dans `maintenance`.
import { computed } from "vue";

const props = defineProps({
  maintenance: { type: Object, required: true },
  variant: { type: String, default: "day" } // 'day' | 'dialog'
});

const isDialog = computed(() => props.variant === "dialog");
const label = computed(() => props.maintenance.vehicle || props.maintenance.code);

// Dans la vue jour, une étape terminée est grisée.
const iconColor = computed(() =>
  !isDialog.value && props.maintenance.isStepComplete
    ? "#94a3b8"
    : props.maintenance.color
);

const unselectedTitle = computed(() =>
  isDialog.value
    ? props.maintenance.statusLabel
    : "Nouvelle demande non sélectionnée"
);
</script>

<template>
  <!-- Maintenance terminée dans le dialogue : repliée par défaut -->
  <v-expansion-panels
    v-if="isDialog && maintenance.isComplete"
    variant="accordion"
    density="compact"
  >
    <v-expansion-panel class="slot-maintenance-panel">
      <v-expansion-panel-title>
        <div class="slot-maintenance-summary">
          <v-icon color="grey" size="small">
            {{ maintenance.icon }}
          </v-icon>
          <div class="slot-maintenance-summary-copy">
            <strong>{{ label }}</strong>
            <span>{{ maintenance.stepLabel }}</span>
          </div>
        </div>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <div class="slot-maintenance-details">
          <div class="font-weight-medium">
            {{ maintenance.title }}
          </div>
          <div>Statut : Terminée</div>
          <div>Période : {{ maintenance.period }}</div>
          <div v-if="maintenance.classification">
            Classification : {{ maintenance.classification }}
          </div>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <!-- Cas général -->
  <div v-else class="slot-maintenance-item">
    <v-icon :color="iconColor" size="small">
      {{ maintenance.icon }}
    </v-icon>
    <span
      v-if="maintenance.isUnselected"
      class="new-request-indicator-inline"
      :title="unselectedTitle"
    ></span>
    <div>
      <strong>{{ maintenance.title }}</strong>
      <div class="maintenance-step-label">
        {{ maintenance.stepLabel }}
      </div>
      <div v-if="isDialog" class="text-caption text-medium-emphasis">
        Statut : {{ maintenance.statusLabel }}
      </div>
      <div class="text-caption text-medium-emphasis">
        {{ maintenance.period }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.slot-maintenance-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  border-left: 3px solid #cbd5e1;
  border-radius: 6px;
  background: #f1f5f9;
}

.new-request-indicator-inline {
  display: inline-block;
  flex: 0 0 10px;
  width: 10px;
  height: 10px;
  margin: 0 2px;
  border-radius: 50%;
  background-color: #f59e0b;
  box-shadow: 0 0 0 2px #fff;
}

.maintenance-step-label {
  margin: 3px 0;
  color: #253f59;
  font-size: 1.05rem;
  font-weight: 600;
}

.slot-maintenance-panel {
  overflow: hidden;
  border-radius: 8px !important;
  background: #f1f5f9;
  box-shadow: none !important;
}

.slot-maintenance-panel :deep(.v-expansion-panel-title) {
  min-height: 58px;
  padding: 8px 12px;
}

.slot-maintenance-panel :deep(.v-expansion-panel-text__wrapper) {
  padding: 0 12px 12px;
}

.slot-maintenance-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.slot-maintenance-summary-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.25;

  strong,
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: #475569;
    font-size: 0.92rem;
  }
}

.slot-maintenance-details {
  display: grid;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid #dbe2ea;
  color: #475569;
  font-size: 0.95rem;
}
</style>
