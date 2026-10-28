<template>

    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">

                    <MyTabsFacturio :StoreAdv="useEtapeStoreAdv"></MyTabsFacturio>


                </v-card>
                <v-spacer></v-spacer>

                <div>
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

            <v-main style="--v-layout-top: 45px" app>
                <v-card-actions density="compact" style="background-color: #FAFAFA;">
                    <v-row align="center">
                        <v-col cols="auto">
                            <v-card-title class="date-input">
                                <v-text-field type="date" label="Date" v-model="date_search" single-line hide-details
                                    color="deep-purple-accent-4" density="compact" clearable>
                                </v-text-field>
                            </v-card-title>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading" size="large"
                                density="compact">
                                Actualiser
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>

                <div class="pa-2">
                    <!-- <v-progress-linear 
                    v-if="loading" 
                    color="primary" 
                    rounded indeterminate 
                    height="5"
                    density="compact">
                  </v-progress-linear> -->

                    <v-card>
                        <MyTableFact :headers="headers" :items="result" v-model:search="search" action2="Lier" @action2Item="showClt">
                        </MyTableFact>

                    </v-card>
                </div>
            </v-main>
        </v-app>
    </v-card>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { useOnline } from '@vueuse/core';
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import MyTabsFacturio from '@/components/facturio/MyTabsFacturio.vue';

import dayjs from 'dayjs';
import MyTableFact from '@/components/facturio/MyTableFact.vue';


export default defineComponent({
    components: {
        MyTabsFacturio,
        MyTableFact,
    },

    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },

    setup() {

        const isOnline = useOnline();
        const user = localStorage.getItem('username');
        const StoreAdv = useEtapeStoreAdv();
        const router = useRouter();
        const dialog = ref(false);
        const dialogVisible = ref(false);
        const date_search = ref('');

        onMounted(async () => {
            const today = dayjs().format('YYYY-MM-DD');
            date_search.value = today;
        })

        const headers = [
            { title: 'DATE', align: 'center', key: 'date', sortable: true },
            { title: 'CODE CLIENT', align: 'center', key: 'code', sortable: true },
            { title: 'CONTACT', align: 'center', key: 'contact', sortable: true },
            { title: 'NOM CLIENTS', align: 'start', key: 'client' },
            { title: 'LOCALISATION', align: 'start', key: 'localisation' },
            { title: 'APPEL', align: 'start', key: 'appel' },
            { title: '1ER RAPPEL', align: 'center', key: 'rappel1' },
            { title: '2EME RAPPEL', align: 'start', key: 'rappel2', value: 'rappel2' },
            { title: 'TEMPS DE RAPPEL', align: 'start', key: 'temprappel', value: 'tmpappel' },
            { title: 'ACTION', align: 'start', key: 'actions', value:'actions' },

        ];

        const result = ref([
            {
                date: '2024-07-01',
                code: 'CL001',
                contact: 'John Doe',
                client: 'Entreprise A',
                localisation: 'Paris',
                appel: 'Appel 1',
                rappel1: '2024-07-02 10:00',
                rappel2: '2024-07-03 14:00',
                commentaire: 'Premier appel réussi.',
                temprappel: '30 mins',
                action: 'Suivi'
            },
            {
                date: '2024-07-01',
                code: 'CL002',
                contact: 'Jane Smith',
                client: 'Entreprise B',
                localisation: 'Lyon',
                appel: 'Appel 2',
                rappel1: '2024-07-02 11:00',
                rappel2: '2024-07-03 15:00',
                commentaire: 'Second appel en attente.',
                temprappel: '45 mins',
                action: 'En attente'
            }
        ]);

        return {
            isOnline, user, StoreAdv,dialogVisible, dialog, headers, result, date_search
        };

    }

})

</script>