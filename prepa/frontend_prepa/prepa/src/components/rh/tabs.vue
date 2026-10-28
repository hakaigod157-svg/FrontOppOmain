<template>
  <v-card density="compact">
    <v-tabs
      v-model="tabs"
      bg-color="#d7ead5"
      color="deep-purple-accent-4"
      align-tabs="left"
      density="compact"
    >
      <v-tab :to="{ name: 'rh-demande' }">DEMANDE</v-tab>
      <v-tab :to="{ name: 'rh-recrutement' }">RECRUTEMENT</v-tab>
      <v-tab :to="{ name: 'rh-cv' }">CV</v-tab>
      <v-tab :to="{ name: 'rh-integration' }">INTEGRATION</v-tab>
      <v-tab :to="{ name: 'rh-employee' }">EMPLOYEE</v-tab>
      <v-tab :to="{ name: 'rh-params' }">PARAMÈTRAGE OUTIL</v-tab>
    </v-tabs>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
const tabs = ref(null);






</script>
