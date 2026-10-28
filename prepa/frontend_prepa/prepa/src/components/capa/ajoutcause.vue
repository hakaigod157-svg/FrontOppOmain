<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="ajout_cause" @click="handleClickOutside">
      <div id="ajout_div_cause" @click.stop ref="ajoutDiv">
        <div class="titre_cause">
          <h2>Cause Racine</h2>
          <button @click="close" class="fermer">
              <v-icon>mdi-close</v-icon>
          </button>
        </div>
        <div class="formulaire_cause">
                <textarea
                    v-model="description"
                  placeholder="Description"
                  class="input_modif_cause"
                ></textarea><br/>
                <div id="date">
                    <label id="lab" for="date"><strong>Date cause racine:</strong></label>
                    <input type="date" id="date" v-model="today"/>
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

<style lang="scss">
#ajout_cause{
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
    #ajout_div_cause{
        padding: 20px;
        animation: ajout 0.3s;
        width: 600px;
        height: auto;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.275);
        border-radius: 5px;
        background: white;
        .titre_cause{
            width: 100%;
            padding-top: 5px;
            padding-bottom: 10px;
            display: flex;
            justify-content: center;
            font-size: 12px;
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
        .formulaire_cause{
            .input_modif_cause{
            width: 100%;
            height: 40px;
            border-radius: 3px;
            border:none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.332);
            margin-bottom: 8px;
            padding-left: 15px;
            font-size: 13px;
            }
            .input_modif_cause:focus {
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

<script>
import { defineComponent, ref, onMounted,onBeforeUnmount } from 'vue';
import { useAjoutCauseStore  } from "@/store/Capa/ajoutcause.js";
import alert from '../../components/capa/alert.vue';

export default defineComponent({
  components: {
    alert,
  },
    props: {
        code: Object,
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
    const ajoutcauseStore = useAjoutCauseStore();
    const today = ref(new Date().toISOString().split('T')[0]);

    const toggleButton = async () => {

      if (!description.value) {
        //alert 
        alertMessage.value = 'Veuillez renseigner la description !';
        alert_col.value = 'alert';
        showalert.value = true;
        return; 
      }

      try {
        console.log('code :'+ props.code);
        console.log('description :'+ description.value);
        console.log('date :'+ today.value);

        await ajoutcauseStore.fetchAjoutCause(props.code,description.value,today.value);
        
        emit('ajout-successfully');
        console.log('ajout reussi');
      } catch (error) {
        console.error("Erreur lors de l'ajout:", error);
      }

      isIconVisible.value = true;

      setTimeout(() => {
        emit('close');
      }, 800);
    };

    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        toggleButton();
      }
    };

    onMounted(() => {
      window.addEventListener('keydown', handleKeyPress);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeyPress);
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
      description,
      ajoutcauseStore,
      today
    };
  },
});
</script>
