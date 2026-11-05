<script setup>
defineProps({
  // [{ label, type?: 'badge' | 'swatch' | 'status' | 'dot' | 'validated', color?, textColor?, icon? }]
  items: { type: Array, required: true },
  title: { type: String, default: "Repères" },
  label: { type: String, default: "Légende" }
});
</script>

<template>
  <section class="calendar-legend" :aria-label="label">
    <span class="legend-title">{{ title }}</span>
    <ul class="legend-list">
      <li v-for="item in items" :key="item.label" class="legend-item">
        <span
          v-if="item.type === 'swatch'"
          class="legend-swatch"
          :style="{ '--swatch-color': item.color }"
        ></span>
        <span
          v-else-if="item.type === 'status'"
          class="legend-status"
          :style="{ '--status-bg': item.color, '--status-fg': item.textColor || '#334155' }"
        ></span>
        <v-icon
          v-else-if="!item.type || item.type === 'badge'"
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
  gap: 6px 16px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: #fafafa;
}

.legend-title {
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 600;
}

.legend-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-label {
  color: #475569;
  font-size: 0.78rem;
}

.legend-swatch,
.legend-status {
  display: inline-block;
  flex: 0 0 16px;
  width: 16px;
  height: 12px;
  border-radius: 3px;
}

.legend-swatch {
  background-color: var(--swatch-color);
}

.legend-status {
  background-color: var(--status-bg);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--status-fg) 12%, transparent);
}

.legend-badge {
  display: inline-flex;
  flex: 0 0 18px;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--badge-color);
  color: #ffffff;
  font-size: 12px;
}

.legend-dot {
  display: inline-block;
  flex: 0 0 9px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #f59e0b;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 3px rgba(120, 53, 15, 0.18);
}

.legend-validated {
  display: inline-block;
  flex: 0 0 18px;
  width: 18px;
  height: 12px;
  border: 1px solid #bcd9bc;
  border-radius: 4px;
  background-color: #f0f8f0;
}
</style>
