import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useStatuStore = defineStore("statu", {
  state: () => ({
    status: [],
    loading: false,
    // params: {
    //   critere: '',
    // },
  }),
  actions: {
    async fetchDepots() {
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout();
      this.loading = true
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/listStatus', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
        //   params: {
        //     critere,
        //   }
        })
        if (response.data.length > 0) {
          this.status = response.data;
        } else {
          this.status = []
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


