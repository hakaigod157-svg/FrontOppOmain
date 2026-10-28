<template>
    <MyTableParams_adr class="compact-table" :headers="headers" :items="list" height="350px" @logChange="updateLogs"
        :clientCode="clientCode" :CodeClient="CodeClient"/>

    <div v-if="list.length" class="text-right mt-3">
        <v-btn color="success" variant="elevated" :disabled="isSaving" :loading="isSaving" @click="enregistrer" density="compact">
            Enregistrer
        </v-btn>
    </div>
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
import MyTableParams from '@/components/expedition/MyTableParams.vue';
import MyTableParams_adr from '@/components/expedition/MyTableParams_adr.vue';
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
        MyTableParams_adr,

    },

    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },

    props: {
        client: Object,
        clientCode: String,
        CodeClient: String,
    },

    setup(props, { emit }) {



        const isOnline = useOnline();
        const router = useRouter();
        const user = localStorage.getItem('username');
        const loading = computed(() => store.loading)
        const store = useFactTransStore();
        const list = ref([]);
        const storeClient = useClientStore();
        const client = ref([]);
        const clientCode = ref('');
        const CodeClient = ref('');
        useSessionTimeout(Config.DURRE_SESSION, router);

        const code = props.CodeClient.split('(')[0].trim();
        const seq = props.clientCode;

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
            await listParams();
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
            await listParams();
        };


        const listParams = async () => {
            // console.log("clientCode =", code);
            console.log("Seq =", props.clientCode);
            
            if (!props.clientCode) {
                list.value = [];
                return;
            }
            const codeUtiliser = props.clientCode;
            try {
                await store.fetchParamsLv(codeUtiliser);

                list.value = store.list_params_adrs;

            } catch (error) {
                // console.error("11. ERREUR lors de l'appel API:", error);
            }
        }

        const handleClientSelected = (selectedClientCode) => {
            console.log("handleClientSelected - reçu:", selectedClientCode);
            console.log("handleClientSelected - ancienne valeur:", clientCode.value);
            clientCode.value = selectedClientCode;
            console.log("handleClientSelected - nouvelle valeur assignée:", clientCode.value);
            // Ne pas appeler listParams() ici, le watcher s'en chargera
        };

        const rechercher = async () => {
            // if (!clientCode.value) return;  // ne rien faire si vide
            // await listParams();
        };

        const fetchClient = async () => {
            // loading.value = true;
            // await storeClient.fetchlListClient();
            // client.value = storeClient.ListClients.map(item => ({
            //     value: item.clcode.trim(), // Code du client
            //     text: `${item.clcode.trim()} - ${item.clnom1}` // Libellé affiché
            // }));
            // loading.value = false;
        };

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


        // const enregistrer = async () => {
        //     if (logCoches.value.length === 0) {
        //         console.log("✅ Rien à insérer");
        //     } else {
        //         // Préparer liste pour le backend
        //         const inserts = logCoches.value.map((data) => {
        //             const jourInt = parseInt(
        //                 Object.keys(joursSemaine).find(
        //                     (key) => joursSemaine[key].toUpperCase() === data.jour.toUpperCase()
        //                 )
        //             );
        //             const heureInt = parseInt(data.heure.replace("h", "").trim());
        //             return { jour: jourInt, heure: heureInt, horodatage: data.horodatage };
        //         });

        //         console.log("🚀 Liste à insérer :", inserts);
        //         // Ici tu peux appeler ton backend pour insert
        //          await store.insertCasesAdr(seq,code,inserts);
        //     }

        //     // Supprimer les décochés
        //     if (logDecoches.value.length > 0) {
        //         const resultats = logDecoches.value.map((data) => {
        //             const jourInt = parseInt(
        //                 Object.keys(joursSemaine).find(
        //                     (key) => joursSemaine[key].toUpperCase() === data.jour.toUpperCase()
        //                 )
        //             );
        //             const heureInt = parseInt(data.heure.replace("h", "").trim());
        //             return { jour: jourInt, heure: heureInt, horodatage: data.horodatage };
        //         });

        //         console.log("🚫 Liste à supprimer :", resultats);
        //         console.log(seq,code)
        //         await store.supprimerCasesAdr(seq,code,resultats);
        //     }
        //     // 🔔 Toast SweetAlert en haut à droite
        //     Swal.fire({
        //         toast: true,
        //         position: 'top', // en haut à droite
        //         icon: 'success',
        //         title: 'Modification effectuée',
        //         showConfirmButton: false, // pas de bouton OK
        //         timer: 2000, // se ferme automatiquement après 2 secondes
        //         timerProgressBar: false,
        //         background: '#FFF3E0', // couleur de fond (ici vert)
        //         color: '#212121',      // couleur du texte (ici blanc)
        //     });

        //     emit("save", true)
        // };

        const enregistrer = async () => {

    if (isSaving.value) return

    isSaving.value = true

    try {

        if (logCoches.value.length > 0) {

            const inserts = logCoches.value.map((data) => {

                const jourInt = parseInt(
                    Object.keys(joursSemaine).find(
                        key => joursSemaine[key].toUpperCase() === data.jour.toUpperCase()
                    )
                )

                const heureInt = parseInt(data.heure.replace("h","").trim())

                return {
                    jour: jourInt,
                    heure: heureInt,
                    horodatage: data.horodatage
                }

            })

            await store.insertCasesAdr(seq,code,inserts)

        }

        if (logDecoches.value.length > 0) {

            const resultats = logDecoches.value.map((data) => {

                const jourInt = parseInt(
                    Object.keys(joursSemaine).find(
                        key => joursSemaine[key].toUpperCase() === data.jour.toUpperCase()
                    )
                )

                const heureInt = parseInt(data.heure.replace("h","").trim())

                return {
                    jour: jourInt,
                    heure: heureInt,
                    horodatage: data.horodatage
                }

            })

            await store.supprimerCasesAdr(seq,code,resultats)

        }

        Swal.fire({
            toast:true,
            position:'top',
            icon:'success',
            title:'Modification effectuée',
            showConfirmButton:false,
            timer:2000,
            background:'#FFF3E0',
            color:'#212121'
        })

        emit("save",true)

    }
    finally {

        isSaving.value = false

    }

}

        


        return {
            headers, isOnline, user, list, totalList,
            searchEvent,
            store, loading,
            listParams, fetchClient,
            filteredList,
            rechercher, enregistrer, updateLogs,
            onClientChanged,
            isSaving,
            handleClientSelected,



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