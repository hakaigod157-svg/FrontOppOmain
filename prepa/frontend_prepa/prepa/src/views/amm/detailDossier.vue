<template>
    <v-card>
        <v-card-title class="custom-card-dm pb-0">
            <div class="d-flex justify-space-between align-left">
                <span class="text-h5" style="display: flex; align-items: center; gap: 230px;">
                    <b><u>Détail Dossier</u> : {{ ammDsCode }}</b>
                    <b>
                        {{ [ammDecision, ammEtape].filter(Boolean).join(' ') }} {{ dateDepuis ? `depuis
                        ${dateDepuis}` : '' }}

                        <!-- Petit bouton texte -->
                        <v-btn v-if="decision_motif" size="x-small" variant="outlined" color="error" class="ml-2"
                            @click="dialogMotif = true">
                            Motif
                        </v-btn>
                        <br>
                    </b>
                </span>
                <v-icon @click="closeDetail">mdi-close</v-icon>
            </div>
        </v-card-title>

        <div class="pa-2">
            <!-- <v-card>
                <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5" density="compact">
                </v-progress-linear>

            </v-card> -->

            <v-dialog v-model="dialogMotif" max-width="500" persistent>
                <v-card>
                    <!-- <v-card-title class="text-h6 font-weight-bold text-error">
                        Motif du refus
                    </v-card-title> -->

                    <v-card-text class="text-body-1">
                        {{ decision_motif }}
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="error" variant="outlined" @click="dialogMotif = false">
                            Fermer
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>




            <v-card-text style="padding-bottom: 0;">
                <div class="mb-4 text-left">
                    <h2 class="text-h5 font-weight-bold text-primary">
                        <!-- <u>Dossier</u> -->
                    </h2>
                </div>
                <v-row>

                    <v-row dense class="d-flex gap-6 align-center">
                        <!-- Dossier AMM -->
                        <v-col cols="0" md="2">
                            <v-text-field label="Crée le" v-model="dateCre" variant="outlined" density="comfortable"
                                style="width: 55%;" readonly />
                        </v-col>


                        <!-- Type -->
                        <v-col cols="3" md="4" style="margin-left: -90px;">
                            <v-radio-group label="TYPE" v-model="valueOftype" row density="compact" inline
                                class="radio-border" disabled hide-details>
                                <v-radio color="success" label="NOUVELLE DEMANDE" value="NOUVELLE DEMANDE" />
                                <v-radio color="success" label="RENOUVELLEMENT" value="RENOUVELLEMENT" />
                                <v-radio color="success" label="VARIATION" value="VARIATION" />

                            </v-radio-group>
                        </v-col>

                        <!-- CLASSIFICATION -->
                        <v-col cols="3" md="2">
                            <v-radio-group label="CLASSIFICATION" v-model="valueOfclass" row density="compact" inline
                                class="radio-border" disabled hide-details>
                                <v-radio color="success" label="SPÉCIALITÉ" value="SPECIALITE" />
                                <v-radio color="success" label="GÉNÉRIQUE" value="GENERIQUE" />
                            </v-radio-group>
                        </v-col>

                        <!-- Responsable -->
                        <!-- <v-col cols="3" md="2">
                            <MySelect label="RESPONSABLE" density="comfortable" :items="[
                                { title: 'MAHEL', value: 'MAHEL' },
                                { title: 'NANDRIANINA', value: 'NANDRIANINA' }
                            ]" v-model="valueOfrespDet" :disabled="isReadOnly" :clearable="false" />
                        </v-col> -->

                        <v-col cols="3" md="2">
                            <MySelect label="RESPONSABLE" density="comfortable" :items="list_respo"
                                v-model="valueOfrespDet" item-title="responsable" item-value="responsable"
                                :clearable="false" :disabled="isReadOnly" />
                        </v-col>


                        <!-- <v-col cols="12" md="6">
                            <v-text-field label="Type de demande" v-model="ammtype" variant="outlined"
                                density="comfortable" style="width: 100%;" readonly />
                        </v-col>

                       
                        <v-col cols="12" md="3">
                            <v-text-field label="Responsable" v-model="ammRespDet" variant="outlined"
                                density="comfortable" style="width: 100%;" readonly />
                        </v-col> -->
                    </v-row>
                    <!-- <v-divider class="my-6 border-opacity-100" color="#FF80AB" :thickness="2"></v-divider> -->

                    <!-- Barre style toolbar -->
                    <v-toolbar :elevation="1" density="compact" color="#d7ead5">
                        <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4" grow>
                            <v-tab value="article">ARTICLE</v-tab>
                            <v-tab value="dossier">DOSSIER A FOURNIR</v-tab>
                            <v-tab value="etape">ETAPES</v-tab>
                            <v-tab value="action">HISTORIQUES</v-tab>
                            <v-tab v-if="amm_reclam[0]?.amm_reclam === 1" value="reclamation">
                                RECLAMATION
                            </v-tab>
                            <v-tab v-if="amm_type[0]?.amm_type === 'VARIATION'" value="variation">
                                VARIATION
                            </v-tab>

                        </v-tabs>
                    </v-toolbar>

                    <!-- Contenu des tabs -->
                    <v-container fluid class="pa-4">
                        <v-card>
                            <v-card-text>
                                <div
                                    :class="{ 'blurred': dialogNewEtape || dialogNewFournir || dialogNewHisto || dialogNewVariation || dialogNewReclam }">
                                    <v-tabs-window v-model="tab">
                                        <v-tabs-window-item value="article">
                                            <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
                                                <v-btn variant="tonal" color="#F50057" @click="newEtape"
                                                    :disabled="isReadOnly" density="compact"
                                                    style="visibility: hidden;">
                                                    Nouveau
                                                </v-btn>
                                            </div>
                                            <MyTableArticle :headers="headers" :items="list_article" height="350"
                                                @file-selected="handleFileSelected" :decision="ammDecision" :dossier="ammDsCode" />
                                        </v-tabs-window-item>

                                        <!-- Dossier à fournir -->
                                        <v-tabs-window-item value="dossier">
                                            <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
                                                <v-btn variant="tonal" color="#F50057" @click="newFournir"
                                                    density="compact" :disabled="isReadOnly"
                                                    :style="{ visibility: isReadOnly ? 'hidden' : 'visible' }">
                                                    Ajouter Dossier
                                                </v-btn>
                                            </div>

                                            <v-dialog v-model="dialogNewFournir" :persistent="true" width="430px">
                                                <newDisplay :items="listNewFournir" :item-value="'dossier_code'"
                                                    :item-title="'dossier_lib'"
                                                    :selected-item="selectedFournir ? selectedFournir.dossier_code : null"
                                                    :show-date-field="true" @save="onSaveFournirs"
                                                    @annuler="onAnnulerNewFournir" />
                                            </v-dialog>

                                            <MyTableDossierAfournir :headers="headers_fournir"
                                                :items="list_dossierafournir" height="350"
                                                @action5Item="deleteDateFournir" action4="Ajouter date"
                                                @action4Item="addDateFournir" :is-read-only="isReadOnly" />

                                            <!-- Fenêtre date à fournir-->
                                            <v-dialog v-model="showDateDialogFournir" :persistent="true"
                                                max-width="400">
                                                <v-card>
                                                    <v-card-title>Sélectionner une date</v-card-title>
                                                    <v-card-text>
                                                        <v-date-picker v-model="selectedDateFournir"
                                                            :allowed-dates="allowedDates"
                                                            @dblclick="saveDateFournir()"></v-date-picker>
                                                    </v-card-text>
                                                    <v-card-actions>
                                                        <v-spacer />
                                                        <v-btn text
                                                            @click="showDateDialogFournir = false">Annuler</v-btn>
                                                        <v-btn color="primary"
                                                            @click="saveDateFournir()">Valider</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                        </v-tabs-window-item>

                                        <v-tabs-window-item value="etape">
                                            <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
                                                <v-btn variant="tonal" color="#F50057" @click="newEtape"
                                                    :disabled="isReadOnly" density="compact"
                                                    style="visibility: hidden;">
                                                    Nouveau
                                                </v-btn>
                                            </div>

                                            <v-dialog v-model="dialogNewEtape" :persistent="true" width="350px">

                                                <newDisplay :key="list_etape.length" :items="filteredEtapes"
                                                    :item-value="'etape_dossier'" :item-title="'etape_dossier'"
                                                    :selected-item="selectedEtape" :show-date-field="true"
                                                    @save="onSaveEtapes" @annuler="onAnnulerNewEtape" />
                                            </v-dialog>

                                            <MyTableEtape :headers="headers_etape" :items="list_etape" height="350"
                                                action4="Ajouter date" @action4Item="addDate" @action5Item="deleteDate"
                                                :is-read-only="isReadOnly" />

                                            <!-- Fenêtre date -->
                                            <v-dialog v-model="showDateDialog" :persistent="true" max-width="400">
                                                <v-card>
                                                    <v-card-title>Sélectionner une date</v-card-title>
                                                    <v-card-text>
                                                        <v-date-picker v-model="selectedDate"
                                                            :allowed-dates="allowedDates"
                                                            @dblclick="saveDate()"></v-date-picker>

                                                    </v-card-text>
                                                    <v-card-actions>
                                                        <v-spacer />
                                                        <v-btn text @click="showDateDialog = false">Annuler</v-btn>
                                                        <v-btn color="primary" @click="saveDate()">Valider</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>

                                        </v-tabs-window-item>

                                        <v-tabs-window-item value="action">
                                            <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
                                                <v-btn variant="tonal" color="#F50057" @click="newHisto"
                                                    :disabled="isReadOnly" density="compact"
                                                    :style="{ visibility: isReadOnly ? 'hidden' : 'visible' }">
                                                    Nouveau
                                                </v-btn>
                                            </div>
                                            <v-dialog v-model="dialogNewHisto" :persistent="true" width="700px">
                                                <newHisto @save="onSaveHisto" @annuler="onAnnulerNewHisto" />
                                            </v-dialog>
                                            <MyTableAction :headers="headers_action" :items="list_histo" height="350"
                                                @actionDelete="deleteComment" />
                                        </v-tabs-window-item>

                                        <!-- Tableau Reclamation -->
                                        <v-tabs-window-item value="reclamation">
                                            <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
                                                <v-btn variant="tonal" color="#F50057" @click="newReclam"
                                                    :disabled="isReadOnly" density="compact"
                                                    :style="{ visibility: isReadOnly ? 'hidden' : 'visible' }">
                                                    Nouveau
                                                </v-btn>
                                            </div>
                                            <v-dialog v-model="dialogNewReclam" :persistent="true" width="700px">
                                                <reclamation @annuler="onAnnulerReclam" @save="onSaveReclam"
                                                    :dossier="ammDsCode" :is-new="true"
                                                    :existing-reclamations="listReclamation" />
                                            </v-dialog>
                                            <MyTableReclamation :headers="headers_reclamation" :items="listReclamation"
                                                height="350" action4="Ajouter date" @action4Item="addDateReclam"
                                                @action6Item="annuler_reclam" @action5Item="deleteDateReclam"
                                                :is-read-only="isReadOnly" />
                                            <!-- Fenêtre date à Reclam-->
                                            <v-dialog v-model="showDateDialogReclam" :persistent="true" max-width="400">
                                                <v-card>
                                                    <v-card-title>Sélectionner une date</v-card-title>
                                                    <v-card-text>
                                                        <v-date-picker v-model="selectedDateReclam"
                                                            :allowed-dates="allowedDates"
                                                            @dblclick="saveDateReclam()"></v-date-picker>
                                                    </v-card-text>
                                                    <v-card-actions>
                                                        <v-spacer />
                                                        <v-btn text
                                                            @click="showDateDialogReclam = false">Annuler</v-btn>
                                                        <v-btn color="primary" @click="saveDateReclam()">Valider</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                        </v-tabs-window-item>

                                        <!-- Tableau Variation -->
                                        <v-tabs-window-item value="variation">

                                            <u>Référence Variation</u> : <b>{{ listVariation?.[0]?.amm_ref_variation
                                                }}</b>

                                            <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
                                                <v-btn variant="tonal" color="#F50057" @click="newVariation"
                                                    :disabled="isReadOnly" density="compact"
                                                    :style="{ visibility: isReadOnly ? 'hidden' : 'visible' }">
                                                    Nouveau
                                                </v-btn>
                                            </div>
                                            <v-dialog v-model="dialogNewVariation" :persistent="true" width="700px">
                                                <newVariation @save="onSaveVariation" @annuler="onAnnulerVariation" />
                                            </v-dialog>
                                            <MyTableVariation :headers="headers_variation" :items="listVariation"
                                                height="350" action4="Ajouter date" @action4Item="addDateReclam"
                                                @action5Item="deleteDateReclam" :is-read-only="isReadOnly" />
                                            <!-- Fenêtre date Variation -->
                                            <!-- <v-dialog v-model="showDateDialogReclam" :persistent="true" max-width="400">
                                                <v-card>
                                                    <v-card-title>Sélectionner une date</v-card-title>
                                                    <v-card-text>
                                                        <v-date-picker v-model="selectedDateReclam"
                                                            :allowed-dates="allowedDates"
                                                            @dblclick="saveDateReclam()"></v-date-picker>
                                                    </v-card-text>
                                                    <v-card-actions>
                                                        <v-spacer />
                                                        <v-btn text
                                                            @click="showDateDialogReclam = false">Annuler</v-btn>
                                                        <v-btn color="primary" @click="saveDateReclam()">Valider</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog> -->
                                        </v-tabs-window-item>

                                    </v-tabs-window>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-row>
            </v-card-text>
        </div>

        <!-- <v-card-actions>
            <v-spacer />
            <h2>"Veuillez enregistrer pour prendre toute modification"</h2>
            <v-btn v-if="!isReadOnly" color="primary" variant="tonal" @click="save"
                :disabled="isSaving">Enregistrer</v-btn>
            <v-btn color="red" variant="outlined" @click="annuler">
                {{ isReadOnly ? 'Fermer' : 'Annuler' }}
            </v-btn>
        </v-card-actions> -->


        <v-card-actions>
            <v-spacer />
            <h3 v-if="!isReadOnly" style="text-align: right; color: red; width: 100%;">
                " Veuillez <u>enregistrer</u> pour prendre toute modification " ===>
            </h3>
            <v-btn v-if="!isReadOnly" color="primary" variant="tonal" @click="save" :disabled="isSaving">
                Enregistrer
            </v-btn>
            <v-btn color="red" variant="outlined" @click="annuler">
                {{ isReadOnly ? 'Fermer' : 'Annuler' }}
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { uselistDossier } from "@/store/Amm/amm_dossier.js";
import swal from 'sweetalert2';
import MySelect from '@/components/MySelect.vue';
import MyTableAmm from '@/components/amm/MyTableAmm.vue';
import MyTableArticle from '@/components/amm/table_details/MyTableArticle.vue';
import MyTableEtape from '@/components/amm/table_details/MyTableEtape.vue';
import MyTableDossierAfournir from '@/components/amm/table_details/MyTableDossierAfournir.vue';
import MyTableAction from '@/components/amm/table_details/MyTableAction.vue';
import MyTableReclamation from '@/components/amm/table_details/MyTableReclamation.vue';
import MyTableVariation from '@/components/amm/table_details/MyTableVariation.vue';
import { useArticleStore } from "@/store/utils/article.js";

import reclamation from '@/views/amm/reclamation.vue';

import newDisplay from '@/views/amm/PageNew.vue';
import newHisto from '@/views/amm/PageNewHisto.vue';
import newVariation from '@/views/amm/PageNewVariation.vue';

import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";

import { useTypeStore } from "@/store/Amm/type.js";
import { useStatuStore } from "@/store/Amm/status.js";
import { useRespStore } from "@/store/Amm/responsable.js";



export default defineComponent({
    components: {
        MyTableArticle,
        MySelect,
        MyTableEtape,
        MyTableDossierAfournir,
        MyTableAction,
        newDisplay,
        newHisto,
        MyTableReclamation,
        MyTableVariation,
        newVariation,
        reclamation,
    },

    props: {
        ammdscode: String,
        respodet: String,
        typedet: String,
        ammseq: String,
        classdet: String,
        decisiondet: String,
        etapedet: String,
        ammreclam: Number,
        datecre: Date,
        datedepuis: Date,

        dossier: Object,

    },

    setup(props, { emit }) {
        const ammDsCode = props.ammdscode;
        const ammRespDet = props.respodet;
        const ammtype = props.typedet;
        const ammSeq = props.ammseq;
        const ammDecision = props.decisiondet;
        const ammEtape = props.etapedet;

        const selectedEtape = ref(null);
        const selectedFournir = ref(null);

        const valueOfrespDet = ref(props.respodet || '')
        const valueOftype = ref(props.typedet || '')
        const valueOfclass = ref(props.classdet || '')

        const dialogVisible = ref(false);
        const user = localStorage.getItem('username');
        const router = useRouter();

        const storeUpdateArticle = uselistDossier();
        const storeUpdateDossier = uselistDossier();
        const storeUpdateEtape = uselistDossier();
        const storeUpdateFournir = uselistDossier();
        const storeUpdateReclam = uselistDossier();
        const storeGetEtape = uselistDossier();
        const storeGetFournir = uselistDossier();
        const storeGetMotif = uselistDossier();

        const storeInsertEtape = uselistDossier();
        const storeInsertFournir = uselistDossier();
        const storeInsertHisto = uselistDossier();
        const storeUpdateHisto = uselistDossier();
        const storeGetReclamation = uselistDossier();
        const storeListRespo = uselistDossier();

        const storeArticle = uselistDossier();

        const list_article = ref([]);
        const list_etape = ref([]);
        const list_dossierafournir = ref([]);
        const list_histo = ref([]);
        const list_reclam = ref([]);
        const amm_reclam = ref([]);
        const amm_type = ref([]);
        const amm_ref_variation = ref([]);

        const showDateDialog = ref(false);
        const selectedDate = ref(null);
        const currentItem = ref(null);

        const showDateDialogFournir = ref(false);
        const showDateDialogReclam = ref(false);
        const currentItemFournir = ref(null);
        const currentItemReclam = ref(null);
        const selectedDateFournir = ref(null);
        const selectedDateReclam = ref(null);

        const dialogNewEtape = ref(false);
        const dialogNewFournir = ref(false);
        const dialogNewHisto = ref(false);
        const dialogNewReclam = ref(false);
        const dialogNewVariation = ref(false);

        const listEtape = ref([]);
        const listNewFournir = ref([]);
        const listMotif = ref([]);
        const listReclamation = ref([]);
        const listVariation = ref([]);
        const listFournirOptions = ref([]);

        const listeEtapeDates = ref([]);

        const tab = ref("one");

        const isSaving = ref(false);

        const dialogMotif = ref(false)

        //VALEUR A VERIFIER
        const Etat = 0;

        const Etape = ref([]);
        const DateNew = ref(null);
        const filteredEtapes = ref([]);

        const list_respo = ref([]);

        const uploadedImages = ref([]); // stocke les images par item.id ou index

        const handleFileSelected = ({ seq, file }) => {
            // Vérifie si le SEQ existe déjà, remplace sinon ajoute
            const index = uploadedImages.value.findIndex(i => i.seq === seq);
            if (index !== -1) {
                uploadedImages.value[index].file = file;
            } else {
                uploadedImages.value.push({ seq, file });
            }
        };

        const save = async () => {
            if (isSaving.value) return;  // Empêche un second clic

            // Confirmation SweetAlert
            const result = await swal.fire({
                title: 'Enregistrer',
                // text: "Voulez-vous vraiment enregistrer les modifications ?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non',
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                customClass: {
                    confirmButton: 'swal2-btn-confirm', // classe pour le bouton Oui
                    cancelButton: 'swal2-btn-cancel'    // classe pour le bouton Non
                }
            });

            if (!result.isConfirmed) return; // Si l'utilisateur clique sur "Non", on sort

            isSaving.value = true; // Désactive le bouton

            try {
                await updateDossier();

                // === Étapes ===
                const hasUpdateEtape = list_etape.value.some(e => e.etat === 1);
                if (hasUpdateEtape) {
                    await updateEtape();
                }

                const hasInsertEtape = list_etape.value.some(e => e.etat === 2);
                if (hasInsertEtape) {
                    await insertEtapes();
                }

                // === Historiques ===
                const hasUpdateHisto = list_histo.value.some(h => h.etat_comment === 1);
                if (hasUpdateHisto) {
                    // await updateHisto();
                }

                const hasInsertHisto = list_histo.value.some(h => h.etat_comment === 2);
                if (hasInsertHisto) {
                    await insertHisto();
                }

                // === Fournir ===
                const hasUpdateFournir = list_dossierafournir.value.some(f => f.etat_fournir === 1);
                if (hasUpdateFournir) {
                    await updateFournir();
                }

                const hasInsertFournir = list_dossierafournir.value.some(f => f.etat_fournir === 2);
                if (hasInsertFournir) {
                    await insertFournir(ammDsCode, list_dossierafournir.value.filter(f => f.etat_fournir === 2));
                }

                // === Reclam ===
                const hasUpdateReclam = listReclamation.value.some(f => f.etat_reclam === 1);
                if (hasUpdateReclam) {
                    await updateReclam();
                }

                const hasInsertReclam = listReclamation.value.some(f => f.etat_reclam === 2);
                if (hasInsertReclam) {
                    await insertReclam();
                }

                // === Variation ===
                const hasInsertVariation = listVariation.value.some(h => h.etat_comment === 2);
                if (hasInsertVariation) {
                    await insertVariation();
                }

                // === Upload Image to Ligne Article ===
                if (uploadedImages.value && uploadedImages.value.length > 0) {
                    await updateLigneArticle();
                }

                closeDetail();

            } catch (error) {
                console.error(error);
                swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de l\'enregistrement.'
                });
            } finally {
                isSaving.value = false;  // Réactive le bouton
            }
        };

        const annuler = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        const closeDetail = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        const updateLigneArticle = async () => {
            for (const { seq, file } of uploadedImages.value) {
                // console.log(`SEQ: ${seq}`, file);
                await storeUpdateArticle.updateLigneArticleImage(seq, file);
            }
        };

        const updateDossier = async () => {
            await storeUpdateDossier.updateDossier(ammDsCode, valueOftype.value, valueOfrespDet.value, valueOfclass.value);
        }

        const updateEtape = async () => {
            const etapesToUpdate = list_etape.value
                .filter(e => e.etat === 1)
                .map(item => {
                    let dateValue = null;

                    if (item.date_etape) {
                        const dateObj = new Date(item.date_etape);
                        if (!isNaN(dateObj.getTime())) {
                            dateValue = dateObj.toISOString().split('T')[0];
                        }
                    }

                    return {
                        etape: item.etape,
                        date: dateValue
                    };
                });

            if (etapesToUpdate.length === 0) {
                // console.log("Aucune étape à mettre à jour");
                return;
            }

            for (const item of etapesToUpdate) {
                await storeUpdateEtape.updateEtape(ammDsCode, item.date, item.etape);
            }
        };

        const updateFournir = async () => {
            const fournirsToUpdate = list_dossierafournir.value
                .filter(e => e.etat_fournir === 1)
                .map(item => {
                    let dateValue = null;

                    if (item.ligne_date) {
                        const dateObj = new Date(item.ligne_date);
                        if (!isNaN(dateObj.getTime())) {
                            dateValue = dateObj.toISOString().split('T')[0];
                        }
                    }

                    return {
                        dossierLcode: item.ligne_dossier_code,
                        date: dateValue
                    };
                });

            // console.log(fournirsToUpdate);

            if (fournirsToUpdate.length === 0) {
                // console.log("Aucune étape à mettre à jour");
                return;
            }

            for (const item of fournirsToUpdate) {
                await storeUpdateFournir.updateFournir(ammDsCode, item.date, item.dossierLcode);
            }
        };

        // Lors de l'ajout ou modification de réclamations
        const onSaveReclam = (newReclams) => {
            newReclams.forEach(newItem => {
                // Cherche si cette réclamation existe déjà
                const existing = listReclamation.value.find(r => r.lib_recl === newItem.lib_recl);

                if (existing) {
                    // Si la date est différente → marquer pour update
                    const oldDate = existing.amm_recl_date
                        ? new Date(existing.amm_recl_date).toISOString().split('T')[0]
                        : null;
                    const newDate = newItem.amm_recl_date
                        ? new Date(newItem.amm_recl_date).toISOString().split('T')[0]
                        : null;

                    if (oldDate !== newDate) {
                        existing.amm_recl_date = newItem.amm_recl_date;
                        existing.nb_reclam = newItem.nb_reclam;
                        existing.etat_reclam = 1; // 🔸 1 = à mettre à jour
                    }
                } else {
                    // Sinon c’est une nouvelle réclamation → insert
                    listReclamation.value.push({
                        ...newItem,
                        etat_reclam: 2, // 🔹 2 = à insérer
                    });
                }
            });
        };

        const updateReclam = async () => {
            const reclamsToUpdate = listReclamation.value
                .filter(e => e.etat_reclam === 1)
                .map(item => {
                    let dateValue = null;
                    if (item.amm_recl_date) {
                        const dateObj = new Date(item.amm_recl_date);
                        if (!isNaN(dateObj.getTime())) {
                            dateValue = dateObj.toISOString().split('T')[0];
                        }
                    }

                    // On n'envoie annule_reclam que si l'utilisateur a cliqué sur "Annuler"
                    const annuleToSend = item._annuleTouched ? item.annule_reclam : undefined;

                    return {
                        code: item.lib_recl,
                        date: dateValue,
                        annule_reclam: annuleToSend // undefined = pas de param envoyé (voir store)
                    };
                });

            if (reclamsToUpdate.length === 0) return;

            for (const item of reclamsToUpdate) {
                // Appelle le store qui construit la requête axios proprement
                await storeUpdateReclam.updateReclam(ammDsCode, item.date, item.code, item.annule_reclam);
            }

            lignesModifiees.value = [];
        };

        const insertReclam = async () => {
            const reclamsToInsert = listReclamation.value
                .filter(e => e.etat_reclam === 2)
                .map(item => {
                    let dateValue = null;

                    if (item.date_nbre_reclam) {
                        const dateObj = new Date(item.date_nbre_reclam);
                        if (!isNaN(dateObj.getTime())) {
                            dateValue = dateObj.toISOString().split('T')[0];
                        }
                    }

                    return {
                        code: item.lib_recl,
                        date: dateValue,
                        nb_reclam: item.nb_reclam,
                        amm_recl_recl: item.amm_recl_recl
                    };
                });

            if (reclamsToInsert.length === 0) return;

            // 🔹 Un seul appel pour tout le tableau
            await storeUpdateReclam.InsertReclam(ammDsCode, reclamsToInsert);
        };

        const getEtape = async () => {
            await storeGetEtape.getEtapeList(ammDsCode);
            listEtape.value = storeGetEtape.etapeLists;
        }

        const getFournir = async () => {
            await storeGetFournir.getListFournir(ammDsCode);
            listNewFournir.value = storeGetFournir.fournirLists;
        }

        const decision_motif = ref('')  // Variable pour le texte combiné
        const date_motif = ref('')      // Variable pour la date

        const getMotif = async () => {
            await storeGetMotif.getListMotif(ammDsCode);
            listMotif.value = storeGetMotif.listMotifs;

            if (listMotif.value.length > 0) {
                const item = listMotif.value[0];

                if (item.amm_motif_decision && item.amm_motif_decision.trim() !== "") {
                    decision_motif.value = `${item.amm_motif_decision}`;
                } else {
                    decision_motif.value = ""; // rien si vide ou null
                }

                date_motif.value = item.amm_date_decision;
            }
        };


        const getAmmDossier = async () => {
            await storeGetMotif.fetchListAmmDossier(ammDsCode);
            amm_reclam.value = storeGetMotif.listAmmdossiers;
            amm_type.value = storeGetMotif.listAmmdossiers;
            amm_ref_variation.value = storeGetMotif.listAmmdossiers;
        }

        onMounted(async () => {
            await listArticle();
            await getEtape();
            await getFournir();
            await getMotif();
            await getAmmDossier();
            await listResponsable();

            // console.log(amm_reclam.value)
            // console.log(listMotif.value)
            // console.log('decision_motif:', decision_motif)
            // console.log('date_motif:', date_motif)

        })

        const headers = [
            { title: 'CODE ARTICLE', align: 'start', key: 'code_article', sortable: false },
            { title: 'LIBELLE', align: 'start', key: 'libelle_article', sortable: false },
            { title: 'TITULAIRE', align: 'start', key: 'titulaire', sortable: false },
            { title: 'FABRICANT', align: 'start', key: 'fabricant', sortable: false },
            // { title: 'ART WORK', align: 'start', key: 'ligne_image', sortable: false, width: "200px" },
            //{ title: 'NUMERO AMM', align: 'start', key: 'num_amm', sortable: false },
            // { title: '', align: 'center', key: 'actions' },
        ]

        // if (props.decisiondet === 'ACCORDE') {
        //     headers.push({ title: 'NUMERO AMM', align: 'start', key: 'num_amm', sortable: false });
        //     headers.push({ title: 'DATE AMM', align: 'start', key: 'date_amm', sortable: false });
        // }

        if (props.decisiondet === 'ACCORDE') {
            if (props.typedet !== 'VARIATION') {
                headers.push({ title: 'NUMERO AMM', align: 'start', key: 'num_amm', sortable: false });
                headers.push({ title: 'DATE AMM', align: 'start', key: 'date_amm', sortable: false });
            }
        }

        const headers_etape = [
            { title: 'ETAPE', align: 'start', key: 'etape', sortable: false },
            // { title: 'ETAT', align: 'start', key: 'etat', sortable: false },
            { title: 'DATE ', align: 'start', key: 'date_etape', sortable: false },
            // { title: 'AUTO ', align: 'start', key: 'auto', sortable: false },
            // { title: '', align: 'center', key: 'actions' },
        ]

        const headers_fournir = [
            // { title: 'DOSSIER A FOURNIR', align: 'start', key: 'ligne_dossier_code', sortable: false },
            { title: 'DOSSIER A FOURNIR', align: 'start', key: 'dossier_lib', sortable: false },
            { title: 'DATE', align: 'start', key: 'ligne_date', sortable: false },
            // { title: '', align: 'center', key: 'actions' },
        ]

        const headers_action = [
            { title: 'DATE', align: 'start', key: 'amm_histo_date', sortable: false },
            { title: 'HISTORIQUE', align: 'start', key: 'amm_histo_comment', sortable: false },
            // { title: '', align: 'center', key: 'actions' },
        ]

        const headers_reclamation = [
            { title: 'RECLAMATION', align: 'start', key: 'lib_recl', sortable: false },
            // { title: 'NBRE RECLAM', align: 'start', key: 'nb_reclam', sortable: false },
            // { title: 'DATE DU NBRE RECLAM', align: 'start', key: 'amm_date_nbre_reclam', sortable: false },
            // { title: '', align: 'start', key: 'action_annuler', sortable: false },
            { title: 'DATE', align: 'start', key: 'amm_recl_date', sortable: false },

            // { title: '', align: 'center', key: 'actions' },
        ]

        const headers_variation = [
            { title: 'VARIATION', align: 'start', key: 'var_libelle', sortable: false },
            // { title: 'DATE', align: 'start', key: 'amm_recl_date', sortable: false },

            // { title: '', align: 'center', key: 'actions' },
        ]


        // 🔹 Header dynamique : supprime "NUMERO AMM" si tous les num_amm sont vides
        const computedHeaders = computed(() => {
            const hasNumAmm = listArticles.value.some(
                (item) => item.num_amm && item.num_amm.trim() !== ''
            )
            return hasNumAmm
                ? headers.value
                : headers.value.filter((h) => h.key !== 'num_amm')
        })


        const listArticle = async () => {
            await storeArticle.fetchListArticleDetail(ammDsCode);
            list_article.value = storeArticle.listarticledetails;
            list_etape.value = storeArticle.listetapedetails;
            list_dossierafournir.value = storeArticle.listdossierafournirs;
            list_histo.value = storeArticle.listHistos;
            listReclamation.value = storeArticle.listReclams;
            listVariation.value = storeArticle.listVariations;

        };


        const addDate = (item) => {
            // console.log("Ajout de date pour :", item)
            currentItem.value = item;
            // selectedDate.value = null;
            selectedDate.value = new Date();
            showDateDialog.value = true

        }

        const addDateFournir = (item) => {
            // console.log("Ajout de date pour :", item)
            currentItemFournir.value = item;
            // selectedDateFournir.value = null;
            selectedDateFournir.value = new Date();
            showDateDialogFournir.value = true
        }

        const addDateReclam = (item) => {
            // console.log("Ajout de date pour :", item)
            currentItemReclam.value = item;
            // selectedDateFournir.value = null;
            selectedDateReclam.value = new Date();
            showDateDialogReclam.value = true
        }

        // Fonction pour autoriser seulement les dates <= aujourd'hui
        const allowedDates = (date) => {
            const today = new Date()
            const d = new Date(date)
            return d <= today
        }

        // const onDoubleClick = () => {
        // if (!selectedDate.value || !allowedDates(selectedDate.value)) {
        //     return;
        // }
        // saveDate();
        // };



        const saveDate = () => {
            if (currentItem.value && selectedDate.value) {
                let dateString;

                if (typeof selectedDate.value === "string") {
                    dateString = selectedDate.value;
                } else if (selectedDate.value instanceof Date) {
                    const d = selectedDate.value;
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const day = String(d.getDate()).padStart(2, "0");
                    dateString = `${year}-${month}-${day}`;
                }

                currentItem.value.date_etape = dateString;
                currentItem.value.etat = 1;
            }

            showDateDialog.value = false;
        };

        const saveDateFournir = () => {
            if (currentItemFournir.value && selectedDateFournir.value) {
                let dateString;

                if (typeof selectedDateFournir.value === "string") {
                    dateString = selectedDateFournir.value;
                } else if (selectedDateFournir.value instanceof Date) {
                    const d = selectedDateFournir.value;
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const day = String(d.getDate()).padStart(2, "0");
                    dateString = `${year}-${month}-${day}`;
                }

                currentItemFournir.value.ligne_date = dateString;
                currentItemFournir.value.etat_fournir = 1;
            }

            showDateDialogFournir.value = false;
        };

        const saveDateReclam = () => {
            if (currentItemReclam.value && selectedDateReclam.value) {
                let dateString;

                if (typeof selectedDateReclam.value === "string") {
                    dateString = selectedDateReclam.value;
                } else if (selectedDateReclam.value instanceof Date) {
                    const d = selectedDateReclam.value;
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const day = String(d.getDate()).padStart(2, "0");
                    dateString = `${year}-${month}-${day}`;
                }

                currentItemReclam.value.amm_recl_date = dateString;
                currentItemReclam.value.etat_reclam = 1; // important pour que updateReclam le prenne
            }

            showDateDialogReclam.value = false;
        };


        // Fonction pour calculer filteredEtapes au clic sur "Nouveau"

        const newEtape = () => {
            selectedEtape.value = {};
            const etapesDejaAjoutees = list_etape.value.map(e => e.etape);

            filteredEtapes.value = listEtape.value.filter(
                e => !etapesDejaAjoutees.includes(e.etape_dossier || e.value || e.etape)
            );
            dialogNewEtape.value = true;
        };

        const newFournir = () => {
            selectedFournir.value = {};
            dialogNewFournir.value = true;
        }

        const newHisto = () => {
            // selectedFournir.value = {};
            dialogNewHisto.value = true;
        }

        const newReclam = () => {
            // selectedFournir.value = {};
            dialogNewReclam.value = true;
        }
        const newVariation = () => {
            // selectedFournir.value = {};
            dialogNewVariation.value = true;
        }

        const onAnnulerNewEtape = async () => {
            dialogNewEtape.value = false;
        };

        const onAnnulerNewFournir = async () => {
            dialogNewFournir.value = false;
        };

        const onAnnulerNewHisto = async () => {
            dialogNewHisto.value = false;
        };

        const onAnnulerVariation = async () => {
            dialogNewVariation.value = false;
        };

        const onSaveEtapes = (etape) => {
            if (etape && etape.value) {  // Vérifie qu'il y a bien une sélection
                list_etape.value.push({
                    etape: etape.value,
                    date_etape: etape.date,
                    etat: 2
                });
                selectedEtape.value = null;
                dialogNewEtape.value = false;
            }
        }

        const insertEtapes = async () => {
            const etapesToInsert = list_etape.value
                .filter(e => e.etat === 2)
                .filter((e, index, self) =>
                    index === self.findIndex(t => t.etape === e.etape)
                )
                .map(e => ({
                    etape: e.etape,
                    date: e.date_etape
                }));
            if (etapesToInsert.length === 0) {
                return;
            }
            try {
                await storeInsertEtape.insertEtape(ammDsCode, Etat, etapesToInsert);
                list_etape.value.forEach(e => {
                    if (e.etat === 2) e.etat = 1; // 1 = déjà inséré
                });
            } catch (error) {
                console.error("Erreur lors de l'insertion des étapes :", error);
            }
        };

        const onSaveHisto = async (payload) => {
            if (payload && payload.date && payload.text) {  // Vérifie qu'il y a bien des données
                list_histo.value.push({
                    amm_histo_date: payload.date,
                    amm_histo_comment: payload.text,
                    etat_comment: 2
                });
                dialogNewHisto.value = false;
            }
        };

        const onSaveVariation = async (payload) => {
            if (payload && payload.text) {  // Vérifie qu'il y a bien des données
                listVariation.value.push({
                    var_libelle: payload.text,
                    etat_comment: 2
                });
                dialogNewVariation.value = false;
            }
        };

        // Fonction pour gérer insert/update
        const insertVariation = async () => {
            const variationToInsert = listVariation.value.filter(h => h.etat_comment === 2);
            const variationToUpdate = listVariation.value.filter(h => h.etat_comment === 1);

            try {
                // INSERT
                if (variationToInsert.length > 0) {
                    // console.log("Historiques à insérer :", histoToInsert);
                    await storeInsertHisto.insertVariation(ammDsCode, variationToInsert);

                    // Après insert, on bascule l'état à 1
                    listVariation.value.forEach(h => {
                        if (h.etat_comment === 2) h.etat_comment = 1;
                    });
                }

                // UPDATE
                if (variationToUpdate.length > 0) {
                    // console.log("Historiques à mettre à jour :", histoToUpdate);
                    await storeUpdateHisto.updateHisto(ammDsCode, variationToUpdate);
                    // Après update, on reste à 1
                }

            } catch (error) {
                console.error("Erreur lors du traitement des variations :", error);
            }
        };

        // Fonction pour gérer insert/update
        const insertHisto = async () => {
            const histoToInsert = list_histo.value.filter(h => h.etat_comment === 2);
            const histoToUpdate = list_histo.value.filter(h => h.etat_comment === 1);

            try {
                // INSERT
                if (histoToInsert.length > 0) {
                    // console.log("Historiques à insérer :", histoToInsert);
                    await storeInsertHisto.insertHisto(ammDsCode, histoToInsert);

                    // Après insert, on bascule l'état à 1
                    list_histo.value.forEach(h => {
                        if (h.etat_comment === 2) h.etat_comment = 1;
                    });
                }

                // UPDATE
                if (histoToUpdate.length > 0) {
                    // console.log("Historiques à mettre à jour :", histoToUpdate);
                    await storeUpdateHisto.updateHisto(ammDsCode, histoToUpdate);
                    // Après update, on reste à 1
                }

            } catch (error) {
                console.error("Erreur lors du traitement des historiques :", error);
            }
        };

        const onSaveFournirs = async (selectedFournir) => {
            if (!selectedFournir || !selectedFournir.value) return;

            // On retrouve l’élément complet depuis la liste
            const fullItem = listNewFournir.value.find(
                d => d.dossier_code === selectedFournir.value
            );

            const newItem = {
                ligne_dossier_code: selectedFournir.value,          // code pour la BDD
                dossier_lib: fullItem ? fullItem.dossier_lib : "",  // libellé pour affichage
                ligne_date: selectedFournir.date || null,
                etat_fournir: 2
            };

            list_dossierafournir.value.push(newItem);

            // console.log("Item ajouté :", newItem);
            // retirer l'élément sélectionné de la liste
            listNewFournir.value = listNewFournir.value.filter(
                d => d.dossier_code !== selectedFournir.value
            );

            dialogNewFournir.value = false;
        };

        const insertFournir = async (selectedFournir) => {

            // On sépare les éléments à insérer et à mettre à jour
            const fournirToInsert = list_dossierafournir.value.filter(f => f.etat_fournir === 2);
            const fournirToUpdate = list_dossierafournir.value.filter(f => f.etat_fournir === 1);

            try {
                // INSERT
                if (fournirToInsert.length > 0) {
                    // console.log("Fournirs à insérer :", fournirToInsert);
                    await storeInsertFournir.insertFournir(ammDsCode, fournirToInsert);

                    // Après insert, on bascule l'état à 1
                    list_dossierafournir.value.forEach(f => {
                        if (f.etat_fournir === 2) f.etat_fournir = 1;
                    });
                }

                // UPDATE
                if (fournirToUpdate.length > 0) {
                    // console.log("Fournirs à mettre à jour :", fournirToUpdate);
                    // await storeUpdateFournir.updateFournir(ammDsCode, fournirToUpdate);
                    // Après update, on reste à 1
                }

            } catch (error) {
                console.error("Erreur lors du traitement des fournirs :", error);
            }

            // await storeInsertFournir.insertFournir(ammDsCode, selectedFournir.value);
        };

        function deleteDate(item) {
            const index = list_etape.value.indexOf(item);
            if (index !== -1) {
                list_etape.value[index].date_etape = null; // supprime la date
                list_etape.value[index].etat = 1;          // marque l'étape pour update
            }
        }

        function deleteDateFournir(item) {
            const index = list_dossierafournir.value.indexOf(item);
            if (index !== -1) {
                list_dossierafournir.value[index].ligne_date = null; // supprime la date
                list_dossierafournir.value[index].etat_fournir = 1;          // marque l'étape pour update
            }
        }

        function deleteDateReclam(item) {
            const index = listReclamation.value.indexOf(item);
            if (index !== -1) {
                listReclamation.value[index].amm_recl_date = null; // supprime la date
                listReclamation.value[index].etat_reclam = 1;          // marque l'étape pour update
            }
        }


        function deleteComment(item) {
            const index = list_histo.value.findIndex(h => h.amm_histo_seq === item.amm_histo_seq);
            if (index !== -1) {
                // Optionnel : vider le commentaire avant de supprimer
                list_histo.value[index].amm_histo_comment = null;
                list_histo.value[index].etat_comment = 1;

                // Supprime la ligne du tableau
                list_histo.value.splice(index, 1);
            }
        }

        const formatDate = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }
        };

        const isReadOnly = computed(() => {
            return ammDecision && ammDecision.trim() !== '';
        });

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

        // convertir et formatter en jj/MM/yyyy
        const dateCre = computed(() => {
            if (!props.datecre) return "";
            const d = new Date(props.datecre);
            return d.toLocaleDateString("fr-FR");
        });

        const dateDepuis = computed(() => {
            if (!props.datedepuis) return "";
            const d = new Date(props.datedepuis);
            return d.toLocaleDateString("fr-FR");
        });

        const onAnnulerReclam = async () => {
            dialogNewReclam.value = false;
        };

        // Liste globale des lignes modifiées
        const lignesModifiees = ref([]);

        // Fonction lorsqu'on clique sur "Annuler"
        const annuler_reclam = (item) => {
            item.action_annuler = "Réclamation annulée";
            item.annule_reclam = 1;
            item.etat_reclam = 1;

            // marque que l'annulation a été touchée explicitement
            item._annuleTouched = true;

            // Vérifie si la ligne n'est pas déjà dans la liste des lignes modifiées
            if (!lignesModifiees.value.includes(item)) {
                lignesModifiees.value.push(item);
            }

            // console.log("Lignes modifiées :", lignesModifiees.value);
        };

        return {
            dialogVisible, headers, headers_etape, headers_fournir, headers_action, headers_reclamation, headers_variation, annuler, closeDetail, save, user,
            ammDsCode, ammRespDet, ammtype, ammSeq, ammDecision, tab, valueOfrespDet, valueOftype, updateDossier, list_article, list_etape, list_dossierafournir, list_histo, valueOfclass,
            addDate, showDateDialog, selectedDate, newEtape, dialogNewEtape, onAnnulerNewEtape,
            listEtape, onSaveEtapes, selectedEtape, insertEtapes, Etat,
            dialogNewFournir, newFournir, onAnnulerNewFournir, listNewFournir, selectedFournir, onSaveFournirs, insertFournir, addDateFournir, showDateDialogFournir, selectedDateFournir, updateFournir,
            showDateDialogReclam, addDateReclam, selectedDateReclam, updateReclam, insertReclam,
            dialogNewHisto, onAnnulerNewHisto,
            saveDate, saveDateFournir, saveDateReclam,
            Etape, DateNew, listeEtapeDates, updateEtape,
            filteredEtapes, deleteDate, deleteDateFournir, deleteDateReclam,
            newHisto, onSaveHisto, insertHisto, deleteComment,
            newVariation, dialogNewVariation, onAnnulerVariation,
            isSaving, ammEtape,
            isReadOnly, allowedDates, formatDate,
            listMotif, decision_motif, date_motif,
            list_reclam, listReclamation, amm_reclam, amm_type, amm_ref_variation, listVariation,
            list_respo, dateCre, dateDepuis,
            onSaveVariation, insertVariation,
            handleFileSelected, updateLigneArticle,
            dialogNewReclam, newReclam, onAnnulerReclam, onSaveReclam,
            annuler_reclam, lignesModifiees,
            dialogMotif,
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
    font-weight: bold;
}

.centered-chip {
    margin: 0 auto;
}

.radio-border {
    border: 1px solid #727573;
    border-radius: 8px;
    padding: 0px;
    margin-top: -25px;
    display: flex;
    align-items: stretch;
    height: auto;
    background-color: #fff;
}

.blurred {
    filter: blur(5px);
    transition: filter 0.3s;
}

.swal2-btn-confirm {
    color: white !important;
    /* texte blanc */
    background-color: #3085d6;
    /* optionnel : couleur bouton bleu */
}

.swal2-btn-cancel {
    color: white !important;
    /* texte blanc */
    background-color: #d33;
    /* optionnel : couleur bouton rouge */
}
</style>