<template>
    <v-card>
        <!-- Titre avec code recrutement et bouton fermer -->
        <v-card-title class="custom-card-dm">
            <div class="title-container">
                <div class="title-left">
                    <v-icon size="26" color="deep-purple-accent-4" class="mr-2">mdi-briefcase-account</v-icon>
                    <span class="title-text">
                        <strong>Détail de l'employé  </strong>
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

                    <!-- Date -->
                    <v-col cols="3" style="margin-left: 130px;">
                        <v-card class="info-card" outlined>
                            <v-card-title class="card-title">DATE</v-card-title>
                            <v-card-text>
                                <div class="info-row">

                                    <v-text-field label="Prise de fonction" variant="outlined" density="compact"
                                        :model-value="formatDate(recru.empl_prise_fonction)" readonly hide-details
                                        class="readonly-field" />

                                    <v-text-field label="Date fin essai 1" variant="outlined" density="compact"
                                        :model-value="formatDate(recru.empl_date_fin_essai1)" readonly hide-details
                                        class="readonly-field" />
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </div>

            <v-divider class="my-2"></v-divider>

            <!-- Onglets centrés et taille adaptée -->
            <v-toolbar :elevation="1" density="compact" color="#d7ead5">
                <v-tabs v-model="tab" color="deep-purple-accent-4" background-color="#d7ead5" class="custom-tabs" grow
                    density="compact" slider-color="deep-purple-accent-4">
                    <v-tab value="formatioon">FORMATION</v-tab>
                    <v-tab value="sanction">SANCTION</v-tab>
                    <!-- <v-tab value="mat_disp">MATERIEL MIS A DISPO </v-tab> -->
                </v-tabs>
            </v-toolbar>

            <!-- Contenu selon tab sélectionné -->
            <v-card class="mt-4">
                <v-card-text style="min-height: 320px; max-height: 320px,">
                    <div v-if="tab === 'formation'">
                        <!-- <TableauDetailIntegr @formcv="opencv" @formoff="openoffre" :headers="headersdetail"
                            :items="list_etape" :loading="store.loading" /> -->
                    </div>
                    <div v-else-if="tab === 'sanction'">
                        <TableauOffre :headers="headersoffre" :items="list_offre" :loading="storeo.loading"
                            @formoff="openoffre" @modifier="modifierOffre" @supprimer="handleDelete" :etat="etat" />
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
    import { useDemande } from "@/store/Rh/rh_demande";
    import { useCV } from "@/store/Rh/rh_cv";
    import { useOffre } from "@/store/Rh/rh_offre";


    import TableauOffre from "@/components/rh/tableauOffre.vue";
    import TableauMatDispo from "@/components/rh/tableauMatDispo.vue";
    import TableauDetailIntegr from "@/components/rh/tableauDetailIntegr.vue";

    import Swal from "sweetalert2";

    export default defineComponent({
        name: "DetailRecrutement",
        components: {
            TableauDetail,
            TableauCV,
            TableauOffre,
            TableauMatDispo,
            TableauDetailIntegr,

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
            const tab = ref("etape");
            const expandedPoste = ref(false);

            const defaultCode = ref("");
            const defaultCode1 = ref("");
            const table = "RH_CV";

            const menu = ref(false); // menu du date picker

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

            const headersoffre = [
                { title: "Type", key: "offre_type", align: "start" },
                { title: "Date", key: "offre_date", align: "start" },
                { title: "Entite", key: "offre_entite", align: "start" },
                { title: "Piece", key: "offre_piece", align: "start" },
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


            const detailRecru = async () => {
                await storeIntegr.fetchListDetailInteg(code , matricule);
                list_etape.value = storeIntegr.listEtapesIntegr;
                list_mat_dispo.value = storeIntegr.listMatDispos;

                // console.log(list_etape.value)
            };

            const countNotEmpty = (items, key) => {
                return items.filter(item =>
                    item[key] !== null &&
                    item[key] !== undefined &&
                    item[key] !== ''
                ).length;
            };

            return {
                list_etape, list_offre, list_candidat,
                table,defaultCode, defaultCode1, formatDate, tab, expandedPoste, headersdetail, headerscv, headersoffre, store, stored, storec, storec1, storeo, details,
                code,
                menu,
                countNotEmpty,
                etat: props.etat,
                list_mat_dispo, headersMat,matricule,

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

    .custom-tabs {
        max-width: 450px;
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
        user-select: none;
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