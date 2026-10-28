<!-- eslint-disable vue/no-dupe-keys -->
<template>
    <div id="alert2">
      <div id="alert_div2">
        <div class="p">
          <!-- <v-icon class="icon">mdi-check-circle-outline</v-icon> -->
          <p>{{ text }}</p> 
        </div>
        <div class="button">
            <button @click="OK">OK</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent,onMounted,computed } from 'vue'; 
  
  export default defineComponent({
    props: {
        text: String, 
    },
    setup(props, { emit }) {
      
      const OK = () =>{
        emit('closeal2');
      };
      onMounted(async () => {
        
      });
      
      return {
        OK,
      };
    },
  });
  </script>
<style lang="scss">
#alert2{
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
    #alert_div2{
        width: auto;
        padding-left: 30px;
        padding-right: 30px;
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
        .button{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            button{
                width: 120px;
                font-weight: 600;
                font-size: 14px;
                height: 28px;
                border-radius: 20px;
                border: none;
                background: rgb(176, 0, 156);
                color: white;
                transition: all 0.3s;
            }
            button:hover{
              background: rgb(141, 0, 124);
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