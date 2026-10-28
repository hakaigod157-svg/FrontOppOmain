import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useRangementStore = defineStore("rangement", {
  state: () => ({
    rangements0: [],
    rangements1: [],
    loading: false,
    params: {
      depot: '',

    },
  }),
  actions: {
    async fetchRangement(depot) {
      this.loading = true
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/rangement', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: {
            depot,
          }
        })
        const data = response.data
        if (Array.isArray(data) && data.length === 2) {
          this.rangements0 = data[0]
          this.rangements1 = data[1]
        } else {

          console.error('Unexpected data structure in fetchRangement response:', data)
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },

})