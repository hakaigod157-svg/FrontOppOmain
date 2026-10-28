import { defineStore } from 'pinia';
import axios from "@/utils/axiosConfig"
import Config from "@/utils/config.js";
import useLogout from '@/composables/useLogout';
export const useReportBPStore = defineStore('report', {
  state: () => ({
    reportBytes: null,
  }),
  actions: {
    async generateReport(codeBP, isDouble) {
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/printPrepa', {
          params: {
            codeBP,
            isDouble,
          },
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
          responseType: 'arraybuffer',
        });
        return response;
        // this.reportBytes = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);

        console.error(error);
        await handleLogout();
        throw new Error('Failed to generate report.');
      }
    },
    async generateReportTD(td, org, dest, isDouble, users) {
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/printTransfert', {
          params: {
            td,
            org,
            dest,
            isDouble,
            users
          },
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
          responseType: 'arraybuffer',
        });
        return response;
        // this.reportBytes = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.error(error);
        throw new Error('Failed to generate report.');
      }
    },
  },
});
