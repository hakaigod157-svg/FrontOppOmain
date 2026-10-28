import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const uselistFabricant = defineStore("listfabricant", {
  state: () => ({
    listfabricants: [],
    loading: false,
    listnumfbs: [],

    params: {
      libelle: null,
    },
  }),
  actions: {
    async fetchListFabricant(libelle) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listFabricant",
          {
            headers: {
              Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
            },
            params: {
              libelle,
            },
          }
        );
        if (Array.isArray(response.data)) {
          this.listfabricants = response.data;
        } else {
          this.listfabricants = [];
        }

        this.loading = false;
      } catch (error) {
        alert(error);
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async updateLibelleFabricant(libelle_update, code_update) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updateFabricant",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              libelle_update,
              code_update,
            },
          }
        );
        this.data = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
                              Method: ${error.config?.method.toUpperCase()}
                              URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false; // Set loading indicator back to false
      }
    },

    async insertFabricant(codeFab, libelleFab) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/insert_fabricant",
          {},
          {
            headers: {
              Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
            },
            params: {
              codeFab,
              libelleFab,
            },
          }
        );
        this.loading = false;
      } catch (error) {
        // alert(error)
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchNumFB(dossier,etat) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listNumFB",
          {
            headers: {
              Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
            },
            params: {
              dossier,
              etat,
            },
          }
        );
        if (Array.isArray(response.data)) {
          this.listnumfbs = response.data;
        } else {
          this.listnumfbs = [];
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
