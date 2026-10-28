import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";
export const useMidacStore = defineStore("midac", {
  state: () => ({
    loading: false,
    isImport: false,
    params: {
      date: null,
      mois: null,
    },
    listMidacs:[],
    listLastImports:[],
  }),
  actions: {
    async importMidac(listeCmd) {
      this.loading = true;
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      try {
        // Send the sessionId in the headers correctly
        const response = await axios.post(
          Config.SERVER_URL + "api/import_midac",
          listeCmd,
          {
            headers: {
              Authorization: sessionId, // Correctly add the session ID in the headers
            },
          }
        );
        this.data = response.data;
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

    async isImportMois(date, mois) {
      this.loading = true;
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/isImportMois",
          {
            headers: {
              Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
            },
            params: {
              date,
              mois,
            },
          }
        );
        this.isImport = response.data;
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


    // async fetchListMidac() {
    //   const sessionId = localStorage.getItem("sessionId");
    //   this.loading = true;
    //   const { handleLogout } = useLogout();
    //   try {
    //     const response = await axios.get(
    //       Config.SERVER_URL + "api/list_midac",
    //       {
    //         headers: {
    //           Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
    //         },
    //         // params: {
    //         //   titulaire,
    //         // },
    //       }
    //     );
    //     if (Array.isArray(response.data)) {
    //       this.listMidacs = response.data;
    //     } else {
    //       this.listMidacs = [];
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


        async fetchListMidac() {
          const sessionId = localStorage.getItem("sessionId");
          this.loading = true;
          const { handleLogout } = useLogout();
          try {
            const response = await axios.get(
              Config.SERVER_URL + "api/list_midac",
              {
                headers: {
                  Authorization: sessionId,
                },
                // params: {
                //   dossier,
                // },
              }
            );
            const data = response.data;
            if (Array.isArray(data) && data.length === 2) {
              this.listMidacs = data[0];
              this.listLastImports = data[1];
            } else {
              console.error(
                "Unexpected data structure in fetchPerf response:",
                data
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



        async updateMidac(code_pro,codeArticle) {
          const { handleLogout } = useLogout();
          const sessionId = localStorage.getItem("sessionId");
          try {
            this.loading = true; // Set loading indicator to true
            const response = await axios.post(
              Config.SERVER_URL + "api/updateMidacFar",
              null,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: sessionId,
                },
                params: {
                  code_pro,
                  codeArticle,
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
    },
});

