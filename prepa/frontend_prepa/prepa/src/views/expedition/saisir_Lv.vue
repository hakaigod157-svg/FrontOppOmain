<template>
    <v-dialog v-model="dialog" persistent density="compact" transition="dialog-bottom-transition" max-width="850">
        <v-card density="compact" flat>
            <v-toolbar color="#d7ead5" density="compact">
                <v-toolbar-title density="compact">Saisir Heure et départ Livraison</v-toolbar-title>
                <v-spacer></v-spacer>
                <strong class="text-h5 font-weight-bold">{{ newItem.liv_code }} </strong>
                <v-btn icon @click="closeDrawer" density="compact">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-container class="mx-auto py-0 my-0 mb-0">
                <v-card-text class="pt-0 mt-0">
                    <v-form @submit.prevent="onValide" class="pt-0 mt-0">
                        <v-row class="pt-0 mt-0">
                            <v-col cols="12" sm="6" md="4" density="compact">
                                <span class="text-subtitle-1">
                                    Date de Sortie :<span class="font-weight-black">{{
                                        formatDateTime(newItem.liv_sortie) }}</span>
                                </span>
                            </v-col>
                            <v-col cols="12" sm="6" md="3" density="compact">
                                <span class="text-subtitle-1">
                                    Chauffeur : <span class="font-weight-black">{{ newItem.liv_chauf }}</span>
                                </span>
                            </v-col>
                            <v-col cols="12" sm="6" md="3" density="compact">
                                <span class="text-subtitle-1">
                                    Voiture : <span class="font-weight-black">{{ newItem.liv_voit }}</span>
                                </span>
                            </v-col>
                            <v-col cols="12" sm="6" md="2" density="compact">
                                <span class="text-subtitle-1">
                                    Axe : <span class="font-weight-black">{{ newItem.liv_axe }}</span>
                                </span>
                            </v-col>

                            <v-col cols="12" sm="6" md="3" density="compact" class="my-n2">
                                <v-text-field v-model="newItem.livrempli" label="Remplissage" variant="outlined"
                                    suffix="%" @keypress="onKeyPressNumeric" density="compact" hide-details hide-no-data
                                    style="width: 150px" />
                            </v-col>
                            <v-col cols="12" sm="6" md="3" density="compact" class="my-n2">
                                <v-text-field v-model="newItem.cpt_depart" label="Compteur Départ" variant="outlined"
                                    @keypress="onKeyPressNumeric" density="compact" hide-details hide-no-data
                                    style="width: 150px" />
                            </v-col>
                            <v-col cols="12" sm="6" md="3" density="compact" class="my-n2">
                                <v-text-field v-model="newItem.cpt_arrive" label="Compteur Arrivé" variant="outlined"
                                    @keypress="onKeyPressNumeric" density="compact" hide-details hide-no-data
                                    style="width: 150px" />
                            </v-col>

                        </v-row>
                        <div style="width: 100%; overflow-x: auto; overflow-y: auto;" color="#2c3640" class="mt-5 p-0">             
                            <v-data-table :headers="headers" :items="listDuree" item-value="codeClt" hide-default-footer
                                density="compact" class="blue-header" :fixed-header="true" v-if="!loading" hover="true" :items-per-page="-1" 
                                v-model:expanded="expanded" show-expand>
                                <template v-slot:item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
                                    <v-btn
                                        :append-icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                                        :text="isExpanded(internalItem) ? 'Reduire' : 'A supprimer'" class="text-none"
                                        color="indigo-lighten-2" size="small" variant="text" width="105" border slim
                                        @click="onToggleExpand(internalItem, toggleExpand)"></v-btn>
                                </template>
                                <template v-slot:[`item.arriveClt`]="{ item }">
                                    <div class="flex justify-center items-center w-full">
                                        <v-text-field v-model="item.arriveClt" type="time" density="compact"
                                            hide-details hide-no-data variant="outlined" style="width: 80px"
                                            @change="onArriveChange(item)" class="text-center custom-time-field" />
                                    </div>
                                </template>

                                <template v-slot:[`item.departClt`]="{ item }">
                                    <div class="flex justify-center items-center w-full">
                                        <v-text-field v-model="item.departClt" type="time" density="compact"
                                            hide-details hide-no-data variant="outlined" style="width: 80px"
                                            @change="onDepartChange(item)" class="text-center custom-time-field" />
                                    </div>
                                </template>

                                <template v-slot:expanded-row="{ columns, item }">
                                    <tr>
                                        <td :colspan="columns.length">
                                            <v-sheet rounded="lg">
                                                <v-table density="compact">
                                                    <tbody>
                                                        <tr v-for="(cmd, index) in m_listCmdLiv[item.codeClt]"
                                                            :key="index">
                                                            <td>{{ cmd.facture }}</td>
                                                            <td>{{ cmd.commande }}</td>

                                                            <td>
                                                                <v-btn icon="mdi-delete" size="small" color="red"
                                                                    variant="text"
                                                                    @click="onSuppr(item.codeClt, index, cmd)" />
                                                            </td>
                                                        </tr>

                                                        <tr
                                                            v-if="!m_listCmdLiv[item.codeClt] || m_listCmdLiv[item.codeClt].length === 0">
                                                            <td colspan="3" class="text-center text-grey">
                                                                Aucune commande
                                                            </td>
                                                        </tr>
                                                    </tbody>

                                                </v-table>

                                            </v-sheet>
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>

                            <!-- 
                            <MyTable :headers="headers" :items="listDuree" :loading="loading" height="600"
                                @onDepartChange="onDepartChange" @onArriveChange="onArriveChange" action2="Supprimer"
                                @action2Item="onSuppr"></MyTable> -->
                        </div>
                        <MyLoading :loading="chagmt" @close="chagmt = false" :articles="articles"></MyLoading>
                        <router-view></router-view>

                        <v-row align="left" density="compact" justify="start" class="mt-2">
                            <v-col cols="12" sm="6" md="8" density="compact"> </v-col>
                            <v-col cols="12" sm="6" md="2" class="text-right" density="compact">
                                <v-btn class="text-none text-button mx-auto" color="error" variant="flat"
                                    prepend-icon="mdi-cancel" @click="closeDrawer" size="small"
                                    style="margin-right: 2px">Annuler</v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="2" class="text-right" density="compact">
                                <v-btn type="submit" color="success" class="text-none text-button mx-auto" size="small"
                                    prepend-icon="mdi-check-circle" variant="flat"
                                    style="margin-left: 2px">Valider</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-container>
        </v-card>
        <v-snackbar v-model="snackbar" :timeout="1500" class="text-center" location="center" stacked>
            <strong class="font-weight-medium">{{ text }}</strong>

            <template #actions>
                <v-btn color="red" variant="text" @click="snackbar = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-dialog>
    <v-dialog v-model="dialogSuppr" max-width="400">
        <v-card>
            <v-card-title class="text-h6">
                Suppression de la livraison
                <strong>{{ selectedCmd?.facture }}</strong>
            </v-card-title>

            <v-card-text>
                <div class="mb-3">
                    Voulez-vous annuller la livraison de la commande :
                    <strong>{{ selectedCmd?.commande }}</strong> ?
                </div>

                <v-select v-model="raisonSelected" :items="list_raison_annul" item-title="libelle" item-value="code"
                    label="Choisir une raison" variant="outlined" density="compact" clearable
                    :error="submitted && !raisonSelected"
                    :error-messages="submitted && !raisonSelected ? ['La raison est obligatoire'] : []" />
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn color="grey" variant="text" @click="onCancelSuppr">
                    Annuler
                </v-btn>

                <v-btn color="red" variant="flat" @click="onConfirmSuppr">
                    OK
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import * as XLSX from "xlsx";
import MySelect from '@/components/MySelect.vue';
import dayjs from "dayjs";
import Swal from 'sweetalert2';
import MyLoading from '@/components/Loading.vue';
import useNumericInputValidationOnly from "@/composables/validateNumericInput.js";
import MyTable from '@/components/MyTable.vue';
import { useFactTransStore } from "@/store/Expedition/facTrans.js";
import { useCreateLVStore } from "@/store/Expedition/createLV.js";
import {
    ref,
    defineComponent,
    reactive,
    onMounted,
    onBeforeUnmount,
    computed,
    watch,
    isProxy,
} from "vue";
import { useEnumerationStore } from "@/store/utils/enumeration";


export default defineComponent({
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
        editedItem: {
            type: Object,
            default: null,
        }
    },
    components: {
        MySelect,
        MyTable,
        MyLoading,

    },

    name: "ajoutListeMidac",
    setup(props, { emit }) {
        const dialog = ref(props.drawer);
        const list = ref([])
        const loading = ref(false);
        const chagmt = ref(false);
        const articles = ref(null);
        const newItem = ref(props.editedItem)
        const closeDrawer = () => {
            emit("close");
        };
        const snackbar = ref(false)
        const text = ref("")
        const listDuree = ref([]);
        const store = useFactTransStore();
        const storeliv = useCreateLVStore();
        const storeRaison = useEnumerationStore();
        const { validateNumericInputOnly } = useNumericInputValidationOnly();
        const onKeyPressNumeric = (event) => {
            validateNumericInputOnly(event);
        };
        const m_listCmdLiv = ref([]);
        const user = localStorage.getItem('username');
        const headers = [
            {
                title: 'Client', align: 'start', key: 'nomClt'
            },
            { title: "Heure d'arrivée", align: 'start', key: 'arriveClt' },
            { title: 'Heure de départ', align: 'start', key: 'departClt', },
            { title: 'Actions', align: 'center', key: 'actions' },
        ]

        watch(() => props.drawer, (newVal) => {
            dialog.value = newVal;
        });


        const normalizeTime = (value) => {
            if (!value) return "";

            // Si value est au format ISO : "2025-11-26T13:20"
            if (value.includes("T")) {
                return dayjs(value).format("HH:mm");
            }

            // Si value est déjà un HH:mm
            return dayjs(value, ["HH:mm", "H:mm"]).format("HH:mm");
        };

        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY HH:mm');
            } else {
                return '';
            }

        };

        const onArriveChange = (item) => {
            const hsortie = normalizeTime(newItem.value.liv_sortie);
            const dateRef = "2000-01-01";

            const tArrive = dayjs(`${dateRef} ${item.arriveClt}`, "YYYY-MM-DD HH:mm");
            const tDepart = item.departClt ? dayjs(`${dateRef} ${item.departClt}`, "YYYY-MM-DD HH:mm") : null;
            const tSortie = dayjs(`${dateRef} ${hsortie}`, "YYYY-MM-DD HH:mm");

            // Vérifier la validité
            if (!tArrive.isValid() || !tSortie.isValid()) return;

            // Comparaison : l'arrivée ne peut pas être avant la sortie véhicule
            if (tArrive.isBefore(tSortie)) {
                showMsg("Erreur : L'heure d'arrivée ne peut pas être avant l'heure de sortie véhicule !");
                item.arriveClt = "";  // facultatif : effacer la saisie
                return;
            }

            // Comparaison : départ >= arrivée
            if (tDepart && tDepart.isValid() && tDepart.isBefore(tArrive)) {
                showMsg("Erreur : L'heure de départ ne peut pas être avant l'heure d'arrivée !");
                item.departClt = "";  // facultatif : effacer la saisie
                return;
            }
        };

        const listDel = ref([]); // Nouvelle liste pour les éléments supprimés
        const list_raison_annul = ref([]);
        // const onSuppr = (item) => {

        //     // Cherche l'index de l'item dans listDuree
        //     const index = listDuree.value.findIndex(row => row.codeClt === item.codeClt);
        //     if (index !== -1) {
        //         // Retirer de listDuree
        //         const removed = listDuree.value.splice(index, 1)[0];

        //         // Ajouter à listDel
        //         listDel.value.push(removed);

        //         showMsg(`Client ${removed.nomClt} supprimé de la liste.`);
        //     }
        // };

        // const onSuppr = (codeClt, index, cmd) => {
        //     const list = m_listCmdLiv.value[codeClt];

        //     if (!list || index === -1) return;

        //     // 1. supprimer la commande
        //     const removed = list.splice(index, 1)[0];

        //     // 2. sauvegarder suppression
        //     listDel.value.push({
        //         codeClt,
        //         facture: removed.facture,
        //         commande: removed.commande,
        //     });

        //     // 3. réactivité commandes
        //     m_listCmdLiv.value = {
        //         ...m_listCmdLiv.value,
        //         [codeClt]: list
        //     };

        //     showMsg(`Commande ${removed.commande} supprimée`);

        //     if (list.length === 0) {

        //         const idxClient = listDuree.value.findIndex(r => r.codeClt === codeClt);

        //         if (idxClient !== -1) {
        //             const removedClient = listDuree.value.splice(idxClient, 1)[0];

        //             showMsg(`Client ${removedClient.nomClt}  supprimé de la liste aussi`);
        //         }
        //     }
        // };
        const dialogSuppr = ref(false);

        const selectedCmd = ref(null);

        const selectedCodeClt = ref(null);

        const selectedIndex = ref(null);

        const raisonSelected = ref(null);

        const submitted = ref(false);
        const onSuppr = (codeClt, index, cmd) => {
            selectedCmd.value = cmd;
            selectedCodeClt.value = codeClt;
            selectedIndex.value = index;

            raisonSelected.value = null;
            submitted.value = false;

            dialogSuppr.value = true;
        };
        const onCancelSuppr = () => {
            dialogSuppr.value = false;
        };
        const onConfirmSuppr = () => {
            submitted.value = true;

            if (!raisonSelected.value) return;

            const codeClt = selectedCodeClt.value;
            const index = selectedIndex.value;
            const list = m_listCmdLiv.value[codeClt];

            if (!list || index === -1) return;

            const removed = list.splice(index, 1)[0];

            listDel.value.push({
                codeClt,
                facture: removed.facture,
                commande: removed.commande,
                raison_annul: raisonSelected.value
            });

            m_listCmdLiv.value = {
                ...m_listCmdLiv.value,
                [codeClt]: list
            };

            showMsg(`Commande ${removed.commande} supprimée`);

            // 🔥 suppression client si plus de commandes
            if (list.length === 0) {
                const idxClient = listDuree.value.findIndex(r => r.codeClt === codeClt);

                if (idxClient !== -1) {
                    const removedClient = listDuree.value.splice(idxClient, 1)[0];
                    showMsg(`Client ${removedClient.nomClt} supprimé`);
                }
            }

            dialogSuppr.value = false;
        };

        const onDepartChange = (item) => {
            const hsortie = normalizeTime(newItem.value.liv_sortie);
            const dateRef = "2000-01-01";

            const tArrive = item.arriveClt ? dayjs(`${dateRef} ${item.arriveClt}`, "YYYY-MM-DD HH:mm") : null;
            const tDepart = dayjs(`${dateRef} ${item.departClt}`, "YYYY-MM-DD HH:mm");
            const tSortie = dayjs(`${dateRef} ${hsortie}`, "YYYY-MM-DD HH:mm");

            // Vérifier la validité
            if (!tDepart.isValid() || !tSortie.isValid()) return;

            // Comparaison : départ ne peut pas être avant la sortie véhicule
            if (tDepart.isBefore(tSortie)) {
                showMsg("Erreur : L'heure départ ne peut pas être avant l'heure de sortie véhicule !");
                item.departClt = "";
                return;
            }

            // Comparaison : départ >= arrivée
            if (tArrive && tArrive.isValid() && tDepart.isBefore(tArrive)) {
                showMsg("Erreur : L'heure de départ ne peut pas être avant l'heure d'arrivée !");
                item.departClt = "";
                return;
            }
        };



        const onValide = async () => {
            const rempl = Number(newItem.value.livrempli);
            // 🔥 Validation compteur : cpt_depart < cpt_arrive
            const cptArrive = Number(newItem.value.cpt_arrive);
            const cptDepart = Number(newItem.value.cpt_depart);

            // on vérifie si un des deux est vide ou non numérique
            if (!newItem.value.cpt_arrive || !newItem.value.cpt_depart ||
                isNaN(cptArrive) || isNaN(cptDepart)) {
                showMsg("Valeur du compteur invalide");
                return; // ⛔ STOP
            }
            // cpt_depart > 0 et cpt_arrive > 0
            if (cptArrive <= 0 || cptDepart <= 0) {
                showMsg("Les compteurs doivent être strictement supérieurs à 0");
                return;
            }

            // règle stricte : départ < arrivée
            if (cptDepart >= cptArrive) {
                showMsg("Le compteur de départ doit être STRICTEMENT inférieur au compteur d’arrivée");
                return; // ⛔ STOP TOTAL
            }

            if (!newItem.value.livrempli || isNaN(rempl)) {
                showMsg("Le remplissage est invalide");
                return;
            }

            if (rempl < 0) {
                showMsg("Le remplissage ne peut pas être négatif");
                return;
            }

            if (rempl > 100) {
                showMsg("Le remplissage ne peut pas dépasser 100%");
                return;
            }
            try {
                chagmt.value = true;

                const baseDate = dayjs(newItem.value.liv_sortie).format("YYYY-MM-DD");

                // Filtrer uniquement les lignes valides
                const lignesValides = listDuree.value.filter(row => {
                    // Ignore les lignes où arrive ou depart est vide
                    if (!row.arriveClt || !row.departClt) return false;

                    // Parser avec date fictive pour éviter les problèmes de strict mode
                    const validArrive = dayjs(`2000-01-01 ${row.arriveClt}`, "YYYY-MM-DD HH:mm").isValid();
                    const validDepart = dayjs(`2000-01-01 ${row.departClt}`, "YYYY-MM-DD HH:mm").isValid();

                    return validArrive && validDepart;
                });

                // Boucle SEULEMENT sur les lignes valides
                for (const row of lignesValides) {

                    const hArrive = dayjs(`${baseDate} ${row.arriveClt}`, "YYYY-MM-DD HH:mm").toISOString();
                    const hDepart = dayjs(`${baseDate} ${row.departClt}`, "YYYY-MM-DD HH:mm").toISOString();

                    // Si un format est invalide → on ignore la ligne
                    if (hArrive === "Invalid Date" || hDepart === "Invalid Date") continue;

                    await store.insert_dureeLV(
                        newItem.value.liv_code,
                        row.codeClt.trim(),
                        hArrive,
                        hDepart
                    );
                }

                if (listDel.value.length > 0) {
                    for (const row of listDel.value) {
                        await storeliv.onAddCmdLiv(
                            row.commande,
                           null,
                            row.raison_annul // 🔥 maintenant envoyé
                        );
                    }
                }

                // statut saisie: 1 si au moins UNE ligne valide
                const toutesLignesCompletes = listDuree.value.every(row =>
                    row.arriveClt && row.departClt
                );

                let statutSaisie = 0;

                // Vérifier les champs obligatoires + conditions compteur
                if (
                    rempl >= 0 &&
                    rempl <= 100 &&
                    newItem.value.cpt_arrive &&
                    newItem.value.cpt_depart &&
                    !isNaN(Number(newItem.value.cpt_arrive)) &&
                    !isNaN(Number(newItem.value.cpt_depart)) &&
                    Number(newItem.value.cpt_depart) < Number(newItem.value.cpt_arrive)) {

                    // ET toutes les lignes sont complètes
                    if (toutesLignesCompletes) {
                        console.log('ok')
                        statutSaisie = 1;
                    }
                }

                await store.updateSaisieLV(
                    newItem.value.liv_code,
                    newItem.value.livrempli,
                    newItem.value.cpt_arrive,
                    newItem.value.cpt_depart,
                    statutSaisie
                );

            } catch (error) {
                console.error(error);
                alert("Erreur lors de la validation !");
            } finally {
                chagmt.value = false;
                emit("onValide");
                closeDrawer();

                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Saisie Livraison ${newItem.value.liv_code} effectuée avec succès`,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                });
            }
        };


        onMounted(async () => {
            await store.getDureeLV(newItem.value.liv_code)
            listDuree.value = store.dureeLV.map(row => ({
                ...row,
                arriveClt: row.arriveClt ? dayjs(row.arriveClt).format("HH:mm") : "",
                departClt: row.departClt ? dayjs(row.departClt).format("HH:mm") : ""
            }));

            storeRaison.params.code = "RAIS_ANNUL_LIV";
            await storeRaison.fetchEnums();
            list_raison_annul.value = storeRaison.enumerations;
        });

        const showMsg = (msg) => {
            text.value = msg;
            snackbar.value = true;
        };
        const expanded = ref([]);

        const onToggleExpand = async (internalItem, toggleExpand) => {
            const item = internalItem.raw;

            const isOpen = expanded.value.includes(item.codeClt);

            // 👉 fermer tout
            expanded.value = [];

            if (!isOpen) {
                expanded.value = [item.codeClt];
            }

            // reset data ligne
            if (!m_listCmdLiv.value[item.codeClt]) {
                m_listCmdLiv.value[item.codeClt] = [];
            }

            m_listCmdLiv.value[item.codeClt] = [];

            await storeliv.fetchlistCmdLiv(
                newItem.value.liv_code,
                item.codeClt
            );

            m_listCmdLiv.value[item.codeClt] = storeliv.m_listCmdLivSuppr;
        };

        return {
            closeDrawer, dialog, onValide, headers, list, chagmt, articles, loading, formatDateTime, list_raison_annul,
            newItem, onKeyPressNumeric, listDuree, showMsg, text, snackbar, onArriveChange, onDepartChange, onSuppr, m_listCmdLiv, onToggleExpand, expanded,
            dialogSuppr, selectedCmd, raisonSelected, submitted, onCancelSuppr, onConfirmSuppr

        };
    },
});
</script>
<style>
.liv_header thead th {
    text-align: center !important;
}

.liv_header tbody td {
    text-align: start !important;
}

.custom-time-field .v-field__input {
    text-align: center !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    min-height: 28px !important;
    /* réglage hauteur */
}

.custom-time-field .v-field__outline {
    min-height: 28px !important;
}

.blue-header.v-data-table tr>td:first-child {
    border-left: 4px solid #969696;
}

.blue-header.v-data-table tr>td:last-child {
    border-right: 4px solid #969696;
}


.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
}

.blue-header.v-data-table tr>td:first-child {
    border-left: 2px solid #969696;
}

.blue-header.v-data-table tr>td:last-child {
    border-right: 2px solid #969696;
}

.cmd-table td,
.cmd-table th {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    height: 15px;
    line-height: 12px;
}
</style>