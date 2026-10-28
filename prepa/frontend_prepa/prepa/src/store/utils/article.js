import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useArticleStore = defineStore("articles", {
    state: () => ({
        articles: [],
        labos: [],
        familles: [],
        loading: false,
        params: {
            critere: '',
        },
    }),

    actions: {
        async fetchArticle(critere) {
            const { handleLogout } = useLogout();
            this.loading = true
            const sessionId = localStorage.getItem('sessionId');
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/listArticle', {
                    params: {
                        critere,
                    },
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                })
                this.articles = response.data
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
        async fetchFamille() {
            this.loading = true;
            const sessionId = localStorage.getItem('sessionId');
            const { handleLogout } = useLogout();
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/listFamille', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                })
                this.familles = response.data
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
        async fetchLabo(critere) {
            const { handleLogout } = useLogout();
            this.loading = true;
            const sessionId = localStorage.getItem('sessionId');
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/listLabo', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        critere,
                    },
                })
                this.labos = response.data
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