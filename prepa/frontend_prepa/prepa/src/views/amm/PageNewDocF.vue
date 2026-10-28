<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-center">
                <span class="text-h5"> <u>Nouveau</u></span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>
        </v-card-title>

        <div class="pa-2">
            <v-text-field v-model="codeDossier" type="input" label="CODE DOSSIER" density="compact" variant="outlined"
                class="mb-6" style="width: 120px;" @input="convertToUpperCase" readonly/>

            <!-- <v-text-field v-model="libelle_value" type="input" label="LIBELLÉ" density="compact" variant="outlined"
                class="mb-6" style="width: 400px;" @input="convertToUpperCase"/> -->

            <v-textarea label="LIBELLÉ" variant="outlined" ensity="compact" v-model="libelle_value" rows="3"
                @input="convertToUpperCase" :error="!libelle_value"></v-textarea>
        </div>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#B71C1C" variant="outlined" @click="annuler">Annuler</v-btn>
            <v-btn color="#26A69A" variant="outlined" @click="save">Ajouter</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { defineComponent, ref, watch ,onMounted } from 'vue';
import { uselistDossier } from "@/store/Amm/amm_dossier.js";

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
        }
    },
    setup(props, { emit }) {
        const codeDossier = ref(null);
        const libelle_value = ref(null);
        const storeNumDS = uselistDossier();

        const dossier = 'DOSSIER';
        const etat = 0;

        const numDS = ref([]);

        // watch(
        //     () => props.selectedItem,
        //     (newVal) => {
        //         if (newVal && newVal[props.itemValue] !== undefined) {
        //             selectedValue.value = newVal;
        //         } else {
        //             selectedValue.value = null;
        //         }
        //     },
        //     { immediate: true }
        // );

        const save = () => {
            emit('save', {
                code: codeDossier.value,
                libelle: libelle_value.value
            });
        };

        const annuler = () => {
            emit('annuler');
        };

        const closeDetail = () => {
            emit('annuler');
        };

        const convertToUpperCase = () => {
            codeDossier.value = codeDossier.value?.toUpperCase() || '';
            libelle_value.value = libelle_value.value?.toUpperCase() || '';
        };

        const listNumDS = async () => {
            await storeNumDS.fetchNumDS(dossier, etat);
            numDS.value = storeNumDS.listnumdss;

            // ⚡ récupérer le premier élément du tableau et l’afficher dans le champ texte
            if (numDS.value.length > 0) {
                codeDossier.value = numDS.value[0].num_ds
            }
        };

        onMounted(async () => {
            numDS.value = [];
            await listNumDS();
        })



        return {
            codeDossier, convertToUpperCase,numDS,
            libelle_value,
            save,
            annuler,
            closeDetail
        };
    }
});
</script>
