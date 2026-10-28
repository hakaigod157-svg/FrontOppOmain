<template>
    <v-card>
        <v-app>
            <!-- Barre d'application -->
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <MyTabsAmm />
                <v-spacer />
                <div>
                    <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{ ip_server
                    }}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <u>Login</u> : <b><span style="color: #388E3C;">{{ user
                            }}</span></b>
                </div>
                <div class="status-indicator"></div>
                <v-btn @click="onHome">
                    <v-img :width="20" :src="require('@/assets/home.png')" />
                </v-btn>
            </v-app-bar>

            <!-- Contenu principal -->
            <v-main :class="{ 'blur-effect': dialogLier || drawer }" style="--v-layout-top: 40px" app>
                <!-- Actions -->
                <v-card-actions density="compact">
                    <v-card-title density="compact">
                        <!-- <div class="checkbox-badge-wrapper">
                            <v-checkbox v-model="showOnlyValidated" color="orange" label="PAS DE CODE OPHAM"
                                density="compact" hide-details />
                            <div class="badge">{{ displayedTotal }}</div>
                        </div>

                        <div class="attente-box d-flex align-center ml-6">
                            <div class="color-square mr-2 d-flex justify-center align-center">
                                {{ attenteCount }}
                            </div>
                            <span>Gérer par opham</span>
                        </div> -->

                        <div class="d-flex align-center">
                            <div class="checkbox-badge-wrapper d-flex align-center">
                                <v-checkbox v-model="showOnlyValidated" color="orange" label="PAS DE CODE OPHAM"
                                    density="compact" hide-details />
                                <div class="badge ml-2">{{ displayedTotal }}</div>
                            </div>

                            <!-- ✅ Juste un petit espace à droite -->
                            <div class="d-flex align-center ml-6">
                                <div class="color-square1 mr-2 d-flex justify-center align-center">
                                    {{ attenteCount }}
                                </div>
                                <span style="color: #856404; font-weight: 500;font-size: 13px;"><u>Gérer par opham</u></span>
                            </div>
                        </div>
                    </v-card-title>
                    <v-spacer />
                    <span><u>Dernier Import</u> : <b>{{ listLastImport[0]?.mois }} {{
                        listLastImport[0]?.annee }}</b></span>
                    <v-btn class="btn-space" variant="tonal" color="#F50057" @click="newImportMidac" :disabled="loading"
                        density="compact">
                        Nouveau
                    </v-btn>
                </v-card-actions>

                <div class="pt-1 pb-1 px-2">
                    <!-- Recherche -->
                    <v-card flat>
                        <v-card-title class="d-flex align-center pe-2 pa-0">
                            <v-spacer></v-spacer>
                            <v-text-field v-model="searchTerm" prepend-inner-icon="mdi-magnify" density="compact"
                                label="Rechercher" flat hide-details variant="solo-filled" />
                        </v-card-title>
                        <v-divider></v-divider>
                    </v-card>

                    <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact" />
                    <!-- Tableau -->
                    <!-- <MyTableAmm :headers="headers" :items="filteredList" :search="searchTerm" height="650"
                        class="custom-tablefabricant" :showPagination="true" action5="LIER" @action5Item="showLier" /> -->

                    <MyTableVirtual :headers="headers" :items="filteredList" :search="searchTerm" height="590"
                        class="custom-tablefabricant" :showPagination="true" action5="LIER" @action5Item="showLier" />
                </div>

                <!-- Dialogue Lier -->
                <v-dialog v-model="dialogLier" persistent width="600px" max-height="200px" content-class="dialog-lier">
                    <lier :codepro="code_pro" @annuler="onAnnulerLier" @saves="onSaveReclam" :list_exclu="filteredList"
                        :onRefresh="fetchListMidac" />
                </v-dialog>
            </v-main>

            <!-- Drawer ajout -->
            <ajoutListeMidac v-if="drawer" :drawer="drawer" @close="drawer = false" @onValide="onValideNew" />
        </v-app>
    </v-card>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useOnline } from "@vueuse/core";
import ajoutListeMidac from "./ajoutListeMidac.vue";
import MyTabsAmm from "@/components/amm/MyTabsAmm.vue";
import MyTableAmm from "@/components/amm/MyTableAmm.vue";
import MyTableVirtual from "@/components/amm/MyTableVirtual.vue";
import { useMidacStore } from "@/store/Amm/midac.js";
import lier from "@/views/amm/lier_liste_midac.vue";
import { useDebounceFn } from '@vueuse/core';
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";

export default defineComponent({
    components: { ajoutListeMidac, MyTabsAmm, MyTableAmm, lier, MyTableVirtual },
    setup() {
        const store = useMidacStore();
        const router = useRouter();
        const isOnline = useOnline();
        useSessionTimeout(Config.DURRE_SESSION, router);
        const user = localStorage.getItem("username");
        const drawer = ref(false);
        const dialogLier = ref(false);
        const showOnlyValidated = ref(false);
        const listMidac = ref([]);
        const listLastImport = ref([]);
        const searchTerm = ref("");
        const code_pro = ref();

        const ip_server = ref('');

        const headers = [
            { title: "MOIS", align: "start", key: "lm_mois", sortable: true },
            { title: "ANNEE", align: "start", key: "lm_annee", sortable: true },
            { title: "CODE MIDAC", align: "center", key: "code_prod", sortable: true },
            { title: "CODE OPHAM", align: "center", key: "code_opham", sortable: true },
            { title: "LIBELLE OPHAM", align: "start", key: "arlib", sortable: true },
            { title: "AMM MIDAC", align: "start", key: "num_amm", sortable: true },
            { title: "DATE AMM MIDAC", align: "start", key: "date_amm", sortable: true },
            { title: "AMM FICHE ARTICLE", align: "start", key: "amm_fiche_article", sortable: true },
            { title: "DATE AMM FICHE ARTICLE", align: "start", key: "date_amm_fiche_article", sortable: true },
            { title: "STATUS OPHAM", align: "start", key: "amm_interprete", sortable: true },
            { title: "LM NOM COMMERCIAL", align: "start", key: "nom_com", sortable: true },
            { title: "LM DCI", align: "start", key: "dci", sortable: true },
            { title: "LM MARQUE", align: "start", key: "marque", sortable: true },
            { title: "LM PRESENTATION", align: "start", key: "presentation", sortable: true },
            { title: "LM FABRIQUANT", align: "start", key: "fabriquant", sortable: true },
            { title: "LM TITULAIRE AMM", align: "start", key: "titulaire", sortable: true },
            { title: "LM TYPE COLIS", align: "start", key: "type_colis", sortable: true },
            { title: "STATUS MIDAC", align: "start", key: "status", sortable: true },

            // { title: "AMM GERE OPHAM", align: "start", key: "amm_gere_opham", sortable: true },
        ];

        const loading = computed(() => store.loading);

        // const fetchListMidac = async () => {
        //     await store.fetchListMidac();
        //     listMidac.value = store.listMidacs;
        // };

        // const fetchListMidac = async () => {
        //     // loading.value = true
        //     try {
        //         await store.fetchListMidac()
        //         listMidac.value = store.listMidacs
        //         listLastImport.value = store.listLastImports

        //         // console.log(listLastImport.value)

        //         // attendre que Vue mette à jour le DOM
        //         await nextTick()
        //     } catch (error) {
        //         console.error('Erreur lors du fetch :', error)
        //         listMidac.value = []
        //     } finally {
        //         // loading.value = false
        //     }
        // }

        const moisNoms = [
            'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ];

        const fetchListMidac = async () => {
            try {
                await store.fetchListMidac();
                return store.listMidacs; // 🔹 on retourne le résultat
            } catch (error) {
                console.error('Erreur lors du fetch :', error);
                return []; // retour vide si erreur
            }
        };


        const onValideNew = async () => {
            const result = await fetchListMidac();
            listMidac.value = result;
        }

        const onSaveReclam = async () => {

            const result = await fetchListMidac();
            listMidac.value = result;
        }

        onMounted(async () => {

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
            // fetchListMidac()

            // ici tu peux tester une condition connue avant fetch
            // if (!store.hasMidacData) { // 🔹 par exemple une variable qui indique si des données existent
            //     console.log('Pas de données Midac disponibles, fetch non appelé.');
            //     return;
            // } 

            // if (!store.listMidac || store.listMidac.length === 0) {
            //     console.log('Pas de données Midac disponibles, fetch non appelé.');
            //     return;
            // }

            const result = await fetchListMidac();

            if (result && result.length > 0) {
                listMidac.value = result;
                listLastImport.value = store.listLastImports;
                // console.log('Liste Midac chargée avec succès.');
            } else {
                // console.log('Liste Midac vide après fetch, on ne monte pas.');
            }



        })

        const newImportMidac = () => (drawer.value = true);
        const onHome = () => router.push("/AccueilPage");
        const onAnnulerLier = async () => {
            dialogLier.value = false;
            await fetchListMidac();
        };
        // const showLier = () => (dialogLier.value = true);

        const showLier = (item) => {
            code_pro.value = item.code_prod;
            dialogLier.value = true
        }

        // const filteredList = computed(() => {
        //     let result = listMidac.value;
        //     if (showOnlyValidated.value) result = result.filter((i) => !i.code_opham);
        //     if (searchTerm.value) {
        //         const term = searchTerm.value.toLowerCase();
        //         result = result.filter((i) =>
        //             Object.values(i).some((v) => String(v).toLowerCase().includes(term))
        //         );
        //     }
        //     return result;
        // });
        const filteredList = ref([]);

        const updateFilteredList = useDebounceFn(() => {
            let result = listMidac.value;
            if (showOnlyValidated.value) result = result.filter(i => !i.code_opham);
            if (searchTerm.value) {
                const term = searchTerm.value.toLowerCase();
                result = result.filter(i =>
                    Object.values(i).some(v => String(v).toLowerCase().includes(term))
                );
            }
            filteredList.value = result;
        }, 200); // attend 200ms après la dernière frappe

        watch([listMidac, showOnlyValidated, searchTerm], updateFilteredList, { immediate: true });

        // const displayedTotal = computed(() => listMidac.value.filter((i) => !i.code_opham).length);
        const displayedTotal = computed(() =>
            filteredList.value.filter((i) => !i.code_opham).length
        );

        const attenteCount = computed(() => {
            return filteredList.value.filter(item => item.amm_gere_opham === 1).length;
        });

        return {
            headers, ip_server,
            isOnline,
            user,
            drawer,
            dialogLier,
            showOnlyValidated,
            listMidac, listLastImport,
            filteredList,
            displayedTotal,
            loading,
            searchTerm,
            newImportMidac,
            onHome,
            onAnnulerLier,
            showLier, code_pro,
            onValideNew,
            onSaveReclam,
            attenteCount,
        };
    },
});
</script>

<style>
.custom-tablefabricant {
    font-size: 15px;
}

.blur-effect {
    filter: blur(5px);
    pointer-events: none;
    user-select: none;
}

.checkbox-badge-wrapper .badge {
    margin-top: 4px;
}

.btn-space {
    margin-left: 150px;
}

.status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: green;
    display: inline-block;
    margin-left: 8px;
}

.status-indicator.offline {
    background-color: red;
}

.dialog-lier {
    transform: translateY(-200px) !important;
    /* Remonte le dialog de 60px */
}

.color-square1 {
  width: 32px;
  height: 20px;
  color: #856404;
  background-color: #fff3cd;
  border: 1px solid #f0ad4e;
  border-radius: 4px;
}
</style>
