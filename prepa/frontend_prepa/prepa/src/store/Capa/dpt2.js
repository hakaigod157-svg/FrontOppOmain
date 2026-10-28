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

          // Construct the request with parameters as part of the URL
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
          
        if (response.status === 200) {
          this.AjoutActions = response.data; 
          console.log("Ajout réussi", response.data);
        } else {
          console.error('Failed to add action:', response.statusText);
        }
      } catch (error) {
         alert(`Error adding action: ${error.message}`); // Show user-friendly alert
        // await handleLogout(); // Call logout function on error
        console.error('Error details:', error);  
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading); 
      }
    },
  },
});
