import { defineStore } from "pinia";
import axios from "@/utils/axiosConfig";
import Config from "@/utils/config.js";
import useLogout from "@/composables/useLogout";
export const useReportLVStore = defineStore("reportss", {
  state: () => ({
    reportBytes: null,
    params: {
      code: null,
    },
  }),
  actions: {
    async generateReportLV(code) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/printLV", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            code,
          },

          responseType: "arraybuffer",
        });
        return response;
      } catch (error) {
        alert(`Error: ${error.message}
            Method: ${error.config?.method.toUpperCase()}
            URL: ${error.config?.url}`);
        await handleLogout();
        console.error(error);
        throw new Error("Failed to generate report.");
      }
    },

    async generateReportCourse(code) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/printCourse", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            code,
          },

          responseType: "arraybuffer",
        });
        return response;
      } catch (error) {
        alert(`Error: ${error.message}
            Method: ${error.config?.method.toUpperCase()}
            URL: ${error.config?.url}`);
        await handleLogout();
        console.error(error);
        throw new Error("Failed to generate report.");
      }
    },
  },
});
