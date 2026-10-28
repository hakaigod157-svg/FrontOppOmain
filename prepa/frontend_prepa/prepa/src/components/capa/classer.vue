<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div id="classer_" @click="handleClickOutside">
        <div id="classer" @click.stop ref="classerDiv">
          <div class="haut">
              <h2><v-icon class="iccla">mdi-sort-variant</v-icon>Classement :</h2>
              <button @click="close" class="fermer">
              <v-icon>mdi-close</v-icon>
          </button>
          </div>
          <div class="detail1">
            <div class="detail1_1" v-if="atte">
              <div id="div__">
                <label id="lab" for="date"><strong>Date:</strong></label>
                <input type="text" id="date" v-model="atte.ncpsDate" readonly/>
              </div>
              <div id="div__">
                <label id="lab" for="emetteur"><strong>Émetteur:</strong></label>
                <input type="text" id="emetteur" v-model="atte.ncpsEmetteur" readonly/>
              </div>
              <div id="div__">
                <label id="lab" for="departement"><strong>Departement:</strong></label>
                <input type="text" id="departement" v-model="atte.ncpsDepartement" readonly/>
              </div>

            </div>
            <div class="detail1_2" v-if="atte">
              <div id="div__">
                <label id="lab" for="description"><strong>Description:</strong></label>
                <textarea id="description" v-model="atte.ncpsDescription" readonly></textarea>
              </div>
            </div>
          </div>
          <div class="detail2">
            <h3>Information supplémentaire</h3>
            <div class="info">
              <div class="info1">
                <div id="div__">
                  <label id="lab" for="modedetect"><strong>Mode de Detection:</strong></label>
                  <v-select
                           v-model="selectedModeDetect"
                          item-value="value"
                          item-text="text"
                          :items="ModeList"
                          id="select"
                          class="select"
                        ></v-select>
                </div>
                <div id="div__">
                  <label id="lab" for="type"><strong>Type:</strong></label>
                  <v-select
                          v-model="selectedType"
                          item-value="value"
                          item-text="text"
                          :items="TypeList"
                          id="select"
                          class="select"
                        ></v-select>
                </div>
                <div id="div__">
                  <label id="lab" for="procdetect"><strong>Processus de Detection:</strong></label>
                  <v-select
                          v-model="selectedProcessusDetect"
                          item-value="value"
                          item-text="text"
                          :items="ProcList"
                          id="select"
                          class="select"
                        ></v-select>
                </div>
              </div>
              <div class="info2">
                <h4>Personne autorisé a consulter : (facultatif)</h4>
                <div class="pers">
                  <div v-for="user in userStore.users" :key="user.usernom">
                    <v-checkbox class="check" :label="user" :value="user" v-model="selected" ></v-checkbox>
                  </div>
                </div>
              </div>
            </div>
            <div class="butt">
              <button @click="quit">Annuler</button>
              <button class="vali" @click="valider" :disabled="isLocked" :class="{ 'small-button': isIconVisible }">
                <span v-if="!isIconVisible">
                  <template v-if="!isFieldMissing">Valider</template>
                </span>
                <v-icon v-else>mdi-check</v-icon>
              </button>
            </div>
          </div>
        </div>
    </div>
    <alert v-if="showalert" :alert_color="alert_col" :alert_text="alertMessage" @close="showalert = false"/>
    <alert2 v-if="showalert2" :text="text" @closeal2="fermeture"/>
</template>
<style lang="scss">
#classer_{
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 20;
    top: 0;
    left: 0;
    backdrop-filter: blur(5px);
    background: rgba(0, 0, 0, 0.09);
    display: flex;
    justify-content: center;
    align-items: center;
    #classer{
        width: 900px;
        height: auto;
        background: white;
        animation: classer 0.3s;
        border-radius: 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.172);
        .haut{
          width: 100%;
          height: 30px;
          display: flex;
          justify-content: center;
          padding-top: 20px;
          font-size: 12px;
          flex-grow: 1; 
          text-align: center;
          .fermer{
            position: relative;
            left: 50vh;
          }
          .fermer:hover{
            color: black;
          }
          .iccla{
            font-size: 19px;
            margin-right: 5px;
            position: relative;
            bottom: 2px;
          }
        }
        .detail1{
          display: flex;
          .detail1_1,.detail1_2{
            width: 50%;
            padding: 20px;
            padding-left: 30px;
            position: relative;
            top: 15px;
            #div__{
              width: 90%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 5px;           
              label{
                font-size: 12.5px;
                position: relative;
                top: 5px;
                
              }
              input,textarea{
              border-bottom: 1px solid rgba(0, 0, 0, 0.341);
              // width: 450px;
              width: 280px;
              padding-left: 10px;
              padding-bottom: 3px;
              padding-top: 3px;
              font-size: 12px;
              min-height: 30px;
              max-height: 100px;
              }
              textarea{
                height: 100px;
              }
              input:focus,textarea:focus{
                border: none;
                border-bottom: 1px solid blue;
                outline: none;
              }
            
          }
        }
      }
      .detail2{
        width: 100%;
        padding: 30px;
        h3{
          color: rgb(91, 0, 0);
          font-size: 15px;
        }
        .info{
          padding-top: 30px;
          display: flex;
          .info1{
            width: 50%;
            #div__{
              margin-bottom: 20px;
              width: 95%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 5px; 
              label{
                  font-size: 12.5px;
                  position: relative;
                  top: 5px;   
                  width: 250px;
                  margin-right: 20px;
              }
              .select {
                height: 35px;
                font-size: 16px; 
                width: 450px;

                .v-field {
                    height: 35px;
                }

                .v-field__field {
                    height: 35px;
                    width: 100%;
                    overflow: hidden;
                    text-align: center;
                    .v-field__input {
                       padding: 0;
                        height: 35px;  
                        width: auto;   
                        font-size: 13.5px;
                        overflow: visible;
                        white-space: nowrap; 
                        text-overflow: ellipsis; 
                    }
                }


                .v-select__selection {
                    white-space: nowrap; 
                    overflow: visible; 
                    text-overflow: ellipsis; 
                    position: relative;
                    bottom: 10px;
                    right: 120px;
                }
                .v-select__selection-text{
                  overflow: visible;
                }
            }

            }

          }
          .info2{
            width: 50%;
            padding-left: 30px;
            padding-bottom: 10px;
            padding-right: 30px;
            h4{
              width: 100%;
              font-size: 12px;
              padding-bottom: 2px;
              border-bottom: 1px solid rgba(0, 0, 0, 0.407);
              
            }
            .pers{
              width: 100%;
              height: 130px;
              border-bottom: 1px solid rgba(0, 0, 0, 0.386);
              overflow: auto;
              padding: 10px;
              .check{
                .v-label{
                  font-size: 12.5px;
                  color: black;
                  font-weight: 600;
                }
                .v-selection-control{
                  margin: -10px;
                  min-height: 10px;
                  height: 35px;
                }
                
              }
            }
          }
        }
        .butt{
          width: 100%;
          display: flex;
          justify-content: right;
          padding-right: 30px;
          padding-top: 15px;
          .vali{
            background:rgb(176, 0, 156);
            color:white;
            font-weight: bold;
            border: none;
          }
          button{
            width: 100px;
            height: 30px;
            border: 1px solid rgba(0, 0, 0, 0.335);
            margin-left: 20px;
            border-radius: 20px;
            font-size: 12px;
            transition: all 0.3s;
              &.small-button {
                  width: 30px; 
                  border-radius: 50%; 
                  background: green;
                  color: white;
              }
              .alertic{
              font-size: 13px;
              position: relative;
              bottom: 1px;
              margin-left: 5px;
              color: yellow;
              }
              .errspa{
              animation: errspa 0.5s;
              }
              @keyframes errspa{
                  from{
                      opacity: 0;
                  }
                  to{
                      opacity: 1;
                  }
              }
              &.error-button {
                  background: rgb(164, 0, 0);
                  width: 260px; 
                  font-size: 12px;
                  border-radius: 20px; 
                  color: white;
                  font-weight: 600;
                  padding-left: 10px;
                  padding-right: 10px;
                 border: none;
              }
          }
          button:hover{
            border: 1px solid rgba(0, 0, 0, 0.57);
          }
        }
      }
    }
    @keyframes classer{
        from{
            transform: translateY(100%);
            scale: 0.2;
        }
        to{
            transform: translateY(0);
            scale: 1;
        }
    }
}
</style>
<script>
import { defineComponent, ref, onMounted,watch } from 'vue';
import { useUpdateCapaStore } from '@/store/Capa/updatecapa.js';
import { useAjoutUserStore } from '@/store/Capa/insertuser.js';
import alert from '../../components/capa/alert.vue';
import { useListEnumStore } from "@/store/Capa/listEnum.js";
import { useNumStore } from "@/store/Capa/numero.js";
import alert2 from '../../components/capa/alert2.vue';
import { useUserStore } from "@/store/Capa/user"


export default defineComponent({
      components: {
        alert,
        alert2,
      },
  methods: {
    handleClickOutside(event) {
      const classerDiv = this.$refs.classerDiv;
      if (classerDiv && !classerDiv.contains(event.target)) {
        this.close();
      }
    }
  },

  props: {
    atte: Object
  },
  setup(props, { emit }) {

    const alertMessage = ref('');
    const alert_col = ref('');
    const showalert = ref(false);
    const showalert2 = ref(false);
    const text = ref('');
    const userStore = useUserStore();
    const isIconVisible = ref(false);
    const isFieldMissing = ref(false);
    const updateCapaStore = useUpdateCapaStore();
    const ajoutUserStore = useAjoutUserStore();
    const selectedModeDetect = ref(null);
    const selectedType = ref(null);
    const selectedProcessusDetect = ref(null);
    const selected = ref([]);
    const generer = ref('');

    const numerostore = useNumStore();
    const valeur = ref(null);
    const mois = ref(null);
    const annee = ref(null);
    const seqk = ref(null);
    const moisActuel = new Date().getMonth() + 1;
    const anneeActuelle = new Date().getFullYear();

    const EnumStore = useListEnumStore();
    const enumList = ref([]);
    const ModeList = ref([]);
    const ModeList2 = ref([]);
    const TypeList = ref([]);
    const TypeList2 = ref([]);
    const ProcList = ref([]);
    const ProcList2 = ref([]);

    const isLocked = ref(false);

    const code_gen = (libelle) => {
      const dep = enumList.value.find(proc => proc.enumLibelle === libelle);
      return dep ? dep.enumCode : ''; 
    };
    
    onMounted(async () => {
      await userStore.fetchUser();
      await EnumStore.fetchListEnum();
      await numerostore.fetchLatestKtable();
      
        enumList.value = EnumStore.ListEnums
          .map(proc => ({
              enumCode: proc.enumCode.trim(),      
              enumLibelle: proc.enumLibelle.trim()     
          }));

       //Mode de detection 
        ModeList.value = EnumStore.ListEnums
        .filter(proc => {
          return proc.enumType.trim() === 'ModeDetect';
        })
        .map(proc => (proc.enumLibelle.trim()));
        ModeList2.value = EnumStore.ListEnums
        .filter(proc => proc.enumType.trim() === 'ModeDetect')
        .map(proc => ({
            enumCode: proc.enumCode.trim(),      
            enumLibelle: proc.enumLibelle.trim()     
        }));
        TypeList.value = EnumStore.ListEnums
        .filter(proc => {
          return proc.enumType.trim() === 'type';
        })
        .map(proc => (proc.enumLibelle.trim()));
        TypeList2.value = EnumStore.ListEnums
        .filter(proc => proc.enumType.trim() === 'type')
        .map(proc => ({
            enumCode: proc.enumCode.trim(),      
            enumLibelle: proc.enumLibelle.trim()     
        }));
        ProcList.value = EnumStore.ListEnums
        .filter(proc => {
          return proc.enumType.trim() === 'Processus';
        })
        .map(proc => (proc.enumLibelle.trim()));
        ProcList2.value = EnumStore.ListEnums
        .filter(proc => proc.enumType.trim() === 'Processus')
        .map(proc => ({
            enumCode: proc.enumCode.trim(),      
            enumLibelle: proc.enumLibelle.trim()     
        }));
    });
    
    watch(selected, (newuser) => {
      console.log('Utilisateur sélectionné :', newuser);
    });

    const close = () => {
      emit('close');
    };
    const quit = () => {
      close();
    };
    const fermeture = () => {
      showalert2.value = false;
      close();
    };

    function genererCode(modeDetect, procDetect, date, valeur) {
      const modeSansEspaces = modeDetect.replace(/\s+/g, '');
      const procSansEspaces = procDetect ? procDetect.replace(/\s+/g, '') : '';
      const annee = new Date(date).getFullYear().toString().slice(-2);
      const mois = (new Date(date).getMonth() + 1).toString().padStart(2, '0');
      const valeurFormattee = valeur.toString().padStart(3, '0');

      const code = procSansEspaces 
          ? `${modeSansEspaces}${procSansEspaces}${mois}${annee}-${valeurFormattee}`
          : `${modeSansEspaces}${mois}${annee}-${valeurFormattee}`;
      
      return code;
  }

    
    const valider = async () => { 
      try {
        if (!selectedModeDetect.value || !selectedType.value) {
    
          alertMessage.value = 'Veuillez renseigner tous les champs !';
          alert_col.value = 'alert';
          showalert.value = true;
          return; 
        }
        if (isLocked.value) {
          alert('un utilisateur est en train d utiliser')
          return;
        }

        //code de numero :
        valeur.value = numerostore.Nums[0].valeur;
        console.log('ancienne valeur : ' + valeur.value);
        mois.value = numerostore.Nums[0].mois;
        annee.value = numerostore.Nums[0].annee;
        seqk.value = numerostore.Nums[0].seqk;

        if (annee.value < anneeActuelle || (annee.value === anneeActuelle && mois.value < moisActuel)) {
            console.log("La date sélectionnée est avant le mois et l'année actuels.");
            await numerostore.insertKtable();
        } else if (annee.value === anneeActuelle && mois.value === moisActuel) {
            console.log("La date sélectionnée est égale au mois et à l'année actuels.");
            numerostore.params.seqk = seqk.value;
            await numerostore.updateKtable();
        } else {
          console.log("La date sélectionnée est après le mois et l'année actuels.");
        }
        
        await numerostore.fetchLatestKtable();
        valeur.value = numerostore.Nums[0].valeur;
        console.log('nouvelle valeur : ' + valeur.value);
        
        //fin code de numero 
        
        isLocked.value = true;
        isIconVisible.value = true;
        
        updateCapaStore.params.ncpsSeq = props.atte.ncpsSeq;
        updateCapaStore.params.ncpsDate = props.atte.ncpsDate;
        updateCapaStore.params.ncpsDescription = props.atte.ncpsDescription;
        updateCapaStore.params.ncpsDepartement = props.atte.ncpsDepartement;
        updateCapaStore.params.ncpsType = code_gen(selectedType.value); 
        updateCapaStore.params.ncpsModeDetect = code_gen(selectedModeDetect.value);
        updateCapaStore.params.ncpsProcessusDetect = code_gen(selectedProcessusDetect.value);
        
        generer.value = genererCode(updateCapaStore.params.ncpsModeDetect, updateCapaStore.params.ncpsProcessusDetect,updateCapaStore.params.ncpsDate,valeur.value)
        console.log('code generer : '+generer.value)
        updateCapaStore.params.ncpsCode = generer.value;

        //update dans fncps
        console.log('Parametre :',updateCapaStore.params);
        await updateCapaStore.updateCapa(); 

        
        //insert dans user
        selected.value.forEach(async user => {
          console.log('insertion de User :', user);
          ajoutUserStore.params.ncpsUserUserCode = user;
          ajoutUserStore.params.ncpsUserNcpsCode = updateCapaStore.params.ncpsCode;
          await ajoutUserStore.fetchAjoutUser();
        });
        emit('classement');
        
        text.value = `Code attribué : ${updateCapaStore.params.ncpsCode} `;
        showalert2.value = true;
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des modifications :", error);
      }
    };

    
    return{
      enumList,
      code_gen,
      ModeList2,
      ModeList,
      TypeList,
      TypeList2,
      ProcList,
      ProcList2,
      EnumStore,
      alertMessage,
      alert_col,
      showalert,
      isLocked,
      genererCode,
      updateCapaStore,
      userStore,
      valider,
      close,
      quit,
      isIconVisible,
      isFieldMissing, 
      selectedModeDetect,
      selectedType,
      ajoutUserStore,
      selected,
      selectedProcessusDetect,
      numerostore,
      valeur,
      mois,
      annee,
      moisActuel,
      anneeActuelle,
      seqk,
      text,
      showalert2,
      fermeture,
    }
  },

});
</script>