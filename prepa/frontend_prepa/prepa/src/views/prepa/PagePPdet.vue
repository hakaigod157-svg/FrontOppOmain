<template>
    <v-card class="pa-4">
        <!-- Header de la carte -->
        <v-card-title class="custom-card-dm">
            <div class="d-flex justify-space-between align-center">
                <span class="text-h5">Détails du <u>{{ TPPCODE }}</u></span>
                <v-icon @click="closeDetail" class="cursor-pointer">mdi-close</v-icon>
            </div>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Contenu principal -->
        <v-card-text>
            <!-- Section Informations -->
            <v-card outlined>
                <v-card-text>
                    <v-card-actions density="compact">

                        <v-card-title density="compact">
                            <div>
                                <label density="compact">Préparation: </label>
                                <MyTextField style="width: 130px" readonly :value="TPPCODE"
                                    class="custom-disabled-field">
                                </MyTextField>
                            </div>
                        </v-card-title>

                        <v-card-title density="compact">
                            <div>
                                <label class="label-inline" density="compact">Client:</label>
                                <div class="d-flex align-center">
                                    <MyTextField style="width: 70px" readonly :value="TPPCODECLIENT"
                                        class="custom-disabled-field">
                                    </MyTextField>
                                    <MyTextField style="width: 340px" readonly :value="TPPCLIENT"
                                        class="custom-disabled-field">
                                    </MyTextField>
                                </div>

                            </div>
                        </v-card-title>

                        <v-card-title density="compact">
                            <div>
                                <label class="label-inline" density="compact">Date: {{ TTPDATE }}</label>
                                <MyTextField style="width: 130px" readonly :value="TPPDATE"
                                    class="custom-disabled-field">
                                </MyTextField>
                            </div>
                        </v-card-title>

                        <v-card-title density="compact">
                            <div>
                                <label class="label-inline" density="compact">Facture Partielle:</label>
                                <MyTextField style="width: 130px" readonly :value="TPPFACTPART"
                                    class="custom-disabled-field">
                                </MyTextField>
                            </div>
                        </v-card-title>
                    </v-card-actions>
                </v-card-text>
            </v-card>

            <!-- Table avec chargement -->
            <div class="pa-2">
                <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                    density="compact"></v-progress-linear>

                <MyTablePP :headers="headers" :items="list" />
            </div>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Actions de la carte -->
        <v-card-actions>
            <v-chip color="#B2EBF2" variant="flat">Articles Offert</v-chip>
            <v-spacer></v-spacer>
            <v-btn color="#B71C1C" variant="outlined" @click="annuler">
                FERMER
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePPStore } from "@/store/Apreparer/listepp";
import MyTablePP from '@/components/prepa/MyTablePP.vue';
import MyTextField from '@/components/MyTextField.vue';

export default defineComponent({
    components: {
        MyTablePP,
        MyTextField,
    },

    props: {
        pp_code: String,
        date: Date,
        code_client: String,
        client: String,
        facture_part: String,

    },

    setup(props, { emit }) {

        const dialogVisible = ref(false);
        const user = localStorage.getItem('username');
        const router = useRouter();
        const list = ref([]);
        const store = usePPStore();
        const loading = computed(() => store.loading)

        const TPPCODE = props.pp_code;
        const TPPDATE = props.date;
        const TPPCODECLIENT = props.code_client;
        const TPPCLIENT = props.client;
        const TPPFACTPART = props.facture_part;


        const annuler = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        const closeDetail = () => {
            dialogVisible.value = false;
            emit('annuler');
        };

        onMounted(async () => {
            list.value = [];
            list_det();

        })


        const list_det = async () => {
            await store.fecthlistDet(TPPCODE)
            list.value = store.listPPs
        }

        const headers = [
            { title: 'PREP', align: 'start', key: 'ppL_code', sortable: true },
            { title: 'LIBELLE', align: 'start', key: 'ppL_libelle' },
            { title: 'QTE', align: 'start', key: 'ppL_qte', sortable: true },
            { title: 'LOT', align: 'center', key: 'ppL_lot', sortable: true },
            { title: 'DEPOT', align: 'start', key: 'ppL_depot' },
            { title: 'EMPLACEMENT', align: 'center', key: 'ppL_empl' },

        ];

        return {
            dialogVisible, loading,
            annuler, closeDetail,
            user, list, list_det,
            headers,
            TPPCODE, TPPDATE, TPPCODECLIENT, TPPCLIENT, TPPFACTPART,

        };
    }
});

</script>
<style>
.custom-disabled-field input {
    color: black !important;
    background-color: #FFFFFF !important;
    opacity: 1 !important;
    cursor: not-allowed;
    -webkit-text-fill-color: black !important;
}

.custom-disabled-field {
    pointer-events: none;
}
</style>
