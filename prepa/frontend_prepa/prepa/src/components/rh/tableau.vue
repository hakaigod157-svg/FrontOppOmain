<template>
  <v-data-table class="rh_header bordered-new" :headers="headers" :items="pagedItems" :items-per-page="-1" :loading="loading"
    loading-text="Chargement..." dense :fixed-header="true" height="450" no-data-text="Pas de données disponibles" hover
    density="compact" hide-default-footer>
    <!-- Colonnes standards -->
    <template v-for="col in otherColumns" :key="col" v-slot:[`item.${col}`]="{ item }">
      <span>{{ displayFallback(item[col]) }}</span>
    </template>

    <!-- Colonnes date -->
    <template v-for="col in dateColumns" :key="col" v-slot:[`item.${col}`]="{ item }">
      <span>{{ item[col] ? formatDate(item[col]) : "-" }}</span>
    </template>

    <!-- Colonne Fiche -->
    <template v-slot:[`item.demande_fiche`]="{ item }">
      <div class="d-flex justify-center align-center" style="height: 100%; min-height: 40px">
        <v-icon v-if="item.demande_fiche && item.demande_fiche.trim() !== ''" color="primary" density="compact"
          @click="openFiche(item.demande_fiche)" class="cursor-pointer">
          mdi-eye
        </v-icon>
        <v-tooltip activator="parent" location="start">Aperçu</v-tooltip>
      </div>
    </template>

    <!-- Colonne État -->
    <template v-slot:[`item.demande_etat`]="{ item }">
      <v-chip :color="getEtatColor(item.demande_etat)" :text="getEtatLabel(item.demande_etat)" size="small" label
        class="text-uppercase text-white font-weight-bold"></v-chip>
    </template>

    <!-- Actions -->
    <template v-slot:[`item.actions`]="{ item }">
      <div class="d-flex align-center justify-center" style="gap: 5px;">
        <v-btn v-if="item.demande_etat === 0" density="compact" color="#8BC34A" icon class="me-2"
          @click="$emit('approve', item)">
          <v-icon density="compact">mdi-check</v-icon>
          <v-tooltip activator="parent" location="start">Approuver</v-tooltip>
        </v-btn>

        <v-btn icon color="blue darken-2" v-if="item.demande_etat === 0" @click="$emit('modifier', item)"
          :title="'Modifier'" density="compact">
          <v-icon density="compact">mdi-pencil</v-icon>

        </v-btn>

        <!-- Bouton Supprimer -->
        <v-btn icon color="red darken-2" v-if="item.demande_etat === 0" @click="$emit('supprimer', item.demande_code)"
          :title="'Supprimer'" density="compact">
          <v-icon density="compact">mdi-delete</v-icon>
        </v-btn>

        <!--- <v-btn v-if="item.demande_etat === 2" density="compact"  color="#E53935" icon @click="$emit('reject', item)">
          <v-icon density="compact" >mdi-close</v-icon>
          <v-tooltip activator="parent" location="bottom">Refuser</v-tooltip>
        </v-btn>

        <v-btn density="compact"  color="blue" icon  @click="$emit('reject', item)">
          <v-icon density="compact" >mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="bottom">Modifier</v-tooltip>
        </v-btn> --->
      </div>
    </template>
  </v-data-table>
  <!-- Résumé ultra compact -->
  <div class="summary-line">
    {{ pagedItems.length }} demande<span v-if="pagedItems.length > 1">s</span>
    trouvée<span v-if="pagedItems.length > 1">s</span>.
  </div>
  <!-- Pagination centrale -->
  <!--- <div class="d-flex justify-center mt-2">
    <v-pagination
      v-model="page"
      :length="pageCount"
      total-visible="7"
      color="primary"
    ></v-pagination> 
  </div>-->
  <!--  DIALOG D’APERÇU DU DOCUMENT -->
  <v-dialog v-model="dialog" max-width="600px" transition="dialog-pop" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <span class="text-h6"><u>Aperçu du fichier</u></span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <div v-if="filePreview" class="text-center">
          <img v-if="isImage" :src="filePreview" alt="Aperçu" style="max-width: 100%; border-radius: 4px" />
          <iframe v-else-if="isPDF" :src="filePreview" width="100%" height="400px"
            style="border: none; border-radius: 8px"></iframe>
          <p v-else class="mt-4">Impossible d’afficher ce type de fichier.</p>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-btn color="red" density="compact" variant="outlined" @click="dialog = false">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed, defineComponent } from "vue";
import { useformatDate2 } from "@/composables/useformatDate2";

export default defineComponent({
  name: "Tableau",
  props: {
    demandes: { type: Array, required: true },
    headers: { type: Array, required: true },
    loading: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const { formatDate } = useformatDate2();

    // États pour le dialog d’aperçu
    const dialog = ref(false);
    const filePreview = ref(null);
    const isImage = ref(false);
    const isPDF = ref(false);

    const page = ref(1);
    const itemsPerPage = ref(1000); // valeur par défaut : 10 éléments par page

    const pageCount = computed(() =>
      Math.ceil(props.demandes.length / itemsPerPage.value)
    );

    const pagedItems = computed(() => {
      const start = (page.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return props.demandes.slice(start, end);
    });

    // Colonnes
    const dateColumns = ["demande_date", "demande_prise_fonction"];
    const otherColumns = computed(() =>
      props.headers
        .map((h) => h.key)
        .filter(
          (k) =>
            !dateColumns.includes(k) &&
            !["actions", "demande_etat", "demande_fiche"].includes(k)
        )
    );

    // Fonctions utilitaires
    function displayFallback(value) {
      return value ?? "-";
    }

    function getEtatLabel(value) {
      switch (value) {
        case 2:
          return "Refusé";
        case 1:
          return "Approuvé";
        case 0:
          return "En attente";
        default:
          return "-";
      }
    }
    function getEtatColor(value) {
      switch (value) {
        case 1:
          return "green"; // Approuvé
        case 2:
          return "red"; // Refusé
        case 0:
          return "orange"; // En attente
        default:
          return "grey"; // Autre / inconnu
      }
    }

    //  Fonction d’ouverture du fichier
    function openFiche(ficheBase64) {
      if (!ficheBase64) return;

      try {
        let mimeType = "application/pdf";

        // Détection du type
        if (ficheBase64.startsWith("data:")) {
          const match = ficheBase64.match(/^data:(.*?);base64,/);
          if (match) {
            mimeType = match[1];
            ficheBase64 = ficheBase64.replace(/^data:.*;base64,/, "");
          }
        } else if (ficheBase64.startsWith("/9j/")) mimeType = "image/jpeg";
        else if (ficheBase64.startsWith("iVBOR")) mimeType = "image/png";
        else if (ficheBase64.startsWith("R0lGOD")) mimeType = "image/gif";
        else if (ficheBase64.startsWith("JVBER")) mimeType = "application/pdf";

        // Conversion base64 → blob
        const byteCharacters = atob(ficheBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);

        // Assignation pour affichage dans le dialog
        filePreview.value = blobUrl;
        isImage.value = mimeType.startsWith("image/");
        isPDF.value = mimeType === "application/pdf";
        dialog.value = true;
      } catch (err) {
        console.error("Erreur lors de l'ouverture du fichier :", err);
        alert("Impossible d'afficher la fiche !");
      }
    }

    return {
      formatDate,
      displayFallback,
      dateColumns,
      otherColumns,
      emit,
      getEtatLabel,
      openFiche,
      dialog,
      filePreview,
      isImage,
      isPDF,
      getEtatColor,
      page,
      itemsPerPage,
      pageCount,
      pagedItems,
    };
  },
});
</script>

<style>
.v-data-table.rh_header .v-table__wrapper>table>thead>tr th,
.v-data-table.rh_header .v-table__wrapper>table tbody>tr th {
  background-color: #b3ccb8 !important;
  white-space: nowrap;
  color: #000000 !important;
  border-bottom: 1px solid #323232 !important;
}

/* bordure entre les lignes du corps */
.v-data-table.rh_header .v-table__wrapper>table>tbody>tr>td {
  border-bottom: 1px solid #c8c8c8;
}

.v-data-table.rh_header {
  position: sticky;
  bottom: 0;
  background-color: white;

  z-index: 5;
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
