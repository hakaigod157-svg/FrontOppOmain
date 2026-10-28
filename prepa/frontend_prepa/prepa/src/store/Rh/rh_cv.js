import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useCV = defineStore("listcv", {
  state: () => ({
    loading: false,
    listcv: [],
    listcv1: [],
    listcategories: [],
    params: {
      dossier: "",
    },
  }),
  actions: {
    async insertCV(form) {
      const formData = new FormData();

      // Champs texte / dates / nombres
      formData.append("cv_code", form.CV_CODE);
      formData.append("cv_nom", form.CV_NOM);
      formData.append("cv_prenom", form.CV_PRENOM);
      formData.append("cv_contact1", form.CV_CONTACT1);
      formData.append("cv_contact_2", form.CV_CONTACT_2);
      formData.append("cv_email", form.CV_EMAIL);
      formData.append("cv_date", form.CV_DATE);
      formData.append("cv_recru_code", form.CV_RECRU_CODE);

      // Fichier
      if (form.CV_CV && form.CV_CV instanceof File) {
        formData.append("cv_cv", form.CV_CV);
      }
      if (form.CV_MOTIVATION && form.CV_MOTIVATION instanceof File) {
        formData.append("cv_motivation", form.CV_MOTIVATION);
      }

      // console.log(formData);
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/insertCV",
          formData,
          {
            headers: {
              Authorization: sessionId,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(
          "Erreur insertion CV :",
          error.response?.data || error.message,
        );
        throw error;
      }
    },

    async insertCVglobal(form) {
      const formData = new FormData();

      // Champs texte / dates / nombres
      formData.append("cv_code", form.CV_CODE);
      formData.append("cv_nom", form.CV_NOM);
      formData.append("cv_prenom", form.CV_PRENOM);
      formData.append("cv_contact1", form.CV_CONTACT1);
      formData.append("cv_contact_2", form.CV_CONTACT_2);
      formData.append("cv_email", form.CV_EMAIL);
      formData.append("cv_date", form.CV_DATE);
      formData.append("cv_recru_code", form.CV_RECRU_CODE);
      // Fichier
      if (form.CV_CV && form.CV_CV instanceof File) {
        formData.append("cv_cv", form.CV_CV);
      }
      if (form.CV_MOTIVATION && form.CV_MOTIVATION instanceof File) {
        formData.append("cv_motivation", form.CV_MOTIVATION);
      }

      // console.log(formData);
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/insertCVglobal",
          formData,
          {
            headers: {
              Authorization: sessionId,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(
          "Erreur insertion CV :",
          error.response?.data || error.message,
        );
        throw error;
      }
    },
    async insertLigneCV(form) {
      const sessionId = localStorage.getItem("sessionId");
      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/insertLigneCV",
          form,
          {
            headers: {
              Authorization: sessionId,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(
          "Erreur insertion CV :",
          error.response?.data || error.message,
        );
        throw error;
      }
    },
    async fetchListCvRecrut(recrut) {
      if (!recrut) {
        console.warn("fetchListCvRecrut appelé sans coderecu !");
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/listCV", {
          headers: { Authorization: sessionId },
          params: { recrut }, // maintenant safe
        });
        const data = response.data;
        if (Array.isArray(data) && data.length === 1) {
          this.listcv = data[0];

          // console.log(this.listcv); // 👈 affichage clair
        } else {
          console.error("Unexpected data structure:", data);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },
    async updatecvSelection(recrut, cv) {
      if (!recrut) {
        console.warn("updatecvSelection appelé sans code recrutement");
        return;
      }
      if (!cv) {
        console.warn("updatecvSelection appelé sans code CV");
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/updatecvselection",
          {
            headers: { Authorization: sessionId },
            params: { recrut, cv },
          },
        );

        const rowsUpdated = response.data;

        if (rowsUpdated > 0) {
          // console.log(`✅ ${rowsUpdated} ligne(s) mise(s) à jour avec succès`);
          await this.fetchListCvRecrut(recrut); // ✅ correction ici
        } else {
          console.warn("Aucune mise à jour effectuée (aucune ligne trouvée)");
        }
      } catch (error) {
        console.error("Erreur updatecvSelection:", error);
        alert(`Erreur: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async updatecvEntretien(recrut, cv) {
      if (!recrut) {
        console.warn("updatecvEntretien appelé sans code recrutement");
        return;
      }
      if (!cv) {
        console.warn("updatecvEntretien appelé sans code CV");
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/updatecventretien",
          {
            headers: { Authorization: sessionId },
            params: { recrut, cv },
          },
        );

        const rowsUpdated = response.data;

        if (rowsUpdated > 0) {
          // console.log(`✅ ${rowsUpdated} ligne(s) mise(s) à jour avec succès`);
          await this.fetchListCvRecrut(recrut); // ✅ correction ici
        } else {
          console.warn("Aucune mise à jour effectuée (aucune ligne trouvée)");
        }
      } catch (error) {
        console.error("Erreur updatecvSelection:", error);
        alert(`Erreur: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async updatecvProposition(recrut, cv) {
      if (!recrut) {
        console.warn("updatecvEntretien appelé sans code recrutement");
        return;
      }
      if (!cv) {
        console.warn("updatecvEntretien appelé sans code CV");
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/updatecvProposition",
          {
            headers: { Authorization: sessionId },
            params: { recrut, cv },
          },
        );

        const rowsUpdated = response.data;

        if (rowsUpdated > 0) {
          // console.log(`✅ ${rowsUpdated} ligne(s) mise(s) à jour avec succès`);
          await this.fetchListCvRecrut(recrut); // ✅ correction ici
        } else {
          console.warn("Aucune mise à jour effectuée (aucune ligne trouvée)");
        }
      } catch (error) {
        console.error("Erreur updatecvSelection:", error);
        alert(`Erreur: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    // async updateValidationCandidat(recrut, cv, dateValidation) {
    //   if (!recrut) {
    //     console.warn("updateValdiation appelé sans code recrutement");
    //     return;
    //   }
    //   if (!cv) {
    //     console.warn("updateValdiation appelé sans code CV");
    //     return;
    //   }

    //   const sessionId = localStorage.getItem("sessionId");
    //   this.loading = true;
    //   const { handleLogout } = useLogout();

    //   try {
    //     const response = await axios.get(
    //       Config.SERVER_URL + "api/updatevalidation",
    //       {
    //         headers: { Authorization: sessionId },
    //         params: { recrut, cv , dateValidation },
    //       },
    //     );

    //     const rowsUpdated = response.data;

    //     if (rowsUpdated > 0) {
    //       // console.log(`✅ ${rowsUpdated} ligne(s) mise(s) à jour avec succès`);
    //       await this.fetchListCvRecrut(recrut); // ✅ correction ici
    //     } else {
    //       console.warn("Aucune mise à jour effectuée (aucune ligne trouvée)");
    //     }
    //   } catch (error) {
    //     console.error("Erreur updatecvSelection:", error);
    //     alert(`Erreur: ${error.message}`);
    //     await handleLogout();
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async updateValidationCandidat(recrut, cv, dateValidation,categorie) {
      if (!recrut || !cv) {
        console.warn("Paramètres manquants");
        return;
      }
      if (!dateValidation) {
        console.warn("updateValidation appelé sans date");
        return;
      }

      // Ensure yyyy-MM-dd, whether dateValidation is a Date object or already a string
      const formattedDate =
        dateValidation instanceof Date
          ? dateValidation.toISOString().split("T")[0]
          : dateValidation; // if it's already a string, make sure it's already yyyy-MM-dd

      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/updatevalidation",
          {
            headers: { Authorization: sessionId },
            params: { recrut, cv, dateValidation: formattedDate ,categorie},
          },
        );
        const rowsUpdated = response.data;
        if (rowsUpdated > 0) {
          await this.fetchListCvRecrut(recrut);
        } else {
          console.warn("Aucune mise à jour effectuée (aucune ligne trouvée)");
        }
      } catch (error) {
        console.error("Erreur updatecvSelection:", error);
        console.error("Détail serveur:", error.response?.data);
        alert(`Erreur: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async updatedatecvEntretien(date, recrut, cv) {
      if (!date) {
        console.warn("updatecvEntretien appelé sans date");
        return;
      }
      if (!recrut) {
        console.warn("updatecvEntretien appelé sans code recrutement");
        return;
      }
      if (!cv) {
        console.warn("updatecvEntretien appelé sans code CV");
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/updatedatecventretien",
          {
            headers: { Authorization: sessionId },
            params: { date, recrut, cv },
          },
        );

        const rowsUpdated = response.data;

        if (rowsUpdated > 0) {
          // console.log(`✅ ${rowsUpdated} ligne(s) mise(s) à jour avec succès`);
          await this.fetchListCvRecrut(recrut); // ✅ correction ici
        } else {
          console.warn("Aucune mise à jour effectuée (aucune ligne trouvée)");
        }
      } catch (error) {
        console.error("Erreur updatedatecvEntretien:", error);
        alert(`Erreur: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async updatedatecvProposition(date, recrut, cv) {
      if (!date) {
        console.warn("updatedatecvProposition appelé sans date");
        return;
      }
      if (!recrut) {
        console.warn("updatedatecvProposition appelé sans code recrutement");
        return;
      }
      if (!cv) {
        console.warn("updatedatecvProposition appelé sans code CV");
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/updatedatecvProposition",
          {
            headers: { Authorization: sessionId },
            params: { date, recrut, cv },
          },
        );

        const rowsUpdated = response.data;

        if (rowsUpdated > 0) {
          // console.log(`✅ ${rowsUpdated} ligne(s) mise(s) à jour avec succès`);
          await this.fetchListCvRecrut(recrut); // ✅ correction ici
        } else {
          console.warn("Aucune mise à jour effectuée (aucune ligne trouvée)");
        }
      } catch (error) {
        console.error("Erreur updatedatecvEntretien:", error);
        alert(`Erreur: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async updatedateValidation(date, recrut, cv) {
      if (!date) {
        console.warn("updatedateValidation appelé sans date");
        return;
      }
      if (!recrut) {
        console.warn("updatedateValidation appelé sans code recrutement");
        return;
      }
      if (!cv) {
        console.warn("updatedateValidation appelé sans code CV");
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/updatedatevalidation",
          {
            headers: { Authorization: sessionId },
            params: { date, recrut, cv },
          },
        );

        const rowsUpdated = response.data;

        if (rowsUpdated > 0) {
          // console.log(`✅ ${rowsUpdated} ligne(s) mise(s) à jour avec succès`);
          await this.fetchListCvRecrut(recrut); // ✅ correction ici
        } else {
          console.warn("Aucune mise à jour effectuée (aucune ligne trouvée)");
        }
      } catch (error) {
        console.error("Erreur updatedateValidation:", error);
        alert(`Erreur: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async fetchListCvGlobal() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listCVglobal",
          {
            headers: { Authorization: sessionId },
          },
        );
        const data = response.data;
        if (Array.isArray(data)) {
          this.listcv = data;
        } else {
          // console.error("Unexpected data structure:", data);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async fetchListCvGlobal1() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listCVglobal",
          {
            headers: { Authorization: sessionId },
          },
        );
        const data = response.data;
        if (Array.isArray(data)) {
          this.listcv1 = data;
        } else {
          console.error("Unexpected data structure:", data);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async updateCv(form) {
      const formData = new FormData();
      // Champs texte / dates / nombres
      formData.append("cv_code", form.CV_CODE);
      formData.append("cv_nom", form.CV_NOM);
      formData.append("cv_prenom", form.CV_PRENOM);
      formData.append("cv_contact1", form.CV_CONTACT1);
      formData.append("cv_contact_2", form.CV_CONTACT_2);
      formData.append("cv_email", form.CV_EMAIL);
      formData.append("cv_date", form.CV_DATE);

      // Fichier
      if (form.CV_CV && form.CV_CV instanceof File) {
        formData.append("cv_cv", form.CV_CV);
      }
      if (form.CV_MOTIVATION && form.CV_MOTIVATION instanceof File) {
        formData.append("cv_motivation", form.CV_MOTIVATION);
      }

      // console.log(formData);
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/updateCv",
          formData,
          {
            headers: {
              Authorization: sessionId,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(
          "Erreur update CV :",
          error.response?.data || error.message,
        );
        throw error;
      }
    },

    async insertCVTest(form) {
      const formData = new FormData();

      formData.append("cv_code", form.cvCode);
      formData.append("recru_code", form.recruCode);

      if (form.CV_LIGNE_DATE_TEST) {
        formData.append("cv_ligne_date_test", form.CV_LIGNE_DATE_TEST);
      }

      if (form.CV_LIGNE_DATE_ENTRETIEN) {
        formData.append(
          "cv_ligne_date_entretien",
          form.CV_LIGNE_DATE_ENTRETIEN,
        );
      }

      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/insertCVTest",
          formData,
          {
            headers: {
              Authorization: sessionId,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        return response.data;
      } catch (error) {
        console.error(
          "Erreur insertion test :",
          error.response?.data || error.message,
        );
        throw error;
      }
    },



    async fetchListCategorie() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listCategorie",
          {
            headers: { Authorization: sessionId },
          },
        );
        const data = response.data;
        if (Array.isArray(data)) {
          this.listcategories = data;
        } else {
          // console.error("Unexpected data structure:", data);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },


  },
});
