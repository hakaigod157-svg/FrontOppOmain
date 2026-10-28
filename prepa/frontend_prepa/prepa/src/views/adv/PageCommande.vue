<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-left">
                <span class="text-h5">
                    <b><u>{{ TypeCommande === 5 ? 'COMMANDE' : '' }}</u> - {{ TnomClient }}</b>
                </span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>

        </v-card-title>

        <div class="pa-2">
            <v-card>
                <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5" density="compact">
                </v-progress-linear>

                <MyTableSolde :headers="headers" :items="list" :codeclient="codeclient" :type="type">
                </MyTableSolde>
            </v-card>
            <v-card>
                <v-row justify="center">
                    <v-col cols="auto">
                    </v-col>
                </v-row>
            </v-card>

            <v-chip class="ma-2 custom-font-size" label>
                <u>TOTAL</u>&nbsp; : &nbsp;<b>{{ formatPrice(total || 0) }}</b>
            </v-chip>
        </div>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#B71C1C" variant="outlined" @click="annuler">
                FERMER
            </v-btn>
            <!-- <v-btn color="#26A69A" variant="outlined" @click="save">
                Enregistrer
            </v-btn> -->
        </v-card-actions>
    </v-card>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import MyTableSolde from '@/components/adv/MyTableSolde.vue';
import dayjs from 'dayjs';
import { useValidationCommandeStore } from "@/store/Adv/adv.js";

import swal from 'sweetalert2';

export default defineComponent({
    components: {
        MyTableSolde,
    },

    props: {
        codeclient: String,
        nomclient: String,
        type: Number,

    },

    setup(props, { emit }) {

        const dialogVisible = ref(false);
        const user = localStorage.getItem('username');
        const router = useRouter();
        const list = ref([]);
        const store = useValidationCommandeStore();

        const TcodeClient = props.codeclient;
        const TnomClient = props.nomclient;
        const TypeCommande = props.type;

        const listCommande = async () => {
            list.value = [];
            await store.fetchCommande(TcodeClient, TypeCommande)
            list.value = store.soldes
        }


        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
            } else {
                return '';
            }

        };

        // const total = computed(() =>
        //     list.value.reduce((sum, item) => sum + item.ttc_cmd, 0)
        // );


        const total = computed(() =>
            Math.trunc(list.value.reduce((sum, item) => sum + item.ttc_cmd, 0))
        );


        const totalreservation = computed(() =>
            // list.value.reduce((sum, item) => sum + item.farsrv, 0)
            list.value
                .filter(item => item.farsrv === 1)
                .reduce((sum, item) => sum + item.reste, 0)
        );

        const totalfanormal = computed(() =>
            // list.value.reduce((sum, item) => sum + item.farsrv, 0)
            list.value
                .filter(item => item.farsrv === 0)
                .reduce((sum, item) => sum + item.ttc_cmd, 0)
        );

        const save = async () => {
            // console.log(TcodeClient)
            console.log(TypeCommande)
        }

        const annuler = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        const closeDetail = () => {
            dialogVisible.value = false;
            emit('annuler');
        };


        onMounted(async () => {
            list.value = [];
            listCommande()

        })

        const headers = [

            { title: 'CODE ARTICLE', align: 'start', key: 'code_article_cmd', sortable: true },
            { title: 'LIBELLE', align: 'start', key: 'libelle_cmd', sortable: true },
            { title: 'QUANTITE', align: 'center', key: 'qte_cmd', sortable: true },
            { title: 'TOTAL TTC', align: 'end', key: 'ttc_cmd', sortable: true },


        ];

        const formatPrice = (price) => {
            // Vérifier si price est null, undefined ou NaN
            if (price == null || isNaN(price)) {
                return ""; // ou une autre valeur par défaut
            }

            // Convertir le nombre en chaîne et le diviser en partie entière et décimale
            let [integerPart, decimalPart] = price.toString().split('.');

            // Formatage de la partie entière avec un espace comme séparateur de millier
            let formattedInteger = integerPart
                .split('')
                .reverse()
                .map((digit, index) => (index > 0 && index % 3 === 0 ? digit + ' ' : digit))
                .reverse()
                .join('');

            // Ajouter la partie décimale si elle existe
            return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
        };

        const formatDate = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }
        };



        return {
            dialogVisible,
            annuler,
            closeDetail,
            save,
            user, list,
            headers, formatDateTime,
            store, TcodeClient, listCommande, TypeCommande, total, totalreservation, totalfanormal, TnomClient,
            formatPrice,

        };
    }
});

</script>
<style>
.swal2-container {
    z-index: 20000 !important;
}

.v-chip.custom-font-size {
    font-size: 1rem !important;
    /* Utilisez !important pour forcer l'application */
    font-weight: bold;
    /* Facultatif */
}

.centered-chip {
    margin: 0 auto;
    /* Centre le chip horizontalement */
}
</style>