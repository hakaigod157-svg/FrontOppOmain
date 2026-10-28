import { defineStore } from 'pinia';
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from '@/composables/useLogout';
export const useSuiviTDStore = defineStore("suiviTD", {
    state: () => ({
        suiviTDs: [],
        loading: false,
        params: {
            code: '',
            depOrg: '',
            depDest: '',
            datedeb: null,
            datefin: null,
            article: ''
        },
    }),
    actions: {
        async fetchSuiviTD(code, depOrg, depDest, datedeb, datefin, article,detail,etat) {
            this.loading = true;
            const sessionId = localStorage.getItem('sessionId');
            const { handleLogout } = useLogout();
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/suiviTD', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        code,
                        depOrg,
                        depDest,
                        datedeb,
                        datefin,
                        article,
                        detail,
                        etat
                    }
                });
                if (Array.isArray(response.data)) {
                    this.suiviTDs = response.data;
                } else {
                    this.suiviTDs = [];
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

        async fetchSuiviTDDetail(code, depOrg, depDest, datedeb, datefin, article,detail,etat) {
            this.loading = true;
            const sessionId = localStorage.getItem('sessionId');
            const { handleLogout } = useLogout();
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/suiviTDDetail', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        code,
                        depOrg,
                        depDest,
                        datedeb,
                        datefin,
                        article,
                        detail,
                        etat
                    }
                });
                if (Array.isArray(response.data)) {
                    this.suiviTDs = response.data;
                } else {
                    this.suiviTDs = [];
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
    },
});
