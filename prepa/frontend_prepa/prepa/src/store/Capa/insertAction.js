import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useAjoutActionStore = defineStore('AjoutAction', {
  state: () => ({
    AjoutActions: [],
    loading: false,
    params: { 
      actionNcpscode: '',
      actionDescription: '',
      actionType: '',
      actionCausesseq: '',
    },
  }),
  actions: {
    async fetchAjoutAction() { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout

      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        const url = `${Config.SERVER_URL}api/insertaction`;

        // Use the params object to send parameters as query parameters
        const response = await axios.post(url, null, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: {
            actionNcpscode: this.params.actionNcpscode,
            actionDescription: this.params.actionDescription,
            actionType: this.params.actionType,
            actionCausesseq: this.params.actionCausesseq,
          },
        });

        console.log('Response data:', response.data);

        if (response.status === 200) {
          this.AjoutActions = response.data; 
          console.log("Ajout réussi", response.data);
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        // await handleLogout(); // Call useLogout on error
        console.error('Erreur lors de l\'ajout d\'action:', error);  
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading); 
      }
    },
  },
});
