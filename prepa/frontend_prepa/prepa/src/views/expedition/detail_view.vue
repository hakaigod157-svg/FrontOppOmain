<template>
    <v-card>
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-left">
                <span class="text-h5">
                    <b><u>Détail</u></b>
                </span>
                <v-icon class="icon-close" @click="closeDetail">mdi-close</v-icon>
            </div>
        </v-card-title>

        <div class="pa-2">
            <v-card>
                <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5" density="compact" />

                <MyTableExped v-else class="compact-table" :headers="headers" :items="detailData" height="350px" />
            </v-card>
        </div>

        <v-card-actions>
            <!-- <v-card>
                <v-row>
                    <v-col>
                        <v-sheet class="pl-2">
                            <b> {{ totalList }}</b> Lignes Trouvées
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-card> -->

            <v-card>
                <v-row class="align-center">
                    <v-col cols="auto">
                        <v-sheet class="pl-2">
                            <b>{{ totalList }}</b> Lignes Trouvées
                        </v-sheet>
                    </v-col>

                    <!-- 🟨 Carré jaune pâle avec compteur -->
                    <v-col cols="auto">
                        <div class="attente-box d-flex align-center">
                            <div class="color-square mr-2 d-flex justify-center align-center">
                                {{ attenteCount }}
                            </div>
                            <span>Attente paiement</span>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
            <v-spacer />
            <v-btn color="red" variant="outlined" @click="annuler">Fermer</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue';
import MyTableExped from '@/components/expedition/MyTableExped.vue';

export default {
    components: { MyTableExped },

    props: {
        detailData: {
            type: Array,
            default: () => [],
        },
    },

    setup(props, { emit }) {
        const loading = ref(false);

        const headers = [
            { title: 'CC', align: 'start', key: 'code_cc', sortable: false },
            { title: 'CODE CLIENT', align: 'center', key: 'code_client', sortable: false },
            { title: 'NOM CLIENT', align: 'start', key: 'nom_client', sortable: false },
            { title: 'DATE VALIDATION ADV', align: 'center', key: 'date_validation_adv', sortable: false },
            // { title: 'A PRENDRE', align: 'center', key: 'a_prendre', sortable: false },
            { title: 'GARDE', align: 'center', key: 'garde', sortable: false },
            // { title: 'SITUATION', align: 'start', key: 'situation', sortable: false },
            // { title: 'VAGUE AXE', align: 'center', key: 'vague_axe', sortable: false },
            { title: 'NOMBRE DE COLIS', align: 'center', key: 'nombre_colis', sortable: false },
            { title: 'DATE LIV PREVU', align: 'center', key: 'dateliv_prevu', sortable: false },
            { title: 'AXE', align: 'center', key: 'cc2axe', sortable: false },

            // { title: 'CC2_VAGUE_LIV', align: 'center', key: 'cc2_vague_liv', sortable: false },
            // { title: 'MODE_LIV', align: 'center', key: 'modeliv', sortable: false },
            // { title: 'DATE_A_LIVRER', align: 'center', key: 'date_a_livrer', sortable: false },
            // { title: 'CC2PASSBAL', align: 'center', key: 'cc2_pass_bal', sortable: false },
        ];

        // 🔹 Log initial au montage du composant
        onMounted(() => {
            // console.log('Données initiales detailData :', props.detailData);
        });

        const annuler = () => emit('annuler');
        const closeDetail = () => emit('annuler');

        // 🔹 Surveille les changements de la prop
        watch(
            () => props.detailData,
            (newVal) => console.log('Nouvelles données reçues :', newVal)
        );

        const totalList = computed(() => {
            return props.detailData.length;
        });

        const attenteCount = computed(() => {
            return props.detailData.filter(item => item.cc2_pass_bal === 1).length;
        });

        return {
            loading, headers, annuler, closeDetail,
            totalList, attenteCount,

        };
    },
};
</script>

<style>
.swal2-container {
    z-index: 20000 !important;
}

.color-square {
    width: 16px;
    height: 16px;
    background-color: #fff3cd;
    /* jaune pâle */
    border: 1px solid #ffeeba;
    border-radius: 4px;
}

.attente-box {
    font-size: 14px;
    font-weight: 500;
    color: #856404;
    /* couleur texte assortie au jaune pâle */
}

.icon-close {
    transition: all 0.3s ease;
    cursor: pointer;
}

/* Effet au survol */
.icon-close:hover {
    color: red;
    transform: scale(1.2) rotate(90deg);
}
</style>
