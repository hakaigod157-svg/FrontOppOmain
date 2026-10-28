<template >
  <v-data-table-virtual class="blue-header" :headers="headers" :items="items" :fixed-header="true" v-if="!loading"
    :loading="loading" density="compact" hover="true" show-select :no-data-text="'Pas données disponibles'" :items-per-page="-1">

    <template v-slot:[`item.depot_dest`]="{ item }">
      <b>{{ (item.depot_dest) }}</b>
    </template>

    <template v-slot:[`item.empl_dest`]="{ item }">
      <b>{{ (item.empl_dest) }}</b>
    </template>

    <template v-slot:[`item.qte`]="{ item }">
      <b>{{ (item.qte) }}</b>
    </template>

    <template v-slot:item.article="{ item }">
      <template v-if="item.urg && item.urg !== null && item.urg.trim() !== ''">
        <v-chip label color="green" class="fill-cell" variant="flat">{{ item.article }}</v-chip>
      </template>
      <template v-else>
        {{ item.article }}
      </template>
    </template>



  </v-data-table-virtual>
</template>

<script>
import { defineComponent } from 'vue';
import {
  VDataTable,
  VDataTableServer,
  VDataTableVirtual,
} from "vuetify/lib/components";
import { ref, onMounted, onBeforeMount, computed } from 'vue';


export default defineComponent({
  components: {
    VDataTable,
    VDataTableServer,
    VDataTableVirtual,
  },

  props: {
    headers: Object,
    items: Array,
    loading: {
      type: Boolean,
      default: false
    },
  },

  defaults: {
    VDataTable: {
      fixedHeader: true,
      noDataText: 'Pas de resultats',
    },
  },

  setup(props, { emit }) {

    const loading = ref(false);
    const search = ref('');

  }


})


</script>

<style>
/** Manisy barre vertical am tableau */
.v-data-table tr>td:first-child {
  /* border-left: 4px solid #969696; */
  /* border-right: 1px solid #dddddd; */
  /* border-bottom: 2px solid #dddddd; */
  /* background: lightgray */
}

/* .v-data-table tr >td:nth-child(-n+3) {
border-left: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
} */

/* .v-data-table tr > td:nth-last-child(1),
.v-data-table tr > td:nth-last-child(2),
.v-data-table tr > td:nth-last-child(3) {
  border-left: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
} */
.fill-cell {
  display: block;
  width: 100%;
  height: 100%;
  text-align: left;
  color: black !important;
  /* Assurez-vous que la couleur du texte est noire */
}

</style>