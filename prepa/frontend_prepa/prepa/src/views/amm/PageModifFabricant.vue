<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-left">
                <span class="text-h5">
                    <!-- <b><u>{{ TypeAvance === 3 ? 'AVANCE' : '' }}</u> - {{ TnomClient }} </b> -->
                     <b><u>Modification Fabricant</u></b>
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
                        <v-text-field label="Code" :model-value="codeFab" readonly variant="outlined"
                            density="compact"  style="width: 140px;"/>
                    </v-col>

                    <!-- fab_lib modifiable -->
                    <v-col cols="12">
                        <v-textarea label="Libellé Fabricant" v-model="localLibelleFab" variant="outlined"
                            density="compact" />
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
        const storeUpdateFabricant = uselistFabricant();

        const localLibelleFab = ref(props.libelleFab);
        const codeFab_local = ref(props.codeFab)

        // const save = async () => {
        // console.log(localLibelleFab.value)
        // console.log(codeFab_local.value)
        //     await storeUpdateFabricant.updateLibelleFabricant(localLibelleFab.value , codeFab_local.value);
        //     closeDetail();
        // }

        const save = async () => {
            await storeUpdateFabricant.updateLibelleFabricant(localLibelleFab.value, codeFab_local.value);
            closeDetail();
            // swal.fire({
            //     title: 'Êtes-vous sûr de modifier  ?',
            //     // text: "Vous allez modifier ce fabricant.",
            //     icon: 'warning',
            //     showCancelButton: true,
            //     confirmButtonColor: '#3085d6',
            //     cancelButtonColor: '#d33',
            //     confirmButtonText: 'Oui, modifier',
            //     cancelButtonText: 'Annuler'
            // }).then(async (result) => {
            //     if (result.isConfirmed) {
            //         try {
            //             await storeUpdateFabricant.updateLibelleFabricant(localLibelleFab.value, codeFab_local.value);

            //             swal.fire({
            //                 icon: 'success',
            //                 title: 'Modifié !',
            //                 text: 'Le libellé du fabricant a été mis à jour.',
            //                 showConfirmButton: false,
            //                 timer: 1500   // disparaît après 1.5s
            //             });

            //             closeDetail();
            //         } catch (error) {
            //             swal.fire({
            //                 icon: 'error',
            //                 title: 'Erreur',
            //                 text: 'Une erreur est survenue lors de la modification.',
            //                 showConfirmButton: false,
            //                 timer: 2000   // disparaît après 2s
            //             });
            //         }
            //     }
            // });
        };

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
        })


        return {
            dialogVisible,
            annuler,
            closeDetail,
            save,
            user, list,
            localLibelleFab,


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