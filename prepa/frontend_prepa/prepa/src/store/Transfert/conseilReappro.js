import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useConseilReapproStore = defineStore("conseilReappro", {
    state: () => ({
        conseilReappro0: [],
        conseilReappro1: [],
        loading: false,
        params: {
            article: '',
            depotOrg: '',
            depotDest: '',
        },
    }),
    actions: {
        async fetchConseilReappro(article, depotOrg, depotDest) {
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true
            const { handleLogout } = useLogout();
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/conseilReappro', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        article,
                        depotOrg,
                        depotDest,
                    }
                })
                const data = response.data
                if (Array.isArray(data) && data.length === 2) {
                    this.conseilReappro0 = data[0]
                    this.conseilReappro1 = data[1]
                } else {

                    console.error('Unexpected data structure in fetchConseilReappro response:', data)
                }
            } catch (error) {
                alert(`Error: ${error.message}
                    Method: ${error.config?.method.toUpperCase()}
                    URL: ${error.config?.url}`);
                await handleLogout();
                console.error(error)
            } finally {
                this.loading = false
            }
        },
    },

})