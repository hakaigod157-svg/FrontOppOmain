import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout'; 
export const useLigneCommandeStore = defineStore("ligneCommande", {
  state: () => ({
    ligneCommandes: [],
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
    async fetchLigneCommande() {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/lignecmd', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: this.params
        })
        this.ligneCommandes = response.data
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
    setCode(code) {
      this.params.code = code;
    },
  },

})
//export const piniaPlugin = createPiniaPlugin()