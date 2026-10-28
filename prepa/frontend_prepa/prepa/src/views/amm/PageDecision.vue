<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-center">
                <span class="text-h5"> <u>Décision</u></span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>
        </v-card-title>

        <div class="pa-2">
            <v-text-field v-model="selectedDate" type="date" label="Date" density="compact" variant="outlined"
                style="width: 150px;" />

            <v-select :items="items" v-model="selectedValue" :item-value="itemValue" :item-title="itemTitle"
                label="DÉCISION" hide-no-data hide-details density="compact" variant="outlined" class="mb-4 mt-1 p-0"
                style="width: 300px;" />

            <!-- ✅ input visible uniquement si ACCORDE est choisi -->
                <v-text-field v-if="showCodeAmm && ammtype !== 'VARIATION'" v-model="numAmm" label="N° AMM" variant="outlined" density="compact"
                    style="width: 300px;" color="primary" :error="!numAmm"/>

            <v-text-field v-if="showCodeAmm && ammtype !== 'VARIATION'" v-model="selectedDateAmm" type="date" label="Date d'AMM" density="compact" variant="outlined"
                style="width: 300px;" color="primary" :error="!selectedDateAmm"/>

            <v-textarea label="MOTIF" variant="outlined" v-model="textareaValue" rows="2" :error="selectedValue ==3 && !textareaValue"></v-textarea>
        </div>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#B71C1C" variant="outlined" @click="annuler">Annuler</v-btn>
            <v-btn color="#26A69A" variant="outlined" @click="save">Sauvegarder</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config  from "@/utils/config.js";

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
        selectedItem: Object,
        showDateField: {
            type: Boolean,
            default: false
        },
        dossier: Object,
        typedet: String,
    },
    setup(props, { emit }) {
        const router = useRouter();
        useSessionTimeout(Config.DURRE_SESSION,router);
        const selectedValue = ref(null);
        const selectedDate = ref(new Date().toISOString().substr(0, 10));
        const textareaValue = ref('');
        const numAmm = ref('');
        // const selectedDateAmm = ref(new Date().toISOString().substr(0, 10));
        const selectedDateAmm = ref(null);

        // ✅ Computed: vrai si ACCORDE (1) est sélectionné
        const showCodeAmm = computed(() => selectedValue.value === 1);

        const ammtype = props.typedet;

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
                item: props.dossier,
                seq: props.dossier?.seq, 
                date: selectedDate.value,
                text: textareaValue.value,
                codeAmm: numAmm.value, // ✅ renvoyer le code AMM si rempli
                dateAmm: selectedDateAmm.value,
                typedet: ammtype,
            });
        };

        const annuler = () => {
            emit('annuler');
        };

        const closeDetail = () => {
            emit('annuler');
        };

        return {
            selectedValue, selectedDate, textareaValue, numAmm,selectedDateAmm,
            showCodeAmm,
            save,
            annuler,
            closeDetail,ammtype,
            
        };
    }
});
</script>
