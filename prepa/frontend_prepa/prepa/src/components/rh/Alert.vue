<template>
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      persistent
      max-width="450"
      attach="body"
    >
      <v-card>
        <v-card-text class="d-flex align-center gap-4">
          <v-icon color="orange-darken-2" size="48">mdi-alert-circle</v-icon>
          <div>
            <h3 class="text-h6 mb-2">Voulez-vous valider cette demande ?</h3>
            <p class="mb-0">
              Cette action entraînera une création de recrutement.
            </p>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" color="grey" @click="fermer">Annuler</v-btn>
          <v-btn color="success" @click="confirmer">Valider</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, watch, defineComponent } from "vue";
  
  export default defineComponent({
    name: "Alert",
    props: {
      open: { type: Boolean, default: false },
    },
    emits: ["confirm", "update:open"],
    setup(props, { emit }) {
      const dialog = ref(false);
  
      watch(
        () => props.open,
        (newVal) => {
          dialog.value = newVal;
        },
        { immediate: true }
      );
  
      function fermer() {
        dialog.value = false;
        emit("update:open", false); // ← synchronisation avec le parent
      }
  
      function confirmer() {
        emit("confirm");
        fermer();
      }
  
      return { dialog, fermer, confirmer };
    },
  });
  </script>
  