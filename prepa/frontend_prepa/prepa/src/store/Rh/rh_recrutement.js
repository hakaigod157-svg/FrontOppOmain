import { defineStore } from "pinia";
import Config from "@/utils/config";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const useRecrutement = defineStore("listrecrut", {
  state: () => ({
    listrecrut: [],
    listdetail: [],
    listEtapes: [],
    listOffres: [],
    listCandidats: [],
    loading: false,
  }),
  actions: {
    async fetchListRecrut() {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(Config.SERVER_URL + "api/listRecrut", {
          headers: { Authorization: sessionId },
        });
        //console.log("fetchListDemande response.data:", response.data);
        if (Array.isArray(response.data)) {
          this.listrecrut = response.data.map((d) => ({ ...d }));
          //console.log("listrecrut après fetch :", this.listrecrut);
          //console.log("Liste des recruts (Proxy déréférencé) :", JSON.parse(JSON.stringify(this.listrecrut)));
        } else if (response.data && Array.isArray(response.data?.target)) {
          this.listrecrut = response.data.target.map((d) => ({ ...d }));
          //console.log("listrecrut après fetch (Proxy target):", this.listrecrut);
        } else {
          this.listrecrut = [];
          //console.log("listrecrut vide après fetch :", this.listrecrut); // <-- ici
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    },

    async fetchListDetailRecru(coderecu) {
      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listDetailRecrut",
          {
            headers: {
              Authorization: sessionId,
            },
            params: {
              coderecu,
            },
          },
        );
        const data = response.data;
        if (Array.isArray(data) && data.length === 3) {
          this.listEtapes = data[0];
          this.listOffres = data[1];
          this.listCandidats = data[2];
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

    /*  async fetchListDetailRecru(coderecu) {
      if (!coderecu) {
        console.warn("fetchListDetailRecru appelé sans coderecu !");
        return;
      }

      const sessionId = localStorage.getItem("sessionId");
      this.loading = true;
      const { handleLogout } = useLogout();
      try {
        const response = await axios.get(
          Config.SERVER_URL + "api/listDetailRecrut",
          {
            headers: { Authorization: sessionId },
            params: { coderecu }, // maintenant safe
          }
        );
        const data = response.data;
        if (Array.isArray(data) && data.length === 1) {
          this.listdetail = data[0];
        } else {
          console.error("Unexpected data structure:", data);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        await handleLogout();
      } finally {
        this.loading = false;
      }
    }, */
  },
});
