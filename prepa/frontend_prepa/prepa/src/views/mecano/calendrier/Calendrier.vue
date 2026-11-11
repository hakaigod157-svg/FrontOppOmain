<script setup>
/**
 * Calendrier de maintenance : toute la logique est ici, l'affichage est dans
 * les composants du dossier components (CalendarMonthView, CalendarWeekView,
 * CalendarDayView, SlotDialog, MaintenanceChip, MaintenanceDetail).
 *
 * Sommaire :
 *   1. Configuration (filtres, styles, sources d'étapes…)
 *   2. Dates
 *   3. Règles métier des maintenances
 *   4. Chargement des données
 *   5. Horloge
 *   6. Navigation et grilles (mois / semaine / jour)
 *   7. Dialogue, snackbar et actions
 */
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { maintStore } from "@/store/Maintenance/maintenance_store";
import { useEtapeStore } from "@/store/Maintenance/etape_store";
import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";
import { getMaintenanceTypeColor } from "@/utils/maintenanceTypeColor";
import CalendarDayView from "@/components/mecano/Calendrier/CalendarDayView.vue";
import CalendarMonthView from "@/components/mecano/Calendrier/CalendarMonthView.vue";
import CalendarWeekView from "@/components/mecano/Calendrier/CalendarWeekView.vue";
import SlotDialog from "@/components/mecano/Calendrier/SlotDialog.vue";
import CalendarLegend from "@/components/mecano/Calendrier/CalendarLegend.vue";

// ====================================================
// 1. CONFIGURATION
// Pour étendre le calendrier, on ajoute une ligne ici
// (filtre, classification, source d'étapes).
// ====================================================

// Heures affichées dans les vues semaine et jour (07:00 à 19:00)
const HOURS = Array.from({ length: 13 }, (_, index) => index + 7);

const WEEK_DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche"
];

const CLOCK_INTERVAL_MS = 60_000;
const REFRESH_INTERVAL_MS = 60_000;
const MONTH_GRID_SIZE = 42;

const MAINTENANCE_FILTERS = [
  { title: "Toutes les maintenances", value: "all", predicate: () => true },
  {
    title: "Maintenance en Cours",
    value: "in-progress",
    predicate: (maintenance) =>
      maintenance.steps.some((step) => !step.isComplete)
  }
];

const CLASSIFICATION_STYLES = [
  { match: "PREVENT", icon: "mdi-shield-check" },
  { match: "CURAT", icon: "mdi-wrench" },
  { match: "CORRECT", icon: "mdi-alert-circle" },
  { match: "PNEU", icon: "mdi-tire" }
];
const FALLBACK_CLASSIFICATION_ICON = "mdi-car-wrench";

const STATUS_LABELS = [
  ["isComplete", "Terminée"],
  ["isNotInProgress", "Arrêtée après validation"],
  ["isUnselected", "Nouvelle demande non sélectionnée"]
];
const DEFAULT_STATUS_LABEL = "En cours";

const STEP_SOURCES = {
  preparation: {
    nature: "Préparation",
    dateFields: ["maint_ETAPE_PREVU", "MAINT_ETAPE_PREVU"],
    labelFields: ["maint_ETAPE_LIGNE", "MAINT_ETAPE_LIGNE"],
    isSelected: (step) => Number(step.maint_ETAPE_ETAT) === 1,
    isComplete: (step) => Number(step.maint_ETAPE_ETAT) === 2
  },
  realization: {
    nature: "Réalisation",
    dateFields: ["maint_DATE_PREVU", "MAINT_DATE_PREVU"],
    labelFields: ["maint_INTERV_REAL", "MAINT_INTERV_REAL"],
    isSelected: () => false, // déterminé plus bas (prochaine étape à faire)
    isComplete: (step) => Boolean(step.maint_DATE_REAL)
  }
};

// ====================================================
// 2. DATES
// ====================================================
const makeFormatter = (options) => new Intl.DateTimeFormat("fr-FR", options);

const FORMATTERS = {
  full: makeFormatter({
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }),
  monthYear: makeFormatter({ month: "long", year: "numeric" }),
  monthShort: makeFormatter({ month: "short" }),
  weekdayShort: makeFormatter({ weekday: "short" }),
  dayMonthShort: makeFormatter({ day: "numeric", month: "short" }),
  dayMonthYearShort: makeFormatter({
    day: "numeric",
    month: "short",
    year: "numeric"
  })
};

const formatDateFull = (date) => FORMATTERS.full.format(date);
const formatHour = (hour) => `${String(hour).padStart(2, "0")}:00`;

const HOUR_SLOTS = HOURS.map((hour) => ({ value: hour, label: formatHour(hour) }));

const dateOnly = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const text = String(value).trim();

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));

  const french = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (french) {
    return new Date(Number(french[3]), Number(french[2]) - 1, Number(french[1]));
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : dateOnly(parsed);
};

const isSameDay = (first, second) => {
  if (!first || !second) return false;
  const a = new Date(first);
  const b = new Date(second);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const addDays = (date, amount) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

/** Index du jour avec Lundi = 0 et Dimanche = 6. */
const getIsoDayIndex = (date) => (date.getDay() + 6) % 7;

/** Lundi (à minuit) de la semaine contenant `date`. */
const startOfWeek = (date) => {
  const result = addDays(date, -getIsoDayIndex(date));
  result.setHours(0, 0, 0, 0);
  return result;
};

const getIsoWeekNumber = (date) => {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + 4 - (target.getDay() || 7));
  const yearStart = new Date(target.getFullYear(), 0, 1);
  return Math.ceil(((target - yearStart) / 86_400_000 + 1) / 7);
};

/** "2 – 8 novembre 2026" ou "28 oct. – 3 nov. 2026" */
const formatWeekRange = (weekStart) => {
  const weekEnd = addDays(weekStart, 6);
  const sameMonth =
    weekStart.getMonth() === weekEnd.getMonth() &&
    weekStart.getFullYear() === weekEnd.getFullYear();

  if (sameMonth) {
    return `${weekStart.getDate()} – ${weekEnd.getDate()} ${FORMATTERS.monthYear.format(weekStart)}`;
  }

  return `${FORMATTERS.dayMonthShort.format(weekStart)} – ${FORMATTERS.dayMonthYearShort.format(weekEnd)}`;
};

// <input type="date"> <-> Date
const toInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseInputValue = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// ====================================================
// 3. RÈGLES MÉTIER DES MAINTENANCES
// ====================================================
const pickFirst = (source, fields) =>
  fields.map((field) => source[field]).find((value) => value != null);

const getClassificationIcon = (classification = "") => {
  const normalized = String(classification).toUpperCase();
  const known = CLASSIFICATION_STYLES.find(({ match }) =>
    normalized.includes(match)
  );
  return known?.icon ?? FALLBACK_CLASSIFICATION_ICON;
};

/** Transforme les étapes brutes d'une source en étapes normalisées, triées. */
const buildStepPlan = (rawSteps, source) =>
  (rawSteps || [])
    .map((raw, index) => {
      const order = pickFirst(raw, [
        "maint_ETAPE_ORDRE",
        "MAINT_ETAPE_ORDRE",
        "maint_ORDRE_REAL",
        "MAINT_ORDRE_REAL",
        "maint_ORDRE",
        "MAINT_ORDRE",
        "ORDRE",
        "ordre"
      ]);
      const plannedDate = dateOnly(pickFirst(raw, source.dateFields));
      return {
        date: plannedDate,
        label:
          source.labelFields.map((field) => raw[field]).find(Boolean) ||
          "Étape à préciser",
        nature: source.nature,
        sourceIndex: index,
        sourceOrder:
          order == null || String(order).trim() === "" ? NaN : Number(order),
        isSelected: source.isSelected(raw),
        isComplete: source.isComplete(raw)
      };
    })
    .sort((first, second) => {
      const hasOrder =
        Number.isFinite(first.sourceOrder) &&
        Number.isFinite(second.sourceOrder);
      if (hasOrder && first.sourceOrder !== second.sourceOrder) {
        return first.sourceOrder - second.sourceOrder;
      }
      return first.sourceIndex - second.sourceIndex;
    });

/** Construit { startDate, endDate, steps } ou null si aucune date exploitable. */
const buildSchedule = ({ preparation, realization, dateCreationMaint }) => {
  const allPrepSteps = buildStepPlan(preparation, STEP_SOURCES.preparation);
  const allRealSteps = buildStepPlan(realization, STEP_SOURCES.realization);
  allPrepSteps.forEach((step, index) => {
    step.order = index + 1;
  });
  allRealSteps.forEach((step, index) => {
    step.order = allPrepSteps.length + index + 1;
  });
  const prepPlan = allPrepSteps.filter((step) => step.date);
  const realPlan = allRealSteps.filter((step) => step.date);

  const firstStepDate = (steps) =>
    steps.reduce(
      (first, step) => (!first || step.date < first ? step.date : first),
      null
    );
  const lastStepDate = (steps) =>
    steps.reduce(
      (last, step) => (!last || step.date > last ? step.date : last),
      null
    );

  // Les dates prévues des étapes sont des échéances. La maintenance commence
  // à sa création/confirmation ; les anciennes données sans cette date gardent
  // le repli sur leur première étape planifiée.
  const startDate =
    dateOnly(dateCreationMaint) ??
    firstStepDate(prepPlan) ??
    firstStepDate(realPlan);
  if (!startDate) return null;

  const endDate = lastStepDate(realPlan) ?? lastStepDate(prepPlan);
  if (!endDate) return null;

  // Une fois la préparation terminée, la prochaine réalisation devient l'étape en cours.
  if (prepPlan.every((step) => step.isComplete)) {
    const next = realPlan.find((step) => !step.isComplete);
    if (next) next.isSelected = true;
  }

  return {
    startDate,
    endDate: endDate < startDate ? startDate : endDate,
    steps: [...prepPlan, ...realPlan].sort((a, b) => a.date - b.date)
  };
};

const computeStatus = (steps, demand) => {
  const hasSteps = steps.length > 0;
  const isComplete = hasSteps && steps.every((step) => step.isComplete);
  const isInProgress = steps.some((step) => step.isSelected);
  const isNotInProgress =
    hasSteps && steps.some((step) => step.isComplete) && !isInProgress;

  const demandStatus = Number(demand?.demande_ETAT );
  const hasNoActiveStep =
    hasSteps && steps.every((step) => !step.isSelected && !step.isComplete);
  const isUnselected = !isComplete && (demandStatus === 1 || hasNoActiveStep);

  return { isComplete, isInProgress, isNotInProgress, isUnselected };
};

const getStatusLabel = (maintenance) =>
  STATUS_LABELS.find(([flag]) => maintenance[flag])?.[1] ?? DEFAULT_STATUS_LABEL;

const getMaintenanceTitle = (item) =>
  `${item.vehicle || item.code} · ${item.type || item.classification || "Maintenance"}`;

const getVehicleNumber = (maintenance, demand) =>
  maintenance.maint_VOITURE ||
  maintenance.maint_NUMVOITURE ||
  demand?.demande_VOITURE ||
  "";

const getDemandCode = (demand) =>
  String(demand.demande_CODE);

const getMaintenanceDemandCode = (maintenance) =>
  String(maintenance.maint_DEMANDE);

const buildMaintenanceEvent = ({ maintenance, code, schedule, demand }) => {
  const classification = maintenance.maint_CLASSIFICATION;
  const color = getMaintenanceTypeColor(
    maintenance.maint_TYPE,
    demandeStore.typeMaintenance
  );
  const icon = getClassificationIcon(classification);

  return {
    id: code,
    code,
    ...schedule,
    classification,
    type: maintenance.maint_TYPE,
    vehicle: getVehicleNumber(maintenance, demand),
    ...computeStatus(schedule.steps, demand),
    color,
    icon
  };
};

// ---------- Projection d'un événement sur un jour donné ----------
const isActiveOn = (event, day) =>
  day.getTime() >= event.startDate.getTime() &&
  day.getTime() <= event.endDate.getTime();

const getStepsForDate = (event, day) => {
  const time = day.getTime();
  const exact = event.steps.filter((step) => step.date.getTime() === time);
  if (exact.length) return exact;

  const fallback =
    event.steps.find((step) => step.date.getTime() >= time) ?? event.steps.at(-1);
  return fallback ? [fallback] : [];
};

/** Événement enrichi pour un jour : libellés prêts à afficher par les composants. */
const projectOnDate = (event, day) => {
  const steps = getStepsForDate(event, day);
  const isStepComplete = steps.length > 0 && steps.every((step) => step.isComplete);

  return {
    ...event,
    title: getMaintenanceTitle(event),
    // Dans un créneau, le statut décrit l'étape affichée, pas l'ensemble
    // de la maintenance qui peut encore avoir des étapes à venir.
    statusLabel: isStepComplete ? "Terminée" : getStatusLabel(event),
    period: `${formatDateFull(event.startDate)} – ${formatDateFull(event.endDate)}`,
    stepLabel: steps.length
      ? steps.map((step) => `${step.nature} : ${step.label}`).join(" · ")
      : "Maintenance planifiée",
    stepOrder: steps.length
      ? steps.map((step) => step.order).filter(Number.isFinite).join(" / ")
      : "",
    isStepComplete,
    isStepInProgress: steps.some((step) => step.isSelected)
  };
};

// ====================================================
// 4. CHARGEMENT DES DONNÉES
// ====================================================
const maintenanceStore = maintStore();
const etapeStore = useEtapeStore();
const demandeStore = useDemandeMaintenance();
const router = useRouter();

const getMaintenanceTypeLabel = (entry) =>
  String(entry?.enum_CODE ?? entry?.ENUM_CODE ?? entry?.enum_code ?? entry ?? "").trim();

const legendItems = computed(() => {
  const types = [...new Set(
    (demandeStore.typeMaintenance || []).map(getMaintenanceTypeLabel).filter(Boolean)
  )].sort((first, second) => first.localeCompare(second));

  return [
    ...types.map((type) => ({
      label: type,
      type: "swatch",
      color: getMaintenanceTypeColor(type, demandeStore.typeMaintenance)
    })),
    // { label: "Demande à sélectionner", type: "dot" },
    { label: "Étape terminée", type: "validated" }
  ];
});

const openMaintenanceInList = (maintenance) => {
  const code = maintenance?.code || maintenance?.maint_CODE || maintenance?.MAINT_CODE;
  if (!code) return;

  router.push({
    name: "maintenance-liste",
    query: { highlightMaint: String(code) }
  });
};

const events = ref([]);
// Affiche les placeholders dès l'ouverture, y compris pendant le chargement
// initial de la liste des types de maintenance.
const loading = ref(true);
const loadingRequest = ref(false);
const hasLoadedOnce = ref(false);
const maintenanceFilter = ref(MAINTENANCE_FILTERS[0].value);

const visibleEvents = computed(() => {
  const active =
    MAINTENANCE_FILTERS.find((item) => item.value === maintenanceFilter.value) ??
    MAINTENANCE_FILTERS[0];
  return events.value.filter(active.predicate);
});

/** Maintenances actives un jour donné, enrichies pour ce jour. */
const getEventsForDate = (date) => {
  const day = dateOnly(date);
  if (!day || day.getDay() === 0) return [];

  const showUnfinishedStepsOnly = maintenanceFilter.value === "in-progress";

  return visibleEvents.value
    .filter((event) => isActiveOn(event, day))
    .map((event) => projectOnDate(event, day))
    .filter((maintenance) =>
      !showUnfinishedStepsOnly || !maintenance.isStepComplete
    );
};

// Le store d'étapes garde ses résultats dans une propriété partagée :
// les deux lectures doivent rester séquentielles.
const fetchRawSteps = async (code) => {
  const preparation = await etapeStore.getListePrepaMaint(code);
  const realization = await etapeStore.getListeRealMaint(code);
  return { preparation, realization };
};

const loadMaintenances = async () => {
  if (loadingRequest.value) return;
  loadingRequest.value = true;
  if (!hasLoadedOnce.value) loading.value = true;

  try {
    await Promise.all([
      maintenanceStore.getMaintenances(),
      demandeStore.fetchDemandes()
    ]);

    const demandsByCode = new Map(
      demandeStore.demandes.map((demand) => [getDemandCode(demand), demand])
    );
    const result = [];

    for (const maintenance of maintenanceStore.maintnces) {
      const code = maintenance.maint_CODE || maintenance.code;
      if (!code) continue;

      const schedule = buildSchedule({
        ...(await fetchRawSteps(code)),
        dateCreationMaint:
          maintenance.maint_DATECRE ?? maintenance.MAINT_DATECRE
      });
      if (!schedule) continue;

      result.push(
        buildMaintenanceEvent({
          maintenance,
          code,
          schedule,
          demand: demandsByCode.get(getMaintenanceDemandCode(maintenance))
        })
      );
    }

    events.value = result;
    hasLoadedOnce.value = true;
  } catch (error) {
    console.error("Chargement des maintenances impossible :", error);
  } finally {
    loading.value = false;
    loadingRequest.value = false;
  }
};

const counterLabel = computed(() => {
  if (loading.value) return "Chargement…";
  const count = visibleEvents.value.length;
  return `${count} maintenance${count === 1 ? "" : "s"}`;
});

// ====================================================
// 5. HORLOGE (heure courante + ligne "maintenant" de la vue semaine)
// ====================================================
const now = ref(new Date());

const isInWorkHours = computed(() => {
  const hour = now.value.getHours();
  return hour >= HOURS[0] && hour <= HOURS[HOURS.length - 1];
});

const topPercent = computed(() => {
  const elapsed = now.value.getHours() - HOURS[0] + now.value.getMinutes() / 60;
  return Math.min(Math.max((elapsed / HOURS.length) * 100, 0), 100);
});

let refreshTimer = null;
let clockTimer = null;

onMounted(async () => {
  await demandeStore.getTypeMaint();
  loadMaintenances();
  refreshTimer = setInterval(loadMaintenances, REFRESH_INTERVAL_MS);
  clockTimer = setInterval(() => {
    now.value = new Date();
  }, CLOCK_INTERVAL_MS);
});

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer);
  if (clockTimer) clearInterval(clockTimer);
});

// ====================================================
// 6. NAVIGATION ET GRILLES (mois / semaine / jour)
// ====================================================
const currentView = ref("month"); // 'month' | 'week' | 'day'
const currentDate = ref(new Date()); // référence de navigation
const selectedDate = ref(new Date()); // jour choisi par l'utilisateur

const focusDate = (date) => {
  currentDate.value = new Date(date);
  selectedDate.value = new Date(date);
};

const goToToday = () => focusDate(new Date());

const navigate = (direction) => {
  const base = currentDate.value;

  if (currentView.value === "month") {
    // On borne le jour pour éviter 31 janvier + 1 mois = début mars.
    const target = new Date(base.getFullYear(), base.getMonth() + direction, 1);
    const daysInTarget = new Date(
      target.getFullYear(),
      target.getMonth() + 1,
      0
    ).getDate();
    target.setDate(Math.min(base.getDate(), daysInTarget));
    currentDate.value = target;
    return;
  }

  focusDate(addDays(base, direction * (currentView.value === "week" ? 7 : 1)));
};

const periodLabel = computed(() => {
  if (currentView.value === "month") {
    return FORMATTERS.monthYear.format(currentDate.value);
  }
  if (currentView.value === "week") {
    return formatWeekRange(startOfWeek(currentDate.value));
  }
  return formatDateFull(selectedDate.value);
});

const buildDay = (date) => ({
  date,
  isToday: isSameDay(date, now.value),
  isSelected: isSameDay(date, selectedDate.value),
  maintenances: getEventsForDate(date)
});

const monthCells = computed(() => {
  const reference = currentDate.value;
  const month = reference.getMonth();
  const gridStart = startOfWeek(new Date(reference.getFullYear(), month, 1));

  return Array.from({ length: MONTH_GRID_SIZE }, (_, index) => {
    const date = addDays(gridStart, index);
    const weekday = date.getDay();

    return {
      ...buildDay(date),
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isWeekend: weekday === 0 || weekday === 6
    };
  });
});

const weekDays = computed(() => {
  const weekStart = startOfWeek(currentDate.value);

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);

    return {
      ...buildDay(date),
      dayName: FORMATTERS.weekdayShort.format(date),
      dayNumber: date.getDate(),
      monthShort: FORMATTERS.monthShort.format(date)
    };
  });
});

const selectedDay = computed(() => {
  const date = selectedDate.value;

  return {
    number: date.getDate(),
    monthShort: FORMATTERS.monthShort.format(date),
    longName: formatDateFull(date),
    weekNumber: getIsoWeekNumber(date),
    isToday: isSameDay(date, now.value)
  };
});

const selectedDayMaintenances = computed(() =>
  getEventsForDate(selectedDate.value)
);

// ====================================================
// 7. DIALOGUE, SNACKBAR ET ACTIONS
// ====================================================
const dialogVisible = ref(false);
const dialogDate = ref(new Date());
const dialogHour = ref(null);

const dialogDateLabel = computed(() => formatDateFull(dialogDate.value));
const dialogHourLabel = computed(() =>
  dialogHour.value === null
    ? ""
    : `${formatHour(dialogHour.value)} - ${formatHour(dialogHour.value + 1)}`
);
const dialogMaintenances = computed(() => getEventsForDate(dialogDate.value));

const openSlotDialog = (date, hour = null) => {
  dialogDate.value = new Date(date);
  dialogHour.value = hour;
  dialogVisible.value = true;
};

const closeSlotDialog = () => {
  dialogVisible.value = false;
};

const snackbarVisible = ref(false);
const snackbarText = ref("");

const showSnackbar = (text) => {
  snackbarText.value = text;
  snackbarVisible.value = true;
};

const formattedInputDate = computed(() => toInputValue(selectedDate.value));

const onGoToToday = () => {
  goToToday();
  showSnackbar("Affichage réinitialisé à aujourd'hui");
};

const onDateInputChange = (event) => {
  const date = parseInputValue(event.target.value);
  if (!date) return;
  focusDate(date);
  showSnackbar(`Date sélectionnée : ${formatDateFull(date)}`);
};

const selectDay = (date) => {
  focusDate(date);
  openSlotDialog(date);
};

const jumpToDayView = (date) => {
  focusDate(date);
  currentView.value = "day";
  closeSlotDialog();
  showSnackbar(`Affichage de la journée du ${formatDateFull(date)}`);
};
</script>






<template>
  <div class="calendar-page">
    <!-- BARRE D'OUTILS PRINCIPALE DU CALENDRIER -->
    <v-card class="calendar-toolbar-card mb-4" elevation="1">
      <div class="d-flex flex-wrap align-center justify-space-between ga-3 pa-3">
        <!-- Navigation temporelle -->
        <div class="d-flex align-center flex-wrap ga-2">
          <v-btn
            variant="tonal"
            color="primary"
            size="small"
            class="font-weight-bold px-3"
            prepend-icon="mdi-calendar-today"
            @click="onGoToToday"
          >
            Aujourd'hui
          </v-btn>

          <div class="d-flex align-center">
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              density="comfortable"
              title="Précédent"
              @click="navigate(-1)"
            />
            <v-btn
              icon="mdi-chevron-right"
              variant="text"
              density="comfortable"
              title="Suivant"
              @click="navigate(1)"
            />
          </div>

          <!-- Titre de la période courante -->
          <h2 class="calendar-title text-h6 font-weight-bold mb-0 text-capitalize">
            {{ periodLabel }}
          </h2>
        </div>

        <!-- Sélecteur de date rapide & sélecteur de vues -->
        <div class="d-flex align-center flex-wrap ga-3">
          <!-- Saut rapide vers une date -->
          <div class="date-picker-wrapper d-flex align-center">
            <v-icon size="small" class="mr-2 text-medium-emphasis">mdi-calendar-search</v-icon>
            <input
              type="date"
              class="quick-date-input"
              :value="formattedInputDate"
              @change="onDateInputChange"
              title="Sélectionner une date"
            />
          </div>

         <!-- <div class="maintenance-filter">
          <v-checkbox
            v-for="filter in MAINTENANCE_FILTERS"
            :key="filter.value"
            v-model="maintenanceFilter"
            :value="filter.value"
            :label="filter.title"
            density="compact"
            hide-details
          />
        </div> -->

        <v-radio-group
          v-model="maintenanceFilter"
          density="compact"
          hide-details
          class="maintenance-filter"
        >
          <v-radio
            v-for="filter in MAINTENANCE_FILTERS"
            :key="filter.value"
            :label="filter.title"
            :value="filter.value"
          />
        </v-radio-group>



          <!-- Sélecteur de vues : Mensuel / Hebdomadaire / Par jour -->
          <v-btn-toggle
            v-model="currentView"
            mandatory
            color="primary"
            density="compact"
            variant="outlined"
            divided
            class="view-toggle"
          >
            <v-btn value="month" class="text-none">
              <v-icon start size="small">mdi-calendar-month</v-icon>
              <span>Mois</span>
            </v-btn>
            <v-btn value="week" class="text-none">
              <v-icon start size="small">mdi-calendar-week</v-icon>
              <span>Semaine</span>
            </v-btn>
            <v-btn value="day" class="text-none">
              <v-icon start size="small">mdi-calendar-day</v-icon>
              <span>Jour</span>
            </v-btn>
          </v-btn-toggle>

          <!-- Compteur de maintenances -->
          <v-chip
            color="grey-darken-1"
            variant="flat"
            size="small"
            prepend-icon="mdi-information-outline"
            class="d-none d-sm-inline-flex"
          >
            {{ counterLabel }}
          </v-chip>
        </div>
      </div>
    </v-card>

    <!-- CORPS DU CALENDRIER : une seule vue à la fois -->
    <v-card class="calendar-main-card" elevation="2">
      <CalendarMonthView
        v-if="currentView === 'month'"
        :cells="monthCells"
        :week-day-names="WEEK_DAYS"
        :loading="loading"
        @select-day="selectDay"
        @open-day="jumpToDayView"
        @open-slot="openSlotDialog"
      />

      <CalendarWeekView
        v-else-if="currentView === 'week'"
        :days="weekDays"
        :hours="HOUR_SLOTS"
        :is-in-work-hours="isInWorkHours"
        :top-percent="topPercent"
        :loading="loading"
        @open-day="jumpToDayView"
        @open-slot="openSlotDialog"
      />

      <CalendarDayView
        v-else
        :day="selectedDay"
        :maintenances="selectedDayMaintenances"
        :hours="HOUR_SLOTS"
        :loading="loading"
        @open-slot="(hour) => openSlotDialog(selectedDate, hour)"
        @open-maintenance="openMaintenanceInList"
      />
    </v-card>

    <CalendarLegend
      :items="legendItems"
      title="Types et repères"
      label="Légende du calendrier des maintenances"
    />

    <!-- DIALOGUE INTERACTIF DU CRÉNEAU / DU JOUR -->
    <SlotDialog
      v-model="dialogVisible"
      :date-label="dialogDateLabel"
      :hour-label="dialogHourLabel"
      :maintenances="dialogMaintenances"
      :can-jump-to-day="currentView !== 'day'"
      @open-day="jumpToDayView(dialogDate)"
      @open-maintenance="openMaintenanceInList"
    />

    <!-- SNACKBAR DE CONFIRMATION INTERACTION -->
    <v-snackbar
      v-model="snackbarVisible"
      :timeout="2200"
      color="grey-darken-3"
      location="bottom right"
      density="compact"
    >
      {{ snackbarText }}
      <template #actions>
        <v-btn
          color="white"
          variant="text"
          size="small"
          @click="snackbarVisible = false"
        >
          OK
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped lang="scss">
.calendar-page {
  font-family: inherit;
  width: 100%;
  font-size: 1.1em;
}

.calendar-page :deep(.text-caption) {
  font-size: 0.9rem !important;
}

.calendar-page :deep(.text-body-1),
.calendar-page :deep(.text-subtitle-1) {
  font-size: 1.15rem !important;
}

.calendar-toolbar-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
}

.calendar-title {
  color: #2e3a59;
  letter-spacing: -0.2px;
}

.quick-date-input {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 1rem;
  color: #333333;
  outline: none;
  background-color: #fafafa;
  transition: border-color 0.2s;

  &:focus {
    border-color: #2e7d32;
    background-color: #ffffff;
  }
}

.view-toggle {
  border-radius: 6px;
  overflow: hidden;
}

.maintenance-filter {
  // width: 245px;
  // min-width: 215px;
  padding-left : 50px;
  padding-right : 50px;
}

.calendar-main-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;
}
</style>



