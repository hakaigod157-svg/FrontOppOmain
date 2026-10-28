<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div id="suppr">
        <div id="suppr_div">
            <div class="titre">
                <p>{{ text_sup }}</p>
            </div>
            <div class="button">
                <button @click="close">Non</button>
                <button class="oui" @click="supprimer" :class= "{'small-button': isIconVisible }" >
                    <span v-if="!isIconVisible">
                      Oui
                    </span>
                    <v-icon v-else>mdi-check</v-icon>
                </button>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
#suppr{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.135);
    display: flex;
    justify-content: center;
    z-index: 30;
    align-items: start;
    #suppr_div{
        width: 380px;
        border-radius: 7px;
        background: white;
        padding: 10px;
        user-select: none;
        animation: suppr 0.4s;
        position: relative;
        top: 5rem;
        .titre,.button{
            width: 100%;
            display: flex;
            justify-content: center;
            color: black;
            margin: 0;
        }
        .titre{
            padding: 10px;
            padding-bottom: 0;
            font-size: 14px;
        }
        .button{
            button{
                width: 80px;
                height: 25px;
                margin: 10px;
                margin-top: 15px;
                border: 1px solid rgba(0, 0, 0, 0.196);
                border-radius: 10px;
                font-size: 12px;
                transition: all 0.3s;
                &.small-button{
                    width: 25px;
                    border-radius: 50%;
                }
            }
            .oui{
                background: rgb(207, 0, 0);
                font-weight: 600;
                color: white;
                border: none;
                //border: 1px solid red;
                //color: red;
            }
            button:hover{
                scale: 1.1;
            }

        }
    }
    @keyframes suppr{
      0% {
            transform: translateY(-300px) rotate(10deg);

        }
        40% {
            transform: translateY(0px) ; 
        }
        80% {
            transform: translateY(20px); 
        }
        100% {
            transform: translateY(0) ; 
        }
    }
}
</style>

<script>
import { ref, computed, onMounted,onBeforeUnmount } from 'vue';

export default {
  props: {
    text_sup: String,
    cause: Object,
    action: Object,
    etat: Object,
  },
  setup(props, { emit }) {
    const isIconVisible = ref(false);

    onMounted(async () => {
      window.addEventListener('keydown', handleKeyPress);
    });

    const close = () => {
      emit('closesup');
    };

    const supprimer = async () => {
      if (props.etat === 'suuprcause') {
        emit('supprimerCause');
        console.log('supprimer cause');
      } else if (props.etat === 'suupraction') {
        emit('supprimerAction');
        console.log('supprimer action');
      }else if (props.etat === 'rejeter'){
        emit('rejeterCause');
        console.log('rejet cause');
      } else {
        console.error('Aucun objet reçu pour la suppression');
      }
        isIconVisible.value = true;
      
      setTimeout(() => {
        emit('closesup');
      }, 800);
      
    };
    const handleKeyPress = (event) => {
      event.preventDefault();
      if (event.key === 'Enter') {
        close();
      }
    };
    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeyPress);
    });

    
    onMounted(async () => {
      window.addEventListener('keydown', handleKeyPress);
    });

    return {
        close,
        supprimer,
        isIconVisible,
    };
  },
};
</script>