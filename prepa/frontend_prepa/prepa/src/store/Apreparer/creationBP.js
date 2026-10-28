import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useCreateBP = defineStore("useCreateBP", {
  state: () => ({
    myId: '',
    code_BP: '',
    loading: false,
    code_CC: null,
    article: null
    // params:{
    //   ids:'',
    //   code_CC:'',
    //   depot:''
    // },
  }),
  // getters: {
  //   getCommande(state) {
  //     return state.commandes
  //   }
  // },
  actions: {

    async insertL6(listeCmd) {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        const response = await axios.post(Config.SERVER_URL + 'api/insertL6', listeCmd, {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          }
        });
        this.data = response.data;
        this.loading = false
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
    async insertBP(params) {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        const response = await axios.post(Config.SERVER_URL + 'api/insertBP', null, {
          headers: { 'Content-Type': 'application/json', 'Authorization': sessionId },
          params: params  // Pass params as query parameters
        });
        this.code_BP = response.data;
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
    async atteTransfert(code_CC, article) {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        const response = await axios.post(
          Config.SERVER_URL + 'api/atteTransfert',
          null,
          {
            headers: {
              'Authorization': sessionId
            },
            params: {
              code_CC,
              article
            },
            responseType: 'text' // Handle plain text response
          }
        );
        this.loading = false;
        return response.data;
      } catch (error) {

        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        console.log(error);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },
    async updateResume(params) {
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        this.loading = true;
        const sessionId = localStorage.getItem('sessionId');

        const response = await axios.put(Config.SERVER_URL + 'api/resumeT', null, {
          headers: { 'Content-Type': 'application/json', 'Authorization': sessionId },
          params: params  // Pass params as query parameters
        });
        this.loading = false
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

    async updateFrais(params) {
      const { handleLogout } = useLogout(); // Use the logout composable
      try {
        this.loading = true;
        const sessionId = localStorage.getItem('sessionId');
        
        const response = await axios.put(Config.SERVER_URL + 'api/updateFrais', null, {
          headers: { 'Content-Type': 'application/json', 'Authorization': sessionId },
          params: params  // Pass params as query parameters
        });
        this.loading = false
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


  },

})
