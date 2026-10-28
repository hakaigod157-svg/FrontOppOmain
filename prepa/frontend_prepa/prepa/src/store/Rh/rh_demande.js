import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useDemande = defineStore("listdemande", {
  state: () => ({
    listdemande: [],
    nouveaucode: [],
    donnesdemande: [],
    loading: false,
    params: {
      dossier: "",
    },
  }),
  actions: {
    async fetchListDemande(etat = null) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listDemandePers",
          {
            headers: { Authorization: sessionId },
            params: etat != null ? { etat } : undefined,
          },
        );

        // DEBUG : log raw response
        //console.log("fetchListDemande response.data:", response.data);

        // Vérifier si response.data est un array
        if (Array.isArray(response.data)) {
          this.listdemande = response.data.map((d) => ({ ...d }));
          //console.log("listdemande après fetch :", this.listdemande); // <-- ici
          //console.log("Liste des demandes (Proxy déréférencé) :", JSON.parse(JSON.stringify(this.listdemande)));
        } else if (response.data && Array.isArray(response.data?.target)) {
          this.listdemande = response.data.target.map((d) => ({ ...d }));
          //console.log("listdemande après fetch (Proxy target) :", this.listdemande); // <-- ici
        } else {
          this.listdemande = [];
          //console.log("listdemande vide après fetch :", this.listdemande); // <-- ici
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },
    async fetchCodeNouveau(prefixe, table) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/codenouveauDemande",
          { headers: { Authorization: sessionId }, params: { prefixe, table } },
        );
        const data = response.data;
        //console.log("fetchCodeNouveau response:", data);

        // Extraction correcte du code
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          Array.isArray(data[0]) &&
          data[0].length > 0
        ) {
          this.nouveaucode = data[0][0].codenouveaudemande || "";
        } else {
          this.nouveaucode = "";
          //console.error("Structure inattendue pour le code nouveau :", data);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },
    async insertDemande(form) {
      const formData = new FormData();

      // Champs texte / dates / nombres
      formData.append("demande_code", form.DEMANDE_CODE);
      formData.append("demande_date", form.DEMANDE_DATE);
      formData.append("demande_prise_fonction", form.DEMANDE_PRISE_FONCTION);
      formData.append("demande_departement", form.DEMANDE_DEPARTEMENT);
      formData.append("demande_motif", form.DEMANDE_MOTIF);
      formData.append("demande_contrat", form.DEMANDE_CONTRAT);
      formData.append("demande_poste", form.DEMANDE_POSTE);
      formData.append("demande_effectif", form.DEMANDE_EFFECTIF);
      formData.append("demande_etat", form.DEMANDE_ETAT);

      // Fichier
      if (form.DEMANDE_FICHE && form.DEMANDE_FICHE instanceof File) {
        formData.append("demande_fiche", form.DEMANDE_FICHE);
      }

      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/insertDemande",
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
          "Erreur insertion demande :",
          error.response?.data || error.message,
        );
        throw error;
      }
    },

    async updateEtatDemande(codeDemande) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/updateEtatDemande",
          null, // pas de body, car c’est @RequestParam
          {
            headers: { Authorization: sessionId },
            params: { codeDemande },
          },
        );
        // console.log("updateEtatDemande response:", response.data);

        // Mettre à jour localement l'état dans la liste
        const demande = this.listdemande.find(
          (d) => d.demande_code === codeDemande,
        );
        if (demande) {
          demande.demande_etat = 1; // Approuvé
        }
      } catch (error) {
        alert(`Erreur lors de la mise à jour: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },
    async updateEtatDemande2(codeDemande) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/updateEtatDemande2",
          null, // pas de body, car c’est @RequestParam
          {
            headers: { Authorization: sessionId },
            params: { codeDemande },
          },
        );
        console.log("updateEtatDemande response:", response.data);

        // Mettre à jour localement l'état dans la liste
        const demande = this.listdemande.find(
          (d) => d.demande_code === codeDemande,
        );
        if (demande) {
          demande.demande_etat = 0; // Approuvé
        }
      } catch (error) {
        alert(`Erreur lors de la mise à jour: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async fetchDepartementPostes() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/departement-poste",
          { headers: { Authorization: sessionId } },
        );
        const data = response.data;

        // Regroupement par département
        const grouped = {};
        data.forEach((item) => {
          if (!grouped[item.code_departement]) {
            grouped[item.code_departement] = {
              code_departement: item.code_departement,
              lib_departement: item.lib_departement,
              postes: [],
            };
          }
          grouped[item.code_departement].postes.push({
            code_poste: item.code_poste,
            poste_libelle: item.poste_libelle,
          });
        });

        this.donnesdemande = Object.values(grouped); // front
        //console.log("Departements groupés:", this.donnesdemande);
      } catch (error) {
        alert(`Erreur fetch departement-poste: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },
    async updateDemande(form) {
      const formData = new FormData();
      // Champs texte / dates / nombres
      formData.append("demande_code", form.DEMANDE_CODE);
      formData.append("demande_date", form.DEMANDE_DATE);
      formData.append("demande_prise_fonction", form.DEMANDE_PRISE_FONCTION);
      formData.append("demande_departement", form.DEMANDE_DEPARTEMENT);
      formData.append("demande_motif", form.DEMANDE_MOTIF);
      formData.append("demande_contrat", form.DEMANDE_CONTRAT);
      formData.append("demande_poste", form.DEMANDE_POSTE);
      formData.append("demande_effectif", form.DEMANDE_EFFECTIF);

      // Fichier
      if (form.DEMANDE_FICHE && form.DEMANDE_FICHE instanceof File) {
        formData.append("demande_fiche", form.DEMANDE_FICHE);
      }

      console.log(formData);
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/updateDemande",
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
          "Erreur update demande :",
          error.response?.data || error.message,
        );
        throw error;
      }
    },

    async deleteDemande(codeDemande) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/deleteDemande",
          null, // pas de body, car c’est @RequestParam
          {
            headers: { Authorization: sessionId },
            params: { codeDemande },
          },
        );
        // console.log("deleteDemande response:", response.data);
      } catch (error) {
        alert(`Erreur lors de la suppression: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async updateDateFinCdd(demandeCode, moisFinCDD) {
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/updateDateFinCdd",
          null,
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              demandeCode,
              moisFinCDD,
            },
          },
        );

        console.log("Réponse updateDateFinCdd :", response.data);

        return response.data;
      } catch (error) {
        console.error("Erreur updateDateFinCdd :", error);
        console.error("Status :", error.response?.status);
        console.error("Response :", error.response?.data);

        throw error;
      }
    },
  },
});
