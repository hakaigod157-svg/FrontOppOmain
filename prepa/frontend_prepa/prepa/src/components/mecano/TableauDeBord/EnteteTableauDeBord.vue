<script setup>
defineProps({
  brand: { type: String, default: 'OMAIN' },
  user: { type: String, default: 'Invité' },
})
defineEmits(['login'])
</script>

<template>
  <header class="app-header">
    <span class="app-header__brand">{{ brand }}</span>
    <div class="app-header__right">
      <span class="app-header__login">{{ user }}</span>
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36px 0 56px;
}

.app-header__brand {
  font-family: var(--font-display, 'Outfit', system-ui, sans-serif);
  font-size: 20px;
  letter-spacing: 0.04em;
  color: var(--color-primary-dark, #1b5e20);
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-header__login {
  padding: 4px 0;
  border: 0;
  background: none;
  font-family: var(--font-display, 'Outfit', system-ui, sans-serif);
  font-size: 20px;
  color: var(--color-primary-dark, #1b5e20);
  cursor: pointer;
}

.app-header__login:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.app-header__login:focus-visible {
  outline: 2px solid var(--color-primary, #2e7d32);
  outline-offset: 4px;
  border-radius: var(--radius-sm, 8px);
}
</style>
