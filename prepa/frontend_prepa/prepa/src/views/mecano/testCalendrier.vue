<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

// ----------------------------------------------------
// ÉTAT GLOBAL DU CALENDRIER
// ----------------------------------------------------
const currentView = ref("month"); // 'month' | 'week' | 'day'
const currentDate = ref(new Date()); // Date de référence pour la navigation
const selectedDate = ref(new Date()); // Date sélectionnée par l'utilisateur

// Heures affichées dans les vues semaine et jour (07:00 à 19:00)
const hoursList = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

// Noms des jours de la semaine en français (Lundi en premier)
const weekDaysFull = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche"
];

// Dialogue pour inspecter un créneau
const slotDialog = ref({
  visible: false,
  date: new Date(),
  dateFormatted: "",
  hour: null
});

// Snackbar pour retour d'interaction
const snackbar = ref({
  visible: false,
  text: ""
});

// Indicateur heure actuelle pour la vue semaine
const now = ref(new Date());
let timeInterval = null;

onMounted(() => {
  timeInterval = setInterval(() => {
    now.value = new Date();
  }, 60000); // Mise à jour chaque minute
});

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
});

// ----------------------------------------------------
// UTILITAIRES DE DATES
// ----------------------------------------------------
const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  const a = new Date(d1);
  const b = new Date(d2);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const formatHour = (hour) => {
  return `${String(hour).padStart(2, "0")}:00`;
};

// Index du jour de la semaine avec Lundi = 0 et Dimanche = 6
const getIsoDayIndex = (date) => {
  return (date.getDay() + 6) % 7;
};

// Date formatée pour le champ <input type="date">
const formattedInputDate = computed(() => {
  const d = selectedDate.value || currentDate.value;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
});

const onDateInputChange = (event) => {
  const value = event.target.value;
  if (!value) return;
  const [y, m, d] = value.split("-").map(Number);
  const newDate = new Date(y, m - 1, d);
  currentDate.value = newDate;
  selectedDate.value = newDate;
  showSnackbar(`Date sélectionnée : ${formatDateFull(newDate)}`);
};

// ----------------------------------------------------
// NAVIGATION DANS LE TEMPS
// ----------------------------------------------------
const goToToday = () => {
  const today = new Date();
  currentDate.value = today;
  selectedDate.value = today;
  showSnackbar("Affichage réinitialisé à aujourd'hui");
};

const navigate = (direction) => {
  const base = new Date(currentDate.value);

  if (currentView.value === "month") {
    // Naviguer par mois
    base.setMonth(base.getMonth() + direction);
    currentDate.value = base;
  } else if (currentView.value === "week") {
    // Naviguer par semaine (+/- 7 jours)
    base.setDate(base.getDate() + direction * 7);
    currentDate.value = base;
    selectedDate.value = base;
  } else if (currentView.value === "day") {
    // Naviguer par jour (+/- 1 jour)
    base.setDate(base.getDate() + direction);
    currentDate.value = base;
    selectedDate.value = base;
  }
};

// ----------------------------------------------------
// TITRE DE LA PÉRIODE COURANTE
// ----------------------------------------------------
const currentPeriodLabel = computed(() => {
  const refDate = currentDate.value;

  if (currentView.value === "month") {
    const formatter = new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric"
    });
    return formatter.format(refDate);
  }

  if (currentView.value === "week") {
    const startOfWeek = getStartOfWeek(refDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const sameMonth = startOfWeek.getMonth() === endOfWeek.getMonth();
    const sameYear = startOfWeek.getFullYear() === endOfWeek.getFullYear();

    if (sameMonth && sameYear) {
      const monthYear = new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric"
      }).format(startOfWeek);
      return `${startOfWeek.getDate()} – ${endOfWeek.getDate()} ${monthYear}`;
    }

    const startFmt = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short"
    }).format(startOfWeek);
    const endFmt = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(endOfWeek);
    return `${startFmt} – ${endFmt}`;
  }

  // Vue par jour
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return formatter.format(selectedDate.value);
});

// Lundi de la semaine pour une date donnée
const getStartOfWeek = (d) => {
  const date = new Date(d);
  const dayIndex = getIsoDayIndex(date);
  date.setDate(date.getDate() - dayIndex);
  date.setHours(0, 0, 0, 0);
  return date;
};

// ----------------------------------------------------
// CALCUL DE LA VUE MENSUELLE (42 CASES)
// ----------------------------------------------------
const monthCells = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = getIsoDayIndex(firstDayOfMonth); // Nombre de jours du mois précédent

  const today = new Date();
  const cells = [];

  // Date de départ (premier lundi affiché)
  const startDate = new Date(year, month, 1 - startOffset);

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);

    const isCurrentMonth = cellDate.getMonth() === month;
    const isToday = isSameDay(cellDate, today);
    const dayOfWeek = cellDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    cells.push({
      date: cellDate,
      dayNumber: cellDate.getDate(),
      isCurrentMonth,
      isToday,
      isWeekend
    });
  }

  return cells;
});

// ----------------------------------------------------
// CALCUL DE LA VUE HEBDOMADAIRE (7 JOURS)
// ----------------------------------------------------
const weekDaysList = computed(() => {
  const start = getStartOfWeek(currentDate.value);
  const today = new Date();
  const list = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + i);

    const dayName = new Intl.DateTimeFormat("fr-FR", {
      weekday: "short"
    }).format(dayDate);
    const monthShort = new Intl.DateTimeFormat("fr-FR", {
      month: "short"
    }).format(dayDate);

    list.push({
      date: dayDate,
      dayName,
      dayNumber: dayDate.getDate(),
      monthShort,
      isToday: isSameDay(dayDate, today)
    });
  }

  return list;
});


const isCurrentTimeInWorkHours = computed(() => {
  const hour = now.value.getHours();
  return hour >= hoursList[0] && hour <= hoursList[hoursList.length - 1];
});

const currentTimeTopPercent = computed(() => {
  const startHour = hoursList[0];
  const totalHours = hoursList.length;
  const currentHour = now.value.getHours();
  const currentMinutes = now.value.getMinutes();

  const elapsed = currentHour - startHour + currentMinutes / 60;
  return Math.min(Math.max((elapsed / totalHours) * 100, 0), 100);
});

// ----------------------------------------------------
// CALCUL DE LA VUE PAR JOUR
// ----------------------------------------------------
const isDaySelectedToday = computed(() => {
  return isSameDay(selectedDate.value, new Date());
});

const selectedDayNumber = computed(() => {
  return selectedDate.value.getDate();
});

const selectedDayMonthShort = computed(() => {
  return new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(
    selectedDate.value
  );
});

const selectedDayLongName = computed(() => {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(selectedDate.value);
});

const selectedWeekNumber = computed(() => {
  const d = new Date(selectedDate.value);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
});

// ----------------------------------------------------
// ACTIONS ET INTERACTIONS
// ----------------------------------------------------
const selectDay = (date) => {
  selectedDate.value = new Date(date);
  currentDate.value = new Date(date);
  openSlotDialog(date, null);
};

const jumpToDayView = (date) => {
  selectedDate.value = new Date(date);
  currentDate.value = new Date(date);
  currentView.value = "day";
  slotDialog.value.visible = false;
  showSnackbar(`Affichage de la journée du ${formatDateFull(date)}`);
};

const openSlotDialog = (date, hour) => {
  slotDialog.value = {
    visible: true,
    date: new Date(date),
    dateFormatted: formatDateFull(date),
    hour
  };
};

const formatDateFull = (d) => {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(d);
};

const showSnackbar = (text) => {
  snackbar.value.text = text;
  snackbar.value.visible = true;
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
            @click="goToToday"
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
            {{ currentPeriodLabel }}
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

          <!-- Badge statut vide -->
          <v-chip
            color="grey-darken-1"
            variant="flat"
            size="small"
            prepend-icon="mdi-information-outline"
            class="d-none d-sm-inline-flex"
          >
            0 événement planifié
          </v-chip>
        </div>
      </div>
    </v-card>

    <!-- CORPS DU CALENDRIER -->
    <v-card class="calendar-main-card" elevation="2">
      <!-- 1. VUE MENSUELLE -->
      <div v-if="currentView === 'month'" class="view-month">
        <!-- En-tête des jours de la semaine -->
        <div class="month-header-grid">
          <div
            v-for="(dayName, index) in weekDaysFull"
            :key="index"
            class="month-header-cell text-capitalize"
            :class="{ 'is-weekend': index >= 5 }"
          >
            <span class="d-none d-md-inline">{{ dayName }}</span>
            <span class="d-inline d-md-none">{{ dayName.slice(0, 3) }}</span>
          </div>
        </div>

        <!-- Grille des jours (42 cases pour un calendrier uniforme) -->
        <div class="month-days-grid">
          <div
            v-for="(cell, index) in monthCells"
            :key="index"
            class="month-day-cell"
            :class="{
              'is-outside-month': !cell.isCurrentMonth,
              'is-today': cell.isToday,
              'is-selected': isSameDay(cell.date, selectedDate),
              'is-weekend': cell.isWeekend
            }"
            @click="selectDay(cell.date)"
            @dblclick="jumpToDayView(cell.date)"
          >
            <!-- En-tête du jour -->
            <div class="day-cell-header d-flex align-center justify-space-between">
              <span
                class="day-number"
                :class="{ 'today-badge': cell.isToday }"
              >
                {{ cell.dayNumber }}
              </span>
              <span v-if="cell.isToday" class="today-text d-none d-lg-inline">
                Aujourd'hui
              </span>
            </div>

            <!-- Corps vide de la case -->
            <div class="day-cell-body">
              <div class="empty-cell-hint">
                <v-icon size="x-small" class="hint-icon">mdi-plus</v-icon>
                <span class="hint-text">Libre</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. VUE HEBDOMADAIRE -->
      <div v-else-if="currentView === 'week'" class="view-week">
        <div class="week-scroller">
          <!-- En-tête des jours de la semaine -->
          <div class="week-header-grid">
            <div class="time-header-corner">
              <v-icon size="small">mdi-clock-outline</v-icon>
            </div>
            <div
              v-for="(day, index) in weekDaysList"
              :key="index"
              class="week-day-header"
              :class="{
                'is-today': day.isToday,
                'is-selected': isSameDay(day.date, selectedDate)
              }"
              @click="jumpToDayView(day.date)"
              title="Cliquer pour afficher la vue par jour"
            >
              <div class="week-day-name text-capitalize">
                {{ day.dayName }}
              </div>
              <div class="week-day-badge" :class="{ 'today-badge': day.isToday }">
                {{ day.dayNumber }} {{ day.monthShort }}
              </div>
            </div>
          </div>

          <!-- Ligne "Toute la journée" -->
          <div class="all-day-row">
            <div class="all-day-label">Journée</div>
            <div
              v-for="(day, idx) in weekDaysList"
              :key="'allday-' + idx"
              class="all-day-slot"
            >
              <span class="empty-badge">Aucune intervention</span>
            </div>
          </div>

          <!-- Grille des heures -->
          <div class="week-body-grid">
            <!-- Colonne des heures -->
            <div class="time-axis-col">
              <div
                v-for="hour in hoursList"
                :key="'hour-label-' + hour"
                class="time-hour-label"
              >
                {{ formatHour(hour) }}
              </div>
            </div>

            <!-- 7 Colonnes pour chaque jour de la semaine -->
            <div
              v-for="(day, dayIdx) in weekDaysList"
              :key="'week-col-' + dayIdx"
              class="week-day-col"
              :class="{ 'is-today-col': day.isToday }"
            >
              <!-- Ligne de l'heure courante (si c'est aujourd'hui) -->
              <div
                v-if="day.isToday && isCurrentTimeInWorkHours"
                class="current-time-line"
                :style="{ top: currentTimeTopPercent + '%' }"
              >
                <span class="time-dot"></span>
              </div>

              <!-- Créneaux horaires pour ce jour -->
              <div
                v-for="hour in hoursList"
                :key="'slot-' + dayIdx + '-' + hour"
                class="week-time-slot"
                @click="openSlotDialog(day.date, hour)"
              >
                <div class="slot-hover-content">
                  <v-icon size="x-small">mdi-plus</v-icon>
                  <span>Libre ({{ formatHour(hour) }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. VUE PAR JOUR -->
      <div v-else-if="currentView === 'day'" class="view-day">
        <!-- Bannière du jour sélectionné -->
        <div class="day-view-banner pa-4 d-flex flex-wrap align-center justify-space-between ga-3">
          <div class="d-flex align-center ga-3">
            <div class="day-large-number-box text-center" :class="{ 'is-today-box': isDaySelectedToday }">
              <span class="day-large-num">{{ selectedDayNumber }}</span>
              <span class="day-large-month text-uppercase">{{ selectedDayMonthShort }}</span>
            </div>
            <div>
              <h3 class="text-h6 font-weight-bold mb-0 text-capitalize">
                {{ selectedDayLongName }}
              </h3>
              <p class="text-caption text-medium-emphasis mb-0">
                Semaine {{ selectedWeekNumber }} &bull; {{ isDaySelectedToday ? "Aujourd'hui" : "Jour sélectionné" }}
              </p>
            </div>
          </div>

          <!-- Info créneaux disponibles -->
          <div class="d-flex align-center ga-2">
            <v-chip
              color="success"
              variant="tonal"
              size="small"
              prepend-icon="mdi-check-circle-outline"
            >
              Journée libre ({{ hoursList.length }} créneaux disponibles)
            </v-chip>
          </div>
        </div>

        <v-divider />

        <!-- Liste horaire de la journée -->
        <div class="day-schedule-wrapper">
          <div
            v-for="hour in hoursList"
            :key="'day-hour-' + hour"
            class="day-schedule-row"
            @click="openSlotDialog(selectedDate, hour)"
          >
            <!-- Heure -->
            <div class="day-schedule-time">
              <span class="time-text">{{ formatHour(hour) }}</span>
            </div>

            <!-- Contenu de la plage horaire -->
            <div class="day-schedule-slot">
              <div class="empty-slot-card">
                <div class="d-flex align-center justify-space-between w-100">
                  <div class="d-flex align-center ga-2 text-medium-emphasis">
                    <v-icon size="small" color="grey">mdi-wrench-clock-outline</v-icon>
                    <span class="font-weight-medium">Créneau disponible</span>
                  </div>
                  <v-btn
                    variant="text"
                    size="x-small"
                    color="primary"
                    prepend-icon="mdi-plus"
                    class="slot-action-btn"
                  >
                    Sélectionner
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <!-- DIALOGUE INTERACTIF DU CRÉNEAU / DU JOUR -->
    <!-- <v-dialog v-model="slotDialog.visible" max-width="500">
      <v-card class="slot-dialog-card">
        <v-card-item class="bg-primary-lighten-5 py-3">
          <template #prepend>
            <v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>
          </template>
          <v-card-title class="text-subtitle-1 font-weight-bold">
            Détail du créneau
          </v-card-title>
        </v-card-item>

        <v-card-text class="pt-4">
          <div class="mb-3">
            <div class="text-caption text-medium-emphasis">Date sélectionnée</div>
            <div class="text-body-1 font-weight-bold text-capitalize">
              {{ slotDialog.dateFormatted }}
            </div>
          </div>

          <div v-if="slotDialog.hour !== null" class="mb-4">
            <div class="text-caption text-medium-emphasis">Plage horaire</div>
            <div class="text-body-1 font-weight-bold">
              {{ formatHour(slotDialog.hour) }} - {{ formatHour(slotDialog.hour + 1) }}
            </div>
          </div>

          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            icon="mdi-calendar-blank-outline"
            class="mb-2"
          >
            <strong>Aucune maintenance planifiée.</strong>
            <div class="text-caption">
              Ce créneau est actuellement libre dans le calendrier de l'atelier.
            </div>
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-3 justify-end ga-2">
          <v-btn
            v-if="currentView !== 'day'"
            variant="tonal"
            color="primary"
            size="small"
            prepend-icon="mdi-calendar-day"
            @click="jumpToDayView(slotDialog.date)"
          >
            Voir ce jour
          </v-btn>
          <v-btn
            variant="plain"
            size="small"
            @click="slotDialog.visible = false"
          >
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <!-- SNACKBAR DE CONFIRMATION INTERACTION -->
    <v-snackbar
      v-model="snackbar.visible"
      :timeout="2200"
      color="grey-darken-3"
      location="bottom right"
      density="compact"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn
          color="white"
          variant="text"
          size="small"
          @click="snackbar.visible = false"
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
  padding: 5px 10px;
  font-size: 0.85rem;
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

/* ====================================================
   1. VUE MENSUELLE
   ==================================================== */
.month-header-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f4f6f8;
  border-bottom: 1px solid #e5e7eb;
}

.month-header-cell {
  padding: 10px 8px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;

  &.is-weekend {
    color: #9ca3af;
    background-color: #f0f2f5;
  }
}

.month-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(105px, 1fr);
  background-color: #e5e7eb;
  gap: 1px; /* Créer des bordures nettes entre cellules */
}

.month-day-cell {
  background-color: #ffffff;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
  min-height: 105px;
  position: relative;

  &:hover {
    background-color: #f9fbf9;
    box-shadow: inset 0 0 0 1px #81c784;

    .empty-cell-hint {
      opacity: 1;
    }
  }

  &.is-outside-month {
    background-color: #fafafa;
    color: #a0aec0;
  }

  &.is-weekend {
    background-color: #fcfcfc;
  }

  &.is-selected {
    background-color: #f1f8e9;
    box-shadow: inset 0 0 0 2px #4caf50;
  }

  &.is-today {
    background-color: #fafff8;
  }
}

.day-cell-header {
  font-size: 0.85rem;
  font-weight: 600;
}

.day-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: #374151;

  &.today-badge {
    background-color: #2e7d32;
    color: #ffffff !important;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(46, 125, 50, 0.3);
  }
}

.today-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: #2e7d32;
  background-color: #e8f5e9;
  padding: 2px 6px;
  border-radius: 4px;
}

.day-cell-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-cell-hint {
  opacity: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #66bb6a;
  background-color: #e8f5e9;
  padding: 3px 8px;
  border-radius: 12px;
  transition: opacity 0.2s ease;
}

/* ====================================================
   2. VUE HEBDOMADAIRE
   ==================================================== */
.week-scroller {
  overflow-x: auto;
  max-width: 100%;
}

.week-header-grid {
  display: grid;
  grid-template-columns: 70px repeat(7, minmax(110px, 1fr));
  border-bottom: 2px solid #e0e0e0;
  background-color: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 2;
}

.time-header-corner {
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e5e7eb;
  color: #94a3b8;
}

.week-day-header {
  padding: 10px 4px;
  text-align: center;
  border-right: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f1f5f9;
  }

  &.is-today {
    background-color: #f0fdf4;
  }
}

.week-day-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
}

.week-day-badge {
  display: inline-block;
  margin-top: 2px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
  padding: 2px 8px;
  border-radius: 12px;

  &.today-badge {
    background-color: #2e7d32;
    color: #ffffff;
  }
}

.all-day-row {
  display: grid;
  grid-template-columns: 70px repeat(7, minmax(110px, 1fr));
  border-bottom: 1px solid #e5e7eb;
  background-color: #fafbfc;
}

.all-day-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #94a3b8;
  padding: 8px 6px;
  text-align: right;
  border-right: 1px solid #e5e7eb;
}

.all-day-slot {
  padding: 6px;
  border-right: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-badge {
  font-size: 0.7rem;
  color: #9ca3af;
  font-style: italic;
}

.week-body-grid {
  display: grid;
  grid-template-columns: 70px repeat(7, minmax(110px, 1fr));
  position: relative;
}

.time-axis-col {
  border-right: 1px solid #e5e7eb;
  background-color: #ffffff;
}

.time-hour-label {
  height: 54px;
  padding-right: 8px;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  transform: translateY(-8px);
}

.week-day-col {
  border-right: 1px solid #e5e7eb;
  position: relative;
  background-color: #ffffff;

  &.is-today-col {
    background-color: #fafff8;
  }
}

.current-time-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ef4444;
  z-index: 3;
  pointer-events: none;

  .time-dot {
    position: absolute;
    left: -4px;
    top: -4px;
    width: 10px;
    height: 10px;
    background-color: #ef4444;
    border-radius: 50%;
  }
}

.week-time-slot {
  height: 54px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #e8f5e9;

    .slot-hover-content {
      opacity: 1;
    }
  }
}

.slot-hover-content {
  opacity: 0;
  font-size: 0.72rem;
  color: #2e7d32;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 3px;
  transition: opacity 0.15s ease;
}

/* ====================================================
   3. VUE PAR JOUR
   ==================================================== */
.day-view-banner {
  background: linear-gradient(to right, #f8fafc, #ffffff);
  border-bottom: 1px solid #e5e7eb;
}

.day-large-number-box {
  width: 54px;
  height: 54px;
  background-color: #f1f5f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;

  &.is-today-box {
    background-color: #2e7d32;
    color: #ffffff;
    border-color: #2e7d32;

    .day-large-num,
    .day-large-month {
      color: #ffffff;
    }
  }
}

.day-large-num {
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1.1;
  color: #1e293b;
}

.day-large-month {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #64748b;
}

.day-schedule-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px 8px;
}

.day-schedule-row {
  display: flex;
  align-items: stretch;
  min-height: 60px;
  cursor: pointer;
  border-bottom: 1px dashed #e2e8f0;
  padding: 6px 0;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f9fbf9;

    .empty-slot-card {
      border-color: #81c784;
      background-color: #f1f8e9;
    }

    .slot-action-btn {
      opacity: 1;
    }
  }
}

.day-schedule-time {
  width: 90px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16px;
  border-right: 2px solid #e2e8f0;

  .time-text {
    font-size: 0.85rem;
    font-weight: 700;
    color: #475569;
  }
}

.day-schedule-slot {
  flex: 1;
  padding-left: 16px;
  display: flex;
  align-items: center;
}

.empty-slot-card {
  width: 100%;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  padding: 10px 14px;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.slot-action-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

/* ====================================================
   DIALOGUE & CARTES
   ==================================================== */
.calendar-main-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;
}

.slot-dialog-card {
  border-radius: 12px;
}
</style>