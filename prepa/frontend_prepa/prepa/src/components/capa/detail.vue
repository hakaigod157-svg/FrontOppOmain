<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="blur" v-show="showBlur">
        <div id="principe">
            <div class="titre">
                <h2>Détails anomalie <span> ({{ titre }})</span></h2>
                <button @click="close" class="fermer">
                    <v-icon>mdi-close</v-icon>
                </button>
            </div>
            <div class="haut">
              <br>
            </div>
            <div class="details-content">
              
              <div class="details-content1">
                <div class="haut">
                  <h3>IDENTIFICATION :</h3>
                </div>
                  <div v-if="item" class="aff_det">
                    <div>
                      <label id="lab" for="code"><strong>Reference:</strong></label>
                      <input type="text" id="code" v-model="item.code"  readonly/>
                    </div>

                    <div>
                      <label id="lab" for="emetteur"><strong>Émetteur:</strong></label>
                      <input type="text" id="emetteur" v-model="item.emetteur" readonly />
                    </div>

                    <div class="divmarg">
                      <label id="lab" for="libelleDep"><strong>Département/service:</strong></label>
                      <v-select
                        v-model="item.libelleDep"
                        :items="DepartList"
                        item-value="value"
                        item-text="text"
                        label="département"
                        id="select"
                        class="select_cust"
                      ></v-select>
                    </div>

                    <div>
                      <label id="lab" for="date"><strong>Date:</strong></label>
                      <input type="date" id="date" v-model="item.date"/>
                    </div>

                    <div>
                      <label id="lab" for="description"><strong>Description:</strong></label>
                      <textarea id="description" readonly v-model="item.description"></textarea>
                    </div>
                  </div>
              </div>
              <div class="details-content2">
                <div class="haut">
                  <h3>CLASSIFICATION :</h3>
                </div>
                  <div class="aff_det2">
                    <div class="divmarg">
                      <label id="lab" for="libellemodedetect"><strong>Mode de Detection:</strong></label>
                      <v-select
                        v-model="mode"
                        item-value="value"
                        item-text="text"
                        :items="ModeList"
                        label="Mode de Detection"
                        id="select"
                        class="select_cust"
                        readonly
                      ></v-select>
                    </div>
                    <div class="divmarg">
                      <label id="lab" for="type"><strong>Type:</strong></label>
                      <v-select
                        v-model="type"
                        item-value="value"
                        item-text="text"
                        :items="TypeList"
                        label="Type"
                        id="select"
                        class="select_cust"
                      ></v-select>
                    </div>

                    <div class="divmarg">
                      <label id="lab" for="libprocdetect"><strong>Processus de detection:</strong></label>
                      <v-select
                        v-model="item.procdetect"
                        item-value="value"
                        item-text="text"
                        :items="ProcList"
                        label="Processus de detection"
                        id="select"
                        class="select_cust"
                      ></v-select>
                    </div>
                      <div class="aff_det2_2">
                        <div class="aff_det2_2_1">
                          <p><strong>Personne autorisé a consulter:</strong></p>
                        </div>
                        <div class="aff_det2_2_2">
                          <ul v-if="filteredConsults.length">
                            <li v-for="(consult, index) in consultStore.Consults" :key="index">
                              {{ consult.ncpsuserusercode }}
                            </li>
                          </ul>
                          <ul v-else>
                            
                          </ul>
                        </div>
                      </div>
                  </div>
              </div>
            </div>
            <div class="button_modif">
              <button @click="saveChanges" :class="{ 'small-button': isIconVisible,'error-button': isFieldMissing }">
                    <span v-if="!isIconVisible">
                      Enregistrer
                    </span>
                    <v-icon v-else>mdi-check</v-icon>
              </button>
              <!-- <button @click="resetValues">Annuler</button> -->
            </div>
            <div class="details-content3">
              <div class="caucau">
                <h4 class="causeh">CAUSES RACINES</h4>
                <button icon class="btn_aj" @click="showAjoutcause = true">
                  <v-icon class="icon">mdi-plus</v-icon>
                  <span>Ajouter</span>
                </button>

              </div>
              
              <v-table height="270px" class="tableau2">
                <thead class="thead_tab">
                    <tr>
                        <th class="text-left">Date</th>
                        <th class="text-left">Description</th>
                        <th class="text-left">Processus Imputation</th>
                        <th class="text-left">Nombre action</th>
                        <th class="text-left">Etat</th>
                        <th class="text-left">Détails</th>
                        <th class="text-left">Supprimer</th>
                        <th class="text-left" colspan="2">Action</th>
                    </tr>
                </thead>
                <tbody v-if="filteredCauses.length">
                  <tr v-for="cause in CauseRacs" :key="cause.causeracseq">
                    <td class="date">{{ cause.causeracdate }}</td>
                    <td class="desc">{{ cause.causeracdescription }}</td>
                    <td class="procimp">{{ cause.causeracprocimput }}</td>
                    <td>{{ cause.nbaction }}</td>
                    <td class="etat"><span>{{ cause.etat }}</span></td>
                    <td class="det">
                      <v-icon 
                        @click="goToDetails(cause, item)" 
                        :class="{'details-icon-disabled': cause.etat === 'Non Validé'}"
                        :style="{
                          pointerEvents: cause.etat === 'Non Validé' ? 'none' : 'auto',
                          opacity: cause.etat === 'Non Validé' ? 0.6 : 1,
                          color: cause.etat === 'Non Validé' ? 'gray' : 'blue'
                        }">
                        mdi-information-outline
                      </v-icon>
                    </td>
                    <td>
                      <!-- <v-icon v-if="cause.etat !== 'Validé'" @click="supprimer(cause)" class="suppr-icon">mdi-delete-outline</v-icon> -->
                      <v-icon 
                        @click="supprimer(cause)" 
                        :class="{'details-icon-disabled': cause.etat === 'Validé'}"
                        :style="{
                          pointerEvents: cause.etat === 'Validé' ? 'none' : 'auto',
                          opacity: cause.etat === 'Validé' ? 0.4 : 1,
                          color: cause.etat === 'Validé' ? 'brown' : 'red'
                        }">
                        mdi-delete-outline
                      </v-icon>
                    </td>
                    <td>
                      <button @click="valider(cause, item)" 
                              v-if="cause.etat === 'Atte Validation'" 
                              class="valider_ico">
                        Valider
                      </button>
                      <button @click="rejeter(cause, item)" 
                              v-if="cause.etat !== 'Validé' && cause.etat !== 'Non Validé'" 
                              class="rejeter_ico">
                        Rejeter
                      </button>
                    </td>
                  </tr>
                </tbody>
                <div v-else class="no-data">Pas de données disponibles</div>
              </v-table>
            </div>
        </div>
        <detail2 :titre="titre" @action_supprime="refreshTable" @action_ajouté="refreshTable" @update-successfully="refreshTable" v-if="selectedItem" :item="selectedItem.item" :cause="selectedItem.cause" @close="closeDetail"/>
        <ajoutcause @ajout-successfully="refreshTable" v-if="showAjoutcause" :code="item.code"  @close="showAjoutcause = false"/>
        <validecause @maj-successfully="refreshTable" v-if="showValidecause" :item="selected.item" :cause="selected.cause" @close="showValidecause = false"/>
        <suppr @rejeterCause="rejet_fonc" :etat="etat" @supprimerCause="supprimer_fonct" :text_sup="text_sup" v-if="showSuppr" :cause="selected.cause" @closesup="showSuppr = false"/>
        <alert v-if="showalert" :alert_color="alert_col" :alert_text="alertMessage" @close="showalert = false"/>
        <alert2 v-if="showalert2" :text="text" @closeal2="fermeture"/>
    </div>
</template>
<script>
import { defineComponent,ref, computed, onMounted } from 'vue';
import { useCauseRacStore } from '@/store/Capa/CauseRac';
import detail2 from '../../components/capa/detail2.vue';
import ajoutcause from '../../components/capa/ajoutcause.vue';
import validecause from '../../components/capa/validecause.vue';
import suppr from '../../components/capa/suppr.vue';
import { useDptStore } from "@/store/Capa/dpt.js";
import { useUpdateCapaStore } from '@/store/Capa/updatecapa.js';
import { useDeleteCauseStore } from '@/store/Capa/deletecause.js';
import { useConsultStore } from '@/store/Capa/listConsult.js';
import alert from '../../components/capa/alert.vue';
import { useListEnumStore } from "@/store/Capa/listEnum.js";
import alert2 from '../../components/capa/alert2.vue';
import { useUpdateCauseStore } from '@/store/Capa/updatecause.js';

export default defineComponent({
  props: {
    item: Object,
    cause: Object
  },

  components: { 
    detail2,
    ajoutcause,
    suppr,
    validecause,
    alert,
    alert2,
  },

  computed: {
    filteredCauses() {
      return this.CauseRacs.filter(cause => cause.causeracncpscode === this.item.code);
    },
    filteredConsults(){
      return this.Consults.filter(consult => consult.ncpsuserncpscode === this.item.code);
    },
  },

  setup(props, { emit }) {
  
    const showalert2 = ref(false);
    const text_sup = ref('');
    const etat = ref('');
    const text = ref('');
    const titre = ref('');
    const alertMessage = ref('');
    const alert_col = ref('');
    const store = useCauseRacStore();
    const CauseRacs = ref([]); 
    const Consults = ref([]); 
    const modif_aff = ref(false);
    const selectedItem = ref(null);
    const selected = ref(null);
    const dptStore = useDptStore();
    // const dpt2Store = useDpt2Store();
    const updateCapaStore = useUpdateCapaStore();
    const deletecauseStore = useDeleteCauseStore();
    const consultStore = useConsultStore();
    const showalert = ref(false);
    const updatecauseStore = useUpdateCauseStore();
    
    const isIconVisible = ref(false);
    const initialItem = ref({ ...props.item });
    const showAjoutcause = ref(false);
    const showValidecause = ref(false);
    const showSuppr = ref(false);

    const EnumStore = useListEnumStore();
    const DepartList = ref([]);
    const DepartList2 = ref([]);
    const enumList = ref([]);
    const ModeList = ref([]);
    const ModeList2 = ref([]);
    const TypeList = ref([]);
    const TypeList2 = ref([]);
    const ProcList = ref([]);
    const ProcList2 = ref([]);
    const dept = ref('');
    const mode = ref('');
    const type = ref('');
    const proc = ref('');
    
    const showBlur = computed(() => !!props.item);
    
    const code_gen = (libelle) => {
      const dep = enumList.value.find(proc => proc.enumLibelle === libelle);
      return dep ? dep.enumCode : ''; 
    };
    const libelle_gen = (code) => {
      const dep = enumList.value.find(proc => proc.enumCode === code);
      return dep ? dep.enumLibelle : ''; 
    };
    
    const fermeture = () => {
      showalert2.value = false;
      close();
    };

    const appeltab = async (reference) => {
      try {
        await store.fetchCauseRac(reference);
        CauseRacs.value = store.CauseRacs;
        await consultStore.fetchConsult(reference);
        Consults.value = consultStore.Consults;
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        
      }
    };
    
    const refreshTable = async () => {
      console.log('fonction refreshh appelé');
      await appeltab(props.item.code);
      emit('ajout_cause');
    };
    onMounted(async () => {
      await appeltab(props.item.code);
      await dptStore.fetchDpt();
      await EnumStore.fetchListEnum();
      titre.value = props.item.libelleType;

        enumList.value = EnumStore.ListEnums
        .map(proc => ({
          enumCode: proc.enumCode.trim(),      
          enumLibelle: proc.enumLibelle.trim()     
        }));

        DepartList.value = EnumStore.ListEnums
        .filter(proc => {
          return proc.enumType.trim() === 'SERVICE';
        })
        .map(proc => (proc.enumLibelle.trim()));
      DepartList2.value = EnumStore.ListEnums
      .filter(proc => proc.enumType.trim() === 'SERVICE')
      .map(proc => ({
          enumCode: proc.enumCode.trim(),      
          enumLibelle: proc.enumLibelle.trim()     
      }));
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
        mode.value = libelle_gen(props.item.modeDetect);
        type.value = libelle_gen(props.item.type);

    });

    const supprimer_fonct = async () => {
      const causeracseq = selected.value.cause.causeracseq;
      const index = CauseRacs.value.findIndex(a => a.causeracseq === causeracseq);

      if (index !== -1) {
        const removedCause = CauseRacs.value.splice(index, 1)[0];
        deletecauseStore.params.causeracseq = causeracseq;

        try {
          await deletecauseStore.deleteCause();
          emit('action_supprime');

          if (CauseRacs.value.length === 0) {
            console.log("Toutes les causes ont été supprimées");
          }

        } catch (error) {
          console.error("Erreur lors de la suppression de la cause", error);
          CauseRacs.value.splice(index, 0, removedCause);
        }
      }
    };

    const rejet_fonc = async () => {
      const causeracseq = selected.value.cause.causeracseq;
      const causeracdate = selected.value.cause.causeracdate;
      const causeracdescription = selected.value.cause.causeracdescription;
      const causeracprocimput = selected.value.cause.causeracprocimput;

      updatecauseStore.params.causeRacSeq = causeracseq;
      updatecauseStore.params.causeRacCode = props.item.code;
      updatecauseStore.params.causeRacDate = causeracdate;
      updatecauseStore.params.causeRacDescription = causeracdescription;
      updatecauseStore.params.causeRacProcImput = causeracprocimput;
      updatecauseStore.params.causeRacValide = 2;
      await updatecauseStore.updateCause();
      refreshTable();
      emit('cause_rejete');
    };

    const resetValues = () => { 
      Object.assign(props.item, initialItem.value);
    };

    const close = () => {
      resetValues();
      emit('close');
    };

    
    const close2 = () => {
      modif_aff.value = false;
      console.log("Bouton cliqué");
    };
    
    const onEdit = () => {
      modif_aff.value = true;
    };

    const goToDetails = (cause, item) => {
      selectedItem.value = { cause, item };
      console.log(cause, item); 
    };

    const valider = (cause, item) => {
      showValidecause.value = true;
      selected.value = { cause, item };
      console.log(cause, item); 
    };
    const supprimer = (cause) => {
      text_sup.value = 'Voulez vous confirmer la suppression ?';
      etat.value = 'suuprcause';
      showSuppr.value = true;
      selected.value = { cause };
      console.log(cause); 
    };
    const rejeter = (cause, item) => {
      text_sup.value = 'Voulez vous rejeter cette cause ?';
      etat.value = 'rejeter';
      selected.value = { cause, item };
      showSuppr.value = true;
    };


    const closeDetail = () => {
      selectedItem.value = null; 
    };

    // code de mis a jour ::
    const saveChanges = async () => {
      try {
        
        alertMessage.value = 'Enregistrement des modifications !';
        alert_col.value = 'succes';
        showalert.value = true;
        
        setTimeout(async () => {
          isIconVisible.value = true;

          updateCapaStore.params.ncpsSeq = props.item.ncpsSeq;
          console.log(updateCapaStore.params.ncpsSeq);
          updateCapaStore.params.ncpsCode = props.item.code;
          updateCapaStore.params.ncpsDate = props.item.date;
          updateCapaStore.params.ncpsDescription = props.item.description;
          updateCapaStore.params.ncpsDepartement = code_gen(props.item.libelleDep);
          updateCapaStore.params.ncpsType = code_gen(type.value);
          updateCapaStore.params.ncpsModeDetect = code_gen(mode.value);
          updateCapaStore.params.ncpsProcessusDetect = code_gen(props.item.procdetect);

          console.log("Parametre de mis a jour:", updateCapaStore.params);

          await updateCapaStore.updateCapa();

          setTimeout(() => {
            isIconVisible.value = false;
          }, 300);
          
          titre.value = type.value;
          emit('update-successfully');
        }, 2000);
        
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des modifications :", error);
      }
    };

    return {
      etat,
      text_sup,
      titre,
      dept,
      mode,
      type,
      proc,
      libelle_gen,
      enumList,
      code_gen,
      DepartList2,
      DepartList,
      ModeList2,
      ModeList,
      TypeList,
      TypeList2,
      ProcList,
      ProcList2,
      EnumStore,
      alert_col,
      alertMessage,
      showalert,
      modif_aff,
      showBlur,
      isIconVisible,
      close,
      close2,
      onEdit,
      CauseRacs,
      Consults,
      selectedItem,
      goToDetails, 
      closeDetail,
      dptStore,
      updateCapaStore,
      consultStore,
      resetValues,
      saveChanges,
      showAjoutcause,
      showValidecause,
      supprimer,
      showSuppr,
      selected,
      refreshTable,
      valider,
      deletecauseStore,
      supprimer_fonct,
      rejeter,
      text,
      showalert2,
      fermeture,
      rejet_fonc,
      updatecauseStore,
    };
  },
});
</script>

<style lang="scss">
#blur{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    backdrop-filter: blur(5px);
    display: flex;
    z-index: 5;
    align-items: center;
    justify-content: center;
    animation: blur 0.4s;
    @keyframes blur {
      from{
        scale: 0.3;
      }
      to{
        scale: 1;
      }
    }
    #principe{
        width: 80%;
        height: 85vh;
        background: white;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.201);
        overflow: auto;
        .titre{
            position: sticky;
            top:0;
            background: white;
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3;
            h2{
                font-size: 18px;
                color: rgb(46, 15, 0);
                span{
                  color: red;
                }
            }
            .fermer{
                position: absolute;
                top: 1rem;
                right: 1.5rem;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s;
            }
            .fermer:hover{
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.297);
                scale: 1.1;
            }

        }
        h2{
          color: red;
          margin-left: 40px;
          margin-top: 0px;
          font-size: 18px;
        }
        h3{
          margin-left: 50px;
          margin-top: -5px;
          margin-bottom: -10px;
          font-size: 14px;
          color: rgb(0, 0, 98);
        }
        .haut{
          display: flex;
          .btn_mod{
            font-size: 9px;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            margin-left: 10px;
            color: white;
            background: rgb(0, 103, 31);
            transform: translateY(8px);
            display: flex;
            transition: all 0.5s;
            .icon{
              position: relative;
              top: 8px;
              left: 8px;
            }
            span{
              position: relative;
              top: 5px;
              left: 12px;
              color: rgb(255, 255, 255);
              font-size: 13px;
              display: none;
              transition: all 0.3s;
              font-weight: 600;
            }
          }
          .btn_mod:hover{
            width: 90px;
            border-radius: 20px;
            overflow: hidden;
            span{
              display: block;
            }
          }
        }
        .aff_det,.aff_det2{
          width: 100%;
          margin-bottom: 50px;
          padding-left: 70px;
          padding-right: 30px;
          padding-top: 10px;
          padding-bottom: 20px;
          .divmarg{
            position: relative;
            top:20px
          }
          div{
            display: flex;
            justify-content: space-between;
            margin-top: 7px;
            #lab{
              width: 200px;
              font-size: 13px;
              position: relative;
              top:5px;
            }
            
            input,textarea{
              border-bottom: 1px solid rgba(0, 0, 0, 0.341);
              width: 450px;
              padding-left: 10px;
              padding-bottom: 3px;
              padding-top: 3px;
              font-size: 12.5px;
              min-height: 30px;
              max-height: 70px;
            }
            input:focus{
              border: none;
              border-bottom: 1px solid blue;
              outline: none;
            }
            .select_cust{
              position: relative;
              bottom: 30px;
              left:32px;
              height: 45px;
              font-size: 16px; 
              position: relative;

              .v-field{
                width: 360px; 

              }
              .v-field__field{
                transform: translate(-10px,-25px);
              }
              .v-field__input{
                transform: translateY(-8px);
                font-size: 13.5px;
              }
              .mdi-menu-down{
                position: relative;
                top: 3px;
              }
            }
          }
          .aff_det2_2{
            display: flex;
            .aff_det2_2_2{
              width: 250px;
              height: 90px;
              border: 1px solid rgba(0, 0, 0, 0.204);
              position: relative;
              top: 10px;
              overflow: auto;
              padding-left: 25px;
              font-size: 13px;
              font-weight: 600;
              padding-top: 5px;
              border-radius: 5px;
        
              ul{
                li{
                  font-size: 12px;
                  opacity: 0.7;
                  cursor: pointer;
                }
                li:hover{
                  opacity: 1;
                }
              }
            }
          }
        }
    }
    .details-content1,.details-content2{
      width: 50%;
    }
    .details-content{
      display: flex;
    }
    .button_modif{
      position: relative;
      bottom: 100px;
      width: 300px;
      padding-left: 50px;
      button{
        width: 90px;
        border: 1px solid rgba(0, 0, 0, 0.322);
        height: 25px;
        font-size: 12px;
        margin-right: 15px;
        border-radius: 10px;
        transition: all 0.3s;
      }
      button:hover{
        border: 1px solid rgba(0, 0, 0, 0.592);
        font-weight: 600;
      }
      .small-button{
        width: 25px;
        border-radius: 50%;
        font-size: 10px;
        background: green;
        color: white;
      }
    }
    .details-content3{
      position: relative;
      bottom: 75px;
      width: 100%;
      .caucau{
        display: flex;
        .causeh{
          text-decoration: underline;
          margin-left: 40px;
          margin-top: 0px;
          margin-bottom: 20px;
          font-size: 12px;
          color:red;
        }
        .btn_aj{
              font-size: 9px;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              margin-left: 10px;
              color: white;
              background: rgb(0, 103, 31);
              display: flex;
              transition: all 0.5s;
              transform: translate(38px,-6px);
              .icon{
                position: relative;
                top: 8px;
                left: 8px;
                font-size: 14.5px;
              }
              span{
                position: relative;
                top: 5px;
                left: 12px;
                color: rgb(255, 255, 255);
                font-size: 13px;
                display: none;
                transition: all 0.3s;
                font-weight: 600;
              }
            }
            .btn_aj:hover{
              width: 90px;
              border-radius: 20px;
              overflow: hidden;
              span{
                display: block;
              }
            }
      }
      .tableau2{
        margin-bottom: -40px;
        border: 1px solid rgba(0, 0, 0, 0.127);
        // box-shadow: 0 0 5px rgba(0, 0, 0, 0.47);
        .thead_tab{
          position: sticky;
          top: 0;
          background: white;
          z-index: 2;
          tr{
            text-align: center;
            
          }
        }
        tbody{
          transition: all 0.4s;
          tr{
            .desc{
              width: 350px;
            }
            .procimp{
              width: 250px;

            }
            .etat{
              font-size: 12px;
              font-weight: 600;
                // color: rgb(74, 0, 26);
                white-space: nowrap;
            }
            .date{
              white-space: nowrap;
            }
            td{
              padding-left: 17px;
            }
          }
          tr:hover{
            background-color: rgba(0, 255, 255, 0.118);
          }
          .det{
            color: blue;

          }
          .details-icon{
            cursor: pointer;
              font-size: 19px;
              position: relative;
            left: 10px;
            z-index: 1;
          }
          .suppr-icon{
            color: red;
            position: relative;
            left: 15px;
            z-index: 1;
            
          }
          .valider_ico{
            width: 80px;
            height: 20px;
            border:1px solid rgb(62, 93, 0);
            border-radius: 20px;
            font-size: 11px;
            color: rgb(41, 62, 0);
            padding: 0;
            transition: all 0.3s;
            margin-bottom: 5px;
            margin-top: 10px;
          }
          .valider_ico:hover{
            scale: 1.1;
          }
          .rejeter_ico{
            width: 80px;
            height: 20px;
            border: 1px solid rgba(0, 0, 0, 0.44);
            border-radius: 20px;
            font-size: 11px;
            color: rgb(0, 0, 0);
            transition: all 0.3s;
            margin-bottom: 10px;
          }
          .rejeter_ico:hover{
            scale: 1.1;
          }
        }
        .no-data{
            position: absolute;
            width: 100%;
            text-align: center;
            padding: 1rem;
        }
      }
    }
    #modif1{
      position: absolute;
      top: 7vh;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 86vh;
      backdrop-filter: blur(15px);
      overflow: auto;
      animation: modif1 0.4s;
      background: rgb(255, 255, 255);
      .fermer2{
        position: relative;
        left: 86.5%;
        top: 1.3rem;
        border-radius: 50%;
        transition: all 0.3s;
      }
      .fermer2:hover{
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.297);
          scale: 1.1;
      }
      .titre{
        width: 100%;
        display: flex;
        justify-content: center;
        h1{
          font-size: 21px;
          position: relative;
          top: 0.6rem;
        }
      }
      .inp{
        width: 100%;
        display: flex;
        justify-content: center;
        padding-top: 30px;
        .input_modif{
          width: 700px;
          height: 40px;
          border-radius: 3px;
          border:none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.332);
          margin-bottom: 8px;
          padding-left: 15px;
          font-size: 13px;
        }
        .input_modif:focus {
          border: none;
          border-bottom: 2px solid #3f51b5; 
          outline: none;
        }
        .input_modif,
        .v-select,
        .v-text-field,
        textarea {
          margin-bottom: 20px; 
        }

        .v-select,
        .v-text-field,
        textarea,
        .input_modif {
          height: 30px; 
        }

        .custom-input input {
          height: 30px !important; 
        }

        textarea {
          height: 100px; 
          margin-top: 30px;
          max-height: 70px;
        }

        .v-select {
          height: 30px !important; 
        }

        .v-select .v-input__control {
          height: 100%; 
        }

        .v-input__control {
          display: flex;
          align-items: center; 
        }

        .btn{
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 0px;
          button{
                background:rgb(176, 0, 156);
                width: 150px;
                height: 35px;
                border-radius: 20px;
                color: white;
                font-weight: 600;
                font-size: 13px;
                transition: all 0.5s;
                &.small-button {
                    width: 35px; 
                    border-radius: 50%; 
                    background: green;
                }
            }
        }

      }
    }
    @keyframes modif1{
      from{
        transform: translateX(-50%) scale(0.5);
        opacity: 0;
      }
      to{
        transform: translateX(-50%) scale(1);
        opacity: 1;
      }
    }
}
</style>