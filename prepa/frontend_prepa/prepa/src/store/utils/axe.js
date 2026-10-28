import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useAxeStore = defineStore("axe", {
  state: () => ({
    axes: [],
    loading: false,
  }),
  actions: {
    async fetchAxe() {
      this.loading = true;
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem('sessionId');
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/axe', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
        })

        this.axes = response.data



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
//export const piniaPlugin = createPiniaPlugin()