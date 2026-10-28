<template>
    <div style="min-width: max-content;">


        <v-data-table class="rh_header" :headers="headers" :items="items" :fixed-header="true" v-if="!loading"
            :loading="loading" density="compact" hide-default-footer hover="true" no-data-text="Pas données disponibles"
            :items-per-page="-1" :row-props="rowColor" height="450">

            <!-- <v-data-table :class="['blue-header', { 'grouped-table': hasGroupedHeaders }]" :headers="headers" :items="items"
            :fixed-header="true" v-if="!loading" :loading="loading" density="compact" hide-default-footer 
            hover="true" no-data-text="Pas données disponibles" :items-per-page="-1" :row-props="rowColor"
            height="650px"> -->


            <template v-slot:[`item.poste_telephonique`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.poste_telephonique" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'poste_telephonique', val)" />
                </div>
            </template>

            <template v-slot:[`item.empl_date_naiss`]="{ item }">
                {{ formatDate(item.empl_date_naiss) }}
            </template>

            <template v-slot:[`item.empl_prise_fonction`]="{ item }">
                {{ formatDate(item.empl_prise_fonction) }}
            </template>

            <template v-slot:[`item.empl_date_fin_essai1`]="{ item }">
                {{ formatDate(item.empl_date_fin_essai1) }}
            </template>

            <template v-slot:[`item.empl_date_fin_essai2`]="{ item }">
                {{ formatDate(item.empl_date_fin_essai2) }}
            </template>

            <template v-slot:[`item.empl_matricule`]="{ item }">
                <v-btn v-if="!item.empl_matricule && !String(item.empl_matricule || '').trim()" variant="flat"
                    size="x-small" color="#FFAB91" @click="action1PItem(item)" style="width:80px;color: black;">
                    {{ action1 }}
                </v-btn>

                <span v-else>
                    <span style="display: inline-block; line-height: 1">
                        <v-btn @click="actionDetail(item)" @mouseenter="showTooltip($event, 'Détail Employe')"
                            @mouseleave="hideTooltip" variant="text"
                            style="padding: 0;justify-content: flex-start;min-width: 100%;line-height: 1;"
                            class="btn-no-padding">
                            {{ item.empl_matricule }}
                        </v-btn>
                    </span>
                </span>
            </template>

            <template v-slot:[`item.empl_nom`]="{ item }">
                <span style="display: inline-block; line-height: 1">
                    <v-btn @click="actionDetail(item)" @mouseenter="showTooltip($event, 'Détail Employé')"
                        @mouseleave="hideTooltip" variant="text" 
                        style="padding: 0;justify-content: flex-start;min-width: 100%;line-height: 1;" class="btn-no-padding">
                        {{ item.empl_nom }}
                    </v-btn>
                </span>
            </template>



            <template v-slot:[`item.action`]="{ item }">
                <div class="d-flex align-center ga-1">

                    <!-- MODIFIER -->
                    <v-btn icon size="small" variant="text" color="primary" title="Modifier" @click="editItem(item)">
                        <v-icon size="20">
                            mdi-pencil
                        </v-icon>
                    </v-btn>

                    <!-- SUPPRIMER -->
                    <v-btn icon size="small" variant="text" color="error" title="Supprimer" @click="deleteItem(item)">
                        <v-icon size="20">
                            mdi-delete
                        </v-icon>
                    </v-btn>

                </div>
            </template>





        </v-data-table>
    </div>
    <div class="summary-line">
        {{ employees.length }} employé<span v-if="employees.length > 1">s</span>
        trouvée<span v-if="employees.length > 1">s</span>
    </div>
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
    emits: ['action1Item', 'action2Item', 'handleCheckboxClick', 'checkbox-change', 'editItem', 'deleteItem'],

    props: {
        employees: { type: Array, required: true },
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

        const formatDate = (date) => {
            if (date) return dayjs(date).format("DD/MM/YYYY");
            return "";
        };

        const editItem = (item) => {
            emit('editItem', item);
        };

        const deleteItem = (item) => {
            emit('deleteItem', item);
        };

        const actionDetail = (item) => {
            emit("actionDetail", item);
        };

        const tooltip = ref();
        // Fonction pour afficher l'info-bulle
        const showTooltip = (event, message) => {
            if (tooltip.value) {
                hideTooltip();
            }

            const div = document.createElement("div");
            div.id = "tooltip";
            div.innerText = message;
            div.style.position = "absolute";
            div.style.backgroundColor = "#333";
            div.style.color = "#fff";
            div.style.padding = "5px 10px";
            div.style.borderRadius = "4px";
            div.style.fontSize = "12px";
            div.style.pointerEvents = "none";
            div.style.top = `${event.clientY + 10}px`;
            div.style.left = `${event.clientX + 10}px`;
            div.style.zIndex = "1000";

            document.body.appendChild(div);
            tooltip.value = div;
        };

        const hideTooltip = () => {
            if (tooltip.value) {
                tooltip.value.remove();
                tooltip.value = null;
            }
        };

        return {
            action1PItem,
            getColor,
            rowColor,
            hasGroupedHeaders,
            onCheckboxChange,
            formatDate,
            editItem, deleteItem,
            actionDetail, tooltip, showTooltip, hideTooltip,
        };
    }

});
</script>


<style>
.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
    /* padding: 0 !important; */
    /* width: 1px !important;
    max-width: 1px !important; */
    overflow: hidden;
    white-space: nowrap;
}
</style>
