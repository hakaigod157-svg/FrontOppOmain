<template>
  <v-card>
    <v-app>
      <!-- Barre d’en-tête -->
      <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
        <!-- Onglets -->
        <v-card density="compact">
          <Tabs />
        </v-card>

        <v-spacer></v-spacer>

        <!-- Infos utilisateur -->
        <div>
          <u>Login</u> :
          <b
            ><span style="color: #388e3c">{{ user }}</span></b
          >
        </div>
        &nbsp;&nbsp;

        <!-- Indicateur online/offline -->
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
import { defineComponent, ref, onMounted } from "vue";
import Tabs from "@/components/rh/tabs.vue";
import { useRoute, useRouter } from "vue-router";
import Config from "@/utils/config.js";
import useSessionTimeout from "@/utils/useSessionTimeout";

export default defineComponent({
  components: { Tabs },
  setup() {
    const user = localStorage.getItem("username") || "Invité";
    const isOnline = ref(navigator.onLine);

    // Gérer les changements online/offline
    onMounted(async () => {
      window.addEventListener("online", () => (isOnline.value = true));
      window.addEventListener("offline", () => (isOnline.value = false));
    });

    const onHome = () => {
      window.location.hash = "#/AccueilPage"; // comme tu es en hash history
    };

    const router = useRouter();
    useSessionTimeout(Config.DURRE_SESSION, router);

    return {
      user,
      isOnline,
      onHome,
    };
  },
});
</script>

<style>
/* Effet de flou si besoin */
.blur-effect {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
}

.active-border {
  border: 2px solid #f48fb1 !important;
  border-radius: 4px;
}

/* ✅ Améliorer la lisibilité du tableau */
.v-data-table tbody td {
  font-size: 0.89rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px 12px;
}
</style>
