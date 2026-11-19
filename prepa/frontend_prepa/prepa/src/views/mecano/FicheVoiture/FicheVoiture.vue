<script setup>
import { computed, ref } from "vue";
import TableVirtuelle from "@/components/mecano/TableVirtuelle.vue";
import SelecteurAffichage from "@/components/mecano/FicheVoiture/SelecteurAffichage.vue";
import AjoutVoiture from "@/components/mecano/FicheVoiture/AjoutVoiture.vue";
import EditVoiture from "@/components/mecano/FicheVoiture/EditVoiture.vue";
import DetailVehicule from "@/components/mecano/FicheVoiture/DétailVéhicule.vue";

import imageDamas from "@/assets/damas.jpg";
import imageBt50 from "@/assets/bt50.jpeg";
import imageGeely from "@/assets/geely.jpeg";

const searchQuery = ref("");
const viewMode = ref("table"); 
const filtreMarque = ref(null);
const filtreAnnee = ref(null);
const filtreStatut = ref(null);
const dateHeure = ref(new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }));

const selectedVehicule = ref(null);
const panelVisible = ref(false);
const loadingDetails = ref(false);
const ajoutOuvert = ref(false);
const editionOuverte = ref(false);
const detailPleinEcran = ref(false);

const selectionRequestId = ref(0);

const vehicules = ref([
  {
    id: 1,
    voiture_IMMAT: "2099 TBP",
    voiture_MARQUE: "CHEVROLET",
    voiture_ANNEE: 2008,
    voiture_MODELE: "DAMAS",
    voiture_KM: 345879,
    image: imageDamas,
    statut: "Actif",
    historique: [
      {
        id: 1,
        type: "Maintenance moteur",
        date: "15/10/2026",
        km: 345000,
        description: "Révision du moteur",
      },
      {
        id: 2,
        type: "Entretien périodique",
        date: "12/07/2026",
        km: 340000,
        description: "Entretien général",
      },
    ],
  },
  {
    id: 2,
    voiture_IMMAT: "4947 TBF",
    voiture_MARQUE: "MAZDA",
    voiture_ANNEE: 2009,
    voiture_MODELE: "BT-50",
    voiture_KM: 348000,
    image: imageBt50,
    statut: "Actif",
    historique: [
      {
        id: 1,
        type: "Maintenance pneumatique",
        date: "08/09/2026",
        km: 153500,
        description: "Remplacement des pneumatiques",
      },
    ],
  },
  {
    id: 5,
    voiture_IMMAT: "4947 TBF",
    voiture_MARQUE: "MAZDA",
    voiture_ANNEE: 2009,
    voiture_MODELE: "BT-50",
    voiture_KM: 348000,
    image: imageBt50,
    statut: "Actif",
    historique: [
      {
        id: 1,
        type: "Maintenance pneumatique",
        date: "08/09/2026",
        km: 153500,
        description: "Remplacement des pneumatiques",
      },
    ],
  },
  {
    id: 6,
    voiture_IMMAT: "4947 TBF",
    voiture_MARQUE: "MAZDA",
    voiture_ANNEE: 2009,
    voiture_MODELE: "BT-50",
    voiture_KM: 348000,
    image: imageBt50,
    statut: "Actif",
    historique: [
      {
        id: 1,
        type: "Maintenance pneumatique",
        date: "08/09/2026",
        km: 153500,
        description: "Remplacement des pneumatiques",
      },
    ],
  },
  {
    id: 3,
    voiture_IMMAT: "2997 TBS",
    voiture_MARQUE: "GEELY",
    voiture_ANNEE: 2017,
    voiture_MODELE: "GX3",
    voiture_KM: 98500,
    image: imageGeely,
    statut: "Inactif",
    historique: [],
  },
]);

const vehiculesFiltres = computed(() => {
  const normaliser = (value) => String(value ?? "").trim().toLocaleLowerCase("fr");
  const query = normaliser(searchQuery.value);

  return vehicules.value.filter((vehicule) => {
    const correspondRecherche = !query || [
      vehicule.voiture_IMMAT,
      vehicule.voiture_MARQUE,
      vehicule.voiture_ANNEE,
      vehicule.voiture_MODELE,
      vehicule.voiture_KM,
      vehicule.statut,
    ].some((value) => normaliser(value).includes(query));

    return correspondRecherche &&
      (!filtreMarque.value || normaliser(vehicule.voiture_MARQUE) === normaliser(filtreMarque.value)) &&
      (!filtreAnnee.value || Number(vehicule.voiture_ANNEE) === Number(filtreAnnee.value)) &&
      (!filtreStatut.value || normaliser(vehicule.statut) === normaliser(filtreStatut.value));
  });
});
const marquesDisponibles = computed(() => [...new Set(vehicules.value.map((v) => v.voiture_MARQUE).filter(Boolean))]);
const anneesDisponibles = computed(() => [...new Set(vehicules.value.map((v) => v.voiture_ANNEE).filter(Boolean))].sort((a, b) => b - a));

const headersVehicules = [
  { title: "Immatriculation", key: "voiture_IMMAT" },
  { title: "Marque", key: "voiture_MARQUE" },
  { title: "Année", key: "voiture_ANNEE" },
  { title: "Modèle", key: "voiture_MODELE" },
  { title: "KM", key: "voiture_KM" },
  { title: "État",key: "statut",align: "center",},
  { title: "Action", key: "actions", align: "center", sortable: false },
];

const getStatusCellStyle = (item) => {
  if (item?.statut === "Actif") {
    return {
      backgroundColor: "#dcfce7",
      color: "#0b3b17",
    };
  }
  return {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  };
};

const formatKm = (value) => {
  if (value === null || value === undefined) return "";

  return Number(value).toLocaleString("fr-FR") + " km";
};

const handleRowClick = async (item) => {
  if (!item) return;

  if (
    selectedVehicule.value?.id === item.id &&
    !loadingDetails.value
  ) {
    return;
  }
  const currentRequest = ++selectionRequestId.value;
  panelVisible.value = true;
  loadingDetails.value = true;
  selectedVehicule.value = item;
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (currentRequest !== selectionRequestId.value) return;

  loadingDetails.value = false;
};

const handleCardClick = (vehicule) => {
  handleRowClick(vehicule);
};

const ajouterVehicule = (vehicule) => {
  if (vehicules.value.some((item) => item.voiture_IMMAT.toLowerCase() === vehicule.voiture_IMMAT.toLowerCase())) return;
  const nouveau = { ...vehicule, id: Date.now() };
  vehicules.value.unshift(nouveau);
  selectedVehicule.value = nouveau;
  panelVisible.value = true;
  ajoutOuvert.value = false;
};

const modifierVehicule = (modifications) => {
  const index = vehicules.value.findIndex((item) => item.id === selectedVehicule.value?.id);
  if (index < 0) return;
  vehicules.value[index] = { ...vehicules.value[index], ...modifications };
  selectedVehicule.value = vehicules.value[index];
  editionOuverte.value = false;
};

const modifierVehiculeDepuisListe = (vehicule) => {
  selectedVehicule.value = vehicule;
  editionOuverte.value = true;
};
</script>

<template>
  <div class="page-vehicule">
    <Transition name="layout-transition" mode="out-in">
    <DetailVehicule
      v-if="detailPleinEcran && selectedVehicule"
      :vehicule="selectedVehicule"
      :date-heure="dateHeure"
      @back="detailPleinEcran = false"
    />

    <div v-else class="vehicule-layout">

      <!-- PANNEAU GAUCHE -->
      <section class="vehicule-details">
        <div class="vehicule-details__heading">
          <v-icon icon="mdi-car-info" size="20" />
          <h2>Véhicule sélectionné</h2>
        </div>

        <Transition name="slide-panel" appear>
          <div v-if="panelVisible" class="details-content">

            <!-- SKELETON -->
            <div v-if="loadingDetails" class="details-skeleton">

              <v-skeleton-loader
                type="image"
                height="190"
                class="mb-3"
              />

              <v-skeleton-loader
                type="heading, paragraph"
                class="mb-3"
              />

              <v-divider class="my-3" />

              <v-skeleton-loader
                type="list-item-three-line, list-item-three-line, list-item-three-line"
              />

            </div>

            <!-- INFORMATIONS VEHICULE -->
            <div v-else-if="selectedVehicule" class="details-loaded">

              <!-- IMAGE DU VEHICULE -->
              <div class="vehicule-image">
                <img
                  :src="selectedVehicule.image"
                  :alt="`${selectedVehicule.voiture_MARQUE} ${selectedVehicule.voiture_MODELE}`"
                />
              </div>

              <!-- IDENTITE DU VEHICULE -->
              <div class="vehicule-identite">
                <div>
                  <h2>
                    {{ selectedVehicule.voiture_MARQUE }}
                    {{ selectedVehicule.voiture_MODELE }}
                  </h2>

                  <p>{{ selectedVehicule.voiture_IMMAT }}</p>
                </div>

                <span
                  class="statut-vehicule"
                  :style="getStatusCellStyle(selectedVehicule)"
                >
                  {{ selectedVehicule.statut }}
                </span>
              </div>

              <!-- INFORMATIONS -->
              <div class="vehicule-informations">

                <div>
                  <span>Bénéficiaire</span>
                  <strong>{{ selectedVehicule.beneficiaire || "Non renseigné" }}</strong>
                </div>

                <div>
                  <span>Année</span>
                  <strong>{{ selectedVehicule.voiture_ANNEE }}</strong>
                </div>

                <div>
                  <span>Kilométrage</span>
                  <strong>
                    {{ formatKm(selectedVehicule.voiture_KM) }}
                  </strong>
                </div>

              </div>

              <v-divider class="my-4" />

              <!-- HISTORIQUE -->
              <div class="historique-header">
                <h3>Historique des maintenances</h3>

                <span>
                  {{ selectedVehicule.historique.length }}
                </span>
              </div>

              <div
                v-if="selectedVehicule.historique.length"
                class="historique-list"
              >
                <div
                  v-for="maintenance in selectedVehicule.historique"
                  :key="maintenance.id"
                  class="maintenance-item"
                >
                  <strong>{{ maintenance.type }}</strong>

                  <span>{{ maintenance.date }}</span>

                  <small>{{ maintenance.description }}</small>

                  <small>
                    Kilométrage : {{ formatKm(maintenance.km) }}
                  </small>
                </div>
              </div>

              <div v-else class="historique-vide">
                <v-icon icon="mdi-history" size="28" />

                <p>Aucune maintenance enregistrée.</p>
              </div>

            </div>
          </div>
        </Transition>

        <!-- ETAT INITIAL -->
        <div v-if="!panelVisible" class="empty-selection">
          <v-icon icon="mdi-car-search-outline" size="42" />
          <p>Sélectionnez un véhicule dans la liste pour afficher sa fiche.</p>
        </div>

        <v-btn class="voir-vehicule-btn" variant="outlined" size="small" color="#0b3b17" :disabled="!selectedVehicule" @click="detailPleinEcran = true">Voir le véhicule</v-btn>

      </section>

      <!-- ZONE DROITE : TABLEAU OU CARTES -->
      <section class="vehicule-table">
        <div class="vehicule-heading-row">
          <h2>FICHE VEHICULE</h2>
          <v-btn
            class="nouvelle-voiture-btn"
            variant="elevated"
            color="#144f0e"
            prepend-icon="mdi-plus"
            @click="ajoutOuvert = true"
          >
            Nouvelle voiture
          </v-btn>
        </div>
        <div class="vehicule-toolbar">
          <v-text-field
            v-model="searchQuery"
            placeholder="Rechercher un véhicule..."
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="search"
          />
          <v-spacer></v-spacer>
          <SelecteurAffichage v-model="viewMode" />
        </div>

        <div class="vehicule-filtres">
          <v-select v-model="filtreMarque" :items="marquesDisponibles" label="Marque" placeholder="Toutes" density="compact" variant="outlined" hide-details clearable />
          <v-select v-model="filtreAnnee" :items="anneesDisponibles" label="Année" placeholder="Toutes" density="compact" variant="outlined" hide-details clearable />
          <v-select v-model="filtreStatut" :items="['Actif', 'Inactif']" label="État" placeholder="Tous" density="compact" variant="outlined" hide-details clearable />
        </div>

        <!-- VUE TABLEAU -->
        <TableVirtuelle
          v-if="viewMode === 'table'"
          :headers="headersVehicules"
          :items="vehiculesFiltres"
          :loading="false"
          :height="550"
          selected-item-key="id"
          :selected-item-id="selectedVehicule?.id"
          @click:row="handleRowClick"
        >
          <template #item.actions="{ item }">
            <v-btn icon size="small" variant="text" color="warning" title="Modifier le véhicule" aria-label="Modifier le véhicule" @click.stop="modifierVehiculeDepuisListe(item)">
              <v-icon size="20">mdi-pencil</v-icon>
            </v-btn>
          </template>
        </TableVirtuelle>

        <!-- VUE CARTES -->
        <div v-else class="vehicule-grid">
          <div
            v-for="vehicule in vehiculesFiltres"
            :key="vehicule.id"
            class="vehicule-card"
            :class="{ 'vehicule-card--selected': selectedVehicule?.id === vehicule.id }"
            @click="handleCardClick(vehicule)"
          >
            <div class="vehicule-card__image">
              <img
                :src="vehicule.image"
                :alt="`${vehicule.voiture_MARQUE} ${vehicule.voiture_MODELE}`"
              />
            </div>
            <div class="vehicule-card__body">
              <div class="vehicule-card__header">
                <h3 class="vehicule-card__name">
                  {{ vehicule.voiture_MARQUE }} {{ vehicule.voiture_MODELE }}
                </h3>
                <span
                  class="vehicule-card__status"
                  :style="getStatusCellStyle(vehicule)"
                >
                  {{ vehicule.statut }}
                </span>
              </div>
              <p class="vehicule-card__immat">{{ vehicule.voiture_IMMAT }}</p>
              <div class="vehicule-card__meta">
                <span>{{ vehicule.voiture_ANNEE }}</span>
                <span>{{ formatKm(vehicule.voiture_KM) }}</span>
              </div>
              <div class="vehicule-card__footer">
                <v-icon icon="mdi-wrench-outline" size="14" />
                <span>{{ vehicule.historique.length }} maintenance{{ vehicule.historique.length !== 1 ? 's' : '' }}</span>
                <v-spacer />
                <v-btn icon size="small" variant="text" color="warning" title="Modifier le véhicule" aria-label="Modifier le véhicule" @click.stop="modifierVehiculeDepuisListe(vehicule)">
                  <v-icon size="20">mdi-pencil</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
          <div v-if="!vehiculesFiltres.length" class="vehicule-grid__empty">
            Aucun véhicule trouvé.
          </div>
        </div>

      </section>

    </div>
    </Transition>
    <AjoutVoiture v-model="ajoutOuvert" @saved="ajouterVehicule" />
    <EditVoiture v-model="editionOuverte" :vehicule="selectedVehicule" @saved="modifierVehicule" />
  </div>
</template>

<style scoped>
.page-vehicule {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vehicule__actions {
  display: flex;
  padding-inline: 0;
  justify-content: flex-end;
  align-items: center;
}

.vehicule-heading-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.vehicule-heading-row h2 { font-size: 18px; font-weight: 650; }

.nouvelle-voiture-btn {
  min-height: 38px;
  border-radius: 8px;
  font-weight: 600;
}

.vehicule-layout {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
}

.vehicule-details,
.vehicule-table {
  min-width: 0;
}

.vehicule-details {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 16px;
  border: 1px solid #dce5dc;
  border-radius: 8px;
  background: #f7f7f7;
  box-shadow: 0 1px 4px rgba(20, 79, 14, 0.06);
}

.vehicule-details__heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ccddca;
  color: #245d28;
}

.vehicule-details__heading h2 {
  font-size: 16px;
  font-weight: 700;
}

.vehicule-details .details-content { color: #202720; }
.vehicule-details .empty-selection { color: #365c38; }
.voir-vehicule-btn { margin-top: auto; align-self: center; min-width: 150px; font-weight: 600; text-transform: none; }
.layout-transition-enter-active,
.layout-transition-leave-active { transition: opacity 180ms ease, transform 180ms ease; }
.layout-transition-enter-from { opacity: 0; transform: translateY(8px) scale(.995); }
.layout-transition-leave-to { opacity: 0; transform: translateY(-5px) scale(.997); }
.date-heure { margin-left: auto; color: #687568; font-size: 13px; }
.vehicule-filtres { display: flex; gap: 8px; margin: 0 0 10px; }
.vehicule-filtres > * { width: 145px; }

.details-content {
  width: 100%;
}

.details-loaded {
  width: 100%;
  padding: 12px;
  border: 1px solid #dce7db;
  border-radius: 7px;
  background: #fff;
}

/* IMAGE DU VEHICULE */
.vehicule-image {
  width: 100%;
  height: 190px;
  overflow: hidden;
  border-radius: 10px;
  background-color: #f2f2f2;
  margin-bottom: 16px;
}

.vehicule-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* IDENTITE */
.vehicule-identite {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.vehicule-identite h2 {
  color: #202720;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
}

.vehicule-identite p {
  color: #526052;
  margin-top: 4px;
  font-size: 13px;
}

.statut-vehicule {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

/* INFORMATIONS */
.vehicule-informations {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.vehicule-informations > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.vehicule-informations span {
  color: #526052;
  font-size: 13px;
}

.vehicule-informations strong {
  font-size: 13px;
}

/* HISTORIQUE */
.historique-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.historique-header h3 {
  color: #263626;
  font-size: 14px;
  font-weight: 700;
}

.historique-header span {
  font-size: 12px;
  color: #344934;
  background-color: #edf3ed;
  padding: 3px 8px;
  border-radius: 12px;
}

.historique-list {
  display: flex;
  flex-direction: column;
}

.maintenance-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px 0;
  border-bottom: 1px solid #e5e5e5;
}

.maintenance-item strong {
  font-size: 13px;
}

.maintenance-item span,
.maintenance-item small {
  color: #526052;
  font-size: 12px;
}

.historique-vide {
  padding: 20px 10px;
  text-align: center;
  color: #526052;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* ETAT INITIAL */
.empty-selection {
  flex: 1;
  min-height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 20px;
  color: #687568;
  text-align: center;
}

.empty-selection p {
  max-width: 230px;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* BARRE DE RECHERCHE */
.vehicule-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top : 15px;
  margin-bottom: 8px;
}

.search {
  max-width: 420px;
}

@media (max-width: 900px) {
  .vehicule-layout { grid-template-columns: 280px minmax(0, 1fr); }
}
@media (max-width: 700px) {
  .vehicule-layout { grid-template-columns: 1fr; }
  .vehicule-details { min-height: 260px; }
  .vehicule-heading-row { align-items: flex-start; }
  .vehicule-heading-row h2 { font-size: 16px; }
  .vehicule-toolbar { gap: 8px; }
  .search { min-width: 0; }
  .vehicule-filtres { flex-wrap: wrap; }
  .vehicule-filtres > * { flex: 1 1 130px; }
}

@media (prefers-reduced-motion: reduce) {
  .layout-transition-enter-active,
  .layout-transition-leave-active { transition: none; }
}

/* SKELETON */
.details-skeleton {
  width: 100%;
}

/* ANIMATION INITIALE UNIQUEMENT */
.slide-panel-enter-active {
  transition:
    opacity 280ms ease-out,
    transform 280ms ease-out;
}

.slide-panel-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

/* ===================== */
/* VUE CARTES (GRID)     */
/* ===================== */
.vehicule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  padding: 4px 0;
}

.vehicule-grid__empty {
  grid-column: 1 / -1;
  padding: 32px 16px;
  color: #687568;
  text-align: center;
}

.vehicule-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border, #dfe6e0);
  border-radius: var(--radius-sm, 8px);
  background: var(--color-surface, #f5f7f5);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.vehicule-card:hover {
  border-color: var(--color-primary, #2e7d32);
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.12);
}

.vehicule-card--selected {
  border-color: var(--color-primary, #2e7d32);
  box-shadow: 0 0 0 2px var(--color-primary-soft, #e8f5e9);
}

.vehicule-card__image {
  height: 140px;
  overflow: hidden;
  background-color: #f2f2f2;
}

.vehicule-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.vehicule-card__body {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vehicule-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.vehicule-card__name {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
}

.vehicule-card__status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  flex-shrink: 0;
}

.vehicule-card__immat {
  color: var(--color-text-muted, #5b675d);
  font-size: 12px;
  margin: 0;
}

.vehicule-card__meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-muted, #5b675d);
}

.vehicule-card__footer {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--color-text-muted, #5b675d);
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--color-border, #dfe6e0);
}
</style>
