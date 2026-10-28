<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">
      <v-spacer></v-spacer>
      <v-text-field v-model="searchTerm" prepend-inner-icon="mdi-magnify" density="compact" label="Rechercher" flat
        hide-details variant="solo-filled" />
    </v-card-title>

    <v-divider></v-divider>

    <!-- <v-data-table class="blue-header" :headers="headers" :items="filteredItems" density="compact" hover
      no-data-text="Pas de données disponibles" :fixed-header="true" :items-per-page="-1" :height="250"
      item-value="clcode" select-strategy="single" show-select v-model="internalSelected" hide-default-footer /> -->

    <v-data-table class="blue-header" :headers="headers" :items="filteredItems" density="compact" hover
      no-data-text="Pas de données disponibles" :fixed-header="true" :height="250" item-value="seq"
      select-strategy="single" show-select v-model="internalSelected" @update:items-per-page="logItem" />
  </v-card>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue';
import { VDataTable } from 'vuetify/lib/components';

export default defineComponent({
  components: {
    VDataTable,
  },

  props: {
    headers: Array,
    items: Array,
    modelValue: null, // For v-model to track selected value
    search: {
      type: String,
      default: '',
    },
  },

  setup(props, { emit }) {
    const searchTerm = ref(props.search.toLowerCase());
    const internalSelected = ref(props.modelValue); // Track the selected item

    // Emit the selected object (entire item) to the parent whenever it changes
    watch(internalSelected, (newVal) => {
      if (newVal && newVal.length > 0) {
        const selectedItem = props.items.find(item => item.seq === newVal[0]); // Sélectionner l'objet entier basé sur seq
        emit('update:modelValue', selectedItem);
      }
    });

    // Filter items based on search input
    const filteredItems = computed(() => {
      if (!props.items || !Array.isArray(props.items)) {
        return []; // If no items, return empty array
      }

      const searchRegex = new RegExp(searchTerm.value, 'i'); // Case-insensitive search
      return props.items.filter(item =>
        Object.values(item).some(value =>
          value !== null && value !== undefined && searchRegex.test(value.toString())
        )
      );
    });

    return {
      filteredItems,
      searchTerm,
      internalSelected,
    };
  },
});
</script>

<style>
.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
  background-color: #b8b3cc;
  white-space: nowrap;
}
</style>
