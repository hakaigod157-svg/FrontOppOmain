import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useOffre = defineStore("listoffre", {
  state: () => ({
    loading: false,
    listoffre: [],
    listcabinet: [],
  
  }),
  actions: {
    async insertOffre(form) {
      const formData = new FormData();

      // Champs texte / dates / nombres
      formData.append("offre_code", form.OFFRE_CODE);
      formData.append("offre_type", form.OFFRE_TYPE);
      
      formData.append("offre_date", form.OFFRE_DATE);
      formData.append("offre_entite", form.OFFRE_ENTITE);
      formData.append("offre_code_recr", form.OFFRE_CODE_RECR);
      
      // Fichier
      if (form.OFFRE_PIECE && form.OFFRE_PIECE instanceof File) {
        formData.append("offre_piece", form.OFFRE_PIECE);
      }
      
      // console.log(formData);
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/insertOffre",
          formData,
          {
            headers: {
              Authorization: sessionId,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error(
          "Erreur insertion OFFRE :",
          error.response?.data || error.message
        );
        throw error;
      }
    },

    async fetchListOffre(coderecr) {
      if (!coderecr) {
        console.warn("fetchListOffre appelé sans  coderecr!");
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listOffre",
          {
            headers: { Authorization: sessionId },
            params: { coderecr }, 
          }
        );
        const data = response.data;
        if (Array.isArray(data)) {
          this.listoffre = data;
        } else {
          console.warn("Structure inattendue, conversion en tableau :", data);
          this.listoffre = [data];
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCabinet() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listCabinet",
          { headers: { Authorization: sessionId } }
        );
        
        const data = response.data;
        if (Array.isArray(data)) {
          this.listcabinet = data;
        } else {
          console.warn("Structure inattendue, conversion en tableau :", data);
          this.listcabinet = [data];
        }
        
      } catch (error) {
        alert(`Erreur fetch cabinet: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },
    async updateOffre(form) {
      const formData = new FormData();

      // Champs texte / dates / nombres
      formData.append("offre_code", form.OFFRE_CODE);
      formData.append("offre_type", form.OFFRE_TYPE);
      formData.append("offre_date", form.OFFRE_DATE);
      formData.append("offre_entite", form.OFFRE_ENTITE);
      formData.append("offre_code_recr", form.OFFRE_CODE_RECR);
      // Fichier
      if (form.OFFRE_PIECE && form.OFFRE_PIECE instanceof File) {
        formData.append("offre_piece", form.OFFRE_PIECE);
      }
      
      // console.log(formData);
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/updateOffre",
          formData,
          {
            headers: {
              Authorization: sessionId,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error(
          "Erreur insertion OFFRE :",
          error.response?.data || error.message
        );
        throw error;
      }
    },
    async deleteOffre(form) {
      const formData = new FormData();

      // Champs texte / dates / nombres
      formData.append("offre_code", form.offre_code);
      formData.append("offre_entite", form.offre_entite);
      formData.append("offre_code_recr", form.offre_code_recr);
      
      // console.log(formData);
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/deleteOffre",
          formData,
          {
            headers: {
              Authorization: sessionId,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error(
          "Erreur insertion OFFRE :",
          error.response?.data || error.message
        );
        throw error;
      }
    },
    
  },
});
