<script setup>
import { ref, onMounted } from "vue";
import TableVirtuelle from "@/components/mecano/TableVirtuelle.vue";
import DetailMaintenance from "@/components/mecano/Maintenance/DetailMaintenance.vue";
import { maintStore } from "@/store/Maintenance/maintenance_store";
import { useEtapeStore } from "@/store/Maintenance/etape_store";

const searchQuery = ref("");
const loading = ref(false);
const storeMtnce = maintStore();
const storeEtape = useEtapeStore();

const dialogVisible = ref(false);
const selectedMaintenance = ref(null);

const headersMaintenance = [
  {
    title: "",
    key: "badge_statut",
    width: "14px",
    sortable: false,
    align: "center",
  },
  { title: "Code", key: "maint_CODE", align: "start" },
  // { title: "Date", key: "maint_DATE", align: "center" },
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
  { title: "Étape en cours", key: "etape_EN_COURS" , width:"150px" },
  // { title: "Liste", key: "liste" ,width:"150px" },
  { title: "Durée en jours", key: "duree" , align: "center"},
  { title: "Créé par", key: "maint_USERCRE", align: "center" },
  { title: "Date Modif.", key: "maint_DATEMODIF" , align: "center"},
  { title: "Modifié par", key: "maint_USERMODIF" , align: "center"},
  { title: "Actions", key: "actions", sortable: true, align: "center" },
];

const getStatusColor = (item) => {
  if (!item) return "#1976d2";
  const s = String(item.statut || "").toUpperCase().trim();

  if (s.includes("TERMIN") ||
    s.includes("CLOTUR") ||
    s.includes("FINI") ||
    s.includes("PRET")
  ) {
    return "#0b3b17";
  }

  if (s.includes("EN COURS") || s.includes("COURS")) {return "#f57c00";
  }

  return "#1976d2";
};

const getStatusTooltip = (item) => {
  if (!item) return "";
  const s = String(item.statut || "").toUpperCase().trim();
  if (
    s.includes("TERMIN") ||
    s.includes("CLOTUR") ||
    s.includes("FINI") ||
    s.includes("PRET")
  ) {return item.statut || "Prêt à terminer";
  }
  if (s.includes("EN COURS") || s.includes("COURS")) return "Demande en cours";
  return "Attente validation";
};

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

const chargerMaintenances = async () => {
  await storeMtnce.getMaintenances();
  await Promise.all(
    storeMtnce.maintnces.map(async (item) => {
      const code = item.maint_DEMANDE;
      if (code && code !== "-") {
        const etape = await storeEtape.getEtapeEnCours(code);
        if (etape) {
          // Ne copier QUE les champs étape, sans écraser les champs maintenance
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
  selectedMaintenance.value = item;
  dialogVisible.value = true;
};

const fermerDialog = async () => {
  dialogVisible.value = false;
  selectedMaintenance.value = null;
  await chargerMaintenances();
};

const voir = (item) => {
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
      :date-cols="['maint_DATE', 'maint_DATECRE', 'maint_DATEMODIF']"
      @click:row="handleRowClick"
    >
      <template v-slot:[`item.badge_statut`]="{ item }">
        <div class="badge-col-wrapper">
          <span
            class="status-badge-indicator"
            :style="{ backgroundColor: getStatusColor(item) }"
            :title="getStatusTooltip(item)"
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

    <v-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :persistent="true"
      width="1610px"
      max-width="100vw"
      height="720px"
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
  width: 5px;
  height: 22px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease;
  cursor: pointer;
}

.status-badge-indicator:hover {
  transform: scaleY(1.15) scaleX(1.4);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
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