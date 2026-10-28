import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Importing a logout utility

export const useCapaDetailStore = defineStore('capaDetail', {
  state: () => ({
    capaDetails: [],
    loading: false,
    params: { 
      code: '',
      description: '',
      emetteur: '',
      libelleDep: '',
      type: '',
      date: null, 
      causevalid: '',
      causeatte: '',
      attevalid: '',
      attemiseappli: '',
      appli: ''
    },
  }),
  actions: {
    async fetchCapaDetails(
      code,
      description,
      emetteur,
      libelleDep,
      type,
      date,
      causevalid,
      causeatte,
      attevalid,
      attemiseappli,
      appli
    ) { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout

      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');
        
        const response = await axios.get(`${Config.SERVER_URL}api/capa`, {
          headers: {
            'Authorization': sessionId, // Add session ID to Authorization header
          },
          params: {
            code,
            description,
            emetteur,
            libelleDep,
            type,
            date,
            causevalid,
            causeatte,
            attevalid,
            attemiseappli,
            appli
          }
        });

        if (Array.isArray(response.data)) {
          this.capaDetails = response.data;
          console.log("Fetched capaDetails:", this.capaDetails);
        } else {
          this.capaDetails = [];
          console.log('No valid data received. capaDetails set to empty array.');
        }
      } catch (error) {
        this.capaDetails = [];
        if (error.response) {
          if (error.response.status === 404) {
            console.log('Aucune correspondance trouvée (404 Not Found)');
          } else {
            console.error('Une erreur s\'est produite lors de la récupération des données:', error.response.data);
            alert(`Erreur: ${error.response.data.message || 'Une erreur est survenue'}`); // User-friendly alert
          }
        } else {
          console.error('Une erreur s\'est produite lors de la récupération des données:', error);
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
