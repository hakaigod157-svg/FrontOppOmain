<template>
    <v-card>
        <!-- Titre avec code recrutement et bouton fermer -->
        <v-card-title class="custom-card-dm">
            <div class="title-container">
                <div class="title-left">
                    <v-icon size="26" color="deep-purple-accent-4" class="mr-2">mdi-briefcase-account</v-icon>
                    <span class="title-text">
                        <strong>Détail de l'intégration  </strong>
                        <!-- <span class="recru-code">{{ recru.integr_code }}</span> -->
                        &nbsp;
                        <!-- <span> <u>Matricule</u> :
                            {{ (recru.empl_matricule) }}</span> -->
                    </span>
                </div>
                <v-btn icon variant="text" color="grey-darken-1" size="small" class="close-btn" @click="$emit('close')">
                    <v-icon size="22">mdi-close</v-icon>
                </v-btn>
            </div>
        </v-card-title>

        <v-divider class="my-2"></v-divider>

        <!-- Informations principales -->
        <v-card-text>
            <div class="info-principale-cards">
                <v-row dense style="gap: 0px">
                    <!-- Carte 1 : Demande -->
                    <v-col cols="3">
                        <v-card class="info-card" outlined>
                            <v-card-title class="card-title">NOM PRENOM</v-card-title>
                            <v-card-text>
                                <div class="info-row">
                                    <v-text-field label="Nom" variant="outlined" density="compact"
                                        v-model="recru.empl_nom" readonly hide-details class="readonly-field" />

                                    <v-text-field label="Prénom" variant="outlined" density="compact"
                                        v-model="recru.empl_prenom" readonly hide-details class="readonly-field" />
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Carte 2 : Contrat -->
                    <v-col cols="1">
                        <v-card class="info-card contrat-card" outlined>
                            <v-card-title class="card-title">CONTRAT</v-card-title>
                            <v-card-text>
                                <div class="info-row">
                                    <v-text-field label="Type" variant="outlined" density="compact"
                                        v-model="recru.empl_contrat" readonly hide-details class="readonly-field"
                                        style="max-width: 65px" />
                                    <!-- <v-text-field label="Motif" variant="outlined" density="compact"
                                        v-model="recru.recru_motif" readonly hide-details class="readonly-field" />
                                    <v-text-field label="Effectif" variant="outlined" density="compact"
                                        v-model="recru.recru_effectif" readonly hide-details class="readonly-field"
                                        style="max-width: 65px" /> -->
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- Carte 3 : Département -->
                    <v-col cols="3">
                        <v-card class="info-card departement-card" outlined>
                            <v-card-title class="card-title" style="justify-content: right">
                                DEPARTEMENT</v-card-title>
                            <v-card-text>
                                <div class="info-row">
                                    <v-text-field label="Département" variant="outlined" density="compact"
                                        v-model="recru.lib_dep" readonly hide-details class="readonly-field"
                                        style="min-width: 50px" />

                                    <v-text-field label="Poste" variant="outlined" density="compact"
                                        :model-value="recru.poste_libelle" readonly hide-details class="readonly-field"
                                        @click="expandedPoste = !expandedPoste" />
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>



                    <v-col cols="3" style="margin-left: 130px;">
                        <v-card class="info-card" outlined>
                            <v-card-title class="card-title">DATE</v-card-title>
                            <v-card-text>
                                <div class="info-row">

                                    <v-text-field label="Prise de fonction" variant="outlined" density="compact"
                                        :model-value="formatDate(recru.empl_prise_fonction)" readonly hide-details
                                        class="readonly-field" />

                                    <v-text-field label="Date fin essai" variant="outlined" density="compact"
                                        :model-value="formatDate(recru.empl_date_fin_essai1)" readonly hide-details
                                        class="readonly-field" />

                                    <!-- <v-text-field label="Date fin essai 2" variant="outlined" density="compact"
                                        :model-value="formatDate(recru.empl_date_fin_essai2)" readonly hide-details
                                        class="readonly-field" /> -->

                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </div>

            <v-divider class="my-2"></v-divider>

            <!-- Onglets centrés et taille adaptée -->
            <v-toolbar :elevation="1" density="compact" color="#d7ead5">
                <v-tabs v-model="tab" color="deep-purple-accent-4" background-color="#d7ead5" class="custom-tabs1" grow
                    density="compact" slider-color="deep-purple-accent-4">
                    <v-tab value="etape">ETAPE</v-tab>
                    <v-tab value="formation">FORMATION A L'EMBAUCHE</v-tab>
                        <!-- <v-badge :content="list_offre.length" color="#FF8A65" inline /> -->
                    <v-tab value="mat_disp">MATERIEL MIS A DISPO </v-tab>
                    <!-- <v-badge :content="list_mat_dispo.length" color="#FF8A65" inline /> -->
                </v-tabs>
            </v-toolbar>

            <!-- Contenu selon tab sélectionné -->
            <v-card class="mt-4">
                <v-card-text style="min-height: 320px; max-height: 320px,">
                    <div v-if="tab === 'etape'">
                        <TableauDetailIntegr @formcv="opencv" @formoff="openoffre" :headers="headersdetail"
                            :items="list_etape" :loading="store.loading" />
                    </div>
                    <div v-else-if="tab === 'formation'">
                        <TableauFormation :headers="headersFormation" :items="list_formation" :loading="storeo.loading"
                            @formoff="openoffre" @modifier="modifierOffre" @supprimer="handleDelete" :etat="etat" :matricule="matricule"/>
                    </div>
                    <div v-else-if="tab === 'mat_disp'">
                        <TableauMatDispo :headers="headersMat" :items="list_mat_dispo" :loading="storeo.loading" />
                    </div>
                </v-card-text>
            </v-card>
        </v-card-text>

        <!-- Actions bas -->
        <v-card-actions style="margin-top: -30px; margin-bottom: 0px; margin-right: 14px">
            <v-spacer />
            <v-btn color="red" density="compact" variant="outlined" @click="$emit('close')">Fermer</v-btn>
        </v-card-actions>
    </v-card>

    <!-- formulaire CV -->
    <v-dialog v-model="dialogVisibleCV" persistent width="700" max-width="=700" attach="body">
        <v-card>
            <v-card-text>
                <FormulaireCV v-if="dialogVisibleCV" :defaultCode="defaultCode" :recruCode="recru.recru_code"
                    @cancel="fermerformcv" @saved="handleSaved" />
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- formulaire Offre -->
    <v-dialog v-model="dialogVisibleOffre" persistent width="500" max-width="=500" attach="body">
        <v-card>
            <v-card-text>
                <FormulaireOffre v-if="dialogVisibleOffre" :defaultCode="defaultCode1" :recruCode="recru.recru_code"
                    :offresExistantes="ofs" :offresModif="offModif" @cancel="fermerformcv1" @saved="handleSavedOffre" />
            </v-card-text>
        </v-card>
    </v-dialog>


    <!-- formulaire Test and entretien -->
    <v-dialog v-model="dialogVisibleTest" persistent width="450" max-width="=450" attach="body">
        <v-card>
            <v-card-text>
                <FormulaireTest v-if="dialogVisibleTest" :defaultCode="defaultCode" :recruCode="recru.recru_code"
                    @cancel="fermerformTest" @saved="handleSavedTest" :cvCode="selectedCvCodeTest"
                    :cvNom="selectedCvNomTest" :mode="selectedMode" :date_test="selectedDateTest"
                    :date_entretien="selectedDateEntretien" :date_cvEnrg="selectedDateCvEnrg" />
            </v-card-text>
        </v-card>
    </v-dialog>

    <!-- Dialog Date CV -->
    <v-dialog v-model="dialogDate" persistent max-width="320">
        <v-card>
            <v-date-picker v-model="selectedDate" title="Sélectionner la date entretien" scrollable
                color="deep-purple-accent-4"></v-date-picker>
            <!-- Actions -->
            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text color="primary" @click="confirmDate">Valider</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDateProposition" persistent max-width="320">
        <v-card>
            <v-date-picker v-model="selectedDate" title="Sélectionner la date Proposition dossier" scrollable
                color="deep-purple-accent-4"></v-date-picker>
            <!-- Actions -->
            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text color="primary" @click="confirmDateProposition">Valider</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Date validation candidat -->
    <v-dialog v-model="dialogDateValidation" persistent max-width="320">
        <v-card>
            <!-- Date Picker avec titre dynamique -->
            <!-- :title="cvToUpdate ? `Sélectionner la date entretien de ${cvToUpdate.cv_nom} ${cvToUpdate.cv_prenom}` : 'Sélectionner la date'-->

            <v-date-picker v-model="selectedDate" title="Sélectionner la date entretien" scrollable
                color="deep-purple-accent-4"></v-date-picker>

            <!-- Actions -->
            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text color="primary" @click="confirmDateValidation">Valider</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>


    <!-- Dialog Ajout dossier -->
    <v-dialog v-model="dialogVisibleAddDoc" persistent width="80vw" max-width="1000">
        <v-card class="pa-0">
            <add_dossier v-if="dialogVisibleAddDoc" :defaultCode="defaultCode1" :recruCode="recru.recru_code"
                :offresExistantes="ofs" :offresModif="offModif" @cancel="close_add_doc" @saved="handleSavedOffre" />
        </v-card>
    </v-dialog>






    <!-- Dialog pour sélectionner les candidats -->

    <!-- Dialog pour sélectionner les candidats -->
    <!-- Dialog pour sélectionner les candidats -->
    <v-dialog v-model="dialogVisibleCandidat" persistent transition="slide-x-reverse-transition" max-width="450"
        min-height="680" style="display: flex; justify-content: flex-end; margin-right: -23px">
        <v-card>
            <!-- Titre -->
            <v-card-title>
                <div class="d-flex justify-space-between align-center">
                    <span class="text-h6">Sélectionner le candidat</span>
                    <v-btn variant="text" density="comfortable" @click="dialogVisibleCandidat = false">
                        <v-icon title="Fermer ou plier le panneau" size="25">mdi-chevron-triple-right</v-icon>
                    </v-btn>
                </div>
            </v-card-title>

            <v-divider></v-divider>

            <!-- Loader en haut -->
            <v-progress-linear v-if="storec1.loading" indeterminate color="deep-purple-accent-4"
                height="2"></v-progress-linear>

            <!-- Tableau -->
            <v-card-text style="
          height: 600px;
          overflow-y: auto;
          padding-top: 8px;
          position: relative;
        ">
                <!-- En-tête toujours visible -->
                <v-simple-table dense class="cv-selection-table">
                    <thead>
                        <tr>
                            <th style="width: 40px; background-color: grey"></th>
                            <th style="
                  background-color: grey;
                  color: white;
                  padding-left: 5px;
                  text-align: start;
                  width: 600px;
                ">
                                Nom complet
                            </th>
                        </tr>
                    </thead>

                    <!-- Corps -->
                    <tbody v-if="!storec1.loading && listCvGlobal.length">
                        <tr v-for="cv in listCvGlobal" :key="cv.cv_code">
                            <td>
                                <v-checkbox v-model="selectedCvCodes" :value="cv.cv_code" density="compact"
                                    hide-details></v-checkbox>
                            </td>
                            <td style="width: 350px">{{ cv.cv_nom }} {{ cv.cv_prenom }}</td>
                        </tr>
                    </tbody>

                    <!-- Aucune donnée -->
                    <tbody v-else-if="!storec1.loading && !listCvGlobal.length">
                        <tr>
                            <td colspan="2" style="text-align: center; color: gray; padding: 10px">
                                Aucun candidat disponible.
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </v-card-text>

            <v-divider></v-divider>

            <!-- Boutons d’action -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="validerCandidats">
                    Valider
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showAlertD" max-width="410px" max-height="490px" persistent>
        <v-card>
            <v-card-text class="d-flex align-center gap-4">
                <v-icon color="orange-darken-2" style="margin-bottom: 50px; margin-right: 13px;"
                    size="48">mdi-alert-circle</v-icon>
                <div>
                    <h3 class="text-h6 mb-2">Voulez-vous supprimer l'offre '{{ donneesD.offre_entite }}' sur ce
                        recrutement?</h3>
                    <p class="mb-0">
                        Cette action est irréversible et entraînera une suppression définitive.
                    </p>
                </div>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn density="compact" color="grey-darken-2" variant="tonal" @click="showAlertD = false"
                    style="padding-top: 1px">Annuler</v-btn>
                <v-btn density="compact" color="blue-darken-2" style="padding-top: 1px" variant="elevated"
                    @click="supprimerOffre">Oui</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

    <script>
    import { useRouter } from "vue-router";
    import useSessionTimeout from "@/utils/useSessionTimeout";
    import Config from "@/utils/config.js";
    import { defineComponent, ref, computed, onMounted } from "vue";
    import { useformatDate2 } from "@/composables/useformatDate2";
    import { useRecrutement } from "@/store/Rh/rh_recrutement";
    import { useListIntegration } from "@/store/Rh/rh_integration.js";
    import TableauDetail from "@/components/rh/tableauDetail.vue";
    import TableauCV from "@/components/rh/tableauCV.vue";
    import FormulaireCV from "@/views/rh/FormulaireCV.vue";
    import { useDemande } from "@/store/Rh/rh_demande";
    import { useCV } from "@/store/Rh/rh_cv";
    import { useOffre } from "@/store/Rh/rh_offre";
    import FormulaireOffre from "./FormulaireOffre.vue";
    import FormulaireTest from "./FormulaireTest.vue";

    import add_dossier from "./add_dossier.vue";
    import TableauOffre from "@/components/rh/tableauOffre.vue";
    import TableauMatDispo from "@/components/rh/tableauMatDispo.vue";
    import TableauFormation from "@/components/rh/tableauFormation.vue";
    import TableauDetailIntegr from "@/components/rh/tableauDetailIntegr.vue";

    import Swal from "sweetalert2";

    export default defineComponent({
        name: "DetailRecrutement",
        components: {
            TableauDetail,
            FormulaireCV,
            TableauCV,
            FormulaireOffre,
            FormulaireTest,
            TableauOffre,
            TableauMatDispo,
            TableauDetailIntegr,
            add_dossier,
            TableauFormation,
        },
        props: {
            recru: { type: Object, required: true },
            etat: {
                type: [String, Number],
                required: false
            }
        },
        setup(props) {
            const { formatDate } = useformatDate2();
            const store = useRecrutement();
            const storeIntegr = useListIntegration();
            const stored = useDemande();
            const storec = useCV();
            const storec1 = useCV();
            const storeo = useOffre();
            const details = computed(() => store.listdetail);
            const cvs = computed(() => storec.listcv);
            const ofs = computed(() => storeo.listoffre);
            const tab = ref("etape"); // onglet actif par défaut
            const expandedPoste = ref(false); // <— ajouté
            const dialogVisibleCV = ref(false);
            const dialogVisibleOffre = ref(false); // ouvre le dialog
            const dialogVisibleTest = ref(false); // ouvre le dialog
            const dialogVisibleAddDoc = ref(false); // ouvre le dialog
            const dialogVisibleCandidat = ref(false);

            const defaultCode = ref("");
            const defaultCode1 = ref("");
            const prefixe = "CV";
            const table = "RH_CV";
            const prefixe1 = "OF";
            const table1 = "RH_LIGNE_OFFRE";

            const dialogDate = ref(false); // contrôle affichage dialog
            const dialogDateProposition = ref(false); // contrôle affichage dialog
            const dialogDateValidation = ref(false); // contrôle affichage dialog
            const menu = ref(false); // menu du date picker
            const selectedDate = ref(null);
            let cvToUpdate = ref(null); // conserve l’item CV sélectionné

            const listCvGlobal = ref([]); // liste globale des CV
            const selectedCvCodes = ref([]);
            const offModif = ref([]);
            const offSupp = ref([]);
            const showAlertD = ref(false);
            const donneesD = ref({});

            const selectedCvCodeTest = ref("");
            const selectedCvNomTest = ref("");
            const selectedMode = ref("");

            const selectedDateTest = ref("");
            const selectedDateEntretien = ref("");
            const selectedDateCvEnrg = ref("");

            const headersdetail = [
                { title: "Etape", key: "etape_libelle", align: "start" },
                { title: "Date prévue", key: "ligne_etape_date_prevision", align: "center" },
                { title: "Date", key: "ligne_etape_date", align: "start" },
            ];

            const headerscv = [
                { title: "Nom complet", key: "cv_nom", align: "start" },
                { title: "Téléphone", key: "cv_contact", align: "start" },
                { title: "Email", key: "cv_email", align: "start" },
                { title: "Date postule", key: "cv_ligne_date_ajout", align: "start" },
                { title: "Date CV", key: "cv_date", align: "start" },
                { title: "Date Test", key: "cv_ligne_date_test", align: "center" },
                { title: "Date entretien", key: "cv_ligne_date_entretien", align: "center", },
                { title: "Proposition", key: "cv_ligne_date_proposition", align: "center", },
                { title: "CV", key: "cv_cv", sortable: false, align: "center" },
                { title: "LM", key: "cv_motivation", sortable: false, align: "center" },
                { title: "ACTIONS", key: "action", sortable: false, align: "center" },
            ];

            const headersFormation = [
                { title: "Formation", key: "type_form_libelle", align: "start" },
                { title: "Date prévu", key: "form_dateprevue", align: "start" },
                { title: "Date reelle", key: "form_datereel", align: "start" },

            ];

            const headersMat = [
                // { title: "Matricule", key: "mise_dispo_matr", align: "start" },
                { title: "Catégorie", key: "mise_dispo_cat", align: "start" },
                { title: "Matériel", key: "mise_dispo_materiel", align: "start" },
                // { title: "Date prévue", key: "mise_dispo_date_prevue", align: "start" },
                { title: "Date effect", key: "mise_dispo_date_effect", align: "start" },
            ];



            const router = useRouter();
            useSessionTimeout(Config.DURRE_SESSION, router);

            const code = props.recru?.integr_code;

            const matricule = props.recru?.empl_matricule ?? "";

            onMounted(async () => {

                // console.log(matricule)

                if (code) {
                    await detailRecru()
                } else {
                    console.warn("Pas de recru_code disponible !");
                }
            });

            const list_etape = ref([]);
            const list_offre = ref([]);
            const list_candidat = ref([]);
            const list_mat_dispo = ref([]);
            const list_formation = ref([]);


            const detailRecru = async () => {
                await storeIntegr.fetchListDetailInteg(code , matricule);
                list_etape.value = storeIntegr.listEtapesIntegr;
                list_mat_dispo.value = storeIntegr.listMatDispos;
                list_formation.value = storeIntegr.listFormations;

                // console.log(list_formation.value)
            };

            async function opencv() {
                await stored.fetchCodeNouveau(prefixe, table);
                defaultCode.value = stored.nouveaucode || "";

                dialogVisibleCV.value = true; // ouvre le dialog

                // console.log(defaultCode.value);
                // console.log(dialogVisibleCV.value);

                // console.log("recruCode:", props.recru?.recru_code);
                // console.log("Bouton cv clique!");
            }

            async function openoffre() {
                offModif.value = null;
                await stored.fetchCodeNouveau(prefixe1, table1);
                defaultCode1.value = stored.nouveaucode || "";

                dialogVisibleOffre.value = true; // ouvre le dialog

                // console.log(defaultCode1.value);
                // console.log(dialogVisibleOffre.value);

                // console.log("recruCode:", props.recru?.recru_code);
                // console.log("Bouton offre clique!");
            }

            async function openCandidat() {
                dialogVisibleCandidat.value = true;

                await storec1.fetchListCvGlobal1(); // récupère la liste globale
                let globalCVs = storec1.listcv1 || [];

                // console.log(globalCVs)

                // Filtrer ceux déjà liés au recrutement actuel
                const recruCVs = list_candidat.value.map((cv) => cv.cv_code); // cvs liés au recru actuel
                listCvGlobal.value = globalCVs.filter(
                    (cv) => !recruCVs.includes(cv.cv_code)
                );

                selectedCvCodes.value = []; // reset sélection
                // console.log("Liste globale filtrée des CV:", listCvGlobal.value);
            }

            const fermerformcv = () => {
                dialogVisibleCV.value = false; // ouvre le dialog
                // console.log(dialogVisibleCV.value);
                // console.log("Bouton annuler cv  clique!");
            };

            const fermerformTest = () => {
                dialogVisibleTest.value = false;
            };

            const fermerformcv1 = () => {
                dialogVisibleOffre.value = false; // ouvre le dialog
                offModif.value = null;
                // console.log(dialogVisibleOffre.value);
                // console.log("Bouton annuler offre clique!");
            };
            const close_add_doc = () => {
                dialogVisibleAddDoc.value = false; // ouvre le dialog
                offModif.value = null;
                // console.log(dialogVisibleOffre.value);
                // console.log("Bouton annuler offre clique!");
            };

            async function handleSaved(newDemande) {
                try {
                    // Appelle la bonne méthode du store
                    await storec.insertCV(newDemande);
                    await detailRecru();

                    // storec.fetchListCvRecrut(code);
                    // store.fetchListDetailRecru(code);
                } catch (err) {
                    console.error("Erreur lors de l'ajout :", err);
                }
                dialogVisibleCV.value = false;
            }

            async function handleSavedTest(data) {
                try {

                    const payload = {
                        cvCode: data.cvCodeTest,
                        recruCode: data.recruCodeTest,
                    };

                    if (data.test) {
                        payload.CV_LIGNE_DATE_TEST =
                            `${data.date} ${data.heure}:00`;
                    }

                    if (data.entretien) {
                        payload.CV_LIGNE_DATE_ENTRETIEN =
                            `${data.date} ${data.heure}:00`;
                    }

                    console.log("Payload envoyé :", payload);

                    await storec.insertCVTest(payload);

                } catch (err) {
                    console.error("Erreur lors de l'ajout :", err);
                }
                dialogVisibleTest.value = false;
                await detailRecru();

            }

            async function handleSavedOffre(newDemande) {
                try {
                    // Appelle la bonne méthode du store
                    if (!offModif.value) {
                        await storeo.insertOffre(newDemande);

                        // storeo.fetchListOffre(code);
                        // store.fetchListDetailRecru(code);
                        await detailRecru()
                    } else {
                        await storeo.updateOffre(newDemande);
                        await detailRecru()
                        // storeo.fetchListOffre(code);
                        // store.fetchListDetailRecru(code);
                        // console.log("Modification en cours!");
                    }
                } catch (err) {
                    console.error("Erreur lors de l'ajout :", err);
                }
                dialogVisibleOffre.value = false;
            }



            async function updatecvSelection(cvItem) {
                try {

                    await storec.updatecvSelection(code, cvItem.cv_code);

                    // console.log(cvItem.cv_code)
                    // console.log(cvItem.cv_nom)


                    selectedCvCodeTest.value = cvItem.cv_code
                    selectedCvNomTest.value = cvItem.cv_nom


                    dialogVisibleTest.value = true;

                    // Rafraîchit la liste après mise à jour
                    // await detailRecru();

                } catch (err) {
                    console.error("Erreur lors de la mise à jour de la sélection :", err);
                }
            }


            async function openDialogTest(cvItem) {
                try {

                    //  await storec.updatecvSelection(code, cvItem.cv_code);

                    // console.log(cvItem.cv_code)
                    // console.log(cvItem.cv_nom)



                    selectedCvCodeTest.value = cvItem.cv_code
                    selectedCvNomTest.value = cvItem.cv_nom
                    selectedMode.value = cvItem.mode;

                    selectedDateTest.value = cvItem.cv_ligne_date_test
                    selectedDateEntretien.value = cvItem.cv_ligne_date_entretien
                    selectedDateCvEnrg.value = cvItem.cv_ligne_date_ajout

                    dialogVisibleTest.value = true;

                    // Rafraîchit la liste après mise à jour
                    // await detailRecru();

                } catch (err) {
                    console.error("Erreur lors de la mise à jour de la sélection :", err);
                }
            }


            async function updatecvEntretien(cvItem) {
                try {
                    // Appel du store avec les bons paramètres
                    await storec.updatecvEntretien(code, cvItem.cv_code);

                    cvToUpdate.value = cvItem; // on garde l’item CV
                    selectedDate.value = null; // reset si nécessaire
                    dialogDate.value = false;

                    // Rafraîchit la liste après mise à jour
                    await detailRecru();

                } catch (err) {
                    console.error("Erreur lors de la mise à jour de la sélection :", err);
                }
            }

            // async function updatecvproposition(cvItem) {
            //   try {
            //     await storec.updatecvProposition(code, cvItem.cv_code);

            //     cvToUpdate.value = cvItem; // on garde l’item CV
            //     selectedDate.value = null; // reset si nécessaire
            //     dialogDateProposition.value = false;

            //     await detailRecru();

            //   } catch (err) {
            //     console.error("Erreur lors de la mise à jour de la proposition dossier :", err);
            //   }
            // }

            async function updatecvproposition(cvItem) {

                const result = await Swal.fire({
                    title: "Proposer ce candidat ?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Proposer",
                    cancelButtonText: "Annuler",

                    // Empêche la fermeture accidentelle
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false
                });

                if (!result.isConfirmed) {
                    return;
                }

                try {
                    // Mise à jour
                    await storec.updatecvProposition(code, cvItem.cv_code);

                    cvToUpdate.value = cvItem;
                    selectedDate.value = null;
                    dialogDateProposition.value = false;

                    // Rafraîchir la liste
                    await detailRecru();

                    // Facultatif : message de succès
                    // await Swal.fire({
                    //   icon: "success",
                    //   title: "Succès",
                    //   text: "Le candidat a été proposé avec succès.",
                    //   timer: 2000,
                    //   showConfirmButton: false
                    // });

                } catch (err) {
                    console.error("Erreur lors de la mise à jour de la proposition dossier :", err);

                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Une erreur est survenue lors de la proposition du candidat."
                    });
                }
            }


            // async function updateValidationCandidat(cvItem) {

            //   const result = await Swal.fire({
            //     title: "Valider ce candidat ?",
            //     icon: "warning",
            //     showCancelButton: true,
            //     confirmButtonColor: "#28a745",
            //     cancelButtonColor: "#d33",
            //     confirmButtonText: "valider",
            //     cancelButtonText: "Annuler",

            //     // 🔒 rendre persistant
            //     allowOutsideClick: false,
            //     allowEscapeKey: false,
            //     allowEnterKey: false
            //   });

            //   if (!result.isConfirmed) {
            //     return;
            //   }

            //   try {
            //     await storec.updateValidationCandidat(code, cvItem.cv_code);

            //     cvToUpdate.value = cvItem;
            //     selectedDate.value = null;
            //     // dialogDateValidation.value = true;

            //     await detailRecru();

            //   } catch (err) {
            //     console.error(err);

            //     Swal.fire({
            //       icon: "error",
            //       title: "Erreur",
            //       text: "Une erreur est survenue lors de la validation"
            //     });
            //   }

            // }


            async function updateValidationCandidat(cvItem) {

                const result = await Swal.fire({
                    title: "Date Prise de fonction",
                    html: `
      <input id="dateValidation"
             type="date"
             class="swal2-input"
            >
      `,
                    // value="${new Date().toISOString().split('T')[0]}"
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Valider",
                    cancelButtonText: "Annuler",
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",

                    allowOutsideClick: false,
                    allowEscapeKey: false,

                    preConfirm: () => {
                        const date = document.getElementById("dateValidation").value;

                        if (!date) {
                            Swal.showValidationMessage("Veuillez sélectionner une date.");
                            return false;
                        }

                        return date;
                    }
                });

                if (!result.isConfirmed) {
                    return;
                }

                const dateValidation = result.value;

                try {

                    console.log(code)
                    console.log(cvItem.cv_code)
                    console.log(dateValidation)

                    // Validation du candidat
                    await storec.updateValidationCandidat(code, cvItem.cv_code, dateValidation);

                    // Enregistrement de la date
                    // await storec.insertDateValidation(code,cvItem.cv_code,dateValidation);

                    await detailRecru();

                    Swal.fire({
                        icon: "success",
                        title: "Succès",
                        text: "Le candidat a été validé.",
                        timer: 2000,
                        showConfirmButton: false
                    });

                } catch (err) {
                    console.error(err);

                    Swal.fire({
                        icon: "error",
                        title: "Erreur",
                        text: "Une erreur est survenue."
                    });
                }

            }

            async function insert_doc(cvItem) {

                console.log('cliqued')
                try {
                    // Appel du store avec les bons paramètres
                    // await storec.updateValidationCandidat(code, cvItem.cv_code);

                    cvToUpdate.value = cvItem; // on garde l’item CV
                    selectedDate.value = null; // reset si nécessaire
                    dialogVisibleAddDoc.value = true; // ouvre le dialog

                    // Rafraîchit la liste après mise à jour
                    await detailRecru();

                } catch (err) {
                    console.error("Erreur lors de la mise à jour de la sélection :", err);
                }
            }

            function modifierOffre(cvItem) {
                try {
                    offModif.value = cvItem;
                    dialogVisibleOffre.value = true; // ← ouvre le formulaire
                    // console.log("Ligne offre à modifier : ", offModif.value);
                } catch (err) {
                    console.error("Erreur lors de la mise à jour de la sélection :", err);
                }
            }

            async function confirmDate() {
                if (!selectedDate.value) {
                    alert("Veuillez sélectionner une date !");
                    return;
                }

                try {
                    // Formate la date au format yyyy-MM-dd
                    const dateObj = new Date(selectedDate.value);
                    // const formattedDate = dateObj.toISOString().slice(0, 10);
                    const formattedDate = dateObj.toLocaleDateString('sv-SE');

                    await storec.updatedatecvEntretien(
                        formattedDate,
                        code,
                        cvToUpdate.value.cv_code
                    );

                    storec.fetchListCvRecrut(code);
                    store.fetchListDetailRecru(code);
                    dialogDate.value = false;
                } catch (err) {
                    console.error("Erreur confirmDate:", err);
                    alert(`Erreur lors de la mise à jour : ${err.message}`);
                } finally {
                    dialogDate.value = false;
                    cvToUpdate.value = null;
                    selectedDate.value = null;
                }
            }

            async function confirmDateProposition() {
                if (!selectedDate.value) {
                    alert("Veuillez sélectionner une date !");
                    return;
                }

                try {
                    // Formate la date au format yyyy-MM-dd
                    const dateObj = new Date(selectedDate.value);
                    // const formattedDate = dateObj.toISOString().slice(0, 10);
                    const formattedDate = dateObj.toLocaleDateString('sv-SE');

                    await storec.updatedatecvProposition(
                        formattedDate,
                        code,
                        cvToUpdate.value.cv_code
                    );

                    storec.fetchListCvRecrut(code);
                    store.fetchListDetailRecru(code);
                    dialogDateProposition.value = false;
                } catch (err) {
                    console.error("Erreur confirmDateProposition:", err);
                    alert(`Erreur lors de la mise à jour : ${err.message}`);
                } finally {
                    dialogDateProposition.value = false;
                    cvToUpdate.value = null;
                    selectedDate.value = null;
                }
            }

            async function confirmDateValidation() {
                if (!selectedDate.value) {
                    alert("Veuillez sélectionner une date !");
                    return;
                }

                try {
                    // Formate la date au format yyyy-MM-dd
                    const dateObj = new Date(selectedDate.value);
                    // const formattedDate = dateObj.toISOString().slice(0, 10);
                    const formattedDate = dateObj.toLocaleDateString('sv-SE');


                    await storec.updatedateValidation(
                        formattedDate,
                        code,
                        cvToUpdate.value.cv_code
                    );

                    storec.fetchListCvRecrut(code);
                    store.fetchListDetailRecru(code);
                    dialogDateValidation.value = false;
                } catch (err) {
                    console.error("Erreur confirmDate:", err);
                    alert(`Erreur lors de la mise à jour : ${err.message}`);
                } finally {
                    dialogDateValidation.value = false;
                    cvToUpdate.value = null;
                    selectedDate.value = null;
                }
            }

            async function validerCandidats() {
                if (!selectedCvCodes.value.length) {
                    //   alert("Veuillez sélectionner au moins un candidat !");
                    return;
                }

                try {
                    // Boucle sur chaque CV sélectionné et insertion
                    for (const cvCode of selectedCvCodes.value) {
                        const formData = new FormData();
                        formData.append("cv_code", cvCode);
                        formData.append("cv_recru_code", props.recru.recru_code);

                        await storec.insertLigneCV(formData);
                    }

                    // Rafraîchit les listes
                    // await storec.fetchListCvRecrut(code);
                    // await store.fetchListDetailRecru(code);
                    await detailRecru();

                    //alert("CV(s) inséré(s) avec succès !");
                } catch (err) {
                    console.error("Erreur insertion CV(s) :", err);
                    // alert("Erreur lors de l'insertion des CV(s).");
                } finally {
                    dialogVisibleCandidat.value = false; // ferme le dialog
                    selectedCvCodes.value = []; // reset sélection
                }
            }

            async function supprimerOffre() {
                try {
                    await storeo.deleteOffre(donneesD.value);
                    await detailRecru();
                    // storeo.fetchListOffre(code);
                    // store.fetchListDetailRecru(code);
                    showAlertD.value = false;
                } catch (err) {
                    console.error("Erreur lors de la suppression de la sélection :", err);
                }
            }

            function handleDelete(item) {

                showAlertD.value = true;
                donneesD.value = item;

            }

            const countNotEmpty = (items, key) => {
                return items.filter(item =>
                    item[key] !== null &&
                    item[key] !== undefined &&
                    item[key] !== ''
                ).length;
            };

            return {
                prefixe, insert_doc,
                list_etape, list_offre, list_candidat,
                table, prefixe1, table1, defaultCode, defaultCode1, formatDate, tab, expandedPoste, headersdetail, headerscv, headersFormation, store, stored, storec, storec1, storeo, details, dialogVisibleCV,
                dialogVisibleOffre, dialogVisibleAddDoc, dialogVisibleCandidat, opencv, openoffre, fermerformcv, fermerformcv1, close_add_doc, handleSaved, handleSavedOffre, cvs, ofs, code,
                updatecvSelection, updatecvEntretien, updatecvproposition, updateValidationCandidat, modifierOffre, offModif, supprimerOffre, dialogDate, dialogDateProposition, dialogDateValidation, selectedDate, menu, cvToUpdate,
                confirmDate, confirmDateProposition, confirmDateValidation, openCandidat, listCvGlobal, selectedCvCodes, validerCandidats, handleDelete, showAlertD, donneesD,
                dialogVisibleTest, fermerformTest, selectedCvCodeTest, selectedCvNomTest, handleSavedTest, openDialogTest, selectedMode,
                selectedDateTest, selectedDateEntretien, selectedDateCvEnrg,
                countNotEmpty,
                etat: props.etat,
                list_mat_dispo, headersMat,matricule,list_formation,

            };
        },
    });
</script>

    <style>
    .close-icon {
        cursor: pointer;
        color: #555;
        transition: 0.2s;
    }

    .close-icon:hover {
        color: red;
    }

    .custom-tabs1 {
        max-width: 490px;
        display: flex;
        justify-content: left;
    }

    .info-principale {
        position: relative;
        padding: 10px;
        background-color: #fafafa;
        /* fond léger */
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        /* bord discret */
    }

    .info-col {
        padding: 4px 0;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        /* ✅ évite que les éléments aillent à la ligne */
        gap: 1px;
    }

    .info-label {
        font-weight: 600;
        color: #555;
        white-space: nowrap;
        min-width: 125px;
    }

    .info-value {
        font-weight: 400;
        color: #222;
    }

    .truncate {
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .truncate.expanded {
        white-space: normal;
        /* Permet d’afficher plusieurs lignes */
        word-break: break-word;
        /* Coupe proprement les longues phrases */
        background-color: #f7f7f7;
        /* Fond doux quand développé */
        border-radius: 4px;
        padding: 2px 4px;
        max-width: none;
        /* Retire la limite de largeur */
    }

    /* Style pour tete du dialog */

    /* On force notre propre flex container */
    .title-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 10px 2px 2px 2px;
        margin-top: 0px;
        margin-bottom: -5px;
        background-color: #f8f9fa;
        border-bottom: 2px solid #d7ead5;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    .custom-card-dm {
        padding: 0;
        /* on enlève le padding natif du v-card-title */
        margin-bottom: -5px;
    }

    .title-left {
        display: flex;
        align-items: center;
        gap: 8px;
        max-height: 20px;
    }

    .title-text {
        font-size: 1.15rem;
        color: #333;
    }

    .recru-code {
        font-weight: 600;
        color: #4caf50;
    }

    .recru-date {
        font-weight: 600;
        color: #191b19;
    }

    .close-btn {

        transition: transform 0.2s ease, color 0.2s ease;
        margin-top: -10px;
    }

    .close-btn:hover {
        color: red !important;
        transform: rotate(90deg);
    }

    /* --- Petit badge du code --- */
    /* Badge en haut à gauche */
    .code-label {
        position: absolute;
        top: -15px;
        /* juste au-dessus de la bordure */
        left: 0px;
        background-color: #1976d2;
        color: white;
        font-weight: 600;
        font-size: 13px;
        padding: 3px 10px;
        border-radius: 6px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .info-principale-cards {
        display: flex;
        /* transforme en flex container */
        justify-content: space-between;
        /* centre horizontalement les cartes */
        gap: 30px;
        /* espace entre chaque carte */
        margin-bottom: 0px;
        margin-top: -20px;
    }

    .info-card {
        padding: 8px;
        background-color: #fafafa;
        border-radius: 6px;
        max-height: 90px;
        min-width: 280px;
    }

    .card-title {
        font-size: 13px;
        font-weight: 700;
        color: #1976d2;
        padding: 0 0 4px 0;
    }

    .info-item {
        display: flex;
        flex-direction: row;
        /* label et valeur côte à côte */
        justify-content: flex-start;
        /* label à gauche, valeur à droite */
        margin-bottom: 4px;
        gap: 2px;
    }

    .info-label {
        font-weight: 600;
        font-size: 12px;
        color: #555;
        min-width: auto;
    }

    .info-value {
        font-weight: 400;
        font-size: 13px;
        color: #222;
    }

    .truncate.expanded {
        white-space: normal;
        word-break: break-word;
        background-color: #f7f7f7;
        border-radius: 4px;
        padding: 2px 4px;
    }

    .info-row {
        display: flex;
        gap: 5px;
    }

    .departement-card {
        min-width: 520px;
        /* largeur maximum */
    }

    .contrat-card {
        min-width: 50px;
        /* largeur maximum */
    }

    .readonly-field {
        cursor: not-allowed;
        background-color: #f9f9f9;
        pointer-events: none;
        /* Empêche clic et curseur */
        user-select: none;
        /* Empêche sélection de texte */
    }

    .v-simple-table {
        border-collapse: collapse;
        /* fusionne bordures */
        width: 100%;
        border: 1px solid #8130e4;
        /* bordure autour du tableau */
    }

    .v-simple-table th,
    .v-simple-table td {
        border: 1px solid #ccc;
        /* bordure autour de chaque cellule */
        padding: 8px 12px;
    }

    .v-simple-table thead th {
        background-color: #f0f0f0;
        /* couleur fond header */
        border-color: #8130e4;
        /* couleur bordure header */
        font-weight: 600;
    }

    .cv-selection-table {
        border-collapse: collapse;
        width: 100%;
        /* bordure extérieure */
        border-radius: 6px;
        overflow: hidden;
    }

    .cv-selection-table th {
        border: 1px solid #ccc;
        /* bordure des cellules */

        padding: 10px 10px;
    }

    .cv-selection-table td {
        border: 1px solid #ccc;
        /* bordure des cellules */

        padding: 2px 4px 2px 2px;
    }
</style>
    >