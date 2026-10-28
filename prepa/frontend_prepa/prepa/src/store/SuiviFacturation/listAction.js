import { defineStore } from 'pinia';
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";

export const uselistAction = defineStore("listaction", {
    state: () => ({
      listactions: [],
      loading: false,

      params: {
          seqEntrant: null
      },

    }),
    actions: {
        async fetchListAction(seqEntrant) {
          const sessionId = localStorage.getItem('sessionId');
            this.loading = true
            try {
              const response = await axios.get(Config.SERVER_URL + 'api/listAction', {
                headers: {
                  'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
              },
                params: {
                  seqEntrant
                }
              });
              if (Array.isArray(response.data)) {
                this.listactions = response.data
              } else {
                this.listactions = []
              }
    
              this.loading = false
            }
            catch (error) {
              alert(error)
              console.log(error)
            } finally {
              this.loading = false
            }
          },
        
    }
})