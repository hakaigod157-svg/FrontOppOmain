<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-center">
                <!-- <span class="text-h5"> <u>Lier le code Article</u>  {{ dossier.amm_ds_code }}</span> -->
                <span class="text-h5"> <u>Lier Article</u></span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>
        </v-card-title>

        <div class="pa-2">

            <!-- <Autocomplete :isUpdating="isUpdating" :items="listLier" v-model:search="search" v-model="select"
                :loading="loading" @updateSelect="handleSelectChange"/> -->

            <v-autocomplete v-model="select" v-model:search="search" :items="listLier" :loading="loading"
                item-title="displayText" item-value="arcode" label="Article" density="comfortable" variant="outlined"
                clearable @update:model-value="handleSelectChange" />

        </div>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#B71C1C" variant="outlined" @click="annuler">Annuler</v-btn>
            <v-btn color="#26A69A" variant="outlined" @click="save">Sauvegarder</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import swal from 'sweetalert2';
import MyTableAmm from '@/components/amm/MyTableAmm.vue';
import { uselistDossier } from "@/store/Amm/amm_dossier.js";
import Autocomplete from "@/components/MyAutocomplete.vue";
import useArticleSelection from "@/composables/useArticleSelection";

export default defineComponent({
    components: {
        MyTableAmm,
        Autocomplete,
    },

    props: {
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
        ammseq: String,
        ammdscode: String,
        titulaire: String,
    },

    setup(props, { emit }) {
        const selectedValue = ref(null);
        const selectedDate = ref(new Date().toISOString().substr(0, 10));
        const textareaValue = ref('');
        const isSearch = ref(false);
        const ammSeq = props.ammseq;
        const ammDsCode = props.ammdscode;
        const ammTitulaire = props.titulaire;
        const storeUpdateLigneArticle = uselistDossier();
        const storeListArticleLier = uselistDossier();
        const listLier = ref([]);

        onMounted(async () => {
            // console.log(ammSeq)
            // console.log(ammDsCode)
            listArticleLier();
        });


        const save = async () => {
            console.log(select.value)

            if (!select.value) {
                swal.fire({
                    icon: 'error',
                    title: 'Ajouter un Article',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f8d7da',
                    color: '#721c24',
                    timerProgressBar: true,
                });
                return
            } else {
                await storeUpdateLigneArticle.updateLigneArticle(ammSeq, ammDsCode, select.value);
                closeDetail();
            }
        };


        const annuler = () => {
            emit('annuler');
        };

        const closeDetail = () => {
            emit('annuler');
        };

        const { isUpdating, items, search, select, loading, handleSelectChange, libelle } = useArticleSelection(isSearch);


        const type = 1;
        const listArticleLier = async () => {
            await storeListArticleLier.fetchListArticleLier(ammTitulaire,type);
            // listLier.value = storeListArticleLier.listArticleLiers;

            listLier.value = storeListArticleLier.listArticleLiers.map(a => ({
                ...a,
                displayText: `${a.arcode.trim()} - ${a.arlib} (${a.arfo})`,
            }));


        };

        return {
            selectedValue, selectedDate, textareaValue, annuler, closeDetail, items, loading,
            isSearch, isUpdating, search, handleSelectChange,
            ammSeq, ammDsCode, save, select, ammTitulaire, listLier,

        };
    }
});
</script>
