import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useEtapeStoreAdv = defineStore("etape", {
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
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem('sessionId');
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/etape', {
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