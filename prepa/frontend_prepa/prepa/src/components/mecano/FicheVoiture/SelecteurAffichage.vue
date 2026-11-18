<script setup>
// Sélecteur d'affichage : vue tableau / vue cartes (écran « Fiche voiture »)
defineProps({
  modelValue: { type: String, default: 'table' }, // 'table' | 'grid'
})
defineEmits(['update:modelValue'])

const options = [
  { value: 'table', label: 'Vue tableau' },
  { value: 'grid', label: 'Vue cartes' },
]
</script>

<template>
  <div class="view-toggle" role="group" aria-label="Mode d'affichage">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="view-toggle__option"
      :class="{ 'view-toggle__option--active': modelValue === opt.value }"
      :aria-pressed="modelValue === opt.value"
      :aria-label="opt.label"
      :title="opt.label"
      @click="$emit('update:modelValue', opt.value)"
    >
      <svg v-if="modelValue === opt.value" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path d="m3 8.5 3.2 3.2L13 4.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <svg v-if="opt.value === 'table'" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path d="M2.5 4h11M2.5 8h11M2.5 12h11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
      <svg v-else viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2.5" y="2.5" width="4" height="4" rx="1" />
          <rect x="9.5" y="2.5" width="4" height="4" rx="1" />
          <rect x="2.5" y="9.5" width="4" height="4" rx="1" />
          <rect x="9.5" y="9.5" width="4" height="4" rx="1" />
        </g>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.view-toggle {
  --color-primary: #2e7d32;
  --color-primary-dark: #1b5e20;
  --color-primary-soft: #e8f5e9;
  --color-bg: #ffffff;
  --radius-pill: 999px;
  display: inline-flex;
  height: 32px;
  overflow: hidden;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-pill);
  background: var(--color-bg);
}

.view-toggle__option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 48px;
  padding: 0 14px;
  border: 0;
  background: none;
  color: var(--color-primary-dark);
  cursor: pointer;
}

.view-toggle__option + .view-toggle__option {
  border-left: 1px solid var(--color-primary);
}

.view-toggle__option:hover {
  background: var(--color-primary-soft);
}

.view-toggle__option--active {
  background: var(--color-primary-soft);
}

.view-toggle__option:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -3px;
}
</style>
