import { defineStore } from "pinia";

import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const maintStore = defineStore("maintStore", {
    state: () => ({
        maintnces: [],
        voitMtnce : [],
        loading: false,
    }),

    actions: {
        async getMaintenances() {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            this.loading = true;
            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/listMtnce",
                    {
                        headers: {
                            Authorization: sessionId
                        }
                    }
                );
                // console.log(
                //     "Ireto ny données hitako" , response.data
                // );
                if (Array.isArray(response.data)) {
                    this.maintnces = response.data.map(
                        (mtnce) => ({ ...mtnce })
                    );
                } else if (
                    response.data &&
                    Array.isArray(response.data.target)
                ) {
                    this.maintnces = response.data.target.map(
                        (mtnce) => ({ ...mtnce })
                    );
                } else {
                    this.maintnces = [];
                    console.log(
                        "vide be base de mtnce, tsy misy na 1 ary"
                    );
                }
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des demandes :",
                    error
                );
                this.maintnces = [];
                await handleLogout();
            } finally {
                this.loading = false;
            }
        },
        async getVoitureMaintenance(voitNumero) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            this.loading = true;
            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/voitureMaint",
                    {
                        headers: {
                            Authorization: sessionId
                        },
                         params: {
                            VOIT_NUM: voitNumero
                        }
                    }
                );
              
                if (Array.isArray(response.data)) {
                    this.voitMtnce = response.data.map(
                        (voituremt) => ({ ...voituremt })
                    );
                } else if (
                    response.data &&
                    Array.isArray(response.data.target)
                ) {
                    this.voitMtnce = response.data.target.map(
                        (voituremt) => ({ ...voituremt })
                    );
                } else {
                    this.voitMtnce = [];
                    console.log(
                        "vide be base de mtnce, tsy misy na 1 ary"
                    );
                }
                return this.voitMtnce;
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des demandes :",
                    error
                );
                this.voitMtnce = [];
                await handleLogout();
                return this.voitMtnce;
            } finally {
                this.loading = false;
            }
        },

        
    }
});
