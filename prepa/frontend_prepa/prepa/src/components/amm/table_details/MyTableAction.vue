<template>
    <v-data-table class="action_header bordered-detail" :headers="headers" :fixed-header="true" :loading="loading"
        density="compact" :items="items" :items-per-page="-1" no-data-text="Pas de données disponibles" hover
        @click:row="handleClick" hide-default-footer>
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

        <template v-slot:item.amm_histo_date="{ item }">
            <div style="display: flex; flex-direction: column; justify-content: flex-start; height: 100%;">
                <div style="display: flex; align-items: flex-start;">
                    <span>{{ formatDateForDisplay(item.amm_histo_date) }}</span>
                </div>
            </div>
        </template>

        <template v-slot:item.amm_histo_comment="{ item, index }">
            <div
                style="white-space: pre-wrap; word-wrap: break-word; overflow-wrap: anywhere; padding: 8px; border-radius: 4px; font-size: 14px;">
                <span>
                    {{ isExpanded(item, index) ? item.amm_histo_comment : truncatedText(item.amm_histo_comment) }}
                </span>

                <template v-if="shouldShowToggle(item)">
                    <v-btn size="x-small" variant="text" class="ml-1 px-1 see-more-btn" style="color: #1976d2;"
                        @click="toggleExpand(item, index)">
                        {{ isExpanded(item, index) ? 'Voir moins' : 'Voir plus' }}
                    </v-btn>
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
import { defineComponent, reactive, toRefs, computed } from "vue";
import { VDataTable } from "vuetify/lib/components";
import dayjs from "dayjs";

export default defineComponent({
    name: "MyDataTable",
    components: { VDataTable },
    props: {
        headers: { type: Array, required: true },
        items: { type: Array, default: () => [] },
        action_modifier: { type: String, default: "Modifier" },
        action2: { type: String, default: "Action2" },
        loading: { type: Boolean, default: false },
        showAction1: { type: Boolean, default: false },
        isReadOnly: {  // <-- ajout
            type: Boolean,
            default: false
        },
    },
    setup(props, { emit }) {
        const state = reactive({
            expandedMap: {},
            maxLength: 300,
        });

        // --- Émissions d'événements ---
        const action1PItem = (item) => emit("action1Item", item);
        const action2PItem = (item) => emit("action2Item", item);
        const deleteRow = (item) => emit("actionDelete", item);

        // --- Gestion date ---
        const formatDateTime = (date) => {
            return date ? dayjs(date).format("DD/MM/YYYY") : "";
        };

        const formatDateForDisplay = (dateStr) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };

        // --- Voir plus / Voir moins logic ---
        const keyFor = (item, index) =>
            item && item.amm_histo_id != null ? `id_${item.amm_histo_id}` : `idx_${index}`;

        const isExpanded = (item, index) => !!state.expandedMap[keyFor(item, index)];

        const toggleExpand = (item, index) => {
            const key = keyFor(item, index);
            state.expandedMap[key] = !state.expandedMap[key];
        };

        const shouldShowToggle = (item) => {
            const s = item && item.amm_histo_comment ? String(item.amm_histo_comment) : "";
            return s.length > state.maxLength;
        };

        const truncatedText = (text) => {
            if (!text) return "";
            const s = String(text);
            return s.length > state.maxLength ? s.slice(0, state.maxLength) + "…" : s;
        };

        const totalArticles = computed(() => {
            return props.items.length;
        });


        return {
            ...toRefs(state),
            action1PItem,
            action2PItem,
            deleteRow,
            formatDateTime,
            formatDateForDisplay,
            keyFor,
            isExpanded,
            toggleExpand,
            shouldShowToggle,
            truncatedText, 
            totalArticles,
        };
    },
});
</script>

<style>
.v-data-table.action_header .v-table__wrapper>table>thead>tr th,
.v-data-table.action_header .v-table__wrapper>table tbody>tr th {
    background-color: #8c9eff !important;
    white-space: nowrap;
    color: #000000 !important;
}

.v-data-table.action_header .v-table__wrapper table th,
.v-data-table.action_header .v-table__wrapper table td {
    border-right: 2px solid #ccc;
}

.see-more-btn {
    min-height: 0;
    height: auto;
    line-height: 1;
    text-transform: none;
    padding: 0;
}

/* CSS spécifique pour ton tableau */
.bordered-detail {
    border-left: 3px solid #ccc;
    /* bordure gauche */
    border-right: 3px solid #ccc;
    /* bordure droite */
    display: flex;
    flex-direction: column;
    height: 300px;
    /* même que le height du tableau */
    position: relative;
    /* nécessaire pour le pseudo-élément */
}

/* Le wrapper doit remplir tout l'espace */
.bordered-detail .v-data-table__wrapper {
    flex: 1;
}

/* Bordure horizontale en bas */
.bordered-detail::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #ccc;
    /* la bordure horizontale */
}
</style>
