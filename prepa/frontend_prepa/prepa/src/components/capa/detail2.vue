<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="blur">
        <div id="principe">
            <div class="titre">
                <h2>Détails Cause Racine<span> ({{ cause.etat }})</span></h2>
                <button @click="close_detail2" class="fermer">
                    <v-icon>mdi-close</v-icon>
                </button>
            </div>
            <div class="haut">
              <h2>{{ titre }}<span> :</span></h2>
              <!-- <button icon @click="onEdit" class="btn_mod">
                    <v-icon class="icon">mdi-pencil</v-icon>
                    <span>Modifier</span>
                </button> -->

            </div>
            <div class="details-content">
              
              <div class="details-content1">
                <div class="haut">
                  <h3>ANOMALIE :</h3>
                </div>
                <div v-if="item" class="aff_det">
                    <p><strong>Reference:</strong> {{ item.code }}</p>
                    <p><strong>Émetteur:</strong> {{ item.emetteur }}</p>
                    <p><strong>Département/service:</strong> {{ item.libelleDep }}</p>
                    <p><strong>Date:</strong> {{ item.date }}</p>
                    <p><strong>Description:</strong> {{ item.description }}</p>
                </div>
              </div>
              <div class="details-content2">
                <div class="haut">
                  <h3>CAUSE RACINE :</h3>
                </div>
                <div class="aff_det2" v-if="cause">
                    <div>
                      <label id="lab" for="date"><strong>Date:</strong></label>
                      <input type="date" id="date" v-model="cause.causeracdate" :readonly="cause.etat == 'Validé'"/>
                    </div>
                    <div class="divmarg">
                      <label id="lab" for="libelleDep"><strong>Processus d'imputation:</strong></label>
                      <v-select
                          v-model="cause.causeracprocimput"
                          :items="ProcList"
                          item-value="value"
                          item-text="text"
                          label="Processus imputation"
                          id="select"
                          class="select_cust"
                          :disabled="cause.etat !== 'Validé'"
                          
                        ></v-select>
                    </div>
                    <div>
                      <label id="lab" for="description"><strong>Description:</strong></label>
                      <textarea id="description" v-model="cause.causeracdescription" :readonly="cause.etat == 'Validé'"></textarea>
                    </div>
                </div>
              </div>
            </div>

            <div class="button_modif2">
              <button @click="saveChanges2" :class="{ 'small-button': isIconVisible,'error-button': isFieldMissing }">
                    <span v-if="!isIconVisible">
                      Enregistrer
                    </span>
                    <v-icon v-else>mdi-check</v-icon>
              </button>
              <!-- <button @click="resetValues">Annuler</button> -->
            </div>
            <div class="details-content3">
              <div class="caucau2">
                <h4 class="causeh2">ACTIONS</h4>
                <button icon class="btn_aj" @click="showAjoutaction = true">
                        <v-icon class="icon">mdi-plus</v-icon>
                        <span>Ajouter</span>
                  </button>

              </div>

              <v-table height="250px" class="tableau2">
                <thead class="thead_tab">
                  <tr>
                    <th class="text-left">Description</th>
                    <th class="text-left">Type</th>
                    <th class="text-left">Responsable</th>
                    <th class="text-left">Date prevue</th>
                    <th class="text-left">Date Effective</th>
                    <th class="text-left">Etat</th>
                    <th class="text-left" colspan="2">Actions</th>
                  </tr>
                </thead>
                <tbody v-if="filteredActions.length">
                  <tr v-for="action in filteredActions" :key="action.actionSeq">
                    <td class="descript">{{ action.actionDescription }}</td>
                    <td>{{ action.libelleType }}</td>
                    <td>{{ action.actionResponsable }}</td>
                    <td class="dat">{{ action.actionDateprev }}</td>
                    <td class="dat">{{ action.actionDateeffect }}</td>
                    <td class="validlib">{{ action.actionValidationLibelle }}</td>
                    <!-- <td class="action22">
                      <button>
                        <v-icon icon>mdi-dots-horizontal</v-icon>
                      </button>
                    </td> -->
                    <td class="action2">
                      <button v-if="action.actionValide === 0" class="btnVal" @click="valider(action)">Valider</button>
                      <button v-if="action.actionMiseappli === 0" class="btnApp" @click="appliquer(action)">Appliquer</button>
                      <button v-if="action.actionValidationLibelle != 'Analysé'" class="btnAna" @click="Analyser(action)">analyser</button>
                      <button class="btnMod">
                        <v-icon>mdi-pencil</v-icon>
                      </button>
                      <button class="btnSup" @click="supprimer(action)">
                        <v-icon>mdi-delete-outline</v-icon>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <div v-else class="no-data">Aucune action disponible</div>
              </v-table>

            </div>
        </div>
    </div>
    <ajoutaction @action_ajouté="refreshtable" v-if="showAjoutaction" :code="item.code" :seq="cause.causeracseq"  @close="showAjoutaction = false"/>
    <suppr :etat="etat" @supprimerAction="supprimer_action" :text_sup="text_sup" v-if="showSuppr" :action="selected.action" @closesup="showSuppr = false"/>
    <valideraction @maj-success="refreshtable" v-if="showvalideraction" :action="selected.action" @close="showvalideraction = false"/>
    <appliqueaction @maj-success="refreshtable" v-if="showappliqueaction" :action="selected.action" @close="showappliqueaction = false"/>
    <analyse @maj-success="refreshtable" v-if="showanalyse" :action="selected.action" @close="showanalyse = false"/>
    <alert v-if="showalert" :alert_color="alert_col" :alert_text="alertMessage" @close="showalert = false"/>
</template>
<script>
import { ref, computed, onMounted,watch } from 'vue';
import { useActionStore } from '@/store/Capa/Action.js';
import { useProcStore } from '@/store/Capa/Processus.js';
import { useUpdateCauseStore } from '@/store/Capa/updatecause.js';
import ajoutaction from '../../components/capa/ajoutaction.vue';
import suppr from '../../components/capa/suppr.vue';
import { useDeleteActionStore } from '@/store/Capa/suppraction.js'
import valideraction from '../../components/capa/valideraction.vue';
import appliqueaction from '../../components/capa/appliqueaction.vue';
import analyse from '../../components/capa/analyse.vue';
import alert from '../../components/capa/alert.vue';
import { useListEnumStore } from "@/store/Capa/listEnum.js";

export default {
  props: {
    item: Object,
    cause: Object,
    titre: {
      type: String,
      required: true
    }
  },
  components: { 
    ajoutaction,
    suppr,
    valideraction,
    appliqueaction,
    analyse,
    alert
  },
  computed: {
    // utilisé pour comarer actioncauseseq et causeseq 
    filteredActions() {
      return this.Actions.filter(action => action.actionCausesseq === this.cause.causeracseq);
    }
  },

  setup(props, { emit }) {
    const etat = ref('');
    const text_sup = ref('');
    const alertMessage = ref('');
    const alert_col = ref('');
    const showalert = ref(false);
    const Actionstore = useActionStore();
    const isIconVisible = ref(false);
    const Actions = ref([]); 
    const modif_aff = ref(false);
    const processList = ref([]);
    const initialCause = ref({ ...props.cause });
    const procStore = useProcStore();
    const updatecauseStore = useUpdateCauseStore();
    const showAjoutaction = ref(false);
    const showvalideraction = ref(false);
    const showappliqueaction = ref(false);
    const showanalyse = ref(false);
    const selected = ref(null);
    const showSuppr = ref(false);
    const deleteActionStore = useDeleteActionStore();

    const EnumStore = useListEnumStore();
    const enumList = ref([]);
    const ProcList = ref([]);
    const ProcList2 = ref([]);

    const code_gen = (libelle) => {
      const dep = enumList.value.find(proc => proc.enumLibelle === libelle);
      return dep ? dep.enumCode : ''; 
    };

    const appeltab = async (reference) => {
      try {
          Actions.value = [];
          await Actionstore.fetchAction(reference);
          Actions.value = Actionstore.Actions;
    
        console.log(Actions.value)
        
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    const refreshtable = async () => {
      Actions.value = [];
      console.log('valeur azo :' +props.cause.causeracseq);
      await appeltab(props.cause.causeracseq);
      emit("action_ajouté");
    }
    onMounted(async () => {
      await appeltab(props.cause.causeracseq);
      await EnumStore.fetchListEnum();

      await procStore.fetchProc();
      enumList.value = EnumStore.ListEnums
          .map(proc => ({
              enumCode: proc.enumCode.trim(),      
              enumLibelle: proc.enumLibelle.trim()     
          }));

      processList.value = procStore.Procs.map(proc => proc.enumCode);
      console.log(processList.value);
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
  
    const resetValues = () => { 
      Object.assign(props.cause, { ...initialCause.value });
    };

    const saveChanges2 = async () => {

      try {
        alertMessage.value = 'Enregistrement des modifications !';
        alert_col.value = 'succes';
        showalert.value = true;
        
        setTimeout(async () => {
          isIconVisible.value = true;

          updatecauseStore.params.causeRacSeq = props.cause.causeracseq;
          updatecauseStore.params.causeRacCode = props.item.code;
          updatecauseStore.params.causeRacDate = props.cause.causeracdate 
          ? new Date(props.cause.causeracdate).toISOString().split('T')[0]: '';
          updatecauseStore.params.causeRacDescription = props.cause.causeracdescription;
          updatecauseStore.params.causeRacProcImput =code_gen(props.cause.causeracprocimput)
          console.log("Parametre de mis a jour:", updatecauseStore.params);
          updatecauseStore.params.causeRacValide = props.cause.causeracvalide;

          console.log(updatecauseStore.params);
          alertMessage.value = 'Enregistrement des modifications !';
          alert_col.value = 'succes';
          showalert.value = true;

          await updatecauseStore.updateCause();
          

          setTimeout(() => {
            isIconVisible.value = false;
          }, 300);
          
          emit('update-successfully');
        }, 2000);
        
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des modifications :", error);
      }
    }


    const supprimer = (action) => {
      text_sup.value = 'Voulez vous confirmer la suppression ?';
      showSuppr.value = true;
      etat.value = 'suupraction';
      selected.value = { action };
      console.log(action); 
    };
    const valider = (action) => {
      if (action.actionValide === 0) {
        showvalideraction.value = true;
        selected.value = { action };
        console.log(action); 
      }else{
        alertMessage.value = 'Cette action est déja validée !';
        alert_col.value = 'alert';
        showalert.value = true;
      }
    }
    const appliquer = (action) => {
      if (action.actionValide === 0) {
        alertMessage.value = 'Cette action doit etre validé avant application !';
        alert_col.value = 'alert';
        showalert.value = true;
      }else{
        if (action.actionMiseappli === 0){
          console.log(action.actionValide)
          showappliqueaction.value = true;
          selected.value = { action };
          console.log(action); 
        }else{
          alertMessage.value = 'Cette action est déja Appliqué !';
          alert_col.value = 'alert';
          showalert.value = true;
        }
      }
    };
    const Analyser = (action) => {
        showanalyse.value = true;
        selected.value = { action };
        console.log(action); 
    };
    const supprimer_action = async () => {
      const actionSeq = selected.value.action.actionSeq;
      const index = Actions.value.findIndex(a => a.actionSeq === actionSeq);
      
      if (index !== -1) {
        Actions.value.splice(index, 1);
        deleteActionStore.params.actionSeq = actionSeq;

        try {
          await deleteActionStore.deleteAction(); 
          emit('action_supprime');
          if (Actions.value.length === 0) {
            console.log("Toutes les actions ont été supprimées");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression de l'action", error);
          Actions.value.splice(index, 0, selected.value.action); 
        }
      }
    };
    const close_detail2 = async () => {
      resetValues();
      emit('close');
    };

    return {
      etat,
      text_sup,
      enumList,
      code_gen,
      ProcList,
      ProcList2,
      alert_col,
      EnumStore,
      alertMessage,
      showalert,
      modif_aff,
      processList,
      updatecauseStore,
      Actionstore,
      close_detail2,
      Actions,
      resetValues,
      procStore,
      saveChanges2,
      isIconVisible,
      showAjoutaction,
      showvalideraction,
      showappliqueaction,
      showanalyse,
      valider,
      refreshtable,
      supprimer,
      showSuppr,
      selected,
      supprimer_action,
      deleteActionStore,
      appliquer,
      Analyser,
    };
  },
};
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
    z-index: 20;
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
            // margin-bottom: 0.5rem;
            z-index: 3;
            h2{
                font-size: 18px;
                color: rgb(46, 15, 0);
            }
            .fermer{
                position: absolute;
                top: -0.5rem;
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
          margin-top: 10px;
          margin-bottom: 10px;
          font-size: 18px;
        }
        .valide{
            margin-left: 35rem;
        }
        h3{
          margin-left: 50px;
          margin-top: 10px;
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
        .aff_det{
          max-width: 700px;
        }
        .aff_det,.aff_det2{
          margin-bottom: 50px;
          // background: rgb(238, 238, 238);
          padding-left: 70px;
          padding-right: 30px;
          padding-top: 10px;
          padding-bottom: 20px;
          p{
            margin-top: 10px;
            font-size: 12.5px;
            strong{
              margin-right: 20px;
            }
          }
          input:focus,textarea:focus{
            border-bottom: 1px solid blue;
            outline: none;
          }
        }
    }
    .details-content{
      display: flex;
      
    }
    .button_modif2{
      position: relative;
      top: -45px;
      width: 300px;
      padding-left: 50px;
      z-index: 22;
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
      bottom: 50px;
      width: 100%;
      .caucau2{
        display: flex;
        margin-bottom: 50px;
        position: relative;
        top: 50px;
        z-index: 21;
      .causeh2{
        text-decoration: underline;
        margin-left: 40px;
        //margin-top: 53px;
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
              transform: translate(30px,-6px);
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
          tr{
            text-align: center;
          }
        }
        tbody{
          transition: all 0.4s;
          tr{
            transition: all 0.3s;
            .descript{
              width: 300px;
            }
            td{
              padding-left: 17px;
            }
            .dat{
              
            }
            .action{
              scale: 1.1;
              font-size: 16px;
              color:blue;
              transition: all 0.3s;
              // padding-left: 28px;
              button{
                cursor: pointer;
                padding-left: 5px;
                padding-right: 5px;
                width:100%;
                display: flex;
                justify-content: flex-start;
                padding-left: 10px;
              }
            }

            .action2{
              display: flex;
              gap: 10px;
              align-items: center;
              transition: all 0.3s;
              button{
                height: 20px;
                border-radius: 10px;
                border: 1px solid rgba(0, 0, 0, 0.42);
                padding-left: 10px;
                padding-right: 10px;
                font-size: 11px;
                transition: all 0.3s;
              }
              .btnMod,.btnSup{
                font-size: 9px;
              }
              .btnMod:hover{
                border-color: blue;
                color: blue;
              }
              .btnSup:hover{
                border-color: red;
                color: red;
              }
              .btnVal:hover,.btnApp:hover,.btnAna:hover{
                border-color: rgb(0, 91, 0);
                color: rgb(0, 91, 0);
                font-weight: 500;
              }
            }
          }
          tr:hover{
            background-color: rgba(0, 255, 255, 0.118);
          }
          .details-icon{
            cursor: pointer;
          }
          .validlib{
            font-weight: 600;
            white-space: nowrap;
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
  }
</style>