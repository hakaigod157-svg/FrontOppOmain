<template>
    <v-card class="fm-card" rounded="lg">
        <!-- Barre de chargement -->
        <v-progress-linear v-if="loading" color="primary" indeterminate height="3" absolute location="top" />

        <!-- En-tête -->
        <div class="fm-header">
            <div class="d-flex align-center">

                <div class="ml-2">
                    <div class="fm-title">Nouvelle formation</div>
                </div>
            </div>
            <v-btn icon="mdi-close" variant="text" density="comfortable" @click="closeDetail" />
        </div>

        <v-card-text class="fm-body">
            <!-- Section : informations générales -->
            <div class="fm-section">
                <div class="fm-section-title">
                    <v-icon size="20" color="#33691E">mdi-information-outline</v-icon>
                    <span>Informations générales</span>
                </div>

                <v-row dense class="d-flex align-center flex-nowrap w-100">
                    <!-- Code -->
                    <v-col cols="auto" style="width: 140px;">
                        <v-text-field label="Code" v-model="newCodeDoc" variant="outlined" density="compact"
                            hide-details readonly bg-color="#F1F5EE" />
                    </v-col>

                    <!-- Date -->
                    <v-col cols="auto" style="width: 180px;">
                        <v-text-field label="Date" v-model="dateFormation" type="date" variant="outlined"
                            density="compact" hide-details />
                    </v-col>

                    <!-- Type -->
                    <v-col cols="auto" style="width: 200px;">
                        <MySelect label="TYPE" density="compact" variant="outlined" :items="list_types"
                            item-title="formation" item-value="formation" v-model="selectedType" :clearable="false"
                            hide-details />
                    </v-col>

                    <!-- Interne / Externe -->
                    <v-col cols="auto">
                        <v-radio-group v-model="selectedOrigine" density="compact" inline class="radio-inline"
                            hide-details>
                            <v-radio color="success" label="INTERNE" :value="0" />
                            <v-radio color="success" label="EXTERNE" :value="1" />
                        </v-radio-group>
                    </v-col>

                    <!-- Entité (affichée seulement si EXTERNE) -->
                    <v-col v-if="selectedOrigine === 1" cols="auto" style="width: 230px;">
                        <v-text-field label="Entité" v-model="entite" variant="outlined" density="compact"
                            prepend-inner-icon="mdi-domain" hide-details :error="!entite" />
                    </v-col>

                    <!-- Description (sur la même ligne, prend la place restante) -->
                    <v-col style="min-width: 220px;">
                        <v-text-field label="Description" v-model="description" variant="outlined" density="compact"
                            prepend-inner-icon="mdi-text-box-outline" hide-details clearable />
                    </v-col>

                    <!-- Image / Fichier -->
                    <v-col cols="auto" style="width: 120px;">
                        <v-file-input label="fichier" v-model="fichier" accept="image/*,.pdf,application/pdf"
                            variant="underlined" density="compact" prepend-icon="" prepend-inner-icon="mdi-paperclip"
                            show-size hide-details clearable @update:modelValue="onFileChange" />
                    </v-col>
                </v-row>
            </div>

            <!-- Section : participants -->
            <div class="fm-section mt-5">
                <div class="fm-section-title justify-space-between">
                    <div class="d-flex align-center ga-2">
                        <v-icon size="20" color="#33691E">mdi-account-group-outline</v-icon>
                        <span>Participants</span>
                    </div>
                    <v-chip size="small" color="success" variant="tonal" label>
                        {{ list.length }} participant{{ list.length > 1 ? 's' : '' }}
                    </v-chip>
                </div>

                <!-- Champs au-dessus du tableau -->
                <div class="fm-add-panel">
                    <v-row dense class="align-center">
                        <!-- <v-col cols="auto">
                            <v-text-field label="Matricule" v-model="matricule" variant="outlined" density="compact"
                                hide-details style="width: 200px;" clearable
                                prepend-inner-icon="mdi-badge-account-horizontal-outline" @input="convertToUpperCase"
                                @keyup.enter="addParticipant" :disabled="loading" bg-color="white"
                                :error="matricule && !employeTrouve" />
                        </v-col> -->
                        <v-col cols="auto">
                            <v-autocomplete label="Matricule" v-model="matricule" :items="employesItems"
                                item-title="matricule" item-value="matricule" :custom-filter="filterEmployes"
                                variant="outlined" density="compact" hide-details clearable style="width: 200px;"
                                prepend-inner-icon="mdi-badge-account-horizontal-outline" bg-color="white"
                                :disabled="loading" no-data-text="Aucun employé trouvé" :menu-props="{ minWidth: 380 }"
                                @keyup.enter="addParticipant">
                                <template #item="{ props, item }">
                                    <v-list-item v-bind="props" :title="item.raw.label" />
                                </template>
                            </v-autocomplete>
                        </v-col>

                        <v-col cols="auto">
                            <v-text-field label="Nom" v-model="nom" variant="outlined" density="compact" hide-details
                                style="width: 280px;" readonly bg-color="#F1F5EE" />
                        </v-col>

                        <v-col cols="auto">
                            <v-text-field label="Prénom" v-model="prenom" variant="outlined" density="compact"
                                hide-details style="width: 280px;" readonly bg-color="#F1F5EE" />
                        </v-col>

                        <v-col cols="auto">
                            <v-text-field label="Département" v-model="departement" variant="outlined" density="compact"
                                hide-details style="width: 280px;" readonly bg-color="#F1F5EE" />
                        </v-col>

                        <v-col cols="auto">
                            <v-btn color="#33691E" variant="flat" prepend-icon="mdi-plus" class="text-none"
                                @click="addParticipant" :disabled="loading || !employeTrouve">
                                Ajouter
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>

                <!-- Tableau -->
                <div class="fm-table-wrap mt-3">
                    <MyTableAmm :headers="headers" :items="list" :loading="loading" action2="Supprimer"
                        @action2Item="Enlever" style="height: 220px; overflow-y: auto;" />
                </div>
            </div>
        </v-card-text>

        <v-divider />

        <!-- Actions -->
        <v-card-actions class="fm-actions">
            <v-spacer />
            <v-btn color="red" variant="outlined" prepend-icon="mdi-close" class="text-none"
                @click="annuler">Annuler</v-btn>
            <v-btn color="#33691E" variant="flat" prepend-icon="mdi-content-save-outline" class="text-none px-5"
                :disabled="isSaving" :loading="isSaving" @click="save">Enregistrer</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import swal from 'sweetalert2';
import MySelect from '@/components/MySelect.vue';
import MyTableAmm from '@/components/amm/MyTableAmm.vue';
import { useFormation } from "@/store/Rh/rh_formation";
import { useEmployeeStore } from "@/store/Rh/rh_employee";
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
        const loading = ref(false);
        const isSaving = ref(false);
        const user = localStorage.getItem('username');
        const router = useRouter();
        useSessionTimeout(Config.DURRE_SESSION, router);

        const storeFormation = useFormation();
        const storeEmploye = useEmployeeStore();

        // Génération du code
        const prefixe = 'FM';                // TODO : adapter le préfixe
        const nom_table = '';       // TODO : adapter le nom de la table

        const numDossier = ref([]);
        const newCodeDoc = ref('');

        // Champs du formulaire
        const dateFormation = ref(new Date().toISOString().substring(0, 10)); // date du jour (yyyy-mm-dd)
        const selectedType = ref(null);
        const selectedOrigine = ref(0);
        const entite = ref('');
        const description = ref('');
        const fichier = ref(null);

        const listEmployes = ref([]);


        // Champs au-dessus du tableau
        const matricule = ref('');
        const nom = ref('');
        const prenom = ref('');
        const departement = ref('');

        // Tableau des participants
        const list = ref([]);

        const headers = [
            { title: 'MATRICULE', align: 'start', key: 'matricule', sortable: false },
            { title: 'NOM', align: 'start', key: 'nom', sortable: false },
            { title: 'PRÉNOM', align: 'start', key: 'prenom', sortable: false },
            { title: 'DÉPARTEMENT', align: 'start', key: 'departement', sortable: false },
            { title: '', align: 'center', sortable: false, key: 'actions', width: "20px" },
        ];

        // // Toast d'erreur réutilisable
        // const showError = (title, icon = 'error') => {
        //     const colors = icon === 'warning'
        //         ? { background: '#fff3cd', color: '#856404' }
        //         : { background: '#f8d7da', color: '#721c24' };

        //     swal.fire({
        //         icon,
        //         title,
        //         toast: true,
        //         position: 'top-end',
        //         showConfirmButton: false,
        //         timer: 1500,
        //         timerProgressBar: true,
        //         ...colors,
        //     });
        // };

        const TOAST_THEMES = {
            error: { accent: '#ef4444', glow: 'rgba(239, 68, 68, .35)' },
            warning: { accent: '#f59e0b', glow: 'rgba(245, 158, 11, .35)' },
            success: { accent: '#10b981', glow: 'rgba(16, 185, 129, .35)' },
            info: { accent: '#3b82f6', glow: 'rgba(59, 130, 246, .35)' },
        };

        const showError = (title, icon = 'error', text = '') => {
            const { accent, glow } = TOAST_THEMES[icon] ?? TOAST_THEMES.error;

            swal.fire({
                icon,
                title,
                text,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: 'rgba(255, 255, 255, 0.85)',
                color: '#1f2937',
                iconColor: accent,
                customClass: {
                    popup: 'modern-toast',
                    timerProgressBar: 'modern-toast-bar',
                },
                showClass: { popup: 'toast-in' },
                hideClass: { popup: 'toast-out' },
                didOpen: (toast) => {
                    toast.style.setProperty('--accent', accent);
                    toast.style.setProperty('--glow', glow);
                    // Pause au survol
                    // toast.addEventListener('mouseenter', swal.stopTimer);
                    // toast.addEventListener('mouseleave', swal.resumeTimer);
                },
            });
        };

        const convertToUpperCase = () => {
            matricule.value = (matricule.value || '').toUpperCase();
        };



        // Employé correspondant au matricule saisi
        const employeTrouve = computed(() => {
            const mat = (matricule.value || '').trim().toUpperCase();
            if (!mat) return null;
            return listEmployes.value.find(
                e => String(e.empl_matricule).trim().toUpperCase() === mat
            ) || null;
        });

        // Remplissage automatique des champs
        watch(employeTrouve, (emp) => {
            nom.value = emp?.empl_nom ?? '';
            prenom.value = emp?.empl_prenom ?? '';
            // departement.value = emp?.lib_dep ?? '';
            departement.value = emp?.empl_dep ?? '';
        });

        const addParticipant = () => {
            if (!matricule.value || !matricule.value.trim()) {
                showError('Veuillez renseigner le MATRICULE', 'warning');
                return;
            }
            if (!employeTrouve.value) {
                showError('Aucun employé trouvé pour ce matricule', 'warning');
                return;
            }

            // Évite les doublons de matricule
            const existe = list.value.some(
                p => String(p.matricule).trim() === matricule.value.trim()
            );
            if (existe) {
                showError('Ce matricule est déjà dans la liste', 'warning');
                return;
            }

            // list.value.push({
            //     matricule: matricule.value.trim(),
            //     nom: nom.value,
            //     prenom: prenom.value,
            //     departement: departement.value,

            // });

            const emp = employeTrouve.value;

            list.value.push({
                matricule: emp.empl_matricule,
                code: emp.empl_code,
                nom: emp.empl_nom,
                prenom: emp.empl_prenom,
                departement: emp.empl_dep,
                post: emp.empl_poste,
                poste_libelle: emp.poste_libelle,
            });

            // reset (le watch vide aussi nom/prénom/département)
            matricule.value = '';
        };

        function Enlever(item) {
            list.value = list.value.filter(i => i !== item);
        }

        const getFile = () => {
            const f = fichier.value;
            if (!f) return null;
            return Array.isArray(f) ? (f[0] ?? null) : f;
        };

        const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

        const onFileChange = () => {
            const f = getFile();
            if (!f) return;

            if (!f.type.startsWith('image/') && f.type !== 'application/pdf') {
                showError('Seuls les fichiers image et PDF sont autorisés', 'warning');
                fichier.value = null;
                return;
            }

            if (f.size > MAX_SIZE) {
                showError('Fichier trop volumineux (max 5 Mo)', 'warning');
                fichier.value = null;
            }
        };




        const insertFormation = async () => {
            // TODO : brancher sur votre store / API, par exemple :
            await storeFormation.insertFormation(newCodeDoc.value, dateFormation.value, selectedType.value, selectedOrigine.value, selectedOrigine.value === 1 ? entite.value : null, description.value, getFile());
        };

        const insertLigneFormation = async () => {
            const participants = list.value.map(p => ({
                matricule: p.matricule,
                post: p.post,
            }));

            await storeFormation.insertFormationLignes(newCodeDoc.value, dateFormation.value, participants);
        };

        const save = async () => {
            if (isSaving.value) return; // évite double clic
            isSaving.value = true;

            try {
                if (!dateFormation.value) {
                    showError('Il faut renseigner la DATE');
                    return;
                }

                if (selectedType.value == null) {
                    showError('Il faut sélectionner un TYPE');
                    return;
                }

                if (selectedOrigine.value == null) {
                    showError('Il faut choisir INTERNE ou EXTERNE');
                    return;
                }

                if (selectedOrigine.value === 1 && (!entite.value || !entite.value.trim())) {
                    showError('Veuillez renseigner le champ ENTITÉ');
                    return;
                }

                if (!getFile()) {
                    showError('Veuillez ajouter un fichier avant de continuer');
                    return;
                }

                if (!list.value || list.value.length === 0) {
                    showError('Il faut ajouter au moins un participant');
                    return;
                }

                // ---------- Console log des éléments avant l'enregistrement ----------
                const payloadFormation = {
                    code: newCodeDoc.value,
                    date: dateFormation.value,
                    type: selectedType.value,
                    origine: selectedOrigine.value, // 0 = INTERNE, 1 = EXTERNE
                    entite: selectedOrigine.value === 1 ? entite.value.trim() : null,
                    description: description.value,
                };

                // console.log('===== FORMATION =====');
                // console.log(payloadFormation);

                // console.log('===== PARTICIPANTS =====');
                // console.log(JSON.parse(JSON.stringify(list.value)));
                // console.table(list.value);
                // ----------------------------------------------------------------------

                await insertFormation();
                await insertLigneFormation();

                emit('saved', {
                    code: newCodeDoc.value,
                    date: dateFormation.value,
                    type: selectedType.value,
                    origine: selectedOrigine.value,
                    entite: entite.value,
                    description: description.value
                });

            } finally {
                // Réactive le bouton même en cas d'erreur
                isSaving.value = false;
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

        const listNumDossier = async () => {
            await storeFormation.fetchCodeNouveau(prefixe, nom_table);
            newCodeDoc.value = storeFormation.nouveaucode;
        };



        onMounted(async () => {
            list.value = [];
            numDossier.value = [];
            await listNumDossier();
            await listFormation();

            await storeEmploye.fetchListEmployes();
            listEmployes.value = storeEmploye.listemployes;

        });

        watch(numDossier, (val) => {
            if (val[0]?.numdossier) {
                newCodeDoc.value = val[0].numdossier;
            }
        }, { immediate: true });

        // Si on repasse en INTERNE, on vide l'entité
        watch(selectedOrigine, (newVal) => {
            if (newVal !== 1) {
                entite.value = '';
            }
        });

        const list_types = ref([]);

        const listFormation = async () => {
            await storeFormation.fetchListFormation();
            list_types.value = storeFormation.listformations;
        };

        // const employesItems = computed(() =>
        //     listEmployes.value.map(e => {
        //         const mat = String(e.empl_matricule).trim();
        //         return {
        //             matricule: mat,
        //             label: `${mat} -- ${e.empl_nom ?? ''} ${e.empl_prenom ?? ''}`.trim(),
        //         };
        //     })
        // );

        // const employesItems = computed(() =>
        //     listEmployes.value
        //         .filter(e => e.empl_matricule != null && String(e.empl_matricule).trim() !== '')
        //         .map(e => {
        //             const mat = String(e.empl_matricule).trim();
        //             return {
        //                 matricule: mat,
        //                 label: `${mat} -- ${e.empl_nom ?? ''} ${e.empl_prenom ?? ''}`.trim(),
        //             };
        //         })
        // );


        const employesItems = computed(() => {
            // Matricules déjà ajoutés dans le tableau
            const dejaAjoutes = new Set(
                list.value.map(p => String(p.matricule).trim().toUpperCase())
            );

            return listEmployes.value
                .filter(e => e.empl_matricule != null && String(e.empl_matricule).trim() !== '')
                .filter(e => !dejaAjoutes.has(String(e.empl_matricule).trim().toUpperCase()))
                .map(e => {
                    const mat = String(e.empl_matricule).trim();
                    return {
                        matricule: mat,
                        label: `${mat} -- ${e.empl_nom ?? ''} ${e.empl_prenom ?? ''}`.trim(),
                    };
                });
        });

        // Filtre insensible à la casse et aux accents, sur "matricule -- nom prénom"
        const normalize = (s) =>
            String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        const filterEmployes = (value, query, item) =>
            normalize(item?.raw?.label).includes(normalize(query));

        return {
            dialogVisible, loading, isSaving, user,
            newCodeDoc, dateFormation, selectedType, selectedOrigine, entite, description,
            list_types,
            matricule, nom, prenom, departement,
            list, headers,
            addParticipant, Enlever, convertToUpperCase,
            save, annuler, closeDetail,
            listEmployes, employeTrouve, employesItems, filterEmployes,
            fichier, onFileChange,
        };
    }
});
</script>

<style>
.swal2-container {
    z-index: 20000 !important;
}

/* ---------- Carte principale ---------- */
.fm-card {
    overflow: hidden;
    border: 1px solid #E3E8E0;
}

/* ---------- En-tête ---------- */
.fm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 5px;
    background: linear-gradient(120deg, #F1F8E9 0%, #FFFFFF 70%);
    border-bottom: 3px solid #d1eddc;
}

.fm-header-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #33691E, #689F38);
    box-shadow: 0 4px 10px rgba(51, 105, 30, 0.3);
}

.fm-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: #1B3A0F;
    line-height: 1.2;
}

.fm-subtitle {
    font-size: 0.85rem;
    color: #6B7A63;
    margin-top: 2px;
}

/* ---------- Corps ---------- */
.fm-body {
    padding: 20px !important;
    background: #FAFBF9;
}

.fm-section {
    background: #FFFFFF;
    border: 1px solid #E3E8E0;
    border-radius: 12px;
    padding: 16px 18px 18px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.fm-section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    font-weight: 600;
    color: #33691E;
    margin-bottom: 14px;
}

/* ---------- Radios Interne / Externe ---------- */
.radio-inline {
    border: 1px solid #9AA394;
    border-radius: 8px;
    padding: 0 10px;
    height: 40px;
    display: flex;
    align-items: center;
    background-color: #fff;
    transition: border-color 0.2s;
}

.radio-inline:hover {
    border-color: #33691E;
}

/* ---------- Zone d'ajout d'un participant ---------- */
.fm-add-panel {
    background: #F1F5EE;
    border: 1px dashed #B7C7AA;
    border-radius: 10px;
    padding: 10px 12px;
}

/* ---------- Tableau ---------- */
.fm-table-wrap {
    border: 1px solid #E3E8E0;
    border-radius: 10px;
    overflow: hidden;
}

/* ---------- Pied ---------- */
.fm-actions {
    padding: 12px 20px !important;
    gap: 8px;
    background: #FFFFFF;
}

.modern-toast {
    border-radius: 16px !important;
    border-left: 5px solid var(--accent);
    padding: 0.9rem 1.2rem !important;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow:
        0 12px 32px -8px var(--glow),
        0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.modern-toast .swal2-title {
    font-size: 0.95rem !important;
    font-weight: 600;
}

.modern-toast .swal2-icon {
    animation: iconPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
}

.modern-toast-bar {
    background: var(--accent) !important;
    height: 3px !important;
    border-radius: 0 0 16px 16px;
}

.toast-in {
    animation: toastIn 0.55s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
}

.toast-out {
    animation: toastOut 0.3s ease-in forwards;
}

@keyframes toastIn {
    from {
        opacity: 0;
        transform: translateX(110%) scale(0.9);
    }

    60% {
        opacity: 1;
        transform: translateX(-8px) scale(1.02);
    }

    to {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

@keyframes toastOut {
    to {
        opacity: 0;
        transform: translateX(110%) scale(0.9);
    }
}

@keyframes iconPop {
    from {
        transform: scale(0) rotate(-45deg);
        opacity: 0;
    }

    to {
        transform: scale(1) rotate(0);
        opacity: 1;
    }
}
</style>