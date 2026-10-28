<template>
  <v-card density="compact">
    <v-tabs v-model="tabs" bg-color="#d7ead5" color="deep-purple-accent-4" align-tabs="center" density="compact">
      <v-tab to="/CmdAvalider">Commande à valider
        <v-badge color="#42A5F5" :content="storeEtape.etapes.nb_cmd_Avalide" inline>
        </v-badge>
      </v-tab>
      <v-tab to="/CmdValider">Commande validée
        <v-badge color="#3949AB" :content="storeEtape.etapes.nb_cmd_valide" inline>
        </v-badge>
      </v-tab>

      <!-- <v-tab to="/CmdValider">Commande validée
        <v-badge color="#3949AB" :content="badgeContent" inline>
        </v-badge>
      </v-tab> -->

      <v-tab to="/BonALivrer">ATTENTE PAIEMENT POUR LIVRAISON
        <v-badge color="#004D40" :content="storeEtape.etapes.nb_bon_livre" inline>
        </v-badge>
      </v-tab>

      <v-tab to="/CmdTraite">COMMANDE ATTENTE TRAITE
        <v-badge color="#FFA726" :content="storeEtape.etapes.nb_cmd_traite" inline>
        </v-badge>
      </v-tab>
    </v-tabs>
    <v-spacer></v-spacer>
    <router-view />
  </v-card>
</template>
<!-- :content="storeEtape.etapes.attePrep" -->
<style></style>

<script>
import { defineComponent, onMounted, computed } from 'vue';
import { useEtapeAdv } from "@/store/Adv/etape.js";
export default defineComponent({

  props: {
    storeEtape: Object,
    totalList: Number,
    dateDeb: String,
    dateFin: String,
  },

  setup(props) {
    const storeEtape = useEtapeAdv();

    onMounted(() => {
      fetchEtaps();
    });

    const fetchEtaps = async () => {
      await storeEtape.fetchEtape();
    }

//     const badgeContent = computed(() => {
//   const isToday = props.dateDeb === 'today' && props.dateFin === 'today';
//   return isToday ? storeEtape.etapes.nb_cmd_valide : props.totalList;
// });

    return {
      storeEtape, fetchEtaps,
    }

  }

});
</script>