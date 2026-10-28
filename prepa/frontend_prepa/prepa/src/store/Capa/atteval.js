import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Importing the logout utility

export const useAtteValStore = defineStore('AtteVal', {
  state: () => ({
    AtteVals: [], 
    loading: false,
    params: {},
  }),
  actions: {
    async fetchAtteVal() {
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout

      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');
        
        const response = await axios.get(`${Config.SERVER_URL}api/attentevalid`, {
          headers: {
            'Authorization': sessionId, // Add session ID to Authorization header
          },
        });

        if (Array.isArray(response.data)) {
          this.AtteVals = response.data; 
          console.log("Fetched AtteVals:", this.AtteVals);
        } else {
          this.AtteVals = [];
          console.log('No valid data received. AtteVals set to empty array.');
        }
      } catch (error) {
        this.AtteVals = []; // Clear AtteVals on error
        if (error.response) {
          console.error('Error fetching AtteVals:', error.response.data);
          alert(`Erreur: ${error.response.data.message || 'Une erreur est survenue'}`); // User-friendly alert
        } else {
          console.error('Error fetching AtteVals:', error);
          alert('Erreur: Impossible de se connecter au serveur.'); // General error message
        }
        // await handleLogout(); // Logout on error if necessary
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading);
      }
    },
  },
});
