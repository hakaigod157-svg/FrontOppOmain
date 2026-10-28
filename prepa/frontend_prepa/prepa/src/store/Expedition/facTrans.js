import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useFactTransStore = defineStore("factTrans", {
  state: () => ({
    loading: false,
    retour: null,
    attributions: [],
    listTransFactL: [],
    detailLvs: [],
    myLv: [],
    detailNbCmds: [],
    params: {
      dateDeb: null,
      dateFin: null,
      livraison: null,
      commande: null,
      date: null,
      chauf: null,
      voit: null,
      saisie: null,
    },
    type_ctrls: [],
    list_livraisons: [],
    type_prepas: [],
    type_factures: [],
    type_encours_totals: [],
    type_atte_livraisons: [],
    details: [],
    list_params: [],
    list_params_adrs: [],
    dureeLV: [],
    list_attribAxes: [],
    list_modes: [],
    list_axes: [],
    list_classifications: [],
    testAvAddLiv_list: [],
    listSituationCmdAxe: [],
    listVoit: [],
    listAtteLiv: [],
    list_Indlivraisons: [],
    list_IndChauffeurs: [],
    isLivs: false,
    isAtteLivs: false,
    HeadersChauf:[],
    resultData:[],
    listDetailEditionLvs:[],
  }),

  actions: {
    async insertFacTrans(formData) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/insertTrans_facture",
          formData,
          {
            headers: {
              Authorization: sessionId,
              "Content-Type": "multipart/form-data",
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

    async insertFacTrans_L(formData) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/insertTrans_facture_L",
          formData,
          {
            headers: {
              Authorization: sessionId,
              "Content-Type": "multipart/form-data",
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

    async updateFacTrans(formData) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updateTrans_facture",
          formData,
          {
            headers: {
              Authorization: sessionId,
              "Content-Type": "multipart/form-data",
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

    async fetchListAttributionLvs(transporteurCode, dateDeb, dateFin) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listAttributionLv",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              transporteurCode,
              dateDeb,
              dateFin,
            },
          },
        );
        if (response.data.length > 0) {
          this.attributions = response.data;
        } else {
          this.attributions = [];
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

    async fetchlistTrans_Liv_L(code) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listTrans_Liv_L",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              code,
            },
          },
        );
        if (response.data.length > 0) {
          this.listTransFactL = response.data;
        } else {
          this.listTransFactL = [];
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

    async fetchTest_attrib_liv(liv, transport) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/test_attrib_liv",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              liv,
              transport,
            },
          },
        );
        this.retour = response.data;
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

    async fetchDeleteTransFact(code, liv) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.delete(
          Config.SERVER_URL + "api/deleteFact_TransL",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              code,
              liv,
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

    async updateTransValide(trans_code) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updateTrans_valide",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              trans_code,
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

    async fetchDetail_lv(newItem, type) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.get(Config.SERVER_URL + "api/detail_lv", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            newItem,
            type,
          },
        });
        this.detailLvs = response.data;
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

    async ajout_lv(lv) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.get(Config.SERVER_URL + "api/ajout_lv", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            lv,
          },
        });
        this.myLv = response.data;
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

    async fetchListDetailNbCmd(code_ft, type) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/detail_nb_cmd",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              code_ft,
              type,
            },
          },
        );
        this.detailNbCmds = response.data;
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

    async fetchEditionLv(livraison, commande, date, chauf, voit, saisie) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.get(Config.SERVER_URL + "api/edition_lv", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            livraison,
            commande,
            date,
            chauf,
            voit,
            saisie,
          },
        });
        if (response.data.length > 0) {
          this.listLv = response.data;
        } else {
          this.listLv = [];
        }
      } catch (error) {
        alert(`Error: ${error.message}
        Method: ${error.config?.method?.toUpperCase?.()}
        URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchParams(code_client) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.get(Config.SERVER_URL + "api/params_lv", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            code_client,
          },
        });
        if (response.data.length > 0) {
          this.list_params = response.data;
        } else {
          this.list_params = [];
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

    async fetchParamsLv(seq) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/params_lv_seq",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              seq,
            },
          },
        );
        if (response.data.length > 0) {
          this.list_params_adrs = response.data;
        } else {
          this.list_params_adrs = [];
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

    async supprimerCases(code_client, resultats) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;

      try {
        for (const item of resultats) {
          const response = await axios.delete(
            Config.SERVER_URL + "api/delete_params",
            {
              headers: { Authorization: sessionId },
              params: {
                code_client: code_client,
                jour: item.jour,
                heure: item.heure,
              },
            },
          );
          // Optionnel : log du succès
          console.log(
            `✅ Supprimé : jour=${item.jour}, heure=${item.heure}`,
            response.data,
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

    async supprimerCasesAdr(seq, code_client, resultats) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;

      try {
        for (const item of resultats) {
          const response = await axios.delete(
            Config.SERVER_URL + "api/delete_paramsAdr",
            {
              headers: { Authorization: sessionId },
              params: {
                seq: seq,
                code_client: code_client,
                jour: item.jour,
                heure: item.heure,
              },
            },
          );
          // Optionnel : log du succès
          console.log(
            `✅ Supprimé : jour=${item.jour}, heure=${item.heure}`,
            response.data,
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

    async insertCases(code_client, inserts) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      try {
        this.loading = true; // Activer le loader

        for (const item of inserts) {
          const response = await axios.post(
            `${Config.SERVER_URL}api/insertParams`,
            {},
            {
              headers: {
                Authorization: sessionId,
              },
              params: {
                code_client: code_client,
                jour: item.jour,
                heure: item.heure,
              },
            },
          );

          // Optionnel : si tu veux récupérer toutes les réponses, tu peux les stocker dans un tableau
          this.data = response.data;
        }
      } catch (error) {
        alert(`Error: ${error.message}
Method: ${error.config?.method?.toUpperCase()}
URL: ${error.config?.url}`);
        await handleLogout();
        console.error(error);
      } finally {
        this.loading = false; // Désactiver le loader
      }
    },

    async insertCasesAdr(seq, code, inserts) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");

      try {
        this.loading = true; // Activer le loader

        for (const item of inserts) {
          const response = await axios.post(
            `${Config.SERVER_URL}api/insertParamsAdr`,
            {},
            {
              headers: {
                Authorization: sessionId,
              },
              params: {
                seq: seq,
                code_client: code,
                jour: item.jour,
                heure: item.heure,
              },
            },
          );

          // Optionnel : si tu veux récupérer toutes les réponses, tu peux les stocker dans un tableau
          this.data = response.data;
        }
      } catch (error) {
        alert(`Error: ${error.message}
Method: ${error.config?.method?.toUpperCase()}
URL: ${error.config?.url}`);
        await handleLogout();
        console.error(error);
      } finally {
        this.loading = false; // Désactiver le loader
      }
    },

    async getDureeLV(code) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.get(Config.SERVER_URL + "api/duree_lv", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            code,
          },
        });
        if (response.data.length > 0) {
          this.dureeLV = response.data;
        } else {
          this.dureeLV = [];
        }
      } catch (error) {
        alert(`Error: ${error.message}
        Method: ${error.config?.method?.toUpperCase?.()}
        URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async updateSaisieLV(code, remplissage, cpt_arrive, cpt_depart, saisie) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updateSaisieLV",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              code,
              remplissage,
              cpt_arrive,
              cpt_depart,
              saisie,
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

    async insert_dureeLV(code, code_client, h_arrive, h_depart) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/insert_dureeLV",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              code,
              code_client,
              h_arrive,
              h_depart,
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

    async onSupprLV(code,liv,raison,user_annul) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/onSupprLV",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              code,liv,raison,user_annul
           
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

    async fetchAttribAxe(code_client) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/attrib_axe", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            code_client,
          },
        });
        const data = response.data;
        if (Array.isArray(data) && data.length === 4) {
          this.list_attribAxes = data[0];
          this.list_modes = data[1];
          this.list_axes = data[2];
          this.list_classifications = data[3];
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

    async updateAxe(seq, axe) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updatAxeFadr",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              seq,
              axe,
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

    async updateModeLiv(seq, mode_livraison) {
      const { handleLogout } = useLogout();
      const sessionId = localStorage.getItem("sessionId");
      try {
        this.loading = true; // Set loading indicator to true
        const response = await axios.post(
          Config.SERVER_URL + "api/updatModeLivFadr",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              seq,
              mode_livraison,
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

    async testAvAddLiv(code, isCc) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;

      try {
        const response = await axios.get(
          `${Config.SERVER_URL}api/testAvAddLiv`,

          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              code,
              isCc,
            },
          },
        );
        this.testAvAddLiv_list = response.data;
      } catch (error) {
        alert(`Error: ${error.message}
        Method: ${error.config?.method?.toUpperCase()}
        URL: ${error.config?.url}`);
        await handleLogout();
        console.error(error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    

    async fetchSituationCmdAxe() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/situationCmdAxe",
          {
            headers: {
              Authorization: sessionId,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.listSituationCmdAxe = response.data;
        } else {
          this.listSituationCmdAxe = [];
        }
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        alert(`
          Error: ${message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}
          `);

         await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchListVoit(dispo) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/listVoit", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            dispo,
          },
        });
        if (Array.isArray(response.data)) {
          this.listVoit = response.data;
        } else {
          this.listVoit = [];
        }
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        alert(`
          Error: ${message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}
          `);

        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchListAtteLiv(axe, code) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listAtteLiv",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              axe,
              code,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.listAtteLiv = response.data;
        } else {
          this.listAtteLiv = [];
        }
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        alert(`
          Error: ${message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}
          `);

        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async isLiv(CC) {
      const sessionId = localStorage.getItem("sessionId");
      //this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/isLiv", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            CC,
          },
        });
        this.isLivs = response.data;
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        alert(`
          Error: ${message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}
          `);

        //await handleLogout();
        console.log(error);
      } finally {
        // this.loading = false;
      }
    },

    async isAtteLiv(CC) {
      const sessionId = localStorage.getItem("sessionId");
      // this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/isAtteLiv", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            CC,
          },
        });
        this.isAtteLivs = response.data;
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        alert(`
          Error: ${message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}
          `);

        //await handleLogout();
        console.log(error);
      } finally {
        //this.loading = false;
      }
    },


    async fetchdetailLv(mode, sit_com, axe) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;
      try {
        const response = await axios.get(Config.SERVER_URL + "api/detail_editionLV", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            mode,
            sit_com,
            axe,
          },
        });
        if (response.data.length > 0) {
          this.listDetailEditionLvs = response.data;
        } else {
          this.listDetailEditionLvs = [];
        }
      } catch (error) {
        alert(`Error: ${error.message}
        Method: ${error.config?.method?.toUpperCase?.()}
        URL: ${error.config?.url}`);
        await handleLogout();
        console.log(error);
      } finally {
        this.loading = false;
      }
    },


  },
});
//export const piniaPlugin = createPiniaPlugin()
