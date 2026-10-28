import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import the logout composable

export const useUpdateActionStore = defineStore('UpdateAction', {
  state: () => ({
    UpdateActions: [],
    loading: false,
    params: { 
      actionSeq: '',
      actionResponsable: '',
      actionDateprev: '',
    },
  }),
  actions: {
    async updateAction() { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      try {
       // Base URL without query parameters
        const url = `${Config.SERVER_URL}api/updateaction`;

        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        // Make the PUT request with parameters as a params object
        const response = await axios.put(url, {}, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: {
            actionSeq: this.params.actionSeq,
            actionResponsable: this.params.actionResponsable,
            actionDateprev: this.params.actionDateprev,
          },
        });

        
        if (response.status === 404) {
          this.UpdateActions = [];  
        } else if (response.status === 200) {
          this.UpdateActions = response.data; 
          console.log("Mise à jour réussie", response.data);
        } else {
          this.UpdateActions = [];
          console.log('No valid data received. UpdateActions set to empty array.');
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        // await handleLogout(); 
        console.error('Error updating Action:', error);  
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading); 
      }
    },
  },
});
