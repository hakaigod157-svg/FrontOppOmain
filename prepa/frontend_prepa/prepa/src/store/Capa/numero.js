import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useNumStore = defineStore('Num', {
  state: () => ({
    Nums: [],
    loading: false,
    params: { 
      seqk: ''
    },
  }),
  actions: {
    async fetchLatestKtable() {
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        const response = await axios.get(Config.SERVER_URL + 'api/ktable', {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          }
        });
        
        this.Nums = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout(); // Call useLogout on error
        console.error('Error fetching KTABLE data:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async updateKtable() {
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      try {
        const url = Config.SERVER_URL + `api/updatektable`;
        
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        const response = await axios.put(url, null, { // Pass null as the second argument for PUT
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: {
            seqk: this.params.seqk
          }
        });
        
        if (response.status === 200) {
          await this.fetchLatestKtable(); // Fetch latest data if update is successful
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout(); // Call useLogout on error
        console.error('Error updating KTABLE:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async insertKtable() {
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        const response = await axios.post(Config.SERVER_URL + 'api/insertktable', null, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          }
        });
        
        if (response.status === 200) {
          await this.fetchLatestKtable(); // Fetch latest data if insertion is successful
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        // await handleLogout(); // Call useLogout on error
        console.error('Error inserting into KTABLE:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
