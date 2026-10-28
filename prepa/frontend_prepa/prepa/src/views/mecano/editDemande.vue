<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";

const route = useRoute();
const router = useRouter();
const store = useDemandeMaintenance();


const code = computed(() => route.params.code);

const ETAT_EN_ATTENTE = 1;

const formRef = ref(null);
const loading = ref(false);
const saving = ref(false);
const notFound = ref(false);

const snackbar = ref({ show: false, text: "", color: "success" });


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
  switch (Number(form.value.demande_ETAT)) {
    case 1:
      return { text: "En attente", color: "warning" };
    default:
      return { text: "Gérée dans Maintenance", color: "info" };
  }
});

const rules = {
  required: (v) => (v !== null && v !== undefined && String(v).trim() !== "") || "Champ obligatoire",
  max: (n) => (v) => !v || String(v).length <= n || `${n} caractères maximum`,
};

import dayjs from "dayjs";

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

const showMessage = (text, color = "success") => {
  snackbar.value = { show: true, text, color };
};

const chargerDemande = async () => {
  loading.value = true;
  notFound.value = false;

  try {
    const data = await store.getDemandeByDmdCode(code.value);
    console.log("Code transmis :", code);

    if (!data) {
      notFound.value = true;
      return;
    }

    const rawDate = data.demande_DATE || data.DEMANDE_DATE || data.demande_date || "";
    const dateCre = data.demande_DATE_CRE || data.DEMANDE_DATE_CRE || data.demande_date_cre || "";
    const dateModif = data.demande_DATE_MODIF || data.DEMANDE_DATE_MODIF || data.demande_date_modif || "";

    form.value = {
      ...form.value,
      ...data,
      demande_CODE: data.demande_CODE || data.DEMANDE_CODE || form.value.demande_CODE,
      demande_DATE: toInputDate(rawDate),
      demande_VOITURE: data.demande_VOITURE || data.DEMANDE_VOITURE || form.value.demande_VOITURE,
      demande_MARQUE: data.demande_MARQUE || data.DEMANDE_MARQUE || form.value.demande_MARQUE,
      demande_TYPE: data.demande_TYPE || data.DEMANDE_TYPE || form.value.demande_TYPE,
      demande_AUTEUR: data.demande_AUTEUR || data.DEMANDE_AUTEUR || form.value.demande_AUTEUR,
      demande_DESCR: data.demande_DESCR || data.DEMANDE_DESCR || form.value.demande_DESCR,
      demande_ETAT: data.demande_ETAT ?? data.DEMANDE_ETAT ?? form.value.demande_ETAT,
      demande_DATE_CRE: dateCre,
      demande_USER_CRE: data.demande_USER_CRE || data.DEMANDE_USER_CRE || form.value.demande_USER_CRE,
      demande_DATE_MODIF: dateModif,
      demande_USER_MODIF: data.demande_USER_MODIF || data.DEMANDE_USER_MODIF || form.value.demande_USER_MODIF,
    };
    initial.value = JSON.stringify(form.value);
  } catch (e) {
    console.error(e);
    notFound.value = true;
    showMessage("Impossible de charger la demande", "error");
  } finally {
    loading.value = false;
  }
};

const enregistrer = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  saving.value = true;
  try {
    const payload = {
      demande_DATE: form.value.demande_DATE,
      demande_VOITURE: form.value.demande_VOITURE,
      demande_MARQUE: form.value.demande_MARQUE,
      demande_TYPE: form.value.demande_TYPE,
      demande_AUTEUR: form.value.demande_AUTEUR,
      demande_DESCR: form.value.demande_DESCR,
    };

    await store.updateDemande(code.value, payload);

    showMessage("Demande modifiée avec succès");
    router.go(-1)
    // await chargerDemande();
    
  } catch (e) {
    console.error(e);
    showMessage("Erreur lors de l'enregistrement", "error");
  } finally {
    saving.value = false;
  }
};

const retour = () => router.push({ name: "demandes" });

onMounted(chargerDemande);
</script>

<template>
  <nav class="demande-edit__nav">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="$router.go(-1)"
    >
      Retour à la liste
    </v-btn>
  </nav>

  <v-container fluid class="demande-edit">
    <!-- Chargement -->
    <v-skeleton-loader v-if="loading" type="card, article" />

    <!-- Demande introuvable -->
    <v-alert
      v-else-if="notFound"
      type="error"
      variant="tonal"
      title="Demande introuvable"
      text="Cette demande n'existe pas ou a été supprimée."
    >
      <template #append>
        <v-btn variant="outlined" size="small" @click="$router.go(-1)">Retour</v-btn>
      </template>
    </v-alert>

    <!-- Formulaire -->
    <v-card v-else>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Modifier la demande {{ form.demande_CODE }}</span>
        <v-chip :color="etatLabel.color" variant="tonal" size="small">
          {{ etatLabel.text }}
        </v-chip>
      </v-card-title>

      <v-alert
        v-if="lectureSeule"
        type="info"
        variant="tonal"
        density="compact"
        class="mx-4"
        text="Cette demande n'est plus en attente : elle est gérée dans Maintenance et n'est plus modifiable ici."
      />

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="enregistrer">
          <v-row>
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

            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.demande_TYPE"
                label="Type"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                :readonly="lectureSeule"
              />
            </v-col>

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

          <!-- Infos d'audit (lecture seule) -->
          <v-row class="text-body-2 text-medium-emphasis">
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption">Date création</div>
              {{ formatDateTime(form.demande_DATE_CRE) }}
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption">Créé par</div>
              {{ form.demande_USER_CRE || "—" }}
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption">Dernière modification</div>
              {{ formatDateTime(form.demande_DATE_MODIF) }}
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="text-caption">Modifié par</div>
              {{ form.demande_USER_MODIF || "—" }}
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" :disabled="saving" @click="$router.go(-1)">
          Annuler
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-content-save"
          :loading="saving"
          :disabled="lectureSeule || !modifie"
          @click="enregistrer "
        >
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.demande-edit__nav {
  padding: 8px 16px 0;
}
.demande-edit {
  max-width: 1100px;
}
</style>