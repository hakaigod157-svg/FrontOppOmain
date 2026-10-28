<template>
    <v-app>
        <v-main style="--v-layout-top: 10px" app>

            <v-row density="compact" align="center" justify="start" class="px-3" no-gutters style="padding-top: 0px;">

                <!-- ========================= -->
                <!-- RECHERCHE -->
                <!-- ========================= -->
                <v-row>
                    <v-col cols="12" md="2">
                        <v-select v-model="form.DEMANDE_DEPARTEMENT" :items="departements" item-title="lib_departement"
                            item-value="code_departement" label="Département" @update:modelValue="onDepartementChange"
                            variant="underlined" density="compact" color="deep-purple-accent-4"
                            :error="!!errors.DEMANDE_DEPARTEMENT" :error-messages="errors.DEMANDE_DEPARTEMENT"
                            clearable />
                    </v-col>

                    <v-col cols="12" md="2">
                        <v-select v-model="form.DEMANDE_POSTE" :items="postesFiltrees" item-title="poste_libelle"
                            item-value="code_poste" label="Poste" variant="underlined" density="compact"
                            color="deep-purple-accent-4" :error="!!errors.DEMANDE_POSTE"
                            :error-messages="errors.DEMANDE_POSTE" clearable />
                    </v-col>

                    <!-- Bouton rechercher -->
                    <v-btn variant="tonal" color="primary" @click="rechercher" density="compact"
                        style="min-width: 50px; height: 36px;">
                        Rechercher
                    </v-btn>
                </v-row>


                <!-- ========================= -->
                <!-- ONGLETS -->
                <!-- ========================= -->
                <v-col cols="12" class="pa-0 mt-2">

                    <v-tabs v-model="tab" color="deep-purple-accent-4" class="custom-tabs1" grow density="compact"
                        slider-color="deep-purple-accent-4">
                        <v-tab value="outil">
                            Outil
                        </v-tab>

                        <v-tab value="formation">
                            Formation
                        </v-tab>
                    </v-tabs>

                    <v-divider />


                    <!-- ========================= -->
                    <!-- CONTENU DES ONGLETS -->
                    <!-- ========================= -->
                    <v-window v-model="tab">

                        <!-- ========================= -->
                        <!-- ONGLET OUTIL -->
                        <!-- ========================= -->
                        <v-window-item value="outil">

                            <div v-if="loading || list.length" class="table-scroll">

                                <v-progress-linear v-if="loading" color="#263238" rounded indeterminate height="2" />

                                <Tableau v-else :headers="headers" :items="list" :checkbox-keys="checkboxKeys"
                                    @checkbox-change="handleCheckboxChange" />

                            </div>

                            <!-- ========================= -->
                            <!-- BOUTON ENREGISTRER OUTIL-->
                            <!-- ========================= -->
                            <div class="pa-2">

                                <div v-if="list.length && tab === 'outil'" class="text-right mt-3">

                                    <v-btn color="success" variant="elevated" @click="enregistrer" density="compact">
                                        Enregistrer
                                    </v-btn>

                                </div>

                            </div>

                        </v-window-item>


                        <!-- ========================= -->
                        <!-- ONGLET FORMATION -->
                        <!-- ========================= -->
                        <v-window-item value="formation">

                            <div v-if="loading || list_formation.length" class="table-scroll">

                                <v-progress-linear v-if="loading" color="#263238" rounded indeterminate height="2" />

                                <TableauFormation v-else :headers="headers_formation" :items="list_formation"
                                    :checkbox-keys="checkboxKeysFormation"
                                    @checkbox-change="handleFormationCheckboxChange" />

                            </div>

                            <!-- ========================= -->
                            <!-- BOUTON ENREGISTRER FORMATION-->
                            <!-- ========================= -->
                            <div class="pa-2">
                                <div v-if="list_formation.length && tab === 'formation'" class="text-right mt-3">
                                    <v-btn color="success" variant="elevated" @click="enregistrer_formation"
                                        density="compact">
                                        Enregistrer
                                    </v-btn>

                                </div>
                            </div>

                        </v-window-item>

                    </v-window>

                </v-col>

            </v-row>


        </v-main>
    </v-app>
</template>



<script>
import { defineComponent, ref, reactive, computed, watch, onMounted, onBeforeMount, } from "vue";
import { useRouter } from "vue-router";
import { useOnline } from "@vueuse/core";
import { useParamStore } from "@/store/Rh/rh_params";
import { useClientStore } from "@/store/utils/client.js";
import { useDemande } from "@/store/Rh/rh_demande";
import useSessionTimeout from "@/utils/useSessionTimeout";
import Config from "@/utils/config.js";
import Swal from "sweetalert2";
import Tableau from "@/components/rh/tableauParams.vue";
import TableauFormation from "@/components/rh/tableauParamsFormation.vue";

export default defineComponent({
    name: "NouveauFichier",

    components: {
        Tableau,
        TableauFormation
    },


    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },

    setup() {
        const isOnline = useOnline();
        const router = useRouter();
        const user = localStorage.getItem("username");
        const store = useParamStore();
        const storeClient = useClientStore();
        const loading = computed(() => store.loading);
        const tab = ref("outil");

        useSessionTimeout(Config.DURRE_SESSION, router);

        // ── Département / Poste ──────────────────────────────────────────────────
        const departements = ref([]);
        const postesFiltrees = ref([]);

        const form = reactive({
            DEMANDE_DEPARTEMENT: "",
            DEMANDE_POSTE: "",
        });

        const errors = reactive({
            DEMANDE_DEPARTEMENT: "",
            DEMANDE_POSTE: "",
        });

        function onDepartementChange(codeDep) {
            const dep = departements.value.find(
                (d) => d.code_departement === codeDep
            );
            postesFiltrees.value = dep ? dep.postes : [];
            // Réinitialise le poste si le poste actuel n'est plus dans la liste
            if (!postesFiltrees.value.find((p) => p.code_poste === form.DEMANDE_POSTE)) {
                form.DEMANDE_POSTE = null;
            }
        }

        watch(
            () => form.DEMANDE_DEPARTEMENT,
            (codeDep) => {
                const dep = departements.value.find(
                    (d) => d.code_departement === codeDep
                );
                postesFiltrees.value = dep ? dep.postes : [];
                if (!postesFiltrees.value.find((p) => p.code_poste === form.DEMANDE_POSTE)) {
                    form.DEMANDE_POSTE = null;
                }
            }
        );

        // ── Liste / Recherche ────────────────────────────────────────────────────
        const list = ref([]);
        const client = ref([]);
        const clientCode = ref("");
        const ip_server = ref("");
        const isSaving = ref(false);
        const list_formation = ref([]);


        // const headers = [
        //     { title: "DEPARTEMENT", align: "start", key: "nom_dep", sortable: false, width: "150px" },
        //     { title: "POSTE", align: "start", key: "nom_poste", sortable: false },
        //     { title: "ASCOMA ASSURANCE", align: "start", key: "ascoma_assurance", sortable: false },
        //     { title: "CASIER CASIER", align: "start", key: "casier_casier", sortable: false },
        //     { title: "BLOUSE EPI", align: "start", key: "blouse_epi", sortable: false },
        //     { title: "CASQUE EPI", align: "start", key: "casque_epi", sortable: false },
        //     { title: "CHAUSSURE EPI", align: "start", key: "chaussure_epi", sortable: false },
        //     { title: "COMBINAISON EPI", align: "start", key: "combinaison_epi", sortable: false },
        //     { title: "DOUDOUNE EPI", align: "start", key: "doudoune_epi", sortable: false },
        //     { title: "GANT EPI", align: "start", key: "gant_epi", sortable: false },
        //     { title: "GILET EPI", align: "start", key: "gilet_epi", sortable: false },
        //     { title: "IMPERMEABLE EPI", align: "start", key: "impermeable_epi", sortable: false },
        //     { title: "LAPTOP MAT INFO", align: "start", key: "laptop_mat_info", sortable: false },
        //     { title: "PC BUREAU MAT INFO", align: "start", key: "pc_bureau_mat_info", sortable: false },
        //     { title: "TABLETTE MAT INFO", align: "start", key: "tablette_mat_info", sortable: false },
        //     { title: "CARTE CARBURANT ROULANT", align: "start", key: "carte_carburant_roulant", sortable: false },
        //     { title: "MOTO ROULANT", align: "start", key: "moto_roulant", sortable: false },
        //     { title: "VEHICULE ROULANT", align: "start", key: "vehicule_roulant", sortable: false },
        //     { title: "APPEL TELEPHONIQUE", align: "start", key: "appel_telephonique", sortable: false },
        //     { title: "DATA TELEPHONIQUE", align: "start", key: "data_telephonique", sortable: false },
        //     { title: "POSTE TELEPHONIQUE", align: "start", key: "poste_telephonique", sortable: false },
        // ];

        const headers = [
            { title: "DEPARTEMENT", align: "start", key: "nom_dep", sortable: false, rowspan: 2, width: "150px" },
            { title: "POSTE", align: "start", key: "nom_poste", sortable: false, rowspan: 2 },

            {
                title: "ASSURANCE",
                align: "center",
                sortable: false,
                children: [
                    { title: "ASCOMA", align: "center", key: "ascoma_assurance", sortable: false },
                ],
            },

            {
                title: "CASIER",
                align: "center",
                sortable: false,
                children: [
                    { title: "CASIER", align: "center", key: "casier_casier", sortable: false },
                ],
            },

            {
                title: "EPI",
                align: "center",
                sortable: false,
                children: [
                    { title: "BLOUSE", align: "center", key: "blouse_epi", sortable: false },
                    { title: "CASQUE", align: "center", key: "casque_epi", sortable: false },
                    { title: "CHAUSSURE", align: "center", key: "chaussure_epi", sortable: false },
                    { title: "COMBINAISON", align: "center", key: "combinaison_epi", sortable: false },
                    { title: "DOUDOUNE", align: "center", key: "doudoune_epi", sortable: false },
                    { title: "GANT", align: "center", key: "gant_epi", sortable: false },
                    { title: "GILET", align: "center", key: "gilet_epi", sortable: false },
                    { title: "IMPERMEABLE", align: "center", key: "impermeable_epi", sortable: false },
                ],
            },
            {
                title: "MAT INFO",
                align: "center",
                sortable: false,
                children: [
                    { title: "LAPTOP", align: "center", key: "laptop_mat_info", sortable: false },
                    { title: "PC BUREAU", align: "center", key: "pc_bureau_mat_info", sortable: false },
                    { title: "TABLETTE", align: "center", key: "tablette_mat_info", sortable: false },
                ],
            },
            {
                title: "ROULANT",
                align: "center",
                sortable: false,
                children: [
                    { title: "CARTE CARBURANT", align: "center", key: "carte_carburant_roulant", sortable: false },
                    { title: "MOTO", align: "center", key: "moto_roulant", sortable: false },
                    { title: "VEHICULE", align: "center", key: "vehicule_roulant", sortable: false },
                ],
            },
            {
                title: "TELEPHONIQUE",
                align: "center",
                sortable: false,
                children: [
                    { title: "APPEL", align: "center", key: "appel_telephonique", sortable: false },
                    { title: "DATA", align: "center", key: "data_telephonique", sortable: false },
                    { title: "POSTE", align: "center", key: "poste_telephonique", sortable: false },
                ],
            },
        ];

        const totalList = computed(() => list.value.length);

        const fetchClient = async () => {
            await storeClient.fetchlListClient();
            client.value = storeClient.ListClients.map((item) => ({
                value: item.clcode.trim(),
                text: `${item.clcode.trim()} - ${item.clnom1}`,
            }));
        };

        const rechercher = async () => {

            const departementCode =
                form.DEMANDE_DEPARTEMENT && form.DEMANDE_DEPARTEMENT !== ""
                    ? form.DEMANDE_DEPARTEMENT
                    : null;

            const posteCode =
                form.DEMANDE_POSTE && form.DEMANDE_POSTE !== ""
                    ? form.DEMANDE_POSTE
                    : null;

            console.log("Département sélectionné :", departementCode);
            console.log("Poste sélectionné :", posteCode);

            await store.fetchListParams(departementCode, posteCode);

            list.value = store.listparams;

            await store.fetchListParamsFormation(departementCode, posteCode);
            list_formation.value = store.listparamsFormations.map((item) => {

                const newItem = {
                    ...item
                };

                store.HeadersFormation.forEach((column) => {

                    if (column.includes("__")) {

                        const [code] = column.split("__");

                        newItem[code] = item[column];
                    }
                });

                return newItem;
            });

            console.log("HEADERS FORMATION :", store.HeadersFormation);
            console.log("DATA FORMATION :", list_formation.value);
        };



        // ── Lifecycle ──────────────────────────────────────────
        onBeforeMount(async () => {
            await fetchClient();

            const name_server = localStorage.getItem("name_server");
            if (name_server === "SIMUL221") {
                ip_server.value = "192.168.130.221";
            } else if (name_server === "SIMUL220") {
                ip_server.value = "192.168.130.220";
            } else if (name_server === "OPHAM") {
                ip_server.value = "192.168.130.2";
            } else {
                ip_server.value = name_server || "Inconnu";
            }
        });

        onMounted(async () => {
            // Chargement des départements et postes
            const { fetchDepartementPostes } = useDemande();
            await fetchDepartementPostes();

            departements.value = useDemande().donnesdemande;

            // Chargement initial de la liste complète (sans filtre département/poste)
            await store.fetchListParams(null, null);
            list.value = store.listparams;

            await store.fetchListParamsFormation(null, null);
            list_formation.value = store.listparamsFormations.map((item) => {

                const newItem = {
                    ...item
                };

                store.HeadersFormation.forEach((column) => {

                    if (column.includes("__")) {

                        const [code] = column.split("__");

                        newItem[code] = item[column];
                    }
                });

                return newItem;
            });

            // console.log("HEADERS FORMATION :", store.HeadersFormation);
            // console.log("DATA FORMATION :", list_formation.value);

        });



        const checkboxKeys = [
            "ascoma_assurance", "casier_casier",
            "blouse_epi", "casque_epi", "chaussure_epi", "combinaison_epi",
            "doudoune_epi", "gant_epi", "gilet_epi", "impermeable_epi",
            "laptop_mat_info", "pc_bureau_mat_info", "tablette_mat_info",
            "carte_carburant_roulant", "moto_roulant", "vehicule_roulant",
            "appel_telephonique", "data_telephonique", "poste_telephonique",
        ];


        const modifications = ref([]);

        const modifications_formation = ref([]);

        const onCheckboxChange = ({ item, key, value }) => {
            const existing = modifications.value.find(
                (m) => m.code_departement === item.code_departement &&
                    m.code_poste === item.code_poste &&
                    m.champ === key
            );
            if (existing) {
                existing.valeur = value;
            } else {
                modifications.value.push({
                    code_departement: item.code_departement,
                    code_poste: item.code_poste,
                    champ: key,
                    valeur: value,
                });
            }
        };

        const headerMapping = computed(() => {
            const map = {};

            headers.forEach(header => {
                if (header.children) {
                    header.children.forEach(child => {
                        map[child.key] = {
                            categorie: header.title
                                .trim()
                                .toUpperCase()
                                .replace(/\s+/g, '_'),

                            materiel: child.title
                                .trim()
                                .toUpperCase()
                                .replace(/\s+/g, '_')
                        };
                    });
                }
            });

            return map;
        });

        const handleCheckboxChange = ({ item, key, value }) => {

            const info = headerMapping.value[key] || {};

            const payload = {
                dep: item.dep,
                code_poste: item.code_poste,

                categorie: info.categorie,
                materiel: info.materiel,

                champ: key,
                valeur: value
            };

            const index = modifications.value.findIndex(
                m =>
                    m.dep === payload.dep &&
                    m.code_poste === payload.code_poste &&
                    m.champ === payload.champ
            );

            if (index >= 0) {
                modifications.value[index] = payload;
            } else {
                modifications.value.push(payload);
            }

            // console.log("UPDATE =>", payload);
            // console.log("MODIFICATIONS =>", modifications.value);
        };


        const enregistrer = async () => {
            console.log("A enregistrer :", modifications.value);

            if (modifications.value.length === 0) {
                Swal.fire({
                    toast: true,
                    position: "top",
                    icon: "info",
                    title: "Aucune modification à enregistrer",
                    showConfirmButton: false,
                    timer: 2000,
                });
                return;
            }

            try {
                const insertList = modifications.value.filter(m => m.valeur === 1);
                const deleteList = modifications.value.filter(m => m.valeur === 0);

                // console.log("INSERT =>", insertList);
                // console.log("DELETE =>", deleteList);

                // Exécute les suppressions
                if (deleteList.length > 0) {
                    await store.deleteParams(deleteList);
                }

                // Exécute les insertions
                if (insertList.length > 0) {
                    await store.insertParams(insertList);
                }

                modifications.value = [];

                Swal.fire({
                    toast: true,
                    position: "top",
                    icon: "success",
                    title: "Modification effectuée",
                    showConfirmButton: false,
                    timer: 2000,
                });

            } catch (error) {
                console.error(error);

                Swal.fire({
                    toast: true,
                    position: "top",
                    icon: "error",
                    title: "Erreur lors de l'enregistrement",
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        };


        /*   const headers_formation = [
               { title: "DEPARTEMENT", align: "start", key: "nom_dep", sortable: false, width: "150px" },
               { title: "POSTE", align: "start", key: "nom_poste", sortable: false },
               { title: "FORMATION PHARM M1", align: "start", key: "formation_pharm_m1", sortable: false },
               { title: "FORMATION PHARM M2", align: "start", key: "formation_pharm_m2", sortable: false },
               { title: "FORMATION PHARM M3", align: "start", key: "formation_pharm_m3", sortable: false },
               { title: "FORMATION PHARM M4", align: "start", key: "formation_pharm_m4", sortable: false },
               { title: "FORMATION PHARM M5", align: "start", key: "formation_pharm_m5", sortable: false },
               { title: "FORMATION PHARM M6", align: "start", key: "formation_pharm_m6", sortable: false },
               { title: "FORMATION PHARM M7", align: "start", key: "formation_pharm_m7", sortable: false },
   
           ]; */


        // const headers_formation = computed(() => {

        //     if (
        //         !store.HeadersFormation ||
        //         store.HeadersFormation.length === 0
        //     ) {
        //         return [];
        //     }

        //     return store.HeadersFormation.map((column) => {

        //         if (column.includes("__")) {

        //             const [code, titre] = column.split("__");

        //             return {
        //                 title: titre,
        //                 align: "center",
        //                 key: code,
        //                 sortable: false,
        //             };
        //         }

        //         return {
        //             title: column,
        //             align: "start",
        //             key: column,
        //             sortable: false,
        //         };
        //     });
        // });

        const headers_formation = computed(() => {

            if (
                !store.HeadersFormation ||
                store.HeadersFormation.length === 0
            ) {
                return [];
            }

            return store.HeadersFormation
                .filter(column =>
                    column !== "DEP" &&
                    column !== "CODE_POSTE"
                )
                .map((column) => {

                    if (column.includes("__")) {

                        const [code, titre] = column.split("__");

                        return {
                            title: titre,
                            align: "center",
                            key: code,
                            sortable: false,
                        };
                    }

                    return {
                        title: column,
                        align: "start",
                        key: column,
                        sortable: false,
                    };
                });
        });

        const checkboxKeysFormation = computed(() => {

            if (
                !store.HeadersFormation ||
                store.HeadersFormation.length === 0
            ) {
                return [];
            }

            return store.HeadersFormation
                .filter(column => column.includes("__"))
                .map(column => column.split("__")[0]);
        });


        const handleFormationCheckboxChange = ({ item, key, value }) => {

            const codeFormation = key;

            const payload = {
                dep: item.DEP,
                code_poste: item.CODE_POSTE,
                champ: codeFormation,
                valeur: value
            };

            console.log("PAYLOAD FORMATION :", payload);

            const index = modifications_formation.value.findIndex(
                m =>
                    m.dep === payload.dep &&
                    m.code_poste === payload.code_poste &&
                    m.champ === payload.champ
            );

            if (index >= 0) {
                modifications_formation.value[index] = payload;
            } else {
                modifications_formation.value.push(payload);
            }
        };


        const enregistrer_formation = async () => {

            console.log(
                "A enregistrer FORMATION :",
                modifications_formation.value
            );

            if (modifications_formation.value.length === 0) {
                Swal.fire({
                    toast: true,
                    position: "top",
                    icon: "info",
                    title: "Aucune modification à enregistrer",
                    showConfirmButton: false,
                    timer: 2000,
                });
                return;
            }

            try {

                const insertList = modifications_formation.value.filter(
                    m => m.valeur === 1
                );

                const deleteList = modifications_formation.value.filter(
                    m => m.valeur === 0
                );

                // console.log("FORMATION INSERT =>", insertList);
                // console.log("FORMATION DELETE =>", deleteList);

                // Exécute les suppressions
                if (deleteList.length > 0) {
                    await store.deleteParamsFormation(deleteList);
                }

                // Exécute les insertions
                if (insertList.length > 0) {
                    await store.insertParamsFormation(insertList);
                }

                modifications_formation.value = [];

                Swal.fire({
                    toast: true,
                    position: "top",
                    icon: "success",
                    title: "Modification effectuée",
                    showConfirmButton: false,
                    timer: 2000,
                });

            } catch (error) {

                console.error(error);

                Swal.fire({
                    toast: true,
                    position: "top",
                    icon: "error",
                    title: "Erreur lors de l'enregistrement",
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        };



        // // Onglet précédent
        // const previousTab = ref("outil");

        // // Surveillance du changement d'onglet
        // watch(tab, async (newTab, oldTab) => {

        //     // Pas de changement réel
        //     if (newTab === oldTab) {
        //         return;
        //     }

        //     // Passage de Outil → Formation
        //     if (
        //         oldTab === "outil" &&
        //         newTab === "formation" &&
        //         modifications.value.length > 0
        //     ) {
        //         const result = await Swal.fire({
        //             icon: "warning",
        //             title: "Modifications non enregistrées",
        //             text: "Vous avez des modifications non enregistrées dans l'onglet Outil.",
        //             showCancelButton: true,
        //             confirmButtonText: "Continuer",
        //             cancelButtonText: "Rester sur Outil",
        //             reverseButtons: true,
        //         });

        //         if (!result.isConfirmed) {
        //             // Retour à l'ancien onglet
        //             tab.value = "outil";
        //             return;
        //         }
        //     }

        //     // Passage de Formation → Outil
        //     if (
        //         oldTab === "formation" &&
        //         newTab === "outil" &&
        //         modifications_formation.value.length > 0
        //     ) {
        //         const result = await Swal.fire({
        //             icon: "warning",
        //             title: "Modifications non enregistrées",
        //             text: "Vous avez des modifications non enregistrées dans l'onglet Formation.",
        //             showCancelButton: true,
        //             confirmButtonText: "Continuer",
        //             cancelButtonText: "Rester sur Formation",
        //             reverseButtons: true,
        //         });

        //         if (!result.isConfirmed) {
        //             tab.value = "formation";
        //             return;
        //         }
        //     }

        //     previousTab.value = newTab;
        // });

        // const actualiserListes = async () => {

        //     const departementCode =
        //         form.DEMANDE_DEPARTEMENT && form.DEMANDE_DEPARTEMENT !== ""
        //             ? form.DEMANDE_DEPARTEMENT
        //             : null;

        //     const posteCode =
        //         form.DEMANDE_POSTE && form.DEMANDE_POSTE !== ""
        //             ? form.DEMANDE_POSTE
        //             : null;

        //     try {

        //         // Actualiser Outil
        //         await store.fetchListParams(departementCode, posteCode);
        //         list.value = store.listparams;

        //         // Actualiser Formation
        //         await store.fetchListParamsFormation(departementCode, posteCode);

        //         list_formation.value = store.listparamsFormations.map((item) => {

        //             const newItem = {
        //                 ...item
        //             };

        //             store.HeadersFormation.forEach((column) => {

        //                 if (column.includes("__")) {

        //                     const [code] = column.split("__");

        //                     newItem[code] = item[column];
        //                 }
        //             });

        //             return newItem;
        //         });

        //         console.log("Actualisation après changement d'onglet");
        //         console.log("ONGLET :", tab.value);

        //     } catch (error) {

        //         console.error("Erreur lors de l'actualisation :", error);

        //     }
        // };

        // watch(tab, async (newTab, oldTab) => {

        //     if (newTab === oldTab) {
        //         return;
        //     }

        //     console.log(`Changement d'onglet : ${oldTab} → ${newTab}`);

        //     await actualiserListes();
        // });


        return {
            form, errors, departements, postesFiltrees, onDepartementChange, isOnline, user, loading, list, list_formation, totalList, headers, client, clientCode, isSaving, ip_server,
            rechercher, enregistrer, fetchClient, onCheckboxChange, handleCheckboxChange, tab,
            headers_formation, enregistrer_formation, checkboxKeysFormation, handleFormationCheckboxChange, modifications_formation,
            // previousTab,
        };
    },
});
</script>

<style scoped>
.space0 {
    width: 100px;
    margin-left: 50px;
}

.space1 {
    width: 150px;
    margin-left: 150px;
}

.spaceCde {
    margin-left: 2em;
}

.blur-effect {
    filter: blur(5px);
    pointer-events: none;
    user-select: none;
}

.my-table-params thead th {
    text-align: left !important;
}

.my-table-params tbody td {
    text-align: left !important;
}

.table-scroll {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
}

/* EPI : titre + sous-colonnes */
:deep(thead tr:nth-child(1) th:nth-child(5)),
:deep(thead tr:nth-child(2) th:nth-child(-n+8)) {
    background-color: #FFB74D !important;
    color: #fff;
}

/* MAT INFO : titre + sous-colonnes */
:deep(thead tr:nth-child(1) th:nth-child(6)),
:deep(thead tr:nth-child(2) th:nth-child(n+9):nth-child(-n+11)) {
    background-color: #4CAF50 !important;
    color: #fff;
}

/* ROULANT : titre + sous-colonnes */
:deep(thead tr:nth-child(1) th:nth-child(7)),
:deep(thead tr:nth-child(2) th:nth-child(n+12):nth-child(-n+14)) {
    background-color: #2196F3 !important;
    color: #fff;
}

/* TELEPHONIQUE : titre + sous-colonnes */
:deep(thead tr:nth-child(1) th:nth-child(8)),
:deep(thead tr:nth-child(2) th:nth-child(n+15)) {
    background-color: #45b027 !important;
    color: #fff;
}


.custom-tabs1 {
    background-color: #f18b604c !important;
}

.custom-tabs1 :deep(.v-tab) {
    color: #263238 !important;
}

.custom-tabs1 :deep(.v-tab--selected) {
    color: #512da8 !important;
}

.custom-tabs1 :deep(.v-tabs__slider) {
    background-color: #512da8 !important;
}

.custom-tabs1 {
    max-width: 450px;
    display: flex;
    justify-content: left;
}

.custom-tabs1 :deep(.v-tab + .v-tab) {
    border-left: 1px solid #bdbdbd;
}

.custom-tabs1 :deep(.v-tab--selected) {
    background-color: #f49c70 !important;
    color: #512da8 !important;
    font-weight: 600;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}
</style>