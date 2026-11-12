import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useFormation = defineStore("listformation", {
  state: () => ({
    nouveaucode: [],
    loading: false,
    listformations: [],
    listFormParams: [],
    listDetailParamsFormations: [],
    params: {
      dossier: "",
    },
  }),
  actions: {
    async fetchCodeNouveau(prefixe, table) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/form_code", {
          headers: { Authorization: sessionId },
          params: { prefixe, table },
        });
        const data = response.data;
        //console.log("fetchCodeNouveau response:", data);

        // Extraction correcte du code
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          Array.isArray(data[0]) &&
          data[0].length > 0
        ) {
          this.nouveaucode = data[0][0].codenouveauformation || "";
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

    async fetchListFormation() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listFormation",
          {
            headers: { Authorization: sessionId },
          },
        );
        const data = response.data;
        if (Array.isArray(data)) {
          this.listformations = data;
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

    async insertFormation(
      form_code,
      form_date,
      form_type,
      form_interne,
      form_entite,
      form_descr,
      form_fichier = null, // File : image ou PDF
    ) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();

      // Validation du fichier (image ou PDF, 5 Mo max comme dans le composant)
      if (form_fichier) {
        const estImage = form_fichier.type?.startsWith("image/");
        const estPdf =
          form_fichier.type === "application/pdf" ||
          form_fichier.name?.toLowerCase().endsWith(".pdf");

        if (!estImage && !estPdf) {
          return {
            success: false,
            message: "Seuls les fichiers image et PDF sont autorisés.",
          };
        }
        if (form_fichier.size > 5 * 1024 * 1024) {
          return { success: false, message: "Fichier trop volumineux (max 5 Mo)." };
        }
      }

      this.loading = true;

      const formData = new FormData();
      formData.append("form_code", form_code ?? "");
      formData.append("form_date", form_date ?? "");
      formData.append("form_type", form_type ?? "");
      formData.append("form_interne", form_interne ?? 0);
      formData.append("form_entite", form_entite ?? "");
      formData.append("form_descr", form_descr ?? "");
      if (form_fichier) {
        // Nom du champ gardé "form_image" pour ne pas casser le backend
        formData.append("form_image", form_fichier, form_fichier.name);
      }

      const url = Config.SERVER_URL + "api/insert_Formation";

      try {
        // Ne PAS fixer Content-Type : le navigateur ajoute le boundary multipart
        const response = await axios.post(url, formData, {
          headers: { Authorization: sessionId },
        });

        if (response.status === 201) {
          return { success: true, message: response.data };
        }
        return { success: false, message: response.data };
      } catch (error) {
        console.error("[insertFormation] Erreur :", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          champsEnvoyes: Object.fromEntries(
            [...formData.entries()].map(([k, v]) => [
              k,
              v instanceof File ? `File(${v.name}, ${v.size} o, ${v.type})` : v,
            ]),
          ),
        });

        if (error.response && error.response.status === 401) {
          alert(`Error: ${error.message}`);
          await handleLogout();
        }
        return {
          success: false,
          message: error.response?.data || error.message,
        };
      } finally {
        this.loading = false;
      }
    },







    

    async insertFormationLignes(form_code, date, participants) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      const url = Config.SERVER_URL + "api/insert_FormationLigne";

      try {
        for (const p of participants) {
          // Paramètres envoyés vers la base pour chaque participant
          const params = {
            matricule: p.matricule,
            date,
            form_code,
            form_post: p.post,
          };

          try {
            const response = await axios.post(url, null, {
              headers: { Authorization: sessionId },
              params,
            });

            if (response.status !== 201) {
              return { success: false, message: response.data, ligne: params };
            }
          } catch (error) {
            console.error("[insertFormationLignes] Erreur :", {
              status: error.response?.status,
              data: error.response?.data,
              message: error.message,
              paramsEnvoyes: params,
            });

            if (error.response && error.response.status === 401) {
              alert(`Error: ${error.message}`);
              await handleLogout();
            }
            return {
              success: false,
              message: error.response?.data || error.message,
              ligne: params,
            };
          }
        }

        return { success: true, message: "Lignes insérées" };
      } finally {
        this.loading = false;
      }
    },

    //API AFFICHAGE TABLEAU ONGLET FORMATION
    async fetchListFormParams() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listFormParams",
          {
            headers: { Authorization: sessionId },
          },
        );
        const data = response.data;
        if (Array.isArray(data)) {
          this.listFormParams = data;
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

    // Affichage Détail Formation dans onglet params Formation
    async fetchListDetailParamsFormation(code) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listDetailParamsFormation",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              code,
            },
          },
        );

        const data = response.data;

        // Cas où l'API renvoie un tableau de listes (comme listDetailIntegr)
        if (Array.isArray(data) && data.length === 1) {
          this.listDetailParamsFormations = data[0];
        } else {
          console.error(
            "Unexpected data structure in fetchListDetailParamsFormation response:",
            data,
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}
               Method: ${error.config?.method?.toUpperCase()}
               URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    //update image dans détail employé :
    async updateFicheEval(formCode, formMatrLigne, date, file) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      const formData = new FormData();
      formData.append("form_code", formCode);
      formData.append("form_matr_ligne", formMatrLigne);
      formData.append("date", date); // yyyy-MM-dd
      formData.append("file", file); // file = File

      try {
        this.loading = true;

        const response = await axios.post(
          Config.SERVER_URL + "api/updateFicheEval",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: sessionId,
            },
          },
        );

        this.data = response.data;
        return true;
      } catch (error) {
        alert(`Error: ${error.message}
      Method: ${error.config?.method.toUpperCase()}
      URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Get Affichage du fichier :

    async fetchFicheEval(formCode, formMatrLigne) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      try {
        this.loading = true;

        const response = await axios.get(
          Config.SERVER_URL + "api/getFicheEval", // à adapter à ta route
          {
            params: {
              form_code: formCode,
              form_matr_ligne: formMatrLigne,
            },
            headers: {
              Authorization: sessionId,
            },
          },
        );

        return response.data; // chaîne HEX, base64 ou data URL
      } catch (error) {
        alert(`Error: ${error.message}
      Method: ${error.config?.method.toUpperCase()}
      URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateFicheEvalFroid(formCode, formMatrLigne, date, file) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      const formData = new FormData();
      formData.append("form_code", formCode);
      formData.append("form_matr_ligne", formMatrLigne);
      formData.append("date", date); // yyyy-MM-dd
      formData.append("file", file); // file = File

      try {
        this.loading = true;

        const response = await axios.post(
          Config.SERVER_URL + "api/updateFicheEvalFroid",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: sessionId,
            },
          },
        );

        this.data = response.data;
        return true;
      } catch (error) {
        alert(`Error: ${error.message}
      Method: ${error.config?.method.toUpperCase()}
      URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchFicheEvalFroid(formCode, formMatrLigne) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      try {
        this.loading = true;

        const response = await axios.get(
          Config.SERVER_URL + "api/getFicheEvalFroid", // à adapter à ta route
          {
            params: {
              form_code: formCode,
              form_matr_ligne: formMatrLigne,
            },
            headers: {
              Authorization: sessionId,
            },
          },
        );

        return response.data; // chaîne HEX, base64 ou data URL
      } catch (error) {
        alert(`Error: ${error.message}
      Method: ${error.config?.method.toUpperCase()}
      URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
        return null;
      } finally {
        this.loading = false;
      }
    },



    async fetchFicheParticipant(formCode) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      try {
        this.loading = true;

        const response = await axios.get(
          Config.SERVER_URL + "api/getFicheFormation", 
          {
            params: {
              form_code: formCode,
            },
            headers: {
              Authorization: sessionId,
            },
          },
        );

        return response.data; // chaîne HEX, base64 ou data URL
      } catch (error) {
        alert(`Error: ${error.message}
      Method: ${error.config?.method.toUpperCase()}
      URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
        return null;
      } finally {
        this.loading = false;
      }
    },












  },
});
