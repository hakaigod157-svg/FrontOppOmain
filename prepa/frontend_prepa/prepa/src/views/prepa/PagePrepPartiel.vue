<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabs :storeEtape="storeEtape"></MyTabs>
                </v-card>
                <v-spacer></v-spacer>
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
                        <!-- <v-spacer/> -->

                        <!-- <v-card-title density="compact">

                            <v-autocomplete style="width: 250px; height: 35px" item-title="client" item-value="clnom1"
                                label="Client" :min-length="3" density="compact" clearable hide-no-data
                                :loading="loading" color="deep-purple-accent-4" :items="listClient"
                                variant="underlined"></v-autocomplete>

                        </v-card-title>
                        <v-card-title density="compact">
                            <small class="text-subtitle-2">{{ libelle }}</small>
                        </v-card-title>

                        <v-card-title density="compact">
                            <MyTextField name_lab_text="FACT INITIAL" style="width: 130px" hide-details="auto"
                                v-model="factinit" @input="convertToUpperCase" placeholder="FA211114079">
                            </MyTextField>
                        </v-card-title>

                        <v-card-title density="compact">
                            <MyTextField name_lab_text="FACT PARTIEL" style="width: 130px" hide-details="auto"
                                v-model="factpart" @input="convertToUpperCase" placeholder="FP21110001">
                            </MyTextField>
                        </v-card-title>
                        <v-card-title density="compact">
                            <MyTextField name_lab_text="PREPARATION" style="width: 130px" hide-details="auto"
                                v-model="prep" @input="convertToUpperCase" placeholder="">
                            </MyTextField>
                        </v-card-title> -->

                        <v-row align="center" style="margin-bottom: 5px;">
                            <v-col cols="auto">
                                <v-card-title class="date-input">
                                    <v-text-field type="date" label="Date" v-model="date_deb" single-line hide-details
                                        :disabled="loading" color="deep-purple-accent-4" density="compact" clearable>
                                    </v-text-field>
                                </v-card-title>
                            </v-col>
                            <b>AU</b>
                            <v-col cols="auto">
                                <v-card-title class="date-input">
                                    <v-text-field type="date" label="Date" v-model="date_fin" single-line hide-details
                                        :disabled="loading" color="deep-purple-accent-4" density="compact" clearable>
                                    </v-text-field>
                                </v-card-title>
                            </v-col>

                            <v-col cols="auto">
                                <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading"
                                    density="compact">Rechercher</v-btn>
                            </v-col>
                        </v-row>



                        <!-- <v-spacer />
                        <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading"
                            density="compact">Rechercher</v-btn> -->
                    </v-card-actions>

                    <v-dialog v-model="dialogVisible" :persistent="true" width="1500px" height="750px">
                        <PagePPdet :pp_code="PPLCODE" :code_client="PPCODECLIENT" :client="PPCLIENT"  :date="PPDATE" :facture_part="PPFACTPART" 
                            @annuler="onAnnuler" @save="onSave" />
                    </v-dialog>

                    <div :class="{ 'blur-background': dialogVisible }" class="pa-2">
                        <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                            density="compact">
                        </v-progress-linear>
                        <MyLoading :loading="chagmt" @close="chagmt = false" :articles="pps"></MyLoading>
                        <MyTable :headers="headers" action1="Détail" @action1Item="ShowDet" 
                        action2="Imprimer" @action2Item="printPP"
                        :items="list" height="590">
                        </MyTable>
                    </div>
                </v-main>
            </v-container>
        </v-app>
    </v-card>
</template>

<script>
import MyTable from '@/components/prepa/MyTablePP.vue';
import MyTabs from '@/components/MyTabs.vue';
import swal from 'sweetalert2';
import {
    VApp,
    VAppBar,
    VMain,
} from 'vuetify/lib/components';
import { usePPStore } from '@/store/Apreparer/listepp';
import { useClientStore } from '@/store/utils/client';
import { ref, reactive, onMounted, computed, onBeforeMount, defineComponent, watch } from "vue";
import { useRouter } from 'vue-router'
import prepareCmd from "@/views/prepa/PreparerCmd.vue"
import { useEtapeStore } from "@/store/utils/etape.js";
import { useLockStore } from '@/store/utils/lock';
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js"

import { useOnline } from '@vueuse/core';
import MyTextField from '@/components/MyTextField.vue';
import Autocomplete from "@/components/prepa/MyAutocompleteClient.vue";
import dayjs from 'dayjs';
import MyLoading from "@/components/Loading";
import { useReportPPStore } from "@/store/report/printPP";
import PagePPdet from '@/views/prepa/PagePPdet.vue';

export default defineComponent({
    components: {
        MyTable,
        MyTabs,
        prepareCmd,
        MyTextField,
        Autocomplete,
        MyLoading,
        PagePPdet,

    },

    methods: {
        onHome() {
            this.$router.push('/AccueilPage');
        },
    },

    setup() {
        const store = usePPStore();
        const storeClient = useClientStore()
        // const loading = store.loading;
        const storeEtape = useEtapeStore();
        const loading = computed(() => store.loading)
        const dialogVisible = ref(false);
        const router = useRouter();
        const isOnline = useOnline();
        useSessionTimeout(Config.DURRE_SESSION, router);


        const user = localStorage.getItem('username');
        const list = ref([]);
        const listClient = ref([]);

        const factinit = ref('');
        const factpart = ref('');
        const prep = ref('');

        const today = dayjs().format('YYYY-MM-DD'); // Format: YYYY-MM-DD
        const date_deb = ref(today);
        const date_fin = ref(today);
        const PPLCODE = ref();
        const chagmt = ref(false);
        const pps = ref('');
        const storePrint = useReportPPStore();

        const PPCODECLIENT = ref();
        const PPCLIENT = ref();
        const PPDATE = ref();
        const PPFACTPART = ref();



        const printPP = async (item) => {
            chagmt.value = true;
            PPLCODE.value = item.ppL_code

            console.log(item.ppL_code)
            pps.value = item.ppL_code;
            const response = await storePrint.generateReportPP(item.ppL_code);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            URL.revokeObjectURL(url);
            chagmt.value = false;
            await listPP();
            await storeEtape.fetchEtape();
        }

        const ShowDet = async (item) => {
            PPLCODE.value = item.ppL_code
            PPCODECLIENT.value = item.code_client;
            PPCLIENT.value = item.nom_client;
            PPDATE.value = item.fp_date;
            PPFACTPART.value = item.ppL_FpCode;

            dialogVisible.value = true;   
            await storeEtape.fetchEtape();
        }

        const headers = [
            { title: 'PREP', align: 'start', key: 'ppL_code', width: '1%' },
            { title: 'CODE CLIENT', align: 'center', key: 'code_client', width: '2%' },
            { title: 'NOM CLIENT', align: 'start', key: 'nom_client', width: '2%' },
            { title: 'DATE', align: 'start', key: 'fp_date', width: '2%' },
            { title: 'FACT INITALE', align: 'start', key: 'ppL_facture', width: '2%' },
            { title: 'FACT PARTIELLE', align: 'start', key: 'ppL_FpCode', width: '2%' },
            // { title: 'PPIMPRIME', align: 'center', key: 'pp_imprime', width: '6%' },
            { title: 'Actions', align: 'center', key: 'actions', value: 'actions', width: '1%' },
        ]


        const convertToUpperCase = () => {
            factinit.value = factinit.value.toUpperCase();
            factpart.value = factpart.value.toUpperCase();
            prep.value = prep.value.toUpperCase();
        };


        const searchEvent = async () => {
            listPP();
            // console.log(select.value);
            await storeEtape.fetchEtape();
        }

        onMounted(async () => {
            // await run_list_prepa();
            listPP.value = [];
            await listPP();
            await storeEtape.fetchEtape();

        })

        const listPP = async () => {
            list.value = []; // Initialiser avec un tableau vide
            await store.fecthlistPP(date_deb.value, date_fin.value);
            list.value = Array.isArray(store.listPPs) ? store.listPPs : [];
        };

        const onAnnuler = async () => {
            dialogVisible.value = false;
            listPP();
            await storeEtape.fetchEtape();
        };


        return {
            headers, searchEvent, loading,
            convertToUpperCase, factinit, factpart, prep,
            user, isOnline,
            listPP, list,
            date_deb, date_fin,
            printPP,PPLCODE,pps,chagmt,
            ShowDet,PPCODECLIENT,PPCLIENT,PPDATE,PPFACTPART,
            dialogVisible,onAnnuler,

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

.blur-background {
  filter: blur(5px);
  pointer-events: none;
}
</style>
