<!-- eslint-disable vue/no-dupe-keys -->
<template>
    <div id="alert">
      <div id="alert_div">
        <div class="p">
          <v-icon class="icon">{{ iconName }}</v-icon>
          <p>{{ alert_text }}</p> 
        </div>
        <div class="but" :class="butClass">
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent,onMounted,computed } from 'vue'; 
  
  export default defineComponent({
    props: {
      alert_text: String, 
      alert_color: String,
    },
    setup(props, { emit }) {
      const butClass = computed(() => {
        if (props.alert_color === 'alert') {
          return 'but-red';
        } else if (props.alert_color === 'succes') {
          return 'but-green';
        } else {
          return 'but-default';
        }
      });
      const iconName = computed(() => {
      if (props.alert_color === 'alert') {
        return 'mdi-alert-circle-outline';
      } else if (props.alert_color === 'succes') {
        return 'mdi-check-circle-outline'; 
      } else {
        return 'mdi-information-outline'; 
      }
    });
      onMounted(async () => {
        setTimeout(() => {
            emit('close');
          }, 2000);
      });
      
      return {
        butClass,
        iconName,
      };
    },
  });
  </script>
<style lang="scss">
#alert{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: rgba(0, 0, 0, 0.178);
    z-index: 30;
    #alert_div{
        width: auto;
        height: auto;
        position: relative;
        top:5rem;
        background: white;
        border-radius: 5px;
        animation: alert 0.4s ease;
        .p{
            margin: 15px;
            margin-left: 20px;
            margin-right: 20px;
            width: 100%;
            margin-bottom: 10px;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            .icon{
              font-size: 26px;
              margin-right: 5px;
              color: rgb(96, 96, 0);
              position: relative;
              bottom: 1px;
            }
        }
        .but{
            width: 0;
            margin-top: 15px;
            height: 3px;
            animation: but 2s linear;          
        }
        .but-red {
          background-color: red;
        }

        .but-green {
          background-color: green;
        }

        .but-default {
          background-color: gray;
        }
        @keyframes but{
            from{
                width: 100%;
            }
            to{
                width: 0;
            }
        }
    }
    @keyframes alert {
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