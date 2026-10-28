<template>
  <div class="page-demande">
    <div class="actions-header">
      <div class="radio-container">
        <v-radio-group v-model="etat" inline>
          <div class="radio-group-custom">
            <MyRadioButton label_radio="Tous" value_radio="3" />
            <MyRadioButton label_radio="En attente" value_radio="0" />
            <MyRadioButton label_radio="Approuvé" value_radio="1" />
            <MyRadioButton label_radio="Refusé" value_radio="2" />
          </div>
        </v-radio-group>
      </div>
      <div class="table-header-actions">
        <v-btn density="compact" variant="elevated" color="#9BCB3B"
          style="color: white; font-weight: 600; border-radius: 8px" @click="openDialog" class="btn-nouveau"><v-icon
            size="17" start style="color: white">mdi-plus-thick</v-icon>
          <strong>Nouvelle demande</strong>
        </v-btn>
      </div>
    </div>
    <Tableau :demandes="demandes" :loading="store.loading" :headers="headers" @modifier="modifierDemande"
      @supprimer="handleDelete" @detail="handleDetail" @approve="handleApprove" @reject="handleReject" />

    <v-dialog v-model="dialog" max-width="700px" max-height="490px" persistent>
      <v-card>
        <v-card-text>
          <FormulaireDemande :defaultCode="defaultCode" :demandesModif="demandeModif" @saved="handleSaved"
            @cancel="fermerformdemande" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- <v-dialog v-model="showAlert" max-width="410px" max-height="490px" persistent>
      <v-card>
        <v-card-text class="d-flex align-center gap-4">
          <v-icon color="blue-darken-2" style="margin-bottom: 50px; margin-right: 13px"
            size="48">mdi-information</v-icon>
          <div>
            <h3 class="text-h6 mb-2">Voulez-vous valider la demande '{{ donneesC.demande_poste }}' ?</h3>
            <p class="mb-0">
              Cette action est irréversible et entraînera une création de recrutement.
            </p>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn density="compact" color="grey-darken-2" variant="tonal" @click="showAlert = false"
            style="padding-top: 1px">Annuler</v-btn>
          <v-btn density="compact" color="blue-darken-2" style="padding-top: 1px" variant="elevated"
            @click="confirmerfunc">Valider</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <!-- <v-dialog v-model="showAlert" max-width="410px" max-height="490px" persistent>
      <v-card>
        <v-card-text class="d-flex align-center gap-4">

          <v-icon color="blue-darken-2" style="margin-bottom: 50px; margin-right: 13px" size="48">
            mdi-information
          </v-icon>
          <div style="width: 100%;">

            <h3 class="text-h6 mb-2">
              Voulez-vous valider la demande '{{ donneesC.demande_poste }}' ?
            </h3>

            <v-text-field v-if="donneesC.demande_contrat === 'CDD'" v-model="dateFinCDD" label="Date de fin du CDD"
              type="date" variant="outlined" density="compact" :min="dateAujourdhui" required />

          </div>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn density="compact" color="grey-darken-2" variant="tonal" @click="showAlert = false"
            style="padding-top: 1px">
            Annuler
          </v-btn>

          <v-btn density="compact" color="blue-darken-2" style="padding-top: 1px" variant="elevated"
            @click="confirmerfunc">
            Valider
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog> -->


    <v-dialog v-model="showAlert" max-width="450px" persistent>
      <v-card class="confirmation-card">
        <v-card-text class="confirmation-content">
          <v-icon color="blue-darken-2" size="45" class="confirmation-icon">
            mdi-information
          </v-icon>
          <div class="confirmation-body">
            <h3 class="text-h6 confirmation-title">
              Voulez-vous valider la demande <br>
              <strong>'{{ donneesC.demande_poste }}'</strong> ?
            </h3>
            <!-- DATE DE FIN DU CDD -->
            <!-- <v-text-field v-if="donneesC.demande_contrat === 'CDD'" v-model="dateFinCDD" label="Date de fin du CDD"
              type="date" variant="outlined" density="compact" :min="dateAujourdhui" required class="date-cdd" style="width: 150px;"/> -->

            <v-select v-if="donneesC.demande_contrat === 'CDD'" v-model="moisFinCDD" :items="listeMois"
              item-title="title" item-value="value" label="Mois d'essaie" variant="outlined" density="compact"
              required class="date-cdd" style="width: 180px;" />

          </div>

        </v-card-text>
        <v-divider />
        <v-card-actions class="confirmation-actions">
          <v-btn density="comfortable" color="grey-darken-2" variant="tonal" @click="showAlert = false">
            Annuler
          </v-btn>
          <v-btn density="comfortable" color="blue-darken-2" variant="elevated" @click="confirmerfunc">
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showAlertD" max-width="410px" max-height="490px" persistent>
      <v-card>
        <v-card-text class="d-flex align-center gap-4">
          <v-icon color="red-darken-2" style="margin-bottom: 50px; margin-right: 13px;"
            size="48">mdi-alert-circle</v-icon>
          <div>
            <h3 class="text-h6 mb-2">Voulez-vous supprimer la demande '{{ donneesD }}' ?</h3>
            <p class="mb-0">
              Cette action est irréversible et entraînera une suppression définitive.
            </p>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn density="compact" color="grey-darken-2" variant="tonal" @click="showAlertD = false"
            style="padding-top: 1px">Annuler</v-btn>
          <v-btn density="compact" color="blue-darken-2" style="padding-top: 1px" variant="elevated"
            @click="supprimerDemande">Oui</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import useSessionTimeout from "@/utils/useSessionTimeout";
import Config from "@/utils/config.js";
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import { useDemande } from "@/store/Rh/rh_demande";
import Tableau from "@/components/rh/tableau.vue";
import FormulaireDemande from "@/views/rh/FormulaireDemande.vue";
import { useRouter } from "vue-router";
import MyRadioButton from "@/components/MyRadioButton.vue";
import Alert from "@/components/Alert.vue";
import Swal from "sweetalert2";

const router = useRouter();

export default defineComponent({
  name: "Pagedemande",
  components: { Tableau, FormulaireDemande, MyRadioButton, Alert },
  setup() {
    const store = useDemande();
    const dialog = ref(false);
    const defaultCode = ref("");
    const etat = ref("3");
    const showAlert = ref(false);
    const showAlertD = ref(false);
    const demandes = computed(() => store.listdemande);
    const confirmer = ref(false);
    const donneesC = ref({});
    const donneesD = ref("");

    const router = useRouter();
    useSessionTimeout(Config.DURRE_SESSION, router);

    const demandeModif = ref([]);
    const prefixe = "DP";
    const table = "RH_DEMANDE";

    const headers = [
      { title: "Code demande", key: "demande_code", align: "start" },
      { title: "Date demande", key: "demande_date", align: "start" },
      { title: "Prise de fonction", key: "demande_prise_fonction", align: "start", },
      { title: "Département", key: "demande_departement", align: "start" },
      { title: "Motif", key: "demande_motif", align: "start" },
      { title: "Contrat", key: "demande_contrat", align: "start" },
      { title: "Poste", key: "demande_poste", align: "start" },
      { title: "Effectif", key: "demande_effectif", sortable: false, align: "center", },
      { title: "Fiche", key: "demande_fiche", sortable: false, align: "center", },
      { title: "Etat", key: "demande_etat", sortable: false, align: "center" },
      { title: "Actions", key: "actions", sortable: false, align: "center" },
    ];

    onMounted(() => {
      store.fetchListDemande(etat.value);
      //console.log("Liste demandée initialement :", store.listdemande);
      //console.log("Liste demandée déréférencée :", demandes.value);
    });

    watch(etat, (newEtat) => {
      store.fetchListDemande(newEtat);

      //console.log("Liste demandée après changement d'état :", store.listdemande);
      //console.log("Liste demandée après changement d'état :", store.listdemande);
      //console.log("Liste déréférencée :", demandes.value);
    });

    async function openDialog() {
      demandeModif.value = null;
      await store.fetchCodeNouveau(prefixe, table);
      defaultCode.value = store.nouveaucode || "";
      dialog.value = true;
    }

    function handleDetail(item) {
      //console.log("Détail demande :", item);
    }

    async function handleSaved(newDemande) {
      try {
        if (!demandeModif.value) {
          // Appelle la bonne méthode du store
          await store.insertDemande(newDemande);

          // Recharger la liste avec l'état actuel
          await store.fetchListDemande(etat.value);
        } else {
          await store.updateDemande(newDemande);
          await store.fetchListDemande(etat.value);
          console.log("Modification en cours!");
        }
      } catch (err) {
        console.error("Erreur lors de l'ajout :", err);
      }
      dialog.value = false;
    }

    async function handleApprove(item) {
      // console.log("Alert");
      showAlert.value = true;
      // console.log(showAlert.value);
      donneesC.value = item;
      // console.log(donneesC);
    }

    async function handleDelete(item) {
      // console.log("Alert");
      showAlertD.value = true;
      // console.log(showAlertD.value);
      donneesD.value = item;
      // console.log(donneesD);
    }

    // async function confirmerfunc() {
    //   await store.updateEtatDemande(donneesC.value.demande_code, router);
    //   await store.fetchListDemande(etat.value);
    //   showAlert.value = false;
    // }

    const dateFinCDD = ref("");
    const dateAujourdhui = new Date().toISOString().split("T")[0];

    const moisFinCDD = ref(null);

    const listeMois = [
      { title: "1", value: 1 },
      { title: "2", value: 2 },
      { title: "3", value: 3 },
      { title: "4", value: 4 },
      { title: "5", value: 5 },
      { title: "6", value: 6 },
      // { title: "7", value: 7 },
      // { title: "8", value: 8 },
      // { title: "9", value: 9 },
      // { title: "10", value: 10 },
      // { title: "11", value: 11 },
      // { title: "12", value: 12 },
    ];

    async function confirmerfunc() {
      // Vérification de la date pour un CDD
      if (
        donneesC.value.demande_contrat === "CDD" &&
        !moisFinCDD.value
      ) {
        Swal.fire({
          icon: "warning",
          title: "Mois d'essaie obligatoire",
          text: "Veuillez renseigner mois d'essaie.",
          confirmButtonText: "OK",
          confirmButtonColor: "#1976D2",
        });

        return;
      }

      // Validation de la demande
      await store.updateEtatDemande(donneesC.value.demande_code, router);
      // Mise à jour de la date uniquement pour un CDD
      if (donneesC.value.demande_contrat === "CDD") {
        await store.updateDateFinCdd(donneesC.value.demande_code, moisFinCDD.value);
      }

      await store.fetchListDemande(etat.value);

      showAlert.value = false;
    }

    const fermerformdemande = () => {
      dialog.value = false; // ouvre le dialog
      demandeModif.value = null;
      // console.log("Bouton annuler cv  clique!");
    };

    async function handleReject(item) {
      await store.updateEtatDemande2(item.demande_code, router);
      await store.fetchListDemande(etat.value);
    }
    function modifierDemande(cvItem) {
      try {
        demandeModif.value = cvItem;
        dialog.value = true; // ← ouvre le formulaire
        // console.log("Ligne demande à modifier : ", demandeModif.value);
      } catch (err) {
        console.error("Erreur lors de la mise à jour de la sélection :", err);
      }
    }
    async function supprimerDemande() {
      try {
        await store.deleteDemande(donneesD.value);
        await store.fetchListDemande(etat.value);
        showAlertD.value = false;
      } catch (err) {
        console.error("Erreur lors de la suppression de la sélection :", err);
      }
    }

    return {
      demandes,
      store,
      dialog,
      defaultCode,
      headers,
      openDialog,
      handleDetail,
      handleSaved,
      handleApprove,
      handleReject,
      handleDelete,
      etat,
      prefixe,
      table,
      demandeModif,
      modifierDemande,
      fermerformdemande,
      supprimerDemande,

      showAlert,
      showAlertD,
      confirmer,
      donneesC,
      donneesD,
      confirmerfunc, dateFinCDD,listeMois,moisFinCDD,
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

/* Conteneur avec bordure */
.radio-container {
  border: 0.1px solid #d1d0d0;
  border-radius: 10px;
  padding: 23px 10px 0px 0px;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 33px;
}

/* Espacement interne des radios */
.radio-group-custom {
  display: flex;
  gap: 20px;
  /* espace horizontal entre chaque radio */
}

.table-header-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 6px;
  padding: 4px 8px;
}

.btn-nouveau {
  font-size: 13px;
  font-weight: 500;
  text-transform: none;
  color: white;
}

.confirmation-card {
  border-radius: 12px !important;
}

.confirmation-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 24px 24px 18px !important;
}

.confirmation-icon {
  flex-shrink: 0;
  margin-top: 3px;
}

.confirmation-body {
  flex: 1;
  min-width: 0;
}

.confirmation-title {
  line-height: 1.5;
  margin-bottom: 18px;
  color: #333;
}

/* Champ date moins large */
.date-cdd {
  width: 230px;
  max-width: 100%;
}

/* Boutons */
.confirmation-actions {
  padding: 14px 20px !important;
  gap: 10px;
}
</style>
