<template>
    <v-dialog v-model="dialog" persistent density="compact" transition="dialog-bottom-transition" class="mx-auto">
        <v-card density="compact" flat dark class="mx-auto">
            <v-toolbar dark color="#b8b3cc" density="compact" style="height: 40px" class="mx-auto">
                <v-subheader density="compact" class="text-subtitle-1 text-truncate pa-3"> Description Facture
                </v-subheader>
                <v-spacer></v-spacer>
                <v-chip color="black" class="text-subtitle-2 mb-2">
                    {{ newItem.code }}
                </v-chip>
                <v-btn icon dark @click="closeDrawer" density="compact">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container class="mx-auto py-0 my-0 mb-0">
                <v-form @submit.prevent="onValide">
                    <v-row class="pa-0 ma-0">

                        <v-col cols="6" density="compact">
                            <v-text-field density="compact" v-model="newItem.facture" label="FACTURE" required
                                :append-icon="newItem.facture ? '' : requiredIcon" @input="convertToUpperCase" outlined
                                :disabled="isDisabled" :class="{
                                    'custom-append-icon': newItem.facture === '' || newItem.facture === null,
                                }" clearable></v-text-field>
                        </v-col>
                        <v-col cols="6" density="compact">
                            <v-select density="compact" v-model="newItem.transporteur" label="TRANSPORTEURS"
                                :append-icon="newItem.transporteur ? '' : requiredIcon" :class="{
                                    'custom-append-icon': newItem.transporteur === '' || newItem.transporteur === null,
                                }" :items="transporteur_add" item-title="xnum" item-value="xnum" outlined clearable
                                :disabled="isDisabled">
                            </v-select>
                        </v-col>
                        <v-col cols="6" density="compact" class="my-n2">
                            <v-text-field density="compact" v-model="newItem.montant" label="MONTANT"
                                @input="convertMontant" @keypress="onKeyPressNumeric"
                                :append-icon="newItem.montant ? '' : requiredIcon" :class="{
                                    'custom-append-icon': newItem.montant === '' || newItem.montant === null,
                                }" outlined clearable :disabled="isDisabled"></v-text-field>
                        </v-col>
                        <v-col cols="6" density="compact" class="my-n2">
                            <v-text-field density="compact" v-model="newItem.date" label="DATE FACTURE" type="date"
                                :append-icon="newItem.date ? '' : requiredIcon" :class="{
                                    'custom-append-icon': newItem.date === '' || newItem.date === null,
                                }" outlined clearable :disabled="isDisabled"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-auto m-0 m-p my-n2" v-if="isModified">
                        <v-col cols="6" density="compact" class="m-0 p-0 my-n2">
                            <!-- <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear> -->
                            <p v-if="loading" class="loading-text">Chargement en cours<span class="dots"></span></p>
                            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
                            <v-textarea v-if="!loading" label="Scan" row-height="10" rows="1" variant="outlined" auto-grow hide-no-data
                                :disabled="isDisabled" :value="maskedNumlv" hide-details v-model="numlv"
                                @keydown.enter.prevent="ajouterLV">
                            </v-textarea>
                        </v-col>
                        <v-col cols="6" density="compact" class="m-0 p-0 my-n2">
                        </v-col>
                        <v-col cols="12" density="compact" class=" m-0 p-0  my-n2">

                            <v-table class="mx-auto m-0 p-0  my-n2 " fixed-header max-height="300px" density="compact"
                                :disabled="isDisabled">
                                <thead>
                                    <tr>
                                        <th class="text-center">LV</th>
                                        <th class="text-center">NB CMD</th>
                                        <th class="text-center">NB COLIS</th>
                                        <th class="text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(lv, index) in listLV" :key="index">
                                        <td class="text-center">{{ lv.trans_l_liv }}</td>
                                        <td class="text-center">{{ lv.nb_cde }}</td>
                                        <td class="text-center">{{ lv.nb_colis }}</td>
                                        <td class="text-center">
                                            <v-btn size="x-small" color="#EF5350" :disabled="isDisabled"
                                                @click="supprimerLV(index)">Enlever</v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row>

                    <v-card-actions class="d-flex justify-end mt-2">

                        <v-btn variant="tonal" color="error" @click="closeDrawer" size="small"
                            :disabled="loading">ANNULER</v-btn>
                        <v-btn type="submit" variant="tonal" color="green-darken-3" size="small"
                            :disabled="loading">Enregistrer</v-btn>
                    </v-card-actions>


                </v-form>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
import { ref, computed, onMounted, watch, reactive } from 'vue';
import dayjs from 'dayjs';
import { useTransporteurStore } from "@/store/utils/transporteur.js";
import { useCodeStore } from "@/store/utils/code.js";
import { useFactTransStore } from "@/store/Expedition/facTrans.js";
import useNumericInputValidationOnly from "@/composables/validateNumericInput.js";
import Swal from 'sweetalert2';
import useParseNumber from "@/composables/useParseNumber";

export default {
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
        editedItem: Object,
    },
    setup(props, { emit }) {
        const transporteur_add = ref([]);
        const dateMenu = ref(false);
        const dialog = ref(props.drawer);
        const storeTransporteur = useTransporteurStore();
        const newItem = ref(createDefaultItem());
        const storeCode = useCodeStore();
        const storeFacTrans = useFactTransStore();
        const isOK = ref(false);
        const isModified = ref(false);
        const listDel = ref([]);
        const listDeb = ref([]);
        const listLV = ref([]); // Tableau des LV
        const isDisabled = ref(false);
        const { parseNumber } = useParseNumber();

        const loading = computed(() => storeFacTrans.loading)



        watch(
            () => props.drawer,
            (newVal) => {
                dialog.value = newVal;
            }
        );



        const listTransporteur = async (item) => {
            await storeTransporteur.fetchTransporteurs(`xType in ('TRANS','POSTE','COLIS')`);
            transporteur_add.value = storeTransporteur.transporteurs;
        }

        const convertToUpperCase = () => {
            if (newItem.value.facture) {
                newItem.value.facture = newItem.value.facture.toUpperCase();
            }

        };

        const requiredIcon = "mdi-alert-circle";

        const resetForm = () => {
            newItem.value = createDefaultItem();
        };

        const numlv = ref(""); // Stocke la valeur entrée
       

        const ajouterLV = async () => {
            const num_code = ref("");
            const LV = numlv.value.trim();

            if (LV.length !== 13 || LV[11] !== "6") {
                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Code barre invalide.",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    //timer: 1500
                });
                numlv.value = null;
                return;
            }

            num_code.value = "LV" + LV.slice(0, 8);
            const exists = listLV.value.some(item => item.trans_l_liv === num_code.value);
            if (exists) {
                await Swal.fire({
                    position: "center",
                    icon: "error",
                    title: num_code.value + " est déjà dans cette liste",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    //timer: 1500
                });
                numlv.value = null;
                return;

            }
            await storeFacTrans.fetchTest_attrib_liv(num_code.value, newItem.value.transporteur)
            switch (storeFacTrans.retour) {
                case 600:
                    await storeFacTrans.ajout_lv(num_code.value);
                    console.log("myLv:", storeFacTrans.myLv);

                    if (Array.isArray(storeFacTrans.myLv)) {
                        listLV.value.push(...storeFacTrans.myLv); // Ajoute tous les éléments du tableau
                    } else {
                        console.error("Erreur : storeFacTrans.myLv n'est pas un tableau");
                    }
                    numlv.value = "";

                    break;
                case 601:
                    await Swal.fire({
                        position: "center",
                        icon: "error",
                        title: num_code.value + " est inconnu",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        //timer: 1500
                    });
                    numlv.value = null;
                    break;
                case 602:
                    await Swal.fire({
                        position: "center",
                        icon: "error",
                        title: num_code.value + " est déjà occupée par une autre facture",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        //timer: 1500
                    });
                    numlv.value = null;
                    break;
                case 603:
                    await Swal.fire({
                        position: "center",
                        icon: "error",
                        title: num_code.value + "  n'est pas liée par la facture " + newItem.value.facture + " (transporteur différent)",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        //timer: 1500
                    });
                    numlv.value = null;
                    break;
                default:
            }

            // const type = 0;

            // await storeFacTrans.fetchDetail_lv(num_code.value,type)
            // listLV.value = storeFacTrans.detailLvs;


        };

        const supprimerLV = (index) => {

            listDel.value.push(listLV.value.splice(index, 1)[0]);
            console.log(listDel.value);
        };

        const maskedNumlv = computed(() => numlv.value && numlv.value.replace(/./g, "•"));

        onMounted(async () => {
            listTransporteur();
            if (!props.editedItem) {
                await storeCode.getCode("x_FA_TRANSP", 0);
                newItem.value.code = storeCode.code;
            } else {
                isModified.value = true;

                const type = 0;
                listDeb.value = [];
                listLV.value = [];
                await storeFacTrans.fetchDetail_lv(newItem.value.code, type);
                if (storeFacTrans.detailLvs.length > 0) {
                   // listDeb.value = storeFacTrans.detailLvs;
                    listLV.value = storeFacTrans.detailLvs;
                    listDeb.value =  JSON.parse(JSON.stringify(listLV.value));
                }

            }
        });

        const isRequiredFieldsEmpty = () => {
            if (!newItem.value.facture || !newItem.value.montant || !newItem.value.date || !newItem.value.transporteur) {
                return true;
            } else {
                return false;
            }
        };


        const closeDrawer = () => {
            resetForm();
            emit('close');
        };

        const onValide = async () => {
            try {
                isOK.value = isRequiredFieldsEmpty();

                if (!isOK.value) {
                    const formData = new FormData();
                    if (
                        (!props.editedItem)
                    ) {
                        await storeCode.getCode("x_FA_TRANSP", 0);
                        newItem.value.code = storeCode.code;
                    }
                    formData.append("code", newItem.value.code);
                    formData.append("facture", newItem.value.facture);
                    formData.append("date", newItem.value.date);
                    formData.append("transport", newItem.value.transporteur);
                    formData.append("montant", parseNumber(newItem.value.montant));


                    if (!props.editedItem) {

                        await storeFacTrans.insertFacTrans(formData);
                        await storeCode.getCode("x_FA_TRANSP", 1);
                    } else {
                        await storeFacTrans.updateFacTrans(formData);

                        if (listDel.value.length > 0) {
                            for (let i = 0; i < listDel.value.length; i++) {
                                await storeFacTrans.fetchDeleteTransFact(newItem.value.code, listDel.value[i].trans_l_liv);
                            }
                        }

                        const filteredList = listLV.value.filter(item =>
                            !listDeb.value.some(deb => deb.trans_l_liv === item.trans_l_liv)
                        );

                        console.log("Liste filtrée :", filteredList);
                        if (filteredList.length > 0) {
                            for (const lv of filteredList) {
                                // Transformer chaque élément en objet s'il est une chaîne
                                const item = {
                                    code: newItem.value.code,
                                    code_liv: lv.trans_l_liv, // Assigne directement la chaîne comme code_liv
                                };

                                console.log(item);

                                try {
                                    await storeFacTrans.insertFacTrans_L(item);
                                } catch (error) {
                                    console.error("Erreur lors de l'insertion :", error);
                                }
                            }
                        }
                    }

                    resetForm();
                    closeDrawer();
                    emit("onValide");
                } else {
                    await Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Les champs en rouge sont tous obligatoires.",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        //timer: 1500
                    });
                    return;
                }
            } catch (error) {
                console.error(
                    "Une erreur est survenue lors de l'ajout de l'article:",
                    error
                );
                // Gérer l'erreur, par exemple afficher un message à l'utilisateur
            }
        };

        const closeDetail = () => emit('close');
        const { validateNumericInputOnly } = useNumericInputValidationOnly();

        const onKeyPressNumeric = (event) => {
            validateNumericInputOnly(event);
        };

        const formatPrixLocal = (prix) => {
            // Convert prix to a string if it's not already
            prix = String(prix);

            // Supprimer les espaces existants
            let prixSansEspaces = prix.replace(/\s/g, "");

            // Formater le prix avec des espaces tous les 3 chiffres
            let prixFormate = prixSansEspaces.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

            return prixFormate;
        };


        const convertMontant = () => {
            newItem.value.montant = formatPrixLocal(newItem.value.montant)
        }

        watch(
            () => props.editedItem,
            async (newValue) => {
                if (newValue) {
                    newItem.value.code = newValue.trans_code;
                    newItem.value.facture = newValue.trans_num_fact;
                    newItem.value.transporteur = newValue.trans_transport;
                    newItem.value.date = newValue.trans_date_fact;
                    newItem.value.montant = formatPrixLocal(newValue.trans_montant);
                    isDisabled.value = newValue.trans_valide === 1;


                } else {
                    resetForm();
                }
            },
            { immediate: true }
        );



        return {
            transporteur_add, dateMenu,loading,
            convertToUpperCase
            , closeDrawer, closeDetail, dialog,
            listTransporteur, onValide, newItem, resetForm, requiredIcon, onKeyPressNumeric, formatPrixLocal, convertMontant,
            numlv, listLV, ajouterLV, supprimerLV, isModified, maskedNumlv, listDel, listDeb, isDisabled
        };

        function createDefaultItem(user) {
            return {
                code: "",
                facture: "",
                transporteur: null,
                date: "",
                montant: null,

            };
        }
    }
};
</script>

<style>
.custom-append-icon {
    color: #ff0000;
}

.loading-text {
    font-size: 16px;
    font-weight: bold;
    color: #1976D2; /* Bleu Vuetify */
}

@keyframes dots {
    0% { content: ""; }
    25% { content: "."; }
    50% { content: ".."; }
    75% { content: "..."; }
    100% { content: ""; }
}

.dots::after {
    content: "";
    animation: dots 1.5s infinite steps(1);
}
</style>