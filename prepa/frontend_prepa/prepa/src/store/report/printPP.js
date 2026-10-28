import { defineStore } from 'pinia';
import axios from "@/utils/axiosConfig"
import Config from "@/utils/config.js";
import useLogout from '@/composables/useLogout';
export const useReportPPStore = defineStore('reports', {
  state: () => ({
    reportBytes: null,
  }),
  actions: {
    async generateReportPP(pp) {
        const sessionId = localStorage.getItem('sessionId');
        const { handleLogout } = useLogout();
        try {
          const response = await axios.get(Config.SERVER_URL + 'api/printPP', {
            headers: {
              'Authorization': sessionId 
            },
            params: {
              pp,
            },
           
            responseType: 'arraybuffer',
          });
          return response;
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