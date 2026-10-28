<template>
    <v-data-table class="blue-header" :headers="headers" :fixed-header="true" v-if="!loading" :loading="loading"
        density="compact" :items="items" :items-per-page="-1" hover="true" no-data-text="Pas données disponibles"
        hide-default-footer :row-props="rowColorPP"
        >

        <template v-slot:[`item.fp_date`]="{ item }">
            {{ formatDateTime(item.fp_date) }}
        </template>



        <template v-slot:item.actions="{ item }">

            <template v-if="item.pp_imprime > 0">
                <v-btn size="x-small"   block variant="flat" color="#B2DFDB"  @click="action1PItem(item)">
                    {{ action1 }}
                </v-btn>
            </template>

            <template v-else>
                <v-btn size="x-small"   block variant="flat" color="#FFECB3" @click="action2PItem(item)">
                    {{ action2 }}
                </v-btn>
            </template>
        </template>

    </v-data-table>
    <v-card density="compact" v-if="showNbLignes">
        <v-card-text density="compact" class="pa-1">
            <b density="compact"> {{ totalLignes }}</b> Lignes Trouvées </v-card-text>
    </v-card>

</template>

<script>
import { defineComponent, ref , computed} from 'vue';
import { VDataTable } from "vuetify/lib/components";
import dayjs from 'dayjs';

export default defineComponent({
    components: {
        VDataTable,
    },

    emits: ['action1Item', 'action2Item'],

    props: {
        headers: Object,
        items: Array,
        search: String,
        loading: {
            type: Boolean,
            default: false
        },
        action1: String,
        action2: String,

        showNbLigne: {
            type: Boolean,
            default: true
        },
    },
    setup(props, { emit }) {

        const showNbLignes = ref(true);
        showNbLignes.value = props.showNbLigne

        const totalLignes = computed(() => {
            return props.items.length;
        });


        const action1PItem = (item) => {
            emit('action1Item', item);
        };

        const action2PItem = (item) => {
            emit('action2Item', item);
        };
        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }
        };

    const rowColorPP = computed(() => (item) => {
      if (item.item.ppL_offert == 1) {
        return { class: 'ppL_offert' };
      } 
      else {
      }
    });



        return { 
            formatDateTime ,
            action1PItem, action2PItem,rowColorPP,
            totalLignes,showNbLignes,
        };
    }
});
</script>

<style>
.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
}

.ppL_offert {
  background-color: #B2EBF2;
}
</style>
