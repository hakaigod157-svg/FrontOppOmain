<script setup>
/* global defineProps, defineEmits */
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  code: {
    type: String,
    default: "",
  },
  demande: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "saved"]);

const store = useDemandeMaintenance();

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const formRef = ref(null);
const loading = ref(false);
const saving = ref(false);
const notFound = ref(false);
const erreur = ref("");

const ETAT_EN_ATTENTE = 1;

const form = ref({
  demande_CODE: "",
  demande_DATE: "",
  demande_VOITURE: "",
  demande_MARQUE: "",
  demande_TYPE: "",
  demande_AUTEUR: "",
  demande_DESCR: "",
  demande_ETAT: null,
  demande_DATE_CRE: "",
  demande_USER_CRE: "",
  demande_DATE_MODIF: "",
  demande_USER_MODIF: "",
});

const initial = ref("");

const estEnAttente = computed(
  () => Number(form.value.demande_ETAT) === ETAT_EN_ATTENTE
);

const lectureSeule = computed(() => !estEnAttente.value);

const modifie = computed(() => JSON.stringify(form.value) !== initial.value);

const etatLabel = computed(() => {
  if (form.value.demande_ETAT === null || form.value.demande_ETAT === undefined) {
    return { text: "Chargement...", color: "grey" };
  }
  switch (Number(form.value.demande_ETAT)) {
    case 1:
      return { text: "En attente", color: "warning" };
    default:
      return { text: "Gérée dans Maintenance", color: "info" };
  }
});

const rules = {
  required: (v) =>
    (v !== null && v !== undefined && String(v).trim() !== "") ||
    "Champ obligatoire",
  max: (n) => (v) =>
    !v || String(v).length <= n || `${n} caractères maximum`,
};

const toInputDate = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{2}\/\d{2}\/\d{4}/.test(value)) {
    const [dd, mm, yyyy] = value.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }
  const d = dayjs(value);
  if (d.isValid()) return d.format("YYYY-MM-DD");
  return String(value).slice(0, 10);
};


const formatDateTime = (value) => {
  if (!value) return "—";
  if (typeof value === "string" && /^\d{2}\/\d{2}\/\d{4}/.test(value)) {
    return value;
  }
  const d = dayjs(value);
  if (!d.isValid()) return String(value);
  return d.format("DD/MM/YYYY HH:mm");
};

const normalizeDemande = (data) => {
  if (!data) return {};
  const rawDate =
    data.demande_DATE || data.DEMANDE_DATE || data.demande_date || "";
  const dateCre =
    data.demande_DATE_CRE || data.DEMANDE_DATE_CRE || data.demande_date_cre || "";
  const dateModif =
    data.demande_DATE_MODIF || data.DEMANDE_DATE_MODIF || data.demande_date_modif || "";

  return {
    demande_CODE:
      data.demande_CODE || data.DEMANDE_CODE || data.demande_code || "",
    demande_DATE: toInputDate(rawDate),
    demande_VOITURE:
      data.demande_VOITURE || data.DEMANDE_VOITURE || data.demande_voiture || "",
    demande_MARQUE:
      data.demande_MARQUE || data.DEMANDE_MARQUE || data.demande_marque || "",
    demande_TYPE:
      data.demande_TYPE || data.DEMANDE_TYPE || data.demande_type || "",
    demande_AUTEUR:
      data.demande_AUTEUR || data.DEMANDE_AUTEUR || data.demande_auteur || "",
    demande_DESCR:
      data.demande_DESCR || data.DEMANDE_DESCR || data.demande_descr || "",
    demande_ETAT:
      data.demande_ETAT ?? data.DEMANDE_ETAT ?? data.demande_etat ?? null,
    demande_DATE_CRE: dateCre,
    demande_USER_CRE:
      data.demande_USER_CRE || data.DEMANDE_USER_CRE || data.demande_user_cre || "",
    demande_DATE_MODIF: dateModif,
    demande_USER_MODIF:
      data.demande_USER_MODIF || data.DEMANDE_USER_MODIF || data.demande_user_modif || "",
  };
};

const resetForm = () => {
  form.value = {
    demande_CODE: props.code || "",
    demande_DATE: "",
    demande_VOITURE: "",
    demande_MARQUE: "",
    demande_TYPE: "",
    demande_AUTEUR: "",
    demande_DESCR: "",
    demande_ETAT: null,
    demande_DATE_CRE: "",
    demande_USER_CRE: "",
    demande_DATE_MODIF: "",
    demande_USER_MODIF: "",
  };
  initial.value = "";
  notFound.value = false;
  erreur.value = "";
};

const chargerDemande = async () => {
  const codeAChercher = props.code || props.demande?.demande_CODE || props.demande?.DEMANDE_CODE;
  if (!codeAChercher) return;

  notFound.value = false;
  erreur.value = "";

  if (props.demande) {
    const norm = normalizeDemande(props.demande);
    form.value = { ...form.value, ...norm };
    initial.value = JSON.stringify(form.value);
  }

  loading.value = true;
  try {
    const data = await store.getDemandeByDmdCode(codeAChercher);
    if (!data) {
      if (!props.demande) {
        notFound.value = true;
      }
      return;
    }

    const norm = normalizeDemande(data);
    form.value = {
      ...form.value,
      ...norm,
    };
    initial.value = JSON.stringify(form.value);
  } catch (e) {
    console.error("Erreur lors du chargement de la demande :", e);
    if (!props.demande) {
      notFound.value = true;
      erreur.value = "Impossible de charger la demande.";
    }
  } finally {
    loading.value = false;
  }
};

const listeTypesMaintenance = computed(() => {
  return (store.enumerations || [])
    .map((e) => e.enum_CODE)
    .filter(Boolean);
});


watch(
  () => props.modelValue,
  (ouvert) => {
    if (ouvert) {
      resetForm();
      chargerDemande();
    }
  },
  { immediate: true }
);

watch(
  () => props.code,
  (nouveauCode) => {
    if (props.modelValue && nouveauCode) {
      chargerDemande();
    }
  }
);

const fermer = () => {
  if (saving.value) return;
  visible.value = false;
};

const enregistrer = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    if (!valid) return;
  }

  saving.value = true;
  erreur.value = "";

  try {
    const codeDemande = props.code || form.value.demande_CODE;
    const payload = {
      demande_DATE: form.value.demande_DATE,
      demande_VOITURE: form.value.demande_VOITURE,
      demande_MARQUE: form.value.demande_MARQUE,
      demande_TYPE: form.value.demande_TYPE,
      demande_AUTEUR: form.value.demande_AUTEUR,
      demande_DESCR: form.value.demande_DESCR,
    };

    await store.updateDemande(codeDemande, payload);

    emit("saved", codeDemande);
    visible.value = false;
  } catch (e) {
    console.error("Erreur lors de la modification de la demande :", e);
    erreur.value = "Erreur lors de l'enregistrement de la demande.";
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <v-dialog
    v-model="visible"
    max-width="860"
    scrim="black"
    class="demande-dialog"
    :persistent="saving"
  >
    <v-card class="pa-2">
      <!-- En-tête avec titre, puce d'état et bouton fermer -->
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-2">
          <v-icon color="warning" class="mr-1">mdi-pencil-box-outline</v-icon>
          <span class="font-weight-bold">
            Modifier la demande {{ form.demande_CODE }}
          </span>
        </div>
        <div class="d-flex align-center ga-2">
          <v-chip :color="etatLabel.color" variant="tonal" size="small">
            {{ etatLabel.text }}
          </v-chip>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            :disabled="saving"
            @click="fermer"
          />
        </div>
      </v-card-title>

      <v-card-text>
        <!-- Chargement -->
        <v-skeleton-loader v-if="loading && !form.demande_CODE" type="card, article" />

        <!-- Erreur introuvable -->
        <v-alert
          v-else-if="notFound"
          type="error"
          variant="tonal"
          title="Demande introuvable"
          text="Cette demande n'existe pas ou a été supprimée."
          class="mb-3"
        >
          <template #append>
            <v-btn variant="outlined" size="small" @click="fermer">Fermer</v-btn>
          </template>
        </v-alert>

        <div v-else>
          <!-- Message d'erreur action -->
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

          <!-- Restriction si la demande n'est plus en attente -->
          <v-alert
            v-if="lectureSeule"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-4"
            text="Cette demande n'est plus en attente : elle est gérée dans Maintenance et n'est plus modifiable ici."
          />

          <!-- Formulaire reprenant exactement la mise en page de editDemande -->
          <v-form ref="formRef" @submit.prevent="enregistrer">
            <v-row>
              <!-- CODE (Lecture seule / désactivé) -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.demande_CODE"
                  label="Code"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  disabled
                />
              </v-col>

              <!-- DATE (Lecture seule / désactivé) -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.demande_DATE"
                  label="Date"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  disabled
                />
              </v-col>

              <!-- TYPE (Modifiable uniquement si en attente) -->
              <v-col cols="12" md="4">
               <v-select
                v-model="form.demande_TYPE"
                :items="listeTypesMaintenance"
                label="Type de demande"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required]"
                  :readonly="lectureSeule"
                />
              </v-col>

              <!-- VOITURE (Lecture seule / désactivé) -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.demande_VOITURE"
                  label="Voiture"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  disabled
                />
              </v-col>

              <!-- MARQUE (Lecture seule / désactivé) -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.demande_MARQUE"
                  label="Marque"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  disabled
                />
              </v-col>

              <!-- AUTEUR (Visible dans Edit comme demandé, en lecture seule / désactivé) -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="form.demande_AUTEUR"
                  label="Auteur"
                  variant="outlined"
                  density="comfortable"
                  readonly
                  disabled
                />
              </v-col>

              <!-- DESCRIPTION (Modifiable si en attente) -->
              <v-col cols="12">
                <v-textarea
                  v-model="form.demande_DESCR"
                  label="Description"
                  variant="outlined"
                  rows="4"
                  auto-grow
                  counter="500"
                  :rules="[rules.required, rules.max(500)]"
                  :readonly="lectureSeule"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Infos d'audit (lecture seule) avec dates corrigées -->
            <v-row class="text-body-2 text-medium-emphasis">
              <v-col cols="12" sm="6" md="3">
                <div class="text-caption font-weight-medium">Date création</div>
                <div>{{ formatDateTime(form.demande_DATE_CRE) }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="text-caption font-weight-medium">Créé par</div>
                <div>{{ form.demande_USER_CRE || "—" }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="text-caption font-weight-medium">Dernière modification</div>
                <div>{{ formatDateTime(form.demande_DATE_MODIF) }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="text-caption font-weight-medium">Modifié par</div>
                <div>{{ form.demande_USER_MODIF || "—" }}</div>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </v-card-text>

      <!-- Actions de pied de page -->
      <v-card-actions class="justify-end px-4 pb-3">
        <v-btn variant="text" :disabled="saving" @click="fermer">
          Annuler
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-content-save"
          :loading="saving"
          :disabled="lectureSeule || !modifie || saving"
          @click="enregistrer"
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
