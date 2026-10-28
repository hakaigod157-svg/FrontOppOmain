import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useDetailPrepStoreBP = defineStore("detailPrepBP", {
    state: () => ({
        detailPrepsBP: [],
        detailBP: [],
        detailCTRL: [],
        infoBP: [],
        loading: false,
        params: {
            BP: '',
        },
    }),
    actions: {
        async fetchDetailPrepBP(BP) {
            this.loading = true;
            const sessionId = localStorage.getItem('sessionId');
            const { handleLogout } = useLogout(); // Use the logout composable
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/listLigneBP', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        BP,
                    }
                })
                this.detailPrepsBP = response.data
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
        async fetchDetailBP(BP) {
            this.loading = true;
            const sessionId = localStorage.getItem('sessionId');
            const { handleLogout } = useLogout(); // Use the logout composable
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/detailBP', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        BP,
                    }
                })
                this.detailBP = response.data
                this.loading = false
            }
            catch (error) {
                alert(error);
                await handleLogout();
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        async fetchDetailCTRL(BP) {
            this.loading = true;
            const sessionId = localStorage.getItem('sessionId');
            const { handleLogout } = useLogout(); // Use the logout composable
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/detailBPCTRL', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        BP,
                    }
                })
                this.detailCTRL = response.data
                this.loading = false
            }
            catch (error) {
                alert(error);
                await handleLogout();
                console.log(error)
            } finally {
                this.loading = false
            }
        },

        async fetchinfoBP(BP) {
            this.loading = true;
            const sessionId = localStorage.getItem('sessionId');
            const { handleLogout } = useLogout(); // Use the logout composable
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/infoEncoursBP', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        BP,
                    }
                })
                this.infoBP = response.data
                this.loading = false
            }
            catch (error) {
                alert(error);
                await handleLogout();

                console.log(error)
            } finally {
                this.loading = false
            }
        },
    },

})


//api/detailBP