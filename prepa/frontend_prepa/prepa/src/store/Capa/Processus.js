import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useProcStore = defineStore('Proc', {
  state: () => ({
    Procs: [], 
    loading: false,
    params: {
      enumLibelle: '',
    },
  }),
  actions: {
    async fetchProc() {
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        const response = await axios.get(Config.SERVER_URL + 'api/processus', {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          }
        });

        if (Array.isArray(response.data)) {
          this.Procs = response.data; 
        } else {
          this.Procs = [];
          console.log('No valid data received. Procs set to empty array.');
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        // await handleLogout(); // Call useLogout on error
        console.error('Error fetching processes:', error);
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading); 
      }
    },
  },
});
