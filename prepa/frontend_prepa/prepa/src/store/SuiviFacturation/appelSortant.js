import { defineStore } from 'pinia';
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";

export const useAppelSortantStore = defineStore("AppelSortant", {
    state: () => ({
        AppelSortants: [],
        ListClients:[],
        loading: false,
        params: {
            date_sortant: null,
            numero: null,
            datePart:null,
            timePart:null,
            date_sortant_second: null,
        }
    }),
    actions: {
        async fetchAppelSortant(date_sortant,datePart,timePart, numero) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true;
            try {
                //API APPEL SORTANT
                const response = await axios.get(Config.SERVER_URL + 'api/appelsortant', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        date_sortant,
                        datePart,
                        timePart,
                        numero,
                    }
                });
                if (Array.isArray(response.data)) {
                    this.AppelSortants = response.data;
                } else {
                    this.AppelSortants = [];
                }
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },



        async updateEtatSortie(seq, etat, seqSortie,rappel,src_sortant) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true
            try {
                const response = await axios.post(Config.SERVER_URL + 'api/updateEtatSortie', null, {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        seq, etat, seqSortie,rappel,src_sortant,
                    }
                    
                },
                );
                this.loading = false
            }
            catch (error) {
                // alert(error)
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        async insertFrappel(seqEntrant, seqSortant,user,ip_local) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true
            try {
                const response = await axios.post(Config.SERVER_URL + 'api/insert_frappel', null, {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        seqEntrant, seqSortant,user,ip_local,
                    }
                    
                },
                );
                this.loading = false
            }
            catch (error) {
                // alert(error)
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        async fetchlListClient() {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true;
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
                console.error(error);
            } finally {
                this.loading = false;
            }
        },



        // async updateEtatSortie(seq, etat, seqSortant) {
        //     try {
        //         this.loading = true
        //         const response = await axios.put(Config.SERVER_URL + 'api/updateEtatSortie', null, {
        //             headers: { 'Content-Type': 'application/json' },
        //             seq, etat, seqSortant
        //         });
        //         this.loading = false
        //     }
        //     catch (error) {
        //         alert(error)
        //         console.log(error)
        //     } finally {
        //         this.loading = false
        //     }
        // },
    },
});