<template>
    <v-data-table class="commande_header" :headers="headers" :fixed-header="true" v-if="!loading" :loading="loading"
        density="compact" :items="items" :items-per-page="-1" hover="true" no-data-text="Pas données disponibles"
        v-model:search="search" hide-default-footer>



        <template v-slot:[`item.valid_fact`]="{ item }">
            {{ formatDateTime(item.valid_fact) }}
        </template>

        <template v-slot:[`item.valid_adv`]="{ item }">
            {{ formatDateTime(item.valid_adv) }}
        </template>

        <template v-slot:[`item.deb_prep`]="{ item }">
            {{ formatDateTime(item.deb_prep) }}
        </template>

        <template v-slot:[`item.fin_prep`]="{ item }">
            {{ formatDateTime(item.fin_prep) }}
        </template>

        <template v-slot:[`item.deb_ctrl`]="{ item }">
            {{ formatDateTime(item.deb_ctrl) }}
        </template>

        <template v-slot:[`item.fin_ctrl`]="{ item }">
            {{ formatDateTime(item.fin_ctrl) }}
        </template>

        <template v-slot:[`item.fin_emb`]="{ item }">
            {{ formatDateTime(item.fin_emb) }}
        </template>

        <template v-slot:[`item.sortie_fact`]="{ item }">
            {{ formatDateTime(item.sortie_fact) }}
        </template>

        <template v-slot:[`item.sortie_opham`]="{ item }">
            {{ formatDateTime(item.sortie_opham) }}
        </template>

        <template v-slot:[`item.retour_liv`]="{ item }">
            {{ formatDateTime(item.retour_liv) }}
        </template>

        <template v-slot:[`item.atte_bal_exp`]="{ item }">
            {{ formatDateTime(item.atte_bal_exp) }}
        </template>

        <template v-slot:[`item.date_bal_adv`]="{ item }">
            {{ formatDateTime(item.date_bal_adv) }}
        </template>

        <template v-slot:[`item.commande`]="{ item }">
            {{ formatDate(item.commande) }}
        </template>


    </v-data-table>

</template>

<script>
import { defineComponent, ref } from 'vue';
import { VDataTable } from "vuetify/lib/components";
import dayjs from 'dayjs';

export default defineComponent({
    components: {
        VDataTable,
    },
    props: {
        headers: Object,
        items: Object,
        search: String,
        loading: {
            type: Boolean,
            default: false
        },
    },
    setup() {
        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY HH:mm');
            } else {
                return '';
            }
        };

        const formatDate = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }
        };

        return { formatDateTime ,formatDate };
    }
});
</script>

<style>

.v-data-table.commande_header .v-table__wrapper>table>thead>tr th,
.v-data-table.commande_header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
}


/* Lignes impaires */
.v-data-table.commande_header .v-table__wrapper>table>tbody>tr:nth-of-type(odd) {
    background-color: #ffffff!important; /* Couleur pour les lignes impaires */
}

/* Lignes paires */
.v-data-table.commande_header .v-table__wrapper>table>tbody>tr:nth-of-type(even) {
    background-color:  #d5ea9f !important; /* Couleur pour les lignes paires */
}

/* Optionnel : ajustement pour la bordure des lignes */
.v-data-table.commande_header .v-table__wrapper>table>tbody>tr td {
    border-bottom: 1px solid #ccc; /* Ajoute une bordure fine entre les lignes */
}

.commande_header.v-data-table tr > td:first-child {
  border-left: 4px solid #969696;
}

.commande_header.v-data-table tr > td:last-child {
  border-right: 4px solid #969696;
}

</style>
