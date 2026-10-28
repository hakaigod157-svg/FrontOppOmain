<template>
    <v-dialog v-model="dialog" persistent density="compact" transition="dialog-bottom-transition" width="600"
        height="460">
        <v-card density="compact" flat dark>
            <v-toolbar dark color="#b8b3cc" density="compact" style="height: 40px">

                <v-subheader density="compact" class="text-subtitle-1 text-truncate pa-3"> Accord pour {{
                    cleanedNomClient }} -> {{ cmd.code }}
                </v-subheader>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeDrawer" density="compact">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container class="mx-auto py-0 my-0 mb-0">
                <v-form @submit.prevent="onValide" class="pt-0 mt-0">
                    <v-row class="pa-0 ma-0">
                        <v-col cols="12" density="compact">
                            <My-Select comb_lab="Accord" :items="store.listAccords" v-model="m_accord"
                                item-title="designation" item-value="code" :disabled="loading"
                                :append-icon="m_accord ? '' : requiredIcon" :class="{
                                    'custom-append-icon':
                                        m_accord === '' || m_accord === null,
                                }" required></My-Select>
                        </v-col>
                        <v-col cols="12" density="compact" class="my-n2">

                            <My-Select comb_lab="Condition de Règlement" :items="store.listReglements"
                                v-model="m_reglement" item-title="code" item-value="code" :disabled="loading"
                                :append-icon="m_reglement ? '' : requiredIcon" :class="{
                                    'custom-append-icon': m_reglement === '' || m_reglement === null,
                                }" required></My-Select>
                        </v-col>
                        <v-col cols="12" density="compact" class="my-n2">
                            <MyTextarea name_lab_area="Commentaires accords" v-model="m_comAccord" rows="2" hide-details
                                hide-no-data>
                            </MyTextarea>
                        </v-col>
                        <v-col cols="12" density="compact" class="my-n2">
                            <v-switch density="compact" label="Passer à Bon à Livrer" color="green-darken-3"
                                v-model="bal" class="text-none font-weight-light mx-auto px-6" hide-details small flat
                                hide-no-data></v-switch>
                        </v-col>
                        <v-col cols="6" density="compact" class="my-n2">
                            <MyTextarea name_lab_area="Commentaires Clients" v-model="m_comCtl"
                                style="margin-top: 0; margin-bottom: 0" rows="2">
                            </MyTextarea>
                        </v-col>
                        <v-col cols="6" density="compact" class="my-n2">
                            <MyTextarea name_lab_area="Commentaires Magasins" v-model="m_comMagasin"
                                style="margin-top: 0; margin-bottom: 0" rows="2">
                            </MyTextarea>
                        </v-col>
                    </v-row>
                    <v-row align="left" density="compact" justify="start" class="my-n2">
                        <v-col cols="12" sm="6" md="6" density="compact"> </v-col>
                        <v-col cols="12" sm="6" md="3" class="text-right" density="compact">
                            <v-btn class="text-none text-button mx-auto" color="error" variant="flat"
                                prepend-icon="mdi-cancel" @click="closeDrawer" size="small"
                                style="margin-right: 10px">Annuler</v-btn>
                        </v-col>
                        <v-col cols="12" sm="6" md="3" class="text-right" density="compact">
                            <v-btn type="submit" color="success" class="text-none text-button mx-auto" size="small"
                                prepend-icon="mdi-check-circle" variant="flat" style="margin-left: 1px">Valider</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
        </v-card>
    </v-dialog>
</template>
<script>
import MySelect from "@/components/MySelect.vue"
import MyTextarea from "@/components/MyTextarea.vue";
import { defineComponent, onMounted, ref, watch, computed } from "vue";
import { useValidationCommandeStore } from "@/store/Adv/adv.js";
import useConfirmation from "@/composables/useConfirmationToast";
import Swal from 'sweetalert2';
import ConseilReapp from "../transfert/ConseilReapp.vue";
import MyDateEcheance from "@/components/adv/MyDateEcheance.vue";
export default defineComponent({
    components: { MySelect, MyTextarea },
    name: "onValideCmdAdv",
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
        editedItem: Object,
    },


    setup(props, { emit }) {
        const store = useValidationCommandeStore();
        const m_accord = ref(null);

        const m_comAccord = ref('');
        const m_comCtl = ref('');
        const m_comMagasin = ref('');
        const dialog = ref(props.drawer);
        const cmd = ref(props.editedItem);
        const m_reglement = ref('');
        const bal = ref(false);
        const editedItemDate = ref(null);
        const drawerDate = ref(false);
        const { confirmAction } = useConfirmation();
        onMounted(async () => {
            await store.fetchAcccordADV();
            await store.fetchReglementClt(null);

            watch(
                () => cmd.value.condition,
                (newCondition) => {
                    const index = store.listReglements.findIndex(
                        (reglement) => reglement.code.trim() === newCondition.trim(),
                    );

                    if (index !== -1) {
                        m_reglement.value = store.listReglements[index].code;

                    } else {
                        m_reglement.value = null; // Réinitialiser si aucune correspondance n'est trouvée
                    }
                },
                { immediate: true } // Exécuter immédiatement lors du montage
            );
            m_comCtl.value = cmd.value.commentaire_client
        });
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




        const onValide = async () => {
            if (!m_accord.value || !m_reglement.value) {
                store.error = "Veuillez remplir tous les champs obligatoires";
                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "ACCORD et Condition de Réglement sont tous des champs obligatoires",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                });
                return;
            }

            await store.getStade_cmd(cmd.value.code);

            if (store.stade < 3) {
                await store.onValideAdv(
                    cmd.value.code,
                    m_accord.value.trim(),
                    m_comAccord.value,
                    m_comCtl.value,
                    m_comMagasin.value,
                    cmd.value.condition.trim(),
                    m_reglement.value.trim(),
                    cmd.value.facture_echue,
                    null,
                    bal.value ? 1 : 0,
                    localStorage.getItem("ip_local")
                );

                const results = store.TestApresValide;

                if (!Array.isArray(results) || results.length === 0) {
                    Swal.fire({
                        icon: "error",
                        title: "Aucun résultat",
                        text: "La validation n'a retourné aucun résultat.",
                    });
                    return;
                }

                emit("onValide");

                let smsSuccessList = [];

                for (const result of results) {
                    if (result.stade === 2) {
                        await store.sendSMS(result.numero, result.notification);
                        smsSuccessList.push(`<span style='color: #05acdc;'>${result.numero} (${result.nom_com})</span>`);
                    }
                }
                let traiteHandled = false;

                for (const result of results) {
                    if (!traiteHandled && result.mode === 5 && result.traiteEncours?.trim().length === 0 && result.stade < 3) {
                        const confirmed = await confirmAction(
                            "Confirmation de création traite",
                            `Voulez-vous créer un traite pour la commande <span style='color: #05acdc;'>${cmd.value.code}</span> de <span style='color: #05acdc;'>${cleanedNomClient.value}</span> ?`
                        );
                        if (confirmed) {
                            await store.onCreeTraiteAdv(cmd.value.code, result.traiteEncours, 1);
                            await Swal.fire({
                                position: "center",
                                icon: "success",
                                title: `La création du traite <span style='color: #05acdc;'>${store.codeTraite}</span> a été effectuée avec succès.`,
                                showConfirmButton: true,
                                confirmButtonText: "OK",
                            });
                        }
                        traiteHandled = true;
                    } else if (!traiteHandled && result.mode === 5 && result.traiteEncours?.trim().length > 0 && result.stade < 3) {
                        const confirmed = await confirmAction(
                            "Confirmation de rajout dans un traite",
                            `Voulez-vous rajouter la commande <span style='color: #05acdc;'>${cmd.value.code}</span> au traite <span style='color: #05acdc;'>${result.traiteEncours}</span> ? Cliquez NON pour créer un autre traite.`
                        );
                        const mode = confirmed ? 0 : 1;
                        await store.onCreeTraiteAdv(cmd.value.code, result.traiteEncours, mode);
                        await Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `La création du traite <span style='color: #05acdc;'>${store.codeTraite}</span> a été effectuée avec succès.`,
                            showConfirmButton: true,
                            confirmButtonText: "OK",
                        });
                        traiteHandled = true;
                    } else if (result.stade >= 3) {
                        await Swal.fire({
                            icon: "error",
                            title: "Impossible de valider cette commande",
                            html: `Le bon <span style='color: #05acdc;'>${cmd.value.code}</span> a déjà été validé.`,
                        });
                    }
                }


                if (smsSuccessList.length > 0) {
                    await Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `Le Message de déblocage de la commande <span style='color: #05acdc;'>${cmd.value.code}</span> a été envoyé à :<br>${smsSuccessList.join("<br>")}`,
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                    });
                } else {
                    await Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `La commande <span style='color: #05acdc;'>${cmd.value.code}</span> de <span style='color: #05acdc;'>${cleanedNomClient.value}</span> a été validée avec succès${bal.value ? " et est marquée comme bon à livrer." : "."}`,
                        showConfirmButton: true,
                        timer: 1500,
                    });
                }
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Impossible de valider cette commande",
                    html: `Le bon <span style='color: #05acdc;'>${cmd.value.code}</span> a déjà été validé.`,
                });
                emit("onValide");
            }
        };
        const cleanedNomClient = computed(() => {
            return cmd.value.nom_client.split("->")[0].trim();
        });
        const closeDrawer = () => {
            emit("close");
        };
        const requiredIcon = "mdi-alert-circle";
        return {
            store, m_accord, m_reglement, m_comAccord, m_comMagasin, m_comCtl, onValide, dialog, closeDrawer, cmd, requiredIcon, cleanedNomClient, bal, editedItemDate, drawerDate,

        };
    },

});
</script>
<style>
.custom-append-icon {
    color: #ff0000;
}
</style>