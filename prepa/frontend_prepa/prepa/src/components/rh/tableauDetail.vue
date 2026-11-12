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

      <template v-slot:[`item.form_date`]="{ item }">
        {{ formatDate(item.form_date) }}
      </template>

      <template v-slot:[`item.mob_date`]="{ item }">
        {{ formatDate(item.mob_date) }}
      </template>

      <!-- <template v-slot:[`item.form_eval_ligne`]="{ item }">
          {{formatDate(item.form_eval_ligne)}}
      </template>

      <template v-slot:[`item.form_eval_froid_ligne`]="{ item }">
          {{formatDate(item.form_eval_froid_ligne)}}
      </template> -->


      <!-- DATE A CHAUD + œil -->
      <template v-slot:[`item.form_eval_ligne`]="{ item }">
        <div class="d-flex align-center">
          <span>{{ item.form_eval_ligne ? formatDate(item.form_eval_ligne) : "-" }}</span>

          <v-tooltip v-if="hasContent(item.form_eval_chaud)" location="top">
            <template #activator="{ props }">
              <!-- <v-btn v-bind="props" icon="mdi-eye" size="x-small" color="primary" variant="tonal" class="ml-2"
                @click="openContenu(item, 'form_eval_chaud')" /> -->
              <v-icon v-bind="props" color="primary" density="compact" class="cursor-pointer"
                @click="openContenu(item, 'form_eval_chaud')">
                mdi-eye
              </v-icon>
            </template>
            Aperçu
          </v-tooltip>
        </div>
      </template>

      <!-- DATE A FROID + œil -->
      <template v-slot:[`item.form_eval_froid_ligne`]="{ item }">
        <div class="d-flex align-center">
          <span>{{ item.form_eval_froid_ligne ? formatDate(item.form_eval_froid_ligne) : "-" }}</span>

          <v-tooltip v-if="hasContent(item.form_eval_froid)" location="top">
            <template #activator="{ props }">
              <!-- <v-btn v-bind="props" icon="mdi-eye" size="x-small" color="primary" variant="tonal" class="ml-2"
                @click="openContenu(item, 'form_eval_froid')" /> -->
              <v-icon v-bind="props" color="primary" density="compact" class="cursor-pointer"
                @click="openContenu(item, 'form_eval_froid')">
                mdi-eye
              </v-icon>
                
            </template>
            Aperçu
          </v-tooltip>
        </div>
      </template>





      <!-- Colonnes Évaluation à chaud / à froid (byte[]) -->
      <!-- <template v-for="champ in champsContenu" :key="champ" v-slot:[`item.${champ}`]="{ item }">
        <div class="d-flex align-center justify-center">
          <template v-if="hasContent(item[champ])">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-eye" size="x-small" color="primary" variant="tonal"
                  @click="openContenu(item, champ)" />
              </template>
              Aperçu
            </v-tooltip>
          </template>
          <span v-else>-</span>
        </div>
      </template> -->

    </v-data-table>


    <v-dialog v-model="dialogContenu" max-width="900" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-file-eye</v-icon>
          {{ titreContenu }}
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" size="small" @click="closeContenu" />
        </v-card-title>

        <v-card-text class="d-flex justify-center">
          <iframe v-if="contenuIsPDF && contenuUrl" :src="contenuUrl"
            style="width: 100%; height: 70vh; border: none;" />
          <img v-else-if="contenuIsImage && contenuUrl" :src="contenuUrl"
            style="max-width: 100%; max-height: 70vh; object-fit: contain;" />
          <div v-else>Format non pris en charge</div>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" color="red" @click="closeContenu">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>




    <!-- Résumé ultra compact -->
    <div class="summary-line">
      {{ items.length }} ligne<span v-if="items.length > 1">s</span>
      trouvée<span v-if="items.length > 1">s</span>.
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, defineComponent, onBeforeUnmount } from "vue";
import { useformatDate2 } from "@/composables/useformatDate2";
import Swal from "sweetalert2";




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

    const champsContenu = ["form_eval_chaud", "form_eval_froid"];
    const LABELS_CONTENU = {
      form_eval_chaud: "Évaluation à chaud",
      form_eval_froid: "Évaluation à froid",
    };

    const dialogContenu = ref(false);
    const contenuUrl = ref(null);
    const contenuIsImage = ref(false);
    const contenuIsPDF = ref(false);
    const titreContenu = ref("Aperçu");

    // Y a-t-il quelque chose à afficher ?
    const hasContent = (v) => {
      if (v == null) return false;
      if (Array.isArray(v)) return v.length > 0;
      return String(v).trim() !== "";
    };

    // Détecte le type à partir des premiers octets
    const detectMime = (bytes) => {
      const h = Array.from(bytes.slice(0, 4))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
      if (h.startsWith("25504446")) return "application/pdf";
      if (h.startsWith("FFD8FF")) return "image/jpeg";
      if (h.startsWith("89504E47")) return "image/png";
      if (h.startsWith("47494638")) return "image/gif";
      return "application/octet-stream";
    };

    const base64ToBytes = (b64) => {
      const bin = atob(b64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return arr;
    };

    // Convertit la valeur reçue de l'API (base64, data URL, hex, tableau d'octets) en Blob
    const toBlob = (data) => {
      let bytes;
      let mime = null;

      if (Array.isArray(data)) {
        // byte[] sérialisé en tableau de nombres (parfois signés : -128..127)
        bytes = Uint8Array.from(data, (b) => b & 0xff);
      } else if (typeof data === "string") {
        let s = data.trim();

        if (s.startsWith("data:")) {
          const m = s.match(/^data:(.*?);base64,(.*)$/);
          if (!m) throw new Error("Data URL invalide");
          mime = m[1];
          bytes = base64ToBytes(m[2]);
        } else {
          // bytea PostgreSQL : "\x25504446..."
          if (s.startsWith("\\x")) s = s.slice(2);

          if (/^[0-9A-Fa-f]+$/.test(s) && s.length % 2 === 0) {
            bytes = new Uint8Array(s.length / 2);
            for (let i = 0; i < s.length; i += 2) {
              bytes[i / 2] = parseInt(s.substring(i, i + 2), 16);
            }
          } else {
            bytes = base64ToBytes(s); // cas standard Jackson/Spring (byte[] → base64)
          }
        }
      } else {
        throw new Error("Format de données inconnu");
      }

      return new Blob([bytes], { type: mime || detectMime(bytes) });
    };

    const closeContenu = () => {
      dialogContenu.value = false;
      if (contenuUrl.value) {
        URL.revokeObjectURL(contenuUrl.value);
        contenuUrl.value = null;
      }
    };

    const openContenu = (item, champ) => {
      try {
        const blob = toBlob(item[champ]);

        if (contenuUrl.value) URL.revokeObjectURL(contenuUrl.value);
        contenuUrl.value = URL.createObjectURL(blob);

        contenuIsPDF.value = blob.type === "application/pdf";
        contenuIsImage.value = blob.type.startsWith("image/");
        titreContenu.value = LABELS_CONTENU[champ] ?? "Aperçu";

        dialogContenu.value = true;
      } catch (err) {
        console.error("Erreur aperçu :", err);
        Swal.fire({ icon: "error", title: "Impossible d'afficher le fichier" });
      }
    };

    onBeforeUnmount(() => {
      if (contenuUrl.value) URL.revokeObjectURL(contenuUrl.value);
    });

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
      champsContenu,
      hasContent,
      dialogContenu,
      contenuUrl,
      contenuIsImage,
      contenuIsPDF,
      titreContenu,
      openContenu,
      closeContenu,
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
