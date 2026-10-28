import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useNewID = defineStore("getID", {
  state: () => ({
    myId: '',
    loading: false

  }),
  actions: {
    async getId() {
      this.loading = true
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem('sessionId');
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/new-id', {
          headers: {
            Authorization: sessionId
          }
        })
        this.myId = response.data
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
