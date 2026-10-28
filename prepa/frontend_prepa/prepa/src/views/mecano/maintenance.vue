<template>
  <v-card>
    <v-app>
      <!-- Barre d'en-tête — même style que RH / AMM -->
      <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
        <v-card density="compact">
          <v-tabs
            v-model="tabs"
            
            bg-color="#d7ead5"
            color="deep-purple-accent-4"
            align-tabs="left"
            density="compact"
            
          >
            <v-tab :to="{ name: 'maintenance-demande' }">DEMANDES</v-tab>
            <v-tab :to="{ name: 'maintenance-liste' }">MAINTENANCE</v-tab>
            <!-- <v-tab :to="{ name: 'maintenance-calendar' }">CALENDRIER</v-tab> -->
          </v-tabs>
        </v-card>

        <v-spacer></v-spacer>

        <div>
          <u>Login</u> :&nbsp;<b><span style="color: #388e3c margin='20px'">{{ user }}</span></b>
        </div>
        &nbsp;&nbsp;

        <div>
          <span
            :style="{
              backgroundColor: isOnline ? 'green' : 'red',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              display: 'inline-block',
              
            }"
          ></span>
        </div>

        <!-- Bouton Home -->
        <div>
          <v-btn @click="onHome">
            <v-img :width="20" :src="require('@/assets/home.png')"></v-img>
          </v-btn>
        </div>
      </v-app-bar>

      <!-- Contenu principal -->
      <v-main>
        <v-container fluid class="pa-4">
          <router-view />
        </v-container>
      </v-main>
    </v-app>
  </v-card>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Config from "@/utils/config.js";
import useSessionTimeout from "@/utils/useSessionTimeout";

export default defineComponent({
  setup() {
    const user = localStorage.getItem("username") || "Invité";
    const isOnline = ref(navigator.onLine);
    const tabs = ref(null);

    const setOnline = () => (isOnline.value = true);
    const setOffline = () => (isOnline.value = false);

    onMounted(() => {
      window.addEventListener("online", setOnline);
      window.addEventListener("offline", setOffline);
    });

    onUnmounted(() => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    });

    const onHome = () => {
      window.location.hash = "#/AccueilPage";
    };

    const router = useRouter();
    useSessionTimeout(Config.DURRE_SESSION, router);

    return { user, isOnline, onHome, tabs };
  },
});
</script>

<style>
/* Effet de flou si besoin */
.blur-effect {
  filter: blur(25px);
  pointer-events: none;
  user-select: none;
}
u{
  font-family: Helvetica;
  font-display: auto;
}


.v-data-table tbody td {
  font-size: 0.89rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px 12px;
}
</style>