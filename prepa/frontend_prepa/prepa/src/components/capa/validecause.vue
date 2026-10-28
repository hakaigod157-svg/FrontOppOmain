<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="valide_cause" @click="handleClickOutside">
      <div id="valide_div_cause" @click.stop ref="valideDiv">
        <div class="titre_valide">
          <h2>Validation cause Racine</h2>
          <button @click="close" class="fermer">
              <v-icon>mdi-close</v-icon>
          </button>
        </div>
        <div class="formulaire_valide">      
                <v-select
                v-model="procimput"
                :items="processList"  
                item-value="value"
                item-text="text"
                label="Processus d'imputation"
                id="select"
                class="select_cust"
                ></v-select>
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
#valide_cause{
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
    #valide_div_cause{
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
            font-size: 11px;
            color: rgb(46, 15, 0);
            margin-bottom: 20px;
            font-family: sans-serif;
            flex-grow: 1; 
            text-align: center;
            .fermer{
              position: relative;
              left: 25vh;
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
import { defineComponent, ref, onMounted,onBeforeUnmount } from 'vue';
import { object } from 'yup';
import { useProcStore } from '@/store/Capa/Processus.js';
import { useUpdateCauseStore } from '@/store/Capa/updatecause.js';
import alert from '../../components/capa/alert.vue';

export default defineComponent({
  components: {
    alert,
  },
  props: {
    // code: Object,
    // desc: Object,
    item: Object,
    cause: Object
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
    const procimput = ref(''); 
    const procStore = useProcStore();
    const updatecauseStore = useUpdateCauseStore();
    const processList = ref([]);
    const processList2 = ref([]);
    const code_correspondant = ref(null);
    
    const toggleButton = async () => {
      
      if (!procimput.value) {

        alertMessage.value = 'Veuillez renseigner le processus pour la validation !';
        alert_col.value = 'alert';
        showalert.value = true;
        return; 
      }
      code_correspondant.value = code_gen(procimput.value);

      console.log('date'+props.cause.causeracdate)

      updatecauseStore.params.causeRacSeq = props.cause.causeracseq;
      updatecauseStore.params.causeRacCode = props.item.code;
      updatecauseStore.params.causeRacDate = props.cause.causeracdate 
    ? new Date(props.cause.causeracdate).toISOString().split('T')[0] 
    : null;
      updatecauseStore.params.causeRacDescription = props.cause.causeracdescription;
      updatecauseStore.params.causeRacProcImput = code_correspondant.value;
      updatecauseStore.params.causeRacValide = 1;

      await updatecauseStore.updateCause();

      emit('maj-successfully');

      isIconVisible.value = true;
      
      setTimeout(() => {
        emit('close');
      }, 800);
    };

    const code_gen = (libelle) => {
      const found = processList2.value.find(proc => proc.enumLibelle === libelle);
      return found ? found.enumCode : null; 
    };
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        toggleButton();
      }
    };
    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeyPress);
    });

    onMounted(async () => {
      window.addEventListener('keydown', handleKeyPress);
      await procStore.fetchProc();
      procStore.Procs.forEach(proc => {
        console.log(proc.enumLibelle); 
      });

      processList.value = procStore.Procs.map(proc => proc.enumLibelle);
      console.log(processList.value);

      processList2.value = procStore.Procs.map(proc => ({
        enumLibelle: proc.enumLibelle,
        enumCode: proc.enumCode,
      }));
      console.log(processList2.value);
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
      procimput,
      procStore,
      processList,
      processList2,
      updatecauseStore,
      code_gen,
      code_correspondant,
    };
  },
});
</script>
