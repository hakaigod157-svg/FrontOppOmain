import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout'; 
export const useEtapeAdv = defineStore("etapeAdv", {
  state: () => ({
    etapes: [],
    loading: false,
    params: {
      code: '',
    },
  }),

  actions: {
    async fetchEtape() {
      this.loading = true;
      
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/etapeAdv', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          }
        })
        this.etapes = response.data
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
    setCode(code) {
      this.params.code = code;
    },
  },

})