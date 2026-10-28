<template >
  <v-card density="compact">
    <v-tabs bg-color="#d7ead5" color="deep-purple-accent-4" align-tabs="center" density="compact">
      <v-tab v-if="showRotaion" to="/Rotation" :disabled="combinedLoading">ROTATION</v-tab>
      <v-tab v-if="showIncomplet" to='/ColisIncomplet' :disabled="combinedLoading">COLIS INCOMPLET</v-tab>
      <v-tab v-if="showPetit" to="/PetitColis" :disabled="combinedLoading">PETIT COLIS</v-tab>
      <v-tab v-if="showRangement" to="/Rangement" :disabled="combinedLoading">RANGEMENT</v-tab>
      <v-tab v-if="showConseilReappro" to="/ConseilReappro" :disabled="combinedLoading">CONSEIL RéAPPRO</v-tab>
      <v-tab v-if="showSuiviTD" to="/SuiviTD" :disabled="combinedLoading">Suivi Transfert</v-tab>
      <v-tab v-if="showTransEmplLot" to="/TransEmplLot" :disabled="combinedLoading">TRANS INTER-EMPL LOTS </v-tab>
    </v-tabs>
    <!-- <v-spacer></v-spacer> -->
    <router-view />
  </v-card>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { defineComponent } from "vue";
import { useRotationStore } from "@/store/Transfert/rotation.js";
import { useIncompletStore } from "@/store/Transfert/incomplet.js";
import { usePetitStore } from "@/store/Transfert/petit.js";
import { useRangementStore } from "@/store/Transfert/rangement.js";

export default defineComponent({

  components: {

  },

  methods: {
  },

  setup() {
    const storeRotation = useRotationStore();
    const storeIncomplet = useIncompletStore();
    const storePetit = usePetitStore();
    const storeRangement = useRangementStore();
    const showRotaion = ref(false);
    const showIncomplet = ref(false);
    const showPetit = ref(false);
    const showRangement = ref(false);
    const showConseilReappro = ref(false);
    const showSuiviTD = ref(false);
    const showTransEmplLot = ref(false);



    const loading = computed(() => storeRotation.loading);
    const loading_incomplet = computed(() => storeIncomplet.loading);
    const loading_petitcolis = computed(() => storePetit.loading);
    const loading_rangement = computed(() => storeRangement.loading);

    const combinedLoading = computed(() => loading.value || loading_incomplet.value || loading_petitcolis.value || loading_rangement.value);

    const fetchdroits = (nameTable) => {
      const lstDroit = localStorage.getItem('listeDroits');
      if (lstDroit) {
        const droits = JSON.parse(lstDroit);
        const element = droits.find((item) => item.descAcces === nameTable);
        if (element) {
          return element.write === 1 ? true : false;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    onMounted(() => {

      showRotaion.value = fetchdroits('Rotation');
      showIncomplet.value = fetchdroits('ColisIncomplet');
      showPetit.value = fetchdroits('PetitColis');
      showRangement.value = fetchdroits('Rangement');
      showConseilReappro.value = fetchdroits('ConseilReappro');
      showSuiviTD.value = fetchdroits('SuiviTD');
      //showTransEmplLot.value = fetchdroits('TransEmplLot');



    });

    return {
      loading, loading_incomplet, fetchdroits,
      combinedLoading, showRotaion, showIncomplet, showPetit, showRangement, showConseilReappro, showSuiviTD,showTransEmplLot
    };
  }


})
</script>