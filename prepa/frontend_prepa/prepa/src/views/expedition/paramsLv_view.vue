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
        <v-main style="--v-layout-top: 40px" app>

            <v-row density="compact" align="center" justify="start" class="px-3" no-gutters style="padding-top: 15px;">
                <!-- Code Livraison -->
                <v-col cols="auto">
                    <!-- <MySelect v-model="codeClient" label="Client" :items="client" density="compact" hide-details
                            clearable style="width: 300px">
                        </MySelect> -->

                    <!-- <v-autocomplete :disabled="isUpdating" :items="client" style="width: 300px; height: 35px"
                            item-title="text" item-value="value" label="Client" :min-length="3" density="compact"
                            clearable hide-no-data :loading="loading" color="deep-purple-accent-4" v-model="clientCode"
                            @keydown.enter="searchEvent">
                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props">
                                    <div class="text-grey lighten-1">{{ item.text }}</div>
                                </v-list-item>
                            </template>
</v-autocomplete> -->

                    <v-autocomplete :disabled="isUpdating" :items="client" style="width: 300px; height: 35px"
                        item-title="text" item-value="value" label="Client" :min-length="3" density="compact" clearable
                        hide-no-data :loading="loading" color="deep-purple-accent-4" v-model="clientCode"
                        @update:model-value="onClientChanged">
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                                <div class="text-grey lighten-1">{{ item.text }}</div>
                            </v-list-item>
                        </template>
                    </v-autocomplete>


                </v-col>


                <!-- Bouton rechercher -->
                <v-col cols="auto" class="px-2 d-flex align-center">
                    <!-- <v-btn variant="tonal" color="primary" @click="rechercher" density="compact"
                            style="min-width: 110px; height: 36px;">
                            Rechercher
                        </v-btn> -->
                </v-col>
            </v-row>

            <div class="pa-2">

                <!-- <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact"></v-progress-linear> -->

                <!-- <MyTableParams v-if="!loading" class="compact-table" :headers="headers" :items="list" height="350px"
                        width="850px" @logChange="updateDecoches" /> -->

                <MyTableParams v-if="!loading" class="compact-table" :headers="headers" :items="list" height="350px"
                    @logChange="updateLogs" />

                <div v-if="list.length" class="text-right mt-3">
                    <v-btn color="success" variant="elevated" @click="enregistrer" density="compact">
                        Enregistrer
                    </v-btn>
                </div>
            </div>
        </v-main>
    </v-app>
</template>
<script>
import { defineComponent, ref, computed, onMounted, onUnmounted, onBeforeMount } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import MyTabsExped from '@/components/expedition/MytabsExped.vue';
import MyTableAdv from '@/components/adv/MyTableAdv.vue'
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import MyTextarea from '@/components/MyTextarea.vue';
import { useValidationCommandeStore } from "@/store/Adv/adv.js";
import Swal from 'sweetalert2';
import { useEtapeAdv } from "@/store/Adv/etape.js"
import MyTableParams from '@/components/expedition/MyTableParams.vue';
import { useFactTransStore } from "@/store/Expedition/facTrans.js";
import MySelect from '@/components/MySelect.vue';
import { useClientStore } from "@/store/utils/client.js";
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";


export default defineComponent({
    components: {
        MyTabsExped,
        MyTableParams,
        MyTextarea,
        MySelect,

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
        const storeClient = useClientStore();
        const client = ref([]);
        const clientCode = ref('');
        useSessionTimeout(Config.DURRE_SESSION, router);
        const ip_server = ref('');

        // Mapping des jours
        const joursSemaine = {
            2: "Lundi",
            3: "Mardi",
            4: "Mercredi",
            5: "Jeudi",
            6: "Vendredi",
            7: "Samedi",
        };

        const headers = [
            { title: 'JOUR', align: 'start', key: 'jour', sortable: false, width: '150px' },
            //  { title: '', align: 'center', key: 'select_all', sortable: false },
            { title: '7H', align: 'start', key: 'a_7h', sortable: false },
            { title: '8H', align: 'start', key: 'a_8h', sortable: false },
            { title: '9H', align: 'start', key: 'a_9h', sortable: false },
            { title: '10H', align: 'start', key: 'a_10h', sortable: false },
            { title: '11H', align: 'start', key: 'a_11h', sortable: false },
            { title: '12H', align: 'start', key: 'a_12h', sortable: false },
            { title: '13H', align: 'start', key: 'a_13h', sortable: false },
            { title: '14H', align: 'start', key: 'a_14h', sortable: false },
            { title: '15H', align: 'start', key: 'a_15h', sortable: false },
            { title: '16H', align: 'start', key: 'a_16h', sortable: false },
            { title: '17H', align: 'start', key: 'a_17h', sortable: false },
            { title: '18H', align: 'start', key: 'a_18h', sortable: false },
        ]


        onMounted(async () => {
            list.value = [];
        })

        const searchEvent = async () => {
            rechercher()
        }


        const onClientChanged = async (value) => {
            if (!value) {
                // Champ vide → on vide le tableau
                list.value = [];
                return;
            }
            // Champ rempli → on charge les paramètres
            await listParams();
        };

        const listParams = async (item) => {
            // list.value = [];
            await store.fetchParams(clientCode.value);
            list.value = store.list_params;
            // console.log(list.value)
        }

        const rechercher = async () => {
            if (!clientCode.value) return;  // ne rien faire si vide
            await listParams();
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

        // const filteredList = computed(() => {
        //     if (!clientCode.value) return [];
        //     return list.value.filter(item => item.liv_clt === clientCode.value);
        // });

        // Filtrage par client et transformation du jour
        const filteredList = computed(() => {
            if (!clientCode.value) return [];
            return list.value
                .filter(item => item.liv_clt === clientCode.value)
                .map(item => ({
                    ...item,
                    liv_jour: joursSemaine[item.liv_jour] || item.liv_jour, // transforme le numéro en jour
                }));
        });

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


        const enregistrer = async () => {
            if (logCoches.value.length === 0) {
                console.log("✅ Rien à insérer");
            } else {
                // Préparer liste pour le backend
                const inserts = logCoches.value.map((data) => {
                    const jourInt = parseInt(
                        Object.keys(joursSemaine).find(
                            (key) => joursSemaine[key].toUpperCase() === data.jour.toUpperCase()
                        )
                    );
                    const heureInt = parseInt(data.heure.replace("h", "").trim());
                    return { jour: jourInt, heure: heureInt, horodatage: data.horodatage };
                });

                // console.log("🚀 Liste à insérer :", inserts);
                // Ici tu peux appeler ton backend pour insert
                await store.insertCases(clientCode.value, inserts);
            }

            // Supprimer les décochés
            if (logDecoches.value.length > 0) {
                const resultats = logDecoches.value.map((data) => {
                    const jourInt = parseInt(
                        Object.keys(joursSemaine).find(
                            (key) => joursSemaine[key].toUpperCase() === data.jour.toUpperCase()
                        )
                    );
                    const heureInt = parseInt(data.heure.replace("h", "").trim());
                    return { jour: jourInt, heure: heureInt, horodatage: data.horodatage };
                });

                // console.log("🚫 Liste à supprimer :", resultats);
                await store.supprimerCases(clientCode.value, resultats);
            }
            // 🔔 Toast SweetAlert en haut à droite
            Swal.fire({
                toast: true,
                position: 'top', // en haut à droite
                icon: 'success',
                title: 'Modification effectuée',
                showConfirmButton: false, // pas de bouton OK
                timer: 2000, // se ferme automatiquement après 2 secondes
                timerProgressBar: false,
                background: '#FFF3E0', // couleur de fond (ici vert)
                color: '#212121',      // couleur du texte (ici blanc)
            });
        };

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
            filteredList,
            rechercher, enregistrer, updateLogs,
            onClientChanged,
            isSaving,ip_server,


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

/* Align header à gauche uniquement pour cette table */
.my-table-params thead th {
    text-align: left !important;
}

/* Align contenu des cellules à gauche */
.my-table-params tbody td {
    text-align: left !important;
}
</style>