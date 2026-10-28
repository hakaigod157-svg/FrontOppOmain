<template>
    <v-app>
        <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
            <v-card density="compact">
                <MyTabsExped></MyTabsExped>
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
        <v-main :class="{ 'blur-effect': dialogVisibleParamsLV }" style="--v-layout-top: 40px" app>

            <v-row density="compact" align="center" justify="start" class="px-3" no-gutters style="padding-top: 15px;">
                <!-- Code Livraison -->
                <v-col cols="auto">
                    <v-autocomplete :disabled="isUpdating" :items="client" style="width: 460px; height: 35px"
                        item-title="text" item-value="value" label="CLIENT" :min-length="3" density="compact" clearable
                        hide-no-data :loading="loading" color="deep-purple-accent-4" v-model="clientCode"
                        @update:model-value="onClientChanged">
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                                <div class="text-grey lighten-1">{{ item.text }}</div>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                </v-col>
                <v-col cols="auto" style="margin-left:20px;">
                    <v-autocomplete :disabled="isUpdating" :items="list_classification" style="width:225px; height:35px"
                        label="CLASSIFICATION CLIENT" density="compact" clearable hide-no-data :loading="loading"
                        v-model="classification" item-title="clsa" item-value="clsa" />
                </v-col>

                <!-- <v-col cols="auto" style="margin-left:150px;"> -->
                <v-col cols="auto" style="margin-left:650px;">
                    <v-autocomplete :disabled="isUpdating" :items="list_mode" style="width:190px; height:35px"
                        label="MODE DE LIV" density="compact" clearable hide-no-data :loading="loading" v-model="mode"
                        item-title="adrmodelivr" item-value="adrmodelivr" />
                </v-col>
                <v-col cols="auto" style="margin-left:20px;">
                    <v-autocomplete :disabled="isUpdating" :items="list_axe" style="width:190px; height:35px"
                        label="AXE" density="compact" clearable hide-no-data :loading="loading" v-model="axe"
                        item-title="adraxe" item-value="adraxe" />
                </v-col>
            </v-row>

            <div class="pa-2" style="width:100%;">

                <!-- <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact"></v-progress-linear> -->

                <!-- <MyTableAxe v-if="!loading" class="compact-table" :headers="headers" :items="list" height="650px"
                    :with-pagination="true" @logChange="updateDecoches" @configure="openParamsLv" /> -->

                <MyTableAxe v-if="!loading" class="compact-table" :headers="headers" :items="filteredList"
                    :clientCode="clientCode" height="650px" :with-pagination="true" @logChange="updateDecoches"
                    @configure="openParamsLv" />


                <v-dialog v-model="dialogVisibleParamsLV" height="500" width="1500">
                    <v-card>
                        <v-card-title class="bg-green-lighten-4 d-flex justify-space-between align-center">
                            <span>{{ selectedClientCode }} - {{ selectedItem?.nom_client }}({{ selectedItem?.nom }}) -
                                {{
                                    selectedItem?.ville }} - {{ selectedItem?.code_postal }}</span>
                            <v-icon @click="dialogVisibleParamsLV = false" class="icon-close">
                                mdi-close
                            </v-icon>
                        </v-card-title>

                        <v-card-text>
                            <!-- Ici on passe bien l'item sélectionné -->
                            <ParamsLvView :client="selectedItem" :clientCode="selectedSeq"
                                :CodeClient="selectedClientCode" @close="dialogVisibleParamsLV = false"
                                @save="handleParamsSave" />
                        </v-card-text>
                    </v-card>
                </v-dialog>


                <div v-if="list.length" class="text-right mt-2">
                    <v-btn color="success" variant="elevated" @click="enregistrer" density="compact">
                        Enregistrer
                    </v-btn>
                </div>
            </div>
        </v-main>
    </v-app>
</template>
<script>
import { defineComponent, ref, computed, onMounted, onUnmounted, onBeforeMount, watch } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import MyTabsExped from '@/components/expedition/MytabsExped.vue';
import MyTableAdv from '@/components/adv/MyTableAdv.vue'
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import MyTextarea from '@/components/MyTextarea.vue';
import { useValidationCommandeStore } from "@/store/Adv/adv.js";
import Swal from 'sweetalert2';
import { useEtapeAdv } from "@/store/Adv/etape.js"
// import MyTableAxe from '@/components/expedition/MyTableParams.vue';
import MyTableAxe from '@/components/expedition/MyTableAttribAxe.vue';
// import MyTableAxe from '@/components/expedition/MyTableAxe.vue';
import { useFactTransStore } from "@/store/Expedition/facTrans.js";
import MySelect from '@/components/MySelect.vue';
import { useClientStore } from "@/store/utils/client.js";
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";
import ParamsLvView from '@/views/expedition/paramsLvAdr.vue';



export default defineComponent({
    components: {
        MyTabsExped,
        MyTableAxe,
        MyTextarea,
        MySelect,
        ParamsLvView,

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
        const store = useFactTransStore();
        const list = ref([]);
        const list_mode = ref([]);
        const list_axe = ref([]);
        const list_classification = ref([]);
        const storeClient = useClientStore();
        const client = ref([]);
        const clientCode = ref('');
        useSessionTimeout(Config.DURRE_SESSION, router);
        const dialogVisibleParamsLV = ref(false);
        const selectedItem = ref(null)
        const selectedClientCode = ref('')
        const selectedSeq = ref('')
        const codePostal = ref('')
        const ville = ref('')
        const ip_server = ref('');

        const page = ref(1);
        const itemsPerPage = ref(100);

        // Clé unique pour le localStorage basée sur le client
        const storageKey = computed(() =>
            `table_page_${props.clientCode || 'default'}`
        );


        const headers = [
            // { title: 'SEQ', align: 'start', key: 'seq', sortable: false },
            { title: 'CODE CLIENT', align: 'start', key: 'code_client', sortable: false },
            { title: 'NOM CLIENT', align: 'start', key: 'nom_client', sortable: false },
            { title: 'NOM LIVRAISON', align: 'start', key: 'nom', sortable: false },
            { title: 'ADRESSE 1', align: 'start', key: 'adresse_1', sortable: false },
            { title: 'ADRESSE 2', align: 'start', key: 'adresse_2', sortable: false, width: '10px' },
            { title: 'CODE POSTAL', align: 'center', key: 'code_postal', sortable: false },
            { title: 'VILLE', align: 'start', key: 'ville', sortable: false },
            { title: 'MODE DE LIVRAISON', align: 'start', key: 'mod_liv', sortable: false },
            { title: '', align: 'start', key: 'params_lv', sortable: false },
            { title: 'AXE', align: 'start', key: 'axe', sortable: false },
            { title: 'TYPE', align: 'start', key: 'type', sortable: false },
        ]


        // onMounted(async () => {
        //     list.value = [];
        //     await listParams();
        // })

        // Restaurer la page sauvegardée
        onMounted(async () => {
            const savedPage = localStorage.getItem(storageKey.value);
            if (savedPage) {
                page.value = parseInt(savedPage);
            }

            list.value = [];
            await listParams();
        });

        // Sauvegarder la page quand elle change
        watch(page, (newPage) => {
            localStorage.setItem(storageKey.value, newPage.toString());
        });

        const searchEvent = async () => {
            // rechercher()
        }


        const onClientChanged = async (value) => {
            await listParams();
        };

        const listParams = async () => {
            await store.fetchAttribAxe(clientCode.value);
            list.value = store.list_attribAxes;
            list_mode.value = store.list_modes;
            list_axe.value = store.list_axes;
            list_classification.value = store.list_classifications;

            // console.log(list_mode.value)
            // console.log(list_axe.value)
        };

        const rechercher = async () => {
            // if (!clientCode.value) return;  // ne rien faire si vide
            // console.log(clientCode.value)
            // await listParams();
        };


        const fetchClient = async () => {
            loading.value = true;
            await storeClient.fetchlListClient();
            client.value = storeClient.ListClients.map(item => ({
                value: item.clcode.trim(), // Code du client
                text: `${item.clcode.trim()} - ${item.clnom1}` // Libellé affiché
            }));
            loading.value = false;
        };

        onBeforeMount(async () => {
            await fetchClient();
        })

        const totalList = computed(() => {
            return list.value.length;
        });

        const logDecoches = ref([]);

        // const updateDecoches = (logs) => {
        //     logDecoches.value = logs;
        //     // console.log("📜 Liste des cases décochées (reçue du composant enfant):", logs);
        // };

        const logCoches = ref([]);

        const updateLogs = (decoches, coches) => {
            logDecoches.value = decoches;
            logCoches.value = coches;
            // console.log("📜 Décochés:", logDecoches.value);
            // console.log("✅ Cochés:", logCoches.value);
        };

        const isSaving = ref(false);

        const modifications = ref([]);

        const updateDecoches = (data) => {
            // Chercher si cette ligne existe déjà
            const index = modifications.value.findIndex(x => x.seq === data.seq);

            if (index !== -1) {
                // S'il existe → mettre à jour
                modifications.value[index] = data;
            } else {
                // Sinon → ajouter
                modifications.value.push(data);
            }

            // console.log("🔄 Modifications enregistrées :", modifications.value);
        };

        // const enregistrer = async () => {

        //     // 👉 Vérifier s'il y a des modifications
        //     if (modifications.value.length === 0) {
        //         console.log("Aucune modification — rien à enregistrer.");
        //         return;  // ❌ Stop ici : ne rien faire
        //     }

        //     console.log("📌 Liste des modifications à enregistrer :");

        //     for (const m of modifications.value) {

        //         console.log(`SEQ: ${m.seq} | Code client: ${m.code_client} | Axe: ${m.axe}`);
        //         console.log(`SEQ: ${m.seq} | Code client: ${m.code_client} | ModeLivraison: ${m.mode_livraison}`);


        //         // 👉 Appeler ton API avec le seq
        //         await store.updateAxe(m.seq, m.axe);
        //         await store.updateModeLiv(m.seq, m.mode_livraison);

        //     }
        //     Swal.fire({
        //         toast: true,
        //         position: 'top',
        //         icon: 'success',
        //         title: 'Modification effectuée',
        //         showConfirmButton: false,
        //         timer: 2000,
        //         timerProgressBar: false,
        //         background: '#FFF3E0',
        //         color: '#212121',
        //     });

        //     // 👉 Nettoyer après enregistrement
        //     modifications.value = [];

        //     // console.log("🔄 Modifications réinitialisées. Prêt pour détecter de nouveaux changements !");
        // };


        const enregistrer = async () => {
            // 👉 Vérifier s'il y a des modifications
            if (modifications.value.length === 0) {
                console.log("Aucune modification — rien à enregistrer.");
                return;  // ❌ Stop ici : ne rien faire
            }

            console.log("📌 Liste des modifications à enregistrer :");

            for (const m of modifications.value) {
                console.log(`SEQ: ${m.seq} | Code client: ${m.code_client} | Axe: ${m.axe}`);
                console.log(`SEQ: ${m.seq} | Code client: ${m.code_client} | ModeLivraison: ${m.mode_livraison}`);

                // 👉 Préparer les valeurs en envoyant null si non définies
                const axeValue = m.axe !== undefined && m.axe !== '' ? m.axe : null;
                const modeLivraisonValue = m.mode_livraison !== undefined && m.mode_livraison !== '' ? m.mode_livraison : null;

                // 👉 Appeler ton API avec les valeurs null si nécessaire
                await store.updateAxe(m.seq, axeValue);
                await store.updateModeLiv(m.seq, modeLivraisonValue);
            }

            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: 'Modification effectuée',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: false,
                background: '#FFF3E0',
                color: '#212121',
            });

            // 👉 Nettoyer après enregistrement
            modifications.value = [];

            // console.log("🔄 Modifications réinitialisées. Prêt pour détecter de nouveaux changements !");
        };

        const openParamsLv = (data) => {

            // console.log("📦 Données reçues :", data)

            selectedItem.value = data.item
            selectedClientCode.value = data.code_client
            selectedSeq.value = data.seq
            codePostal.value = data.code_postal
            ville.value = data.ville

            // console.log(selectedSeq.value)

            dialogVisibleParamsLV.value = true
        }

        // const handleParamsSave = async (data) => {
        //     dialogVisibleParamsLV.value = false
        //     await listParams()
        // }

        // Modifier handleParamsSave pour conserver la page
        const handleParamsSave = async (data) => {
            dialogVisibleParamsLV.value = false;

            // Sauvegarder la page actuelle
            const currentPage = page.value;

            await listParams(); // ou la fonction qui recharge les données

            // Restaurer la page après rechargement
            page.value = currentPage;
        };

        const mode = ref(null);
        const axe = ref(null);
        const classification = ref(null);

        const filteredList = computed(() => {
            let result = list.value;

            if (mode.value !== null && mode.value !== undefined) {
                result = result.filter(item =>
                    (item.mod_liv ?? '').trim() === (mode.value ?? '').trim()
                );
            }

            if (axe.value !== null && axe.value !== undefined) {
                result = result.filter(item =>
                    (item.axe ?? '').trim() === (axe.value ?? '').trim()
                );
            }

            if (classification.value !== null && classification.value !== undefined) {
                result = result.filter(item =>
                    (item.clsa ?? '').trim() === (classification.value ?? '').trim()
                );
            }

            return result;
        });

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


        return {
            headers, isOnline, user, list, totalList,
            searchEvent,
            store, loading,
            listParams, fetchClient, client, clientCode,
            rechercher, enregistrer, updateLogs,
            onClientChanged,
            isSaving, updateDecoches, modifications, openParamsLv, handleParamsSave,
            dialogVisibleParamsLV, selectedItem, selectedClientCode,
            selectedSeq,
            mode, axe, filteredList,
            list_mode, list_axe, list_classification, classification,
            page, itemsPerPage, ip_server,

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

.blur-effect {
    filter: blur(5px);
    /* Applique un effet de flou */
    pointer-events: none;
    /* Désactive les interactions avec les éléments flous */
    user-select: none;
    /* Empêche la sélection de texte dans les zones floues */
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

/* Align header à gauche uniquement pour cette table */
.my-table-params thead th {
    text-align: left !important;
}

/* Align contenu des cellules à gauche */
.my-table-params tbody td {
    text-align: left !important;
}
</style>