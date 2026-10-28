<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="ajout" @click="handleClickOutside">
      <div id="ajout_div" @click.stop ref="ajoutDiv">
        <div class="titre">
          <h2>Non Conformité</h2>
          <button @click="close" class="fermer">
              <v-icon>mdi-close</v-icon>
          </button>
        </div>
        <div class="formulaire">
              <v-select
                  :items="emetteurStore.emetteurs"
                  v-model="ncpsEmetteur"
                  label="Emetteur"
                  placeholder="Sélectionnez un emetteur"
                ></v-select><br/>
                <v-select
                  :items="DepartList"              
                  item-value="value"
                  item-text="text"
                  v-model="ncpsDepartement"
                  label="Département/service"
                  placeholder="Sélectionnez un département"
                ></v-select><br/>
                <v-text-field
                    type="date"
                    solo
                    hide-details
                    class="custom-input"
                    v-model="today"
                ></v-text-field>
                <textarea
                  v-model="ncpsDescription"
                  placeholder="Description"
                  class="input_modif"
                ></textarea><br/>
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
#ajout{
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
    #ajout_div{
        padding: 20px;
        animation: ajout 0.3s;
        width: 600px;
        height: 420px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.275);
        border-radius: 5px;
        background: white;
        .titre{
            width: 100%;
            padding-top: 10px;
            padding-bottom: 10px;
            display: flex;
            justify-content: center;
            font-size: 12px;
            color: rgb(46, 15, 0);
            font-family: sans-serif;
            padding-bottom: 20px;
            flex-grow: 1; 
            text-align: center;
            .fermer{
              position: relative;
              left: 190px;
              
            }
            .fermer:hover{
             color: black;
            }
        }
        .formulaire{
            .input_modif{
            width: 100%;
            height: 40px;
            border-radius: 3px;
            border:none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.332);
            margin-bottom: 8px;
            padding-left: 15px;
            font-size: 14px;
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
            max-height: 60px;
            min-height: 30px;
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
import { useInsertStore } from "@/store/Capa/ajoutanomalie.js";
import alert from '../../components/capa/alert.vue';
import { useListEnumStore } from "@/store/Capa/listEnum.js";
import { useEmetteurStore } from "@/store/Capa/emetteur.js"

export default defineComponent({
      components: {
        alert,
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
    const emetteurStore = useEmetteurStore();
    const insertStore = useInsertStore();
    const ncpsEmetteur = ref('');
    const ncpsDepartement = ref('');
    const ncpsDescription = ref('');
    const today = ref(new Date().toISOString().split('T')[0]);

    const EnumStore = useListEnumStore();
    const DepartList = ref([]);
    const DepartList2 = ref([]);
    
    const code_gen = (libelle) => {
      const dep = DepartList2.value.find(proc => proc.enumLibelle === libelle);
      return dep ? dep.enumCode : null; 
    };

    const toggleButton = async () => {

      if (!ncpsEmetteur.value || !ncpsDescription.value || !ncpsDepartement.value || !today.value) {
        alertMessage.value = 'Veuillez renseigner tous les champs !';
        alert_col.value = 'alert';
        showalert.value = true;
        return; 
      }

      try {

        ncpsDepartement.value = code_gen(ncpsDepartement.value);
        await insertStore.insert(ncpsEmetteur.value, ncpsDescription.value, ncpsDepartement.value, today.value);
      
      emit('added-successfully');
      } catch (error) {
        console.error("Erreur lors de l'ajout:", error);
      }

      isIconVisible.value = true;

      setTimeout(() => {
        emit('close');
      }, 800);
    };

    

    onMounted(async () => {
      await emetteurStore.fetchEmetteur();
      await EnumStore.fetchListEnum();
      //departement 
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
    });

    const quit = () => {
      emit('close');
    };  

    return {
      code_gen,
      DepartList2,
      DepartList,
      EnumStore,
      quit,
      alertMessage,
      alert_col,
      showalert,
      isIconVisible,
      isFieldMissing, 
      today,
      ncpsEmetteur,
      ncpsDepartement,
      ncpsDescription,
      emetteurStore,
      toggleButton,
      insertStore
    };
  },
});
</script>
