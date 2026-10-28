<template>
    <v-card density="compact">
        <v-tabs v-model="tabs" bg-color="#d7ead5" color="deep-purple-accent-4" align-tabs="center" density="compact">
            <v-tab to="/capa_view">Suivi Capa</v-tab>
            <v-tab to="/suivi_anomalie">Suivi Anomalie</v-tab>
            <!-- <v-tab>
                <a href="http://192.168.130.6/EtatCommandes/" target="_blank"
                    style="text-decoration: none; color: inherit;">
                    Anciens Etat Commande
                </a>
            </v-tab> -->
        </v-tabs>
        <v-spacer></v-spacer>
        <router-view />
    </v-card>
</template>

<style></style>

<script>
import { useEtapeStore } from "@/store/utils/etape.js"
import { ref, onMounted, onBeforeMount, computed, defineComponent } from 'vue';

export default defineComponent({
    props: {
        storeEtape: Object,
    },
    setup() {
        const storeEtape = useEtapeStore();
        onMounted(() => {
            fetchEtaps();

        })
        const fetchEtaps = async () => {
            await storeEtape.fetchEtape();
        }
        return {
            storeEtape, fetchEtaps, onMounted
        }
    }

});
</script>