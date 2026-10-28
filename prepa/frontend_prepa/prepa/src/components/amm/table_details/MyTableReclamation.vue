<template>
    <v-data-table class="article_header bordered-detail" :headers="headers" :fixed-header="true" :loading="loading"
        density="compact" :items="items" :items-per-page="-1" no-data-text="Pas de données disponibles" hover="true"
        @click:row="handleClick" hide-default-footer="true">

        <!-- <template v-slot:[`item.amm_recl_date`]="{ item }">
            <template v-if="item.amm_recl_date">
                <span>{{ formatDateTime(item.amm_recl_date) }}</span>
                <v-btn v-if="!isReadOnly" size="x-small" color="#FF5252" class="ml-2" @click="action5PItem(item)">
                    x
                </v-btn>
            </template>

</template>

<template v-slot:item.lib_recl="{ item }">
            <div class="fournir-cell">
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
</template> -->


        <template v-slot:[`item.amm_recl_date`]="{ item }">
            <template v-if="item.amm_recl_date">
                <span>{{ formatDateTime(item.amm_recl_date) }}</span>
                <v-btn v-if="!isReadOnly && item.annule_reclam != 1 && item.annul_reclam != 1" size="x-small"
                    color="#FF5252" class="ml-2" @click="action5PItem(item)">
                    x
                </v-btn>
            </template>
        </template>

        <!-- <template v-slot:item.lib_recl="{ item }">
            <div class="fournir-cell">
                <template v-if="!item.amm_recl_date">
                    <span class="fournir-label">{{ item.lib_recl }}</span>
                    <v-btn v-if="!isReadOnly && item.annule_reclam != 1 && item.annul_reclam != 1" size="x-small"
                        color="#FFE082" @click="action4PItem(item)">
                        Ajouter date 
                    </v-btn>
                </template>
                <template v-else>
                    <span>{{ item.lib_recl }} </span>
                </template>
            </div>
        </template> -->


        <!-- <template v-slot:item.lib_recl="{ item }">
            <div class="fournir-cell" style="display: flex; align-items: center; justify-content: space-between;">
                <div style="text-align: left;">
                    <span class="fournir-label">
                        {{ item.lib_recl }}<br>
                        <b>({{ item.nb_reclam }} le {{ formatDateTime(item.amm_date_nbre_reclam) }})</b>
                    </span>
                </div>

                <div v-if="!isReadOnly && item.annule_reclam != 1 && item.annul_reclam != 1"
                    style="display: flex; gap: 8px; align-items: center; justify-content: center; transform: translateX(-300px);">
                    <v-btn v-if="!item.amm_recl_date" size="x-small" color="#FFE082" @click="action4PItem(item)">
                        Ajouter date
                    </v-btn>
                    <v-btn size="x-small" color="#FF8A80" @click="$emit('action6Item', item)">
                        Annuler Réclamation
                    </v-btn>
                </div>

                <div v-else style="text-align: center; width: 160px; transform: translateX(-300px);">
                    <span>Réclamation annulée</span>
                </div>
            </div>
        </template> -->
<!--         
<template v-slot:item.lib_recl="{ item }">
  <div class="fournir-cell" style="display: flex; align-items: center; justify-content: space-between;">
    <div style="text-align: left;">
      <span class="fournir-label">
        {{ item.lib_recl }}<br>
        <b>({{ item.nb_reclam }} le {{ formatDateTime(item.amm_date_nbre_reclam) }})</b>
      </span>
    </div>

    <div style="display: flex; gap: 8px; align-items: center; justify-content: center; transform: translateX(-20px);">
      <template v-if="!isReadOnly">
        <v-btn
          v-if="!item.amm_recl_date && item.annule_reclam !== 1 && item.annul_reclam !== 1"
          size="x-small"
          color="#FFE082"
          @click="action4PItem(item)"
        >
          Ajouter date
        </v-btn>

        <v-btn
          v-if="item.annule_reclam !== 1 && item.annul_reclam !== 1"
          size="x-small"
          color="#FF8A80"
          @click="$emit('action6Item', item)"
        >
          Annuler Réclamation
        </v-btn>
        <span v-else>
          Réclamation annulée
        </span>
      </template>
    </div>
  </div>
</template> -->


<template v-slot:item.lib_recl="{ item }">
  <div class="fournir-cell" style="display: flex; align-items: center; justify-content: space-between;">
    <!-- Texte à gauche -->
    <div style="text-align: left;">
      <span class="fournir-label">
        {{ item.lib_recl }}<br>
        <b>({{ item.nb_reclam }} le {{ formatDateTime(item.amm_date_nbre_reclam) }})</b>
      </span>
    </div>

    <!-- Boutons ou texte réclamation annulée -->
    <div style="display: flex; gap: 8px; align-items: center; justify-content: center; transform: translateX(-20px);">
      <template v-if="!isReadOnly && !item.amm_recl_date">
        <!-- Ajouter date seulement si non annulée -->
        <v-btn
          v-if="item.annule_reclam !== 1 && item.annul_reclam !== 1"
          size="x-small"
          color="#FFE082"
          @click="action4PItem(item)"
        >
          Ajouter date
        </v-btn>

        <!-- Annuler réclamation seulement si non annulée -->
        <v-btn
          v-if="item.annule_reclam !== 1 && item.annul_reclam !== 1"
          size="x-small"
          color="#FF8A80"
          @click="$emit('action6Item', item)"
        >
          Annuler Réclamation
        </v-btn>

        <!-- Texte si réclamation annulée -->
        <span v-else>
          Réclamation annulée
        </span>
      </template>
    </div>
  </div>
</template>






        <template v-slot:[`item.date_nbre_reclam`]="{ item }">
            <template v-if="item.date_nbre_reclam">
                <span>{{ formatDateTime(item.date_nbre_reclam) }}</span>
            </template>

        </template>

        <!-- <template v-slot:item.action_annuler="{ item }">
                <v-btn v-if="!isReadOnly" size="x-small" color="#FF8A80" @click="action6PItem(item)">
                        Annuler Réclamation
                </v-btn>
        </template>  -->

        <!-- <template v-slot:item.action_annuler="{ item }">
                <v-btn v-if="!isReadOnly && !item.annule_reclam" size="x-small" color="#FF8A80" @click="$emit('action6Item', item)">
                        Annuler Réclamation
                </v-btn>
        </template>  -->

        <!-- <template v-slot:item.action_annuler="{ item }">
            <v-btn v-if="!isReadOnly && !item.annule_reclam" size="x-small" color="#FF8A80"
                @click="$emit('action6Item', item)">
                Annuler Réclamation
            </v-btn>
            <span v-else>
                Réclamation annulée
            </span>
        </template> -->


        <template v-slot:item.action_annuler="{ item }">
            <v-btn v-if="!isReadOnly && item.annule_reclam !== 1 && item.annul_reclam !== 1" size="x-small"
                color="#FF8A80" @click="$emit('action6Item', item)">
                Annuler Réclamation
            </v-btn>
            <span v-else>
                Réclamation annulée
            </span>
        </template>





        <template v-slot:body.append>
            <tr class="end-row">
                <!-- <td :colspan="showActions ? 3 : 2"></td> -->
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

        const action6PItem = (item) => {
            emit('action6Item', item);
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
            action1PItem, action2PItem, action4PItem, action5PItem, action6PItem,
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