<template >
    <v-card density="compact">
      <v-tabs v-model="tabs" bg-color="#d7ead5" color="deep-purple-accent-4" align-tabs="center" density="compact" >
        <v-tab to="/inventaire_view">Emplacement Désactiver</v-tab>
        <v-tab to="">Stock Opham</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <router-view />
    </v-card>
  </template>
    
  <style></style>
    
  <script>
  import { defineComponent } from 'vue';
  export default defineComponent({

      setup() {
        
      }
  
  });
  </script>