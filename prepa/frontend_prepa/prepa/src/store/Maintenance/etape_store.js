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
        actions :[],
        fournisseurs :[],
        marques :[],
        exect :[],
        reference : [],
        parametre : [],
        loading: false,
    }),

    actions: {
        //Liste étape preparation -> TABLE ETAPE_LIGNE
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

        //Liste REALISATION RETO -> TABLE REALISATION

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
                // console.log("Étape en cours récupérée depuis l'API :", response.data);

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
//////////////////////////////////////////////////////






/**
 * VALIDATION ANA ETAPE PREPARATION (Mecanicien)
 * MANAO POST
 */
        async validerEtapePrepa(maintCode, etapeLigne, datePrepa, file = null) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            const formData = new FormData();
            formData.append("MAINT_CODE_LIGNE", maintCode);
            formData.append("MAINT_ETAPE_LIGNE", etapeLigne);
            if (datePrepa) formData.append("MAINT_ETAPE_REEL", datePrepa);
            if (file) formData.append("file", file, file.name);

            this.loading = true;
            try {
                const response = await axios.post(
                    Config.SERVER_URL + "api/validerEtapePrepa",
                    formData,
                    {
                        headers: { Authorization: sessionId },
                    }
                );
                // console.log("[validerEtapePrepa] Étape PREPA validée :", response.data);
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
/**
 * Ito ndray Etape Realisation avec Action sns 
 * $_POST 
 * @param {*} maintCode 
 * @param {*} data 
 * @returns 
 */
        async validerEtapeReal(maintCode, data = {}, file = null) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            const formData = new FormData();
            formData.append("MAINT_CODE_REAL", maintCode);
            formData.append("MAINT_INTERV_REAL", data.intervReal);
            const champs = {
                MAINT_ACTION_REAL: data.action,
                MAINT_EXECUTION: data.exect,
                MAINT_FNR_REAL: data.fournisseur,
                MAINT_PRIX_REAL: data.prix ?? 0,
                MAINT_MRAQUE_MARQUE: data.marque,
                MAINT_DATE_REAL: data.dateReal,
            };
            Object.entries(champs).forEach(([nom, valeur]) => {
                if (valeur !== null && valeur !== undefined && valeur !== "") {
                    formData.append(nom, valeur);
                }
            });
            if (file) formData.append("file", file, file.name);

            this.loading = true;
            try {
                const response = await axios.post(
                    Config.SERVER_URL + "api/validerEtapeReal",
                    formData,
                    {
                        headers: { Authorization: sessionId },
                    }
                );
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
                            MAINT_INTERV_REAL: data.intervReal ,
                            MAINT_DATE_PREVU: data.datePrevu || null,
                            MAINT_ACTION_REAL: data.actionReal || null,
                            // MAINT_FNR_REAL: data.fnrReal || "",
                            // MAINT_PRIX_REAL: data.prixReal || 0,
                            // MAINT_MRAQUE_MARQUE: data.marqueReal || "",
                        }
                    }
                );
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

   

        async cloturerMaintenance(maintCode){
            if (!maintCode) return false;

            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;
            try {
                await axios.post(Config.SERVER_URL + "api/terminerDmd",null,
                    {
                        headers: {
                            Authorization: sessionId
                        },
                        params:{
                            MAINT_CODE: maintCode
                        }
                    }
                );
                return true;
                
            } catch (error) {
                console.error("Erreur lors de la clôture de la maintenance :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
                else if(error.response?.status === 500) {
                    console.log(error)
                }
                return false;
                
            }finally {
                this.loading = false;
            }
        },
        
        ////////////////////////////////////////////////////////////////////////////////////

        /**
         * Récupérer la PJ d'une étape (retourne hex/base64/data URL)
         */
        async fetchEtapePrepaPJ(maintCode, etapeLigne) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;
            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/getEtapePrepaPJ",
                    {
                        params: {
                            MAINT_CODE_LIGNE: maintCode,
                            MAINT_ETAPE_LIGNE: etapeLigne,
                        },
                        headers: {
                            Authorization: sessionId,
                        },
                    }
                );
                return response.data;
            } catch (error) {
                console.error("[fetchEtapePrepaPJ] Erreur :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
                return null;
            } finally {
                this.loading = false;
            }
        },

        async fetchEtapeRealPJ(maintCode, intervReal) {
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();

            this.loading = true;
            try {
                const response = await axios.get(
                    Config.SERVER_URL + "api/getEtapeRealPJ",
                    {
                        params: {
                            MAINT_CODE_REAL: maintCode,
                            MAINT_INTERV_REAL: intervReal,
                        },
                        headers: { Authorization: sessionId },
                    }
                );
                return response.data;
            } catch (error) {
                console.error("[fetchEtapeRealPJ] Erreur :", error);
                if (error.response?.status === 401) {
                    await handleLogout();
                }
                return null;
            } finally {
                this.loading = false;
            }
        },

        async getTypeActionReal(){
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            
            this.loading = true;
            try {
                const actionRecue = await axios.get(Config.SERVER_URL + "api/getActions",
                    {
                      headers:{
                            "Authorization" : sessionId
                        }
                    }
                );
                if (Array.isArray(actionRecue.data)) {
                    this.actions = actionRecue.data.map(
                        (actionsAZO) => ({ ...actionsAZO })
                    
                    );
                    console.log("Actions:" , this.actions)
                } else if (
                    actionRecue.data &&
                    Array.isArray(actionRecue.data.target)
                ) {
                    this.actions = actionRecue.data.target.map(
                        (actionsAZO) => ({ ...actionsAZO })
                    );
                } else {
                    this.actions = [];
                    console.log(
                        "TSISY ACTIONS ao am base fa mande requeten'ise"
                    );
                }
                return this.actions;
            } catch (error) {
                console.error("Erreur de récuperation ACTIONS (/getActon) : " , error);
                if (error?.response?.status === 401) {
                    await handleLogout();
                }
                return null;
            }
        },

        async getFournisseurs(){
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            
            this.loading = true;
            try {
                const fournisseurS = await axios.get(Config.SERVER_URL + "api/getFnr",
                    {
                       headers: {
                            Authorization: sessionId
                        }
                    }
                );
                if (Array.isArray(fournisseurS.data)) {
                    this.fournisseurs = fournisseurS.data.map(
                        (frnisseurs) => ({ ...frnisseurs })
                    );
                } else if (
                    fournisseurS.data &&
                    Array.isArray(fournisseurS.data.target)
                ) {
                    this.fournisseurs = fournisseurS.data.target.map(
                        (frnisseurs) => ({ ...frnisseurs })
                    );
                } else {
                    this.fournisseurs = [];
                    console.log(
                        "TSISY Fournisseurs ao am base fa mande requeten'ise"
                    );
                }
                return this.fournisseurs;
            } catch (error) {
                console.error("Erreur de récuperation FNR(/getFNR) : " , error);
                if (error?.response?.status === 401) {
                    await handleLogout();
                }
                return null;
            }

        },

        async getMarques(){
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            
            this.loading = true;
            try {
                const marquePiece = await axios.get(Config.SERVER_URL + "api/getMarque",
                    {
                        headers:{
                            "Authorization" : sessionId
                        }
                    }
                );
                if (Array.isArray(marquePiece.data)) {
                    this.marques = marquePiece.data.map(
                        (mrkp) => ({ ...mrkp })
                    );
                } else if (
                    marquePiece.data &&
                    Array.isArray(marquePiece.data.target)
                ) {
                    this.marques = marquePiece.data.target.map(
                        (mrkp) => ({ ...mrkp })
                    );
                } else {
                    this.marques = [];
                    console.log(
                        "TSISY Marques ao am base fa mande requeten'ise"
                    );
                }
                return this.marques;
            } catch (error) {
                console.error("Tena tsy azo ilay marques mec : " , error);
                if (error?.response?.status === 401) {
                    await handleLogout();
                }
                return null;
            }

        },
        
        async getTypeExecution(){
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            
            this.loading = true;
            try {
                const execution = await axios.get(Config.SERVER_URL + "api/getTypeExecution",
                    {
                        headers:{
                            "Authorization" : sessionId
                        }
                    }
                );
                if (Array.isArray(execution.data)) {
                    this.exect = execution.data.map(
                        (mrkp) => ({ ...mrkp })
                    );
                } else if (
                    execution.data &&
                    Array.isArray(execution.data.target)
                ) {
                    this.exect = execution.data.target.map(
                        (mrkp) => ({ ...mrkp })
                    );
                } else {
                    this.exect = [];
                    console.log(
                        "TSISY Marques ao am base fa mande requeten'ise"
                    );
                }
                return this.exect;
            } catch (error) {
                console.error("Tena tsy azo ilay marques mec : " , error);
                if (error?.response?.status === 401) {
                    await handleLogout();
                }
                return null;
            }

        },
        
        async getReferences(){
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            
            this.loading = true;
            try {
                const refefff = await axios.get(Config.SERVER_URL + "api/getRef",
                    {
                        headers:{
                            "Authorization" : sessionId
                        }
                    }
                );
                if (Array.isArray(refefff.data)) {
                    this.reference = refefff.data.map(
                        (mrkp) => ({ ...mrkp })
                    );
                } else if (
                    refefff.data &&
                    Array.isArray(refefff.data.target)
                ) {
                    this.reference = refefff.data.target.map(
                        (mrkp) => ({ ...mrkp })
                    );
                } else {
                    this.reference = [];
                    console.log(
                        "TSISY Marques ao am base fa mande requeten'ise"
                    );
                }
                return this.reference;
            } catch (error) {
                console.error("Tena tsy azo ilay marques mec : " , error);
                if (error?.response?.status === 401) {
                    await handleLogout();
                }
                return null;
            }

        },
        
        async getParametreRhtra(){
            const sessionId = localStorage.getItem("sessionId");
            const { handleLogout } = useLogout();
            
            this.loading = true;
            try {
                const refefff = await axios.get(Config.SERVER_URL + "api/getParametreRhtra",
                    {
                        headers:{
                            "Authorization" : sessionId
                        }
                    }
                );
                let listeParametres = null;
                if (Array.isArray(refefff.data)) {
                    listeParametres = refefff.data;
                } else if (refefff.data) {
                    const candidats = [refefff.data.target, refefff.data.data, refefff.data.result];
                    for (let i = 0; i < candidats.length; i += 1) {
                        if (Array.isArray(candidats[i])) {
                            listeParametres = candidats[i];
                            break;
                        }
                    }
                }
                if (listeParametres) {
                    this.parametre = listeParametres.map(
                        (mrkp) => typeof mrkp === "object" && mrkp !== null
                            ? Object.assign({}, mrkp)
                            : mrkp
                    );
                } else {
                    this.parametre = [];
                    console.log(
                        "TSISY Marques ao am base fa mande requeten'ise"
                    );
                }
                return this.parametre;
            } catch (error) {
                console.error("Tena tsy azo ilay marques mec : " , error);
                if (error?.response?.status === 401) {
                    await handleLogout();
                }
                return null;
            }

        },
        



        ////////////////////////////////////////////////////////////////////////////////////

        // async getHistorique(demandeCode) {
        //     if (!demandeCode || demandeCode === "-") {
        //         return [];
        //     }
        //     const sessionId = localStorage.getItem("sessionId");
        //     const { handleLogout } = useLogout();

        //     this.loading = true;
        //     try {
        //         const response = await axios.get(
        //             Config.SERVER_URL + "api/getHistorique",
        //             {
        //                 headers: {
        //                     Authorization: sessionId
        //                 },
        //                 params: {
        //                     DEMANDE_CODE: demandeCode
        //                 }
        //             }
        //         );
        //         console.log("Historique récupéré depuis l'API :", response.data);

        //         if (response.status === 204 || !response.data) {
        //             this.historique = [];
        //             return [];
        //         }

        //         let data = response.data;
        //         if (data && Array.isArray(data.target)) {
        //             data = data.target;
        //         }

        //         this.historique = Array.isArray(data) ? data : [];
        //         return this.historique;
        //     } catch (error) {
        //         console.error("Erreur lors de la récupération de l'historique :", error);
        //         if (error.response?.status === 401) {
        //             await handleLogout();
        //         }
        //         this.historique = [];
        //         return [];
        //     } finally {
        //         this.loading = false;
        //     }
        // },
      
    }
});
