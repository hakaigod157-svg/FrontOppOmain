<script setup>
import { ref } from "vue";
import TableVirtuelle from "@/components/mecano/TableVirtuelle.vue";

import imageDamas from "@/assets/damas.jpg";
import imageBt50 from "@/assets/bt50.jpeg";
import imageGeely from "@/assets/geely.jpeg";

const searchQuery = ref("");

const selectedVehicule = ref(null);
const panelVisible = ref(false);
const loadingDetails = ref(false);

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

const headersVehicules = [
  { title: "Immatriculation", key: "voiture_IMMAT" },
  { title: "Marque", key: "voiture_MARQUE" },
  { title: "Année", key: "voiture_ANNEE" },
  { title: "Modèle", key: "voiture_MODELE" },
  { title: "KM", key: "voiture_KM" },
  {
    title: "État",
    key: "statut",
    align: "center",
  },
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
</script>

<template>
  <div class="page-vehicule">

    

    <div class="vehicule-layout">

      <!-- PANNEAU GAUCHE -->
      <section class="vehicule-details">

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
          <v-icon icon="mdi-car-outline" size="48" />
          <p>Sélectionnez un véhicule</p>
        </div>

      </section>

      <!-- TABLEAU VEHICULES -->
      <section class="vehicule-table">
        <v-card-actions density="compact" class="vehicule__actions">
            <h2>Fiche Véhicule Interne OPHAM</h2>
            <v-spacer />
            </v-card-actions>
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
        </div>

        <TableVirtuelle
          :headers="headersVehicules"
          :items="vehicules"
          :search="searchQuery"
          :loading="false"
          :height="550"
          selected-item-key="id"
          :selected-item-id="selectedVehicule?.id"
          @click:row="handleRowClick"
        />

      </section>

    </div>
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
  justify-content: flex-end
}

.vehicule-layout {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.vehicule-details,
.vehicule-table {
  min-width: 0;
}

.vehicule-details {
  position: relative;
  min-height: 400px;
  overflow: hidden;
}

.details-content {
  width: 100%;
}

.details-loaded {
  width: 100%;
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
  font-size: 20px;
  font-weight: 700;
}

.vehicule-identite p {
  color: #777;
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
  color: #777;
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
  font-size: 15px;
  font-weight: 700;
}

.historique-header span {
  font-size: 12px;
  color: #777;
  background-color: #f1f1f1;
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
  color: #777;
  font-size: 12px;
}

.historique-vide {
  padding: 20px 10px;
  text-align: center;
  color: #888;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* ETAT INITIAL */
.empty-selection {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #888;
}

/* BARRE DE RECHERCHE */
.vehicule-toolbar {
  display: flex;
  margin-bottom: 8px;
}

.search {
  max-width: 420px;
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
</style>
