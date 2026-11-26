<script setup>
import { computed, ref } from "vue";
import TableVirtuelle from "@/components/mecano/TableVirtuelle.vue";
import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";
import EditType from "@/components/mecano/TypeReparation/EditType.vue";

const maintenanceStore = useDemandeMaintenance();
const types = ref([]);
const classifications = ref([]);
const typeSelectionne = ref(null);
const kanban = ref([]);
const loadingTypes = ref(false);
const loadingEtapes = ref(false);
const rechercheType = ref("");
const edition = ref(null);

const headers = [
  { title: "Type de maintenance", key: "type", width: "32%" },
  { title: "Étapes disponibles", key: "description" },
  { title: "Sélection", key: "selection", width: "150px", align: "center" },
];

const nombreTypesVisibles = computed(() => {
  const query = rechercheType.value.trim().toLowerCase();
  if (!query) return types.value.length;
  return types.value.filter((item) =>
    `${item.type} ${item.description} ${item.selection}`.toLowerCase().includes(query)
  ).length;
});
const hauteurTableau = computed(() => loadingTypes.value
  ? 230
  : Math.max(80, nombreTypesVisibles.value * 50 + 40)
);

const lireCode = (item) => String(typeof item === "string"
  ? item
  : item?.enum_CODE ??  item?.enum_code ?? item?.enum_VALEUR ?? item?.maint_TYPE ?? ""
).trim();

const chargerTypes = async () => {
  loadingTypes.value = true;
  const liste = await maintenanceStore.getTypeMaint();
  const typesUniques = new Map();
  for (const item of (Array.isArray(liste) ? liste : maintenanceStore.typeMaintenance || [])) {
    const type = lireCode(item);
    if (!type) continue;
    typesUniques.set(type.toUpperCase(), {
      type,
      description: type.toUpperCase() === "PONCTUELLE"
        ? "Étapes regroupées par classification"
        : "Étapes associées à ce type de maintenance",
      selection: "Afficher les étapes",
    });
  }
  types.value = [...typesUniques.values()];
  loadingTypes.value = false;
};

const chargerClassifications = async () => {
  const liste = await maintenanceStore.getClassification();
  const source = Array.isArray(liste) ? liste : maintenanceStore.enumerations || [];
  classifications.value = [...new Set(source.map(lireCode).filter(Boolean))];
};

const suffixeEnumeration = (type, classification) => {
  if (type.toUpperCase() === "PONCTUELLE") return classification;
  return type.toUpperCase() === "PREVENTIVE" ? "PREVENTIVE" : type;
};

const chargerEnumerationEtapes = async (prefixe, type, classification) => {
  const valeur = `${prefixe}${suffixeEnumeration(type, classification)}`;
  const liste = await maintenanceStore.getEnumeration(valeur);
  return Array.isArray(liste) ? liste : [];
};

const selectionnerType = async (type) => {
  typeSelectionne.value = type;
  kanban.value = [];
  classifications.value = [];
  loadingEtapes.value = true;
  if (type.type.trim().toUpperCase() === "PONCTUELLE") {
    await chargerClassifications();
  } else {
    classifications.value = [type.type];
  }
  kanban.value = await Promise.all(classifications.value.map(async (classification) => {
    const [prepa, real] = await Promise.all([
      chargerEnumerationEtapes("ETAPE_PREPA_", type.type, classification),
      chargerEnumerationEtapes("ETAPE_REAL_", type.type, classification),
    ]);
    return { classification, prepa: [...prepa], real: [...real] };
  }));
  loadingEtapes.value = false;
};

const labelEtape = (etape, nature) => nature === "prepa"
  ? etape?.maint_ETAPE_LIGNE ?? etape?.etape_LIBELLE ??  etape?.enum_CODE ?? etape?.enum_VALEUR ?? etape?.etape_CODE ?? "Étape"
  : etape?.maint_INTERV_REAL ?? etape?.etape_LIBELLE ??  etape?.enum_CODE ?? etape?.enum_VALEUR ?? etape?.etape_CODE ?? "Étape";

chargerTypes();
</script>

<template>
  <div class="page-reparations">
    <EditType
      v-if="edition"
      :type-maintenance="edition.type"
      :classification-selectionnee="edition.classification"
      @close="edition = null"
    />
    <template v-else>
    <v-card-actions density="compact" class="page-actions">
      <h1>TYPES DE MAINTENANCES</h1>
      <v-spacer />
    </v-card-actions>

    <div class="types-section">
      <div class="types-toolbar">
        <v-text-field
          v-model="rechercheType"
          placeholder="Rechercher un type de maintenance"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          class="search-types"
        />
        <span class="types-count">{{ types.length }} type(s)</span>
      </div>
      <TableVirtuelle
        :headers="headers"
        :items="types"
        :search="rechercheType"
        :loading="loadingTypes"
        :height="hauteurTableau"
        :selected-item-id="typeSelectionne?.type"
        selected-item-key="type"
        @click:row="selectionnerType"
      >
        <template #item.type="{ item }">
          <div class="type-cell">
            <strong>{{ item.type }}</strong>
          </div>
        </template>
        <template #item.selection="{ item }">
          <span class="selection-label" :class="{ selected: item.type === typeSelectionne?.type }">
            {{ item.type === typeSelectionne?.type ? "SÉLÉCTIONNÉ" : item.selection }}
          </span>
        </template>
      </TableVirtuelle>
    </div>

    <section v-if="typeSelectionne" class="details-section">
      <!-- <div class="selected-type">
        <span>Type de maintenance sélectionné</span>
        <strong>{{ typeSelectionne.type }}</strong>
      </div> -->

      <div v-if="loadingEtapes" class="kanban kanban-skeleton" aria-label="Chargement des étapes">
        <section
          v-for="classification in (classifications.length ? classifications : [typeSelectionne.type])"
          :key="`skeleton-${classification}`"
          class="classification"
        >
          <v-skeleton-loader type="text" class="skeleton-title" />
          <div class="lanes">
            <section v-for="lane in 2" :key="lane" class="lane">
              <header class="lane-heading">
                <v-skeleton-loader type="text" class="skeleton-lane-heading" />
                <v-skeleton-loader type="text" class="skeleton-count" />
              </header>
              <div v-for="ligne in 3" :key="ligne" class="skeleton-step">
                <v-skeleton-loader type="text" />
              </div>
            </section>
          </div>
        </section>
      </div>
      <div v-else-if="!kanban.length" class="empty-state">
        Aucune classification ou étape disponible pour ce type.
      </div>
      <div v-else class="kanban">
        <section v-for="colonne in kanban" :key="colonne.classification" class="classification">
          <header class="classification-heading">
            <h3>{{ colonne.classification }}</h3>
            <v-btn icon="mdi-pencil" size="small" variant="text" color="success" :aria-label="`Modifier ${colonne.classification}`" @click="edition = { type: typeSelectionne.type, classification: colonne.classification }" />
          </header>
          <div class="lanes">
            <section class="lane lane-prepa">
              <header class="lane-heading">
                <strong>Étape</strong>
                <span>{{ colonne.prepa.length }}</span>
              </header>
              <div v-for="(etape, index) in colonne.prepa" :key="index" class="step-card">
                <span class="step-dot"></span>{{ labelEtape(etape, 'prepa') }}
              </div>
              <p v-if="!colonne.prepa.length" class="lane-empty">Aucune étape enregistrée</p>
            </section>

            <section class="lane lane-technique">
              <header class="lane-heading">
                <strong>Technique</strong>
                <span>{{ colonne.real.length }}</span>
              </header>
              <div v-for="(etape, index) in colonne.real" :key="index" class="step-card">
                <span class="step-dot"></span>{{ labelEtape(etape, 'real') }}
              </div>
              <p v-if="!colonne.real.length" class="lane-empty">Aucune étape enregistrée</p>
            </section>
          </div>
        </section>
      </div>
    </section>
    </template>
  </div>
</template>

<style scoped>
.page-reparations { display: flex; flex-direction: column; gap: 8px; }
.page-actions { padding: 0; }
.page-actions h2 { margin: 0; font-size: 1.1rem; font-weight: 600; }
.types-section { margin-bottom: 8px; }
.types-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px; }
.search-types { max-width: 420px; font-size: .875rem; }
.search-types :deep(.v-field) { border-radius: 4px; box-shadow: none; }
.types-count { color: #757575; font-size: .82rem; white-space: nowrap; }
.type-cell { display: flex; align-items: center; min-height: 43px; line-height: 1.3; }
.type-cell strong { color: #263238; font-size: .85rem; font-weight: 600; }
.selection-label { color: #526057; font-size: .76rem; }
.selection-label.selected { color: #144f0e; font-weight: 700; }
.types-section :deep(.maint_header tbody tr.v-data-table__tr) { cursor: pointer; }
.types-section :deep(.maint_header tbody tr.v-data-table__tr:hover) { background: #f4f7f4; }
.types-section :deep(.maint_header tbody tr.v-data-table__tr > td) { height: 50px !important; padding-left: 15px !important; }
.types-section :deep(.maint_header tbody tr:not(.v-data-table__tr)) { display: none; }
.details-section { display: flex; flex-direction: column; gap: 8px; }
.selected-type { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 42px; padding: 8px 12px; border: 1px solid #dfe6e0; border-left: 3px solid #2e7d32; border-radius: 4px; background: #f5f7f5; }
.selected-type span { color: #526057; font-size: .82rem; }
.selected-type strong { color: #24402a; font-size: .9rem; font-weight: 700; }
.kanban { display: flex; align-items: flex-start; gap: 12px; overflow-x: auto; }
.classification { flex: 0 0 430px; padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px; background: #fafafa; }
.classification h3 { margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0; font-size: .95rem; font-weight: 600; }
.classification-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.classification-heading h3 { flex: 1; }
.lanes { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.lane { min-width: 0; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px; background: white; }
.lane-heading { display: flex; justify-content: space-between; align-items: center; min-height: 34px; margin: -8px -8px 8px; padding: 6px 8px; border-bottom: 1px solid #e0e0e0; color: #424242; font-size: .76rem; }
.lane-prepa .lane-heading { border-bottom-color: #c9ddca; background: #edf5ed; color: #285b2d; }
.lane-technique .lane-heading { border-bottom-color: #cbd5e1; background: #eef2f7; color: #3e536d; }
.lane-heading span { color: #757575; font-weight: 400; }
.step-card { margin-bottom: 7px; padding: 9px; border: 1px solid #e0e0e0; border-left: 3px solid #68996b; border-radius: 4px; background: white; font-size: .82rem; line-height: 1.35; }
.lane-technique .step-card { border-left-color: #7186a0; }
.lane-empty { padding: 8px 0; color: #757575; font-size: .8rem; }
.kanban-skeleton .skeleton-title { width: 45%; margin-bottom: 12px; }
.kanban-skeleton .skeleton-lane-heading { width: 70%; }
.kanban-skeleton .skeleton-count { width: 18px; }
.kanban-skeleton .skeleton-step { min-height: 37px; margin-bottom: 7px; padding: 9px; border: 1px solid #e0e0e0; border-left: 3px solid #cfd8dc; border-radius: 4px; }
.kanban-skeleton :deep(.v-skeleton-loader__text) { margin: 0; }
.empty-state { display: flex; align-items: center; gap: 10px; min-height: 70px; color: #757575; font-size: .88rem; }
@media (max-width: 700px) { .classification { flex-basis: 360px; } .lanes { grid-template-columns: 1fr; } }
</style>
