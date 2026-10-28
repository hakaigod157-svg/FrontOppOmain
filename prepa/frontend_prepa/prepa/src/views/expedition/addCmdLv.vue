<template>
    <v-dialog v-model="dialog" persistent density="compact" transition="dialog-bottom-transition" max-width="500">
        <v-card density="compact" flat>
            <v-toolbar color="#d7ead5" density="compact" height="50">
                <v-toolbar-title density="compact" class="text-subtitle-2 title-expand">Ajout Commande::Livraison - Scan
                    CC/BP</v-toolbar-title>
                <v-spacer></v-spacer>
                <strong class="text-subtitle-1 font-weight-bold">{{ newItem.liv_code }}</strong>
                <v-btn icon @click="closeDrawer" density="compact">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-container class="mx-auto py-0 my-0 mb-0">
                <v-card-text class="pt-0 mt-0">

                    <v-row class="pt-0 mt-0">
                        <v-col cols="6" density="compact" class="my-n2">
                            <span class="text-subtitle-2">
                                Date de Sortie :<span class="font-weight-black">{{
                                    formatDateTime(newItem.liv_sortie) }}</span>
                            </span>
                        </v-col>
                        <v-col cols="6" density="compact" class="my-n2">
                            <span class="text-subtitle-2">
                                Axe : <span class="font-weight-black">{{ newItem.liv_axe }}</span>
                            </span>
                        </v-col>
                        <v-col cols="6" density="compact" class="my-n2">
                            <span class="text-subtitle-2">
                                Chauffeur : <span class="font-weight-black">{{ newItem.liv_chauf }}</span>
                            </span>
                        </v-col>
                        <v-col cols="6" density="compact" class="my-n2">
                            <span class="text-subtitle-2">
                                Voiture : <span class="font-weight-black">{{ newItem.liv_voit }}</span>
                            </span>
                        </v-col>
                        <v-col cols="2"></v-col>
                        <v-col cols="8">
                            <v-text-field :model-value="maskedBarcode" @input="onInput" label="Scanner BP/CC"
                                @keyup.enter="onScan" class="scanner-field" maxlength="13" variant="outlined"
                                autocomplete="off" clearable ref="barcodeInput" hide-details></v-text-field>
                        </v-col>
                        <v-col cols="2"></v-col>
                    </v-row>

                </v-card-text>
            </v-container>
        </v-card>
        <v-snackbar v-model="snackbar" :timeout="1800" class="text-center" location="center" stacked>
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
import * as XLSX from "xlsx";
import MySelect from '@/components/MySelect.vue';
import dayjs from "dayjs";
import Swal from 'sweetalert2';
import MyLoading from '@/components/Loading.vue';
import MyTable from '@/components/MyTable.vue';
import { useFactTransStore } from "@/store/Expedition/facTrans.js";
import { useCreateLVStore } from "@/store/Expedition/createLV.js";
import {
    ref,
    defineComponent,
    reactive,
    onMounted,
    onBeforeUnmount,
    computed,
    watch,
} from "vue";


export default defineComponent({
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
        editedItem: {
            type: Object,
            default: null,
        }
    },
    components: {
        MySelect,
        MyTable,
        MyLoading,

    },

    name: "onAddCmdLv",
    setup(props, { emit }) {
        const dialog = ref(props.drawer);
        const loading = ref(false);
        const newItem = ref(props.editedItem)
        const closeDrawer = () => {
            emit("close");
        };
        const snackbar = ref(false)
        const text = ref("")
        const store = useFactTransStore();
        const storeCre = useCreateLVStore()
        const barcode = ref("");
        const barcodeInput = ref();

        const maskedBarcode = computed(() => {
            return "*".repeat(barcode.value.length);
        });

        const onInput = (e) => {
            // Ajoute le dernier caractère scanné réellement
            barcode.value += e.target.value.replace(/\*/g, "");

            // Reset affichage (pour forcer l’affichage des étoiles)
            e.target.value = maskedBarcode.value;
        };

        watch(() => props.drawer, (newVal) => {
            dialog.value = newVal;
        });




        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY HH:mm');
            } else {
                return '';
            }

        };

        const onScan = async () => {
     
            if (!barcode.value) return;
            // Vérifier la longueur
            if (barcode.value.length !== 13) {
                showMsg("Bon invalide");
                barcode.value = "";

                // reset affichage
                setTimeout(() => {
                    barcodeInput.value?.focus();
                }, 50);

                return; // stop ici
            }
            // Vérifier la 12ème lettre (index 11)
            const c12 = barcode.value.charAt(11);
            if (c12 !== "0" && c12 !== "3") {
                showMsg("Bon invalide");
                barcode.value = "";
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }
            // ✅ Tout est correct : préparer le code final
            const first8 = barcode.value.substring(0, 8);
            let finalCode = "";

            if (c12 === "0") {
                finalCode = "CC" + first8;
            } else if (c12 === "3") {
                finalCode = "BP" + first8;
            }

            await store.testAvAddLiv(finalCode, c12);
            if (store.testAvAddLiv_list.is_cmd === 0) {
                showMsg("Bon " + finalCode + " inexist");
                barcode.value = "";
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }
            if (store.testAvAddLiv_list.is_liv === 1) {
                showMsg("Bon " + store.testAvAddLiv_list.cmd + " déjà livré");
                barcode.value = "";
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }
            if (store.testAvAddLiv_list.atte_liv === 0 && newItem.value.xcode!=='11111') {
                showMsg(" stade du Bon " + store.testAvAddLiv_list.cmd + " pas encore au Attente Livraison");
                barcode.value = "";
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }
            if (store.testAvAddLiv_list.modeliv.trim() !== newItem.value.type.trim()) {
                showMsg(" Votre commande " + store.testAvAddLiv_list.cmd + " avec mode "+ store.testAvAddLiv_list.modeliv+ " n’est pas compatible avec le mode de livraison " +newItem.value.type);
                barcode.value = "";
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }
            try {
                await storeCre.onAddCmdLiv(store.testAvAddLiv_list.cmd, newItem.value.liv_code,'')

            } catch (error) {
                console.error(error);
                alert("Erreur lors de la validation !");
            } finally {

                emit("onValide");
                closeDrawer();

                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Ajout de Commande ${store.testAvAddLiv_list.cmd} dans la livraison ${newItem.value.liv_code} est effectuée avec succès sur l'axe ${newItem.value.liv_axe}`,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                });
            }
            barcode.value = "";
            // refocus
            setTimeout(() => {
                barcodeInput.value?.focus();
            }, 50);
        };


        onMounted(async () => {

            barcodeInput.value?.focus();
        });

        const showMsg = (msg) => {
            text.value = msg;
            snackbar.value = true;
        };

        return {
            closeDrawer, dialog, loading, barcode, barcodeInput, onInput,
            newItem, showMsg, text, snackbar, formatDateTime, onScan, maskedBarcode

        };
    },
});
</script>
<style>


.scanner-field input {
    font-size: 18px !important;
    /* Taille du texte */
    font-weight: bold;
    /* Plus lisible */
    letter-spacing: 8px;
    /* Espacement entre les * (optionnel) */
}

.title-expand {
    flex: 1 1 auto !important;
    overflow: visible !important;
    white-space: nowrap !important;
}
</style>