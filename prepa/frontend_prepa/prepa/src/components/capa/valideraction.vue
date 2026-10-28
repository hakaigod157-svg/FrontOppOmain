<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="valide_action" @click="handleClickOutside">
      <div id="valide_div_action" @click.stop ref="valideDiv">
        <div class="titre_valide">
          <h2>Validation Action</h2>
          <button @click="close" class="fermer">
              <v-icon>mdi-close</v-icon>
          </button>
        </div>
        <div class="formulaire_valide">      
                <v-select
                v-model="responsable"
                item-value="value"
                item-text="text"
                label="Responsable"
                id="select"
                class="select_cust"
                :items="userStore.users"
                ></v-select>
                <div id="date">
                    <label id="lab" for="date"><strong>Date prévue:</strong></label>
                    <input type="date" id="date" v-model="date_prev"/>
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
  #valide_action{
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
      #valide_div_action{
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
                left: 29vh;
                font-size: 12px;
              }
              .fermer:hover{
                color: black;
              }
          }
          .formulaire_valide{
              .select_cust{
                left:32px;
                height: 45px;
                font-size: 16px; 
                margin-bottom: 20px;
                .v-field{
                  height: 40px;
                }
                .v-field__field{
                  transform: translate(-0px,-25px);
                }
                .v-field__input{
                  transform: translateY(7px);
                  font-size: 15px;
                }
                .mdi-menu-down{
                  position: relative;
                  bottom: 8px;
                }
              }
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
  import { useUserStore } from "@/store/Capa/user.js";
  import { useUpdateActionStore } from '@/store/Capa/valideraction.js';
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
      const responsable = ref(''); 
      const date_prev = ref(new Date().toISOString().split('T')[0]);
      const userStore = useUserStore();
      const updateactionStore = useUpdateActionStore();
      
      const toggleButton = async () => {
        
        if (!responsable.value || !date_prev.value) {
  
          alertMessage.value = 'Veuillez renseigner tous les champs !';
          alert_col.value = 'alert';
          showalert.value = true;
          return; 
        }

        updateactionStore.params.actionSeq = props.action.actionSeq;
        updateactionStore.params.actionResponsable = responsable.value;
        updateactionStore.params.actionDateprev = date_prev.value;

        console.log('parametre :' +updateactionStore.params.actionSeq);
        console.log('parametre :' +updateactionStore.params.actionResponsable);
        console.log('parametre :' +updateactionStore.params.actionDateprev);

        await updateactionStore.updateAction();
        emit('maj-success');

        isIconVisible.value = true;
        
        setTimeout(() => {
          emit('close');
        }, 800);
      };
      
      onMounted(async () => {
        await userStore.fetchUser();
      });
      const quit = () => {
      emit('close');
    };

    return {
      quit,
        showalert,
        alert_col,
        alertMessage,
        isIconVisible,
        isFieldMissing, 
        toggleButton,
        responsable,
        date_prev,
        userStore,
        updateactionStore,
      };
    },
  });
  </script>