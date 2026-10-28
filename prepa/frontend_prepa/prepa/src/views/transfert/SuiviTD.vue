<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <TabsTrans></TabsTrans>
                </v-card>
                <v-spacer></v-spacer>
                <div>
                    <u>Login</u> :&nbsp;<b><span style="color: #388E3C;">{{ user }}</span></b>
                </div>&nbsp;&nbsp;
                <div>
                    <span
                        :style="{ backgroundColor: isOnline ? 'green' : 'red', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }"></span>
                </div>

                <div>
                    <v-btn @click="onHome">
                        <v-img :width="20" :src="require('@/assets/home.png')"></v-img>
                    </v-btn>
                </div>
            </v-app-bar>
            <v-main style="--v-layout-top: 40px" app>
                <v-row density="compact" class="pt-2 mt-0">
                    <v-col cols="12" sm="6" md="1" class="pl-5">
                        <MyTextField name_lab_text="Numéro TD/TS/TE" :rules="[rules.customFormat]" hide-details="auto"
                            v-model="codeTD" @input="convertToUpperCase" hint="ex:TD23082565" placeholder="TD23082565">
                        </MyTextField>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" density="compact">
                        <v-row density="compact">
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field v-model="dateDeb" type="date" label="Date Deb" hide-no-data hide-details
                                    variant="outlined" color="deep-purple-accent-4" density="compact"
                                    clearable></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="3">
                                <v-text-field v-model="dateFin" type="date" label="Date fin" hide-no-data hide-details
                                    variant="outlined" color="deep-purple-accent-4" density="compact"
                                    clearable></v-text-field>
                            </v-col>


                            <v-col cols="12" sm="6" md="3">
                                <MySelect comb_lab="Dépôt Orig" :items="depotCodes" v-model="depOrg"
                                    :disabled="loading">
                                </MySelect>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <MySelect comb_lab="Dépôt Dest" :items="depotCodes" v-model="depDest"
                                    :disabled="loading">
                                </MySelect>
                            </v-col>

                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <v-row density="compact">
                            <v-col cols="12" sm="6" md="3">
                                <Autocomplete :isUpdating="isUpdating" :items="items" v-model:search="search"
                                    v-model="select" :loading="loading" @updateSelect="handleSelectChange" />
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <small class="text-subtitle-1">{{ libelle }}</small>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-checkbox label="Avec Détail" v-model="vDetait" hide-details hide-no-data
                                    density="compact"></v-checkbox>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-select label="Etat" :items="etat" v-model="vEtat" :disabled="loading"
                                    density="compact" color='deep-purple-accent-4' item-title="name" item-value="id"
                                    hide-no-data item-color="primary" hide-details>
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" sm="6" md="1" class="pr-2">
                        <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading"
                            style="min-width: 125px" density="compact">Rechercher
                        </v-btn>
                        <v-btn variant="tonal" color="secondary" @click="onExport" :disabled="loading"
                            style="min-width: 125px; margin-top: 2px; margin-bottom: 2px" density="compact">Exporter
                        </v-btn>
                    </v-col>
                </v-row>
                <v-progress-linear v-if="loadings" color="#6200ee" rounded indeterminate height="5" density="compact">
                </v-progress-linear>
                <MyLoading :loading="chagmt" @close="chagmt = false" :articles="articles"></MyLoading>
                <router-view></router-view>

                <div style="height: 600px;">
                    <MyTable :headers="computedHeaders" :items="list" action2="Reimprimer" @action2Item="reimprimer"
                        :showNbLignes="true" :totalArticles="list.length" />
                </div>
                <searchArticle v-if="isSearch" :dialog="isSearch" @close="closeDialog" @getArticle="getArticleSearch">
                </searchArticle>
            </v-main>

        </v-app>
    </v-card>
</template>
<script>
import { ref, computed, onMounted, watch, onBeforeMount, defineComponent } from 'vue';
import { useOnline } from '@vueuse/core';
import TabsTrans from "@/components/transfert/TabsTrans.vue";
import { useRouter } from 'vue-router'
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js"
import MyTextField from '@/components/MyTextField.vue';
import Autocomplete from "@/components/MyAutocomplete.vue"
import MySelect from '@/components/MySelect.vue';
import dayjs from 'dayjs'
import MyTable from '@/components/MyTable.vue';
import { useDepotStore } from "@/store/utils/depot.js";
import { useSuiviTDStore } from "@/store/Transfert/suiviTD";
import searchArticle from "@/components/searchArticle.vue";
import useArticleSelection from "@/composables/useArticleSelection"
import { useReportBPStore } from "@/store/report/printBP";
import MyLoading from "@/components/Loading";
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';


export default defineComponent({
    components: {
        TabsTrans,
        MyTextField,
        Autocomplete,
        MySelect,
        searchArticle,
        MyTable,
        MyLoading
    },

    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },
    setup() {
        const isOnline = useOnline();
        const user = localStorage.getItem('username');
        const codeTD = ref('');
        const dateDeb = ref('');
        const dateFin = ref('');
        const storeDepot = useDepotStore();
        const depOrg = ref('');
        const depDest = ref('');
        const isSearch = ref(false);
        const dialog = ref(false);
        const store = useSuiviTDStore();
        const loadings = computed(() => store.loading);
        const isDepOrg = ref(false);
        const isDepDest = ref(false);
        const isDatedeb = ref(false);
        const isDatefin = ref(false);
        const storePrint = useReportBPStore();
        const chagmt = ref(false);
        const articles = ref('');
        const router = useRouter();
        useSessionTimeout(Config.DURRE_SESSION, router);
        const list = ref([]);
        const vEtat = ref(0);
        const vDetait = ref(false);
        const etat = [
            { id: 0, name: "Tous" },
            { id: 1, name: "EnAttente" },
            { id: 2, name: "Encours" },
            { id: 3, name: "Terminé" },
        ]

        const convertToUpperCase = () => {
            codeTD.value = codeTD.value.toUpperCase();
        };

        watch(vDetait, () => {
            list.value = []; // Vide la liste quand vDetait change
        });

        const computedHeaders = computed(() => {
            return vDetait.value === false ? headers_normal : headers;
        });



        onMounted(async () => {
            const today = dayjs().format('YYYY-MM-DD');
            dateDeb.value = today;
            dateFin.value = today;
            await storeDepot.fetchDepots(`isnull(DPLOC,0)<>0 and rtrim(ADNOMUSER)='${user}'`);
            list.value = [];
            listDT();
        });

        watch(vEtat, () => {
            listDT();
        });

        watch(vDetait, () => {
            listDT();
        });

        const rules = {
            customFormat: (value) => {
                if (!value) {
                    return true;
                }
                const regex = /^(TE|TS|TD)\d{8}$/;
                if (!value.match(regex)) {
                    return 'code invalid';
                }
                return true;
            },
        };

        const depotCodes = computed(() => {
            return storeDepot.depots.map(depot => depot.code);
        });
        const { isUpdating, items, search, select, loading, handleSelectChange, libelle } = useArticleSelection(isSearch);

        function closeDialog() {
            isSearch.value = false;
            dialog.value = false;
        }

        function getArticleSearch(item) {
            select.value = item.article;
            libelle.value = item.libelle;
            closeDialog();
        }


        const searchEvent = async () => {
            // console.log(dateDeb.value)
            if (dateDeb.value === null) {
                await swal.fire({
                    icon: "error",
                    title: "Date début est un champ obligatoire"
                });
            } else if (dateFin.value === null) {
                await swal.fire({
                    icon: "error",
                    title: "Date fin est un champ obligatoire"
                });
            }
            else {
                listDT();
            }

            console.log(listDT())

        }


        //headers sans cocher
        const headers_normal = [
            { title: 'CODE', align: 'center', key: 'code' },
            { title: 'DATE', align: 'center', key: 'date', },
            { title: 'DEP ORG', align: 'center', key: 'dep_org', },
            { title: 'DEP DEST', align: 'end', key: 'dep_dest' },
            { title: 'QUANTITE', align: 'end', key: 'qte' },
            { title: "NB LIGNE", align: 'end', key: 'nb_ligne' },
            { title: "DATE CREATION", align: 'start', key: 'date_entree' },
            { title: "ATTE DEB_PICK(mn)", align: 'center', key: 'duree_atte' },
            { title: "DEB PICKING", align: 'start', key: 'deb_picking' },
            { title: "FIN PICKING", align: 'start', key: 'fin_picking' },
            { title: "DUREE_PICK(mn)", align: 'center', key: 'duree' },
            { title: "ETAT", align: 'start', key: 'etat_picking' },
            { title: "USER PICKING", align: 'start', key: 'user_picking' },
            { title: 'ACTION', align: 'center', key: 'actions' },
        ];




        //headers Détail
        const headers = [
            { title: 'CODE', align: 'center', key: 'code' },
            { title: 'DATE', align: 'center', key: 'date', },
            { title: 'DEP ORG', align: 'center', key: 'dep_org', },
            { title: 'EMPL ORG', align: 'denter', key: 'empl_org' },
            { title: 'LIBELLE', align: 'start', key: 'libelle', minWidth: '300px' },
            { title: 'QUANTITE', align: 'end', key: 'qte' },
            { title: 'DEP DEST', align: 'end', key: 'dep_dest' },
            { title: 'EMPL DEST', align: 'center', key: 'empl_dest' },
            { title: 'COMMENTAIRE', align: 'start', key: 'commentaire' },
            // { title: 'MOTIF', align: 'start', key: 'depot_dest' },
            { title: "DATE CREATION", align: 'start', key: 'date_entree' },
            { title: "ATTE DEB_PICK(mn)", align: 'center', key: 'duree_atte' },
            // { title: "USER", align: 'start', key: 'users' },
            { title: "DEB PICKING", align: 'start', key: 'deb_picking' },
            { title: "FIN PICKING", align: 'start', key: 'fin_picking' },
            { title: "DUREE_PICK(mn)", align: 'center', key: 'duree' },
            { title: "ETAT", align: 'start', key: 'etat_picking' },
            { title: "USER PICKING", align: 'start', key: 'user_picking' },
            { title: 'ACTION', align: 'center', key: 'actions' },
        ];


        const listDT = async () => {
            list.value = [];
            // console.log(vDetait.value)
            if (vDetait.value) {
                await store.fetchSuiviTDDetail(codeTD.value, depOrg.value, depDest.value, dateDeb.value, dateFin.value, select.value, 1, vEtat.value)
                if (store.suiviTDs.length > 0) {
                    list.value = store.suiviTDs;
                }
            } else {
                await store.fetchSuiviTD(codeTD.value, depOrg.value, depDest.value, dateDeb.value, dateFin.value, select.value, 0, vEtat.value)
                if (store.suiviTDs.length > 0) {
                    list.value = store.suiviTDs;
                }
            }

        }

        const reimprimer = async (item) => {
            chagmt.value = true;
            articles.value = 'Impression en cours ' + item.code;
            const response = await storePrint.generateReportTD(item.code, depOrg.value, depDest.value, 1, localStorage.getItem('username'));
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            URL.revokeObjectURL(url);
            chagmt.value = false;
        }



        const onExport = () => {
            if (list.value.length === 0) {
                const Toast = swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    onOpen: (toast) => {
                        toast.addEventListener('mouseenter', swal.stopTimer);
                        toast.addEventListener('mouseleave', swal.resumeTimer);
                    }
                });

                Toast.fire({
                    icon: 'error',
                    title: 'Impossible d\'exporter un élément vide',
                    background: '#FFF3E0'
                });
                return;
            }

            // Exclure "action" des colonnes exportées
            const selectedHeaders = (vDetait.value ? headers : headers_normal).filter(h => h.key !== 'actions');

            const parsedData = list.value.map(item => {
                const row = {};

                selectedHeaders.forEach(h => {
                    const value = item[h.key];

                    if (h.key === 'date') {
                        row[h.title] = value
                            ? dayjs(value).format('DD/MM/YYYY')
                            : '';
                    } else if (['date_entree', 'deb_picking', 'fin_picking'].includes(h.key)) {
                        row[h.title] = value
                            ? dayjs(value).format('DD/MM/YYYY HH:mm:ss')
                            : '';
                    } else {
                        row[h.title] = value ?? '';
                    }
                });

                return row;
            });

            exportToExcel(parsedData);
        };




        const exportToExcel = (data) => {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveExcelFile(excelBuffer, 'export.xlsx');
        };

        const saveExcelFile = (buffer, fileName) => {
            const data = new Blob([buffer], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        };


        return {
            isOnline, user, codeTD, convertToUpperCase, dateDeb, dateFin, depotCodes, depOrg, depDest,
            isUpdating, items, search, select, loading, libelle, handleSelectChange, isSearch, dialog,
            getArticleSearch, closeDialog, searchEvent, store, headers, headers_normal, computedHeaders, listDT, loadings, isDepOrg, isDepDest, isDatedeb, isDatefin,
            reimprimer, chagmt, articles, rules, list, etat, vEtat, vDetait,
            exportToExcel, onExport,
        };
    },
});
</script>
