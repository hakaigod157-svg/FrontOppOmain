import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useConsultStore = defineStore('Consult', {
  state: () => ({
    Consults: [],
    loading: false,
    params: { 
      ncpsUserNcpsCode: ''
    },
  }),
  actions: {
    async fetchConsult(ncpsUserNcpsCode) { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      const sessionId = localStorage.getItem('sessionId');
      try {
        // Retrieve session ID from localStorage

        const url = `${Config.SERVER_URL}api/listuserconsult`;
        
        const response = await axios.get(url, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: { 
            ncpsUserNcpsCode
          },
        });

        this.Consults = response.data;
        // Check for 404 status
        // if (response.status === 404) {
        //   this.Consults = [];  
        //   console.warn('No consultations found (404). Consults set to empty array.');
        //   return; // Exit the function early
        // }

        // // Handle response data
        // if (Array.isArray(response.data)) {
        //   this.Consults = response.data;
        // } else {
        //   this.Consults = [];
        //   console.warn('No valid data received. Consults set to empty array.');
        // }
      } catch (error) {
        // alert(`Error: ${error.message}
        //   Method: ${error.config?.method.toUpperCase()}
        //   URL: ${error.config?.url}`);
        // await handleLogout(); // Call useLogout on error
        console.error('Error fetching Consults:', error);
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading); 
      }
    },
  },
});
