<!-- <script setup>
// Légende du calendrier. Composant visuel : la liste arrive par props,
// il suffit donc d'ajouter une entrée dans Calendrier.vue pour ajouter une ligne ici.
defineProps({
  // [{ label, type?: 'badge' | 'dot' | 'validated', color?, icon? }]
  // 'badge' (par défaut) = pastille colorée avec icône (classification)
  items: { type: Array, required: true },
  title: { type: String, default: "Légende" }
});
</script>

<template>
  <section class="calendar-legend" aria-label="Légende du calendrier">
    <span class="legend-title">{{ title }}</span>

    <ul class="legend-list">
      <li v-for="item in items" :key="item.label" class="legend-item">
        <v-icon
          v-if="!item.type || item.type === 'badge'"
          class="legend-badge"
          :style="{ '--badge-color': item.color }"
        >
          {{ item.icon }}
        </v-icon>
        <span v-else-if="item.type === 'dot'" class="legend-dot"></span>
        <span v-else-if="item.type === 'validated'" class="legend-validated"></span>

        <span class="legend-label">{{ item.label }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.calendar-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 20px;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
}

.legend-title {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: #64748b;
}

.legend-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.legend-label {
  font-size: 0.95rem;
  color: #334155;
}

/* Pastille de classification (même rendu que dans les puces) */
.legend-badge {
  display: inline-flex;
  flex: 0 0 22px;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--badge-color);
  color: #ffffff;
  font-size: 14px;
}

/* Point orange : nouvelle demande non sélectionnée */
.legend-dot {
  display: inline-block;
  flex: 0 0 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #f59e0b;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 3px rgba(120, 53, 15, 0.18);
}

/* Puce verte pâle : étape terminée */
.legend-validated {
  display: inline-block;
  flex: 0 0 24px;
  width: 24px;
  height: 14px;
  border: 1px solid #bcd9bc;
  border-radius: 5px;
  background-color: #f0f8f0;
}
</style> -->