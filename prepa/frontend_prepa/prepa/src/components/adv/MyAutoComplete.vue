<template>
    <v-autocomplete v-model="select" :disabled="isUpdating" :items="items" v-model:search="search"
        style="width: 200px; height: 40px" item-title="article" item-value="article" label="Article" :min-length="3"
        density="compact" clearable hide-no-data hide-details :loading="loading"
        @update:modelValue="handleSelectChange">
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
                <div class="text-grey lighten-1">{{ item.raw.libelle }}</div>
            </v-list-item>
        </template>
    </v-autocomplete>
  </template>
  
  <script>
  export default {
    props: {
      isUpdating: Boolean,
      items: Array,
      search: String,
      select: String,
      loading: Boolean
    },
    methods: {
      handleSelectChange(selection) {
        this.$emit("updateSelect", selection);
      }
    }
  };
  </script>
  