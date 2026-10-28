<template>
    <v-app>
        <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
            <v-card density="compact">
                <MyTabsExped></MyTabsExped>
            </v-card>
            <v-spacer></v-spacer>

            <div>
                <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{
                    ip_server }}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;

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

        <v-main>
            <v-container fluid>

                <!-- SELECT -->
                <v-row>
                    <v-col cols="6" md="2">
                        <v-select label="Procédure" :items="listView" item-title="name" item-value="name"
                            v-model="selected" @update:modelValue="onChange" variant="outlined" density="compact"
                            clearable />
                    </v-col>

                    <v-col cols="12" md="4" v-if="showParam">
                        <div class="d-flex align-center" style="gap: 12px;">

                            <v-autocomplete class="flex-grow-0" style="width: 180px;" label="Taux" v-model="paramInput"
                                :items="listTaux" item-title="mat_taux" item-value="mat_taux" variant="outlined"
                                density="compact" hide-details clearable />

                            <!-- <v-autocomplete class="flex-grow-0" style="width: 180px;" label="Taux" v-model="paramInput"
                                :items="listTaux" item-title="mat_taux" item-value="mat_taux" variant="outlined"
                                density="compact" hide-details clearable @update:modelValue="val => {
                                    paramInput = val
                                    if (val) loadData()
                                }" /> -->
                            <v-text-field class="flex-grow-0" style="width: 180px;" label="Prime max"
                                v-model="PrimeMaxValue" variant="outlined" density="compact" hide-details type="number"
                                step="0.01" min="0" clearable />

                            <v-btn color="primary" class="ml-2" @click="loadData"
                                :disabled="!paramInput || !PrimeMaxValue">
                                Charger
                            </v-btn>

                        </div>
                    </v-col>

                </v-row>

                <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                    density="compact"></v-progress-linear>


                <!-- TABLEAUX -->
                <v-row v-if="selected && list.length">

                    <!-- TABLEAU 1 -->
                    <v-col cols="12" md="4">
                        <v-data-table class="blue-header" :headers="headers" :items="list" density="compact"
                            hide-default-footer :items-per-page="-1">

                            <template #item.prime="{ item }">
                                {{ formatNumber(item.prime) }}
                            </template>

                        </v-data-table>
                    </v-col>

                    <!-- TABLEAU 2 -->
                    <v-col cols="12" md="4">
                        <v-data-table class="blue-header" :headers="headers_second" :items="list_second"
                            density="compact" hide-default-footer :items-per-page="-1">

                            <template #item.prime_second="{ item }">
                                {{ formatNumber(item.prime_second) }}
                            </template>

                        </v-data-table>
                    </v-col>
                    <!-- TABLEAU 3 -->
                    <v-col cols="12" md="4">
                        <v-data-table class="blue-header" :headers="headers_third" :items="list_third" density="compact"
                            hide-default-footer :items-per-page="-1">

                            <template #item.prime_third="{ item }">
                                {{ formatNumber(item.prime_third) }}
                            </template>

                        </v-data-table>
                    </v-col>

                </v-row>

                <!-- GRAPHIQUES -->
                <v-row v-if="selected && list.length" class="mt-4">

                    <!-- CHART 1 -->
                    <v-col cols="12" md="4">
                        <Line :data="chartData" :options="chartOptions" />
                    </v-col>

                    <!-- CHART 2 -->

                    <v-col cols="12" md="4">
                        <Line :data="chartData2" :options="chartOptions2" />
                    </v-col>

                    <!-- CHART 3 -->
                    <v-col cols="12" md="4">
                        <Line :data="chartData3" :options="chartOptions3" />
                    </v-col>

                </v-row>


                <!-- TABLEAUX -->
                <v-row v-if="selected && list.length">

                    <!-- TABLEAU 1 DETAIL-->
                    <v-col cols="12" md="4">
                        <v-data-table class="blue-header compact-table no-scroll-x" :headers="headers_det" :items="det_list" density="compact"
                            hide-default-footer :items-per-page="-1">

                            <template #item.qualitatif="{ item }">
                                {{ formatNumber(item.qualitatif) }}
                            </template>

                            <template #item.quantitatif="{ item }">
                                {{ formatNumber(item.quantitatif) }}
                            </template>

                            <template #item.total="{ item }">
                                {{ formatNumber(item.total) }}
                            </template>

                            <template #item.prime_max="{ item }">
                                {{ formatNumber(item.prime_max) }}
                            </template>

                        </v-data-table>
                    </v-col>

                    <!-- TABLEAU 2 DETAIL-->
                    <v-col cols="12" md="4">
                        <v-data-table class="blue-header compact-table no-scroll-x" :headers="headers_det_second" :items="det_list_second"
                            density="compact" hide-default-footer :items-per-page="-1">

                            <template #item.qualitatif_second="{ item }">
                                {{ formatNumber(item.qualitatif_second) }}
                            </template>

                            <template #item.quantitatif_second="{ item }">
                                {{ formatNumber(item.quantitatif_second) }}
                            </template>

                            <template #item.total_second="{ item }">
                                {{ formatNumber(item.total_second) }}
                            </template>

                            <template #item.prime_max_second="{ item }">
                                {{ formatNumber(item.prime_max_second) }}
                            </template>

                        </v-data-table>
                    </v-col>
                    <!-- TABLEAU 3 DETAIL-->
                    <v-col cols="12" md="4">
                        <v-data-table class="blue-header compact-table no-scroll-x" :headers="headers_det_third" :items="det_list_third"
                            density="compact" hide-default-footer :items-per-page="-1">

                            <template #item.qualitatif_third="{ item }">
                                {{ formatNumber(item.qualitatif_third) }}
                            </template>

                            <template #item.quantitatif_third="{ item }">
                                {{ formatNumber(item.quantitatif_third) }}
                            </template>

                            <template #item.total_third="{ item }">
                                {{ formatNumber(item.total_third) }}
                            </template>

                            <template #item.prime_max_third="{ item }">
                                {{ formatNumber(item.prime_max_third) }}
                            </template>

                        </v-data-table>
                    </v-col>

                </v-row>


            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { defineComponent, ref, onBeforeMount, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useOnline } from "@vueuse/core";
import { useBusinessStore } from "@/store/BusinessIntelligence/bi.js";
import { storeToRefs } from "pinia";

// ✅ LINE CHART
import annotationPlugin from 'chartjs-plugin-annotation'
import { Line } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, annotationPlugin);


export default defineComponent({
    components: { Line },

    setup() {
        const router = useRouter();
        const isOnline = useOnline();
        const ip_server = ref('');
        const user = localStorage.getItem("username");

        const businessStore = useBusinessStore();
        const listView = ref([]);
        const listTaux = ref([]);

        const loading = computed(() => businessStore.loading)

        const selected = ref(null);
        const list = ref([]);
        const list_second = ref([]);
        const list_third = ref([]);

        const det_list = ref([]);
        const det_list_second = ref([]);
        const det_list_third = ref([]);

        const paramInput = ref("");
        const PrimeMaxValue = ref("");
        const showParam = ref(false);

        onBeforeMount(async () => {
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
        })

        onMounted(async () => {
            await businessStore.fetchListView();
            await businessStore.fetchListTaux();
            listView.value = businessStore.listViews
            listTaux.value = businessStore.listTaux
        });

        const headers = [
            { title: "PALIER", key: "palier", sortable: false },
            { title: "ECART", align: 'end', key: "ecart" },
            { title: "MILIEU", align: 'end', key: "milieu" },
            { title: "PRIME", align: 'end', key: "prime" },
        ];

        const headers_second = [
            { title: "PALIER", key: "palier_second", sortable: false },
            { title: "ECART", align: 'end', key: "ecart_second" },
            { title: "MILIEU", align: 'end', key: "milieu_second" },
            { title: "PRIME", align: 'end', key: "prime_second" },
        ];

        const headers_third = [
            { title: "PALIER", key: "palier_third", sortable: false },
            { title: "ECART", align: 'end', key: "ecart_third" },
            { title: "MILIEU", align: 'end', key: "milieu_third" },
            { title: "PRIME", align: 'end', key: "prime_third" },
        ];

        const headers_det = [
            { title: "MOIS", key: "mois", sortable: false   },
            { title: "PRIME MAX", align: 'end',key: "prime_max", sortable: false},
            { title: "QUALITATIF", align: 'end', key: "qualitatif"},
            { title: "QUANTITATIF", align: 'end', key: "quantitatif"},
            { title: "TOTAL", align: 'end', key: "total"},
        ];

        const headers_det_second = [
            { title: "MOIS", key: "mois_second", sortable: false},
            { title: "PRIME MAX", align: 'end',key: "prime_max_second", sortable: false},
            { title: "QUALITATIF", align: 'end', key: "qualitatif_second"},
            { title: "QUANTITATIF", align: 'end', key: "quantitatif_second"},
            { title: "TOTAL", align: 'end', key: "total_second"},
        ];

        const headers_det_third = [
            { title: "MOIS", key: "mois_third", sortable: false},
            { title: "PRIME MAX", align: 'end',key: "prime_max_third", sortable: false },
            { title: "QUALITATIF", align: 'end', key: "qualitatif_third"},
            { title: "QUANTITATIF", align: 'end', key: "quantitatif_third"},
            { title: "TOTAL", align: 'end', key: "total_third"},
        ];


        const chartData = ref({});

        const chartData2 = ref({});

        const chartData3 = ref({});

        const onHome = () => router.push("/AccueilPage");


        const onChange = (value) => {

            selected.value = value;

            if (value) {
                showParam.value = true;
            } else {
                showParam.value = false;
            }

            list.value = [];
            list_second.value = [];
            list_third.value = [];
            det_list.value = [];
            det_list_second.value = [];
            det_list_third.value = [];



            chartData.value = {};
            chartData2.value = {};
            chartData3.value = {};
        };

        // const loadData = async () => {
        //     if (!paramInput.value) return;

        //     console.log("PARAM =", paramInput.value);

        //     // await businessStore.fetchListCa(paramInput.value);

        //     await businessStore.fetchListPalier(paramInput.value);

        //     list.value = businessStore.list_paliers;

        //     console.log(list.value)

        //     chartData.value = {
        //         labels: list.value.map(i => i.annee),
        //         datasets: [
        //             {
        //                 label: "Chiffre d'Affaire",
        //                 data: list.value.map(i => i.ca),
        //                 borderColor: "rgb(75, 192, 192)",
        //                 backgroundColor: "rgba(75, 192, 192, 0.2)",
        //                 tension: 0.4,
        //                 fill: true
        //             }
        //         ]
        //     };
        // };

        const loadData = async () => {
            if (!paramInput.value || !PrimeMaxValue.value) return;

            // console.log(PrimeMaxValue.value)

            await businessStore.fetchListPalier(paramInput.value, PrimeMaxValue.value);

            // console.log(paramInput.value)

            list.value = businessStore.list_paliers;
            list_second.value = businessStore.list_paliers_seconds;
            list_third.value = businessStore.list_paliers_thirds;

            det_list.value = businessStore.det_list_paliers;
            det_list_second.value = businessStore.det_list_palier_seconds;
            det_list_third.value = businessStore.det_list_palier_thirds;

            console.log(list_third.value);

            chartData.value = {
                labels: list.value.map(i => i.taux), // affichage seulement
                datasets: [
                    {
                        label: "Prime",
                        data: list.value.map(i => ({
                            x: i.milieu,
                            y: i.prime
                        })),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: "Prime second",
                        data: list_second.value.map(i => ({
                            x: i.milieu_second,
                            y: i.prime_second
                        })),
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: "Prime third",
                        data: list_third.value.map(i => ({
                            x: i.milieu_third,
                            y: i.prime_third
                        })),
                        borderColor: "green",
                        backgroundColor: "grey",
                        tension: 0.1,
                        fill: false
                    }
                ]
            };

            chartData2.value = {
                labels: list_second.value.map(i => i.taux_second), // affichage seulement
                datasets: [
                    {
                        label: "Prime",
                        data: list_second.value.map(i => ({
                            x: i.milieu_second,
                            y: i.prime_second
                        })),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        tension: 0.4,
                        fill: false
                    }
                ]
            };

            chartData3.value = {
                labels: list_third.value.map(i => i.taux_third), // affichage seulement
                datasets: [
                    {
                        label: "Prime",
                        data: list_third.value.map(i => ({
                            x: i.milieu_third,
                            y: i.prime_third
                        })),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        tension: 0.4,
                        fill: false
                    }
                ]
            };
        };

        const chartOptions = computed(() => {

            // const selected = list.value.find(i => i.taux === paramInput.value)

            const toNumber = (v) =>
                Number(String(v ?? '')
                    .replace('%', '')
                    .replace(',', '.')
                    .trim()
                )

            const input = toNumber(paramInput.value)
            const inputNum = Number(input)

            const selected = list.value.find(i => {
                const min = i.milieu
                const max = i.taux

                return inputNum >= min && inputNum <= max
            })



            const prime = selected?.prime ?? 0



            const maxPrime = Math.max(
                ...list.value.map(i => Number(i.prime) || 0)
            )


            return {
                responsive: true,
                parsing: false,

                plugins: {
                    annotation: {

                        annotations: {

                            // 🔴 ligne verticale (taux sélectionné)
                            lineX: {
                                type: 'line',
                                xMin: Number(paramInput.value),
                                xMax: Number(paramInput.value),
                                borderColor: 'red',
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: `Taux = ${paramInput.value}`,
                                    position: 'start'
                                }
                            },

                            // 🔵 ligne horizontale (prime sélectionnée)
                            lineY: {
                                type: 'line',
                                yMin: selected?.prime ?? 0,
                                yMax: selected?.prime ?? 0,
                                borderColor: 'red',
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: `Prime = ${selected?.prime ?? 0}`,
                                    position: 'end'
                                }
                            },
                        }
                    }
                },

                scales: {
                    x: {
                        type: 'linear',
                        ticks: {
                            autoSkip: false,
                            callback(value) {
                                const match = list.value.find(i => i.taux === value)
                                return match ? match.taux : ''
                            }
                        },
                        afterBuildTicks: (scale) => {
                            scale.ticks = list.value.map(i => ({
                                value: i.taux
                            }))
                        }
                    },

                    y: {
                        beginAtZero: true,
                        max: maxPrime * 1.2
                    }
                }
            }
        })

        const chartOptions2 = computed(() => {

            // const selected = list.value.find(i => i.taux === paramInput.value)

            const toNumber = (v) =>
                Number(String(v ?? '')
                    .replace('%', '')
                    .replace(',', '.')
                    .trim()
                )

            const input = toNumber(paramInput.value)
            const inputNum = Number(input)

            const selected = list_second.value.find(i => {
                const min = i.milieu_second
                const max = i.taux_second

                return inputNum >= min && inputNum <= max
            })



            const prime = selected?.prime_second ?? 0
            const maxPrime = Math.max(
                ...list_second.value.map(i => Number(i.prime_second) || 0)
            )

            return {
                responsive: true,
                parsing: false,

                plugins: {
                    annotation: {

                        annotations: {

                            // 🔴 ligne verticale (taux sélectionné)
                            lineX: {
                                type: 'line',
                                xMin: Number(paramInput.value),
                                xMax: Number(paramInput.value),
                                borderColor: 'red',
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: `Taux = ${paramInput.value}`,
                                    position: 'start'
                                }
                            },

                            // 🔵 ligne horizontale (prime sélectionnée)
                            lineY: {
                                type: 'line',
                                yMin: selected?.prime_second ?? 0,
                                yMax: selected?.prime_second ?? 0,
                                borderColor: 'red',
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: `Prime = ${selected?.prime_second ?? 0}`,
                                    position: 'end'
                                }
                            },
                        }
                    }
                },

                scales: {
                    x: {
                        type: 'linear',
                        ticks: {
                            autoSkip: false,
                            callback(value) {
                                const match = list_second.value.find(i => i.taux_second === value)
                                return match ? match.taux_second : ''
                            }
                        },
                        afterBuildTicks: (scale) => {
                            scale.ticks = list_second.value.map(i => ({
                                value: i.taux_second
                            }))
                        }
                    },

                    y: {
                        beginAtZero: true,
                        max: maxPrime * 1.2
                    }
                }
            }
        })

        const chartOptions3 = computed(() => {

            // const selected = list.value.find(i => i.taux === paramInput.value)

            const toNumber = (v) =>
                Number(String(v ?? '')
                    .replace('%', '')
                    .replace(',', '.')
                    .trim()
                )

            const input = toNumber(paramInput.value)
            const inputNum = Number(input)

            const selected = list_third.value.find(i => {
                const min = i.milieu_third
                const max = i.taux_third

                return inputNum >= min && inputNum <= max
            })



            const prime = selected?.prime_third ?? 0
            const maxPrime = Math.max(
                ...list_third.value.map(i => Number(i.prime_third) || 0)
            )

            return {
                responsive: true,
                parsing: false,

                plugins: {
                    annotation: {

                        annotations: {

                            // 🔴 ligne verticale (taux sélectionné)
                            lineX: {
                                type: 'line',
                                xMin: Number(paramInput.value),
                                xMax: Number(paramInput.value),
                                borderColor: 'red',
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: `Taux = ${paramInput.value}`,
                                    position: 'start'
                                }
                            },

                            // 🔵 ligne horizontale (prime sélectionnée)
                            lineY: {
                                type: 'line',
                                yMin: selected?.prime_third ?? 0,
                                yMax: selected?.prime_third ?? 0,
                                borderColor: 'red',
                                borderWidth: 2,
                                label: {
                                    display: true,
                                    content: `Prime = ${selected?.prime_third ?? 0}`,
                                    position: 'end'
                                }
                            },
                        }
                    }
                },

                scales: {
                    x: {
                        type: 'linear',
                        ticks: {
                            autoSkip: false,
                            callback(value) {
                                const match = list_third.value.find(i => i.taux_third === value)
                                return match ? match.taux_third : ''
                            }
                        },
                        afterBuildTicks: (scale) => {
                            scale.ticks = list_third.value.map(i => ({
                                value: i.taux_third
                            }))
                        }
                    },

                    y: {
                        beginAtZero: true,
                        max: maxPrime * 1.2
                    }
                }
            }
        })

        const formatNumber = (value) => {
            if (value === null || value === undefined) return "";

            return new Intl.NumberFormat("fr-FR")
                .format(value)
                .replace(/\s/g, '   '); // espace plus visible
        };

        return {
            selected, list, headers, headers_second, headers_third,loading,
            chartData, chartData2, chartData3, chartOptions, chartOptions2, chartOptions3, onChange, onHome, ip_server, user, isOnline,
            listView, showParam, loadData, paramInput, PrimeMaxValue,
            formatNumber, listTaux,
            list_second, list_third,
            det_list, det_list_second, det_list_third,
            headers_det, headers_det_second, headers_det_third,
        };
    }
});
</script>
<style>
.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
}


.compact-table {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
}

.compact-table :deep(.v-table__wrapper) {
    overflow-x: hidden !important;
    overflow-y: hidden !important;
    max-width: 100% !important;
}

.compact-table :deep(.v-table) {
    width: 100% !important;
    max-width: 100% !important;
}

.compact-table :deep(table) {
    width: 100% !important;
    max-width: 100% !important;

    table-layout: fixed !important;

    border-collapse: collapse !important;
    border-spacing: 0 !important;
}

.compact-table :deep(thead),
.compact-table :deep(tbody),
.compact-table :deep(tr) {
    width: 100% !important;
}

.compact-table :deep(th),
.compact-table :deep(td) {

    min-width: 0 !important;
    width: 1px !important;
    max-width: 1px !important;

    padding: 0 !important;
    margin: 0 !important;

    font-size: 6px !important;

    line-height: 10px !important;
    height: 10px !important;

    white-space: nowrap !important;

    overflow: hidden !important;
    text-overflow: ellipsis !important;
}

.no-scroll-x {
    overflow-x: hidden !important;
}

.no-scroll-x table {
    table-layout: fixed;
    width: 100%;
}

.no-scroll-x th,
.no-scroll-x td {
    white-space: nowrap; /* ou normal si tu veux wrap */
}


</style>