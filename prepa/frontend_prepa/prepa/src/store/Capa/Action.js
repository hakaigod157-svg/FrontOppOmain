import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import the default export
export const useActionStore = defineStore('Action', {
  state: () => ({
    Actions: [],
    loading: false,
    params: { 
      actionCauseseq: ''
    },
  }),
  actions: {
    async fetchAction(actionCauseseq) { 
      this.loading = true;
      const sessionId = localStorage.getItem('sessionId');
      console.log(`Fetching Actions with actionCauseseq: ${actionCauseseq}`);  
      const { handleLogout } = useLogout(); 
      try {
        const url = `${Config.SERVER_URL}api/action`;
        
        const response = await axios.get(url, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: { actionCauseseq },
        });
        
        if (response.status === 404) {
          this.Actions = [];  
        } else if (Array.isArray(response.data)) {
          this.Actions = response.data;
        } else {
          this.Actions = [];
          console.log('No valid data received. Actions set to empty array.');
        }
      } catch (error) {
        // alert(`Error: ${error.message}
        //   Method: ${error.config?.method.toUpperCase()}
        //   URL: ${error.config?.url}`);
        // await handleLogout(); 
        console.error('Error fetching Actions:', error);  
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading); 
      }
    },
  },
});