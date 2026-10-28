import { defineStore } from "pinia";

import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";


export const useDemandeMaintenance = defineStore("demandeMaintenance", {
    state: () => ({
        demandes: [],
        maintnces: [],
        marques: [],
        voitures: [],
        enumerations: [],
        loading: false,
    }),

    actions: {

        async fetchDemandes() {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;

            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/listDmdMntc",
                    {
                        headers: {
                            Authorization: sessionId
                        }
                    }
                );

                console.log("Efa nande tsara tany am base");

                if (Array.isArray(response.data)) {

                    this.demandes = response.data.map(
                        (demande) => ({ ...demande })
                    );

                } else if (
                    response.data &&
                    Array.isArray(response.data.target)
                ) {

                    this.demandes = response.data.target.map(
                        (demande) => ({ ...demande })
                    );

                } else {

                    this.demandes = [];

                    console.log(
                        "vide be nenla base , tsy misy na 1 ary"
                    );
                }

            } catch (error) {

                console.error(
                    "Erreur lors du chargement des demandes :",
                    error
                );

                this.demandes = [];

                await handleLogout();

            } finally {

                this.loading = false;
            }
        },

        async searchDemandes(search = "", marque = "") {

            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;

            try {

                const response = await axios.get(
                    Config.SERVER_URL + "api/demandes/search",
                    {
                        params: {
                            search: search,
                            marque: marque
                        },

                        headers: {
                            Authorization: sessionId
                        }
                    }
                );

                console.log(
                    "Résultat de la recherche :",
                    response.data
                );

                if (Array.isArray(response.data)) {

                    this.demandes = response.data.map(
                        (demande) => ({ ...demande })
                    );

                } else if (
                    response.data &&
                    Array.isArray(response.data.target)
                ) {

                    this.demandes = response.data.target.map(
                        (demande) => ({ ...demande })
                    );

                } else {

                    this.demandes = [];

                    console.log(
                        "Aucune demande trouvée"
                    );
                }
            } catch (error) {
                console.error(
                    "Erreur lors de la recherche des demandes :",
                    error
                );
                this.demandes = [];
                await handleLogout();
            } finally {
                this.loading = false;
            }
        },


        async validerDemande(demandeCode, numVoiture, classification) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;

            try {

                let kmVoiture = null;
                if (numVoiture) {
                    kmVoiture = await this.getKmVoiture(numVoiture);
                    console.log(kmVoiture)
                }
                // console.log("Km recupéré ito : " ,kmVoiture)

                const params = { demandeCode, kmVoiture };
                if (classification) {
                    params.classification = classification;
                    params.demandeClassification = classification;
                }

                const response = await axios.post(
                    Config.SERVER_URL + "api/valider",
                    null,
                    {
                        params,
                        headers: { Authorization: sessionId }
                    }
                );
                console.log("Demande validée :", response.data);
                await this.searchDemandes();

            } catch (error) {
                console.error("Erreur lors de la validation de la demande :", error);

                if (error.response?.status === 401) {
                    await handleLogout();
                }
            } finally {
                this.loading = false;
            }
        },
        async refuserDemande(demandeCode) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;

            try {
                const response = await axios.post(
                    Config.SERVER_URL + "api/refuser",
                    null,
                    {
                        params: { demandeCode },
                        headers: { Authorization: sessionId }
                    }
                );

                console.log("Demande validée :", response.data);

                await this.searchDemandes();

            } catch (error) {
                console.error("Erreur lors de la validation de la demande :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
            } finally {
                this.loading = false;
            }
        },
        async deleteDemande(demandeCode) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;

            try {
                const response = await axios.post(
                    Config.SERVER_URL + "api/suppr",
                    null,
                    {
                        params: { demandeCode },
                        headers: { Authorization: sessionId }
                    }
                );

                console.log("Demande validée :", response.data);

                await this.searchDemandes();

            } catch (error) {
                console.error("Erreur lors de la validation de la demande :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
            } finally {
                this.loading = false;
            }
        },

        async getMarqueVoiture() {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            this.loading = true;
            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/demandes/marques",
                    {
                        headers: {
                            Authorization: sessionId
                        }
                    }
                );
                console.log(
                    "Marques récupérées :",
                    response.data
                );
                if (Array.isArray(response.data)) {
                    this.marques = response.data;
                } else if (
                    response.data &&
                    Array.isArray(response.data.target)
                ) {
                    this.marques = response.data.target;
                } else {
                    this.marques = [];
                    console.log(
                        "Aucune marque trouvée dans la base"
                    );
                }
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des marques :",
                    error
                );
                this.marques = [];
                await handleLogout();
            } finally {
                this.loading = false;
            }
        },


        async getDemandeByDmdCode(demandeCode) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            this.loading = true;
            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/getDemandeByCode",
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params: {
                            demandeCode: demandeCode
                        }
                    }
                );
                if (response.status === 204 || !response.data) {
                    return null;
                }
                return { ...response.data };
            } catch (error) {
                console.error(
                    "Erreur lors du chargement de la demande :",
                    error
                );
                if (error?.response?.status === 401) {
                    await handleLogout();
                }
                return null;
            } finally {
                this.loading = false;
            }
        },

        async genererCodeDemande() {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;

            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/dmdCode",
                    {
                        headers: {
                            Authorization: sessionId,
                        },
                    }
                );

                return response.data;
            } catch (error) {
                console.error(
                    "Erreur lors de la génération du code de demande :",
                    error
                );

                if (error.response?.status === 401) {
                    await handleLogout();
                }

                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateDemande(demandeCode, payload) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;

            try {
                const response = await axios.post(
                    Config.SERVER_URL + "api/update",
                    payload,
                    {
                        params: { demandeCode },
                        headers: {
                            Authorization: sessionId
                        }
                    }
                );

                console.log("Demande modifiée :", response.data);

                await this.searchDemandes();

                return response.data;

            } catch (error) {
                console.error(
                    "Erreur lors de la modification de la demande :",
                    error
                );

                if (error.response?.status === 401) {
                    await handleLogout();
                }

                throw error;

            } finally {
                this.loading = false;
            }
        },
        async insertDemande(demandeCode, payload) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;

            try {
                const response = await axios.post(
                    Config.SERVER_URL + "api/enregistrer",
                    null,
                    {
                        params: {
                            demandeCode: demandeCode,
                            demandeVoiture: payload.DEMANDE_VOITURE,
                            demandeMarque: payload.DEMANDE_MARQUE,
                            demandeType: payload.DEMANDE_TYPE,
                            demandeDescr: payload.DEMANDE_DESCR
                        },
                        headers: {
                            Authorization: sessionId
                        }
                    }
                );

                console.log("Demande créée avec succès :", response.data);

                await this.searchDemandes();

                return response.data;

            } catch (error) {
                console.error("Erreur lors de la création de la demande :", error);

                if (error.response?.status === 401) {
                    await handleLogout();
                }

                throw error;

            } finally {
                this.loading = false;
            }




        },

        async getVoitureRhtra() {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;

            try {
                let response;
                try {
                    response = await axios.get(
                        Config.SERVER_URL + "api/allVoiture",
                        {
                            headers: {
                                Authorization: sessionId
                            }
                        }
                    );
                } catch (err) {
                    if (err?.response?.status === 404) {
                        try {
                            response = await axios.get(
                                Config.SERVER_URL + "api/listVoiture",
                                {
                                    headers: {
                                        Authorization: sessionId
                                    }
                                }
                            );
                        } catch (err2) {
                            if (err2?.response?.status === 404) {
                                response = await axios.get(
                                    Config.SERVER_URL + "api/getVoiture",
                                    {
                                        headers: {
                                            Authorization: sessionId
                                        }
                                    }
                                );
                            } else {
                                throw err2;
                            }
                        }
                    } else {
                        throw err;
                    }
                }

                console.log("Réponse API voitures (raw) :", response.data);

                if (Array.isArray(response.data)) {

                    this.voitures = response.data.map(
                        (voiture) => ({ ...voiture })
                    );

                } else if (
                    response.data &&
                    Array.isArray(response.data.target)
                ) {

                    this.voitures = response.data.target.map(
                        (voiture) => ({ ...voiture })
                    );

                } else {

                    this.voitures = [];

                    console.log(
                        "vide be nenla base , tsy misy na 1 ary"
                    );
                }

                console.log("Voitures finales dans le store :", this.voitures);

            } catch (error) {

                console.error(
                    "Erreur lors du chargement des voitures :",
                    error
                );

                this.voitures = [];

                await handleLogout();

            } finally {

                this.loading = false;
            }
        },

        async getVoitures() {
            return this.getVoiture();
        },

        async getKmVoiture(numVoiture) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/getKmVoit",
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params: {
                            VOIT_NUM: numVoiture
                        }
                    }
                );

                if (response.status === 204 || !response.data) {
                    return null;
                }

                console.log("Km voiture récupéré :", response.data);
                return response.data;

            } catch (error) {
                console.error("Erreur lors de la récupération du km voiture :", error);

                if (error?.response?.status === 401) {
                    await handleLogout();
                }

                return null;
            }
        }, 
        
        
        async getEnumeration(enumValeur) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/getEnumerat",
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params: {
                            ENUM_VALEUR: enumValeur
                        }
                    }
                );

                if (response.status === 204 || !response.data) {
                    this.enumerations = [];
                    return null;
                }

                console.log("Enumeration récupérée :", response.data);

                if (Array.isArray(response.data)) {
                    this.enumerations = response.data;
                } else {
                    this.enumerations = [];
                }

                return response.data;

            } catch (error) {
                console.error("Erreur lors de la récupération de l'énumération :", error);

                if (error?.response?.status === 401) {
                    await handleLogout();
                }

                return null;
            }
        },
        async getTypeMaint() {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/getTypeMaint",
                    {
                        headers: {
                            Authorization: sessionId
                        }
                    }
                );

                if (response.status === 204 || !response.data) {
                    this.enumerations = [];
                    return null;
                }

                console.log("Enumeration récupérée :", response.data);

                if (Array.isArray(response.data)) {
                    this.enumerations = response.data;
                } else {
                    this.enumerations = [];
                }

                return response.data;

            } catch (error) {
                console.error("Erreur lors de la récupération de l'énumération :", error);

                if (error?.response?.status === 401) {
                    await handleLogout();
                }

                return null;
            }
        },




        async getClassification() {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/getClassification",
                    {
                        headers: {
                            Authorization: sessionId
                        }
                    }
                );

                if (response.status === 204 || !response.data) {
                    this.enumerations = [];
                    return null;
                }

                console.log("Enumeration récupérée :", response.data);

                if (Array.isArray(response.data)) {
                    this.enumerations = response.data;
                } else {
                    this.enumerations = [];
                }

                return response.data;

            } catch (error) {
                console.error("Erreur lors de la récupération de l'énumération :", error);

                if (error?.response?.status === 401) {
                    await handleLogout();
                }

                return null;
            }
        },


    }
});