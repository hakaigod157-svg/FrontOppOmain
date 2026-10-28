import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useEmployeeStore = defineStore("listemployes", {
  state: () => ({
    listemployes: [],
    listIntegrations: [],
  }),
  actions: {
    async fetchListEmployes(etat) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listEmploye",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              etat,
            },
          },
        );

        const data = response.data;

        if (Array.isArray(data)) {
          // Toujours sécuriser chaque index
          this.listemployes = data[0] || [];
        } else {
          console.error("Structure inattendue :", data);
        }
      } catch (error) {
        alert(`Error: ${error.message}
Method: ${error.config?.method?.toUpperCase()}
URL: ${error.config?.url}`);

        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async updateMatricule(matricule, code_recrutement, code_cv) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updateMatricule",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              matricule,
              code_recrutement,
              code_cv,
            },
          },
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

    async fetchListIntegration() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listIntegration",
          {
            headers: {
              Authorization: sessionId,
            },
            // params: {
            //   etat
            // },
          },
        );

        const data = response.data;

        if (Array.isArray(data)) {
          // Toujours sécuriser chaque index
          this.listIntegrations = data[0] || [];
        } else {
          console.error("Structure inattendue :", data);
        }
      } catch (error) {
        alert(`Error: ${error.message}
Method: ${error.config?.method?.toUpperCase()}
URL: ${error.config?.url}`);

        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async insertEmploye(employe) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      try {
        this.loading = true;

        const response = await axios.post(
          Config.SERVER_URL + "api/insertEmploye",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              empl_matricule: employe.empl_matricule,
              empl_nom: employe.empl_nom,
              empl_prenom: employe.empl_prenom,
              empl_date_naiss: employe.empl_date_naiss,
              empl_departement: employe.empl_departement,
              empl_poste: employe.empl_poste,
              empl_contrat: employe.empl_contrat,
              empl_prise_fonction: employe.empl_prise_fonction,
              empl_date_fin_essai1: employe.empl_date_fin_essai1,
              empl_date_fin_essai2: employe.empl_date_fin_essai2,
            },
          },
        );

        this.data = response.data;

        return response.data;
      } catch (error) {
        console.error("Erreur insertion employé :", error);

        alert(`Error: ${error.message}
            Method: ${error.config?.method?.toUpperCase()}
            URL: ${error.config?.url}`);

        await handleLogout();

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateEmploye(empl_code, employe) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      try {
        this.loading = true;

        const response = await axios.post(
          Config.SERVER_URL + "api/updateEmploye",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              empl_code: empl_code,

              empl_matricule: employe.empl_matricule,
              empl_nom: employe.empl_nom,
              empl_prenom: employe.empl_prenom,

              // Nom identique au @RequestParam du backend
              empl_date_naiss: employe.empl_date_naiss,
              empl_departement: employe.empl_departement,
              empl_poste: employe.empl_poste,

              empl_prise_fonction: employe.empl_prise_fonction,
              empl_contrat: employe.empl_contrat,

              // null si vide
              empl_date_fin_essai1: employe.empl_date_fin_essai1 || null,

              empl_date_fin_essai2: employe.empl_date_fin_essai2 || null,
            },
          },
        );

        this.data = response.data;
      } catch (error) {
        console.error("Erreur updateEmploye :", error);

        alert(`Error: ${error.message}
        Method: ${error.config?.method?.toUpperCase()}
        URL: ${error.config?.url}`);

        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async deleteEmploye(empl_matricule) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      try {
        this.loading = true;

        const response = await axios.post(
          Config.SERVER_URL + "api/deleteEmploye",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              empl_matricule: empl_matricule,
            },
          },
        );

        this.data = response.data;

        return response.data;
      } catch (error) {
        console.error("Erreur suppression employé :", error);

        alert(`Error: ${error.message}
        Method: ${error.config?.method?.toUpperCase()}
        URL: ${error.config?.url}`);

        await handleLogout();

        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
