<template>
    <v-card>

        <!-- TITRE -->
        <v-card-title class="d-flex align-center px-5 py-3">
            <v-icon color="primary" class="mr-2">
                {{ employe ? "mdi-account-edit" : "mdi-account-plus" }}
            </v-icon>

            <span class="text-h6">
                {{ employe ? "Modifier l'employé" : "Ajouter un employé" }}
            </span>

        </v-card-title>

        <v-divider />

        <v-card-text class="px-5 py-4">

            <v-form ref="formRef">

                <v-row dense>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.empl_matricule" label="Matricule" variant="outlined"
                            density="compact" prepend-inner-icon="mdi-card-account-details"
                            :rules="[rules.required, rules.numeric]" clearable @keydown="onlyNumbers" />
                    </v-col>

                    <!-- NOM -->
                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.empl_nom" label="Nom" variant="outlined" density="compact"
                            :rules="[rules.required]" clearable />
                    </v-col>

                    <!-- PRENOM -->
                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.empl_prenom" label="Prénom" variant="outlined" density="compact"
                            :rules="[rules.required]" clearable />
                    </v-col>

                    <!-- DATE DE NAISSANCE -->
                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.empl_date_naiss" label="Date de naissance" type="date"
                            variant="outlined" density="compact" :rules="[rules.required]" />
                    </v-col>

                    <!-- DEPARTEMENT -->
                    <v-col cols="12" md="6">
                        <v-select v-model="form.empl_departement" :items="departements" item-title="lib_departement"
                            item-value="code_departement" label="Département" variant="outlined" density="compact"
                            prepend-inner-icon="mdi-domain" :rules="[rules.required]" clearable
                            @update:model-value="onDepartementChange" />
                    </v-col>

                    <!-- POSTE -->
                    <v-col cols="12" md="6">
                        <v-select v-model="form.empl_poste" :items="postesFiltrees" :item-title="getPosteLabel"
                            item-value="code_poste" label="Poste" variant="outlined" density="compact"
                            prepend-inner-icon="mdi-briefcase" :disabled="!form.empl_departement"
                            :rules="[rules.required]" clearable />
                    </v-col>

                    <!-- CONTRAT -->
                    <v-col cols="12" md="6">
                        <v-select v-model="form.empl_contrat" :items="contrats" label="Contrat" variant="outlined"
                            density="compact" prepend-inner-icon="mdi-file-document" :rules="[rules.required]"
                            clearable />
                    </v-col>

                    <!-- PRISE DE FONCTION -->
                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.empl_prise_fonction" label="Prise de fonction" type="date"
                            variant="outlined" density="compact" prepend-inner-icon="mdi-calendar-check"
                            :rules="[rules.required]" />
                    </v-col>

                    <!-- DATE FIN ESSAI 1 -->
                    <v-col cols="12" md="6">
                        <v-text-field v-model="form.empl_date_fin_essai1" label="Date fin d'essai" type="date"
                            variant="outlined" density="compact" prepend-inner-icon="mdi-calendar-clock" />
                    </v-col>

                    <!-- DATE FIN ESSAI 2 -->
                    <!-- <v-col cols="12" md="6">
                        <v-text-field v-model="form.empl_date_fin_essai2" label="Date fin d'essai 2" type="date"
                            variant="outlined" density="compact" prepend-inner-icon="mdi-calendar-clock" />
                    </v-col> -->

                </v-row>

            </v-form>

        </v-card-text>

        <v-divider />

        <!-- BOUTONS -->
        <v-card-actions class="px-5 py-3">

            <v-spacer />

            <v-btn variant="outlined" color="grey-darken-1" prepend-icon="mdi-close" @click="annuler">
                Annuler
            </v-btn>

            <v-btn color="primary" variant="elevated" :prepend-icon="employe ? 'mdi-pencil' : 'mdi-content-save'"
                :loading="loading" @click="enregistrer">
                {{ employe ? "Modifier" : "Enregistrer" }}
            </v-btn>

        </v-card-actions>

    </v-card>
</template>


<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { useDemande } from "@/store/Rh/rh_demande";
import dayjs from "dayjs";
import swal from "sweetalert2";


export default defineComponent({

    name: "AddEmploye",

    props: {
        employe: {
            type: Object,
            default: null
        },

        employees: {
            type: Array,
            default: () => []
        }
    },

    emits: [
        "saved",
        "cancel"
    ],

    setup(props, { emit }) {

        const formRef = ref(null);

        const loading = ref(false);

        const departements = ref([]);

        const postesFiltrees = ref([]);


        // ─────────────────────────────────────
        // FORMULAIRE
        // ─────────────────────────────────────

        const form = reactive({

            empl_matricule: "",

            empl_nom: "",

            empl_prenom: "",

            empl_date_naiss: "",

            empl_departement: null,

            empl_poste: null,

            empl_prise_fonction: "",

            empl_contrat: null,

            empl_date_fin_essai1: "",

            empl_date_fin_essai2: "",

        });


        // ─────────────────────────────────────
        // CONTRATS
        // ─────────────────────────────────────

        const contrats = [
            "CDI",
            "CDD",
            "STAGE",
        ];


        // ─────────────────────────────────────
        // VALIDATION
        // ─────────────────────────────────────

        const rules = {

            required: (value) => {

                if (
                    value === null ||
                    value === undefined ||
                    value === ""
                ) {
                    return "Ce champ est obligatoire";
                }

                return true;
            },
            numeric: (value) => {
                if (!value) {
                    return true;
                }

                return /^\d+$/.test(value)
                    || "Le matricule doit contenir uniquement des chiffres";
            }

        };


        // ─────────────────────────────────────
        // LABEL DEPARTEMENT
        // ─────────────────────────────────────

        const getDepartementLabel = (item) => {

            if (!item) {
                return "";
            }

            return (
                item.lib_dep ||
                item.libelle_departement ||
                item.nom_departement ||
                item.departement ||
                item.code_departement
            );
        };


        // ─────────────────────────────────────
        // LABEL POSTE
        // ─────────────────────────────────────

        const getPosteLabel = (item) => {

            if (!item) {
                return "";
            }

            return (
                item.poste_libelle ||
                item.libelle_poste ||
                item.nom_poste ||
                item.poste ||
                item.code_poste
            );
        };


        // ─────────────────────────────────────
        // CHANGEMENT DEPARTEMENT
        // ─────────────────────────────────────

        const onDepartementChange = (codeDep) => {

            const dep = departements.value.find(
                (d) => d.code_departement === codeDep
            );

            postesFiltrees.value = dep
                ? dep.postes || []
                : [];

            form.empl_poste = null;
        };

        //         const onDepartementChange = (libelleDep) => {

        //     const dep = departements.value.find(
        //         (d) => d.lib_departement === libelleDep
        //     );

        //     postesFiltrees.value = dep
        //         ? dep.postes || []
        //         : [];

        //     form.empl_poste = null;
        // };


        // ─────────────────────────────────────
        // ANNULER
        // ─────────────────────────────────────

        const annuler = () => {

            emit("cancel");

        };


        // ─────────────────────────────────────
        // ENREGISTRER
        // ─────────────────────────────────────

        // const enregistrer = async () => {

        //     const result = await formRef.value.validate();

        //     if (!result.valid) {
        //         return;
        //     }

        //     try {

        //         loading.value = true;

        //         console.log(
        //             "Employé à enregistrer :",
        //             form
        //         );
        //         emit("saved", {
        //             ...form
        //         });

        //     } catch (error) {

        //         console.error(
        //             "Erreur lors de l'enregistrement de l'employé :",
        //             error
        //         );

        //     } finally {

        //         loading.value = false;

        //     }

        // };

        const enregistrer = async () => {

            const result = await formRef.value.validate();

            if (!result.valid) {
                return;
            }

            const matricule = String(form.empl_matricule).trim();

            const matriculeExiste = props.employees.some((emp) => {

                const matriculeExistant = String(emp.empl_matricule).trim();

                // En modification, on ignore son propre matricule
                if (
                    props.employe &&
                    String(emp.empl_matricule).trim() ===
                    String(props.employe.empl_matricule).trim()
                ) {
                    return false;
                }

                return matriculeExistant === matricule;
            });

            if (matriculeExiste) {

                swal.fire({
                    icon: "warning",
                    title: "Matricule déjà existant",
                    text: `Le matricule ${matricule} existe déjà dans la liste des employés.`,
                    confirmButtonText: "OK"
                });

                return;
            }

            try {

                loading.value = true;

                // Préparation des données avant envoi
                const employe = {
                    ...form,

                    // Dates facultatives :
                    // "" devient null
                    empl_date_fin_essai1:
                        form.empl_date_fin_essai1 || null,

                    empl_date_fin_essai2:
                        form.empl_date_fin_essai2 || null,
                };

                console.log(
                    "Employé à enregistrer :",
                    employe
                );

                emit("saved", employe);

            } catch (error) {

                console.error(
                    "Erreur lors de l'enregistrement de l'employé :",
                    error
                );

            } finally {

                loading.value = false;

            }
        };


        // ─────────────────────────────────────
        // CHARGEMENT DEPARTEMENTS
        // ─────────────────────────────────────

        // onMounted(async () => {

        //     const {
        //         fetchDepartementPostes
        //     } = useDemande();

        //     await fetchDepartementPostes();

        //     departements.value =
        //         useDemande().donnesdemande;

        // });

        onMounted(async () => {



            if (props.employe) {
                // console.log("[onMounted] appel chargerEmploye() AVANT fetch départements");
                chargerEmploye(props.employe);
                // console.log("[onMounted] form APRES 1er chargerEmploye =", JSON.stringify(form));
            } else {
                // console.log("[onMounted] props.employe est null/undefined, rien à charger");
            }

            try {

                const { fetchDepartementPostes } = useDemande();
                await fetchDepartementPostes();

                departements.value = useDemande().donnesdemande;
                if (props.employe) {
                    chargerEmploye(props.employe);
                }
            } catch (error) {
                // console.error("[onMounted] Erreur lors du chargement des départements :", error);
            }

        });

        const onlyNumbers = (event) => {
            // Autoriser : chiffres, Backspace, Delete, Tab,
            // flèches gauche/droite, Home, End
            const allowedKeys = [
                "Backspace",
                "Delete",
                "Tab",
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
                "Home",
                "End"
            ];

            if (
                allowedKeys.includes(event.key) ||
                event.ctrlKey ||
                event.metaKey
            ) {
                return;
            }

            // Bloquer tout ce qui n'est pas un chiffre
            if (!/^[0-9]$/.test(event.key)) {
                event.preventDefault();
            }
        };


        // const chargerEmploye = (employe) => {

        //     if (!employe) {
        //         form.empl_matricule = "";
        //         form.empl_nom = "";
        //         form.empl_prenom = "";
        //         form.empl_date_naiss = "";
        //         form.empl_departement = null;
        //         form.empl_poste = null;
        //         form.empl_prise_fonction = "";
        //         form.empl_contrat = null;
        //         form.empl_date_fin_essai1 = "";
        //         form.empl_date_fin_essai2 = "";
        //         postesFiltrees.value = [];
        //         return;
        //     }

        //     console.log("Employé à charger dans le formulaire :", employe);

        //     form.empl_matricule = employe.empl_matricule || "";
        //     form.empl_nom = employe.empl_nom || "";
        //     form.empl_prenom = employe.empl_prenom || "";

        //     form.empl_date_naiss = employe.empl_date_naiss
        //         ? dayjs(employe.empl_date_naiss).format("YYYY-MM-DD")
        //         : "";

        //     // IMPORTANT :
        //     // ton backend renvoie empl_dep
        //     form.empl_departement = employe.empl_dep || null;

        //     form.empl_poste = employe.empl_poste || null;

        //     form.empl_prise_fonction = employe.empl_prise_fonction
        //         ? dayjs(employe.empl_prise_fonction).format("YYYY-MM-DD")
        //         : "";

        //     form.empl_contrat = employe.empl_contrat || null;

        //     form.empl_date_fin_essai1 = employe.empl_date_fin_essai1
        //         ? dayjs(employe.empl_date_fin_essai1).format("YYYY-MM-DD")
        //         : "";

        //     form.empl_date_fin_essai2 = employe.empl_date_fin_essai2
        //         ? dayjs(employe.empl_date_fin_essai2).format("YYYY-MM-DD")
        //         : "";

        //     // Charger les postes du département
        //     const dep = departements.value.find(
        //         d => d.code_departement === form.empl_departement
        //     );

        //     postesFiltrees.value = dep
        //         ? dep.postes || []
        //         : [];

        //     console.log("Formulaire après chargement :", form);
        // };

        const chargerEmploye = (employe) => {

            if (!employe) {

                form.empl_matricule = "";
                form.empl_nom = "";
                form.empl_prenom = "";
                form.empl_date_naiss = "";
                form.empl_departement = null;
                form.empl_poste = null;
                form.empl_prise_fonction = "";
                form.empl_contrat = null;
                form.empl_date_fin_essai1 = "";
                form.empl_date_fin_essai2 = "";
                postesFiltrees.value = [];
                return;
            }


            form.empl_matricule = employe.empl_matricule || "";
            form.empl_nom = employe.empl_nom || "";
            form.empl_prenom = employe.empl_prenom || "";

            form.empl_date_naiss = employe.empl_date_naiss
                ? dayjs(employe.empl_date_naiss).format("YYYY-MM-DD")
                : "";

            form.empl_departement = employe.empl_dep || null;
            form.empl_poste = employe.empl_poste || null;

            form.empl_prise_fonction = employe.empl_prise_fonction
                ? dayjs(employe.empl_prise_fonction).format("YYYY-MM-DD")
                : "";

            form.empl_contrat = employe.empl_contrat || null;

            form.empl_date_fin_essai1 = employe.empl_date_fin_essai1
                ? dayjs(employe.empl_date_fin_essai1).format("YYYY-MM-DD")
                : "";

            form.empl_date_fin_essai2 = employe.empl_date_fin_essai2
                ? dayjs(employe.empl_date_fin_essai2).format("YYYY-MM-DD")
                : "";

            const dep = departements.value.find(
                d => d.code_departement === form.empl_departement
            );


            postesFiltrees.value = dep
                ? dep.postes || []
                : [];
        };

        watch(
            () => props.employe,
            (employe) => {
                // Ignore si les départements ne sont pas encore chargés
                // (onMounted s'en chargera lui-même au premier rendu)
                if (!departements.value.length) return;
                chargerEmploye(employe);
            }
            // ⚠️ retire { immediate: true }
        );


        return {
            form, formRef, loading, departements, postesFiltrees, contrats, rules,
            getDepartementLabel, getPosteLabel, onDepartementChange, annuler, enregistrer,
            onlyNumbers, chargerEmploye,

        };

    }

});
</script>


<style scoped>
.v-card-title {
    font-weight: 600;
}
</style>