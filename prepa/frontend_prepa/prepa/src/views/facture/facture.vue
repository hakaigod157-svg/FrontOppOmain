<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabsFacture :StoreAdv="useEtapeStoreAdv"></MyTabsFacture>
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
                <v-card-actions density="compact">

                    <v-card-title density="compact">
                        <MyTextField name_lab_text="Code facture" style="width: 130px" @input="convertToUpperCase"
                            hint="ex :FA08010001" v-model="codeFA" placeholder="FA08010001">
                        </MyTextField>
                    </v-card-title>

                    <v-card-title density="compact">
                        <MyTextField name_lab_text="Nom Client Livré" style="width: 130px"
                            hint="" placeholder="Nom Client Livré">
                        </MyTextField>
                    </v-card-title>

                    <v-card-title density="compact">
                        <MyTextField name_lab_text="Code Commande" style="width: 130px" @input="convertToUpperCase" hint="ex:CC23108829"
                        v-model="codeCC" placeholder="Code Commande">
                        </MyTextField>
                    </v-card-title>

                    <v-card-title density="compact">
                        <MyTextField name_lab_text="Bon de préparation" style="width: 145px" @input="convertToUpperCase"
                        v-model="codeBP" hint=" ex:BP23302433" placeholder="Bon de préparation">
                        </MyTextField>
                    </v-card-title>

                    <v-card-title density="compact"></v-card-title>
                    <span density="compact"><b>Date facture du</b></span>
                    
                    <v-card-title>

                        <v-text-field v-model="dateDeb" type="date" label="Date Livraison" single-line hide-details
                            color="deep-purple-accent-4" density="compact" clearable></v-text-field>
                    </v-card-title>
                    <span density="compact"><b>Au</b></span>
                    <v-card-title>
                        <v-text-field v-model="dateFin" type="date" label="Date Livraison" single-line hide-details
                            color="deep-purple-accent-4" density="compact" clearable></v-text-field>
                    </v-card-title>

                    <v-spacer />

                    <v-row>
                        <v-col cols="auto">
                            <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading" size="large"
                                density="compact">Rechercher
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

                        <v-card >
                            <MyTableAdv :headers="headers" style="height: 590px; width: 100%;">
                            </MyTableAdv>

                            <v-card style="width: 60%;">
                                <v-row>
                                    <v-col>
                                        <v-sheet class="pl-2">
                                            <b> {{ 0 }}</b> Lignes Trouvées
                                        </v-sheet>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-card>
                </div>
                <v-row>
                </v-row>
            </v-main>
        </v-app>
    </v-card>
</template>
<script>
import { onMounted,ref, defineComponent } from "vue";
import { useOnline } from '@vueuse/core';
import MyTabsFacture from '@/components/facture/MyTabsFacture.vue';
import dayjs from 'dayjs';
import MyTextField from '@/components/MyTextField.vue';
import MyTableAdv from '@/components/adv/MyTableAdv.vue'
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import MyTextarea from '@/components/MyTextarea.vue';


export default defineComponent({
    components: {
        MyTabsFacture,
        MyTextField,
        MyTableAdv,
        MyTextarea,
    },

    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },

    setup(props) {
        const isOnline = useOnline();
        const user = localStorage.getItem('username');
        const StoreAdv = useEtapeStoreAdv();
        const codeFA = ref('');
        const codeCC = ref('');
        const codeBP = ref('');
        const dateDeb = ref('');
        const dateFin = ref('');

        const headers = [
            { title: 'Code', align: 'start', key: 'code', sortable: true },
            { title: 'Date', align: 'center', key: 'date_com', sortable: true },
            { title: 'Nom Client Livré', align: 'center', key: 'date_prevue_liv' },
            { title: 'TTC', align: 'start', key: 'nom_client' },
            { title: 'CC', align: 'start', key: 'type_tana' },
            { title: 'BP', align: 'center', key: 'axe' },
            { title: 'Actions', align: 'start', key: 'action', value: 'action' },
        ] ;

        const convertToUpperCase = () => {
            codeFA.value = codeFA.value.toUpperCase();
            codeCC.value = codeCC.value.toUpperCase();
            codeBP.value = codeBP.value.toUpperCase();
        };

        const searchEvent = async () => {
            console.log('Code fature ty ',codeFA);
            console.log('code CC ty : ',codeCC);
            console.log('Code BP', codeBP);
            console.log('Date debut ty :',dateDeb.value)
            console.log('Date fin ty :',dateFin.value)
        };

        onMounted(async () => {
            const today = dayjs().format('YYYY-MM-DD');
            dateDeb.value = today;
            dateFin.value = today;
            // await storeDepot.fetchDepots('isnull(DPLOC,0)<>0');
            // list.value=[];
        });

        return {
            StoreAdv, headers,isOnline,user,
            searchEvent,convertToUpperCase,
            codeFA,codeCC,codeBP,
            dateDeb,dateFin,
        };
    },
})
</script>

<style>
.plafond--text.text--plafond {
    background-color: #FF0000;
    color: rgb(255, 255, 255) !important;
    width: 250px;
}

.retard--text.text--retard {
    background-color: rgb(255, 204, 153);
    color: rgb(7, 7, 7) !important;
    width: 250px;
}

.debloq--text.text--debloq {
    background-color: rgb(0, 187, 0);
    color: rgb(7, 7, 7) !important;
    width: 250px;
}

.plafondep--text.text--plafondep {
    background-color: rgb(255, 153, 204);
    color: rgb(7, 7, 7) !important;
    width: 250px;
}
</style>