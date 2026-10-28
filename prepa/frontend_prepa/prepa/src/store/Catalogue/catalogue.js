import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useCatalStore = defineStore("catalogue", {
  state: () => ({
    catalogues: [],
    codeLabos: [],
    listCodeBarres: [],
    testCatals: 0,
    loading: false,
    params: {
      clientcode: null,
      moiscode: null,
      anneecode: null,
      tarifcode: null,
      distribue: 0,
    },
  }),
  actions: {
    async fetchCatalogue(
      clientcode,
      moiscode,
      anneecode,
      tarifcode,
      distribue,
    ) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      try {
        const response = await axios.get(Config.SERVER_URL + "api/catalogue", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            clientcode,
            moiscode,
            anneecode,
            tarifcode,
            distribue,
          },
        });
        if (Array.isArray(response.data)) {
          this.catalogues = response.data;
        } else {
          this.catalogues = [];
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchTestCatalogue(moiscode, anneecode) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/testCatalogue",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              moiscode,
              anneecode,
            },
          },
        );

        this.testCatals = response.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async GenereCatalogue(moiscode, anneecode) {
      try {
        this.loading = true;
        const sessionId = localStorage.getItem("sessionId");
        const response = await axios.post(
          Config.SERVER_URL + "api/genereCatalogue",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              moiscode,
              anneecode,
            },
          },
        );
        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchLabosCode() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listLaboCode",
          {
            headers: {
              Authorization: sessionId,
            },
            // params: {
            //   clientcode,
            //   moiscode,
            //   anneecode,
            //   tarifcode,
            //   distribue,
            // }
          },
        );
        if (Array.isArray(response.data)) {
          this.codeLabos = response.data;
        } else {
          this.codeLabos = [];
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchListCodeBarre() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listCodeBarre",
          {
            headers: {
              Authorization: sessionId,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.listCodeBarres = response.data;
        } else {
          this.listCodeBarres = [];
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // async insertCodeBarre(labo, article) {
    //   const sessionId = localStorage.getItem("sessionId");
    //   this.loading = true;
    //   const { handleLogout } = useLogout();
    //   try {
    //       const response = await axios.post(
    //         Config.SERVER_URL + "api/insertCodeBarre",
    //         {}, // body vide
    //         {
    //           headers: { Authorization: sessionId },
    //           params: {
    //             labo,
    //             article
    //           },
    //         },
    //       );
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

    async insertCodeBarre(labo, article) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;

      const { handleLogout } = useLogout();

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/insertCodeBarre",
          {}, // body vide
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              labo: labo,
              article: article,
            },
          },
        );

        return response.data;
      } catch (error) {
        alert(`Error: ${error.message}
Method: ${error.config?.method?.toUpperCase?.()}
URL: ${error.config?.url}`);

        console.log(error);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },
  },
});
