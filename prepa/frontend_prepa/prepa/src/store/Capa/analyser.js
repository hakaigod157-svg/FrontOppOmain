import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Importing the logout utility

export const useAnaActionStore = defineStore('AnaAction', {
  state: () => ({
    AnaActions: [],
    loading: false,
    params: { 
      actionSeq: '',
      actionDaterelleeffic: '',
      actionCommentaire: '',
    },
  }),
  actions: {
    async anaAction() { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout

      const sessionId = localStorage.getItem('sessionId'); // Get the session ID
      try {
        const url = `${Config.SERVER_URL}api/updateaction3`;
        
        // Make the request with Authorization header
        const response = await axios.put(url, null, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: {
            actionSeq: this.params.actionSeq,
            actionDaterelleeffic: this.params.actionDaterelleeffic,
            actionCommentaire: this.params.actionCommentaire,
          },
        });
        
        if (response.status === 200) {
          this.AnaActions = response.data; 
          console.log("Mise à jour réussie:", this.AnaActions);
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
