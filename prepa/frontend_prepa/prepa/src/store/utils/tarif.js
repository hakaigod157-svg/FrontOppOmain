import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useTarifStore= defineStore("tarif", {
  state: () => ({
    tarifs: [],
    loading: false,
  }),
  actions: {
    async fetchTarif() {
      this.loading = true;
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem('sessionId');
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/tarif', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
        })

        this.tarifs = response.data
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
