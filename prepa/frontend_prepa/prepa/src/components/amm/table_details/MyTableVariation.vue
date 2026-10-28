<template>
    <v-data-table class="article_header bordered-detail" :headers="headers" :fixed-header="true" :loading="loading"
        density="compact" :items="items" :items-per-page="-1" no-data-text="Pas de données disponibles" hover="true"
        @click:row="handleClick" hide-default-footer="true">

        <template v-slot:[`item.amm_recl_date`]="{ item }">
            <template v-if="item.amm_recl_date">
                <span>{{ formatDateTime(item.amm_recl_date) }}</span>
                <v-btn v-if="!isReadOnly" size="x-small" color="#FF5252" class="ml-2" @click="action5PItem(item)">
                    x
                </v-btn>
            </template>

        </template>

        <template v-slot:item.lib_recl="{ item }">
            <div class="fournir-cell">
                <!-- Si la date existe -->
                <template v-if="!item.amm_recl_date">
                    <span class="fournir-label">{{ item.lib_recl }}</span>
                    <v-btn v-if="!isReadOnly" size="x-small" color="#FFE082" @click="action4PItem(item)">
                        Ajouter date
                    </v-btn>
                </template>
                <template v-else>
                    <span>{{ item.lib_recl }}</span>
                </template>
            </div>
        </template>


        <template v-slot:body.append>
            <tr class="end-row">
                <td :colspan="showActions ? 3 : 2"></td>
            </tr>
        </template>

    </v-data-table>

    <v-card density="compact">
        <v-card-text density="compact" class="pa-1">
            <!-- <b density="compact"> {{ totalSansDate }} </b> / <b> {{ totalArticles }}</b> -->
            &nbsp;
        </v-card-text>
    </v-card>
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
        action_modifier: String,
        action2: String,

        loading: {
            default: false
        },

        showAction1: {
            default: false
        },

        isReadOnly: {  // <-- ajout
            type: Boolean,
            default: false
        },
    },

    setup(props, { emit }) {
        const action1PItem = (item) => {
            emit('action1Item', item);
        };

        const action2PItem = (item) => {
            emit('action2Item', item);
        };

        const action4PItem = (item) => {
            emit('action4Item', item);
        };

        const action5PItem = (item) => {
            emit('action5Item', item);
        };


        const loading = ref(false);


        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }
        };

        const totalArticles = computed(() => {
            return props.items.length;
        });

        const totalSansDate = computed(() => {
            return props.items.filter(item => !item.ligne_date).length;
        });


        return {
            formatDateTime,
            action1PItem, action2PItem, action4PItem, action5PItem,
            totalArticles, totalSansDate,

        };
    }
});
</script>

<style>
.v-data-table.article_header .v-table__wrapper>table>thead>tr th,
.v-data-table.article_header .v-table__wrapper>table tbody>tr th {
    background-color: #8C9EFF !important;
    white-space: nowrap;
    color: #000000 !important;
}

.v-data-table.article_header .v-table__wrapper table th,
.v-data-table.article_header .v-table__wrapper table td {
    border-right: 2px solid #ccc;
}
</style>