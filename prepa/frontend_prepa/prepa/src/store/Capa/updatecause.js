import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useUpdateCauseStore = defineStore('UpdateCause', {
  state: () => ({
    UpdateCauses: [],
    loading: false,
    params: { 
      causeRacSeq: '',
      causeRacCode: '',
      causeRacDate: '',
      causeRacDescription: '',
      causeRacProcImput: '', 
      causeRacValide: '',
    },
  }),
  actions: {
    async updateCause() { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      try {
        // Base URL without query parameters
        const url = `${Config.SERVER_URL}api/updatecuserac`;

        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        // Use the params object to send parameters as query parameters
        const response = await axios.put(url, null, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: {
            causeRacSeq: this.params.causeRacSeq,
            causeRacCode: this.params.causeRacCode,
            causeRacDate: this.params.causeRacDate,
            causeRacDescription: this.params.causeRacDescription,
            causeRacProcImput: this.params.causeRacProcImput,
            causeRacValide: this.params.causeRacValide,
          },
        });

        
        if (response.status === 200) {
          this.UpdateCauses = response.data; 
          console.log("Mise à jour réussie", response.data);
        } else if (response.status === 404) {
          this.UpdateCauses = [];
          console.log('Aucune cause mise à jour trouvée (404). UpdateCauses set to empty array.');
        } else {
          this.UpdateCauses = [];
          console.log('Pas de données valides reçues. UpdateCauses set to empty array.');
        }
      } catch (error) {
        alert(`Erreur : ${error.message}
          Méthode : ${error.config?.method.toUpperCase()}
          URL : ${error.config?.url}`);
        await handleLogout(); // Call useLogout on error
        console.error("Erreur lors de la mise à jour :", error);
      } finally {
        this.loading = false;
        console.log('Chargement terminé. État de chargement actuel :', this.loading); 
      }
    },
  },
});
