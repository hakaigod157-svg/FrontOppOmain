import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useAlleeStore = defineStore("allee", {
  state: () => ({
    allees: [],
    loading: false,
    params: {
      critere: '',
      depot: '',
    },
  }),
  //   getters: {
  //     getDepots(state) {
  //       return state.depots
  //     }
  //   },
  actions: {
    async fetchAllees(depot, critere) {
      const sessionId = localStorage.getItem('sessionId');
      this.loading = true;
      const { handleLogout } = useLogout(); 
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/listAlle', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: {
            depot,
            critere,
          }
        })
        this.allees = response.data
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