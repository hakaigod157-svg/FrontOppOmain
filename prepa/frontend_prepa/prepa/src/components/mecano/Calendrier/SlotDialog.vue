<script setup>
// Dialogue "Détail du créneau" (date, plage horaire, maintenances).
// Composant visuel : la date et la plage horaire arrivent déjà formatées.
import MaintenanceDetail from "./MaintenanceDetail.vue";

defineProps({
  modelValue: { type: Boolean, default: false },
  dateLabel: { type: String, default: "" },
  // Ex. "09:00 - 10:00" ; vide quand le dialogue concerne toute la journée
  hourLabel: { type: String, default: "" },
  maintenances: { type: Array, default: () => [] },
  canJumpToDay: { type: Boolean, default: true }
});

// update:modelValue : ouverture/fermeture (v-model) · open-day : bouton "Voir ce jour"
const emit = defineEmits(["update:modelValue", "open-day"]);
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
        <div v-else class="slot-maintenance-list">
          <MaintenanceDetail
            v-for="maintenance in maintenances"
            :key="maintenance.id"
            :maintenance="maintenance"
            variant="dialog"
          />
        </div>
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
</style>
