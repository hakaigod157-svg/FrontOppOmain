<template>
    <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
            <v-autocomplete :items="storeLabo.listTitulaireAmms" item-title="focode" item-value="focode"
                label="Titulaire" density="compact" v-if="isAfficeLabo" clearable hide-no-data hide-details
                color="primary" v-model="vLabo" @update:modelValue="handleSelectChange">
                <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                        <!-- <div>{{ item.article }}</div> -->
                        <div class="text-grey lighten-1">{{ item.raw.fonom }}</div>
                    </v-list-item>
                </template>
            </v-autocomplete>
            <v-spacer></v-spacer>
            <v-text-field v-model="searchTerm" prepend-inner-icon="mdi-magnify" density="compact" label="Rechercher"
                flat hide-details variant="solo-filled" />
        </v-card-title>

        <v-divider></v-divider>
    </v-card>

    <v-data-table class="amm_header bordered-table" :headers="headers" :fixed-header="true" :loading="loading"
        density="compact" :items="filteredItems" :items-per-page="-1" no-data-text="Pas de données disponibles"
        hover="true" @click:row="handleClick" v-model="internalSelected" style="height: 625px; overflow-y: auto;">


        <template v-slot:[`item.action`]="{ item }">
            <v-btn size="x-small" color="#FFB74D" @click="action1PItem(item)">
                {{ action_modifier }}
            </v-btn>
        </template>

        <template v-slot:[`item.datecre`]="{ item }">
            {{ formatDateTime(item.datecre) }}
        </template>

        <template v-slot:[`item.amm_date`]="{ item }">
            {{ formatDateTime(item.amm_date) }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <v-btn variant="flat" block size="x-small" color="#E57373" @click="action2PItem(item)"
                style="margin-top:2px;margin-bottom:2px">
                {{ action2 }}
            </v-btn>
        </template>

        <template v-slot:[`item.ligne_code_article`]="{ item }">
            <!-- Bouton si condition -->
            <v-btn v-if="item.amm_decision == 'ACCORDE' && !String(item.ligne_code_article || '').trim()" variant="flat"
                size="x-small" color="#FFAB91" @click="action5PItem(item)" style="width:80px;color: black;">
                {{ action5 }}
            </v-btn>

            <span v-else>
                {{ item.ligne_code_article }}
            </span>
        </template>

        <template v-slot:[`item.renouveler`]="{ item }">
            <!-- Bouton si condition -->
            <v-btn variant="flat" size="x-small" color="#BBDEFB" @click="action6PItem(item)"
                style="width:80px;color: black;">
                {{ action6 }}
            </v-btn>
        </template>


        <template v-slot:[`item.amm_depuis`]="{ item }">
            {{ formatDateTime(item.date_depuis) }}
            <br>
            <span v-if="item.amm_depuis !== 0">
                <b>( {{ item.amm_depuis }} j )</b>
            </span>
        </template>

        <!-- <template v-slot:[`item.amm_etape`]="{ item }">
            {{ item.amm_etape }}
            <br>
            <span>
                <b> {{ item.estimation }}</b>
            </span>
        </template> -->

        <template v-slot:[`item.amm_etape`]="{ item }">
            <div>
                {{ item.amm_etape }}
                <br>

                <span>
                    <b>{{ item.estimation }}</b>
                </span>

                <!-- Bouton A DEPOSER -->
                <div v-if="item.amm_etape === 'A DEPOSER' && item.bouton_non_depos == 1"
                    style="display: flex; gap: 8px; margin-top: 4px; margin-bottom: 2px; margin-left: 4px;">
                    <v-btn variant="flat" size="x-small" color="#90CAF9" style="width: 90px;"
                        @click="action6PItem(item)">
                        {{ action6 }}
                    </v-btn>
                </div>
            </div>
        </template>

        <!-- <template v-slot:[`item.fab_libelle`]="{ item }">
            <div style="white-space: pre-wrap; /* permet les retours à la ligne */ 
           word-wrap: break-word; 
           padding: 0px; 
           border-radius: 4px;
           max-width: 200px;">
                {{ item.fab_libelle }}
            </div>
        </template> -->

        <!-- <template v-slot:[`item.fab_libelle`]="{ item, index }">
            <div :class="{ expanded: isExpanded(item, index) }" class="fab-cell">
                <span>
                    {{ isExpanded(item, index) ? item.fab_libelle : truncatedText(item.fab_libelle) }}
                </span>

                <template v-if="shouldShowToggle(item)">
                    <v-btn size="x-small" variant="text" class="ml-1 px-1 see-more-btn" style="color: #1976d2;"
                        @click="toggleExpand(item, index)">
                        {{ isExpanded(item, index) ? 'Voir moins' : 'Voir plus' }}
                    </v-btn>
                </template>
            </div>
        </template> -->


        <template v-slot:[`item.fab_libelle`]="{ item, index }">
            <v-tooltip bottom>
                <template #activator="{ props, on }">
                    <div v-bind="props" v-on="on" :class="{ expanded: isExpanded(item, index) }" class="fab-cell">
                        <span>
                            {{ isExpanded(item, index) ? item.fab_libelle : truncatedText(item.fab_libelle) }}
                        </span>

                        <template v-if="shouldShowToggle(item)">
                            <v-btn size="x-small" variant="text" class="ml-1 px-1 see-more-btn" style="color: #1976d2;"
                                @click="toggleExpand(item, index)">
                                {{ isExpanded(item, index) ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>
                        </template>
                    </div>
                </template>
                <span>{{ item.fab_libelle }}</span>
            </v-tooltip>
        </template>

        <template v-slot:[`item.amm_ds_code`]="{ item }">
            <span style="display: inline-block; line-height: 1;">
                <v-btn @click="actionDetail(item)" @mouseenter="showTooltip($event, 'Détail Dossier')"
                    @mouseleave="hideTooltip" variant="text"
                    style="padding: 0; justify-content: flex-start; min-width: 100%; line-height: 1;"
                    class="btn-no-padding">
                    {{ item.amm_ds_code }}
                </v-btn>
                <br>
                <b v-if="item.amm_respo && item.amm_respo.trim() !== ''"
                    style="white-space: nowrap; margin: 0; padding: 0; line-height: 1;">
                    ( {{ item.amm_respo }} )
                </b>
            </span>
        </template>


        <!-- <template v-slot:[`item.amm_decision`]="{ item }">
            <v-btn v-if="item.bouton_decision === 1" variant="flat" block size="x-small" color="#FFCC80"
                @click="action3PItem(item)" style="margin-top:2px;margin-bottom:2px">
                {{ action3 }}
            </v-btn>
        </template> -->

        <!-- <template v-slot:[`item.amm_decision`]="{ item }">
            <span v-if="item.amm_decision && item.amm_decision.trim() !== ''">
                {{ item.amm_decision }}
            </span>

            <v-btn v-else-if="Number(item.bouton_decision) === 1" variant="flat" block size="x-small" color="#FFCC80"
                @click="action3PItem(item)" style="margin-top:2px;margin-bottom:2px">
                {{ action3 }}
            </v-btn>
        </template> -->

        <template v-slot:[`item.amm_type`]="{ item }">
            {{ item.amm_type }}
            <br>
            <!-- <div style="display: flex; justify-content: center; text-align: center;transform: translateX(-65px);"> -->
            <div style="display: flex; justify-content: center; text-align: center;">
                <span v-if="item.amm_decision && item.amm_decision.trim() !== ''"
                    style="margin-top: 2px; margin-right: 2px;">
                    <b>({{ item.amm_decision }})</b>
                </span>

                <!-- <v-btn v-else-if="Number(item.bouton_decision) === 1" variant="flat" size="x-small" color="#FFCC80"
                    @click="action3PItem(item)" style="margin-top:2px; margin-bottom:2px; width:120px;">
                    {{ action3 }}
                </v-btn> -->

                <!-- <div v-else-if="Number(item.bouton_decision) === 1"
                    style="display: flex; gap: 8px; margin-top:2px; margin-bottom:2px;">
                    <v-btn variant="flat" size="x-small" color="#FFCC80" style="width:65px;"
                        @click="action3PItem(item)">
                        {{ action3 }}
                    </v-btn>
                </div>
                    <v-btn v-if="item.bouton_reclam ==1" variant="flat" size="x-small" color="#90CAF9" style="width:75px;"
                        @click="action4PItem(item)">
                        {{ action4 }}
                    </v-btn> -->

                <div v-else-if="Number(item.bouton_decision) === 1"
                    style="display: flex; gap: 8px; margin-top:2px; margin-bottom:2px;">
                    <v-btn variant="flat" size="x-small" color="#FFCC80" style="width:65px;"
                        @click="action3PItem(item)">
                        {{ action3 }}
                    </v-btn>
                </div>

                <div v-if="item.bouton_reclam == 1"
                    style="display: flex; gap: 8px; margin-top:2px; margin-bottom:2px;margin-left: 4px;">
                    <v-btn variant="flat" size="x-small" color="#90CAF9" style="width:75px;"
                        @click="action4PItem(item)">
                        {{ action4 }}
                    </v-btn>
                </div>

                <!-- <div v-if="item.bouton_non_depos == 1"
                    style="display: flex; gap: 8px; margin-top:2px; margin-bottom:2px;margin-left: 4px;">
                    <v-btn variant="flat" size="x-small" color="#90CAF9" style="width:90px;"
                        @click="action6PItem(item)">
                        {{ action6 }}
                    </v-btn>
                </div> -->


            </div>

        </template>



        <!-- <template v-slot:[`item.ligne_libelle_article`]="{ item }">
            <div>
                <div>{{ item.ligne_libelle_article }}</div>

                <div v-if="item.ligne_image && item.ligne_image.trim() !== ''" class="d-flex justify-left mt-1">
                    <v-tooltip location="top">
                        <template #activator="{ props }">
                            <span class="text-primary"> <u>Art work</u>: &nbsp;</span>
                            <v-icon v-bind="props" color="primary" density="compact" class="cursor-pointer"
                                @click="openFiche(item.ligne_image)">
                                mdi-eye
                            </v-icon>
                        </template>
                        Aperçu
                    </v-tooltip>
                </div>
            </div>
        </template> -->

        <template v-slot:[`item.ligne_libelle_article`]="{ item }">
            <div>
                <!-- Texte au-dessus -->
                <div>{{ item.ligne_libelle_article }}</div>

                <!-- Art work uniquement si ligne_image = 1 -->
                <div v-if="item.ligne_image == 1" class="d-flex justify-left mt-1">
                    <v-tooltip location="top">
                        <template #activator="{ props }">
                            <span class="text-primary">
                                <u>Art work</u>: &nbsp;
                            </span>

                            <!-- <v-icon v-bind="props" color="primary" density="compact" class="cursor-pointer"
                                @click="openFiche(item.ligne_image)">
                                mdi-eye
                            </v-icon> -->
                            <v-icon v-bind="props" color="primary" density="compact" class="cursor-pointer"
                                @click="openFiche(item)">
                                mdi-eye
                            </v-icon>
                        </template>

                        Aperçu
                    </v-tooltip>
                </div>
            </div>
        </template>






        <!-- Ligne de fin -->
        <!-- <template v-slot:body.append>
            <tr>
                <td :colspan="headers.length" style="text-align: right; font-weight: bold; background-color:#f5f5f5;">
                    Total lignes : {{ filteredItems.length }}
                </td>
            </tr>
        </template> -->

        <template v-slot:body.append>
            <tr class="end-row">
            </tr>
        </template>

    </v-data-table>

    <!--  DIALOG D’APERÇU DU DOCUMENT -->
    <v-dialog v-model="dialog" max-width="800px" transition="dialog-pop" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                <span class="text-h6"><u>Aperçu du fichier</u></span>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
                <div v-if="filePreview" class="text-center">
                    <img v-if="isImage" :src="filePreview" alt="Aperçu" style="max-width: 100%; border-radius: 4px" />
                    <iframe v-else-if="isPDF" :src="filePreview" width="100%" height="550px"
                        style="border: none; border-radius: 8px"></iframe>
                    <p v-else class="mt-4">Impossible d’afficher ce type de fichier.</p>
                </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-end">
                <v-btn variant="outlined" color="#B71C1C" @click="dialog = false">Fermer</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>









    <v-card density="compact">
        <v-card-text density="compact" class="pa-1">
            <b density="compact"> {{ totalArticles }}</b> Lignes Trouvées
        </v-card-text>
    </v-card>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch, reactive } from 'vue';
import { VDataTable } from "vuetify/lib/components";
import dayjs from 'dayjs';
import { useArticleStore } from "@/store/utils/article.js";
import { uselistDossier } from "@/store/Amm/amm_dossier.js";


export default defineComponent({
    components: {
        VDataTable,
    },

    props: {
        headers: Object,
        items: Object,
        action_modifier: String,
        action2: String,
        action3: String,
        action4: String,
        action5: String,
        action6: String,

        loading: {
            type: Boolean,
            default: false
        },

        showAction1: {
            type: Boolean,
            default: false
        },

        search: {
            type: String,
            default: '',
        },
        isAfficeLabo: {
            type: Boolean,
            default: false
        },
    },

    setup(props, { emit }) {

        // const storeLabo = useArticleStore();
        const storeLabo = uselistDossier();

        const vLabo = ref(null);
        watch(vLabo, (newVal) => {
            emit('update:labo', newVal);
            emit('handleSelectChange', newVal);
        });
        const state = reactive({
            expandedMap: {},
            maxLength: 30,
        });

        // États pour le dialog d’aperçu
        const dialog = ref(false);
        const filePreview = ref(null);
        const isImage = ref(false);
        const isPDF = ref(false);


        const action1PItem = (item) => {
            emit('action1Item', item);
        };

        const action2PItem = (item) => {
            emit('action2Item', item);
        };

        const action3PItem = (item) => {
            emit('action3Item', item);
        };

        const action4PItem = (item) => {
            emit('action4Item', item);
        };

        const action5PItem = (item) => {
            emit('action5Item', item);
        };

        const action6PItem = (item) => {
            emit('action6Item', item);
        };

        const actionDetail = (item) => {
            emit('actionDetail', item);
        };

        const loading = ref(false);


        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }
        };

        const totalArticles = computed(() => {
            return props.items.length;
        });

        const searchTerm = ref(props.search.toLowerCase());
        const internalSelected = ref(props.modelValue); // Track the selected item

        // Emit the selected object (entire item) to the parent whenever it changes
        watch(internalSelected, (newVal) => {
            if (newVal && newVal.length > 0) {
                const selectedItem = props.items.find(item => item.seq === newVal[0]); // Sélectionner l'objet entier basé sur seq
                emit('update:modelValue', selectedItem);
            }
        });

        // Filter items based on search input
        const filteredItems = computed(() => {
            if (!props.items || !Array.isArray(props.items)) {
                return []; // If no items, return empty array
            }

            const searchRegex = new RegExp(searchTerm.value, 'i'); // Case-insensitive search
            return props.items.filter(item =>
                Object.values(item).some(value =>
                    value !== null && value !== undefined && searchRegex.test(value.toString())
                )
            );
        });

        const tooltip = ref();

        // Fonction pour afficher l'info-bulle
        const showTooltip = (event, message) => {
            if (tooltip.value) {
                hideTooltip();
            }

            const div = document.createElement('div');
            div.id = 'tooltip';
            div.innerText = message;
            div.style.position = 'absolute';
            div.style.backgroundColor = '#333';
            div.style.color = '#fff';
            div.style.padding = '5px 10px';
            div.style.borderRadius = '4px';
            div.style.fontSize = '12px';
            div.style.pointerEvents = 'none';
            div.style.top = `${event.clientY + 10}px`;
            div.style.left = `${event.clientX + 10}px`;
            div.style.zIndex = '1000';

            document.body.appendChild(div);
            tooltip.value = div;
        };

        const hideTooltip = () => {
            if (tooltip.value) {
                tooltip.value.remove();
                tooltip.value = null;
            }
        };

        // --- Voir plus / Voir moins logic ---
        const keyFor = (item, index) =>
            item && item.fab_libelle_id != null ? `id_${item.fab_libelle_id}` : `idx_${index}`;

        const isExpanded = (item, index) => !!state.expandedMap[keyFor(item, index)];

        const toggleExpand = (item, index) => {
            const key = keyFor(item, index);
            state.expandedMap[key] = !state.expandedMap[key];
        };

        // const shouldShowToggle = (item) => {
        //     const s = item && item.fab_libelle ? String(item.fab_libelle) : "";
        //     return s.length > state.maxLength;
        // };

        const shouldShowToggle = (item) => {
            const text = item?.fab_libelle || "";
            return text.length > state.maxLength;
        };

        const truncatedText = (text) => {
            if (!text) return "";
            const s = String(text);
            return s.length > state.maxLength ? s.slice(0, state.maxLength) + "…" : s;
        };

        onMounted(async () => {
            if (props.isAfficeLabo) {
                // await storeLabo.fetchLabo(null);
                await storeLabo.fetchListTitulaireAmm();
            }

        });


        // function openFiche(ficheBase64) {
        //     if (!ficheBase64) return;

        //     try {
        //         let mimeType = "application/pdf";

        //         // Détection du type
        //         if (ficheBase64.startsWith("data:")) {
        //             const match = ficheBase64.match(/^data:(.*?);base64,/);
        //             if (match) {
        //                 mimeType = match[1];
        //                 ficheBase64 = ficheBase64.replace(/^data:.*;base64,/, "");
        //             }
        //         } else if (ficheBase64.startsWith("/9j/")) mimeType = "image/jpeg";
        //         else if (ficheBase64.startsWith("iVBOR")) mimeType = "image/png";
        //         else if (ficheBase64.startsWith("R0lGOD")) mimeType = "image/gif";
        //         else if (ficheBase64.startsWith("JVBER")) mimeType = "application/pdf";

        //         // Conversion base64 → blob
        //         const byteCharacters = atob(ficheBase64);
        //         const byteNumbers = new Array(byteCharacters.length);
        //         for (let i = 0; i < byteCharacters.length; i++) {
        //             byteNumbers[i] = byteCharacters.charCodeAt(i);
        //         }
        //         const byteArray = new Uint8Array(byteNumbers);
        //         const blob = new Blob([byteArray], { type: mimeType });
        //         const blobUrl = URL.createObjectURL(blob);

        //         // Assignation pour affichage dans le dialog
        //         filePreview.value = blobUrl;
        //         isImage.value = mimeType.startsWith("image/");
        //         isPDF.value = mimeType === "application/pdf";
        //         dialog.value = true;
        //     } catch (err) {
        //         console.error("Erreur lors de l'ouverture du fichier :", err);
        //         alert("Impossible d'afficher la fiche !");
        //     }
        // }


        // const openFiche = async (item) => {
        //     if (!item) return;

        //     try {
        //         loading.value = true;

        //         console.log("Paramètres procédure :", {
        //             amm_ds_code: item.amm_ds_code,
        //             ligne_code_article: item.ligne_code_article,
        //             ligne_libelle_article: item.ligne_libelle_article
        //         });

        //         let ficheBase64 = await storeLabo.fetchFicheArtWork(item.amm_ds_code,item.ligne_code_article,item.ligne_libelle_article);

        //         let mimeType = "application/pdf";

        //         // Détection du type
        //         if (ficheBase64.startsWith("data:")) {
        //             const match = ficheBase64.match(/^data:(.*?);base64,/);

        //             if (match) {
        //                 mimeType = match[1];
        //                 ficheBase64 = ficheBase64.replace(/^data:.*;base64,/, "");
        //             }
        //         } else if (ficheBase64.startsWith("/9j/")) {
        //             mimeType = "image/jpeg";
        //         } else if (ficheBase64.startsWith("iVBOR")) {
        //             mimeType = "image/png";
        //         } else if (ficheBase64.startsWith("R0lGOD")) {
        //             mimeType = "image/gif";
        //         } else if (ficheBase64.startsWith("JVBER")) {
        //             mimeType = "application/pdf";
        //         }

        //         const byteCharacters = atob(ficheBase64);
        //         const byteNumbers = new Array(byteCharacters.length);

        //         for (let i = 0; i < byteCharacters.length; i++) {
        //             byteNumbers[i] = byteCharacters.charCodeAt(i);
        //         }

        //         const byteArray = new Uint8Array(byteNumbers);
        //         const blob = new Blob([byteArray], { type: mimeType });
        //         const blobUrl = URL.createObjectURL(blob);

        //         filePreview.value = blobUrl;
        //         isImage.value = mimeType.startsWith("image/");
        //         isPDF.value = mimeType === "application/pdf";
        //         dialog.value = true;

        //     } catch (err) {
        //         console.error("Erreur lors de la récupération de l'artwork :", err);

        //     } finally {
        //         loading.value = false;
        //     }
        // };

        const openFiche = async (item) => {
            if (!item) return;

            try {
                loading.value = true;

                // console.log("Paramètres procédure :", {
                //     amm_ds_code: item.amm_ds_code,
                //     ligne_code_article: item.ligne_code_article,
                //     ligne_libelle_article: item.ligne_libelle_article
                // });

                let ficheData = await storeLabo.fetchFicheArtWork(
                    item.amm_ds_code,
                    item.ligne_code_article,
                    item.ligne_libelle_article
                );

                // console.log("Artwork récupéré :", ficheData.substring(0, 100));

                let mimeType = "application/pdf";
                let byteArray;

                // --------------------------------------------------
                // 1. Data URL
                // --------------------------------------------------
                if (ficheData.startsWith("data:")) {

                    const match = ficheData.match(/^data:(.*?);base64,(.*)$/);

                    if (!match) {
                        throw new Error("Data URL invalide");
                    }

                    mimeType = match[1];
                    ficheData = match[2];

                    const byteCharacters = atob(ficheData);

                    byteArray = new Uint8Array(byteCharacters.length);

                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteArray[i] = byteCharacters.charCodeAt(i);
                    }
                }

                // --------------------------------------------------
                // 2. HEX
                // --------------------------------------------------
                else if (/^[0-9A-Fa-f]+$/.test(ficheData) && ficheData.length % 2 === 0) {

                    // console.log("Format détecté : HEX");

                    // PDF
                    if (ficheData.startsWith("25504446")) {
                        mimeType = "application/pdf";
                    }

                    // JPEG
                    else if (ficheData.startsWith("FFD8FF")) {
                        mimeType = "image/jpeg";
                    }

                    // PNG
                    else if (ficheData.startsWith("89504E47")) {
                        mimeType = "image/png";
                    }

                    // GIF
                    else if (ficheData.startsWith("47494638")) {
                        mimeType = "image/gif";
                    }

                    byteArray = new Uint8Array(ficheData.length / 2);

                    for (let i = 0; i < ficheData.length; i += 2) {
                        byteArray[i / 2] = parseInt(
                            ficheData.substring(i, i + 2),
                            16
                        );
                    }
                }

                // --------------------------------------------------
                // 3. Base64
                // --------------------------------------------------
                else {

                    // console.log("Format détecté : Base64");

                    if (ficheData.startsWith("/9j/")) {
                        mimeType = "image/jpeg";
                    }
                    else if (ficheData.startsWith("iVBOR")) {
                        mimeType = "image/png";
                    }
                    else if (ficheData.startsWith("R0lGOD")) {
                        mimeType = "image/gif";
                    }
                    else if (ficheData.startsWith("JVBER")) {
                        mimeType = "application/pdf";
                    }

                    const byteCharacters = atob(ficheData);

                    byteArray = new Uint8Array(byteCharacters.length);

                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteArray[i] = byteCharacters.charCodeAt(i);
                    }
                }

                // --------------------------------------------------
                // Création du Blob
                // --------------------------------------------------
                const blob = new Blob(
                    [byteArray],
                    { type: mimeType }
                );

                // console.log("MIME :", mimeType);
                // console.log("Taille Blob :", blob.size);
                // console.log("Blob :", blob);

                const blobUrl = URL.createObjectURL(blob);

                filePreview.value = blobUrl;

                isImage.value = mimeType.startsWith("image/");
                isPDF.value = mimeType === "application/pdf";

                dialog.value = true;

            } catch (err) {

                console.error("Erreur lors de la récupération de l'artwork :", err);

            } finally {
                loading.value = false;
            }
        };



        return {
            formatDateTime,
            action1PItem, action2PItem, action3PItem, action4PItem, action5PItem, action6PItem,
            searchTerm, filteredItems, internalSelected,
            showTooltip, hideTooltip,
            actionDetail,
            totalArticles,
            keyFor, isExpanded, toggleExpand, shouldShowToggle, truncatedText, storeLabo, vLabo,
            openFiche, dialog, filePreview, isImage, isPDF,

        };
    }
});
</script>

<style>
.v-data-table.amm_header .v-table__wrapper>table>thead>tr th,
.v-data-table.amm_header .v-table__wrapper>table tbody>tr th {
    background-color: #b3ccb8 !important;
    white-space: nowrap;
    color: #000000 !important;
}


/* .v-data-table.amm_header .v-table__wrapper table th,
.v-data-table.amm_header .v-table__wrapper table td {
    border-right: 2px solid #ccc;
} */

/* CSS spécifique pour ton tableau */
.bordered-table {
    border-left: 3px solid #ccc;
    /* bordure gauche */
    border-right: 3px solid #ccc;
    /* bordure droite */
    display: flex;
    flex-direction: column;
    height: 650px;
    /* même que le height du tableau */
    position: relative;
    /* nécessaire pour le pseudo-élément */
}

/* Le wrapper doit remplir tout l'espace */
.bordered-table .v-data-table__wrapper {
    flex: 1;
}

/* Bordure horizontale en bas */
.bordered-table::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #ccc;
    /* la bordure horizontale */
}

.fab-cell {
    max-width: 350px;
    /* largeur max */
    font-size: 13px;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* limite à 2 lignes */
    -webkit-box-orient: vertical;
    overflow: hidden;
}


.fab-cell.expanded {
    display: block;
    /* enlève la restriction en mode étendu */
}
</style>