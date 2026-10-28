<template>
  <div class="page-recrutement">
    <TableauCVglobal @formcvglobal="opencv" @modifier="modifierCv" :items="cvs" :loading="store.loading"
      :headers="headerscv" />
  </div>
  <v-dialog v-model="dialogVisibleCV" persistent width="700" max-width="=700" attach="body">
    <v-card>
      <v-card-text>
        <FormulaireCV v-if="dialogVisibleCV" :defaultCode="defaultCode" @cancel="fermerformcv" @saved="handleSaved"
          :cvsModif="cvModif" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useRouter } from "vue-router";
import useSessionTimeout from "@/utils/useSessionTimeout";
import Config from "@/utils/config.js";
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import TableauCVglobal from "@/components/rh/tableauCVglobal.vue";
import FormulaireCV from "@/views/rh/FormulaireCV.vue";
import { useCV } from "@/store/Rh/rh_cv";
import { useDemande } from "@/store/Rh/rh_demande";

export default defineComponent({
  name: "PageCVglobal",
  components: { TableauCVglobal, FormulaireCV },
  setup() {
    const store = useCV();
    const stored = useDemande();
    const cvs = computed(() => store.listcv);
    const dialogVisibleCV = ref(false);
    const cvModif = ref([]);
    const defaultCode = ref("");
    const prefixe = "CV";
    const table = "RH_CV";
    const headerscv = [
      { title: "Nom complet", key: "cv_nom", align: "start" },
      { title: "Téléphone", key: "cv_contact", align: "start" },
      { title: "Email", key: "cv_email", align: "start" },
      { title: "Date enrg", key: "cv_date", align: "start" },
      { title: "CV", key: "cv_cv", sortable: false, align: "center" },
      { title: "LM", key: "cv_motivation", sortable: false, align: "center" },
      { title: "Actions", key: "cv_action", sortable: false, align: "center" },
    ];
    const router = useRouter();
    useSessionTimeout(Config.DURRE_SESSION, router);

    onMounted(() => {
      store.fetchListCvGlobal();
      //console.log("Liste cvs initialement :", store.listrecrut);
      //console.log("Liste cvs déréférencée :", cvs.value);
    });
    watch(() => {
      store.fetchListCvGlobal();
      //console.log("Liste recrut après changement d'ét :", store.listrecrut);
      //console.log("Liste recrut après changement d'état :", store.listrecrut);
      //console.log("Liste déréférencée :", cvs.value);
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
        // console.log("Ligne cv à modifier : ", cvModif.value);
      } catch (err) {
        console.error("Erreur lors de la mise à jour de la sélection :", err);
      }
    }
    return {
      store,
      stored,
      cvs,
      headerscv,
      fermerformcv,
      handleSaved,
      opencv,
      dialogVisibleCV,
      defaultCode,
      prefixe,
      table,
      cvModif,
      modifierCv
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
