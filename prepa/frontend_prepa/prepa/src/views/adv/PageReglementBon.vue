<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-left">

                <span class="text-h5">
                    <b><u>{{ TypeReglement === 6 ? 'REGLEMENT' : '' }}</u> - {{ TnomClient }} </b>
                </span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>

        </v-card-title>

        <div class="pa-2">
            <v-card>
                <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5" density="compact">
                </v-progress-linear>

                <MyTableReglement :headers="headers" :items="list" :codeclient="codeclient" :type="type">
                </MyTableReglement>

            </v-card>
            <v-card>
                <v-row justify="center">
                    <v-col cols="auto">
                        <!-- <v-sheet class="pl-2" style="height: 30px; font-size: 14px; width: 100px;" elevation="0">
                            <b>{{ totalReste }}</b>
                        </v-sheet> -->
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
import MyTableReglement from '@/components/adv/MyTableRegle.vue';
import dayjs from 'dayjs';
import { useValidationCommandeStore } from "@/store/Adv/adv.js";

import swal from 'sweetalert2';

export default defineComponent({
    components: {
        MyTableReglement,
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
        const loading = computed(() => store.loading)

        const TcodeClient = props.codeclient;
        const TnomClient = props.nomclient;
        const TypeReglement = props.type;

        const listRgBon = async () => {
            list.value = [];
            await store.fetchRgBon(TcodeClient, TypeReglement)
            list.value = store.soldes
        }


        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
            } else {
                return '';
            }

        };

        const total = computed(() =>
            list.value.reduce((sum, item) => sum + item.montant_rgbon, 0)
        );


        const save = async () => {
            // console.log(TcodeClient)
            console.log(TypeReglement)
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
            listRgBon()

        })

        const headers = [

            { title: 'CODE', align: 'start', key: 'code_rgbon', sortable: true },
            { title: 'CLIENT', align: 'start', key: 'nom_client_rgbon', sortable: true },
            { title: 'DATE', align: 'start', key: 'date_rgbon', sortable: true },
            { title: 'MODE', align: 'start', key: 'mode_rgbon', sortable: true },
            { title: 'REF CHQ', align: 'start', key: 'ref_rgchqbon', sortable: true },
            { title: 'REG REFBAN', align: 'start', key: 'refban_rgbon', sortable: true },
            { title: 'FACTURE', align: 'start', key: 'facture_rgbon', sortable: true },
            { title: 'MONTANT', align: 'end', key: 'montant_rgbon', sortable: true },

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
            store, TcodeClient, listRgBon, TypeReglement, total, TnomClient,
            formatPrice,loading,

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