import { defineStore } from 'pinia';
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from '@/composables/useLogout'; // Import the default export

export const useAlerteStore = defineStore("alerte", {
  state: () => ({
    alertes: [],
    loading: false,
    params: {
      code: '',
    },
  }),
  actions: {
    async fetchAlerte() {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout(); 
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/timing', {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: this.params,
        });
        this.alertes = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout(); 
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    setCode(code) {
      this.params.code = code;
    },
  },
});