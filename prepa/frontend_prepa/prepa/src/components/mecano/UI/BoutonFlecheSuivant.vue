<script setup>
defineProps({ label: { type: String, default: "" }, ariaLabel: { type: String, default: "Continuer" }, disabled: Boolean });
defineEmits(["click"]);
</script>
<template><button type="button" class="mecano-arrow" :aria-label="ariaLabel" :disabled="disabled" @click="$emit('click')"><span v-if="label">{{ label }}</span><span class="mecano-arrow__square"><v-icon size="20" color="#0b3b17">mdi-arrow-right</v-icon></span></button></template>
<style scoped>
.mecano-arrow { display:inline-flex; align-items:center; gap:10px; padding:0; border:0; color:#0b3b17; background:transparent; font:inherit; cursor:pointer; }
.mecano-arrow__square { display:grid; place-items:center; width:48px; height:48px; padding:12px; border:1px solid rgba(255,255,255,.72); border-radius:3px; background:#d1f003; box-shadow:0 4px 14px rgba(22,96,48,.18); transition:background .2s ease; }
.mecano-arrow:hover .mecano-arrow__square { background:#c8e6c9; }
.mecano-arrow:disabled { opacity:.45; cursor:not-allowed; }
</style>
