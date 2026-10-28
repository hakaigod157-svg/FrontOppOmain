import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useClientStore = defineStore("clients", {
  state: () => ({
    ListClients: [],
    loading: false,
    params: {
      numero: null,
      id: null,
      user: null,
      client: null,
    },
  }),

  actions: {
    async fetchlListClient() {
      const sessionId = localStorage.getItem('sessionId');
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        //API LIST CLIENT
        const response = await axios.get(Config.SERVER_URL + 'api/listClient', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
        });
        if (Array.isArray(response.data)) {
          this.ListClients = response.data;
        } else {
          this.ListClients = [];
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.error(error);
      } finally {
        this.loading = false;
      }
    },


    async updateAnnuaire(nom, code, type, numero, user_cree) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem('sessionId');
      try {
        this.loading = true;


        const response = await axios.post(Config.SERVER_URL + 'api/InsertAnnuaire', null, {
          headers: { 'Content-Type': 'application/json', 'Authorization': sessionId },
          params: {
            nom, code, type, numero, user_cree
          }
        });
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

    async updateName(numero) {
      const { handleLogout } = useLogout();
      try {
        this.loading = true;
        const sessionId = localStorage.getItem('sessionId');
        const response = await axios.post(Config.SERVER_URL + 'api/Update_name', null, {
          headers: { 'Content-Type': 'application/json', 'Authorization': sessionId },
          params: {
            numero
          }
        });
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