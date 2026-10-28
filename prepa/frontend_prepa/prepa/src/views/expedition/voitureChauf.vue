<template>
    <v-dialog v-model="dialog" persistent density="compact" transition="dialog-bottom-transition" max-width="650">
        <v-card density="compact" flat>
            <v-toolbar color="#d7ead5" density="compact">
                <v-toolbar-title density="compact">Paramétrage Voiture::Chauffeur</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn icon @click="closeDrawer" density="compact">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-container class="mx-auto py-0 my-0 mb-0">
                <v-card-text class="pt-0 mt-0">
                    <v-form @submit.prevent="onValide" class="pt-0 mt-0">
                        <v-row class="pt-0 mt-0">
                            <v-col cols="12" sm="6" md="5">
                                <My-Select label="Voiture" :items="listVoit" v-model="m_voiture" variant="outlined"
                                    color="deep-purple-accent-4" item-title="xlibelle" item-value="xnum"
                                    @update:modelValue="chargeVoit" hide-details :disabled="loading" />
                            </v-col>
                            <v-col cols="12" sm="6" md="5">
                                <My-Select label="Chauffeur" :items="listChauf" v-model="m_chauf" variant="outlined"
                                    color="deep-purple-accent-4" item-title="xuser" item-value="xuser"
                                    @update:modelValue="chargeChauf" hide-details :disabled="loading" />
                            </v-col>

                            <v-col cols="12" sm="6" md="2">
                                <v-btn color='primary' prepend-icon='mdi-plus-circle-outline' text="Ajouter"
                                    @click="onAjout" class="text-none mt-2" size="small" variant="flat"></v-btn>
                            </v-col>

                        </v-row>
                        <div style="width: 100%; overflow-x: auto; overflow-y: auto;" color="#EF5350" class="mt-5 p-0">
                            <v-progress-linear v-if="loadings" color="primary" rounded indeterminate height="3"
                                density="compact"></v-progress-linear>
                            <MyTable :headers="headers" :items="list" action2="supprimer" :fixed-header="true"
                                @onSupprVoitCh="onSuppr" style="width:100%;" :showAction1="false" />
                        </div>


                        <v-row align="left" density="compact" justify="start" class="mt-2">
                            <v-col cols="12" sm="6" md="3" density="compact">
                                <v-btn color='blue-lighten-2' prepend-icon='mdi-sync'
                                    class="text-none text-button mx-auto" size="small" variant="flat"
                                    @click="onSync">Actualiser</v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="5" density="compact"> </v-col>
                            <v-col cols="12" sm="6" md="2" class="text-right" density="compact">
                                <v-btn class="text-none text-button mx-auto" color="error" variant="flat"
                                    prepend-icon="mdi-cancel" @click="closeDrawer" size="small"
                                    style="margin-right: 2px">Annuler</v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="2" class="text-right" density="compact">
                                <v-btn type="submit" color="success" class="text-none text-button mx-auto" size="small"
                                    prepend-icon="mdi-check-circle" variant="flat"
                                    style="margin-left: 2px">Valider</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-container>
        </v-card>
        <v-snackbar v-model="snackbar" :timeout="1500" class="text-center" location="center" stacked>
            <strong class="font-weight-medium">{{ text }}</strong>

            <template #actions>
                <v-btn color="red" variant="text" @click="snackbar = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-dialog>

</template>

<script>

import MySelect from '@/components/MySelect.vue';
import Swal from 'sweetalert2';
import { useCreateLVStore } from "@/store/Expedition/createLV.js";
import { useLoginPlusStore } from "@/store/utils/loginPlus"
import { useTransporteurStore } from "@/store/utils/transporteur"
import MyTable from '@/components/expedition/MyTable.vue';
import {
    ref,
    defineComponent,
    reactive,
    onMounted,
    onBeforeUnmount,
    computed,
    watch,
    isProxy,
} from "vue";
import { useEnumerationStore } from "@/store/utils/enumeration";


export default defineComponent({
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        MySelect,
        MyTable,


    },

    name: "ajoutListeMidac",
    setup(props, { emit }) {
        const dialog = ref(props.drawer);
        const list = ref([])
        const loading = ref(false);

        const closeDrawer = () => {
            emit("close");
        };
        const snackbar = ref(false)
        const text = ref("")
        const m_voiture = ref();
        const m_chauf = ref();

        const storeliv = useCreateLVStore();
        const storeChauf = useLoginPlusStore();
        const storeVoit = useTransporteurStore();
        const listChauf = ref([]);
        const listVoit = ref([]);
        const list_del = ref([]);
        const recap = ref([]);
        watch(() => props.drawer, (newVal) => {
            dialog.value = newVal;
        });

        const chargeChauf = async () => {
            listChauf.value = []
            await storeChauf.fetchLoginPlus("xType='ch' and rtrim(xUser) not in (select rtrim(xCHAUFF) from xVOIT_CH)")
            listChauf.value = storeChauf.listLoginPlus.filter(
                chauf =>
                    !list.value.some(
                        item =>
                            item.chauf?.trim() === chauf.xuser?.trim()
                    )

            );
        }


        const chargeVoit = async () => {
            listVoit.value = []
            await storeVoit.fetchTransporteurs(" rtrim(xNUM) not in (select rtrim(xNUM_VOIT) from xVOIT_CH)")
            listVoit.value = storeVoit.transporteurs.filter(
                chauf =>
                    !list.value.some(
                        item =>
                            item.voit?.trim() === chauf.xnum?.trim()
                    )

            );
        }

        const chargeVoitChauf = async () => {
            list.value = [];
            await storeliv.fetchVoitureCh();
            list.value = storeliv.m_listVoitCh

            await chargeChauf();
            await chargeVoit();
        }

        const headers = [
            {
                title: 'Voiture', align: 'start', key: 'voit'
            },
            { title: 'Chauffeur', align: 'start', key: 'chauf' },
            { title: 'Disponibilité', align: 'start', key: 'disponibilite', },
            { title: 'Actions', align: 'center', key: 'dispo', width: "2%" },
        ]


        const onValide = async () => {
            let success = true;

            try {
                // 🔴 DELETE
                if (list_del.value.length > 0) {
                    for (const row of list_del.value) {
                        const result = await storeliv.testDispo(row.voit, row.chauf);

                        if (result) {
                            // showMsg(`Impossible de supprimer ${row.voit}/${row.chauf}`);
                            recap.value.push(`Impossible de supprimer ${row.voit}/${row.chauf}: NON DISPO`)
                            continue;
                        }

                        try {
                            if (row.seq) {
                                await storeliv.delVoitCh(row.seq);
                                recap.value.push(`${row.voit} -- ${row.chauf} : supprimé`);
                            }

                        } catch (e) {
                            success = false;
                            // showMsg(`Erreur suppression ${row.voit}/${row.chauf}`);
                        }
                    }
                }

                // 🟢 INSERT
                if (list.value && list.value.length > 0) {
                    for (const item of list.value) {
                        if (!item.seq || item.seq === 0 || item.seq === "") {

                            const result = await storeliv.testDispo(item.voit, item.chauf);

                            if (result) {
                                //  showMsg(`Non disponible : ${item.voit} / ${item.chauf}`);
                                recap.value.push(`Impossible d'ajouter ${item.voit} / ${item.chauf}: NON DISPO`)
                                continue;
                            }

                            try {
                                await storeliv.insertVoitCh(item.voit, item.chauf);
                                recap.value.push(`${item.voit} -- ${item.chauf} : ajouté`);
                            } catch (e) {
                                success = false;
                                // showMsg(`Erreur insertion ${item.voit}/${item.chauf}`);
                            }
                        }
                    }
                }

            } catch (error) {
                console.error(error);
                success = false;
                showMsg("Erreur lors de la validation !");
            }

            // 🚨 uniquement si tout OK
            if (success) {
                emit("onValide");
                closeDrawer();
                const message = recap.value.join("<br>");
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Mise à jour voiture/chauffeur effectuée avec succès",
                    html: message,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                });
            }
        };
        const onSync = async () => {
            await chargeVoitChauf();
        }

        const onSuppr = async (item) => {
            const result = await storeliv.testDispo(item.voit.trim(), item.chauf.trim());

            if (result) {
                showMsg(
                    "La voiture " +
                    item.voit +
                    " ou/et le chauffeur " +
                    item.chauf +
                    " est non disponible"
                );
                return;
            }

            const index = list.value.findIndex(
                el => el.voit === item.voit && el.chauf === item.chauf
            );

            if (index !== -1) {
                const removed = list.value.splice(index, 1)[0];

                list_del.value.push({
                    seq: removed.seq,
                    voit: removed.voit.trim(),
                    chauf: removed.chauf.trim()
                });
                showMsg(`La voiture ${removed.voit} avec le chauffeur ${removed.chauf} a été supprimée`);
                await chargeChauf();
                await chargeVoit();
            }
        };

        const onAjout = async () => {
            if (!m_voiture.value) {
                showMsg("Veuillez  indiquer la Voiture");
                return;
            }
            if (!m_chauf.value) {
                showMsg("Veuillez indiquer le chauffeur");
                return;
            }

            const itemAtteVoit = list.value.find(item => item.voit === m_voiture.value)
            if (itemAtteVoit) {
                showMsg("La voiture " + m_voiture.value + " est déja sur  la liste ");
                return;
            }
            const itemAtteChauf = list.value.find(item => item.voit === m_chauf.value)
            if (itemAtteChauf) {
                showMsg("Le Chauffeur " + m_chauf.value + " est déja sur  la liste ");
                return;
            }

            list.value.unshift({
                voit: m_voiture.value,
                chauf: m_chauf.value,
                dispo: 0,
                disponibilite: "Disponible",
            });
            m_chauf.value = null,
                m_voiture.value = null;
            await chargeChauf();
            await chargeVoit();
        }


        onMounted(async () => {
            await chargeVoitChauf();
        });

        const showMsg = (msg) => {
            text.value = msg;
            snackbar.value = true;
        };


        return {
            closeDrawer, dialog, onValide, headers, list, loading, chargeVoit, onAjout, onSuppr,
            showMsg, text, snackbar, listChauf, listVoit, m_voiture, m_chauf, onSync, chargeChauf


        };
    },
});
</script>
<style></style>