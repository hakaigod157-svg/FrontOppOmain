<template>
    <MyDialog :titre_toolbar=titre_detail @close="closeDialog" v-model="dialogVisible" :visibleClose="true">
        <!-- <MySnackbar contenu="Envoyer directement ce bon
            {{ codeCC }} de preparation chez l'expedition pour la facture" :titre="codeCC">
        </MySnackbar> -->
        <div class="pa-2">
            <v-row v-if="!loading">
                <v-col cols="10" md="2">
                    <v-list :lines="false" density="compact" nav>
                        <v-list-item v-for="(item, i) in storePrep.depotCmd" :key="i" :value="item"
                            active-color="primary" @click="selectItem(item)">
                            <template v-slot:prepend>
                                <v-icon icon="mdi-star"></v-icon>
                            </template>
                            <v-list-item-title v-text="item.depot"></v-list-item-title>
                            <v-list-item-subtitle v-text="'Nb Article: ' + item.nb_article"></v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="10" md="2">
                    <v-table fixed-header max-height="300px" density="compact">
                        <thead>
                            <tr>
                                <th class="text-center" style="background-color: #b8b3cc; color: black;">
                                    Rayon
                                </th>
                                <th class="text-center" style="background-color: #b8b3cc; color: black;">
                                    Nb Article
                                </th>
                                <th class="text-center" style="background-color: #b8b3cc; color: black;">
                                    <!-- <v-checkbox v-model="selectAll" color="primary" hide-details></v-checkbox> -->
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredRayonCmd " :key="item.rayon">
                                <td>{{ item.rayon }}</td>
                                <td>{{ item.nb_article }}</td>
                                <td>
                                    <v-checkbox v-model="item.etat" v-bind:checked="item.etat" hide-details
                                        color="primary" @change="handleCheckboxChange(item)"></v-checkbox>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-col>
                <v-col cols="10" md="4">
                </v-col>
                <v-col cols="10" md="2" class="text-center">
                    <v-btn block rounded="xs" variant="elevated" color="#D3D3D3"
                        @click="onPrepareClick">PREPARER</v-btn>
                    <div class="pa-10" v-if="selectedDepotCmd">
                        PREPARATION --> <b>{{ selectedDepotCmd.depot }}</b>
                    </div>
                    <v-alert v-if="isError" type="error" @click="isError = false, dialog = false">preparation GROS en
                        premier</v-alert>
                    <v-alert v-if="isVide && !isError" type="error" @click="isVide = false, dialog = false">La liste des
                        articles à preparer est
                        vide</v-alert>
                    <v-alert v-if="isVideL6 && !isVide && !isError" type="error"
                        @click="isVideL6 = false, dialog = false">Un
                        probleme est survenu sur la sortie de
                        Bon de preparation, Veuillez contacter le responsable</v-alert>
                    <ConfirmationDialog v-if="dialog && !isVideL6 && !isVide && !isError" v-model="dialog"
                        title="Confirmation de Préparation" :message=message @handleYes="handleYes"
                        @handleNo="handleNo" />
                    <MyLoading :loading="chagmt" @close="chagmt = false" :articles="articles"></MyLoading>
                    <router-view></router-view>

                </v-col>

            </v-row>
        </div>
        <div class="pa-2">
            <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5">

            </v-progress-linear>
        </div>
        <div v-if="updated">
            <v-container fluid>
                <div class="check">
                    <!-- <v-checkbox color="primary" hide-details></v-checkbox> -->
                </div>
                <MyTable :showNbLigne="false" :headers="headers" :items="filteredArticle" fixed-header height="400"
                    v-if="!loading" @handleCheckboxClick="handleCheckboxClick">
                </MyTable>


                <!-- <v-table height="400" v-if="!loading">
                    <thead>
                        <tr>
                            <th class="HeadPrepa">commande</th>
                            <th class="HeadPrepa">Article</th>
                            <th class="HeadPrepa">Libellé</th>
                            <th class="HeadPrepa">Quantité en Prep</th>
                            <th class="HeadPrepa">Quantité Dispo</th>
                            <th class="HeadPrepa">Transfert</th>
                            <th class="HeadPrepa">
                                <v-checkbox color="primary" hide-details v-model="selectAllCheckbox" @change="selectAll">

                                </v-checkbox>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in filteredArticle " :key="item.code_CCL">
                                <td>{{ item.code_CCL }}</td>
                                <td>{{ item.article }}</td>
                                <td>{{ item.libelle }}</td>
                                <td>{{ item.qte_a_preparer }}</td>
                                <td>{{ item.dispo }}</td>
                                <td>{{ item.transfert }}</td> -->
                <!-- <td>{{ item.etat }}</td> -->
                <!-- <td>
                                    <v-checkbox-btn v-model="item.etat" color="primary" hide-details
                                    :disabled="item.transfert === 'Transfert' || item.transfert === 'Sans Empl' || item.transfert === 'Porte'"
                                    @click="handleCheckboxClick(item)">
                                    </v-checkbox-btn>
                                </td>
                            </tr>
                        </tbody>
                </v-table> -->
                <div style="max-height: 50px;"></div>
                <v-card>
                    <v-row>
                        <v-col>
                            <v-sheet class="pl-2">
                                <b> {{ totalArticles }}</b> articles
                            </v-sheet>
                        </v-col>

                        <v-col>
                            <v-sheet>
                                <b> {{ totalTransfert }}</b> articles en attente Transfert
                            </v-sheet>
                        </v-col>

                        <v-col>
                            <v-sheet>
                                <b> {{ totalPorte }}</b> articles en attente Porte
                            </v-sheet>
                        </v-col>

                        <v-col>
                            <v-sheet>
                                <b> {{ totalSansEmpl }}</b> articles sans emplacement
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card>

            </v-container>

        </div>
    </MyDialog>
</template>

<script>
import MyDialog from '@/components/DialogFullScreen.vue';
import MyTable from '@/components/MyTable.vue';
import MyList from '@/components/MyList.vue';
import MyTextarea from '@/components/MyTextarea.vue';
import MyTextField from '@/components/MyTextField.vue';
import MySelect from '@/components/MySelect.vue';
import MySnackbar from '@/components/MySnackbar.vue';
import Alert from '@/components/Alert.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import { prepCommandStore } from "@/store/Apreparer/genererPrep";
import { useCreateBP } from "@/store/Apreparer/creationBP";
import { useRoute, useRouter } from 'vue-router';
import MyLoading from '@/components/Loading.vue';
import { useReportBPStore } from "@/store/report/printBP";
import { useLockStore } from '@/store/utils/lock';
import useSessionTimeout from '@/utils/useSessionTimeout';
import { useNewID } from '@/store/utils/newID';
import Config from "@/utils/config.js"

import { ref, reactive, onMounted, computed, onBeforeUnmount, defineComponent, watch, onBeforeMount, onUpdated } from "vue";

export default defineComponent({
    components: {
        MyDialog,
        MyTable,
        MyList,
        MyTextarea,
        MyTextField,
        MySelect,
        Alert,
        ConfirmationDialog,
        MyLoading,
        MySnackbar
    },
    name: 'preparerCmd',
    setup() {
        const showDialog = ref(false);
        const route = useRoute();
        const CC = route.params.CC;
        const storePrep = prepCommandStore();
        const storeCreBP = useCreateBP();
        const storeID = useNewID();
        const loading = computed(() => storePrep.loading)
        const updated = ref(false);
        const chagmt = ref(false);
        const articles = ref(null);
        const selectEtat = ref(null);
        const rayonEtat = ref(null);
        const isError = ref(false);
        const isVide = ref(false);
        const isVideL6 = ref(false);
        const isFrais = ref(false);
        const selectedDepotCmd = ref(null);
        const dialog = ref(false);
        let message = ref("");
        const storePrintBP = useReportBPStore();
        const router = useRouter();
        const lockStore = useLockStore();
        let selectAllCheckbox = ref(true);
        const dialogVisible = ref(false);
        const ipLocal = localStorage.getItem('ip_local');

        let titre_detail = ref("");
        useSessionTimeout(Config.DURRE_SESSION, router);

        const closeDialog = async () => {
            await delock();
        }

        const delock = async () => {
            dialogVisible.value = false;
            const params = {
                xTable: 'FCC',
                xCode: CC,
                isClose: 1,
            }
            await lockStore.fetchLock(params);
            history.back();
        }


        const headersRayonCmd = [
            { text: 'Rayon', align: 'start', value: 'rayon', sortable: true },
            { text: 'Nb Article', align: 'start', value: 'nb_article' },
            { text: 'Select', value: 'etat' },

        ]


        const headers = [
            { title: 'Commande', align: 'start', key: 'code_CCL' },
            { title: 'Article', align: 'center', key: 'article', sortable: true },
            { title: 'Libellé', align: 'start', key: 'libelle' },
            { title: 'Quantité en Prep', align: 'center', key: 'qte_a_preparer' },
            { title: 'Quantité Dispo', align: 'center', key: 'dispo' },
            { title: 'Transfert', align: 'center', key: 'transfert' },
            { title: 'Etat', align: 'center', key: 'etat' },

        ]


        onBeforeMount(async () => {
            dialogVisible.value = true;
            titre_detail.value = "Preparation du Commande " + CC;
            await fetchPrepa();
        })


        const fetchPrepa = async () => {
            storePrep.setCode(CC); // Set the code parameter
            await storePrep.fetchPreparerCmd(); // Fetch commands
            if (storePrep.depotCmd.length > 0) {
                selectedDepotCmd.value = storePrep.depotCmd[0];
            }
            filteredListeComp();
        }

        const selectItem = (item) => {
            selectedDepotCmd.value = item;
            reactiveEtat();
            filteredListeComp();
        };

        const reactiveEtat = () => {
            storePrep.rayonCmd.forEach(item => {
                item.etat = true;
            });
            storePrep.articleCmd.forEach(item => {
                if (item.transfert !== 'Transfert' && item.transfert !== 'Sans Empl' && item.transfert !== 'Porte') {
                    item.etat = true;
                }
            });

        }


        const totalArticles = computed(() => {
            return filteredArticle.value.length;
        });

        const totalTransfert = computed(() => {
            return filteredArticle.value.filter(item => item.transfert === "Transfert").length
        });

        const total_T = computed(() => {
            return filteredListeCmd.value.filter(item => (item.transfert === "Transfert" && item.transfert === "Porte" && item.transfert === "Sans Empl")).length
        });
        const totalPorte = computed(() => {
            return filteredArticle.value.filter(item => item.transfert === "Porte").length
        });

        const totalSansEmpl = computed(() => {
            return filteredArticle.value.filter(item => item.transfert === "Sans Empl").length
        });

        watch(
            () => storePrep.depotCmd,
            (newDepotCmd) => {
                if (!selectedDepotCmd.value && newDepotCmd.length > 0) {
                    selectedDepotCmd.value = newDepotCmd[0];
                }
            }
        );

        const depotDefaut = computed(() => {
            return selectedDepotCmd.value?.depot;
        });

        // const depotDefaut = computed(() => {
        //     if (!selectedDepotCmd.value && storePrep.depotCmd.length > 0) {
        //         selectedDepotCmd.value = storePrep.depotCmd[0];
        //     }
        //     return selectedDepotCmd.value.depot
        // })

        const fraisSeulement = async () => {
            if (filteredArticle.value.length === 1 && filteredArticle.value.filter(item => item.article.trim() === "FRAISDIV").length === 1) {
                // const params = {
                //     codeCC: CC,
                // }
                // await storeCreBP.updateFrais(params);
                return true;
            } else {

                return false;
            }

        }

        const filteredArticle = computed(() => {
            if (selectedDepotCmd.value && !rayonEtat.value) {
                return storePrep.articleCmd.filter(item => (item.depot.trim() === selectedDepotCmd.value.depot.trim()

                ));

            } else if (rayonEtat.value) {
                return storePrep.articleCmd.filter(item => (item.depot.trim() === selectedDepotCmd.value.depot.trim()
                    &&
                    filteredListeCmd.value.some(list => list.article.trim() === item.article.trim() && list.depot.trim() === item.depot.trim())
                ));
            }
            else {
                return storePrep.articleCmd;
            }
        });

        const filteredRayonCmd = computed(() => {
            if (selectedDepotCmd.value && storePrep.depotCmd.length > 0) {
                return storePrep.rayonCmd.filter(item => item.depot.trim() === selectedDepotCmd.value.depot.trim());
            } else {
                return storePrep.rayonCmd;
            }
        });

        const filteredListeCmd = computed(() => {
            if (selectedDepotCmd.value && !rayonEtat.value) {
                return storePrep.listeCmd.filter(item => (item.depot.trim() === selectedDepotCmd.value.depot.trim()
                ));
            } else if (rayonEtat.value) {
                return storePrep.listeCmd.filter(item => (item.depot.trim() === selectedDepotCmd.value.depot.trim() &&
                    filteredRayonCmd.value.some(rayon => rayon.rayon.trim() === item.rayon.trim() && rayon.etat === true)
                ));
            }
            else {
                return storePrep.listeCmd;
            }

        });


        const handleCheckboxClick = (item) => {
            selectEtat.value = item;
            filteredListeCmdEtat();
        }

        //eto zao 

        const selectAll = (item) => {

            if (selectAllCheckbox.value === true) {

                storePrep.articleCmd.forEach(item => {
                    if (item.transfert !== 'Transfert' && item.transfert !== 'Sans Empl' && item.transfert !== 'Porte') {
                        item.etat = true;
                    }
                });

            } else {

                storePrep.articleCmd.forEach(item => {
                    if (item.transfert !== 'Transfert' && item.transfert !== 'Sans Empl' && item.transfert !== 'Porte') {
                        item.etat = false;
                    }
                });
            }
        };

        const filteredListeCmdEtat = () => {
            let updatedListeCmd = filteredListeCmd.value.map(item => {
                if (item.article.trim() === selectEtat.value.article.trim()) {
                    item.etat = !selectEtat.value.etat;
                }
                return item;
            });
            filteredListeCmd.value = updatedListeCmd;
        };


        const filteredListeComp = () => {
            filteredListeCmd.value.forEach(itemA => {
                const itemB = filteredArticle.value.find(itemB => (itemB.article.trim() === itemA.article.trim() && itemB.depot.trim() === itemA.depot.trim()))
                if (itemB) {
                    itemA.etat = itemB.etat
                }

            })
            updated.value = true;

        };

        const handleCheckboxChange = (item) => {
            rayonEtat.value = item;
        };


        const isPrioGros = () => {
            const itemB = storePrep.depotCmd.find(itemB => (itemB.depot.trim() === 'GROS'));
            if (selectedDepotCmd.value && itemB) {
                if (selectedDepotCmd.value.depot.trim() !== itemB.depot) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        };

        const onPrepareClick = async () => {
            const isGros = isPrioGros();
            if (!selectedDepotCmd.value) {
                selectedDepotCmd.value = storePrep.depotCmd[0];
            }
            message.value = "Voulez vous préparer ces articles côchés dans le dépôt " + selectedDepotCmd.value.depot;
            if (isGros) {
                isError.value = false;
                dialog.value = true;
            } else {
                isError.value = true;
                dialog.value = false;

            }
            if ((filteredArticle.value.filter(item => item.etat === true).length) > 0) {
                isVide.value = false;
                dialog.value = true;
            } else {
                isVide.value = true;
                dialog.value = false;
            }
            if ((filteredListeCmd.value.filter(item => item.etat === true).length) > 0) {
                isVideL6.value = false;
                dialog.value = true;
            } else {
                isVideL6.value = true;
                dialog.value = false;
            }



        };
        const handleYes = async () => {
            dialog.value = false;
            await fetchInsertBP();
        }

        function handleNo() {
            dialog.value = false;
        }

        const atteTransferts = async () => {
            console.log("1");
            if (totalTransfert.value > 0) {
                console.log("2");
                for (let i = 0; i < filteredArticle.value.length; i++) {
                    const item = filteredArticle.value[i];
                    console.log("3");
                    console.log(item);
                    if (item.transfert === "Transfert" || item.transfert === "Porte" || item.transfert === "Sans Empl") {

                        console.log("4");
                        console.log(item.article)
                        console.log(CC)
                        // console.log('pass :'+paramss)
                        await storeCreBP.atteTransfert(CC, item.article.trim());
                    }
                }

            }

        }

        const atteTransferResume = async () => {
            if (totalTransfert.value > 0) {
                const params = {
                    codeCC: CC,
                    ip :ipLocal,
                };
                await storeCreBP.updateResume(params);

            }
        };


        const fetchInsertBP = async () => {
            chagmt.value = true;
            await storeID.getId();

            for (let i = 0; i < filteredListeCmd.value.length; i++) {
                const item = filteredListeCmd.value[i];
                if (item.etat === true) {
                    item.myID = storeID.myId;
                    let j = i + 1;
                    articles.value = `${item.article}[${j}/${filteredListeCmd.value.length}]`;
                    item.ip_web = localStorage.getItem('ip_local');

                    const {
                        article, lettre, designation, lienCode, lienNum, Qte, unitfact, prix_ht, modeliv, lignelibre,
                        typeVente, reglement, echeancesp, abs_qte, factman, offert, artype, devise, coursdev, prixht_dev,
                        totht_dev, rem1, rem2, rem3, totPrix_HT, emplacement, attachement, lot, arreffour, cclmarche,
                        ccldate, cclcolis, arqtecolis, cclpaht, seqLib, comment_mag, cclcolisage, cclnbcolis, cclpack,
                        rayon, depot, cclpromo, myID, ip_web
                    } = item;

                    await storeCreBP.insertL6(item);
                }
            }

            const params = {
                ids: storeID.myId,
                code_CC: CC,
                depot: depotDefaut.value,
                user_web: localStorage.getItem('username'),
            };

            await storeCreBP.insertBP(params);
            isFrais.value = await fraisSeulement();

            try {
                if (storeCreBP.code_BP && !isFrais.value) {
                    await atteTransferResume();
                    console.log("0");
                    await atteTransferts();

                    articles.value = `Impression ${storeCreBP.code_BP}`;
                    const response = await storePrintBP.generateReport(storeCreBP.code_BP, 0);
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                    URL.revokeObjectURL(url);
                } else if (isFrais.value) {
                    await delock();
                }
            } catch (error) {
                console.error(error);
            } finally {
                chagmt.value = false;
                await fetchPrepa();
                if (storePrep.depotCmd.length === 0) {
                    await delock();
                    console.log("La liste storePrep.depotCmd est vide.");
                }
            }
        };

        return {
            dialogVisible, titre_detail, closeDialog, CC, headersRayonCmd, storePrep, fetchPrepa, selectItem, headers, loading, filteredRayonCmd, filteredArticle,
            selectedDepotCmd, handleCheckboxClick, filteredListeCmd, filteredListeComp, updated, handleCheckboxChange, totalArticles, totalTransfert,
            totalPorte, totalSansEmpl, onPrepareClick, isPrioGros, isError, isVide, isVideL6, dialog, showDialog, message, handleYes, handleNo, fetchInsertBP, storeCreBP,
            chagmt, articles, atteTransferts, selectAllCheckbox, selectAll, fraisSeulement, isFrais, total_T, delock,ipLocal,


        }
    },
});
</script>

<style scoped>
/* .container {
    display: flex;
    flex-direction: row;

    justify-content: space-between;
    max-height: 500px;
    overflow-y: auto;
}

.left {
    flex-basis: 70%;
}

.right {
    flex-basis: 30%;
} */

.v-list-item.active {
    background-color: blue;
    color: white;
}

.v-datatable .v-datatable__actions {
    flex-direction: row-reverse;
}

.colorHead {
    background-color: blue;
    /* Remplacez par votre couleur préférée */
}

/* .check {
position: sticky;
z-index: 9999;
top: 48%;
left: 20%;
transform: translate(-0%, -0%);
color:red;
} */

.HeadPrepa {
    position: sticky;
    top: 0;
    z-index: 9999;
    background-color: #b8b3cc;
    white-space: nowrap;
}
</style>