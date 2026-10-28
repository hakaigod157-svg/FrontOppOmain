import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Importing the logout utility

export const useAjoutCauseStore = defineStore('AjoutCause', {
  state: () => ({
    AjoutCauses: [],
    loading: false,
    params: { 
      causeRacCode: '',
      causeRacDescription: '',
      causeRacDate: '',
    },
  }),
  actions: {
    async fetchAjoutCause(causeRacCode, causeRacDescription, causeRacDate) { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout

      console.log(`CauseRac avec code: ${causeRacCode}`); 
      console.log(`CauseRac avec description: ${causeRacDescription}`);
      console.log(`CauseRac avec date: ${causeRacDate}`);
      
      try {
        // Assign parameters
        this.params.causeRacCode = causeRacCode;
        this.params.causeRacDescription = causeRacDescription;
        this.params.causeRacDate = causeRacDate;

        console.log('code :', this.params.causeRacCode);
        console.log('desc :', this.params.causeRacDescription);
        console.log('date :', this.params.causeRacDate);

        const sessionId = localStorage.getItem('sessionId');
        const url = `${Config.SERVER_URL}api/insertcauserac`;

        // Make the request with Authorization header
        const response = await axios.post(url, null, {
          headers: {
            'Authorization': sessionId, 
          },
          params: {
            causeRacCode: this.params.causeRacCode,
            causeRacDescription: this.params.causeRacDescription,
            causeRacDate: this.params.causeRacDate,
          },
        });

        console.log('Response data:', response.data);
        
        if (response.status === 200) {
          this.AjoutCauses = response.data; 
          console.log("Ajout réussi:", this.AjoutCauses);
        } else {
          console.warn("Échec de l'ajout:", response);
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de CauseRac:', error);
        if (error.response) {
          alert(`Erreur: ${error.response.data.message || 'Une erreur est survenue'}`); // User-friendly alert
        } else {
          alert('Erreur: Impossible de se connecter au serveur.'); // General error message
        }
        await handleLogout(); // Logout on error if necessary
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading); 
      }
    },
  },
});
