<template>
  <div class="tab1 tableau-detail-wrapper1">
    <div class="table-header-actions">
    </div>
    <!-- Tableau avec défilement -->
    <v-data-table :headers="headers" :items="items.filter((item) => item && Object.keys(item).length > 0)"
      :loading="loading" loading-text="Chargement..." density="compact" hover hide-default-footer
      class="tableau-offre-table" height="260px" no-data-text="Pas de données disponibles">
      <template #headers="{ columns }">
        <tr>
          <th v-for="column in columns" :key="column.key" class="table-header" :style="{
            textAlign: ['offre_piece', 'offre_action'].includes(column.key)
              ? 'center'
              : 'left',
          }">
            {{ column.title }}
          </th>
        </tr>
      </template>

      <template v-slot:[`item.mise_dispo_date_effect`]="{ item }">
        <div class="cell-with-button1 d-flex justify-center align-center">

          <!-- Date renseignée -->
          <span v-if="item.mise_dispo_date_effect">
            {{ formatDate(item.mise_dispo_date_effect) }}
            <v-btn icon="mdi-close" size="x-small" variant="text" color="error" density="compact"
              title="Supprimer la date" class="ml-1" @click="clearDate(item)" />
          </span>

          <!-- Date non renseignée -->
          <v-btn v-else size="small" variant="text" color="primary" prepend-icon="mdi-calendar-plus" density="compact"
            @click="openDatePicker(item)"></v-btn>

        </div>
      </template>

    </v-data-table>

    <v-dialog v-model="dialogDatePicker" max-width="400">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-calendar</v-icon>
          Sélectionner une date
        </v-card-title>

        <v-card-text class="d-flex justify-center">
          <v-date-picker v-model="selectedDate" color="primary" show-adjacent-months @dblclick="saveDate" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="dialogDatePicker = false">
            Annuler
          </v-btn>

          <v-btn color="primary" variant="elevated" :disabled="!selectedDate" @click="saveDate">
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <div class="summary-line">
      {{ pagedItems.length }} matériel<span v-if="pagedItems.length > 1">s</span>
      trouvée<span v-if="pagedItems.length > 1">s</span>.
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
  </div>
</template>

<script>
import { ref, onMounted, computed, defineComponent } from "vue";
import { useformatDate2 } from "@/composables/useformatDate2";
import { useListIntegration } from "@/store/Rh/rh_integration.js";
import Swal from "sweetalert2";

export default {
  name: "TableauOffre",
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

    etat: {
      type: [String, Number],
      required: false
    },

  },
  setup(props) {
    const storeIntegr = useListIntegration();
    const { formatDate } = useformatDate2();

    // États pour le dialog d’aperçu
    const dialog = ref(false);
    const filePreview = ref(null);
    const isImage = ref(false);
    const isPDF = ref(false);


    const page = ref(1);
    const itemsPerPage = ref(10);
    /* const pagedItems = computed(() => {
      const start = (page.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return props.items.slice(start, end);
    });*/
    const pagedItems = computed(() => {
      const validItems = props.items.filter(
        (item) => item && Object.keys(item).length > 0
      );
      const start = (page.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return validItems.slice(start, end);
    });

    const dateColumns = ["offre_date"];
    const otherColumns = computed(() =>
      props.headers
        .map((h) => h.key)
        .filter((k) => !dateColumns.includes(k) && !["offre_piece"].includes(k))
    );
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


    const selectedItem = ref(null);
    const selectedDate = ref(null);

    const dialogDatePicker = ref(false);

    const openDatePicker = (item) => {
      selectedItem.value = item;
      selectedDate.value = null;
      dialogDatePicker.value = true;
    };


    const saveDate = async () => {
      if (!selectedItem.value || !selectedDate.value) {
        return;
      }

      try {
        // Conversion de la date au format yyyy-MM-dd
        const date = new Date(selectedDate.value);

        const dateFormatee =
          date.getFullYear() +
          "-" +
          String(date.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getDate()).padStart(2, "0");

        console.log("Date sélectionnée :", selectedDate.value);
        console.log("Date envoyée :", dateFormatee);

        console.log(
          "Matricule :",
          selectedItem.value.mise_dispo_matr
        );

        console.log(
          "Catégorie :",
          selectedItem.value.mise_dispo_cat
        );
        console.log(
          "Matériel :",
          selectedItem.value.mise_dispo_materiel
        );

        // Mise à jour locale
        selectedItem.value.mise_dispo_date_effect = dateFormatee;

        // Appel du store
        await storeIntegr.updateDateMatDispo(selectedItem.value.mise_dispo_matr, selectedItem.value.mise_dispo_cat, selectedItem.value.mise_dispo_materiel, dateFormatee);

        // Fermer le date picker
        dialogDatePicker.value = false;

        await Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          icon: "success",
          title: "Date mise à jour avec succès"
        });

        console.log("Date mise à jour avec succès");

      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour de la date :",
          error
        );
      }
    };

    const clearDate = async (item) => {
      if (!item) { return; }
      const result = await Swal.fire({
        title: "Supprimer la date ?",
        text: "Voulez-vous vraiment supprimer cette date ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Supprimer",
        cancelButtonText: "Annuler",
        confirmButtonColor: "#d32f2f",
        cancelButtonColor: "#757575",

        customClass: {
          confirmButton: "swal-btn-white",
          cancelButton: "swal-btn-white",
        },
      });

      if (!result.isConfirmed) { return; }
      try {
        await storeIntegr.updateDateMatDispo(item.mise_dispo_matr, item.mise_dispo_cat, item.mise_dispo_materiel, null);
        item.mise_dispo_date_effect = null;
        await Swal.fire({
          toast: true, position: "top-end",
          showConfirmButton: false, timer: 2000,
          timerProgressBar: true,
          icon: "success",
          title: "Date supprimée avec succès",
        });
        console.log("Date supprimée avec succès");
      }
      catch (error) {
        console.error("Erreur lors de la suppression de la date :", error);
        await Swal.fire({ toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true, icon: "error", title: "Erreur lors de la suppression", });
      }
    };


    return {
      otherColumns,
      dateColumns,
      formatDate,
      openFiche,
      dialog,
      filePreview,
      isImage,
      isPDF,

      pagedItems,
      itemsPerPage,
      page,
      selectedItem, selectedDate, dialogDatePicker, openDatePicker, saveDate, clearDate,
    };
  },
};
</script>

<style>
.tab1 {
  display: flex;
  flex-direction: column;
  gap: 4px;
}


.custom-table {
  border-radius: 6px;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #ece6e6;
}


/* .v-data-table__tr:hover {
  background-color: #f5f5f5;
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

.cell-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}


.cell-with-button .cell-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}


.cell-with-button .tb {
  flex-shrink: 0;
  min-width: 100px;
  color: #2e7d32;
}

.cell-with-button .tb1 {
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





.table-header-actions {
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

.custom-table {
  min-height: 228px;
}

.v-data-table.tableau-offre-table .v-table__wrapper table th,
.v-data-table.tableau-offre-table .v-table__wrapper table td {
  border-right: 2px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.swal-btn-white {
  color: white !important;
}

.tableau-offre-table {
  border-radius: 6px;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #ece6e6;
  min-height: 402px;
  
}
</style>
