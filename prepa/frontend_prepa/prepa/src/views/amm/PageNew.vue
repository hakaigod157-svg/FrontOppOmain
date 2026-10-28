<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-center">
                <span class="text-h5"> <u>Nouveau</u></span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>
        </v-card-title>

        <div class="pa-2">
            <v-select :items="items" v-model="selectedValue" :item-value="itemValue" :item-title="itemTitle" clearable
                hide-no-data hide-details density="compact" variant="outlined" class="mb-4 mt-1 p-0" />

            <!-- Champ date (affiché seulement si showDateField = true) -->
            <v-text-field v-if="showDateField" v-model="selectedDate" type="date" label="Date" density="compact"
                variant="outlined" class="mb-6" />
        </div>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#B71C1C" variant="outlined" @click="annuler">Annuler</v-btn>
            <v-btn color="#26A69A" variant="outlined" @click="save">Ajouter</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
    props: {
        items: {
            type: Array,
            required: true
        },
        itemValue: {
            type: String,
            default: 'value'
        },
        itemTitle: {
            type: String,
            default: 'text'
        },
        selectedItem: Object, // optionnel, pour préselection
        showDateField: {      // <-- nouveau props pour afficher/masquer la date
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const selectedValue = ref(null);
        const selectedDate = ref(new Date().toISOString().substr(0, 10));

        watch(
            () => props.selectedItem,
            (newVal) => {
                if (newVal && newVal[props.itemValue] !== undefined) {
                    selectedValue.value = newVal;
                } else {
                    selectedValue.value = null;
                }
            },
            { immediate: true }
        );

        const save = () => {
            emit('save', {
                value: selectedValue.value,
                date: selectedDate.value
            });
        };

        const annuler = () => {
            emit('annuler');
        };

        const closeDetail = () => {
            emit('annuler');
        };

        return {
            selectedValue,
            selectedDate,
            save,
            annuler,
            closeDetail
        };
    }
});
</script>
