<template>
    <div style="min-width: max-content;">


        <v-data-table class="rh_header" :headers="headers" :items="items" :fixed-header="true" v-if="!loading"
            :loading="loading" density="compact" hide-default-footer hover="true" no-data-text="Pas données disponibles"
            :items-per-page="-1" :row-props="rowColor" height="450">

            <!-- <v-data-table :class="['blue-header', { 'grouped-table': hasGroupedHeaders }]" :headers="headers" :items="items"
            :fixed-header="true" v-if="!loading" :loading="loading" density="compact" hide-default-footer 
            hover="true" no-data-text="Pas données disponibles" :items-per-page="-1" :row-props="rowColor"
            height="650px"> -->


            <template v-slot:[`item.poste_telephonique`]="{ item }">
                <div class="cell-center">
                    <v-checkbox v-model="item.poste_telephonique" :true-value="1" :false-value="0" hide-details
                        density="compact"
                        @update:model-value="val => onCheckboxChange(item, 'poste_telephonique', val)" />
                </div>
            </template>

            <template v-slot:[`item.empl_date_naiss`]="{ item }">
                {{ formatDate(item.empl_date_naiss) }}
            </template>

            <!-- <template v-slot:[`item.empl_prise_fonction`]="{ item }">
                {{ formatDate(item.empl_prise_fonction) }}
                <br>
                <b>({{item.mobilite_interne }})</b>
            </template> -->

            <!-- <template v-slot:[`item.empl_prise_fonction`]="{ item }">
                {{ formatDate(item.empl_prise_fonction) }}
                <template
                    v-if="item.mobilite_interne && String(item.mobilite_interne).trim() && String(item.mobilite_interne).toLowerCase() !== 'null'">
                    <br>
                    <b>({{ item.mobilite_interne }})</b>
                </template>
            </template> -->

            <template v-slot:[`item.empl_prise_fonction`]="{ item }">
                {{ formatDate(item.empl_prise_fonction) }}
                <template
                    v-if="item.mobilite_interne && String(item.mobilite_interne).trim() && String(item.mobilite_interne).toLowerCase() !== 'null'">
                    <br>
                    <b class="mobilite-interne">({{ item.mobilite_interne }})</b>
                </template>
            </template>

            <template v-slot:[`item.empl_date_fin_essai1`]="{ item }">
                {{ formatDate(item.empl_date_fin_essai1) }}
            </template>

            <template v-slot:[`item.empl_date_embauche`]="{ item }">
                {{ formatDate(item.empl_date_embauche) }}
            </template>

            <template v-slot:[`item.empl_etat`]="{ item }">
                <b>{{ item.empl_etat }}</b>
                <template v-if="item.empl_etat !== 'CONFIRME'">
                    <br>
                    ({{ formatDate(item.empl_date_fin_essai1) }})
                </template>
            </template>



            <template v-slot:[`item.empl_date_fin_essai2`]="{ item }">
                {{ formatDate(item.empl_date_fin_essai2) }}
            </template>

            <template v-slot:[`item.empl_matricule`]="{ item }">
                <v-btn v-if="!item.empl_matricule && !String(item.empl_matricule || '').trim()" variant="flat"
                    size="x-small" color="#FFAB91" @click="action1PItem(item)" style="width:80px;color: black;">
                    {{ action1 }}
                </v-btn>

                <span v-else>
                    <span style="display: inline-block; line-height: 1">
                        <v-btn @click="actionDetail(item)" @mouseenter="showTooltip($event, 'Détail Employe')"
                            @mouseleave="hideTooltip" variant="text"
                            style="padding: 0;justify-content: flex-start;min-width: 100%;line-height: 1;"
                            class="btn-no-padding">
                            {{ item.empl_matricule }}
                        </v-btn>
                    </span>
                </span>
            </template>

            <template v-slot:[`item.empl_nom`]="{ item }">
                <span style="display: inline-block; line-height: 1">
                    <v-btn @click="actionDetail(item)" @mouseenter="showTooltip($event, 'Détail Employé')"
                        @mouseleave="hideTooltip" variant="text"
                        style="padding: 0;justify-content: flex-start;min-width: 100%;line-height: 1;"
                        class="btn-no-padding">
                        {{ item.empl_nom }}
                    </v-btn>
                </span>
            </template>



            <template v-slot:[`item.action`]="{ item }">
                <div class="d-flex align-center ga-1">

                    <!-- MODIFIER -->
                    <v-btn icon size="small" variant="text" color="primary" title="Modifier" @click="editItem(item)">
                        <v-icon size="20">
                            mdi-pencil
                        </v-icon>
                    </v-btn>

                    <!-- SUPPRIMER -->
                    <v-btn icon size="small" variant="text" color="error" title="Supprimer" @click="deleteItem(item)">
                        <v-icon size="20">
                            mdi-delete
                        </v-icon>
                    </v-btn>

                </div>
            </template>


            <!-- <template v-slot:[`item.mobilite`]="{ item }">
                <template v-if="item.bouton_mobilite == 1 ">
                    <v-btn size="x-small" variant="outlined" @click="openMobilite(item)">Mobilite</v-btn>
                </template>
            </template> -->

            <template v-slot:[`item.mobilite`]="{ item }">
                <template v-if="Number(item.bouton_mobilite) === 1">
                    <v-btn size="x-small" variant="outlined" @click="openMobilite(item)">
                        Mobilité
                    </v-btn>
                </template>
            </template>


        </v-data-table>

        <v-dialog v-model="dialogMobilite" max-width="950" persistent>
            <v-card color="white" class="bg-white">
                <v-card-title class="d-flex align-center text-h6 bg-green-lighten-5">
                    Mobilité interne
                    <v-spacer />
                    <v-btn icon="mdi-close" variant="text" density="comfortable" @click="closeMobilite" />
                </v-card-title>

                <v-card-text class="pb-2 bg-white">

                    <!-- ========== PARTIE HAUTE : SITUATION ACTUELLE (readonly) ========== -->
                    <div class="mobilite-bloc mobilite-bloc--ancien rounded bg-white">
                        <div class="mobilite-bandeau">
                            <v-icon size="18" class="mr-2">mdi-account-clock-outline</v-icon>
                            Situation actuelle
                        </div>

                        <div class="pa-3 mobilite-liste bg-white">
                            <div v-if="!itemsMobilite.length" class="text-center text-grey">Aucune donnée</div>

                            <div v-for="e in itemsMobilite" :key="e.empl_matricule">

                                <!-- RUBRIQUE 1 : IDENTITÉ -->
                                <!-- <div class="text-caption text-medium-emphasis mb-1">Identité</div> -->
                                <v-row dense>
                                    <v-col cols="12" sm="4" md="2">
                                        <v-text-field :model-value="e.empl_matricule" label="Matricule"
                                            variant="outlined" density="compact" hide-details readonly />
                                    </v-col>
                                    <v-col cols="12" sm="4" md="5">
                                        <v-text-field :model-value="e.empl_nom" label="Nom" variant="outlined"
                                            density="compact" hide-details readonly />
                                    </v-col>
                                    <v-col cols="12" sm="4" md="5">
                                        <v-text-field :model-value="e.empl_prenom" label="Prénom" variant="outlined"
                                            density="compact" hide-details readonly />
                                    </v-col>
                                </v-row>

                                <!-- RUBRIQUE 2 : AFFECTATION -->
                                <!-- <div class="text-caption text-medium-emphasis mt-3 mb-1">Affectation</div> -->
                                <v-row dense>
                                    <v-col cols="12" sm="5" md="5">
                                        <v-text-field :model-value="e.empl_dep" label="Département" variant="outlined"
                                            density="compact" hide-details readonly />
                                    </v-col>
                                    <v-col cols="12" sm="5" md="5">
                                        <v-text-field :model-value="e.empl_poste" label="Poste" variant="outlined"
                                            density="compact" hide-details readonly />
                                    </v-col>
                                    <v-col cols="12" sm="2" md="2">
                                        <v-text-field :model-value="e.empl_categorie" label="Catégorie"
                                            variant="outlined" density="compact" hide-details readonly />
                                    </v-col>
                                </v-row>

                            </div>
                        </div>
                    </div>

                    <!-- FLÈCHE -->
                    <div class="d-flex justify-center my-1">
                        <v-icon color="deep-purple-accent-4" size="32">mdi-arrow-down-bold</v-icon>
                    </div>

                    <!-- ========== PARTIE BASSE : NOUVELLE AFFECTATION ========== -->
                    <div class="mobilite-bloc mobilite-bloc--nouveau rounded mb-2 bg-white">
                        <div class="mobilite-bandeau mobilite-bandeau--nouveau">
                            <v-icon size="18" class="mr-2">mdi-account-arrow-right-outline</v-icon>
                            Nouvelle affectation
                        </div>

                        <div class="pa-3 bg-white">

                            <!-- RUBRIQUE 1 : AFFECTATION -->
                            <!-- <div class="text-caption text-medium-emphasis mb-1">Affectation</div> -->
                            <v-row dense>
                                <v-col cols="12" sm="5" md="5">
                                    <v-select v-model="newDep" :items="departements" :item-title="getDepartementLabel"
                                        item-value="code_departement" label="Département *" variant="outlined"
                                        density="compact" hide-details="auto" clearable color="deep-purple-accent-4"
                                        :error-messages="erreurs.newDep" @update:model-value="onNewDepChange" />
                                </v-col>
                                <v-col cols="12" sm="5" md="5">
                                    <v-select v-model="newPoste" :items="postesDisponibles" :item-title="getPosteLabel"
                                        item-value="code_poste" label="Poste *" variant="outlined" density="compact"
                                        hide-details="auto" clearable color="deep-purple-accent-4" :disabled="!newDep"
                                        :error-messages="erreurs.newPoste" />
                                </v-col>
                                <v-col cols="12" sm="2" md="2">
                                    <v-select v-model="categorieMobilite" :items="listCategories" item-title="code_cat"
                                        item-value="code_cat" label="Catégorie *" variant="outlined" density="compact"
                                        hide-details="auto" color="deep-purple-accent-4"
                                        :error-messages="erreurs.categorieMobilite" />
                                </v-col>
                            </v-row>

                            <!-- RUBRIQUE 2 : DÉTAILS DE LA MOBILITÉ -->
                            <!-- <div class="text-caption text-medium-emphasis mt-3 mb-1">Détails de la mobilité</div> -->
                            <v-row dense>
                                <v-col cols="12" sm="4" md="2">
                                    <v-text-field v-model="dateMobilite" label="Date *" type="date" variant="outlined"
                                        density="compact" hide-details="auto" color="deep-purple-accent-4"
                                        :error-messages="erreurs.dateMobilite" />
                                </v-col>

                                <v-col cols="12" sm="8" md="3">
                                    <v-select v-model="typeMobilite" :items="listTypeMobilites" item-title="type"
                                        item-value="type" label="Type *" variant="outlined" density="compact"
                                        hide-details="auto" color="deep-purple-accent-4"
                                        :error-messages="erreurs.typeMobilite" />
                                </v-col>

                                <v-col cols="12" md="7">
                                    <v-textarea v-model="motif" label="Description *" rows="1" max-rows="3" auto-grow
                                        variant="outlined" density="compact" hide-details="auto"
                                        color="deep-purple-accent-4" :error-messages="erreurs.motif" />
                                </v-col>
                            </v-row>

                        </div>
                    </div>
                </v-card-text>

                <v-card-actions class="bg-white">
                    <v-spacer />
                    <v-btn variant="text" @click="closeMobilite">Annuler</v-btn>
                    <v-btn color="primary" variant="flat" :disabled="!formValide" @click="saveMobilite">
                        Enregistrer
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>











    </div>
    <div class="summary-line">
        {{ employees.length }} employé<span v-if="employees.length > 1">s</span>
        trouvée<span v-if="employees.length > 1">s</span>
    </div>
</template>
<script>
import { defineComponent } from 'vue';
import {
    VDataTableVirtual,
    VDataTable,
    VDataTableServer,
} from "vuetify/lib/components";
import { useAlerteStore } from "@/store/utils/alerte.js"
import { ref, onMounted, onBeforeMount, computed, reactive } from 'vue';
import dayjs from 'dayjs';
import { useDemande } from "@/store/Rh/rh_demande";
import { useCV } from "@/store/Rh/rh_cv";

import { useEmployeeStore } from "@/store/Rh/rh_employee";



export default defineComponent({
    components: {
        VDataTable,
        VDataTableServer,
        VDataTableVirtual,
    },
    emits: ['action1Item', 'action2Item', 'handleCheckboxClick', 'checkbox-change', 'editItem', 'deleteItem'],

    props: {
        employees: { type: Array, required: true },
        headers: Object,
        items: Array,
        headerColor: {
            String,
            default: 'blue'
        },

        loading: {
            type: Boolean,
            default: false
        },
        color2: {
            type: String,
            default: "#FFF8E1"
        },
        action1: String,
        action2: String,
        action3: String,
        titre_list: String,
        itemslist: Object,
        header_text: String,
        alerte: String,
        etape: String,

        showAction1: {
            type: Boolean,
            default: false
        },

        showAction3: {
            type: Boolean,
            default: false
        },
        showNbLigne: {
            type: Boolean,
            default: true
        },

        checkboxKeys: {
            type: Array,
            default: () => []
        },
    },
    defaults: {
        VDataTable: {
            fixedHeader: true,
            noDataText: 'Pas de resultats',
        },
    },

    setup(props, { emit }) {
        const showNbLignes = ref(props.showNbLigne);

        const hasGroupedHeaders = computed(() => {
            return (props.headers || []).some(h => Array.isArray(h.children) && h.children.length);
        });

        const onCheckboxChange = (item, key, val) => {
            const value = val ? 1 : 0;
            item[key] = value; // mise à jour visuelle immédiate
            emit('checkbox-change', { item, key, value });
        };

        // showNbLignes.value = props.showNbLigne
        const storeAlert = useAlerteStore();

        const action1PItem = (item) => {
            emit('action1Item', item);
        };

        const getColor = (valeur) => {
            if (valeur.trim() == "OR") return '#ff66ff';
            else if (valeur.trim() == "ARGENT") return '#ffff00';
            else if (valeur.trim() == "BRONZE") return '#99ffff';
            else if (valeur.trim() == "FER") return '#c0c0c0';
        };

        onMounted(async () => {
            await listCategorie()
            await listTypeMobilite()
        })


        const rowColor = (props) => {
            const item = props.item;

            const isRetour =
                (item.liv_chauf && item.liv_chauf.includes('RETOUR')) ||
                (item.liv_voit && item.liv_voit.includes('RETOUR'));

            if (isRetour) {
                return { class: 'redCar-bg' };
            }

            if (item.xcode === '11111' && !isRetour) {
                return { class: 'colorCar-bg' };
            }

            return {};
        };

        const formatDate = (date) => {
            if (date) return dayjs(date).format("DD/MM/YYYY");
            return "";
        };

        const editItem = (item) => {
            emit('editItem', item);
        };

        const deleteItem = (item) => {
            emit('deleteItem', item);
        };

        const actionDetail = (item) => {
            emit("actionDetail", item);
        };

        const tooltip = ref();
        // Fonction pour afficher l'info-bulle
        const showTooltip = (event, message) => {
            if (tooltip.value) {
                hideTooltip();
            }

            const div = document.createElement("div");
            div.id = "tooltip";
            div.innerText = message;
            div.style.position = "absolute";
            div.style.backgroundColor = "#333";
            div.style.color = "#fff";
            div.style.padding = "5px 10px";
            div.style.borderRadius = "4px";
            div.style.fontSize = "12px";
            div.style.pointerEvents = "none";
            div.style.top = `${event.clientY + 10}px`;
            div.style.left = `${event.clientX + 10}px`;
            div.style.zIndex = "1000";

            document.body.appendChild(div);
            tooltip.value = div;
        };

        const hideTooltip = () => {
            if (tooltip.value) {
                tooltip.value.remove();
                tooltip.value = null;
            }
        };

        const storeDemande = useDemande();

        const departements = ref([]);
        const postesParDep = reactive({}); // { code_departement: [postes] }

        const getDepartementLabel = (item) => {
            if (!item) return "";
            return (
                item.lib_dep ||
                item.libelle_departement ||
                item.nom_departement ||
                item.departement ||
                item.lib_departement ||
                item.code_departement
            );
        };

        const getPosteLabel = (item) => {
            if (!item) return "";
            return (
                item.libelle_poste ||
                item.poste_libelle ||
                item.nom_poste ||
                item.intitule_poste ||
                item.poste ||
                item.code_poste ||
                ""
            );
        };

        // Charger les départements (une seule fois)
        const listDepartements = async () => {
            if (departements.value.length) return;
            await storeDemande.fetchDepartement();
            departements.value = storeDemande.listDepartements;
        };

        const listCategories = ref([])
        const storec = useCV();

        const storeEmploye = useEmployeeStore();
        const listTypeMobilites = ref([]);

        const listCategorie = async () => {
            await storec.fetchListCategorie();
            listCategories.value = storec.listcategories;
        };

        const listTypeMobilite = async () => {
            await storeEmploye.fetchListTypeMobilite();
            listTypeMobilites.value = storeEmploye.listMobilites;
        };








        const dialogMobilite = ref(false);
        const motif = ref('');
        const dateMobilite = ref('');
        const typeMobilite = ref(null);
        const categorieMobilite = ref(null);   // était utilisée dans le template mais non déclarée
        const newDep = ref(null);
        const newPoste = ref(null);
        const submitted = ref(false);          // devient true après le 1er clic sur Enregistrer
        const employeSelectionne = ref(null);  // l'employé sur lequel on a cliqué

        // "Situation actuelle" = uniquement l'employé choisi
        const itemsMobilite = computed(() =>
            employeSelectionne.value ? [employeSelectionne.value] : []
        );

        // Postes proposés = postes du département choisi, sans le poste actuel de l'employé
        const postesDisponibles = computed(() => {
            const liste = postesParDep[newDep.value] || [];
            const posteActuel = employeSelectionne.value?.empl_poste;
            if (!posteActuel) return liste;

            const actuel = String(posteActuel).trim().toLowerCase();

            return liste.filter(p => {
                const code = String(p.code_poste ?? '').trim().toLowerCase();
                const libelle = String(getPosteLabel(p) ?? '').trim().toLowerCase();
                return code !== actuel && libelle !== actuel;
            });
        });


        // Messages d'erreur par champ (vides tant qu'on n'a pas cliqué sur Enregistrer)
        const erreurs = computed(() => {
            if (!submitted.value) return {};
            const requis = 'Champ obligatoire';
            const e = {};
            if (!newDep.value) e.newDep = requis;
            if (!newPoste.value) e.newPoste = requis;
            if (!dateMobilite.value) e.dateMobilite = requis;
            if (!categorieMobilite.value) e.categorieMobilite = requis;
            if (!typeMobilite.value) e.typeMobilite = requis;
            if (!motif.value || !motif.value.trim()) e.motif = requis;
            return e;
        });

        const formValide = computed(() =>
            itemsMobilite.value.length > 0 &&
            !!newDep.value &&
            !!newPoste.value &&
            !!dateMobilite.value &&
            !!categorieMobilite.value &&
            !!typeMobilite.value &&
            !!(motif.value && motif.value.trim())
        );

        const resetForm = () => {
            motif.value = '';
            dateMobilite.value = dayjs().format('YYYY-MM-DD');
            typeMobilite.value = null;
            categorieMobilite.value = null;
            newDep.value = null;
            newPoste.value = null;
            submitted.value = false;
        };

        const openMobilite = async (item) => {
            employeSelectionne.value = item;
            resetForm();
            dialogMobilite.value = true;
            await listDepartements();
        };

        const closeMobilite = async () => {
            dialogMobilite.value = false;
            resetForm();
            dateMobilite.value = '';
            employeSelectionne.value = null;
            // await storeEmploye.fetchListEmployes();
        };


        const onNewDepChange = async (codeDep) => {
            newPoste.value = null;                       // le poste dépend du département

            if (!codeDep) return;                        // département vidé (clic sur le "x")
            if (postesParDep[codeDep]?.length) return;   // déjà en cache

            try {
                const postes = await storeDemande.fetchDepartementPostes(codeDep);
                // console.log('Postes reçus pour', codeDep, ':', postes);
                postesParDep[codeDep] = Array.isArray(postes) ? postes : [];
            } catch (error) {
                console.error('Erreur lors du chargement des postes :', error);
                postesParDep[codeDep] = [];
            }
        };


        const saving = ref(false);

        const saveMobilite = async () => {
            submitted.value = true;            // déclenche l'affichage des erreurs

            if (!formValide.value) {
                console.warn('Mobilité : champs obligatoires manquants', erreurs.value);
                return;
            }

            const rows = itemsMobilite.value.map(e => ({
                // --- ancienne situation ---
                empl_code: e.empl_code,
                empl_matr: e.empl_matricule,
                ancien_dep: e.empl_dep,
                ancien_poste: e.empl_poste,
                ancien_categorie: e.empl_categorie,

                // --- nouvelle situation ---
                new_dep: newDep.value,
                new_poste: newPoste.value,
                new_categorie: categorieMobilite.value,

                // --- infos mobilité ---
                date: dateMobilite.value,
                type: typeMobilite.value,
                motif: motif.value.trim(),
            }));

            try {
                saving.value = true;

                for (const row of rows) {
                    await storeEmploye.insertMobilite(row);
                }

                closeMobilite();
                // optionnel : prévenir le parent de recharger la liste (sans données)
                // emit('mobilite-saved');
                await storeEmploye.fetchListEmployes();

            } catch (error) {
                console.error('Erreur lors de l’enregistrement de la mobilité :', error);
            } finally {
                saving.value = false;
            }
        };

        return {
            action1PItem,
            getColor,
            rowColor,
            hasGroupedHeaders,
            onCheckboxChange,
            formatDate,
            editItem, deleteItem,
            actionDetail, tooltip, showTooltip, hideTooltip,

            // --- Mobilité ---
            dialogMobilite, motif, dateMobilite, typeMobilite, categorieMobilite,
            newDep, newPoste,
            itemsMobilite, employeSelectionne, postesDisponibles,
            formValide, erreurs,
            openMobilite, closeMobilite, saveMobilite,

            departements, postesParDep,
            getDepartementLabel, getPosteLabel,
            listDepartements, onNewDepChange,
            listCategories, listTypeMobilites,
            saving,
        };
    }

});
</script>


<style>
.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
    /* padding: 0 !important; */
    /* width: 1px !important;
    max-width: 1px !important; */
    overflow: hidden;
    white-space: nowrap;
}

/* v-data-table (partie haute) */
.mobilite-header .v-table__wrapper>table>thead>tr>th {
    background-color: #b8b3cc !important;
    color: #000000 !important;
    font-weight: 600;
    white-space: nowrap;
}

/* v-table (partie basse) */
.mobilite-header thead th {
    background-color: #b8b3cc !important;
    color: #000000 !important;
    font-weight: 600;
    white-space: nowrap;
}

/* cadre de chaque bloc : bordure + liseré coloré à gauche */
.mobilite-bloc {
    border: 1px solid #d1cde0;
    overflow: hidden;
}

.mobilite-bloc--ancien {
    border-left: 5px solid #ffb74d;
    /* orange : situation actuelle */
    background-color: #fffaf3;
}

.mobilite-bloc--nouveau {
    border-left: 5px solid #3fdf5a;
    /* violet : nouvelle affectation */
    background-color: #87ac8b;
}

/* bandeaux de titre */
.mobilite-bandeau {
    display: flex;
    align-items: center;
    background-color: #ffe0b2;
    color: #000000;
    font-weight: 600;
    padding: 6px 16px;
}

.mobilite-bandeau--nouveau {
    background-color: #95f4a5;
}

/* champs readonly : fond grisé pour bien les distinguer */
.mobilite-bloc--ancien :deep(.v-field) {
    background-color: #f5f0e6;
}

.mobilite-interne {
    display: inline-block;
    background-color: #c8f4cb;
    /* vert clair */
    color: #2e7d32;
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 4px;
    margin-top: 2px;
}
</style>
