import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const uselistAmmEtat = defineStore("listammetat", {
  state: () => ({
    listammetats: [],

    loading: false,

    params: {
      dossier: "",
    },
  }),

  actions: {
    async fetchListAmmEtat() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listAmmEtat",
          {
            headers: {
              Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
            },
            // params: {
            //   libelle,
            // },
          }
        );
        if (Array.isArray(response.data)) {
          this.listammetats = response.data;
        } else {
          this.listammetats = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

  },
});
