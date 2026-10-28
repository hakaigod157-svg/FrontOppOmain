<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-left">
                <span class="text-h5">
                    <!-- <b><u>{{ TypeAvance === 3 ? 'AVANCE' : '' }}</u> - {{ TnomClient }} </b> -->
                    <b><u>Création Dossier </u></b>
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
                                class="radio-border" hide-details>
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

                    <!-- <h2 class="text-h5 font-weight-bold text-primary text-left w-100 mb-4">
                        <u>Articles</u>
                    </h2>
                    <v-row dense class="align-start">
                        <v-col cols="auto">
                            <v-combobox label="CODE ARTICLE" v-model="codeArticle" :items="filteredArticles"
                                @input="convertToUpperCase" item-title="article" item-value="code" variant="outlined"
                                density="compact" hide-details style="width: 200px;" clearable />
                        </v-col>

                        <v-col cols="auto">
                            <v-combobox label="LIBELLÉ" v-model="libelle" :items="filteredArticles" item-title="libelle"
                                item-value="libelle" variant="outlined" density="compact" style="width: 500px;"
                                clearable hide-no-data :filter="filterLibelle" />
                        </v-col>

                        <v-col cols="auto">
                            <v-autocomplete :items="filteredTitulaire" item-title="displayName" item-value="focode"
                                v-model="selectedTitulaire" label="Titulaire" clearable return-object variant="outlined"
                                style="width: 350px;" density="compact" />
                        </v-col>

                        <v-col cols="auto">
                            <v-autocomplete :items="filteredFabricants" item-title="fab_libelle" item-value="fab_code"
                                v-model="selectedFabricant" label="Fabricant" clearable return-object variant="outlined"
                                style="width: 200px;" density="compact" />
                        </v-col>


                        <v-col cols="auto">
                            <v-btn variant="tonal" color="#33691E" @click="addArticle" :disabled="loading"
                                density="compact">
                                Ajouter
                            </v-btn>
                        </v-col>
                    </v-row>

                    <div class="pa-2" style="width: 100%;">
                        <MyTableAmm :headers="headers" :items="list" :loading="loading" action2="Supprimer"
                            @action2Item="Enlever"
                            style="height: 150px; overflow-y: auto;border-bottom: 2px solid #ccc">
                        </MyTableAmm>
                    </div> -->

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
                                <!-- <v-combobox v-if="showCodeArticle" label="CODE ARTICLE" v-model="codeArticle"
                                    :items="filteredArticles" @input="convertToUpperCase" item-title="arcode"
                                    item-value="arcode" variant="outlined" density="compact" hide-details
                                    style="width: 200px;" clearable :filter="customArticleFilter"
                                    :disabled="loading || !selectedType"> -->
                                <v-combobox v-if="showCodeArticle" label="CODE ARTICLE" v-model="codeArticle"
                                    :items="filteredArticles" @input="convertToUpperCase"
                                    item-title="displayNameArticle" item-value="arcode" variant="outlined"
                                    density="compact" hide-details style="width: 200px;" clearable
                                    :filter="customArticleFilter" :disabled="loading || !selectedType">
                                    <!-- <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props">
                                            <div class="text-grey lighten-1">{{ item.raw.arlib }} ({{ item.raw.arfo }})
                                            </div>
                                        </v-list-item>
                                    </template> -->
                                </v-combobox>
                            </v-col>

                            <v-col cols="auto">
                                <!-- <v-combobox label="LIBELLÉ" v-model="libelle" :items="filteredArticles"
                                    item-title="libelle" item-value="libelle" variant="outlined" density="compact"
                                    style="width: 500px;" hide-no-data :filter="filterLibelle"
                                    :readonly="isLibelleReadonly" :clearable="isLibelleClearable"/> -->

                                <!-- ✅ Nouvelle demande : pas d’items -->
                                <v-combobox v-if="selectedType === 'NOUVELLE DEMANDE'" label="LIBELLÉ" v-model="libelle"
                                    variant="outlined" density="compact" style="width: 500px;" hide-no-data
                                    :readonly="isLibelleReadonly" :clearable="isLibelleClearable"
                                    :disabled="loading || !selectedType" />

                                <!-- ✅ Variation / Renouvellement : items visibles -->
                                <v-combobox v-else label="LIBELLÉ" v-model="libelle" :items="filteredArticles"
                                    item-title="arlib" item-value="arlib" variant="outlined" density="compact"
                                    style="width: 500px;" hide-no-data :filter="filterLibelle"
                                    :readonly="isLibelleReadonly" :clearable="isLibelleClearable"
                                    :disabled="loading || !selectedType" />
                            </v-col>

                            <v-col cols="auto">
                                <v-autocomplete :items="filteredTitulaire" item-title="displayName" item-value="focode"
                                    v-model="selectedTitulaire" label="Titulaire" clearable return-object
                                    variant="outlined" style="width: 350px;" density="compact"
                                    :disabled="loading || !selectedType" />
                            </v-col>

                            <v-col cols="auto">
                                <v-autocomplete :items="filteredFabricants" item-title="fab_libelle"
                                    item-value="fab_code" v-model="selectedFabricant" label="Fabricant" clearable
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
                        <v-tabs-items v-model="tab">
                            <v-tab-item value="article">
                                <div v-if="tab === 'article'">
                                    <h2 class="text-h5 font-weight-bold text-primary text-left w-100 mb-4 mt-4">
                                        <u>Articles</u>
                                    </h2>
                                    <!-- répète ici exactement le bloc "Articles" (champs + table) -->
                                    <v-row dense class="align-start">
                                        <v-col cols="auto">
                                            <!-- <v-combobox label="CODE ARTICLE" v-model="codeArticle"
                                                :items="filteredArticles" @input="convertToUpperCase"
                                                item-title="arcode" item-value="arcode" variant="outlined"
                                                density="compact" hide-details style="width: 200px;" clearable /> -->

                                            <v-combobox v-if="showCodeArticle" label="CODE ARTICLE"
                                                v-model="codeArticle" :items="filteredArticles"
                                                @input="convertToUpperCase" item-title="displayNameArticle"
                                                item-value="arcode" variant="outlined" density="compact" hide-details
                                                style="width: 200px;" clearable :disabled="loading || !selectedType">
                                                <!-- <template v-slot:item="{ props, item }">
                                                    <v-list-item v-bind="props">
                                                        <div class="text-grey lighten-1">{{ item.raw.arlib }} ({{
                                                            item.raw.arfo }})</div>
                                                    </v-list-item>
                                                </template> -->
                                            </v-combobox>
                                        </v-col>

                                        <v-col cols="auto">
                                            <v-combobox label="LIBELLÉ" v-model="libelle" :items="filteredArticles"
                                                item-title="arlib" item-value="arlib" variant="outlined"
                                                density="compact" style="width: 500px;" hide-no-data
                                                :filter="filterLibelle" :readonly="isLibelleReadonly"
                                                :clearable="isLibelleClearable" />
                                        </v-col>

                                        <v-col cols="auto">
                                            <v-autocomplete :items="filteredTitulaire" item-title="displayName"
                                                item-value="focode" v-model="selectedTitulaire" label="Titulaire"
                                                clearable return-object variant="outlined" style="width: 350px;"
                                                density="compact" />
                                        </v-col>

                                        <v-col cols="auto">
                                            <v-autocomplete :items="filteredFabricants" item-title="fab_libelle"
                                                item-value="fab_code" v-model="selectedFabricant" label="Fabricant"
                                                clearable return-object variant="outlined" style="width: 200px;"
                                                density="compact" />
                                        </v-col>

                                        <v-col cols="auto">
                                            <v-btn variant="tonal" color="#33691E" @click="addArticle"
                                                :disabled="loading" density="compact">
                                                Ajouter
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                    <div class="pa-2" style="width: 100%;">
                                        <MyTableAmm :headers="headers" :items="list" :loading="loading"
                                            action2="Supprimer" @action2Item="Enlever"
                                            style="height: 150px; overflow-y: auto;border-bottom: 2px solid #ccc" />
                                    </div>
                                </div>

                            </v-tab-item>
                            <v-tab-item value="variation">
                                <div v-if="tab === 'variation'" style="min-height: 250px;">
                                    <h2 class="text-h5 font-weight-bold text-primary text-left w-100 mb-4 mt-4">
                                        <u>Variation</u>
                                    </h2>
                                    <v-row dense class="align-start">
                                        <v-col cols="auto">
                                            <v-text-field label="RÉFÉRENCE VARIATION" v-model="ref_variation"
                                                variant="outlined" density="comfortable" style="width: 200px;"
                                                :error="!ref_variation" />
                                        </v-col>
                                        <v-col cols="auto">
                                            <v-text-field label="LIBELLE VARIATION" v-model="libelle_variation"
                                                variant="outlined" density="comfortable" style="width: 500px;" />
                                        </v-col>
                                        <v-col cols="auto">
                                            <v-btn variant="tonal" color="#33691E" @click="addLibelle"
                                                :disabled="loading" density="compact">
                                                Ajouter
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                    <div class="pa-2" style="width: 165%;">
                                        <MyTableAmm :headers="headers_variation" :items="list_variation"
                                            :loading="loading" action2="Supprimer" @action2Item="Enlever_variation"
                                            style="height: 100px; overflow-y: auto;border-bottom: 2px solid #ccc" />
                                    </div>
                                </div>
                            </v-tab-item>
                        </v-tabs-items>
                    </div>

                </v-row>
            </v-card-text>
        </div>

        <v-card-actions>
            <v-spacer />
            <v-btn color="red" variant="outlined" @click="annuler">Annuler</v-btn>
            <v-btn color="primary" variant="tonal" :disabled="isSaving"  :loading="isSaving" @click="save">Enregistrer</v-btn>
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
        const selectedType = ref(null)
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
        const usedArticles = ref([]);        // articles déjà dans la DB / déjà sélectionnés


        // const filteredArticles = computed(() => {
        //     return listArticles.value.filter(a => {
        //         return !list.value.some(item =>
        //             String(item.arcode) === String(a.arcode) || String(item.arlib) === String(a.arlib)
        //         );
        //     });
        // });

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

        //Enlever les fabriquants ajouter dans le tableau
        // const filteredFabricants = computed(() => {
        //     return listFabricants.value.filter(f => {
        //         return !list.value.some(item => String(item.fab_code) === String(f.fab_code));
        //     });
        // });

        const filteredFabricants = computed(() => {
            return listFabricants.value.map(f => ({
                ...f,
                displayName: `${f.fab_code} - ${f.fab_libelle}` // concaténation pour l'affichage si tu veux
            }));
        });


        // const filteredTitulaire = computed(() => {
        //     return list_titulaire.value
        //         .filter(t => !list.value.some(item => String(item.focode) === String(t.focode)))
        //         .map(t => ({
        //             ...t,
        //             displayName: `${t.focode} - ${t.fonom}` // concaténation pour l'affichage
        //         }));
        // });

        const filteredTitulaire = computed(() => {
            return list_titulaire.value.map(t => ({
                ...t,
                displayName: `${t.focode} - ${t.fonom}` // concaténation pour l'affichage
            }));
        });

        const isSaving = ref(false);

        // const save = async () => {
        //     // ✅ Vérifications communes
        //     if (selectedType.value == null) {
        //         swal.fire({
        //             icon: 'error',
        //             title: 'Il faut sélectionner un TYPE',
        //             toast: true,
        //             position: 'top-end',
        //             showConfirmButton: false,
        //             timer: 1500,
        //             background: '#f8d7da',
        //             color: '#721c24',
        //             timerProgressBar: true,
        //         });
        //         return;
        //     }

        //     if (selectedClass.value == null) {
        //         swal.fire({
        //             icon: 'error',
        //             title: 'Il faut sélectionner une CLASSIFICATION',
        //             toast: true,
        //             position: 'top-end',
        //             showConfirmButton: false,
        //             timer: 1500,
        //             background: '#f8d7da',
        //             color: '#721c24',
        //             timerProgressBar: true,
        //         });
        //         return;
        //     }

        //     if (selectedResp.value == null) {
        //         swal.fire({
        //             icon: 'error',
        //             title: 'Il faut sélectionner un(e) RESPONSABLE',
        //             toast: true,
        //             position: 'top-end',
        //             showConfirmButton: false,
        //             timer: 1500,
        //             background: '#f8d7da',
        //             color: '#721c24',
        //             timerProgressBar: true,
        //         });
        //         return;
        //     }

        //     if (!list.value || list.value.length === 0) {
        //         swal.fire({
        //             icon: 'error',
        //             title: 'Il faut ajouter au moins un article',
        //             toast: true,
        //             position: 'top-end',
        //             showConfirmButton: false,
        //             timer: 1500,
        //             background: '#f8d7da',
        //             color: '#721c24',
        //             timerProgressBar: true,
        //         });
        //         return;
        //     }

        //     // ✅ Si le type est VARIATION → contrôles spécifiques
        //     if (selectedType.value === "VARIATION") {
        //         if (!ref_variation.value || ref_variation.value.length === 0) {
        //             swal.fire({
        //                 icon: 'error',
        //                 title: 'Veuillez renseigner le champ référence variation',
        //                 toast: true,
        //                 position: 'top-end',
        //                 showConfirmButton: false,
        //                 timer: 1500,
        //                 background: '#f8d7da',
        //                 color: '#721c24',
        //                 timerProgressBar: true,
        //             });
        //             return;
        //         }

        //         if (!list_variation.value || list_variation.value.length === 0) {
        //             swal.fire({
        //                 icon: 'error',
        //                 title: 'Il faut ajouter un libellé de variation',
        //                 toast: true,
        //                 position: 'top-end',
        //                 showConfirmButton: false,
        //                 timer: 1500,
        //                 background: '#f8d7da',
        //                 color: '#721c24',
        //                 timerProgressBar: true,
        //             });
        //             return;
        //         }
        //         await insertLigneVariation();

        //     }
        //     else {
        //         // ✅ Si ce n’est pas VARIATION, on met un tableau vide pour éviter "not iterable"
        //         list_variation.value = [];
        //     }

        //     // ✅ Exécution des insertions dans tous les cas
        //     await insertLigneAmm();
        //     await insertDossierAmm();
        //     closeDetail();
        //     await listArticle();
        // };

        const save = async () => {
            if (isSaving.value) return; // évite double clic

            isSaving.value = true;

            try {
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

                // ✅ VARIATION
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
                } else {
                    list_variation.value = [];
                }

                await insertLigneAmm();
                await insertDossierAmm();
                closeDetail();
                await listArticle();

            } finally {
                // 🔥 Réactive le bouton même si erreur
                isSaving.value = false;
            }
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
            await listArticle();
            await listFabricant();
            await listTitulaire();
            await listResponsable();

        })

        const type = 1;
        const labo = null;

        const listArticle = async () => {
            // await storeArticle.fetchArticle();
            await storeArticle.fetchListArticleLier(labo, type);
            listArticles.value = storeArticle.listArticleLiers;
            //  console.log(listArticles.value)
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
        //     // list_respo.value = storeListRespo.listRespos;

        //     list_respo.value = storeListRespo.listRespos.map(r => r.responsable);

        //     console.log(list_respo.value)
        // };

        const listResponsable = async () => {
            await storeListRespo.fetchListRespo();

            // Sécuriser si jamais listRespos est undefined
            list_respo.value = (storeListRespo.listRespos || [])
                .map(r => r.responsable)
                .filter(Boolean); // enlève null / undefined

        };

        const listTitulaire = async () => {
            // await storeTitulaire.fetchListTitulaire();
            await storeTitulaire.fetchListTitulaireAmm();
            list_titulaire.value = storeTitulaire.listTitulaireAmms;
        };

        const headers = [
            { title: 'CODE ARTICLE', align: 'start', key: 'code', sortable: false },
            { title: 'LIBELLE', align: 'start', key: 'libelle', sortable: false },
            // { title: 'TYPE', align: 'start', key: 'types', sortable: false },
            { title: 'TITULAIRE', align: 'start', key: 'titulaire', sortable: false },
            { title: 'FABRICANT', align: 'start', key: 'fabricant', sortable: false },

            { title: '', align: 'center', sortable: false, key: 'actions', width: "20px" },
        ]

        const headers_variation = [
            { title: 'LIBELLE', align: 'start', key: 'libelle_variation', sortable: false },
            { title: '', align: 'center', key: 'actions', width: '50px' },
        ]

        const addArticle = () => {
            if (!selectedFabricant.value || typeof selectedFabricant.value !== 'object') {
                // rien à faire si aucun fabricant sélectionné
                return;
            }

            if (!selectedTitulaire.value || typeof selectedTitulaire.value !== 'object') {
                // rien à faire si aucun fabricant sélectionné
                return;
            }

            // ✅ Test si codeArticle est vide pour Variation ou Renouvellement
            if ((selectedType.value === 'VARIATION' || selectedType.value === 'RENOUVELLEMENT') && !codeArticle.value) {
                swal.fire({
                    icon: 'warning',
                    title: 'Veuillez sélectionner un CODE ARTICLE avant d’ajouter',
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

            const fabricantObj = {
                code: selectedFabricant.value.fab_code,
                libelle: String(selectedFabricant.value.fab_libelle)
            };

            const titulaireObj = {
                code: selectedTitulaire.value.focode,
                libelle: String(selectedTitulaire.value.displayName)
            }

            // article : code peut être vide
            // const articleCode = typeof codeArticle.value === "object" ? String(codeArticle.value.article) : String(codeArticle.value ?? '');
            const articleCode = codeArticle.value && typeof codeArticle.value === "object" ? String(codeArticle.value.arcode ?? '') : String(codeArticle.value ?? '');
            const articleLibelle = typeof libelle.value === "object" ? String(libelle.value.libelle ?? '') : String(libelle.value ?? '');
            // const articletitulaire = typeof titulaire.value === "object" ? String(libelle.value.libelle ?? '') : String(libelle.value ?? '');

            list.value.push({
                code: articleCode,
                libelle: articleLibelle,
                types: String(types.value ?? ''),
                fabricant: fabricantObj.libelle,
                fab_code: fabricantObj.code,
                titulaire: titulaireObj.code,
                focode: titulaireObj.code,
            });

            // reset
            codeArticle.value = '';
            libelle.value = '';
            types.value = '';
            selectedFabricant.value = null;
            selectedTitulaire.value = null;
        };




        const addLibelle = () => {
            if (!libelle_variation.value || !libelle_variation.value.trim()) {
                return;
            }

            list_variation.value.push({
                ref_variation: ref_variation.value,
                libelle_variation: libelle_variation.value,
            });

            // reset
            libelle_variation.value = '';
        };


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

        // watch(selectedType, (newVal) => {
        //     codeArticle.value = '';
        //     libelle.value = '';
        //     selectedTitulaire.value = null;
        //     selectedFabricant.value = null;

        //     if (newVal === 'NOUVELLE DEMANDE') {
        //         codeArticle.value = ''; // Réinitialise le champ
        //         isLibelleClearable.value = true;
        //         showCodeArticle.value = false;
        //     } else {
        //         showCodeArticle.value = true;
        //     }
        // });

        const isLibelleReadonly = ref(false);
        // watch(selectedType, (newVal) => {
        //     if (newVal === 'VARIATION' || newVal === 'RENOUVELLEMENT') {
        //         isLibelleReadonly.value = true;
        //         isLibelleClearable.value = false;
        //     } else {
        //         isLibelleReadonly.value = false;
        //     }
        // });


        watch(selectedType, (newVal) => {
            // Réinitialisation des champs
            codeArticle.value = '';
            libelle.value = '';
            selectedTitulaire.value = null;
            selectedFabricant.value = null;

            // Vider le tableau des articles
            list.value = [];

            // Gestion des tabs pour VARIATION
            showTabs.value = newVal === "VARIATION";
            if (showTabs.value) tab.value = "article"; // réinitialise l'onglet à "article"

            // Gestion readonly / clearable du libellé
            if (newVal === 'VARIATION' || newVal === 'RENOUVELLEMENT') {
                isLibelleReadonly.value = true;
                isLibelleClearable.value = false;
            } else {
                isLibelleReadonly.value = false;
            }

            // Gestion de l'affichage du champ codeArticle
            showCodeArticle.value = newVal !== 'NOUVELLE DEMANDE';
            if (newVal === 'NOUVELLE DEMANDE') {
                isLibelleClearable.value = true;
            }
        });

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
            addLibelle, ref_variation, libelle_variation,
            showCodeArticle, isLibelleReadonly, isLibelleClearable,
            customArticleFilter,
            isSaving,
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