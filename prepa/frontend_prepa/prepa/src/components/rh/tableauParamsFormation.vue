<template>
    <div style="min-width: max-content;">


        <!-- <v-data-table class="blue-header" :headers="headers" :items="items" :fixed-header="true" v-if="!loading"
            :loading="loading" density="compact" hide-default-footer :etape="etape" hover="true"
            no-data-text="Pas données disponibles" :items-per-page="-1" :row-props="rowColor"> -->

        <v-data-table :class="['blue-header20', { 'grouped-table': hasGroupedHeaders }]" :headers="headers"
            :items="items" :fixed-header="true" v-if="!loading" :loading="loading" density="compact" hide-default-footer
            :etape="etape" hover="true" no-data-text="Pas données disponibles" :items-per-page="-1"
            :row-props="rowColor" height="650px">


            <template v-for="key in checkboxKeys" v-slot:[`item.${key}`]="{ item }" :key="key">
                <div class="cell-center">
                    <v-checkbox v-model="item[key]" :true-value="1" :false-value="0" hide-details density="compact"
                        @update:model-value="val => onCheckboxChange(item, key, val)" />
                </div>
            </template>


            <!-- EN-TÊTES : CHECKBOX "TOUT COCHER" AU-DESSUS DU TITRE -->
            <template v-for="key in checkboxKeys" v-slot:[`header.${key}`]="{ column }" :key="'h-' + key">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll(key)" :indeterminate="isColumnSome(key)" hide-details
                        density="compact" @update:model-value="val => toggleColumn(key, val)" />
                </div>
            </template>


        </v-data-table>
    </div>
    <!-- </div> -->
    <!-- </div> -->
    <!-- <v-card density="compact" v-if="showNbLignes">
                    <v-card>
                        <v-row>
                            <v-col>
                                <v-sheet class="pl-2 custom-grey">
                                    <b> {{ totalArticles }}</b> Lignes Trouvées
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </v-card>
        </v-card> -->
</template>
<script>
import { defineComponent } from 'vue';
import {
    VDataTableVirtual,
    VDataTable,
    VDataTableServer,
} from "vuetify/lib/components";
import { useAlerteStore } from "@/store/utils/alerte.js"
import { ref, onMounted, onBeforeMount, computed, reactive } from 'vue';
import dayjs from 'dayjs';

export default defineComponent({
    components: {
        VDataTable,
        VDataTableServer,
        VDataTableVirtual,
    },
    emits: ['action1Item', 'action2Item', 'handleCheckboxClick', 'checkbox-change'],

    props: {
        headers: Object,
        items: Array,
        headerColor: {
            String,
            default: 'blue'
        },

        loading: {
            type: Boolean,
            default: false
        },
        color2: {
            type: String,
            default: "#FFF8E1"
        },
        action1: String,
        action2: String,
        action3: String,
        titre_list: String,
        itemslist: Object,
        header_text: String,
        alerte: String,
        etape: String,

        showAction1: {
            type: Boolean,
            default: false
        },

        showAction3: {
            type: Boolean,
            default: false
        },
        showNbLigne: {
            type: Boolean,
            default: true
        },

        checkboxKeys: {
            type: Array,
            default: () => []
        },
    },
    defaults: {
        VDataTable: {
            fixedHeader: true,
            noDataText: 'Pas de resultats',
        },
    },

    setup(props, { emit }) {
        const showNbLignes = ref(props.showNbLigne);

        const hasGroupedHeaders = computed(() => {
            return (props.headers || []).some(h => Array.isArray(h.children) && h.children.length);
        });

        const onCheckboxChange = (item, key, val) => {
            const value = val ? 1 : 0;
            item[key] = value; // mise à jour visuelle immédiate
            emit('checkbox-change', { item, key, value });
        };

        // showNbLignes.value = props.showNbLigne
        const storeAlert = useAlerteStore();
        const loading = ref(false);
        const alerte = ref('');

        const action1PItem = (item) => {
            emit('action1Item', item);
        };

        const getColor = (valeur) => {
            if (valeur.trim() == "OR") return '#ff66ff';
            else if (valeur.trim() == "ARGENT") return '#ffff00';
            else if (valeur.trim() == "BRONZE") return '#99ffff';
            else if (valeur.trim() == "FER") return '#c0c0c0';
        };

        onMounted(async () => {

        })

        // Toutes les lignes de la colonne sont cochées ?
        const isColumnAll = (key) =>
            (props.items || []).length > 0 &&
            props.items.every((it) => it[key] === 1);

        // Certaines (mais pas toutes) ? → état indéterminé
        const isColumnSome = (key) =>
            (props.items || []).some((it) => it[key] === 1) && !isColumnAll(key);

        // Coche / décoche toute la colonne
        const toggleColumn = (key, val) => {
            const value = val ? 1 : 0;
            (props.items || []).forEach((item) => {
                if (item[key] !== value) {
                    item[key] = value;
                    emit("checkbox-change", { item, key, value });
                }
            });
        };




        return {
            action1PItem,
            getColor,
            hasGroupedHeaders,
            onCheckboxChange,
            isColumnAll,
            isColumnSome,
            toggleColumn,
        };
    }

});
</script>


<style>
.v-data-table.blue-header20 .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header20 .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
    /* padding: 0 !important; */
    /* width: 1px !important;
    max-width: 1px !important; */
    overflow: hidden;
    white-space: nowrap;
}

/* Couleurs par groupe — appliquées uniquement quand le tableau a des en-têtes groupés */




/* ASSURANCE */
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(1)>th:nth-child(3),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(2)>th:nth-child(1),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>tbody>tr>td:nth-child(3) {
    background-color: #B2EBF2 !important;
    color: black !important;
}

/* CASIER */
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(1)>th:nth-child(4),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(2)>th:nth-child(2),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>tbody>tr>td:nth-child(4) {
    background-color: #d2f1d3 !important;
    color: black !important;
}

/* EPI */
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(1)>th:nth-child(5),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(2)>th:nth-child(n+3):nth-child(-n+10),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>tbody>tr>td:nth-child(n+5):nth-child(-n+12) {
    background-color: #B2EBF2 !important;
    color: black !important;
}

/* MAT INFO */
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(1)>th:nth-child(6),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(2)>th:nth-child(n+11):nth-child(-n+13),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>tbody>tr>td:nth-child(n+13):nth-child(-n+15) {
    background-color: #d2f1d3 !important;
    color: black !important;
}

/* ROULANT */
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(1)>th:nth-child(7),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(2)>th:nth-child(n+14):nth-child(-n+16),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>tbody>tr>td:nth-child(n+16):nth-child(-n+18) {
    background-color: #B2EBF2 !important;
    color: black !important;
}

/* TELEPHONIQUE */
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(1)>th:nth-child(8),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>thead>tr:nth-child(2)>th:nth-child(n+17),
.v-data-table.blue-header20.grouped-table .v-table__wrapper>table>tbody>tr>td:nth-child(n+19) {
    background-color: #d2f1d3 !important;
    color: black !important;
}


.v-data-table.blue-header20 th,
.v-data-table.blue-header20 td {
    font-size: 11px !important;
    padding: 2px 4px !important;
    max-width: 150px !important;
    min-width: 40px !important;
    width: 40px !important;
    white-space: nowrap;
    overflow: hidden;
}

.v-data-table.blue-header20 td:has(.v-checkbox) {
    width: 32px !important;
    min-width: 32px !important;
    max-width: 32px !important;
    padding: 0 !important;
}

/* .v-data-table.blue-header20 thead th {
    font-size: 9px !important;
    padding: 2px !important;
    line-height: 10px !important;
    max-width: 40px !important;
} */

.v-data-table.blue-header20 thead tr:nth-child(1) th {
    font-size: 14px !important;
    font-weight: 700;
}

.v-data-table.blue-header20 thead tr:nth-child(2) th {
    font-size: 9px !important;
    font-weight: 600;
}

.cell-center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

/* Case en haut, titre en bas */
.header-check {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    gap: 1px;
    line-height: 1;
}

.header-check .v-input,
.header-check .v-selection-control {
    flex: none;
    width: auto;
    min-height: 20px !important;
}

.header-check .v-selection-control__wrapper {
    height: 20px;
    width: 20px;
}

/* Case colorée différemment des en-têtes */
.header-check .v-selection-control .v-icon {
    color: #D81B60 !important;
    opacity: 1 !important;
    font-size: 18px !important;
}

.header-check .v-selection-control__input {
    background: #ffffff;
    border-radius: 4px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-check span {
    color: #000;
    font-weight: 700;
}

/* En-tête de 2e ligne : compact, titres longs non coupés */
.v-data-table.blue-header20 thead tr:nth-child(2) th {
    height: auto !important;
    padding: 2px 4px !important;
    min-width: 70px !important;
    width: auto !important;
    white-space: normal !important;
    text-align: center;
    vertical-align: middle;
}
</style>
