<template>
    <div style="min-width: max-content;">


        <!-- <v-data-table class="blue-header" :headers="headers" :items="items" :fixed-header="true" v-if="!loading"
            :loading="loading" density="compact" hide-default-footer :etape="etape" hover="true"
            no-data-text="Pas données disponibles" :items-per-page="-1" :row-props="rowColor"> -->

        <v-data-table :class="['blue-header20', { 'grouped-table': hasGroupedHeaders }]" :headers="headers"
            :items="items" :fixed-header="true" v-if="!loading" :loading="loading" density="compact" hide-default-footer
            :etape="etape" hover="true" no-data-text="Pas données disponibles" :items-per-page="-1"
            :row-props="rowColor" height="650px">



            <!-- ASSURANCE -->
            <template v-slot:[`item.ascoma_assurance`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.ascoma_assurance" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'ascoma_assurance', val)" />
                </div>

            </template>

            <!-- CASIER -->
            <template v-slot:[`item.casier_casier`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.casier_casier" :true-value="1" :false-value="0" hide-details
                        density="compact" @update:model-value="val => onCheckboxChange(item, 'casier_casier', val)" />
                </div>

            </template>

            <!-- EPI -->
            <template v-slot:[`item.blouse_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.blouse_epi" :true-value="1" :false-value="0" hide-details
                        density="compact" @update:model-value="val => onCheckboxChange(item, 'blouse_epi', val)" />
                </div>

            </template>

            <template v-slot:[`item.casque_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.casque_epi" :true-value="1" :false-value="0" hide-details
                        density="compact" @update:model-value="val => onCheckboxChange(item, 'casque_epi', val)" />
                </div>

            </template>

            <template v-slot:[`item.chaussure_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.chaussure_epi" :true-value="1" :false-value="0" hide-details
                        density="compact" @update:model-value="val => onCheckboxChange(item, 'chaussure_epi', val)" />
                </div>

            </template>

            <template v-slot:[`item.combinaison_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.combinaison_epi" :true-value="1" :false-value="0" hide-details
                        density="compact" @update:model-value="val => onCheckboxChange(item, 'combinaison_epi', val)" />
                </div>

            </template>

            <template v-slot:[`item.doudoune_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.doudoune_epi" :true-value="1" :false-value="0" hide-details
                        density="compact" @update:model-value="val => onCheckboxChange(item, 'doudoune_epi', val)" />
                </div>

            </template>

            <template v-slot:[`item.gant_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.gant_epi" :true-value="1" :false-value="0" hide-details density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'gant_epi', val)" />
                </div>

            </template>

            <template v-slot:[`item.gilet_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.gilet_epi" :true-value="1" :false-value="0" hide-details density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'gilet_epi', val)" />
                </div>

            </template>

            <template v-slot:[`item.impermeable_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.impermeable_epi" :true-value="1" :false-value="0" hide-details
                        density="compact" @update:model-value="val => onCheckboxChange(item, 'impermeable_epi', val)" />
                </div>

            </template>

            <!-- MAT INFO -->
            <template v-slot:[`item.laptop_mat_info`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.laptop_mat_info" :true-value="1" :false-value="0" hide-details
                        density="compact" @update:model-value="val => onCheckboxChange(item, 'laptop_mat_info', val)" />
                </div>

            </template>

            <template v-slot:[`item.pc_bureau_mat_info`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.pc_bureau_mat_info" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'pc_bureau_mat_info', val)" />
                </div>

            </template>

            <template v-slot:[`item.tablette_mat_info`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.tablette_mat_info" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'tablette_mat_info', val)" />
                </div>

            </template>

            <!-- ROULANT -->
            <template v-slot:[`item.carte_carburant_roulant`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.carte_carburant_roulant" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'carte_carburant_roulant', val)" />
                </div>

            </template>

            <template v-slot:[`item.moto_roulant`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.moto_roulant" :true-value="1" :false-value="0" hide-details
                        density="compact" @update:model-value="val => onCheckboxChange(item, 'moto_roulant', val)" />
                </div>

            </template>

            <template v-slot:[`item.vehicule_roulant`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.vehicule_roulant" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'vehicule_roulant', val)" />
                </div>

            </template>

            <!-- TELEPHONIQUE -->
            <template v-slot:[`item.appel_telephonique`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.appel_telephonique" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'appel_telephonique', val)" />
                </div>
            </template>

            <template v-slot:[`item.data_telephonique`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.data_telephonique" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'data_telephonique', val)" />
                </div>
            </template>

            <template v-slot:[`item.poste_telephonique`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.poste_telephonique" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'poste_telephonique', val)" />
                </div>

            </template>



<!-- TITLE CHECKBOX -->





            <!-- ASSURANCE -->
            <template #header.ascoma_assurance="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('ascoma_assurance')"
                        :indeterminate="isColumnSome('ascoma_assurance')" hide-details density="compact"
                        color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('ascoma_assurance', val)" />
                </div>
            </template>

            <!-- CASIER -->
            <template #header.casier_casier="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('casier_casier')"
                        :indeterminate="isColumnSome('casier_casier')" hide-details density="compact"
                        color="deep-purple-accent-4" @update:model-value="val => toggleColumn('casier_casier', val)" />
                </div>
            </template>

            <!-- EPI -->
            <template #header.blouse_epi="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('blouse_epi')" :indeterminate="isColumnSome('blouse_epi')"
                        hide-details density="compact" color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('blouse_epi', val)" />
                </div>
            </template>
            <template #header.casque_epi="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('casque_epi')" :indeterminate="isColumnSome('casque_epi')"
                        hide-details density="compact" color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('casque_epi', val)" />
                </div>
            </template>
            <template #header.chaussure_epi="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('chaussure_epi')"
                        :indeterminate="isColumnSome('chaussure_epi')" hide-details density="compact"
                        color="deep-purple-accent-4" @update:model-value="val => toggleColumn('chaussure_epi', val)" />
                </div>
            </template>
            <template #header.combinaison_epi="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('combinaison_epi')"
                        :indeterminate="isColumnSome('combinaison_epi')" hide-details density="compact"
                        color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('combinaison_epi', val)" />
                </div>
            </template>
            <template #header.doudoune_epi="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('doudoune_epi')" :indeterminate="isColumnSome('doudoune_epi')"
                        hide-details density="compact" color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('doudoune_epi', val)" />
                </div>
            </template>
            <template #header.gant_epi="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('gant_epi')" :indeterminate="isColumnSome('gant_epi')"
                        hide-details density="compact" color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('gant_epi', val)" />
                </div>
            </template>
            <template #header.gilet_epi="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('gilet_epi')" :indeterminate="isColumnSome('gilet_epi')"
                        hide-details density="compact" color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('gilet_epi', val)" />
                </div>
            </template>
            <template #header.impermeable_epi="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('impermeable_epi')"
                        :indeterminate="isColumnSome('impermeable_epi')" hide-details density="compact"
                        color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('impermeable_epi', val)" />
                </div>
            </template>

            <!-- MAT INFO -->
            <template #header.laptop_mat_info="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('laptop_mat_info')"
                        :indeterminate="isColumnSome('laptop_mat_info')" hide-details density="compact"
                        color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('laptop_mat_info', val)" />
                </div>
            </template>
            <template #header.pc_bureau_mat_info="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('pc_bureau_mat_info')"
                        :indeterminate="isColumnSome('pc_bureau_mat_info')" hide-details density="compact"
                        color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('pc_bureau_mat_info', val)" />
                </div>
            </template>
            <template #header.tablette_mat_info="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('tablette_mat_info')"
                        :indeterminate="isColumnSome('tablette_mat_info')" hide-details density="compact"
                        color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('tablette_mat_info', val)" />
                </div>
            </template>

            <!-- ROULANT -->
            <template #header.carte_carburant_roulant="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('carte_carburant_roulant')"
                        :indeterminate="isColumnSome('carte_carburant_roulant')" hide-details density="compact"
                        color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('carte_carburant_roulant', val)" />
                </div>
            </template>
            <template #header.moto_roulant="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('moto_roulant')" :indeterminate="isColumnSome('moto_roulant')"
                        hide-details density="compact" color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('moto_roulant', val)" />
                </div>
            </template>
            <template #header.vehicule_roulant="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('vehicule_roulant')"
                        :indeterminate="isColumnSome('vehicule_roulant')" hide-details density="compact"
                        color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('vehicule_roulant', val)" />
                </div>
            </template>

            <!-- TELEPHONIQUE -->
            <template #header.appel_telephonique="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('appel_telephonique')"
                        :indeterminate="isColumnSome('appel_telephonique')" hide-details density="compact"
                        color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('appel_telephonique', val)" />
                </div>
            </template>
            <template #header.data_telephonique="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('data_telephonique')"
                        :indeterminate="isColumnSome('data_telephonique')" hide-details density="compact"
                        color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('data_telephonique', val)" />
                </div>
            </template>
            <template #header.poste_telephonique="{ column }">
                <div class="header-check">
                    <span>{{ column.title }}</span>
                    <v-checkbox :model-value="isColumnAll('poste_telephonique')"
                        :indeterminate="isColumnSome('poste_telephonique')" hide-details density="compact"
                        color="deep-purple-accent-4"
                        @update:model-value="val => toggleColumn('poste_telephonique', val)" />
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


        const rowColor = (props) => {
            const item = props.item;

            const isRetour =
                (item.liv_chauf && item.liv_chauf.includes('RETOUR')) ||
                (item.liv_voit && item.liv_voit.includes('RETOUR'));

            if (isRetour) {
                return { class: 'redCar-bg' };
            }

            if (item.xcode === '11111' && !isRetour) {
                return { class: 'colorCar-bg' };
            }

            return {};
        };

        // Toutes les lignes de la colonne sont cochées ?
        const isColumnAll = (key) =>
            (props.items || []).length > 0 &&
            props.items.every((it) => it[key] === 1);

        // Certaines (mais pas toutes) sont cochées ? → état indéterminé
        const isColumnSome = (key) =>
            (props.items || []).some((it) => it[key] === 1) && !isColumnAll(key);

        // Coche / décoche toute la colonne
        const toggleColumn = (key, val) => {
            const value = val ? 1 : 0;
            (props.items || []).forEach((item) => {
                if (item[key] !== value) {          // n'émet que si la valeur change
                    item[key] = value;              // mise à jour visuelle
                    emit("checkbox-change", { item, key, value });
                }
            });
        };
        const headerSlotName = (key) => `header.${key}`;

        return {
            action1PItem,
            getColor,
            rowColor,
            hasGroupedHeaders,
            onCheckboxChange,
            isColumnAll,
            isColumnSome,
            toggleColumn, headerSlotName,
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

/* Case colorée différemment des en-têtes (cyan / vert) */
.header-check .v-selection-control .v-icon {
    color: #D81B60 !important;        /* rose foncé : case décochée et cochée */
    opacity: 1 !important;
    font-size: 18px !important;
}

/* Petit fond blanc arrondi pour que la case ressorte */
.header-check .v-selection-control__input {
    background: #ffffff;
    border-radius: 4px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
