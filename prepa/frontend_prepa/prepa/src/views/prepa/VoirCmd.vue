<template>
    <MyDialog :titre_toolbar=titre_detail btn_valide="Valider" @save="saveItem" :visibleClose=false v-model="dialogVisible">
        <!-- <div>

            <v-card-text>
                <b> {{ storeInfoCmd.infoCmds.nom_client }}</b>
                <v-spacer />
                Adresses: {{ storeInfoCmd.infoCmds.adresse }}
                <v-spacer />
                Contacts: {{ storeInfoCmd.infoCmds.contact }}
            </v-card-text>
        </div> -->
        <div class="div1">
            <v-form>
                <v-container fluid>
                    <v-row>
                        <v-col cols="12" md="2">
                            <MyTextarea name_lab_area="Commentaires Client" v-model="storeInfoCmd.infoCmds.coms_client">
                            </MyTextarea>
                        </v-col>
                        <v-col cols="12" md="3">
                            <MyTextarea name_lab_area="Commentaires Magasin" v-model="storeInfoCmd.infoCmds.coms_mag">
                            </MyTextarea>
                        </v-col>
                        <v-col cols="12" md="3">
                            <MySelect comb_lab="Commentaire changement Date Livaison"
                                v-model="storeInfoCmd.infoCmds.raisonDateLiv" :items="storeEnum.enumerations">
                            </MySelect>
                            <v-card-actions>
                                <MyTextField name_lab_text="Date Livraison prévue" v-model="storeInfoCmd.infoCmds.date_l"
                                    type_text="date">
                                </MyTextField>
                                <v-spacer></v-spacer>
                                <MyTextField name_lab_text="Heure Livraison prévue" v-model="storeInfoCmd.infoCmds.heure_l"
                                    type_text="time">
                                </MyTextField>
                            </v-card-actions>
                        </v-col>
                        <v-col cols="12" md="3">
                            <MySelect comb_lab="Axe" :items="storeAxe.axes" v-model="storeInfoCmd.infoCmds.axe">
                            </MySelect>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </div>
        <div>
            <div class="container fluid">
                <div class="left pa-2">
                    <v-card-actions density="compact">
                        <v-card-title>
                            <h3><u>Articles en préparations</u></h3>
                        </v-card-title>
                        <v-spacer />
                        <span style="color: red;"><b>*T*</b></span><v-badge :content='totalTransfert' color="red" inline
                            class="x-large"></v-badge>
                    </v-card-actions>
                    <!-- <v-row>
                        <v-col>
                            <h2><u>Articles en préparations</u></h2>
                        </v-col>
                        <v-col>
                            <span style="color: red;"><b>*T*</b></span><v-badge :content='totalTransfert' color="red" inline
                                class="x-large"></v-badge>
                        </v-col>
                    </v-row> -->
                    <div style="max-height: 400px; overflow-y: auto;">
                        <MyTable :headers="headersLigne" :items="ligneCmd" v-if="!loading" height="300"
                            :header-color="green">
                        </MyTable>
                    </div>
                </div>
                <!-- <v-divider vertical  class="bold-divider"/> -->
                <div class="right pa-2">
                    <v-card-actions density="compact">
                        <v-card-title>
                            <h3><u>Préparation</u></h3>
                        </v-card-title>
                    </v-card-actions>

                    <MyTable :headers="headersSecondtable" :items="detailPrep" v-if="!loading" height="300"
                        action2="Imprimer" @action2Item="imprimer" :showAction1="false" class="custom-header">
                    </MyTable>

                    <!-- <v-list density="comfortable">
                        <v-list-item v-for="(item, index) in storePrep.detailPreps" :key="index" v-if="!loading">
                            <v-list-item-content>
                                <v-list-item-title class="pb-0.5"
                                    v-text="`${item.code_BP} - ${item.depot}`"></v-list-item-title>
                                <v-list-item-subtitle class="pb-0.5"
                                    v-text="`Date Creation: ${item.datecre_BP} | Stade: ${item.stade}`">
                                </v-list-item-subtitle>
                                <v-list-item-subtitle class="pb-0.5"
                                    v-text="`Bacs: ${item.listBac} | Emplacement: ${item.empl} | Nb Colis: ${item.nbColis}`">
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action @click="imprimer(item)">
                                <v-icon size="large" color="blue">mdi-printer</v-icon>
                            </v-list-item-action>
                            <v-divider></v-divider>
                        </v-list-item>
                    </v-list> -->

                </div>
            </div>
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
import Alert from '@/components/Alert.vue';
import { useLigneCommandeStore } from "@/store/Apreparer/ligneCommande.js";
import { useDetailPrepStore } from "@/store/Apreparer/detailPrep.js";
import { useInfoCmdStore } from "@/store/Apreparer/infoCmd.js";
import { useAxeStore } from "@/store/utils/axe.js";
import { useEnumerationStore } from "@/store/utils/enumeration.js";
import { useRoute, useRouter } from 'vue-router'
import { useReportBPStore } from '@/store/report/printBP';
import { ref, reactive, onMounted, computed, defineEmits, defineComponent, watch, onBeforeMount } from "vue";
import useDateTime from '@/composables/useDateTime';
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js"

export default defineComponent({
    components: {
        MyDialog,
        MyTable,
        MyList,
        MyTextarea,
        MyTextField,
        MySelect,
        Alert,
    },
    name: 'voirCmd',
    setup() {

        const route = useRoute();
        const CC = route.params.CC;
        const router = useRouter();

        const storeLigne = useLigneCommandeStore();
        const storePrep = useDetailPrepStore();
        const storeInfoCmd = useInfoCmdStore();
        const storeEnum = useEnumerationStore();
        const storeAxe = useAxeStore();
        const loading = ref(false);
        const dialogVisible = ref(false);
        const success = ref(false);
        const detailPrep = ref([]);
        const ligneCmd = ref([]);
        const listAxe = [];

        let titre_detail = ref("");
        const date_liv = ref(null);

        const storePrint = useReportBPStore();
        useSessionTimeout(Config.DURRE_SESSION, router);

        function closeDialog() {
            dialogVisible.value = false;
            // router.push({ name: 'attePrepa' });
            history.back();
        }
        const axes = [
            { axe: ' ' },
            { axe: 'CENTRE' },
            { axe: 'EST' },
            { axe: 'ITAOSY' },
            { axe: 'IVATO' },
            { axe: 'NORD' },
            { axe: 'SIXSEPT' },
            { axe: 'SUD' },
            { axe: 'SUD-EST' },
        ];

        onBeforeMount(async () => {
            dialogVisible.value = true;
            titre_detail.value = "Details du Commande " + CC;
            await fetchAxes();
            await fetchligneCommande();
            await fetchDetailPreps();
            await fetchInfoCmd();

            await fetchEnumCom();
        })

        const headersLigne = [
            // { title: 'Article', align: 'start', key: 'code_article', sortable: true },
            { title: 'Libellé', align: 'start', key: 'libelle', sortable: true, width: 300 },
            { title: 'Qte cmd', align: 'center', key: 'qte_cmd', width: 20 },
            // { title: 'Quantité Restée', align: 'end', key: 'qte_reste' },
            // { title: 'Quantité Expediée', align: 'end', key: 'qte_expedie' },
            { title: 'Transfert', align: 'center', key: 'coms', width: 20 },

        ]

        const headersSecondtable = [
            { title: 'BP', align: 'start', key: 'code_BP', sortable: true },
            { title: 'Depot', align: 'start', key: 'depot' },
            { title: 'Date', align: 'start', key: 'datecre_BP', sortable: true },
            { title: 'Stade', align: 'start', key: 'stade' },
            { title: 'Bacs', align: 'start', key: 'listBac' },
            { title: 'Emplacement', align: 'start', key: 'empl' },
            { title: 'Nb colis', align: 'center', key: 'nbColis' },
            { title: 'Actions', align: 'start', key: 'actions', value: 'actions' },
        ]


        const fetchligneCommande = async () => {
            loading.value = true;
            storeLigne.params.code = CC;
            await storeLigne.fetchLigneCommande();
            ligneCmd.value = storeLigne.ligneCommandes;
            loading.value = false;
        }

        const fetchDetailPreps = async () => {
            loading.value = true;
            storePrep.params.code = CC;
            await storePrep.fetchDetailPrep();
            if (storePrep.detailPreps.length > 0) {
                detailPrep.value = storePrep.detailPreps;
            }
            loading.value = false;
        }
        const fetchInfoCmd = async () => {
            loading.value = true;
            storeInfoCmd.params.code = CC;
            await storeInfoCmd.fetchInfoCommande();
            const { dateTime } = useDateTime(storeInfoCmd.infoCmds.date_liv);
            date_liv.value = dateTime.value
            loading.value = false;

        }

        const fetchAxes = async () => {
            loading.value = true;
            await storeAxe.fetchAxe();
            loading.value = false;
            listAxe.value = getAxeList();
            //console.log(listAxe);
        }


        // const listAxe = (() => {
        //     if (storeAxe.axes.length > 0) {
        //         return storeAxe.axes.map(item => item.axe);
        //     }
        //     return '';
        // });

        function getAxeList() {
            const listAxe = storeAxe.axes.map(item => item.axe);
            return listAxe;
        }

        const fetchEnumCom = async () => {
            loading.value = true;
            storeEnum.params.code = "COM_DATELIV";
            await storeEnum.fetchEnums();
            loading.value = false;
        }


        function saveItem() {
            const infoCmd = {
                coms_mag: storeInfoCmd.infoCmds.coms_mag,
                axe: storeInfoCmd.infoCmds.axe,
                date_liv: new Date(storeInfoCmd.infoCmds.date_l + 'T' + storeInfoCmd.infoCmds.heure_l),
                raisonDateLiv: storeInfoCmd.infoCmds.raisonDateLiv,
                code_cc: CC
            }
            storeInfoCmd.updateInfoCommande(infoCmd);
            closeDialog();
        }

        const totalTransfert = computed(() => {
            if (Array.isArray(storeLigne.ligneCommandes)) {
                return storeLigne.ligneCommandes.filter(item => item.coms.trim() === "*T*").length;
            } else {
                // Handle the case when storeLigne.ligneCommandes is not an array
                return 0; // or any appropriate value depending on your use case
            }
        });



        const imprimer = async (item) => {
            try {
                const response = await storePrint.generateReport(item.code_BP, 1);
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                window.open(url, '_blank');

                URL.revokeObjectURL(url);
            } catch (error) {
                console.error(error);
            }
        };



        // const selectedDateTimeFormatted = computed(() => {
        //     if (storeInfoCmd.infoCmds.date_liv != null) {
        //         const { dateTime } = useDateTime(storeInfoCmd.infoCmds.date_liv);
        //         return dateTime.value;
        //     } else {
        //         return "";
        //     }
        // });

        return {
            dialogVisible,
            headersLigne, headersSecondtable, titre_detail, storeLigne, fetchligneCommande,
            fetchDetailPreps, storePrep, storeInfoCmd, fetchInfoCmd, fetchAxes, storeAxe, fetchEnumCom, storeEnum
            , closeDialog,
            saveItem, onMounted, CC, success, imprimer, totalTransfert, detailPrep, ligneCmd, listAxe, axes

        }
    }
});
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;

    justify-content: space-between;

    overflow-y: auto;
}

.left {
    flex-basis: 70%;
}

.right {
    flex-basis: 30%;
}

/* .v-btn.v-btn--icon.v-theme--light.v-btn--density-default.v-btn--size-default.v-btn--variant-text {
  display: none;
}    */

.bold-divider {
    border-width: 3px;
    font-weight: bold;
    color: #E040FB;
}

.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc;
    white-space: nowrap;

}

.custom-header {
    background-color: blue lighten-2;
    /* Remplacez par votre couleur préférée */
}

.div1 {
    margin-bottom: -40px;
}
</style>