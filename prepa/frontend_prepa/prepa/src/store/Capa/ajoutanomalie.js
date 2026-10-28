import { defineStore } from 'pinia';
import Config from '@/utils/config.js';
import axios from '@/utils/axiosConfig';
import useLogout from '@/composables/useLogout'; // Importing logout utility

export const useInsertStore = defineStore('Insert', {
  state: () => ({
    Inserts: [],
    loading: false,
    params: { 
      ncpsEmetteur: '',
      ncpsDescription: '', 
      ncpsDepartement: '',
      ncpsDate: '',
    },
  }),
  actions: {
    async insert(ncpsEmetteur, ncpsDescription, ncpsDepartement, ncpsDate) { 
      this.loading = true;
      const { handleLogout } = useLogout(); // Initialize useLogout

      const sessionId = localStorage.getItem('sessionId');
      console.log(`Inserting NCPS - Emmetteur: ${ncpsEmetteur}, Description: ${ncpsDescription}, Departement: ${ncpsDepartement}, Date: ${ncpsDate}`);
      
      try {
        // Update params
        this.params.ncpsEmetteur = ncpsEmetteur;
        this.params.ncpsDescription = ncpsDescription;
        this.params.ncpsDepartement = ncpsDepartement;
        this.params.ncpsDate = ncpsDate;

        const url = `${Config.SERVER_URL}api/insertcapa`;

        // Make the request with Authorization header
        const response = await axios.post(url, null, {
          headers: {
            'Authorization': sessionId, // Add session ID to Authorization header
          },
          params: {
            ncpsEmetteur: this.params.ncpsEmetteur,
            ncpsDescription: this.params.ncpsDescription,
            ncpsDepartement: this.params.ncpsDepartement,
            ncpsDate: this.params.ncpsDate,
          },
        });
        
        if (response.status === 200) {
          this.Inserts = response.data; 
          console.log("Ajout réussi:", response.data);
        } else {
          console.warn("Échec de l'ajout. Code de statut:", response.status);
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout:", error);
        if (error.response) {
          alert(`Erreur: ${error.response.data.message || 'Une erreur est survenue'}`); // User-friendly alert
        } else {
          alert('Erreur: Impossible de se connecter au serveur.'); // General error message
        }
        await handleLogout(); // Logout on error if necessary
      } finally {
        this.loading = false;
        console.log('Loading finished. Current loading state:', this.loading); 
      }
    },
  },
});
