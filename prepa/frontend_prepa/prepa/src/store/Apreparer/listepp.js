import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout'; 
export const usePPStore = defineStore("listPP", {
  
  state: () => ({
    listPPs: [],
    loading: false,
    params: {
      TPPCODE: null,
    },

  }),

  actions: {
    async fecthlistPP(date_deb, date_fin) {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/listPP', {
          headers: {
            'Authorization': sessionId 
          }, 
          params: {
            date_deb, date_fin
          }
        })
        this.listPPs = Array.isArray(response.data) ? response.data : [];
        this.loading = false
        
      }
      catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout(); 
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    async fecthlistDet(TPPCODE) {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/listPPDet', {
          headers: {
            'Authorization': sessionId 
          }, 
          params: {
            TPPCODE
          }
        })
        this.listPPs = Array.isArray(response.data) ? response.data : [];
        this.loading = false
        
      }
      catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout(); 
        console.log(error)
      } finally {
        this.loading = false
      }
    },

  },

})