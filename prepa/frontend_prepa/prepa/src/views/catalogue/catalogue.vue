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
            <v-main style="--v-layout-top: 40px" app>
                <v-card-actions density="compact">

                    <v-card-title density="compact">
                        <MySelect comb_lab="Année" :items="annee" v-model="anneeCode" :disabled="loading"
                            style="width: 145px; height: 35px;">
                        </MySelect>
                    </v-card-title>

                    <!-- <v-card-title density="compact">
                        <v-select :items="mois" item-title="text" item-value="value" v-model="moisCode" label="Mois"
                            :disabled="loading" style="width: 145px; height: 35px;" density="compact"
                            color='deep-purple-accent-4' clearable></v-select>
                    </v-card-title> -->

                    <v-card-title density="compact">
                        <v-select :items="mois" item-title="name" item-value="id" v-model="moisCode" label="Mois"
                            :disabled="loading" style="width: 185px; height: 35px;" density="compact"
                            color='deep-purple-accent-4' clearable></v-select>
                    </v-card-title>


                    <v-card-title density="compact">
                        <MySelect comb_lab="Tarif" :items="tarif" v-model="tarifCode" :disabled="loading"
                            style="width: 145px; height: 35px;">
                        </MySelect>
                    </v-card-title>


                    <v-card-title density="compact">
                        <v-autocomplete :disabled="isUpdating" :items="client" style="width: 200px; height: 35px"
                            item-title="text" item-value="value" label="Client" :min-length="3" density="compact"
                            clearable hide-no-data :loading="loading" color="deep-purple-accent-4" v-model="clientCode">
                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props">
                                    <div class="text-grey lighten-1">{{ item.text }}</div>
                                </v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-card-title>

                    <v-checkbox :label="label" color="secondary" v-model="distrib" class="white-label me-6 ms-6"
                        hide-details hide-no-data density="compact">
                        Distribué
                    </v-checkbox>

                    <v-btn variant="tonal" color="primary" @click="search" :disabled="loading" density="compact">
                        Recherche
                    </v-btn>
                    <v-spacer />
                    <v-btn variant="tonal" color="#004D40" @click="generer" :disabled="loading"
                        density="compact">Génerer Catalogue
                    </v-btn>
                </v-card-actions>

                <div class="pa-2">
                    <MyTableCatalogue :headers="headers" :items="list" height="590" :loading="loading">
                    </MyTableCatalogue>
                </div>
                <v-row class="d-flex justify-end">
                    <v-btn variant="tonal" color="primary" @click="exporter" :disabled="loading" density="compact"
                        class="mr-7">
                        Export
                    </v-btn>
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
import MySelect from '@/components/MySelect.vue';
import { useEnumerationStore } from "@/store/utils/enumeration.js";
import { useTarifStore } from "@/store/utils/tarif.js";
import { useClientStore } from "@/store/utils/client.js";
import { useCatalStore } from "@/store/Catalogue/catalogue.js";
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default defineComponent({
    components: {
        MyTabsCatalogue,
        MyTableCatalogue,
        MySelect,

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


        onMounted(async () => {
            list.value = [];
            await search();

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

        const moisNoms = [
            "janvier", "février", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"
        ];


        /* const fetchEnumMois = async () => {
             loading.value = true;
             storeEnum.params.code = "MOIS";
             await storeEnum.fetchEnums();
 
             mois.value = storeEnum.enumerations
                 .filter((moisNum) => moisNum >= 1 && moisNum <= 12)
                 .map((moisNum) => ({
                     value: moisNum,
                     text: moisNoms[moisNum - 1]
                 }));
             loading.value = false;
         };*/

        const fetchEnumAnnee = async () => {
            loading.value = true;
            storeEnum.params.code = "ANNEE";
            await storeEnum.fetchEnums();
            annee.value = storeEnum.enumerations.filter(item => item > 2020);
            loading.value = false;
        }

        const fetchTarif = async () => {
            loading.value = true;
            await storeTarif.fetchTarif();
            tarif.value = storeTarif.tarifs;
            loading.value = false;
        }

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
            // await fetchEnumMois();
            await fetchEnumAnnee();
            await fetchTarif();
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

            // console.log(testCatal.value)
            const moisTexte = moisNoms[moisCode.value - 1] || 'invalide';
            if (testCatal.value != 0) {
                swal.fire({
                    // title: "Catalogue déjà généré",
                    html: `Le catalogue <strong style="color: red;">${moisTexte}</strong> <strong style="color: red;">${anneeCode.value}</strong> a déjà été généré.`,
                    icon: "warning",
                    confirmButtonText: "OK",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    focusConfirm: true
                });
            } else {
                swal.fire({
                    title: "Chargement...",
                    html: `En cours de génération catalogue : <strong style="color: green;">${moisTexte}</strong> <strong style="color: green;">${anneeCode.value}</strong>,<br> veuillez patienter.`,
                    icon: "info",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false, // Pas de bouton pour forcer l'attente
                    didOpen: () => {
                        swal.showLoading(); // Active l'animation de chargement
                    },
                });

                try {
                    // Appel de la fonction pour générer le catalogue
                    await generationCatalogue();

                    // Mise à jour du swal après la génération
                    swal.fire({
                        title: "Succès",
                        html: `Le catalogue <strong style="color: green;">${moisTexte}</strong> <strong style="color: green;">${anneeCode.value}</strong> a été généré avec succès!`,
                        icon: "success",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        focusConfirm: true,
                        confirmButtonText: "OK",
                    });
                    await search();
                } catch (error) {
                    // Affichage d'une erreur si la génération échoue
                    swal.fire({
                        title: "Erreur",
                        text: "Une erreur est survenue lors de la génération du catalogue.",
                        icon: "error",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        focusConfirm: true,
                        confirmButtonText: "OK",
                    });
                }
            }
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
                    title: 'Veuillez Remplir les champs manquant',
                    background: '#FFF3E0',
                });
                return;
            } else {
                list.value = [];
                await storeCatal.fetchCatalogue(clientCode.value, moisCode.value, anneeCode.value, tarifCode.value, distribue.value)
                list.value = storeCatal.catalogues
            }


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
            { title: 'CODE CLIENT', align: 'start', key: 'code_client', sortable: true },
            { title: 'NOM CLIENT', align: 'start', key: 'nom_client', sortable: true },
            { title: 'CATEGORIE', align: 'start', key: 'categorie', sortable: true },
            { title: 'TARIF', align: 'start', key: 'tarif' },
            { title: 'MOIS', align: 'start', key: 'mois' },
            { title: 'ANNEE', align: 'start', key: 'annee' },
            { title: 'CAT CC', align: 'start', key: 'cc' },
            // { title: 'ETAT', align: 'end', key: 'etat' },
        ]


        return {
            headers, isOnline, user,
            fetchEnumAnnee, fetchTarif,
            mois, annee, tarif, client, search, fetchClient, listCatalogue, fetchTestCatal,
            anneeCode, tarifCode, clientCode, generer, generationCatalogue,
            list, exporter, moisNoms, moisCode, distrib, distribue, loading,
            ip_server,

        };
    },


})

</script>