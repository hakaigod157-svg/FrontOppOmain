<script setup>
// Puce d'une maintenance, utilisée dans la vue mois (variant="month")
// et dans la ligne "Journée" de la vue semaine (variant="week").
// Composant visuel : tous les libellés (title, period, statusLabel) arrivent dans `maintenance`.
import { computed } from "vue";

const props = defineProps({
  maintenance: { type: Object, required: true },
  variant: { type: String, default: "month" } // 'month' | 'week'
});
const emit = defineEmits(["select"]);

const isWeek = computed(() => props.variant === "week");
const label = computed(() => props.maintenance.vehicle || props.maintenance.code);

const title = computed(() => {
  const { title: base, stepLabel, period } = props.maintenance;
  return isWeek.value ? `${base} · ${stepLabel}` : `${base} · ${period}`;
});

const unselectedTitle = computed(() =>
  isWeek.value
    ? "Nouvelle demande non sélectionnée"
    : props.maintenance.statusLabel
);
</script>

<template>
  <button
    type="button"
    class="maintenance-chip"
    :class="[`is-${variant}`, { 'is-validated': maintenance.isStepComplete }]"
    :style="{ '--badge-color': maintenance.color }"
    :title="title"
    @click.stop="emit('select')"
  >
    <span
      v-if="maintenance.stepOrder"
      class="step-order-watermark"
      aria-hidden="true"
    >
      {{ maintenance.stepOrder }}
    </span>
    <v-icon class="classification-badge">
      {{ maintenance.icon }}
    </v-icon>
    <span
      v-if="maintenance.isUnselected"
      class="new-request-indicator"
      :title="unselectedTitle"
    ></span>
    <span class="chip-copy">
      <strong>{{ label }}</strong>
      <small v-if="isWeek">{{ maintenance.stepLabel }}</small>
    </span>
  </button>
</template>

<style scoped lang="scss">
.maintenance-chip {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  margin: 4px 0;
  padding: 9px 10px;
  border: 0;
  border-radius: 9px;
  color: #17324d;
  background-color: #e8f0fb;
  font-family: inherit;
  text-align: left;
  font-size: 0.97rem;
  line-height: 1.35;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.14);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 9px rgba(15, 23, 42, 0.2);
  }

  &:focus-visible {
    outline: 3px solid #0f172a;
    outline-offset: 2px;
  }

  &.is-validated {
    color: #245b35;
    background-color: #f0f8f0;

    &:hover {
      background-color: #e2f2e2;
    }
  }
}

.step-order-watermark {
  position: absolute;
  z-index: 0;
  top: 50%;
  right: 8px;
  max-width: 65%;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.52);
  -webkit-text-stroke: 0.5px rgba(147, 162, 146, 0.95);
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.08em;
  text-overflow: clip;
  white-space: nowrap;
  pointer-events: none;
  transform: translateY(-50%);
  text-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
}

/* ---------- Pastille de classification ---------- */
.classification-badge {
  display: inline-flex;
  flex: 0 0 22px;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--badge-color);
  color: #fff;
}

/* ---------- Pastille "nouvelle demande" ---------- */
.new-request-indicator {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 10px;
  height: 10px;
  border: 2px solid #e8f0fb;
  border-radius: 50%;
  background-color: #f59e0b;
  box-shadow: 0 0 0 1px rgba(120, 53, 15, 0.18);
}

.maintenance-chip.is-validated .new-request-indicator {
  border-color: #f0f8f0;
}

/* ---------- Texte ---------- */
.chip-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ====================================================
   VARIANTE MOIS (bulles qui rétrécissent selon le nombre)
   ==================================================== */
.maintenance-chip.is-month {
  position: relative;
  display: grid;
  grid-template-rows: calc(17px * var(--bubble-scale, 1)) minmax(0, 1fr);
  width: 100%;
  height: 100%;
  min-height: 0;
  margin: 0;
  padding: 2px;
  gap: 1px;
  border-radius: calc(12px * var(--bubble-scale, 1));

  .classification-badge {
    position: relative;
    z-index: 1;
    justify-self: start;
    align-self: start;
    flex-basis: calc(17px * var(--bubble-scale, 1));
    width: calc(17px * var(--bubble-scale, 1));
    height: calc(17px * var(--bubble-scale, 1));
    font-size: calc(11px * var(--bubble-scale, 1));
  }

  .new-request-indicator {
    top: 2px;
    right: 2px;
    width: calc(10px * var(--bubble-scale, 1));
    height: calc(10px * var(--bubble-scale, 1));
  }

  .chip-copy {
    position: relative;
    z-index: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  strong {
    max-width: 100%;
    overflow: hidden;
    font-size: max(0.65rem, calc(0.92rem * var(--bubble-scale, 1)));
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .step-order-watermark {
    right: 3px;
    max-width: 75%;
    font-size: clamp(1.8rem, calc(3.1rem * var(--bubble-scale, 1)), 3.1rem);
  }
}

/* ====================================================
   VARIANTE SEMAINE (ligne "Journée")
   ==================================================== */
.maintenance-chip.is-week {
  position: relative;
  width: 100%;
  min-height: 54px;
  margin: 3px 0;
  padding: 8px 8px 8px 36px;
  font-size: 0.9rem;

  .classification-badge {
    position: absolute;
    top: 7px;
    left: 7px;
    z-index: 1;
  }

  .new-request-indicator {
    top: 5px;
    right: 5px;
  }

  strong {
    position: relative;
    z-index: 1;
    overflow: hidden;
    font-size: 0.97rem;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    position: relative;
    z-index: 1;
    display: block;
    max-width: 100%;
    overflow: hidden;
    color: #40566e;
    font-size: 0.86rem;
    line-height: 1.25;
    white-space: normal;
  }

  .step-order-watermark {
    right: 10px;
    font-size: 3.4rem;
  }
}
</style>
