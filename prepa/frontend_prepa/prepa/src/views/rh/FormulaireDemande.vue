<template>
  <div>
    <v-form @submit.prevent="save">
      <v-row class="mb-4" align="center">
        <v-col cols="6">
          <h2 class="text-h5">
            <u>{{ isEdit ? "Modifier une demande" : "Nouvelle demande" }}</u>
          </h2>
        </v-col>

        <v-col cols="6" class="d-flex justify-end">
          <div class="d-flex flex-column align-end">
            <span class="font-weight-bold">
              <h2>{{ form.DEMANDE_CODE }}</h2></span
            >
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <MyTextField
            v-model="form.DEMANDE_DATE"
            name_lab_text="Date de demande"
            type_text="date"
            :max="today"
            ref="fieldRefs.DEMANDE_DATE"
            :error="!!errors.DEMANDE_DATE"
            :error-messages="errors.DEMANDE_DATE"
          />
        </v-col>

        <v-col cols="12" md="6">
          <MyTextField
            v-model="form.DEMANDE_PRISE_FONCTION"
            name_lab_text="Prise de fonction"
            type_text="date"
            :min="form.DEMANDE_DATE"
            ref="fieldRefs.DEMANDE_DATE"
            :error="!!errors.DEMANDE_PRISE_FONCTION"
            :error-messages="errors.DEMANDE_PRISE_FONCTION"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="form.DEMANDE_DEPARTEMENT"
            :items="departements"
            item-title="lib_departement"
            item-value="code_departement"
            label="Département"
            @change="onDepartementChange"
            variant="underlined"
            density="compact"
            color="deep-purple-accent-4"
            ref="fieldRefs.DEMANDE_DEPARTEMENT"
            :error="!!errors.DEMANDE_DEPARTEMENT"
            :error-messages="errors.DEMANDE_DEPARTEMENT"
          />
        </v-col>
        <v-col cols="12" md="6"
          ><v-select
            v-model="form.DEMANDE_POSTE"
            :items="postesFiltrees"
            item-title="poste_libelle"
            item-value="code_poste"
            label="Poste"
            variant="underlined"
            density="compact"
            color="deep-purple-accent-4"
            ref="fieldRefs.DEMANDE_POSTE"
            :error="!!errors.DEMANDE_POSTE"
            :error-messages="errors.DEMANDE_POSTE"
          />
        </v-col>
      </v-row>

      <v-row class="align-start">
        <!-- Motif -->
        <v-col cols="12" md="6" class="pt-0">
          <span
            class="text-subtitle-1 mb-1 d-block"
            :style="{ color: errors.DEMANDE_MOTIF ? 'red' : '' }"
            >Motif</span
          >
          <v-radio-group
            v-model="form.DEMANDE_MOTIF"
            inline
            hide-details
            density="compact"
            class="mt-0 uppercase-radio"
            :style="{
              border: `1px solid ${errors.DEMANDE_MOTIF ? 'red' : 'grey'}`,
              borderRadius: '8px',
              padding: '8px 0',
              display: 'flex',
              alignItems: 'stretch',
              backgroundColor: '#fff',
            }"
            ref="fieldRefs.DEMANDE_MOTIF"
          >
            <v-col>
              <v-radio
                label="Nouveau poste"
                value="Nouveau poste"
                color="primary"
              />
              <v-radio
                label="Renforcement"
                value="Renforcement"
                color="primary"
              />
            </v-col>
            <v-col>
              <v-radio
                label="Remplacement"
                value="Remplacement"
                color="primary"
              />
              <v-radio label="Autre" value="Autre" color="primary" />
            </v-col>
          </v-radio-group>
          <small v-if="errors.DEMANDE_MOTIF" class="text-red">{{
            errors.DEMANDE_MOTIF
          }}</small>
        </v-col>

        <v-col
          cols="12"
          md="6"
          class="d-flex flex-column pt-0"
          style="gap: 8px"
        >
          <div class="d-flex" style="gap: 8px">
            <div style="flex: 1; display: flex; flex-direction: column">
              <span
                class="text-subtitle-1 mb-1 d-block"
                :style="{ color: errors.DEMANDE_CONTRAT ? 'red' : '' }"
                >Contrat</span
              >
              <v-radio-group
                v-model="form.DEMANDE_CONTRAT"
                hide-details
                density="compact"
                :style="{
                  border: `1px solid ${
                    errors.DEMANDE_CONTRAT ? 'red' : 'grey'
                  }`,
                  borderRadius: '8px',
                  padding: '8px 8px',
                  display: 'flex',
                  direction: 'row',
                  gap: '8px',
                  alignItems: 'stretch',
                  backgroundColor: '#fff',
                }"
                ref="fieldRefs.DEMANDE_CONTRAT"
              >
                <v-radio label="CDI" value="CDI" color="primary" />
                <v-radio label="CDD" value="CDD" color="primary" />
              </v-radio-group>
              <small v-if="errors.DEMANDE_CONTRAT" class="text-red">{{
                errors.DEMANDE_CONTRAT
              }}</small>
            </div>

            <div style="flex: 1; display: flex; flex-direction: column">
              <v-select
                v-model="form.DEMANDE_EFFECTIF"
                :items="effectifOptions"
                label="Effectif"
                density="compact"
                variant="underlined"
                color="deep-purple-accent-4"
                style="margin-top: 40px"
                ref="fieldRefs.DEMANDE_EFFECTIF"
                :error="!!errors.DEMANDE_EFFECTIF"
                :error-messages="errors.DEMANDE_EFFECTIF"
              />
            </div>
          </div>

          <div class="d-flex align-center" style="gap: 8px; margin-top: -3px">
            <v-file-input
              v-model="form.DEMANDE_FICHE"
              label="Parcourir le fiche"
              density="compact"
              variant="underlined"
              color="deep-purple-accent-4"
              prepend-icon=""
              append-inner-icon="mdi-paperclip"
              accept="image/*,.pdf"
              style="flex: 1"
              ref="fieldRefs.DEMANDE_FICHE"
              :error="!!errors.DEMANDE_FICHE"
              :error-messages="errors.DEMANDE_FICHE"
            />
            <v-btn
              color="blue"
              @click="openPreview"
              :disabled="!form.DEMANDE_FICHE"
              density="compact"
              style="margin-top: -12px"
            >
              Aperçu
            </v-btn>
          </div>
        </v-col>
        <!-- DIALOG D’APERÇU (inchangé) -->
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title class="d-flex align-center">
              <span class="text-h6">Aperçu du fichier</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
              <div v-if="filePreview">
                <img
                  v-if="isImage"
                  :src="filePreview"
                  alt="Aperçu"
                  style="max-width: 100%; border-radius: 4px"
                />
                <iframe
                  v-else-if="isPDF"
                  :src="filePreview"
                  width="100%"
                  height="400px"
                  style="border: none"
                ></iframe>
                <p v-else>Impossible d’afficher ce type de fichier.</p>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red"
                density="compact"
                variant="outlined"
                @click="dialog = false"
                >Fermer</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <div class="d-flex justify-end" style="margin-top: 20px">
        <v-btn
          density="compact"
          color="grey-darken-2"
          variant="tonal"
          @click="cancel"
        >
          Annuler
        </v-btn>

        <v-btn
          density="compact"
          type="submit"
          color="blue-darken-3"
          variant="elevated"
          class="ml-2"
        >
          {{ isEdit ? "Modifier" : "Enregistrer" }}
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  watch,
  ref,
  computed,
  onMounted,
} from "vue";
import MyTextField from "@/components/MyTextField.vue";
import { useDemande } from "@/store/Rh/rh_demande";
import useNumericInputValidationOnly from "@/composables/validateNumericInput";

export default defineComponent({
  name: "FormulaireDemande",
  components: { MyTextField },
  props: {
    defaultCode: { type: String, default: "" },
    demandesModif: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["saved", "cancel"],
  setup(props, { emit }) {
    const departements = ref([]);
    const postesFiltrees = ref([]);

    const filePreview = ref(null);
    const isImage = ref(false);
    const isPDF = ref(false);
    const dialog = ref(false);

    function openPreview() {
      if (!form.DEMANDE_FICHE) return; // pas .value

      const file = form.DEMANDE_FICHE;
      const url = URL.createObjectURL(file);
      filePreview.value = url;
      isImage.value = file.type.startsWith("image/");
      isPDF.value = file.type === "application/pdf";
      dialog.value = true;
    }

    const form = reactive({
      DEMANDE_CODE: props.defaultCode,
      DEMANDE_DATE: new Date().toISOString().substr(0, 10),
      DEMANDE_PRISE_FONCTION: new Date().toISOString().substr(0, 10),
      DEMANDE_DEPARTEMENT: "",
      DEMANDE_MOTIF: "",
      DEMANDE_CONTRAT: "",
      DEMANDE_POSTE: "",
      DEMANDE_EFFECTIF: null,
      DEMANDE_ETAT: 0,
      DEMANDE_FICHE: null,
    });
    // --- Gestion des erreurs dynamiques ---
    const errors = reactive({
      DEMANDE_DATE: "",
      DEMANDE_PRISE_FONCTION: "",
      DEMANDE_DEPARTEMENT: "",
      DEMANDE_CONTRAT: "",
      DEMANDE_POSTE: "",
      DEMANDE_MOTIF: "",
      DEMANDE_EFFECTIF: "",
      DEMANDE_FICHE: "",
    });

    // Références pour chaque champ pour le scroll automatique
    const fieldRefs = {
      DEMANDE_DATE: ref(null),
      DEMANDE_PRISE_FONCTION: ref(null),
      DEMANDE_DEPARTEMENT: ref(null),
      DEMANDE_CONTRAT: ref(null),
      DEMANDE_POSTE: ref(null),
      DEMANDE_MOTIF: ref(null),
      DEMANDE_EFFECTIF: ref(null),
      DEMANDE_FICHE: ref(null),
    };

    const { validateNumericInputOnly } = useNumericInputValidationOnly();
    const effectifOptions = Array.from({ length: 5 }, (_, i) => i + 1);

    const isEdit = computed(() => {
      return props.demandesModif && props.demandesModif.demande_code; // si un objet est passé
    });
    /*  onMounted(async () => {
      const { fetchDepartementPostes } = useDemande();
      await fetchDepartementPostes();
      departements.value = useDemande().donnesdemande;
    });*/

    function onDepartementChange(codeDep) {
      const dep = departements.value.find(
        (d) => d.code_departement === codeDep
      );
      postesFiltrees.value = dep ? dep.postes : [];
    }
    watch(
      () => form.DEMANDE_DEPARTEMENT,
      (codeDep) => {
        const dep = departements.value.find(
          (d) => d.code_departement === codeDep
        );
        postesFiltrees.value = dep ? dep.postes : [];

        // Réinitialiser le poste sélectionné si le poste actuel n'existe plus
        if (
          !postesFiltrees.value.find((p) => p.code_poste === form.DEMANDE_POSTE)
        ) {
          form.DEMANDE_POSTE = null;
        }
      }
    );
    watch(
      () => props.defaultCode,
      (newCode) => {
        form.DEMANDE_CODE = newCode;
      }
    );
    // Les erreurs disparaissent automatiquement dès qu’un champ est rempli
    watch(form, (newVal) => {
      for (const key in errors) {
        if (errors[key] && newVal[key]) {
          errors[key] = "";
        }
      }
    });

    onMounted(async () => {
      const { fetchDepartementPostes } = useDemande();
      await fetchDepartementPostes();
      departements.value = useDemande().donnesdemande;

      if (isEdit.value) {
        const demande = props.demandesModif._value || props.demandesModif;

        form.DEMANDE_CODE = demande.demande_code || props.defaultCode;
        form.DEMANDE_DATE = demande.demande_date || today;
        form.DEMANDE_PRISE_FONCTION = demande.demande_prise_fonction || today;
        form.DEMANDE_MOTIF = demande.demande_motif || "";
        form.DEMANDE_CONTRAT = demande.demande_contrat || "";
        form.DEMANDE_EFFECTIF = demande.demande_effectif || null;

        if (demande.demande_departement) {
          const dep = departements.value.find(
            (d) => d.lib_departement === demande.demande_departement
          );
          form.DEMANDE_DEPARTEMENT = dep ? dep.code_departement : null;
          postesFiltrees.value = dep ? dep.postes : [];
        }

        if (demande.demande_poste && postesFiltrees.value.length) {
          const poste = postesFiltrees.value.find(
            (p) => p.poste_libelle === demande.demande_poste
          );
          form.DEMANDE_POSTE = poste ? poste.code_poste : null;
        }

        if (
          demande.demande_fiche &&
          typeof demande.demande_fiche === "string"
        ) {
          const byteString = atob(
            demande.demande_fiche.split(",")[1] || demande.demande_fiche
          );
          const mimeType = demande.demande_fiche.includes("JVBERi")
            ? "application/pdf"
            : "image/png";
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i);
          const blob = new Blob([ab], { type: mimeType });
          form.DEMANDE_FICHE = new File(
            [blob],
            `piece.${mimeType === "application/pdf" ? "pdf" : "png"}`,
            { type: mimeType }
          );
        }
      }
    });

    // Liste des champs obligatoires
    const requiredFields = [
      "DEMANDE_DATE",
      "DEMANDE_PRISE_FONCTION",
      "DEMANDE_DEPARTEMENT",
      "DEMANDE_CONTRAT",
      "DEMANDE_POSTE",
      "DEMANDE_MOTIF",
      "DEMANDE_EFFECTIF",
      "DEMANDE_ETAT",
      "DEMANDE_FICHE",
    ];

    /*function save() {
      // Vérifier si tous les champs obligatoires sont remplis
      const allFilled = requiredFields.every((field) => {
        const value = form[field];
        return value !== "" && value !== null && value !== undefined;
      });

      if (!allFilled) {
        // Si un champ obligatoire n'est pas rempli, ne fait rien
        return;
      }

      const { insertDemande } = useDemande();
      insertDemande({ ...form });
      emit("saved", { ...form });
    }*/
    async function save() {
      // Réinitialiser les erreurs
      Object.keys(errors).forEach((k) => (errors[k] = ""));

      const order = [
        "DEMANDE_DATE",
        "DEMANDE_PRISE_FONCTION",
        "DEMANDE_DEPARTEMENT",
        "DEMANDE_POSTE",
        "DEMANDE_MOTIF",
        "DEMANDE_CONTRAT",
        "DEMANDE_EFFECTIF",
        "DEMANDE_FICHE",
      ];

      // Vérifie champ par champ et stoppe au premier vide
      for (const field of order) {
        if (!form[field]) {
          errors[field] = "Ce champ est obligatoire";
          await nextTick();
          const el = fieldRefs[field]?.value?.$el || fieldRefs[field]?.value;
          if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return; // stoppe ici pour exiger correction
        }
      }

      emit("saved", { ...form, isEdit: isEdit.value });
    }

    function cancel() {
      emit("cancel");
    }
    function onEffectifInput(event) {
      let val = event.target.value;
      // Convertir en entier
      val = parseInt(val, 10);
      if (!val || val <= 0) {
        // si 0 ou négatif, remettre à vide
        form.DEMANDE_EFFECTIF = "";
      } else {
        form.DEMANDE_EFFECTIF = val;
      }
    }

    const etatOptions = [
      { text: "En attente", value: 0 },
      { text: "Approuvé", value: 1 },
      { text: "Refusé", value: 2 },
    ];
    form.DEMANDE_ETAT = 0;
    const priseFonctionRule = (value) => {
      if (!value) return true; // pas de valeur, pas d'erreur
      const dateDemande = new Date(form.DEMANDE_DATE);
      const datePriseFonction = new Date(value);

      if (datePriseFonction < dateDemande) {
        return "La date de prise de fonction ne peut pas être avant la date de demande !";
      }
      return true;
    };
    function previewFile() {
      if (!form.DEMANDE_FICHE.value) return;

      const file = form.DEMANDE_FICHE.value;
      const fileURL = URL.createObjectURL(file);

      // Ouvre dans un nouvel onglet
      window.open(fileURL, "_blank");
    }
    const truncatedFileName = computed(() => {
      if (!form.DEMANDE_FICHE.value) return "";
      const name = form.DEMANDE_FICHE.value.name || form.DEMANDE_FICHE.value;
      // Limite à 10 caractères + "..." si trop long
      return name.length > 10 ? name.substring(0, 10) + "..." : name;
    });

    const today = new Date().toISOString().substr(0, 10); // format YYYY-MM-DD
    form.DEMANDE_DATE = today;

    return {
      form,
      save,
      cancel,
      validateNumericInputOnly,
      onEffectifInput,
      etatOptions,
      effectifOptions,
      priseFonctionRule,
      departements,
      postesFiltrees,
      onDepartementChange,
      previewFile,
      filePreview,
      isImage,
      isPDF,
      dialog,
      openPreview,
      truncatedFileName,
      today,
      requiredFields,
      errors,
      fieldRefs,
      isEdit,
    };
  },
});
</script>
<style scoped>
/* Applique le style au texte des radios */
::v-deep(.v-radio .v-label) {
  text-transform: uppercase; /* majuscules */
  font-size: 11px; /* taille lisible */
  font-weight: 500; /* un peu plus épais */
  letter-spacing: 0.5px; /* espacement lettres */
}
</style>
