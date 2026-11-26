<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "type-selected"]);

const store = useDemandeMaintenance();

const loading = ref(false);
const generatedCode = ref("");

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Images associées aux types connus (sinon image par défaut)
const TYPE_IMAGES = {
  PREVENTIVE: "/typeMaint_Slot.png",
  PONCTUELLE: "/typeMaint_Slot.png",
  "VISITE TECHNIQUE": "/typeMaint_Slot.png",
  ASSURANCE: "/typeMaint_Slot.png",
};

const CARD_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=600&h=900&fit=crop",
];

// Sous-texte descriptif pour chaque type
const TYPE_SUBTEXTS = {
  PREVENTIVE: "Entretien périodique · Vidange · Freins · etc ... ",
  PONCTUELLE: "Panne · Diagnostic · Crevaison · Accident · Bruit anormal · etc ... ",
  VISITE_TEC: "Renouvellement de la visite technique",
  // "VISITE TECHNIQUE": "Renouvellement de la vivvvvvvsite technique",
  ASSURANCE: "Renouvellement du contrat d’assurance",
};

const typesMaintenanceList = computed(() => {
  return (store.typeMaintenance || [])
    .map((entry) => {
      const code =
        entry?.enum_CODE ?? entry?.ENUM_CODE ?? entry?.enum_code ?? "";
      return String(code).trim();
    })
    .filter(Boolean);
});

const getCardBackground = (index) => CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length];

// Pré-charger les types et générer le code à l'ouverture
watch(
  () => props.modelValue,
  async (opened) => {
    if (!opened) return;

    loading.value = true;
    generatedCode.value = "";

    try {
      // Charger les types de maintenance et générer le code en parallèle
      const [, code] = await Promise.all([
        store.getTypeMaint(),
        store.genererCodeDemande(),
      ]);
      generatedCode.value = code;
    } catch (error) {
      console.error("Erreur lors de la préparation :", error);
    } finally {
      loading.value = false;
    }
  },
  { immediate: true }
);

const getSubtext = (typeCode) => {
  const upper = String(typeCode).toUpperCase();
  return TYPE_SUBTEXTS[upper] || "Panne, Diagnostic, Accident";
};

const selectType = (typeCode) => {
  emit("type-selected", {
    type: typeCode,
    code: generatedCode.value,
  });
  visible.value = false;
};

const fermer = () => {
  visible.value = false;
};
</script>

<template>
  <v-dialog
    v-model="visible"
    max-width="1080"
    width="94vw"
    transition="dialog-transition"
    class="type-selector-dialog"
  >
    <v-card class="type-selector-container" rounded="lg">
        <!-- Bouton Retour -->
        <div class="type-selector-header">
          <v-btn
            variant="outlined"
            color="#0b3b17"
            size="small"
            class="retour-btn text-none"
            @click="fermer"
          >
            Retour
          </v-btn>

          <div class="type-selector-heading">
            <h1 class="type-selector-title">Création d'une nouvelle demande</h1>
            <p class="type-selector-caption">Sélectionnez le type correspondant à votre besoin.</p>
          </div>
          <div class="header-spacer" aria-hidden="true" />
        </div>

        <!-- Loading -->
        <div v-if="loading" class="type-cards-wrapper">
          <div
            v-for="n in 4"
            :key="'skeleton-' + n"
            class="type-card type-card--skeleton"
          >
            <v-skeleton-loader type="image, text, button" />
          </div>
        </div>

        <!-- Cards des types de maintenance -->
        <div v-else class="type-cards-wrapper">
          <div
            v-for="(typeCode, index) in typesMaintenanceList"
            :key="typeCode"
            class="type-card"
            @click="selectType(typeCode)"
          >
            <!-- Photo de fond -->
            <div class="type-card__image">
              <div
                class="type-card__image-bg"
                :style="{ backgroundImage: `url(${getCardBackground(index)})` }"
              />
              <div class="type-card__image-overlay" />
              <div class="type-card__text-overlay" />
            </div>

            <!-- Infos en bas de la carte -->
            <div class="type-card__info">
              <h3 class="type-card__name">{{ typeCode }}</h3>
              <p class="type-card__sub">{{ getSubtext(typeCode) }}</p>
            </div>

            <!-- Bouton flèche -->
            <div class="type-card__action" @click.stop="selectType(typeCode)">
              <v-icon size="28" color="#0b3b17">mdi-arrow-right</v-icon>
            </div>
          </div>

          <!-- Fallback si aucun type trouvé -->
          <div
            v-if="!typesMaintenanceList.length"
            class="type-empty"
          >
            <v-icon size="48" color="#999" class="mb-2">mdi-alert-circle-outline</v-icon>
            <p>Aucun type de maintenance disponible.</p>
          </div>
        </div>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.type-selector-container {
  width: 100%;
  background: rgba(248, 255, 249, 0.82);
  -webkit-backdrop-filter: blur(28px) saturate(145%);
  backdrop-filter: blur(28px) saturate(145%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 52px rgba(7, 36, 17, 0.14);
  padding: 24px 28px 28px;
  position: relative;
}

.type-selector-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.type-selector-heading {
  flex: 1;
  min-width: 0;
  text-align: center;
}

.header-spacer {
  width: 76px;
}

.retour-btn {
  border-radius: 6px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.type-selector-title {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0;
  color: #212121;
  font-family: inherit;
  margin: 0;
}

.type-selector-caption {
  margin: 4px 0 0;
  font-size: 0.875rem;
  color: #757575;
}

.type-cards-wrapper {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 4px 0;
}

.type-card {
  width: 240px;
  min-height: 420px;
  border-radius: 6px;
  overflow: hidden;
  isolation: isolate;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.62);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  background-color: #0b3b17;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 22px rgba(8, 35, 15, 0.22);
    border-color: rgba(255, 255, 255, 0.9);

    .type-card__image-bg {
      transform: scale(1.03);
    }

    .type-card__action {
      background-color: #c8e6c9;
    }
  }
}

.type-card--skeleton {
  background-color: rgba(255, 255, 255, 0.3);
  cursor: default;
  border-color: rgba(255, 255, 255, 0.4);

  &:hover {
    transform: none;
    box-shadow: none;
  }
}

.type-card__image {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 17px;
  clip-path: inset(0 round 17px);
  background: #24432d;
}

.type-card__image-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.35s ease;
}

.type-card__image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(11, 59, 23, 0.34) 0%,
    rgba(11, 59, 23, 0.42) 48%,
    rgba(8, 35, 15, 0.78) 100%
  );
}

.type-card__text-overlay {
  position: absolute;
  inset: 0;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  border-radius: 17px;
  background: rgba(8, 45, 18, 0.14);
  -webkit-mask-image: linear-gradient(135deg, transparent 36%, #000 74%);
  mask-image: linear-gradient(135deg, transparent 36%, #000 74%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.type-card__info {
  position: absolute;
  z-index: 2;
  left: 22%;
  right: 12px;
  bottom: 84px;
  min-height: 124px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 6px;
  text-align: right;
}

.type-card__name {
  width: 100%;
  min-height: 2.3em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: #fff;
  margin: 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.75);
}

.type-card__sub {
  width: 100%;
  min-height: 3.75em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  font-size: 0.82rem;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  padding: 0;
  background: transparent;
  border-radius: 0;
}

.type-card__action {
  position: absolute;
  z-index: 3;
  right: 22px;
  bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background-color: #d1f003;
  transition: background-color 0.2s ease;
  margin: 0;
  width: 48px;
  height: 48px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 4px 14px rgba(22, 96, 48, 0.18);
}

.type-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #666;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .type-cards-wrapper {
    gap: 16px;
  }

  .type-card {
    width: 200px;
    min-height: 360px;
  }
}

@media (max-width: 768px) {
  .type-selector-title {
    font-size: 1rem;
  }

  .type-selector-container {
    padding: 20px 16px;
  }

  .type-selector-header {
    gap: 10px;
    align-items: flex-start;
  }

  .header-spacer {
    display: none;
  }

  .type-selector-heading {
    text-align: left;
  }

  .type-cards-wrapper {
    flex-direction: column;
    align-items: center;
    max-height: min(58vh, 560px);
    overflow-y: auto;
    padding: 8px 4px;
  }

  .type-card {
    width: 280px;
    min-height: 340px;
  }
}
</style>
