<template>
    <v-app>
        <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
            <v-card density="compact">
                <MyTablsCapa :StoreAdv="useEtapeStoreAdv"></MyTablsCapa>
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
        <div id="div_rech">
            <h2>Options de recherche :</h2>
            <v-container class="cont">
                <div class="contcont">
                    
                    <div class="cont_1">
                        <input
                            v-model="code"
                            @input="convertToUpperCase"
                            placeholder="Code"
                            class="custom"
                        >
                        <input
                            v-model="description"
                            placeholder="Description"
                            class="custom"
                        >
                        <input
                            v-model="type"
                            @input="convertToUpperCase"
                            placeholder="Type (NC,PS,PP)"
                            class="custom"
                        >
                    </div>
                    <div class="cont_2">
    
                        <input
                            v-model="date"
                            type="date"
                            class="custom"
                        >
                        <v-select
                            v-model="emetteur"
                            :items="emetteurStore.emetteurs"
                            item-value="value"
                            item-text="text"
                            label="Emetteur"
                            solo
                            hide-detailss
                            class="custom"
                            outlined
                        ></v-select>
                        <v-select
                            v-model="libelleDep"
                            :items="dptStore.dpts"
                            item-value="value"
                            item-text="text"
                            label="Dpt/service"                                                                                                                                                                                                                      
                            solo
                            hide-details
                            class="custom"
                            outlined
                        ></v-select>
                    </div>
                </div>
                <div class="btnrech">
                    <v-btn icon class="rech" @click="searchEvent">
                        <v-icon class="ic_rech">mdi-magnify</v-icon>
                    </v-btn>
                </div>
            </v-container>
            <v-container class="cont2">
                <div class="label_rech">
                    <p>Causes racines :</p>
                    <p>Actions :</p>
                </div>
                <div class="radio_rech">
                    <div class="radio_rech1">
                        <v-checkbox-group>
                            <v-checkbox class="custom-checkbox " v-model="valide" label="Validé" value="valide" @change="onCauseValidChange"></v-checkbox>
                            <v-checkbox class="custom-checkbox " v-model="attente" label="Attente de validation" value="attente" @change="onCauseValidChange"></v-checkbox>
                        </v-checkbox-group>
                    </div>
                    <div class="radio_rech1">
                        <v-checkbox-group>
                            <v-checkbox class="custom-checkbox " v-model="attente_val" label="Attente validation" value="attente_val" @change="onCauseValidChange"></v-checkbox>
                            <v-checkbox class="custom-checkbox " v-model="attente_appl" label="Attente Application" value="attente_appl" @change="onCauseValidChange"></v-checkbox>
                            <v-checkbox class="custom-checkbox " v-model="applique" label="Appliquée" value="applique" @change="onCauseValidChange"></v-checkbox>
                        </v-checkbox-group>
                    </div>
                </div>
            </v-container>
        </div>
        <p class="nbligne">Resultats trouvée : 
            <span>{{ nombreLignesTrouvees }} lignes</span>
        </p>
        <div id="affiche1" :style="{ height: isExpanded ? '210px' : '120px' }">
            <chargement v-if="loading" />
            <tableau1 :items="items" @show-details="handleShowDetails" />
        </div>
        <detail @cause_rejete="envoye" @action_supprime="envoye" @ajout_cause="envoye" @suppr="envoye" @update-successfully="envoye" v-if="selectedItem" :item="selectedItem" @close="closeDetail"/>
        <alert v-if="showalert" :alert_color="alert_col" :alert_text="alertMessage" @close="showalert = false"/>
    </v-app>
</template>

<script>
import { defineComponent, ref, onMounted ,computed,onBeforeUnmount } from 'vue';
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";
import { useRouter } from 'vue-router'
import { useCapaDetailStore } from '@/store/Capa/Capa'; 
import { useEmetteurStore } from "@/store/Capa/emetteur.js";
import { useDptStore } from "@/store/Capa/dpt.js";
import tableau1 from '../../components/capa/tableau1.vue';
import chargement from '../../components/capa/chargement.vue';
import detail from '../../components/capa/detail.vue';
import Alert from '@/components/Alert.vue';
import { useOnline } from '@vueuse/core';
import MyTablsCapa from '@/components/capa/MyTabsCapa.vue'
import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
import alert from '../../components/capa/alert.vue';


export default defineComponent({
  components: { 
    tableau1,
    detail,
    chargement,
    MyTablsCapa,
    alert,
  },
  setup() {
      const user = localStorage.getItem('username');
      const isOnline = useOnline();
      
      const alertMessage = ref('');
      const alert_col = ref('');
      const showalert = ref(false);
      const capaDetailStore = useCapaDetailStore();
      const emetteurStore = useEmetteurStore();
      const dptStore = useDptStore();
      const StoreAdv = useEtapeStoreAdv();
      
      const selectedItem = ref(null);
      const items = ref([]);
      const code = ref('');
      const description = ref('');
      const emetteur = ref('');
      const libelleDep = ref('');
      const type = ref('');
      const date = ref('');
      const valide = ref(false);
      const attente = ref(false);
      const attente_val = ref(false);
      const attente_appl = ref(false);
      const applique = ref(false);
      const loading = ref(false);
      const atteAnomalie = ref(false);
      
      const router = useRouter();
      useSessionTimeout(Config.DURRE_SESSION, router);
      
      const nombreLignesTrouvees = computed(() => {
        return capaDetailStore.capaDetails.length;
      });
      const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.stopPropagation();
            searchEvent();
        }
        };
      const searchEvent = async () => {
          loading.value = true;
          
        let causeValidParam = '';
        let causeaAtteParam = '';
        let atteValidParam = '';
        let atteMiseAppliParam = '';
        let AppliParam = '';
        
        if (valide.value) {
            console.log("valide cocher")
            causeValidParam = '0';
        }else{
            causeValidParam = '';
        }

        if (attente.value) {
            console.log("attente cocher")
            causeaAtteParam = '0';
        }else{
            causeaAtteParam = '';
        }

        if (attente_val.value) {
            atteValidParam = '0';
        }else{
            atteValidParam = '';
        }

        if (attente_appl.value) {
            atteMiseAppliParam = '0';
        }else{
            atteMiseAppliParam = '';
        }

        if (applique.value) {
            AppliParam = '0';
        }else{
            AppliParam = '';
        }

        const emetteurValue = emetteur.value.trim() === '' ? '' : emetteur.value;
        
        
        await capaDetailStore.fetchCapaDetails(
            code.value,
            description.value,
            emetteurValue,
            libelleDep.value,
            type.value,
            date.value,
            causeValidParam,
            causeaAtteParam,
            atteValidParam,
            atteMiseAppliParam,
            AppliParam
        );
        // items.value = capaDetailStore.capaDetails;

        if (capaDetailStore.capaDetails.length === 0) {
            alertMessage.value = 'Aucune correspondance trouvée pour votre recherche !';
            alert_col.value = 'alert';
            showalert.value = true;
            
        } else {
            // items.value = capaDetailStore.capaDetails; 
            const searchTerm = description.value.toLowerCase().trim();  
            // if (searchTerm) {  // Vérifie si le terme de recherche n'est pas vide
            //     items.value = capaDetailStore.capaDetails.map(item => {
            //         const highlightedDescription = item.description.replace(
            //             new RegExp(`(${searchTerm})`, 'gi'),  // Rechercher le terme entier
            //             match => `<mark>${match}</mark>`
            //         );
            //         return {
            //             ...item,
            //             description: highlightedDescription
            //         };
            //     });
            // } else {
            //     items.value = capaDetailStore.capaDetails;
            // }

            if (searchTerm) {  
                items.value = capaDetailStore.capaDetails.map(item => {
                    const highlightedDescription = item.description.replace(
                        new RegExp(`(${searchTerm})`, 'gi'),  
                        match => `<mark>${match}</mark>`
                    );
                    return {
                        ...item,
                        description: highlightedDescription
                    };
                });
                setTimeout(() => {
                    items.value = items.value.map(item => ({
                        ...item,
                        description: item.description.replace(/<\/?mark>/gi, '')
                    }));
                }, 1000);
            } else {
                items.value = capaDetailStore.capaDetails;
            }
        }
        loading.value = false;
    };
    const envoye = async () => {
        searchEvent(); 
    };
    const onCauseValidChange = () => {
        searchEvent();
    };

    onMounted(async () => {
      loading.value = true;
      await emetteurStore.fetchEmetteur();
      await dptStore.fetchDpt();
    //   items.value = capaDetailStore.capaDetails;
      loading.value = false;
      window.addEventListener('keydown', handleKeyPress);
    });
    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeyPress);
    });

    const convertToUpperCase = () => {
      code.value = code.value.toUpperCase();
      description.value = description.value.toUpperCase();
      emetteur.value = emetteur.value.toUpperCase();
      libelleDep.value = libelleDep.value.toUpperCase();
      type.value = type.value.toUpperCase();
    };

    const onHome = () => {
    router.push("/AccueilPage");
    };

    const handleShowDetails = (items) => {
      selectedItem.value = items;
    };

    const closeDetail = () => {
      selectedItem.value = null;
    };

    const isExpanded = ref(false);

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
    };

    //const icon = computed(() => isExpanded.value ? 'mdi-chevron-up' : 'mdi-chevron-down');
    //const buttonText = computed(() => isExpanded.value ? 'moins' : 'plus');

    return {
    nombreLignesTrouvees,
      showalert,
      alert_col,
      alertMessage,
      StoreAdv,
      user,
      isOnline,
      code,
      description,
      emetteur,
      libelleDep,
      date,
      type,
      convertToUpperCase,
      searchEvent,
      onHome,
      closeDetail,
      handleShowDetails,
      items,
      selectedItem,
      emetteurStore,
      dptStore,
      isExpanded,
      toggleExpand,
      //icon,
      //buttonText,
      tableau1,
      onCauseValidChange,
      valide,
      attente,
      attente_appl,
      attente_val,
      applique,
      loading,
      atteAnomalie,
      envoye
    };
  },
});
</script>

<style lang="scss">
    #div_rech{
        position: relative;
        left: 50%;
        top: 3rem;
        transform: translateX(-50%);
        width: 100%;
        height: 170px;
        overflow: hidden;
        padding-top: 40px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        box-shadow: 0 0 5px rgba(0, 89, 41, 0.667);
        animation: div_rech 1s;
        transition: all 0.3s;
        display: flex;
        @keyframes div_rech{
            from{
                transform: translate(-50%,-20rem);
            }
            to{
                transform: translate(-50%,0rem);
            }
        }
        h2{
            position: absolute;
            top:1.3rem;
            left: 50%;
            transform: translateX(-50%);
            font-size: 17px;

        }
        .cont{
            display: flex;
            flex-direction: row;
            gap: 1rem;
            width: 50%;
            padding-left: 50px;
            // position: absolute;
            // top:1rem;
            .contcont{
                display: flex;
                flex-direction: column;
                .cont_1,.cont_2{
                    margin-bottom: 30px;
                    width:500px;
                    display: flex;
                    gap: 10px;
                }
                .cont_1{
                    input{
                        width: 200px;
                    }
                }
                
            }
        }
        .cont,.cont2{
            width:50%;
        }
        .custom{
            border-bottom: 1px solid rgba(0, 0, 0, 0.279);
            height: 30px;
            padding-left: 10px;
            font-size: 13px;
            width: 200px;
            .v-field{
            // width: 360px; 
              height: 30px;
            }
            .v-field__field{
              transform: translateY(-25px);
            }
            .v-select__selection-text{
              position: relative;
              top: 2px;
              font-size: 14px;
            }
            .mdi-menu-down{
              position: relative;
              bottom: 13px;
            }
        }
        .custom::placeholder {
            color: #888; 
            font-size: 13px; 
            opacity: 1; 
        }
        .custom:focus{
            outline: none;
            border: none;
            border-bottom: 2px solid rgba(0, 4, 255, 0.486);
        }
        .btnrech{
            position: relative;
            top: 1px;
            left: 30px;
            display: flex;
            // flex-direction: column;
            gap:20px;
            align-items: center;
            .ann{
                font-size: 12px;
                background: rgb(242, 242, 242);
                width: 40px;
                height: 40px;
                text-align: center;
                border-radius: 50%;
                transition: all 0.3s;
            }
            .rech{
                background: rgb(0, 0, 128);
                transition: all 0.5s;
                height: 40px;
                width: 40px;
                color: white;
                border-radius: 20px;
            }
            .ann:hover{
                scale: 1.1;
            }
            
            .ann:active {
                background:rgb(216, 216, 216) ;
            }
            .rech:hover{
                scale: 1.1;
            }
        }
        .cont2{
            .label_rech{
                display: flex;
                white-space: nowrap;
                position: relative;
                top: 5px;
                right: 30px;
                font-size: 13px;
                p{
                    margin-right: 225px;
                }
            }
            .radio_rech{
                display: flex;
                gap: 50px;
                position: relative;
                bottom: 10px;
                .radio_rech1{
                    v-checkbox-group{
                        display:flex;
                        gap: 10px; 
                        position: relative;
                        top: 20px;
                        right: 35px;
                        height: 60px;
                        box-shadow:  0 0 5px rgba(4, 0, 124, 0.196);
                        padding-left: 5px;
                        padding-right: 30px;
                        border-radius: 10px;
                    }
                }
                .custom-checkbox .v-label {
                    font-size: 0.85rem; 
                    white-space: nowrap;
                }
            }

        }
    }
    .nbligne{
        position: relative;
        top:55px;
        left: 57px;
        font-size: 12px;
        font-weight: 500;
        animation: nbligne 1.2s;
        transition: all 0.5s;
        z-index: 0;
        user-select: none;
        span{
            color: blue;
            cursor: pointer;
        }
    }
    @keyframes nbligne{
        0%{
            transform: translateY(-20rem);
            opacity: 0;
        }
        80%{
            opacity: 0;
        }
        100%{
            transform: translateY(0rem);
        }
    }
    #affiche1{
        position: relative;
        top: 5rem;
        width: 100%;
        height: auto;
    }
</style>
