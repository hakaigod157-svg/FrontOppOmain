<template>
  <div class="tab2 tableau-detail-wrapper2">
    <div class="table-header-cv d-flex justify-space-between align-center">
      <div class="radio-container">
        <v-radio-group v-model="filterStatus" row inline style="gap: 3px">
          <div class="radio-group-custom">
            <MyRadioButton label_radio="Tous" value_radio="all" />
            <MyRadioButton label_radio="En attente" value_radio="pending" />
            <!-- <MyRadioButton label_radio="Prélectionné" value_radio="selected" /> -->
            <!-- <MyRadioButton
          label_radio="Entretien programmé"
          value_radio="interview"
        />
        <MyRadioButton
          label_radio="Entretien passé"
          value_radio="interview_done"
        /> -->
          </div>
        </v-radio-group>
      </div>
      <!-- <div v-if="hasOffre" class="d-flex justify-space-between" style="gap: 16px">
        <v-btn color="#4169E1" variant="elevated" density="compact" class="btn-inclure"
          style="color: white; font-weight: 600; border-radius: 8px" @click="$emit('listcandidat')">
          <v-icon start size="17" style="color: white">mdi-arrow-down-bold-box-outline</v-icon>
          Inclure candidat existant
        </v-btn>
        <v-btn color="#9BCB3B" variant="elevated" density="compact" class="btn-nouveau"
          style="color: white; font-weight: 600; border-radius: 8px" @click="$emit('formcv')">
          <v-icon start size="17" style="color: white">mdi-plus-thick</v-icon>
          Nouveau
        </v-btn>
      </div> -->

      <div v-if="etat !== 'TERMINE'">
        <div v-if="hasOffre" class="d-flex justify-space-between" style="gap: 16px">
          <v-btn color="#4169E1" variant="elevated" density="compact" class="btn-inclure"
            style="color: white; font-weight: 600; border-radius: 8px" @click="$emit('listcandidat')">
            <v-icon start size="17" style="color: white">mdi-arrow-down-bold-box-outline</v-icon>
            Inclure candidat existant
          </v-btn>

          <v-btn color="#9BCB3B" variant="elevated" density="compact" class="btn-nouveau"
            style="color: white, font-weight: 600; border-radius: 8px" @click="$emit('formcv')">
            <v-icon start size="17" style="color: white">mdi-plus-thick</v-icon>
            Nouveau
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Tableau avec défilement -->
    <v-data-table :headers="headers" :items="filteredItems" :loading="loading" loading-text="Chargement..."  :items-per-page="-1"
      density="compact" hover hide-default-footer class="custom-table3 tableau-cv-table">
      <!-- Slot personnalisé pour le header -->
      <!-- <template #headers="{ columns }">
        <tr>
          <th v-for="column in columns" :key="column.key" class="table-header fixed-col" :style="{
            textAlign: ['cv_cv', 'cv_motivation'].includes(column.key)
              ? 'center'
              : 'left',
          }">
            {{ column.title }}
          </th>
        </tr>
      </template> -->

      <template v-slot:[`item.cv_date`]="{ item }">
        <div class="cell-with-button1 d-flex justify-center align-start">
          <span>{{ item.cv_date ? formatDate(item.cv_date) : "-" }}</span>
        </div>
      </template>

      <template v-slot:[`item.cv_ligne_date_ajout`]="{ item }">
        <div class="cell-with-button1 d-flex justify-center align-start">
          <span>{{ item.cv_ligne_date_ajout ? formatDate(item.cv_ligne_date_ajout) : "-" }}</span>
        </div>
      </template>

      <!-- <template v-slot:[`item.cv_ligne_date_proposition`]="{ item }">
        <div class="cell-with-button1 d-flex justify-center align-start">
          <span>{{ item.cv_ligne_date_proposition ? formatDate(item.cv_ligne_date_proposition) : "" }}</span>
        </div>
      </template> -->

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
      <!-- <template v-slot:[`item.cv_nom`]="{ item }">
        <div class="cell-with-button1 d-flex justify-center align-start">
          <span class="cell-text">
            {{ item.cv_nom }} {{ item.cv_prenom ? item.cv_prenom : "" }}</span>
          <v-btn v-if="item.cv_ligne_selectionne == 0 && !hasValidatedCv" color="success" class="tb" density="compact"
            style="font-size: 9px; padding-left: 0px; padding-right: 0px" @click="$emit('preselect', item)">
            <strong>Preselectionner</strong>
          </v-btn>
        </div>
      </template>

      <template v-slot:[`item.cv_test_entretien`]="{ item }">
        <div class="d-flex justify-start align-center">
          <v-btn v-if="item.cv_ligne_selectionne == 1 && item.cv_ligne_test_entretien == 0 && !hasValidatedCv" color="info" class="tb"
            density="compact" style="font-size: 9px; padding-left: 0px; padding-right: 0px"
            @click="$emit('entretien', item)">
            Passer entretien
          </v-btn>
          <span v-else>
            {{
              item.cv_ligne_date_test
                ? formatDate(item.cv_ligne_date_test)
                : "-"
            }}
          </span>
        </div>
      </template> -->

      <!-- <template v-slot:[`item.cv_test_entretien`]="{ item }">
        {{ item.cv_ligne_date_test ? formatDateTime(item.cv_ligne_date_test) : "" }}
      </template> -->

      <!-- <template v-slot:[`item.cv_ligne_date_test`]="{ item }">
        {{ formatDateTime(item.cv_ligne_date_test) }}
      </template> -->

      <template v-slot:[`item.cv_ligne_date_test`]="{ item }">
        <span v-if="item.cv_ligne_date_test">
          {{ formatDateTime(item.cv_ligne_date_test) }}
        </span>

        <v-btn v-else-if="item.cv_ligne_selectionne == 0" color="success" class="tb" density="compact"
          style="font-size: 9px; padding-left: 0px; padding-right: 0px"
          @click="$emit('preselect', { ...item, mode: 'test' })">
          <strong>Passer test</strong>
        </v-btn>
      </template>

      <template v-slot:[`item.cv_ligne_date_proposition`]="{ item }">
        <span v-if="item.cv_ligne_date_proposition">
          <!-- {{ item.cv_ligne_date_proposition }}  -->
          Proposé
        </span>
        <v-btn
          v-else-if="item.cv_ligne_selectionne == 2 && item.cv_ligne_validation != 1 && item.cv_ligne_date_entretien != null"
          color="#F8BBD0" class="tb" density="compact" style="font-size: 9px; padding-left: 6px; padding-right: 6px"
          @click="$emit('proposition', item)">
          A proposer
        </v-btn>
      </template>


      <!-- <template v-slot:[`item.cv_ligne_date_entretien`]="{ item }">
        {{ formatDateTime(item.cv_ligne_date_entretien) }}
      </template> -->

      <template v-slot:[`item.cv_ligne_date_entretien`]="{ item }">
        <span v-if="item.cv_ligne_date_entretien">
          {{ formatDateTime(item.cv_ligne_date_entretien) }}
        </span>

        <v-btn v-else-if="
          item.cv_ligne_date_test &&
          !item.cv_ligne_date_entretien
        " color="success" class="tb" density="compact" style="font-size: 9px; padding-left: 0px; padding-right: 0px"
          @click="$emit('preselect', { ...item, mode: 'entretien' })">
          <strong>Passer Entretien</strong>
        </v-btn>
      </template>

      <!-- <template v-slot:[`item.cv_nom`]="{ item }">
        <div class="cell-with-button1 d-flex justify-center align-start">
          <span class="cell-text">
            {{ item.cv_nom }} {{ item.cv_prenom ? item.cv_prenom : "" }}</span>
          <v-btn v-if="item.cv_ligne_selectionne == 0" color="success" class="tb" density="compact"
            style="font-size: 9px; padding-left: 0px; padding-right: 0px" @click="$emit('preselect', item)">
            <strong>Preselectionner</strong>
          </v-btn>
        </div>
      </template> -->


      <!-- Validation du candidat -->
      <!-- <template v-slot:[`item.action`]="{ item }">
        <div class="d-flex justify-start align-center">
          <v-btn v-if="item.cv_ligne_selectionne == 1 && item.cv_ligne_test_entretien == 1" color="info" class="tb"
            density="compact" style="font-size: 9px; padding-left: 0px; padding-right: 0px"
            @click="$emit('validation', item)">
            Valider
          </v-btn>
          <span v-else>
            {{
              item.cv_ligne_date_test
                ? formatDate(item.cv_ligne_date_test)
                : "-"
            }}
          </span>
        </div>
      </template> -->

      <!-- <template v-slot:[`item.action`]="{ item }">
        <div class="d-flex justify-start align-center" style="gap: 4px">
          <v-btn
            v-if="item.cv_ligne_selectionne == 1 && item.cv_ligne_test_entretien == 1 && item.cv_ligne_validation != 1"
            color="info" class="tb" density="compact" style="font-size: 9px; padding-left: 6px; padding-right: 6px"
            @click="$emit('validation', item)">
            Valider
          </v-btn>

          <v-btn
            v-if="item.cv_ligne_selectionne == 1 && item.cv_ligne_test_entretien == 1 && item.cv_ligne_validation != 1"
            color="error" class="tb" density="compact" style="font-size: 9px; padding-left: 6px; padding-right: 6px"
            @click="$emit('refuser', item)">
            Refuser
          </v-btn>

          <v-btn
            v-if="item.cv_ligne_selectionne == 1 && item.cv_ligne_test_entretien == 1 && item.cv_ligne_validation == 1"
            color="yellow" class="tb" density="compact" style="font-size: 9px; padding-left: 6px; padding-right: 6px"
            @click="$emit('add_doc', item)">
            Ajouter Dossier
          </v-btn>

          <span v-else>
       
          </span>
        </div>
      </template> -->

      <template v-slot:[`item.action`]="{ item }">
        <div class="d-flex justify-start align-center" style="gap: 4px">


          <!-- <div class="cell-with-button1 d-flex justify-center align-start">
            <v-btn v-if="item.cv_ligne_selectionne == 0" color="success" class="tb" density="compact"
              style="font-size: 9px; padding-left: 0px; padding-right: 0px" @click="$emit('preselect', item)">
              <strong>Preselectionner</strong>
            </v-btn>
          </div> -->

          <!-- <div class="cell-with-button1 d-flex justify-center align-start">
            <v-btn v-if="item.cv_ligne_selectionne == 0" color="success" class="tb" density="compact"
              style="font-size: 9px; padding-left: 0px; padding-right: 0px" @click="$emit('preselect', item)">
              <strong>Passer test</strong>
            </v-btn>
          </div> -->

          <!-- <div class="d-flex justify-start align-center">
            <v-btn v-if="item.cv_ligne_selectionne == 1 && item.cv_ligne_test_entretien == 0" color="info" class="tb"
              density="compact" style="font-size: 9px; padding-left: 0px; padding-right: 0px"
              @click="$emit('entretien', item)">
              Passer entretien
            </v-btn>
            <span v-else>
            </span>
          </div> -->

          <!-- <v-btn v-if="canValidate(item)" color="#9CCC65" class="tb" density="compact"
            style="font-size: 9px; padding-left: 6px; padding-right: 6px" @click="$emit('validation', item)">
            Valider
          </v-btn> -->

          <!-- Proposition dossier -->

          <!-- <v-btn
            v-if="item.cv_ligne_selectionne == 1 && item.cv_ligne_test_entretien == 1 && item.cv_ligne_validation != 1"
            color="#F8BBD0" class="tb" density="compact" style="font-size: 9px; padding-left: 6px; padding-right: 6px"
            @click="$emit('proposition', item)">
            A proposer
          </v-btn> -->

          <!-- <v-btn v-if="item.cv_ligne_selectionne == 3 && item.cv_ligne_validation != 1" color="#F8BBD0" class="tb"
            density="compact" style="font-size: 9px; padding-left: 6px; padding-right: 6px"
            @click="$emit('validation', item)">
            Valider
          </v-btn> -->


          <v-btn v-if="item.cv_ligne_selectionne == 3 && item.cv_ligne_validation != 1" color="#F8BBD0" class="tb"
            density="compact" style="margin-left: 10px;font-size: 9px; padding-left: 6px; padding-right: 6px"
            @click="$emit('validation', item)">
            Valider
          </v-btn>

          <span v-else-if="item.cv_ligne_selectionne == 4" style="color: green; margin-left: 20px;">
            Validée
          </span>







          <!-- <v-btn v-if="canValidate(item)" color="error" class="tb" density="compact"
            style="font-size: 9px; padding-left: 6px; padding-right: 6px" @click="$emit('refuser', item)">
            Refuser
          </v-btn> -->

          <!-- <v-btn v-if="isValidated(item)" color="#E6EE9C" class="tb" density="compact"
            style="font-size: 9px; padding-left: 6px; padding-right: 6px" @click="$emit('add_doc', item)">
            Ajouter Dossier
          </v-btn> -->

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


      <template #headers="{ columns }">
        <tr>
          <th v-for="column in columns" :key="column.key" class="table-header fixed-col" :style="{
            textAlign: ['cv_cv', 'cv_motivation'].includes(column.key) ? 'center' : 'left',
          }">
            <template v-if="column.key === 'cv_ligne_date_test'">
              <span style="display: flex; align-items: center; gap: 4px; white-space: nowrap;">
                {{ column.title }} <v-badge :content="countTest" color="#FBC02D" inline />
              </span>
            </template>

            <template v-else-if="column.key === 'cv_ligne_date_entretien'">
              <span style="display: flex; align-items: center; gap: 4px; white-space: nowrap;">
                {{ column.title }} <v-badge :content="countEntretien" color="#FBC02D" inline />
              </span>
            </template>

            <template v-else-if="column.key === 'cv_ligne_date_proposition'">
              <span style="display: flex; align-items: center; gap: 4px; white-space: nowrap;">
                {{ column.title }} <v-badge :content="countProposition" color="#FBC02D" inline />
              </span>
            </template>

            <template v-else>
              {{ column.title }}
            </template>
          </th>
        </tr>
      </template>









    </v-data-table>
    <div class="summary-line">
      {{ filteredItems.length }} candidat<span v-if="filteredItems.length > 1">s</span>
      trouvée<span v-if="filteredItems.length > 1">s</span>.
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
import MyRadioButton from "../MyRadioButton.vue";
import dayjs from 'dayjs';

export default {
  name: "TableauCV",
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

    hasOffre: {
      type: Boolean,
      default: false
    },

    etat: {
      type: [String, Number],
      required: false
    },

    countTest: { type: Number, default: 0 },
    countEntretien: { type: Number, default: 0 },
    countProposition: { type: Number, default: 0 },
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

    const filterStatus = ref("all");

    const filteredItems = computed(() => {
      switch (filterStatus.value) {
        case "pending":
          return props.items.filter((i) => i.cv_ligne_selectionne == 0);
        case "selected":
          return props.items.filter((i) => i.cv_ligne_selectionne == 1);
        /*case "interview":
          return props.items.filter(
            (i) => i.cv_ligne_selectionne == 1 && i.cv_ligne_test_entretien == 1  &&  i.cv_ligne_date_test &&
            new Date(i.cv_ligne_date_test) >= new Date()
          );
        case "interview_done":
          return props.items.filter(
            (i) =>
              i.cv_ligne_selectionne == 1 &&
              i.cv_ligne_date_test &&
              new Date(i.cv_ligne_date_test) < new Date()
          ); */

        default:
          return props.items;
      }
    });
    // Colonnes
    const dateColumns = ["cv_date"];
    const otherColumns = computed(() =>
      props.headers
        .map((h) => h.key)
        .filter(
          (k) =>
            !dateColumns.includes(k) &&
            ![
              "cv_cv",
              "cv_motivation",
              "cv_preselection",
              "cv_test_entretien",
            ].includes(k)
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

    const hasValidatedCv = computed(() =>
      Array.isArray(props.items) &&
      props.items.some(cv => cv.cv_ligne_validation === 1)
    );

    const canValidate = (item) =>
      item.cv_ligne_selectionne === 1 &&
      item.cv_ligne_test_entretien === 1 &&
      !hasValidatedCv.value;

    const isValidated = (item) =>
      item.cv_ligne_validation === 1;

    const formatDateTime = (date) => {
      if (date !== null && date !== '') {
        return dayjs(date).format('DD/MM/YYYY HH:mm');
      } else {
        return '';
      }

    };




    return {
      otherColumns, canValidate, isValidated, hasValidatedCv,
      dateColumns,
      selectedItem,
      formatDate, formatDateTime,
      openFiche,
      dialog,
      filePreview,
      isImage,
      isPDF,
      openFiche,

      pagedItems,
      itemsPerPage,
      page,

      filterStatus,
      filteredItems,
    };
  },
};
</script>

<style>
.tab2 {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.radio-group-custom {
  display: flex;
  gap: 15px;
}


.custom-table3 {
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

.v-data-table.custom-table3 .v-table__wrapper1 table th,
.v-data-table.custom-table3 .v-table__wrapper1 table td {
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


.tableau-detail-wrapper2 .v-data-table .v-table__wrapper table th,
.tableau-detail-wrapper2 .v-data-table .v-table__wrapper table td {
  width: auto;
  max-width: none;

  min-width: 120px;
  white-space: normal;
  word-wrap: break-word;
}


.tableau-detail-wrapper2 .v-data-table {
  width: 100%;
  table-layout: auto;
  max-height: 230px;
}


.tableau-detail-wrapper2 .cell-with-button1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.tableau-detail-wrapper2 .cell-with-button1 .cell-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.tableau-detail-wrapper2 .cell-with-button1 .tb {
  flex-shrink: 0;
  min-width: 100px;
  color: #2e7d32;
}

.table-header-cv {
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

.tableau-detail-wrapper2 .v-data-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #8130e4;
  color: white;
}

.custom-table3 {
  min-height: 220px;
}

.v-data-table.custom-table3 .v-table__wrapper table th,
.v-data-table.custom-table3 .v-table__wrapper table td {
  border-right: 2px solid #ccc;
  border-bottom: 1px solid #ccc;
}
</style>
