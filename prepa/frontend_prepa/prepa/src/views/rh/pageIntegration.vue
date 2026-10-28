<template>
  <v-row align="center" justify="start" class="px-3" no-gutters style="padding-top: 0px;">

    <!-- Recherche -->
    <v-col cols="12" md="2">
      <v-text-field v-model="recherche" clearable label="Rechercher" variant="underlined" density="compact"
        hide-details />
    </v-col>

    <!-- Tableau -->
    <v-col cols="12">
      <div class="table-scroll1">
        <!-- <v-progress-linear v-if="store.loading" color="#263238" rounded indeterminate height="2" /> -->

        <TableauIntegration :integrations="integrations" :items="listFiltree" :loading="store.loading"
          :headers="headersIntegration" @actionDetail="showDetail" />

        <v-dialog v-if="dialogVisibleDetailIntegration" v-model="dialogVisibleDetailIntegration" :persistent="true"
          width="1590px" height="755px">

          <DetailIntegration v-if="selectedIntegr" :recru="selectedIntegr"
            @close="fermerDialog" />
        </v-dialog>
      </div>
    </v-col>

  </v-row>
</template>




<script>
import { useRouter } from "vue-router";
import useSessionTimeout from "@/utils/useSessionTimeout";
import Config from "@/utils/config.js";
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import TableauIntegration from "@/components/rh/tableauIntegration.vue";
import { useEmployeeStore } from "@/store/Rh/rh_employee";
import { useDemande } from "@/store/Rh/rh_demande";

import DetailIntegration from "./detailIntegration.vue";

export default defineComponent({
  name: "PageCVglobal",
  components: { TableauIntegration ,DetailIntegration },
  setup() {
    const store = useEmployeeStore();
    const stored = useDemande();
    const cvs = computed(() => store.listcv);
    const dialogVisibleCV = ref(false);
    const cvModif = ref([]);
    const defaultCode = ref("");
    const prefixe = "CV";
    const table = "RH_CV";

    const recherche = ref('')

    const headersIntegration = [
      { title: "MATRICULE", align: "start", key: "empl_matricule", sortable: false },
      { title: "NOM", align: "start", key: "empl_nom", sortable: false },
      { title: "PRENOM", align: "start", key: "empl_prenom", sortable: false },
      { title: "DATE DE NAISSANCE", align: "center", key: "empl_date_naiss", sortable: false },
      { title: "DEPARTEMENT", align: "start", key: "lib_dep", sortable: false },
      { title: "POSTE", align: "start", key: "poste_libelle", sortable: false },
      { title: "PRISE DE FONCTION", align: "center", key: "empl_prise_fonction", sortable: false },
      { title: "CONTRAT", align: "center", key: "empl_contrat", sortable: false },
      { title: "DATE FIN D'ESSAI", align: "center", key: "empl_date_fin_essai1", sortable: false },
      // { title: "DATE FIN D'ESSAI 2", align: "center", key: "empl_date_fin_essai2", sortable: false },
      // { title: "ETAT", align: "start", key: "empl_etat", sortable: false },
    ];

    const router = useRouter();
    useSessionTimeout(Config.DURRE_SESSION, router);

    const list = ref([]);
    const integrations = computed(() => store.listIntegrations);

    const listIntegration = async () => {
      await store.fetchListIntegration();
      list.value = store.listIntegrations;
    };

    onMounted(async () => {
      await listIntegration();
    });

    watch(() => {

    });

    async function opencv() {
      cvModif.value = null;
      await stored.fetchCodeNouveau(prefixe, table);
      defaultCode.value = stored.nouveaucode || "";

      dialogVisibleCV.value = true; // ouvre le dialog

      // console.log(defaultCode.value);
      // console.log(dialogVisibleCV.value);

      // console.log("Bouton cv clique!");
    }

    const fermerformcv = () => {
      dialogVisibleCV.value = false; // ouvre le dialog
      cvModif.value = null;
      // console.log(dialogVisibleCV.value);
      // console.log("Bouton annuler cv  clique!");
    };

    async function handleSaved(newDemande) {
      try {
        if (!cvModif.value) {
          // Appelle la bonne méthode du store
          await store.insertCVglobal(newDemande);
          store.fetchListCvGlobal();
        } else {
          await store.updateCv(newDemande);
          store.fetchListCvGlobal();
          // console.log("Modification en cours!");
        }
      } catch (err) {
        console.error("Erreur lors de l'ajout :", err);
      }
      dialogVisibleCV.value = false;
    }
    function modifierCv(cvItem) {
      try {
        cvModif.value = cvItem;
        dialogVisibleCV.value = true; // ← ouvre le formulaire
        console.log("Ligne cv à modifier : ", cvModif.value);
      } catch (err) {
        console.error("Erreur lors de la mise à jour de la sélection :", err);
      }
    }

    const listFiltree = computed(() => {
      let resultat = [...list.value];

      // Filtre texte libre
      if (recherche.value && recherche.value.trim() !== "") {
        const terme = recherche.value.toLowerCase().trim();

        resultat = resultat.filter((item) =>
          Object.values(item).some((valeur) =>
            valeur !== null &&
            valeur !== undefined &&
            String(valeur).toLowerCase().includes(terme)
          )
        );
      }

      return resultat;
    });

    const selectedIntegr = ref(null);
    const dialogVisibleDetailIntegration = ref(false);

    const showDetail = (item) => {
      selectedIntegr.value = item; // l'objet sélectionné

      // console.log(selectedIntegr.value)
      dialogVisibleDetailIntegration.value = true; // ouvre le dialog
    };

    const fermerDialog = async () => {
      dialogVisibleDetailIntegration.value = false;
      await listIntegration();
    };


    return {
      store,
      stored,
      cvs,
      headersIntegration,
      fermerformcv,
      handleSaved,
      opencv,
      dialogVisibleCV,
      defaultCode,
      prefixe,
      table,
      cvModif,
      modifierCv,
      integrations,
      list, listFiltree, recherche, showDetail, selectedIntegr, dialogVisibleDetailIntegration, fermerDialog,
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

.table-scroll1 {
  margin-top: -30px;
}
</style>
