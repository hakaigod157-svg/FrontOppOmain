import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useAjoutUserStore = defineStore('AjoutUser', {
  state: () => ({
    AjoutUsers: [],
    loading: false,
    Inserts: [],
    params: {
      ncpsUserUserCode: '',
      ncpsUserNcpsCode: '',
    },
  }),
  actions: {
    async fetchAjoutUser() { 
      this.loading = true;   
      const { handleLogout } = useLogout(); // Initialize useLogout
      try {
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        const url = `${Config.SERVER_URL}api/insertuser`;

        const response = await axios.post(url, null, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: {
            ncpsUserUserCode: this.params.ncpsUserUserCode,
            ncpsUserNcpsCode: this.params.ncpsUserNcpsCode
          }
        }); 

        console.log('Response data:', response.data);
        
        if (response.status === 200) {
          this.Inserts = response.data; 
          console.log("Ajout réussi", response.data);
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout(); // Call useLogout on error
        console.error('Error fetching AjoutUsers:', error);  
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading); 
      }
    },
  },
});
