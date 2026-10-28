<script setup>
import {reactive , computed, ref} from "vue";
import dayjs from "dayjs";


const props= defineProps ({
    headers: {type:Array , required:true},
    items: {type:Array , required:true},
    search: {type:String , default:''},
    loading: {type:Boolean , default:false},
    height: {type:[String,Number] , default:600},

    longTextCols: {
    type: Array,
    default: () => ['demande_desc', 'demande_auteur', 'demande_marque']
  },
  dateCols: {
    type: Array,
    default: () => ['maint_date', 'maint_date_cree', 'maint_date_modif', 'maint_demande_date', 'maint_demande_date_cree', 'demande_date_modif','demande_DATE']
  },

  totalDoublons: { type: Number, default: 0 },
  showNbDoublons: { type: Boolean, default: false },

  // Fonction personnalisée pour la couleur des lignes
  // rowPropsFormatter: {
  //   type: Function,
  //   default: (item) => (item?.demande_ETAT === 2 ? { class: 'highlight-bg' } : {})
  // }

});

const emit= defineEmits([`click:row`]);
const longMaxText = 30;
const mapDeveloppe = reactive({});
const formatDateTime = (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '');

const voirPlus = (item,index, field) => {
    const idItem = item?.demande_desc_id ?? item?.id ?? index;
    return `voirPlus_${idItem}_${field}`;
};

const ouvertVe = (item,index,field) => !!mapDeveloppe[voirPlus(item,index,field)];

const toogleOpened = (item, index, field) => {
  const k = voirPlus(item, index, field);
  mapDeveloppe[k] = !mapDeveloppe[k];
};

const tokonyApotraToogle = (item, field) => {
  const text = String(item?.[field] ?? '').trim();
  return text.length > longMaxText;
};

const truncatedText = (text) => {
  if (!text) return '';
  const s = String(text).trim();
  return s.length > longMaxText ? s.slice(0, longMaxText) + '…' : s;
};

const skeletonRows = computed(() => {
  const h = typeof props.height === 'number' ? props.height : 600;
  return Math.max(3, Math.floor(h / 50)); 
});


const filteredItems = computed(() => {
  const query = props.search.trim().toLowerCase();
  if (!query) return props.items;

  return props.items.filter((item) =>
    Object.values(item).some((val) =>
      String(val ?? '').toLowerCase().includes(query)
    )
  );
});


</script>

<template>
  <v-card class="bordered-new d-flex flex-column" :style="{ height: typeof height === 'number' ? height + 'px' : height }" density="compact">
    
    <div v-if="loading" class="pa-3 flex-grow-1 overflow-hidden">
      <!-- Faux headers -->
      <div class="d-flex ga-2 mb-3">
        <v-skeleton-loader
          v-for="(header, idx) in headers"
          :key="'sk-head-' + idx"
          type="chip"
          class="flex-grow-1"
        />
      </div>
      <!-- Fausses lignes -->
      <v-skeleton-loader
        v-for="n in skeletonRows"
        :key="'sk-row-' + n"
        type="table-row"
        class="my-1"
      />
    </div>

  
    <v-data-table-virtual
      v-else
      class="maint_header flex-grow-1"
      :headers="headers"
      :items="filteredItems"
      density="compact"
      fixed-header
      hover
      :height="height"
      no-data-text="Aucune données disponible pour l'instant"
      
      @click:row="(_, row) => emit('click:row', row.item)"
    >
      <template v-for="col in dateCols" :key="'date-' + col" v-slot:[`item.${col}`]="{ item }">
        {{ formatDateTime(item[col]) }}
      </template>

      <!-- Gestion dynamique des TEXTES LONGS -->
      <template v-for="col in longTextCols" :key="'long-' + col" v-slot:[`item.${col}`]="{ item, index }">
        <v-tooltip location="bottom" :disabled="!tokonyApotraToogle(item, col)">
          <template #activator="{ props: tooltipProps }">
            <div v-bind="tooltipProps" class="maintenance_cells">
              <span v-if="!ouvertVe(item, index, col)" class="text-truncate">
                {{ truncatedText(item[col]) }}
              </span>
              <span v-else class="text-wrap">
                {{ item[col] }}
              </span>

              <v-btn
                v-if="tokonyApotraToogle(item, col)"
                size="x-small"
                variant="text"
                class="mt-1 px-1 see-more-btn"
                color="primary"
                @click.stop="toogleOpened(item, index, col)"
              >
                {{ ouvertVe(item, index, col) ? 'Voir moins' : 'Voir plus' }}
              </v-btn>
            </div>
          </template>
          <span>{{ item[col] }}</span>
        </v-tooltip>
      </template>

      <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
        <slot :name="slotName" v-bind="slotData" />
      </template>
    </v-data-table-virtual>

    <v-card density="compact" class="pa-2 mt-1 border-t">
      <v-row no-gutters align="center" justify="space-between">
        <v-col cols="6" class="text-left font-weight-medium">
        <b>{{ filteredItems.length }}</b> Lignes affichées
        </v-col>

        <v-col cols="6" class="text-right font-weight-bold text-error" v-if="showNbDoublons">
          ⚠ {{ totalDoublons }} Doublons détectés
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>


<style scoped>
.bordered-new {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.maint_header .v-table__wrapper) {
  overflow-x: hidden !important;
  width: 100% !important;
}

:deep(.maint_header .v-table__wrapper > table) {
  table-layout: fixed !important;
  width: 100% !important;
} 

:deep(.maint_header .v-table__wrapper > table > thead > tr > th) {
  background-color: #0b3b17 !important;
  color: #d9dbe8 !important;
  font-weight: bold;
  white-space: nowrap;
  font-size: 11px !important;
  padding: 0 4px !important;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.maint_header .v-table__wrapper > table > tbody > tr > td) {
  font-size: 11px !important;
  padding: 0 4px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.maintenance_cells {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
  overflow: hidden;
}

.see-more-btn {
  font-size: 11px;
  min-height: 20px;
  text-transform: none;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.text-wrap {
  white-space: normal;
  word-break: break-word;
  width: 100%;
}

:deep(.highlight-bg) {
  background-color: #ffe5a1 !important;
}
</style>