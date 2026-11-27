<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], default: '—' },
  layout: {
    type: String,
    default: 'stacked',
    validator: (v) => ['stacked', 'footer'].includes(v),
  },
  bar: Boolean,
  clickable: Boolean,
})
</script>

<template>
  <component
    :is="clickable ? 'button' : 'section'"
    :type="clickable ? 'button' : undefined"
    class="stat-card"
    :class="[
      `stat-card--${layout}`,
      { 'stat-card--bar': bar, 'stat-card--clickable': clickable },
    ]"
  >
    <div v-if="layout === 'footer'" class="stat-card__body">
      <slot />
    </div>

    <template v-if="layout === 'stacked'">
      <p class="stat-card__value">{{ value }}</p>
      <p class="stat-card__label">{{ label }}</p>
    </template>

    <div v-else class="stat-card__footer">
      <span class="stat-card__label">{{ label }}</span>
      <span class="stat-card__value">{{ value }}</span>
    </div>
  </component>
</template>

<style scoped>
.stat-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: inherit;
  font: inherit;
  text-align: left;
}

.stat-card--stacked {
  justify-content: space-between;
  padding: 24px 20px 22px;
}

.stat-card__value,
.stat-card__label {
  margin: 0;
}

.stat-card__value {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
}

.stat-card__label {
  font-size: 13px;
  font-weight: 700;
}

.stat-card__body {
  flex: 1;
  min-height: 0;
  padding: var(--space-2);
}

.stat-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 20px 20px 40px;
}

.stat-card--bar .stat-card__footer {
  align-items: center;
  min-height: 58px;
  margin: 5px;
  padding: 0 24px 0 34px;
  border-radius: var(--radius-sm, 8px);
  background: var(--color-surface-strong);
}

.stat-card--clickable {
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.stat-card--clickable:hover {
  border-color: var(--color-primary);
}

.stat-card--clickable:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
