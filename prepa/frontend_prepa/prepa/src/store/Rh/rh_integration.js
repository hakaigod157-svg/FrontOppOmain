import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useListIntegration = defineStore("listIntegration", {
  state: () => ({
    loading: false,
    listIntegration: [],
    listEtapesIntegr: [],
    listMatDispos: [],
    listFormations: [],

    // params: {
    //   dossier: "",
    // },
  }),

  actions: {
    async fetchListDetailInteg(codeInteg, matricule) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listDetailIntegr",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              codeInteg,
              matricule: matricule ?? "",
            },
          },
        );
        const data = response.data;
        if (Array.isArray(data) && data.length === 3) {
          this.listEtapesIntegr = data[0];
          this.listFormations = data[1];
          this.listMatDispos = data[2];
        } else {
          console.error(
            "Unexpected data structure in fetchPerf response:",
            data,
          );
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

    async updateDateEtape(ligne_etape_code,ligne_etape_etape,ligne_etape_date,) {
      const sessionId = localStorage.getItem("sessionId");

      const { handleLogout } = useLogout();

      this.loading = true;

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/updateDateEtape",
          null,
          {
            headers: {
              Authorization: sessionId,
            },

            params: {
              ligne_etape_code,
              ligne_etape_etape,
              ligne_etape_date,
            },
          },
        );

        return response.data;
      }catch (error) {
          console.error("Erreur updateDateEtape :", error);

          throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateDateMatDispo(mise_dispo_matr,mise_dispo_cat,mise_dispo_materiel,mise_dispo_date_effect) {
      const sessionId = localStorage.getItem("sessionId");

      const { handleLogout } = useLogout();

      this.loading = true;

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/updateDateEffect",
          null,
          {
            headers: {
              Authorization: sessionId,
            },

            params: {
              mise_dispo_matr,
              mise_dispo_cat,
              mise_dispo_materiel,
              mise_dispo_date_effect
            },
          },
        );

        return response.data;
      }catch (error) {
          console.error("Erreur updateDateEtape :", error);

          throw error;
      } finally {
        this.loading = false;
      }
    },



    async updateDateFormation(matricule,form_code,libelle_form,date_reel,) {
      const sessionId = localStorage.getItem("sessionId");

      const { handleLogout } = useLogout();

      this.loading = true;

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/updateDateFormation",
          null,
          {
            headers: {
              Authorization: sessionId,
            },

            params: {
              matricule,
              form_code,
              libelle_form,
              date_reel
            },
          },
        );

        return response.data;
      }catch (error) {
          console.error("Erreur updateDateEtape :", error);

          throw error;
      } finally {
        this.loading = false;
      }
    },





  },
});
