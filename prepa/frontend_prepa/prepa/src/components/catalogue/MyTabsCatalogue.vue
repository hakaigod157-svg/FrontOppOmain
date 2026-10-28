<template>
  <v-card density="compact">
    <v-tabs v-model="tabs" bg-color="#d7ead5" color="deep-purple-accent-4" align-tabs="center" density="compact">
      <v-tab v-if="showTabCatalogue" to="/catalogue_view">Distribution Catalogue</v-tab>
      <v-tab v-if="showTabCodeBarre" to="/codeBarre_view">Génération Code Barre</v-tab>
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
    const showTabCodeBarre = ref(false);
    const showTabCatalogue = ref(false);

    onMounted(() => {
      showTabCodeBarre.value = fetchdroits('codeBarre_view');
      showTabCatalogue.value = fetchdroits('catalogue_view');
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
      showTabCodeBarre,showTabCatalogue,
      fetchdroits,
    }
  }

});
</script>