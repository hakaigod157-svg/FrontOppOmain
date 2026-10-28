<template>
    <v-data-table class="etape_header bordered-detail" :headers="headers" :fixed-header="true" :loading="loading"
        density="compact" :items="items" :items-per-page="-1" no-data-text="Pas de données disponibles" hover="true"
        @click:row="handleClick" hide-default-footer="true">


        <template v-slot:[`item.action`]="{ item }">
            <v-btn size="x-small" color="#FFB74D" @click="action1PItem(item)">
                {{ action_modifier }}
            </v-btn>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <v-btn variant="flat" block size="x-small" color="#E57373" @click="action2PItem(item)"
                style="margin-top:2px;margin-bottom:2px">
                {{ action2 }}
            </v-btn>
        </template>


        <!-- <template v-slot:item.date_etape="{ item }">
            <template v-if="item.date_etape">
                {{ formatDate(item.date_etape) }}
            </template>
            <template v-else>
                <div class="d-flex justify-start">
                    <v-btn size="x-small" color="#FFE082" @click="action4PItem(item)">
                        Ajouter date
                    </v-btn>
                </div>
            </template>
        </template> -->


        <template v-slot:item.date_etape="{ item }">
            <div class="d-flex align-center">
                <!-- Si la date existe -->
                <template v-if="item.date_etape">
                    <span>{{ formatDate(item.date_etape) }}</span>
                    <v-btn v-if="!isReadOnly && item.etape !== 'RECEPTION_DOSSIER'" size="x-small" color="#FF5252" class="ml-2" @click="action5PItem(item)">
                        x
                    </v-btn>
                </template>

                <!-- Sinon, afficher le bouton Ajouter date -->
                <!-- <template v-else>
            <v-btn size="x-small" color="#FFE082" @click="action4PItem(item)">
                Ajouter date
            </v-btn>
            </template> -->
            </div>
        </template>


        <!-- <template v-slot:item.etape="{ item }">
            <div class="etape-cell">
                <template v-if="!item.date_etape">
                    <span class="etape-label">{{ item.etape }}</span>
                    <v-btn size="x-small" color="#FFE082" @click="action4PItem(item)">
                        Ajouter date
                    </v-btn>
                </template>
                <template v-else>
                    <span>{{ item.etape }}</span>
                </template>
            </div>
        </template> -->

        <template v-slot:item.etape="{ item }">
            <div class="etape-cell">
                <!-- Si la date n'existe pas ET auto ≠ 1 -->
                <!-- <template v-if="!item.date_etape"> -->
                <template v-if="!item.date_etape">
                    <span class="etape-label">{{ item.etape }}</span>
                    <v-btn v-if="!isReadOnly && item.auto !== 1" size="x-small" color="#FFE082" @click="action4PItem(item)">
                        Ajouter date
                    </v-btn>
                    <!-- <v-btn v-if="!isReadOnly && item.etape !== 'RECEPTION_DOSSIER'"  size="x-small" color="#FFE082"
                        @click="action4PItem(item)">
                        Ajouter date
                    </v-btn> -->
                </template>
                <template v-else>
                    <span>{{ item.etape }}</span>
                </template>
            </div>
        </template>

        <template v-slot:body.append>
            <tr class="end-row">
                <!-- <td :colspan="showActions ? 3 : 2"></td> -->
            </tr>
        </template>


    </v-data-table>
    <v-card density="compact">
        <v-card-text density="compact" class="pa-1">
            <b density="compact"> {{ totalArticles }}</b> Lignes Trouvées
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
            type: Boolean,
            default: false
        },

        showAction1: {
            type: Boolean,
            default: false
        },

        isReadOnly: {
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


        const formatDate = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }
        };

        const totalArticles = computed(() => {
            return props.items.length;
        });


        return {
            formatDate, totalArticles,
            action1PItem, action2PItem, action4PItem, action5PItem,

        };
    }
});
</script>

<style>
.v-data-table.etape_header .v-table__wrapper>table>thead>tr th,
.v-data-table.etape_header .v-table__wrapper>table tbody>tr th {
    background-color: #8C9EFF !important;
    white-space: nowrap;
    color: #000000 !important;
}

.v-data-table.etape_header .v-table__wrapper table th,
.v-data-table.etape_header .v-table__wrapper table td {
    border-right: 2px solid #ccc;
    /* ligne verticale comme séparateur */
}

.etape-cell {
    display: grid;
    grid-template-columns: 200px max-content;
    /* texte fixe + bouton compact */
    align-items: center;
    column-gap: 0;
    /* espace entre texte et bouton */
}

.etape-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>