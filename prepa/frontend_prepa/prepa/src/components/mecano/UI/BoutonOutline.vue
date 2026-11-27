<script setup>
defineProps({ label: { type: String, required: true }, icon: { type: String, default: "" }, disabled: Boolean, density: { type: String, default: "" } });
defineEmits(["click"]);
</script>
<template>
  <v-btn variant="outlined" size="small" color="#0b3b17" :density="density || undefined" :disabled="disabled" @click="$emit('click')">
    <v-icon v-if="icon" start size="18">{{ icon }}</v-icon>{{ label }}
  </v-btn>
</template>
