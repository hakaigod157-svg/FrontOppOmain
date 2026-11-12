<template>
    <div style="min-width: max-content;">


        <v-data-table class="rh_header" :headers="headers" :items="items" :fixed-header="true" v-if="!loading"
            :loading="loading" density="compact" hide-default-footer hover="true" no-data-text="Pas données disponibles"
            :items-per-page="-1" :row-props="rowColor" height="450" @click:row="onRowClick">

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

            <template v-slot:[`item.form_date`]="{ item }">
                {{ formatDate(item.form_date) }}
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

            <!-- <template v-slot:[`item.eval_chaud`]="{ item }">
                <span v-if="item.eval_chaud !== 0">{{ item.eval_chaud }}</span>
            </template>

            <template v-slot:[`item.eval_froid`]="{ item }">
                <span v-if="item.eval_froid !== 0">{{ item.eval_froid }}</span>
            </template> -->

            <!-- <template v-slot:[`item.eval`]="{ item }">
                <div>
                    <span v-if="item.eval_chaud !== 0">{{ item.eval_chaud }} (chaud)</span>
                    <br>
                    <span v-if="item.eval_froid !== 0">{{ item.eval_froid }} (froid)</span>
                </div>
            </template> -->


            <!-- <template v-slot:[`item.eval`]="{ item }">
                <div>
                    <span v-if="item.eval_chaud !== 0" class="text-red">
                        {{ item.eval_chaud }} (chaud)
                    </span>
                    <br>
                    <span v-if="item.eval_froid !== 0" class="text-blue">
                        {{ item.eval_froid }} (froid)
                    </span>
                </div>
            </template> -->

            <template v-slot:[`item.eval`]="{ item }">
                <div class="eval-grid">
                    <template v-if="item.eval_chaud !== 0">
                        <span class="eval-value text-red">{{ item.eval_chaud }}</span>
                        <span class="text-red">(chaud)</span>
                    </template>
                    <template v-if="item.eval_froid !== 0">
                        <span class="eval-value text-blue">{{ item.eval_froid }}</span>
                        <span class="text-blue">(froid)</span>
                    </template>
                </div>
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
                        style="padding: 0;justify-content: flex-start;min-width: 100%;line-height: 1;"
                        class="btn-no-padding">
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


            <template v-slot:[`item.participant`]="{ item }">
                <div class="d-flex align-center justify-center ga-1">
                    <span>{{ item.participant }}</span>

                    <v-btn v-if="item.form_presence !== null" icon="mdi-eye" size="x-small" variant="text" color="primary" density="compact" title="Aperçu"
                        :loading="loadingFiche" @click.stop="openFiche(item)" />
                </div>
            </template>

        </v-data-table>

        <v-dialog v-model="dialog" max-width="900" persistent @update:model-value="(v) => !v && closeFiche()">
            <v-card>
                <v-card-title class="d-flex align-center">
                    <v-icon class="mr-2">mdi-file-eye</v-icon>
                    Aperçu
                    <v-spacer />
                    <v-btn icon="mdi-close" variant="text" size="small" @click="closeFiche" />
                </v-card-title>

                <v-card-text class="d-flex justify-center">
                    <iframe v-if="isPDF && filePreview" :src="filePreview"
                        style="width: 100%; height: 70vh; border: none;" />

                    <img v-else-if="isImage && filePreview" :src="filePreview"
                        style="max-width: 100%; max-height: 70vh; object-fit: contain;" />

                    <div v-else>Format non pris en charge</div>
                </v-card-text>

                <v-divider />

                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="outlined" color="red" @click="closeFiche">Fermer</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>




    </div>
    <!-- <div class="summary-line">
        {{ employees.length }} employé<span v-if="employees.length > 1">s</span>
        trouvée<span v-if="employees.length > 1">s</span>
    </div> -->
</template>
<script>
import { defineComponent, ref, onMounted, onBeforeUnmount, onBeforeMount, computed, reactive } from 'vue';
import { useFormation } from "@/store/Rh/rh_formation";
import Swal from "sweetalert2";


import {
    VDataTableVirtual,
    VDataTable,
    VDataTableServer,
} from "vuetify/lib/components";
import { useAlerteStore } from "@/store/utils/alerte.js"
import dayjs from 'dayjs';

export default defineComponent({
    components: {
        VDataTable,
        VDataTableServer,
        VDataTableVirtual,
    },
    emits: ['action1Item', 'action2Item', 'handleCheckboxClick', 'checkbox-change', 'editItem', 'deleteItem', 'actionDetail', 'rowClick'],

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

        const onRowClick = (event, { item }) => {
            emit('rowClick', item);
        };

        const store = useFormation();

        const dialog = ref(false);
        const filePreview = ref(null);
        const isImage = ref(false);
        const isPDF = ref(false);
        const loadingFiche = ref(false);

        const closeFiche = () => {
            dialog.value = false;
            if (filePreview.value) {
                URL.revokeObjectURL(filePreview.value);
                filePreview.value = null;
            }
        };

        onBeforeUnmount(() => {
            if (filePreview.value) URL.revokeObjectURL(filePreview.value);
        });

        // Convertit data URL / hex / base64 en { byteArray, mimeType }
        const decodeFiche = (ficheData) => {
            let mimeType = "application/pdf";
            let byteArray;

            const fromBase64 = (b64) => {
                const bin = atob(b64);
                const arr = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
                return arr;
            };

            if (ficheData.startsWith("data:")) {
                const match = ficheData.match(/^data:(.*?);base64,(.*)$/);
                if (!match) throw new Error("Data URL invalide");
                mimeType = match[1];
                byteArray = fromBase64(match[2]);
            } else if (/^[0-9A-Fa-f]+$/.test(ficheData) && ficheData.length % 2 === 0) {
                const hex = ficheData.toUpperCase();
                if (hex.startsWith("25504446")) mimeType = "application/pdf";
                else if (hex.startsWith("FFD8FF")) mimeType = "image/jpeg";
                else if (hex.startsWith("89504E47")) mimeType = "image/png";
                else if (hex.startsWith("47494638")) mimeType = "image/gif";

                byteArray = new Uint8Array(ficheData.length / 2);
                for (let i = 0; i < ficheData.length; i += 2) {
                    byteArray[i / 2] = parseInt(ficheData.substring(i, i + 2), 16);
                }
            } else {
                if (ficheData.startsWith("/9j/")) mimeType = "image/jpeg";
                else if (ficheData.startsWith("iVBOR")) mimeType = "image/png";
                else if (ficheData.startsWith("R0lGOD")) mimeType = "image/gif";
                else if (ficheData.startsWith("JVBER")) mimeType = "application/pdf";
                byteArray = fromBase64(ficheData);
            }

            return { byteArray, mimeType };
        };

        const openFiche = async (item) => {
            const formCode = item?.form_code;

            if (formCode == null) {
                console.error("form_code manquant :", item);
                Swal.fire({ icon: "error", title: "Code formation introuvable" });
                return;
            }

            try {
                loadingFiche.value = true;

                // ⚠️ adapter le nom de la méthode du store
                const ficheData = await store.fetchFicheParticipant(formCode);
                if (!ficheData) throw new Error("Aucun fichier trouvé");

                const { byteArray, mimeType } = decodeFiche(ficheData);
                const blob = new Blob([byteArray], { type: mimeType });

                if (filePreview.value) URL.revokeObjectURL(filePreview.value);

                filePreview.value = URL.createObjectURL(blob);
                isImage.value = mimeType.startsWith("image/");
                isPDF.value = mimeType === "application/pdf";
                dialog.value = true;
            } catch (err) {
                console.error("Erreur lors de la récupération du fichier :", err);
                Swal.fire({ icon: "error", title: "Impossible d'afficher le fichier" });
            } finally {
                loadingFiche.value = false;
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
            onRowClick,
            dialog, filePreview, isImage, isPDF, loadingFiche, openFiche, closeFiche,
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

.eval-grid {
    display: inline-grid;
    grid-template-columns: auto auto;
    column-gap: 4px;
    align-items: baseline;
}

.eval-value {
    text-align: right;
    font-variant-numeric: tabular-nums;
    /* chiffres de même largeur */
}
</style>
