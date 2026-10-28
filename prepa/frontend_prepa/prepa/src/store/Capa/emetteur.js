import { defineStore } from 'pinia';
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useEmetteurStore = defineStore("emetteur", {
  state: () => ({
    emetteurs: [],
    loading: false,
  }),
  actions: {
    async fetchEmetteur() {
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout

      try {
        const sessionId = localStorage.getItem('sessionId');

        const response = await axios.get(Config.SERVER_URL + 'api/emetteur_capa', {
          headers: {
            'Authorization': sessionId
          }
        });

        if (response.status === 200) {
          this.emetteurs = response.data;
        } else {
          console.error('Failed to fetch emetteurs:', response.statusText);
        }
      } catch (error) {
        alert(`Error fetching emetteurs: ${error.message}`);
        // await handleLogout(); // Call useLogout on error
        console.log('Error details:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
