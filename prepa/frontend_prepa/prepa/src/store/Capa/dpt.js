import { defineStore } from 'pinia';
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useDptStore = defineStore("dpt", {
  state: () => ({
    dpts: [],
    loading: false,
  }),
  actions: {
    async fetchDpt() {
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      const sessionId = localStorage.getItem('sessionId');

      try {
        // Retrieve session ID from localStorage

        const response = await axios.get(`${Config.SERVER_URL}api/dpt_capa`, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          }
        });

        this.dpts = response.data
        // // Check for a successful response
        // if (response.status === 200) {
        //   this.dpts = response.data;
        // } else {
        //   console.error('Failed to fetch departments:', response.statusText);
        // }
      } catch (error) {
        alert(`Error fetching departments: ${error.message}`); // Show user-friendly alert
        // await handleLogout(); // Call logout function on error
        console.error('Error details:', error);
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading);
      }
    },
  },
});
