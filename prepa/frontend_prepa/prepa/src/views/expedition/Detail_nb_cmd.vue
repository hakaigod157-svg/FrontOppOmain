<template>
    <v-dialog v-model="dialog" persistent density="compact" transition="dialog-bottom-transition" class="mx-auto">
        <v-card density="compact" flat dark class="mx-auto">
            <v-toolbar dark color="#E8EAF6" density="compact" style="height: 40px" class="mx-auto">
                <v-subheader density="compact" class="text-subtitle-1 text-truncate pa-3"> Détail nombre de commande
                </v-subheader>
                <v-spacer></v-spacer>
                <v-chip color="black" class="text-subtitle-2 mb-2">
                    {{ trans_code }}
                </v-chip>
                <v-btn icon dark @click="closeSeeDetail" density="compact">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container class="mx-auto py-0 my-0 mb-0">
                <v-row class="mx-auto m-0 m-p my-n2">
                    <v-col cols="6" density="compact" class="m-0 p-0 my-n2">
                    </v-col>
                    <v-col cols="12" density="compact" class=" m-0 p-0  my-n2">

                        <MyTableExped :headers="headers" :items="list" height="250">
                        </MyTableExped>

                    </v-col>
                </v-row>
                <br>

                <v-card>
                        <v-row>
                            <v-col>
                                <v-sheet class="pl-2">
                                    <b> {{ totalList }}</b> Lignes Trouvées
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </v-card>

                <v-card-actions class="d-flex justify-end mt-2">
                    <v-btn variant="tonal" color="error" @click="closeSeeDetail" size="small"
                        :disabled="isDisabled">FERMER</v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
import {defineComponent, ref, computed, onMounted, watch, reactive } from 'vue';
import dayjs from 'dayjs';
import { useTransporteurStore } from "@/store/utils/transporteur.js";
import { useCodeStore } from "@/store/utils/code.js";
import { useFactTransStore } from "@/store/Expedition/facTrans.js";
import useNumericInputValidationOnly from "@/composables/validateNumericInput.js";
import Swal from 'sweetalert2';
import useParseNumber from "@/composables/useParseNumber";
import MyTableExped from '@/components/expedition/MyTableExped.vue'

export default defineComponent({
    components: {
        MyTableExped,
    },

    props: {
        seeDetail: {
            type: Boolean,
            required: true,
        },
        editedItem: Object,
        trans_code: String,
        
    },
    setup(props, { emit }) {
        const dialog = ref(props.seeDetail);
        const storeFacTrans = useFactTransStore();
        const list = ref([]);
        const loading = computed(() => storeFacTrans.loading)

        watch(
            () => props.seeDetail,
            (newVal) => {
                dialog.value = newVal;
            }
        );

        const requiredIcon = "mdi-alert-circle";

        const closeSeeDetail = () => {
            emit('close');
        };

        const closeDetail = () => emit('close');
        const { validateNumericInputOnly } = useNumericInputValidationOnly();

        const onKeyPressNumeric = (event) => {
            validateNumericInputOnly(event);
        };


        const headers = [
            { title: 'Code CC', align: 'start', key: 'cccode' },
            { title: 'DATE COMMANDE', align: 'start', key: 'date_commande', sortable: true },
            { title: 'CODE FACTURE', align: 'start', key: 'facode', sortable: true },
            { title: 'NOMBRE DE COLIS', align: 'center', key: 'nb_colis', sortable: true },
        ]

        onMounted(async () => {
            list.value = [];
            await list_nb_cmd();
        })


        const list_nb_cmd = async (item) => {
            list.value = [];
            const type = 1;
            await storeFacTrans.fetchListDetailNbCmd(props.trans_code ,type);
            list.value = storeFacTrans.detailNbCmds;
        };

        const totalList = computed(() => {
            return list.value.length;
        });


        return {
            headers,loading,
            closeDetail, dialog,closeSeeDetail,
            requiredIcon, onKeyPressNumeric,
            list,
            list_nb_cmd,totalList,
        };

    }
});
</script>

<style>
.custom-append-icon {
    color: #ff0000;
}
</style>