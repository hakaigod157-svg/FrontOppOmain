<script setup>
defineProps({ color: { type: String, default: "#64748b" }, clickable: Boolean, compact: Boolean });
defineEmits(["click"]);
</script>
<template><article class="mecano-horizontal-card" :class="{ 'is-clickable': clickable, 'mecano-horizontal-card--compact': compact }" :style="{ '--card-color': color }" @click="clickable && $emit('click')"><span class="mecano-horizontal-card__pill" aria-hidden="true"></span><div class="mecano-horizontal-card__content"><slot /></div><slot name="action" /></article></template>
<style scoped>
.mecano-horizontal-card { position:relative; display:flex; align-items:center; gap:10px; min-height:56px; padding:8px 10px 8px 17px; border:1px solid #e2e8f0; border-radius:8px; background:#fff; transition:background .18s ease,border-color .18s ease,box-shadow .18s ease,transform .18s ease; }
.mecano-horizontal-card__pill { position:absolute; left:7px; top:50%; width:4px; height:24px; border-radius:999px; background:#cbd5e1; transform:translateY(-50%); transition:height .18s ease,background .18s ease; }
.mecano-horizontal-card:hover { border-color:color-mix(in srgb,var(--card-color) 35%,#e2e8f0); background:color-mix(in srgb,var(--card-color) 5%,white); box-shadow:0 3px 10px #0f172a12; transform:translateY(-1px); }
.mecano-horizontal-card:hover .mecano-horizontal-card__pill { height:34px; background:var(--card-color); }
.mecano-horizontal-card__content { flex:1; min-width:0; }
.mecano-horizontal-card--compact { min-height:48px; padding:10px 12px 10px 20px; border-radius:7px; }
.is-clickable { cursor:pointer; }
</style>
