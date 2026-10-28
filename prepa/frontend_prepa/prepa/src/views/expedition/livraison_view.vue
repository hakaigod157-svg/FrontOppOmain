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
            <v-main :class="{ 'blur-effect': dialogDetail || dialogEncours || dialogDetail_ind }"
                style="--v-layout-top: 40px; overflow-x: hidden;" app>
                <div class="pa-4">
                    <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact"></v-progress-linear>

                    <!--  ATTENTE LIVRAISON  -->
                    <v-row dense>
                        <!-- COLONNE GAUCHE (A Livrer + Indicateur en bas) -->
                        <v-col cols="12" md="7">
                            <v-row dense>
                                <!-- A LIVRER -->
                                <v-col cols="12">
                                    <v-card class="pa-1 elevation-2 card-exped" style="min-height: 370px;">
                                        <!-- <v-sheet class="pa-1 text-primary font-weight-bold text-center">
                                            <span style="margin-right: 6px;">
                                                <v-btn variant="outlined" density="compact">ALL</v-btn>
                                            </span>

                                            🚚 A LIVRER ({{ totalSum_Atte_livraison }} commandes )
                                        </v-sheet> -->

                                        <v-sheet class="pa-1 d-flex align-center text-primary font-weight-bold">
                                            <!-- <v-btn variant="outlined" density="compact" class="mr-2"
                                                @click="filtre = 'ALL'">
                                                {{ formatDate(date_today?.[0]?.date_today) }} <b>({{count_liv_today}} cdes)</b>
                                            </v-btn> -->
                                            <v-btn :color="filtre === 'ALL' ? 'green' : ''"
                                                :variant="filtre === 'ALL' ? 'flat' : 'outlined'" density="compact"
                                                class="mr-2" @click="filtre = 'ALL'">
                                                {{ formatDate(date_today?.[0]?.date_today) }}
                                                &nbsp;
                                                <b>({{ count_liv_today }})</b>
                                            </v-btn>

                                            <v-btn v-if="hasDemain" :color="filtre === 'DEMAIN' ? 'green' : ''"
                                                :variant="filtre === 'DEMAIN' ? 'flat' : 'outlined'" density="compact"
                                                class="mr-2" @click="filtre = 'DEMAIN'">
                                                {{ formatDate(date_demain?.[0]?.date_demain) }}
                                                &nbsp;
                                                <b>({{ count_liv_demain }})</b>
                                            </v-btn>
                                            <div class="flex-grow-1 text-center">
                                                🚚 A LIVRER ({{ totalSum_Atte_livraison }} commandes)
                                            </div>
                                        </v-sheet>

                                        <!-- <MyTableExped v-if="!loading" class="compact-table" :headers="headers"
                                            @onDetail="(data) => onDetail({ ...data, situation: 'ATTENTE_LIVRAISON' })"
                                            :items="list_liv" :hasPassBalGlobal="hasAnyPassBal" /> -->

                                        <MyTableExped v-if="!loading" class="compact-table" :headers="headers"
                                            @onDetail="(data) => onDetail({ ...data, situation: 'ATTENTE_LIVRAISON', mode: filtre })"
                                            :items="itemsAffiches" :hasPassBalGlobal="hasAnyPassBal" />
                                    </v-card>
                                </v-col>

                                <!-- INDICATEUR (EN BAS DE A LIVRER) -->
                                <v-col cols="12">
                                    <v-card class="pa-1 elevation-2 card-exped" style="min-height: 405px;">
                                        <v-sheet class="pa-1 text-primary font-weight-bold text-center">
                                            📊 Indicateur
                                        </v-sheet>

                                        <MyTableExped v-if="!loading" class="compact-table"
                                            :headers="headers_indicateur" :items="list_liv_ind"
                                            @onDetail_ind="(data) => onDetail_liv({ ...data })" />
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>

                        <!-- COLONNE DROITE (INDICATEUR CHAUFFEUR) -->
                        <v-col cols="12" md="5">
                            <v-card class="pa-1 elevation-2" style="min-height: 995px;">
                                <v-sheet class="pa-1 text-primary font-weight-bold text-start">
                                    <span class="bg_dispo" style="margin-right: 6px;">
                                        {{ nbDispo }} DISPO
                                    </span>
                                    &nbsp;
                                    <span class="bg_livr" style="margin-right: 6px;">
                                        {{ nbLivr }} LIVRAISONS
                                    </span>
                                    &nbsp;
                                    <span class="bg_miss" style="margin-right: 6px;">
                                        {{ nbMiss }} MISSION /COURSE
                                    </span>

                                    <span style="margin-left: 250px;">
                                        {{ nbTotal_Tournee }} TOURNÉE
                                        <span class="bg_nbVoit">({{ nbVoit }} voitures)</span>
                                    </span>
                                </v-sheet>

                                <div style="max-height: 800px;">
                                    <MyTableExped v-if="!loading" class="compact-table-indChauff"
                                        :headers="headers_indicateur_chauff" :items="list_liv_chauff" fixed-header />
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- ✅ DIALOG POUR LES DÉTAILS -->
                    <!-- <v-dialog v-if='dialogEncours' v-model="dialogEncours" max-width="1500" :persistent="true">
                        <v-card>
                            <v-card-title class="text-h6 font-weight-bold text-primary">
  
                                <v-btn icon variant="tonal" size="x-small" color="red-lighten-1"
                                    class="position-absolute"
                                    style="top: 8px; right: 8px; z-index: 10; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);"
                                    @click="dialogEncours = false">
                                    <v-icon size="12">mdi-close</v-icon>
                                </v-btn>
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>

                                <v-row dense class="mt-4">
                                    <v-col cols="12" md="6">
                                        <v-card class="pa-1 elevation-2 card-exped" style="min-height: 337px;">
                                            <v-sheet class="pa-1 text-primary font-weight-bold text-center">
                                                ⚙️ Préparation ({{ totalSum_prepa }} commandes)
                                            </v-sheet>
                                            <div class="table-container">
                                                <MyTableExped v-if="!loading" class="compact-table" :headers="headers"
                                                    :items="type_prepa" height="350" />
                                            </div>
                                        </v-card>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-card class="pa-1 elevation-2 card-exped"
                                            style="min-height: 337px;min-width: 700px;">
                                            <v-sheet class="pa-1 text-primary font-weight-bold text-center">
                                                📦 Contrôle ({{ totalSum_ctrl }} commandes)
                                            </v-sheet>
                                            <div class="table-container">
                                                <MyTableExped v-if="!loading" class="compact-table" :headers="headers"
                                                    :items="type_ctrl" height="350" width="850px" />
                                            </div>
                                        </v-card>
                                    </v-col>
                                </v-row>


                                <v-row justify="center" class="mt-4">
                                    <v-col cols="12" md="6">
                                        <v-card class="pa-1 elevation-2 card-exped"
                                            style="min-height: 337px; min-width: 700px;">
                                            <v-sheet class="pa-1 text-primary font-weight-bold text-center">
                                                🧾 Facture ({{ totalSum_facture }} commandes)
                                            </v-sheet>
                                            <div class="table-container">
                                                <MyTableExped v-if="!loading" class="compact-table" :headers="headers"
                                                    :items="type_facture" height="350" width="850px" />
                                            </div>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="#D50000" variant="outlined" @click="dialogEncours = false">
                                    Fermer
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog> -->

                    <v-dialog v-if="dialogDetail" v-model="dialogDetail" :persistent="true" width="1400px">
                        <detail_view @annuler="onAnnulerNew" @save="onSave" :detail-data="detailItem" height="460px" />
                    </v-dialog>

                    <v-dialog v-if="dialogDetail_ind" v-model="dialogDetail_ind" :persistent="true" width="1750px">
                        <detail_ind_view @annuler="onAnnuler_ind" @save="onSave" :detail-data="detailItem_ind"
                            height="460px" />
                    </v-dialog>

                </div>
            </v-main>
        </v-app>
    </v-card>
</template>
<script>
import { defineComponent, ref, computed, onMounted, onUnmounted, onBeforeMount } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import MyTextarea from '@/components/MyTextarea.vue';
import { useValidationCommandeStore } from "@/store/Adv/adv.js";
import Swal from 'sweetalert2';
import { useEtapeAdv } from "@/store/Adv/etape.js"
import MyTabsExped from '@/components/expedition/MytabsExped.vue';
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";
import MyTableExped from '@/components/expedition/MyTableExped.vue';
import { useLivraisonStore } from "@/store/Expedition/livraison.js";
import detail_view from '@/views/expedition/detail_view.vue';
import detail_ind_view from '@/views/expedition/detail_ind_view.vue';
import dayjs from 'dayjs';


export default defineComponent({
    components: {
        MyTableExped,
        MyTextarea,
        MyTabsExped,
        detail_view,
        detail_ind_view,
    },

    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },

    setup(props) {

        const isOnline = useOnline();
        const router = useRouter();
        useSessionTimeout(Config.DURRE_SESSION, router);
        const user = localStorage.getItem('username');
        const storeLivraison = useLivraisonStore();
        const loading = computed(() => storeLivraison.loading)
        const list = ref([]);

        const list_liv = ref([]);
        const list_liv_demain = ref([]);
        const date_today = ref([]);
        const date_demain = ref([]);
        const detail_liv_demain = ref([]);
        const list_liv_ind = ref([]);
        const list_liv_ind_detail = ref([]);
        const list_liv_chauff = ref([]);
        const list_liv_ind_obj = ref([]);

        const type_ctrl = ref([]);
        const type_prepa = ref([]);
        const type_facture = ref([]);
        const type_encours_totals = ref([]);
        const type_atte_livraison = ref([]);
        const detail_liv = ref([]);
        const ip_server = ref('');

        const dialogDetail = ref(false);
        const dialogDetail_ind = ref(false);

        // const headers = [
        //     { title: 'VAGUE', align: 'start', key: 'vague', sortable: false },
        //     { title: 'HEURE', align: 'start', key: 'heure', sortable: false },
        //     // { title: 'TYPE', align: 'start', key: 'type', sortable: false },
        //     { title: 'CENTRE', align: 'center', key: 'centre', sortable: false },
        //     { title: 'EST', align: 'center', key: 'est', sortable: false },
        //     { title: 'ITAOSY', align: 'center', key: 'itaosy', sortable: false },
        //     { title: 'IVATO', align: 'center', key: 'ivato', sortable: false },
        //     { title: 'NORD', align: 'center', key: 'nord', sortable: false },
        //     { title: 'SIXSEPT', align: 'center', key: 'sixsept', sortable: false },
        //     { title: 'SUD', align: 'center', key: 'sud', sortable: false },
        //     { title: 'SUD EST', align: 'center', key: 'sud_est', sortable: false },
        //     { title: 'TOTAL', align: 'center', key: 'total', sortable: false },
        // ]

        const headers = [
            { title: 'VAGUE', align: 'start', key: 'vague', sortable: false, width: '2px' },
            // { title: 'HEURE', align: 'center', key: 'heure', sortable: false ,width:'3px' },
            { title: 'SANS_AXE', align: 'center', key: 'sans_axe_cde', sortable: false, width: '3px' },
            { title: 'ANOSY', align: 'center', key: 'anosy_cde', sortable: false, width: '3px' },
            { title: 'CENTRE', align: 'center', key: 'centre_cde', sortable: false, width: '3px' },
            { title: 'EST_METEO', align: 'center', key: 'est_meteo_cde', sortable: false, width: '3px' },
            { title: 'EST_RN2', align: 'center', key: 'est_rn2_cde', sortable: false, width: '3px' },
            { title: 'ITAOSY', align: 'center', key: 'itaosy_cde', sortable: false, width: '2px' },
            { title: 'ITAOSY_RN1', align: 'center', key: 'itaosy_rn1_cde', sortable: false, width: '3px' },
            { title: 'IVATO', align: 'center', key: 'ivato_cde', sortable: false, width: '3px' },
            { title: 'MAHITSY_RN4', align: 'center', key: 'mahitsy_rn4_cde', sortable: false, width: '3px' },
            { title: 'NORD', align: 'center', key: 'nord_cde', sortable: false, width: '3px' },
            { title: 'SIXSEPT', align: 'center', key: 'sixsept_cde', sortable: false, width: '3px' },
            { title: 'SUD', align: 'center', key: 'sud_cde', sortable: false, width: '3px' },
            { title: 'SUD_EST', align: 'center', key: 'sud_est_cde', sortable: false, width: '3px' },
            { title: 'TOTAL', align: 'center', key: 'total_cde', sortable: false, width: '2px' },
        ]

        const headers_indicateur = computed(() => [
            { title: 'VAGUE', align: 'start', key: 'vague_ind', sortable: false, width: '2px' },
            { title: 'TOTAL CDE', align: 'center', key: 'total_cde_ind', sortable: false, width: '3px' },
            { title: 'PREPA', align: 'center', key: 'prepa', sortable: false, width: '3px' },
            { title: 'CTRL', align: 'center', key: 'ctrl', sortable: false, width: '3px' },
            { title: 'FACTURE', align: 'center', key: 'facture', sortable: false, width: '3px' },
            { title: 'LIVRAISON', align: 'center', key: 'livraison', sortable: false, width: '3px' },
            { title: 'LIVRÉ', align: 'center', key: 'livre', sortable: false, width: '2px' },
            { title: 'LIVRÉ HIER', align: 'center', key: 'livraison_hier', sortable: false, width: '2px' },
            { title: `LIVRAISON_OK (OBJ ->${list_liv_ind_obj.value[0]?.obj || 0}%)`, align: 'center', key: 'livraison_ok', sortable: false, width: '3px' },
        ])

        // const headers_indicateur_chauff = [
        //     { title: 'CHAUFFEUR', align: 'start', key: 'xchauff', sortable: false, width: '3px' },
        //     { title: 'NUM VOIT', align: 'start', key: 'xnum_voit', sortable: false, width: '2px' },
        //     { title: 'TYPE', align: 'start', key: 'xtype', sortable: false, width: '3px' },
        //     { title: 'DISPO', align: 'center', key: 'xdispo', sortable: false, width: '3px' },
        //     { title: 'TOURNE 1', align: 'center', key: 'tourne_1', sortable: false, width: '3px' },
        //     { title: 'TOURNE 2 ', align: 'center', key: 'tourne_2', sortable: false, width: '3px' },
        //     { title: 'TOURNE 3', align: 'center', key: 'tourne_3', sortable: false, width: '2px' },
        // ]
        const headers_indicateur_chauff = ref([]);
        const modeLiv = 'OPHAM'
        const date_deb = null;
        const date_fin = null;

        const listLivraison = async () => {
            await storeLivraison.fetchListLivraison(modeLiv);
            await storeLivraison.fetchListIndLivraison(date_deb, date_fin, modeLiv);

            list_liv.value = storeLivraison.list_livraisons;
            detail_liv.value = storeLivraison.details;
            list_liv_ind.value = storeLivraison.list_Indlivraisons;
            list_liv_ind_detail.value = storeLivraison.list_Indlivraison_details;
            list_liv_ind_obj.value = storeLivraison.list_IndObjs;

            list_liv_demain.value = storeLivraison.list_livraisons_demain;
            detail_liv_demain.value = storeLivraison.details_demain;

            date_today.value = storeLivraison.date_todays;
            date_demain.value = storeLivraison.date_demains;

            // console.log(date_today.value)
            // console.log(date_demain.value)

            headers_indicateur_chauff.value = [];
            list_liv_chauff.value = [];

            await storeLivraison.onIndicatChauf();

            const headers = storeLivraison.HeadersChauf ?? [];
            const data = storeLivraison.resultData ?? [];

            if (headers.length && data.length) {

                // 🔥 on enlève DEPUIS + DUREE UNIQUEMENT dans headers
                const filteredHeaders = headers.filter(h =>
                    h !== "DEPUIS" && !h.includes("DUREE") && h !== "xNUM_VOIT" && h !== "xDISPO" && h !== "NON_SORTIE_SEC" && h !== "NB_TOTAL"
                    && h !== "TOURNE_1_OBJ" && h !== "TOURNE_2_OBJ" && h !== "TOURNE_3_OBJ" && h !== "TOURNE_4_OBJ" && h !== "TOURNE_5_OBJ"
                    && h !== "TOURNE_6_OBJ"
                );

                headers_indicateur_chauff.value = filteredHeaders.map(h => ({
                    title: h,
                    key: h,
                    align: (h === "TOURNE_1" || h === "TOURNE_2" || h === "TOURNE_3" || h === "TOURNE_4 " || h === "TOURNE_5 " || h === "TOURNE_6 ") ? "center" : "start",
                    // width: h === "CHAUFFEUR" ? "140px" : undefined,
                    width: (h === "CHAUFFEUR" || h === "VOITURE") ? "140px" : undefined,
                }));
                list_liv_chauff.value = data;
            }


        };

        let intervalId = null;

        onMounted(async () => {
            await listLivraison()  // chargement initial

            // actualisation toutes les 1 minute (60000 ms)
            intervalId = setInterval(async () => {
                await listLivraison();
            }, 180000); // 3 minutes

        })

        onUnmounted(() => {
            if (intervalId) {
                clearInterval(intervalId)
                intervalId = null
            }
        })

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

        // onUnmounted(() => {
        //     // nettoyer l'intervalle pour éviter les fuites mémoire
        //     if (intervalId) clearInterval(intervalId)
        // })

        const totalSum_ctrl = computed(() => {
            if (!type_ctrl.value || type_ctrl.value.length === 0) return 0;

            return type_ctrl.value.reduce((acc, item) => {
                // Assure-toi que item.total est un nombre
                return acc + (Number(item.total) || 0);
            }, 0);
        });

        const totalSum_prepa = computed(() => {
            if (!type_prepa.value || type_prepa.value.length === 0) return 0;

            return type_prepa.value.reduce((acc, item) => {
                // Assure-toi que item.total est un nombre
                return acc + (Number(item.total) || 0);
            }, 0);
        });

        // const totalSum_Atte_livraison = computed(() => {
        //     if (!type_atte_livraison.value || type_atte_livraison.value.length === 0) return 0;

        //     return type_atte_livraison.value.reduce((acc, item) => {
        //         // Assure-toi que item.total est un nombre
        //         return acc + (Number(item.total) || 0);
        //     }, 0);
        // });

        // const totalSum_Atte_livraison = computed(() => {
        //     if (!detail_liv.value || detail_liv.value.length === 0) return 0;

        //     // Compter le nombre d'éléments avec situation === "ATTENTE_LIVRAISON"
        //     return detail_liv.value.filter(item => item.situation === "ATTENTE_LIVRAISON").length;
        // });


        const totalSum_Atte_livraison = computed(() => {
            if (!detail_liv.value || detail_liv.value.length === 0) return 0;

            const list1 = detail_liv.value || [];
            const list2 = detail_liv_demain.value || [];

            // fusion des deux tableaux
            const all = [...list1, ...list2];

            return all.filter(item => item.situation === "ATTENTE_LIVRAISON").length;
        });

        const count_liv_today = computed(() => {
            if (!detail_liv.value || detail_liv.value.length === 0) return 0;
            // Compter le nombre d'éléments avec situation === "ATTENTE_LIVRAISON"
            return detail_liv.value.filter(item => item.situation === "ATTENTE_LIVRAISON").length;
        });

        const count_liv_demain = computed(() => {
            if (!detail_liv_demain.value || detail_liv_demain.value.length === 0) return 0;
            // Compter le nombre d'éléments avec situation === "ATTENTE_LIVRAISON"
            return detail_liv_demain.value.filter(item => item.situation === "ATTENTE_LIVRAISON").length;
        });









        const totalSum_facture = computed(() => {
            if (!type_facture.value || type_facture.value.length === 0) return 0;

            return type_facture.value.reduce((acc, item) => {
                return acc + (Number(item.total) || 0);
            }, 0);
        });

        const totalSum_encours_totals = computed(() => {
            if (!type_encours_totals.value || type_encours_totals.value.length === 0) return 0;

            return type_encours_totals.value.reduce((acc, item) => {
                return acc + (Number(item.total) || 0);
            }, 0);
        });


        const totalList_ctrl = computed(() => {
            return type_ctrl.value.length;
        });
        const totalList_prepa = computed(() => {
            return type_prepa.value.length;
        });
        const totalList_facture = computed(() => {
            return type_facture.value.length;
        });
        const totalList_encours_totals = computed(() => {
            return type_encours_totals.value.length;
        });
        const totalList_atte_livraison = computed(() => {
            return type_atte_livraison.value.length;
        });

        const dialogEncours = ref(false);

        const handleClickEncoursTotal = () => {
            dialogEncours.value = true
        }

        const filtre = ref('ALL')

        const detailItem = ref([]);
        const detailItem_ind = ref([]);

        const onDetail = ({ item, axeClique, situation }) => {

            console.log(filtre.value)

            const source = filtre.value === 'DEMAIN'
                ? detail_liv_demain.value
                : detail_liv.value;

            const heureClicked = item.heure;

            const resultat = source.filter(o => {

                // 🎯 🔥 CAS TOTAL → PAS de filtre sur heure
                const isTotal = item.vague === 'TOTAL';

                const heureMatch = isTotal ? true : o.vague_heure === heureClicked;

                let axe = axeClique?.trim().toLowerCase();

                // Nettoyage axe
                axe = axe.replace(/_?cde$/, '');

                if (axe !== 'sans_axe') {
                    axe = axe.replace(/_/g, ' ');
                    if (axe === 'sud est') {
                        axe = 'sud-est';
                    }
                }

                // Gestion situation
                let sit = situation?.trim();
                let inverse = false;

                if (sit?.startsWith('!')) {
                    inverse = true;
                    sit = sit.slice(1).trim().toLowerCase();
                } else {
                    sit = sit?.toLowerCase();
                }

                let situationMatch = true;
                if (sit) {
                    const match = o.situation?.toString().trim().toLowerCase() === sit;
                    situationMatch = inverse ? !match : match;
                }

                // 🎯 CAS axe = total → tout afficher (mais respecte heure si pas TOTAL)
                if (axe === 'total') {
                    return heureMatch && situationMatch;
                }

                // 🎯 filtre axe normal
                const axeMatch = o.cc2axe?.toString().trim().toLowerCase() === axe;

                return axeMatch && heureMatch && situationMatch;
            });

            detailItem.value = resultat;
            detailItem.value = resultat.sort((a, b) => new Date(a.date_validation_adv) - new Date(b.date_validation_adv));
            dialogDetail.value = true;
        };

        const onDetail_liv = ({ item, etapeClique }) => {
            const VagueCliqued = item.vague_ind;

            const mappingStade = {
                prepa: ["PREPA"],
                ctrl: ["CTRL"],
                facture: ["FACTURE"],
                livraison: ["ATTE_LIVRAISON"],
                livre: ["LIVRE"],
                livraison_hier: ["LIVRE"],
                livraison_ok: ["LIVRE"]
            }

            let stadeClicked = mappingStade[etapeClique] || []

            // console.log(stadeClicked)

            const resultat = list_liv_ind_detail.value.filter(o => {

                const isTotal = VagueCliqued === 'TOTAL'
                const vague = o.cc2_vague_liv
                // ✅ vrai uniquement si valeur exploitable
                const hasVague =
                    vague !== null &&
                    vague !== undefined &&
                    vague.toString().trim() !== ''
                const vague_match = hasVague && (isTotal || vague === VagueCliqued)
                let stade_match = true

                if (etapeClique === 'livraison_ok') {
                    stade_match = o.stade === "LIVRE" && o.qualite_livraison === "BON"
                }

                // else if (etapeClique === 'livraison_hier') {
                //     const livraison = new Date(o.livraison_ind)

                //     if (isNaN(livraison)) return false

                //     const hier = new Date()
                //     hier.setDate(hier.getDate() - 1)

                //     stade_match =
                //         livraison.toDateString() === hier.toDateString()
                // }

                else if (etapeClique === 'livraison_hier') {
                    const livraison = new Date(o.livraison_ind)
                    const prevu = new Date(o.dateliv_prevu)

                    // sécurité
                    if (isNaN(livraison) || isNaN(prevu)) return false

                    // 👉 on calcule "la veille du prévu"
                    const veillePrevu = new Date(prevu)
                    veillePrevu.setDate(veillePrevu.getDate() - 1)

                    stade_match =
                        livraison.toDateString() === veillePrevu.toDateString()
                }

                else {
                    stade_match = stadeClicked.length === 0 ? true : stadeClicked.includes(o.stade)
                }





                return vague_match && stade_match
            })
            // console.log("Résultat filtré :", resultat)
            detailItem_ind.value = resultat;
            detailItem_ind.value = resultat.sort((a, b) => new Date(a.date_validation_adv) - new Date(b.date_validation_adv));
            dialogDetail_ind.value = true;
        };


        const onAnnulerNew = async () => {
            dialogDetail.value = false;
            listLivraison();
        };

        const onAnnuler_ind = async () => {
            dialogDetail_ind.value = false;
            listLivraison();
        };

        const hasAnyPassBal = (axe) => {
            return detail_liv.value?.some(
                i => i.cc2axe === axe && i.cc2_pass_bal === 1
            );
        };

        const nbDispo = computed(() => {
            return list_liv_chauff.value.filter(i => i.xDISPO === 'DISPO').length
        })

        const nbLivr = computed(() => {
            return list_liv_chauff.value.filter(i => i.xDISPO === 'LIVR').length
        })

        const nbMiss = computed(() => {
            return list_liv_chauff.value.filter(i => i.xDISPO === 'MISS').length
        })

        const nbVoit = computed(() => {
            return list_liv_chauff.value?.length || 0
        })

        const nbTotal_Tournee = computed(() => {
            if (!Array.isArray(list_liv_chauff.value)) return 0

            return list_liv_chauff.value.reduce((total, item) => {

                const champs = ['TOURNE_1', 'TOURNE_2', 'TOURNE_3', 'TOURNE_4']

                const count = champs.filter(key => {
                    const v = item[key]
                    return v !== null && v !== undefined && String(v).trim() !== ''
                }).length

                return total + count

            }, 0)
        })




        const itemsAffiches = computed(() => {
            if (filtre.value === 'ALL') {
                return list_liv.value
            }

            if (filtre.value === 'DEMAIN') {
                return list_liv_demain.value
            }

            return list_liv.value
        })

        const hasDemain = computed(() => {
            const hasList = list_liv_demain.value && list_liv_demain.value.length > 0
            const hasDetail = detail_liv_demain.value && detail_liv_demain.value.length > 0

            return hasList || hasDetail
        })

        const formatDate = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }
        };


        return {
            headers, headers_indicateur, headers_indicateur_chauff,
            isOnline, user, list, totalList_ctrl,
            loading,
            listLivraison,
            type_ctrl, type_prepa, type_facture, type_encours_totals, type_atte_livraison, detail_liv,
            totalList_prepa, totalList_facture, totalList_encours_totals, totalList_atte_livraison,
            totalSum_ctrl, totalSum_prepa, totalSum_Atte_livraison, totalSum_facture, totalSum_encours_totals,
            handleClickEncoursTotal, dialogEncours, onDetail, detailItem, detailItem_ind,
            ip_server, dialogDetail, onAnnulerNew, dialogDetail_ind, onAnnuler_ind,
            modeLiv, list_liv, list_liv_ind, list_liv_ind_detail, list_liv_ind_obj, hasAnyPassBal,
            list_liv_chauff, nbDispo, nbLivr, nbMiss, nbVoit, nbTotal_Tournee,
            onDetail_liv,
            list_liv_demain, detail_liv_demain,
            filtre, itemsAffiches, hasDemain,
            date_today, date_demain, formatDate,
            count_liv_today, count_liv_demain,

        };
    },
})
</script>

<style>
.space0 {
    width: 100px;
    margin-left: 50px;
}

.space1 {
    width: 150px;
    margin-left: 150px;
}

.spaceCde {
    margin-left: 2em;
}

.blur-effect {
    filter: blur(5px);
    /* Applique un effet de flou */
    pointer-events: none;
    /* Désactive les interactions avec les éléments flous */
    user-select: none;
    /* Empêche la sélection de texte dans les zones floues */
}

/* === STYLE SPÉCIFIQUE AUX TABLEAUX COMPACT === */
.compact-table .v-data-table__wrapper {
    overflow-x: hidden !important;
}

.compact-table .v-data-table-header__content {
    white-space: nowrap;
    font-size: 12px !important;
    padding: 2px 6px !important;
}

.compact-table .v-data-table__td {
    padding: 2px 6px !important;
    font-size: 12px !important;
}

/* Si besoin, tu peux aussi contrôler la largeur totale */
.compact-table {
    width: 100%;
    margin: auto;
}


/* === Contrôle spécifique de la hauteur des cartes d’expédition === */
.card-exped {
    height: 260px !important;
    /* hauteur totale de la carte */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* permet d’équilibrer le contenu verticalement */
}

.card-exped .table-container {
    flex: 1;
    overflow: hidden;
}

.compact-table-indChauff {
    font-weight: bold;
}

.col-tourne {
    padding-left: -8px !important;
    /* 👈 colle à gauche */
    padding-right: 4px !important;
    text-align: left;
}

.bg_dispo {
    background: #bdf1c9;
    color: black;
    border: 2px solid #4CAF50;
    border-radius: 6px;
    /* léger arrondi */
}

.bg_livr {
    background: #fde0e0;
    color: black;
    border: 2px solid #f7b4b4;
    border-radius: 6px;
    /* léger arrondi */
}

.bg_miss {
    background: #9ccffa;
    color: black;
    border: 2px solid #0074d9;
    border-radius: 6px;
    /* léger arrondi */
}

.bg_nbVoit {
    color: #006064;
}

@media (min-width: 1920px) {
    .compact-table .v-data-table__td {
        font-size: 16px;
    }
}

@keyframes blink-red {
    0% {
        background-color: red;
        color: white;
    }

    50% {
        background-color: transparent;
        color: red;
    }

    100% {
        background-color: red;
        color: white;
    }
}

.blink-red {
    animation: blink-red 5s infinite;
    border: 1px solid red;
}
</style>