<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-center">
                <span class="text-h5"> <u>Actions</u></span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>

        </v-card-title>

        <div class="pa-2">
            <!-- <v-progress-linear 
                    v-if="loading" 
                    color="primary" 
                    rounded indeterminate 
                    height="5"
                    density="compact">
                  </v-progress-linear> -->



            <v-select :items="filteredList" :seqEntrant=seqEntrant v-model="selected" item-value="id" item-title="name"
                clearable hide-no-data hide-details density="compact" variant="outlined" class="mb-8 mt-1 p-0 "
                style="height: 10px;text-align: right">
            </v-select>


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
import { defineComponent, ref, onMounted, computed } from 'vue';
import { uselistAction } from '@/store/SuiviFacturation/listAction.js';
import { useAppelEntrantStore } from "@/store/SuiviFacturation/appelEntrant";
import { useAppelSortantStore } from "@/store/SuiviFacturation/appelSortant";

import dayjs from 'dayjs';
import swal from 'sweetalert2';

export default defineComponent({
    components: {

    },

    props: {
        numero: String,
        calldate: Date,
        nomclient: String,
        seqEntrant: Number,
        listAppelEntrant: Function,
        delock: Function,
    },

    setup(props, { emit }) {

        const storelistAction = uselistAction();
        const dialogVisible = ref(false);
        const user = localStorage.getItem('username');
        // const user = localStorage.getItem('username');
        // const router = useRouter();
        // const list = ref([]);
        // const store = useAppelSortantStore();

        const Tnumero = props.numero;
        const Tcalldate = props.calldate;
        const TnomClient = props.nomclient;
        const Tseq = props.seqEntrant;
        const TlistAppelEntrant = props.listAppelEntrant;
        const Tdelock = props.delock;

        const selected = ref([]);
        const listActions = ref([]);
        const store = useAppelEntrantStore();
        const store_sortant = useAppelSortantStore();

        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
            } else {
                return '';
            }

        };

        onMounted(async () => {
            listActions.value = [];
            await storelistAction.fetchListAction(props.seqEntrant);
            listActions.value = storelistAction.listactions;
        });

        const filteredList = computed(() => listActions.value.filter(item => item._status === false));


        const save = async () => {

             console.log(selected.value)

            // A rappeler
            if (selected.value == 1) {
                const displayName = TnomClient ? TnomClient : Tnumero;
                swal
                    .fire({
                        title: `Rappeler : <br><span style="color: #43A047;">${displayName}</span> ?`,
                        showDenyButton: true,
                        showCancelButton: false,
                        allowOutsideClick: false,
                        confirmButtonText: 'Oui',
                        denyButtonText: `Non`,
                        icon: "question",
                    })
                    .then(async (result) => {
                        if (result.isConfirmed) {
                            const id = Tseq
                            const etat_appel_entrant = selected.value
                            const params = {
                                AppelId: id,
                                userFact: user,
                                etat_appel_entrant: etat_appel_entrant,
                            }
                            await store.updateEtat(params)
                            Tdelock()
                            TlistAppelEntrant();

                            dialogVisible.value = false;
                            emit('annuler');

                        } else if (result.isDenied) {
                            // swal.fire('Transfert annuler', '', 'info');
                        }
                    });
            } else if (selected.value == '' || selected.value == null) {
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
            else {
                const etat_appel_entrant = selected.value

                await store_sortant.updateEtatSortie(Tseq, etat_appel_entrant, null, 0, null)
                //eto no manao delock
                Tdelock()
                TlistAppelEntrant();

                dialogVisible.value = false;
                emit('annuler');
            }

        };

        const annuler = () => {
            Tdelock()
            dialogVisible.value = false;
            emit('annuler');
        };

        const closeDetail = () => {
            Tdelock()
            dialogVisible.value = false;
            emit('annuler');
        };


        return {
            dialogVisible, user, filteredList, Tnumero, Tcalldate, TnomClient, Tseq, selected, TlistAppelEntrant,Tdelock,
            save, annuler, closeDetail, formatDateTime,listActions,
        };
    }
});

</script>