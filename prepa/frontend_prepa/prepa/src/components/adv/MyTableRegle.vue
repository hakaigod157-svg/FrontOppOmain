<template>
    <v-data-table class="header_solde" :headers="headers" :items="items" density="compact"
        no-data-text="Pas de données disponibles" :fixed-header="true" :items-per-page="-1" :height="350" hide-default-footer
        item-value="seq" select-strategy="single" :row-props="rowColorsSolde">

        <template v-slot:item.montantinit="{ item }">
            <span>{{ formatPrice(item.montantinit) }}</span>
        </template>

        <template v-slot:item.reste="{ item }">
            <span>{{ formatPrice(item.reste) }}</span>
        </template>

        <template v-slot:item.montant_code="{ item }">
            <span>{{ formatPrice(item.montant_code) }}</span>
        </template>

        <template v-slot:item.montant="{ item }">
            <span>{{ formatPrice(item.montant) }}</span>
        </template>

        <template v-slot:item.montant_rg="{ item }">
            <span class="col-montant">{{ item.montant_rg === 0 ? '' : formatPrice(item.montant_rg) }}</span>
        </template>

        <template v-slot:item.reference_rg="{ item }">
            <span>{{ item.reference_rg === 0 ? '' : formatPrice(item.reference_rg) }}</span>
        </template>

        <template v-slot:item.ttc_cmd="{ item }">
            <span>{{ formatPrice(item.ttc_cmd) }}</span>
        </template>

        <template v-slot:item.date="{ item }">
            <span>{{ formatDate(item.date) }}</span>
        </template>

        <template v-slot:item.echeance="{ item }">
            <span>{{ formatDate(item.echeance) }}</span>
        </template>

        <template v-slot:item.date_commande="{ item }">
            <span>{{ formatDate(item.date_commande) }}</span>
        </template>

        <template v-slot:item.date_rg="{ item }">
            <span>{{ formatDate(item.date_rg) }}</span>
        </template>

        <template v-slot:item.echeance_rg="{ item }">
            <span>{{ formatDate(item.echeance_rg) }}</span>
        </template>

        <template v-slot:item.validation_adv="{ item }">
            <span>{{ formatDateTime(item.validation_adv) }}</span>
        </template>

        <template v-slot:item.date_rgbon="{ item }">
            <span>{{ formatDate(item.date_rgbon) }}</span>
        </template>

        <template v-slot:item.montant_rgbon="{ item }">
            <span>{{ formatPrice(item.montant_rgbon) }}</span>
        </template>

        <template v-slot:item.total_facture="{ item }">
            <span>{{ item.total_facture === 0 ? '' : formatPrice(item.total_facture) }}</span>
        </template>




    </v-data-table>
</template>
<script>
import { defineComponent, ref, watch, onMounted, computed } from 'vue';
import { VDataTable } from "vuetify/lib/components";
import dayjs from 'dayjs';

export default defineComponent({
    components: {
        VDataTable,
    },

    //   emits: ['action1Item', 'action2Item','action4Item','action5Item'],

    props: {
        headers: Object,
        items: Array,
    },


    setup(props) {
        onMounted(async () => {

        })


        const formatPrice = (price) => {
            // Vérifier si price est null, undefined ou NaN
            if (price == null || isNaN(price)) {
                return ""; // ou une autre valeur par défaut
            }

            // Convertir le nombre en chaîne et le diviser en partie entière et décimale
            let [integerPart, decimalPart] = price.toString().split('.');

            // Formatage de la partie entière avec un espace comme séparateur de millier
            let formattedInteger = integerPart
                .split('')
                .reverse()
                .map((digit, index) => (index > 0 && index % 3 === 0 ? digit + ' ' : digit))
                .reverse()
                .join('');

            // Ajouter la partie décimale si elle existe
            return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
        };

        const formatDate = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }
        };

        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
            } else {
                return '';
            }
        };


        const rowColorsSolde = computed(() => (item) => {
            if (item.item.partiel == 1) {
                return { class: 'partiel' };
            }

            else {

            }
        });

        return {
            formatPrice, formatDate,
            rowColorsSolde, formatDateTime,
        }

    }
});
</script>
<style>
.v-data-table.header_solde .v-table__wrapper>table>thead>tr th,
.v-data-table.header_solde .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
}

.partiel {
    background-color: RGB(204, 255, 153);
}


.col-montant {
  width: 105px; /* Ajustez selon vos besoins */
  display: inline-block;
}
</style>