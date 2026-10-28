import Config from '@/utils/config.js';
import { defineStore } from 'pinia';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useDeleteCauseStore = defineStore('DeleteCause', {
  state: () => ({
    DeleteCauses: [],
    loading: false,
    params: { 
      causeracseq: '',
    },
  }),
  actions: {
    async deleteCause() { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout

      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        const url = `${Config.SERVER_URL}api/deletecauserac`;

        // Make the delete request with Authorization header
        const response = await axios.delete(url, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: {
            causeracseq: this.params.causeracseq
          }
        });

        // Check for a successful response
        if (response.status === 200) {
          this.DeleteCauses = response.data; 
          console.log("Suppression réussie", response.data);
        } else {
          console.error('Failed to delete cause:', response.statusText);
        }
      } catch (error) {
        alert(`Error deleting cause: ${error.message}`); // Show user-friendly alert
        await handleLogout(); // Call logout function on error
        console.error("Error details:", error);
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading);
      }
    },
  },
});
