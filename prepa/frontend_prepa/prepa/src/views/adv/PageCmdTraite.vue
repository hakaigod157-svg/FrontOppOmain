<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabsAdv></MyTabsAdv>
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
            <v-main style="--v-layout-top: 40px" app>
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

                    <MyTableAdv v-if="!loading" :headers="headers" :items="list" height="590"
                        @action_traite="createTraite" action_traite="CREER TRAITE">
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
    <MyDateEcheance :editedItem="editedItem" v-if="drawer" :drawer="drawer" @close="drawer = false"
        @onValideTraite="onValideAddItem"></MyDateEcheance>
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
import Swal from 'sweetalert2';
import { useEtapeAdv } from "@/store/Adv/etape.js"
import MyDateEcheance from "@/components/adv/MyDateEcheance.vue";


export default defineComponent({
    components: {
        MyTabsAdv,
        MyTableAdv,
        MyTextarea,
        MyDateEcheance
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
        const editedItem = ref(null);
        const drawer = ref(false);
        const type = ref();

        const plafond_retard = ref(0);
        const retard_paiement = ref(0);
        const plafond_depasse = ref(0);
        const atte_action = ref(0);

        const storeEtape = useEtapeAdv();
        const ip_server = ref('');

        const headers = [
            { title: 'CODE', align: 'start', key: 'code_traite', sortable: true },
            { title: 'CLIENT', align: 'start', key: 'code_client_traite', sortable: true },
            { title: 'NOM CLIENT', align: 'start', key: 'nom_client_traite' },
            { title: 'DATE COMMANDE', align: 'start', key: 'date_commande_traite' },
            { title: 'DATE VALIDE ADV', align: 'start', key: 'date_valide_adv_traite' },
            { title: 'ETAPE ', align: 'start', key: 'etape_traite' },
            { title: 'CONDITION CMDE', align: 'center', key: 'condition_cmd_traite' },
            { title: 'CONDITION CLIENT', align: 'center', key: 'condition_client_traite' },
            { title: 'ACTIONS', align: 'end', key: 'action_traite' },
        ]


        onMounted(async () => {
            list.value = [];
            await list_traite();

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
            list_traite();
        }

        const list_traite = async (item) => {
            list.value = [];
            await store.fetchlisttraite();
            list.value = store.listtraites;
        }

        const totalList = computed(() => {
            return list.value.length;
        });

        const createTraite = async (item) => {
            //  editedItem.value = item;
            //  drawer.value = true;
            await store.onCreeTraiteAdv(item.code_traite, null, 1);

            if (store.codeTraite && store.codeTraite != "") {
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `La création du traité <span style='color: #05acdc;'>${store.codeTraite}</span> 
                     pour la commande <span style='color: #05acdc;'>${item.code_traite}</span> 
                     de <span style='color: #05acdc;'>${item.nom_client_traite}</span> 
                     a été effectuée avec succès.`,
                    showConfirmButton: true,
                    timer: 1500
                });
            }
            await list_traite();
        }

        const onValideAddItem = async () => {
            drawer.value = false;
            await list_traite();
        }


        return {
            StoreAdv, headers, isOnline, user, list, totalList,
            searchEvent, list_traite,
            store, loading,
            code_client, type,
            nom_client,
            plafond_retard, retard_paiement, plafond_depasse, atte_action,
            storeEtape, createTraite, editedItem, drawer, onValideAddItem,
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