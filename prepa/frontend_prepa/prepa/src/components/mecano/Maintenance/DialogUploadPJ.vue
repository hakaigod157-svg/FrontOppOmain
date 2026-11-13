<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  targetItem: {
    type: Object,
    default: null,
  },
  maxFileSize: {
    type: Number,
    default: 10000000, // 10 Mo
  },
  allowedExtensions: {
    type: Array,
    default: () => ["pdf", "jpg", "jpeg", "png", "webp"],
  },
});

const emit = defineEmits(["update:modelValue", "file-selected", "close"]);

const isDragging = ref(false);
const errorMessage = ref("");
const fileInputRef = ref(null);

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      errorMessage.value = "";
      isDragging.value = false;
    }
  }
);

const close = () => {
  errorMessage.value = "";
  isDragging.value = false;
  emit("update:modelValue", false);
  emit("close");
};

const validateAndEmitFile = (file) => {
  if (!file) return;

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!props.allowedExtensions.includes(extension)) {
    errorMessage.value = `Format non accepté. Choisissez un fichier ${props.allowedExtensions.map((e) => e.toUpperCase()).join(", ")}.`;
    return;
  }

  if (file.size > props.maxFileSize) {
    const maxMo = Math.round(props.maxFileSize / 1000000);
    errorMessage.value = `Le fichier dépasse la limite de ${maxMo} Mo.`;
    return;
  }

  errorMessage.value = "";
  emit("file-selected", { item: props.targetItem, file });
  close();
};

const onFileSelect = (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  validateAndEmitFile(file);
};

const onDropFile = (event) => {
  event.preventDefault();
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  validateAndEmitFile(file);
};

const onDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="480"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="pa-4 rounded-lg upload-dialog-card">
      <v-card-title class="d-flex align-center pb-2 dialog-title-green">
        <v-icon color="#0e4934" class="mr-2">mdi-cloud-upload-outline</v-icon>
        <span class="font-weight-bold">Joindre un fichier</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </v-card-title>

      <v-card-text class="pt-2">
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-3"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>

        <!-- Zone de glisser-déposer aux couleurs vertes de Maintenance -->
        <div
          class="upload-drop-zone"
          :class="{ 'upload-drop-zone--active': isDragging }"
          @drop="onDropFile"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @click="fileInputRef?.click()"
        >
          <v-icon
            size="48"
            :color="isDragging ? '#0e4934' : 'grey-lighten-1'"
            class="mb-2"
          >
            {{ isDragging ? 'mdi-file-upload' : 'mdi-cloud-upload-outline' }}
          </v-icon>

          <div
            class="text-body-2 font-weight-medium"
            :class="isDragging ? 'text-green-dark' : 'text-grey-darken-1'"
          >
            Glissez votre fichier ici
          </div>

          <div class="text-caption text-grey mt-1">
            ou <span class="browse-link">cliquez pour parcourir</span>
          </div>

          <div class="text-caption text-grey-lighten-1 mt-2">
            Formats acceptés : PDF, JPG, PNG, WEBP — Max 10 Mo
          </div>
        </div>

        <input
          ref="fileInputRef"
          class="d-none"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          @change="onFileSelect"
        />
      </v-card-text>

      <v-card-actions class="px-4 pb-2">
        <v-spacer />
        <v-btn variant="outlined" density="compact" color="grey-darken-1" @click="close">
          Annuler
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.upload-dialog-card {
  border-top: 4px solid #0e4934;
}

.dialog-title-green {
  color: #0e4934;
  font-size: 16px;
}

.text-green-dark {
  color: #0e4934 !important;
}

.browse-link {
  color: #0e4934;
  font-weight: 700;
  cursor: pointer;
}

.browse-link:hover {
  text-decoration: underline;
}

.upload-drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  border: 2px dashed #b0bec5;
  border-radius: 12px;
  background-color: #fafcfb;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 180px;
}

.upload-drop-zone:hover {
  border-color: #0e4934;
  background-color: #f0f7f3;
}

.upload-drop-zone--active {
  border-color: #0e4934;
  background-color: #e4f2eb;
  transform: scale(1.01);
}
</style>

