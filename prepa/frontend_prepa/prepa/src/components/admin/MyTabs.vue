<template >
    <v-card density="compact">
      <v-tabs bg-color="#d7ead5" color="deep-purple-accent-4" align-tabs="center" density="compact">
        <v-tab v-if="showAcces" to="/GestionAcces">Gestion d'Accès</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <router-view />
    </v-card>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { defineComponent } from "vue";
  
  export default defineComponent({
  
    components: {
  
    },
  
    methods: {
    },
  
    setup() {
      const showAcces= ref(false);
  
  
  
  
      const fetchdroits = (nameTable) => {
        const lstDroit = localStorage.getItem('listeDroits');
        if (lstDroit) {
          const droits = JSON.parse(lstDroit);
          const element = droits.find((item) => item.descAcces === nameTable);
          if (element) {
            return element.write === 1 ? true : false;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
  
      onMounted(() => {
  
        showAcces.value = fetchdroits('GestionAcces');
 
      
  
  
  
      });
  
      return {
         fetchdroits,
         showAcces,
      };
    }
  
  
  })
  </script>