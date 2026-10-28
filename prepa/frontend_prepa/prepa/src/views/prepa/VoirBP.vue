<template>
    <MyDialog :titre_toolbar=titre_detail @close="closeDialog" :visibleClose=true v-model="dialogVisible">
        <div>
            <div class="container fluid">
                <div class="left pa-2">
                    <v-card-actions density="compact">
                        <v-card-title>
                            <h3><u>Détail Préparation</u><span v-if="showEmpl"> (Empl : {{ storePrepBP.infoBP.empl
                            }})</span></h3>
                        </v-card-title>
                        <v-spacer />
                    </v-card-actions>

                    <MyTable :headers="headersSecondtable" :items="listDetailBP" v-if="!loading" height="270"
                        :showAction1="false" class="custom-header">
                    </MyTable>
                </div>
                <!-- <v-divider vertical  class="bold-divider"/> -->
                <div class="left pa-2">
                    <v-card-actions density="compact">
                        <v-card-title>
                            <h3><u>Détail Contrôle</u></h3>

                            {{ headersCtrlBP.debut_ctrl }}
                        </v-card-title>
                        <v-spacer />
                    </v-card-actions>



                    <MyTable :headers="headersCtrlBP" :items="listDetailCtrl" v-if="!loading" height="270"
                        :showAction1="false" class="custom-header">
                    </MyTable>
                </div>
            </div>
            <div class="container fluid">
                <div class="right pa-2">
                    <v-card-actions density="compact">
                        <v-card-title>
                            <h3><u>Ligne Article</u>
                                <v-badge floating :content='totalLigne' color="#004D40" inline stacked
                                    size="x-large"></v-badge>
                            </h3>
                        </v-card-title>
                    </v-card-actions>
                    <div style="max-height: 400px; overflow-y: auto;">
                        <MyTable :headers="headersLigne" :items="listDetailPrep" v-if="!loading" height="300" width="5000"
                            :header-color="green">
                        </MyTable>
                    </div>
                </div>
            </div>
        </div>
    </MyDialog>
</template>

<script>
import MyDialog from '@/components/DialogFullScreen.vue';
import MyTable from '@/components/MyTable.vue';
import { useDetailPrepStoreBP } from "@/store/EnPreparation/DetailPrepaBP.js";
import { useRoute, useRouter } from 'vue-router'
import { useReportBPStore } from '@/store/report/printBP';
import { ref, onMounted, computed, defineComponent, watch, onBeforeMount } from "vue";
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js"
import dayjs from 'dayjs';

export default defineComponent({
    components: {
        MyDialog,
        MyTable,
    },
    name: 'voirBP',
    setup() {

        const route = useRoute();
        const codeBP = route.params.BP;
        const router = useRouter();

        const storePrepBP = useDetailPrepStoreBP();
        const loading = ref(false);
        const dialogVisible = ref(false);
        const tableHeaderColor = ref('red');
        const listDetailBP = ref([]);
        const listDetailCtrl = ref([]);
        const listDetailPrep = ref([]);

        let titre_detail = ref("");
        const showEmpl = computed(() => storePrepBP.infoBP.empl !== null);


        const storePrint = useReportBPStore();
        useSessionTimeout(Config.DURRE_SESSION, router);

        function closeDialog() {
            dialogVisible.value = false;
            history.back();
        }

        const updateTitreDetail = () => {
            titre_detail.value = `${codeBP} -> ${storePrepBP.infoBP.etat_BP}`;
        };

        watch(() => storePrepBP.infoBP.etat_BP,
            (newValue) => {
                titre_detail.value = `${codeBP} -> ${newValue}`;
            },
            { immediate: true }
        );

        onBeforeMount(async () => {
            dialogVisible.value = true;
            await fetchDetailPreps();
            updateTitreDetail();
        })

        const headersLigne = [
            { title: 'LIBELLE', align: 'start', key: 'libelle', sortable: true, width: '700px' },
            { title: 'LOT', align: 'start', key: 'lot', width: '340px' },
            { title: 'DATE PER', align: 'start', key: 'datePer', sortable: true, width: '300px' },
            { title: 'EMP', align: 'start', key: 'empl', width: '150px' },
            { title: 'QTE', align: 'start', key: 'qte' },

        ]

        const headersSecondtable = [
            { title: 'RAYON', align: 'start', key: 'rayon', sortable: true },
            { title: 'DEBUT PREPA', align: 'start', key: 'debut_prep_rayon' },
            { title: 'FIN PREPA', align: 'start', key: 'fin_prep_rayon', sortable: true },
            { title: 'DUREE PREP', align: 'center', key: 'duree_prep_rayon', width: '1%' },
            { title: 'AGENT PREPA', align: 'start', key: 'agent_prep_rayon', width: '1%' },
            { title: 'QTE', align: 'start', key: 'qte_total', width: '1%' },
            { title: 'ETAT', align: 'start', key: 'etat_BP', width: '1%' },
        ]

        const headersCtrlBP = [
            { title: 'DEBUT CTRL', align: 'start', key: 'debut_ctrl' },
            { title: 'FIN CTRL', align: 'start', key: 'fin_ctrl' },
            { title: 'DUREE CTRL', align: 'center', key: 'duree_ctrl' },
            { title: 'AGENT CTRL', align: 'start', key: 'agent_ctrl' },
            { title: 'QTE TOTAL', align: 'start', key: 'qte_total' },
            { title: 'NB COLIS', align: 'center', key: 'nbColis' },
            { title: 'ETAT', align: 'start', key: 'etat_BP' },

        ]

        const fetchDetailPreps = async () => {
            loading.value = true;

            await storePrepBP.fetchDetailPrepBP(codeBP);
            await storePrepBP.fetchDetailBP(codeBP);
            await storePrepBP.fetchDetailCTRL(codeBP);
            await storePrepBP.fetchinfoBP(codeBP);
            if (storePrepBP.detailBP.length > 0) {
                listDetailBP.value = storePrepBP.detailBP;
            }
            if (storePrepBP.detailCTRL.length > 0) {
                listDetailCtrl.value = storePrepBP.detailCTRL;
            }
            if (storePrepBP.detailPrepsBP.length > 0) {
                listDetailPrep.value = storePrepBP.detailPrepsBP;
            }

            loading.value = false;
        }

        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
            } else {
                return '';
            }

        };


        const totalLigne = computed(() => {
            if (Array.isArray(storePrepBP.detailPrepsBP)) {
                return storePrepBP.detailPrepsBP.filter(item => item.libelle.trim() !== null).length;
            } else {
                return 0;
            }
        });


        return {
            dialogVisible,
            headersLigne, headersSecondtable, titre_detail, headersCtrlBP,
            fetchDetailPreps, storePrepBP,
            closeDialog,
            onMounted, codeBP, tableHeaderColor, showEmpl,
            formatDateTime, updateTitreDetail, totalLigne, listDetailBP, listDetailCtrl, listDetailPrep

        }
    }
});
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;

    justify-content: space-between;

    overflow-y: auto;
}

.left {
    flex-basis: 70%;
}

.right {
    flex-basis: 30%;
}

.bold-divider {
    border-width: 3px;
    font-weight: bold;
    color: #E040FB;
}

.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc;
    white-space: nowrap;

}

.custom-header {
    background-color: blue lighten-2;
    /* Remplacez par votre couleur préférée */
}

.div1 {
    margin-bottom: -40px;
}
</style>