<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabsCatalogue></MyTabsCatalogue>
                </v-card>
                <v-spacer></v-spacer>

                <div>
                    <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{ ip_server
                    }}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <u>Login</u> :&nbsp;<b><span style="color: #388E3C;">{{ user }}</span></b>
                </div>&nbsp;&nbsp;
                <div>
                    <span
                        :style="{ backgroundColor: isOnline ? 'green' : 'red', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }">
                    </span>
                </div>

                <div>
                    <v-btn @click="onHome">
                        <v-img :width="20" :src="require('@/assets/home.png')"></v-img>
                    </v-btn>
                </div>
            </v-app-bar>
            <v-main :class="{ 'blur-effect': dialogVisibleNewCode }" style="--v-layout-top: 40px" app>
                <v-card-actions density="compact">
                    <!-- <v-btn variant="tonal" color="#37474F" @click="refresh" :disabled="loading" density="compact">
                        ACTUALISER
                    </v-btn> -->
                    <v-spacer />
                    <v-btn variant="tonal" color="#004D40" @click="newCode" :disabled="loading" density="compact">
                        Nouveau
                    </v-btn>
                </v-card-actions>

                <div class="pa-2">
                    <!-- <MyTableCatalogue :headers="headers" :items="list" height="590" :loading="loading">
                    </MyTableCatalogue> -->

                    <MyTableCodeBarre :headers="headers" :items="list" height="590" :loading="loading">
                    </MyTableCodeBarre>


                    <v-dialog v-if="dialogVisibleNewCode" v-model="dialogVisibleNewCode" :persistent="true"
                        width="670px">
                        <newCode @annuler="onAnnulerNew" @save="onSave" />
                    </v-dialog>


                </div>
                <v-row class="d-flex justify-end">
                    <!-- <v-btn variant="tonal" color="primary" @click="exporter" :disabled="loading" density="compact"
                        class="mr-7">
                        Export
                    </v-btn> -->
                </v-row>

            </v-main>
        </v-app>
    </v-card>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onBeforeMount, watch } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import MyTabsCatalogue from '@/components/catalogue/MyTabsCatalogue.vue';
import MyTableCatalogue from '@/components/catalogue/MytableCatalogue.vue';
import MyTableCodeBarre from '@/components/catalogue/MyTableCodeBarre.vue';
import MySelect from '@/components/MySelect.vue';
import { useEnumerationStore } from "@/store/utils/enumeration.js";
import { useTarifStore } from "@/store/utils/tarif.js";
import { useClientStore } from "@/store/utils/client.js";
import { useCatalStore } from "@/store/Catalogue/catalogue.js";
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

import newCode from '@/views/catalogue/newCode.vue';

export default defineComponent({
    components: {
        MyTabsCatalogue,
        MyTableCatalogue,
        MyTableCodeBarre,
        MySelect,
        newCode,

    },
    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },
    setup(props) {

        const isOnline = useOnline();
        const router = useRouter();
        const user = localStorage.getItem('username');

        const loading = computed(() => storeCatal.loading);
        const storeEnum = useEnumerationStore();
        const storeTarif = useTarifStore();
        const storeClient = useClientStore();
        const storeCatal = useCatalStore();
        // const mois = ref([]);
        const annee = ref([]);
        const tarif = ref([]);
        const client = ref([]);
        const list = ref([]);
        const testCatal = ref([]);

        const distrib = ref(false);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();


        const clientCode = ref('');
        const moisCode = ref(currentMonth + 1);
        const anneeCode = ref(currentYear);
        const tarifCode = ref('');
        const ip_server = ref('');

        const dialogVisibleNewCode = ref(false);



        onMounted(async () => {
            list.value = [];
            // await search();
            await fetchListCodeBarre();

            const name_server = localStorage.getItem('name_server');
            if (name_server === 'SIMUL221') {
                ip_server.value = '192.168.130.221';
            } else if (name_server === 'SIMUL220') {
                ip_server.value = '192.168.130.220';
            }
            else if (name_server === 'OPHAM') {
                ip_server.value = '192.168.130.2';
            } else {
                ip_server.value = name_server || 'Inconnu';
            }
        });


        const fetchClient = async () => {
            loading.value = true;
            await storeClient.fetchlListClient();
            client.value = storeClient.ListClients.map(item => ({
                value: item.clcode.trim(), // Code du client
                text: `${item.clcode.trim()} - ${item.clnom1}` // Libellé affiché
            }));
            loading.value = false;
        };

        const fetchTestCatal = async () => {
            await storeCatal.fetchTestCatalogue(moisCode.value, anneeCode.value);
            testCatal.value = storeCatal.testCatals
        };

        const generationCatalogue = async () => {
            await storeCatal.GenereCatalogue(moisCode.value, anneeCode.value);
        };

        onBeforeMount(async () => {
            await fetchClient();
        })

        const listCatalogue = async () => {
            // console.log(clientCode.value)
            // console.log(moisCode.value)
            // console.log(anneeCode.value)
            // console.log(tarifCode.value)

        }

        const generer = async (item) => {

            if (moisCode.value == null || anneeCode.value == null) {
                swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', swal.stopTimer);
                        toast.addEventListener('mouseleave', swal.resumeTimer);
                    }
                }).fire({
                    icon: 'error',
                    title: 'Veuillez Remplir les champs manquant avant la génération',
                    background: '#FFF3E0',
                });
                return;
            }

            await fetchTestCatal()


        };

        const distribue = ref(0);

        watch(
            () => distrib.value,
            (newValue) => {
                console.log(newValue);
                if (!newValue) {
                    distribue.value = 0;
                } else {
                    distribue.value = 1;
                }
            }
        );


        const search = async () => {
        };

        const exporter = async () => {
            console.log('Exporting to Excel...');

            // Fetch the data from storeCatal
            await storeCatal.fetchCatalogue(clientCode.value, moisCode.value, anneeCode.value, tarifCode.value);
            const tableData = storeCatal.catalogues;

            const exportData = tableData.map(item => {
                return headers.reduce((acc, header) => {
                    acc[header.title] = item[header.key];
                    return acc;
                }, {});
            });

            const ws = XLSX.utils.json_to_sheet(exportData);

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            XLSX.writeFile(wb, 'Export Catalogue.xlsx');
        };


        const headers = [
            { title: 'LABO', align: 'start', key: 'labo', sortable: true },
            { title: 'ARTICLE', align: 'start', key: 'article', sortable: true },
            // { title: 'PAYS', align: 'start', key: 'pays', sortable: true },
            // { title: 'CODE LABO', align: 'center', key: 'code_labo', sortable: true },
            // { title: 'CODE PAYS', align: 'center', key: 'code_pays', sortable: true },
            // { title: 'CODE ARTICLE', align: 'center', key: 'code_article', sortable: true },
            // { title: 'CLE CTRL', align: 'center', key: 'cle_ctrl', sortable: true },
            { title: 'CODE EAN13', align: 'start', key: 'code_ean13', sortable: true },
        ]

        const newCode = async () => {
            dialogVisibleNewCode.value = true;
            // listDossier();
        };

        const refresh = async () => {
            await fetchListCodeBarre();
        }

        const fetchListCodeBarre = async () => {
            await storeCatal.fetchListCodeBarre();
            list.value = storeCatal.listCodeBarres

        };

        const onAnnulerNew = async () => {
            dialogVisibleNewCode.value = false;
            // await fetchListCodeBarre();
        };

        const onSave = async () => {
            dialogVisibleNewCode.value = false;
            await fetchListCodeBarre();
        };


        return {
            headers, isOnline, user,
            annee, tarif, client, search, fetchClient, listCatalogue, fetchTestCatal,
            anneeCode, tarifCode, clientCode, generer, generationCatalogue,
            list, exporter, moisCode, distrib, distribue, loading,
            ip_server,
            dialogVisibleNewCode, newCode, onAnnulerNew, onSave,refresh,


        };
    },


})

</script>

<style>
.blur-effect {
    filter: blur(5px);
    /* Applique un effet de flou */
    pointer-events: none;
    /* Désactive les interactions avec les éléments flous */
    user-select: none;
    /* Empêche la sélection de texte dans les zones floues */
}
</style>