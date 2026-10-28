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

            <v-autocomplete v-model="select"  :items="listLier" :loading="loading"
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
import { useMidacStore } from "@/store/Amm/midac.js";


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
        codepro: String,
        ammdscode: String,
        titulaire: String,
        list_exclu: {
            type: Array,
            default: () => []
        },
        onRefresh: Function

    },

    setup(props, { emit }) {
        const selectedValue = ref(null);
        const selectedDate = ref(new Date().toISOString().substr(0, 10));
        const textareaValue = ref('');
        const select =ref("");
       // const isSearch = ref(false);
       const loading = ref(false);
        const code_pro = props.codepro;
        const ammDsCode = props.ammdscode;
        const refresh = props.onRefresh;
        // const ammTitulaire = props.titulaire;
        const ammTitulaire = null;
        const storeUpdateLigneArticle = uselistDossier();
        const storeListArticleLier = uselistDossier();
        const storeUpdateMidac = useMidacStore();
        const listLier = ref([]);

        onMounted(async () => {
            // console.log(ammSeq)
            // console.log(ammDsCode)
            listArticleLier();
        });


        const save = async () => {
            console.log(select.value)
            console.log(code_pro)

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
                // await storeUpdateLigneArticle.updateLigneArticle(ammSeq, ammDsCode, select.value);
                // await storeUpdateMidac.updateMidac(code_pro, select.value);
                // closeDetail();

                const result = await swal.fire({
                    // title: 'Mettre à jour ?',
                    html: `Lier avec article :  <b style="color:red;">${select.value}</b>?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Oui',
                    cancelButtonText: 'Annuler',
                    reverseButtons: true,
                    background: '#f0f0f0',
                    color: '#333',

                    // 🔹 Rend la popup persistante :
                    allowOutsideClick: false,   // empêche la fermeture en cliquant à l’extérieur
                    allowEscapeKey: false,      // empêche la fermeture avec la touche Échap
                    allowEnterKey: true,        // tu peux quand même valider avec Entrée
                });

                if (result.isConfirmed) {
                    await storeUpdateMidac.updateMidac(code_pro, select.value);

                    swal.fire({
                        icon: 'success',
                        title: 'Mise à jour effectuée',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        background: '#d4edda',
                        color: '#155724',
                        timerProgressBar: true,
                    });
                    emit('saves');
                    closeDetail();
                }
            }
        };


        const annuler = () => {
            emit('annuler');
        };

        const closeDetail = () => {
            emit('annuler');
        };

      //  const { isUpdating, items, search, select, loading, handleSelectChange, libelle } = useArticleSelection(isSearch);



        /* const listArticleLier = async () => {
             await storeListArticleLier.fetchListArticleLier(ammTitulaire);
             // listLier.value = storeListArticleLier.listArticleLiers;
 
             listLier.value = storeListArticleLier.listArticleLiers.map(a => ({
                 ...a,
                 displayText: `${a.arcode.trim()} - ${a.arlib}`,
             }));
 
 
         };*/
         const type = 2;

        const listArticleLier = async () => {
            loading.value = true;
            await storeListArticleLier.fetchListArticleLier(ammTitulaire,type)

            // Liste des codes à exclure
            const codesExclus = new Set(
                props.list_exclu
                    .filter(e => e.code_opham)
                    .map(e => e.code_opham.trim().toLowerCase())
            )

            // ✅ Utilise .has() pour un Set
            listLier.value = storeListArticleLier.listArticleLiers
                .filter(a => !codesExclus.has(a.arcode?.trim().toLowerCase()))
                .map(a => ({
                    ...a,
                    displayText: `${a.arcode?.trim() || ''} - ${a.arlib} (${a.arfo?.trim()})`
                }))
                loading.value = false;
        }
        return {
            selectedValue, selectedDate, textareaValue, annuler, closeDetail,  loading,
         
            code_pro, ammDsCode, save, select, ammTitulaire, listLier,refresh,

        };
    }
});
</script>
<style></style>
