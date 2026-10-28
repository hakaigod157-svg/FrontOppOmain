import { defineStore } from 'pinia';
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    loading: false,
  }),
  actions: {
    async fetchUser() {
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      console.log("Fetching users...");
      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        const response = await axios.get(Config.SERVER_URL + 'api/user_capa', {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          }
        });

        // Check the response status
        if (response.status === 404) {
          this.users = [];  
          console.log('No users found (404). Users set to empty array.');
        } else if (Array.isArray(response.data)) {
          this.users = response.data;
          console.log('Users fetched successfully:', this.users);
        } else {
          this.users = [];
          console.log('No valid data received. Users set to empty array.');
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        // await handleLogout(); // Call useLogout on error
        console.error('Error fetching Users:', error);  
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading); 
      }
    },
  },
});
