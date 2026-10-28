<template>
    <!-- <v-app>
        <v-main style="--v-layout-top: 10px" app> -->

    <v-row density="compact" align="center" justify="start" class="px-3" no-gutters style="padding-top: 0px;">
        <v-row align="center">
            <v-col cols="12" md="2">
                <v-text-field v-model="recherche" clearable label="Rechercher" variant="underlined" density="compact" />
            </v-col>

            <!-- Bouton à droite -->
            <v-col cols="12" md="10" class="d-flex justify-end">
                <v-btn color="primary" prepend-icon="mdi-account-plus" density="compact" @click="ajouterEmploye">
                    Ajout employé
                </v-btn>
            </v-col>
        </v-row>

        <!-- <v-dialog v-model="dialogAddEmploye" max-width="700px" max-height="690px" persistent>
            <v-card>
                <v-card-text>
                    <addEmploye @saved="handleSaved" @cancel="closedAddEmploye" />
                </v-card-text>
            </v-card>
        </v-dialog> -->

        <v-dialog v-model="dialogAddEmploye" max-width="700px" max-height="690px" persistent>
            <v-card>
                <v-card-text>
                    <!-- <addEmploye :employe="employeEnEdition" @saved="handleSaved" @cancel="closedAddEmploye" /> -->
                    <addEmploye v-if="dialogAddEmploye"
                        :key="employeEnEdition ? employeEnEdition.empl_matricule : 'new'" :employe="employeEnEdition"
                        :employees="employees" @saved="handleSaved" @cancel="closedAddEmploye" />
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- <div v-if="list.length" class="table-scroll">

                    <Tableau :headers="headers" :items="list" :checkbox-keys="checkboxKeys"
                        @checkbox-change="handleCheckboxChange" />
                </div> -->

        <div class="table-scroll">
            <v-progress-linear v-if="loading" color="#263238" rounded indeterminate height="2" />
            <!-- <Tableau :headers="headers" :items="list" action1="AJOUTER" @action1Item="addMatricule" /> -->
            <Tableau :employees="employees" :headers="headers" :items="listFiltree" action1="AJOUTER"
                @action1Item="addMatricule" @editItem="modifierEmploye" @deleteItem="supprimerEmploye"
                @actionDetail="showDetail" />
        </div>


        <v-dialog v-if="dialogVisibleAdd" v-model="dialogVisibleAdd" :persistent="true" width="390px" height="250px">

            <matricule v-if="dialogVisibleAdd" :nom="empl_nom" :prenom="empl_prenom" @annuler="onAnnulerAddMatricule"
                @save="onSave" />
        </v-dialog>

        <v-dialog v-if="dialogVisibleDetailEmploye" v-model="dialogVisibleDetailEmploye" :persistent="true"
            width="1590px" height="700px">

            <DetailEmploye v-if="selectedEmploye" :recru="selectedEmploye" @close="fermerDialog" />
        </v-dialog>

    </v-row>

    <div class="pa-2">
        <!-- <div v-if="list.length" class="text-right mt-3">
                    <v-btn color="success" variant="elevated" @click="enregistrer" density="compact">
                        Enregistrer
                    </v-btn>
                </div> -->
    </div>

    <!-- </v-main>
    </v-app> -->
</template>

<script>
import { defineComponent, ref, reactive, computed, watch, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useOnline } from "@vueuse/core";
import { useParamStore } from "@/store/Rh/rh_params";
import { useEmployeeStore } from "@/store/Rh/rh_employee";
import { useClientStore } from "@/store/utils/client.js";
import { useDemande } from "@/store/Rh/rh_demande";
import useSessionTimeout from "@/utils/useSessionTimeout";
import Config from "@/utils/config.js";
import Swal from "sweetalert2";
import Tableau from "@/components/rh/tableauEmploye.vue";
import matricule from '@/views/rh/add_matricule.vue';

import addEmploye from "@/views/rh/add_employe.vue";
import DetailEmploye from "@/views/rh/detailEmploye.vue";

export default defineComponent({
    name: "NouveauFichier",

    components: {
        Tableau,
        matricule,
        addEmploye,
        DetailEmploye,
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
        const store = useEmployeeStore();
        const storeClient = useClientStore();
        const loading = computed(() => store.loading);

        const employees = computed(() => store.listemployes);

        useSessionTimeout(Config.DURRE_SESSION, router);

        // const recherche = ref("");
        // const list_employe = ref([]);

        // ── Département / Poste ─────
        const departements = ref([]);
        const postesFiltrees = ref([]);

        const recherche = ref('')


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

        // ── Liste / Recherche ─────────────────
        const list = ref([]);
        const client = ref([]);
        const clientCode = ref("");
        const ip_server = ref("");
        const isSaving = ref(false);



        const headers = [
            // { title: "CODE", align: "start", key: "empl_code", sortable: false, width: "150px" },
            { title: "MATRICULE", align: "start", key: "empl_matricule", sortable: false },
            { title: "NOM", align: "start", key: "empl_nom", sortable: false },
            { title: "PRENOM", align: "start", key: "empl_prenom", sortable: false },
            { title: "DATE DE NAISSANCE", align: "center", key: "empl_date_naiss", sortable: false },
            { title: "DEPARTEMENT", align: "start", key: "lib_dep", sortable: false },
            { title: "POSTE", align: "start", key: "poste_libelle", sortable: false },
            { title: "PRISE DE FONCTION", align: "center", key: "empl_prise_fonction", sortable: false },
            { title: "CONTRAT", align: "center", key: "empl_contrat", sortable: false },
            { title: "DATE FIN D'ESSAI ", align: "center", key: "empl_date_fin_essai1", sortable: false },
            { title: "ETAT", align: "start", key: "empl_etat", sortable: false },
            { title: "ACTIONS", align: "start", key: "action", sortable: false },

        ];


        const totalList = computed(() => list.value.length);
        // Filtre "tout le tableau" en instantané
        const listFiltree = computed(() => {
            let resultat = [...list.value];

            // Filtre texte libre
            if (recherche.value && recherche.value.trim() !== "") {
                const terme = recherche.value.toLowerCase().trim();

                resultat = resultat.filter((item) =>
                    Object.values(item).some((valeur) =>
                        valeur !== null &&
                        valeur !== undefined &&
                        String(valeur).toLowerCase().includes(terme)
                    )
                );
            }

            return resultat;
        });

        const rechercher = async () => {
            const departementCode = form.DEMANDE_DEPARTEMENT || null;
            const posteCode = form.DEMANDE_POSTE || null;

            await store.fetchListParams(departementCode, posteCode);

            list.value = store.listemployes;
        };


        // ── Lifecycle ──────────────────────────────────────────
        onBeforeMount(async () => {

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

            // Chargement initial de la liste complète (sans filtre)
            await store.fetchListEmployes();
            list.value = store.listemployes;
        });

        const modifications = ref([]);

        const code_empl = ref();
        const code_cv = ref();
        const code_recr = ref();
        const empl_nom = ref();
        const empl_prenom = ref();


        const dialogVisibleAdd = ref(false);

        const addMatricule = async (item) => {
            code_empl.value = item.empl_code;
            code_cv.value = item.empl_code_cv;
            code_recr.value = item.empl_code_recr;
            empl_nom.value = item.empl_nom;
            empl_prenom.value = item.empl_prenom;

            dialogVisibleAdd.value = true;
        }

        const onAnnulerAddMatricule = async () => {
            dialogVisibleAdd.value = false;

            await store.fetchListEmployes();
            list.value = store.listemployes;
        };


        const onSave = async (matricule) => {
            // console.log(matricule);
            // console.log(code_empl.value)
            // console.log(code_cv.value)

            if (!matricule || matricule.toString().trim() === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Veuillez saisir un matricule.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer);
                        toast.addEventListener('mouseleave', Swal.resumeTimer);
                    }
                });

                return;
            }

            // Appel de ton store
            try {
                // Appel du store avec les bons paramètres
                await store.updateMatricule(matricule, code_empl.value, code_cv.value);

                dialogVisibleAdd.value = false;

                await store.fetchListEmployes();
                list.value = store.listemployes;

            } catch (err) {
                console.error("Erreur lors de la mise à jour de la sélection :", err);
            }

        };


        const dialogAddEmploye = ref(false);

        const employeEnEdition = ref(null);

        async function ajouterEmploye() {
            employeEnEdition.value = null;

            dialogAddEmploye.value = true;
        }

        const closedAddEmploye = () => {
            dialogAddEmploye.value = false;
        };

        // const handleSaved = async (employe) => {
        //     console.log("Employé reçu :", employe);
        //     await store.insertEmploye(employe);
        //     dialogAddEmploye.value = false;
        //     await store.fetchListEmployes();
        //     list.value = store.listemployes;
        // };

        const handleSaved = async (employe) => {

            console.log("Employé reçu :", employe);

            try {

                if (employeEnEdition.value) {

                    // =========================
                    // MODIFICATION
                    // =========================

                    await store.updateEmploye(employeEnEdition.value.empl_code, employe);

                } else {

                    // =========================
                    // AJOUT
                    // =========================

                    await store.insertEmploye(employe);
                }

                dialogAddEmploye.value = false;

                employeEnEdition.value = null;

                await store.fetchListEmployes();

                list.value = store.listemployes;

            } catch (error) {

                console.error(
                    "Erreur lors de l'enregistrement de l'employé :",
                    error
                );

            }
        };

        // const modifierEmploye = (item) => {

        //     console.log("Employé à modifier :", item);

        //     employeEnEdition.value = {
        //         ...item
        //     };

        //     dialogAddEmploye.value = true;
        // };

        const modifierEmploye = (item) => {
            employeEnEdition.value = { ...item };

            dialogAddEmploye.value = true;
        };

        const supprimerEmploye = async (item) => {
            console.log("Employé à supprimer :", item);

            const result = await Swal.fire({
                title: `Voulez-vous vraiment supprimer ${item.empl_nom} ${item.empl_prenom} ?`,

                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Supprimer",
                cancelButtonText: "Annuler",
                confirmButtonColor: "#d33",
                cancelButtonColor: "#6c757d",

                customClass: {
                    confirmButton: "btn-supprimer",
                    cancelButton: "btn-annuler"
                }
            });

            if (!result.isConfirmed) {
                return;
            }

            try {
                loading.value = true;

                // Appel du store
                await store.deleteEmploye(item.empl_matricule);

                // Actualiser la liste
                await store.fetchListEmployes();
                list.value = store.listemployes;

                await Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                }).fire({
                    icon: "success",
                    title: "Employé supprimé avec succès !",
                    background: "#d1fae5",
                    color: "#065f46"
                });

            } catch (error) {
                console.error("Erreur lors de la suppression de l'employé :", error);

                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Impossible de supprimer l'employé.",
                });
            } finally {
                loading.value = false;
            }
        };

        const selectedEmploye = ref(null);
        const dialogVisibleDetailEmploye = ref(false);

        const fermerDialog = async () => {
            dialogVisibleDetailEmploye.value = false;
            await store.fetchListEmployes();
        };

        const showDetail = (item) => {
            selectedEmploye.value = item;
            // console.log(selectedEmploye.value)
            dialogVisibleDetailEmploye.value = true;
        };

        return {
            form, errors, departements, postesFiltrees, onDepartementChange, isOnline, user, loading, list, totalList, headers, client, clientCode, isSaving, ip_server,
            rechercher, recherche, listFiltree,
            addMatricule, code_empl, code_cv, code_recr, empl_nom, empl_prenom, onAnnulerAddMatricule, dialogVisibleAdd,
            onSave, employees,
            ajouterEmploye, dialogAddEmploye, closedAddEmploye, handleSaved,
            modifierEmploye,
            employeEnEdition, supprimerEmploye,
            showDetail,
            selectedEmploye,
            dialogVisibleDetailEmploye, fermerDialog,
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

:global(.btn-supprimer),
:global(.btn-annuler) {
    color: #fff !important;
}
</style>