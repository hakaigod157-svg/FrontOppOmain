import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Importing a logout utility

export const useCauseRacStore = defineStore('CauseRac', {
  state: () => ({
    CauseRacs: [],
    loading: false,
    params: { 
      code_causerac: ''
    },
  }),
  actions: {
    async fetchCauseRac(code_causerac) { 
      this.loading = true;
      console.log(`Fetching CauseRac with code_causerac: ${code_causerac}`);

      const { handleLogout } = useLogout(); // Initialize useLogout

      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        const response = await axios.get(`${Config.SERVER_URL}api/causeRac`, {
          headers: {
            'Authorization': sessionId, // Add session ID to Authorization header
          },
          params: {
            code_causerac
          }
        });

        // Check if the response contains valid data
        if (Array.isArray(response.data)) {
          this.CauseRacs = response.data;
          console.log("Fetched CauseRacs:", this.CauseRacs);
        } else {
          this.CauseRacs = [];
          console.log('No valid data received. CauseRacs set to empty array.');
        }
      } catch (error) {
        console.error('Error fetching CauseRac:', error);
        // alert(`Error fetching CauseRac: ${error.message}`); // User-friendly alert
        // await handleLogout(); // Logout on error if necessary
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading);
      }
    },
  },
});
