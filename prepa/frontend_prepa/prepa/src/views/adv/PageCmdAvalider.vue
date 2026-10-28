<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabsAdv :disabled="loading" :storeEtape="storeEtape"></MyTabsAdv>
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
                :class="{ 'blur-effect': dialogVisibleSolde || dialogVisibleCmdEncours || dialogVisibleAvance || dialogVisibleRegleClt || dialogVisibleCommande || drawer }"
                style="--v-layout-top: 40px" app>
                <v-card-actions density="compact">
                    <!-- <v-spacer/> -->
                    <v-row class="pt-2" align="center">
                        <v-col cols="auto">
                            <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading" size="large"
                                density="compact">
                                Actualiser
                            </v-btn>
                        </v-col>
                        <v-col class="d-flex justify-center">
                            <v-chip class="ma-2" color="#BBDEFB" variant="elevated" label>
                                ATTENTE ADV
                                <v-badge :content="atte_action" color="#42A5F5" inline></v-badge>
                            </v-chip>
                            <v-chip class="ma-2" color="#EF5350" variant="elevated" label>
                                PLAFOND DEPASSE + RETARD DE PAIEMENT
                                <v-badge :content="plafond_retard" color="#D50000" inline></v-badge>
                            </v-chip>
                            <v-chip class="ma-2" color="#FFCC99" variant="elevated" label>
                                RETARD DE PAIEMENT
                                <v-badge :content="retard_paiement" color="#FFA000" inline></v-badge>
                            </v-chip>
                            <v-chip class="ma-2" color="#FF99CC" variant="elevated" label>
                                PLAFOND DEPASSE
                                <v-badge :content="plafond_depasse" color="#AD1457" inline></v-badge>
                            </v-chip>
                        </v-col>
                    </v-row>
                </v-card-actions>

                <div class="pa-2">

                    <v-dialog v-if="dialogVisibleSolde" v-model="dialogVisibleSolde" :persistent="true" width="1500px"
                        height="670px">
                        <solde :codeclient="code_client" :nomclient="nom_client" :type="type" @annuler="onAnnuler"
                            @save="onSave" />
                    </v-dialog>

                    <v-dialog v-if="dialogVisibleCmdEncours" v-model="dialogVisibleCmdEncours" :persistent="true"
                        width="850px" height="600px">
                        <cmdencours :codeclient="code_client" :nomclient="nom_client" :type="type"
                            @annuler="onAnnulerEncours" @save="onSave" />
                    </v-dialog>

                    <v-dialog v-if="dialogVisibleAvance" v-model="dialogVisibleAvance" :persistent="true" width="1200px"
                        height="600px">
                        <avance :codeclient="code_client" :nomclient="nom_client" :type="type"
                            @annuler="onAnnulerAvance" @save="onSave" />
                    </v-dialog>

                    <v-dialog v-if="dialogVisibleRegleClt" v-model="dialogVisibleRegleClt" :persistent="true"
                        width="1200px" height="600px">
                        <reglement :codeclient="code_client" :nomclient="nom_client" :type="type"
                            @annuler="onAnnulerRegleClt" @save="onSave" />
                    </v-dialog>
                    <!-- Commande -->
                    <v-dialog v-if="dialogVisibleCommande" v-model="dialogVisibleCommande" :persistent="true"
                        width="1200px" height="600px">
                        <commande :codeclient="code_client" :nomclient="nom_client" :type="type"
                            @annuler="onAnnulerCommande" @save="onSave" />
                    </v-dialog>

                    <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact"></v-progress-linear>

                    <MyTableAdv v-if="!loading" :headers="headers" :items="list" height="590" action1="&nbsp;Valider"
                        @action1Item="onValideADV" @actionSolde="showSolde" @actionEchue="showEchue"
                        @actionAvance="showAvance" @actionClient="showRegleClt" @actionCommande="showCommande"
                        @actionCmdEncours="showCmdEncours" action2="Bloquer" @action2Item="onBloqueADV">
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
    <digValideAdv :editedItem="editedItem" v-if="drawer" :drawer="drawer" @close="drawer = false"
        @onValide="onValideAddItem"></digValideAdv>
</template>
<script>
import { defineComponent, ref, computed, onMounted, onUnmounted, onBeforeMount } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import MyTabsAdv from '@/components/adv/MyTabsAdv.vue';
import MyTableAdv from '@/components/adv/MyTableAdv.vue'
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import MyTextarea from '@/components/MyTextarea.vue';
import { useValidationCommandeStore } from "@/store/Adv/adv.js";
import solde from '@/views/adv/PageSolde.vue';
import cmdencours from '@/views/adv/PageCmdEncours.vue';
import avance from '@/views/adv/PageAvance.vue';
import reglement from '@/views/adv/PageRegelementClient.vue';
import commande from '@/views/adv/PageCommande.vue';
import digValideAdv from "./digValideAdv.vue";
import Swal from 'sweetalert2';
import { useEtapeAdv } from "@/store/Adv/etape.js"


export default defineComponent({
    components: {
        MyTabsAdv,
        MyTableAdv,
        MyTextarea,
        solde,
        cmdencours,
        avance,
        reglement,
        commande,
        digValideAdv

    },

    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },

    setup(props) {
        const drawer = ref(false);
        const isOnline = useOnline();
        const router = useRouter();
        const user = localStorage.getItem('username');
        const loading = computed(() => store.loading)
        const StoreAdv = useEtapeStoreAdv();
        const store = useValidationCommandeStore();
        const list = ref([]);
        //Tsy code client no raisin'ity fa lasa CC
        const code_client = ref();
        const cdeclient = ref();
        const nom_client = ref();

        const dialogVisibleSolde = ref(false);
        const dialogVisibleCmdEncours = ref(false);
        const dialogVisibleAvance = ref(false);
        const dialogVisibleRegleClt = ref(false);
        const dialogVisibleCommande = ref(false);
        const editedItem = ref(null);

        const list_solde = ref([]);
        const type = ref();

        const plafond_retard = ref(0);
        const retard_paiement = ref(0);
        const plafond_depasse = ref(0);
        const atte_action = ref(0);

        const storeEtape = useEtapeAdv();
        const ip_server = ref('');

        const headers = [
            { title: 'ACTIONS', align: 'start', key: 'action', sortable: true },
            { title: 'CODE', align: 'start', key: 'code', sortable: true },
            { title: 'DATE', align: 'start', key: 'date', sortable: true, width: '1%' },
            { title: 'MONTANT', align: 'end', key: 'cmd' },
            { title: 'CLIENT', align: 'center', key: 'code_client', sortable: true },
            { title: 'NOM CLIENT', align: 'start', key: 'nom_client' },
            // { title: 'MODE', align: 'start', key: 'mode', width: '1%' },
            { title: 'CONDITION', align: 'start', key: 'condition' },
            { title: 'PLAFOND', align: 'end', key: 'plafond' },
            // { title: 'ETAPE ADV', align: 'end', key: 'etape_adv' },
            { title: 'SOLDE', align: 'end', key: 'solde' },
            { title: 'FACTURE ECHUE', align: 'end', key: 'facture_echue' },
            { title: 'CDE ENCOURS', align: 'end', key: 'cmd_encours' },
            { title: 'AVANCE', align: 'end', key: 'rg_encours' },
            { title: 'ETAT', align: 'start', key: 'validation_auto' },
            // { title: 'COMMENTAIRE', align: 'start', key: 'commentaire' },
            { title: 'COMMENTAIRE CLIENT', align: 'start', key: 'commentaire_client' },

            // { title: 'DEGRE', align: 'start', key: 'degre' },
        ]


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

        onMounted(async () => {
            list.value = [];
            await list_a_valider();

            // const name_server = localStorage.getItem('name_server');
            // if (name_server === 'SIMUL221') {
            //     ip_server.value = '192.168.130.221';
            // } else if (name_server === 'SIMUL220') {
            //     ip_server.value = '192.168.130.220';
            // }
            // else if (name_server === 'OPHAM') {
            //     ip_server.value = '192.168.130.2';
            // } else {
            //     ip_server.value = name_server || 'Inconnu';
            // }
        })

        const searchEvent = async () => {
            list_a_valider();
        }


        const list_a_valider = async (item) => {
            list.value = [];
            await store.fetchlistavalider();
            list.value = store.listavaliders;

            await storeEtape.fetchEtape();

            plafond_retard.value = '';
            retard_paiement.value = '';
            plafond_depasse.value = '';
            atte_action.value = '';

            plafond_retard.value = list.value.filter(item => item.couleur === 4).length;
            retard_paiement.value = list.value.filter(item => item.couleur === 3).length;
            plafond_depasse.value = list.value.filter(item => item.couleur === 2).length;
            atte_action.value = list.value.filter(item => item.bloque === 1).length;

            // const data = store.listavaliders;
            // list.value = data;

            // // 🔥 Une seule boucle au lieu de 4 filters
            // for (const item of data) {
            //     switch (item.couleur) {
            //         case 4:
            //             plafond_retard.value++;
            //             break;
            //         case 3:
            //             retard_paiement.value++;
            //             break;
            //         case 2:
            //             plafond_depasse.value++;
            //             break;
            //     }

            //     if (item.bloque === 1) {
            //         atte_action.value++;
            //     }
            // }


        }

        const totalList = computed(() => {
            return list.value.length;
        });

        const onAnnuler = async () => {
            dialogVisibleSolde.value = false;
            list_a_valider();
        };

        const onAnnulerEncours = async () => {
            dialogVisibleCmdEncours.value = false;
            list_a_valider();

        };

        const onAnnulerAvance = async () => {
            dialogVisibleAvance.value = false;
            list_a_valider();

        };

        const onAnnulerRegleClt = async () => {
            dialogVisibleRegleClt.value = false;
            list_a_valider();

        };

        const onAnnulerCommande = async () => {
            dialogVisibleCommande.value = false;
            list_a_valider();

        };

        const handleKeydown = (event) => {
            if (event.key === 'Escape' && dialogVisibleSolde.value) {
                onAnnuler();
            } else if (event.key === 'Escape' && dialogVisibleCmdEncours.value) {
                onAnnulerEncours();
            } else if (event.key === 'Escape' && dialogVisibleAvance.value) {
                onAnnulerAvance();
            } else if (event.key === 'Escape' && dialogVisibleRegleClt.value) {
                onAnnulerRegleClt();
            } else if (event.key === 'Escape' && dialogVisibleCommande.value) {
                onAnnulerCommande();
            } else if (event.key === 'Escape' && drawer.value) {
                onValideAddItem();
            }
        };

        // Ajouter l'écouteur à l'événement clavier lors du montage du composant
        onMounted(() => {
            window.addEventListener('keydown', handleKeydown);
        });

        // Supprimer l'écouteur lors du démontage du composant
        onUnmounted(() => {
            window.removeEventListener('keydown', handleKeydown);
        });



        const showSolde = async (item) => {
            code_client.value = item.code;
            nom_client.value = item.nom_client
            type.value = 0;
            // console.log('code client = '+code_client.value)
            dialogVisibleSolde.value = true;

        }

        const showEchue = async (item) => {
            code_client.value = item.code;
            nom_client.value = item.nom_client
            type.value = 1;
            dialogVisibleSolde.value = true;
        }


        const showCmdEncours = async (item) => {
            code_client.value = item.code;
            nom_client.value = item.nom_client
            type.value = 2;
            dialogVisibleCmdEncours.value = true;
        }

        const showAvance = async (item) => {
            code_client.value = item.code;
            nom_client.value = item.nom_client
            type.value = 3;
            dialogVisibleAvance.value = true;
        }

        const showRegleClt = async (item) => {
            code_client.value = item.code;
            nom_client.value = item.nom_client
            type.value = 4;
            dialogVisibleRegleClt.value = true;
        }

        const showCommande = async (item) => {
            code_client.value = item.code;
            nom_client.value = item.nom_client
            type.value = 5;
            dialogVisibleCommande.value = true;
        }

        const onValideAddItem = async (item) => {
            drawer.value = false;
            await list_a_valider();

        };

        const onValideADV = async (item) => {
            console.log(item.code);
            await store.getStade_cmd(item.code);

            console.log('stade :' + store.stade);

            if (store.stade < 3) {
                editedItem.value = item;
                drawer.value = true;
            }

            else {
                Swal.fire({
                    icon: "error",
                    title: "Impossible de valider cette commande",
                    html: "Le stade de ce bon  <span style='color: #05acdc;'>" + item.code + "</span>  est invalide",
                });
                // await store.getStade_cmd(item.code);
            }

        };

        const onBloqueADV = async (item) => {
            await store.getStade_cmd(item.code);

            if (store.stade < 2) {
                await store.onBlockAdv(item.code, localStorage.getItem('ip_local'), item.couleur);

                const infos = store.InfoApresBlocage;

                if (Array.isArray(infos) && infos.length > 0) {
                    let successMessages = [];

                    for (const info of infos) {
                        if (info.stat === 0) {
                            await store.sendSMS(info.numero, info.notification);
                            successMessages.push(`<span style='color: #05acdc;'>${info.numero} (${info.nom_com})</span>`);
                        }
                    }

                    if (successMessages.length > 0) {
                        await Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `Le message de blocage de la commande <span style='color: #05acdc;'>${item.code}</span> a été envoyé à :<br>${successMessages.join("<br>")}`,
                            showConfirmButton: true,
                            confirmButtonText: "OK",
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Impossible de bloquer cette commande",
                            html: `Le stade de ce bon <span style='color: #05acdc;'>${item.code}</span> est invalide pour tous les contacts.`,
                        });
                    }
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Aucune information de blocage retournée.",
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Impossible de bloquer cette commande",
                    html: `Le stade de ce bon <span style='color: #05acdc;'>${item.code}</span> est invalide`,
                });
            }

            await list_a_valider();
        };




        return {
            StoreAdv, headers, isOnline, user, list, totalList,
            searchEvent, list_a_valider,
            store, loading,
            dialogVisibleSolde, dialogVisibleCmdEncours, showSolde, onAnnuler, code_client, type, showEchue, showCmdEncours, onAnnulerEncours,
            showAvance, showRegleClt, showCommande,
            dialogVisibleAvance, dialogVisibleRegleClt, onAnnulerAvance, onAnnulerRegleClt, dialogVisibleCommande, onAnnulerCommande,
            nom_client, drawer, onValideADV, onValideAddItem, editedItem, onBloqueADV,
            plafond_retard, retard_paiement, plafond_depasse, atte_action,
            storeEtape,
            ip_server,

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

.blur-effect {
    filter: blur(5px);
    /* Applique un effet de flou */
    pointer-events: none;
    /* Désactive les interactions avec les éléments flous */
    user-select: none;
    /* Empêche la sélection de texte dans les zones floues */
}
</style>