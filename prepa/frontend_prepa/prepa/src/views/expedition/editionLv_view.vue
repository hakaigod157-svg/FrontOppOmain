<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabsExped></MyTabsExped>
                </v-card>
                <v-spacer></v-spacer>

                <div>
                    <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{
                        ip_server }}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;

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
                <v-container fluid class="pt-2 mt-0">
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-row density="compact" align="center" justify="start" class="px-3" no-gutters
                                style="padding-top: 10px;">
                                <v-col cols="auto" class="px-2 d-flex align-center justify-start">
                                    <v-btn variant="tonal" color="secondary" density="compact" @click="onNewLv"
                                        style="min-width: 92px; height: 32px;">
                                        Params Voiture
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <div style="height: 58px;"></div>
                            <div style="width: 100%; overflow-x: auto;" color="#2c3640" class="mt-2 p-0">
                                <v-progress-linear v-if="loadings" color="primary" rounded indeterminate height="3"
                                    density="compact"></v-progress-linear>
                                <MyTable :headers="headersSit" :items="listSit" action2="Livrer" style="width:100%;"
                                    @action2Item="onLivre" @action3Item="detLivraison" @action4Item="detControle"
                                    @action5Item="detFacture" @action6Item="detPreparation" color2="#63D5F8" />
                            </div>

                            <v-card density="compact">
                                <v-card>
                                    <v-row>
                                        <v-col>
                                            <v-sheet class="pl-2 custom-grey">
                                                <b> {{ totalArticlesSit }}</b> Lignes Trouvées
                                            </v-sheet>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="8">
                            <v-row density="compact" align="center" justify="start" class="px-3" no-gutters
                                style="padding-top: 10px;">
                                <!-- Code Livraison -->
                                <v-col cols="auto" class="px-1">
                                    <v-text-field v-model="codeLivraison" label="Code Livraison" variant="outlined"
                                        hide-no-data @input="convertToUpperCase" placeholder="LV25100251"
                                        density="compact" :rules="[rules.customFormat]" hide-details clearable
                                        style="width: 160px" />
                                </v-col>

                                <!-- Date Livraison -->
                                <v-col cols="auto" class="px-1">
                                    <v-text-field v-model="dateLivraison" type="date" label="Date Livraison"
                                        hide-no-data variant="outlined" density="compact" hide-details
                                        style="width: 150px" />
                                </v-col>

                                <!-- Groupe Radio Saisie -->
                                <v-col cols="auto" class="px-1 d-flex align-center">
                                    <div class="d-flex align-center" style="gap: 6px;">
                                        <span class="text-subtitle-2 font-weight-medium"
                                            style="margin-bottom: 3px;">Saisie
                                            :</span>
                                        <div class="radio-border-box">
                                            <v-radio-group v-model="saisie" inline density="compact" hide-details
                                                hide-no-data class="mb-0">
                                                <v-radio label="Oui" :value="0" />
                                                <v-radio label="Non" :value="1" />
                                                <v-radio label="Tous" :value="null" />
                                            </v-radio-group>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row density="compact" align="center" justify="start" class="px-3" no-gutters
                                style="padding-top: 10px;">
                                <!-- Chauffeur -->
                                <v-col cols="auto" class="px-1">
                                    <v-text-field v-model="chauffeur" label="Chauffeur" variant="outlined" hide-no-data
                                        density="compact" hide-details clearable style="width: 160px" />
                                </v-col>

                                <!-- Voiture -->
                                <v-col cols="auto" class="px-1">
                                    <v-text-field v-model="voiture" label="Voiture" variant="outlined" density="compact"
                                        hide-no-data hide-details clearable style="width: 150px" />
                                </v-col>

                                <!-- N° Commande -->
                                <v-col cols="auto" class="px-1">
                                    <v-text-field v-model="numCommande" label="N° Commande" variant="outlined"
                                        density="compact" @input="convertToUpperCaseCC" placeholder="CC25110568"
                                        hide-no-data :rules="[rules.customFormatCC]" hide-details clearable
                                        style="width: 160px" />
                                </v-col>

                                <!-- Bouton rechercher -->
                                <v-col cols="auto" class="px-2 d-flex align-center justify-end ml-auto">
                                    <v-btn variant="tonal" color="primary" density="compact" @click="searchEvent"
                                        style="min-width: 110px; height: 36px;">
                                        Rechercher
                                    </v-btn>
                                </v-col>
                            </v-row>

                            <div style="width: 100%; height: 620px; overflow-x: auto; overflow-y: auto;" color="#2c3640"
                                class="mt-2 p-0">
                                <v-progress-linear v-if="loadings" color="primary" rounded indeterminate height="3"
                                    density="compact"></v-progress-linear>
                                <MyTable :headers="headers" :items="list" action2="Imprimer" @onSaisir="onSaisir"
                                    :fixed-header="true" style="width:100%;" @onAjoutCommande="onAjoutCommande"
                                    @action2Item="imprimer" :showAction1="false" />
                            </div>
                            <v-card density="compact">
                                <v-card>
                                    <v-row>
                                        <v-col>
                                            <v-sheet class="pl-2 custom-grey">
                                                <b> {{ totalArticles }}</b> Lignes Trouvées
                                            </v-sheet>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
                <v-snackbar v-model="snackbar" :timeout="1800" class="text-center" location="center" stacked>
                    <strong class="font-weight-medium">{{ text }}</strong>

                    <template #actions>
                        <v-btn color="red" variant="text" @click="snackbar = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                </v-snackbar>
                <MyLoading :loading="chagmt" @close="chagmt = false" :articles="articles"></MyLoading>

                <MySaisiLV v-if="drawer" :editedItem="editedItem" :drawer="drawer" @close="drawer = false"
                    @onValide="onValideNew" />
                <addCmdLv v-if="drawerAdd" :editedItem="editedItemAdd" :drawer="drawerAdd" @close="drawerAdd = false"
                    @onValide="onValideAdd" />
                <createLV v-if="drawerCre" :editedItem="editedItemCre" :drawer="drawerCre" @close="drawerCre = false"
                    @onValide="onValideCre" />

                <DetailLV v-if="detailLV" :detailLV="detailLV" :params="detailParams" @close="onCloseDetail" />
                <voitureChauf v-if="drawerVoit"  :drawer="drawerVoit" @close="drawerVoit = false"
                    @onValide="onValideVoit" />
            </v-main>
        </v-app>
    </v-card>
</template>
<script>
import { defineComponent, ref, computed, onMounted, watch, onBeforeMount } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import useSessionTimeout from '@/utils/useSessionTimeout';
import MyTextarea from '@/components/MyTextarea.vue';
import swal from 'sweetalert2';
import dayjs from 'dayjs'
import MyTabsExped from '@/components/expedition/MytabsExped.vue';
import MyTable from '@/components/expedition/MyTable.vue';

import Config from "@/utils/config.js"
import { useFactTransStore } from "@/store/Expedition/facTrans.js";
import { useReportLVStore } from "@/store/report/printLV.js";
import MyLoading from "@/components/Loading";
import MySaisiLV from "./saisir_Lv.vue"
import addCmdLv from "./addCmdLv.vue";
import createLV from "./create_Lv.vue";
import DetailLV from "./detail_LV_view.vue";
import voitureChauf from "./voitureChauf.vue";

export default defineComponent({
    components: {
        MyTabsExped,
        MyTable,
        MyTextarea,
        MyLoading,
        MySaisiLV,
        addCmdLv,
        createLV,
        DetailLV,
        voitureChauf
    },


    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },

    setup(props) {

        const isOnline = useOnline();
        const saisie = ref(null)
        const user = localStorage.getItem('username');
        const router = useRouter();
        useSessionTimeout(Config.DURRE_SESSION, router);
        const dateLivraison = ref();
        const codeLivraison = ref(null);
        const chauffeur = ref(null);
        const list = ref([]);
        const listSit = ref([]);
        const voiture = ref(null);
        const numCommande = ref(null);
        //Tsy code client no raisin'ity fa lasa CC
        const store = useFactTransStore();
        const storePrint = useReportLVStore();
        const chagmt = ref(false);
        const articles = ref('');
        const editedItem = ref(null);
        const editedItemAdd = ref(null);
        const editedItemCre = ref(null);
        const axe = ref(null);
        const drawer = ref(false);
        const drawerCre = ref(false);
        const detailLV = ref(false);
        const drawerAdd = ref(false);
        const drawerVoit = ref(false);
        const loadings = computed(() => store.loading);
        const ip_server = ref('');
        const snackbar = ref(false)
        const text = ref("")
        const headers = [
            { title: ' ACTIONS', align: 'center', key: 'actions', value: 'actions', width: '1%' },
            { title: 'CODE LIV', align: 'center', key: 'liv_code' },
            { title: 'DATE LIV', align: 'center', key: 'liv_sortie' },
            { title: 'COMMANDE', align: 'start', key: 'liv_com' },
            { title: 'SORTIE', align: 'center', key: 'sortie_sec' },
            { title: 'RETOUR', align: 'center', key: 'ret_vehicule' },
            // { title: 'DUREE', align: 'end', key: 'duree' },
            //  { title: 'CHAUFFEUR', align: 'center', key: 'liv_chauf' },
            { title: 'VOITURE', align: 'center', key: 'liv_voit' },
            { title: 'SAISIE', align: 'center', key: 'saisie' },
            { title: 'AXE', align: 'center', key: 'liv_axe' },
            // { title: 'LIVREUR', align: 'center', key: 'liv_livreur' },         
            { title: 'REMPLI(%)', align: 'center', key: 'livrempli' },
        ]

        const headersSit = [
            { title: 'ACTION', align: 'center', key: 'actions', width: "2%" },
            { title: 'MODE', align: 'start', key: 'm_modeliv', width: "20%" },
            { title: 'AXE', align: 'start', key: 'm_axe', width: "20%" },
            { title: 'LIV', align: 'end', key: 'm_liv', minWidth: '20px' },
            { title: 'FACT', align: 'end', key: 'm_fact', minWidth: '20px' },
            { title: 'CTRL', align: 'end', key: 'm_ctrl', minWidth: '20px' },
            { title: 'PREP', align: 'end', key: 'm_prep', minWidth: '20px' },
        ]


        onMounted(async () => {
            const today = dayjs().format('YYYY-MM-DD');
            dateLivraison.value = today;
            await searchEvent();
            // await list_a_valider();
        })

        watch([saisie, dateLivraison], () => {
            searchEvent();
        });

        const onValideNew = async () => {
            await searchEvent();
        }
        const onValideAdd = async () => {
            await searchEvent();
        }

        const onValideCre = async () => {
            await searchEvent();
        }

        const searchEvent = async () => {
            list.value = [];

            if (dateLivraison.value == null || dateLivraison.value == '') {
                const Toast = swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    onOpen: (toast) => {
                        toast.addEventListener('mouseenter', swal.stopTimer)
                        toast.addEventListener('mouseleave', swal.resumeTimer)
                    }
                });

                Toast.fire({
                    icon: 'warning',
                    title: 'Veuillez presiser la date'
                });
            } else {
                listSit.value = [];
                list.value = [];
                await store.fetchEditionLv(codeLivraison.value, numCommande.value, dateLivraison.value, chauffeur.value, voiture.value, saisie.value);
                list.value = store.listLv;
                await store.fetchSituationCmdAxe();
                listSit.value = store.listSituationCmdAxe;
            }
        }


        const convertToUpperCase = () => {

            codeLivraison.value = codeLivraison.value.toUpperCase();

        };
        const convertToUpperCaseCC = () => {

            numCommande.value = numCommande.value.toUpperCase();

        };


        const rules = {
            customFormat: (value) => {
                if (!value) {
                    return true;
                }
                const regex = /^(LV)\d{8}$/;
                if (!value.match(regex)) {
                    return 'code invalid';
                }
                return true;
            },
            customFormatCC: (value) => {
                if (!value) {
                    return true;
                }
                const regex = /^(CC)\d{8}$/;
                if (!value.match(regex)) {
                    return 'code invalid';
                }
                return true;
            },

        };

        const onAjoutCommande = async (item) => {
            editedItemAdd.value = item;
            drawerAdd.value = true;
        }

        const onSaisir = async (item) => {
            editedItem.value = item;
            drawer.value = true;
        }
        const onLivre = async (item) => {
            if (item.m_liv > 0) {
                editedItemCre.value = item;
                drawerCre.value = true;
            } else {
                showMsg("Aucune commande en attente de livraison");
            }
        }

        const detailParams = ref({
            mode: null,
            axe: null,
            sit_com: null
        });

        const detLivraison = async (item) => {
            detailParams.value = {
                mode: item.m_modeliv,
                axe: item.m_axe,
                sit_com: 'LIVRAISON'
            };

            detailLV.value = true;
        }

        const detControle = async (item) => {
            detailParams.value = {
                mode: item.m_modeliv,
                axe: item.m_axe,
                sit_com: 'CONTROLE'
            };

            detailLV.value = true;
        }

        const detFacture = async (item) => {
            detailParams.value = {
                mode: item.m_modeliv,
                axe: item.m_axe,
                sit_com: 'FACTURE'
            };

            detailLV.value = true;
        }

        const detPreparation = async (item) => {
            detailParams.value = {
                mode: item.m_modeliv,
                axe: item.m_axe,
                sit_com: 'PREPARATION'
            };

            detailLV.value = true;
        }

        const onNewLv = async () => {
            drawerVoit.value = true;
        }

        const imprimer = async (item) => {
            try {
                chagmt.value = true;
                articles.value = 'Impression du ' + item.liv_code;

                let response; // pas "const response = null"


                if (item.inc1 === 1) {
                    response = await storePrint.generateReportLV(item.liv_code);
                } else {
                    response = await storePrint.generateReportCourse(item.liv_code);
                }

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Erreur lors de l’impression :', error);
            } finally {
                chagmt.value = false;
            }
        };

        onBeforeMount(async () => {
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
        })

        const onCloseDetail = () => {
            detailLV.value = false;
            searchEvent(); // 🔥 refresh ici
        };

        const totalArticles = computed(() => {
            return list.value.length;
        });

        const totalArticlesSit = computed(() => {
            return listSit.value.length;
        });
        const showMsg = (msg) => {
            text.value = msg;
            snackbar.value = true;
        };

        return {
            headers, isOnline, user, list, dateLivraison, saisie, chauffeur, voiture, numCommande, onAjoutCommande, onSaisir,
            searchEvent, codeLivraison, convertToUpperCase, rules, convertToUpperCaseCC, imprimer, chagmt, articles, editedItem, drawer, onValideNew,
            editedItemAdd, drawerAdd, onValideAdd, headersSit, listSit, drawerCre, onLivre, editedItemCre, onNewLv,
            loadings, onValideCre, ip_server,
            detLivraison, detControle, detFacture, detPreparation, totalArticles, totalArticlesSit,
            detailLV, detailParams, snackbar, text,drawerVoit,
            onCloseDetail,


        };
    },
})
</script>

<style></style>