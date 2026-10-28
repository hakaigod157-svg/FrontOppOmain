import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useCommandeStore = defineStore("commandes", {
  state: () => ({
    commandes: [],
    PP: "",
    loading: false,
    params: {
      groupe: "",
      dateliv: null,
    },
  }),
  actions: {
    async fetchCommande() {
      this.loading = true;
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        const response = await axios.get(Config.SERVER_URL + "api/prep", {
          headers: {
            Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: this.params,
        });
        if (Array.isArray(response.data)) {
          this.commandes = response.data;
        } else {
          this.commandes = [];
        }
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        alert(`
          Error: ${message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}
          `);
      } finally {
        this.loading = false;
      }
    },

    async fetchPP() {
      this.loading = true;
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.get(Config.SERVER_URL + "api/check_PP", {
          headers: {
            Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
          },
        });

        if (typeof response.data === "number") {
          this.PP = response.data;
        } else {
          this.PP = 0; // Si le retour n'est pas un nombre, on initialise PP à 0
        }
        // console.log('PP value:', this.PP);
      } finally {
        this.loading = false;
      }
    },
  },
});
