import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const uselistDossier = defineStore("listdossier", {
  state: () => ({
    listdossiers: [],
    listnumdossiers: [],
    listtitulaires: [],
    listarticledetails: [],
    listetapedetails: [],
    listdossierafournirs: [],
    listactions: [],
    etapeLists: [],
    fournirLists: [],
    listHistos: [],
    listAllFournirs: [],
    listGens: [],
    listSpes: [],
    listMotifs: [],
    listnumdss: [],
    listReclams: [],
    listVariations: [],
    reclamationLists: [],
    listAmmdossiers: [],
    listRespos: [],
    listArticleLiers: [],
    listTitulaireAmms: [],
    listRenouveler: [],

    loading: false,

    params: {
      dossier: "",
      labo: "",
    },
  }),

  actions: {
    // async fetchListDossier(labo) {
    //   const sessionId = localStorage.getItem("sessionId");
    //   this.loading = true;
    //   const { handleLogout } = useLogout();
    //   try {
    //     const response = await axios.get(
    //       Config.SERVER_URL + "api/listDossier",
    //       {
    //         headers: {
    //           Authorization: sessionId,
    //         },
    //         params: {
    //           labo,
    //         },
    //       },
    //     );
    //     if (Array.isArray(response.data)) {
    //       this.listdossiers = response.data;
    //     } else {
    //       this.listdossiers = [];
    //     }

    //     this.loading = false;
    //   } catch (error) {
    //     alert(`Error: ${error.message}
    //       Method: ${error.config?.method.toUpperCase()}
    //       URL: ${error.config?.url}`);
    //     await handleLogout();
    //     console.log(error);
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async fetchListDossier(labo) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;

      const { handleLogout } = useLogout();

      console.time("API listDossier");

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listDossier",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              labo,
            },
          },
        );

        console.timeEnd("API listDossier");

        console.log("Nombre de dossiers :", response.data?.length);

        if (Array.isArray(response.data)) {
          this.listdossiers = response.data;
        } else {
          this.listdossiers = [];
        }
      } catch (error) {
        console.timeEnd("API listDossier");

        alert(`Error: ${error.message}
Method: ${error.config?.method?.toUpperCase()}
URL: ${error.config?.url}`);

        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async insertDossier(codeAmm, list) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        for (const article of list) {
          const response = await axios.post(
            Config.SERVER_URL + "api/insert_dossier",
            {}, // body vide
            {
              headers: { Authorization: sessionId },
              params: {
                codeAmm: codeAmm,
                codeArticle: article.code,
                libelle: article.libelle,
                fab_code: article.fab_code,
                focode: article.focode,
                // user:user,
                // type: article.types,
              },
            },
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    // async insertDossierSelected(codeAmm, responsable, type, classification ,list_variation) {
    //   const sessionId = localStorage.getItem("sessionId");
    //   this.loading = true;
    //   const { handleLogout } = useLogout();
    //   try {
    //     for (const variation of list_variation) {
    //     const response = await axios.post(
    //       Config.SERVER_URL + "api/insertAmm_dossier",
    //       {},
    //       {
    //         headers: {
    //           Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
    //         },
    //         params: {
    //           codeAmm,
    //           responsable,
    //           type,
    //           classification,
    //           ref_variation: variation.ref_variation,
    //         },
    //       }
    //     );
    //     this.loading = false;
    //   }
    //   } catch (error) {
    //     alert(`Error: ${error.message}
    //       Method: ${error.config?.method.toUpperCase()}
    //       URL: ${error.config?.url}`);
    //     await handleLogout();
    //     console.log(error);
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async insertDossierSelected(
      codeAmm,
      responsable,
      type,
      classification,
      ref_variation,
    ) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        // 🧩 Si aucune variation : insérer directement le dossier
        if (!ref_variation) {
          await axios.post(
            Config.SERVER_URL + "api/insertAmm_dossier",
            {},
            {
              headers: {
                Authorization: sessionId,
              },
              params: {
                codeAmm,
                responsable,
                type,
                classification,
                ref_variation: null, // ou undefined selon ton backend
              },
            },
          );
          this.loading = false;
          return;
        }

        // 🧩 Sinon, boucler sur les variations
        else {
          await axios.post(
            Config.SERVER_URL + "api/insertAmm_dossier",
            {},
            {
              headers: {
                Authorization: sessionId,
              },
              params: {
                codeAmm,
                responsable,
                type,
                classification,
                ref_variation,
              },
            },
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}
      Method: ${error.config?.method.toUpperCase()}
      URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async insertLigneVaraiation(codeAmm, list_variation) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        for (const variation of list_variation) {
          const response = await axios.post(
            Config.SERVER_URL + "api/insertLigneVariation",
            {},
            {
              headers: {
                Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
              },
              params: {
                codeAmm,
                libelle_variation: variation.libelle_variation,
              },
            },
          );
          this.loading = false;
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchNumDossier(prefixe, nom_table) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listNumDossier",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              prefixe,
              nom_table,
            },
          },
        );
        const data = response.data;
        if (Array.isArray(data) && data.length === 1) {
          this.listnumdossiers = data[0];
        } else {
          console.error(
            "Unexpected data structure in fetchPerf response:",
            data,
          );
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchListTitulaire() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listTitulaire",
          {
            headers: {
              Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.listtitulaires = response.data;
        } else {
          this.listtitulaires = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchListArticleDetail(dossier) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listArticleDetail",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              dossier,
            },
          },
        );
        const data = response.data;
        if (Array.isArray(data) && data.length === 6) {
          this.listarticledetails = data[0];
          this.listetapedetails = data[1];
          this.listdossierafournirs = data[2];
          this.listHistos = data[3];
          this.listReclams = data[4];
          this.listVariations = data[5];
          // this.listactions = data[3];
        } else {
          console.error(
            "Unexpected data structure in fetchPerf response:",
            data,
          );
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async getEtapeList(ammCode) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/listEtape", {
          headers: {
            Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: {
            ammCode,
          },
        });
        if (Array.isArray(response.data)) {
          this.etapeLists = response.data;
        } else {
          this.etapeLists = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async insertEtape(codeAmm, Etat, listEtapes) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        for (const e of listEtapes) {
          const response = await axios.post(
            Config.SERVER_URL + "api/insertAmm_dossier_etape",
            {}, // body vide
            {
              headers: { Authorization: sessionId },
              params: {
                codeAmm: codeAmm,
                Etat: Etat,
                Etape: e.etape,
                dateNew: e.date,
              },
            },
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async getListFournir(ammCode) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listFournir",
          {
            headers: {
              Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
            },
            params: {
              ammCode,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.fournirLists = response.data;
        } else {
          this.fournirLists = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async insertFournir(codeAmm, list) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        for (const item of list) {
          await axios.post(
            Config.SERVER_URL + "api/insertLigneDossier",
            {}, // body vide
            {
              headers: {
                Authorization: sessionId,
              },
              params: {
                codeAmm,
                codeDossier: item.ligne_dossier_code, // envoie la valeur reçue du front
                date_fournir: item.ligne_date,
              },
            },
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async updateDossier(dossierCode, type_update, respo_update, class_update) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updateDossier",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              dossierCode,
              type_update,
              respo_update,
              class_update,
            },
          },
        );
        this.data = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
                              Method: ${error.config?.method.toUpperCase()}
                              URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false; // Set loading indicator back to false
      }
    },

    async updateEtape(ds_code, dateUpdate, etape) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updateEtape",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              ds_code,
              dateUpdate,
              etape,
            },
          },
        );
        this.data = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
                              Method: ${error.config?.method.toUpperCase()}
                              URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false; // Set loading indicator back to false
      }
    },

    async insertHisto(codeAmm, list) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        for (const histo of list) {
          const response = await axios.post(
            Config.SERVER_URL + "api/insert_histo",
            {}, // body vide
            {
              headers: { Authorization: sessionId },
              params: {
                codeAmm: codeAmm,
                date: histo.amm_histo_date,
                commentaire: histo.amm_histo_comment,
              },
            },
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async insertVariation(codeAmm, list) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        for (const variation of list) {
          const response = await axios.post(
            Config.SERVER_URL + "api/insert_variation",
            {}, // body vide
            {
              headers: { Authorization: sessionId },
              params: {
                codeAmm: codeAmm,
                libelle_variation: variation.var_libelle,
              },
            },
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async updateFournir(ds_code, dateUpdate, dossierLcode) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updateFournir",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              ds_code,
              dateUpdate,
              dossierLcode,
            },
          },
        );
        this.data = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
                              Method: ${error.config?.method.toUpperCase()}
                              URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false; // Set loading indicator back to false
      }
    },

    async fetchAllListAFournir(libelle) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/allDossierList",
          {
            headers: {
              Authorization: sessionId,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.listAllFournirs = response.data;
        } else {
          this.listAllFournirs = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async insertDocFournir(dossier_code, dossier_lib) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/insertDossierFournir",
          {},
          {
            headers: {
              Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
            },
            params: {
              dossier_code,
              dossier_lib,
            },
          },
        );
        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    // async updateAmmDossier(ds_code, decision, date, text) {
    //   const { handleLogout } = useLogout();
    //   const sessionId = localStorage.getItem("sessionId");
    //   try {
    //     this.loading = true; // Set loading indicator to true
    //     const response = await axios.post(
    //       Config.SERVER_URL + "api/updateAmmDossier",
    //       null,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: sessionId,
    //         },
    //         params: {
    //           ds_code,
    //           decision,
    //           date,
    //           text,
    //         },
    //       },
    //     );
    //     this.data = response.data;
    //   } catch (error) {
    //     alert(`Error: ${error.message}
    //                           Method: ${error.config?.method.toUpperCase()}
    //                           URL: ${error.config?.url}`);
    //     await handleLogout();
    //     console.log(error);
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async updateAmmDossier(ds_code, decision, date, text) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      try {
        this.loading = true;

        const params = {
          ds_code,
          decision,
        };

        if (date != null) {
          params.date = date;
        }

        if (text != null) {
          params.text = text;
        }

        const response = await axios.post(
          Config.SERVER_URL + "api/updateAmmDossier",
          null,
          {
            headers: {
              Authorization: sessionId,
            },
            params,
          },
        );

        this.data = response.data;
      } catch (error) {
        console.log("Erreur API :", error.response?.data);
        console.log("Status :", error.response?.status);
        console.log("URL :", error.config?.url);
        console.log("Params :", error.config?.params);

        alert(`Error: ${error.message}
Method: ${error.config?.method?.toUpperCase()}
URL: ${error.config?.url}`);

        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async insertDossierDefaut(type_dossier, list) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;

      try {
        for (const classification of list) {
          const response = await axios.post(
            Config.SERVER_URL + "api/insert_dossier_defaut",
            {}, // body vide
            {
              headers: { Authorization: sessionId },
              params: {
                type_dossier,
                code_dossier: classification.dossier_code,
                lib_dossier: classification.dossier_lib,
                classification: classification.classification,
              },
            },
          );
        }
      } catch (error) {
        console.error("Erreur insert dossier :", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchListGen() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(Config.SERVER_URL + "api/list_gen", {
          headers: {
            Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
          },
        });
        if (Array.isArray(response.data)) {
          this.listGens = response.data;
        } else {
          this.listGens = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchListSpe() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/list_spe", {
          headers: {
            Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
          },
        });
        if (Array.isArray(response.data)) {
          this.listSpes = response.data;
        } else {
          this.listSpes = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchDeleteFournir(dossier_code) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.delete(
          Config.SERVER_URL + "api/delete_fournir",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              dossier_code,
            },
          },
        );
        this.loading = false;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async deleteDossierDefaut(list) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        for (const dossier of list) {
          const response = await axios.delete(
            Config.SERVER_URL + "api/delete_dossier_defaut",
            {
              headers: { Authorization: sessionId },
              params: {
                classification: dossier.classification,
                ds_code: dossier.dossier_code,
                type_dossier: dossier.type_dossier,
              },
            },
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async getListMotif(ammCode) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/listMotif", {
          headers: {
            Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: {
            ammCode,
          },
        });
        if (Array.isArray(response.data)) {
          this.listMotifs = response.data;
        } else {
          this.listMotifs = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchNumDS(dossier, etat) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/listNumDS", {
          headers: {
            Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
          },
          params: {
            dossier,
            etat,
          },
        });
        if (Array.isArray(response.data)) {
          this.listnumdss = response.data;
        } else {
          this.listnumdss = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async insertReclamation(code_ds, list, nbre_reclam, date_nbre_reclam) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        for (const item of list) {
          const response = await axios.post(
            Config.SERVER_URL + "api/insert_reclam",
            {}, // body vide
            {
              headers: { Authorization: sessionId },
              params: {
                code_ds: code_ds,
                reclamation_code: item.code,
                date_reclam: item.date_reclam,
                nbre_reclam: nbre_reclam,
                date_nbre_reclam: date_nbre_reclam,
              },
            },
          );
        }
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchListAmmDossier(ammCode) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/list_amm_dossier",
          {
            headers: {
              Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
            },
            params: {
              ammCode,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.listAmmdossiers = response.data;
        } else {
          this.listAmmdossiers = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async updateAmmDosReclam(ds_code, date_reclam) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updateAmmDosReclam",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              ds_code,
              date_reclam,
            },
          },
        );
        this.data = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
                              Method: ${error.config?.method.toUpperCase()}
                              URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false; // Set loading indicator back to false
      }
    },

    async getListReclamation(ammCode) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/list_reclam_detail",
          {
            headers: {
              Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
            },
            params: {
              ammCode,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.reclamationLists = response.data;
        } else {
          this.reclamationLists = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    // async updateReclam(ds_code, dateUpdate, code_lib , annule_reclam) {
    //   const { handleLogout } = useLogout();
    //   const sessionId = localStorage.getItem("sessionId");
    //   try {
    //     this.loading = true; // Set loading indicator to true
    //     const response = await axios.post(
    //       Config.SERVER_URL + "api/updateReclam",
    //       null,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: sessionId,
    //         },
    //         params: {
    //           ds_code,
    //           dateUpdate,
    //           code_lib,
    //           annule_reclam,
    //         },
    //       }
    //     );
    //     this.data = response.data;
    //   } catch (error) {
    //     alert(`Error: ${error.message}
    //                           Method: ${error.config?.method.toUpperCase()}
    //                           URL: ${error.config?.url}`);
    //     await handleLogout();
    //     console.log(error);
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async updateReclam(ds_code, dateUpdate, code_lib, annule_reclam) {
      const sessionId = localStorage.getItem("sessionId");

      try {
        // On prépare les paramètres dynamiquement
        const params = new URLSearchParams();

        if (dateUpdate !== undefined && dateUpdate !== null)
          params.append("dateUpdate", dateUpdate);

        params.append("ds_code", ds_code);
        params.append("code_lib", code_lib);

        // ⚠️ On n’ajoute annule_reclam QUE s’il a été explicitement défini (clic sur Annuler)
        if (typeof annule_reclam !== "undefined" && annule_reclam !== null) {
          params.append("annule_reclam", annule_reclam);
        }

        // Requête vers le backend
        const response = await axios.post(
          Config.SERVER_URL + "api/updateReclam",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: sessionId,
            },
          },
        );

        // console.log("✅ Update réussie :", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Erreur lors de l'update :", error);
        throw error;
      }
    },

    async fetchListReclam() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/list_type_reclam",
          {
            headers: {
              Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.listReclams = response.data;
        } else {
          this.listReclams = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchListRespo() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/list_respo", {
          headers: {
            Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
          },
        });
        if (Array.isArray(response.data)) {
          this.listRespos = response.data;
        } else {
          this.listRespos = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async updateAmmLigneArticle(ds_code, num_Amm, date_Amm, seq) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updateAmmLigneArticle",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              ds_code,
              num_Amm,
              date_Amm,
              seq,
            },
          },
        );
        this.data = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
                              Method: ${error.config?.method.toUpperCase()}
                              URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false; // Set loading indicator back to false
      }
    },

    // async fetchListArticleLier(titulaire) {
    //   const sessionId = localStorage.getItem("sessionId");
    //   this.loading = true;
    //   const { handleLogout } = useLogout();
    //   try {
    //     const response = await axios.get(
    //       Config.SERVER_URL + "api/listArticleLier",
    //       {
    //         headers: {
    //           Authorization: sessionId, // Ajouter l'ID de session dans l'en-tête Authorization
    //         },
    //         params: {
    //           titulaire,
    //         },
    //       }
    //     );
    //     if (Array.isArray(response.data)) {
    //       this.listArticleLiers = response.data;
    //     } else {
    //       this.listArticleLiers = [];
    //     }

    //     this.loading = false;
    //   } catch (error) {
    //     alert(`Error: ${error.message}
    //       Method: ${error.config?.method.toUpperCase()}
    //       URL: ${error.config?.url}`);
    //     await handleLogout();
    //     console.log(error);
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async fetchListArticleLier(titulaire, type) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listArticleLier",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              // Envoie la valeur ou 'null' si elle est null
              titulaire: titulaire !== null ? titulaire : null,
              type,
            },
          },
        );

        if (Array.isArray(response.data)) {
          this.listArticleLiers = response.data;
        } else {
          this.listArticleLiers = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
      Method: ${error.config?.method.toUpperCase()}
      URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async updateLigneArticle(seq, ds_code, codeArticle) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updateCodeArticleLigneArticle",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              seq,
              ds_code,
              codeArticle,
            },
          },
        );
        this.data = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
                              Method: ${error.config?.method.toUpperCase()}
                              URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false; // Set loading indicator back to false
      }
    },

    async updateLigneArticleImage(seq, image) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      const formData = new FormData();
      formData.append("seq", seq);
      formData.append("image", image); // image = File

      try {
        this.loading = true;

        const response = await axios.post(
          Config.SERVER_URL + "api/updateImage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: sessionId,
            },
          },
        );

        this.data = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchListTitulaireAmm() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listTitulaireAmm",
          {
            headers: {
              Authorization: sessionId,
            },
          },
        );

        if (Array.isArray(response.data)) {
          this.listTitulaireAmms = response.data;
        } else {
          this.listTitulaireAmms = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
      Method: ${error.config?.method.toUpperCase()}
      URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchListArenouveler(type) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listArenouveler",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              type: type,
            },
          },
        );

        if (Array.isArray(response.data)) {
          this.listRenouveler = response.data;
        } else {
          this.listRenouveler = [];
        }

        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
      Method: ${error.config?.method.toUpperCase()}
      URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async InsertReclam(ammDsCode, list) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;

      try {
        for (const item of list) {
          await axios.post(
            Config.SERVER_URL + "api/insertAmmReclam",
            {}, // body vide, car tu utilises params
            {
              headers: { Authorization: sessionId },
              params: {
                ds_code: ammDsCode,
                code_reclam: item.amm_recl_recl,
                date_reclam: item.date,
                nb_reclam: item.nb_reclam,
              },
            },
          );
        }
      } catch (error) {
        alert(`Erreur: ${error.message}
          Méthode: ${error.config?.method?.toUpperCase()}
          URL: ${error.config?.url}`);
        console.error(error);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async fetchFicheArtWork(amm_ds_code,ligne_code_article,ligne_libelle_article,) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;

      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/ficheArtWork",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              amm_ds_code,
              ligne_code_article,
              ligne_libelle_article,
            },
          },
        );

        // console.log("Artwork récupéré :", response.data);

        return response.data;
      } catch (error) {
        console.timeEnd("API ficheArtWork");

        alert(`Error: ${error.message}
          Method: ${error.config?.method?.toUpperCase()}
          URL: ${error.config?.url}`);

        await handleLogout();
        console.log(error);

        throw error;
      } finally {
        this.loading = false;
      }
    },

  },
});
