<template>
    <div class="tab1 tableau-detail-wrapper">
        <!-- Tableau avec défilement -->
        <v-data-table :headers="headers" :items="items" :loading="loading" loading-text="Chargement..."
            density="compact" hover hide-default-footer class="custom-table1 dettab">
            <!-- Slot personnalisé pour le header -->
            <template #headers="{ columns }">
                <tr>
                    <th v-for="column in columns" :key="column.key" class="table-header fixed-col">
                        {{ column.title }}
                    </th>
                </tr>
            </template>

            <!-- 2) Colonne Date : afficher la date formatée ici -->

            <!-- <template v-slot:[`item.ligne_etape_date`]="{ item , index  }">
                <div class="cell-with-button1 d-flex justify-center align-center">

                    <template v-if="item.ligne_etape_date">
                        <span>
                            {{ formatDate(item.ligne_etape_date) }}
                            <v-btn icon="mdi-close" size="x-small" variant="text" color="error" density="compact"
                                title="Supprimer la date" class="ml-1" @click="clearDate(item)" />
                        </span>
                    </template>
                    <template v-else-if="index === firstUndatedIndex">
                        <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-calendar-plus"
                            density="compact" @click="openDatePicker(item)"></v-btn>
                    </template>
                </div>
            </template> -->

            <!-- <template v-slot:[`item.ligne_etape_date`]="{ item, index }">
                <div class="cell-with-button1 d-flex justify-center align-center">

                    <template v-if="item.ligne_etape_date">

                        <span>
                            {{ formatDate(item.ligne_etape_date) }}

                            <v-btn v-if="index === lastDatedIndex" icon="mdi-close" size="x-small" variant="text"
                                color="error" density="compact" title="Supprimer la date" class="ml-1"
                                @click="clearDate(item)" />
                        </span>

                    </template>


                    <template v-else-if="index === firstUndatedIndex">

                        <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-calendar-plus"
                            density="compact" title="Ajouter une date" @click="openDatePicker(item)">
                        </v-btn>

                    </template>

                </div>
            </template> -->



            <template v-slot:[`item.ligne_etape_date`]="{ item, index }">
                <div class="cell-with-button1 d-flex justify-center align-center">

                    <!-- ETAT 2 : bouton décision uniquement si les étapes précédentes sont complètes -->

                    <template v-if="Number(item.etat) === 2">

                        <!-- Date et décision déjà enregistrées -->
                        <span v-if="item.ligne_etape_date && item.ligne_etape_decision">
                            {{ formatDate(item.ligne_etape_date) }}
                            ({{ item.ligne_etape_decision }})
                        </span>

                        <!-- Sinon, afficher le bouton -->
                        <v-btn v-else-if="canShowDecision(index)" size="small" variant="tonal" color="primary"
                            density="compact" title="Évaluation fin d'essai" @click="openDatePicker(item)">
                            DECISION
                        </v-btn>

                    </template>

                    <!-- ETAT 1 : étape ignorée -->
                    <template v-else-if="Number(item.etat) === 1">
                        <span v-if="item.ligne_etape_date">
                            {{ formatDate(item.ligne_etape_date) }}
                        </span>
                    </template>

                    <!-- ETAT 0 : comportement actuel -->
                    <template v-else>
                        <template v-if="item.ligne_etape_date">
                            <span>
                                {{ formatDate(item.ligne_etape_date) }}

                                <v-btn v-if="index === lastDatedIndex" icon="mdi-close" size="x-small" variant="text"
                                    color="error" density="compact" title="Supprimer la date" class="ml-1"
                                    @click="clearDate(item)" />
                            </span>
                        </template>

                        <template v-else-if="index === firstUndatedIndex">
                            <v-btn size="small" variant="text" color="primary" prepend-icon="mdi-calendar-plus"
                                density="compact" title="Ajouter une date" @click="openDatePicker(item)" />
                        </template>
                    </template>

                </div>
            </template>







            <template v-slot:[`item.ligne_etape_date_prevision`]="{ item }">
                <div class="cell-with-button1 d-flex justify-center align-center">
                    <span>{{
                        item.ligne_etape_date_prevision ? formatDate(item.ligne_etape_date_prevision) : "-"
                        }}</span>

                </div>
            </template>
        </v-data-table>


        <!-- <v-dialog v-model="dialogDatePicker" max-width="400">
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
        </v-dialog> -->


        <v-dialog v-model="dialogDatePicker" max-width="430" persistent>
            <v-card>
                <v-card-title class="d-flex align-center">
                    <v-icon class="mr-2">mdi-calendar</v-icon>
                    {{ Number(selectedItem?.etat) === 2
                        ? "Date et décision"
                        : "Sélectionner une date" }}
                </v-card-title>

                <v-card-text>
                    <!-- Sélection de date -->
                    <div class="d-flex justify-center">
                        <v-date-picker v-model="selectedDate" color="primary" show-adjacent-months
                            @dblclick="saveDate" />
                    </div>

                    <!-- Décision uniquement pour ETAT 2 -->
                    <div v-if="Number(selectedItem?.etat) === 2" class="mt-4">
                        <!-- <v-select v-model="selectedDecision" :items="listDecision" item-title="decision"
                            item-value="decision" label="Décision" density="compact" variant="outlined" hide-details /> -->

                        <v-select v-model="selectedDecision" :items="listDecision" :item-title="decisionKey"
                            :item-value="decisionKey" label="Décision" density="compact" variant="outlined"
                            hide-details />
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />

                    <v-btn variant="text" @click="dialogDatePicker = false">
                        Annuler
                    </v-btn>

                    <v-btn color="primary" variant="elevated" :disabled="!selectedDate ||
                        (Number(selectedItem?.etat) === 2 && !selectedDecision)" @click="saveDate">
                        Valider
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>







        <!-- Résumé ultra compact -->
        <div class="summary-line">
            {{ items.length }} étape<span v-if="items.length > 1">s</span>
            trouvée<span v-if="items.length > 1">s</span>.
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed, defineComponent, watch } from "vue";
import { useformatDate2 } from "@/composables/useformatDate2";
import { useListIntegration } from "@/store/Rh/rh_integration.js";
import Swal from "sweetalert2";

export default {
    name: "TableauDetail",

    emits: ["refresh"],

    props: {
        items: {
            type: Array,
            required: true,
        },
        headers: {
            type: Array,
            required: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        type: { type: String, default: "" },
    },

    setup(props, { emit }) {

        const storeIntegr = useListIntegration();
        const { formatDate } = useformatDate2();
        const dateColumns = ["etape_libelle"];
        const dialogVisible = ref(false);
        const selectedItem = ref(null);
        const selectedDate = ref(null);
        const selectedDecision = ref(null);

        const dialogDatePicker = ref(false);

        // const openDatePicker = (item) => {
        //     selectedItem.value = item;
        //     selectedDate.value = null;
        //     dialogDatePicker.value = true;
        // };


        const parseLocalDate = (value) => {
            if (!value) return null;
            if (value instanceof Date) return isNaN(value) ? null : value;

            // Prend les 10 premiers caractères : "YYYY-MM-DD" (gère aussi "YYYY-MM-DDTHH:mm:ss")
            const [y, m, d] = String(value).substring(0, 10).split("-").map(Number);
            if (!y || !m || !d) return null;
            return new Date(y, m - 1, d);
        };

        const openDatePicker = (item) => {
            selectedItem.value = item;
            selectedDate.value = parseLocalDate(item.ligne_etape_date);
            selectedDecision.value = item.decision || null;
            dialogDatePicker.value = true;
        };

        const menu = ref(false);

        const listDecision = ref([]);

        // const listDecisions = async () => {
        //     await storeIntegr.fetchDecision();
        //     listDecision.value = storeIntegr.listdecisions;
        // };



        const typeNormalise = computed(() =>
            String(props.type || "")
                .trim()
                .toUpperCase()
                .replace(/[\s_]+/g, "_")
        );

        // Nom du champ renvoyé par la base selon le type
        const decisionKey = computed(() =>
            typeNormalise.value === "MOBILITE_INTERNE"
                ? "decision_mobilite"
                : "decision"
        );



        // const listDecisions = async () => {
        //     listDecision.value = [];

        //     const typeNormalise = String(props.type || "").trim().toUpperCase();

        //     if (typeNormalise === "EMBAUCHE") {
        //         await storeIntegr.fetchDecision();            // requête EMBAUCHE
        //         listDecision.value = storeIntegr.listdecisions;

        //     } else if (typeNormalise === "MOBILITE_INTERNE") {
        //         await storeIntegr.fetchDecisionMobilite();    // requête MOBILITE INTERNE
        //         listDecision.value = storeIntegr.listdecisionsMobilite;
        //     }
        //     console.log("décisions :", JSON.parse(JSON.stringify(listDecision.value)));
        // };


        const listDecisions = async () => {
            listDecision.value = [];

            if (typeNormalise.value === "EMBAUCHE") {
                await storeIntegr.fetchDecision();
                listDecision.value = storeIntegr.listdecisions;
            } else if (typeNormalise.value === "MOBILITE_INTERNE") {
                await storeIntegr.fetchDecisionMobilite();
                listDecision.value = storeIntegr.listdecisionsMobilite;
            }
        };

        onMounted(async () => {
            // console.log("TYPE reçu (onMounted) :", props.type);

            // chaque ligne a ses propres variables locales
            props.items.forEach((item) => {
                if (item.menuOpen === undefined) item.menuOpen = false;
                if (item.tempDate === undefined)
                    item.tempDate = item.ligne_etape_date || null;
            });
            await listDecisions();
        });

        watch(() => props.type, listDecisions);

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

        // const saveDate = () => {
        //     if (selectedItem.value) {
        //         selectedItem.value.date = selectedDate.value;
        //     }
        //     closeDialog();
        // };

        const validateDate = (item) => {
            if (item.tempDate) {
                // on stocke la vraie Date (pas la string formatée)
                item.ligne_etape_date = new Date(item.tempDate);
            }
            item.menuOpen = false;
        };

        // const clearDate = (item) => {
        //     item.ligne_etape_date = null;
        //     item.tempDate = null;
        // };


        const saveDate = async () => {
            if (!selectedItem.value || !selectedDate.value) return;

            const item = selectedItem.value;
            const isEtat2 = Number(item.etat) === 2;

            if (isEtat2 && !selectedDecision.value) return;

            try {
                const date = new Date(selectedDate.value);

                const dateFormatee =
                    date.getFullYear() + "-" +
                    String(date.getMonth() + 1).padStart(2, "0") + "-" +
                    String(date.getDate()).padStart(2, "0");

                // Enregistrement de la date
                await storeIntegr.updateDateEtape(
                    item.ligne_etape_code,
                    item.ligne_etape_etape,
                    dateFormatee
                );

                // Enregistrement de la décision pour ETAT 2
                if (isEtat2) {
                    await storeIntegr.updateDecisionEtape(
                        item.ligne_etape_code,
                        item.ligne_etape_etape,
                        selectedDecision.value
                    );
                }

                // Fermer le calendrier
                dialogDatePicker.value = false;

                // Actualiser le tableau depuis le parent
                emit("refresh");

                await Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    icon: "success",
                    title: isEtat2
                        ? "Date et décision enregistrées"
                        : "Date mise à jour avec succès"
                });

            } catch (error) {
                console.error("Erreur lors de l'enregistrement :", error);
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

                console.error(
                    "Erreur lors de la suppression de la date :",
                    error
                );
            }
        };

        // const firstUndatedIndex = computed(() => { return props.items.findIndex(item => !item.ligne_etape_date); });

        // const lastDatedIndex = computed(() => {
        //     const firstUndated = firstUndatedIndex.value;

        //     if (firstUndated === -1) {
        //         return props.items.length - 1;
        //     }
        //     return firstUndated - 1;
        // });

        // const firstUndatedIndex = computed(() => {
        //     return props.items.findIndex(item =>
        //         Number(item.etat) !== 1 &&
        //         Number(item.etat) !== 2 &&
        //         !item.ligne_etape_date
        //     );
        // });

        const firstUndatedIndex = computed(() => {
            return props.items.findIndex(item =>
                Number(item.etat) !== 1 &&
                !item.ligne_etape_date
            );
        });

        const lastDatedIndex = computed(() => {
            const firstUndated = firstUndatedIndex.value;

            const eligibleDated = props.items
                .map((item, index) => ({ item, index }))
                .filter(({ item, index }) =>
                    Number(item.etat) === 0 &&
                    item.ligne_etape_date &&
                    (firstUndated === -1 || index < firstUndated)
                );

            return eligibleDated.length
                ? eligibleDated[eligibleDated.length - 1].index
                : -1;
        });


        const decisions = [
            { title: "CONFIRMER", value: "CONFIRMER" },
            { title: "ANNULER", value: "ANNULER" },
            { title: "NON CONCLUANT", value: "NON_CONCLUANT" },
        ];

        const saveDecision = async (item, decision) => {
            try {
                await storeIntegr.updateDecisionEtape(
                    item.ligne_etape_code,
                    item.ligne_etape_etape,
                    decision
                );

                await Swal.fire({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    icon: "success",
                    title: "Décision enregistrée",
                });
            } catch (error) {
                console.error("Erreur lors de l'enregistrement de la décision :", error);
            }
        };

        const canShowDecision = (index) => {
            return props.items
                .slice(0, index)
                .every(etape =>
                    Number(etape.etat) === 1 ||
                    (
                        Number(etape.etat) === 0 &&
                        !!etape.ligne_etape_date
                    )
                );
        };




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
            dialogDatePicker, openDatePicker,
            firstUndatedIndex, lastDatedIndex,
            decisions, saveDecision,
            selectedDecision, canShowDecision,
            listDecision, decisionKey,
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
    max-height: 430px;
    overflow-y: auto;
}

.custom-table1 {
    min-height: 270px;
}

.swal-btn-white {
    color: white !important;
}
</style>
