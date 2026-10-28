<template>
    <v-data-table class="amm_header bordered-new" :headers="headers" :fixed-header="true" :loading="loading"
        density="compact" :items="items" :items-per-page="showPagination ? 100 : -1"
        no-data-text="Pas de données disponibles" hover="true" @click:row="handleClick"
        :hide-default-footer="!showPagination">
        
        <template v-slot:[`item.action`]="{ item }">
            <v-btn size="x-small" color="#FFB74D" @click="action1PItem(item)">
                {{ action_modifier }}
            </v-btn>
        </template>

        <template v-slot:[`item.date_reclam`]="{ item }">
            {{ formatDateTime(item.date_reclam) }}
        </template>

        <template v-slot:[`item.date_amm`]="{ item }">
            {{ formatDateTime(item.date_amm) }}
        </template>

        <template v-slot:[`item.date_amm_fiche_article`]="{ item }">
            {{ formatDateTime(item.date_amm_fiche_article) }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <v-btn variant="flat" block size="x-small" color="#E57373" @click="action2PItem(item)"
                style="margin-top:2px;margin-bottom:2px">
                {{ action2 }}
            </v-btn>
        </template>

        <!-- <template v-slot:[`item.arlib`]="{ item, index }">
            <v-tooltip bottom>
                <template #activator="{ props, on }">
                    <div v-bind="props" v-on="on" class="midac-cell"
                        :class="{ expanded: isExpanded(item, index, 'arlib') }"
                        style="max-width: 700px; display: flex; align-items: center;">

                        <span v-if="!isExpanded(item, index, 'arlib')"
                            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
                            {{ truncatedText(item.arlib) }}
                        </span>

                        <span v-else style="white-space: normal; word-break: break-word; flex: 1;">
                            {{ item.arlib }}
                        </span>

                        <template v-if="shouldShowToggle(item, 'arlib')">
                            <v-btn size="x-small" variant="text" class="ml-1 px-1 see-more-btn"
                                style="color: #1976d2; flex-shrink: 0;"
                                @click.stop="toggleExpand(item, index, 'arlib')">
                                {{ isExpanded(item, index, 'arlib') ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>
                        </template>
                    </div>
                </template>
                <span>{{ item.arlib }}</span>
            </v-tooltip>
        </template> -->


        <template v-slot:[`item.arlib`]="{ item, index }">
            <v-tooltip bottom>
                <template #activator="{ props, on }">
                    <div v-bind="props" v-on="on" class="midac-cell"
                        :class="{ expanded: isExpanded(item, index, 'arlib') }"
                        style="max-width: 700px; display: flex; flex-direction: column; align-items: flex-start;">
                        <!-- Ligne 1 : texte -->
                        <span v-if="!isExpanded(item, index, 'arlib')"
                            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">
                            {{ truncatedText(item.arlib) }}
                        </span>

                        <span v-else style="white-space: normal; word-break: break-word; width: 100%;">
                            {{ item.arlib }}
                        </span>

                        <!-- Ligne 2 : bouton -->
                        <template v-if="shouldShowToggle(item, 'arlib')">
                            <v-btn size="x-small" variant="text" class="mt-1 px-1 see-more-btn"
                                style="color: #1976d2; align-self: flex-start;"
                                @click.stop="toggleExpand(item, index, 'arlib')">
                                {{ isExpanded(item, index, 'arlib') ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>
                        </template>
                    </div>
                </template>
                <span>{{ item.arlib }}</span>
            </v-tooltip>
        </template>



        <!-- NOM_COM -->
        <template v-slot:[`item.nom_com`]="{ item, index }">
            <v-tooltip bottom>
                <template #activator="{ props, on }">
                    <div v-bind="props" v-on="on" class="midac-cell"
                        :class="{ expanded: isExpanded(item, index, 'nom_com') }"
                        style="max-width: 700px; display: flex; flex-direction: column; align-items: flex-start;">
                        <!-- Ligne 1 : texte -->
                        <span v-if="!isExpanded(item, index, 'nom_com')"
                            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">
                            {{ truncatedText(item.nom_com) }}
                        </span>

                        <span v-else style="white-space: normal; word-break: break-word; width: 100%;">
                            {{ item.nom_com }}
                        </span>

                        <!-- Ligne 2 : bouton -->
                        <template v-if="shouldShowToggle(item, 'nom_com')">
                            <v-btn size="x-small" variant="text" class="mt-1 px-1 see-more-btn"
                                style="color: #1976d2; align-self: flex-start;"
                                @click.stop="toggleExpand(item, index, 'nom_com')">
                                {{ isExpanded(item, index, 'nom_com') ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>
                        </template>
                    </div>
                </template>
                <span>{{ item.nom_com }}</span>
            </v-tooltip>
        </template>

        <!-- DCI -->
        <template v-slot:[`item.dci`]="{ item, index }">
            <v-tooltip bottom>
                <template #activator="{ props, on }">
                    <div v-bind="props" v-on="on" class="midac-cell"
                        :class="{ expanded: isExpanded(item, index, 'dci') }"
                        style="max-width: 700px; display: flex; flex-direction: column; align-items: flex-start;">
                        <!-- Ligne 1 : texte -->
                        <span v-if="!isExpanded(item, index, 'dci')"
                            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">
                            {{ truncatedText(item.dci) }}
                        </span>

                        <span v-else style="white-space: normal; word-break: break-word; width: 100%;">
                            {{ item.dci }}
                        </span>

                        <!-- Ligne 2 : bouton -->
                        <template v-if="shouldShowToggle(item, 'dci')">
                            <v-btn size="x-small" variant="text" class="mt-1 px-1 see-more-btn"
                                style="color: #1976d2; align-self: flex-start;"
                                @click.stop="toggleExpand(item, index, 'dci')">
                                {{ isExpanded(item, index, 'dci') ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>
                        </template>
                    </div>
                </template>
                <span>{{ item.dci }}</span>
            </v-tooltip>
        </template>

        <!-- PRESENTATION -->
        <template v-slot:[`item.presentation`]="{ item, index }">
            <v-tooltip bottom>
                <template #activator="{ props, on }">
                    <div v-bind="props" v-on="on" class="midac-cell"
                        :class="{ expanded: isExpanded(item, index, 'presentation') }"
                        style="max-width: 700px; display: flex; flex-direction: column; align-items: flex-start;">
                        <!-- Ligne 1 : texte -->
                        <span v-if="!isExpanded(item, index, 'presentation')"
                            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">
                            {{ truncatedText(item.presentation) }}
                        </span>

                        <span v-else style="white-space: normal; word-break: break-word; width: 100%;">
                            {{ item.presentation }}
                        </span>

                        <!-- Ligne 2 : bouton -->
                        <template v-if="shouldShowToggle(item, 'presentation')">
                            <v-btn size="x-small" variant="text" class="mt-1 px-1 see-more-btn"
                                style="color: #1976d2; align-self: flex-start;"
                                @click.stop="toggleExpand(item, index, 'presentation')">
                                {{ isExpanded(item, index, 'presentation') ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>
                        </template>
                    </div>
                </template>
                <span>{{ item.presentation }}</span>
            </v-tooltip>
        </template>

        <!-- FABRICANT -->
        <template v-slot:[`item.fabricant`]="{ item, index }">
            <v-tooltip bottom>
                <template #activator="{ props, on }">
                    <div v-bind="props" v-on="on" class="midac-cell"
                        :class="{ expanded: isExpanded(item, index, 'fabricant') }"
                        style="max-width: 700px; display: flex; flex-direction: column; align-items: flex-start;">
                        <!-- Ligne 1 : texte -->
                        <span v-if="!isExpanded(item, index, 'fabricant')"
                            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">
                            {{ truncatedText(item.fabricant) }}
                        </span>

                        <span v-else style="white-space: normal; word-break: break-word; width: 100%;">
                            {{ item.fabricant }}
                        </span>

                        <!-- Ligne 2 : bouton -->
                        <template v-if="shouldShowToggle(item, 'fabricant')">
                            <v-btn size="x-small" variant="text" class="mt-1 px-1 see-more-btn"
                                style="color: #1976d2; align-self: flex-start;"
                                @click.stop="toggleExpand(item, index, 'fabricant')">
                                {{ isExpanded(item, index, 'fabricant') ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>
                        </template>
                    </div>
                </template>
                <span>{{ item.fabricant }}</span>
            </v-tooltip>
        </template>


        <template v-slot:[`item.code_opham`]="{ item }">
            <!-- Bouton si condition -->
            <v-btn v-if="!item.code_opham && !String(item.code_opham || '').trim()" variant="flat" size="x-small"
                color="#FFAB91" @click="action5PItem(item)" style="width:80px;color: black;">
                {{ action5 }}
            </v-btn>

            <span v-else>
                {{ item.code_opham }}
            </span>
        </template>







    </v-data-table>

    <v-card density="compact">
        <v-card density="compact" class="pa-1">
            <v-row no-gutters align="center" justify="space-between">
                <v-col cols="6" class="text-left">
                    <b>{{ totalArticles }}</b> Lignes trouvées
                </v-col>

                <v-col cols="6" class="text-right" v-if="isdouble">
                    <b style="color: red;">{{ totalDoublons }}</b> Doublons détectés
                </v-col>
            </v-row>
        </v-card>
    </v-card>
</template>

<script>
import { defineComponent, computed, ref, reactive } from "vue";
import { VDataTable } from "vuetify/lib/components";

import dayjs from "dayjs";

export default defineComponent({
    components: { VDataTable },

    props: {
        headers: { type: Array, required: true },
        items: { type: Array, required: true },
        action_modifier: { type: String, default: "Modifier" },
        action2: { type: String, default: "Supprimer" },

        loading: { type: Boolean, default: false },

        showAction1: { type: Boolean, default: false },

        // ➝ nouvelle prop height
        height: { type: [String, Number], default: 300 },

        totalDoublons: { type: Number, default: 0 },
        showNbDoublans: { type: Boolean, default: false },
        showPagination: { type: Boolean, default: false },
        action5: String,
        search: { type: String, default: '' },
    },

    setup(props, { emit }) {
        const action1PItem = (item) => emit("action1Item", item);
        const action2PItem = (item) => emit("action2Item", item);

        const formatDateTime = (date) => {
            if (date) return dayjs(date).format("DD/MM/YYYY");
            return "";
        };

        const totalArticles = computed(() => props.items.length);
        const isdouble = ref(props.showNbDoublans);
        // const nbDouble = ref(props.totalDoublons);

        const state = reactive({
            expandedMap: {},
            maxLength: 30,
        });


        // --- Voir plus / Voir moins logic ---

        // ✅ Génère une clé unique stable (priorité à l'ID si dispo)
        const keyFor = (item, index, field) => {
            if (item && item.arlib_id != null) return `id_${item.arlib_id}_${field}`;
            return `idx_${index}_${field}`;
        };

        // ✅ Vérifie si un texte est actuellement développé
        const isExpanded = (item, index, field) => {
            const key = keyFor(item, index, field);
            return !!state.expandedMap[key];
        };

        // ✅ Bascule l'état développé/réduit
        const toggleExpand = (item, index, field) => {
            const key = keyFor(item, index, field);
            state.expandedMap[key] = !state.expandedMap[key];
        };

        // ✅ Vérifie si on doit afficher "Voir plus"
        const shouldShowToggle = (item, field) => {
            const text = String(item?.[field] ?? "").trim();
            return text.length > state.maxLength;
        };

        // ✅ Tronque le texte si trop long
        const truncatedText = (text) => {
            if (!text) return "";
            const s = String(text).trim();
            return s.length > state.maxLength ? s.slice(0, state.maxLength) + "…" : s;
        };

        const action5PItem = (item) => {
            emit('action5Item', item);
        };




        return {
            formatDateTime,
            action1PItem,
            action2PItem,
            totalArticles,
            props,
            isdouble,
            keyFor, isExpanded, toggleExpand, shouldShowToggle, truncatedText,
            action5PItem,
        };
    },
});
</script>

<style scoped>
.v-data-table.amm_header .v-table__wrapper>table>thead>tr th,
.v-data-table.amm_header .v-table__wrapper>table tbody>tr th {
    background-color: #b3ccb8 !important;
    white-space: nowrap;
    color: #000000 !important;
}

/* CSS spécifique pour ton tableau */
.bordered-new {
    border-left: 3px solid #ccc;
    /* bordure gauche */
    border-right: 3px solid #ccc;
    /* bordure droite */
    display: flex;
    flex-direction: column;
    position: relative;
    /* nécessaire pour le pseudo-élément */
    height: v-bind("props.height + 'px'");
    /* height dynamique */
}

/* Le wrapper doit remplir tout l'espace */
.bordered-new .v-data-table__wrapper {
    flex: 1;
}

/* Bordure horizontale en bas */
.bordered-new::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #ccc;
    /* la bordure horizontale */
}


.midac-cell {
    display: flex;
    align-items: center;
    white-space: normal !important;
    overflow: visible !important;
    word-break: break-word;
}
</style>
