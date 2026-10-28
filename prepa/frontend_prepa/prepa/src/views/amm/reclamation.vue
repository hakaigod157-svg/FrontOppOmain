<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-center">
                <span class="text-h5"> <u>Réclamation</u> {{ dossier.amm_ds_code }}</span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>
        </v-card-title>

        <div class="pa-2">
            <v-text-field v-model="selectedDate" type="date" label="Date" density="compact" variant="outlined"
                style="width: 150px;" />

            <v-select v-if="isNew" v-model="selectedNbRelcam" :items="['2eme réclamation', '3eme réclamation']"
                label="Nombre réclamation" density="compact" variant="outlined" class="mb-3" style="width: 300px;"
                :error="!selectedNbRelcam" />

            <v-row>
                <v-col cols="auto">
                    <v-select :items="reclamations" v-model="selectedValue" item-value="type_recl_code"
                        item-title="lib_recl" label="RECLAMATION" hide-no-data hide-details density="compact"
                        variant="outlined" class="mb-4 mt-1 p-0" style="width: 300px;" />

                    <!-- <v-textarea label="Reclamation" variant="outlined" v-model="textareaValue" rows="1"
                        style="width: 550px;"></v-textarea> -->
                </v-col>

                <v-col cols="auto">
                    <v-btn variant="tonal" color="#33691E" @click="addReclam" :disabled="loading" density="compact">
                        Ajouter
                    </v-btn>
                </v-col>
            </v-row>


            <div class="pa-2" style="width: 100%;">
                <MyTableAmm :headers="headers" :items="items" :loading="loading" action2="Supprimer"
                    @action2Item="Enlever" style="height: 150px; overflow-y: auto;border-bottom: 2px solid #ccc" />
            </div>
        </div>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#B71C1C" variant="outlined" @click="annuler">Annuler</v-btn>
            <v-btn color="#26A69A" variant="outlined" @click="save">Sauvegarder</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import swal from 'sweetalert2';
import MyTableAmm from '@/components/amm/MyTableAmm.vue';
import { uselistDossier } from "@/store/Amm/amm_dossier.js";
import { useRouter } from "vue-router";
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";


export default defineComponent({
    components: {
        MyTableAmm,
    },

    props: {
        itemValue: {
            type: String,
            default: 'value'
        },
        itemTitle: {
            type: String,
            default: 'text'
        },
        selectedItem: Object,
        showDateField: {
            type: Boolean,
            default: false
        },
        dossier: Object,

        isNew: {
            type: Boolean,
            default: false
        },

        existingReclamations: {
            type: Array,
            default: () => []
        },
    },

    setup(props, { emit }) {
        const router = useRouter();
        useSessionTimeout(Config.DURRE_SESSION, router);
        const selectedValue = ref(null);
        const selectedDate = ref(new Date().toISOString().substr(0, 10));
        const textareaValue = ref('');
        const items = ref([]);       // tableau des réclamations
        const loading = ref(false);  // état du bouton
        const storeInsertReclamation = uselistDossier();
        const storeListReclam = uselistDossier();

        const code_ds = props.dossier?.amm_ds_code || ''; // sécurité si dossier est null

        const reclamations = ref([]);  // pour stocker les items
        const selectedType = ref(null);
        const selectedNbRelcam = ref(null);

        const headers = [
            // { title: 'DATE', align: 'start', key: 'date_reclam', sortable: false },
            { title: 'RECLAMATION', align: 'start', key: 'reclamation', sortable: false },
            { title: '', align: 'center', key: 'actions', sortable: false, width: '100px' }, // 👉 colonne pour bouton supprimer
        ];

        // 👉 Ajouter une réclamation
        const addReclam = () => {
            if (!selectedValue.value || selectedValue.value.trim() === '') {
                return; // ne rien faire si vide
            }

            // récupérer l'objet complet correspondant au code sélectionné
            const selectedReclam = reclamations.value.find(r => r.type_recl_code === selectedValue.value);

            // ajouter dans le tableau
            items.value.push({
                date_reclam: selectedDate.value,
                reclamation: selectedReclam?.lib_recl || '',  // afficher le libellé dans le tableau
                code: selectedValue.value,                    // garder le code pour la DB
            });

            // enlever de la liste du v-select
            reclamations.value = reclamations.value.filter(r => r.type_recl_code !== selectedValue.value);

            // réinitialiser le select
            selectedValue.value = '';
        };

        // 👉 Supprimer une réclamation
        const Enlever = (item) => {
            // enlever du tableau
            items.value = items.value.filter(i => i !== item);

            // remettre dans la liste du v-select
            reclamations.value.push({
                type_recl_code: item.code,
                lib_recl: item.reclamation
            });

            // trier la liste pour garder l'ordre initial si besoin
            reclamations.value.sort((a, b) => a.lib_recl.localeCompare(b.lib_recl));
        };

        // 👉 Sauvegarder : juste log
        // const save = async () => {
        //     if (!items.value || items.value.length === 0) {
        //         swal.fire({
        //             icon: 'error',
        //             title: 'Il faut ajouter au moins une réclamation',
        //             toast: true,
        //             position: 'top-end',
        //             showConfirmButton: false,
        //             timer: 1500,
        //             background: '#f8d7da',
        //             color: '#721c24',
        //             timerProgressBar: true,
        //         });
        //         return;
        //     }

        //     await storeInsertReclamation.insertReclamation(code_ds, items.value);
        //     await storeInsertReclamation.updateAmmDosReclam(code_ds, selectedDate.value);

        //     await closeDetail();

        // };

        const save = async () => {
            // 🛑 Vérifie qu’un nombre de réclamations est sélectionné seulement pour un nouveau dossier
            if (props.isNew && !selectedNbRelcam.value) {
                swal.fire({
                    icon: 'error',
                    title: 'Veuillez sélectionner un nombre de réclamations',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f8d7da',
                    color: '#721c24',
                    timerProgressBar: true,
                });
                return;
            }

            // 🛑 Vérifie qu’il y a au moins une réclamation
            if (!items.value || items.value.length === 0) {
                swal.fire({
                    icon: 'error',
                    title: 'Il faut ajouter au moins une réclamation',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f8d7da',
                    color: '#721c24',
                    timerProgressBar: true,
                });
                return;
            }

            // 🧩 Prépare les données à émettre au parent
            const newReclams = items.value.map(item => ({
                lib_recl: item.reclamation,
                nb_reclam: selectedNbRelcam.value || '',
                date_reclam:selectedDate.value,
                date_nbre_reclam: selectedDate.value,
                amm_recl_recl: item.code,
            }));

            try {
                // ⚙️ Si ce n’est pas un nouveau dossier, on enregistre dans la base
                if (!props.isNew) {
                    const nbre_reclam = '1er réclamation'

                    console.log(items.value)

                    await storeInsertReclamation.insertReclamation(code_ds, items.value,nbre_reclam);
                    await storeInsertReclamation.updateAmmDosReclam(code_ds, selectedDate.value);
                }

                // 🔁 Émet les nouvelles réclamations au parent
                emit('save', newReclams);

                // ✅ Ferme la fenêtre
                closeDetail();

            } catch (error) {
                console.error('Erreur lors de la sauvegarde des réclamations :', error);
                swal.fire({
                    icon: 'error',
                    title: 'Erreur lors de la sauvegarde',
                    text: error.message || '',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#f8d7da',
                    color: '#721c24',
                    timerProgressBar: true,
                });
            }
        };



        // const listReclamation = async () => {
        //     await storeListReclam.fetchListReclam();
        //     reclamations.value = storeListReclam.listReclams;
        // }

        const listReclamation = async () => {
            await storeListReclam.fetchListReclam();
            reclamations.value = storeListReclam.listReclams;

            // 👉 Si c’est un nouveau, filtrer les réclamations déjà présentes
            if (props.isNew && props.existingReclamations?.length > 0) {
                // on extrait les codes déjà existants depuis existingReclamations
                const codesExistants = props.existingReclamations.map(r => r.amm_recl_recl);

                // on filtre la liste globale pour enlever ceux déjà utilisés
                reclamations.value = reclamations.value.filter(
                    r => !codesExistants.includes(r.type_recl_code)
                );
            }
        };



        onMounted(async () => {
            await listReclamation();
        });


        const annuler = () => {
            emit('annuler');
        };

        const closeDetail = () => {
            emit('annuler');
        };

        return {
            selectedValue, selectedDate, textareaValue, code_ds,
            save, annuler, closeDetail,
            headers, items, loading,
            addReclam, Enlever,
            reclamations,
            selectedType, selectedNbRelcam,
        };
    }
});
</script>
