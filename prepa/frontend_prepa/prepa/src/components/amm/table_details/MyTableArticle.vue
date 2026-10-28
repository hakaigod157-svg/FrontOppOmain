<template>
    <v-data-table class="article_header bordered-detail" :headers="headers" :fixed-header="true" :loading="loading"
        density="compact" :items="items" :items-per-page="-1" no-data-text="Pas de données disponibles" hover="true"
        @click:row="handleClick" hide-default-footer="true">


        <template v-slot:[`item.action`]="{ item }">
            <v-btn size="x-small" color="#FFB74D" @click="action1PItem(item)">
                {{ action_modifier }}
            </v-btn>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <v-btn variant="flat" block size="x-small" color="#E57373" @click="action2PItem(item)"
                style="margin-top:2px;margin-bottom:2px">
                {{ action2 }}
            </v-btn>
        </template>

        <!-- <template v-slot:[`item.ligne_image`]="{ item }">
            <div v-if="item.ligne_image">
                {{ item.ligne_image }}
            </div>
            <v-file-input v-else v-model="item.newFile" label="Add image" accept="image/*,.pdf" variant="underlined"
                density="compact" prepend-icon="mdi-paperclip" hide-details @change="onFileSelected(item)"
                style="max-width: 300px;" />
        </template>

        <template v-slot:[`item.date_amm`]="{ item }">
            {{ formatDateTime(item.date_amm) }}
        </template> -->

        <template v-slot:[`item.date_amm`]="{ item }">
            {{ formatDateTime(item.date_amm) }}
        </template>


        <!-- <template v-slot:[`item.libelle_article`]="{ item }">
            <div>
                <div>{{ item.libelle_article }}</div>
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

        <template v-slot:[`item.libelle_article`]="{ item }">
            <div class="d-flex flex-column" style="min-width: 200px;">
                <!-- Texte au-dessus -->
                <div class="mb-1 font-weight-medium">{{ item.libelle_article }}</div>

                <!-- Ligne contenant icône et upload -->
                <!-- <div class="d-flex align-center gap-3"> -->
                <div v-if="decision !== 'ACCORDE'" class="d-flex align-center gap-3">

                    <!-- Icône Aperçu (affichée uniquement si image existe) -->
                    <v-tooltip v-if="item.ligne_image && item.ligne_image.trim() !== ''" location="top">
                        <template #activator="{ props }">
                            <v-icon v-bind="props" color="primary" density="compact" class="cursor-pointer"
                                @click="openFiche(item)">
                                mdi-eye
                            </v-icon>
                        </template>
                        Aperçu
                    </v-tooltip>

                    <!-- Upload toujours affiché avec label dynamique -->
                    <v-file-input v-model="item.newFile"
                        :label="item.ligne_image && item.ligne_image.trim() !== '' ? 'Changer art work' : 'Ajouter art work'"
                        accept="image/*,.pdf" variant="underlined" density="compact" prepend-icon="mdi-pencil"
                        hide-details style="max-width: 400px;" @change="onFileSelected(item)" />

                    <!-- Tooltip pour le bouton d'upload -->
                    <v-tooltip activator="parent" location="top">
                        {{ item.ligne_image && item.ligne_image.trim() !== '' ? 'Changer art work' : 'Ajouter art work'
                        }}
                    </v-tooltip>

                </div>
            </div>
        </template>







        <template v-slot:[`item.ligne_image`]="{ item }">
            <div class="d-flex justify-center align-center" style="height: 100%; min-height: 40px">
                <!-- ✅ Si ligne_image existe → on l’affiche -->
                <template v-if="item.ligne_image && item.ligne_image.trim() !== ''">
                    <v-file-input v-model="item.newFile" label="Changer art work" accept="image/*,.pdf"
                        variant="underlined" density="compact" prepend-icon="mdi-pencil" hide-details
                        @change="onFileSelected(item)" style="max-width: 300px;" />

                    <v-tooltip activator="parent" location="start">
                        Changer art work
                    </v-tooltip>
                </template>

                <!-- 🚀 Sinon → on affiche un input fichier -->
                <template v-else>
                    <v-file-input v-model="item.newFile" label="Add image" accept="image/*,.pdf" variant="underlined"
                        density="compact" prepend-icon="mdi-paperclip" hide-details @change="onFileSelected(item)"
                        style="max-width: 300px;" />
                </template>
            </div>
        </template>

        <!-- <template v-slot:[`item.ligne_image`]="{ item }">
            <div class="d-flex justify-center align-center" style="height: 100%; min-height: 40px">
                <template v-if="item.ligne_image && item.ligne_image.trim() !== ''">

                    <v-icon color="primary" density="compact" @click="openFiche(item.ligne_image)"
                        class="cursor-pointer">
                        mdi-eye
                    </v-icon>
                    <v-tooltip activator="parent" location="start">
                        Aperçu
                    </v-tooltip>
                </template>
                <template v-else>
                    <v-file-input v-model="item.newFile" label="Add image" accept="image/*,.pdf" variant="underlined"
                        density="compact" prepend-icon="mdi-paperclip" hide-details @change="onFileSelected(item)"
                        style="max-width: 300px;" />
                </template>
            </div>
        </template> -->


        <!-- <template v-slot:[`item.fabricant`]="{ item }">
            <div style="white-space: pre-wrap; /* permet les retours à la ligne */ 
           word-wrap: break-word; 
           padding: 8px; 
           border-radius: 4px;">
                {{ item.fabricant }}
            </div>
        </template> -->



        <!-- <template v-slot:[`item.fabricant`]="{ item, index }">
            <div :class="{ expanded: isExpanded(item, index) }">
                <span>
                    {{ isExpanded(item, index) ? item.fabricant : truncatedText(item.fabricant) }}
                </span>

                <template v-if="shouldShowToggle(item)">
                    <v-btn size="x-small" variant="text" class="ml-1 px-1 see-more-btn" style="color: #1976d2;"
                        @click="toggleExpand(item, index)">
                        {{ isExpanded(item, index) ? 'Voir moins' : 'Voir plus' }}
                    </v-btn>
                </template>
            </div>
        </template> -->

        <template v-slot:[`item.fabricant`]="{ item, index }">
            <v-tooltip bottom>
                <!-- Déclencheur -->
                <template #activator="{ props }">
                    <div v-bind="props" :class="{ expanded: isExpanded(item, index) }">
                        <span>
                            {{ isExpanded(item, index) ? item.fabricant : truncatedText(item.fabricant) }}
                        </span>

                        <template v-if="shouldShowToggle(item)">
                            <v-btn size="x-small" variant="text" class="ml-1 px-1 see-more-btn" style="color: #1976d2;"
                                @click.stop="toggleExpand(item, index)">
                                {{ isExpanded(item, index) ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>
                        </template>
                    </div>
                </template>

                <!-- Contenu du tooltip -->
                <span>{{ item.fabricant }}</span>
            </v-tooltip>
        </template>


        <template v-slot:body.append>
            <tr class="end-row">
                <!-- <td :colspan="showActions ? 3 : 2"></td> -->
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
                    <iframe v-else-if="isPDF" :src="filePreview" width="100%" height="400px"
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
import { defineComponent, ref, computed, onUnmounted, reactive } from 'vue';
import { VDataTable } from "vuetify/lib/components";
import dayjs from 'dayjs';
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
        decision: String,
        dossier :String,

        loading: {
            type: Boolean,
            default: false
        },

        showAction1: {
            type: Boolean,
            default: false
        },
    },

    setup(props, { emit }) {
        const state = reactive({
            expandedMap: {},
            maxLength: 50,
        });
        const action1PItem = (item) => {
            emit('action1Item', item);
        };

        const action2PItem = (item) => {
            emit('action2Item', item);
        };

        const storeArticle = uselistDossier();

        // États pour le dialog d’aperçu
        const dialog = ref(false);
        const filePreview = ref(null);
        const isImage = ref(false);
        const isPDF = ref(false);


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

        // --- Voir plus / Voir moins logic ---
        const keyFor = (item, index) =>
            item && item.fabricant_id != null ? `id_${item.fabricant_id}` : `idx_${index}`;

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
            const text = item?.fabricant || "";
            return text.length > state.maxLength;
        };

        const truncatedText = (text) => {
            if (!text) return "";
            const s = String(text);
            return s.length > state.maxLength ? s.slice(0, state.maxLength) + "…" : s;
        };

        const onFileSelected = (item) => {
            // Émet l'image vers le parent
            emit('file-selected', { seq: item.seq, file: item.newFile });
        };


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


        const openFiche = async (item) => {
            if (!item) return;

            try {
                loading.value = true;
                const codeDossier = props.dossier;

                console.log("Paramètres procédure :", {
                    amm_ds_code: codeDossier,
                    ligne_code_article: item.code_article,
                    ligne_libelle_article: item.libelle_article
                });

                let ficheData = await storeArticle.fetchFicheArtWork(codeDossier,item.code_article,item.libelle_article);

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
            action1PItem, action2PItem,
            totalArticles,
            keyFor, isExpanded, toggleExpand, shouldShowToggle, truncatedText,
            onFileSelected, openFiche, dialog, filePreview, isImage, isPDF,


        };
    }
});
</script>

<style>
.v-data-table.article_header .v-table__wrapper>table>thead>tr th,
.v-data-table.article_header .v-table__wrapper>table tbody>tr th {
    background-color: #8C9EFF !important;
    white-space: nowrap;
    color: #000000 !important;
}

.v-data-table.article_header .v-table__wrapper table th,
.v-data-table.article_header .v-table__wrapper table td {
    border-right: 2px solid #ccc;
}
</style>