import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Importing the logout utility

export const useApplActionStore = defineStore('ApplAction', {
  state: () => ({
    ApplActions: [],
    loading: false,
    params: { 
      actionSeq: '',
      actionDateanaleffic: '',
      actionDaterelleeffic: '',
    },
  }),
  actions: {
    async applAction() { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout

      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');
        
        const url = `${Config.SERVER_URL}api/updateaction2`;
        
        // Make the request with Authorization header and params
        const response = await axios.put(url, null, {
          headers: {
            'Authorization': sessionId, // Add session ID to Authorization header
          },
          params: {
            actionSeq: this.params.actionSeq,
            actionDateanaleffic: this.params.actionDateanaleffic,
            actionDaterelleeffic: this.params.actionDaterelleeffic,
          },
        });
        
        if (response.status === 200) {
          this.ApplActions = response.data; 
          console.log("Mise à jour réussie:", this.ApplActions);
        } else {
          console.warn("La mise à jour n'a pas abouti:", response);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
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
