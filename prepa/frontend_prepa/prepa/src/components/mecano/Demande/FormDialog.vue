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

const userID = localStorage.getItem("userID");

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
  DEMANDE_VOITURE: "",
  DEMANDE_MARQUE: "",
  DEMANDE_TYPE: props.typeDemande,
  DEMANDE_AUTEUR: userID ?? "",
  DEMANDE_DESCR: "",
});

const resetForm = () => {
  form.DEMANDE_CODE = props.code;
  form.DEMANDE_DATE = dateDuJour();
  form.DEMANDE_VOITURE = "";
  form.DEMANDE_MARQUE = "";
  form.DEMANDE_TYPE = props.typeDemande;
  form.DEMANDE_AUTEUR = userID ?? "";
  form.DEMANDE_DESCR = "";
  erreur.value = "";
};

const listeVoitNum = computed(() => {
  return (store.voitures || [])
    .map((v) => v.voit_NUM)
    .filter(Boolean);
});

const listeTypesMaintenance = computed(() => {
  return (store.enumerations || [])
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

watch(
  () => props.typeDemande,
  (nouveauType) => {
    form.DEMANDE_TYPE = nouveauType;
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

          <!-- MARQUE -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.DEMANDE_MARQUE"
              label="Marque"
              variant="outlined"
              density="compact"
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
</style>