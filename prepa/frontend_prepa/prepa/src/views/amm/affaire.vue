<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <!-- <MyTabsCatalogue></MyTabsCatalogue> -->
                    <MyTabsAmm></MyTabsAmm>
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
            <v-main
                :class="{ 'blur-effect': dialogVisibleNewDossier || dialogVisibleDetailDossier || dialogDecision || dialogReclam || dialogLier }"
                style="--v-layout-top: 40px" app>
                <v-card-actions density="compact">

                    <v-card-title density="compact">
                        <!-- <MySelect comb_lab="Année" :items="annee" v-model="anneeCode" :disabled="loading"
                            style="width: 145px; height: 35px;">
                        </MySelect> -->

                    </v-card-title>

                    <!-- <v-card-title density="compact">
                        <v-select :items="mois" item-title="text" item-value="value" v-model="moisCode" label="Mois"
                            :disabled="loading" style="width: 145px; height: 35px;" density="compact"
                            color='deep-purple-accent-4' clearable></v-select>
                    </v-card-title> -->

                    <v-row density="compact" class="pt-2 mt-0 d-flex align-center">

                        <!-- Bouton Recherche aligné -->
                        <div class="d-flex align-center" style="gap: 20px;">
                            <!-- <v-btn variant="tonal" color="primary" @click="search" :disabled="loading"
                                density="compact">
                                Actualiser
                            </v-btn> -->


                            <div class="encours-wrapper">

                                <!-- Checkbox principale -->
                                <div class="checkbox-badge-wrapper">
                                    <v-checkbox v-model="encours" color="orange" label="ENCOURS" density="compact"
                                        hide-details class="small-checkbox" />
                                    <div class="badge">{{ displayedTotalAllEtapes }}</div>
                                </div>

                                <!-- Groupe des sous-checkbox -->
                                <div class="encours-group bordered-group">

                                    <div class="checkbox-badge-wrapper">
                                        <v-checkbox v-model="showOnlyWait" color="orange" label="ATTENTE DOSSIER"
                                            density="compact" hide-details class="small-checkbox" />
                                        <div class="badge">{{ displayedTotalWait }}</div>
                                    </div>

                                    <div class="checkbox-badge-wrapper">
                                        <v-checkbox v-model="showOnlyDepose" color="orange" label="A DEPOSER"
                                            density="compact" hide-details class="small-checkbox" />
                                        <div class="badge">{{ displayedTotalDepose }}</div>
                                    </div>

                                    <div class="checkbox-badge-wrapper">
                                        <v-checkbox v-model="showOnlyPaie" color="orange" label="ATTENTE PAIEMENT"
                                            density="compact" hide-details class="small-checkbox" />
                                        <div class="badge">{{ displayedTotalPaie }}</div>
                                    </div>

                                    <div class="checkbox-badge-wrapper">
                                        <v-checkbox v-model="showOnlyDecision" color="orange" label="ATTENTE DECISION"
                                            density="compact" hide-details class="small-checkbox" />
                                        <div class="badge">{{ displayedTotal }}</div>
                                    </div>

                                    <div class="checkbox-badge-wrapper">
                                        <v-checkbox v-model="showOnlyReclam" color="orange" label="EN RECLAMATION"
                                            density="compact" hide-details class="small-checkbox" />
                                        <div class="badge">{{ displayedTotalReclam }}</div>
                                    </div>

                                    <div class="checkbox-badge-wrapper">
                                        <v-checkbox v-model="showOnlyDecisionReclam" color="orange"
                                            label="ATTENTE DECISION (RECLAM)" density="compact" hide-details
                                            class="small-checkbox" />
                                        <div class="badge">{{ displayedTotalDecisionReclam }}</div>
                                    </div>


                                </div>

                            </div>



                            <div class="decision-wrapper">
                                <div class="checkbox-badge-wrapper">
                                    <v-checkbox v-model="decision_check" color="#f44336" label="DÉCISION"
                                        density="compact" hide-details class="small-checkbox" />
                                    <div class="badge" style="background-color: #f44336; color: white;">{{
                                        displayedTotalDecision }}</div>
                                </div>

                                <!-- <div class="checkbox-badge-wrapper">
                                    <v-checkbox v-model="showOnlyNoDepos" color="#f44336" label="NON DEPOSABLE"
                                        density="compact" hide-details class="small-checkbox" />
                                    <div class="badge" style="background-color: #f44336; color: white;">{{
                                        displayedTotalNoDepos }}</div>
                                </div> -->

                                <div class="decision-group bordered-group">
                                    <div class="checkbox-badge-wrapper">
                                        <v-checkbox v-model="showOnlyAccord" color="#f44336" label="ACCORDE"
                                            density="compact" hide-details class="small-checkbox" />
                                        <div class="badge" style="background-color: #f44336; color: white;">{{
                                            displayedTotalAccorde }}</div>
                                    </div>

                                    <div class="checkbox-badge-wrapper">
                                        <v-checkbox v-model="showOnlyRefus" color="#f44336" label="REFUS"
                                            density="compact" hide-details class="small-checkbox" />
                                        <div class="badge" style="background-color: #f44336; color: white;">{{
                                            displayedTotalRefus }}</div>
                                    </div>

                                    <div class="checkbox-badge-wrapper">
                                        <v-checkbox v-model="showOnlyNoSuit" color="#f44336" label="SANS SUITE"
                                            density="compact" hide-details class="small-checkbox" />
                                        <div class="badge" style="background-color: #f44336; color: white;">{{
                                            displayedTotalNoSuit }}</div>
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div class="d-flex align-center" style="gap: 20px; transform: translateY(-35px);">
                            <div class="checkbox-badge-wrapper">
                                <v-checkbox v-model="showOnlyNoDepos" color="#01579B" label="NON DEPOSABLE"
                                    density="compact" hide-details class="small-checkbox" />

                                <div class="badge" style="background-color: #01579B; color: white;">
                                    {{ displayedTotalNoDepos }}
                                </div>
                            </div>
                        </div>

                        <v-spacer />

                        <v-row density="compact" class="gap-1">
                            <v-col cols="auto" class="d-flex justify-center align-center gap-3">
                                <v-badge :content="totalNouvelDemande" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onNouvelDemand"
                                        class="mx-2 square-btn"
                                        :class="{ 'active-border': activeButton === 'nouveldemande' }">
                                        <span class="btn-text">Nouvelle demande</span>
                                    </v-btn>
                                </v-badge>

                                <v-badge :content="totalrenouv" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onRenouvellement"
                                        class="mx-2 square-btn"
                                        :class="{ 'active-border': activeButton === 'renouvellement' }">
                                        <span class="btn-text">Renouvellement</span>
                                    </v-btn>
                                </v-badge>

                                <v-badge :content="totalVariation" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onVariation" class="mx-2 square-btn"
                                        :class="{ 'active-border': activeButton === 'variation' }">
                                        <span class="btn-text">Variation</span>
                                    </v-btn>
                                </v-badge>

                                <v-badge :content="totalTous" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onTous" class="mx-2 square-btn"
                                        :class="{ 'active-border': activeButton === 'tous' }">
                                        <span class="btn-text">Tous</span>
                                    </v-btn>
                                </v-badge>
                            </v-col>
                        </v-row>
                    </v-row>

                    <!-- <v-spacer /> -->
                    <!-- <v-btn variant="tonal" color="#F50057" @click="newDossier" :disabled="loading" density="compact">
                        Nouveau
                    </v-btn> -->

                    <div class="d-flex flex-column ga-2">
                        <v-btn variant="tonal" color="#F50057" @click="newDossier" :disabled="loading"
                            density="compact">
                            Nouveau
                        </v-btn>

                        <v-btn variant="tonal" color="primary" @click="search" :disabled="loading" density="compact">
                            Actualiser
                        </v-btn>
                    </div>
                </v-card-actions>

                <div class="pa-2" style="height: 720px; overflow-y: auto;">
                    <MyTableAmmSearch :headers="headers" :items="filteredList" :loading="loading" :isAfficeLabo="true"
                        v-model:labo="labo" @handleSelectChange="changeLabo" style="font-size: 16px;"
                        @actionDetail="showDetail" action3="Décision" @action3Item="showDecision" action4="Réclamation"
                        @action4Item="showReclam" action5="LIER" @action5Item="showLier" action6="NON DEPOSABLE"
                        @action6Item="UpdateNonDepos">
                    </MyTableAmmSearch>

                    <v-dialog v-model="dialogReclam" :persistent="true" width="750px" height="600px">
                        <reclamation @annuler="onAnnulerReclam" @save="onSaveReclam" :ammreclam="amm_reclam"
                            :dossier="selectedItem" />
                    </v-dialog>

                    <v-dialog v-model="dialogLier" :persistent="true" width="600px" height="200px"
                        content-class="dialog-lier">
                        <lier @annuler="onAnnulerLier" @save="onSaveReclam" :ammreclam="amm_reclam" :ammseq="ds_seq"
                            :ammdscode="ds_code" :dossier="selectedItem" :titulaire="titulaire" />
                    </v-dialog>

                    <v-dialog v-model="dialogDecision" :persistent="true" width="450px" height="350px">
                        <!-- <decision :items="[
                            { text: 'ACCORDE', value: 1 },
                            { text: 'REFUS', value: 3 },
                            { text: 'SANS SUITE', value: 4 },
                        ]" @save="onSaveDecision" @annuler="onAnnulerDecision" :dossier="selectedItem"
                            :typedet="type_det" /> -->

                        <decision :items="[
                            { text: 'ACCORDE', value: 1 },
                            { text: 'REFUS', value: 3 },
                            ...(selectedItem?.amm_type === 'VARIATION' &&
                                Number(selectedItem?.amm_depuis) >= 365
                                ? [{ text: 'SANS SUITE', value: 4 }]
                                : [])
                        ]" @save="onSaveDecision" @annuler="onAnnulerDecision" :dossier="selectedItem" :typedet="type_det" />
                    </v-dialog>

                </div>

                <v-dialog v-if="dialogVisibleNewDossier" v-model="dialogVisibleNewDossier" :persistent="true"
                    width="1400px" height="760px" content-class="dialog-new-dossier">
                    <dossierNew @annuler="onAnnulerNew" @save="onSave" />
                </v-dialog>

                <v-dialog v-if="dialogVisibleDetailDossier" v-model="dialogVisibleDetailDossier" :persistent="true"
                    width="1450px" height="650px" content-class="dialog-detail-dossier">
                    <detailDossier :ammdscode="ds_code" :respodet="respo" :typedet="type_det" :ammseq="ds_seq"
                        :classdet="class_det" :decisiondet="decision_det" :etapedet="etape_det" :datecre="date_cre"
                        :datedepuis="date_depuis" @annuler="onAnnulerDetail" @save="onSave" />
                </v-dialog>


                <!-- <v-row class="d-flex justify-end">
                    <v-btn variant="tonal" color="primary" @click="exporter" :disabled="loading" density="compact"
                        class="mr-7">
                        Export
                    </v-btn>
                </v-row> -->

            </v-main>
        </v-app>
    </v-card>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeMount, watch, nextTick } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import MyTabsAmm from '@/components/amm/MyTabsAmm.vue';
import MyTableAmm from '@/components/amm/MyTableAmm.vue';
import MyTableAmmSearch from '@/components/amm/MyTableAmmSearch.vue';
import MySelect from '@/components/MySelect.vue';

import { useArticleStore } from "@/store/utils/article.js";
import { uselistDossier } from "@/store/Amm/amm_dossier.js";

import Swal from 'sweetalert2';
import MyTextField from '@/components/MyTextField.vue';

import dossierNew from '@/views/amm/PageInsertDossier.vue';
import detailDossier from '@/views/amm/detailDossier.vue';
import decision from '@/views/amm/PageDecision.vue';
import reclamation from '@/views/amm/reclamation.vue';
import lier from '@/views/amm/lier_code_article.vue';

import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";


export default defineComponent({
    components: {
        MyTabsAmm,
        MyTableAmm,
        MySelect,
        MyTextField,
        dossierNew,
        MyTableAmmSearch,
        detailDossier,
        decision,
        reclamation,
        lier,

    },
    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },
    setup(props) {
        const labo = ref('');
        const isOnline = useOnline();
        const router = useRouter();
        const user = localStorage.getItem('username');
        useSessionTimeout(Config.DURRE_SESSION, router);
        // const ip_server = localStorage.getItem('name_server');
        const loading = computed(() => storeDossier.loading);
        const storeDossier = uselistDossier();
        const storeAmmDossier = uselistDossier();
        const storeArticle = useArticleStore();
        const listArticles = ref([]);
        const selectedArticle = ref('');
        const ds = ref('');
        const selectedItem = ref(null);
        const list = ref([]);
        const dialogVisibleNewDossier = ref(false);
        const dialogVisibleDetailDossier = ref(false);
        const dialogDecision = ref(false);
        const dialogReclam = ref(false);
        const dialogLier = ref(false);
        const isNewDemand = ref(false);
        const isRenouv = ref(false);
        const isVariation = ref(false);
        const isTous = ref(true);
        const activeButton = ref('');


        const code_dossier = ref();
        const code_article = ref();
        const libelle = ref();
        const titulaire = ref();
        const fabricant = ref();
        const type = ref();
        const decision = ref();
        const amm_respo = ref();

        const ds_code = ref();
        const ds_seq = ref();
        const respo = ref();
        const type_det = ref();
        const class_det = ref();
        const decision_det = ref();
        const etape_det = ref();
        const amm_reclam = ref();
        const date_cre = ref();
        const date_depuis = ref();

        const showOnlyDecision = ref(true);
        const showOnlyPaie = ref(true);
        const showOnlyDepose = ref(true);
        const showOnlyWait = ref(true);
        const showOnlyReclam = ref(true);
        const showOnlyDecisionReclam = ref(true);

        const showOnlyAccord = ref(false);
        const showOnlyRefus = ref(false);
        const showOnlyNoDepos = ref(false);
        const showOnlyNoSuit = ref(false);



        const ip_server = ref('');



        const toggleButton = (btnId) => {
            activeButton.value = activeButton.value === btnId ? '' : btnId;
        };

        const handleShowDetails = (items) => {
            dialogVisibleDetailDossier.value = true;
            selectedItem.value = items;
        };


        onMounted(async () => {
            listArticles.value = [];

            // await listDossier();
            // await listArticle();

            await Promise.all([
                listDossier(),
                listArticle()
            ]);

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

        const headers = [
            // { title: 'SEQ', align: 'start', key: 'seq', sortable: true },
            { title: 'DOSSIER', align: 'start', key: 'amm_ds_code', sortable: false },
            { title: 'CREE LE', align: 'start', key: 'datecre', sortable: false },
            { title: 'CODE ARTICLE', align: 'start', key: 'ligne_code_article', sortable: false },
            { title: 'LIBELLÉ', align: 'start', key: 'ligne_libelle_article', sortable: false, width: '100px' },
            { title: 'TITULAIRE', align: 'start', key: 'ligne_titulaire', sortable: false },
            { title: 'FABRICANT', align: 'start', key: 'fab_libelle', sortable: false, width: '250px' },
            { title: 'TYPE', align: 'center', key: 'amm_type', sortable: false },
            { title: 'ETAPE', align: 'center', key: 'amm_etape', sortable: false, width: '10px' },
            { title: 'DEPUIS', align: 'center', key: 'amm_depuis', sortable: false },
            // { title: 'DÉCISION', align: 'start', key: 'amm_decision', sortable: false },
            // { title: 'CLASSIFICATION', align: 'start', key: 'amm_classification', sortable: false },
            // { title: 'AMM RESPO', align: 'start', key: 'amm_respo', sortable: true },
            // { title: '', align: 'start', key: 'detail', sortable: false },
        ]


        const listArticle = async () => {
            await storeArticle.fetchArticle();
            listArticles.value = storeArticle.articles;
        };

        const listDossier = async () => {
            await storeDossier.fetchListDossier(labo.value);
            list.value = storeDossier.listdossiers;
        };

        const changeLabo = async () => {
            await listDossier();
        }

        const search = async () => {
            await listDossier();
        };

        const convertToUpperCase = () => {
            ds.value = ds.value.toUpperCase();
        };

        const newDossier = async () => {
            dialogVisibleNewDossier.value = true;
            // listDossier();
        };

        const onAnnulerNew = async () => {
            dialogVisibleNewDossier.value = false;
            listDossier();
        };

        const onAnnulerDecision = async () => {
            dialogDecision.value = false;
            listDossier();
        };

        const onAnnulerReclam = async () => {
            dialogReclam.value = false;
            listDossier();
        };

        const onAnnulerLier = async () => {
            dialogLier.value = false;
            listDossier();
        };

        const onAnnulerDetail = async () => {
            dialogVisibleDetailDossier.value = false;
            listDossier();
        };


        // const filteredList = computed(() => {
        //     let filtered = list.value

        //     if (isNewDemand.value) {
        //         filtered = filtered.filter(item => item.amm_type === 'NOUVELLE DEMANDE')
        //     } else if (isRenouv.value) {
        //         filtered = filtered.filter(item => item.amm_type === 'RENOUVELLEMENT')
        //     } else if (isVariation.value) {
        //         filtered = filtered.filter(item => item.amm_type === 'VARIATION')
        //     }
        //     else if (isTous.value) {
        //         filtered = list.value // pas de filtre
        //     }


        //     // === Filtre par étape (OU logique) ===
        //     // const selectedEtapes = []
        //     // if (showOnlyDecision.value) selectedEtapes.push('ATTENTE DECISION')
        //     // if (showOnlyPaie.value) selectedEtapes.push('ATTENTE PAIEMENT')
        //     // if (showOnlyDepose.value) selectedEtapes.push('A DEPOSER')
        //     // if (showOnlyWait.value) selectedEtapes.push('ATTENTE DOSSIER')
        //     // if (showOnlyReclam.value) selectedEtapes.push('EN RECLAMATION')
        //     // if (showOnlyDecisionReclam.value) selectedEtapes.push('ATTENTE DECISION (RECLAM)')

        //     const selectedEtapes = [
        //         showOnlyDecision.value && 'ATTENTE DECISION',
        //         showOnlyPaie.value && 'ATTENTE PAIEMENT',
        //         showOnlyDepose.value && 'A DEPOSER',
        //         showOnlyWait.value && 'ATTENTE DOSSIER',
        //         showOnlyReclam.value && 'EN RECLAMATION',
        //         showOnlyDecisionReclam.value && 'ATTENTE DECISION (RECLAM)'
        //     ].filter(Boolean)


        //     const selectedDecision = [
        //         showOnlyAccord.value && 'ACCORDE',
        //         showOnlyRefus.value && 'REFUSE'
        //     ].filter(Boolean)

        //     const allUnchecked = selectedEtapes.length === 0

        //     if (!allUnchecked) {
        //         filtered = filtered.filter(item =>
        //             selectedEtapes.includes(item.amm_etape)
        //         )
        //     }

        //     if (selectedDecision.length > 0) {
        //         filtered = filtered.filter(item => selectedDecision.includes(item.amm_decision))
        //     }

        //     if (selectedEtapes.length > 0) {
        //         filtered = filtered.filter(item => selectedEtapes.includes(item.amm_etape))
        //     }

        //     return filtered
        // })

        // Affiche tout les éléments quand tout est décocher

        // const filteredList = computed(() => {
        //     let filtered = list.value

        //     // Filtre par type de dossier (NOUVELLE DEMANDE, RENOUVELLEMENT, VARIATION)
        //     if (isNewDemand.value) {
        //         filtered = filtered.filter(item => item.amm_type === 'NOUVELLE DEMANDE')
        //     } else if (isRenouv.value) {
        //         filtered = filtered.filter(item => item.amm_type === 'RENOUVELLEMENT')
        //     } else if (isVariation.value) {
        //         filtered = filtered.filter(item => item.amm_type === 'VARIATION')
        //     }

        //     // === FILTRE PAR ÉTAPE (ENCOURS) ===
        //     const selectedEtapes = [
        //         showOnlyDecision.value && 'ATTENTE DECISION',
        //         showOnlyPaie.value && 'ATTENTE PAIEMENT',
        //         showOnlyDepose.value && 'A DEPOSER',
        //         showOnlyWait.value && 'ATTENTE DOSSIER',
        //         showOnlyReclam.value && 'EN RECLAMATION',
        //         showOnlyDecisionReclam.value && 'ATTENTE DECISION (RECLAM)'
        //     ].filter(Boolean)

        //     // === FILTRE PAR DÉCISION (ACCORDE/REFUS) ===
        //     const selectedDecision = [
        //         showOnlyAccord.value && 'ACCORDE',
        //         showOnlyRefus.value && 'REFUSE'
        //     ].filter(Boolean)

        //     const hasEtapeFilter = selectedEtapes.length > 0
        //     const hasDecisionFilter = selectedDecision.length > 0

        //     // Si les deux groupes sont cochés, on prend l'union des deux
        //     if (hasEtapeFilter && hasDecisionFilter) {
        //         return filtered.filter(item => 
        //             selectedEtapes.includes(item.amm_etape) || 
        //             selectedDecision.includes(item.amm_decision)
        //         )
        //     }
        //     // Si seulement ENCOURS est coché
        //     else if (hasEtapeFilter) {
        //         return filtered.filter(item => selectedEtapes.includes(item.amm_etape))
        //     }
        //     // Si seulement DÉCISION est coché
        //     else if (hasDecisionFilter) {
        //         return filtered.filter(item => selectedDecision.includes(item.amm_decision))
        //     }
        //     // Si aucun filtre
        //     else {
        //         return filtered
        //     }
        // })


        const filteredList = computed(() => {
            let filtered = list.value

            // Filtre par type de dossier (NOUVELLE DEMANDE, RENOUVELLEMENT, VARIATION)
            if (isNewDemand.value) {
                filtered = filtered.filter(item => item.amm_type === 'NOUVELLE DEMANDE')
            } else if (isRenouv.value) {
                filtered = filtered.filter(item => item.amm_type === 'RENOUVELLEMENT')
            } else if (isVariation.value) {
                filtered = filtered.filter(item => item.amm_type === 'VARIATION')
            }

            // === FILTRE PAR ÉTAPE (ENCOURS) ===
            const selectedEtapes = [
                showOnlyDecision.value && 'ATTENTE DECISION',
                showOnlyPaie.value && 'ATTENTE PAIEMENT',
                showOnlyDepose.value && 'A DEPOSER',
                showOnlyWait.value && 'ATTENTE DOSSIER',
                showOnlyReclam.value && 'EN RECLAMATION',
                showOnlyDecisionReclam.value && 'ATTENTE DECISION (RECLAM)'
            ].filter(Boolean)

            // === FILTRE PAR DÉCISION (ACCORDE/REFUS) ===
            const selectedDecision = [
                showOnlyAccord.value && 'ACCORDE',
                showOnlyRefus.value && 'REFUSE',
                showOnlyNoDepos.value && 'NON DEPOSABLE',
                showOnlyNoSuit.value && 'SANS SUITE'
            ].filter(Boolean)

            const hasEtapeFilter = selectedEtapes.length > 0
            const hasDecisionFilter = selectedDecision.length > 0

            // Si aucun filtre n'est coché → tableau vide
            if (!hasEtapeFilter && !hasDecisionFilter) {
                return []  // <-- Retourne un tableau vide
            }

            // Si les deux groupes sont cochés, on prend l'union des deux
            if (hasEtapeFilter && hasDecisionFilter) {
                return filtered.filter(item =>
                    selectedEtapes.includes(item.amm_etape) ||
                    selectedDecision.includes(item.amm_decision)
                )
            }
            // Si seulement ENCOURS est coché
            else if (hasEtapeFilter) {
                return filtered.filter(item => selectedEtapes.includes(item.amm_etape))
            }
            // Si seulement DÉCISION est coché
            else {
                return filtered.filter(item => selectedDecision.includes(item.amm_decision))
            }
        })

        function onNouvelDemand() {
            isNewDemand.value = !isNewDemand.value
            isRenouv.value = false;
            isVariation.value = false;
            toggleButton('nouveldemande')
        }

        function onRenouvellement() {
            isRenouv.value = !isRenouv.value
            isNewDemand.value = false;
            isVariation.value = false;
            toggleButton('renouvellement')
        }

        function onVariation() {
            isVariation.value = !isVariation.value
            isRenouv.value = false;
            isNewDemand.value = false;
            toggleButton('variation')
        }

        function onTous() {
            isTous.value = true
            isNewDemand.value = false
            isRenouv.value = false;
            isVariation.value = false;
            activeButton.value = 'tous';
        }

        // const totalNouvelDemande = computed(() => {
        //     return list.value.filter(item => item.amm_type === 'NOUVELLE DEMANDE').length
        // })

        // const totalrenouv = computed(() => {
        //     return list.value.filter(item => item.amm_type === 'RENOUVELLEMENT').length
        // })

        // const totalVariation = computed(() => {
        //     return list.value.filter(item => item.amm_type === 'VARIATION').length
        // })


        // const totalTous = computed(() => {
        //     return list.value.length;
        // });



        // Computed pour obtenir la liste filtrée uniquement par ENCOURS et DÉCISION
        const baseFilteredList = computed(() => {
            let filtered = list.value

            // === FILTRE PAR ÉTAPE (ENCOURS) ===
            const selectedEtapes = [
                showOnlyDecision.value && 'ATTENTE DECISION',
                showOnlyPaie.value && 'ATTENTE PAIEMENT',
                showOnlyDepose.value && 'A DEPOSER',
                showOnlyWait.value && 'ATTENTE DOSSIER',
                showOnlyReclam.value && 'EN RECLAMATION',
                showOnlyDecisionReclam.value && 'ATTENTE DECISION (RECLAM)'
            ].filter(Boolean)

            // === FILTRE PAR DÉCISION (ACCORDE/REFUS) ===
            const selectedDecision = [
                showOnlyAccord.value && 'ACCORDE',
                showOnlyRefus.value && 'REFUSE',
                showOnlyNoDepos.value && 'NON DEPOSABLE',
                showOnlyNoSuit.value && 'SANS SUITE'
            ].filter(Boolean)

            const hasEtapeFilter = selectedEtapes.length > 0
            const hasDecisionFilter = selectedDecision.length > 0

            // Si aucun filtre n'est coché → tableau vide
            if (!hasEtapeFilter && !hasDecisionFilter) {
                return []
            }

            // Si les deux groupes sont cochés, on prend l'union des deux
            if (hasEtapeFilter && hasDecisionFilter) {
                return filtered.filter(item =>
                    selectedEtapes.includes(item.amm_etape) ||
                    selectedDecision.includes(item.amm_decision)
                )
            }
            // Si seulement ENCOURS est coché
            else if (hasEtapeFilter) {
                return filtered.filter(item => selectedEtapes.includes(item.amm_etape))
            }
            // Si seulement DÉCISION est coché
            else {
                return filtered.filter(item => selectedDecision.includes(item.amm_decision))
            }
        })

        // Les badges utilisent baseFilteredList (sans le filtre de type)
        const totalNouvelDemande = computed(() => {
            return baseFilteredList.value.filter(item => item.amm_type === 'NOUVELLE DEMANDE').length
        })

        const totalrenouv = computed(() => {
            return baseFilteredList.value.filter(item => item.amm_type === 'RENOUVELLEMENT').length
        })

        const totalVariation = computed(() => {
            return baseFilteredList.value.filter(item => item.amm_type === 'VARIATION').length
        })

        const totalTous = computed(() => {
            return baseFilteredList.value.length
        })



        // const totalNouvelDemande = computed(() => {
        //     return filteredList.value.filter(item => item.amm_type === 'NOUVELLE DEMANDE').length
        // })

        // const totalrenouv = computed(() => {
        //     return filteredList.value.filter(item => item.amm_type === 'RENOUVELLEMENT').length
        // })

        // const totalVariation = computed(() => {
        //     return filteredList.value.filter(item => item.amm_type === 'VARIATION').length
        // })

        // const totalTous = computed(() => {
        //     return filteredList.value.length;
        // });

        const showDetail = async (item) => {
            ds_seq.value = item.seq;
            ds_code.value = item.amm_ds_code;
            respo.value = item.amm_respo;
            type_det.value = item.amm_type;
            class_det.value = item.amm_classification;
            decision_det.value = item.amm_decision;
            etape_det.value = item.amm_etape;
            amm_reclam.value = item.amm_reclam;
            date_cre.value = item.datecre;
            date_depuis.value = item.date_depuis;

            dialogVisibleDetailDossier.value = true;
        }

        const showDecision = (item) => {
            selectedItem.value = item;
            type_det.value = item.amm_type;
            dialogDecision.value = true;
        };

        const showReclam = (item) => {
            selectedItem.value = item;
            dialogReclam.value = true;
        }

        const showLier = (item) => {
            ds_seq.value = item.seq;
            ds_code.value = item.amm_ds_code;
            titulaire.value = item.ligne_titulaire;
            selectedItem.value = item;
            dialogLier.value = true;
        }


        // const UpdateNonDepos = async (payload) =>{
        //     console.log(payload)

        //         await storeAmmDossier.updateAmmDossier(ds_code.value, 5, payload.date, payload.text || null);
        //         dialogDecision.value = false;
        //         await listDossier();
        // }

        const UpdateNonDepos = async (payload) => {
            console.log(payload);

            console.log(payload.amm_ds_code)

            const result = await Swal.fire({
                title: 'Ce dossier est-elle vraiment NON DEPOSABLE ?',
                // text: 'Voulez-vous vraiment enregistrer cette modification ?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Oui',
                cancelButtonText: 'Annuler',
                reverseButtons: true
            });

            // L'utilisateur a annulé
            if (!result.isConfirmed) {
                return;
            }

            await storeAmmDossier.updateAmmDossier(payload.amm_ds_code, 5, null, null);

            await listDossier();
        };

        const onSaveDecision = async (payload) => {
            // Vérifier si payload ou sa valeur est invalide
            if (!payload || payload.value === null || payload.value === undefined || payload.value === "") {
                return;
            }
            ds_code.value = payload.item.amm_ds_code;

            console.log("Valeur sélectionnée:", payload.value);
            // console.log("Texte:", payload.text);
            // console.log("Date:", payload.date);

            if (payload.value == 2 || payload.value == 3) {
                // Test si le texte est vide
                if (!payload.text || payload.text.trim() === "") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Veuillez ajouter un motif',
                        //text: 'Décision : REFUS ou RÉCLAMATION. Veuillez ajouter un motif.',
                        timer: 3000,               // durée avant disparition
                        showConfirmButton: false,  // pas de bouton
                        position: 'top',           // en haut
                        toast: true,               // style toast
                        background: '#ffeeba',     // couleur de fond (jaune clair)
                        color: '#856404',          // couleur du texte
                        iconColor: '#856404',      // couleur de l'icône warning
                        customClass: {
                            popup: 'shadow-lg rounded-lg p-3' // arrondi + ombre pour effet "wouaouh"
                        }
                    });
                    return; // stoppe la fonction si texte vide
                } else {
                    // Si le texte n'est pas vide, exécute la fonction
                    await storeAmmDossier.updateAmmDossier(ds_code.value, payload.value, payload.date, payload.text);
                    dialogDecision.value = false;
                    await listDossier();
                }
            }

            else if (
                payload.value == 4
            ) {

                // NON DEPOSABLE => aucun motif obligatoire
                await storeAmmDossier.updateAmmDossier(ds_code.value, 4, payload.date, payload.text || null);
                dialogDecision.value = false;
                await listDossier();

            }




            else if (
                payload.typedet !== 'VARIATION' &&
                (!payload.codeAmm || !payload.dateAmm)
            ) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Veuillez renseigner le N° AMM ou Date d\'AMM',
                    timer: 3000,               // durée avant disparition
                    showConfirmButton: false,  // pas de bouton
                    position: 'top',           // en haut
                    toast: true,               // style toast
                    background: '#ffeeba',     // couleur de fond (jaune clair)
                    color: '#856404',          // couleur du texte
                    iconColor: '#856404',      // couleur de l'icône warning
                    customClass: {
                        popup: 'shadow-lg rounded-lg p-3'
                    }
                });

            } else {
                // Pour les autres valeurs de payload.value, exécute directement
                await storeAmmDossier.updateAmmDossier(ds_code.value, payload.value, payload.date, payload.text);
                // await storeAmmDossier.updateAmmLigneArticle(ds_code.value, payload.codeAmm, payload.dateAmm, payload.seq);

                const codeAmmToSend = payload.codeAmm || null;
                const dateAmmToSend = payload.dateAmm || null;

                await storeAmmDossier.updateAmmLigneArticle(ds_code.value, codeAmmToSend, dateAmmToSend, payload.seq);
                dialogDecision.value = false;
                await listDossier();
            }
        };

        const displayedTotal = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered.filter(item => item.amm_etape === 'ATTENTE DECISION').length
        })

        const displayedTotalPaie = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered.filter(item => item.amm_etape === 'ATTENTE PAIEMENT').length
        })

        const displayedTotalDepose = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered.filter(item => item.amm_etape === 'A DEPOSER').length
        })

        const displayedTotalWait = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered.filter(item => item.amm_etape === 'ATTENTE DOSSIER').length
        })
        const displayedTotalReclam = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered.filter(item => item.amm_etape === 'EN RECLAMATION').length
        })
        const displayedTotalDecisionReclam = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered.filter(item => item.amm_etape === 'ATTENTE DECISION (RECLAM)').length
        })

        const displayedTotalAllEtapes = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            const etapes = [
                'ATTENTE DECISION',
                'ATTENTE PAIEMENT',
                'A DEPOSER',
                'ATTENTE DOSSIER',
                'EN RECLAMATION',
                'ATTENTE DECISION (RECLAM)'
            ]
            return filtered.filter(item => etapes.includes(item.amm_etape)).length
        })


        const displayedTotalAccorde = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered.filter(item => item.amm_decision === 'ACCORDE').length
        })

        const displayedTotalRefus = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered
                .filter(item => item.amm_decision === 'REFUSE').length
        })

        const displayedTotalNoDepos = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered.filter(item => item.amm_decision === 'NON DEPOSABLE').length
        })

        const displayedTotalNoSuit = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered.filter(item => item.amm_decision === 'SANS SUITE').length
        })

        const displayedTotalDecision = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered.filter(item =>
                item.amm_decision === 'ACCORDE' ||
                item.amm_decision === 'REFUSE' ||
                item.amm_decision === 'SANS SUITE'
            ).length
        })


        // Watchers pour désactiver les autres checkboxes
        // watch(showOnlyDecision, (val) => {
        //     if (val) {
        //         showOnlyPaie.value = false;
        //         showOnlyDepose.value = false;
        //         showOnlyWait.value = false;
        //     }
        // });

        // watch(showOnlyPaie, (val) => {
        //     if (val) {
        //         showOnlyDecision.value = false;
        //         showOnlyDepose.value = false;
        //         showOnlyWait.value = false;
        //     }
        // });

        // watch(showOnlyDepose, (val) => {
        //     if (val) {
        //         showOnlyDecision.value = false;
        //         showOnlyPaie.value = false;
        //         showOnlyWait.value = false;
        //     }
        // });

        // watch(showOnlyWait, (val) => {
        //     if (val) {
        //         showOnlyDecision.value = false;
        //         showOnlyPaie.value = false;
        //         showOnlyDepose.value = false;
        //     }
        // });


        const encours = ref(true) // cochée par défaut

        const decision_check = ref(false)

        const filters = ref({
            wait: true,
            depose: true,
            paie: true,
            decision: true,
            reclam: true,
            decisionReclam: true
        })

        // watch(encours, (val) => {
        //     showOnlyWait.value = val
        //     showOnlyDepose.value = val
        //     showOnlyPaie.value = val
        //     showOnlyDecision.value = val
        //     showOnlyReclam.value = val
        //     showOnlyDecisionReclam.value = val
        // })

        const sousCheckboxes = [
            showOnlyWait,
            showOnlyDepose,
            showOnlyPaie,
            showOnlyDecision,
            showOnlyReclam,
            showOnlyDecisionReclam
        ]

        // Tableau des sous-checkboxes DECISION
        const sousCheckboxesDecision = [
            showOnlyAccord,
            showOnlyRefus,
            // showOnlyNoDepos,
            showOnlyNoSuit,
        ]

        let isUpdating = false;
        let isUpdatingDecision = false;

        // Watch pour ENCOURS
        watch(encours, (val, oldVal) => {
            if (val !== oldVal && !isUpdating) {
                isUpdating = true;
                sousCheckboxes.forEach(cb => cb.value = val);
                // Utiliser nextTick pour s'assurer que toutes les mises à jour sont faites
                nextTick(() => {
                    isUpdating = false;
                });
            }
        });

        // Watch pour chaque sous-checkbox individuellement
        sousCheckboxes.forEach(cb => {
            watch(cb, () => {
                if (!isUpdating) {
                    isUpdating = true;
                    encours.value = sousCheckboxes.every(sc => sc.value);
                    nextTick(() => {
                        isUpdating = false;
                    });
                }
            });
        });


        // === WATCHERS POUR DECISION ===
        watch(decision_check, (val, oldVal) => {
            if (val !== oldVal && !isUpdatingDecision) {
                isUpdatingDecision = true;
                sousCheckboxesDecision.forEach(cb => cb.value = val);
                nextTick(() => {
                    isUpdatingDecision = false;
                });
            }
        });

        sousCheckboxesDecision.forEach(cb => {
            watch(cb, () => {
                if (!isUpdatingDecision) {
                    isUpdatingDecision = true;
                    decision_check.value = sousCheckboxesDecision.every(sc => sc.value);
                    nextTick(() => {
                        isUpdatingDecision = false;
                    });
                }
            });
        });

        return {
            headers, isOnline, user, ip_server, encours, filters, decision_check,
            loading,
            search, convertToUpperCase, ds,
            listArticles, selectedArticle,
            list,
            onAnnulerNew, onAnnulerDetail,
            dialogVisibleNewDossier, newDossier,
            totalNouvelDemande, totalrenouv, totalVariation, totalTous,
            onNouvelDemand, onRenouvellement, onVariation, onTous, activeButton,
            filteredList,
            selectedItem, handleShowDetails, showDetail,
            dialogVisibleDetailDossier,
            ds_code, respo, type_det, ds_seq, class_det, decision_det, etape_det, amm_reclam, date_cre, date_depuis, titulaire,
            dialogDecision, onAnnulerDecision, showDecision, onSaveDecision, showReclam, showLier, UpdateNonDepos,
            dialogReclam, onAnnulerReclam, dialogLier, onAnnulerLier,
            showOnlyDecision, displayedTotal, showOnlyPaie, showOnlyDepose, showOnlyWait, displayedTotalPaie, displayedTotalDepose, displayedTotalWait,
            showOnlyReclam, showOnlyDecisionReclam, displayedTotalReclam, displayedTotalDecisionReclam, labo, changeLabo,
            displayedTotalAccorde, displayedTotalRefus, displayedTotalNoSuit, showOnlyAccord, showOnlyRefus, showOnlyNoDepos, showOnlyNoSuit, displayedTotalNoDepos,
            displayedTotalDecision, displayedTotalAllEtapes,

        };
    },


})

</script>
<style>
.blur-effect {
    filter: blur(5px);
    /* Applique un effet de flou */
    pointer-events: none;
    /* Désactive les interactions avec les éléments flous */
    user-select: none;
    /* Empêche la sélection de texte dans les zones floues */
}


.active-border {
    border: 2px solid #F48FB1 !important;
    border-radius: 4px;
}


/* ✅ Agrandir les cellules des tableaux sans retour ligne */
.v-data-table tbody td {
    font-size: 0.89rem;
    /* Plus grand pour lisibilité */
    /* font-weight: bold; */
    white-space: nowrap;
    /* ❗Pas de retour ligne */
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 8px 12px;
}

.small-checkbox .v-label {
    font-size: 11px !important;
    /* ajuste à la taille souhaitée */
}

.dialog-detail-dossier {
    transform: translateY(-75px) !important;
    /* Remonte le dialog de 60px */
}

.dialog-new-dossier {
    /* transform: translateY(-20px) !important; */
    /* Remonte le dialog de 60px */
}

.dialog-lier {
    transform: translateY(-200px) !important;
    /* Remonte le dialog de 60px */
}

.bordered-group {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 8px 12px;
    background: #fff;
}

/* petit espace entre ENCOURS et les filtres */
.encours-group {
    margin-top: 2px;
}
</style>