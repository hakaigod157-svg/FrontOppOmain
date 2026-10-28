<template>

    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">

                    <MyTabsFacturio :StoreAdv="useEtapeStoreAdv"></MyTabsFacturio>

                </v-card>
                <v-spacer></v-spacer>


                <div class="ma-3">
                    <p class="font-weight-thin text-shadow">
                        Delai Normal :<b>{{ storeAlert.alertes.val }} </b>
                    </p>

                    <p class="font-weight-thin text-shadow">
                        Début Alerte : <b>{{ storeAlert.alertes.alerte }}</b>
                    </p>
                </div>
                <v-divider vertical></v-divider>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                <!-- test deploiement -->

                <div>
                    <v-btn @click="onHome">
                        <v-img :width="20" :src="require('@/assets/home.png')"></v-img>
                    </v-btn>
                </div>
            </v-app-bar>

            <v-main style="--v-layout-top: 45px" app>
                <v-card-actions density="compact" style="background-color: #FAFAFA;">
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
                                size="large">
                                Actualiser
                            </v-btn>
                        </v-col>
                        <!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
                        <v-col cols="auto">
                            <div class="max">
                                <div style="overflow-y: auto; max-height: 100px;">
                                    <div style="position: sticky; top: 0; background-color: #b8b3cc;">
                                        <v-table fixed-header density="compact">
                                            <thead>
                                                <tr>
                                                    <th class="text-start" style="background-color: #b8b3cc;">
                                                        DATE
                                                    </th>
                                                    <th class="text-start"
                                                        style="background-color: #b8b3cc; color: black; ">
                                                        A RAPPELER
                                                    </th>
                                                    <th class="text-start"
                                                        style="background-color: #b8b3cc; color: black; ">
                                                        RAPPELÉ
                                                    </th>
                                                    <th class="text-start"
                                                        style="background-color: #b8b3cc; color: black; ">
                                                        RAPPELÉ A TEMP
                                                    </th>
                                                    <th class="text-start"
                                                        style="background-color: #b8b3cc; color: black;">
                                                        MOYENNE
                                                    </th>
                                                </tr>
                                            </thead>
                                        </v-table>
                                    </div>
                                    <v-table fixed-header density="compact">
                                        <tbody>
                                            <tr v-for="item in moyenne" :key="item.date">
                                                <td>{{ formatDateTime(item.date) }}</td>
                                                <td>{{ item.a_rappeler }}</td>
                                                <td>{{ item.rappele }}</td>
                                                <td>{{ item.rappele_a_temp }} </td>
                                                <td>{{ item.moyenne }} mn</td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </div>
                            </div>

                        </v-col>

                        <!-- <v-col>
                            <BarChart/>
                        </v-col> -->

                    </v-row>
                </v-card-actions>

                <div class="pa-2">
                    <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact">
                    </v-progress-linear>

                    <v-dialog v-model="dialogVisible" :persistent="true" width="1500px" height="500px">
                        <firstCall :numero="numero" :calldate=calldate :nomclient=nomclient :seqEntrant=seq
                            @annuler="onAnnuler" @save="onSave" />
                    </v-dialog>

                    <v-dialog v-model="dialogVisibleSecondCall" :persistent="true" width="1500px" height="500px">
                        <secondCall :numero="numero" :daterappel_1=daterappel_1 :nomclient=nomclient :seqEntrant=seq
                            @annuler="onAnnulerSecond" @save="onSaveSecond" />
                    </v-dialog>

                    <v-dialog v-model="dialogVisibleAdd" :persistent="true" width="1100px" height="500px">
                        <add :numero="numero" :seqEntrant=seq @annuler="onAnnulerAdd" @save="onSaveSecond" />
                    </v-dialog>

                    <v-dialog v-model="dialogVisibleActions" :persistent="true" width="350px">
                        <actions :numero="numero" :calldate=calldate :nomclient=nomclient :seqEntrant=seq
                            :delock="delock" :listAppelEntrant="listAppelEntrant" @annuler="onAnnulerActions"
                            @save="onSaveActions" />
                    </v-dialog>

                    <v-card>
                        <MyTableFact :headers="headers" :items="list" v-model:search="search" :count="countCouleur1"
                            :countRappel="countRappel" :countAttente="countAttente" :listAppelEntrant="listAppelEntrant"
                            action1="Actions" @action1Item="Showactions" action4="1er Rappel"
                            @action4Item="premierrappel" action5="2eme Rappel" @action5Item="deuxmrappel"
                            :disabled="loading" @action3Item='add' @action6Item="delname">
                        </MyTableFact>

                        <!-- showarappeler -->
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
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import { useAppelEntrantStore } from "@/store/SuiviFacturation/appelEntrant";
import { useClientStore } from "@/store/utils/client";
import MyTabsFacturio from '@/components/facturio/MyTabsFacturio.vue';
import swal from 'sweetalert2';
import useSessionTimeout from '@/utils/useSessionTimeout';
import firstCall from '@/views/suivifacturation/firstCall.vue'
import secondCall from '@/views/suivifacturation/secondCall.vue'
import add from '@/views/suivifacturation/addClient.vue'
import actions from '@/views/suivifacturation/actions.vue'
import Config from "@/utils/config.js"
import dayjs from 'dayjs';
import MyTableFact from '@/components/facturio/MyTableFact.vue';
import { useLockStore } from '@/store/utils/lock';
import { useAlerteStore } from "@/store/utils/alerte.js";



import BarChart from '@/components/facturio/BarChart.vue'



export default defineComponent({
    components: {
        MyTabsFacturio,
        MyTableFact,
        firstCall,
        secondCall,
        add,
        actions,
        BarChart,
    },

    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },

    setup() {

        const isOnline = useOnline();
        const user = localStorage.getItem('username');
        const StoreAdv = useEtapeStoreAdv();
        const router = useRouter();
        const dialog = ref(false);
        const dialogVisible = ref(false);
        const dialogVisibleSecondCall = ref(false);
        const dialogVisibleAdd = ref(false);
        const dialogVisibleActions = ref(false);
        useSessionTimeout(Config.DURRE_SESSION, router);
        const today = dayjs().format('YYYY-MM-DD'); // Format: YYYY-MM-DD
        const date_deb = ref(today);
        const date_fin = ref(today);
        const loading = computed(() => store.loading)
        const isCallOne = ref(false);
        const store = useAppelEntrantStore();
        const stores = useClientStore();
        const list = ref([]);
        const numero = ref();
        const client = ref();
        const calldate = ref();
        const nomclient = ref();
        const seq = ref();
        const daterappel_1 = ref();
        const countCouleur1 = ref(0);
        const countRappel = ref(0);
        const countAttente = ref(0);
        const moyenne = ref([]);
        const storeAlert = useAlerteStore();
        const m_count = ref(0);

        const ip_local = localStorage.getItem('ip_local');

        const lockStore = useLockStore();
        const isLock = ref(false);
        const ip_server = ref('');

        onMounted(async () => {
            list.value = [];
            await listAppelEntrant();
            await SeeMoyenne();
            await fetchAlerte();
            // console.log(list.value)

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



        const headers = [
            // { title: 'Seq', align: 'center', key: 'seq', sortable: true },
            { title: 'DATE', align: 'center', key: 'calldate', sortable: true },
            { title: 'SOURCE', align: 'start', key: 'numero', sortable: true },
            { title: '', align: 'center', key: 'add', sortable: true },
            { title: 'CLIENT', align: 'start', key: 'client', sortable: true },
            // { title: 'CONTACT', align: 'center', key: 'numero', sortable: true },
            // { title: 'NUMERO INDICATIF', align: 'start', key: 'numero_indicatif' },
            // { title: 'LOCALISATION', align: 'start', key: 'dcontext' },
            // { title: 'APPEL', align: 'start', key: 'dst' },
            // { title: 'CHANNEL', align: 'start', key: 'dstchannel' },
            { title: 'POSTE INTERNE', align: 'center', key: 'poste_interne', sortable: true },
            // { title: 'DUREE(s)', align: 'end', key: 'duration' },
            { title: 'DUREÉ APPEL(s)', align: 'center', key: 'billsec', sortable: true },
            // { title: 'DISPOSITION', align: 'start', key: 'disposition' },
            { title: 'STATUS', align: 'start', key: 'statut', sortable: true },
            { title: '1er Rappel', align: 'center', key: 'rappel1', sortable: true },
            { title: '2eme Rappel', align: 'start', key: 'rappel2', sortable: true },
            { title: 'DEPUIS(mn)', align: 'start', key: 'depuis', sortable: true },
            { title: 'ACTION', align: 'start', key: 'action', value: 'action', sortable: true },

        ];


        const SeeMoyenne = async () => {
            await store.fetchMoyenne(date_deb.value, date_fin.value)
            moyenne.value = store.Moyennes;
        }

        const listAppelEntrant = async () => {
            await store.fetchAppelEntrant(date_deb.value, date_fin.value)
            list.value = store.AppelEntrants

            countCouleur1.value = list.value.filter(item => item.couleur === 1).length;

            countRappel.value = list.value.filter(item => item.rappel === 1).length;

            countAttente.value = list.value.filter(item => item.etat === 0).length;

            // console.log(countCouleur1)
        }

        const searchEvent = async () => {
            loading.value = true;
            list.value = [];
            await SeeMoyenne();
            await listAppelEntrant();

        }


        const onAnnuler = async () => {
            dialogVisible.value = false;
            isCallOne.value = false;
            listAppelEntrant();
        };

        const onAnnulerSecond = async () => {
            dialogVisibleSecondCall.value = false;
            listAppelEntrant();
        };

        const onAnnulerActions = async () => {
            dialogVisibleActions.value = false;
            // listAppelEntrant();
        };

        const onAnnulerAdd = async () => {
            dialogVisibleAdd.value = false;
            listAppelEntrant();
        };

        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }

        };

        const delname = async (item) => {
            numero.value = item.numero;
            client.value = item.client;

            swal.fire({
                title: `Voulez-vous supprimer le nom du client : <br><span style="color: #43A047;">${client.value}</span> ?`,
                showDenyButton: true,
                showCancelButton: false,
                allowOutsideClick: false,
                confirmButtonText: 'Oui',
                denyButtonText: `Non`,
                icon: "warning",
                customClass: {
                    popup: 'custom-width'
                }
            })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        const numero = item.numero;
                        await stores.updateName(numero);
                        listAppelEntrant();

                        // Notification for modification enregistrée
                        swal.fire({
                            icon: 'success',
                            title: 'Modification enregistrée',
                            showConfirmButton: false,
                            timer: 1500
                        });

                    } else if (result.isDenied) {
                        // swal.fire('Transfert annuler', '', 'info');
                    }
                });

        }



        const delock = async () => {
            dialogVisible.value = false;
            const params = {
                xTable: 'FAPPEL',
                xCode: seq.value,
                isClose: 1,
            }
            await lockStore.fetchLock(params);
            // history.back();
        }

        const Showactions = async (item) => {
            numero.value = item.numero;
            calldate.value = item.calldate;
            nomclient.value = item.client;
            seq.value = item.seq;


            const params = {
                xTable: 'FAPPEL',
                xCode: seq.value,
                isClose: 0,
            }
            await lockStore.fetchLock(params);

            if (lockStore.locks.etat === 1) {
                isLock.value = true;

                const Toast = swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    onOpen: (toast) => {
                        toast.addEventListener('mouseenter', swal.stopTimer)
                        toast.addEventListener('mouseleave', swal.resumeTimer)
                    }
                });

                Toast.fire({
                    icon: 'error',
                    title: 'Numéro déjà pris en charge par un autre utilisateur',
                    background: '#FFF3E0',
                });

                dialogVisibleActions.value = false
                listAppelEntrant();
                return;

            } else {
                dialogVisibleActions.value = true

            }

            await store.fetchxTest_maj(seq.value);
            m_count.value = store.xTest_majs;

            // console.log(result)

            if (m_count.value > 0) {

                const Toast = swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    onOpen: (toast) => {
                        toast.addEventListener('mouseenter', swal.stopTimer)
                        toast.addEventListener('mouseleave', swal.resumeTimer)
                    }
                });

                Toast.fire({
                    icon: 'error',
                    title: 'Numéro déjà traité par un autre utilisateur',
                    background: '#FFF3E0',
                });
                dialogVisibleActions.value = false
                listAppelEntrant();
                return;

            } else {
                dialogVisibleActions.value = true
            }

        }

        const premierrappel = async (item) => {
            numero.value = item.numero;
            calldate.value = item.calldate;
            nomclient.value = item.client;
            seq.value = item.seq;

            dialogVisible.value = true;

            // console.log(numero)
            // console.log('nom client :'+nomclient.value)


            // router.push({ name: 'firstCall', params: { numero } });

        }

        const deuxmrappel = async (item) => {
            numero.value = item.numero;
            nomclient.value = item.client;
            seq.value = item.seq;
            daterappel_1.value = item.daterappel_1;
            dialogVisibleSecondCall.value = true;
        }

        const add = async (item) => {
            // console.log('kaka')
            numero.value = item.numero;
            seq.value = item.seq;
            dialogVisibleAdd.value = true;
        }

        const fetchAlerte = async () => {
            const code = 'RappelClie'
            storeAlert.params.code = code
            await storeAlert.fetchAlerte(code);


        }


        return {
            isOnline, user, StoreAdv, dialogVisible, dialogVisibleSecondCall, dialogVisibleAdd, dialogVisibleActions, dialog, headers, date_deb, date_fin,
            list, listAppelEntrant, searchEvent, Showactions, premierrappel, isCallOne, onAnnulerSecond, onAnnulerActions, onAnnuler, onAnnulerAdd, numero, calldate, nomclient, seq, client,
            loading, deuxmrappel, daterappel_1, add, delname, ip_local, countCouleur1, countRappel, countAttente, isLock, delock, SeeMoyenne, moyenne, formatDateTime, fetchAlerte, storeAlert,
            ip_server,

        };

    }

})

</script>
<style>
.custom-width {
    width: 650px !important;
}

.max {
    /* max-height: 100px; */
    overflow: auto;
}

.text-shadow {
    text-shadow: #FC0 1px 0 10px;
}
</style>