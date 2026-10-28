<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-left">
                <span class="text-h5">
                    <!-- <b><u>{{ TypeAvance === 3 ? 'AVANCE' : '' }}</u> - {{ TnomClient }} </b> -->
                    <b><u>Création Fabricant </u></b>
                </span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>

        </v-card-title>

        <div class="pa-2">
            <v-card>
                <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5" density="compact">
                </v-progress-linear>

            </v-card>

            <v-card-text>
                <v-row>
                    <!-- fab_code en lecture seule -->
                    <v-col cols="12">
                        <v-text-field label="Code" v-model="newCodeFab" @input="convertToUpperCase" variant="outlined"
                            density="compact" style="width: 110px;" readonly/>
                    </v-col>

                    <!-- fab_lib modifiable -->
                    <v-col cols="12">
                        <v-textarea label="Libellé Fabricant" v-model="newLibelleFab" variant="outlined"
                            density="compact" :error="!newLibelleFab"/>
                    </v-col>
                </v-row>
            </v-card-text>
        </div>

        <v-card-actions>
            <v-spacer />
            <v-btn color="red" variant="outlined" @click="annuler">Annuler</v-btn>
            <v-btn color="primary" variant="tonal" @click="save">Enregistrer</v-btn>
        </v-card-actions>

        <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#B71C1C" variant="outlined" @click="annuler">
                FERMER
            </v-btn> -->
        <!-- <v-btn color="#26A69A" variant="outlined" @click="save">
                Enregistrer
            </v-btn> -->
        <!-- </v-card-actions> -->
    </v-card>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { uselistFabricant } from "@/store/Amm/amm_fabricant.js";

import swal from 'sweetalert2';

export default defineComponent({
    components: {
        // MyTableSolde,
    },

    props: {
        codeFab: String,
        libelleFab: String,
        nomclient: String,
        type: Number,

    },

    setup(props, { emit }) {

        const dialogVisible = ref(false);
        const user = localStorage.getItem('username');
        const router = useRouter();
        const list = ref([]);
        const storeInsertFabricant = uselistFabricant();
        const storeNumFB = uselistFabricant();


        const newCodeFab = ref('');
        const newLibelleFab = ref('');
        const numFB = ref([]);

        const dossier = 'FABRICANT';
        const etat = 0;


        const save = async () => {
            // console.log(newCodeFab.value)
            // console.log(newLibelleFab.value)

            if (!newCodeFab.value || !newLibelleFab.value) {
                swal.fire({
                    icon: 'error',
                    title: 'Le code fabricant et le libellé ne peuvent pas être vides.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                    background: '#f8d7da',
                    color: '#721c24',
                    timerProgressBar: true,
                    // didOpen: (toast) => {
                    //     toast.addEventListener('mouseenter', swal.stopTimer)
                    //     toast.addEventListener('mouseleave', swal.resumeTimer)
                    // }
                });
                return; // on arrête la fonction
            }

            // swal.fire({
            //     title: 'Êtes-vous sûr de créer  ?',
            //     icon: 'warning',
            //     showCancelButton: true,
            //     confirmButtonColor: '#3085d6',
            //     cancelButtonColor: '#d33',
            //     confirmButtonText: 'Oui, Créer',
            //     cancelButtonText: 'Annuler'
            // }).then(async (result) => {
            //     if (result.isConfirmed) {
            //         try {

            //             swal.fire({
            //                 icon: 'success',
            //                 title: 'Succès !',
            //                 text: 'Le libellé du fabricant a été inséré.',
            //                 showConfirmButton: false,
            //                 timer: 1500
            //             });

            //             closeDetail();
            //         } catch (error) {
            //             swal.fire({
            //                 icon: 'error',
            //                 title: 'Erreur',
            //                 text: 'Une erreur est survenue lors de l\'insertion.',
            //                 showConfirmButton: false,
            //                 timer: 2000
            //             });
            //         }
            //     }
            // });

            await storeNumFB.fetchNumFB(dossier, 1);
            numFB.value = storeNumFB.listnumfbs;
            newCodeFab.value =numFB.value[0].num_fb

            await storeInsertFabricant.insertFabricant(newCodeFab.value, newLibelleFab.value);
            closeDetail();

        };

        const annuler = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        const closeDetail = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        const convertToUpperCase = () => {
            newCodeFab.value = newCodeFab.value.toUpperCase();
        };

        const listNumFB = async () => {
            await storeNumFB.fetchNumFB(dossier, etat);
            numFB.value = storeNumFB.listnumfbs;

            // ⚡ récupérer le premier élément du tableau et l’afficher dans le champ texte
            if (numFB.value.length > 0) {
                newCodeFab.value = numFB.value[0].num_fb
            }
        };


        onMounted(async () => {
            list.value = [];
            numFB.value = [];
            await listNumFB();
        })


        return {
            dialogVisible,
            annuler,
            closeDetail,
            save,
            user, list,
            newCodeFab, newLibelleFab,
            convertToUpperCase,
            numFB,


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