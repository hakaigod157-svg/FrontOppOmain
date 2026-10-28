<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabsExped></MyTabsExped>
                </v-card>
                <v-spacer></v-spacer>

                <div>
                    <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{ ip_server}}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;

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
            <v-main :class="{ 'blur-effect': drawer || seeDetail }" style="--v-layout-top: 40px" app>
                <v-card-actions density="compact">
                    <v-card-title density="compact">
                        <v-select :disabled="isUpdating" :items="transporteur" v-model="transporteurCode"
                            style="width: 200px; height: 35px" item-title="xnum" item-value="xnum" label="Transporteur"
                            :min-length="3" density="compact" clearable hide-no-data :loading="loading"
                            color="deep-purple-accent-4" @keydown.enter="searchEvent">
                        </v-select>
                    </v-card-title>

                    <v-card-title density="compact"></v-card-title>
                    <span density="compact"><b>Date facture du</b></span>

                    <v-card-title>

                        <v-text-field v-model="dateDeb" type="date" label="Date Livraison" single-line hide-details
                            color="deep-purple-accent-4" density="compact" clearable></v-text-field>
                    </v-card-title>
                    <span density="compact"><b>Au</b></span>
                    <v-card-title>
                        <v-text-field v-model="dateFin" type="date" label="Date Livraison" single-line hide-details
                            color="deep-purple-accent-4" density="compact" clearable></v-text-field>
                    </v-card-title>

                    <v-spacer />

                    <v-row>
                        <v-col cols="auto">
                            <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading" size="large"
                                density="compact">Rechercher
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-btn icon="mdi-plus-box" size="large" @click="addLV"></v-btn>

                </v-card-actions>

                <div class="pa-2">

                    <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact"></v-progress-linear>

                    <MyTableExped v-if="!loading" :headers="headers" :items="list" height="590" @edit="onEdit($event)"
                        @detail_nb_cmd="detailNbCmd($event)" valider="&nbsp;Valider" @action1Item="onValideLv($event)">
                    </MyTableExped>

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
    <addLV :editedItem="editedItem" v-if="drawer" :drawer="drawer" @close="drawer = false" @onValide="onValide"></addLV>

    <detailLv v-if="seeDetail" :seeDetail="seeDetail" :trans_code="trans_code" @close="seeDetail = false"></detailLv>

</template>
<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import MyTabsExped from '@/components/expedition/MytabsExped.vue';
import MyTableExped from '@/components/expedition/MyTableExped.vue';
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import MyTextarea from '@/components/MyTextarea.vue';
import Swal from 'sweetalert2';
import { useTransporteurStore } from "@/store/utils/transporteur.js";
import addLV from '@/views/expedition/addLV.vue';
import { useFactTransStore } from "@/store/Expedition/facTrans.js";
import { listIcons } from "@iconify/vue";
import useConfirmation from "@/composables/useConfirmationToast";
import detailLv from '@/views/expedition/Detail_nb_cmd.vue';
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";

export default defineComponent({
    components: {
        MyTabsExped,
        MyTableExped,
        MyTextarea,
        addLV,
        detailLv,

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
        const loading = computed(() => storeFacTrans.loading)
        const storeTransporteur = useTransporteurStore();
        const transporteur = ref([]);
        const list = ref([]);
        const transporteurCode = ref('');
        const dateDeb = ref('');
        const dateFin = ref('');
        const editedItem = ref(null);
        const storeFacTrans = useFactTransStore();
        const { confirmAction } = useConfirmation();
        const drawer = ref(false);
        const seeDetail = ref(false);
        const trans_code = ref('');
        const ip_server = ref('');

        const listTransporteur = async (item) => {
            // list.value = [];
            await storeTransporteur.fetchTransporteurs(`xType in ('TRANS','POSTE','COLIS')`);
            transporteur.value = storeTransporteur.transporteurs;
        }

        const addLV = (item) => {
            editedItem.value = null;
            drawer.value = true;

        };

        const onEdit = (item) => {
            editedItem.value = item;
            drawer.value = true;
        };


        const detailNbCmd = (item) => {
            trans_code.value = item.trans_code
            seeDetail.value = true;
        };


        const onAnnulerLV = async () => {
            drawer.value = false;
        };

        const list_attribution_lv = async (item) => {
            list.value = [];
            await storeFacTrans.fetchListAttributionLvs(transporteurCode.value ? transporteurCode.value.trim() : null, dateDeb.value, dateFin.value);
            list.value = storeFacTrans.attributions;
        };

        const onValide = async () => {
            await list_attribution_lv();
        }

        const onValideLv = async (item) => {

            if (item.nb_lv == 0) {
                document.querySelector("#app").classList.add("blurred");

                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Impossible de valider - LV pas encore attribuée",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    //timer: 1500
                });

                document.querySelector("#app").classList.remove("blurred");
                return;

            }
            else {
                document.querySelector("#app").classList.add("blurred");
                // console.log("Valide ");
                const confirmed = await confirmAction(
                    "Confirmation Attribution LV",
                    "Voulez-vous vraiment valider les informations sur un LV  <span style='color: #05acdc;</span> de <span style='color: #05acdc;'> </span> ?"
                );
                document.querySelector("#app").classList.remove("blurred");
                if (confirmed) {
                    trans_code.value = item.trans_code;
                    console.log(trans_code.value);
                    await storeFacTrans.updateTransValide(trans_code.value);
                    await list_attribution_lv();

                }
            }

        }


        const headers = [
            // { title: 'CODE', align: 'start', key: 'trans_code' },
            { title: 'FACTURE', align: 'start', key: 'trans_num_fact' },
            { title: 'DATE', align: 'start', key: 'trans_date_fact', sortable: true },
            { title: 'TRANSPORTEUR', align: 'start', key: 'trans_transport', sortable: true, width: '1%' },
            { title: 'MONTANT', align: 'end', key: 'trans_montant', sortable: true },
            { title: 'NOMBRE LIV', align: 'center', key: 'nb_lv' },
            { title: 'NOMBRE COMMANDE', align: 'center', key: 'nb_cmd' },
            { title: 'NOMBRE COLIS', align: 'center', key: 'nb_colis' },
            { title: 'ACTIONS', align: 'start', key: 'actions' },
        ]

        onMounted(async () => {
            listTransporteur();
            list.value = [];
            await list_attribution_lv();


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
            list_attribution_lv();
        }

        const totalList = computed(() => {
            return list.value.length;
        });



        // const handleKeydown = (event) => {
        //     if (event.key === 'Escape' && dialogVisibleSolde.value) {
        //         onAnnuler();
        //     } else if (event.key === 'Escape' && dialogVisibleCmdEncours.value){
        //         onAnnulerEncours();
        //     } else if (event.key === 'Escape' && dialogVisibleAvance.value) {
        //         onAnnulerAvance();
        //     } else if (event.key === 'Escape' && dialogVisibleRegleClt.value){
        //         onAnnulerRegleClt();
        //     } else if (event.key === 'Escape' && dialogVisibleCommande.value) {
        //         onAnnulerCommande();
        //     }
        // };

        // onMounted(() => {
        //     window.addEventListener('keydown', handleKeydown);
        // });

        // // Supprimer l'écouteur lors du démontage du composant
        // onUnmounted(() => {
        //     window.removeEventListener('keydown', handleKeydown);
        // });





        return {
            headers, isOnline, user, list, totalList, dateDeb, dateFin,
            searchEvent,
            loading,
            listTransporteur, transporteur, transporteurCode,
            addLV, drawer, onAnnulerLV, editedItem,
            list_attribution_lv, onValide, onEdit, onValideLv,
            trans_code,
            detailNbCmd, seeDetail,
            ip_server,


        };
    },
})
</script>

<style>
/* .plafond--text.text--plafond {
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
} */


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

.blurred {
    filter: blur(5px);
    pointer-events: none;
    /* Empêche les interactions */
}
</style>