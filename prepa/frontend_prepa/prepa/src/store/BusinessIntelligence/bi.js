import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";



export const useBusinessStore = defineStore("business", {
  state: () => ({
    loading: false,
    listViews: [],
    listTaux: [],
    list_ca_annuels: [],
    list_paliers: [],
    list_paliers_seconds: [],
    list_paliers_thirds: [],
    det_list_paliers: [],
    det_list_palier_seconds: [],
    det_list_palier_thirds: [],

  }),

  actions: {
    async fetchListView() {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;

      try {
        const response = await axios.get(Config.SERVER_URL + "api/list_view", {
          headers: { Authorization: sessionId },
        });

        this.listViews = response.data || [];
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async fetchListTaux() {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;

      try {
        const response = await axios.get(Config.SERVER_URL + "api/list_taux", {
          headers: { Authorization: sessionId },
        });

        this.listTaux = response.data || [];
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async fetchListCa(codeArticle) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;

      try {
        const response = await axios.get(Config.SERVER_URL + "api/list_ca_annuel", {
          headers: { Authorization: sessionId },
          params: { codeArticle },
        });

        this.list_ca_annuels = response.data || [];
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },



 /*   async fetchListPalier(taux) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;

      try {
        const response = await axios.get(Config.SERVER_URL + "api/list_palier", {
          headers: { Authorization: sessionId },
          params: { taux },
        });

        this.list_paliers = response.data || [];
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    }, */




    async fetchListPalier(taux,primeMax) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/list_palier", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            taux,
            primeMax,
          },
        });
        const data = response.data;
        if (Array.isArray(data) && data.length === 6) {
          this.list_paliers = data[0];
          this.list_paliers_seconds = data[1];
          this.list_paliers_thirds = data[2];
          this.det_list_paliers = data[3];
          this.det_list_palier_seconds = data[4];
          this.det_list_palier_thirds = data[5];
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

  },
});

// export const useBusinessStore = defineStore("business", {
//   state: () => ({
//     loading: false,
//     listViews: [],
//     list_ca_annuels :[],
//   }),

//     async fetchListView() {
//       const sessionId = localStorage.getItem("sessionId");
//       const { handleLogout } = useLogout();
//       this.loading = true;
//       try {
//         const response = await axios.get(Config.SERVER_URL + "api/list_view", {
//           headers: {
//             Authorization: sessionId,
//           },
//         //   params: {

//         //   },
//         });
//         if (response.data.length > 0) {
//           this.listViews = response.data;
//         } else {
//           this.listViews = [];
//         }
//       } catch (error) {
//         alert(`Error: ${error.message}
//         Method: ${error.config?.method?.toUpperCase?.()}
//         URL: ${error.config?.url}`);
//         await handleLogout();
//         console.log(error);
//       } finally {
//         this.loading = false;
//       }
//     },

//     async fetchListCa(codeArticle) {
//       const sessionId = localStorage.getItem("sessionId");
//       const { handleLogout } = useLogout();
//       this.loading = true;
//       try {
//         const response = await axios.get(Config.SERVER_URL + "api/list_ca_annuel", {
//           headers: {
//             Authorization: sessionId,
//           },
//           params: {
//             codeArticle
//           },
//         });
//         if (response.data.length > 0) {
//           this.list_ca_annuels = response.data;
//         } else {
//           this.list_ca_annuels = [];
//         }
//       } catch (error) {
//         alert(`Error: ${error.message}
//         Method: ${error.config?.method?.toUpperCase?.()}
//         URL: ${error.config?.url}`);
//         await handleLogout();
//         console.log(error);
//       } finally {
//         this.loading = false;
//       }
//     },

// })