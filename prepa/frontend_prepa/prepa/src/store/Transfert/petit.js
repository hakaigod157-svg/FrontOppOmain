import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const usePetitStore = defineStore("petitColis", {
  state: () => ({
    petits0: [],
    petits1: [],
    loading: false,
    params: {
      depotOrg: '',
      depotDest: '',
      alle: '',
    },
  }),
  actions: {
    async fetchPetit(depotOrg, depotDest, alle) {
      this.loading = true
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/petitColis', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: {
            depotOrg,
            depotDest,
            alle,
          }
        })
        const data = response.data
        if (Array.isArray(data) && data.length === 2) {
          this.petits0 = data[0]
          this.petits1 = data[1]
        } else {

          console.error('Unexpected data structure in fetchPetit response:', data)
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