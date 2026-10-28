import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import { ref, } from "vue";
import useLogout from '@/composables/useLogout';
export const useEnCoursCmdStore = defineStore("encoursCmd", {
    state: () => ({
        encoursCmds: ref([]),
        encoursBP: ref([]),
        loading: false,
        params: {
            prepspecif: '',
            isVisible: '',
            dateliv: '',
            etat: 1,
        },
    }),
    actions: {
        async fetchEnCoursCmd(prepspecif, isVisible, dateliv) {
            this.loading = true;
            const sessionId = localStorage.getItem('sessionId');
            const { handleLogout } = useLogout(); // Use the logout composable
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/encoursprep', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        prepspecif,
                        isVisible,
                        dateliv
                    }
                })
                if (response.data.length > 0) {
                    this.encoursCmds = response.data;
                } else {
                    this.encoursCmds = [];
                }

                this.loading = false
            }
            catch (error) {
                alert(`Error: ${error.message}
                    Method: ${error.config?.method.toUpperCase()}
                    URL: ${error.config?.url}`);

                console.log(error);
                await handleLogout();
            } finally {
                this.loading = false
            }
        },
        async fetchEnCoursPrepBP(etat) {
            this.loading = true;
            const sessionId = localStorage.getItem('sessionId');
            const { handleLogout } = useLogout(); // Use the logout composable
            try {
                const response = await axios.get(Config.SERVER_URL + 'api/listEnCoursBP', {
                    headers: {
                        'Authorization': sessionId // Ajouter l'ID de session dans l'en-tête Authorization
                    },
                    params: {
                        etat,
                    }
                })
                if (response.data.length > 0) {
                    this.encoursBP = response.data;
                } else {
                    this.encoursBP = [];
                }

                this.loading = false
            }
            catch (error) {
                alert(`Error: ${error.message}
                    Method: ${error.config?.method.toUpperCase()}
                    URL: ${error.config?.url}`);

                console.log(error);
                await handleLogout();
            } finally {
                this.loading = false
            }
        },
    },

})
