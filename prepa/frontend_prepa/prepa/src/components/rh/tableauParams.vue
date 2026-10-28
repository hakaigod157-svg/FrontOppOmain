<template>
    <div style="min-width: max-content;">


        <!-- <v-data-table class="blue-header" :headers="headers" :items="items" :fixed-header="true" v-if="!loading"
            :loading="loading" density="compact" hide-default-footer :etape="etape" hover="true"
            no-data-text="Pas données disponibles" :items-per-page="-1" :row-props="rowColor"> -->

        <v-data-table :class="['blue-header20', { 'grouped-table': hasGroupedHeaders }]" :headers="headers" :items="items"
            :fixed-header="true" v-if="!loading" :loading="loading" density="compact" hide-default-footer :etape="etape"
            hover="true" no-data-text="Pas données disponibles" :items-per-page="-1" :row-props="rowColor"
            height="650px">



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
                        density="compact" 
                        @update:model-value="val => onCheckboxChange(item, 'casier_casier', val)"/>
                </div>

            </template>

            <!-- EPI -->
            <template v-slot:[`item.blouse_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.blouse_epi" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'blouse_epi', val)" />
                </div>

            </template>

            <template v-slot:[`item.casque_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.casque_epi" :true-value="1" :false-value="0" hide-details
                        density="compact" 
                        @update:model-value="val => onCheckboxChange(item, 'casque_epi', val)"/>
                </div>

            </template>

            <template v-slot:[`item.chaussure_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.chaussure_epi" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'chaussure_epi', val)" />
                </div>

            </template>

            <template v-slot:[`item.combinaison_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.combinaison_epi" :true-value="1" :false-value="0" hide-details
                        density="compact" 
                        @update:model-value="val => onCheckboxChange(item, 'combinaison_epi', val)"/>
                </div>

            </template>

            <template v-slot:[`item.doudoune_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.doudoune_epi" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'doudoune_epi', val)" />
                </div>

            </template>

            <template v-slot:[`item.gant_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.gant_epi" :true-value="1" :false-value="0" hide-details
                        density="compact" 
                        @update:model-value="val => onCheckboxChange(item, 'gant_epi', val)"/>
                </div>

            </template>

            <template v-slot:[`item.gilet_epi`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.gilet_epi" :true-value="1" :false-value="0" hide-details
                        density="compact" 
                        @update:model-value="val => onCheckboxChange(item, 'gilet_epi', val)"/>
                </div>

            </template>

            <template v-slot:[`item.impermeable_epi`]="{ item }">
                <div class="cell-center">
                <v-checkbox v-model="item.impermeable_epi" :true-value="1" :false-value="0" hide-details
                    density="compact" 
                    @update:model-value="val => onCheckboxChange(item, 'impermeable_epi', val)"/>
                </div>

            </template>

            <!-- MAT INFO -->
            <template v-slot:[`item.laptop_mat_info`]="{ item }">
                <div class="cell-center">
                <v-checkbox v-model="item.laptop_mat_info" :true-value="1" :false-value="0" hide-details
                    density="compact" 
                    @update:model-value="val => onCheckboxChange(item, 'laptop_mat_info', val)"/>
                </div>

            </template>

            <template v-slot:[`item.pc_bureau_mat_info`]="{ item }">
                <div class="cell-center">
                <v-checkbox v-model="item.pc_bureau_mat_info" :true-value="1" :false-value="0" hide-details
                    density="compact" 
                    @update:model-value="val => onCheckboxChange(item, 'pc_bureau_mat_info', val)"/>
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
                    @update:model-value="val => onCheckboxChange(item, 'carte_carburant_roulant', val)"  />
                </div>

            </template>

            <template v-slot:[`item.moto_roulant`]="{ item }">
                <div class="cell-center">
                <v-checkbox v-model="item.moto_roulant" :true-value="1" :false-value="0" hide-details
                    density="compact"
                    @update:model-value="val => onCheckboxChange(item, 'moto_roulant', val)" />
                </div>

            </template>

            <template v-slot:[`item.vehicule_roulant`]="{ item }">
                <div class="cell-center">
                <v-checkbox v-model="item.vehicule_roulant" :true-value="1" :false-value="0" hide-details
                    density="compact" 
                    @update:model-value="val => onCheckboxChange(item, 'vehicule_roulant', val)"/>
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
                    @update:model-value="val => onCheckboxChange(item, 'data_telephonique', val)"/>
                </div>
            </template>

            <template v-slot:[`item.poste_telephonique`]="{ item }">
                <div class="cell-center">
                <v-checkbox v-model="item.poste_telephonique" :true-value="1" :false-value="0" hide-details
                    density="compact" 
                    @update:model-value="val => onCheckboxChange(item, 'poste_telephonique', val)"/>
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

        return {
            action1PItem,
            getColor,
            rowColor,
            hasGroupedHeaders,
            onCheckboxChange,
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
</style>
