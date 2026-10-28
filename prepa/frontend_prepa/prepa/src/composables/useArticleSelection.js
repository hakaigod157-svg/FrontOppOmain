import { ref, computed, onMounted, watchEffect, watch } from "vue";
import { useArticleStore } from "@/store/utils/article";

export default function useArticleSelection(isSearch) {
    const storeArt = useArticleStore();
    const listArticle = ref([]);
    const items = ref([]);
    const search = ref(null);
    const select = ref(null);
    const libelle = ref('');
    
    

    const loading = computed(() => storeArt.loading);

    onMounted(async () => {
        await storeArt.fetchArticle('');
        listArticle.value = storeArt.articles;
    });

    const arcode = computed(() => {
        return listArticle.value.map(depot => ({
            article: depot.article,
            libelle: depot.libelle,
        }));
    });

    const querySelections = (v) => {
        if (v && v.length >= 3) {
            loading.value = true;
            // Simulated ajax query
            setTimeout(() => {
                items.value = arcode.value.filter((e) => {
                    const eArticle = e.article ? e.article.toLowerCase() : '';
                    const eLibelle = e.libelle ? e.libelle.toLowerCase() : '';
                    const vString = v.toLowerCase();
                    return eArticle.includes(vString) || eLibelle.includes(vString);
                });
                loading.value = false;
            }, 500);
        }
    };

    watchEffect(() => {
        if (search.value && search.value !== select.value) {
            querySelections(search.value);
        }
    });

    const handleSelectChange = async (selection) => {
        if (selection) {
            const articleRecherche = arcode.value.find((element) => element.article.trim() === selection.trim());
            if (articleRecherche) {
                libelle.value = articleRecherche.libelle
            } else {
                libelle.value = '';
            }
            if (typeof selection === 'string' && selection.includes('?')) {
                isSearch.value =true;
               
            }else{
                isSearch.value =false;
            }
        } else {
            libelle.value = '';
        }
    };
    const checkForQuestionMark = computed(() => {
        if (search.value !== null && search.value !== undefined) {
            return search.value.includes('?');
        }
        return false;
    });

    
   
    watch(checkForQuestionMark, (hasQuestionMark) => {
        if (hasQuestionMark) {
            isSearch.value =true;
            console.log('isSearch:', isSearch.value);
        }
    });

    return {
        storeArt, listArticle, loading, search, items, select, arcode, handleSelectChange, libelle, checkForQuestionMark,isSearch
    };
}
