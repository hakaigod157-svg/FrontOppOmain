<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-left">

                <span class="text-h5">
                    <b><u>{{ TypeSolde === 0 ? 'SOLDE' : TypeSolde === 1 ? 'FACTURE ÉCHUE' : '' }}</u> - {{ TnomClient
                        }} </b>
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
            <!-- Total reste faire en bas -->
            <div class="d-flex align-center justify-space-between">
                <v-chip class="ma-2 custom-font-size" label>
                    <u>TOTAL RESTE</u> &nbsp;: &nbsp;<b>{{ formatPrice(totalReste) }}</b>
                </v-chip>

                <v-chip class="ma-2 centered-chip" color="#CCFF99" variant="elevated" label>
                    <b>Partiel</b>
                </v-chip>
            </div>
            <v-chip class="ma-2 custom-font-size" label>
                <u>RÉSERVATION </u>: &nbsp;<b>{{ formatPrice(totalreservation) }}</b>
            </v-chip>
            <br>
            <v-chip class="ma-2 custom-font-size" label>
                <u>NORMALE </u>: &nbsp;&nbsp;<b>{{ formatPrice(totalfanormal) }}</b>
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
        const TypeSolde = props.type;

        const listSolde = async () => {
            list.value = [];
            await store.fetchSolde(TcodeClient, TypeSolde)
            list.value = store.soldes
        }

        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
            } else {
                return '';
            }

        };

        const totalReste = computed(() =>
            Math.trunc(
                list.value.reduce((sum, item) => sum + item.reste, 0)
            )
        );

        const totalreservation = computed(() =>
            Math.trunc(
                list.value
                    .filter(item => item.farsrv === 1)
                    .reduce((sum, item) => sum + item.reste, 0)
            )
        );

        const totalfanormal = computed(() =>
            Math.trunc(
                list.value
                    .filter(item => item.farsrv === 0)
                    .reduce((sum, item) => sum + item.reste, 0)
            )
        );

        const save = async () => {
            console.log(TypeSolde)
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
            listSolde()


        })

        const headers = [

            // { title: 'JOURN', align: 'start', key: 'journ', sortable: true },
            { title: 'PIÈCE', align: 'start', key: 'piece', sortable: true },
            { title: 'DATE', align: 'start', key: 'date', sortable: true },
            { title: 'ÉCHÉANCE', align: 'end', key: 'echeance', sortable: true },
            { title: 'MONTANT INIT', align: 'end', key: 'montantinit', sortable: true },
            { title: 'RESTE', align: 'end', key: 'reste', value: 'reste', sortable: true },
            { title: 'COMMENT 1', align: 'start', key: 'comment1', sortable: true },
            { title: 'COMMENT 2', align: 'start', key: 'comment2', sortable: true },
            // { title: 'MONTANT', align: 'end', key: 'montant', sortable: true },
            // { title: 'FACL', align: 'center', key: 'facl', sortable: true },
            { title: 'RETARD', align: 'center', key: 'nbjour', sortable: true },
            { title: 'CLIENT', align: 'start', key: 'ecllib', sortable: true },

        ];


        const formatPrice = (price) => {
            if (price == null || isNaN(price)) {
                return "";
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

        return {
            dialogVisible,
            annuler,
            closeDetail,
            save,
            user, list,
            headers, formatDateTime,
            store, TcodeClient, listSolde, TypeSolde, totalReste, totalreservation, totalfanormal, TnomClient,
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