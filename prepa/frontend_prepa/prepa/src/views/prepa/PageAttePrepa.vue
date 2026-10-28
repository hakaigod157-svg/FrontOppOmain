<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabs :storeEtape="storeEtape"></MyTabs>
                </v-card>
                <v-spacer></v-spacer>

                <div class="ma-3">
                    <p class="font-weight-thin">
                        Delai Normal :<b>{{ valApre }} </b>
                    </p>

                    <p class="font-weight-thin">
                        Début Alerte : <b>{{ alertApre }}</b>
                    </p>
                </div>
                <v-divider vertical></v-divider>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div>
                    <u>Login</u> :&nbsp;<b><span style="color: #388E3C;">{{ user }}</span></b>
                </div>&nbsp;&nbsp;
                <div>
                    <span
                        :style="{ backgroundColor: isOnline ? 'green' : 'red', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }"></span>
                </div>
                <!-- <v-btn @click="toggleTheme">
                    <v-img :width="20" :src="require('@/assets/dark.png')">
                    </v-img>
                </v-btn> -->
                <div>
                    <v-btn @click="onHome">
                        <v-img :width="20" :src="require('@/assets/home.png')">
                        </v-img>
                    </v-btn>
                </div>
            </v-app-bar>
            <v-container fluid>
                <v-main style="--v-layout-top: 40px" app>
                    <v-card-actions density="compact">
                        <span density="compact"><b>Livraison Prévue</b></span>
                        <v-card-title>
                            <v-text-field v-model="store.params.dateliv" type="date" label="Date Livraison" single-line
                                hide-details density="compact" clearable></v-text-field>
                        </v-card-title>
                        <!-- <v-spacer/> -->
                        <v-row>
                            <v-col>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><u>Priorité
                                        commandes</u></b><br>
                                <v-card color="#D7CCC8" width="441">
                                    <div>
                                        <v-btn size="x-small"
                                            :class="['red--text', 'text--darken-4', { 'highlight': isUrgApreClicked }]"
                                            variant="tonal" @click="onUrgApre">Urgent + A Prendre
                                            <v-badge :content="totalUP" color="#5D4037" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                        <v-btn size="x-small"
                                            :class="['aprendre--text', 'text--aprendre', { 'highlight': isApreClicked }]"
                                            variant="tonal" @click="onApre">A
                                            prendre&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalP" color="#5D4037" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                        <v-btn size="x-small"
                                            :class="['grade--text', 'text--grade', { 'highlight': isGradeClicked }]"
                                            variant="tonal"
                                            @click="onGar">Garde&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalGAR" color="#5D4037" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                    </div>
                                    <div>
                                        <v-btn size="x-small"
                                            :class="['green--text', 'text--teal-darken-4', { 'highlight': isUrgeClicked }]"
                                            variant="tonal"
                                            @click="onUrge">Urgent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalURG" color="#5D4037" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                        <v-btn size="x-small"
                                            :class="['normal--text', 'text--normal black--text', { 'highlight': isNormClicked }]"
                                            variant="tonal"
                                            @click="onNormal">Normal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalN" color="#5D4037" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                        <!-- <v-btn size="x-small" class="all--text text--all" variant="tonal" @click="onAll">Tous</v-btn> -->
                                    </div>
                                </v-card>
                                <!-- <MyList titre_list="Priorité" :items_list="list_priorite"></MyList> -->
                            </v-col>
                            <v-col>
                                <!-- <MyList titre_list="Valeur Client " :items_list="list_valeur"></MyList> -->
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><u>Valeurs
                                        Clients</u></b><br>
                                <v-card color="#D7CCC8" max-width="180">
                                    <div>
                                        <v-btn size="x-small"
                                            :class="['or--text', 'text--or', { 'highlight': isOrClicked }]"
                                            variant="tonal"
                                            @click="OnOR">&nbsp;&nbsp;&nbsp;OR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalOr" color="#37474F" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                        <v-btn size="x-small"
                                            :class="['bronze--text', 'text--bronze', { 'highlight': isBronzeClicked }]"
                                            variant="tonal"
                                            @click="OnBronze">&nbsp;&nbsp;&nbsp;Bronze&nbsp;&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalBronze" color="#37474F" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                    </div>
                                    <div>
                                        <v-btn size="x-small"
                                            :class="['argent--text', 'text--argent', { 'highlight': isArgentClicked }]"
                                            variant="tonal"
                                            @click="OnArgent">&nbsp;&nbsp;Argent&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalArgent" color="#37474F" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                        <v-btn size="x-small"
                                            :class="['fer--text', 'text--fer', { 'highlight': isFerClicked }]"
                                            variant="tonal"
                                            @click="OnFer">&nbsp;&nbsp;&nbsp;Fer&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalFer" color="#37474F" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                    </div>
                                </v-card>
                            </v-col>
                            <v-col>
                                <!-- Affichage du détail Délai normal -->
                            </v-col>
                        </v-row>
                        <v-spacer />
                        <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading"
                            density="compact">Actualiser</v-btn>
                    </v-card-actions>

                    <v-alert v-if="isLock" type="error" @click="isLock = false, dialog = false">Cet enregistrement {{
                codeCC
            }} est réservé par un autre utilisateur...
                        {{ myUser }}
                    </v-alert>
                    <v-alert v-if="versStock" type="error" @click="versStock = false, dialog = false">Veuillez contacter
                        le
                        Service Stock pour la preparation de ce bon : {{ codeCC
                        }}
                    </v-alert>
                    <div class="pa-2">
                        <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                            density="compact">

                        </v-progress-linear>

                        <MyTable v-else :headers="headers" :items="filterPrio" action1="preparer"
                            @action1Item="showPreparer"
                            action2="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;voir&nbsp;&nbsp;&nbsp;&nbsp;"
                            @action2Item="showDialog" @my-alert="alertValue" @my-val="valValue" height="690"
                            etape="attePrep" :showAction1="true">
                        </MyTable>
                    </div>
                    <!-- <MyLoading :loading="loading" @close="loading = false"></MyLoading> -->
                    <!-- <router-view></router-view> -->
                </v-main>
                <!-- <v-footer app class="bg-grey-lighten-1 ">
                    <v-row justify="start" no-gutters>
                        <MyList titre_list="Priorité" :items_list="list_priorite"></MyList>
                    </v-row>
                    <v-row justify="end" no-gutters>
                        <MyList titre_list="Valeur Client " :items_list="list_valeur"></MyList>
                    </v-row>
                </v-footer> -->
            </v-container>
        </v-app>
    </v-card>
</template>

<script>
import MyTable from '@/components/MyTable.vue';
import MyTabs from '@/components/MyTabs.vue';
import swal from 'sweetalert2';
// import MyList from '@/components/MyList.vue';
import MyLoading from '@/components/Loading.vue';
// import MyToolbars from '@/components/MyToolbars.vue';
import {
    VApp,
    VAppBar,
    VMain,
    VFooter
} from 'vuetify/lib/components';
import { useCommandeStore } from "@/store/Apreparer/commande.js";
import { ref, reactive, onMounted, computed, onBeforeMount, defineComponent, watch } from "vue";
import { useRouter } from 'vue-router'
import voirCmd from "@/views/prepa/VoirCmd.vue"
import prepareCmd from "@/views/prepa/PreparerCmd.vue"
import { useEtapeStore } from "@/store/utils/etape.js";
import { useLockStore } from '@/store/utils/lock';
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js"

import { useTheme } from 'vuetify';
import { useOnline } from '@vueuse/core';


export default defineComponent({
    components: {
        MyTable,
        MyTabs,
        // MyList,
        MyLoading,
        // MyToolbars,
        voirCmd,
        prepareCmd,

    },

    methods: {
        onHome() {
            this.$router.push('/AccueilPage');
            // Gérez la réponse du backend
        },
    },

    name: 'attePrepa',
    setup() {
        const store = useCommandeStore();
        // const loading = store.loading;
        const storeEtape = useEtapeStore();
        const loading = computed(() => store.loading)
        const dialogVisible = ref(false);

        const alertApre = ref('');
        const router = useRouter();
        const valApre = ref('');
        const m_valeur = ref('');
        const m_prio = ref('');
        const isOnline = useOnline();
        useSessionTimeout(Config.DURRE_SESSION, router);

        const isUrgApreClicked = ref(false);
        const isApreClicked = ref(false);
        const isGradeClicked = ref(false);
        const isUrgeClicked = ref(false);
        const isNormClicked = ref(false);

        const isOrClicked = ref(false);
        const isBronzeClicked = ref(false);
        const isArgentClicked = ref(false);
        const isFerClicked = ref(false);

        const lockStore = useLockStore();
        const isLock = ref(false);
        const myUser = ref('');
        const codeCC = ref('');
        const versStock = ref(false)



        const user = localStorage.getItem('username');

        function showDialog(item) {

            dialogVisible.value = true;
            const CC = item.code;

            router.push({ name: 'voirCmd', params: { CC } });
            history.pushState(null, null, window.location.href);

        }



        const showPreparer = async (item) => {
            await store.fetchPP();
            if (store.PP > 0) {
                swal.fire({
                    title: `Il y a <strong style="color: red;">${store.PP} PP</strong>  à imprimer`,
                    showClass: {
                        popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                    `
                    },
                    hideClass: {
                        popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                    `
                    },
                    allowOutsideClick: false, // Empêche la fermeture en cliquant en dehors
                    showConfirmButton: true, // Affiche le bouton de confirmation
                    confirmButtonText: 'OK' // Texte du bouton de confirmation
                });
            } else {
                dialogVisible.value = true;
                const CC = item.code;

                codeCC.value = CC.value;
                const params = {
                    xTable: 'FCC',
                    xCode: CC,
                    isClose: 0,
                }
                await lockStore.fetchLock(params);
                if (lockStore.locks.etat === 1) {
                    isLock.value = true;
                    myUser.value = lockStore.locks.myUser;
                } else if (item.spec_cc !== 0 || item.ao !== 0) {
                    versStock.value = true;
                }
                else {
                    router.push({ name: 'preparerCmd', params: { CC } });
                    history.pushState(null, null, window.location.href);
                }
            }

        }

        function OnArgent() {
            isArgentClicked.value = !isArgentClicked.value;
            m_valeur.value = 'ARGENT';

            isBronzeClicked.value = false;
            isOrClicked.value = false;
            isFerClicked.value = false;

            if (isArgentClicked.value == false) {
                onAll();
            }

        }

        function OnFer() {
            isFerClicked.value = !isFerClicked.value;
            m_valeur.value = 'FER';

            isBronzeClicked.value = false;
            isOrClicked.value = false;
            isArgentClicked.value = false;

            if (isFerClicked.value == false) {
                onAll();
            }

        }

        function OnOR() {
            isOrClicked.value = !isOrClicked.value;
            m_valeur.value = 'OR';

            isBronzeClicked.value = false;
            isFerClicked.value = false;
            isArgentClicked.value = false;

            if (isOrClicked.value == false) {
                onAll();
            }

        }

        function OnBronze() {
            isBronzeClicked.value = !isBronzeClicked.value;
            m_valeur.value = 'BRONZE';

            isOrClicked.value = false;
            isFerClicked.value = false;
            isArgentClicked.value = false;

            if (isBronzeClicked.value == false) {
                onAll();
            }

        }

        function onUrgApre() {
            // buttonClicked.value = !buttonClicked.value;
            // buttonClicked.value = !buttonClicked.value;
            isUrgApreClicked.value = !isUrgApreClicked.value;
            // console.log(buttonClicked.value)            
            m_prio.value = 'UP';

            isApreClicked.value = false;
            isGradeClicked.value = false;
            isUrgeClicked.value = false;
            isNormClicked.value = false;

            if (isUrgApreClicked.value == false) {
                onAll();
            }
        }

        function onApre() {
            isApreClicked.value = !isApreClicked.value;
            m_prio.value = 'P';

            isUrgApreClicked.value = false;
            isGradeClicked.value = false;
            isUrgeClicked.value = false;
            isNormClicked.value = false;

            if (isApreClicked.value == false) {
                onAll();
            }

        }

        function onUrge() {
            isUrgeClicked.value = !isUrgeClicked.value;
            m_prio.value = 'UR'

            isUrgApreClicked.value = false;
            isGradeClicked.value = false;
            isApreClicked.value = false;
            isNormClicked.value = false;

            if (isUrgeClicked.value == false) {
                onAll();
            }

        }

        function onGar() {
            isGradeClicked.value = !isGradeClicked.value;
            m_prio.value = 'GAR'

            isApreClicked.value = false;
            isUrgApreClicked.value = false;
            isUrgeClicked.value = false;
            isNormClicked.value = false;

            if (isGradeClicked.value == false) {
                onAll();
            }

        }

        function onNormal() {
            isNormClicked.value = !isNormClicked.value;
            m_prio.value = 'N'

            isApreClicked.value = false;
            isUrgApreClicked.value = false;
            isUrgeClicked.value = false;
            isGradeClicked.value = false;

            if (isNormClicked.value == false) {
                onAll();
            }

        }
        function onAll() {
            m_prio.value = '';
            m_valeur.value = '';
            run_list_prepa();
        }


        const headers = [
            { title: 'CC', align: 'start', key: 'code_traite', width: '7%' },
            { title: 'Date', align: 'center', key: 'date_com', width: '2%' },
            { title: 'Livraison Prévue', align: 'center', key: 'date_prevue_liv', width: '2%' },
            { title: 'Détails', align: 'start', key: 'nom_client', width: '20%' },
            { title: 'Validation ADV', align: 'start', key: 'commentaire', width: '12%' },
            { title: 'Axe', align: 'center', key: 'axe', width: '6%' },
            { title: 'Depuis', align: 'center', key: 'duree_atte_prep', width: '2%' },
            { title: '', align: 'center', key: 'resume', width: '6%' },
            { title: 'Nb Ligne', align: 'center', key: 'nbLigne', width: '1%' },
            { title: 'Situation Mag', align: 'start', key: 'situation_mag', width: '160px' },
            { title: 'Actions', align: 'center', key: 'actions', value: 'actions', width: '2%' },
        ]

        const list_priorite = [
            { text: 'Urgent + A Prendre', color: '#FF0000' },
            { text: 'Urgent', color: '#008000' },
            { text: 'Grade', color: '#ff9933' },
            { text: 'A Prendre', color: '#0000FF' },
            { text: 'Normal' },
        ]

        const list_valeur = [
            { text: 'Or', color: '#ff66ff' },
            { text: 'Argent', color: '#ffff00' },
            { text: 'Bronze', color: '#99ffff' },
            { text: 'Fer', color: '#c0c0c0' },
        ]

        const searchEvent = async () => {
            // Vérifiez si store.PP est supérieur à 0
            await store.fetchPP();
            if (store.PP > 0) {
                swal.fire({
                    title: `Il y a <strong style="color: red;">${store.PP} PP</strong>  à imprimer`,
                    showClass: {
                        popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                    `
                    },
                    hideClass: {
                        popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                    `
                    },
                    allowOutsideClick: false, // Empêche la fermeture en cliquant en dehors
                    showConfirmButton: true, // Affiche le bouton de confirmation
                    confirmButtonText: 'OK' // Texte du bouton de confirmation
                });
            } else {
                await run_list_prepa();
                await storeEtape.fetchEtape();
                
            }
        }

        const totalOr = computed(() => {
            if (Array.isArray(store.commandes)) {
                return store.commandes.filter(item => item.valeur.trim() === "OR").length;
            } else {
                // Handle the case when store.commandes is not an array
                return 0; // or any appropriate value depending on your use case
            }
        });

        const totalBronze = computed(() => {
            if (Array.isArray(store.commandes)) {
                return store.commandes.filter(item => item.valeur.trim() === "BRONZE").length;
            } else {
                // Handle the case when store.commandes is not an array
                return 0; // or any appropriate value depending on your use case
            }
        });

        const totalArgent = computed(() => {
            if (Array.isArray(store.commandes)) {
                return store.commandes.filter(item => item.valeur.trim() === "ARGENT").length;
            } else {
                // Handle the case when store.commandes is not an array
                return 0; // or any appropriate value depending on your use case
            }
        });

        const totalFer = computed(() => {
            if (Array.isArray(store.commandes)) {
                return store.commandes.filter(item => item.valeur.trim() === "FER").length;
            } else {
                // Handle the case when store.commandes is not an array
                return 0; // or any appropriate value depending on your use case
            }
        });

        const totalUP = computed(() => {
            if (Array.isArray(store.commandes)) {
                return filterArgent.value.filter(item => (item.urgent + item.aprendre == 2) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep >= alertApre.value) && (item.aprendre == 1))).length;

            } else {
                // Handle the case when store.commandes is not an array
                return 0; // or any appropriate value depending on your use case
            }
        });

        const totalP = computed(() => {
            if (Array.isArray(store.commandes)) {
                return filterArgent.value.filter(item => (item.urgent == 0 && item.aprendre == 1) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep < alertApre.value) && (item.aprendre == 1))).length;
            } else {
                // Handle the case when store.commandes is not an array
                return 0; // or any appropriate value depending on your use case
            }
        });

        const totalGAR = computed(() => {
            if (Array.isArray(store.commandes)) {
                return filterArgent.value.filter(item => (item.urgent == 0 && item.aprendre == 0 && item.garde == 1) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep < alertApre.value) && (item.aprendre == 0 && item.garde == 1))).length;
            } else {
                // Handle the case when store.commandes is not an array
                return 0; // or any appropriate value depending on your use case
            }
        });

        const totalURG = computed(() => {
            if (Array.isArray(store.commandes)) {
                return filterArgent.value.filter(item => (item.urgent == 1 && item.aprendre == 0) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep >= alertApre.value) && (item.aprendre == 0))).length;

            } else {
                // Handle the case when store.commandes is not an array
                return 0; // or any appropriate value depending on your use case
            }
        });

        const totalN = computed(() => {
            if (Array.isArray(store.commandes)) {
                return filterArgent.value.filter(item => (item.urgent == 0 && item.aprendre == 0 && item.garde == 0)).length;

            } else {
                // Handle the case when store.commandes is not an array
                return 0; // or any appropriate value depending on your use case
            }
        });

        const filterArgent = computed(() => {
            if (m_valeur.value && m_valeur.value !== '') {
                return store.commandes.filter(item => item.valeur.trim() === m_valeur.value);
            } else {
                return store.commandes;
            }
        });

        const filterPrio = computed(() => {
            if (m_prio.value && m_prio.value === 'UP') {
                return filterArgent.value.filter(item => (item.urgent + item.aprendre == 2) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep >= alertApre.value) && (item.aprendre == 1)));
            } else if (m_prio.value && m_prio.value === 'P') {
                return filterArgent.value.filter(item => (item.urgent == 0 && item.aprendre == 1) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep < alertApre.value) && (item.aprendre == 1)));
            } else if (m_prio.value && m_prio.value === 'UR') {
                return filterArgent.value.filter(item => (item.urgent == 1 && item.aprendre == 0) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep >= alertApre.value) && (item.aprendre == 0)));
            } else if (m_prio.value && m_prio.value === 'GAR') {
                return filterArgent.value.filter(item => (item.urgent == 0 && item.aprendre == 0 && item.garde == 1) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep < alertApre.value) && (item.aprendre == 0 && item.garde == 1)));

            } else if (m_prio.value && m_prio.value === 'N') {
                return filterArgent.value.filter(item => (item.urgent == 0 && item.aprendre == 0 && item.garde == 0))
            }
            else {
                return filterArgent.value;
            }
        });



        onMounted(async () => {
            await run_list_prepa();
            await storeEtape.fetchEtape();
        })

        const alertValue = (value) => {
            alertApre.value = value;
        }
        const valValue = (value) => {
            valApre.value = value;
        }

        const run_list_prepa = async () => {
            const params = {
                groupe: '',
                dateliv: store.params.dateliv,
            }
            // console.log(store.params.dateliv);
            await store.fetchCommande(params);
        }
        
        return {
            store, headers, searchEvent, loading, list_priorite, list_valeur, showDialog, valApre, alertApre, alertValue, valValue, showPreparer, filterArgent, m_valeur, OnArgent, OnFer,
            OnOR, OnBronze, totalOr, totalBronze, totalArgent, totalFer, filterPrio, onUrgApre, onApre, onUrge, onGar, onNormal, onAll, totalUP, totalP, totalGAR, totalURG, totalN, user, isOnline,
            isUrgApreClicked, isApreClicked, isGradeClicked, isUrgeClicked, isNormClicked,
            isOrClicked, isBronzeClicked, isArgentClicked, isFerClicked,
            isLock, myUser, codeCC, versStock
        }
    },



});

</script>

<style>
.alert_class {
    text-align: left;

}

.red-text {
    color: red;
}
</style>
