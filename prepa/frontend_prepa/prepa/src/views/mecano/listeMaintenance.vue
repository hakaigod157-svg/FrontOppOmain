<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import TableVirtuelle from "@/components/mecano/TableVirtuelle.vue";
import DetailMaintenance from "@/components/mecano/Maintenance/DetailMaintenance.vue";
import CalendarLegend from "@/components/mecano/Calendrier/CalendarLegend.vue";
import { maintStore } from "@/store/Maintenance/maintenance_store";
import { useEtapeStore } from "@/store/Maintenance/etape_store";
import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";
import { getMaintenanceTypeColor } from "@/utils/maintenanceTypeColor";

const searchQuery = ref("");
const loading = ref(false);
const storeMtnce = maintStore();
const storeEtape = useEtapeStore();
const demandeStore = useDemandeMaintenance();
const route = useRoute();
const router = useRouter();
const highlightedMaintenanceCode = computed(() =>
  String(route.query.highlightMaint || "")
);

const dialogVisible = ref(false);
const selectedMaintenance = ref(null);

const clearMaintenanceHighlight = (item) => {
  const code = String(item?.maint_CODE || item?.MAINT_CODE || "");
  if (!code || code !== highlightedMaintenanceCode.value) return;

  const query = { ...route.query };
  delete query.highlightMaint;
  router.replace({ name: "maintenance-liste", query });
};

const headersMaintenance = [
  {
    title: "",
    key: "badge_statut",
    width: "70px",
    sortable: false,
    align: "center",
  },
  { title: "Code", key: "maint_CODE", align: "start" },
  { title: "Date Création", key: "maint_DATECRE" },
  { title: "Demande", key: "maint_DEMANDE" , align: "center" },
  { title: "Classification", key: "maint_CLASSIFICATION", align: "center" },
  { title: "Type", key: "maint_TYPE", align: "center" },
  { title: "Kilométrage", key: "maint_KM" , align: "center"},
  {
    title: "Statut",key: "statut", align:"center", cellProps: ({ item }) => ({
      style: getStatusCellStyle(item),
      class: "statut-col-td",
    }),
  },
  // { title: "Étape en cours", key: "etape_EN_COURS" , width:"150px" },
  { title: "Durée en jours", key: "duree" , align: "center"},
  { title: "Actions", key: "actions", sortable: true, align: "center" },
  // { title: "Modifié par", key: "maint_USERMODIF" , align: "center"},
  // { title: "Date", key: "maint_DATE", align: "center" },
  // { title: "Date Modif.", key: "maint_DATEMODIF" , align: "center"},
  // { title: "Créé par", key: "maint_USERCRE", align: "center" },
  // { title: "Liste", key: "liste" ,width:"150px" },
];

const getStatusText = (item) => {
  if (!item) return "ATTENTE VALIDATION";
  return item.statut || "ATTENTE VALIDATION";
};

const getStatusCellStyle = (item) => {
  const s = String(item?.statut || "").toUpperCase().trim();

  if (s.includes("REFUS") || s.includes("ANNUL")) {
    return {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    };
  }
  if (
    s.includes("TERMIN") ||
    s.includes("CLOTUR") ||
    s.includes("FINI") ||
    s.includes("PRET")
  ) {
    return {
      backgroundColor: "#dcfce7",
      color: "#0b3b17",
    };
  }
  if (s.includes("EN COURS") || s.includes("COURS")) {
    return {backgroundColor: "#ffedd5",color: "#9a3412",
    };
  }
  return {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  };
};

const maintenanceLegendItems = computed(() => {
  const types = [...new Set(
    (demandeStore.typeMaintenance || [])
      .map((entry) => String(entry?.enum_CODE ?? entry?.ENUM_CODE ?? entry?.enum_code ?? entry ?? "").trim())
      .filter(Boolean)
  )].sort((first, second) => first.localeCompare(second));

  return [
    ...types.map((type) => ({
      label: type,
      type: "swatch",
      color: getMaintenanceTypeColor(type, demandeStore.typeMaintenance)
    })),
    // { label: "À valider / en attente", type: "status", color: "#dbeafe", textColor: "#1e40af" },
    // { label: "En cours", type: "status", color: "#ffedd5", textColor: "#9a3412" },
    // { label: "Terminée", type: "status", color: "#dcfce7", textColor: "#0b3b17" },
    // { label: "Refusée / annulée", type: "status", color: "#fee2e2", textColor: "#991b1b" }
  ];
});

const chargerMaintenances = async () => {
  await Promise.all([storeMtnce.getMaintenances(), demandeStore.getTypeMaint()]);
  await Promise.all(
    storeMtnce.maintnces.map(async (item) => {
      const code = item.maint_DEMANDE ;
      if (code && code !== "-") {
        const etape = await storeEtape.getEtapeEnCours(code);
        if (etape) {
          if (etape.statut !== undefined) item.statut = etape.statut;
          if (etape.etape_EN_COURS !== undefined) item.etape_EN_COURS = etape.etape_EN_COURS;
          if (etape.duree !== undefined) item.duree = etape.duree;
        }
      }
    })
  );
};

onMounted(async () => {
  await chargerMaintenances();
});

const handleRowClick = (item) => {
  clearMaintenanceHighlight(item);
  selectedMaintenance.value = item;
  dialogVisible.value = true;
};

const fermerDialog = async () => {
  dialogVisible.value = false;
  selectedMaintenance.value = null;
  await chargerMaintenances();
};

const voir = (item) => {
  clearMaintenanceHighlight(item);
  selectedMaintenance.value = item;
  dialogVisible.value = true;
};
</script>

<template>
  <div class="page-maintenances" :class="{ 'blur-effect': dialogVisible }">
    <v-card-actions density="compact" class="maint__actions">
    <h2>Maintenances</h2>
      <v-spacer />
    </v-card-actions>

    <!-- Search bar -->
    <div class="maintenances__toolbar">
      
      <v-text-field
        v-model="searchQuery"
        placeholder="Rechercher une maintenance (code, demande, type...)"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="outlined"
        hide-details
        clearable
        class="search"
      />
    
  </div>

    <!-- Table -->
    <TableVirtuelle
      :headers="headersMaintenance"
      :items="storeMtnce.maintnces"
      :search="searchQuery"
      :loading="loading || storeMtnce.loading"
      :height="550"
      :highlighted-maintenance-code="highlightedMaintenanceCode"
      :date-cols="['maint_DATE', 'maint_DATECRE', 'maint_DATEMODIF']"
      @click:row="handleRowClick"
    >
      <template v-slot:[`item.badge_statut`]="{ item }">
        <div class="badge-col-wrapper">
          <span
            class="status-badge-indicator"
            :style="{ backgroundColor: getMaintenanceTypeColor(item.maint_TYPE, demandeStore.typeMaintenance) }"
            :title="item.maint_TYPE || 'Type non renseigné'"
          ></span>
        </div>
      </template>

      <template v-slot:[`item.statut`]="{ item }">
        <div class="statut-col-cell" :style="getStatusCellStyle(item)">
          {{ getStatusText(item) }}
        </div>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          icon="mdi-eye-outline"
          size="x-small"
          variant="text"
          color="primary"
          aria-label="Voir la maintenance"
          class="action-btn"
          @click.stop="voir(item)"
        />
      </template>
    </TableVirtuelle>

    <CalendarLegend
      :items="maintenanceLegendItems"
      title="Type et statut"
      label="Légende de la liste des maintenances"
    />

    <v-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :persistent="true"
      width="1610px"
      max-width="100vw"
      height="750px"
      class="maintenance-dialog"
    >
      <DetailMaintenance
        v-if="selectedMaintenance"
        :maintenance="selectedMaintenance"
        @close="fermerDialog"
      />
    </v-dialog>
  </div>
</template>

<style scoped>
.page-maintenances {
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: filter 0.3s ease;
}

.blur-effect {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
}

.maintenances__toolbar {
  display: flex;
  margin-bottom: 4px;
}

.search {
  max-width: 420px;
  font-size: 0.875rem;
}

.search :deep(.v-field) {
  border-radius: 4px;
  box-shadow: none;
}

.search :deep(.v-field__outline) {
  --v-field-border-opacity: 1;
  color: #e0e0e0;
}

.search :deep(.v-field--focused .v-field__outline) {
  color: #1a1a1a;
}

.search :deep(.v-field__prepend-inner > .v-icon) {
  opacity: 0.5;
}

.action-btn {
  color: #6b6b6b;
}

.action-btn:hover {
  color: #1a1a1a;
}

.badge-col-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.status-badge-indicator {
  display: inline-block;
  width: 70px;
  height: 30px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease;
  cursor: pointer;
}

.status-badge-indicator:hover {
  transform: scaleY(1.15) scaleX(1.4);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
}

@keyframes maintenance-row-clignote {
  50% { background-color: #fff3bf; }
}

:deep(.maintenance-calendrier-clignote > td) {
  animation: maintenance-row-clignote 1s ease-in-out infinite;
}

.statut-col-cell {
  width: 100%;
  height: 100%;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  text-align: center;
  padding: 2px 4px;
}

:deep(.statut-col-td) {
  padding: 0 !important;
  text-align: center !important;
}

:deep(.maint_header table > thead > tr > th:first-child),
:deep(.maint_header table > tbody > tr > td:first-child) {
  width: 14px !important;
  min-width: 14px !important;
  max-width: 14px !important;
  padding: 0 4px !important;
  text-align: center !important;
}
</style>

<style>
.maintenance-dialog .v-overlay__scrim {
  backdrop-filter: blur(14px) saturate(130%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(130%) !important;
  background-color: rgba(15, 23, 42, 0.45) !important;
}
</style>
