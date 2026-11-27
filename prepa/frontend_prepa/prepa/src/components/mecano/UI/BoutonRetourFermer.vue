<script setup>
import BoutonOutline from "./BoutonOutline.vue";
defineProps({ label: { type: String, default: "Retour" }, icon: { type: String, default: "mdi-arrow-left" }, density: { type: String, default: "" } });
defineEmits(["click"]);
</script>
<template><BoutonOutline :label="label" :icon="icon" :density="density" @click="$emit('click')" /></template>
