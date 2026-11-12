<template>
    <div class="tab1 tableau-detail-wrapper">
        <!-- Tableau -->
        <v-data-table :headers="headers" :items="items" :loading="loading" loading-text="Chargement..."
            density="compact" hover hide-default-footer class="custom-table1 dettab">

            <!-- Header personnalisé -->
            <template #headers="{ columns, toggleSort, getSortIcon, isSorted }">
                <tr>
                    <th v-for="column in columns" :key="column.key" class="table-header"
                        :class="{ 'sortable-header': column.sortable }" @click="column.sortable && toggleSort(column)">
                        <div class="d-flex align-center justify-space-between">
                            <span>{{ column.title }}</span>

                            <v-icon v-if="column.sortable" size="small" class="ml-2 sort-icon"
                                :class="{ 'is-sorted': isSorted(column) }"
                                :icon="isSorted(column) ? getSortIcon(column) : 'mdi-arrow-up-down'" />
                        </div>
                    </th>
                </tr>
            </template>

            <!-- Colonne Date -->
            <template v-slot:[`item.ligne_etape_date`]="{ item, index }">
                <div class="cell-with-button1 d-flex justify-center align-center">

                    <!-- Date renseignée -->
                    <template v-if="item.ligne_etape_date">
                        <span>
                            {{ formatDate(item.ligne_etape_date) }}

                            <v-btn v-if="index === lastDatedIndex" icon="mdi-close" size="x-small" variant="text"
                                color="error" density="compact" title="Supprimer la date" class="ml-1"
                                @click="clearDate(item)" />
                        </span>
                    </template>

                    <!-- Première ligne sans date -->
                    <template v-else-if="index === firstUndatedIndex">
                        <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-calendar-plus"
                            density="compact" title="Ajouter une date" @click="openDatePicker(item)">
                        </v-btn>
                    </template>

                </div>
            </template>

            <!-- Colonne Date prévision -->
            <template v-slot:[`item.ligne_etape_date_prevision`]="{ item }">
                <div class="cell-with-button1 d-flex justify-center align-center">
                    <span>{{
                        item.ligne_etape_date_prevision ? formatDate(item.ligne_etape_date_prevision) : "-"
                        }}</span>
                </div>
            </template>

            <!-- Colonnes Fiche d'évaluation (form_eval_ligne et form_eval_froid) : même template -->
            <template v-for="champ in champsFiche" :key="champ" v-slot:[`item.${champ}`]="{ item }">
                <div class="d-flex flex-column" style="min-width: 200px;">

                    <!-- CAS 1 : fiche existante → crayon + date + aperçu -->
                    <div v-if="item[champ] && String(item[champ]).trim() !== ''" class="d-flex align-center gap-3">

                        <v-tooltip location="top">
                            <template #activator="{ props }">
                                <v-btn v-bind="props" icon="mdi-pencil" size="x-small" color="primary" variant="tonal"
                                    @click="openEditDialog(item, champ)" />
                            </template>
                            Modifier
                        </v-tooltip>

                        <div class="font-weight-medium">{{ formatDate(item[champ]) }}</div>

                        <v-tooltip location="top">
                            <template #activator="{ props }">
                                <v-icon v-bind="props" color="primary" density="compact" class="cursor-pointer"
                                    @click="openFiche(item, champ)">
                                    mdi-eye
                                </v-icon>
                            </template>
                            Aperçu
                        </v-tooltip>
                    </div>

                    <!-- CAS 2 : aucune fiche → bouton plus (ajout) -->
                    <div v-else class="d-flex align-center gap-3">
                        <v-tooltip location="top">
                            <template #activator="{ props }">
                                <v-btn v-bind="props" icon="mdi-plus" size="x-small" color="primary" variant="tonal"
                                    @click="openAddDialog(item, champ)" />
                            </template>
                            Ajouter
                        </v-tooltip>
                    </div>
                </div>
            </template>
        </v-data-table>

        <!-- Dialog ajout / modification de la fiche (partagé) -->
        <v-dialog v-model="addDialog" max-width="420" persistent>
            <v-card>
                <v-card-title class="text-subtitle-1 font-weight-bold fiche-dialog-title">
                    {{ dialogTitle }}
                </v-card-title>

                <v-divider />

                <v-card-text class="pt-4">
                    <v-text-field v-model="addForm.date" type="date" label="Date" variant="underlined"
                        density="compact" />

                    <v-file-input v-model="addForm.file" label="Fichier" accept="image/*,.pdf" variant="underlined"
                        density="compact" prepend-icon="mdi-pencil" />
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="closeAddDialog">Annuler</v-btn>
                    <v-btn color="primary" variant="flat" :disabled="!addForm.date || !addForm.file" @click="saveAdd">
                        Enregistrer
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog aperçu de la fiche (partagé) -->
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

        <!-- Dialog sélection de date d'étape -->
        <v-dialog v-model="dialogDatePicker" max-width="400">
            <v-card>
                <v-card-title class="d-flex align-center">
                    <v-icon class="mr-2">mdi-calendar</v-icon>
                    Sélectionner une date
                </v-card-title>

                <v-card-text class="d-flex justify-center">
                    <v-date-picker v-model="selectedDate" color="primary" show-adjacent-months @dblclick="saveDate" />
                </v-card-text>

                <v-card-actions>
                    <v-spacer />

                    <v-btn variant="text" @click="dialogDatePicker = false">
                        Annuler
                    </v-btn>

                    <v-btn color="primary" variant="elevated" :disabled="!selectedDate" @click="saveDate">
                        Valider
                    </v-btn>
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
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { useformatDate2 } from "@/composables/useformatDate2";
import { useListIntegration } from "@/store/Rh/rh_integration.js";
import { useFormation } from "@/store/Rh/rh_formation";

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

        formCode: { type: [String, Number], default: null },
    },
    setup(props) {
        const storeIntegr = useListIntegration();
        const { formatDate } = useformatDate2();
        const dateColumns = ["etape_libelle"];
        const dialogVisible = ref(false);
        const selectedItem = ref(null);
        const selectedDate = ref(null);

        const store = useFormation();

        const dialogDatePicker = ref(false);

        const openDatePicker = (item) => {
            selectedItem.value = item;
            selectedDate.value = null;
            dialogDatePicker.value = true;
        };

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

        const validateDate = (item) => {
            if (item.tempDate) {
                // on stocke la vraie Date (pas la string formatée)
                item.ligne_etape_date = new Date(item.tempDate);
            }
            item.menuOpen = false;
        };

        const saveDate = async () => {
            if (!selectedItem.value || !selectedDate.value) {
                return;
            }

            try {
                // Conversion de la date au format yyyy-MM-dd
                const date = new Date(selectedDate.value);

                const dateFormatee =
                    date.getFullYear() +
                    "-" +
                    String(date.getMonth() + 1).padStart(2, "0") +
                    "-" +
                    String(date.getDate()).padStart(2, "0");

                console.log("Date sélectionnée :", selectedDate.value);
                console.log("Date envoyée :", dateFormatee);
                console.log("Code étape :", selectedItem.value.ligne_etape_code);
                console.log("Étape :", selectedItem.value.ligne_etape_etape);

                // Mise à jour locale
                selectedItem.value.ligne_etape_date = dateFormatee;

                // Appel du store
                await storeIntegr.updateDateEtape(
                    selectedItem.value.ligne_etape_code,
                    selectedItem.value.ligne_etape_etape,
                    dateFormatee
                );

                // Fermer le date picker
                dialogDatePicker.value = false;

                await Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    icon: "success",
                    title: "Date mise à jour avec succès"
                });

                console.log("Date mise à jour avec succès");

            } catch (error) {
                console.error("Erreur lors de la mise à jour de la date :", error);
            }
        };

        const clearDate = async (item) => {
            if (!item) {
                return;
            }

            const result = await Swal.fire({
                title: "Supprimer la date ?",
                text: "La date de cette étape sera supprimée.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Supprimer",
                cancelButtonText: "Annuler",
                confirmButtonColor: "#d32f2f",
                cancelButtonColor: "#757575",

                customClass: {
                    confirmButton: "swal-btn-white",
                    cancelButton: "swal-btn-white",
                },
            });

            if (!result.isConfirmed) {
                return;
            }

            try {
                await storeIntegr.updateDateEtape(
                    item.ligne_etape_code,
                    item.ligne_etape_etape,
                    null
                );

                item.ligne_etape_date = null;

                await Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    icon: "success",
                    title: "Date supprimée"
                });

            } catch (error) {
                console.error("Erreur lors de la suppression de la date :", error);
            }
        };

        const firstUndatedIndex = computed(() => {
            return props.items.findIndex((item) => !item.ligne_etape_date);
        });

        const lastDatedIndex = computed(() => {
            const firstUndated = firstUndatedIndex.value;

            if (firstUndated === -1) {
                return props.items.length - 1;
            }
            return firstUndated - 1;
        });

        // --------------------------------------------------
        // Fiches d'évaluation : une entrée par colonne.
        // Seules les requêtes du store changent d'une colonne à l'autre.
        // --------------------------------------------------
        // const FICHES = {
        //     form_eval_ligne: {
        //         fetch: (code, matr) => store.fetchFicheEval(code, matr),
        //         update: (code, matr, date, file) =>
        //             store.updateFicheEval(code, matr, date, file),
        //     },
        //     form_eval_froid: {
        //         fetch: (code, matr) => store.fetchFicheEvalFroid(code, matr),
        //         update: (code, matr, date, file) =>
        //             store.updateFicheEvalFroid(code, matr, date, file),
        //     },
        // };

        const FICHES = {
            form_eval_ligne: {
                label: "Évaluation à chaud",
                fetch: (code, matr) => store.fetchFicheEval(code, matr),
                update: (code, matr, date, file) =>
                    store.updateFicheEval(code, matr, date, file),
            },
            form_eval_froid_ligne: {
                label: "Évaluation à froid",
                fetch: (code, matr) => store.fetchFicheEvalFroid(code, matr),
                update: (code, matr, date, file) =>
                    store.updateFicheEvalFroid(code, matr, date, file),
            },
        };

        const champsFiche = Object.keys(FICHES);

        // Colonne en cours de traitement (ajout / modification / aperçu)
        const champActif = ref(null);

        // --------------------------------------------------
        // Ajout / modification de la fiche d'évaluation
        // --------------------------------------------------
        const addDialog = ref(false);
        const addItem = ref(null);
        const addForm = ref({ date: "", file: null });
        const isEditMode = ref(false);

        // Convertit n'importe quelle date en yyyy-MM-dd (format attendu par <input type="date">)
        const toInputDate = (value) => {
            if (!value) return "";
            if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
                return value.slice(0, 10);
            }
            const d = new Date(value);
            if (isNaN(d)) return "";
            return (
                d.getFullYear() +
                "-" +
                String(d.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(d.getDate()).padStart(2, "0")
            );
        };

        function openAddDialog(item, champ) {
            champActif.value = champ;
            isEditMode.value = false;
            addItem.value = item;
            addForm.value = { date: "", file: null };
            addDialog.value = true;
        }

        function openEditDialog(item, champ) {
            champActif.value = champ;
            isEditMode.value = true;
            addItem.value = item;
            addForm.value = {
                date: toInputDate(item[champ]), // pré-remplit avec la date existante
                file: null,
            };
            addDialog.value = true;
        }

        function closeAddDialog() {
            addDialog.value = false;
            addItem.value = null;
            champActif.value = null;
            isEditMode.value = false;
            addForm.value = { date: "", file: null };
        }

        async function saveAdd() {
            const file = Array.isArray(addForm.value.file)
                ? addForm.value.file[0]
                : addForm.value.file;
            const date = addForm.value.date; // yyyy-MM-dd
            const champ = champActif.value; // à lire AVANT closeAddDialog()

            if (!addItem.value || !file || !date || !champ) return;

            const formCode = props.formCode;
            const matricule = addItem.value.form_matr_ligne;

            if (formCode == null || matricule == null) {
                console.error("Paramètres manquants :", { formCode, matricule });
                Swal.fire({ icon: "error", title: "Code formation ou matricule introuvable" });
                return;
            }

            try {
                console.log("Paramètres enregistrement :", {
                    champ,
                    formCode,
                    matricule,
                    date,
                    fichier: file.name,
                    mode: isEditMode.value ? "modification" : "ajout",
                });

                const ok = await FICHES[champ].update(formCode, matricule, date, file);

                if (!ok) return;

                // Mise à jour locale : la colonne concernée contient la date
                addItem.value[champ] = date;

                const wasEdit = isEditMode.value;
                closeAddDialog();

                await Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    icon: "success",
                    title: wasEdit ? "Fichier modifié avec succès" : "Fichier ajouté avec succès",
                });
            } catch (error) {
                console.error("Erreur lors de l'enregistrement :", error);
                Swal.fire({
                    icon: "error",
                    title: isEditMode.value ? "Échec de la modification" : "Échec de l'ajout",
                });
            }
        }

        // --------------------------------------------------
        // Aperçu de la fiche
        // --------------------------------------------------
        const dialog = ref(false);
        const filePreview = ref(null);
        const isImage = ref(false);
        const isPDF = ref(false);
        const loadingFiche = ref(false); // `loading` est une prop, on ne peut pas la modifier

        const closeFiche = () => {
            dialog.value = false;
            if (filePreview.value) {
                URL.revokeObjectURL(filePreview.value); // libère la mémoire
                filePreview.value = null;
            }
        };

        onBeforeUnmount(() => {
            if (filePreview.value) URL.revokeObjectURL(filePreview.value);
        });

        const openFiche = async (item, champ) => {
            if (!item || !champ) return;

            const formCode = props.formCode;
            const matricule = item.form_matr_ligne;

            if (formCode == null || matricule == null) {
                console.error("Paramètres manquants :", { formCode, matricule });
                Swal.fire({ icon: "error", title: "Code formation ou matricule introuvable" });
                return;
            }

            try {
                loadingFiche.value = true;

                console.log("Paramètres fiche :", {
                    champ,
                    form_code: formCode,
                    form_matr_ligne: matricule,
                });

                // requête propre à la colonne (ligne ou froid)
                let ficheData = await FICHES[champ].fetch(formCode, matricule);

                if (!ficheData) {
                    throw new Error("Aucune fiche trouvée");
                }

                let mimeType = "application/pdf";
                let byteArray;

                // --------------------------------------------------
                // 1. Data URL
                // --------------------------------------------------
                if (ficheData.startsWith("data:")) {
                    const match = ficheData.match(/^data:(.*?);base64,(.*)$/);

                    if (!match) {
                        throw new Error("Data URL invalide");
                    }

                    mimeType = match[1];
                    ficheData = match[2];

                    const byteCharacters = atob(ficheData);
                    byteArray = new Uint8Array(byteCharacters.length);

                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteArray[i] = byteCharacters.charCodeAt(i);
                    }
                }

                // --------------------------------------------------
                // 2. HEX
                // --------------------------------------------------
                else if (/^[0-9A-Fa-f]+$/.test(ficheData) && ficheData.length % 2 === 0) {
                    const hex = ficheData.toUpperCase();

                    if (hex.startsWith("25504446")) mimeType = "application/pdf";
                    else if (hex.startsWith("FFD8FF")) mimeType = "image/jpeg";
                    else if (hex.startsWith("89504E47")) mimeType = "image/png";
                    else if (hex.startsWith("47494638")) mimeType = "image/gif";

                    byteArray = new Uint8Array(ficheData.length / 2);

                    for (let i = 0; i < ficheData.length; i += 2) {
                        byteArray[i / 2] = parseInt(ficheData.substring(i, i + 2), 16);
                    }
                }

                // --------------------------------------------------
                // 3. Base64
                // --------------------------------------------------
                else {
                    if (ficheData.startsWith("/9j/")) mimeType = "image/jpeg";
                    else if (ficheData.startsWith("iVBOR")) mimeType = "image/png";
                    else if (ficheData.startsWith("R0lGOD")) mimeType = "image/gif";
                    else if (ficheData.startsWith("JVBER")) mimeType = "application/pdf";

                    const byteCharacters = atob(ficheData);
                    byteArray = new Uint8Array(byteCharacters.length);

                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteArray[i] = byteCharacters.charCodeAt(i);
                    }
                }

                // --------------------------------------------------
                // Création du Blob
                // --------------------------------------------------
                const blob = new Blob([byteArray], { type: mimeType });

                // on libère l'ancien blob s'il y en avait un
                if (filePreview.value) URL.revokeObjectURL(filePreview.value);

                filePreview.value = URL.createObjectURL(blob);
                isImage.value = mimeType.startsWith("image/");
                isPDF.value = mimeType === "application/pdf";

                dialog.value = true;
            } catch (err) {
                console.error("Erreur lors de la récupération de la fiche :", err);
                Swal.fire({ icon: "error", title: "Impossible d'afficher la fiche" });
            } finally {
                loadingFiche.value = false;
            }
        };

        const dialogTitle = computed(() => {
            const action = isEditMode.value ? "Modifier" : "Ajouter";
            const label = FICHES[champActif.value]?.label ?? "";
            return `${action} ${label}`.trim();
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
            dialogDatePicker,
            openDatePicker,
            firstUndatedIndex,
            lastDatedIndex,
            // fiches d'évaluation
            champsFiche,
            champActif,
            // ajout / modification
            addDialog,
            addItem,
            addForm,
            isEditMode,
            openAddDialog,
            openEditDialog,
            closeAddDialog,
            saveAdd,
            // aperçu
            dialog,
            filePreview,
            isImage,
            isPDF,
            loadingFiche,
            openFiche,
            closeFiche,
            dialogTitle,
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

/* ---------- Tableau ---------- */
.custom-table1 {
    border-radius: 6px;
    font-size: 13px;
    overflow: hidden;
    white-space: normal;
    border: 1px solid #ece6e6;
    min-height: 270px;
}

/* Les colonnes se partagent la largeur disponible : plus de scroll horizontal */
.tableau-detail-wrapper .v-data-table .v-table__wrapper {
    overflow-x: hidden;
}

.tableau-detail-wrapper .v-data-table .v-table__wrapper table {
    width: 100%;
    table-layout: fixed;
}

.tableau-detail-wrapper .v-data-table .v-table__wrapper table th,
.tableau-detail-wrapper .v-data-table .v-table__wrapper table td {
    width: auto;
    min-width: 0;
    max-width: none;
    overflow: hidden;
    text-overflow: ellipsis;
}

.v-data-table.custom-table1 .v-table__wrapper table th,
.v-data-table.custom-table1 .v-table__wrapper table td {
    border-right: 2px solid #ccc;
    border-bottom: 1px solid #ccc;
}

/* ---------- Header : toujours violet, jamais de jaune ---------- */
.table-header {
    background-color: #7d2fdc;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    padding: 8px;
    text-align: left;
}

.custom-table1 .v-table__wrapper>table>thead>tr,
.custom-table1 .v-table__wrapper>table>thead>tr:hover,
.custom-table1 .v-table__wrapper>table>thead>tr>th,
.custom-table1 .v-table__wrapper>table>thead>tr:hover>th {
    background: #7d2fdc !important;
    background-color: #7d2fdc !important;
    color: white !important;
}

/* ---------- Résumé ---------- */
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

/* ---------- Divers ---------- */
.bordered-detail {
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    height: 300px;
    position: relative;
}

.cell-with-button,
.tableau-detail-wrapper .cell-with-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}

.cell-with-button .cell-text,
.tableau-detail-wrapper .cell-with-button .cell-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
}

.cell-with-button .tb,
.tableau-detail-wrapper .cell-with-button .tb {
    flex-shrink: 0;
    min-width: 100px;
    color: #2e7d32;
}

.cell-with-button .tb1 {
    flex-shrink: 0;
    min-width: 100px;
    color: #5d00f1;
}

.annuler {
    margin-left: 20px;
    border: 1px solid #f63232;
    border-radius: 40px;
    background-color: #f63232;
}

/* Scroll vertical uniquement */
.tableau-detail-wrapper {
    max-height: 430px;
    overflow-x: hidden;
    overflow-y: auto;
}

.swal-btn-white {
    color: white !important;
}

.tableau-detail-wrapper .v-data-table.custom-table1.dettab .v-table__wrapper>table>thead>tr,
.tableau-detail-wrapper .v-data-table.custom-table1.dettab .v-table__wrapper>table>thead>tr>th,
.tableau-detail-wrapper .v-data-table.custom-table1.dettab .v-table__wrapper>table>thead>tr>th.table-header,
.tableau-detail-wrapper .v-data-table.custom-table1.dettab .v-table__wrapper>table>thead>tr:hover>th {
    background: #7d2fdc !important;
    background-color: #7d2fdc !important;
    background-image: none !important;
    color: white !important;
}

/* Header triable */
.tableau-detail-wrapper .sortable-header {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease;
}

.tableau-detail-wrapper .sortable-header:hover {
    background-color: #6521b5 !important;
}

/* Icône de tri */
.tableau-detail-wrapper .sortable-header .v-icon {
    color: white;
    opacity: 0.9;
}

/* Titre du dialog ajout / modification : fond vert transparent */
.fiche-dialog-title {
    background-color: rgba(46, 125, 50, 0.12);
    color: #030e03;
    padding: 12px 16px;
}

/* Icône de tri : cachée par défaut, visible au survol du header */
.tableau-detail-wrapper .sortable-header .sort-icon {
    color: white;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.tableau-detail-wrapper .sortable-header:hover .sort-icon {
    opacity: 0.9;
}

/* Toujours visible si la colonne est actuellement triée */
.tableau-detail-wrapper .sortable-header .sort-icon.is-sorted {
    opacity: 0.9;
}
</style>