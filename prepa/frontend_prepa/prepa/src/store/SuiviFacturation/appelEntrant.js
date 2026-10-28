import { defineStore } from 'pinia';
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";

export const useAppelEntrantStore = defineStore("AppelEntrant", {
  state: () => ({
    AppelEntrants: [],
    Moyennes: [],
    xTest_majs:null,
    loading: false,
    params: {
      date_deb: null,
      date_fin: null,
    },
    seq: null, etat: null, dateRappel: null
  }),
  actions: {

    async fetchAppelEntrant(date_deb, date_fin) {
      const sessionId = localStorage.getItem('sessionId');
      this.loading = true;
      try {
        //API APPEL ENTRANT 
        const response = await axios.get(Config.SERVER_URL + 'api/appelentrant', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
        },
          params: {
            date_deb, date_fin
          }
        });
        if (Array.isArray(response.data)) {
          this.AppelEntrants = response.data;
        } else {
          this.AppelEntrants = [];
        }
      } catch (error) {
        console.error(error);
        console.log(date_deb)
      } finally {
        this.loading = false;
      }
    },

    async fetchMoyenne(date_deb, date_fin) {
      const sessionId = localStorage.getItem('sessionId');
      this.loading = true;
      try {
        //API GET MOYENNE
        const response = await axios.get(Config.SERVER_URL + 'api/appel_moyenne', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
        },
          params: {
            date_deb, date_fin
          }
        });
        if (Array.isArray(response.data)) {
          this.Moyennes = response.data;
        } else {
          this.Moyennes = [];
        }
      } catch (error) {
        
        console.error(error);
        console.log(date_deb)
      } finally {
        this.loading = false;
      }
    },



    async fetchxTest_maj(seq) {
      const sessionId = localStorage.getItem('sessionId');
      this.loading = true;
      try { 
        const response = await axios.get(Config.SERVER_URL + 'api/xTest_maj', {
          headers: {
            'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
        },
          params: {
            seq,
          }
        });
        if (Array.isArray(response.data)) {
          this.xTest_majs = response.data;
        } else {
          this.xTest_majs = '';
        }
      } catch (error) {
        console.error(error);
        console.log(date_deb)
      } finally {
        this.loading = false;
      }
    },



    async updateEtat(params) {
      try {
        const sessionId = localStorage.getItem('sessionId');
        this.loading = true
        const response = await axios.put(Config.SERVER_URL + 'api/updateEtat', null, {
          headers: { 'Content-Type': 'application/json','Authorization': sessionId},
          params: params  // Pass params as query parameters
        });
        this.loading = false
      }
      catch (error) {
        alert(error)
        console.log(error)
      } finally {
        this.loading = false
      }
    },


    // async updateEtat1(params) {
    //   try {
    //     this.loading = true
    //     const response = await axios.put(Config.SERVER_URL + 'api/updateEtat1', null, {
    //       headers: { 'Content-Type': 'application/json' },
    //       params: params  // Pass params as query parameters
    //     });
    //     this.loading = false
    //   }
    //   catch (error) {
    //     alert(error)
    //     console.log(error)
    //   } finally {
    //     this.loading = false
    //   }
    // },


  },
});