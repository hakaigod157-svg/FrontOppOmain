import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useInfoCmdStore = defineStore("infoCmd", {
  state: () => ({
    infoCmds: [],
    loading: false,
    params: {
      code: '',
    },
  }),
  // getters: {
  //   getCommande(state) {
  //     return state.commandes
  //   }
  // },
  actions: {
    async fetchInfoCommande() {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/infoCmd', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: this.params
        })
        this.infoCmds = response.data
        this.loading = false
      }
      catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        localStorage.clear();
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    async updateInfoCommande(infCmd) {
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        const response = await axios.patch(Config.SERVER_URL + 'api/updateInfoCmd', infCmd, {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          }
        }
        );
        this.data = response.data;
      }
      catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        console.log(error)
        await handleLogout();
      } finally {
        this.loading = false
      }
    },
    setCode(code) {
      this.params.code = code;
    },
  },

})
//export const piniaPlugin = createPiniaPlugin()