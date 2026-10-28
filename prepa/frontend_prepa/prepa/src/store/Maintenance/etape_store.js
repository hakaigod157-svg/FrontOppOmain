import { defineStore } from "pinia";

import Config from "@/utils/config.js";
import axios from "@/utils/axiosConfig";
import useLogout from "@/composables/useLogout";


export const useEtapeStore = defineStore("etapeStore", {
    state: () => ({
        enumerations: [],
        etapes: [],
        etapeEnCours: null,
        historique: [],
        loading: false,
    }),

    actions: {

        async getListeEtapes(natureEtape , classFction) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;
            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/getEtapeListe",
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params:{
                            NATURE: natureEtape,
                            CLASSIFICATION : classFction
                        }
                    }
                );
                console.log("Efa nande tsara tany am base");
                if (Array.isArray(response.data)) {
                    this.etapes = response.data.map(
                        (etp) => ({ ...etp })
                    );
                } else if (
                    response.data &&
                    Array.isArray(response.data.target)
                ) {
                    this.etapes = response.data.target.map(
                        (etp) => ({ ...etp })
                    );
                } else {
                    this.etapes = [];
                    console.log(
                        "Tsisy etape ho an'io type io ao am base fa mande requeten'ise"
                    );
                }
                return this.etapes;
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des demandes :",
                    error
                );
                this.etapes = [];
                await handleLogout();
            } finally {
                this.loading = false;
            }
        },


        async getListePrepaMaint(maintCode){
            if (!maintCode) {
                console.warn("[getListePrepaMaint] maintCode est vide/undefined, appel annulé");
                return [];
            }
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            this.loading=true;
            try {
                const prepa = await axios.get(
                    Config.SERVER_URL + "api/getPrepaMaint",
                    {
                        headers:{
                            Authorization:sessionId
                        },
                        params:{
                            MAINT_CODE_LIGNE : maintCode
                        }
                    }

                );
                if (Array.isArray(prepa.data)) {
                    this.etapes = prepa.data.map(
                        (etp) => ({ ...etp })
                    );
                } else if (
                    prepa.data &&
                    Array.isArray(prepa.data.target)
                ) {
                    this.etapes = prepa.data.target.map(
                        (etp) => ({ ...etp })
                    );
                } else {
                    this.etapes = [];
                    console.log(
                        "Tsisy etape ho an'io type io ao am base fa mande requeten'ise"
                    );
                }
                return this.etapes;

            } catch (error) {
                console.error(
                    "Erreur lors du chargement des étapes PREPA :",
                    error
                );
                this.etapes = [];
                if (error.response?.status === 401) {
                    await handleLogout();
                }
            } finally {
                this.loading = false;
            }
        },

        async getListeRealMaint(maintCode){
            if (!maintCode) {
                console.warn("[getListeRealMaint] maintCode est vide/undefined, appel annulé");
                return [];
            }
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            this.loading=true;
            try {
                const realMD = await axios.get(
                    Config.SERVER_URL + "api/getRealMaint",
                    {
                        headers:{
                            Authorization:sessionId
                        },
                        params:{
                            MAINT_CODE_REAL : maintCode
                        }
                    }

                );
                if (Array.isArray(realMD.data)) {
                    this.etapes = realMD.data.map(
                        (etp) => ({ ...etp })
                    );
                } else if (
                    realMD.data &&
                    Array.isArray(realMD.data.target)
                ) {
                    this.etapes = realMD.data.target.map(
                        (etp) => ({ ...etp })
                    );
                } else {
                    this.etapes = [];
                    console.log(
                        "Tsisy etape ho an'io type io ao am base fa mande requeten'ise"
                    );
                }
                return this.etapes;

            } catch (error) {
                console.error(
                    "Erreur lors du chargement des étapes REAL :",
                    error
                );
                this.etapes = [];
                if (error.response?.status === 401) {
                    await handleLogout();
                }
            } finally {
                this.loading = false;
            }
        },




        async getEtapeEnCours(demandeCode) {
            if (!demandeCode || demandeCode === "-") {
                return null;
            }
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;
            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/etapeEnCours",
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params: {
                            DEMANDE_CODE: demandeCode
                        }
                    }
                );
                console.log("Étape en cours récupérée depuis l'API :", response.data);

                if (response.status === 204 || !response.data) {
                    this.etapeEnCours = null;
                    return null;
                }

                let data = response.data;
                if (data && data.target) {
                    data = data.target;
                }
                if (Array.isArray(data)) {
                    data = data.length > 0 ? data[0] : null;
                }

                this.etapeEnCours = data;
                return data;
            } catch (error) {
                console.error("Erreur lors de la récupération de l'étape en cours :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
                this.etapeEnCours = null;
                return null;
            } finally {
                this.loading = false;
            }
        },

        async validerEtapePrepa(maintCode, etapeLigne) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;
            try {
                const response = await axios.post(
                    Config.SERVER_URL + "api/validerEtapePrepa",
                    null,
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params: {
                            MAINT_CODE_LIGNE: maintCode,
                            MAINT_ETAPE_LIGNE: etapeLigne,
                            // MAINT_INTERVENANT: intervenant || localStorage.getItem("username") || "Admin"
                        }
                    }
                );
                console.log("[validerEtapePrepa] Étape PREPA validée :", response.data);
                return response.data;
            } catch (error) {
                console.error("Erreur lors de la validation PREPA :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async validerEtapeReal(maintCode, data = {}) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;
            try {
                const response = await axios.post(
                    Config.SERVER_URL + "api/validerEtapeReal",
                    null,
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params: {
                            MAINT_CODE_REAL: maintCode,
                            MAINT_INTERV_REAL: data.intervReal || data.etape_LIBELLE || data.code,
                            MAINT_ACTION_REAL: data.actionReal ?? data.action ?? "",
                            MAINT_FNR_REAL: data.fnrReal ?? data.fournisseur ?? "",
                            MAINT_PRIX_REAL: data.prixReal ?? data.prix ?? 0,
                            MAINT_MRAQUE_MARQUE: data.marqueReal ?? data.marque ?? "",
                            MAINT_DATE_REAL: data.dateReal || null,
                        }
                    }
                );
                console.log("[validerEtapeReal] Étape REAL validée :", response.data);
                return response.data;
            } catch (error) {
                console.error("Erreur lors de la validation REAL :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async ajouterEtapeReal(maintCode, data = {}) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;
            try {
                const response = await axios.post(
                    Config.SERVER_URL + "api/addEtapeReal",
                    null,
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params: {
                            MAINT_CODE_REAL: maintCode,
                            MAINT_INTERV_REAL: data.intervReal || "",
                            MAINT_DATE_PREVU: data.datePrevu || null,
                            MAINT_ACTION_REAL: data.actionReal || "",
                            MAINT_FNR_REAL: data.fnrReal || "",
                            MAINT_PRIX_REAL: data.prixReal || 0,
                            MAINT_MRAQUE_MARQUE: data.marqueReal || "",
                        }
                    }
                );
                console.log("[ajouterEtapeReal] Étape REAL ajoutée :", response.data);
                return response.data;
            } catch (error) {
                console.error("Erreur lors de l'ajout d'étape REAL :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async validEtape(demandeCode){
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;
            try {
                const reponseValid = await axios.post(Config.SERVER_URL + "api/validEtape",null,
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params:{
                            DEMANDE_CODE: demandeCode
                        }
                    }
                );
                console.log("ETAPE VALIDÉE :" , reponseValid.data)
                
                
            } catch (error) {
                console.error("Erreur lors de la validation de la demande :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
                else if(error.response?.status === 500) {
                    console.log(error)
                }
                
            }finally {
                this.loading = false;
            }
        } ,


        async cloturerDemande(demandeCode){
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;
            try {
                const reponseValid = await axios.post(Config.SERVER_URL + "api/terminerDmd",null,
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params:{
                            DEMANDE_CODE: demandeCode
                        }
                    }
                );
                console.log("demande vita " )
                
                
            } catch (error) {
                console.error("Erreur lors de la validation de la demande :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
                else if(error.response?.status === 500) {
                    console.log(error)
                }
                
            }finally {
                this.loading = false;
            }
        } 
        
        
        ,async getHistorique(demandeCode) {
            if (!demandeCode || demandeCode === "-") {
                return [];
            }
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;
            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/getHistorique",
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params: {
                            DEMANDE_CODE: demandeCode
                        }
                    }
                );
                console.log("Historique récupéré depuis l'API :", response.data);

                if (response.status === 204 || !response.data) {
                    this.historique = [];
                    return [];
                }

                let data = response.data;
                if (data && Array.isArray(data.target)) {
                    data = data.target;
                }

                this.historique = Array.isArray(data) ? data : [];
                return this.historique;
            } catch (error) {
                console.error("Erreur lors de la récupération de l'historique :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
                this.historique = [];
                return [];
            } finally {
                this.loading = false;
            }
        },
      
    }
});