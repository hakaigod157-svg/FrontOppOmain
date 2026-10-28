import Config from '@/utils/config.js';
import { defineStore } from 'pinia';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useDeleteActionStore = defineStore('DeleteAction', {
  state: () => ({
    DeleteActions: [],
    loading: false,
    params: { 
      actionSeq: '',
    },
  }),
  actions: {
    async deleteAction() { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      try {
        const url = Config.SERVER_URL + `api/deleteactionc`;
        
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        const response = await axios.delete(url, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: {
            actionSeq: this.params.actionSeq
          }
        });
        
        if (response.status === 200) {
          this.DeleteActions = response.data; 
          console.log("Suppression réussie", response.data);
        } else if (response.status === 404) {
          this.DeleteActions = [];
          console.log('Aucune action trouvée à supprimer (404). DeleteActions set to empty array.');
        } else {
          this.DeleteActions = [];
          console.log('Pas de données valides reçues. DeleteActions set to empty array.');
        }
      } catch (error) {
        alert(`Erreur : ${error.message}
          Méthode : ${error.config?.method.toUpperCase()}
          URL : ${error.config?.url}`);
        await handleLogout(); // Call useLogout on error
        console.error("Erreur lors de la suppression :", error);
      } finally {
        this.loading = false;
        console.log('Chargement terminé. État de chargement actuel :', this.loading); 
      }
    },
  },
});
