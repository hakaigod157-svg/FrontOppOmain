import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useParamStore = defineStore("listparams", {
  state: () => ({
    listparams: [],
    HeadersFormation: [],
    listparamsFormations: [],
  }),
  actions: {
    async fetchListParams(departement_code, poste_code) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(Config.SERVER_URL + "api/listParams", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            departement_code,
            poste_code,
          },
        });

        const data = response.data;

        if (Array.isArray(data)) {
          // Toujours sécuriser chaque index
          this.listparams = data[0] || [];
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

    async insertParams(insertList) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();

      this.loading = true;

      try {
        for (const item of insertList) {
          await axios.post(Config.SERVER_URL + "api/insert_Params", null, {
            headers: {
              Authorization: sessionId,
            },
            params: {
              dep: item.dep,
              code_poste: item.code_poste,
              categorie: item.categorie,
              materiel: item.materiel,
              champ: item.champ,
              valeur: item.valeur,
            },
          });

          console.log("INSERT =>", item);
        }
      } catch (error) {
        alert(`Error: ${error.message}
Method: ${error.config?.method?.toUpperCase()}
URL: ${error.config?.url}`);

        await handleLogout();
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteParams(deleteList) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();

      this.loading = true;

      try {
        for (const item of deleteList) {
          await axios.delete(Config.SERVER_URL + "api/deleteParams", {
            headers: {
              Authorization: sessionId,
            },
            params: {
              dep: item.dep,
              code_poste: item.code_poste,
              categorie: item.categorie,
              materiel: item.materiel,
              champ: item.champ,
              valeur: item.valeur,
            },
          });

          console.log("DELETE =>", item);
        }
      } catch (error) {
        alert(`Error: ${error.message}
Method: ${error.config?.method?.toUpperCase()}
URL: ${error.config?.url}`);

        await handleLogout();
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /*   async fetchListParamsFormation(departement_code, poste_code) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listParamsFormation",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              departement_code,
              poste_code,
            },
          },
        );

        const data = response.data;

        if (Array.isArray(data)) {
          // Toujours sécuriser chaque index
          this.listparamsFormations = data[0] || [];
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
    }, */

    async fetchListParamsFormation(departement_code, poste_code) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listParamsFormation",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              departement_code,
              poste_code,
            },
          },
        );

        const data = response.data;

        if (data && data.columnNames && data.dataResult) {
          this.HeadersFormation = data.columnNames;
          this.listparamsFormations = data.dataResult;
        } else {
          console.error(
            "Structure inattendue dans listParamsFormation :",
            data,
          );

          this.HeadersFormation = [];
          this.listparamsFormations = [];
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

    async insertParamsFormation(insertList) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();

      this.loading = true;

      try {
        for (const item of insertList) {
          await axios.post(
            Config.SERVER_URL + "api/insert_ParamsFormation",
            null,
            {
              headers: {
                Authorization: sessionId,
              },
              params: {
                form_code: item.champ,
                code_poste: item.code_poste,
                dep: item.dep,
                valeur: item.valeur,
              },
            },
          );

          // console.log("INSERT =>", item);
        }
      } catch (error) {
        alert(`Error: ${error.message}
Method: ${error.config?.method?.toUpperCase()}
URL: ${error.config?.url}`);

        await handleLogout();
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteParamsFormation(deleteList) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();

      this.loading = true;

      try {
        for (const item of deleteList) {
          await axios.delete(Config.SERVER_URL + "api/deleteParamsFormation", {
            headers: {
              Authorization: sessionId,
            },
            params: {
              form_code: item.champ,
              code_poste: item.code_poste,
              dep: item.dep,
              valeur: item.valeur,
            },
          });

          // console.log("DELETE =>", item);
        }
      } catch (error) {
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
