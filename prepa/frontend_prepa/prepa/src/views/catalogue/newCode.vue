<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-left">
                <span class="text-h5">
                    <!-- <b><u>{{ TypeAvance === 3 ? 'AVANCE' : '' }}</u> - {{ TnomClient }} </b> -->
                    <b><u>Création Code EAN13 </u></b>
                </span>
                <v-icon class="icon-close" @click="closeDetail">
                    mdi-close
                </v-icon>
            </div>

        </v-card-title>

        <div class="pa-2">
            <v-card>
                <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5" density="compact">
                </v-progress-linear>

            </v-card>

            <v-card-text>
                <v-autocomplete label="LABO" variant="outlined" density="compact" item-title="fonom" item-value="focode"
                    v-model="selectedLabo" :items="listLabo" clearable></v-autocomplete>

                <v-text-field label="ARTICLE" variant="outlined" density="compact" v-model="newArticles"
                    clearable></v-text-field>

            </v-card-text>
        </div>

        <v-card-actions>
            <v-spacer />
            <v-btn color="red" variant="outlined" @click="annuler">Annuler</v-btn>
            <v-btn color="primary" variant="tonal" @click="save" :disabled="loading">Enregistrer</v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { uselistFabricant } from "@/store/Amm/amm_fabricant.js";
import { uselistDossier } from "@/store/Amm/amm_dossier.js";
import swal from 'sweetalert2';
import MySelect from '@/components/MySelect.vue';
import MyTableAmm from '@/components/amm/MyTableAmm.vue';
import { useArticleStore } from "@/store/utils/article.js";

import { useTypeStore } from "@/store/Amm/type.js";
import { useStatuStore } from "@/store/Amm/status.js";
import { useRespStore } from "@/store/Amm/responsable.js";
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";

import { useCatalStore } from "@/store/Catalogue/catalogue.js";



export default defineComponent({
    components: {
        MyTableAmm,
        MySelect
    },

    props: {
        codeFab: String,
        libelleFab: String,
        nomclient: String,
        type: Number,

    },

    setup(props, { emit }) {

        const dialogVisible = ref(false);
        const user = localStorage.getItem('username');
        const router = useRouter();
        useSessionTimeout(Config.DURRE_SESSION, router);
        const list = ref([]);

        const storeInsertDossierLigne = uselistDossier();
        const storeTitulaire = uselistDossier();
        const storeListRespo = uselistDossier();



        const storeLabos = useCatalStore();
        const listLabo = ref([]);

        const selectedLabo = ref(null);
        const newArticles = ref(null);

        const loading = ref(false);

        const fetchListLaboCode = async () => {
            await storeLabos.fetchLabosCode();
            // listLabo.value = storeLabos.codeLabos
            listLabo.value = storeLabos.codeLabos.map(i => ({
                focode: i.focode.trim(),
                fonom: i.fonom.trim()
            }))
        };

        onMounted(async () => {
            list.value = [];
            await fetchListLaboCode();

            // console.log(listLabo.value)
        })


        const save = async () => {
            // console.log("Labo sélectionné :", selectedLabo.value);
            // console.log("Article :", newArticles.value);
            await insertCodeBarre();
        };

        // const insertCodeBarre = async () => {
        //     if (!selectedLabo.value) {
        //         swal.fire({
        //             icon: 'warning',
        //             title: 'Veuillez sélectionner un LABO avant d’enregistrer',
        //             toast: true,
        //             position: 'top-end',
        //             showConfirmButton: false,
        //             timer: 1500,
        //             background: '#fff3cd',
        //             color: '#856404',
        //             timerProgressBar: true,
        //         });
        //         return;
        //     }
        //     else if (!newArticles.value) {
        //         swal.fire({
        //             icon: 'warning',
        //             title: 'Veuillez ajouter un ARTICLE avant d’enregistrer',
        //             toast: true,
        //             position: 'top-end',
        //             showConfirmButton: false,
        //             timer: 1500,
        //             background: '#fff3cd',
        //             color: '#856404',
        //             timerProgressBar: true,
        //         });
        //         return;
        //     }

        //     await storeLabos.insertCodeBarre(selectedLabo.value, newArticles.value);
        //     swal.fire({
        //         icon: 'success',
        //         title: 'Code barre généré',
        //         text: 'Le code barre a été généré avec succès',
        //         toast: true,
        //             position: 'top-end',
        //             showConfirmButton: false,
        //             timer: 2500,
        //             background: '#C8E6C9',
        //             color: '#856404',
        //             timerProgressBar: true,
        //     });

        //     dialogVisible.value = false;
        //     emit('save');
        // }


        const insertCodeBarre = async () => {

            if (loading.value) return;
            loading.value = true;

            try {

                if (!selectedLabo.value) {
                    swal.fire({
                        icon: 'warning',
                        title: 'Veuillez sélectionner un LABO avant d’enregistrer',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        background: '#fff3cd',
                        color: '#856404',
                        timerProgressBar: true,
                    });
                    return;
                }

                if (!newArticles.value) {
                    swal.fire({
                        icon: 'warning',
                        title: 'Veuillez ajouter un ARTICLE avant d’enregistrer',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        background: '#fff3cd',
                        color: '#856404',
                        timerProgressBar: true,
                    });
                    return;
                }

                await storeLabos.insertCodeBarre(selectedLabo.value, newArticles.value);

                swal.fire({
                    icon: 'success',
                    title: 'Code barre généré',
                    text: 'Le code barre a été généré avec succès',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2500,
                    background: '#C8E6C9',
                    color: '#856404',
                    timerProgressBar: true,
                });

                dialogVisible.value = false;

                emit('save');

            } finally {
                loading.value = false;
            }
        };


        const listArticles = ref([]);
        const listFabricants = ref([]);


        const filteredArticles = computed(() => {
            return listArticles.value
                .filter(a => {
                    return !list.value.some(item =>
                        String(item.arcode) === String(a.arcode) || String(item.arlib) === String(a.arlib)
                    );
                })
                .map(a => ({
                    ...a,

                    displayNameArticle: `${a.arcode}--${a.arlib} (${a.arfo})`// concaténation pour affichage sur 2 lignes
                }));
        });


        const filteredFabricants = computed(() => {
            return listFabricants.value.map(f => ({
                ...f,
                displayName: `${f.fab_code} - ${f.fab_libelle}` // concaténation pour l'affichage si tu veux
            }));
        });


        const annuler = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        const closeDetail = () => {
            dialogVisible.value = false;
            emit('annuler');
        };



        return {
            dialogVisible, annuler, closeDetail, save, user, list,
            listArticles,
            listFabricants,
            filteredArticles, filteredFabricants,
            listLabo, selectedLabo, newArticles,
            insertCodeBarre,
            loading,
        };
    }
});

</script>
<style>
.swal2-container {
    z-index: 20000 !important;
}

.v-chip.custom-font-size {
    font-size: 1rem !important;
    /* Utilisez !important pour forcer l'application */
    font-weight: bold;
    /* Facultatif */
}

.centered-chip {
    margin: 0 auto;
    /* Centre le chip horizontalement */
}

.radio-border {
    border: 1px solid #727573;
    border-radius: 8px;
    padding: 0 4px;
    /* padding horizontal seulement */
    margin-top: -30px;
    /* ton ajustement existant */
    display: flex;
    align-items: stretch;
    /* le contenu remplit toute la hauteur */
    height: auto;
    /* laisse le contenu définir la hauteur */
    background-color: #fff;
    /* uniformise le fond */
}

.icon-close {
    cursor: pointer;
    transition: transform 0.3s ease;
}

.icon-close:hover {
    transform: rotate(90deg) scale(1.2);
    color: red;
}
</style>