<template>
    <v-autocomplete  :disabled="isUpdating" :items="items" 
        style="width: 250px; height: 35px" item-title="client" item-value="client" label="Client" :min-length="3"
        density="compact" clearable hide-no-data  :loading="loading" color="deep-purple-accent-4"
        @update:modelValue="handleSelectChange">
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
                <!-- <div>{{ item.article }}</div> -->
                <div class="text-grey lighten-1">{{ item.raw.clnom1 }}</div>
            </v-list-item>
        </template>
    </v-autocomplete>
  </template>
  
  <script>
  export default {
    props: {
      isUpdating: Boolean,
      items: Array,
      loading: Boolean
    },
    methods: {
      handleSelectChange(selection) {
        this.$emit("updateSelect", selection);
      }
    }

    
  };
  </script>
  