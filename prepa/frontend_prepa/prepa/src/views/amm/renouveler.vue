<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabsAmm></MyTabsAmm>
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
            :class="{ 'blur-effect': dialogRenouveler  }"
            style="--v-layout-top: 40px" app>

                <div class="pa-2">

                    <!-- <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact"></v-progress-linear> -->

                    <MyTableAmmSearch :headers="headers" :items="list" :loading="loading" style="font-size: 16px;"
                        action6="RENOUVELER" @action6Item="showRenouveler">
                    </MyTableAmmSearch>

                    <v-dialog v-if="dialogRenouveler" v-model="dialogRenouveler" :persistent="true" width="1400px"
                        height="760px" content-class="dialog-new-dossier">
                        <dossierRenouveler @annuler="onAnnulerNew" @save="onSave" :codeArticleRenouvel="code_article" :libelleRenouvel="libelle" :titulaire="titulaire"/>
                    </v-dialog>

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
import MyTabsAmm from '@/components/amm/MyTabsAmm.vue';
import MyTableAmmSearch from '@/components/amm/MyTableAmmSearch.vue';
import { uselistDossier } from "@/store/Amm/amm_dossier";
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";
import dossierRenouveler from '@/views/amm/PageInsertRenouveler.vue';

import Swal from 'sweetalert2';



export default defineComponent({
    components: {
        MyTabsAmm,
        MyTableAmmSearch,
        dossierRenouveler,

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
        const loading = computed(() => store.loading)
        const store = uselistDossier();
        const list = ref([]);
        const ip_server = ref('');


        const code_article = ref();
        const libelle = ref();
        const titulaire = ref();

        const dialogRenouveler = ref(false);


        const headers = [
            { title: 'CODE', align: 'start', key: 'code_article' },
            { title: 'LIBELLE', align: 'start', key: 'libelle', sortable: true },
            { title: 'TITULAIRE', align: 'start', key: 'titulaire', sortable: true, width: '1%' },
            { title: 'AMM INTERPRETE', align: 'start', key: 'amm_interprete', sortable: true },
            { title: 'AMM', align: 'start', key: 'amm_code' },
            { title: 'AMM DATE', align: 'start', key: 'amm_date' },
            { title: 'EXPIRE', align: 'start', key: 'expire' },
            { title: '', align: 'start', key: 'renouveler',sortable: false },
        ]


        onMounted(async () => {
            list.value = [];
            // list_amm_etat();
            await list_a_renouveler();
            
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

        const type = 1;

        const list_a_renouveler = async () => {
            await store.fetchListArenouveler(type);
            list.value = store.listRenouveler;
        }

        const totalList = computed(() => {
            return list.value.length;
        });


        const showRenouveler = (item) => {
            code_article.value = item.code_article;
            libelle.value = item.libelle;
            titulaire.value = item.titulaire;
            // selectedItem.value = item;
            dialogRenouveler.value = true;

            // console.log(code_article.value)
            // console.log(libelle.value)
            // console.log(titulaire.value)
        }

        const onAnnulerNew = async () => {
            dialogRenouveler.value = false;
            list_a_renouveler();
        };

        return {
            headers, isOnline, user, list, totalList, ip_server,
            store, loading,
            showRenouveler,
            code_article, libelle, titulaire,
            dialogRenouveler,onAnnulerNew,

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