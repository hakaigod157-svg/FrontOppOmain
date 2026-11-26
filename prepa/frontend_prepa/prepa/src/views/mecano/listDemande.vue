<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

import TableVirtuelle from "@/components/mecano/TableVirtuelle.vue";
import TypeMaintenanceSelector from "@/components/mecano/Demande/TypeMaintenanceSelector.vue";
import FormDialog from "@/components/mecano/Demande/FormDialog.vue";
import EditDialog from "@/components/mecano/Demande/EditDialog.vue";
import ValidationDemande from "@/components/mecano/Demande/ValidationDemande.vue";
import DetailMaintenance from "@/components/mecano/Maintenance/DetailMaintenance.vue";
// import CalendarLegend from "@/components/mecano/Calendrier/CalendarLegend.vue";

import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";
import { useEtapeStore } from "@/store/Maintenance/etape_store";
import { maintStore } from "@/store/Maintenance/maintenance_store";
import { getMaintenanceTypeColor } from "@/utils/maintenanceTypeColor";

const searchQuery = ref("");
const route = useRoute();
const router = useRouter();
const store = useDemandeMaintenance();
const storeEtape = useEtapeStore();
const storeMtnce = maintStore();

const showForm = ref(false);
const showTypeSelector = ref(false);
const selectedType = ref("");
const preGeneratedCode = ref("");
const showEdit = ref(false);
const editingCode = ref("");
const editingDemande = ref(null);
const ponctuelValider = ref(false);
const demandeAValider = ref(null);
const modeValidation = ref("valider");
const dialogVisibleDetail = ref(false);
const selectedDemande = ref(null);
const demandeClignotante = ref("");

const nouvelleDemande = () => {
  showTypeSelector.value = true;
};

const onTypeSelected = ({ type, code }) => {
  selectedType.value = type;
  preGeneratedCode.value = code;
  showForm.value = true;
};

// Le raccourci « Nouvelle demande » du dashboard arrive ici avec nouvelle=1.
watch(
  () => route.query.nouvelle,
  async (value) => {
    if (value !== "1") return;
    showTypeSelector.value = true;
    const query = { ...route.query };
    delete query.nouvelle;
    await router.replace({ query });
  },
  { immediate: true }
);

const chargerDemandes = async () => {
  await Promise.all([
    store.fetchDemandes(),
    store.getTypeMaint(),
    storeMtnce.getMaintenances(),
  ]);

  await Promise.all(
    store.demandes.map(async (item) => {
      const etat = Number(item.demande_ETAT);
      item.etapeEnCoursLibelle = null;

      if (etat === 99) {
        item.statut = "TERMINÉE";
      } else if (etat === 2) {
        item.statut = "EN COURS";
        const maintenance = (storeMtnce.maintnces || []).find(
          (m) => m.maint_DEMANDE === item.demande_CODE
        );

        if (maintenance?.maint_CODE) {
          const etapeMaint = await storeEtape.getEtapeMaint(maintenance.maint_CODE);
          if (etapeMaint) {
            item.etapeEnCoursLibelle =
              etapeMaint.etape_EN_COURS ||
              etapeMaint.maint_ETAPE_LIGNE ||
              etapeMaint.etape_LIBELLE ||
              null;
          }
        }
      } else if (etat === 3) {
        item.statut = "REFUSÉE";
      } else {
        item.statut = "ATTENTE VALIDATION";
      }
    })
  );
};

const onSaved = async (code) => {
  showForm.value = false;
  showEdit.value = false;
  showTypeSelector.value = false;
  selectedType.value = "";
  preGeneratedCode.value = "";
  searchQuery.value = "";
  demandeClignotante.value = "";
  await chargerDemandes();
  if (code) {
    await nextTick();
    demandeClignotante.value = String(code);
  }
};

const onValidated = () => {
  window.location.reload();
};

const headersDemandes = [
  {
    title: "",
    key: "badge_statut",
    width: "70px",
    sortable: true,
    align: "center",
  },
  { title: "Code", key: "demande_CODE" },
  { title: "Date Création", key: "demande_DATE_CRE" },
  // { title: "Date", key: "demande_DATE" },
  { title: "Voiture", key: "demande_VOITURE" },
  { title: "KM", key: "demande_KM" },
  { title: "Marque", key: "demande_MARQUE" },
  { title: "Type", key: "demande_TYPE" },
  { title: "Auteur", key: "demande_AUTEUR" ,width:"90px"},
  { title: "Description", key: "demande_DESCR" , width:"500px" },
  {
    title: "État", key: "statut", align: "center", width: "160px", cellProps: ({ item }) => ({
      style: getStatusCellStyle(item),
      class: "statut-col-td",
    }),
  },
  // { title: "Étape en cours", key: "etape_EN_COURS" , width:"150px"},
  // { title: "Créé par", key: "demande_USER_CRE" },
  // { title: "Date Modif.", key: "demande_DATE_MODIF" },
  // { title: "Modifié par", key: "demande_USER_MODIF" },
  {
  title: "Actions",
  key: "actions",
  width: "180px",   
  sortable: false,
  align: "center",  
},
];

const getStatusText = (item) => {
  const etat = Number(item?.demande_ETAT);
  if (etat === 99) return "TERMINÉE";
  if (etat === 3) return "REFUSÉE";
  if (etat === 2) return "EN COURS";
  return item?.statut || "ATTENTE VALIDATION";
};

const getStatusCellStyle = (item) => {
  const s = String(getStatusText(item) || "").toUpperCase().trim();
  const etat = Number(item?.demande_ETAT);

  if (s.includes("REFUS") || s.includes("ANNUL") || etat === 3) {
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
  if (s.includes("EN COURS") || s.includes("COURS") || etat === 2) {
    return {
      backgroundColor: "#ffedd5",
      color: "#9a3412",
    };
  }
  return {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  };
};

const demandeLegendItems = computed(() => {
  const types = [...new Set(
    (store.typeMaintenance || [])
      .map((entry) => String(entry?.enum_CODE ?? entry ?? "").trim())
      .filter(Boolean)
  )].sort((first, second) => first.localeCompare(second));

  return [
    ...types.map((type) => ({
      label: type,
      type: "swatch",
      color: getMaintenanceTypeColor(type, store.typeMaintenance)
    })),
    // { label: "À valider / en attente", type: "status", color: "#dbeafe", textColor: "#1e40af" },
    // { label: "En cours", type: "status", color: "#ffedd5", textColor: "#9a3412" },
    // { label: "Terminée", type: "status", color: "#dcfce7", textColor: "#0b3b17" },
    // { label: "Refusée / annulée", type: "status", color: "#fee2e2", textColor: "#991b1b" }
  ];
});

const ETAT_EN_ATTENTE = 1;
const ETAT_REFUSEE = 3;

const getEtat = (item) => item?.demande_ETAT ?? item?.DEMANDE_ETAT;
const estEnAttente = (item) => {
  const etat = Number(getEtat(item));
  if (etat === ETAT_EN_ATTENTE) return true;
  const s = String(item?.statut || "").toUpperCase().trim();
  if (s.includes("CRE") || s.includes("ATTENTE")) return true;
  return false;
};
const estRefusee = (item) => {
  const etat = Number(getEtat(item));
  if (etat === ETAT_REFUSEE) return true;
  const s = String(item?.statut || "").toUpperCase().trim();
  return s.includes("REFUS") || s.includes("ANNUL");
};
const dmdValider = (item) => !estEnAttente(item);

const validerDemande = (item) => {
  if (!item) return;
  demandeAValider.value = item;
  modeValidation.value = "valider";
  ponctuelValider.value = true;
};


const refuserDemande = (item) => {
  if (!item) return;
  demandeAValider.value = item;
  modeValidation.value = "refuser";
  ponctuelValider.value = true;
};

const consulterRefus = (item) => {
  if (!item) return;
  demandeAValider.value = item;
  modeValidation.value = "consulter";
  ponctuelValider.value = true;
};

// const deleteDmd = async (code) => {
//   if (code) {
//     await store.deleteDemande(code);
//   }
//   await chargerDemandes();
// };




const modifierDemande = (itemOrCode) => {
  if (!itemOrCode) return;
  if (typeof itemOrCode === "object") {
    editingCode.value = itemOrCode.demande_CODE || itemOrCode.DEMANDE_CODE || "";
    editingDemande.value = itemOrCode;
  } else {
    editingCode.value = String(itemOrCode);
    editingDemande.value = null;
  }
  showEdit.value = true;
};

const handleRowClick = (item) => {
  arreterClignotement(item);
  selectedDemande.value = item;
  if (estEnAttente(item)) {
    dialogVisibleDetail.value = false;
    return;
  }
  if (estRefusee(item)) {
    consulterRefus(item);
    return;
  }
  dialogVisibleDetail.value = true;
};

const arreterClignotement = (item) => {
  const code = item?.demande_CODE || item?.DEMANDE_CODE;
  if (
    code &&
    String(code) === String(demandeClignotante.value)
  ) {
    demandeClignotante.value = "";
  }
};

const fermerDialogDetail = () => {
  dialogVisibleDetail.value = false;
  selectedDemande.value = null;
  chargerDemandes();
};

onMounted(async () => {
  await chargerDemandes();
});
</script>

<template>
  <div class="page-demandes" :class="{ 'blur-effect': dialogVisibleDetail }">

    <v-card-actions density="compact" class="demandes__actions">
      <h2>DEMANDES</h2>
      <v-spacer />
      <v-btn
        variant="flat"
        color="#144f0e"
        class="boutonNvDmd"
        density="compact"
        prepend-icon="mdi-plus"
        :loading="store.loading"
        :disabled="store.loading"
        @click="nouvelleDemande"
      >
         NOUVELLE DEMANDE
      </v-btn>
      <TypeMaintenanceSelector
        v-model="showTypeSelector"
        @type-selected="onTypeSelected"
      />
      <FormDialog
        v-model="showForm"
        :type-demande="selectedType"
        :pre-generated-code="preGeneratedCode"
        @saved="onSaved"
      />
      <EditDialog
        v-model="showEdit"
        :code="editingCode"
        :demande="editingDemande"
        @saved="onSaved"
      />
    </v-card-actions>

    <!-- Search bar -->
    <div class="demandes__toolbar">
      <v-text-field
        v-model="searchQuery"
        placeholder="Code, auteur, immatriculation, date, marque..."
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
      :headers="headersDemandes"
      :items="store.demandes"
      :maintenance-types="store.typeMaintenance"
      :search="searchQuery"
      :highlighted-demand-code="demandeClignotante"
      :loading="store.loading"
      :height="550"
      :long-text-cols="['demande_DESCR']"
      :date-cols="[
        'demande_DATE',
        'demande_DATE_CRE',
        'demande_DATE_MODIF',
      ]"
      @click:row="handleRowClick"
    >
      <template v-slot:[`item.badge_statut`]="{ item }">
        <div class="badge-col-wrapper">
          <span
            class="status-badge-indicator"
            :style="{ backgroundColor: getMaintenanceTypeColor(item.demande_TYPE, store.typeMaintenance) }"
            :title="item.demande_TYPE || 'Type non renseigné'"
          ></span>
        </div>
      </template>

      <!-- Colonne État -->
      <template v-slot:[`item.statut`]="{ item }">
        <div class="statut-col-cell" :style="getStatusCellStyle(item)">
          <span>{{ getStatusText(item) }}</span>
          <span v-if="getStatusText(item) === 'EN COURS' && item.etapeEnCoursLibelle" class="etape-en-cours-label">
            ({{ item.etapeEnCoursLibelle }})
          </span>
        </div>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <div class="d-flex align-center justify-center ga-1">
          <template v-if="estEnAttente(item)">
            <v-btn icon size="small" variant="text" color="success" title="Valider"
              @click.stop="arreterClignotement(item); validerDemande(item)">
              <v-icon size="20">mdi-check-circle-outline</v-icon>
            </v-btn>

            <v-btn icon size="small" variant="text" color="error" title="Refuser"
              @click.stop="arreterClignotement(item); refuserDemande(item)">
              <v-icon size="20">mdi-close-circle-outline</v-icon>
            </v-btn>

            <v-btn icon size="small" variant="text" color="warning" title="Modifier"
              @click.stop="arreterClignotement(item); modifierDemande(item)">
              <v-icon size="20">mdi-pencil</v-icon>
            </v-btn>
          </template>

          <template v-else-if="estRefusee(item)">
            <v-btn icon size="small" variant="text" color="error" title="Voir le motif du refus"
              @click.stop="consulterRefus(item)">
              <v-icon size="20">mdi-eye-outline</v-icon>
            </v-btn>
          </template>

          <template v-else>
            <v-btn icon size="small" variant="text" color="primary" title="Voir la maintenance"
              @click.stop="handleRowClick(item)">
              <v-icon size="20">mdi-eye-outline</v-icon>
            </v-btn>
          </template>
        </div>
      </template>
    </TableVirtuelle>

    <!-- <CalendarLegend
      :items="demandeLegendItems"
      title="Type et statut"
      label="Légende de la liste des demandes"
    /> -->

    <!-- Dialog détail demande / étapes avec background blur -->
    <v-dialog
      v-if="dialogVisibleDetail"
      v-model="dialogVisibleDetail"
      :persistent="true"
      
      class="maintenance-dialog"
    >
      <DetailMaintenance
      
        v-if="selectedDemande"
        :maintenance="selectedDemande"
        @close="fermerDialogDetail"
      />
    </v-dialog>

    <!-- Modal de confirmation : sert à la fois pour VALIDER et REFUSER -->
    <ValidationDemande
      v-model="ponctuelValider"
      :demande="demandeAValider"
      :mode="modeValidation"
      @saved="onValidated"
      @validated="onValidated"
      @refused="onValidated"
    />
  </div>
</template>




<style scoped>
.page-demandes {
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

.demandes__actions {
  display: flex;
  justify-content: flex-end;
  padding: 0;
}

.boutonNvDmd {
  min-height: 28px;
  padding-inline: 12px;
  border: 1px solid #144f0e;
  border-radius: 5px;
  box-shadow: none;
  /* font-size: 12px; */
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}

.demandes__toolbar {
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

.badge-col-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.status-badge-indicator {
  display: inline-block;
  width: 120px;
  height: 30px;
  border-radius: 6px;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  text-align: center;
  padding: 2px 4px;
  line-height: 1.3;
}

.etape-en-cours-label {
  max-width: 140px;
  margin-top: 1px;
  overflow: hidden;
  font-size: 9px;
  font-weight: 500;
  opacity: 0.85;
  text-overflow: ellipsis;
  text-transform: none;
  white-space: nowrap;
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
@keyframes demande-clignote {
  0%, 100% { background-color: #ffffff; }
  50% { background-color: #b9efb9; }
}

.nouvelle-demande-clignote > td {
  animation: demande-clignote 1.5s ease-in-out infinite;
}
</style>

<style>
/* Non-scopé pour cibler l'overlay Vuetify téléporté sur le body */
.maintenance-dialog .v-overlay__scrim {
  backdrop-filter: blur(14px) saturate(130%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(130%) !important;
  background-color: rgba(15, 23, 42, 0.45) !important;
}
</style>
