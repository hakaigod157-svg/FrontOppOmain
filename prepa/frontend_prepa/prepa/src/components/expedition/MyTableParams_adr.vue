<template>
    <!-- <v-data-table class="header_exped border-params" style="width: 100%;" :headers="headers" :items="items"
        density="compact" no-data-text="Pas de données disponibles" :fixed-header="true" :items-per-page="-1"
        hide-default-footer item-value="seq" select-strategy="single" :row-props="rowColor"
        :item-class="colorPrincipale"> -->

    <v-data-table class="header_exped border-params" style="width: 100%;" :headers="headers" :items="items"
        density="compact" no-data-text="Pas de données disponibles" :fixed-header="true" height="650"
        :items-per-page="withPagination ? 100 : -1" :hide-default-footer="!withPagination" item-value="seq"
        select-strategy="single" :row-props="rowColor" :item-class="colorPrincipale">

        <!-- Cases à cocher -->
        <template v-for="col in heures" :key="col" v-slot:[`item.${col}`]="{ item }">
            <v-checkbox :class="getCheckboxClass(item, col)" :color="getCheckboxColor(item, col)" v-model="item[col]"
                :true-value="1" :false-value="0" hide-details density="compact"
                @change="handleRowSelection(item); handleCheckboxChange(item, col)">
            </v-checkbox>
        </template>

        <!-- Case à cocher pour cocher/décocher toutes les colonnes horaires de la ligne -->
        <template v-slot:item.jour="{ item }">
            <div class="d-flex align-center">
                <v-checkbox hide-details density="compact" color="#EF6C00" v-model="item._selectRow"
                    @change="toggleRow(item)" class="mr-2" />
                <span>{{ item.jour }}</span>
            </div>
        </template>


        <template v-slot:[`item.axe`]="{ item }">
            <v-select label="" v-model="item.axe" :items="storeAxe.axes" variant="underlined" density="compact"
                style="width: 170px; height: 32px; font-size: 0.75rem;"
                @update:modelValue="onAxeChange(item)"></v-select>
        </template>

        <template v-slot:[`item.mod_liv`]="{ item }">
            <v-select label="" v-model="item.mod_liv" :items="mode_liv" variant="underlined" density="compact"
                style="width: 170px; height: 32px; font-size: 0.75rem;"
                @update:modelValue="onModLivChange(item)"></v-select>
        </template>



        <template v-slot:body.append>
            <tr class="end-row"></tr>
        </template>
    </v-data-table>



</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted, watch } from "vue";
import { VDataTable } from "vuetify/lib/components";
import dayjs from "dayjs";
import { useAxeStore } from "@/store/utils/axe.js";
import { useEnumerationStore } from "@/store/utils/enumeration.js";

import ParamsLvView from '@/views/expedition/paramsLvAdr.vue';

export default defineComponent({
    components: {
        VDataTable,
        ParamsLvView,

    },

    props: {
        headers: Object,
        items: Array,
        valider: String,
        withPagination: {
            type: Boolean,
            default: false
        },
        clientCode: String
    },

    emits: ["logChange", "changesReset", "client-selected"],

    setup(props, { emit }) {
        const logDechanges = ref([]);
        const logCoches = ref([]);
        const modifiedCheckboxes = ref(new Set());
        const tooltip = ref(null);
        const storeAxe = useAxeStore();
        const storeEnum = useEnumerationStore();

        const AxeSelected = ref([]);
        const modLiv_selected = ref([]);
        const mode_liv = ref([]);

        const selectedItem = ref(null)

        const selectedClientCode = ref('');

        const onClientSelect = (clientCode) => {
            emit('client-selected', clientCode);
        };


        // const onModLivChange = (item) => {
        //     modLiv_selected.value = [...new Set(
        //         props.items
        //             .map(i => i.mode_liv)
        //             .filter(v => v)
        //     )];
        //     emit("logChange", {
        //         seq: item.seq,
        //         code_client: item.code_client,
        //         axe: item.axe,
        //         mode_livraison: item.mod_liv
        //     });
        // };

        // const onAxeChange = (item) => {

        //     // Liste unique des axes sélectionnés
        //     AxeSelected.value = [...new Set(
        //         props.items
        //             .map(i => i.axe)
        //             .filter(v => v)
        //     )];

        //     // console.log("Axe sélectionné :", item.axe);
        //     // console.log("SEQ :", item.seq, " | Code client :", item.code_client);

        //     // 👉 ENVOYER AU PARENT
        //     emit("logChange", {
        //         seq: item.seq,
        //         code_client: item.code_client,
        //         axe: item.axe,
        //         mode_livraison: item.mod_liv
        //     });
        // };

        onMounted(async () => {
            await storeAxe.fetchAxe();
        })

        const heures = [
            "a_7h", "a_8h", "a_9h", "a_10h", "a_11h", "a_12h",
            "a_13h", "a_14h", "a_15h", "a_16h", "a_17h", "a_18h",
        ];

        // ✅ Fonctions utilitaires pour la gestion des logs
        const createEntryKey = (jour, heure) => `${jour}_${heure}`;

        const findLogEntry = (array, jour, heure) => {
            const key = createEntryKey(jour, heure);
            return array.find(entry => createEntryKey(entry.jour, entry.heure) === key);
        };

        const updateLogEntry = (targetArray, sourceArray, jour, heure) => {
            const key = createEntryKey(jour, heure);
            const existingIndex = targetArray.findIndex(entry =>
                createEntryKey(entry.jour, entry.heure) === key);

            const entryExists = findLogEntry(sourceArray, jour, heure);

            if (existingIndex !== -1) {
                targetArray.splice(existingIndex, 1);
            }

            if (!entryExists) {
                targetArray.push({
                    jour,
                    heure,
                    horodatage: dayjs().format("DD/MM/YYYY HH:mm:ss"),
                });
            }
        };

        // ✅ Gestion des checkboxes modifiées
        const getCheckboxKey = (item, col) => {
            const itemKey = `${item.seq || props.items?.indexOf(item) || ''}`;
            return `${itemKey}_${col}`;
        };

        const markCheckboxAsModified = (item, col) => {
            modifiedCheckboxes.value.add(getCheckboxKey(item, col));
        };

        const getCheckboxColor = (item, col) => {
            return modifiedCheckboxes.value.has(getCheckboxKey(item, col)) ? "#FF0000" : "#00796B";
        };

        const getCheckboxClass = (item, col) => {
            return modifiedCheckboxes.value.has(getCheckboxKey(item, col))
                ? 'checkbox-modified'
                : 'checkbox-default';
        };

        // ✅ Gestion de la sélection des lignes
        const handleRowSelection = (item) => {
            item._selectRow = heures.some(h => item[h] === 1);
        };

        const handleCheckboxChange = (item, col) => {
            const heure = col.replace("a_", "").replace("h", "") + "h";
            const jour = item.liv_jour || item.jour || "Jour inconnu";

            markCheckboxAsModified(item, col);

            if (item[col] === 0) {
                updateLogEntry(logDechanges.value, logCoches.value, jour, heure);
            } else {
                updateLogEntry(logCoches.value, logDechanges.value, jour, heure);
            }

            emit("logChange", logDechanges.value, logCoches.value);
        };

        const toggleRow = (item) => {
            heures.forEach(col => {
                item[col] = item._selectRow ? 1 : 0;
                markCheckboxAsModified(item, col);
                handleCheckboxChange(item, col);
            });
        };

        // ✅ Initialisation
        const initializeSelectAll = () => {
            if (props.items) {
                props.items.forEach(item => {
                    handleRowSelection(item);
                });
            }
        };

        watch(() => props.items, (newItems) => {
            if (newItems) {
                initializeSelectAll();
            }
        }, { immediate: true });

        // ✅ Réinitialisation
        const resetChanges = () => {
            modifiedCheckboxes.value.clear();
            logDechanges.value = [];
            logCoches.value = [];
            emit("changesReset");
        };

        // ✅ Formatage des dates
        const formatDate = (date) =>
            date ? dayjs(date).format("DD/MM/YYYY") : "";

        const formatDateTime = (date) => {
            if (!date) return "";
            const parsed = dayjs(date, "DD/MM/YYYY HH:mm:ss");
            return parsed.isValid()
                ? parsed.format("DD/MM/YYYY HH:mm:ss")
                : "";
        };

        // ✅ Gestion des couleurs des lignes
        const rowColor = computed(() => (item) => {
            const values = [
                "centre", "est", "itaosy", "ivato", "nord",
                "six_sept", "sud", "sud_est", "total",
            ];
            const hasPositive = values.some((key) => item.item[key] > 0);

            if (item.item.cc2_pass_bal === 1) return { class: "highlight-bg" };
            else if (hasPositive) return { class: "soft-bg" };

            if (item.item.type == 'Principale') {
                return { class: 'couleur1' };
            }
            else return { class: "default" };


        });

        // ✅ Gestion des tooltips
        const showTooltip = (event, message) => {
            if (tooltip.value) hideTooltip();

            const div = document.createElement("div");
            div.id = "tooltip";
            div.innerText = message;
            Object.assign(div.style, {
                position: "absolute",
                backgroundColor: "#333",
                color: "#fff",
                padding: "5px 10px",
                borderRadius: "4px",
                fontSize: "12px",
                pointerEvents: "none",
                top: `${event.clientY + 10}px`,
                left: `${event.clientX + 10}px`,
                zIndex: "1000"
            });

            document.body.appendChild(div);
            tooltip.value = div;
        };

        const hideTooltip = () => {
            if (tooltip.value) {
                tooltip.value.remove();
                tooltip.value = null;
            }
        };

        onUnmounted(() => hideTooltip());



        return {
            heures, handleCheckboxChange, handleRowSelection, toggleRow, getCheckboxColor, getCheckboxClass, resetChanges, logDechanges, formatDate, formatDateTime,
            rowColor, showTooltip, hideTooltip,
            storeAxe, AxeSelected, mode_liv, modLiv_selected,
             selectedItem,
            onClientSelect,selectedClientCode,
        };
    },
});
</script>

<style>
.v-data-table.header_exped .v-table__wrapper>table>thead>tr th,
.v-data-table.header_exped .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
}

.couleur1 {
    background-color: #C5E1A5;
}

.couleur_valide {
    background-color: #b9f6ca;
}

.header_exped.v-data-table tr>td:first-child {
    border-left: 4px solid #969696;
}

.header_exped.v-data-table tr>td:last-child {
    border-right: 4px solid #969696;
}

.soft-bg {
    background-color: rgba(65, 226, 28, 0.213);
}

.highlight-bg {
    background-color: #ffe5a1 !important;
}

.bordered-params {
    border-left: 3px solid #ccc;
    border-right: 3px solid #ccc;
    display: flex;
    flex-direction: column;
    height: 300px;
    position: relative;
    width: 100%;
}

.bordered-params .v-data-table__wrapper {
    flex: 1;
}

/* ✅ Styles pour les checkboxes */
.checkbox-default .v-selection-control__input,
.checkbox-default .v-icon {
    color: #00796B !important;
}

.checkbox-modified .v-selection-control__input,
.checkbox-modified .v-icon,
.checkbox-modified .v-selection-control__input .v-icon {
    color: #FF0000 !important;
}
</style>