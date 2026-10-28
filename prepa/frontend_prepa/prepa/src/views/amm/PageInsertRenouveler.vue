<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-left">
                <span class="text-h5">
                    <!-- <b><u>{{ TypeAvance === 3 ? 'AVANCE' : '' }}</u> - {{ TnomClient }} </b> -->
                    <b><u>Renouvellement </u></b>
                </span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>

        </v-card-title>

        <div class="pa-2">
            <v-card>
                <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5" density="compact">
                </v-progress-linear>

            </v-card>

            <v-card-text>
                <div class="mb-4 text-left">
                    <h2 class="text-h5 font-weight-bold text-primary">
                        <u>Dossier</u>
                    </h2>
                </div>
                <v-row>

                    <v-row dense class="d-flex gap-6 align-center">
                        <!-- Dossier AMM -->
                        <v-col cols="2" md="2">
                            <v-text-field label="Dossier AMM" :model-value="numDossier[0]?.numdossier"
                                v-model="newCodeDoc" @input="convertToUpperCase" variant="outlined"
                                density="comfortable" style="width: 55%;" readonly />
                        </v-col>

                        <!-- Type -->
                        <v-col cols="3" md="4" style="margin-left: -90px;">
                            <v-radio-group label="TYPE" v-model="selectedType" row density="compact" inline
                                class="radio-border" hide-details disabled>
                                <v-radio color="success" label="NOUVELLE DEMANDE" value="NOUVELLE DEMANDE" />
                                <v-radio color="success" label="RENOUVELLEMENT" value="RENOUVELLEMENT" />
                                <v-radio color="success" label="VARIATION" value="VARIATION" />
                            </v-radio-group>
                        </v-col>
                        <!-- CLASSIFICATION -->
                        <v-col style="flex: 0 0 17%; max-width: 25%;">
                            <v-radio-group label="Classification" v-model="selectedClass" row density="compact" inline
                                class="radio-border" hide-details>
                                <v-radio color="success" label="SPÉCIALITÉ" value="SPECIALITE" />
                                <v-radio color="success" label="GÉNÉRIQUE" value="GENERIQUE" />
                            </v-radio-group>
                        </v-col>

                        <v-col cols="3" md="2">
                            <MySelect label="RESPONSABLE" density="comfortable" :items="list_respo"
                                v-model="selectedResp" item-title="responsable" item-value="responsable"
                                :clearable="false" />
                        </v-col>
                    </v-row>


                    <v-divider class="my-6 border-opacity-100" color="#FF80AB" :thickness="2"></v-divider>


                    <v-toolbar v-if="showTabs" :elevation="1" density="compact" color="#d7ead5">
                        <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4" grow>
                            <v-tab value="article">ARTICLE</v-tab>
                            <v-tab value="variation">VARIATION</v-tab>
                        </v-tabs>
                    </v-toolbar>


                    <!-- ----------   CAS 1 : PAS DE TABS (NOUVELLE DEMANDE / RENOUVELLEMENT)  ---------- -->
                    <div v-if="!showTabs">
                        <h2 class="text-h5 font-weight-bold text-primary text-left w-100 mb-4 mt-4">
                            <u>Articles</u>
                        </h2>
                        <!-- Ligne pour les champs -->
                        <v-row dense class="align-start">
                            <v-col cols="auto">
                                <v-combobox v-if="showCodeArticle" label="CODE ARTICLE" v-model="localCodeArticle"
                                    :items="filteredArticles" @input="convertToUpperCase"
                                    item-title="displayNameArticle" item-value="arcode" variant="outlined"
                                    density="compact" hide-details style="width: 200px;" :filter="customArticleFilter"
                                    :disabled="loading || !selectedType" readonly>
                                </v-combobox>
                            </v-col>

                            <v-col cols="auto">

                                <!-- ✅ Nouvelle demande : pas d’items -->
                                <v-combobox v-if="selectedType === 'NOUVELLE DEMANDE'" label="LIBELLÉ"
                                    v-model="localLibelle" variant="outlined" density="compact" style="width: 500px;"
                                    hide-no-data readonly :disabled="loading || !selectedType" />

                                <!-- ✅ Variation / Renouvellement : items visibles -->
                                <v-combobox v-else label="LIBELLÉ" v-model="localLibelle" :items="filteredArticles"
                                    item-title="arlib" item-value="arlib" variant="outlined" density="compact"
                                    style="width: 500px;" hide-no-data :filter="filterLibelle"
                                    :disabled="loading || !selectedType" readonly />
                            </v-col>

                            <v-col cols="auto">
                                <v-autocomplete :items="filteredTitulaire" item-title="displayName" item-value="focode"
                                    v-model="localTitulaire" label="Titulaire" return-object variant="outlined"
                                    style="width: 350px;" density="compact" :disabled="loading || !selectedType"
                                    readonly />
                            </v-col>

                            <v-col cols="auto">
                                <v-autocomplete :items="filteredFabricants" item-title="fab_libelle"
                                    item-value="fab_code" v-model="localFabricant" label="Fabricant" clearable
                                    return-object variant="outlined" style="width: 200px;" density="compact"
                                    :disabled="loading || !selectedType" />
                            </v-col>

                            <v-col cols="auto">
                                <v-btn variant="tonal" color="#33691E" @click="addArticle"
                                    :disabled="loading || !selectedType" density="compact">
                                    Ajouter
                                </v-btn>
                            </v-col>
                        </v-row>

                        <div class="pa-2" style="width: 100%;">
                            <MyTableAmm :headers="headers" :items="list" :loading="loading" action2="Supprimer"
                                @action2Item="Enlever"
                                style="height: 150px; overflow-y: auto;border-bottom: 2px solid #ccc" />
                        </div>
                    </div>

                    <!-- ----------   CAS 2 : TABS affichés (VARIATION) - place le bloc Articles DANS l'onglet ARTICLE  ---------- -->
                    <div v-else>
                    </div>

                </v-row>
            </v-card-text>
        </div>

        <v-card-actions>
            <v-spacer />
            <v-btn color="red" variant="outlined" @click="annuler">Annuler</v-btn>
            <v-btn color="primary" variant="tonal" @click="save">Enregistrer</v-btn>
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

        codeArticleRenouvel: String,
        libelleRenouvel: String,
        titulaire: String,

    },

    setup(props, { emit }) {

        const dialogVisible = ref(false);
        const user = localStorage.getItem('username');
        const router = useRouter();
        useSessionTimeout(Config.DURRE_SESSION, router);
        const list = ref([]);
        const list_variation = ref([]);
        const storeInsertDossierLigne = uselistDossier();
        const storeTitulaire = uselistDossier();
        const storeListRespo = uselistDossier();
        const storeArticle = uselistDossier();
        const storeFabricant = uselistFabricant();

        const storeType = useTypeStore();
        const storeStatus = useStatuStore();
        const storeResp = useRespStore();

        const newCodeDoc = ref('');
        const newCodeFab = ref('');
        const newLibelleFab = ref('');

        // const selectedType = ref(null);
        const selectedType = ref("RENOUVELLEMENT")
        const selectedStatus = ref(null);
        const selectedResp = ref(null);
        const selectedClass = ref(null);

        const selectedFabricant = ref(null);
        const selectedTitulaire = ref(null);
        const numDossier = ref([]);
        const list_titulaire = ref([]);

        // Liste responsables
        const list_respo = ref([]);
        const showTabs = ref(false);
        const tab = ref('article');

        const localCodeArticle = props.codeArticleRenouvel;
        const localLibelle = props.libelleRenouvel;
        const localTitulaire = props.titulaire;
        const localFabricant = ref('');

        const prefixe = 'AM';
        const nom_table = 'AMM_DOSSIER';

        //Liste dynamique des select dans nouveau dossier
        const list_types = computed(() => {
            return storeType.types.map(type => type.libelle);
        });

        const list_status = computed(() => {
            return storeStatus.status.map(statu => statu.libelle);
        });

        const list_resp = computed(() => {
            return storeResp.responsables.map(responsable => responsable.libelle);
        });

        // Champs du formulaire
        const codeArticle = ref("")
        const libelle = ref("")
        const types = ref("")
        const fabricant = ref("")
        const libelle_variation = ref("")
        const ref_variation = ref("")

        const listArticles = ref([]);
        const listFabricants = ref([]);
        const usedArticles = ref([]);

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


        const filteredTitulaire = computed(() => {
            return list_titulaire.value.map(t => ({
                ...t,
                displayName: `${t.focode} - ${t.fonom}` // concaténation pour l'affichage
            }));
        });



        const save = async () => {
            // ✅ Vérifications communes
            if (selectedType.value == null) {
                swal.fire({
                    icon: 'error',
                    title: 'Il faut sélectionner un TYPE',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f8d7da',
                    color: '#721c24',
                    timerProgressBar: true,
                });
                return;
            }

            if (selectedClass.value == null) {
                swal.fire({
                    icon: 'error',
                    title: 'Il faut sélectionner une CLASSIFICATION',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f8d7da',
                    color: '#721c24',
                    timerProgressBar: true,
                });
                return;
            }

            if (selectedResp.value == null) {
                swal.fire({
                    icon: 'error',
                    title: 'Il faut sélectionner un(e) RESPONSABLE',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f8d7da',
                    color: '#721c24',
                    timerProgressBar: true,
                });
                return;
            }

            if (!list.value || list.value.length === 0) {
                swal.fire({
                    icon: 'error',
                    title: 'Il faut ajouter au moins un article',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f8d7da',
                    color: '#721c24',
                    timerProgressBar: true,
                });
                return;
            }

            // ✅ Si le type est VARIATION → contrôles spécifiques
            if (selectedType.value === "VARIATION") {
                if (!ref_variation.value || ref_variation.value.length === 0) {
                    swal.fire({
                        icon: 'error',
                        title: 'Veuillez renseigner le champ référence variation',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        background: '#f8d7da',
                        color: '#721c24',
                        timerProgressBar: true,
                    });
                    return;
                }

                if (!list_variation.value || list_variation.value.length === 0) {
                    swal.fire({
                        icon: 'error',
                        title: 'Il faut ajouter un libellé de variation',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                        background: '#f8d7da',
                        color: '#721c24',
                        timerProgressBar: true,
                    });
                    return;
                }
                await insertLigneVariation();

            }
            else {
                // ✅ Si ce n’est pas VARIATION, on met un tableau vide pour éviter "not iterable"
                list_variation.value = [];
            }

            // ✅ Exécution des insertions dans tous les cas
            await insertLigneAmm();
            await insertDossierAmm();
            closeDetail();
            await listArticle();
        };


        const insertLigneAmm = async () => {
            await storeInsertDossierLigne.insertDossier(newCodeDoc.value, list.value);
        };
        const insertDossierAmm = async () => {
            await storeInsertDossierLigne.insertDossierSelected(newCodeDoc.value, selectedResp.value, selectedType.value, selectedClass.value, ref_variation.value);
        };

        const insertLigneVariation = async () => {
            await storeInsertDossierLigne.insertLigneVaraiation(newCodeDoc.value, list_variation.value);
        }


        const annuler = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        const closeDetail = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        const convertToUpperCase = () => {
            newCodeDoc.value = newCodeDoc.value.toUpperCase();
            codeArticle.value = codeArticle.value.toUpperCase();
        };


        onMounted(async () => {
            list.value = [];
            list_variation.value = []
            numDossier.value = [];
            await listNumDossier();
            // await listArticle();
            await listFabricant();
            // await listTitulaire();
            await listResponsable();

        })

        const type = 1;
        const labo = null;

        const listArticle = async () => {
            await storeArticle.fetchListArticleLier(labo, type);
            listArticles.value = storeArticle.listArticleLiers;
        };

        const listFabricant = async () => {
            await storeFabricant.fetchListFabricant(libelle.value);
            listFabricants.value = storeFabricant.listfabricants;
        };

        const listNumDossier = async () => {
            await storeInsertDossierLigne.fetchNumDossier(prefixe, nom_table);
            numDossier.value = storeInsertDossierLigne.listnumdossiers;
        };

        // Liste responsable depuis la base de données
        // const listResponsable = async () => {
        //     await storeListRespo.fecthListRespo();
        //     list_respo.value = storeListRespo.listRespos.map(r => r.responsable);
        // };

        const listResponsable = async () => {
            await storeListRespo.fetchListRespo();

            // Sécuriser si jamais listRespos est undefined
            list_respo.value = (storeListRespo.listRespos || [])
                .map(r => r.responsable)
                .filter(Boolean); // enlève null / undefined
        };

        const listTitulaire = async () => {
            await storeTitulaire.fetchListTitulaireAmm();
            list_titulaire.value = storeTitulaire.listTitulaireAmms;
        };

        const headers = [
            { title: 'CODE ARTICLE', align: 'start', key: 'code', sortable: false },
            { title: 'LIBELLE', align: 'start', key: 'libelle', sortable: false },
            { title: 'TITULAIRE', align: 'start', key: 'titulaire', sortable: false },
            { title: 'FABRICANT', align: 'start', key: 'fabricant', sortable: false },

            { title: '', align: 'center', sortable: false, key: 'actions', width: "20px" },
        ]

        const headers_variation = [
            { title: 'LIBELLE', align: 'start', key: 'libelle_variation', sortable: false },
            { title: '', align: 'center', key: 'actions', width: '50px', },
        ]

        const addArticle = () => {
            // ✅ Test si fabricant vide
            if (!localFabricant.value) {
                swal.fire({
                    icon: 'error',
                    title: 'Veuillez sélectionner un FABRICANT',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#f8d7da',
                    color: '#721c24',
                    timerProgressBar: true,
                });
                return;
            }


            list.value.push({
                code: localCodeArticle,
                libelle: localLibelle,
                titulaire: localTitulaire,
                fabricant: localFabricant.value.fab_libelle,
                fab_code: localFabricant.value.fab_code,
                focode: localTitulaire,
            });

            // reset
            // fabricant.value = '';
            // libelle.value = '';
            // types.value = '';
            // selectedFabricant.value = null;
            // selectedTitulaire.value = null;
        };




        // const addLibelle = () => {
        //     if (!libelle_variation.value || !libelle_variation.value.trim()) {
        //         return;
        //     }

        //     list_variation.value.push({
        //         ref_variation: ref_variation.value,
        //         libelle_variation: libelle_variation.value,
        //     });

        //     // reset
        //     libelle_variation.value = '';
        // };


        watch(numDossier, (val) => {
            if (val[0]?.numdossier) {
                newCodeDoc.value = val[0].numdossier;
            }
        }, { immediate: true });


        watch(codeArticle, (newCode) => {
            // Si newCode est un objet venant de listArticles
            if (typeof newCode === "object" && newCode !== null) {
                libelle.value = newCode.arlib || ""

            }
            // Si c'est une chaîne saisie manuellement
            else if (typeof newCode === "string") {
                const found = listArticles.value.find(a => a.arlib.trim() === newCode.trim())
                // libelle.value = found ? found.libelle : ""
            }
            else {
                libelle.value = ""
            }
        })

        watch(libelle, (newLibelle) => {
            if (typeof newLibelle === "object" && newLibelle !== null) {
                // On met le codeArticle à la valeur du champ "article"
                codeArticle.value = newLibelle.arlib || "";
            }
            else if (typeof newLibelle === "string") {
                const found = listArticles.value.find(
                    a => a.arlib.trim() === newLibelle.trim()
                );
                // codeArticle.value = found ? found.article : "";
            }
            else {
                codeArticle.value = "";
            }
        });

        watch(codeArticle, (newCode) => {
            if (!newCode) {
                libelle.value = "";
                selectedTitulaire.value = null;
                return;
            }

            const code = typeof newCode === 'object' ? newCode.arcode.trim() : String(newCode).trim();

            const found = listArticles.value.find(a => a.arcode.trim() === code);

            if (found) {
                libelle.value = found.arlib;
                // Cherche le titulaire correspondant à arfo
                const titulaireObj = filteredTitulaire.value.find(t => t.focode.trim() === found.arfo?.trim());
                selectedTitulaire.value = titulaireObj || null;
            } else {
                libelle.value = "";
                selectedTitulaire.value = null;
            }
        });



        function Enlever(item) {
            list.value = list.value.filter(i => i !== item)
        }

        function Enlever_variation(item) {
            list_variation.value = list_variation.value.filter(i => i !== item)
        }


        watch(selectedType, (newVal) => {
            // console.log("Type sélectionné :", newVal);
            showTabs.value = newVal === "VARIATION";
            if (showTabs.value) tab.value = "article"; // réinitialise l'onglet à "article"
        });

        const showCodeArticle = ref(true);
        const isLibelleClearable = ref(false);

        const isLibelleReadonly = ref(false);

        const customArticleFilter = (item, queryText, itemText) => {
            console.log('Filtre appelé:', { queryText, item: item.raw });

            if (!queryText) return true;

            const searchText = queryText.toLowerCase();
            const arcode = item.raw.arcode ? String(item.raw.arcode).toLowerCase() : '';
            const arlib = item.raw.arlib ? String(item.raw.arlib).toLowerCase() : '';

            const match = arcode.includes(searchText) || arlib.includes(searchText);
            console.log('Match:', match);

            return match;
        };





        return {
            dialogVisible, headers, annuler, closeDetail, save, user, list, headers_variation, list_variation,
            newCodeFab, newLibelleFab, convertToUpperCase, selectedType, selectedStatus, selectedResp, selectedClass,
            addArticle, codeArticle, libelle, types, fabricant,
            listArticles,
            storeType, storeStatus, storeResp,
            list_types, list_status, list_resp,
            newCodeDoc,
            insertLigneAmm, insertDossierAmm, insertLigneVariation,
            Enlever, Enlever_variation,
            listFabricants, list_respo,
            selectedFabricant, selectedTitulaire,
            numDossier, list_titulaire,
            filteredArticles, filteredFabricants, filteredTitulaire,
            showTabs, tab,
            ref_variation, libelle_variation,
            showCodeArticle, isLibelleReadonly, isLibelleClearable,
            customArticleFilter,
            localCodeArticle, localLibelle, localTitulaire, localFabricant,

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
</style>