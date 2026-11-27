<script setup>
// Bloc détaillé d'une maintenance : vue jour (variant="day")
// et dialogue de créneau (variant="dialog").
// Composant visuel : tous les libellés (title, period, statusLabel) arrivent dans `maintenance`.
import { computed } from "vue";
import BoutonFlecheSuivant from "@/components/mecano/UI/BoutonFlecheSuivant.vue";

const props = defineProps({
  maintenance: { type: Object, required: true },
  variant: { type: String, default: "day" } // 'day' | 'dialog'
});

const isDialog = computed(() => props.variant === "dialog");
const label = computed(() => props.maintenance.vehicle || props.maintenance.code);

const iconColor = computed(() => {
  if (!props.maintenance.isStepComplete) return props.maintenance.color;
  return isDialog.value ? "#16a34a" : "#94a3b8";
});
const maintenanceColor = computed(() => props.maintenance.color || "#64748b");

const unselectedTitle = computed(() =>
  isDialog.value
    ? props.maintenance.statusLabel
    : "Nouvelle demande non sélectionnée"
);

const emit = defineEmits(["view-maintenance"]);

const viewMaintenance = () => emit("view-maintenance", props.maintenance);
</script>

<template>
  <!-- Maintenance terminée dans le dialogue : repliée par défaut -->
  <v-expansion-panels
    v-if="isDialog && maintenance.isComplete"
    variant="accordion"
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
          <v-btn
            size="small"
            variant="outlined"
            color="#0b3b17"
            prepend-icon="mdi-open-in-new"
            class="mt-2 align-self-start text-none"
            @click.stop="viewMaintenance"
          >
            Voir maintenance
          </v-btn>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <!-- Cas général -->
  <div
    v-else
    class="slot-maintenance-item"
    :class="{ 'is-clickable': !maintenance.isComplete }"
    :style="{ '--maintenance-color': maintenanceColor }"
    @click="!maintenance.isComplete && viewMaintenance()"
  >
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
    <v-btn
      v-if="maintenance.isComplete"
      size="small"
      variant="outlined"
      color="#0b3b17"
      prepend-icon="mdi-open-in-new"
      class="view-maintenance-button text-none"
      @click.stop="viewMaintenance"
    >
      Voir maintenance
    </v-btn>
    <BoutonFlecheSuivant
      v-if="!maintenance.isComplete"
      class="maintenance-detail-arrow"
      aria-label="Détail de la maintenance"
      @click.stop="viewMaintenance"
    />
  </div>
</template>

<style scoped lang="scss">
.slot-maintenance-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  padding: 8px 10px 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &:hover {
    background: color-mix(in srgb, var(--maintenance-color) 7%, white);
    border-color: color-mix(in srgb, var(--maintenance-color) 35%, #e2e8f0);
    box-shadow: 0 3px 10px rgba(15, 23, 42, 0.1);
    transform: translateY(-1px);
  }

  &::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 50%;
    width: 4px;
    height: 24px;
    border-radius: 999px;
    background: #cbd5e1;
    transform: translateY(-50%);
    transition: background-color 0.18s ease, height 0.18s ease;
  }

  &:hover::before { height: 34px; background: var(--maintenance-color); }
}

.slot-maintenance-item.is-clickable {
  cursor: pointer;
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

.slot-maintenance-item > div {
  flex: 1;
  min-width: 0;
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
  transition:
    background-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.slot-maintenance-panel:hover {
  background: #dbeafe;
  box-shadow: 0 3px 10px rgba(30, 64, 175, 0.2) !important;
  transform: translateY(-1px);
}

.slot-maintenance-panel:hover :deep(.v-expansion-panel-title) {
  background: #dbeafe;
}

.view-maintenance-button {
  flex-shrink: 0;
  align-self: center;
  margin-left: auto;
}

@media (max-width: 600px) {
  .slot-maintenance-item {
    flex-wrap: wrap;
  }

  .view-maintenance-button {
    margin-left: auto;
  }
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
