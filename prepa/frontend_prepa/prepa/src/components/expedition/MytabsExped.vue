<template>
  <v-card density="compact">
    <v-tabs v-model="tabs" bg-color="#d7ead5" color="deep-purple-accent-4" align-tabs="center" density="compact">
      <v-tab v-if="showAttribution_lv" to="/expedition_view">Attribution LV</v-tab>
      <v-tab v-if="ShowLivraison" to="/livraison">PILOTAGE LIVRAISON</v-tab>
      <v-tab v-if="ShowEdition" to="/edition">LIVRAISON</v-tab>
      <v-tab v-if="ShowParams_lv" to="/params_lv">PARAMS LV</v-tab>
      <v-tab v-if="ShowParams_axe" to="/attrib_axe">ATTRIB AXE</v-tab>
      <!-- <v-tab to="">Livraison</v-tab>
        <v-tab to="">Gestion Voiture</v-tab> -->
    </v-tabs>
    <v-spacer></v-spacer>
    <router-view />
  </v-card>
</template>

<style></style>

<script>
import { defineComponent, ref, onMounted } from 'vue';
export default defineComponent({

  setup() {
    const showAttribution_lv = ref(false);
    const ShowLivraison = ref(false);
    const ShowEdition = ref(false);
    const ShowParams_lv = ref(false);
    const ShowParams_axe = ref(false);

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

      showAttribution_lv.value = fetchdroits('expedition_view');
      ShowLivraison.value = fetchdroits('livraison');
      ShowEdition.value = fetchdroits('edition');
      ShowParams_lv.value = fetchdroits('params_lv');
      ShowParams_axe.value = fetchdroits('params_axe');


    });
    return {
      showAttribution_lv, ShowLivraison, ShowEdition, ShowParams_lv,fetchdroits,ShowParams_axe,
    }
  }

});
</script>