<script setup>
defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: "" },
  native: Boolean,
  variant: { type: String, default: "elevated" },
  density: { type: String, default: "compact" },
  color: { type: String, default: "#144f0e" },
});
defineEmits(["click"]);
</script>
<template>
  <button v-if="native" type="button" @click="$emit('click')">{{ label }}</button>
  <v-btn v-else :variant="variant" :density="density" :color="color" :prepend-icon="icon || undefined" @click="$emit('click')">{{ label }}</v-btn>
</template>
