<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabsInv></MyTabsInv>
                </v-card>
                <v-spacer></v-spacer>

                <div>
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
            <v-main style="--v-layout-top: 40px" app>

                <div class="pa-2">

                    <!-- <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact"></v-progress-linear> -->

                    <!-- <MyTableAdv v-if="!loading" :headers="headers" :items="list" height="590" action1="&nbsp;Valider"
                        @action1Item="onValideADV" @actionSolde="showSolde" @actionEchue="showEchue"
                        @actionAvance="showAvance" @actionClient="showRegleClt" @actionCommande="showCommande"
                        @actionCmdEncours="showCmdEncours" action2="Bloquer" @action2Item="onBloqueADV">
                    </MyTableAdv> -->

                    <!-- <v-card>
                        <v-row>
                            <v-col>
                                <v-sheet class="pl-2">
                                    <b> {{ totalList }}</b> Lignes Trouvées
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </v-card> -->
                </div>
            </v-main>
        </v-app>
    </v-card>
</template>
<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import MyTabsInv from '@/components/inventaire/MyTabsInv.vue';
import MyTableAdv from '@/components/adv/MyTableAdv.vue'
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import MyTextarea from '@/components/MyTextarea.vue';
import { useValidationCommandeStore } from "@/store/Adv/adv.js";
import Swal from 'sweetalert2';
import { useEtapeAdv } from "@/store/Adv/etape.js"


export default defineComponent({
    components: {
        MyTabsInv,
        MyTableAdv,
        MyTextarea,

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
        const list = ref([]);
        //Tsy code client no raisin'ity fa lasa CC
        const code_client = ref();
        const cdeclient = ref();
        const nom_client = ref();

        const type = ref();

        const plafond_retard = ref(0);
        const retard_paiement = ref(0);
        const plafond_depasse = ref(0);
        const atte_action = ref(0);

        const storeEtape = useEtapeAdv();

        const headers = [
            { title: 'ACTIONS', align: 'start', key: 'action' },
            { title: 'CODE', align: 'start', key: 'code', sortable: true },
            { title: 'DATE', align: 'start', key: 'date', sortable: true, width: '1%' },
            { title: 'CLIENT', align: 'start', key: 'code_client', sortable: true },
            { title: 'NOM CLIENT', align: 'start', key: 'nom_client' },
            // { title: 'MODE', align: 'start', key: 'mode', width: '1%' },
            { title: 'CONDITION', align: 'start', key: 'condition' },
            { title: 'PLAFOND', align: 'end', key: 'plafond' },
            // { title: 'ETAPE ADV', align: 'end', key: 'etape_adv' },
            { title: 'SOLDE', align: 'end', key: 'solde' },
            { title: 'FACTURE ECHUE', align: 'end', key: 'facture_echue' },
            { title: 'CDE ENCOURS', align: 'end', key: 'cmd_encours' },
            { title: 'COMMANDE', align: 'end', key: 'cmd' },
            { title: 'AVANCE', align: 'end', key: 'rg_encours' },
            { title: 'VALIDATION', align: 'start', key: 'validation_auto' },
            // { title: 'COMMENTAIRE', align: 'start', key: 'commentaire' },
            { title: 'COMMENTAIRE CLIENT', align: 'start', key: 'commentaire_client' },

            // { title: 'DEGRE', align: 'start', key: 'degre' },
        ]


        onMounted(async () => {
            list.value = [];
            await list_a_valider();
        })

        const searchEvent = async () => {
            list_a_valider();

        }


        const list_a_valider = async (item) => {
            list.value = [];
            await store.fetchlistavalider();
            await storeEtape.fetchEtape();

            list.value = store.listavaliders;

            plafond_retard.value = '';
            retard_paiement.value = '';
            plafond_depasse.value = '';
            atte_action.value = '';

            plafond_retard.value = list.value.filter(item => item.couleur === 4).length;
            retard_paiement.value = list.value.filter(item => item.couleur === 3).length;
            plafond_depasse.value = list.value.filter(item => item.couleur === 2).length;
            atte_action.value = list.value.filter(item => item.bloque === 1).length;
           

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
            StoreAdv, headers, isOnline, user, list, totalList,
            searchEvent, list_a_valider,
            store, loading,
            code_client, type,
            nom_client, 
            plafond_retard, retard_paiement, plafond_depasse, atte_action,
            storeEtape,

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