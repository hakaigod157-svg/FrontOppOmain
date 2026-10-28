<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="auto"
  >
    <v-card>
      <v-card-title class="text-h5">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1"
          variant="text"
          @click="handleNo"
        >
          {{ no }}
        </v-btn>
        <v-btn
          color="green darken-1"
          variant="text"
          @click="handleYes"
        >
          {{ yes }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    title: String,
    message: String,
    yes: {
      type: String,
      default: 'Oui'
    },
    no: {
      type: String,
      default: 'Non'
    },
  },
  emits: ['handleYes','handleNo'],
  setup(props,{emit}) {
    const dialog = ref(false);

    function handleYes() {
      emit("handleYes")
      dialog.value = false;
    }

    function handleNo() {
      emit("handleNo")
      dialog.value = false;
    }

    return {
      dialog,
      handleYes,
      handleNo
    };
  }
};
</script>
