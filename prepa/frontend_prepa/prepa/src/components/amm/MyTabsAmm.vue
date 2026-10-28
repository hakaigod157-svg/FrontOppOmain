<template>
  <v-card density="compact">
    <v-tabs v-model="tabs" bg-color="#d7ead5" color="deep-purple-accent-4" align-tabs="center" density="compact">
      <v-tab v-if="showTabAffaireView" to="/affaire_view">DOSSIER AMM</v-tab>
      <v-tab v-if="showTabfabricant" to="/fabricant">FABRICANT</v-tab>
      <v-tab v-if="showTabGestion" to="/gestion">GESTION DOSSIER</v-tab>
      <!-- <v-tab v-if="showTabGestion" to="/gestion">GESTION DOSSIER</v-tab> -->
      <v-tab v-if="showTabRenouveller" to="/renouveller">AMM A RENOUVELER</v-tab>
      <v-tab v-if="showTabMidac" to="/midac">LISTE MIDAC</v-tab>   
      <v-tab v-if="showTabAbrogation" to="/abbrogation">ABROGATION</v-tab>   
    </v-tabs>
    <v-spacer></v-spacer>
    <router-view />
  </v-card>
</template>

<style></style>

<script>
import { ref, onMounted, onBeforeMount, computed, defineComponent } from 'vue';
export default defineComponent({

  setup() {
    const showTabAffaireView = ref(false);
    const showTabfabricant = ref(false);
    const showTabGestion = ref(false);
    const showTabRenouveller = ref(false);
    const showTabMidac = ref(false);
    const showTabAbrogation = ref(false);


    onMounted(() => {
      showTabAffaireView.value = fetchdroits('affaire_view');
      showTabfabricant.value = fetchdroits('fabricant');
      showTabGestion.value = fetchdroits('gestion');
      showTabRenouveller.value = fetchdroits('renouveller');
      showTabMidac.value = fetchdroits('midac');
      showTabAbrogation.value = fetchdroits('abrogation');

      // console.log(showTabGestion.value)

    })


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


    return {
      showTabAffaireView, showTabfabricant, showTabGestion, showTabRenouveller,showTabMidac,showTabAbrogation,
      fetchdroits,
    }

  }

});
</script>