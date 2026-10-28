<template>
    <v-dialog v-model="dialog" persistent density="compact" transition="dialog-bottom-transition" max-width="1000">
        <v-card density="compact" flat>
            <v-toolbar color="#d7ead5" density="compact">
                <v-toolbar-title density="compact">Création de la fiche de livraison</v-toolbar-title>
                <v-spacer></v-spacer>

                <strong class="text-h5 font-weight-bold">{{ tittre }} </strong>
                <v-btn icon @click="closeDrawer" density="compact">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-container class="mx-auto py-0 my-0 mb-0">
                <v-card-text class="pt-0 mt-0">
                    <v-form @submit.prevent="onValide" class="pt-0 mt-0">
                        <v-row class="pt-0 mt-0 mb-1">
                            <!-- TYPE -->
                            <v-col cols="12" sm="6" md="3">
                                <div class="d-flex align-center" style="gap: 6px;">
                                    <span class="text-subtitle-2 font-weight-medium mt-1">Type :</span>

                                    <div class="radio-border-box mt-1">
                                        <v-radio-group v-model="m_type" inline density="compact" hide-details>
                                            <v-radio label="Livraison" :value="1" />
                                            <v-radio label="Course" :value="0" />
                                        </v-radio-group>
                                    </div>
                                </div>
                            </v-col>

                            <!-- CHAUFFEUR -->
                            <v-col cols="12" sm="6" md="4">
                                <My-Select label="Chauffeur" :items="listVoit" v-model="selectedVoit" variant="outlined"
                                    color="deep-purple-accent-4" item-title="m_desc" return-object hide-details
                                    :disabled="loading" />
                            </v-col>

                            <!-- COURSE -->
                            <v-col cols="12" sm="6" md="4" v-if="m_type === 0">
                                <v-textarea label="Description" v-model="m_course" variant="outlined"
                                    color="deep-purple-accent-4" rows="2" clearable density="compact" no-resize
                                    hide-details />
                            </v-col>

                            <!-- AXE -->
                            <v-col cols="12" sm="6" md="4" v-if="m_type === 1">
                                <My-Select label="Axe" :items="listAxe" v-model="m_axe" variant="outlined"
                                    color="deep-purple-accent-4" item-color="primary" hide-details
                                    :disabled="isAxeDisabled" />
                            </v-col>
                        </v-row>
                        <v-divider color="secondary" content-offset="-16" opacity="1" style="color: inherit"
                            thickness="1">
                        </v-divider>
                        <v-row class="pt-0 mt-0 mb-1" v-if="m_type === 1">
                            <v-col cols="12" sm="6" md="5">
                                <v-row density="compact">
                                    <v-col cols="12" sm="6" md="6">
                                        <v-progress-linear v-if="loading" color="primary" rounded indeterminate
                                            height="1" density="compact"></v-progress-linear>
                                        <v-data-table v-model="selected" :items="listLiv" item-value="xuser"
                                            :headers="headersLiv" show-select hide-default-footer class="liv_header"
                                            density="compact" :fixed-header="true" height="250" hover v-if="!loading"
                                            :disabled="loading" />
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-row class="pt-2 my-n1" density="compact">
                                            <v-text-field :model-value="isManuel ? m_cmd : maskedBarcode"
                                                v-if="!loading" @input="onInput"
                                                :label="isManuel ? 'Saisir le Code' : 'Scanner le bon'" maxlength="13"
                                                variant="outlined" hide-details class="scanner-field" ref="barcodeInput"
                                                clearable autocomplete="off" @keydown.enter.prevent="ajoutCmdLv"
                                                style="width: 135px" />
                                            <v-checkbox label="Manuel" color="secondary" hide-details hide-no-data
                                                v-if="!loading" v-model="isManuel" density="compact" />
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>


                            <v-col cols="12" sm="6" md="7">

                                <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="1"
                                    density="compact"></v-progress-linear>
                                <v-data-table :headers="headersAtteLiv" :items="listAtteLiv" :fixed-header="true"
                                    style="width:100%;" height="250" hide-default-footer class="liv_header"
                                    :items-per-page="-1" density="compact" hover v-if="!loading" :disabled="loading"
                                    :row-props="rowColor">
                                    <template v-slot:[`item.nom_client`]="{ item }">
                                        <span
                                            style="cursor: pointer;line-height: 1.2; font-size: 0.95em; text-align:start;">
                                            {{ item.nom_client }}</span>
                                    </template>
                                    <template v-slot:[`item.axe`]="{ item }">
                                        <span
                                            style="cursor: pointer;line-height: 1.2; font-size: 0.95em; text-align:center;">
                                            {{ item.axe }}</span>
                                    </template>
                                </v-data-table>


                            </v-col>
                        </v-row>

                        <div style="width: 100%; overflow-x: auto; overflow-y: auto; height: 300px;" class="m-0 p-0"
                            v-if="m_type === 1">
                            <MyTable :headers="headers" :items="list" action2="rétirer" style="width:100%;"
                                v-if="!loading" :disabled="loading" @action2Item="onRetire" :showAction1="false">
                                <template v-slot:[`item.axe`]="{ item }">
                                    <span
                                        style="cursor: pointer;line-height: 1.2; font-size: 0.9em; text-align:center;">
                                        {{ item.axe }}</span>
                                </template>
                                <template v-slot:[`item.cmd`]="{ item }">
                                    <span
                                        style="cursor: pointer;line-height: 1.2; font-size: 0.9em; text-align:center;">
                                        {{ item.cmd }}</span>
                                </template>
                                <template v-slot:[`item.date_cmd`]="{ item }">
                                    <span
                                        style="cursor: pointer;line-height: 1.2; font-size: 0.9em; text-align:center;">
                                        {{ item.date_cmd }}</span>
                                </template>
                                <template v-slot:[`item.code_client`]="{ item }">
                                    <span
                                        style="cursor: pointer;line-height: 1.2; font-size: 0.9em; text-align:center;">
                                        {{ item.code_client }}</span>
                                </template>
                                <template v-slot:[`item.adrs`]="{ item }">
                                    <span
                                        style="cursor: pointer;line-height: 1.2; font-size: 0.9em; text-align:center;">
                                        {{ item.adrs }}</span>
                                </template>
                                <template v-slot:[`item.nom_client`]="{ item }">
                                    <span
                                        style="cursor: pointer;line-height: 1.2; font-size: 0.9em; text-align:center;">
                                        {{ item.nom_client }}</span>
                                </template>
                                <template v-slot:[`item.colis`]="{ item }">
                                    <span
                                        style="cursor: pointer;line-height: 1.2; font-size: 0.9em; text-align:center;">
                                        {{ item.colis }}</span>
                                </template>
                            </MyTable>
                        </div>

                        <MyLoading :loading="chagmt" @close="chagmt = false" :articles="articles"></MyLoading>
                        <router-view></router-view>

                        <v-row align="left" density="compact" justify="start" class="mt-2">
                            <v-col cols="12" sm="6" md="8" density="compact"> </v-col>
                            <v-col cols="12" sm="6" md="2" class="text-right" density="compact">
                                <v-btn class="text-none text-button mx-auto" color="error" variant="flat"
                                    prepend-icon="mdi-cancel" @click="closeDrawer" size="small"
                                    style="margin-right: 2px">Annuler</v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="2" class="text-right" density="compact">
                                <v-btn type="submit" color="success" class="text-none text-button mx-auto" size="small"
                                    prepend-icon="mdi-check-circle" variant="flat"
                                    style="margin-left: 2px">Valider</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-container>
        </v-card>
        <v-snackbar v-model="snackbar" :timeout="1800" class="text-center" location="center" stacked>
            <strong class="font-weight-medium">{{ text }}</strong>

            <template #actions>
                <v-btn color="red" variant="text" @click="snackbar = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </v-dialog>
</template>

<script>
import * as XLSX from "xlsx";
import MySelect from '@/components/MySelect.vue';
import dayjs from "dayjs";
import Swal from 'sweetalert2';
import MyLoading from '@/components/Loading.vue';
import useNumericInputValidationOnly from "@/composables/validateNumericInput.js";
import MyTable from '@/components/MyTable.vue';
import { useCreateLVStore } from "@/store/Expedition/createLV.js";
import { useAxeStore } from "@/store/utils/axe.js"
import { useLoginPlusStore } from "@/store/utils/loginPlus.js"
import useConfirmation from "@/composables/useConfirmationToast";
import { useReportLVStore } from "@/store/report/printLV.js";
import {
    VDataTableVirtual,
    VDataTable,
    VDataTableServer,
} from "vuetify/lib/components";
import {
    ref,
    defineComponent,
    reactive,
    onMounted,
    onBeforeUnmount,
    computed,
    watch,
} from "vue";


export default defineComponent({
    props: {
        drawer: {
            type: Boolean,
            required: true,
        },
        editedItem: {
            type: Object,
            default: null,
        }
    },
    components: {
        MySelect,
        MyTable,
        MyLoading,
        VDataTable,
    },

    name: "createLV",
    setup(props, { emit }) {
        const dialog = ref(props.drawer);
        const list = ref([])
        const loading = computed(() => store.loading || storeAxe.loading || storeLiv.loading);
        const chagmt = ref(false);
        const articles = ref(null);
        const newItem = ref(props.editedItem)
        const m_type = ref(1)
        
        const closeDrawer = () => {
            emit("close");
        };
        const snackbar = ref(false)
        const text = ref("")
        const listVoit = ref([]);
        const store = useCreateLVStore();
        const storeAxe = useAxeStore();
        const storeLiv = useLoginPlusStore();
        const { validateNumericInputOnly } = useNumericInputValidationOnly();
        const onKeyPressNumeric = (event) => {
            validateNumericInputOnly(event);
        };
        const selectedVoit = ref(null);
        const m_course = ref(null);
        const listAxe = ref([]);
        const listLiv = ref([]);
        const m_axe = ref(null);
        const selected = ref([]);
        const listAtteLiv = ref([]);
        const m_cmd = ref('');
        const m_livreurs = ref("");
        const storePrint = useReportLVStore();
        const { confirmAction } = useConfirmation();
        const isManuel = ref(false)
        const m_listLivreurOccupe = ref([]);
        const m_listProxi = ref([])
        const tittre = ref(null);
        const headersLiv = [
            { title: 'Livreur', key: 'xuser', align: 'start' }
        ]

        const headersAtteLiv = [
            {
                title: 'CLIENT',
                key: 'nom_client',
                align: 'center',
                headerProps: { class: 'text-center' },
                cellProps: { class: 'text-start' }
            },
            {
                title: 'COMMANDE',
                key: 'cmd',
                align: 'center',
                headerProps: { class: 'text-center' },
                cellProps: { class: 'text-center' }
            },
            {
                title: 'AXE', key: 'axe', align: 'center', headerProps: { class: 'text-center' },
                cellProps: { class: 'text-start' }
            }

        ]

        const rowColor = ({ item }) => {
            return {
                class: [
                    isInSelectedList(item.cmd) ? 'row-selected' : '',
                    item.blockPaye ? 'highlight-bgs' : ''
                ].join(' ')
            };
        };

        const headers = [
            { title: 'N° Commande', align: 'center', key: 'cmd' },
            { title: 'Date', align: 'center', key: 'date_cmd' },
            { title: 'Client', align: 'center', key: 'code_client' },
            { title: 'Nom Client', align: 'start', key: 'nom_client' },
            { title: 'Adresse', align: 'start', key: 'adrs' },
            { title: 'Axe', align: 'center', key: 'axe' },
            { title: 'Colis', align: 'end', key: 'nbColis' },
            { title: 'Actions', align: 'center', key: 'actions', value: 'actions', width: '1%' },
        ]

        const isInSelectedList = (cmd) => {
            return list.value.some(item => item.cmd === cmd);
        };

        watch(() => props.drawer, (newVal) => {
            dialog.value = newVal;
        });

        watch(
            () => props.editedItem,
            (newValue) => {
                if (newValue) {
                    m_axe.value = newValue.m_axe;
                }
            },
            { immediate: true }
        );

        watch(selected, () => {
            m_livreurs.value = selected.value
                .map(u => "-" + u.trim())
                .join(" ");
        });

        watch(isManuel, () => {
            m_cmd.value = ''; // ou "" si tu préfères vide string
        });

        const isAxeDisabled = computed(() => {
            const model = newItem.value?.m_modeliv;

            const axe = (newItem.value?.m_axe || '').trim();

            const isAllowed =
                model === 'AUTRES' ||
                (model === 'OPHAM' && axe === '');

            return loading.value || !isAllowed;
        });
        const barcodeInput = ref('');


        const onValide = async () => {

            if (!selectedVoit.value) {
                showMsg("Veuillez d’abord choisir le chauffeur");
                return;
            }

            if (!m_axe.value?.trim() && m_type.value === 1) {

                showMsg("Veuillez d’abord choisir l'axe");

                return;

            }

            if (!m_course.value && m_type.value === 0) {
                showMsg("Le champ “Description” est obligatoire pour une course");
                return;
            }
            if (list.value.length === 0 && m_type.value === 1) {
                showMsg("La liste des commandes à livrer est vide");
                return;
            }
            const listV = ref([]);

            await store.fetchListVoit(newItem.value.m_modeliv);
            listV.value = store.listVoit || [];
            const itemAtteLiv = listV.value.find(item =>
                ((item?.num_voit?.trim() === selectedVoit.value?.num_voit?.trim()) 
                )
            );



            if (!itemAtteLiv) {
                showMsg(
                    `La voiture ${selectedVoit.value?.num_voit} et le chauffeur ${selectedVoit.value?.m_chauf} ne sont pas disponibles`
                );
                return;
            }
            // 🔹 Déclarer d'abord la variable
            let confirmationMsg = "<div style='text-align: left;'><ul>";

            // 🔹 Message d’alerte en **première ligne**
            if (m_type.value === 1 && !m_livreurs.value) {
                confirmationMsg += "<li style='color: red;'>⚠️ Etes-vous sûr(e) de vouloir livrer sans emballeur ?</li>";
            } else {
                confirmationMsg += "<li style='color: red;'>⚠️ Etes-vous sûr(e) de valider cette livraison ?</li>";
            }
            confirmationMsg += "<li>Type : <span style='color: #05acdc;'>"
                + (m_type.value === 1
                    ? "Livraison " + (newItem.value?.m_modeliv || "")
                    : "Course")
                + "</span></li>";
            // 🔹 Ajouter le chauffeur et type
            confirmationMsg += "<li>Chauffeur : <span style='color: #05acdc;'>" + selectedVoit.value.m_desc + "</span></li>";


            // 🔹 Ajouter l'axe si nécessaire
            if (m_type.value === 1 && selectedVoit.value.m_code !== "11111") {
                confirmationMsg += "<li>Axe : <span style='color: #05acdc;'>" + m_axe.value + "</span></li>";
            }
            if (m_livreurs.value) {
                confirmationMsg += "<li>Livreur: <span style='color: #05acdc;'>" + m_livreurs.value + "</span></li>";
            }

            confirmationMsg += "</ul></div>";

            // 🔹 Afficher la confirmation
            const confirmed = await confirmAction(
                "Confirmation de la création LV",
                confirmationMsg
            );
            if (!confirmed) return;
            try {
                chagmt.value = true;
                await store.createLv(selectedVoit.value.m_chauf.trim(), selectedVoit.value.num_voit.trim(), m_type.value, m_course.value, m_livreurs.value, m_axe.value)

                if (list.value.length && m_type.value === 1) {
                    for (let i = 0; i < list.value.length; i++) {
                        const item = list.value[i];
                        articles.value = '[' + item.cmd + ']'
                        await store.onAddCmdLiv(item.cmd, store.m_createLv.code_liv, '');
                    }

                }
            } catch (error) {
                console.error(error);
                alert("Erreur lors de la validation !");
            } finally {
                chagmt.value = false;
                await imprimer(store.m_createLv.code_liv);
                emit("onValide");
                closeDrawer();

                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Création de livraison <span style='color: #05acdc;'> ${store.m_createLv.code_liv} </span> effectuée avec succès`,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                });

            }

        };



        const onInput = (e) => {
            let value = e.target.value;

            if (isManuel.value) {
                // 👉 mode manuel → texte visible + MAJ
                m_cmd.value = value.toUpperCase();
            } else {
                // 👉 mode scan → on récupère vrai code sans *
                m_cmd.value += value.replace(/\*/g, "");
            }

            // forcer affichage correct
            e.target.value = isManuel.value ? m_cmd.value : maskedBarcode.value;
        };

        const imprimer = async (code) => {
            try {
                chagmt.value = true;
                articles.value = 'Impression du ' + code;

                let response; // pas "const response = null"


                if (m_type.value === 1) {
                    response = await storePrint.generateReportLV(code);
                } else {
                    response = await storePrint.generateReportCourse(code);
                }

                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Erreur lors de l’impression :', error);
            } finally {
                chagmt.value = false;
            }
        };

        const onRetire = (item) => {
            // supprimer la ligne correspondante
            list.value = list.value.filter(i => i.cmd !== item.cmd);
        };
        const maskedNumlv = computed(() =>

            m_cmd.value ? m_cmd.value.replace(/./g, "•") : ""

        );

        onMounted(async () => {
            listAxe.value = [];
            listVoit.value = [];
            await store.fetchListVoit(newItem.value.m_modeliv);
            listVoit.value = store.listVoit
            if (m_type.value === 1) {
                await storeLiv.fetchLoginPlus(" xType='LIV' ");
                listLiv.value = storeLiv.listLoginPlus;

                if (newItem.value.m_modeliv && newItem.value.m_modeliv === "AUTRES") {
                    listAxe.value = [];
                    await store.fetchListProximite(newItem.value.m_modeliv);
                    listAxe.value = store.m_listProximite.map(item => item.p_code.trim());
                    m_axe.value = null;
                } else {
                    if ((newItem.value?.m_axe || '').trim() == '') {
                        await store.fetchListProximite(newItem.value.m_modeliv);
                        listAxe.value = store.m_listProximite.map(item => item.p_code.trim());
                    } else {
                        await storeAxe.fetchAxe();
                        listAxe.value = Array.from(new Set([...storeAxe.axes, "AUTRES"]))
                            .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
                    }

                }
                if (newItem.value.m_modeliv) {
                    await store.fetchListAtteLiv(newItem.value.m_modeliv);
                    listAtteLiv.value = store.listAtteLiv;
                    await sortListAtteLivByAxe();
                }
                await store.livreurOccupe();
                m_listLivreurOccupe.value = store.m_listLivreurOccupe

                filterLivreursDisponibles();
            }
            barcodeInput.value?.focus();
        });

        const transformToUppercase = () => {
            if (m_cmd.value) {
                m_cmd.value = m_cmd.value.toUpperCase();
            }
        };



        const filterLivreursDisponibles = () => {
            if (!m_listLivreurOccupe?.value?.length) {
                // rien à filtrer → on garde la liste originale
                return;
            }

            const occupeSet = new Set(
                m_listLivreurOccupe.value
                    .filter(item => item?.xuser) // sécurité
                    .map(item =>
                        item.xuser.replace("-", "").trim().toUpperCase()
                    )
            );

            listLiv.value = listLiv.value.filter(item =>
                !occupeSet.has(item.xuser?.trim().toUpperCase())
            );
        };


        const maskedBarcode = computed(() => {
            if (!m_cmd.value) return "";
            return "*".repeat(m_cmd.value.length);
        });

        watch(
            () => m_type.value,
            async (newVal) => {
                try {
                    if (newVal === 0) {
                        await store.fetchListVoit('');
                        listVoit.value = store.listVoit;
                        tittre.value = ''
                    }
                    else if (newVal === 1) {
                        await store.fetchListVoit(newItem.value?.m_modeliv || '');
                        listVoit.value = store.listVoit;
                        tittre.value = newItem.value.m_modeliv
                    }
                } catch (e) {
                    console.error('Erreur fetchListVoit:', e);
                }
            },
            { immediate: true }
        );

        const sortListAtteLivByAxe = async () => {
            if (!m_axe.value) return;

            listAtteLiv.value = [...listAtteLiv.value].sort((a, b) => {
                const aMatch = a.axe?.trim() === m_axe.value;
                const bMatch = b.axe?.trim() === m_axe.value;

                if (aMatch && !bMatch) return -1; // a en haut
                if (!aMatch && bMatch) return 1;  // b en haut
                return 0; // sinon ordre normal
            });
        };


        const showMsg = (msg) => {
            text.value = msg;
            snackbar.value = true;
        };
        const hexToBP = async (hex) => {
            if (!hex || hex.length !== 8) return "";

            const result = await storeLiv.hexTocode(hex, 3);
            return result; // ✅ direct return
        };



        const ajoutCmdLv = async () => {
            const num_code = ref("");
            const code_cc = ref();

            const rawLV = m_cmd.value?.trim();
            console.log(rawLV)
            if (!rawLV) {
                showMsg(isManuel.value ? "Entrer le code hex" : "Scanner le bon");
                m_cmd.value = '';
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }

            if (!isManuel.value && rawLV.length !== 13) {
                showMsg("Code barre invalide.");
                m_cmd.value = '';
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }





            if (!selectedVoit.value) {
                showMsg("Veuillez d’abord choisir le chauffeur");
                m_cmd.value = '';
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }

            if (!m_axe.value?.trim()) {
                showMsg("Veuillez d’abord choisir l’axe");
                m_cmd.value = '';
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }

            // =========================
            // Conversion manuel si besoin
            // =========================
            let LV = rawLV;

            if (isManuel.value) {
                const convertedLV = await hexToBP(rawLV);
                if (!convertedLV) {
                    showMsg("Code hex invalide.");
                    m_cmd.value = '';
                    setTimeout(() => barcodeInput.value?.focus(), 50);
                    return;
                }
                LV = String(convertedLV); // 🔥 sécurise

            }

            // 🔹 validation finale (toujours après conversion)

            if (!isManuel.value && (LV.length !== 13 || LV[11] !== "3")) {
                showMsg("Code barre invalide.");
                m_cmd.value = '';
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }

            // =========================
            // Code BP
            // =========================
            const bpCode = "BP" + LV.substring(0, 8);

            await storeLiv.fetchgetCCDepBP(bpCode);
            code_cc.value = storeLiv.m_cc;

            if (!code_cc.value) {
                showMsg("Code barre ou étape invalide");
                m_cmd.value = '';
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }

            // =========================
            // Vérification attente livraison
            // =========================
            await store.isAtteLiv(code_cc.value);

            if (!store.isAtteLivs) {
                showMsg("La commande " + code_cc.value + " n’est pas encore au stade Attente Livraison");
                m_cmd.value = '';
                setTimeout(() => barcodeInput.value?.focus(), 50);
                return;
            }

            // =========================
            // Recherche commande
            // =========================
            const itemAtteLiv = listAtteLiv.value.find(
                item => item.cmd === code_cc.value
            );

            if (!itemAtteLiv) {
                showMsg(
                    "La commande " +
                    code_cc.value +
                    " n’est pas sur le mode de livraison " +
                    newItem.value.m_modeliv
                );
                setTimeout(() => barcodeInput.value?.focus(), 50);
                m_cmd.value = '';
                return;
            }

            if (itemAtteLiv.passBal == 1 && itemAtteLiv.bonALiv < 2) {
                showMsg("La commande " + code_cc.value + " est encore bloquée par ADV");
                setTimeout(() => barcodeInput.value?.focus(), 50);
                m_cmd.value = '';
                return;
            }

               if (itemAtteLiv.passBal == 1 && itemAtteLiv.bonALiv == 3 && selectedVoit.value?.num_voit.trim()!=="RETOUR") {
                showMsg("La commande " + code_cc.value + " doit être la voiture RETOUR");
                setTimeout(() => barcodeInput.value?.focus(), 50);
                m_cmd.value = '';
                return;
            }

            // =========================
            // Vérification déjà livrée
            // =========================
            await store.isLiv(code_cc.value);

            if (!store.isLivs) {
                showMsg("La commande " + code_cc.value + " est déjà livrée");
                setTimeout(() => barcodeInput.value?.focus(), 50);
                m_cmd.value = '';
                return;
            }

            // =========================
            // Vérification liste locale
            // =========================
            const existsInList = list.value.some(
                item => item.cmd === code_cc.value
            );

            if (existsInList) {
                showMsg("La commande " + code_cc.value + " est déjà dans la liste");
                setTimeout(() => barcodeInput.value?.focus(), 50);
                m_cmd.value = '';
                return;
            }

            // =========================
            // Ajout dans la liste
            // =========================
            list.value.push({
                cmd: code_cc.value,
                date_cmd: dayjs().format("YYYY-MM-DD"),
                code_client: itemAtteLiv?.code_client || "",
                nom_client: itemAtteLiv?.nom_client || "",
                adrs: itemAtteLiv?.adrs || "",
                nbColis: itemAtteLiv?.nbColis || 1,
                axe: itemAtteLiv?.axe || "",
                actions: null,
            });

            // reset input
            m_cmd.value = '';
            barcodeInput.value?.focus();
        };


        return {
            closeDrawer, dialog, onValide, headersLiv, list, chagmt, articles, loading,
            newItem, onKeyPressNumeric, showMsg, text, snackbar, selectedVoit, listVoit, m_course, headers, storePrint, imprimer,
            m_type, listAxe, m_axe, listLiv, selected, listAtteLiv, headersAtteLiv, m_cmd, ajoutCmdLv, maskedNumlv, onRetire, isInSelectedList, isManuel,
            transformToUppercase, rowColor, isAxeDisabled, tittre, maskedBarcode, onInput, barcodeInput

        };
    },
});
</script>
<style>
.v-data-table.liv_header .v-table__wrapper>table>thead>tr th,
.v-data-table.liv_header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
    padding: 0 !important;
    width: 1px !important;
    max-width: 1px !important;
    overflow: hidden;
    white-space: nowrap;
}

.liv_header.v-data-table tr>td:first-child {
    border-left: 1px solid #969696;
}

.liv_header.v-data-table tr>td:last-child {
    border-right: 1px solid #969696;
}



.liv_header thead th {
    text-align: center !important;
}

.liv_header tbody td {
    text-align: start !important;
}

.highlight-bgs {
    background-color: #ffe5a1 !important;
}

.row-selected:not(.highlight-bgs) {
    background-color: #C5CAE9 !important;
}

.scanner-field input {
    font-size: 16px !important;
    /* Taille du texte */
    font-weight: bold;
    /* Plus lisible */
    letter-spacing: 4px;
    /* Espacement entre les * (optionnel) */
}
</style>