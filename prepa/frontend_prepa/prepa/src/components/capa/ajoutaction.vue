<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="ajout_action" @click="handleClickOutside">
      <div id="ajout_div_action" @click.stop ref="ajoutDiv">
        <div class="titre_action">
          <h2>Nouvelle action</h2>
          <button @click="close" class="fermer">
              <v-icon>mdi-close</v-icon>
          </button>
        </div>
        <div class="formulaire_action">
                <textarea
                v-model="description"
                  placeholder="Description"
                  class="input_modif_action"
                ></textarea><br/>
                <div id="date">
                    <label id="lab" for="date"><strong>Date cause racine:</strong></label>
                    <input type="date" id="date" v-model="today"/>
                </div>
                <div class="check">
                    <h2>Type d'action :</h2>
                    <v-select
                        v-model="typecause"
                        item-value="value"
                        item-text="text"
                        :items="TypeCauseList"
                        id="select"
                        class="custom"
                      ></v-select>
                </div>
                <div class="btn">
                  <button class="quitter" @click="quit">Annuler</button>
                  <button @click="toggleButton" :class="{ 'small-button': isIconVisible }">
                    <span v-if="!isIconVisible">
                      <template v-if="!isFieldMissing">Ajouter</template>
                    </span>
                    <v-icon v-else>mdi-check</v-icon>
                  </button>
                </div>
        </div>
      </div>
    </div>
    <alert v-if="showalert" :alert_color="alert_col" :alert_text="alertMessage" @close="showalert = false"/>
  </template>

<script>
import { defineComponent, ref, onMounted,watch } from 'vue';
import { useAjoutActionStore } from '@/store/Capa/insertAction.js';
import alert from '../../components/capa/alert.vue';
import { useListEnumStore } from "@/store/Capa/listEnum.js";

export default defineComponent({
  components: {
    alert,
  },
    props: {
        code: Object,
        seq: Object,
    },
  methods: {
    
    handleClickOutside(event) {
      const ajoutDiv = this.$refs.ajoutDiv;
      if (ajoutDiv && !ajoutDiv.contains(event.target)) {
        this.close();
      }
    },
    close() {
      this.$emit('close');
    }
  },

  setup(props, { emit }) {
    const alertMessage = ref('');
    const alert_col = ref('');
    const showalert = ref(false);
    const isIconVisible = ref(false);
    const isFieldMissing = ref(false); 
    const description = ref('');
    const ajoutActionStore = useAjoutActionStore();
    const today = ref(new Date().toISOString().split('T')[0]);
    const processList = ref([]);
    const selectProcess = ref(null);
    const EnumStore = useListEnumStore();
    const TypeCauseList = ref([]);
    const TypeCauseList2 = ref([]);
    const enumList = ref([]);
    const typecause = ref('');
    
    onMounted(async () => {
        await EnumStore.fetchListEnum();

        enumList.value = EnumStore.ListEnums
        .map(proc => ({
          enumCode: proc.enumCode.trim(),      
          enumLibelle: proc.enumLibelle.trim()     
        }));

        TypeCauseList.value = EnumStore.ListEnums
          .filter(proc => {
            return proc.enumType.trim() === 'TypeAction';
          })
          .map(proc => (proc.enumLibelle.trim()));
          TypeCauseList2.value = EnumStore.ListEnums
        .filter(proc => proc.enumType.trim() === 'TypeAction')
        .map(proc => ({
            enumCode: proc.enumCode.trim(),      
            enumLibelle: proc.enumLibelle.trim()     
        }));
    });

    const code_gen = (libelle) => {
      const dep = enumList.value.find(proc => proc.enumLibelle === libelle);
      return dep ? dep.enumCode : ''; 
    };
    const toggleButton = async () => {
      
      if (!description.value || !typecause.value) {
        alertMessage.value = 'Veuillez renseigner tous les champs !';
        alert_col.value = 'alert';
        showalert.value = true;
        return; 
      }else{
          ajoutActionStore.params.actionNcpscode = props.code;
          ajoutActionStore.params.actionDescription = description.value;
          ajoutActionStore.params.actionType = code_gen(typecause.value);
          ajoutActionStore.params.actionCausesseq = props.seq;
              
          await ajoutActionStore.fetchAjoutAction();
          emit('action_ajouté');

          isIconVisible.value = true;
          
          setTimeout(() => {
            emit('close');
          }, 800);

      }      
    };

    const quit = () => {
      emit('close');
    };

    return {
      enumList,
      code_gen,
      TypeCauseList,
      TypeCauseList2,
      EnumStore,
      quit,
      showalert,
      alert_col,
      alertMessage,
      isIconVisible,
      isFieldMissing, 
      toggleButton,
      description,
      today,
      processList,
      selectProcess,
      ajoutActionStore,
      typecause
    };
  },
});
</script>

<style lang="scss">
#ajout_action{
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
    overflow: hidden;
    #ajout_div_action{
        padding: 20px;
        animation: ajout 0.3s;
        width: 600px;
        height: auto;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.275);
        border-radius: 5px;
        background: white;
        .titre_action{
            width: 100%;
            padding-top: 5px;
            padding-bottom: 10px;
            display: flex;
            justify-content: center;
            font-size: 11.5px;
            color: rgb(46, 15, 0);
            font-family: sans-serif;
            flex-grow: 1; 
            text-align: center;
            .fermer{
              position: relative;
              left: 30vh;
            }
            .fermer:hover{
              color: black;
            }
        }
        .check{
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding-left: 10px;
            h2{
                font-size: 13px;
            }
            label{
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .custom{
                border-bottom: 1px solid rgba(0, 0, 0, 0.279);
                height: 30px;
                font-size: 13px;
                margin-left: 30px;
                .v-field{
                // width: 360px; 
                  height: 30px;
                }
                .v-field__field{
                  transform: translateY(-25px);
                }
                .v-select__selection-text{
                  position: relative;
                  top: 12px;
                  font-size: 14px;
                  font-size: 14px;
                }
                .mdi-menu-down{
                  position: relative;
                  bottom: 13px;
                }
            }
            .custom:focus{
                outline: none;
                border: none;
                border-bottom: 2px solid rgba(0, 4, 255, 0.486);
            }
        }
        .formulaire_action{
            .input_modif_action{
            width: 100%;
            height: 40px;
            border-radius: 3px;
            border:none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.332);
            margin-bottom: 8px;
            padding-left: 15px;
            font-size: 13px;
            }
            .input_modif_action:focus {
            border: none;
            border-bottom: 2px solid #3f51b5; 
            outline: none;
            }

            textarea {
            height: 200px; 
            margin-top: 30px;
            max-height: 150px;
            min-height: 30px;
            }
            #date{
              display:flex;
              margin-bottom: 5px;
              margin-top: 5px;
              label{
                font-size: 12px;
                margin-left: 10px;
                white-space: nowrap;
                position: relative;
                top: 6px;
              }
              input{
                margin-left: 20px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.341);
                width: 100%;
                padding-left: 10px;
                padding-bottom: 3px;
                padding-top: 3px;
                font-size: 12.5px;
                position: relative;
                bottom: 2px;
                }
                input:focus{
                border: none;
                border-bottom: 1px solid blue;
                outline: none;
                }

            }
            .btn{
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 0px;
            padding-top: 10px;
            gap: 30px;
            .quitter{
              border: 1px solid rgba(0, 0, 0, 0.335);
              border-radius: 20px;
              font-size: 12px;
              transition: all 0.3s;
              background:transparent;
              color: black;
              font-weight: normal
            }
            button{
                background:rgb(176, 0, 156);
                width: 130px;
                height: 33px;
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
                    width: 240px; 
                    font-size: 12px;
                    border-radius: 20px; 
                }
            }
            }
        }
    }
    @keyframes ajout{
        from{
            transform: translateY(100%)
            scale(0)
        }
        to{
            transform: translateY(0);
            scale: 1;
        }
    }
}
</style>