// /Users/anjaniainaandrianina/Desktop/Project/prepa/ERPO/frontend_prepa/prepa/src/store/Transfert

import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useTransfertStore = defineStore("transfert", {
  state: () => ({
    loading: false,
    codeTD: '',
    problemStock: [],
    stockNonVide: 0,
    params: {
      article: '',
      qte: '',
      depot: '',
      lettre: '',
      empl: ''

    },
  }),
  actions: {
    async insertL6_transfert(listeCmd) {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout();
      try {
        // Send the sessionId in the headers correctly
        const response = await axios.post(Config.SERVER_URL + 'api/insertL6_transfert', listeCmd, {
          headers: {
            'Authorization': sessionId // Correctly add the session ID in the headers
          }
        });
        this.data = response.data;
        this.loading = false;
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
    /*async insertFSIL(params) {
      this.loading = true
      try {
        const response = await axios.post(Config.SERVER_URL + 'api/insertFSIL', null, {
          headers: { 'Content-Type': 'application/json' },
          params: params  // Pass params as query parameters
        });
        this.codeTD = response.data;
        this.loading = false
      }
      catch (error) {
        alert(error)
        console.log(error)
      } finally {
        this.loading = false
      }
    },*/

    async insertFSIL(params) {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      console.log(sessionId);
      const { handleLogout } = useLogout();
      try {
        const response = await axios.post(Config.SERVER_URL + 'api/insertFSIL', null, {

          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionId
          },
          params: params,  // Pass params as query parameters
          withCredentials: true
        });

        if (response.status === 401) {
          alert("Session invalide. Please log in again.");
        } else {
          this.codeTD = response.data;  // Handle the response
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Session invalide. Please log in again.");
        } else {
          alert("Error inserting FSIL: " + error.message);  // Handle other errors
        }
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;  // Set loading state to false regardless of success/failure
      }
    },

    async listProblemStock(article, qte, depot, lettre, empl) {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/testStock', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: {
            article,
            qte,
            depot,
            lettre,
            empl,
          },
        });
        this.problemStock = response.data;

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error)
      } finally {
        this.loading = false;
      }
    },

    async stockPasVide(depot, empl) {
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + 'api/stockPasVide', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: {
            depot,
            empl,
          },
        });
        this.stockNonVide = response.data;

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error)
      } finally {
        this.loading = false;
      }
    },
    async insertL6_transfertConseil(listeTransfert) {
      const sessionId = localStorage.getItem('sessionId');
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.post(Config.SERVER_URL + 'api/insertL6_transfertConseil', listeTransfert, {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
          },

        }

        );
        this.data = response.data;
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
