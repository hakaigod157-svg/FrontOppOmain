
<script setup>
import { reactive, ref, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";

const props = defineProps({
  defaultCode: {
    type: String,
    default: "",
  },
  typeDemande: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const router = useRouter();
const store = useDemandeMaintenance();

const loading = ref(false);
const voitures = ref([]);

const sessionId = localStorage.getItem("sessionId");
const userID = localStorage.getItem("userID");

// Le code est transmis par la route ou par la prop.
const form = reactive({
  DEMANDE_CODE: route.query.code ?? props.defaultCode,
  DEMANDE_DATE: new Date().toISOString().slice(0, 10),
  DEMANDE_VOITURE: "",
  DEMANDE_MARQUE: "",
  DEMANDE_TYPE: props.typeDemande,
  DEMANDE_AUTEUR: userID ?? "",
  DEMANDE_DESCR: "",
});

// Synchroniser le code si la prop change.
watch(
  () => props.defaultCode,
  (nouveauCode) => {
    if (nouveauCode) {
      form.DEMANDE_CODE = nouveauCode;
    }
  }
);


watch(
  () => route.query.code,
  (nouveauCode) => {
    if (nouveauCode) {
      form.DEMANDE_CODE = String(nouveauCode);
    }
  }
);


onMounted(async () => {
  try {
    await store.getVoiture();
    voitures.value = store.voitures;
  } catch (err) {
    console.error("Erreur chargement voitures :", err);
  }
});

watch(
  () => form.DEMANDE_VOITURE,
  (codeVoiture) => {
    if (!codeVoiture) return;
    const voiture = (voitures.value || []).find(
      (item) => item.code === codeVoiture || item.VOIT_NUM === codeVoiture
    );
    if (voiture && (voiture.marque || voiture.VOIT_REF)) {
      form.DEMANDE_MARQUE = voiture.marque || voiture.VOIT_REF;
    }
  }
);

const save = async () => {
  if (!form.DEMANDE_CODE) {
    console.error("Aucun code de demande n'a été généré.");
    return;
  }

  if (!form.DEMANDE_VOITURE || !form.DEMANDE_DESCR.trim()) {
    console.error("Veuillez renseigner la voiture et la description.");
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

    await router.push({ name: "maintenance-demande" });
  } catch (error) {
    console.error("Erreur lors de la création :", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <nav class="demande-edit__nav">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="router.go(-1)"
    >
      Retour à la liste
    </v-btn>
  </nav>

  <v-card class="pa-4">
    <v-card-title>
      Nouvelle demande de maintenance
    </v-card-title>

    <v-card-text>
      <v-row>
        <!-- CODE -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.DEMANDE_CODE"
            label="Code de la demande"
            variant="outlined"
            density="compact"
            readonly
          />
        </v-col>

        <!-- DATE : affichage uniquement -->
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

        <!-- VOITURE (Saisie libre du VOIT_NUM ou sélection dans la liste) -->
        <v-col cols="12" md="6">
          <v-combobox
            v-model="form.DEMANDE_VOITURE"
            :items="voitures"
            :item-title="(item) => typeof item === 'object' ? (item.VOIT_NUM || item.code || '') + (item.VOIT_REF ? ' — ' + item.VOIT_REF : (item.marque ? ' — ' + item.marque : '')) : item"
            :item-value="(item) => typeof item === 'object' ? (item.VOIT_NUM || item.code || '') : item"
            :return-object="false"
            label="Voiture (N° VOIT_NUM)"
            placeholder="Saisir ou sélectionner le N° de voiture"
            prepend-inner-icon="mdi-car"
            variant="outlined"
            density="compact"
            clearable
          >
            <template #item="{ props: itemProps, item }">
              <v-list-item v-bind="itemProps" :title="item.raw?.VOIT_NUM || item.raw?.code || item.title">
                <template #subtitle v-if="item.raw?.VOIT_REF || item.raw?.marque">
                  <span>Marque: {{ item.raw.VOIT_REF || item.raw.marque }}</span>
                  <span v-if="item.raw.VOIT_KM"> &bull; {{ item.raw.VOIT_KM }} km</span>
                </template>
              </v-list-item>
            </template>
          </v-combobox>
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
          <v-text-field
            v-model="form.DEMANDE_TYPE"
            label="Type de demande"
            variant="outlined"
            density="compact"
            
          />
        </v-col>

        <!-- AUTEUR -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.DEMANDE_AUTEUR"
            label="Auteur"
            variant="outlined"
            density="compact"
            
          />
        </v-col>

        <!-- DESCRIPTION -->
        <v-col cols="12">
          <v-textarea
            v-model="form.DEMANDE_DESCR"
            label="Description de la demande"
            variant="outlined"
            rows="4"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="justify-end">
      <v-btn
        color="primary"
        :loading="loading"
        :disabled="loading || !form.DEMANDE_CODE"
        @click="save"
      >
        Enregistrer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>