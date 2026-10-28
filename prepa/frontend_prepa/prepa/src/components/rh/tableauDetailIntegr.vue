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


            <template v-slot:[`item.ligne_etape_date_prevision`]="{ item }">
                <div class="cell-with-button1 d-flex justify-center align-center">
                    <span>{{
                        item.ligne_etape_date_prevision ? formatDate(item.ligne_etape_date_prevision) : "-"
                        }}</span>

                </div>
            </template>
        </v-data-table>


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
            {{ items.length }} étape<span v-if="items.length > 1">s</span>
            trouvée<span v-if="items.length > 1">s</span>.
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed, defineComponent } from "vue";
import { useformatDate2 } from "@/composables/useformatDate2";
import { useListIntegration } from "@/store/Rh/rh_integration.js";
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
    },
    setup(props) {
        const storeIntegr = useListIntegration();
        const { formatDate } = useformatDate2();
        const dateColumns = ["etape_libelle"];
        const dialogVisible = ref(false);
        const selectedItem = ref(null);
        const selectedDate = ref(null);

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

                console.log(
                    "Code étape :",
                    selectedItem.value.ligne_etape_code
                );

                console.log(
                    "Étape :",
                    selectedItem.value.ligne_etape_etape
                );

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
                console.error(
                    "Erreur lors de la mise à jour de la date :",
                    error
                );
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

        const firstUndatedIndex = computed(() => { return props.items.findIndex(item => !item.ligne_etape_date); });

        const lastDatedIndex = computed(() => {
            const firstUndated = firstUndatedIndex.value;

            if (firstUndated === -1) {
                return props.items.length - 1;
            }
            return firstUndated - 1;
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
            dialogDatePicker, openDatePicker,
            firstUndatedIndex,lastDatedIndex,
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
