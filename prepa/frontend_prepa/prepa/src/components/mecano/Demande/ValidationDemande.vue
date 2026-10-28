<script setup>
import { ref, computed, watch } from "vue";
import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";
import router from "@/router";
const props = defineProps({
  
  modelValue: {
    type: Boolean,
    default: false,
  },
  
  demande: {
    type: Object,
    default: null,
  },
 
  code: {
    type: String,
    default: "",
  },
 
  numVoiture: {
    type: String,
    default: "",
  },

  // "valider" | "refuser"
  mode: {
    type: String,
    default: "valider",
  },
});

const emit = defineEmits([
  "update:modelValue",
  "validated",
  "refused",
  "saved",
  "close",
]);

const store = useDemandeMaintenance();

const isRefus = computed(() => props.mode === "refuser");

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const loading = ref(false);
const loadingEnum = ref(false);
const erreur = ref("");
const classification = ref("");
const classifications = ref([]);

const rules = {
  required: (v) =>
    (v !== null && v !== undefined && String(v).trim() !== "") ||
    "La classification est obligatoire",
};


const demandeCode = computed(() => {
  return props.code || props.demande?.demande_CODE  || "";
});
const demandeDate = computed(() => {
  return props.code || props.demande?.demande_DATE  || "";
});

// En mode refus, pas de classification à choisir
const isPonctuelle = computed(() => {
  if (isRefus.value) return false;
  const d = props.demande || {};
  const type = String(d.demande_TYPE || "").trim().toUpperCase();
  return type === "PONCTUELLE";
});

const vehicleText = computed(() => {
  const d = props.demande || {};
  const v = props.numVoiture || d.demande_VOITURE  || "";
  const m = d.demande_MARQUE || d.DEMANDE_MARQUE || "";
  if (v && m) return `${m} (${v})`;
  return v || m || "—";
});

const demandeType = computed(() => {
  const d = props.demande || {};
  return d.demande_TYPE || d.DEMANDE_TYPE || "";
});

const demandeDescr = computed(() => {
  const d = props.demande || {};
  return d.demande_DESCR  || "";
});


const chargerClassifications = async () => {
  if (!isPonctuelle.value) return;
  loadingEnum.value = true;
  erreur.value = "";
  try {
    const res = await store.getClassification()
    const rawList = Array.isArray(res) ? res : store.enumerations || [];

    const extraites = rawList
      .map((item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        return (
          item.enum_CODE ||
          item.enum_VALEUR ||
          item.valeur ||
          item.code ||
          ""
        );
      })
      .filter(Boolean);

    if (extraites.length > 0) {
      classifications.value = extraites;
    } else {
      classifications.value = [""];
    }

    const d = props.demande || {};
    const existingClassif = d.demande_CLASSIFICATION ;
    if (existingClassif && classifications.value.includes(existingClassif)) {
      classification.value = existingClassif;
    } else if (!classification.value && classifications.value.length > 0) {
      classification.value = classifications.value[0];
    }
  } catch (err) {
    console.error("Erreur chargement énumération TYPE_CLASSIFICATION :", err);
    if (!classification.value) {
      classification.value = classifications.value[0];
    }
  } finally {
    loadingEnum.value = false;
  }
};

const listeClassifications = computed(() => classifications.value);

const fermer = () => {
  if (loading.value) return;
  visible.value = false;
  emit("close");
};

const valider = async () => {
  const dmd = props.demande || {};
  const codeDmd = props.code || dmd.demande_CODE ;
  const voitNum = props.numVoiture || dmd.demande_VOITURE ;
  const dmdType = String(dmd.demande_TYPE || "").trim();

  let valeurClassification = "";

  if (isPonctuelle.value) {
    if (!classification.value || !String(classification.value).trim()) {
      erreur.value = "Veuillez sélectionner une classification.";
      return;
    }
    valeurClassification = String(classification.value).trim();
  } else {
    valeurClassification = String(
      dmd.demande_CLASSIFICATION ||
      dmdType
    ).trim();
  }

  loading.value = true;
  erreur.value = "";

  try {
    const payloadUpdate = {
      demande_DATE: dmd.demande_DATE ,
      demande_VOITURE: voitNum,
      demande_MARQUE: dmd.demande_MARQUE ,
      demande_TYPE: dmd.demande_TYPE ,
      demande_AUTEUR: dmd.demande_AUTEUR ,
      demande_DESCR: dmd.demande_DESCR ,
      demande_CLASSIFICATION: valeurClassification,
      classification: valeurClassification,
      MAINT_CLASSIFICATION: valeurClassification,
    };

    if (codeDmd) {
      try {
        await store.updateDemande(codeDmd, payloadUpdate);
      } catch (errUpd) {
        console.warn("Update demande (classification) :", errUpd);
      }
      await store.validerDemande(codeDmd, voitNum, valeurClassification);
    }

    emit("validated", {
      demandeCode: codeDmd,
      classification: valeurClassification,
      numVoiture: voitNum,
    });
    emit("saved", codeDmd);

    fermer();
    router.go(-1)
  } catch (err) {
    console.error("Erreur lors de la validation :", err);
    erreur.value = "Erreur lors de la validation de la demande.";
  } finally {
    loading.value = false;
  }
};

const refuser = async () => {
  const codeDmd = props.code || props.demande?.demande_CODE;
  if (!codeDmd) return;

  loading.value = true;
  erreur.value = "";

  try {
    await store.refuserDemande(codeDmd);

    emit("refused", codeDmd);
    emit("saved", codeDmd);
    loading.value = false;
    fermer();
  } catch (err) {
    console.error("Erreur lors du refus :", err);
    erreur.value = "Erreur lors du refus de la demande.";
  } finally {
    loading.value = false;
  }
};

const confirmer = () => (isRefus.value ? refuser() : valider());

watch(
  () => props.modelValue,
  (ouvert) => {
    if (ouvert) {
      classification.value = "";
      erreur.value = "";
      if (isPonctuelle.value) {
        chargerClassifications();
      }
    }
  },
  { immediate: true }
);

watch(
  () => props.demande,
  () => {
    if (props.modelValue) {
      classification.value = "";
      erreur.value = "";
      if (isPonctuelle.value) {
        chargerClassifications();
      }
    }
  }
);
</script>

<template>
  <v-dialog
    v-model="visible"
    max-width="640"
    scrim="black"
    class="demande-dialog validation-demande-dialog"
    :persistent="loading"
  >
    <v-card class="pa-2">
      <!-- En-tête -->
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-2">
          <v-icon :color="isRefus ? 'error' : 'success'" size="26">
            {{ isRefus ? "mdi-close-circle-outline" : "mdi-check-circle-outline" }}
          </v-icon>
          <span class="font-weight-bold">
            <span v-if="demandeDate" class="text-primary font-weight-bold ml-1">
              {{ demandeDate }}
            </span>
          </span>
        </div>
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
          class="mb-3"
          closable
          @click:close="erreur = ''"
        >
          {{ erreur }}
        </v-alert>

         <v-row v-else>
          <v-col cols="12">
            <div
              class="confirmation-box pa-4 rounded-lg text-center"
              :class="{ 'confirmation-box--refus': isRefus }"
            >
              <div class="text-subtitle-1 font-weight-bold mb-1">
                {{ isRefus ? "Refuser la demande" : "Confirmer la demande" }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                <template v-if="isRefus">
                  Voulez-vous vraiment refuser cette demande de maintenance de type
                  <strong class="text-error">{{ demandeType }}</strong> ?
                </template>
                <template v-else>
                  Voulez-vous valider cette demande de maintenance de type
                  <strong class="text-primary">{{ demandeType }}</strong> ?
                </template>
              </div>
              
            </div>
          </v-col>
        </v-row>
        <div class="demande-summary mb-4 pa-3 rounded border">
          <div class="text-caption text-medium-emphasis mb-1 font-weight-bold">
            RÉSUMÉ DE LA DEMANDE
          </div>
          <v-row dense>
            <v-col cols="6" sm="4">
              <div class="text-caption text-grey">Code</div>
              <div class="text-body-2 font-weight-bold">{{ demandeCode || "—" }}</div>
            </v-col>
            <v-col cols="6" sm="4">
              <div class="text-caption text-grey">Véhicule</div>
              <div class="text-body-2 font-weight-bold">{{ vehicleText || "—" }}</div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="text-caption text-grey">Type</div>
              <div class="text-body-2 font-weight-bold">{{ demandeType || "—" }}</div>
            </v-col>
            <v-col cols="12" v-if="demandeDescr" class="mt-1">
              <div class="text-caption text-grey">Description</div>
              <div class="text-body-2 font-weight-bold">
                {{ demandeDescr }}
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Cas 1 : Demande PONCTUELLE (validation uniquement) -> Choix de la classification avec capsules modernes et bien centrées -->
        <v-row v-if="isPonctuelle">
          <v-col cols="12">
            <div class="classification-container">
              <div class="classification-header">
                <span class="classification-label">
                  Classification de la maintenance ponctuelle
                </span>
                <span v-if="loadingEnum" class="text-caption text-grey ml-2">
                  Chargement...
                </span>
              </div>

              <div class="classification-options">
                <button
                  v-for="item in listeClassifications"
                  :key="item"
                  type="button"
                  class="classification-pill"
                  :class="{ active: classification === item }"
                  :aria-pressed="classification === item"
                  :disabled="loadingEnum"
                  @click="classification = item"
                >
                  <v-icon
                    v-if="classification === item"
                    icon="mdi-check-circle"
                    size="18"
                  />
                  {{ item }}
                </button>
              </div>

              <div class="classification-hint">
                Les étapes de la maintenance seront générées selon la classification choisie.
              </div>

              <div
                v-if="!classification && !loadingEnum"
                class="classification-error"
              >
                Veuillez sélectionner une classification.
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Cas 2 : Autres types de demandes ou refus -> Simple confirmation -->
       
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="justify-end px-4 pb-3">
        <v-btn
          variant="text"
          :disabled="loading"
          @click="fermer"
        >
          Annuler
        </v-btn>
        <v-btn
          :color="isRefus ? 'error' : 'success'"
          variant="flat"
          :prepend-icon="isRefus ? 'mdi-close-thick' : 'mdi-check-bold'"
          :loading="loading"
          :disabled="loading || (isPonctuelle && !classification)"
          @click="confirmer"
        >
          {{ isRefus ? "Refuser la demande" : "Valider la demande" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.demande-dialog .v-overlay__scrim {
  opacity: 0.35;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
}

.demande-summary {
  background-color: #f7faf7;
  border-color: #e0e0e0;
}

/* ===== Conteneur de classification (capsules modernes & centrées) ===== */
.classification-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.classification-header {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 8px;
  width: 100%;
}

.classification-label {
  font-size: 14px;
  font-weight: 600;
  color: #2e384d;
  letter-spacing: 0.3px;
}

.classification-options {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  padding: 4px 0;
}

.classification-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 8px 22px;
  border: 1.5px solid #e0e0e0;
  border-radius: 9999px;
  background: #ffffff;
  color: #424242;
  font: inherit;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.classification-pill:hover:not(:disabled) {
  border-color: #7d2fdc;
  color: #7d2fdc;
  background: #faf6ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(125, 47, 220, 0.15);
}

.classification-pill.active {
  background: linear-gradient(135deg, #7d2fdc 0%, #5916a6 100%);
  border-color: #5916a6;
  color: #ffffff;
  font-weight: 600;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(125, 47, 220, 0.35);
}

.classification-pill:focus-visible {
  outline: 2px solid #7d2fdc;
  outline-offset: 3px;
}

.classification-pill:disabled {
  opacity: 0.6;
  cursor: wait;
}

.classification-hint {
  font-size: 12.5px;
  line-height: 1.5;
  color: #616161;
  text-align: center;
}

.classification-error {
  font-size: 12px;
  color: #d32f2f;
  font-weight: 500;
  text-align: center;
}

/* ===== Fenêtre de confirmation pour les autres types ===== */
.confirmation-box {
  background: linear-gradient(180deg, #f8faf8 0%, #f0f7f0 100%);
  border: 1px solid #d7ead5;
}

/* ===== Variante refus ===== */
.confirmation-box--refus {
  background: linear-gradient(180deg, #fff8f8 0%, #fdeeee 100%);
  border: 1px solid #f3c9c9;
}

@media (max-width: 600px) {
  .classification-options {
    gap: 8px;
  }
  .classification-pill {
    padding: 6px 16px;
    font-size: 12.5px;
  }
}

</style>