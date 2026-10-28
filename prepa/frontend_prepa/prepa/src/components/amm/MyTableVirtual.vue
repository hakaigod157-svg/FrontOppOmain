<template>
    <v-card class="bordered-new" :style="{ height: typeof height === 'number' ? height + 'px' : height }"
        density="compact">
        <!-- Loader visible tant que loading = true -->
        <v-skeleton-loader v-if="loading" type="table" height="400" boilerplate class="ma-3" />

        <!-- Table virtuelle -->
        <v-data-table-virtual v-else class="amm_header" :headers="headers" :items="displayedItems" density="compact"
            fixed-header hover :height="height" no-data-text="Pas de données disponibles" @click:row="onClickRow"
            :row-props="rowColor">
            <!-- ACTION -->
            <template v-slot:[`item.action`]="{ item }">
                <v-btn size="x-small" color="#FFB74D" @click.stop="action1PItem(item)">
                    {{ action_modifier }}
                </v-btn>
            </template>

            <!-- DATES -->
            <template v-slot:[`item.date_reclam`]="{ item }">
                {{ formatDateTime(item.date_reclam) }}
            </template>
            <template v-slot:[`item.date_amm`]="{ item }">
                {{ formatDateTime(item.date_amm) }}
            </template>
            <template v-slot:[`item.date_amm_fiche_article`]="{ item }">
                {{ formatDateTime(item.date_amm_fiche_article) }}
            </template>

            <!-- ACTIONS (supprimer / autre) -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn variant="flat" block size="x-small" color="#E57373" @click.stop="action2PItem(item)"
                    style="margin-top:2px;margin-bottom:2px">
                    {{ action2 }}
                </v-btn>
            </template>

            <!-- Colonnes longues: arlib, nom_com, dci, presentation, fabricant -->
            <template v-for="col in longTextCols" v-slot:[`item.${col}`]="{ item, index }" :key="col">
                <v-tooltip bottom>
                    <template #activator="{ props, on }">
                        <div v-bind="props" v-on="on" class="midac-cell"
                            :class="{ expanded: isExpanded(item, index, col) }"
                            style="max-width:700px; display:flex; flex-direction:column; align-items:flex-start;">
                            <span v-if="!isExpanded(item, index, col)"
                                style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100%;">
                                {{ truncatedText(item[col]) }}
                            </span>

                            <span v-else style="white-space:normal; word-break:break-word; width:100%;">
                                {{ item[col] }}
                            </span>

                            <template v-if="shouldShowToggle(item, col)">
                                <v-btn size="x-small" variant="text" class="mt-1 px-1 see-more-btn"
                                    style="color:#1976d2; align-self:flex-start;"
                                    @click.stop="toggleExpand(item, index, col)">
                                    {{ isExpanded(item, index, col) ? 'Voir moins' : 'Voir plus' }}
                                </v-btn>
                            </template>
                        </div>
                    </template>
                    <span>{{ item[col] }}</span>
                </v-tooltip>
            </template>

            <!-- code_opham -->
            <template v-slot:[`item.code_opham`]="{ item }">
                <v-btn v-if="!item.code_opham || !String(item.code_opham || '').trim()" variant="flat" size="x-small"
                    color="#FFAB91" style="width:80px;color:black;" @click.stop="action5PItem(item)">
                    {{ action5 }}
                </v-btn>
                <span v-else>{{ item.code_opham }}</span>
            </template>

            <template v-slot:[`item.abrog_bouton`]="{ item }">
                <v-btn v-if="item.abrog_bouton == 1" variant="flat" block size="x-small" color="#E57373"
                    @click.stop="action2PItem(item)" style="margin-top:2px; margin-bottom:2px">
                    Abroger
                </v-btn>
            </template>

            <template v-slot:[`item.abrog_ammdate`]="{ item }">
                {{ formatDateTime(item.abrog_ammdate) }}
            </template>

            <template v-slot:[`item.abrog_expirationdate`]="{ item }">
                {{ formatDateTime(item.abrog_expirationdate) }}
            </template>

            <template v-slot:[`item.abrog_libelle`]="{ item }">
                <div :style="{
                    backgroundColor: item.abrog_bouton == 0 ? '#B2DFDB' : 'transparent',
                    padding: '4px 8px',
                    borderRadius: '4px'
                }">
                    {{ item.abrog_libelle }}
                </div>
            </template>




        </v-data-table-virtual>

        <!-- Footer résumé -->
        <v-card density="compact" class="pa-1 mt-1">
            <v-row no-gutters align="center" justify="space-between">
                <v-col cols="6" class="text-left">
                    <b>{{ totalArticles }}</b> Lignes affichées
                </v-col>

                <v-col cols="6" class="text-right" v-if="isdouble">
                    <b style="color: red;">{{ totalDoublons }}</b> Doublons détectés
                </v-col>
            </v-row>
        </v-card>
    </v-card>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import dayjs from 'dayjs';

/* -----------------------
   Props & emits
------------------------ */
const props = defineProps({
    headers: { type: Array, required: true },
    items: { type: Array, required: true },
    search: { type: String, default: '' },

    action_modifier: { type: String, default: 'Modifier' },
    action2: { type: String, default: 'Supprimer' },
    action5: { type: String, default: 'Action' },
    loading: { type: Boolean, default: false },
    totalDoublons: { type: Number, default: 0 },
    showNbDoublans: { type: Boolean, default: false },
    height: { type: [String, Number], default: 600 },
});

const emit = defineEmits(['action1Item', 'action2Item', 'action5Item', 'click:row']);

/* -----------------------
   Helpers & reactive state
------------------------ */
const longTextCols = ['arlib', 'nom_com', 'dci', 'presentation', 'fabricant'];
const formatDateTime = (d) => (d ? dayjs(d).format('DD/MM/YYYY') : '');
const totalArticles = computed(() => displayedItems.value.length);
const isdouble = ref(props.showNbDoublans);

const state = reactive({
    expandedMap: {},
    maxLength: 30,
});

const keyFor = (item, index, field) => {
    if (!item) return `idx_${index}_${field}`;
    const id = item.arlib_id ?? item.id ?? null;
    return id != null ? `id_${id}_${field}` : `idx_${index}_${field}`;
};

const isExpanded = (item, index, field) => !!state.expandedMap[keyFor(item, index, field)];
const toggleExpand = (item, index, field) => {
    const k = keyFor(item, index, field);
    state.expandedMap[k] = !state.expandedMap[k];
};

const shouldShowToggle = (item, field) => {
    const text = String(item?.[field] ?? '').trim();
    return text.length > state.maxLength;
};

const truncatedText = (text) => {
    if (!text) return '';
    const s = String(text).trim();
    return s.length > state.maxLength ? s.slice(0, state.maxLength) + '…' : s;
};

/* -----------------------
   Optimisation : chargement progressif
------------------------ */
const allItems = ref([]);
const displayedItems = ref([]);
const chunkSize = 1000;

const filteredItems = computed(() => {
    const search = props.search.trim().toLowerCase();

    if (!search) {
        return props.items;
    }

    return props.items.filter(item => {
        return Object.values(item).some(value =>
            String(value ?? '')
                .toLowerCase()
                .includes(search)
        );
    });
});

watch(
    filteredItems,
    (newItems) => {
        allItems.value = newItems || [];
        displayedItems.value = [];

        loadNextChunk();
    },
    { immediate: true }
);

function loadNextChunk() {
    const start = displayedItems.value.length;

    const nextChunk = allItems.value.slice(
        start,
        start + chunkSize
    );

    if (nextChunk.length) {
        displayedItems.value.push(...nextChunk);

        requestAnimationFrame(() => {
            loadNextChunk();
        });
    }
}

/* -----------------------
   Actions / emits
------------------------ */
const action1PItem = (item) => emit('action1Item', item);
const action2PItem = (item) => emit('action2Item', item);
const action5PItem = (item) => emit('action5Item', item);
const onClickRow = (payload) => emit('click:row', payload);


// ✅ Computed pour la classe de ligne
const rowColor = computed(() => (item) => {

    // 🟩 Si cc2_pass_bal == 1 → ligne colorée
    if (item.item.amm_gere_opham === 1) {
        return { class: 'highlight-bg' };
    }
    else {
        return { class: 'default' };
    }
});
</script>

<style scoped>
.v-data-table.amm_header .v-table__wrapper>table>thead>tr th,
.v-data-table.amm_header .v-table__wrapper>table tbody>tr th {
    background-color: #b3ccb8 !important;
    white-space: nowrap;
    color: #000000 !important;
}

.bordered-new {
    border-left: 3px solid #ccc;
    border-right: 3px solid #ccc;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    height: 100%;
}

.v-data-table-virtual {
    flex: 1;
    overflow: hidden;
}

.midac-cell {
    display: flex;
    align-items: center;
    white-space: normal !important;
    overflow: visible !important;
    word-break: break-word;
}

.see-more-btn {
    font-size: 11px;
    min-height: 20px;
}

.v-data-table__row {
    height: 48px;
}

.v-data-table__td {
    padding: 8px 12px;
    vertical-align: middle;
}

.highlight-bg {
    background-color: #ffe5a1 !important;
}
</style>
