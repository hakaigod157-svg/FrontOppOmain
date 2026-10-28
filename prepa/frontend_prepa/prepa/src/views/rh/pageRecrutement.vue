<template>
  <div class="page-recrutement">
    <TableauRecrutement :recruts="recruts" :loading="store.loading" :headers="headers" @actionDetail="showDetail" />
    <v-dialog v-if="dialogVisibleDetailRecrutement" v-model="dialogVisibleDetailRecrutement" :persistent="true"
      width="1590px" height="605px">
      <DetailRecrutement v-if="selectedRecrut" :recru="selectedRecrut" :etat="selectedRecrut.etat"
        @close="fermerDialog" />
    </v-dialog>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import useSessionTimeout from "@/utils/useSessionTimeout";
import Config from "@/utils/config.js";
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import DetailRecrutement from "./detailRecrutement.vue";
import TableauRecrutement from "@/components/rh/tableauRecrutement.vue";
import { useRecrutement } from "@/store/Rh/rh_recrutement";

export default defineComponent({
  name: "Pagerecrutement",
  components: { TableauRecrutement, DetailRecrutement },
  setup() {
    const store = useRecrutement();
    const recruts = computed(() => store.listrecrut);

    const dialogVisibleDetailRecrutement = ref(false);
    const selectedRecrut = ref(null);


    const headers = [
      { title: "Code recrutement", key: "recru_code", align: "start" },
      { title: "Date recrutement", key: "recru_date", align: "start" },
      { title: "Demande", key: "recru_demande", align: "start" },
      // { title: "Date demande", key: "demande_date", align: "start" },
      { title: "Motif", key: "recru_motif", align: "start" },
      { title: "Contrat", key: "recru_contrat", align: "start" },
      { title: "Departement", key: "recru_departement", align: "start" },
      { title: "Poste", key: "recru_poste", align: "start" },
      { title: "Effectif", key: "recru_effectif", sortable: false, align: "center", },
      { title: "Etat", key: "etat", align: "start" },
    ];

    const headersdetail = [
      { title: "Ligne etape", key: "ligne_etape_etape", align: "start" },
      { title: "Libelle", key: "etape_libelle", align: "start" },
    ];
    const router = useRouter();
    useSessionTimeout(Config.DURRE_SESSION, router);

    const handleShowDetails = () => {
      dialogVisibleDetailRecrutement.value = true;
    };
    const showDetail = (item) => {
      selectedRecrut.value = item; // l'objet sélectionné
      dialogVisibleDetailRecrutement.value = true; // ouvre le dialog
    };
    
    const fermerDialog = () => {
      dialogVisibleDetailRecrutement.value = false;
      store.fetchListRecrut();
    };

    onMounted(() => {
      store.fetchListRecrut();
      //console.log("Liste recruts initialement :", store.listrecrut);
      //console.log("Liste recruts déréférencée :", recruts.value);
    });
    watch(() => {
      store.fetchListRecrut();
      //console.log("Liste recrut après changement d'ét :", store.listrecrut);
      //console.log("Liste recrut après changement d'état :", store.listrecrut);
      //console.log("Liste déréférencée :", recruts.value);
    });
    return {
      store,
      headers,
      recruts,
      handleShowDetails,
      showDetail,
      dialogVisibleDetailRecrutement,
      selectedRecrut,
      fermerDialog,
      headersdetail,
    };
  },
});
</script>

<style>
.actions-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
