<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabsAdv :disabled="loading" :storeEtape="storeEtape" :totalList="totalList" :dateDeb="dateDeb"
                        :dateFin="dateFin"></MyTabsAdv>
                </v-card>
                <v-spacer></v-spacer>

                <div>
                    <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{
                            ip_server}}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;

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
            <v-main style="--v-layout-top: 30px" app>
                <v-card-actions density="compact" class="d-flex flex-wrap align-start">

                    <!-- Date Commande -->

                    <span class="mt-5"><b>Date Commande</b></span>
                    <div class="d-flex flex-column align-start mr-1 mt-4">
                        <v-text-field v-model="dateDeb" type="date" label="" single-line hide-details
                            color="deep-purple-accent-4" density="compact" clearable @keydown.enter="searchEvent">
                        </v-text-field>
                    </div>

                    <!-- Au -->

                    <span class="mt-5"><b>Au</b></span>
                    <div class="d-flex flex-column align-start mr-4 mt-4">
                        <v-text-field v-model="dateFin" type="date" label="" single-line hide-details
                            color="deep-purple-accent-4" density="compact" clearable @keydown.enter="searchEvent">
                        </v-text-field>
                    </div>

                    <!-- Code Commande -->
                    <v-card-title density="compact" class="mt-1 mt-5">
                        <MyTextField name_lab_text="Code Commande" style="width: 130px" @input="convertToUpperCase"
                            hint="ex:CC23108829" v-model="codeCC" placeholder="Code Commande"
                            @keydown.enter="searchEvent">
                        </MyTextField>
                    </v-card-title>

                    <!-- Client -->
                    <v-card-title density="compact" class="mt-1 mt-3">
                        <v-autocomplete :disabled="isUpdating" :items="client" style="width: 200px; height: 35px"
                            item-title="text" item-value="value" label="Client" :min-length="3" density="compact"
                            clearable hide-no-data :loading="loading" color="deep-purple-accent-4" v-model="clientCode"
                            @keydown.enter="searchEvent">
                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props">
                                    <div class="text-grey lighten-1">{{ item.text }}</div>
                                </v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-card-title>

                    <!-- Bouton + Checkbox -->
                    <div class="filter-container mt-3">
                        <v-row density="compact" class="gap-1">
                            <v-col cols="auto" class="badge-buttons-container">
                                <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading"
                                    size="large" density="compact">
                                    Rechercher
                                </v-btn>
                                <br>
                                <div class="checkbox-badge-wrapper">
                                    <v-checkbox v-model="showOnlyValidated" color="orange" label="ATTENTE PAIEMENT"
                                        density="compact" hide-details />
                                    <div class="badge">{{ displayedTotal }}</div>
                                </div>
                            </v-col>
                        </v-row>
                    </div>


                    <!-- Tableau inchangé -->
                    <!-- <v-col cols="auto">
                        <div class="max" style="margin-left: 40px;">
                            <v-table class="mini-table" fixed-header density="compact" height="80px"
                                style="font-size: 0.8rem; line-height: 1,1; --v-table-row-height: 2px;">
                                <thead>
                                    <tr style="height: 1px;">
                                        <th class="text-center" style="background-color:#90CAF9; font-size: 0.8rem;">
                                            <b>USER</b>
                                        </th>
                                        <th class="text-start" style="background-color: #90CAF9; font-size: 0.8rem;">
                                            <b>NOMBRE</b>
                                        </th>
                                        <th class="text-center" style="background-color: #90CAF9; font-size: 0.8rem;">
                                            <b>PERCENT</b>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in stats" :key="item.user_valid">
                                        <td class="text-start">{{ item.user_valid }}</td>
                                        <td class="text-start">{{ item.nb }}</td>
                                        <td class="text-start">{{ item.percent }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </div>
                    </v-col> -->


                    <div class="filter-container">
                        <v-row density="compact" class="gap-1">
                            <v-col cols="auto" class="badge-buttons-container">
                                <v-badge :content="totalAttePrep" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onAttPrep" class="mx-2 square-btn"
                                        :class="{ 'active-border': activeButton === 'attPrep' }">
                                        <span class="btn-text">ATTENTE<br>Prep</span>
                                    </v-btn>
                                </v-badge>

                                <v-badge :content="totalEncoursPrep" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onEncoursPrep" class="mx-2 square-btn"
                                        :class="{ 'active-border': activeButton === 'encoursPrep' }">
                                        <span class="btn-text">Encours<br>Prep</span>
                                    </v-btn>
                                </v-badge>

                                <v-badge :content="totalAtteCtrl" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onAttCtrl" class="mx-2 square-btn"
                                        :class="{ 'active-border': activeButton === 'attCtrl' }">
                                        <span class="btn-text">ATTENTE<br>Ctrl</span>
                                    </v-btn>
                                </v-badge>

                                <v-badge :content="totalEncoursCtrl" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onEncours" class="mx-2 square-btn"
                                        :class="{ 'active-border': activeButton === 'encoursCtrl' }">
                                        <span class="btn-text">Encours<br>Ctrl</span>
                                    </v-btn>
                                </v-badge>

                                <v-badge :content="totalEmbal" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onEmbal" class="mx-2 square-btn"
                                        :class="{ 'active-border': activeButton === 'embal' }">
                                        <span class="btn-text">Emballage<br>&nbsp;</span>
                                    </v-btn>
                                </v-badge>

                                <v-badge :content="totalAtteFact" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onAtteFact" class="mx-2 square-btn"
                                        :class="{ 'active-border': activeButton === 'atteFact' }">
                                        <span class="btn-text">Attente<br>Facture</span>
                                    </v-btn>
                                </v-badge>

                                <v-badge :content="totalAtteLiv" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onAtteLiv" class="mx-1 square-btn"
                                        :class="{ 'active-border': activeButton === 'atteLiv' }">
                                        <span class="btn-text">Attente<br>Livraison</span>
                                    </v-btn>
                                </v-badge>


                                <v-badge :content="totaLivre" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="x-small" variant="tonal" @click="onNormal" class="mx-1 square-btn"
                                        :class="{ 'active-border': activeButton === 'livre' }">
                                        <span class="btn-text">Livré<br>&nbsp;</span>
                                    </v-btn>
                                </v-badge>


                                <v-badge :content="totalTous" color="#43A047" offset-x="4" offset-y="0">
                                    <v-btn size="small" variant="tonal" @click="onTous" class="mx-1"
                                        :class="{ 'active-border': activeButton === 'tous' }">
                                        Tous
                                    </v-btn>
                                </v-badge>

                            </v-col>
                        </v-row>
                    </div>
                </v-card-actions>

                <div class="pa-2 m-0">
                    <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact"></v-progress-linear>

                    <!-- <MyTableAdv v-if="!loading" :headers="headers" action_valider="&nbsp;Valider&nbsp;"
                        @actionValiderBon="valider_bon" :items="list" height="590">
                    </MyTableAdv> -->

                    <MyTableAdv v-if="!loading" :headers="headers" action_valider="Liberer PMT"
                        @actionValiderBon="valider_bon" :items="filteredList" height="590">
                    </MyTableAdv>

                    <v-card>
                        <v-row>
                            <v-col>
                                <v-sheet class="pl-2">
                                    <b> {{ totalList }}</b> Lignes Trouvées
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </v-card>
                </div>
            </v-main>
        </v-app>
    </v-card>
</template>
<script>
import { defineComponent, ref, computed, onMounted, onBeforeMount } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import MyTabsAdv from '@/components/adv/MyTabsAdv.vue';
import MyTableAdv from '@/components/adv/MyTableAdv.vue'
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import MyTextarea from '@/components/MyTextarea.vue';
import { useValidationCommandeStore } from "@/store/Adv/adv.js";
import MyTextField from '@/components/MyTextField.vue';
import dayjs from 'dayjs';

import { useClientStore } from "@/store/utils/client.js";
import { useEtapeAdv } from "@/store/Adv/etape.js";
import swal from 'sweetalert2';



export default defineComponent({
    components: {
        MyTabsAdv,
        MyTableAdv,
        MyTextarea,
        MyTextField,
    },

    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },

    setup(props) {

        const isOnline = useOnline();
        const router = useRouter();
        const user = localStorage.getItem('username');
        const loading = computed(() => store.loading)
        const StoreAdv = useEtapeStoreAdv();
        const store = useValidationCommandeStore();
        const dialogVisible = ref(false);

        const dateDeb = ref('');
        const dateFin = ref('');
        const list = ref([]);

        const codeCC = ref('');
        const storeClient = useClientStore();
        const client = ref([]);
        const clientCode = ref('');
        const storeEtape = useEtapeAdv();
        const cc = ref();
        const facture = ref();
        const fanom = ref();
        const isAttPrepClicked = ref(false);
        const isAttCtrlClicked = ref(false);
        const isEncoursClicked = ref(false);

        const isEmbClicked = ref(false);
        const isAtteFactClicked = ref(false);
        const isAtteLivClicked = ref(false);

        const isEncoursPrepClicked = ref(false);
        const isNormal = ref(false);
        const isTous = ref(true);

        const activeButton = ref('');
        const stats = ref([]);
        const ip_server = ref('');

        const toggleButton = (btnId) => {
            activeButton.value = activeButton.value === btnId ? '' : btnId;
        };

        const showOnlyValidated = ref(false);

        const fetchClient = async () => {
            loading.value = true;
            await storeClient.fetchlListClient();
            client.value = storeClient.ListClients.map(item => ({
                value: item.clcode.trim(), // Code du client
                text: `${item.clcode.trim()} - ${item.clnom1}` // Libellé affiché
            }));
            loading.value = false;
        };

        const convertToUpperCase = () => {
            codeCC.value = codeCC.value.toUpperCase();
        };

        onBeforeMount(async () => {
            await fetchClient();
        })

        const headers = [
            { title: 'ACTIONS', align: 'start', key: 'action_cmd_valider' },
            { title: 'CODE', align: 'start', key: 'code_valider', sortable: true },
            { title: 'DATE', align: 'start', key: 'date_commande_valider' },
            { title: 'MONTANT', align: 'end', key: 'montant_cmd_valider' },
            { title: 'CLIENT', align: 'start', key: 'client_valider' },
            { title: 'NOM CLIENT', align: 'start', key: 'nom_client_valider', sortable: true },
            { title: 'DATE VALIDATION ADV', align: 'start', key: 'date_validation_adv_valider' },
            { title: 'CONDITION CLIENT', align: 'start', key: 'condition_client_valider' },
            // { title: 'COMPTANT', align: 'start', key: 'comptant_valider' },
            { title: 'PLAFOND', align: 'end', key: 'plafond_valider' },
            { title: 'SOLDE CLIENT', align: 'center', key: 'solde_client_valider' },
            { title: 'FACTURE ECHUE', align: 'end', key: 'facture_echue_valider' },
            { title: 'COMMANDE ENCOURS', align: 'center', key: 'cmd_encours_valider' },
            { title: 'REGLEMENT ENCOURS', align: 'end', key: 'reglement_encours_valider' },
            { title: 'COMMENTAIRE', align: 'start', key: 'commentaire_valider' },
            // { title: 'CHEQUE', align: 'start', key: 'cheque_valider' },
            // { title: 'DEPASSEMENT', align: 'end', key: 'depassement_valider' },
            // { title: 'ETAPE', align: 'start', key: 'etape_valider' },
            // { title: 'USER_VALID', align: 'start', key: 'user_valid_valider'},
        ]


        onMounted(async () => {
            const today = dayjs().format('YYYY-MM-DD');
            dateDeb.value = today;
            dateFin.value = today;
            list.value = [];

            await run_list_valider();
            // await seeStats();

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

        const searchEvent = async () => {
            list.value = [];
            run_list_valider();

        }


        const run_list_valider = async () => {
            await store.fetchCommandeValider(dateDeb.value, dateFin.value, codeCC.value, clientCode.value);
            list.value = store.listvaliders0;
            stats.value = store.listvaliders1;
            await storeEtape.fetchEtape();

        }

        // const seeStats = async () => {
        //     await store.fetchCommandeValider(dateDeb.value, dateFin.value, codeCC.value, clientCode.value);
        //     stats.value = store.listvaliders1;
        // }

        // const totalList = computed(() => {
        //     return list.value.length;
        // });

        const totalTous = computed(() => {
            return list.value.length;
        });

        const totalList = computed(() => filteredList.value.length)


        // Total validé
        const validatedCount = computed(() =>
            list.value.filter(item => item.bon_a_livrer_valider === 1).length
        )

        // Affichage conditionnel
        // const displayedTotal = computed(() =>
        //     showOnlyValidated.value ? totalList.value : validatedCount.value
        // )

        const displayedTotal = computed(() => {
            const filtered = isTous.value ? list.value : filteredList.value
            return filtered.filter(item => item.bon_a_livrer_valider === 1).length
        })

        const valider_bon = async (item) => {
            cc.value = item.code_valider;
            // facture.value = item.facture;
            fanom.value = item.nom_client_valider;

            await store.getStade_bal(cc.value);
            if (store.accord_stade < 2) {
                swal.fire({
                    title: `La Commande : <span style="color: #43A047;">${cc.value}</span> <br> de  ${fanom.value} est validée ?`,
                    html: `<input id="swal-input1" class="swal2-input" placeholder="Commentaire (optionnel)">`,
                    showDenyButton: true,
                    showCancelButton: false,
                    allowOutsideClick: false,
                    confirmButtonText: 'Oui',
                    denyButtonText: `Non`,
                    icon: "warning",
                    customClass: {
                        popup: 'custom-width-bon'
                    },
                    willOpen: () => {
                        document.querySelector('#app').classList.add('blur-active');
                    },
                    willClose: () => {
                        document.querySelector('#app').classList.remove('blur-active');
                    },
                    preConfirm: () => {
                        const inputValue = document.getElementById('swal-input1').value;
                        return inputValue;
                    }
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const cc = item.code_valider;
                        const commentaire = result.value; // récupère le texte de l'input
                        await store.updateFCC(cc, 2);
                        await store.update_com(cc, commentaire); // tu peux envoyer le commentaire ici si besoin

                        await swal.fire({
                            icon: 'success',
                            title: 'Bon à livrer validé',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        await run_list_valider();
                    } else if (result.isDenied) {
                        // swal.fire('Transfert annuler', '', 'info');
                    }

                });
            }
            else {
                swal.fire({
                    icon: "error",
                    title: "Impossible de valide ce bon",
                    html: "Ce bon  <span style='color: #05acdc;'>" + cc.value + "</span>  a été déjà traité",
                });
                await run_list_valider();
            }

        }

        // Filtrer par "Attente Prep" dans le champ "nom_client_valider"
        const filteredList = computed(() => {
            let filtered = list.value

            if (isAttPrepClicked.value) {
                filtered = filtered.filter(item => item.etape_valider === 'Attente Prep')
            } else if (isAttCtrlClicked.value) {
                filtered = filtered.filter(item => item.etape_valider === 'Attente Ctrl')
            } else if (isEncoursClicked.value) {
                filtered = filtered.filter(item => item.etape_valider === 'En cours Ctrl')
            } else if (isEncoursPrepClicked.value) {
                filtered = filtered.filter(item => item.etape_valider === 'En cours Prep')
            }
            else if (isEmbClicked.value) {
                filtered = filtered.filter(item => item.etape_valider === 'Emballage')
            }
            else if (isAtteFactClicked.value) {
                filtered = filtered.filter(item => item.etape_valider === 'Atte Facture')
            }
            else if (isAtteLivClicked.value) {
                filtered = filtered.filter(item => item.etape_valider === 'Atte Livraison')
            }
            else if (isNormal.value) {
                filtered = filtered.filter(item => item.etape_valider === 'livré')
            }
            else if (isTous.value) {
                filtered = list.value // pas de filtre
            }

            // Ajout du filtre de la checkbox "LIBÉRER PMT"
            if (showOnlyValidated.value) {
                filtered = filtered.filter(item => item.bon_a_livrer_valider === 1)
            }

            return filtered
        })

        function onAttPrep() {
            isAttPrepClicked.value = !isAttPrepClicked.value
            isAttCtrlClicked.value = false
            isEncoursClicked.value = false
            isEmbClicked.value = false
            isAtteFactClicked.value = false
            isAtteLivClicked.value = false
            isTous.value = false
            // activeButton.value = 'attPrep';
            toggleButton('attPrep')
        }

        function onAttCtrl() {
            isAttCtrlClicked.value = !isAttCtrlClicked.value
            isAttPrepClicked.value = false
            isEncoursClicked.value = false
            isEmbClicked.value = false
            isAtteFactClicked.value = false
            isAtteLivClicked.value = false
            isTous.value = false
            // activeButton.value = 'attCtrl';
            toggleButton('attCtrl')
        }

        function onEncours() {
            isEncoursClicked.value = !isEncoursClicked.value
            isAttPrepClicked.value = false
            isAttCtrlClicked.value = false
            isEmbClicked.value = false
            isAtteFactClicked.value = false
            isAtteLivClicked.value = false
            isTous.value = false
            // activeButton.value = 'encoursCtrl';
            toggleButton('encoursCtrl')
        }

        function onEncoursPrep() {
            isEncoursPrepClicked.value = !isEncoursPrepClicked.value
            isAttPrepClicked.value = false
            isAttCtrlClicked.value = false
            isEncoursClicked.value = false
            isNormal.value = false
            isEmbClicked.value = false
            isAtteFactClicked.value = false
            isAtteLivClicked.value = false
            isTous.value = false
            // activeButton.value = 'encoursPrep';
            toggleButton('encoursPrep')

        }

        function onEmbal() {
            isEmbClicked.value = !isEmbClicked.value
            isAttPrepClicked.value = false
            isAttCtrlClicked.value = false
            isEncoursClicked.value = false
            isAtteFactClicked.value = false
            isAtteLivClicked.value = false
            isEncoursPrepClicked.value = false
            isNormal.value = false
            isTous.value = false
            // activeButton.value = 'embal';
            toggleButton('embal')
        }

        function onAtteFact() {
            isAtteFactClicked.value = !isAtteFactClicked.value
            isAttPrepClicked.value = false
            isAttCtrlClicked.value = false
            isEmbClicked.value = false
            isEncoursClicked.value = false
            isAtteLivClicked.value = false
            isEncoursPrepClicked.value = false
            isNormal.value = false
            isTous.value = false
            // activeButton.value = 'atteFact';
            toggleButton('atteFact')
        }

        function onAtteLiv() {
            isAtteLivClicked.value = !isAtteLivClicked.value
            isAttPrepClicked.value = false
            isEmbClicked.value = false
            isAttCtrlClicked.value = false
            isEncoursClicked.value = false
            isAtteFactClicked.value = false
            isNormal.value = false
            isTous.value = false
            // activeButton.value = 'atteLiv';
            toggleButton('atteLiv')
        }

        function onNormal() {
            isNormal.value = !isNormal.value
            isAttPrepClicked.value = false
            isAttCtrlClicked.value = false
            isEncoursClicked.value = false
            isEmbClicked.value = false
            isAtteFactClicked.value = false
            isAtteLivClicked.value = false
            isEncoursPrepClicked.value = false
            isTous.value = false
            // activeButton.value = 'livre';
            toggleButton('livre')
        }

        function onTous() {
            isTous.value = true

            isAttPrepClicked.value = false
            isAttCtrlClicked.value = false
            isEncoursClicked.value = false
            isEncoursPrepClicked.value = false
            isEmbClicked.value = false
            isAtteFactClicked.value = false
            isAtteLivClicked.value = false
            isNormal.value = false
            activeButton.value = 'tous';
        }


        const totalAttePrep = computed(() => {
            return list.value.filter(item => item.etape_valider === 'Attente Prep').length
        })

        const totalAtteCtrl = computed(() => {
            return list.value.filter(item => item.etape_valider === 'Attente Ctrl').length
        })

        const totalEncoursCtrl = computed(() => {
            return list.value.filter(item => item.etape_valider === 'En cours Ctrl').length
        })

        const totalEncoursPrep = computed(() => {
            return list.value.filter(item => item.etape_valider === 'En cours Prep').length
        })

        const totalAtteFact = computed(() => {
            return list.value.filter(item => item.etape_valider === 'Atte Facture').length
        })

        const totalAtteLiv = computed(() => {
            return list.value.filter(item => item.etape_valider === 'Atte Livraison').length
        })

        const totalEmbal = computed(() => {
            return list.value.filter(item => item.etape_valider === 'Emballage').length
        })
        const totaLivre = computed(() => {
            return list.value.filter(item => item.etape_valider === 'livré').length
        })





        return {
            StoreAdv, headers, isOnline, user, dateDeb, dateFin,
            searchEvent, run_list_valider, valider_bon,
            onAttPrep, onAttCtrl, onEncours, onEncoursPrep, onNormal, onTous, onEmbal, onAtteFact, onAtteLiv,
            totalAttePrep, totalAtteCtrl, totalEncoursCtrl, totalEncoursPrep, totalAtteFact, totalAtteLiv, totalEmbal, totaLivre, totalTous,
            filteredList, showOnlyValidated, displayedTotal,
            activeButton, toggleButton,
            store, loading,
            dialogVisible,
            list, totalList, convertToUpperCase,
            codeCC, fetchClient, client, clientCode,
            storeEtape,
            stats,ip_server,

        };
    },
})
</script>

<style>
.plafond--text.text--plafond {
    background-color: #FF0000;
    color: rgb(255, 255, 255) !important;
    width: 250px;
}

.retard--text.text--retard {
    background-color: rgb(255, 204, 153);
    color: rgb(7, 7, 7) !important;
    width: 250px;
}

.debloq--text.text--debloq {
    background-color: rgb(0, 187, 0);
    color: rgb(7, 7, 7) !important;
    width: 250px;
}

.plafondep--text.text--plafondep {
    background-color: rgb(255, 153, 204);
    color: rgb(7, 7, 7) !important;
    width: 250px;
}


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

.square-btn {
    min-width: 50px !important;
    height: 36px !important;
    padding: 0 4px !important;
}

.btn-text {
    line-height: 1.1;
    font-size: 0.7rem;
    display: inline-block;
    text-align: center;
}

.active-border {
    border: 2px solid #F48FB1 !important;
    border-radius: 4px;
}


.checkbox-badge-wrapper {
    position: relative;
    display: inline-block;
}

.checkbox-badge-wrapper .badge {
    position: absolute;
    top: -8px;
    right: 0;
    background-color: #F57C00;
    color: white;
    border-radius: 9999px;
    padding: 0 6px;
    font-size: 0.75rem;
    font-weight: bold;
}

.filter-container {
    display: flex;
    flex-wrap: wrap;
    /* ou nowrap si tu veux forcer sur une seule ligne */
    gap: 2px;
    /* réduit l’espace entre les boutons (tu peux descendre à 2px ou 0) */
    align-items: center;
}

.badge-buttons-container {
    margin-top: 10px;
    /* ajuste la valeur selon ton besoin */
}

.mini-table thead tr {
    height: 2px !important;
}

.mini-table thead th {
    padding: 0 !important;
    line-height: 1 !important;
    height: 2px !important;
    font-size: 0.7rem !important;
}
</style>