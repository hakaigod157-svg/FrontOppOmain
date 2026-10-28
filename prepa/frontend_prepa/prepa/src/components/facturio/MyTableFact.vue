<template>
  <v-card flat>
    <v-card-title class="d-flex align-center pe-2">

      <!-- <v-chip color="#EF9A9A" variant="flat"><b>2EME RAPPEL EXISTE</b></v-chip> -->

      <v-btn size="x-small" class="mr-2" style="background-color: #EF9A9A;" variant="tonal" @click="onSee">
        DÉJÀ RAPPELÉ
        <v-badge :content="count" color="#5D4037" inline class="large"></v-badge>
      </v-btn>

      <v-btn size="x-small" class="mr-2" style="background-color: #80CBC4;" variant="tonal" @click="onRappel">
        A RAPPELER
        <v-badge :content="countRappel" color="#5D4037" inline class="large"></v-badge>
      </v-btn>

      <v-btn size="x-small" style="background-color: #DCE775;" variant="tonal" @click="onWait">
        ATTENTE ACTION
        <v-badge :content="countAttente" color="#5D4037" inline class="large"></v-badge>
      </v-btn>





      <v-spacer></v-spacer>

      <v-text-field v-model="searchTerm" prepend-inner-icon="mdi-magnify" density="compact" label="Rechercher" flat
        hide-details variant="solo-filled"></v-text-field>
    </v-card-title>

    <v-divider></v-divider>

    <!-- <v-data-table class="blue-header" :headers="headers" :items="filteredItems" density="compact" hover="true"
      no-data-text="Pas de données disponibles" :fixed-header="true" :items-per-page="-1" :height="600"
      hide-default-footer> -->

    <v-data-table class="blue-header" :headers="headers" :items="filteredItems" density="compact" hover="true"
      no-data-text="Pas de données disponibles" :fixed-header="true" :items-per-page="100" :height="600"
      :row-props="rowColor"
      >



      <template v-slot:item.depuis="{ item }">
        <template v-if="item.depuis === 0">
        </template>
        <template v-else>
          {{ item.depuis }}
        </template>
      </template>

      <template v-slot:item.date="{ item }">
        <span>{{ formatNumero(item.date) }}</span>
      </template>



      <!-- <template v-slot:['header.statut']>
            STATUS <v-chip color="#B71C1C" variant="flat"><b>2EME RAPPEL EXISTE</b></v-chip>
        </template> -->

      <template v-slot:item.action="{ item }">

        <template v-if="item.etat > 0">
          <!-- <v-btn size="x-small" disabled @click="action1PItem(item)">
            {{ action1 }}
          </v-btn> -->
        </template>

        <template v-else>
          <v-btn size="x-small" color="#FFE0B2" @click="action1PItem(item)">
            {{ action1 }}
          </v-btn>
        </template>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-row align="left" class="d-flex justify-start" density="compact">
          <v-col cols="auto">
            <v-btn size="x-small" color="#FFE0B2" @click="action2PItem(item)">
              {{ action2 }}
            </v-btn>
          </v-col>
        </v-row>
      </template>

      <template v-slot:[`item.calldate`]="{ item }">
        {{ formatDateTime(item.calldate) }}
      </template>

      <template v-slot:[`item.calldate_sortant`]="{ item }">
        {{ formatDateTime(item.calldate_sortant) }}
      </template>


      <template v-slot:item.add="{ item }">
        <template v-if="item.client === null">
          <v-btn size="large" dark variant="text" icon @click="action3PItem(item)">
            <v-icon color="blue">mdi-plus-circle</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn size="large" dark variant="text" icon @click="action6PItem(item)">
            <v-icon color="error">mdi-minus-circle</v-icon>
          </v-btn>
        </template>
      </template>

      <!-- Action 1er rappel -->
      <template v-slot:item.rappel1="{ item }">
        <template v-if="item.visible_btn === 1">
          <v-btn size="x-small" color="#E0F2F1" @click="action4PItem(item)">
            {{ action4 }}
          </v-btn>
        </template>
        <template v-else>
          <div v-if="item.daterappel_1">
            <p style="display: flex; justify-content: center;">{{ formatDateTime(item.daterappel_1) }}</p>
            <div v-if="item.poste_rap1" style="display: flex; justify-content: center;">
              <b>({{ item.poste_rap1 }})</b>
            </div>
          </div>
        </template>
      </template>
      <!--  -->

      <!-- Action 2eme rappel -->
      <template v-slot:item.rappel2="{ item }">
        <template v-if="item.visible_btn === 2">
          <v-btn size="x-small" color="#FFE0B2" @click="action5PItem(item)">
            {{ action5 }}
          </v-btn>
        </template>
        <template v-else-if="item.etat">
          <p style="display: flex; justify-content: center;">{{ formatDateTime(item.daterappel_2) }}</p>
          <div v-if="item.poste_rap2" style="display: flex; justify-content: center;">
            <b>({{ item.poste_rap2 }})</b>
          </div>
        </template>
        <template v-else>
        </template>
      </template>
      <!--  -->
      <!-- {{ formatDateTime(item.daterappel_2) }} -->

      <template v-slot:[`item.action_first`]="{ item }">
        <v-radio></v-radio>
      </template>

      <template v-slot:[`item.select_sortant`]="{ item }">
        <v-select></v-select>
      </template>

      <template v-slot:[`item.statut`]="{ item }">
        <div>
          <!-- <v-chip v-if="item.couleur == 1" color="black">
      <b>{{ item.statut }}</b>
    </v-chip>
    <template v-else> -->
          <b>{{ item.statut }}</b>
          <!-- </template> -->
        </div>
      </template>

    </v-data-table>
  </v-card>
</template>
<script>
import { defineComponent, ref, computed } from 'vue';
import { VDataTable } from "vuetify/lib/components";;
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
        return {class: 'default'};
      }
    });


    const onSee = () => {

      // console.log('valeur count :' +props.count )
      isUrgApreClicked.value = !isUrgApreClicked.value;

      if (isUrgApreClicked.value) {
        filter.value = props.items.filter(item => item.couleur === 1); // Applique le filtre si activé
        // filteredCount.value = filter.value.length; // Met à jour le nombre d'éléments filtrés
      } else {
        // filteredCount.value = filter.value.length; // Met à jour le nombre d'éléments filtrés
      }
    };


    const onRappel = () => {
      showRappel.value = !showRappel.value

      if (showRappel.value) {
        filter.value = props.items.filter(item => item.rappel === 1);
      } else {

      }
    }

    const onWait = () => {
      showWaitAction.value = !showWaitAction.value

      if (showWaitAction.value) {
        filter.value = props.items.filter(item => item.etat === 0);
      } else {

      }
    }



    return {
      action1PItem, action2PItem, action3PItem, action4PItem, action5PItem, action6PItem,
      filteredItems, searchTerm, formatDateTime, formatNumero, rowColor, isUrgApreClicked, showRappel,showWaitAction,
      onSee, onRappel, onWait, filteredCount, filter,

    }
  }
})
</script>
<style>
.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
  background-color: #b8b3cc;
  white-space: nowrap;
}


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
