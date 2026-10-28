<template>
  <div class="table-header-actionsglobal d-flex align-right">
    <v-btn color="#9BCB3B" variant="elevated" density="compact" class="btn-nouveau"
      style="color: white; font-weight: 600; border-radius: 8px" @click="$emit('formcvglobal')">
      <v-icon size="17" start style="color: white">mdi-plus-thick</v-icon>
      <strong>Nouveau</strong>
    </v-btn>
  </div>
  <!-- pomme 9BCB3B 8BC34A   fonce 007A33-->
  <!-- Tableau avec défilement -->
  <v-data-table :headers="headers" :items="items" :loading="loading" loading-text="Chargement..." density="compact"
    hover hide-default-footer class="rh_headerglobal bordered-new" height="473" :items-per-page="-1">
    <!-- Slot personnalisé pour le header -->
    <template #headers="{ columns }">
      <tr>
        <th v-for="column in columns" :key="column.key" class="table-header fixed-col" :style="{
          textAlign: ['cv_cv', 'cv_motivation', 'cv_action'].includes(
            column.key
          )
            ? 'center'
            : 'left',
        }">
          {{ column.title }}
        </th>
      </tr>
    </template>

    <template v-slot:[`item.cv_date`]="{ item }">
      <div class="cell-with-button1 d-flex justify-center align-start">
        <span>{{ item.cv_date ? formatDate(item.cv_date) : "-" }}</span>
      </div>
    </template>

    <template v-slot:[`item.cv_cv`]="{ item }">
      <div class="d-flex justify-center align-center" style="height: 100%; min-height: 40px">
        <v-icon v-if="item.cv_cv && item.cv_cv.trim() !== ''" color="primary" density="compact"
          @click="openFiche(item.cv_cv)" class="cursor-pointer">
          mdi-eye
        </v-icon>
        <v-tooltip activator="parent" location="start">Aperçu</v-tooltip>
      </div>
    </template>

    <template v-slot:[`item.cv_motivation`]="{ item }">
      <div class="d-flex justify-center align-center" style="height: 100%; min-height: 40px">
        <v-icon v-if="item.cv_motivation && item.cv_motivation.trim() !== ''" color="primary" density="compact"
          @click="openFiche(item.cv_motivation)" class="cursor-pointer">
          mdi-eye
        </v-icon>
        <v-tooltip activator="parent" location="start">Aperçu</v-tooltip>
      </div>
    </template>

    <!-- Colonne Préselection -->
    <template v-slot:[`item.cv_nom`]="{ item }">
      <div class="cell-with-button1 d-flex justify-center align-start">
        <span class="cell-text">
          {{ item.cv_nom }} {{ item.cv_prenom ? item.cv_prenom : "" }}</span>
      </div>
    </template>

    <template v-slot:[`item.cv_contact`]="{ item }">
      <span>
        {{
          item.cv_contact1
            ? item.cv_contact1 +
            (item.cv_contact_2 && item.cv_contact_2.trim() !== ""
              ? " / " + item.cv_contact_2
              : "")
            : ""
        }}
      </span>
    </template>
    <template v-slot:[`item.cv_action`]="{ item }">
      <div class="d-flex align-center justify-center" style="gap: 5px">
        <!-- Bouton Modifier -->
        <v-btn icon color="blue darken-2" @click="$emit('modifier', item)" :title="'Modifier'" density="compact">
          <v-icon density="compact">mdi-pencil</v-icon>
        </v-btn>

        <!-- Bouton Archiver -->
        <v-btn icon color="grey darken-1" :title="'Archiver ' + item.cv_nom + ' ' + item.cv_prenom"
          @click="archiverCandidat(item)" density="compact">
          <v-icon density="compact">mdi-archive</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
  <div class="summary-line">
    {{ (items ?? []).length }} candidat<span v-if="(items ?? []).length > 1">s</span>
    trouvée<span v-if="(items ?? []).length > 1">s</span>.
  </div>

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
import { ref, onMounted, computed, defineComponent } from "vue";
import { useformatDate2 } from "@/composables/useformatDate2";
import MyRadioButton from "../MyRadioButton.vue";
export default {
  name: "TableauCVglobal",
  components: { MyRadioButton },
  props: {
    items: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    loading: { type: Boolean, default: false },
  },
  setup(props) {
    const { formatDate } = useformatDate2();
    // États pour le dialog d’aperçu
    const dialog = ref(false);
    const filePreview = ref(null);
    const isImage = ref(false);
    const isPDF = ref(false);

    const selectedItem = ref(null);
    const page = ref(1);
    const itemsPerPage = ref(10);
    const pagedItems = computed(() => {
      const start = (page.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return props.items.slice(start, end);
    });

    // Colonnes
    const dateColumns = ["cv_date"];
    const otherColumns = computed(() =>
      props.headers
        .map((h) => h.key)
        .filter(
          (k) =>
            !dateColumns.includes(k) && !["cv_cv", "cv_motivation"].includes(k)
        )
    );
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
      otherColumns,
      dateColumns,
      selectedItem,
      formatDate,
      openFiche,
      dialog,
      filePreview,
      isImage,
      isPDF,
      openFiche,
      pagedItems,
      itemsPerPage,
      page,
    };
  },
};
</script>

<style>
.table-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.radio-group-custom {
  display: flex;
  gap: 15px;
}


.custom-table {
  border-radius: 6px;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #ece6e6;
  height: 220px;
}


.table-header {
  background-color: #8130e4;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  padding: 8px;
  text-align: left;
}


/* .v-data-table__tr:hover {
  background-color: #f5f5f5;
} */


.summary-line {
  background-color: #f4f8f3;
  border: 1px solid #d7ead5;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  color: #2e7d32;
  padding: 4px 8px;
  text-align: left;
  line-height: 1.2;
}

/* .v-data-table tbody tr:nth-child(even) {
  background-color: #f5f5f5; 
}

.v-data-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
} */


/* .v-data-table tbody tr:hover {
  background-color: #eaeaea !important;
} */

.bordered-detail {
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;


  display: flex;
  flex-direction: column;
  height: 300px;
  position: relative;
}

.v-data-table.custom-table .v-table__wrapper1 table th,
.v-data-table.custom-table .v-table__wrapper1 table td {
  border-right: 2px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.cell-with-button1 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding-bottom: 5px;
}

.cell-with-button1 .cell-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}


.cell-with-button1 .tb {
  flex-shrink: 0;
  min-width: 100px;
  color: #2e7d32;
  margin-top: -10px;
  padding-left: -10px;
}

.cell-with-button1 .tb1 {
  flex-shrink: 0;
  min-width: 100px;
  color: #5d00f1;
}


.tableau-detail-wrapper1 .v-data-table .v-table__wrapper table th,
.tableau-detail-wrapper1 .v-data-table .v-table__wrapper table td {
  width: auto;
  max-width: none;

  min-width: 120px;
  white-space: normal;
  word-wrap: break-word;
}


.tableau-detail-wrapper1 .v-data-table {
  width: 100%;
  table-layout: auto;
  max-height: 230px;
}


.tableau-detail-wrapper1 .cell-with-button1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.tableau-detail-wrapper1 .cell-with-button1 .cell-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.tableau-detail-wrapper1 .cell-with-button1 .tb {
  flex-shrink: 0;
  min-width: 100px;
  color: #2e7d32;
}

.table-header-actionsglobal {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 6px;
  padding: 4px 8px;
}

.btn-nouveau {
  font-size: 13px;
  font-weight: 500;
  text-transform: none;
  color: white;
}


.tableau-detail-wrapper1 .v-data-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #8130e4;
  color: white;
}

.v-data-table.rh_headerglobal .v-table__wrapper>table>thead>tr th,
.v-data-table.rh_headerglobal .v-table__wrapper>table>tbody>tr th {
  background-color: #b3ccb8 !important;
  color: #000000 !important;
}

.v-data-table.rh_headerglobal .v-table__wrapper>table>tbody>tr>td {
  border-bottom: 1px solid #c8c8c8;
}
</style>
