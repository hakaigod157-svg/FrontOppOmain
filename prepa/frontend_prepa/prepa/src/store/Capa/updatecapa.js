import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Import useLogout

export const useUpdateCapaStore = defineStore('UpdateCapa', {
  state: () => ({
    UpdateCapas: [],
    loading: false,
    params: { 
      ncpsSeq: '',
      ncpsCode: '',
      ncpsDate: '',
      ncpsDescription: '', 
      ncpsDepartement: '',
      ncpsType: '',  
      ncpsModeDetect: '',
      ncpsProcessusDetect: '',
    },
  }),
  actions: {
    async updateCapa() { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout
      try {
        // Base URL without query parameters
        const url = `${Config.SERVER_URL}api/updatecapa`;

        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');

        // Use the params object to send parameters as query parameters
        const response = await axios.put(url, null, {
          headers: {
            'Authorization': sessionId // Add session ID to Authorization header
          },
          params: {
            ncpsSeq: this.params.ncpsSeq,
            ncpsCode: this.params.ncpsCode,
            ncpsDate: this.params.ncpsDate,
            ncpsDescription: this.params.ncpsDescription,
            ncpsDepartement: this.params.ncpsDepartement,
            ncpsType: this.params.ncpsType,
            ncpsModeDetect: this.params.ncpsModeDetect,
            ncpsProcessusDetect: this.params.ncpsProcessusDetect,
          },
        });

        
        if (response.status === 200) {
          this.UpdateCapas = response.data; 
          console.log("Mise à jour réussie", response.data);
        } else if (response.status === 404) {
          this.UpdateCapas = [];
          console.log('Aucune capa mise à jour trouvée (404). UpdateCapas set to empty array.');
        } else {
          this.UpdateCapas = [];
          console.log('Pas de données valides reçues. UpdateCapas set to empty array.');
        }
      } catch (error) {
        alert(`Erreur : ${error.message}
          Méthode : ${error.config?.method.toUpperCase()}
          URL : ${error.config?.url}`);
        await handleLogout(); // Call useLogout on error
        console.error("Erreur lors de la mise à jour :", error);
      } finally {
        this.loading = false;
        console.log('Chargement terminé. État de chargement actuel :', this.loading); 
      }
    },
  },
});
