<template>
  <div class="tab1 tableau-detail-wrapper">
    <!-- Tableau avec défilement -->
    <v-data-table :headers="headers" :items="items" :loading="loading" loading-text="Chargement..." density="compact"
      hover hide-default-footer class="custom-table1 dettab">
      <!-- Slot personnalisé pour le header -->
      <template #headers="{ columns }">
        <tr>
          <th v-for="column in columns" :key="column.key" class="table-header fixed-col">
            {{ column.title }}
          </th>
        </tr>
      </template>
      <!--
      
      <template
        v-for="col in dateColumns"
        :key="col"
        v-slot:[`item.${col}`]="{ item }"
      >
        <div class="cell-with-button fixed-col">
          <span class="cell-text">{{ item[col] || "-" }}</span>

          <v-btn
            @click="$emit('formcv')"
            v-if="item.etape_libelle === 'RECEPTION CV' 
        && !item.ligne_etape_date 
        && items.some(i => i.etape_libelle === 'LANCEMENET OFFRE' && i.ligne_etape_date)"
  
            class="tb1"
            density="compact"
            v-bind="props"
          >
            <strong>Nouveau</strong>
          </v-btn>
          <v-btn
            @click="$emit('formoff')"
            v-if="item.etape_libelle === 'LANCEMENET OFFRE'  && !item.ligne_etape_date"
            class="tb1"
            density="compact"
            v-bind="props"
          >
            <strong>Nouveau</strong>
          </v-btn>
        
          <v-menu
            v-model="item.menuOpen"
            persistent
            :close-on-content-click="false"
            offset-y
            min-width="auto"
          >
            <template #activator="{ props }">
              <v-btn
                v-if="!item.ligne_etape_date"
                class="tb"
                density="compact"
                v-bind="props"
              >
                Définir date
              </v-btn>
            </template>
            <v-card>
            

              
              <v-date-picker
                v-model="item.tempDate"
                :title="`Sélectionner la date de ${item.etape_libelle}`"
                 color="deep-purple-accent-4"
                
                scrollable
              ></v-date-picker>

            
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn density="compact" text color="error" @click="item.menuOpen = false">
                  Annuler
                </v-btn>
                <v-btn density="compact" text color="primary" @click="validateDate(item)">
                  Valider
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
      </template> 
    -->
      <!-- 2) Colonne Date : afficher la date formatée ici -->
      <template v-slot:[`item.ligne_etape_date`]="{ item }">
        <div class="cell-with-button1 d-flex justify-center align-start">
          <span>{{
            item.ligne_etape_date ? formatDate(item.ligne_etape_date) : "-"
            }}</span>

          <!-- Tooltip uniquement sur l'icône -->
          <!--
          <v-tooltip v-if="item.ligne_etape_date" location="bottom">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                class="annuler"
                small
                color="white"
                @click="clearDate(item)"
              >
                mdi-close
              </v-icon>
            </template>
Vider la date
</v-tooltip> -->
        </div>
      </template>

      <template v-slot:[`item.ligne_etape_date_prevision`]="{ item }">
        <div class="cell-with-button1 d-flex justify-center align-start">
          <span>{{
            item.ligne_etape_date_prevision ? formatDate(item.ligne_etape_date_prevision) : "-"
            }}</span>

        </div>
      </template>
    </v-data-table>

    <!-- Résumé ultra compact -->
    <div class="summary-line">
      {{ items.length }} étape<span v-if="items.length > 1">s</span>
      trouvée<span v-if="items.length > 1">s</span>.
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, defineComponent } from "vue";
import { useformatDate2 } from "@/composables/useformatDate2";
export default {
  name: "TableauDetail",
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
    const dateColumns = ["etape_libelle"];
    const dialogVisible = ref(false);
    const selectedItem = ref(null);
    const selectedDate = ref(null);

    const menu = ref(false);
    onMounted(() => {
      // chaque ligne a ses propres variables locales
      props.items.forEach((item) => {
        if (item.menuOpen === undefined) item.menuOpen = false;
        if (item.tempDate === undefined)
          item.tempDate = item.ligne_etape_date || null;
      });
    });
    const openDialog = (item) => {
      selectedItem.value = item;
      selectedDate.value = item.date || null; // si item.date existe
      dialogVisible.value = true;
    };

    const closeDialog = () => {
      dialogVisible.value = false;
      selectedItem.value = null;
      selectedDate.value = null;
      menu.value = false;
    };

    const saveDate = () => {
      if (selectedItem.value) {
        selectedItem.value.date = selectedDate.value;
      }
      closeDialog();
    };
    const validateDate = (item) => {
      if (item.tempDate) {
        // on stocke la vraie Date (pas la string formatée)
        item.ligne_etape_date = new Date(item.tempDate);
      }
      item.menuOpen = false;
    };

    const clearDate = (item) => {
      item.ligne_etape_date = null;
      item.tempDate = null; // réinitialise le date-picker si ouvert
    };

    return {
      dateColumns,
      dialogVisible,
      selectedItem,
      selectedDate,
      menu,
      openDialog,
      closeDialog,
      saveDate,
      formatDate,
      validateDate,
      clearDate,
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


.custom-table1 {
  border-radius: 6px;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #ece6e6;
}


.table-header {
  background-color: #7d2fdc;
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

.v-data-table.custom-table1 .v-table__wrapper table th,
.v-data-table.custom-table1 .v-table__wrapper table td {
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

.tableau-detail-wrapper .v-data-table .v-table__wrapper table th,
.tableau-detail-wrapper .v-data-table .v-table__wrapper table td {
  width: 200px;
  max-width: 200px;
  min-width: 200px;
}


.tableau-detail-wrapper .cell-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.tableau-detail-wrapper .cell-with-button .cell-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.tableau-detail-wrapper .cell-with-button .tb {
  flex-shrink: 0;
  min-width: 100px;
  color: #2e7d32;
}

.annuler {
  margin-left: 20px;
  border: 1px solid #f63232;
  border-radius: 40px;
  background-color: #f63232;
}

.tableau-detail-wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.custom-table1 {
  min-height: 270px;
}
</style>
