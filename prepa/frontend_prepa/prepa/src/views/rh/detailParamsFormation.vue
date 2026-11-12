<template>
    <v-card>
        <!-- Titre avec code formation et bouton fermer -->
        <v-card-title class="custom-card-dm">
            <div class="title-container">
                <div class="title-left">
                    <v-icon size="26" color="deep-purple-accent-4" class="mr-2">mdi-school</v-icon>
                    <span class="title-text">
                        <strong>Détail de la formation  </strong>
                        <!-- <span class="form-code">{{ formCode }}</span> -->
                        <span v-if="formation?.form_date" class="form-date">
                        </span>
                    </span>
                </div>
                <v-btn icon variant="text" color="grey-darken-1" size="small" class="close-btn" @click="$emit('close')">
                    <v-icon size="22">mdi-close</v-icon>
                </v-btn>
            </div>
        </v-card-title>

        <v-divider class="my-2"></v-divider>

        <v-card-text>
            <!-- Éléments sélectionnés affichés en haut -->
            <div class="info-principale-cards">
                <v-row dense>
                    <v-col v-for="card in infoCards" :key="card.id" :cols="card.cols" class="info-col-card">
                        <v-card class="info-card" outlined>
                            <v-card-title class="card-title">{{ card.title }}</v-card-title>
                            <v-card-text>
                                <div class="info-row">
                                    <v-text-field v-for="field in card.fields" :key="field.label" :label="field.label"
                                        :model-value="field.value" :style="{ flex: field.flex || 1 }" variant="outlined"
                                        density="compact" readonly hide-details class="readonly-field" />
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </div>

            <v-divider class="my-3"></v-divider>

            <!-- Onglet unique (même style que le détail recrutement) -->
            <v-toolbar :elevation="1" density="compact" color="#d7ead5">
                <v-tabs model-value="participants" color="deep-purple-accent-4" class="custom-tabs" grow
                    density="compact" slider-color="deep-purple-accent-4">
                    <v-tab value="participants">
                        PARTICIPANTS
                        <v-badge :content="list.length" color="#FF8A65" inline />
                    </v-tab>
                </v-tabs>
            </v-toolbar>

            <!-- Tableau -->
            <v-card class="mt-4">
                <v-card-text style="min-height: 320px; max-height: 320px">
                    <TableauDetailParamsFormation :items="list" :headers="headers" :loading="loading" :form-code="formCode" />
                </v-card-text>
            </v-card>
        </v-card-text>

        <!-- Actions bas -->
        <v-card-actions>
            <v-spacer />
            <v-btn color="red" density="compact" variant="outlined" @click="$emit('close')">Fermer</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import TableauDetailParamsFormation from "@/components/rh/tableauDetailParamsFormation.vue";
import { useFormation } from "@/store/Rh/rh_formation";
import { useformatDate2 } from "@/composables/useformatDate2";

export default defineComponent({
    name: "DetailFormation",
    components: { TableauDetailParamsFormation },
    props: {
        formCode: { type: [String, Number], required: true },
        // Ligne de formation sélectionnée (objet complet du tableau parent)
        formation: { type: Object, required: false, default: () => ({}) },
    },
    emits: ["close"],
    setup(props) {
        const list = ref([]);
        const loading = ref(false);
        const store = useFormation();
        const { formatDate } = useformatDate2();

        // Headers (clés = champs renvoyés par l'API)
        const headers = [
            { title: "MATRICULE", key: "form_matr_ligne", sortable: true },
            { title: "NOM", key: "empl_nom", sortable: true },
            { title: "PRENOM", key: "empl_prenom", sortable: true },
            { title: "POSTE", key: "form_poste_ligne", sortable: true },
            { title: "EVALUATION A CHAUD", key: "form_eval_ligne", sortable: true, align: "center" },
            { title: "EVALUATION A FROID", key: "form_eval_froid_ligne", sortable: true, align: "center" },
        ];

        // Cartes d'infos du haut : modifie ici les champs à afficher
        const infoCards = computed(() => {
            const f = props.formation || {};
            return [
                {
                    id: "c1",
                    title: "",
                    cols: 2,
                    fields: [
                        // { label: "Code", value: f.form_code ?? props.formCode, flex: 1 },
                        { label: "Date", value: f.form_date ? formatDate(f.form_date) : "", flex: 1 },
                        // { label: "Participants", value: f.participant ?? list.value.length, flex: 1 },
                    ],
                },
                {
                    id: "c2",
                    title: "",
                    cols: 4,
                    fields: [
                        { label: "Type", value: f.type ?? "", flex: 1 },
                        { label: "Formation", value: f.form_type ?? "", flex: 2 },
                    ],
                },
                {
                    id: "c3",
                    title: "",
                    cols: 5,
                    fields: [
                        { label: "Entité", value: f.form_entite ?? "", flex: 1.2 },
                        { label: "Description", value: (f.form_descr ?? "").trim(), flex: 2.5 },
                    ],
                },
            ];
        });

        const loadList = async () => {
            loading.value = true;
            try {
                await store.fetchListDetailParamsFormation(props.formCode);
                list.value = store.listDetailParamsFormations;
            } catch (error) {
                console.error("Erreur chargement détail formation :", error);
                list.value = [];
            } finally {
                loading.value = false;
            }
        };

        onMounted(loadList);

        return { list, loading, headers, infoCards, formatDate };
    },
});
</script>

<style>
.custom-card-dm {
    padding: 0;
    margin-bottom: -5px;
}

.title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 2px 2px 2px;
    margin-bottom: -5px;
    background-color: #f8f9fa;
    border-bottom: 2px solid #d7ead5;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
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

.form-code {
    font-weight: 600;
    color: #4caf50;
}

.form-date {
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

.info-principale-cards {
    display: flex;
    justify-content: space-between;
    margin-top: -10px;
}

.info-card {
    padding: 8px;
    background-color: #fafafa;
    border-radius: 6px;
    min-width: 280px;
}

.card-title {
    font-size: 13px;
    font-weight: 700;
    color: #1976d2;
    padding: 0 0 4px 0;
}

.info-row {
    display: flex;
    gap: 5px;
}

.readonly-field {
    cursor: not-allowed;
    background-color: #f9f9f9;
    pointer-events: none;
    user-select: none;
}

.custom-tabs {
    max-width: 350px;
    display: flex;
    justify-content: left;
}

.info-card {
  padding: 8px;
  background-color: #fafafa;
  border-radius: 6px;
  min-width: 0;        /* avant : 280px, ce qui bloquait l'élargissement */
  height: 100%;
}

.info-row {
  display: flex;
  gap: 8px;
}

.info-row .v-input {
  min-width: 0;        /* permet aux champs de se répartir correctement */
}
</style>