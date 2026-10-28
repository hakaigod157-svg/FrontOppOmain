<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">


      <v-spacer></v-spacer>

      <v-text-field v-model="searchTerm" prepend-inner-icon="mdi-magnify" density="compact" label="Rechercher" flat
        hide-details variant="solo-filled"></v-text-field>
    </v-card-title>
    <v-divider></v-divider>

    <v-data-table class="code-header" :headers="headers" :items="filteredItems" density="compact" hover="true"
      no-data-text="Pas de données disponibles" :fixed-header="true" :items-per-page="500" height="480"
      :row-props="rowColor">


      <template v-slot:[`item.calldate`]="{ item }">
        {{ formatDateTime(item.calldate) }}
      </template>

      <template v-slot:[`item.calldate_sortant`]="{ item }">
        {{ formatDateTime(item.calldate_sortant) }}
      </template>



    </v-data-table>
    <!-- <v-card density="compact" class="bg-grey-lighten-3">
      <v-card-text density="compact" class="pa-1">
        <b density="compact"> {{ totalArticles }}</b> Lignes Trouvées </v-card-text>
    </v-card> -->
  </v-card>
</template>
<script>
import { defineComponent, ref, computed } from 'vue';
import { VDataTable } from "vuetify/lib/components";
import dayjs from 'dayjs';

export default defineComponent({
  components: {
    VDataTable,
  },

  emits: ['action1Item', 'action2Item', 'action3Item', 'action4Item', 'action5Item', 'action6Item'],

  props: {
    headers: Object,
    items: Array,
    action1: String,
    action2: String,
    action4: String,
    action5: String,

    search: {
      type: String,
      default: '',
    },

    headerColor: {
      String,
      default: 'blue'
    },

    count: {
      type: Number,
      required: true
    },

    listAppelEntrant: {
      type: Function,
      required: true,
    },

    countRappel: {
      type: Number,
      required: true
    },

    countAttente: {
      type: Number,
      required: true
    },

  },

  setup(props, { emit }) {

    const searchTerm = ref(props.search.toLowerCase());
    const isUrgApreClicked = ref(false);
    const showRappel = ref(false);
    const showWaitAction = ref(false);
    const filteredCount = ref(0);
    const filter = ref(props.items);

    const filteredItems = computed(() => {
      const searchRegex = new RegExp(searchTerm.value, 'i'); // 'i' for case-insensitive
      return props.items.filter(item => {
        // If the button has been clicked, only show items with couleur === 1
        if (isUrgApreClicked.value) {
          return item.couleur === 1 && Object.values(item).some(value => value !== null && value !== undefined && searchRegex.test(value.toString()));
        }
        else if (showRappel.value) {
          return item.rappel === 1 && Object.values(item).some(value => value !== null && value !== undefined && searchRegex.test(value.toString()));
        }
        else if (showWaitAction.value) {
          return item.etat === 0 && Object.values(item).some(value => value !== null && value !== undefined && searchRegex.test(value.toString()));
        }
        // Otherwise, show all items
        return Object.values(item).some(value => value !== null && value !== undefined && searchRegex.test(value.toString()));
      });
    });




    const action1PItem = (item) => {
      emit('action1Item', item);
    };

    const action2PItem = (item) => {
      emit('action2Item', item);
    };

    const action3PItem = (item) => {
      emit('action3Item', item);
    };

    const action4PItem = (item) => {
      emit('action4Item', item);
    };

    const action5PItem = (item) => {
      emit('action5Item', item);
    };

    const action6PItem = (item) => {
      emit('action6Item', item);
    };

    const formatDateTime = (date) => {
      if (date !== null && date !== '') {
        return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
      } else {
        return '';
      }

    };

    const formatNumero = (numero) => {
      if (numero && numero.length === 10) {
        return numero.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, '$1 $2 $3 $4');
      }
      return numero;
    };

    const rowColor = computed(() => (item) => {
      if (item.item.couleur == 1) {
        return { class: 'couleur' };

      } else if (item.item.rappel == 1) {
        return { class: 'rappel' };
      } else {
        return { class: 'default' };
      }
    });

    const totalArticles = computed(() => {
      return props.items.length;
    });

    return {
      action1PItem, action2PItem, action3PItem, action4PItem, action5PItem, action6PItem,
      filteredItems, searchTerm, formatDateTime, formatNumero, rowColor, isUrgApreClicked, showRappel, showWaitAction,
      filteredCount, filter,totalArticles,

    }
  }
})
</script>
<style>
/* .v-data-table.code-header .v-table__wrapper>table>thead>tr th,
.v-data-table.code-header .v-table__wrapper>table tbody>tr th {
  background-color: #b8b3cc;
  white-space: nowrap;
  
} */

.code-header thead th {
  background-color: #b8b3cc !important;
  white-space: nowrap;
}

/* Taille texte */
.v-data-table.code-header .v-table__wrapper table tbody td {
  font-size: 16px;
  
}

/* .v-data-table.code-header .v-table__wrapper table thead th {
  font-size: 17px;
  font-weight: bold;
} */



.couleur {
  background-color: #EF9A9A;
}

.rappel {
  background-color: #80CBC4;
}

.default {
  background-color: #FFFFFF;
}


.button-spacing {
  margin-right: 10px;
  /* Espace entre les boutons */
}
</style>
