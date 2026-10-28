import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useLivraisonStore = defineStore("livraison", {
  state: () => ({
    loading: false,
    params: {
      dateDeb: null,
      dateFin: null,
      livraison: null,
      commande: null,
      date: null,
      chauf: null,
      voit: null,
      saisie: null,
    },
    list_livraisons: [],
    date_todays: [],
    date_demains: [],
    list_livraisons_demain: [],
    details: [],
    details_demain: [],
    list_Indlivraisons: [],
    list_Indlivraison_details: [],
    list_IndChauffeurs: [],
    list_IndObjs: [],
    isLivs: false,
    isAtteLivs: false,
    HeadersChauf: [],
    resultData: [],
  }),

  actions: {
    // async fetchListLivraison(modeLiv) {
    //   const sessionId = localStorage.getItem("sessionId");
    //   this.loading = true;
    //   const { handleLogout } = useLogout();
    //   try {
    //     const response = await axios.get(Config.SERVER_URL + "api/livraison", {
    //       headers: {
    //         Authorization: sessionId,
    //       },
    //       params: {
    //         modeLiv,
    //       },
    //     });
    //     const data = response.data;
    //     if (Array.isArray(data) && data.length === 2) {
    //       this.list_livraisons = data[0];
    //       this.details = data[1];
    //     } else {
    //       console.error(
    //         "Unexpected data structure in fetchPerf response:",
    //         data,
    //       );
    //     }

    //     this.loading = false;
    //   } catch (error) {
    //     alert(`Error: ${error.message}
    //       Method: ${error.config?.method.toUpperCase()}
    //       URL: ${error.config?.url}`);
    //     await handleLogout();
    //     console.log(error);
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async fetchListLivraison(modeLiv) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(Config.SERVER_URL + "api/livraison", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            modeLiv,
          },
        });

        const data = response.data;

        if (Array.isArray(data)) {
          // Toujours sécuriser chaque index
          this.list_livraisons = data[0] || [];
          this.details = data[1] || [];
          this.date_todays = data[2] || [];
          this.list_livraisons_demain = data[3] || [];
          this.details_demain = data[4] || [];
          this.date_demains = data[5] || [];
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

    async fetchListIndLivraison(date_deb, date_fin, modeLiv) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/ind_livraison",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              date_deb,
              date_fin,
              modeLiv,
            },
          },
        );
        const data = response.data;
        if (Array.isArray(data) && data.length === 3) {
          this.list_Indlivraisons = data[0];
          this.list_Indlivraison_details = data[1];
          this.list_IndObjs = data[2];
          // this.details = data[1];
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

    async fetchListIndChauffeur() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/ind_chauffeur",
          {
            headers: {
              Authorization: sessionId,
            },
            /*  params: {
            date_deb,
            date_fin,
            modeLiv,
          }, */
          },
        );
        const data = response.data;
        if (Array.isArray(data) && data.length === 1) {
          this.list_IndChauffeurs = data[0];
          // this.details = data[1];
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

    async onIndicatChauf() {
      const sessionId = localStorage.getItem("sessionId");
      this.loadingT = true;

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/onIndicatChauf",
          {
            headers: {
              Authorization: sessionId,
            },
          },
        );

        const data = response.data;

        if (data && data.columnNames && data.dataResult) {
          this.HeadersChauf = data.columnNames;
          this.resultData = data.dataResult;
        } else {
          console.error(
            "Unexpected data structure in onIndicatChauf response:",
            data,
          );
          this.HeadersChauf = [];
          this.resultData = [];
        }
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        alert(`
  Error: ${message}
  Method: ${error.config?.method?.toUpperCase()}
  URL: ${error.config?.url}
      `);

        console.log(error);
      } finally {
        this.loadingT = false;
      }
    },
  },
});
//export const piniaPlugin = createPiniaPlugin()
