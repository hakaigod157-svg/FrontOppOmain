<script setup>
import { computed } from "vue";
import MaintenanceDetail from "./MaintenanceDetail.vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  dateLabel: { type: String, default: "" },
  hourLabel: { type: String, default: "" },
  maintenances: { type: Array, default: () => [] },
  canJumpToDay: { type: Boolean, default: true }
});

const maintenancesEnCours = computed(() =>
  props.maintenances.filter((m) => !m.isComplete)
);
const maintenancesTerminees = computed(() =>
  props.maintenances.filter((m) => m.isComplete)
);

// update:modelValue : ouverture/fermeture (v-model) · open-day : bouton "Voir ce jour"
const emit = defineEmits(["update:modelValue", "open-day", "open-maintenance"]);
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="slot-dialog-card">
      <v-card-item class="bg-primary-lighten-5 py-3">
        <template #prepend>
          <v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>
        </template>
        <v-card-title class="text-subtitle-1 font-weight-bold">
          Détail du créneau
        </v-card-title>
      </v-card-item>

      <v-card-text class="pt-4">
        <div class="mb-3">
          <div class="text-caption text-medium-emphasis">Date sélectionnée</div>
          <div class="text-body-1 font-weight-bold text-capitalize">
            {{ dateLabel }}
          </div>
        </div>

        <div v-if="hourLabel" class="mb-4">
          <div class="text-caption text-medium-emphasis">Plage horaire</div>
          <div class="text-body-1 font-weight-bold">
            {{ hourLabel }}
          </div>
        </div>

        <v-alert
          v-if="!maintenances.length"
          type="info"
          variant="tonal"
          density="compact"
          icon="mdi-calendar-blank-outline"
          class="mb-2"
        >
          <strong>Aucune maintenance planifiée.</strong>
          <div class="text-caption">
            Ce créneau est actuellement libre dans le calendrier de l'atelier.
          </div>
        </v-alert>

        <template v-else>
          <!-- En cours -->
          <div v-if="maintenancesEnCours.length" class="mb-4">
            <div class="slot-section-title">
              <!-- <v-icon size="16" color="primary" class="mr-1">mdi-progress-wrench</v-icon> -->
              En cours
              <v-chip size="x-small" color="primary" variant="tonal" class="ml-2">
                {{ maintenancesEnCours.length }}
              </v-chip>
            </div>
            <div class="slot-maintenance-list">
              <MaintenanceDetail
                v-for="maintenance in maintenancesEnCours"
                :key="maintenance.id"
                :maintenance="maintenance"
                variant="dialog"
                @view-maintenance="emit('open-maintenance', $event)"
              />
            </div>
          </div>

          <!-- Terminées -->
          <div v-if="maintenancesTerminees.length">
            <div class="slot-section-title slot-section-title--done">
              <!-- <v-icon size="16" color="success" class="mr-1">mdi-check-circle-outline</v-icon> -->
              Terminées
              <v-chip size="x-small" color="success" variant="tonal" class="ml-2">
                {{ maintenancesTerminees.length }}
              </v-chip>
            </div>
            <div class="slot-maintenance-list">
              <MaintenanceDetail
                v-for="maintenance in maintenancesTerminees"
                :key="maintenance.id"
                :maintenance="maintenance"
                variant="dialog"
                @view-maintenance="emit('open-maintenance', $event)"
              />
            </div>
          </div>
        </template>
      </v-card-text>

      <v-card-actions class="pa-3 justify-end ga-2">
        <v-btn
          v-if="canJumpToDay"
          variant="tonal"
          color="primary"
          size="small"
          prepend-icon="mdi-calendar-day"
          @click="emit('open-day')"
        >
          Voir ce jour
        </v-btn>
        <v-btn
          variant="plain"
          size="small"
          @click="emit('update:modelValue', false)"
        >
          Fermer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.slot-dialog-card {
  border-radius: 12px;
}

/* Le dialogue est affiché hors de la page : on réapplique ici les tailles lisibles. */
.slot-dialog-card :deep(.text-caption) {
  font-size: 0.9rem !important;
}

.slot-dialog-card :deep(.text-body-1),
.slot-dialog-card :deep(.text-subtitle-1) {
  font-size: 1.15rem !important;
}

.slot-maintenance-list {
  display: grid;
  gap: 6px;
}

.slot-section-title {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #1e40af;
}

.slot-section-title--done {
  color: #166534;
}
</style>
