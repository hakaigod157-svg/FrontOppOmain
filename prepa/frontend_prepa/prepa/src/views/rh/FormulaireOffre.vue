<template>
  <div>
    <v-form @submit.prevent="save">
      <div
        style="
          margin-left: -12px;
          margin-right: -12px;
          margin-top: -10px;
          margin-bottom: 35px;
          margin-top: -17px;
        "
      >
        <v-row class="mb-4 title-containerO" align="center">
          <v-col cols="6">
            <span style="font-size: 1.4rem;" > <!--style="font-size: 1.4rem;" -->
              <p>
                
                {{ isEdit ? "Modifier une offre" : "Nouvelle offre" }}
              </p>
            </span>
          </v-col>
          <v-col cols="6" class="d-flex justify-end">
            <div class="d-flex flex-column align-end">
              <span class="font-weight-bold">
                <h2>{{ form.OFFRE_CODE }}</h2></span
              >
            </div>
          </v-col>
        </v-row>
      </div>

      <v-row>
        <v-col cols="6" md="6">
          <!--   <MyTextField
            v-model="form.OFFRE_ENTITE"
            name_lab_text="Entite"
            :readonly="form.OFFRE_TYPE === 'INTERNE'"
            :class="{ readonlyField: form.OFFRE_TYPE === 'INTERNE' }"
            :error="errors.OFFRE_ENTITE !== ''"
            :error-messages="errors.OFFRE_ENTITE"
            @input="
              () => {
                if (form.OFFRE_ENTITE) errors.OFFRE_ENTITE = '';
              }
            "
          />-->
          <v-select
            v-model="form.OFFRE_ENTITE"
            :items="cabinetsDisponibles"
            item-title="cab_nom"
            item-value="cab_nom"
            label="Cabinet"
            variant="underlined"
            density="compact"
            color="deep-purple-accent-4"
            :error="!!errors.OFFRE_ENTITE"
            :error-messages="errors.OFFRE_ENTITE"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6" md="6">
          <MyTextField
            type_text="date"
            v-model="form.OFFRE_DATE"
            name_lab_text="Date"
            :max="today"
            :error="errors.OFFRE_DATE !== ''"
            :error-messages="errors.OFFRE_DATE"
            @input="
              () => {
                if (form.OFFRE_DATE) errors.OFFRE_DATE = '';
              }
            "
          />
        </v-col>

        <v-col cols="6" md="6">
          <div class="d-flex align-center gap-8">
            <v-file-input
              v-model="form.OFFRE_PIECE"
              label="Parcourir la pièce"
              density="compact"
              variant="underlined"
              color="deep-purple-accent-4"
              prepend-icon=""
              append-inner-icon="mdi-paperclip"
              accept="image/*,.pdf"
              style="flex: 1"
              :error="errors.OFFRE_PIECE !== ''"
              :error-messages="errors.OFFRE_PIECE"
              @input="
                () => {
                  if (form.OFFRE_PIECE) errors.OFFRE_PIECE = '';
                }
              "
            />
            <v-btn
              color="blue"
              style="margin-bottom: 15px"
              :disabled="!form.OFFRE_PIECE"
              density="compact"
              @click="openPreview(form.OFFRE_PIECE)"
            >
              Aperçu
            </v-btn>
          </div>
        </v-col>
        <!-- DIALOG D’APERÇU (inchangé) -->
        <v-dialog v-model="dialog" max-width="600px" persistent>
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
        <v-btn density="compact" color="grey-darken-2"
        variant="tonal" @click="cancel">
          Annuler
        </v-btn>
        <v-btn density="compact" type="submit" color="blue-darken-3"
        variant="elevated" class="ml-2">
          {{ isEdit ? "Modifier" : "Enregistrer" }}
        </v-btn>
      </div>
    </v-form>
  </div>
</template>
<script>
import { defineComponent,reactive,watch,ref,computed,onMounted,nextTick,} from "vue";
import MyTextField from "@/components/MyTextField.vue";
import { useOffre } from "@/store/Rh/rh_offre";

export default defineComponent({
  name: "FormulaireOffre",
  components: { MyTextField },

  props: {
    defaultCode: { type: String, default: "" },
    recruCode: { type: String, default: "" },
    offresExistantes: {
      type: Array,
      default: () => [],
    },
    offresModif: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["saved", "cancel"],
  setup(props, { emit }) {
    const cabinet = ref([]);
    const offreStore = useOffre();

    const isInterne = computed(() => {
      const selected = cabinet.value.find(
        (c) => c.cab_nom === form.OFFRE_ENTITE
      );
      return selected ? selected.estInterne === 1 : false;
    });
    const isEdit = computed(() => {
      return props.offresModif && props.offresModif.offre_code; // si un objet est passé
    });

    const form = reactive({
      OFFRE_CODE: props.defaultCode,
      OFFRE_DATE: new Date().toISOString().substr(0, 10),
      OFFRE_ENTITE: "",
      OFFRE_CODE_RECR: props.recruCode,
      OFFRE_PIECE: null,
    });
    // Auto-remplissage du champ "Entité"
    watch(
      () => form.OFFRE_TYPE,
      (newType) => {
        if (newType === "INTERNE") {
          form.OFFRE_ENTITE = "OPHAM";
        } else {
          form.OFFRE_ENTITE = "";
        }
      }
    );
    watch(
      () => props.recruCode,
      (newVal) => {
        form.OFFRE_CODE_RECR = newVal || "";
      },
      { immediate: true }
    );
    onMounted(async () => {
      await offreStore.fetchCabinet();
      cabinet.value = offreStore.listcabinet;
      // console.log(cabinet);
    });
    onMounted(() => {
      if (isEdit.value) {
        const offre = props.offresModif._value || props.offresModif;
        // console.log("Verification : ", offre);

        form.OFFRE_CODE = offre.offre_code || props.defaultCode;
        form.OFFRE_DATE = offre.offre_date || today;
        form.OFFRE_ENTITE = offre.offre_entite || "";

        // Si on reçoit un Base64, on le convertit en Blob
        if (offre.offre_piece && typeof offre.offre_piece === "string") {
          try {
            const byteString = atob(
              offre.offre_piece.split(",")[1] || offre.offre_piece
            );
            const mimeType = offre.offre_piece.includes("JVBERi")
              ? "application/pdf"
              : "image/png";
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++)
              ia[i] = byteString.charCodeAt(i);
            const blob = new Blob([ab], { type: mimeType });

            form.OFFRE_PIECE = new File(
              [blob],
              `piece.${mimeType === "application/pdf" ? "pdf" : "png"}`,
              { type: mimeType }
            );
          } catch (err) {
            console.warn("Impossible de reconstruire le fichier :", err);
          }
        } else {
          form.OFFRE_PIECE = offre.offre_piece || null;
        }
      }
    });

    const errors = reactive({
      OFFRE_CODE: "",

      OFFRE_DATE: "",
      OFFRE_ENTITE: "",
      OFFRE_PIECE: "",
    });

    // 🔹 Références aux champs pour pouvoir scroller dessus
    const fieldRefs = {
      OFFRE_CODE: ref(""),

      OFFRE_DATE: ref(""),
      OFFRE_ENTITE: ref(""),
      OFFRE_PIECE: ref(null),
    };

    async function save() {
      await nextTick();

      // 🔹 Réinitialise correctement les erreurs
      Object.keys(errors).forEach((k) => (errors[k] = ""));

      // Vérifie les champs obligatoires
      const order = ["OFFRE_CODE", "OFFRE_DATE", "OFFRE_ENTITE", "OFFRE_PIECE"];

      for (const field of order) {
        if (!form[field]) {
          errors[field] = "Ce champ est obligatoire";

          const el = fieldRefs[field]?.value?.$el || fieldRefs[field]?.value;
          if (el && el.scrollIntoView)
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          return; // stoppe ici
        }
      }

      const selectedCabinet = cabinet.value.find(
        (c) => c.cab_nom === form.OFFRE_ENTITE
      );
      const estInterne = selectedCabinet?.estInterne === 1;

      if (!isEdit) {
        // Vérification unique INTERNE pour l'entité sélectionnée
        const selectedEntite = form.OFFRE_ENTITE;
        const existeInterne = props.offresExistantes.some(
          (o) => o.offre_entite === selectedEntite && Number(o.offre_type) === 1
        );

        if (existeInterne) {
          errors.OFFRE_ENTITE = "Une offre INTERNE doit être unique";
          return;
        }
      }
      /*
  // 🔹 Vérifie si INTERNE existe déjà
  if (form.OFFRE_TYPE === "INTERNE") {
    const existeInterne = props.offresExistantes.some(
  (offre) =>
    (offre.offre_type?.toUpperCase() === "INTERNE" ||
     offre.OFFRE_TYPE?.toUpperCase() === "INTERNE")
);
    if (existeInterne) {
      errors.OFFRE_TYPE =
        "Une offre INTERNE doit être unique.";
      const el =
        fieldRefs.OFFRE_TYPE?.value?.$el || fieldRefs.OFFRE_TYPE?.value;
      if (el && el.scrollIntoView)
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      return; // stoppe ici
    }
  }*/
      // Tout est bon
      emit("saved", { ...form, isEdit: isEdit.value });
    }

    function cancel() {
      emit("cancel");
    }
    const filePreview = ref(null);
    const isImage = ref(false);
    const isPDF = ref(false);
    const dialog = ref(false);

    function openPreview(file) {
      if (!file) return;
      const url = URL.createObjectURL(file);
      filePreview.value = url;
      isImage.value = file.type.startsWith("image/");
      isPDF.value = file.type === "application/pdf";
      dialog.value = true;
    }
    const cabinetsDisponibles = computed(() => {
      if (!cabinet.value || !Array.isArray(cabinet.value)) return [];

      // récupère toutes les entités déjà utilisées dans les offres existantes
      const entitesOccupees = props.offresExistantes.map((o) => o.offre_entite);

      // filtre les cabinets pour exclure ceux déjà utilisés
      return cabinet.value.filter((c) => !entitesOccupees.includes(c.cab_nom));
    });

    const today = new Date().toISOString().substr(0, 10);
    form.OFFRE_DATE = today;

    return {
      form,
      today,
      filePreview,
      isImage,
      isPDF,
      fieldRefs,
      dialog,
      openPreview,
      save,
      errors,
      cancel,
      cabinet,
      offreStore,
      isInterne,
      cabinetsDisponibles,
      isEdit,
    };
  },
});
</script>
<style>
.radio-inline-group .radio-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px; /* espace horizontal entre les radios */
  font-size: 10px;
}

.radio-inline-group .v-selection-control {
  margin: 0 !important;
}

.readonlyField {
  cursor: not-allowed;
  background-color: #f9f9f9;
  pointer-events: none; /* Empêche clic et curseur */
  user-select: none; /* Empêche sélection de texte */
}

.title-containerO {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 0px 0px 0px;

  background-color: #f8faf8;
  border-bottom: 1px solid #97e15a; /*9BCB3B*/
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
</style>
