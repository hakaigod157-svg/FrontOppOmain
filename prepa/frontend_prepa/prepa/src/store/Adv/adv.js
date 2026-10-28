import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useValidationCommandeStore = defineStore("validationss", {
  state: () => ({
    listvaliders0: [],
    listvaliders1: [],
    validations: [],
    bonalivrers: [],
    soldes: [],
    listavaliders: [],
    listvaliders: [],
    loading: false,
    listAccords: [],
    listReglements: [],
    TestApresValide: [],
    codeTraite: null,
    InfoApresBlocage: [],
    stade: null,
    accord_stade: null,
    params: {
      codeclient: null,
      type: null,
      critere: null,
    },
    // TcodeClient: null,
  }),
  actions: {
    async fetchCommandeValidation() {
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        //API a changer avec la vrai valeur de l'API du ADV
        const response = await axios.get(Config.SERVER_URL + "api/prep");
        if (Array.isArray(response.data)) {
          this.validations = response.data;
        } else {
          this.validations = [];
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

    async fetchBonAlivrer() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/bonalivrer", {
          headers: {
            Authorization: sessionId,
          },
        });
        if (Array.isArray(response.data)) {
          this.bonalivrers = response.data;
        } else {
          this.bonalivrers = [];
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

    async fetchlistavalider() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listavalider",
          {
            headers: {
              Authorization: sessionId,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.listavaliders = response.data;
        } else {
          this.listavaliders = [];
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

    async fetchlisttraite() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/traite", {
          headers: {
            Authorization: sessionId,
          },
        });
        if (Array.isArray(response.data)) {
          this.listtraites = response.data;
        } else {
          this.listtraites = [];
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

    async fetchCommandeValider(datedeb, datefin, codeCC, client) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listvalider",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              datedeb,
              datefin,
              codeCC,
              client,
            },
          },
        );
        const data = response.data;
        if (Array.isArray(data) && data.length === 2) {
          this.listvaliders0 = data[0];
          this.listvaliders1 = data[1];
        } else {
          console.error(
            "Unexpected data structure in fetchlistvalider response:",
            data,
          );
        }
        // if (Array.isArray(response.data)) {
        //   this.listvaliders = response.data;
        // } else {
        //   this.listvaliders = [];
        // }
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

    async updateFCC(cc, etat) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;

      const { handleLogout } = useLogout();

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/maj_bon",
          null,
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              cc,
              etat,
            },
          },
        );

        return response.data;
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        alert(`
        Error: ${message}
        Method: ${error.config?.method?.toUpperCase()}
        URL: ${error.config?.url}
    `);

        await handleLogout();

        console.log(error);

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async update_com(cc, commentaire) {
      try {
        this.loading = true;
        const sessionId = localStorage.getItem("sessionId");
        const response = await axios.post(
          Config.SERVER_URL + "api/update_com",
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              cc,
              commentaire,
            },
          },
        );
        this.loading = false;
      } catch (error) {
        alert(`Error: ${error.message}
          Method: ${error.config?.method.toUpperCase()}
          URL: ${error.config?.url}`);
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchSolde(codeclient, type) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/solde", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            codeclient,
            type,
          },
        });
        if (Array.isArray(response.data)) {
          this.soldes = response.data;
        } else {
          this.soldes = [];
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

    async fetchCmdEncours(codeclient, type) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/encours", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            codeclient,
            type,
          },
        });
        if (Array.isArray(response.data)) {
          this.soldes = response.data;
        } else {
          this.soldes = [];
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

    async fetchAvance(codeclient, type) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/avance", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            codeclient,
            type,
          },
        });
        if (Array.isArray(response.data)) {
          this.soldes = response.data;
        } else {
          this.soldes = [];
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

    async fetchRg(codeclient, type) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/reglement", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            codeclient,
            type,
          },
        });
        if (Array.isArray(response.data)) {
          this.soldes = response.data;
        } else {
          this.soldes = [];
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

    async fetchRgBon(codeclient, type) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/reglementBon",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              codeclient,
              type,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.soldes = response.data;
        } else {
          this.soldes = [];
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

    async fetchCommande(codeclient, type) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/commande", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            codeclient,
            type,
          },
        });
        if (Array.isArray(response.data)) {
          this.soldes = response.data;
        } else {
          this.soldes = [];
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

    async fetchAcccordADV() {
      this.loading = true;
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listAccordADV",
          {
            headers: {
              Authorization: sessionId,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.listAccords = response.data;
        } else {
          this.listAccords = [];
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

    async fetchReglementClt(critere) {
      this.loading = true;
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listReglement",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              critere,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.listReglements = response.data;
        } else {
          this.listReglements = [];
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

    async onValideAdv(
      cmd,
      accord,
      comAccord,
      commClt,
      comMag,
      modeNorm,
      modeEncours,
      impaye,
      retard,
      bal,
      ip,
    ) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;

      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/onValideADV",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              cmd,
              accord,
              comAccord,
              commClt,
              comMag,
              modeNorm,
              modeEncours,
              impaye,
              retard,
              bal,
              ip,
            },
          },
        );

        if (Array.isArray(response.data)) {
          this.TestApresValide = response.data;
        } else {
          this.TestApresValide = [];
        }
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        alert(`
        Error: ${message}
        Method: ${error.config?.method?.toUpperCase()}
        URL: ${error.config?.url}
    `);

        await handleLogout();

        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async onCreeTraiteAdv(cmd, traite, isNew) {
      this.loading = true;
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/onCreeTraiteADV",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              cmd,
              traite,
              isNew,
            },
          },
        );

        this.codeTraite = response.data;

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

    async onBlockAdv(cmd, ip, couleur) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;

      const { handleLogout } = useLogout();

      try {
        const response = await axios.get(Config.SERVER_URL + "api/onBlockAdv", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            cmd,
            ip,
            couleur,
          },
        });

        if (Array.isArray(response.data)) {
          this.InfoApresBlocage = response.data;
        } else {
          this.InfoApresBlocage = [];
        }
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message = error.response.data;
        }

        alert(`
        Error: ${message}
        Method: ${error.config?.method?.toUpperCase()}
        URL: ${error.config?.url}
    `);

        await handleLogout();

        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async sendSMS(recipient, body) {
      this.loading = true;
      try {
        const response = await axios.post(
          "http://192.168.130.6/Omnis/sms2/send/",
          new URLSearchParams({
            recipient,
            body,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              // Connection: 'close', // Explicitly include the Connection header
            },
          },
        );

        if (response.status === 200) {
          console.log("SMS sent successfully: OK");
        } else {
          console.log(
            "SMS sent, but received unexpected status:",
            response.status,
          );
        }
      } catch (error) {
        console.error("Error sending SMS:", error);
        // Handle error gracefully
      } finally {
        this.loading = false;
      }
    },

    async getStade_cmd(cmd) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/getStade_cmd",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              cmd,
            },
          },
        );

        this.stade = response.data;
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

    async getStade_bal(cmd) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/getStade_bal",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              cmd,
            },
          },
        );

        this.accord_stade = response.data;
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
  },
});
