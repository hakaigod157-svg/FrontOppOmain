<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-center">
                <span class="text-h5"> <u>2 ème Rappel du</u> :{{ formatNumero(Tnumero) }} - {{ TnomClient }}</span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>

        </v-card-title>
        <div class="pa-2">
            <v-card>
                <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5" density="compact">
                </v-progress-linear>

                <MyTableFirst :headers="headers" :items="list" :seqEntrant=seqEntrant v-model="selected" return-object
                    :justTwo="1">
                </MyTableFirst>

            </v-card>
        </div>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#B71C1C" variant="outlined" @click="annuler">
                Annuler
            </v-btn>
            <v-btn color="#26A69A" variant="outlined" @click="save">
                Enregistrer
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeMount, computed, watch } from 'vue';
// import useNumericInputValidationOnly from "@/composables/validateNumericInput.js";
// import useSessionTimeout from '@/utils/useSessionTimeout';
import { useRouter } from 'vue-router';
import { useAppelSortantStore } from "@/store/SuiviFacturation/appelSortant";
import MyTableFact from '@/components/facturio/MyTableFact.vue';
import MyTableFirst from '@/components/facturio/MyTableFirst.vue';
import dayjs from 'dayjs';
// import Config from "@/utils/config.js";
import swal from 'sweetalert2';

export default defineComponent({
    components: {
        MyTableFact,
        MyTableFirst,
    },

    props: {
        numero: String,
        daterappel_1: Date,
        nomclient: String,
        seqEntrant: Number,
    },

    setup(props, { emit }) {

        const dialogVisible = ref(false);
        const user = localStorage.getItem('username');
        const router = useRouter();
        const list = ref([]);
        const store = useAppelSortantStore();

        const Tnumero = props.numero;
        const Tcalldate = props.daterappel_1;
        const TnomClient = props.nomclient;

        const dateObj = new Date(Tcalldate);
        const datePart = dateObj.toISOString().split('T')[0];
        const timePart = dateObj.toLocaleTimeString('fr-FR', { hour12: false });

        const loading = computed(() => store.loading)

        const selected = ref([]);


        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
            } else {
                return '';
            }

        };

        const save = async () => {

            try {

                // console.log('Valeur selected =' + selected.value)

                if (selected.value == '') {
                    const Toast = swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 4000, //40s d'affichage
                        timerProgressBar: true,
                        onOpen: (toast) => {
                            toast.addEventListener('mouseenter', swal.stopTimer)
                            toast.addEventListener('mouseleave', swal.resumeTimer)
                        }
                    });

                    Toast.fire({
                        icon: 'warning',
                        title: 'Aucune donnée sélectionnée',
                        background: '#FFF3E0'

                    });
                    return; // Arrêter l'exécution de la fonction
                }


                // Collect promises to update state
                const updatePromises = selected.value.map(async (itemA) => {
                    const itemB = list.value.find(itemB => itemB.seq === itemA.seq);
                    if (itemB) {

                        // console.log(props.seqEntrant)
                        // console.log(itemB.seq)

                        // console.log(itemB.etat_sortant)

                        if (itemB.etat_sortant > 1 && selected.value.length > 0) {
                            await store.updateEtatSortie(props.seqEntrant, itemB.etat_sortant, itemB.seq, 2, itemB.src_sortant);
                            swal.fire({
                                icon: "info",
                                title: "Enregistrement effectuée",
                                // text: "Enregistrement effectuée",
                                allowOutsideClick: false,
                                allowEscapeKey: false
                            }).then(() => {
                                dialogVisible.value = false;

                                emit('annuler');
                            });
                        } else {
                            const Toast = swal.mixin({
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 4000, //40s d'affichage
                                timerProgressBar: true,
                                onOpen: (toast) => {
                                    toast.addEventListener('mouseenter', swal.stopTimer)
                                    toast.addEventListener('mouseleave', swal.resumeTimer)
                                }
                            });

                            Toast.fire({
                                icon: 'warning',
                                title: 'Aucune action sélectionnée',
                                background: '#FFF3E0'

                            });
                            return; // Arrêter l'exécution de la fonction
                        }

                    }
                });

                // Wait for all updates to complete
                await Promise.all(updatePromises);

                // console.log('All items have been saved.');
            } catch (error) {
                // console.error('Error saving items:', error);
            }
        };

        const annuler = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        const closeDetail = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        const formatNumero = (numero) => {
            if (numero && numero.length === 10) {
                return numero.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, '$1 $2 $3 $4');
            }
            return numero;
        };

        onMounted(async () => {
            const today = dayjs().format('YYYY-MM-DD');

            list.value = [];
            listAppelSortantSecond();

            // console.log(list.value)
        })


        const listAppelSortantSecond = async () => {
            await store.fetchAppelSortant(formatDateTime(Tcalldate), datePart, timePart, Tnumero)
            list.value = store.AppelSortants
        }



        const headers = [
            // { title: 'SEQ', align: 'center', key: 'seq', sortable: true },
            { title: 'DATE', align: 'center', key: 'calldate_sortant', sortable: true },
            { title: 'POSTE INTERNE', align: 'center', key: 'src_sortant' },
            { title: 'CLIENT', align: 'start', key: 'client_sortant', sortable: true },
            { title: 'NUMERO', align: 'end', key: 'numero_sortant', sortable: true },
            // { title: '', align: 'center', key: 'add', sortable: true },
            // { title: 'CONTACT', align: 'center', key: 'numero', sortable: true },
            // { title: 'NUMERO INDICATIF', align: 'start', key: 'numero_indicatif' },
            // { title: 'LOCALISATION', align: 'start', key: 'dcontext' },
            // { title: 'APPEL', align: 'start', key: 'dst' },
            // { title: 'CHANNEL', align: 'start', key: 'dstchannel' },
            // { title: 'DUREE(s)', align: 'end', key: 'duration' },
            { title: 'DUREÉ APPEL(s)', align: 'center', key: 'billsec_sortant' },
            { title: 'DISPOSITION', align: 'start', key: 'disposition_sortant' },
            // { title: 'STATUS', align: 'start', key: 'statut' },
            // { title: '1er Rappel', align: 'start', key: 'rappel1'},
            // { title: '2eme Rappel', align: 'start', key: 'rappel2' },
            // { title: 'DEPUIS(mn)', align: 'start', key: 'depuis' },
            // { title: 'ACTION', align: 'start', key: 'action_first', value: 'action_first' },
            { title: '', align: 'start', key: 'etat_sortant', width: '15%' },

        ];

        const onSelectionChange = (selectedItems) => {
            selected.value = selectedItems;
        };



        return {
            dialogVisible,loading,
            annuler, closeDetail,
            save, selected,
            user, list,
            headers, Tnumero, Tcalldate, TnomClient, formatDateTime, onSelectionChange,
            listAppelSortantSecond, formatNumero,

        };
    }
});

</script>
<style>
.swal2-container {
    z-index: 20000 !important;
}
</style>