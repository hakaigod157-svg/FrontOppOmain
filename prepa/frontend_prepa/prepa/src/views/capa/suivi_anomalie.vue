<template>
    <v-app>
        <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
            <v-card density="compact">
                <MyTablsCapa :StoreAdv="StoreAdv"></MyTablsCapa>
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
        <div id="atte">
            <div class="titre">
                <h2>Attente Validation<v-icon class="attic">mdi-progress-clock</v-icon></h2>

                <button class="ajoutano" @click="showAjoutAnomalie = true">
                    <v-icon>mdi-plus-circle</v-icon> 
                    <p>Ajouter anomalie</p>
                </button>
            </div>
            <v-table height="580px" class="tableau_suivi">
                <thead class="thead_tab">
                    <tr>
                        <td class="text-left">Date</td>
                        <td class="text-left">Emetteur</td>
                        <td class="text-left">Departement</td>
                        <td class="text-left">Description</td>
                        <td class="text-left">Classement</td>
                    </tr>
                </thead>
                <tbody v-if="AtteVals.length">
                    <tr v-for="atte in AtteVals" :key="atte.ncpsDate">
                        <td class="date">{{ atte.ncpsDate}}</td>
                        <td class="emetteur">{{ atte.ncpsEmetteur }}</td>
                        <td class="depart">{{ atte.ncpsDepartement }}</td>
                        <td class="desc">{{ atte.ncpsDescription }}</td>
                        <td class="clasico">
                            <button @click="classer(atte)">
                                <v-icon class="iccla">mdi-sort-variant</v-icon>
                                <span>Classer</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
                <div v-else class="no-data">Aucune action disponible</div>
            </v-table>
        </div>
        <ajoutalomalie @added-successfully="refreshTable" v-if="showAjoutAnomalie" @close="showAjoutAnomalie = false"/>
        <classer @classement="refreshTable" v-if="showClasser" :atte="selectedItem.atte" @close="showClasser = false"/>
        
    </v-app>
</template>

<script>
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";
import { useRouter } from 'vue-router';
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useOnline } from '@vueuse/core';
import MyTablsCapa from '@/components/capa/MyTabsCapa.vue';
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import { useAtteValStore } from '@/store/Capa/atteval.js';
import ajoutalomalie from '../../components/capa/ajoutanimalie.vue';
import classer from '../../components/capa/classer.vue';

export default defineComponent({
    components: { 
        ajoutalomalie,
        MyTablsCapa,
        classer,
    },
    props: {
        atte: Object,
    },
    setup() {
        const StoreAdv = useEtapeStoreAdv();
        const user = localStorage.getItem('username');
        const isOnline = useOnline();
        const showAjoutAnomalie = ref(false);
        const showClasser= ref(false);
        const AtteVal = useAtteValStore();
        const AtteVals = ref(AtteVal.AtteVals);
        const selectedItem = ref(null);

        const router = useRouter();
        useSessionTimeout(Config.DURRE_SESSION, router);

        const onHome = () => {
            router.push("/AccueilPage");
        };

        const refreshTable = async () => {
            await AtteVal.fetchAtteVal();
            AtteVals.value = AtteVal.AtteVals;
        };

        onMounted(async () => {
            await AtteVal.fetchAtteVal();
            AtteVals.value = AtteVal.AtteVals; 
            watch(() => AtteVal.AtteVals, (newValues) => {
            AtteVals.value = [...newValues]; 
        }, { immediate: true });
        });
        const classer = (atte) => {
            showClasser.value = true;
            selectedItem.value = { atte };
            console.log(atte); 
        };

        watch(() => AtteVal.AtteVals, (newValues) => {
            AtteVals.value = [...newValues]; 
        }, { immediate: true });

        return {
            StoreAdv,
            user,
            isOnline,
            onHome,
            AtteVals,
            showAjoutAnomalie,
            showClasser,
            
            refreshTable,
            selectedItem,
            classer
        };
    },
})
</script>

<style lang="scss">
#atte {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
    .titre {
        animation: titre 1s;
        position: relative;
        top: 2rem;
        width: 100%;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        box-shadow: 0 0 5px rgba(0, 89, 41, 0.667);
        padding-top: 50px;
        padding-bottom: 30px;
        margin-bottom: 2rem;
        font-size: 12px;
        display: flex;
        justify-content:center;
        align-items: center;
        h2{
            position: relative;
            left: 50px;
        }
        .attic {
            font-size: 19px;
            margin-left: 10px;
            position: relative;
            bottom: 2px;
        }
        .ajoutano {
            position: relative;
            left: 300px;
            font-size: 22px;
            width: 100px;
            display: flex;
            align-items: center;
            color: rgb(176, 0, 156);
            margin-right: 30px;
            font-size: 18px;
            p {
                font-size: 11px;
                margin-left: 5px;
                line-height: 13px;
            }
        }
    }
    @keyframes titre {
                from {
                    transform: translateY(-20rem);
                }
                to {
                    transform: translateY(0rem);
                }
            }
    .tableau_suivi {
        position: relative;
        top: 2rem;
        width: 100%;
        animation: tableau_suivi 1s;
        thead {
            color: black;
            font-size: 11px;
            font-weight: 600;
            tr{
                background: #d4d0e6;
                box-shadow: 10px 0 5px rgba(0, 0, 0, 0.491);
                z-index: 2;
                position: sticky;
                border-bottom: 1px solid #b8b3cc;
                top: 0;
            }
            tr:hover{
                background: #d4d0e6;
            }
        }
        tbody {
            tr {
                
                .date {
                    width: 120px;
                }
                .emetteur {
                    width: 120px;
                }
                .depart {
                    width: 120px;
                }
                .clasico {
                    width: 130px;
                    button {
                        border: 1px solid green;
                        background: green;
                        width: 100px;
                        height: 25px;
                        border-radius: 20px;
                        transition: all 0.3s;
                        .iccla {
                            font-size: 18px;
                            color: rgb(255, 255, 0);
                            position: relative;
                            bottom: 1px;
                        }
                        span {
                            font-size: 12px;
                            margin-left: 6px;
                            color: white;
                            font-weight: 600;
                        }
                    }
                }
            }
        }
        .no-data {
            position: absolute;
            width: 115vh;
            text-align: center;
            padding: 1rem;
        }
    }
    @keyframes tableau_suivi{
        from{
            transform: translateY(100px);
        }
        to{
            transform: translateY(0);
        }
    }
}
</style>
