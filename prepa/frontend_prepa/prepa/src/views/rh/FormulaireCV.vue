<template>
  <div>
    <v-form @submit.prevent="save">
      <v-row class="mb-4" align="center">
        <v-col cols="6">
          <h2 class="text-h5"><u>{{ isEdit ? "Modifier un candidat" : "Nouveau candidat" }}</u></h2>
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <div class="d-flex flex-column align-end">
            <span class="font-weight-bold">
              <h2>{{ form.CV_CODE }}</h2>
            </span>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" md="6">
          <MyTextField v-model="form.CV_NOM" name_lab_text="Nom" :error="errors.CV_NOM !== ''"
            :error-messages="errors.CV_NOM" @input="
              () => {
                if (form.CV_NOM) errors.CV_NOM = '';
              }
            " />
        </v-col>

        <v-col cols="6" md="6">
          <MyTextField v-model="form.CV_PRENOM" name_lab_text="Prenom" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" md="6">
          <MyTextField v-model="form.CV_CONTACT1" name_lab_text="Tél 1"
            @keypress="(e) => limitPhoneInput(e, 'CV_CONTACT1')" @input="
              (e) => {
                formatPhone(e, 'CV_CONTACT1');
                if (form.CV_CONTACT1) errors.CV_CONTACT1 = '';
              }
            " :error="errors.CV_CONTACT1 !== ''" :error-messages="errors.CV_CONTACT1" />
        </v-col>

        <v-col cols="6" md="6">
          <MyTextField v-model="form.CV_CONTACT_2" name_lab_text="Tél 2"
            @keypress="(e) => limitPhoneInput(e, 'CV_CONTACT_2')" @input="(e) => formatPhone(e, 'CV_CONTACT_2')" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" md="6">
          <MyTextField v-model="form.CV_EMAIL" name_lab_text="Email"
            :error="emailError !== '' || errors.CV_EMAIL !== ''" :error-messages="emailError || errors.CV_EMAIL"
            @blur="onEmailBlur" @input="
              () => {
                if (form.CV_EMAIL) {
                  errors.CV_EMAIL = '';
                  emailError !== '';
                }
              }
            " />
        </v-col>

        <v-col cols="6" md="6">
          <MyTextField type_text="date" v-model="form.CV_DATE" name_lab_text="Date" :max="today"
            :error="errors.CV_DATE !== ''" :error-messages="errors.CV_DATE" @input="
              () => {
                if (form.CV_DATE) errors.CV_DATE = '';
              }
            " />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" md="6">
          <div class="d-flex align-center gap-8">
            <v-file-input v-model="form.CV_CV" label="Parcourir le CV" density="compact" variant="underlined"
              color="deep-purple-accent-4" prepend-icon="" append-inner-icon="mdi-paperclip" accept="image/*,.pdf"
              style="flex: 1" :error="errors.CV_CV !== ''" :error-messages="errors.CV_CV" @update:modelValue="
                () => {
                  if (form.CV_CV) errors.CV_CV = '';
                }
              " />
            <v-btn color="blue" style="margin-bottom: 15px" :disabled="!form.CV_CV" density="compact"
              @click="openPreview(form.CV_CV)">
              Aperçu
            </v-btn>
          </div>
        </v-col>

        <v-col cols="6" md="6">
          <div class="d-flex align-center gap-8">
            <v-file-input v-model="form.CV_MOTIVATION" label="Parcourir le LM" density="compact" variant="underlined"
              color="deep-purple-accent-4" prepend-icon="" append-inner-icon="mdi-paperclip" accept="image/*,.pdf"
              style="flex: 1" :error="errors.CV_MOTIVATION !== ''" :error-messages="errors.CV_MOTIVATION"
              @update:modelValue="
                () => {
                  if (form.CV_MOTIVATION) errors.CV_MOTIVATION = '';
                }
              " />
            <v-btn color="blue" style="margin-bottom: 15px" :disabled="!form.CV_MOTIVATION" density="compact"
              @click="openPreview(form.CV_MOTIVATION)">
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
                <img v-if="isImage" :src="filePreview" alt="Aperçu" style="max-width: 100%; border-radius: 4px" />
                <iframe v-else-if="isPDF" :src="filePreview" width="100%" height="400px" style="border: none"></iframe>
                <p v-else>Impossible d’afficher ce type de fichier.</p>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" density="compact" variant="outlined" @click="dialog = false">Fermer</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

      <div class="d-flex justify-end" style="margin-top: 20px">
        <v-btn density="compact" color="grey-darken-2" variant="tonal" @click="cancel">
          Annuler
        </v-btn>
        <v-btn density="compact" type="submit" color="blue-darken-3" variant="elevated" class="ml-2">
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
  nextTick,
} from "vue";
import MyTextField from "@/components/MyTextField.vue";
import useNumericInputValidationOnly from "@/composables/validateNumericInput";
import { useCV } from "@/store/Rh/rh_cv";

export default defineComponent({
  name: "FormulaireCV",
  components: { MyTextField },

  props: {
    defaultCode: { type: String, default: "" },
    recruCode: { type: String, default: "" },
    cvsModif: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["saved", "cancel"],
  setup(props, { emit }) {
    const PHONE_PREFIX = "+261";
    const emailError = ref("");
    const { validateNumericInputOnly } = useNumericInputValidationOnly();
    const form = reactive({
      CV_CODE: props.defaultCode,
      CV_NOM: "",
      CV_PRENOM: "",
      CV_CONTACT1: "",
      CV_CONTACT_2: "",
      CV_EMAIL: "",
      CV_DATE: new Date().toISOString().substr(0, 10),
      CV_RECRU_CODE: props.recruCode,
      CV_CV: null,
      CV_MOTIVATION: null,
    });
    const isEdit = computed(() => {
      return props.cvsModif && props.cvsModif.cv_code; // si un objet est passé
    });

    watch(
      () => props.recruCode,
      (newVal) => {
        form.CV_RECRU_CODE = newVal || "";
      },
      { immediate: true }
    );

    const errors = reactive({
      CV_CODE: "",
      CV_NOM: "",

      CV_CONTACT1: "",

      CV_EMAIL: "",
      CV_DATE: "",
      CV_CV: "",
      CV_MOTIVATION: "",
    });
    onMounted(() => {
      if (isEdit.value) {
        const cv = props.cvsModif._value || props.cvsModif;
        // console.log("Verification : ", cv);

        form.CV_CODE = cv.cv_code || props.defaultCode;
        form.CV_NOM = cv.cv_nom || "";
        form.CV_PRENOM = cv.cv_prenom || "";
        form.CV_CONTACT1 = cv.cv_contact1 || "";
        form.CV_CONTACT_2 = cv.cv_contact_2 || "";
        form.CV_EMAIL = cv.cv_email || "";
        form.CV_DATE = cv.cv_date || today;

        // Si on reçoit un Base64, on le convertit en Blob
        if (cv.cv_cv && typeof cv.cv_cv === "string") {
          try {
            const byteString = atob(
              cv.cv_cv.split(",")[1] || cv.cv_cv
            );
            const mimeType = cv.cv_cv.includes("JVBERi")
              ? "application/pdf"
              : "image/png";
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++)
              ia[i] = byteString.charCodeAt(i);
            const blob = new Blob([ab], { type: mimeType });

            form.CV_CV = new File(
              [blob],
              `piece.${mimeType === "application/pdf" ? "pdf" : "png"}`,
              { type: mimeType }
            );
          } catch (err) {
            console.warn("Impossible de reconstruire le fichier :", err);
          }
        }
        if (cv.cv_motivation && typeof cv.cv_motivation === "string") {
          try {
            const byteString = atob(
              cv.cv_cv.split(",")[1] || cv.cv_motivation
            );
            const mimeType = cv.cv_motivation.includes("JVBERi")
              ? "application/pdf"
              : "image/png";
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++)
              ia[i] = byteString.charCodeAt(i);
            const blob = new Blob([ab], { type: mimeType });

            form.CV_MOTIVATION = new File(
              [blob],
              `piece.${mimeType === "application/pdf" ? "pdf" : "png"}`,
              { type: mimeType }
            );
          } catch (err) {
            console.warn("Impossible de reconstruire le fichier :", err);
          }
        }
      }
    });
    // 🔹 Références aux champs pour pouvoir scroller dessus
    const fieldRefs = {
      CV_CODE: ref(""),
      CV_NOM: ref(""),
      CV_CONTACT1: ref(""),
      CV_EMAIL: ref(""),
      CV_DATE: ref(""),
      CV_CV: ref(null),
      CV_MOTIVATION: ref(null),
    };

    async function save() {
      // Réinitialiser les erreurs
      await nextTick();

      Object.keys(errors).forEach((k) => (errors[k] = ""));
      onMounted(() => {
        Object.keys(errors).forEach((k) => (errors[k] = ""));
        Object.keys(form).forEach((k) => (form[k] = form[k] || ""));
      });

      const order = [
        "CV_CODE",
        "CV_NOM",
        "CV_CONTACT1",
        "CV_EMAIL",
        "CV_DATE",
        "CV_CV",
        "CV_MOTIVATION",
      ];
      /*  if (!/^.+@gmail\.com$/i.test(form.CV_EMAIL)) {
        errors.CV_EMAIL = "Format incorrect !";
        return;
      }*/

      // Vérifie champ par champ et stoppe au premier vide

      for (const field of order) {
        if (!form[field]) {
          errors[field] = "Ce champ est obligatoire";

          const el = fieldRefs[field]?.value?.$el || fieldRefs[field]?.value;
          if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return; // stoppe ici pour exiger correction
        }

        // Vérifier format email juste après qu’il soit non vide
        if (field === "CV_EMAIL") {
          emailError.value = checkEmailFormat(form.CV_EMAIL);
          if (emailError.value !== "") {
            errors.CV_EMAIL = emailError.value;
            return;
          }
        }
      }

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

    watch(
      () => form.CV_NOM,
      (newVal) => {
        form.CV_NOM = newVal.toUpperCase();
      }
    );
    watch(
      () => form.CV_PRENOM,
      (newVal) => {
        if (newVal) {
          form.CV_PRENOM = newVal
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");
        }
      }
    );
    // Prefix fixe pour Madagascar

    function formatPhone(event, field) {
      let input = event.target;
      let val = input.value.replace(/\D/g, ""); // garde uniquement les chiffres

      if (val.length > 10) val = val.substring(0, 10); // limite à 7 chiffres

      // Formate en 3 2 3 2
      let parts = [];
      if (val.length > 0) parts.push(val.substring(0, 3));
      if (val.length > 3) parts.push(val.substring(3, 5));
      if (val.length > 5) parts.push(val.substring(5, 8));
      if (val.length > 8) parts.push(val.substring(8, 10));
      if (val.length > 10) parts.push(val.substring(10, 10));
      form[field] = parts.join(" ");
      // Bloquer la saisie si on a atteint 10 chiffres
      if (val.length >= 10) {
        event.preventDefault();
      }
    }

    function limitPhoneInput(event, field) {
      const val = form[field].replace(/\D/g, "");

      // Si 10 chiffres déjà, empêcher d'ajouter
      if (val.length >= 10) {
        event.preventDefault();
        return;
      }

      // Empêcher tout caractère qui n'est pas 0-9
      const char = String.fromCharCode(event.keyCode || event.which);
      if (!/[0-9]/.test(char)) {
        event.preventDefault();
      }
    }

    const today = new Date().toISOString().substr(0, 10);
    form.CV_DATE = today;

    const touchedEmail = ref(false); // devient true après le premier blur

    function checkEmailFormat(value) {
      if (!value) return "";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value)
        ? ""
        : "Format incorrect !";
    }

    function onEmailBlur() {
      touchedEmail.value = true;
      emailError.value = checkEmailFormat(form.CV_EMAIL);

      if (!emailError.value) errors.CV_EMAIL = "";
    }

    function onEmailInput() {
      if (touchedEmail.value) {
        emailError.value = checkEmailFormat(form.CV_EMAIL);

        if (!emailError.value) {
          errors.CV_EMAIL = "";
        } else {
          errors.CV_EMAIL = emailError.value;
        }
      }
    }

    return {
      form,
      validateNumericInputOnly,
      PHONE_PREFIX,
      formatPhone,
      limitPhoneInput,
      today,
      emailError,
      onEmailBlur,
      onEmailBlur,
      onEmailInput,
      emailError,
      touchedEmail,
      filePreview,
      isImage,
      isPDF,
      fieldRefs,
      dialog,
      openPreview,
      save,
      errors,
      cancel,
      isEdit
    };
  },
});
</script>
<style></style>
