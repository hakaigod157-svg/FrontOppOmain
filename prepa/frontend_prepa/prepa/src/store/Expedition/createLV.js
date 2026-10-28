import { defineStore } from "pinia";
import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useCreateLVStore = defineStore("CreateLVStore", {
  state: () => ({
    loading: false,
    listVoit: [],
    listAtteLiv: [],
    list_Indlivraisons: [],
    isLivs: false,
    isAtteLivs: false,
    m_createLv: "",
    m_listCmdLivSuppr: [],
    m_listLivreurOccupe: [],
    m_listProximite: [],
    m_listVoitCh: [],
  }),

  actions: {
    async fetchListVoit(type) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/listVoit", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            type,
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

    async fetchListAtteLiv(mode) {
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
              mode,
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

    async createLv(chauf, voit, etat, course, livreur, axe) {
      const sessionId = localStorage.getItem("sessionId");
      // this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/createLv", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            chauf,
            voit,
            etat,
            course,
            livreur,
            axe,
          },
        });
        this.m_createLv = response.data;
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

    async updateLivCmd(cmd, code_liv) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();

      try {
        // ⚠️ Axios POST : body en 2e argument, config (headers + params) en 3e argument
        const response = await axios.post(
          Config.SERVER_URL + "api/updateLivCmd",
          {}, // corps vide car tu passes tout en params
          {
            headers: {
              Authorization: sessionId, // ✅ le header attendu par Spring
            },
            params: {
              cmd,
              code_liv,
            },
          },
        );

        return response.data; // retourne le résultat du serveur
      } catch (error) {
        let message = error.message;

        if (error.response && error.response.data) {
          message =
            typeof error.response.data === "string"
              ? error.response.data
              : JSON.stringify(error.response.data);
        }

        alert(`
          Error: ${message}
          Method: ${error.config?.method?.toUpperCase()}
          URL: ${error.config?.url}
            `);

        console.error(error);
        throw error;
      }
    },

    async fetchlistCmdLiv(liv, client) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listCmdASupprLiv",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              liv,
              client,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.m_listCmdLivSuppr = response.data;
        } else {
          this.m_listCmdLivSuppr = [];
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

    async onAddCmdLiv(cmd, liv, raison) {
      const sessionId = localStorage.getItem("sessionId");
      const { handleLogout } = useLogout();
      this.loading = true;

      try {
        const response = await axios.post(
          `${Config.SERVER_URL}api/add_cmd_liv`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionId,
            },
            params: {
              cmd,
              liv,
              raison,
            },
          },
        );
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

    async livreurOccupe() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listLivreurOccupe",
          {
            headers: {
              Authorization: sessionId,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.m_listLivreurOccupe = response.data;
        } else {
          this.m_listLivreurOccupe = [];
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

    async fetchListProximite(type) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listProximite",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              type,
            },
          },
        );
        if (Array.isArray(response.data)) {
          this.m_listProximite = response.data;
        } else {
          this.m_listProximite = [];
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

    async fetchVoitureCh() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/voitureCh", {
          headers: {
            Authorization: sessionId,
          },
        });
        if (Array.isArray(response.data)) {
          this.m_listVoitCh = response.data;
        } else {
          this.m_listVoitCh = [];
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
    async insertVoitCh(voit, chauf) {
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/insertVoitCh",
          {},
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              voit,
              chauf,
            },
          },
        );

        response.data;
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

        console.error(error);
      }
    },

    async delVoitCh(seq) {
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.post(
          Config.SERVER_URL + "api/delVoitCh",
          {},
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              seq,
            },
          },
        );

        response.data;
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

        console.error(error);
      }
    },

    async testDispo(voit, chauf) {
      const sessionId = localStorage.getItem("sessionId");

      try {
        const response = await axios.get(Config.SERVER_URL + "api/testDispo", {
          headers: {
            Authorization: sessionId,
          },
          params: {
            voit,
            chauf,
          },
        });

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

        console.error(error);

        throw error;
      }
    },
  },
});
//export const piniaPlugin = createPiniaPlugin()
