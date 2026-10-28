<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <!-- <MyTabsCatalogue></MyTabsCatalogue> -->
                    <MyTabsAmm></MyTabsAmm>
                </v-card>
                <v-spacer></v-spacer>

                <div>
                    <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{ ip_server }}</span></span>&nbsp;&nbsp;&nbsp;&nbsp; 

                    <u>Login</u> :&nbsp;<b><span style="color: #388E3C;">{{user }}</span></b>
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
            <v-main :class="{ 'blur-effect': dialogVisibleModif || dialogVisibleNewFab }" style="--v-layout-top: 40px"
                app>

                <v-card-actions density="compact">

                    <v-card-title density="compact">
                    </v-card-title>

                    <v-row density="compact" class="pt-2 mt-0">
                        <v-col cols="12" sm="6" md="6" class="pl-5 d-flex align-center" style="gap: 8px;">
                            <MyTextField name_lab_text="FABRICANT" hide-details="auto" v-model="libelle" placeholder=""
                                @keyup.enter="search" />

                            <v-btn variant="tonal" color="primary" @click="search" :disabled="loading"
                                density="compact">
                                Recherche
                            </v-btn>
                        </v-col>

                    </v-row>

                    <v-spacer />
                    <v-btn variant="tonal" color="#F50057" @click="newFab" :disabled="loading" density="compact">
                        Nouveau
                    </v-btn>
                </v-card-actions>

                <div class="pa-2">
                    <MyTableAmm :headers="headers" :items="list" height="590" :loading="loading"
                        action_modifier="MODIFIER" @action1Item="showModif" class="custom-tablefabricant"></MyTableAmm>
                </div>

                <v-dialog v-if="dialogVisibleModif" v-model="dialogVisibleModif" :persistent="true" width="700px"
                    height="390px" content-class="dialog-new-fab">
                    <fabricant :codeFab="code_Fab" :libelleFab="libelle_Fab" @annuler="onAnnulerModif" @save="onSave" />
                </v-dialog>

                <v-dialog v-if="dialogVisibleNewFab" v-model="dialogVisibleNewFab" :persistent="true" width="700px"
                    height="390px" content-class="dialog-new-fab">
                    <fabricantNew @annuler="onAnnulerNew" @save="onSave" />
                </v-dialog>


            </v-main>
        </v-app>
    </v-card>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeMount, watch } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import MyTabsAmm from '@/components/amm/MyTabsAmm.vue';
import MyTableAmm from '@/components/amm/MyTableAmm.vue';
import { uselistFabricant } from "@/store/Amm/amm_fabricant.js";
import swal from 'sweetalert2';
import MyTextField from '@/components/MyTextField.vue';
import fabricant from '@/views/amm/PageModifFabricant.vue';
import fabricantNew from '@/views/amm/PageInsertFabricant.vue';


export default defineComponent({
    components: {
        MyTabsAmm,
        MyTableAmm,
        MyTextField,
        fabricant,
        fabricantNew,

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

        const loading = computed(() => storeFabricant.loading);
        const storeFabricant = uselistFabricant();

        const selectedArticle = ref('');

        const libelle = ref([]);
        const list = ref([]);
        const code_Fab = ref();
        const libelle_Fab = ref();

        const dialogVisibleModif = ref(false);
        const dialogVisibleNewFab = ref(false);
        const ip_server = ref('');

        onMounted(async () => {
            list.value = [];
            await listFabricant();

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
        });

        const headers = [
            { title: 'CODE', align: 'start', key: 'fab_code', sortable: true },
            { title: 'FABRICANT', align: 'start', key: 'fab_libelle', sortable: false },
            { title: '', align: 'start', key: 'action', sortable: false },
        ]

        const listFabricant = async () => {
            await storeFabricant.fetchListFabricant(libelle.value);
            list.value = storeFabricant.listfabricants;
        };

        const onAnnulerModif = async () => {
            dialogVisibleModif.value = false;
            listFabricant();
        };

        const onAnnulerNew = async () => {
            dialogVisibleNewFab.value = false;
            listFabricant();
        };

        const search = async () => {
            listFabricant();
        };

        watch(libelle, (newVal, oldVal) => {
            search();
        });

        const newFab = async () => {
            dialogVisibleNewFab.value = true;
            listFabricant();
        };

        const showModif = async (item) => {
            code_Fab.value = item.fab_code;
            libelle_Fab.value = item.fab_libelle;
            dialogVisibleModif.value = true;
        }

        return {
            headers, isOnline, user, ip_server,
            loading,
            search, libelle,
            list, selectedArticle,
            showModif, code_Fab, libelle_Fab,
            dialogVisibleModif, dialogVisibleNewFab,
            onAnnulerModif, onAnnulerNew,
            newFab,

        };
    },


})

</script>

<style>
/* toutes les tables avec cette classe */
.custom-tablefabricant {
    font-size: 15px;
}

/* optionnel : pour les en-têtes */
/* .custom-tablefabricant .v-data-table-header th {
  font-size: 15px;
  font-weight: bold;
} */
.blur-effect {
    filter: blur(5px);
    /* Applique un effet de flou */
    pointer-events: none;
    /* Désactive les interactions avec les éléments flous */
    user-select: none;
    /* Empêche la sélection de texte dans les zones floues */
}

.dialog-new-fab {
    transform: translateY(-45px) !important;
    /* Remonte le dialog de 60px */
}
</style>