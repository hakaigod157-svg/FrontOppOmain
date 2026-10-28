<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="appl_action" @click="handleClickOutside">
      <div id="appl_div_action" @click.stop ref="valideDiv">
        <div class="titre_valide">
          <h2>Mise en Application</h2>
          <button @click="close" class="fermer">
              <v-icon>mdi-close</v-icon>
          </button>
        </div>
        <div class="formulaire_valide">      
            <div id="date">
                    <label id="lab" for="date"><strong>Date Effective:</strong></label>
                    <input type="date" id="date" v-model="date_eff"/>
                </div>
                <div id="date">
                    <label id="lab" for="date"><strong>Date d'analyse:</strong></label>
                    <input type="date" id="date" v-model="date_ana"/>
                </div>
                <div class="btn">
                  <button class="quitter" @click="quit">Annuler</button>
                  <button @click="toggleButton" :class="{ 'small-button': isIconVisible }">
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
  </template>
<style lang="scss">
    #appl_action{
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
        #appl_div_action{
            padding: 20px;
            animation: ajout 0.3s;
            width: 600px;
            height: auto;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.275);
            border-radius: 5px;
            background: white;
            .titre_valide{
                width: 100%;
                padding-top: 5px;
                padding-bottom: 10px;
                display: flex;
                justify-content: center;
                font-size: 10px;
                color: rgb(46, 15, 0);
                margin-bottom: 20px;
                font-family: sans-serif;
                flex-grow: 1; 
                text-align: center;
                .fermer{
                  position: relative;
                  left: 28vh;
                  font-size: 12px;
                }
                .fermer:hover{
                  color: black;
                }
            }
            .formulaire_valide{
                #date{
                  width: 100%;
                  display: flex;
                  margin-bottom: 15px;
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
                      min-height: 30px;
                      max-height: 70px;
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
                    padding-top: 0px;
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
<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useApplActionStore } from '@/store/Capa/appliqueaction.js';
import alert from '../../components/capa/alert.vue';

export default defineComponent({
      components: {
        alert,
      },
      props: {
        action: Object,
      },
      methods: {
        handleClickOutside(event) {
          const valideDiv = this.$refs.valideDiv;
          if (valideDiv && !valideDiv.contains(event.target)) {
            this.close();
            console.log("clique");
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
        const date_eff = ref(new Date().toISOString().split('T')[0]);
        const date_ana = ref('');
        const appliqueactionStore = useApplActionStore();
        
        const toggleButton = async () => {
          
          if (!date_eff.value || !date_ana.value) {
            alertMessage.value = 'Veuillez renseigner tous les champs !';
            alert_col.value = 'alert';
            showalert.value = true;
            return; 
          }
    
          isIconVisible.value = true;

          appliqueactionStore.params.actionSeq = props.action.actionSeq;
          appliqueactionStore.params.actionDateanaleffic = date_eff.value;
          appliqueactionStore.params.actionDaterelleeffic = date_ana.value;

          console.log('parametre :' +appliqueactionStore.params.actionSeq);
          console.log('parametre :' +appliqueactionStore.params.actionDateanaleffic);
          console.log('parametre :' +appliqueactionStore.params.actionDaterelleeffic);

          await appliqueactionStore.applAction();
          emit('maj-success');
          
          setTimeout(() => {
            emit('close');
          }, 800);
        };
        
        onMounted(async () => {
          
        });
        const quit = () => {
          emit('close');
        };

        return {
          quit,
          alertMessage,
          alert_col,
          showalert,
          isFieldMissing, 
          toggleButton,
          date_eff,
          date_ana,
          appliqueactionStore
        };
      },
    });
    </script>