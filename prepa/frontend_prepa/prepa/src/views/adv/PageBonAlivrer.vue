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
                :class="{ 'blur-effect': dialogVisibleCommande || dialogVisibleReglement || dialogVisibleSolde || dialogVisibleRegleClt }"
                style="--v-layout-top: 40px" app>
                <v-card-actions density="compact">
                    <!-- <v-spacer/> -->
                    <v-row class="pt-2">
                        <v-col cols="auto">
                            <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading" size="large"
                                density="compact">Actualiser
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
                <div class="pa-2">
                    <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact"></v-progress-linear>

                    <v-dialog v-if="dialogVisibleCommande" v-model="dialogVisibleCommande" :persistent="true"
                        width="1200px" height="600px">
                        <commande :codeclient="code_client" :nomclient="nom_client" :type="type"
                            @annuler="onAnnulerCommande" @save="onSave" />
                    </v-dialog>

                    <v-dialog v-if="dialogVisibleReglement" v-model="dialogVisibleReglement" :persistent="true"
                        width="1200px" height="600px">
                        <reglement :codeclient="codecc" :nomclient="nom_client" :type="type"
                            @annuler="onAnnulerReglement" @save="onSave" />
                    </v-dialog>

                    <v-dialog v-if="dialogVisibleSolde" v-model="dialogVisibleSolde" :persistent="true" width="1500px"
                        height="670px">
                        <solde :codeclient="code_cc_solde" :nomclient="nom_client" :type="type"
                            @annuler="onAnnulerSolde" @save="onSave" />
                    </v-dialog>

                    <v-dialog v-if="dialogVisibleRegleClt" v-model="dialogVisibleRegleClt" :persistent="true"
                        width="1200px" height="600px">
                        <reglementClient :codeclient="code_client" :nomclient="nom_client" :type="type"
                            @annuler="onAnnulerRegleft" @save="onSave" />
                    </v-dialog>

                    <MyTableAdv v-if="!loading" :headers="headers" :items="list" action_annuler="  Annuler"
                        action_valider="&nbsp;Valider&nbsp;" @actionValiderBon="valider_bon" @action1Item="annuler_bon"
                        @actionTtc="showCommande" @actionreglement="showreglement" @actionSolde="showSolde"
                        @actionClient="showRegleClt" height="590">
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
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import MyTabsAdv from '@/components/adv/MyTabsAdv.vue';
import MyTableAdv from '@/components/adv/MyTableAdv.vue'
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import MyTextarea from '@/components/MyTextarea.vue';
import { useValidationCommandeStore } from "@/store/Adv/adv.js";
import swal from 'sweetalert2';
import { useEtapeAdv } from "@/store/Adv/etape.js";
import commande from '@/views/adv/PageCommande.vue';
import reglement from '@/views/adv/PageReglementBon.vue';
import reglementClient from '@/views/adv/PageRegelementClient.vue';
import solde from '@/views/adv/PageSolde.vue';


export default defineComponent({
    components: {
        MyTabsAdv,
        MyTableAdv,
        MyTextarea,
        commande,
        reglement,
        solde,
        reglementClient,
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
        const list = ref([]);
        const cc = ref();
        const facture = ref();
        const fanom = ref();
        const storeEtape = useEtapeAdv();
        const dialogVisibleCommande = ref(false);
        const dialogVisibleReglement = ref(false);

        const code_client = ref();
        const nom_client = ref();
        const codecc = ref();
        const code_cc_solde = ref();
        const type = ref();
        const dialogVisibleSolde = ref(false);
        const dialogVisibleRegleClt = ref(false);
        const ip_server = ref('');

        const headers = [
            { title: 'FACTURE', align: 'start', key: 'facture', sortable: true },
            { title: 'COMMANDE', align: 'start', key: 'commande' },
            { title: 'CODE CLIENT', align: 'start', key: 'codeclient', sortable: true },
            { title: 'NOM CLIENT', align: 'start', key: 'nomclient' },
            { title: 'DATE', align: 'start', key: 'date' },
            { title: 'MONTANT TTC ', align: 'end', key: 'ttc' },
            { title: 'ATTE DEPUIS(mn)', align: 'center', key: 'depuis' },
            { title: 'COMMENTAIRES', align: 'start', key: 'commentaires',width:"2px" },
            { title: 'ACTIONS', align: 'start', key: 'actions' },
        ]


        onMounted(async () => {
            list.value = [];
            await list_bon_a_livrer();

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
            list_bon_a_livrer();
        }

        const list_bon_a_livrer = async () => {
            list.value = [];
            await store.fetchBonAlivrer();
            list.value = store.bonalivrers;
            await storeEtape.fetchEtape();
        }


        const totalList = computed(() => {
            return list.value.length;
        });

        const valider_bon = async (item) => {
            cc.value = item.commande;
            facture.value = item.facture;
            fanom.value = item.nomclient;

            await store.getStade_bal(cc.value);
            if (store.accord_stade < 2) {
                swal.fire({
                    title: `La facture : <span style="color: #43A047;">${facture.value}</span> <br> de  ${fanom.value} est validée ?`,
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
                        const cc = item.commande;
                        const commentaire = result.value; // récupère le texte de l'input
                        await store.updateFCC(cc, 2);
                        await store.update_com(cc, commentaire); // tu peux envoyer le commentaire ici si besoin

                        await swal.fire({
                            icon: 'success',
                            title: 'Bon à livrer validé',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        await list_bon_a_livrer();
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
                await list_bon_a_livrer();
            }

        }

        const annuler_bon = async (item) => {
            cc.value = item.commande;
            facture.value = item.facture;
            fanom.value = item.nomclient;

            await store.getStade_bal(cc.value);
            if (store.accord_stade && store.accord_stade === 1) {
                swal.fire({
                    title: `La facture : <span style="color: #43A047;">${facture.value}</span> <br> de  ${fanom.value} est annulée ?`,
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
                        // Ajouter la classe blur au contenu principal
                        document.querySelector('#app').classList.add('blur-active');
                    },
                    willClose: () => {
                        // Retirer la classe blur après la fermeture du popup
                        document.querySelector('#app').classList.remove('blur-active');
                    }
                })
                    .then(async (result) => {
                        if (result.isConfirmed) {
                            const cc = item.commande;
                            await store.updateFCC(cc, 3);


                            // Notification for modification enregistrée
                            swal.fire({
                                icon: 'success',
                                title: 'Bon à livrer annulé',
                                showConfirmButton: false,
                                timer: 1500
                            });

                        } else if (result.isDenied) {
                            // swal.fire('Transfert annuler', '', 'info');
                        }
                    });
            }
            else {
                swal.fire({
                    icon: "error",
                    title: "Impossible d'annuler ce bon",
                    html: "Ce bon  <span style='color: #05acdc;'>" + cc.value + "</span>  a été déjà traité",
                });
            }
            list_bon_a_livrer();
        }

        const onAnnulerCommande = async () => {
            dialogVisibleCommande.value = false;
            list_bon_a_livrer();

        };

        const onAnnulerReglement = async () => {
            dialogVisibleReglement.value = false;
            list_bon_a_livrer();

        };

        const onAnnulerSolde = async () => {
            dialogVisibleSolde.value = false;
            list_bon_a_livrer();


        };
        const onAnnulerRegleft = async () => {
            dialogVisibleRegleClt.value = false;
            list_bon_a_livrer();

        };

        const handleKeydown = (event) => {
            if (event.key === 'Escape' && dialogVisibleCommande.value) {
                onAnnulerCommande();
            }
            else if (event.key === 'Escape' && dialogVisibleReglement.value) {
                onAnnulerReglement();
            }
        }

        // Ajouter l'écouteur à l'événement clavier lors du montage du composant
        onMounted(() => {
            window.addEventListener('keydown', handleKeydown);
        });

        // Supprimer l'écouteur lors du démontage du composant
        onUnmounted(() => {
            window.removeEventListener('keydown', handleKeydown);
        });

        const showCommande = async (item) => {
            code_client.value = item.commande;
            nom_client.value = item.nomclient;
            type.value = 5;
            dialogVisibleCommande.value = true;
        }

        const showreglement = async (item) => {
            codecc.value = item.commande;
            nom_client.value = item.nomclient;
            type.value = 6;
            dialogVisibleReglement.value = true;
        }

        const showSolde = async (item) => {
            code_cc_solde.value = item.commande;
            nom_client.value = item.nomclient
            type.value = 0;
            // console.log('code client = '+code_client.value)
            dialogVisibleSolde.value = true;

        }


        const showRegleClt = async (item) => {
            code_client.value = item.commande;
            nom_client.value = item.nomclient
            type.value = 4;
            dialogVisibleRegleClt.value = true;
        }


        return {
            StoreAdv, headers, isOnline, user, searchEvent, list,
            list_bon_a_livrer,
            store, loading,
            dialogVisible,
            totalList, annuler_bon, valider_bon,
            storeEtape, dialogVisibleCommande, dialogVisibleReglement, dialogVisibleSolde, dialogVisibleRegleClt,
            code_client, nom_client, type, showCommande, onAnnulerCommande, handleKeydown, onAnnulerSolde, showRegleClt, onAnnulerRegleft,
            showreglement, codecc, code_cc_solde, onAnnulerReglement, showSolde,
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

.custom-width-bon {
    width: 850px !important;
}

/* Ajoute un flou au contenu principal lorsque la boîte de dialogue est visible */
.blur-active {
    filter: blur(5px);
    transition: filter 0.3s ease;
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