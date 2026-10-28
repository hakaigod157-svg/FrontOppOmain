import { defineStore } from 'pinia'
import Config from "@/utils/config.js"
import axios from "@/utils/axiosConfig"
import useLogout from '@/composables/useLogout';
export const useLockStore = defineStore("lock", {
    state: () => ({
        locks: [],
        loading: false,
        // params: {
        //     xTable:'',
        //     xCode:'',
        //     isClose:'',
        // },
    }),

    actions: {
        async fetchLock(params) {
            const { handleLogout } = useLogout();
            const sessionId = localStorage.getItem('sessionId');
            this.loading = true
            try {
                const response = await axios.post(Config.SERVER_URL + 'api/lock', null, {
                    headers: { 'Content-Type': 'application/json', 'Authorization': sessionId },
                    params: params  // Pass params as query parameters
                });
                this.locks = response.data
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