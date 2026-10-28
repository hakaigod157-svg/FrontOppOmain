<template>
    <v-data-table class="adv_header" :headers="headers" :fixed-header="true"  :loading="loading"
        density="compact" :items="items" :items-per-page="-1" hover="true" @click:row="handleClick"
        hide-default-footer="true">


        <template v-slot:[`item.actions`]="{ item }">
            <v-btn size="x-small" color="#FFB74D" @click="action1PItem(item)">
                {{ action_annuler }}
            </v-btn>
        </template>

    </v-data-table>
</template>

<script>
import { defineComponent, ref, computed, onUnmounted } from 'vue';
import { VDataTable } from "vuetify/lib/components";
import dayjs from 'dayjs';


export default defineComponent({
    components: {
        VDataTable,
    },

    props: {
        headers: Object,
        items: Object,

        loading: {
            type: Boolean,
            default: false
        },

        showAction1: {
            type: Boolean,
            default: false
        },
    },

    setup(props, { emit }) {
        const action1PItem = (item) => {
            emit('action1Item', item);
        };


        const loading = ref(false);


        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }
        };




        return {
            formatDateTime,
            action1PItem,

        };
    }
});
</script>

<style>
.v-data-table.adv_header .v-table__wrapper>table>thead>tr th,
.v-data-table.adv_header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
}

.adv_header.v-data-table tr > td:first-child {
  border-left: 4px solid #969696;
}

.adv_header.v-data-table tr > td:last-child {
  border-right: 4px solid #969696;
}

</style>