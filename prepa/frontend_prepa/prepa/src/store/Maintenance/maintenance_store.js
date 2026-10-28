import { defineStore } from "pinia";

import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";

export const maintStore = defineStore("maintStore", {
    state: () => ({
        maintnces: [],
        loading: false,
    }),

    actions: {

        // async searchDemandes(search = "", marque = "") {

        //     const sessionId = localStorage.getItem("sessionId");
        //     const { handleLogout } = useLogout();

        //     this.loading = true;

        //     try {

        //         const response = await axios.get(
        //             Config.SERVER_URL + "api/demandes/search",
        //             {
        //                 params: {
        //                     search: search,
        //                     marque: marque
        //                 },

        //                 headers: {
        //                     Authorization: sessionId
        //                 }
        //             }
        //         );

        //         console.log(
        //             "Résultat de la recherche :",
        //             response.data
        //         );

        //         if (Array.isArray(response.data)) {

        //             this.demandes = response.data.map(
        //                 (demande) => ({ ...demande })
        //             );

        //         } else if (
        //             response.data &&
        //             Array.isArray(response.data.target)
        //         ) {

        //             this.demandes = response.data.target.map(
        //                 (demande) => ({ ...demande })
        //             );

        //         } else {

        //             this.demandes = [];

        //             console.log(
        //                 "Aucune demande trouvée"
        //             );
        //         }
        //     } catch (error) {
        //         console.error(
        //             "Erreur lors de la recherche des demandes :",
        //             error
        //         );
        //         this.demandes = [];
        //         await handleLogout();
        //     } finally {
        //         this.loading = false;
        //     }
        // },


        // async validerDemande(demandeCode) {
        //     const sessionId = localStorage.getItem("sessionId");
        //     const { handleLogout } = useLogout();

        //     this.loading = true;

        //     try {
        //         const response = await axios.post(
        //             Config.SERVER_URL + "api/valider",
        //             null,
        //             {
        //                 params: { demandeCode },
        //                 headers: { Authorization: sessionId }
        //             }
        //         );
        //         console.log("Demande validée :", response.data);
        //         await this.searchDemandes();   

        //     } catch (error) {
        //         console.error("Erreur lors de la validation de la demande :", error);

        //         if (error.response?.status === 401) {
        //             await handleLogout();
        //         }
        //     } finally {
        //         this.loading = false;
        //     }
        // },
        // async refuserDemande(demandeCode) {
        //     const sessionId = localStorage.getItem("sessionId");
        //     const { handleLogout } = useLogout();

        //     this.loading = true;

        //     try {
        //         const response = await axios.post(
        //             Config.SERVER_URL + "api/refuser",
        //             null,
        //             {
        //                 params: { demandeCode },
        //                 headers: { Authorization: sessionId }
        //             }
        //         );

        //         console.log("Demande validée :", response.data);

        //         await this.searchDemandes();   

        //     } catch (error) {
        //         console.error("Erreur lors de la validation de la demande :", error);
        //         if (error.response?.status === 401) {
        //             await handleLogout();
        //         }
        //     } finally {
        //         this.loading = false;
        //     }
        // },

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
                console.log(
                    "Ireto ny données hitako" , response.data
                );
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

        
    }
});