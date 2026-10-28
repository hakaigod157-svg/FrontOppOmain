// /Users/anjaniainaandrianina/Desktop/Project/prepa/ERPO/frontend_prepa/prepa/src/store/Transfert

import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useRotationStore = defineStore("rotation", {
  state: () => ({
    rotations0: [],
    rotations1: [],
    loading: false,
    params: {
      depot: '',
      alle: '',
    },
  }),
  actions: {
    async fetchRotation(depot, alle) {
      this.loading = true
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/rotation', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: {
            depot,
            alle,
          }
        })
        const data = response.data
        if (Array.isArray(data) && data.length === 2) {
          this.rotations0 = data[0]
          this.rotations1 = data[1]
        } else {

          console.error('Unexpected data structure in fetchRotation response:', data)
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
