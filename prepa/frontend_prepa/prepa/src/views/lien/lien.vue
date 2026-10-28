<template>
    <v-app>
        <!-- AppBar -->
        <v-app-bar color="#d7ead5" app dense>
            <v-spacer></v-spacer>
            <div>
                <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{ ip_server
                        }}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;
                <u>Login</u> : <b><span style="color: #388E3C;">{{ user }}</span></b>
            </div>
            <div class="ml-3">
                <span
                    :style="{ backgroundColor: isOnline ? 'green' : 'red', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }" />
            </div>
            <v-btn @click="onHome">
                <v-img :width="20" :src="require('@/assets/home.png')"></v-img>
            </v-btn>
        </v-app-bar>

        <!-- Main Content -->
        <v-main class="pt-15">
            <v-container fluid class="py-4">
                <div class="horizontal-scroll">
                    <!-- Bloc Application Web avec 2 colonnes -->
                    <div class="scroll-card">
                        <v-card class="glass-card pa-4" elevation="6">
                            <v-card-title class="text-h6 green--text font-weight-bold mb-3">
                                <v-icon color="green" class="mr-2">mdi-web</v-icon>
                                <u>Liens Application Web</u>
                            </v-card-title>
                            <v-row dense>
                                <v-col cols="12" sm="6" v-for="(link, i) in sections[0].links" :key="i">

                                    <!-- POUR les sections[0] (Liens Application Web) -->
                                    <v-list-item @click="handleLinkClick(link)" class="list-link"
                                        style="cursor: pointer;">
                                        <v-list-item-icon>
                                            <v-icon color="blue">mdi-open-in-new</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title class="text-body-2 font-weight-medium">
                                                {{ link.label }}
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-col>
                            </v-row>
                        </v-card>
                    </div>

                    <!-- Autres blocs -->
                    <div class="scroll-card" v-for="(section, idx) in sections.slice(1)" :key="idx">
                        <v-card class="glass-card pa-4" elevation="6">
                            <v-card-title class="text-h6 green--text font-weight-bold mb-3">
                                <v-icon color="green" class="mr-2">mdi-link-variant</v-icon>
                                <u>{{ section.title }}</u>
                            </v-card-title>
                            <v-list dense nav>

                                <v-list-item v-for="(link, i) in section.links" :key="i" @click="handleLinkClick(link)"
                                    class="list-link" style="cursor: pointer;">
                                    <v-list-item-icon>
                                        <v-icon color="blue">mdi-open-in-new</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title class="text-body-2 font-weight-medium">
                                            {{ link.label }}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </div>
                </div>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import { useOnline } from "@vueuse/core";
import { useRouter } from "vue-router";

export default {
    setup() {
        const router = useRouter();
        const isOnline = useOnline();
        const user = localStorage.getItem("username") || "Inconnu";

        const onHome = () => router.push("/AccueilPage");
        const ip_server = ref('');

        const handleLinkClick = (link) => {
            // Si le lien contient "objectif", on vide les données spécifiques
            if (link.url.includes("objectif")) {
                localStorage.removeItem('lastVisitedPage');
                // localStorage.clear()
                // ou localStorage.clear() si tu veux tout effacer
                // ATTENTION : ça effacera aussi "username"
            }

            // Ouvrir le lien dans un nouvel onglet
            window.open(link.url, "_blank");
        };

        const sections = [
            {
                title: "Liens Application Web",
                links: [
                    { label: "Suivi CC2", url: "http://192.168.130.6/SuiviCC/SuiviCC2/" },
                    { label: "Tableau CTRL", url: "http://192.168.130.6/TABLEAUCTRL/TABLEAUCTRL/" },
                    { label: "Suivi retard cmd", url: "http://192.168.130.6/SuiviCde/" },
                    { label: "Charge magasin", url: "http://192.168.130.6/charge_magasin/" },
                    { label: "Suivi Rayon", url: "http://192.168.130.6/SuiviCC/SuiviCC/index2.html" },
                    { label: "Etat Commande", url: "http://192.168.130.6/EtatCommandes/" },
                    { label: "Annuaire", url: "http://192.168.130.6/annuaire/" },
                    { label: "Réservation véhicule", url: "http://192.168.130.6/ReservationVehicule/" },
                    { label: "Performance Fact", url: "http://192.168.130.6/factStat/" },
                    { label: "Performance Com", url: "http://192.168.130.6/comStat/" },
                    { label: "Email OPHAM", url: "http://192.168.130.6/mailOpham/" },
                    { label: "Téléphonica", url: "http://192.168.130.6/telephonica/" },
                    { label: "Perf Expédition", url: "http://192.168.130.6/expedStat/" },
                ],
            },
            {
                title: "Inventaire",
                links: [{ label: "Saisie Inventaire", url: "http://192.168.130.6/inventaire/" }],
            },
            {
                title: "Objectif DM",
                links: [
                    { label: "Objectif DM", url: "http://192.168.130.6/objectif/" },
                    { label: "Palier", url: "http://192.168.130.6/BiStat" },

                ],
            },
            {
                title: "Informatique",
                links: [
                    { label: "Infolog", url: "http://192.168.130.6/infolog/" },
                    { label: "Git", url: "http://192.168.130.6/git" },
                    { label: "Redmine", url: "http://192.168.130.6/redmine/" },

                ],
            },
            {
                title: "Site Web OPHAM",
                links: [{ label: "Site web opham", url: "https://www.opham.com" }],
            },
        ];


        onMounted(async () => {
            const name_server = localStorage.getItem('name_server');
            if (name_server === 'SIMUL221') {
                ip_server.value = '192.168.130.221';
            } else if (name_server === 'SIMUL220') {
                ip_server.value = '192.168.130.220';
            }
            else if (name_server === 'OPHAM') {
                ip_server.value = '192.168.130.2';
            } else {
                ip_server.value = name_server || 'Inconnu';
            }
        })

        return {
            isOnline,
            user,
            onHome,
            sections,
            handleLinkClick,ip_server,
        };
    },
};
</script>

<style scoped>
.glass-card {
    backdrop-filter: blur(8px);
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.glass-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

.list-link {
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.list-link:hover {
    background-color: #e3f2fd;
}

.v-card-title {
    display: flex;
    align-items: center;
    padding-bottom: 4px;
}

.horizontal-scroll {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 16px;
    padding-bottom: 8px;
}

.scroll-card {
    flex: 0 0 auto;
    width: 320px;
    min-width: 300px;
}
</style>
