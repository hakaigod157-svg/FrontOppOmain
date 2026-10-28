<template>

    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <!-- <MyTabsAdv :StoreAdv="useEtapeStoreAdv"></MyTabsAdv> -->
                    <MyTabsSuivi :StoreAdv="useEtapeStoreAdv"></MyTabsSuivi>
                </v-card>
                <v-spacer></v-spacer>

                <div>
                    <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{ ip_server
                            }}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <u>Login</u> :&nbsp;<b><span style="color: #388E3C;">{{ user }}</span></b>
                </div>&nbsp;&nbsp;
                <div>
                    <span
                        :style="{ backgroundColor: isOnline ? 'green' : 'red', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }">
                    </span>
                </div>

                <div>
                    <v-btn @click="onHome">
                        <v-img :width="20" :src="require('@/assets/home.png')"></v-img>
                    </v-btn>
                </div>
            </v-app-bar>

            <v-main style="--v-layout-top: 40px" app>
                <v-card-actions density="compact">
                    <v-container class="light-background">
                        <v-row no-gutters class="d-flex align-center" style="flex-wrap: wrap;">
                            <v-col cols="auto">
                                <v-card-title density="compact">
                                    <MyTextField name_lab_text="Code Commande" v-model="codeCC"
                                        @input="convertToUpperCase" hint="ex:CC23108829" placeholder="CC"
                                        style="width: 130px; margin-right: 10px;">
                                    </MyTextField>
                                </v-card-title>
                            </v-col>

                            <v-col cols="auto">
                                <v-card-title density="compact">
                                    <MyTextField name_lab_text="Code Client" v-model="CodeCLT"
                                        @input="convertToUpperCase" placeholder="Code client"
                                        style="width: 130px; margin-right: 10px;">
                                    </MyTextField>
                                </v-card-title>
                            </v-col>

                            <v-col cols="auto">
                                <v-card-title density="compact">
                                    <MyTextField name_lab_text="Nom Client" v-model="nomClient"
                                        @input="convertToUpperCase" hint="ex: PHARMACIE" placeholder="Nom client"
                                        style="width: 145px; margin-right: 10px;">
                                    </MyTextField>
                                </v-card-title>
                            </v-col>

                            <v-col cols="auto">
                                <v-card-title density="compact">
                                    <MySelect label="Axe" :items="storeAxe.axes" variant="underlined"
                                        v-model="selectedAxe" style="width: 200px; margin-right: 10px;">
                                    </MySelect>
                                </v-card-title>
                            </v-col>

                            <v-col cols="auto">
                                <v-card-title density="compact">
                                    <v-autocomplete chips :items="listClients" item-title="clnom1" item-value="clcode"
                                        variant="underlined" label="Clients" density="compact" clearable hide-no-data
                                        hide-details color="primary" v-model="vClient" closable-chips
                                        style="width: 140px; margin-right: 10px;">
                                    </v-autocomplete>
                                </v-card-title>
                            </v-col>

                            <v-col cols="auto">
                                <div class="date-container">
                                    <span class="date-label"><b>Date Début</b></span>
                                    <v-card-title class="date-input">
                                        <v-text-field type="date" label="Date Livraison" v-model="dateDeb" single-line
                                            hide-details color="deep-purple-accent-4" density="compact" clearable
                                            style="width: 170px; margin-right: 10px;">
                                        </v-text-field>
                                    </v-card-title>
                                </div>
                            </v-col>

                            <v-col cols="auto">
                                <div class="date-container">
                                    <span class="date-label"><b>Date Fin</b></span>
                                    <v-card-title class="date-input">
                                        <v-text-field type="date" label="Date Livraison" v-model="dateFin" single-line
                                            hide-details color="deep-purple-accent-4" density="compact" clearable
                                            style="width: 170px; margin-right: 10px;">
                                        </v-text-field>
                                    </v-card-title>
                                </div>
                            </v-col>

                            <v-col cols="auto" class="d-flex align-center">
                                <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading"
                                    size="large" density="compact" style="margin-top: 16px;">Rechercher
                                </v-btn>
                            </v-col>

                            <div class="mr-12 ma-3">
                                <v-col>
                                    <v-btn size="small" @click="onExport" class="mx-auto">
                                        <v-img :width="25" :src="require('@/assets/excel.png')">
                                        </v-img>
                                    </v-btn>
                                </v-col>
                            </div>
                        </v-row>
                    </v-container>
                </v-card-actions>




                <div>
                    <v-card>
                        <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                            density="compact"></v-progress-linear>

                        <MyTableSuivi :headers="headers" :items="list" height="600" :search="nomClient"
                            class="dezoomed-table-container">
                        </MyTableSuivi>

                        <!-- <v-card style="width: 60%;">
                            <v-row>
                                <v-col>
                                    <v-sheet class="pl-2">
                                        <b> {{ 0 }}</b> Lignes Trouvées
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-card>  -->
                    </v-card>
                </div>

            </v-main>
        </v-app>
    </v-card>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import dayjs from 'dayjs'
import MyTextField from '@/components/MyTextField.vue';
import MyTabsSuivi from '@/components/etatcommande/MyTabsSuivi.vue';
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import MyTableSuivi from '@/components/etatcommande/MyTableSuivi.vue';
import { useEtatCommandeStore } from "@/store/SuiviCommande/etatCommande.js";
import { useAxeStore } from "@/store/utils/axe.js";
import { useClientStore } from "@/store/utils/client.js";
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

import MySelect from '@/components/MySelect.vue';

export default defineComponent({
    components: {
        MyTabsSuivi,
        MyTextField,
        MyTableSuivi,
        MySelect,
    },

    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },

    setup(props) {

        const isOnline = useOnline();
        const user = localStorage.getItem('username');
        const StoreAdv = useEtapeStoreAdv();
        const store = useEtatCommandeStore();
        const codeCC = ref('');
        const CodeCLT = ref('');
        const nomClient = ref('');
        const selectedAxe = ref('');
        const dateDeb = ref('');
        const dateFin = ref('');
        const list = ref([]);
        const loading = computed(() => store.loading);
        const storeAxe = useAxeStore();

        const storeClients = useClientStore();
        const listClients = ref([]);
        const ip_server = ref('');


        const convertToUpperCase = () => {
            codeCC.value = codeCC.value.toUpperCase();
            CodeCLT.value = CodeCLT.value.toUpperCase();
        };

        onMounted(async () => {
            const today = dayjs().format('YYYY-MM-DD');
            dateDeb.value = today;
            dateFin.value = today;
            list.value = [];
            listClients.value = [];
            await storeAxe.fetchAxe();
            await listClient();


            const name_server = localStorage.getItem('name_server');
            if (name_server === 'SIMUL221') {
                ip_server.value = '192.168.130.221';
            } else if (name_server === 'SIMUL220') {
                ip_server.value = '192.168.130.220';
            }
            else if (name_server === 'OPHAM') {
                ip_server.value = '192.168.130.2';
            } else {
                ip_server.value = name_server || 'Inconnu';
            }
        });


        const searchEvent = async () => {
            // console.log(codeCC.value)
            // console.log(CodeCLT.value)
            // console.log(nomClient.value)
            // console.log(selectedAxe.value)
            // console.log(dateDeb.value)
            // console.log(dateFin.value)

            listCC();

            // console.log(listCC())

        }

        const headers = [
            { title: 'CODE', align: 'start', key: 'code', sortable: true },
            { title: 'CODE CLIENT', align: 'center', key: 'code_client', sortable: true, width: '2%' },
            { title: 'NOM CLIENT', align: 'start', key: 'nom_client' },
            { title: 'AXE', align: 'start', key: 'axe' },
            { title: 'COMMANDE', align: 'start', key: 'commande' },
            { title: 'VALID_FACT', align: 'center', key: 'valid_fact' },
            { title: 'MODE', align: 'start', key: 'mode', value: 'mode' },
            { title: 'VALID_ADV', align: 'center', key: 'valid_adv', value: 'valid_adv' },
            { title: 'DEB_PREP', align: 'center', key: 'deb_prep', value: 'deb_prep' },
            { title: 'FIN_PREP', align: 'center', key: 'fin_prep', value: 'fin_prep' },
            { title: 'DEB_CTRL', align: 'center', key: 'deb_ctrl', value: 'deb_ctrl' },
            { title: 'FIN_CTRL', align: 'center', key: 'fin_ctrl', value: 'fin_ctrl' },
            { title: 'FIN_EMB', align: 'center', key: 'fin_emb', value: 'fin_emb' },
            { title: 'SORTIE_FACT', align: 'center', key: 'sortie_fact', value: 'sortie_fact' },
            { title: 'BON A LIVRER', align: 'center', key: 'bon_a_livree', value: 'bon_a_livree', width: '2%' },
            { title: 'ATTE BAL EXP', align: 'center', key: 'atte_bal_exp', width: '2%' },
            { title: 'BAL DEBLOQUE ADV ', align: 'center', key: 'date_bal_adv', width: '2%' },
            // { title: 'DATE ANNUL BAL ADV', align: 'center', key: 'date_annul_Bal_adv',width: '2%' },
            { title: 'COMMENTAIRE', align: 'start', key: 'commentaire', value: 'commentaire' },
            { title: 'COMMENTAIREMAG', align: 'start', key: 'commentaire_mag', value: 'commentaire_mag' },
            { title: 'SORTIE_OPHAM', align: 'center', key: 'sortie_opham', value: 'sortieopham' },
            { title: 'LIVRÉE PAR', align: 'start', key: 'livree_par', value: 'livree_par' },
            { title: 'VOITURE LIV', align: 'start', key: 'voiture_liv', value: 'voiture_liv' },
            { title: 'RETOUR LIV', align: 'center', key: 'retour_liv', value: 'retour_liv' },
        ];

        //Prend la valeur du variable d'entrée

        const listCC = async () => {
            list.value = [];
            await store.fetchEtatCommande(codeCC.value, CodeCLT.value, dateDeb.value, dateFin.value, selectedAxe.value)
            if (store.suiviCommandes.length > 0) {
                list.value = store.suiviCommandes;
            }

        }

        const listClient = async () => {
            await storeClients.fetchlListClient();
            listClients.value = storeClients.ListClients;

        };


        const onExport = () => {
            if (!list.value.length) {
                swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', swal.stopTimer);
                        toast.addEventListener('mouseleave', swal.resumeTimer);
                    }
                }).fire({
                    icon: 'error',
                    title: 'Impossible d\'exporter un élément vide',
                    background: '#FFF3E0',
                });
                return;
            }

            let dataToExport = [...list.value]; // Copier la liste
            const parsedData = dataToExport.map(item => ({
                CODE: item.code,
                CODE_CLIENT: item.code_client,
                NOM_CLIENT: item.nom_client,
                AXE: item.axe,
                COMMANDE: item.commande,
                VALID_FACT: formatDateTime(item.valid_fact),
                MODE: item.mode,
                VALIDE_ADV: formatDateTime(item.valid_adv),
                DEB_PREP: formatDateTime(item.deb_prep),
                FIN_PREP: formatDateTime(item.fin_prep),
                DEB_CTRL: formatDateTime(item.deb_ctrl),
                FIN_CTRL: formatDateTime(item.fin_ctrl),
                FIN_EMB: formatDateTime(item.fin_emb),
                SORTIE_FACT: formatDateTime(item.sortie_fact),
                BON_A_LIVRER: item.bon_a_livree,
                ATTE_BAL_EXP: formatDateTime(item.atte_bal_exp),
                BAL_DEBLOQUE_ADV: formatDateTime(item.date_bal_adv),
                DATE_ANNUL_BAL_ADV: formatDateTime(item.date_annul_Bal_adv),
                COMMENTAIRE: item.commentaire,
                COMMENTAIREMAG: item.commentaire_mag,
                SORTIE_OPHAM: formatDateTime(item.sortie_opham),
                LIVREE_PAR: item.livree_par,
                VOITURE_LIV: item.voiture_liv,
                RETOUR_LIV: formatDateTime(item.retour_liv),
            }));

            // console.log("Données décortiquées :", parsedData);
            exportToExcel(parsedData);
        };

        const exportToExcel = (data) => {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveExcelFile(excelBuffer, 'export Etat Commande.xlsx');
        };

        const saveExcelFile = (buffer, fileName) => {
            const data = new Blob([buffer], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        };

        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY HH:mm');
            } else {
                return '';
            }
        };


        return {
            isOnline, user,
            StoreAdv,
            headers, convertToUpperCase, searchEvent,
            codeCC, CodeCLT, nomClient, selectedAxe, dateDeb, dateFin, listCC, list, loading, storeAxe, listClients,
            onExport,ip_server,
        };

    }

})

</script>

<style>
.light-background {
    background-color: #eeeeee;
    padding: 20px;
    border-radius: 10px;
}

.date-container {
    display: flex;
    align-items: center;
}

.date-label {
    margin-right: 10px;
    /* Ajustez cette valeur selon vos besoins */
}

.date-input {
    flex: 1;
}

/* .dezoomed-table-container {
  width: 100%;
  overflow: auto;
}

.dezoomed-table-container > * {
  transform: scale(0.67);
  transform-origin: top left;
  width: 150%;
} */

/* .dezoomed-table-container tr:nth-child(even) {
  background-color: #ffffff;
}

.dezoomed-table-container tr:nth-child(odd) {
  background-color: #4088b8;
}  */
</style>