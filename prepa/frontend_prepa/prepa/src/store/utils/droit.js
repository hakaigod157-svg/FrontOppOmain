import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useStoreDroit = defineStore("droitAccess", {
    state: () => ({
        droits: [],
        loading: false,
        params: {
            xUser: '',
            access: '',
        },
    }),

    actions: {
        async fetchDroit(xUser, access) {
            const sessionId = localStorage.getItem('sessionId');
            const { handleLogout } = useLogout();
            this.loading = true
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/droit', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        xUser,
                        access,
                    }
                })
                this.droits = response.data;
                this.loading = false;
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
        async listeDroit(xUser) {
            this.loading = true;
            const { handleLogout } = useLogout();
            try {
                // Récupérer le sessionId depuis le localStorage (ou autre)
                const sessionId = localStorage.getItem('sessionId');

                const response = await axios.get(Config.SERVER_URL + 'api/listDroit', {

                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        xUser,
                    }
                });

                this.droits = response.data;
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
        }
    },

})
