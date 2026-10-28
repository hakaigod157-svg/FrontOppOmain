<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-center">
                <span class="text-h5"> <u>Nouveau</u></span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>
        </v-card-title>

        <div class="pa-2">

            <v-textarea label="Variation" variant="outlined" v-model="textareaValue" rows="1"></v-textarea>
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
        const selectedDate = ref(new Date().toISOString().substr(0, 10));
        const textareaValue = ref('');

        const save = () => {
            emit('save', {
                // date: selectedDate.value,
                text: textareaValue.value
            });
        };

        const annuler = () => {
            emit('annuler');
        };

        const closeDetail = () => {
            emit('annuler');
        };

        return {
            textareaValue,
            selectedDate,
            save,
            annuler,
            closeDetail
        };
    }
});
</script>
