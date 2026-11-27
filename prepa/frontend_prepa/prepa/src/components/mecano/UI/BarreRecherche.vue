<script setup>
defineProps({ modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Rechercher…" }, clearable: { type: Boolean, default: true } });
defineEmits(["update:modelValue"]);
</script>
<template>
<v-text-field 
    :model-value="modelValue" 
    :placeholder="placeholder" 
    prepend-inner-icon="mdi-magnify" 
    density="compact" 
    variant="outlined" 
    hide-details 
    :clearable="clearable" 
class="mecano-search" @update:model-value="$emit('update:modelValue', $event)" />

</template>
<style scoped>
.mecano-search { min-width:220px; }
.mecano-search :deep(.v-field) { border-radius:8px; box-shadow:none; }
</style>
