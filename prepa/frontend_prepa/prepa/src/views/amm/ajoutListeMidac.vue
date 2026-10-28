<template>
    <v-dialog v-model="dialog" persistent density="compact" transition="dialog-bottom-transition" max-width="1200">
        <v-card density="compact" flat>
            <v-toolbar color="#d7ead5" density="compact">
                <v-toolbar-title density="compact">Import Liste Midac</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn icon @click="closeDrawer" density="compact">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-container class="mx-auto py-0 my-0 mb-0">
                <v-card-text class="pt-0 mt-0">
                    <v-form @submit.prevent="onValide" class="pt-0 mt-0">
                        <v-row class="pt-0 mt-0">
                            <v-col cols="12" sm="6" md="3" density="compact">
                                <My-Select label="Date" :items="dates" v-model="vdate" :disabled="loading" hide-no-data
                                    item-color="primary" hide-details></My-Select>
                            </v-col>
                            <v-col cols="12" sm="6" md="3" density="compact">
                                <My-Select label="Mois" :items="mois" v-model="vmois" :disabled="loading" hide-no-data
                                    item-title="name" item-value="id" item-color="primary" hide-details></My-Select>
                            </v-col>
                            <v-col cols="12" sm="6" md="1" density="compact">

                            </v-col>
                            <v-col cols="12" sm="6" md="5" density="compact">
                                <v-file-input label="Choisir un fichier Excel" accept=".xlsx, .xls" clearable
                                    hide-no-data @change="handleFileUpload" outlined density="compact"></v-file-input>
                            </v-col>
                        </v-row>

                        <div width="100%" height="100vh" color="#2c3640" class="mt-2 p-0">
                            <MyTableAmm :headers="headers" :items="list" :loading="loading" height="600"
                                showNbDoublans="true" :totalDoublons="nbDoublans" :showPagination="true"></MyTableAmm>
                        </div>
                        <MyLoading :loading="chagmt" @close="chagmt = false" :articles="articles"></MyLoading>
                        <router-view></router-view>

                        <v-row align="left" density="compact" justify="start" class="mt-2">
                            <v-col cols="12" sm="6" md="10" density="compact"> </v-col>
                            <v-col cols="12" sm="6" md="1" class="text-right" density="compact">
                                <v-btn class="text-none text-button mx-auto" color="error" variant="flat"
                                    prepend-icon="mdi-cancel" @click="closeDrawer" size="small"
                                    style="margin-right: 2px">Annuler</v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="1" class="text-right" density="compact">
                                <v-btn type="submit" color="success" class="text-none text-button mx-auto" size="small"
                                    prepend-icon="mdi-check-circle" variant="flat"
                                    style="margin-left: 2px">Valider</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-container>
        </v-card>

    </v-dialog>
</template>

<script>
import * as XLSX from "xlsx";
import MySelect from '@/components/MySelect.vue';
import dayjs from "dayjs";
import Swal from 'sweetalert2';
import MyTableAmm from '@/components/amm/MyTableAmm.vue';
import MyLoading from '@/components/Loading.vue';
import { useMidacStore } from "@/store/Amm/midac.js";
import { useEnumerationStore } from "@/store/utils/enumeration.js";
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
    },
    components: {
        MySelect,
        MyTableAmm,
        MyLoading
    },

    name: "ajoutListeMidac",
    setup(props, { emit }) {
        const dialog = ref(props.drawer);
        const vdate = ref(null);
        const vmois = ref(null);
        const list = ref([])
        const list_doublans = ref([])
        const fileInput = ref(null);
        const loading = ref(false);
        const chagmt = ref(false);
        const articles = ref(null);
        const nbDoublans = ref(0);
        const store = useMidacStore();
        const storeEnum = useEnumerationStore();
        const closeDrawer = () => {
            emit("close");
        };


        const dates = ref([])

        const mois = [
            { id: 1, name: "Janvier" },
            { id: 2, name: "Février" },
            { id: 3, name: "Mars" },
            { id: 4, name: "Avril" },
            { id: 5, name: "Mai" },
            { id: 6, name: "Juin" },
            { id: 7, name: "Juillet" },
            { id: 8, name: "Août" },
            { id: 9, name: "Septembre" },
            { id: 10, name: "Octobre" },
            { id: 11, name: "Novembre" },
            { id: 12, name: "Décembre" },
        ];

        const headers = [
            { title: 'CODE PRO', align: 'center', key: 'code_prod' },
            { title: 'NOM COMMERCIAL', align: 'start', key: 'nom_com' },
            { title: 'CODE CIP', align: 'start', key: 'code_cip', },
            { title: 'DCI', align: 'start', key: 'dci' },
            { title: 'MARQUE', align: 'start', key: 'marque', },
            { title: 'PRESENTATION', align: 'start', key: 'presentation' },
            { title: 'FABRIQUANT', align: 'start', key: 'fabriquant', },
            { title: 'TITULAIRE AMM', align: 'start', key: 'titulaire' },
            { title: 'CODE HS', align: 'start', key: 'code_hs', },
            { title: 'TYPE COLIS', align: 'start', key: 'type_colis' },
            { title: 'DATE AMM', align: 'start', key: 'date_amm', },
            { title: 'NUM AMM', align: 'start', key: 'num_amm', },
            { title: 'STATUS', align: 'start', key: 'status', },
        ]

        watch(() => props.drawer, (newVal) => {
            dialog.value = newVal;
        });

        // Corrige les caractères mal encodés (UTF-8 ↔ Latin-1)
        const fixEncoding = (text) => {
            if (!text || typeof text !== "string") return text;
            try {
                return decodeURIComponent(escape(text));
            } catch {
                return text;
            }
        };

        // Convertit un code date Excel en string "DD/MM/YYYY"
        // Convertit un code date Excel ou texte en objet Date JS
        const excelDateToJSDate = (excelDate) => {
            if (!excelDate) return null;

            // 🔹 Cas 1 : date Excel en nombre (ex: 42404)
            if (typeof excelDate === "number") {
                const parsed = XLSX.SSF.parse_date_code(excelDate);
                if (!parsed) return null;
                return new Date(parsed.y, parsed.m - 1, parsed.d);
            }

            // 🔹 Cas 2 : date texte type "28/08/2016" ou "2016-08-28"
            if (typeof excelDate === "string") {
                const trimmed = excelDate.trim();
                if (trimmed === "") return null;

                // format JJ/MM/AAAA
                if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
                    const [day, month, year] = trimmed.split("/").map(n => parseInt(n, 10));
                    return new Date(year, month - 1, day);
                }

                // format ISO ou autre reconnu par Date()
                const parsedDate = new Date(trimmed);
                if (!isNaN(parsedDate.getTime())) return parsedDate;

                return null; // sinon, format invalide
            }

            return null; // autre type (undefined, objet, etc.)
        };


        const handleFileUpload = async (event) => {
            await store.isImportMois(vdate.value, vmois.value);
            if (!store.isImport) {
                const file = event.target.files[0];
                if (!file) return;

                loading.value = true;
                chagmt.value = true;
                articles.value = "Lecture du fichier...";

                const reader = new FileReader();

                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: "array" });
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                        if (!json || json.length === 0) {
                            throw new Error("Le fichier Excel est vide ou mal formaté.");
                        }

                        const totalRows = json.length;
                        const normalizedData = [];
                        const doublons = [];
                        const seen = new Map();

                        let index = 0;
                        let errorFound = false; // ✅ indicateur d’erreur date

                        const processNext = () => {
                            if (errorFound || !json || index >= totalRows) {
                                if (errorFound) {
                                    list.value = [];
                                    list_doublans.value = [];
                                    loading.value = false;
                                    chagmt.value = false;
                                    articles.value = null;
                                    return;
                                }

                                list.value = normalizedData;
                                list_doublans.value = doublons;

                                loading.value = false;
                                chagmt.value = false;
                                articles.value = null;

                                console.log("✅ Import terminé");
                                console.log("Lignes uniques:", normalizedData.length);
                                console.log("Doublons détectés:", doublons.length);
                                nbDoublans.value = doublons.length;
                                return;
                            }

                            const item = json[index];
                            const produitNom = fixEncoding(item["Nom_commercial"] || "Inconnu");
                            const position = `{${index + 1}/${totalRows}}`;
                            articles.value = `${produitNom} ${position}`;

                            // 🔹 Conversion et validation de la date
                            const rawDate = item["Date AMM"];
                            let dateAmm = null;

                            if (rawDate !== "" && rawDate !== null && rawDate !== undefined) {
                                dateAmm = excelDateToJSDate(rawDate);

                                if (!(dateAmm instanceof Date) || isNaN(dateAmm.getTime())) {
                                    errorFound = true;
                                    loading.value = false;
                                    chagmt.value = false;
                                    articles.value = null;
                                    list.value = [];
                                    list_doublans.value = [];

                                    Swal.fire({
                                        icon: "error",
                                        title: "Erreur de format de date détectée",
                                        html: `
                                                <div style="text-align:left;">
                                                    <p><b>Ligne :</b> ${index + 1}</p>
                                                    <p><b>Valeur de Date AMM :</b> « ${rawDate} »</p>
                                                    <p style="margin-top:10px;">
                                                        La valeur de <b>Date AMM</b> n'est pas reconnue comme une date valide.<br>
                                                        Corrigez la cellule dans le fichier Excel et relancez l'import.
                                                    </p>
                                                </div>
                                            `,
                                        confirmButtonText: "OK",
                                    });

                                    return;
                                }
                            }

                            const row = {
                                id: index + 1,
                                code_prod: fixEncoding(item["Code_prod"] || ""),
                                nom_com: produitNom,
                                code_cip: fixEncoding(item["Code CIP"] || ""),
                                dci: fixEncoding(item["DCI"] || ""),
                                marque: fixEncoding(item["Marque"] || ""),
                                presentation: fixEncoding(item["Présentation"] || ""),
                                fabriquant: fixEncoding(item["Fabriquant"] || ""),
                                titulaire: fixEncoding(item["Titulaire AMM"] || ""),
                                code_hs: fixEncoding(item["CODE HS"] || ""),
                                type_colis: fixEncoding(item["Type Colis"] || ""),
                                date_amm: dateAmm, // ✅ stockée seulement si valide
                                num_amm: fixEncoding(item["Num AMM"] || ""),
                                status: fixEncoding(item["STATUS"] || ""),
                            };

                            // 🔑 Génère une clé unique pour détecter les doublons
                            const key = `${row.code_prod}|${row.date_amm}|${row.num_amm}`;

                            if (seen.has(key)) {
                                doublons.push(row);
                            } else {
                                seen.set(key, true);
                                normalizedData.push(row);
                            }

                            index++;
                            setTimeout(processNext, 5);
                        };

                        processNext();

                    } catch (error) {
                        console.error("❌ Erreur lors de la lecture du fichier:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Erreur lors de la lecture du fichier Excel",
                            text: error.message,
                        });
                        loading.value = false;
                        chagmt.value = false;
                        articles.value = null;
                    }
                };

                reader.onerror = () => {
                    console.error("Erreur lors de la lecture du fichier");
                    Swal.fire({
                        icon: "error",
                        title: "Erreur de lecture du fichier Excel",
                    });
                    loading.value = false;
                    chagmt.value = false;
                };

                reader.readAsArrayBuffer(file);
                event.target.value = ""; // permet de recharger le même fichier
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Impossible d'importer la liste Midac",
                    html: `L’import pour ce mois a déjà été effectué`,
                });
            }
        };

        const fetchEnumAnnee = async () => {
            loading.value = true;
            storeEnum.params.code = "ANNEE";
            await storeEnum.fetchEnums();
            dates.value = storeEnum.enumerations.filter(item => item > 2023);
            loading.value = false;
        }

        const onValide = async () => {
            if (!vdate.value || !vmois.value) {
                alert("Veuillez sélectionner l'année et le mois !");
                return;
            }

            if (!list.value || list.value.length === 0) {
                alert("Aucune donnée à importer !");
                return;
            }

            try {
                chagmt.value = true; // ouvre la modale MyLoading

                const payload = list.value.map(item => ({
                    code_prod: item.code_prod,
                    nom_com: item.nom_com,
                    code_cip: item.code_cip,
                    dci: item.dci,
                    marque: item.marque,
                    presentation: item.presentation,
                    fabriquant: item.fabriquant,
                    titulaire: item.titulaire,
                    code_hs: item.code_hs,
                    type_colis: item.type_colis,
                    date_amm: item.date_amm,
                    num_amm: item.num_amm,
                    status: item.status,
                    vmois: vmois.value,
                    vdate: vdate.value,
                }));

                const total = payload.length;

                for (let i = 0; i < total; i++) {
                    const item = payload[i];

                    // 🟢 Affichage de la progression
                    articles.value = `[${i + 1}/${total}]`;

                    // Envoi d’une ligne au serveur
                    console.log(item);
                    await store.importMidac(item);
                }


            } catch (error) {
                console.error("Erreur lors de l'import :", error);
                alert("Erreur lors de l'import Midac !");
            } finally {
                chagmt.value = false;
                articles.value = null;
                emit("onValide")
                closeDrawer();
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Import  da la liste Midac avec <span style='color: #05acdc;'>${list.value.length}</span> lignes a été effectuée avec succès.`,
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                });
            }
        };




        onMounted(async () => {
            const now = dayjs();
            vmois.value = now.month() + 1; // Day.js : month() renvoie 0–11
            vdate.value = now.year().toString();
            await fetchEnumAnnee();
        });


        return {
            closeDrawer, dialog, onValide, dates, mois, vmois, vdate, headers, list, handleFileUpload, loading, fileInput, chagmt, articles, nbDoublans

        };
    },
});
</script>
<style>
.selected-row {
    background-color: #64b5f6;
}

.white-label .v-label {
    color: #96bd37 !important;
}

.v-text-field input {
    font-size: 14px;
}
</style>