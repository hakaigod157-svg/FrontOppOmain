<script>
import { defineComponent, ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import Config from "@/utils/config.js";
import useSessionTimeout from "@/utils/useSessionTimeout";
import TableauDeBord from "@/components/mecano/TableauDeBord/TableauDeBord.vue";
import { maintStore } from "@/store/Maintenance/maintenance_store";
import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";
import BoutonOutline from "@/components/mecano/UI/BoutonOutline.vue";

export default defineComponent({
  components: { TableauDeBord, BoutonOutline },
  setup() {
    const user = localStorage.getItem("username") || "Invité";
    const isOnline = ref(navigator.onLine);
    const tabs = ref(null);
    const showDashboard = ref(false);
    const refreshKey = ref(0);

    const setOnline = () => (isOnline.value = true);
    const setOffline = () => (isOnline.value = false);

    const store = maintStore();
    const demandeStore = useDemandeMaintenance();

    const isMaintenanceCompleted = (demande) => {
      const etat = Number(demande?.demande_ETAT);
      if (etat === 99) return true;

      const statut = String(demande?.statut ?? demande?.STATUT ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();

      return ["TERMIN", "CLOTUR", "FINI", "ACHEV", "COMPLET"].some((mot) =>
        statut.includes(mot)
      );
    };

    const dashboardStats = computed(() => {
      const demandes = demandeStore.demandes || [];
      const pendingItems = demandes.filter((d) => Number(d.demande_ETAT) === 1);
      const completedItems = demandes.filter(isMaintenanceCompleted);
      const inProgressItems = demandes
        .filter((d) => Number(d.demande_ETAT) === 2)
        .map((demand) => {
          const maintenance = store.maintnces.find((item) =>String(item.maint_DEMANDE ?? "") === String(demand.demande_CODE ?? "")
          );
          return {
            ...demand,
            maintenanceCode: maintenance?.maint_CODE ?? "",
            maintenanceClassification:
              maintenance?.maint_CLASSIFICATION  ?? "",
          };
        });

      return {
        overdue: 0,
        completed: completedItems.length,
        inProgress: inProgressItems.length,
        pending: pendingItems.length,
        inProgressItems,
        pendingItems,
        newRequests: 0,
      };
    });

    const openDashboard = async () => {
      await Promise.all([demandeStore.fetchDemandes(), store.getMaintenances()]);
      showDashboard.value = true;
    };

    const refreshCurrentView = () => {
      showDashboard.value = false;
      refreshKey.value += 1;
    };

    onMounted(() => {
      window.addEventListener("online", setOnline);
      window.addEventListener("offline", setOffline);
    });

    onUnmounted(() => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    });

    const router = useRouter();

    const onHome = () => {
      window.location.hash = "#/AccueilPage";
    };

    const onDashboardHome = () => {
      refreshCurrentView();
    };

    const onDashboardNewRequest = () => {
      showDashboard.value = false;
      router.push({ name: "maintenance-demande", query: { nouvelle: "1" } });
    };

    const onDashboardItem = (item, kind) => {
      showDashboard.value = false;
      if (kind === "maintenance" && item.maintenanceCode) {
        router.push({
          name: "maintenance-liste",
          query: { highlightMaint: String(item.maintenanceCode) },
        });
        return;
      }

      router.push({
        name: "maintenance-demande",
        query: { highlightDemand: String(item.demande_CODE ?? "") },
      });
    };

    const onDashboardOpenMaintenance = (code) => {
      showDashboard.value = false;
      router.push({
        name: "maintenance-liste",
        query: { highlightMaint: String(code), openMaint: String(code) },
      });
    };

    useSessionTimeout(Config.DURRE_SESSION, router);

    return {
      user,
      isOnline,
      onHome,
      tabs,
      showDashboard,
      refreshKey,
      openDashboard,
      refreshCurrentView,
      dashboardStats,
      onDashboardHome,
      onDashboardNewRequest,
      onDashboardItem,
      onDashboardOpenMaintenance,
    };
  },
});
</script>


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
            <v-tab :to="{ name: 'maintenance-cars-file' }">VOITURES</v-tab>
            <v-tab :to="{ name: 'maintenance-demande' }">DEMANDES</v-tab>
            <v-tab :to="{ name: 'maintenance-liste' }">MAINTENANCE</v-tab>
            <v-tab :to="{ name: 'maintenance-calendar' }">CALENDRIER</v-tab>
            <v-tab :to="{ name: 'maintenance-reparation' }">REPARATION</v-tab>
          </v-tabs>
        </v-card>

        <v-spacer></v-spacer>

        <!-- Bouton Dashboard OMAIN -->
        <BoutonOutline class="mr-2" label="OMAIN" icon="mdi-view-dashboard-outline" @click="openDashboard" />

        <div>
          <u>Login</u> :&nbsp;<b><span style="color: #388e3c">{{ user }}</span></b>
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

        <div>
          <v-btn @click="onHome">
            <v-img :width="20" :src="require('@/assets/home.png')"></v-img>
          </v-btn>
        </div>
      </v-app-bar>

      <v-main>
        <v-container fluid class="pa-4">
          <router-view :key="refreshKey" />
        </v-container>
      </v-main>

      <Teleport to="body">
        <Transition name="dashboard-fade">
          <TableauDeBord
            v-if="showDashboard"
            :stats="dashboardStats"
            :user="user"
            @close="refreshCurrentView"
            @login="refreshCurrentView"
            @back-home="refreshCurrentView"
            @new-request="onDashboardNewRequest"
            @open-item="onDashboardItem"
            @open-maintenance="onDashboardOpenMaintenance"
          />
        </Transition>
      </Teleport>
    </v-app>
  </v-card>
</template>



<style>
/* Effet de flou si besoin */
.blur-effect {
  filter: blur(25px);
  pointer-events: none;
  user-select: none;
}
u {
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

/* Transition du dashboard overlay */
.dashboard-fade-enter-active {
  transition: opacity 0.25s ease-out;
}
.dashboard-fade-leave-active {
  transition: opacity 0.2s ease-in;
}
.dashboard-fade-enter-from,
.dashboard-fade-leave-to {
  opacity: 0;
}
</style>
