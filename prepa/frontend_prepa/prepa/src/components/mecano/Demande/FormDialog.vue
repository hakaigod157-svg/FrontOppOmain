<script setup>
import { reactive, ref, computed, watch } from "vue";
import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";

const props = defineProps({
  
  modelValue: {
    type: Boolean,
    default: false,
  },
  typeDemande: {
    type: String,
    required: true,
  },
  // Optionnel : si vide, le code est généré à l'ouverture
  // code: {
  //   type: String,
  //   default: "",
  // },
});

const emit = defineEmits(["update:modelValue", "saved"]);

const store = useDemandeMaintenance();

const loading = ref(false);
const preparing = ref(false);
const erreur = ref("");


const detailsVoiture = ref(null);
const loadingDetails = ref(false);

const userID = localStorage.getItem("userID");


const formatKm = (valeur) =>
  String(valeur).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const dateDuJour = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

const form = reactive({
  DEMANDE_CODE: "",
  DEMANDE_DATE: dateDuJour(),
  DEMANDE_VOITURE: null,
  DEMANDE_MARQUE: null,
  DEMANDE_TYPE: props.typeDemande,
  DEMANDE_AUTEUR: userID ?? "",
  DEMANDE_DESCR: null,
});

const resetForm = () => {
  form.DEMANDE_CODE = props.code;
  form.DEMANDE_DATE = dateDuJour();
  form.DEMANDE_VOITURE = null;
  form.DEMANDE_KM =null;
  form.DEMANDE_MARQUE = null;
  form.DEMANDE_TYPE = props.typeDemande;
  form.DEMANDE_AUTEUR = userID ?? "";
  form.DEMANDE_DESCR = null;
  erreur.value = "";
};

const listeVoitNum = computed(() => {
  return (store.voitures || [])
    .map((v) => v.voit_NUM)
    .filter(Boolean);
});

const listeTypesMaintenance = computed(() => {
  return (store.typeMaintenance || [])
    .map((e) => e.enum_CODE)
    .filter(Boolean);
});


const preparer = async () => {
  resetForm();

 await store.getVoitureRhtra();
  await store.getTypeMaint()

  if (form.DEMANDE_CODE) return;

  preparing.value = true;
  try {
    form.DEMANDE_CODE = await store.genererCodeDemande();
  } catch (error) {
    console.error("Impossible de préparer la nouvelle demande :", error);
    erreur.value = "Impossible de générer le code de la demande.";
  } finally {
    preparing.value = false;
  }
};

watch(
  () => props.modelValue,
  (ouvert) => {
    if (ouvert) preparer();
  },
  { immediate: true }
);

watch(
  () => props.code,
  (nouveauCode) => {
    if (nouveauCode) form.DEMANDE_CODE = nouveauCode;
  }
);

// watch(
//   () => form.DEMANDE_VOITURE ,
// )

watch(
  () => props.typeDemande,
  (nouveauType) => {
    form.DEMANDE_TYPE = nouveauType;
  }
);

watch(
  () => form.DEMANDE_VOITURE,
  async (immat) => {
    if (!immat) {
      detailsVoiture.value = null; 
      form.DEMANDE_KM = null;
      return;
    }

    loadingDetails.value = true;
    try {
      detailsVoiture.value = await store.getKmVoiture(immat);
      form.DEMANDE_KM = detailsVoiture.value;
    } finally {
      loadingDetails.value = false;
    }
  }
);


const fermer = () => {
  if (loading.value) return;
  visible.value = false;
};

const save = async () => {
  erreur.value = "";

  if (!form.DEMANDE_CODE) {
    erreur.value = "Aucun code de demande n'a été généré.";
    return;
  }

  if (!form.DEMANDE_VOITURE || !form.DEMANDE_DESCR.trim()) {
    erreur.value = "Veuillez renseigner la voiture et la description.";
    return;
  }

  loading.value = true;

  try {
    const payload = {
      DEMANDE_VOITURE: form.DEMANDE_VOITURE,
      DEMANDE_KM: form.DEMANDE_KM,
      DEMANDE_MARQUE: form.DEMANDE_MARQUE,
      DEMANDE_TYPE: form.DEMANDE_TYPE,
      DEMANDE_AUTEUR: form.DEMANDE_AUTEUR,
      DEMANDE_DESCR: form.DEMANDE_DESCR,
    };

    await store.insertDemande(form.DEMANDE_CODE, payload);

    console.log("Demande créée :", form.DEMANDE_CODE);

    emit("saved", form.DEMANDE_CODE);
    visible.value = false;
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    erreur.value = "Erreur lors de la création de la demande.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-dialog
    v-model="visible"
    max-width="760"
    scrim="black"
    class="demande-dialog"
    :persistent="loading"
  >
    <v-card class="pa-2">
      <v-card-title class="d-flex align-center">
        <span>Nouvelle demande de maintenance</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          :disabled="loading"
          @click="fermer"
        />
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="erreur"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-4"
          closable
          @click:close="erreur = ''"
        >
          {{ erreur }}
        </v-alert>

        <v-row>
          <!-- CODE -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.DEMANDE_CODE"
              label="Code de la demande"
              variant="outlined"
              density="compact"
              :loading="preparing"
              readonly
            />
          </v-col>

          <!-- DATE -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.DEMANDE_DATE"
              label="Date"
              type="date"
              variant="outlined"
              density="compact"
              readonly
            />
          </v-col>

          <!-- VOITURE -->
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="form.DEMANDE_VOITURE"
              :items="listeVoitNum"
              label="Voiture"
              variant="outlined"
              density="compact"
              clearable
              placeholder="Entrez l'Immatriculation du véhicule"
              required
            />
          </v-col>

          <v-col cols="12"  v-if="loadingDetails">
            <v-progress-linear indeterminate />
              </v-col>
              <v-col cols="12"  md="6"  v-else-if="detailsVoiture">
              <div class="details-voiture">
              Km de la Voiture actuel :  {{ formatKm(detailsVoiture) }} km
              </div>
              
          </v-col>

          <!-- MARQUE -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.DEMANDE_MARQUE"
              label="Marque"
              variant="outlined"
              density="compact"
              placeholder="La marque est optionnelle"

            />
          </v-col>

          <!-- TYPE -->
          <v-col cols="12" md="6">
            <v-select
              v-model="form.DEMANDE_TYPE"
              :items="listeTypesMaintenance"
              label="Type de demande"
              variant="outlined"
              density="compact"
              placeholder="Choisir le type de Maintenance"
              clearable
              required
            />
          </v-col>

          <!-- AUTEUR -->
          <!-- <v-col cols="12" md="6">
            <v-text-field
              v-model="form.DEMANDE_AUTEUR"
              label="Auteur"
              variant="outlined"
              density="compact"
            />
          </v-col> -->

          <!-- DESCRIPTION -->
          <v-col cols="12">
            <v-textarea
              v-model="form.DEMANDE_DESCR"
              label="Description de la demande"
              variant="outlined"
              required
              rows="4"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" :disabled="loading" @click="fermer">
          Annuler
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          :disabled="loading || preparing || !form.DEMANDE_CODE"
          @click="save"
        >
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
/* Non scopé : le v-dialog est téléporté à la racine du <body> */
.demande-dialog .v-overlay__scrim {
  opacity: 0.35;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
}


.details-voiture {
  background: #eefff0;            /* fond différent du reste du formulaire */
  border-left: 4px solid #0b3b17; /* petit trait de couleur à gauche */
  border-radius: 6px;
  padding: 12px 16px;
}

.details-titre {
  font-weight: 600;
  margin-bottom: 6px;
  color: #1976d2;
}
</style>