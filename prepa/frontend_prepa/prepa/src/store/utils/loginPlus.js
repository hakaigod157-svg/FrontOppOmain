import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";
export const useLoginPlusStore = defineStore("loginPlus", {
  state: () => ({
    listLoginPlus: [],
    loading: false,
    m_cc: null,
    code: null,
  }),
  actions: {
    async fetchLoginPlus(critere) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listLoginPlus",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              critere,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.listLoginPlus = response.data;
        } else {
          this.listLoginPlus = [];
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

        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchgetCCDepBP(BP) {
      const sessionId = localStorage.getItem("sessionId");
      // this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/getCCDepBP", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            BP,
          },
        });
        this.m_cc = response.data;
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

        //await handleLogout();
        console.log(error);
      } finally {
        // this.loading = false;
      }
    },

    async hexTocode(hex, x) {
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/hex-to-code",
          {
            params: { hex, x },
          },
        );

        this.code = response.data;
        return response.data; // ✅ IMPORTANT
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        console.log(error);
        return null; // ✅ important pour gestion erreur
      }
    },
  },
});
//export const piniaPlugin = createPiniaPlugin()
