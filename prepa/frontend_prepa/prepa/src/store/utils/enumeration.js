import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useEnumerationStore = defineStore("enumeration", {
  state: () => ({
    enumerations: [],
    // selectedEnum: null,
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
    async fetchEnums() {
      this.loading = true;
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem('sessionId');
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/enumeration', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: this.params
        })
        this.enumerations = response.data
        //  this.enumerations = response.data.map(({ libelle }) => ({ libelle }))
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
    setCode(code) {
      this.params.code = code;
    },
    // setSelectedEnum(enumeration) {
    //   this.selectedEnum = enumeration
    // }
  },

})
