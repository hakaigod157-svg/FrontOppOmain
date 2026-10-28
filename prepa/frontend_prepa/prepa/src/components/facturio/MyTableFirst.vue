<template>
    <v-data-table class="blue-header" :headers="headers" :items="items" density="compact"
        no-data-text="Pas de données disponibles" :fixed-header="true" :items-per-page="-1" :height="250"
        item-value="seq" select-strategy="single" show-select hide-default-footer>


        <template v-slot:item.etat_sortant="{ item }">
            <v-select :items="filteredList" v-model="item.etat_sortant" item-value="id" item-title="name" clearable
                hide-no-data hide-details density="compact" variant="outlined" class="mb-8 mt-1 p-0 "
                style="height: 10px;text-align: right">
            </v-select>


        </template>

        <template v-slot:[`item.calldate_sortant`]="{ item }">
            {{ formatDateTime(item.calldate_sortant) }}
        </template>


        <template v-slot:[`item.numero_sortant`]="{ item }">
            {{ formatNumero(item.numero_sortant) }}
        </template>

        <template v-slot:[`item.statut`]="{ item }">
            <v-chip color="green">
                {{ item.statut }}
            </v-chip>
        </template>
    </v-data-table>
</template>
<script>
import { defineComponent, ref, watch, onMounted, computed } from 'vue';
import { VDataTable } from "vuetify/lib/components";
import dayjs from 'dayjs';
import { uselistAction } from '@/store/SuiviFacturation/listAction.js';
import { number } from 'yup';

export default defineComponent({
    components: {
        VDataTable,
    },

    //   emits: ['action1Item', 'action2Item','action4Item','action5Item'],

    props: {
        headers: Object,
        items: Array,

        headerColor: {
            String,
            default: 'blue'
        },

        justTwo: {
            type: number,
            default: 0
        },

        seqEntrant: Number,


    },

    setup(props) {

        const storelistAction = uselistAction();
        const listActions = ref([]);
        // const selectedItems = ref([]);
        // const vListAction = ref();

        const formatNumero = (numero) => {
            if (numero && numero.length === 10) {
                return numero.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, '$1 $2 $3 $4');
            }
            return numero;
        };

        onMounted(async () => {
            listActions.value = [];
            // console.log(props.seqEntrant)
            await storelistAction.fetchListAction(props.seqEntrant);
            listActions.value = storelistAction.listactions;
        });



        const filteredList = computed(() => {
            if (props.justTwo > 0) {
                return listActions.value.filter(item => item.id > 2);
            } else {
                return listActions.value;
            }
        });

        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
            } else {
                return '';
            }

        };

        return {
            formatDateTime, listActions, filteredList, formatNumero
        }
    }
})
</script>
<style>
.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc;
    white-space: nowrap;
}
</style>