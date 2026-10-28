import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from "@/utils/axiosConfig";
import useLogout from '@/composables/useLogout';

export const prepCommandStore = defineStore('prepCommandStore', {
  state: () => ({
    depotCmd: [],
    articleCmd: [],
    listeCmd: [],
    rayonCmd: [],
    loading: false,
    params: {
      code: '',
    },
  }),

  getters: {
    getDepotCmd(state) {
      return state.depotCmd;
    },
  },

  actions: {
    async fetchPreparerCmd() {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout();

      if (!sessionId) {
        console.error('No session ID found. Logging out.');
        await handleLogout();
        this.loading = false;
        return;
      }

      try {
        const response = await axios.get(Config.SERVER_URL + 'api/genererBP', {
          headers: {
            'Authorization': sessionId,
          },
          params: this.params,
        });

        const data = response.data;
        if (Array.isArray(data) && data.length === 4) {
          this.depotCmd = data[0];
          this.articleCmd = data[1];
          this.listeCmd = data[2];
          this.rayonCmd = data[3];
        } else {
          console.error('Unexpected data structure in fetchPreparerCmd response:', data);
          await handleLogout(); // Optional: Uncomment if you want to log out on unexpected response
        }
      } catch (error) {
      
      let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        alert(`
          Error: ${message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}
          `);
        await handleLogout(); 
      } finally {
        this.loading = false;
      }
    },

    setCode(code) {
      this.params.code = code;
    },
  },
});