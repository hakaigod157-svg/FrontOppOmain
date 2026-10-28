import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useTransporteurStore = defineStore("transporteur", {
  state: () => ({
    transporteurs: [],
    loading: false,
    params: {
      critere: '',
    },
  }),
  actions: {
    async fetchTransporteurs(critere) {
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout();
      this.loading = true
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/listVoiture', {
          headers: {
            'Authorization': sessionId
          },
          params: {
            critere,
          }
        })
        if (response.data.length > 0) {
          this.transporteurs = response.data;
        } else {
          this.transporteurs = []
        }
        this.loading = false
      } catch (error) {
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


