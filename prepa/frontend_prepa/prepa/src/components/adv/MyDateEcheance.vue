<template>
    <v-dialog v-model="dialog" persistent density="compact" transition="dialog-bottom-transition" class="mx-auto"
        height="160">
        <v-card density="compact" class="mx-auto" flat dark>
            <v-toolbar dark color="primary" density="compact" style="height: 40px" class="mx-auto">
                <v-subheader density="compact" class="text-subtitle-1 text-truncate pa-3"> {{
                    cmd.nom_client_traite }} -> {{ cmd.code_traite }}
                </v-subheader>
            </v-toolbar>
            
            <v-text-field v-model="dateEcheance" type="date" label="Date d'Echeance de traite" hide-no-data hide-details
                class="pt-5 px-5 mx-auto" color="deep-purple-accent-4" density="compact" clearable
                variant="outlined"></v-text-field>
            <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn color="green" size="x-small" variant="flat" class="p-0 mx-auto"
                    @click="onCreeTraite">Valider</v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>
<script>

import { ref, watch } from 'vue';
import { useValidationCommandeStore } from "@/store/Adv/adv.js";
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
export default ({
    name: "onDateEcheance",
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
        editedItem: Object,
    },
    setup(props, { emit }) {

        const dateEcheance = ref(null);
        const dialog = ref(props.drawer);
        const cmd = ref(props.editedItem);
        const StoreAdv = useValidationCommandeStore();

        watch(
            () => props.drawer,
            (newVal) => {
                dialog.value = newVal;
            }
        );
        watch(
            () => props.editedItem,
            (newVal) => {
                cmd.value = newVal;
            }
        );

        const onCreeTraite = async () => {
            const today = dayjs().startOf('day'); // Obtenir la date actuelle sans l'heure
            const dateEcheanceFormatted = dayjs(dateEcheance.value).startOf('day'); // Supprimer l'heure pour comparer proprement

            if (!dateEcheance.value || dateEcheanceFormatted.isBefore(today)) {
                await Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "La date d'échéance doit être supérieure ou égale à aujourd'hui.",
                    showConfirmButton: true
                });
                return;
            }

            await StoreAdv.onCreeTraiteAdv(cmd.value.code_traite, null, 1, dateEcheance.value);

            if (StoreAdv.codeTraite && StoreAdv.codeTraite != "") {
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `La création du traité <span style='color: #05acdc;'>${StoreAdv.codeTraite}</span> 
                     pour la commande <span style='color: #05acdc;'>${cmd.value.code_traite}</span> 
                     de <span style='color: #05acdc;'>${cmd.value.nom_client_traite}</span> 
                     a été effectuée avec succès.`,
                    showConfirmButton: true,
                    timer: 1500
                });
            }

            emit('onValideTraite');
            dialog.value = false;
        };
        return {
            dialog,
            dateEcheance, cmd, onCreeTraite,

        }
    },




}); 
</script>