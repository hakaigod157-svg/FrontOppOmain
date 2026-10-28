<template>
    <div class="table-container">
        <v-data-table class="amm_fournir bordered-dossier" :headers="headers" :items="items" :fixed-header="true" density="compact"
            item-value="dossier_code" hide-default-footer :items-per-page="items.length">

            <template v-slot:item="{ item }">
                <tr :class="{
                    'row-selected': selected && selected.dossier_code === item.dossier_code
                }" @click="selectRow(item)" style="cursor:pointer">
                    <!-- <td>{{ item.dossier_code }}</td> -->
                    <td>{{ item.dossier_lib }}</td>
                    <td v-if="showActions" class="text-center">
                        <v-btn color="red" size="x-small" @click.stop="deleteRow(item)">Supprimer</v-btn>
                    </td>
                </tr>
            </template>

            <template v-slot:body.append>
                <tr class="end-row">
                    <!-- <td :colspan="showActions ? 3 : 2"></td> -->
                </tr>
            </template>

        </v-data-table>
    </div>

</template>

<script>
export default {
    name: "MyTableAmm",
    props: {
        headers: { type: Array, required: true },
        items: { type: Array, required: true },
        selected: { type: Object, default: null },
        showActions: { type: Boolean, default: false }
    },
    emits: ["update:selected", "row-click", "row-selected", "delete-item"],
    methods: {
        selectRow(item) {
            this.$emit("update:selected", item);
            this.$emit("row-click", item);
            this.$emit("row-selected", item);
        },
        deleteRow(item) {
            this.$emit("delete-item", item);
        }
    }
    // methods: {
    //     selectRow(item) {
    //         this.$emit("update:selected", item); // support v-model:selected
    //         this.$emit("row-click", item);
    //         this.$emit("row-selected", item);
    //     }
    // }
};
</script>

<style>
.v-data-table.amm_fournir .v-table__wrapper>table>thead>tr th,
.v-data-table.amm_fournir .v-table__wrapper>table tbody>tr th {
    background-color: #b3ccb8 !important;
    white-space: nowrap;
    color: #000000 !important;
}

.row-selected {
    background-color: #D7CCC8 !important;
    /* bleu sélection */
    font-weight: bold;
    color: #0d47a1;
}

/* Ajoute une ligne horizontale en bas du tableau */
/* .v-data-table.amm_fournir .v-table__wrapper > table {
  border-bottom: 1px solid #ccc; 
} */

/* .table-container {
    height: 350px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #ccc;
}

.table-container .v-data-table {
    flex: 1;
    overflow-y: auto;
} */


/* CSS spécifique pour ton tableau */
.bordered-dossier {
    border-left: 3px solid #ccc;
    /* bordure gauche */
    border-right: 3px solid #ccc;
    /* bordure droite */
    display: flex;
    flex-direction: column;
    height: 400px;
    /* même que le height du tableau */
    position: relative;
    /* nécessaire pour le pseudo-élément */
    
}

/* Le wrapper doit remplir tout l'espace */
.bordered-dossier .v-data-table__wrapper {
    flex: 1;
}

/* Bordure horizontale en bas */
.bordered-dossier::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #ccc;
    /* la bordure horizontale */
}

.table-container {
  height: 400px; /* hauteur totale visible du tableau */
}

/* Scroll sur le body du tableau uniquement */
.bordered-dossier .v-data-table__wrapper {
  max-height: 400px; /* même hauteur que le container */
  overflow-y: auto;   /* scroll vertical si le contenu dépasse */
}
</style>
