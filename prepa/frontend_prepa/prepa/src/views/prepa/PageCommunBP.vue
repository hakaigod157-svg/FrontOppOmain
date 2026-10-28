<template >
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
                        <v-row>
                            <v-col></v-col>
                            <v-col>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><u>Priorité
                                        commandes</u></b><br>
                                <v-card color="#D7CCC8" width="460">
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
                                        <v-btn outlined size="x-small"
                                            :class="['normal--text', 'text--normal black--text', { 'highlight': isNormClicked }]"
                                            variant="tonal"
                                            @click="onNormal">Normal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalN" color="#5D4037" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                    </div>
                                </v-card>
                            </v-col>
                            <v-col>

                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><u>Valeurs
                                        Clients</u></b><br>
                                <v-card color="#D7CCC8" max-width="190">
                                    <div>
                                        <v-btn size="x-small"
                                            :class="['or--text', 'text--or', { 'highlight': isOrClicked }]" variant="tonal"
                                            @click="OnOR">&nbsp;&nbsp;&nbsp;OR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalOr" color="#37474F" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                        <v-btn size="x-small"
                                            :class="['bronze--text', 'text--bronze', { 'highlight': isBronzeClicked }]"
                                            variant="tonal"
                                            @click="OnBronze">&nbsp;&nbsp;&nbsp;Bronze&nbsp;&nbsp;
                                            <v-badge :content="totalBronze" color="#37474F" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                    </div>
                                    <div>
                                        <v-btn size="x-small"
                                            :class="['argent--text', 'text--argent', { 'highlight': isArgentClicked }]"
                                            variant="tonal"
                                            @click="OnArgent">&nbsp;&nbsp;Argent&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalArgent" color="#37474F" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                        <v-btn size="x-small"
                                            :class="['fer--text', 'text--fer', { 'highlight': isFerClicked }]"
                                            variant="tonal"
                                            @click="OnFer">&nbsp;&nbsp;&nbsp;Fer&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <v-badge :content="totalFer" color="#37474F" inline class="large">
                                            </v-badge>
                                        </v-btn>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-spacer />
                        <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading"
                            density="compact">Actualiser</v-btn>
                    </v-card-actions>


                    <div class="pa-2">
                        <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                            density="compact">
                        </v-progress-linear>
                        <div>
                            <MyTable :headers="headers" :items="filterPrio" @action1Item="showBP"
                                action2="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;voir&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                @action3Item="imprimer" action3="Réimprimer" @action2Item="showDialog"
                                @my-alert="alertValue" @my-val="valValue" height="690" :etape="etape"
                                :showAction3="isprint">
                            </MyTable>
                        </div>
                    </div>
                </v-main>
            </v-container>
        </v-app>
    </v-card>
</template>

<script>
import MyTable from '@/components/MyTable.vue';
import MyTabs from '@/components/MyTabs.vue';
import MyLoading from '@/components/Loading.vue';
import {
    VApp,
    VAppBar,
    VMain,
} from 'vuetify/lib/components';
import { useEnCoursCmdStore } from "@/store/EnPreparation/EnCoursPrepa";
import { ref, reactive, onMounted, computed, onBeforeMount, defineComponent, watch } from "vue";
import { useRouter } from 'vue-router'
import voirCmd from "@/views/prepa/VoirCmd.vue";
import voirBP from "@/views/prepa/VoirBP.vue";
import { useEtapeStore } from "@/store/utils/etape.js";
import { useOnline } from '@vueuse/core';
import { useReportBPStore } from '@/store/report/printBP';

export default defineComponent({
    components: {
        MyTable,
        MyTabs,
        MyLoading, 
        voirCmd,
        voirBP,
    },

    methods: {
        onHome() {
            this.$router.push('/AccueilPage');
        },
    },

    props: {
        etat_bp: Number,
        isprint: {
            Boolean,
            required: false,
        },
        etape: String,
    },


    name: 'enPrepaBP',
    setup(props) {
        const store = useEnCoursCmdStore();
        const storeEtape = useEtapeStore();
        const loading = computed(() => store.loading)
        const dialogVisible = ref(false);
        const alertApre = ref('');
        const router = useRouter();
        const valApre = ref('');
        const m_valeur = ref('');
        const m_prio = ref('');
        const buttonClicked = ref(false);

        const isUrgApreClicked = ref(false);
        const isApreClicked = ref(false);
        const isGradeClicked = ref(false);
        const isUrgeClicked = ref(false);
        const isNormClicked = ref(false);

        const isOrClicked = ref(false);
        const isBronzeClicked = ref(false);
        const isArgentClicked = ref(false);
        const isFerClicked = ref(false);

        const isOnline = useOnline();
        const user = localStorage.getItem('username');

        const codeBP = ref('');
        const storePrint = useReportBPStore();


        const run_list_prepa = async () => {
            await store.fetchEnCoursPrepBP(props.etat_bp);
        }


        const showBP = async (item) => {
            dialogVisible.value = true;
            const codeBP = item.code;
            codeBP.value = codeBP;
        }

        const imprimer = async (item) => {
            try {
                const response = await storePrint.generateReport(item.codeBP, 1);
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error(error);
            }
        };

        function showDialog(item) {
            dialogVisible.value = true;
            const BP = item.codeBP;
            router.push({ name: 'voirBP', params: { BP } });
            history.pushState(null, null, window.location.href);
        }

        const headers = [
            { title: 'BP', align: 'start', key: 'codeBP_traite', sortable: true, width: '8%' },
            { title: 'CC', align: 'center', key: 'codeCC_traite', sortable: true, width: '1%' },
            { title: 'NB LIGNE', align: 'center', key: 'nbLigne', width: '1%' },
            { title: 'QTE', align: 'start', key: 'qteTotal', width: '1%' },
            { title: 'DEPUIS', align: 'start', key: 'depuis_traite', width: '1%', sortable: true },
            { title: 'DETAIL', align: 'start', key: 'detail', width: '50%' },
            { title: 'EMP ATTE CTRL', align: 'center', key: 'empl', width: '1%' },
            { title: 'SITUATION MAG', align: 'start', key: 'situation_Mag', width: '2%' },
            { title: 'ACTION', align: 'start', key: 'actions', value: 'actions', width: '2%' },
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
            await storeEtape.fetchEtape();
            await run_list_prepa();        
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
            isUrgApreClicked.value = !isUrgApreClicked.value;
            m_prio.value = 'UP';

            isApreClicked.value = false;
            isGradeClicked.value = false;
            isUrgeClicked.value = false;
            isNormClicked.value = false;

            if (isUrgApreClicked.value == false) {
                console.log(isUrgApreClicked.value)
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

        const filterArgent = computed(() => {
            if (m_valeur.value && m_valeur.value !== '') {
                return store.encoursBP.filter(item => item.valeur.trim() === m_valeur.value);
            } else {
                return store.encoursBP;
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

        const totalOr = computed(() => {
            if (Array.isArray(store.encoursBP)) {
                return store.encoursBP.filter(item => item.valeur.trim() === "OR").length;
            } else {
                return 0;
            }
        });

        const totalBronze = computed(() => {
            if (Array.isArray(store.encoursBP)) {
                return store.encoursBP.filter(item => item.valeur.trim() === "BRONZE").length;
            } else {
                return 0;
            }
        });

        const totalArgent = computed(() => {
            if (Array.isArray(store.encoursBP)) {
                return store.encoursBP.filter(item => item.valeur.trim() === "ARGENT").length;
            } else {
                return 0;
            }
        });

        const totalFer = computed(() => {
            if (Array.isArray(store.encoursBP)) {
                return store.encoursBP.filter(item => item.valeur.trim() === "FER").length;
            } else {
                return 0;
            }
        });

        const totalUP = computed(() => {
            if (Array.isArray(store.encoursBP)) {
                return filterArgent.value.filter(item => (item.urgent + item.aprendre == 2) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep >= alertApre.value) && (item.aprendre == 1))).length;

            } else {
                return 0;
            }
        });

        const totalP = computed(() => {
            if (Array.isArray(store.encoursBP)) {
                return filterArgent.value.filter(item => (item.urgent == 0 && item.aprendre == 1) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep < alertApre.value) && (item.aprendre == 1))).length;
            } else {
                return 0;
            }
        });

        const totalGAR = computed(() => {
            if (Array.isArray(store.encoursBP)) {
                return filterArgent.value.filter(item => (item.urgent == 0 && item.aprendre == 0 && item.garde == 1) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep < alertApre.value) && (item.aprendre == 0 && item.garde == 1))).length;
            } else {
                return 0;
            }
        });

        const totalURG = computed(() => {
            if (Array.isArray(store.encoursBP)) {
                return filterArgent.value.filter(item => (item.urgent == 1 && item.aprendre == 0) || ((item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep >= alertApre.value) && (item.aprendre == 0))).length;

            } else {
                return 0;
            }
        });

        const totalN = computed(() => {
            if (Array.isArray(store.encoursBP)) {
                return filterArgent.value.filter(item => (item.urgent == 0 && item.aprendre == 0 && item.garde == 0)).length;

            } else {
                return 0;
            }
        });

        onMounted(async () => {
           await run_list_prepa()
        })
        const alertValue = (value) => {
            alertApre.value = value;
        }
        const valValue = (value) => {
            valApre.value = value;
        }


        return {
            store, headers, searchEvent, loading, list_priorite, list_valeur, showDialog, valApre, alertApre, alertValue, valValue, filterArgent, OnArgent, OnFer, OnOR, OnBronze,
            totalOr, totalBronze, totalArgent, totalFer, filterPrio, onUrgApre, onApre, onUrge, onGar, onNormal, onAll, totalUP, totalP, totalGAR, totalURG, totalN, buttonClicked,
            isUrgApreClicked, isApreClicked, isGradeClicked, isUrgeClicked, isNormClicked,
            isOrClicked, isBronzeClicked, isArgentClicked, isFerClicked,
            user, isOnline, run_list_prepa, showBP, imprimer,

        }
    },



});

</script>

<style>
.alert_class {
    text-align: left;

}

.red--text.text--darken-4 {
    background-color: #FF0000;
    color: rgb(255, 255, 255) !important;
    width: 148px;
}

.green--text.text--teal-darken-4 {
    background-color: #008000;
    color: rgb(255, 255, 255) !important;
    width: 148px;
}

.grade--text.text--grade {
    background-color: #ff9933;
    color: rgb(255, 255, 255) !important;
    width: 145px;
}

.aprendre--text.text--aprendre {
    background-color: #0000FF;
    color: rgb(255, 255, 255) !important;
    width: 148px;
}

.normal--text.text--normal {
    background-color: #ffffff;
    color: rgb(0, 0, 0) !important;
    width: 148px;
    opacity: 3;
}

.or--text.text--or {
    background-color: #ff66ff;
    color: rgb(255, 255, 255) !important;
    width: 90px;
}

.argent--text.text--argent {
    background-color: #ffff00;
    color: rgb(15, 14, 14) !important;
    width: 90px;
}

.bronze--text.text--bronze {
    background-color: #99ffff;
    color: rgb(0, 0, 0) !important;
    width: 90px;
}

.fer--text.text--fer {
    background-color: #c0c0c0;
    color: rgb(0, 0, 0) !important;
    width: 90px;
}

.all--text.text--all {
    background-color: #765882;
    color: rgb(0, 0, 0) !important;
    width: 145px;
}

.highlight {
    /* Styles de surbrillance */
    /* background-color: #dce7e6 !important; */
    border: 2px solid #000000;
    /* animation: blink 1s infinite; */
}

@keyframes blink {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>


