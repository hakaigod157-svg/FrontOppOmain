import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useListEnumStore = defineStore('ListEnum', {
  state: () => ({
    ListEnums: [], 
    loading: false,
    params: {},
  }),
  actions: {
    async fetchListEnum() {
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        const response = await axios.get(Config.SERVER_URL + 'api/listenumerationcapa', {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          }
        });

        if (Array.isArray(response.data)) {
          this.ListEnums = response.data;
        } else {
          this.ListEnums = [];
          console.warn('Response data is not an array:', response.data);
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        // await handleLogout(); // Call useLogout on error
        console.error('Error fetching list enumeration:', error);
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading); 
      }
    },
  },
});
