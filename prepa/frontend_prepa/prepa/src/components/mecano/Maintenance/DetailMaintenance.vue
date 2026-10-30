<script setup>
import { ref, computed, onMounted, watch } from "vue";
import dayjs from "dayjs";
import { useDemandeMaintenance } from "@/store/Maintenance/demande_store";
import { useEtapeStore } from "@/store/Maintenance/etape_store";
import { maintStore } from "@/store/Maintenance/maintenance_store";

const props = defineProps({
  maintenance: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);


const tab = ref("prepa");


const loadingEtapes = ref(false);

const storeDemande = useDemandeMaintenance();
const storeMaint = maintStore();
const storeEtape = useEtapeStore();

const linkedMaintenance = ref(null);
const linkedDemande = ref(null);
const fetchedKm = ref(null);
const etapeEnCoursData = ref(null);

const formatDate = (date) => {
      if (!date) return "-";
      if (typeof date === "string" && /^\d{2}\/\d{2}\/\d{4}/.test(date)) {
        return date;
      }
      const d = dayjs(date);
      return d.isValid() ? d.format("DD/MM/YYYY") : String(date);
    };

  
const itemData = computed(() => {
      const obj = props.maintenance;
      if (!obj) return {};
      return obj.raw ? { ...obj.raw, ...obj } : obj;
    });

   
const listeTypesActions = computed(() => {
      return (storeEtape.actions)
        .map((e) => e.enum_CODE)
        .filter(Boolean);
});
    

const listeFournisseurs = computed(() => {
      return (storeEtape.fournisseurs )
        .map((e) => e.enum_CODE)
        .filter(Boolean);
});
const listeMarquePiece = computed(() => {
      return (storeEtape.marques)
        .map((e) => e.enum_CODE)
        .filter(Boolean);
});




const synchroniserDonnees = async () => {
      const dmdCode =
        itemData.value?.demande_CODE || itemData.value?.maint_DEMANDE 
      

      const mntCode =
        itemData.value?.maint_CODE;

      if (!storeMaint.maintnces || storeMaint.maintnces.length === 0) {
        try {
          await storeMaint.getMaintenances();
        } catch (e) {
          console.error("Erreur chargement maintenances :", e);
        }
      }

      if (dmdCode) {
        const m = (storeMaint.maintnces || []).find(
          (item) =>
            (item.maint_DEMANDE ) === dmdCode ||
            (mntCode && (item.maint_CODE ) === mntCode)
        );
        if (m) {
          linkedMaintenance.value = m;
        }
      }

      if (dmdCode && (!itemData.value?.demande_VOITURE || !itemData.value?.demande_DESCR)) {
        let d = (storeDemande.demandes || []).find(
          (item) => (item.demande_CODE ) === dmdCode
        );
        if (!d) {
          try {
            d = await storeDemande.getDemandeByDmdCode(dmdCode);
          } catch (e) {
            console.error("Erreur chargement demande reliée :", e);
          }
        }
        if (d) {
          linkedDemande.value = d;
        }
      }

      const kmFromMaint =
        itemData.value?.maint_KM ??
        linkedMaintenance.value?.maint_KM;

      if (kmFromMaint !== null && kmFromMaint !== undefined && kmFromMaint !== "") {
        fetchedKm.value = kmFromMaint;
      } else {
        const voitNum =
          itemData.value?.demande_VOITURE ||
          itemData.value?.DEMANDE_VOITURE ||
          linkedDemande.value?.demande_VOITURE ||
          linkedDemande.value?.DEMANDE_VOITURE;

        if (voitNum) {
          try {
            const km = await storeDemande.getKmVoiture(voitNum);
            if (km !== null && km !== undefined) {
              fetchedKm.value = km;
            }
          } catch (e) {
            console.error("Erreur récupération km voiture :", e);
          }
        }
      }
    };

const displayCode = computed(() => {
      return (
        itemData.value?.maint_CODE ||
        itemData.value?.MAINT_CODE ||
        linkedMaintenance.value?.maint_CODE ||
        itemData.value?.demande_CODE ||
        "DEMANDE"
      );
    });

const displayDate = computed(() => {
      return (
        itemData.value?.maint_DATE ||
        linkedMaintenance.value?.maint_DATE ||
        itemData.value?.demande_DATE ||
        null
      );
    });

const displayDemandeCode = computed(() => {
      return (
        itemData.value?.maint_DEMANDE ||
        itemData.value?.demande_CODE ||
        linkedDemande.value?.demande_CODE ||
        "-"
      );
    });

const displayDemandeDate = computed(() => {
      return (
        itemData.value?.demande_DATE ||
        linkedDemande.value?.demande_DATE ||
        itemData.value?.maint_DATE ||
        null
      );
    });

const displayType = computed(() => {
      return (
        itemData.value?.maint_TYPE ||
        linkedMaintenance.value?.maint_TYPE ||
        itemData.value?.demande_TYPE ||
        linkedDemande.value?.demande_TYPE ||
        "Type Maintenance "
      );
    });

const displayVehicule = computed(() => {
      const v =
        itemData.value?.demande_VOITURE ||
        linkedDemande.value?.demande_VOITURE ||
        itemData.value?.maint_VOITURE;
      const m =
        itemData.value?.demande_MARQUE ||
        linkedDemande.value?.demande_MARQUE;
      if (v && m) return `${m} (${v})`;
      return v || m || "Véhicule interne";
    });

const displayKm = computed(() => {
      const km =
        itemData.value?.maint_KM ??
        linkedMaintenance.value?.maint_KM ??
        fetchedKm.value ??
        itemData.value?.demande_KM ??
        itemData.value?.VOIT_KM;

      if (km !== null && km !== undefined && km !== "") {
        return `${km} km`;
      }
      return "-";
    });

const displayUserCre = computed(() => {
      return (
        itemData.value?.maint_USERCRE ||
        itemData.value?.MAINT_USERCRE ||
        linkedMaintenance.value?.maint_USERCRE ||
       
        itemData.value?.demande_USER_CRE ||
        
        linkedDemande.value?.demande_USER_CRE ||
        itemData.value?.demande_AUTEUR ||
        
        linkedDemande.value?.demande_AUTEUR ||
        "Admin"
      );
    });

const displayDateCre = computed(() => {
      return (
        itemData.value?.maint_DATECRE ||
        
        linkedMaintenance.value?.maint_DATECRE ||
        
        itemData.value?.demande_DATE_CRE ||
       
        linkedDemande.value?.demande_DATE_CRE ||
        null
      );
    });

const displayUserModif = computed(() => {
      return (
        itemData.value?.maint_USERMODIF ||
        linkedMaintenance.value?.maint_USERMODIF ||
        itemData.value?.demande_USER_MODIF ||
        linkedDemande.value?.demande_USER_MODIF ||
        null
      );
    });

const displayClassification = computed(() => {
      return (
        itemData.value?.maint_CLASSIFICATION ||
        itemData.value?.demande_CLASSIFICATION ||
        linkedMaintenance.value?.maint_CLASSIFICATION ||
        linkedDemande.value?.demande_CLASSIFICATION ||
        ""
      );
    });

const displayDescription = computed(() => {
      return (
        itemData.value?.demande_DESCR ||
        linkedDemande.value?.demande_DESCR ||
        itemData.value?.maint_CLASSIFICATION ||
        linkedMaintenance.value?.maint_CLASSIFICATION ||
        "Aucune description complémentaire saisie."
      );
    });

const isMaintenanceActive = computed(() => {
      const code = String(displayCode.value);
      return (
        code.startsWith("MNT") ||
        !!itemData.value?.maint_CODE ||
        !!linkedMaintenance.value?.maint_CODE 
      );
    });

const statusChipColor = computed(() => {
      const s = String(etapeEnCoursData.value?.statut || "").toUpperCase().trim();

      if (s.includes("REFUS") || s.includes("ANNUL")) return "#e53935";
      if (
        s.includes("TERMIN") ||
        s.includes("CLOTUR") ||
        s.includes("FINI") ||
        s.includes("PRET")
      )
        return "#0b3b17";
      if (s.includes("EN COURS") || s.includes("COURS")) return "#f57c00";
      if (s.includes("CRE") || s.includes("ATTENTE")) return "#1976d2";

      return isMaintenanceActive.value ? "#f57c00" : "#1976d2";
    });

const statusChipText = computed(() => {
      const raw = etapeEnCoursData.value?.statut;
      if (raw) {
        const s = String(raw).toUpperCase().trim();
        if (s.includes("EN COURS") || s.includes("COURS")) {
          const etape = etapeEnCoursData.value?.etape_EN_COURS || "";
          return etape ? `EN COURS — ${etape}` : "EN COURS";
        }
        if (s.includes("CRE") || s.includes("ATTENTE")) {
          return "ATTENTE VALIDATION";
        }
        return raw;
      }

      return isMaintenanceActive.value
        ? "MAINTENANCE ACTIVE"
        : "ATTENTE VALIDATION";
    });

const etapesPrepa = ref([]);
const etapesReal = ref([]);

const headersEtapes = [
      { title: "N°", key: "ligne_NUMERO", align: "start", width: "70px" },
      { title: "Étape d'intervention", key: "etape_LIBELLE", align: "start" },
      { title: "Date prévue", key: "etape_DATE_PREV", align: "start", width: "160px" },
      { title: "Date réalisation", key: "etape_DATE", align: "start", width: "220px" },
      { title: "Statut", key: "etape_STATUT", align: "center", width: "135px" },
      { title: "Intervenant", key: "etape_USER", align: "start", width: "180px" },
    ];

const headersEtapesReal = [
      { title: "N°", key: "ligne_NUMERO", align: "start", width: "55px" },
      { title: "Intervention", key: "etape_LIBELLE", align: "start", minWidth: "180px" },
      { title: "Date prévue", key: "etape_DATE_PREV", align: "start", width: "115px" },
      { title: "Action", key: "action", align: "start", width: "140px" },
      { title: "Fournisseur", key: "fournisseur", align: "start", width: "140px" },
      { title: "Marque", key: "marque", align: "start", width: "120px" },
      { title: "Prix (Ar)", key: "prix", align: "end", width: "115px" },
      { title: "Date réalisation", key: "etape_DATE", align: "center", width: "135px" },
      { title: "Statut", key: "etape_STATUT", align: "center", width: "105px" },
      { title: "Validation", key: "actions", align: "center", width: "100px" },
    ];

const formatMontant = (val) => {
      if (val === null || val === undefined || val === "") return "-";
      const num = Number(val);
      return isNaN(num) ? String(val) : num.toLocaleString("fr-FR") + " Ar";
    };

const etapesPrepaRealiseesCount = computed(() => {
      return etapesPrepa.value.filter((e) => !!e.etape_DATE).length;
    });

const etapesRealRealiseesCount = computed(() => {
      return etapesReal.value.filter((e) => !!e.etape_DATE).length;
    });

const getRowProps = ({ item }) => {
      const isRealisee = !!(item?.etape_DATE || item?.raw?.etape_DATE);
      return isRealisee ? { class: "row-realisee" } : {};
    };

const addBusinessDays = (date, days) => {
      let result = date;
      let remaining = days;
      while (remaining > 0) {
        result = result.add(1, "day");
        const dow = result.day(); // 0=dim, 6=sam
        if (dow !== 0 && dow !== 6) remaining--;
      }
      return result;
    };

const loadingActionPrepa = ref(false);

    // Validation d'une étape PREPA
const validerEtapePrepaAction = async (item) => {
      const code = getMaintCode();
      if (!code) {
        console.warn("[validerEtapePrepaAction] Aucun code maintenance trouvé");
        return;
      }
      loadingActionPrepa.value = true;
      try {
        const user = localStorage.getItem("username") || "Admin";
        // await storeEtape.validerEtapePrepa(code, item.code || item.etape_LIBELLE, user);
        await storeEtape.validerEtapePrepa(code, item.code || item.etape_LIBELLE);
        await chargerDonneesEtEtapes(false);
      } catch (err) {
        console.error("Erreur lors de la validation PREPA :", err);
      } finally {
        loadingActionPrepa.value = false;
      }
    };

const loadingActionReal = ref(false);

const validerEtapeRealDirect = async (item) => {
      if (incomplet(item)) return;
      if (!item.action)return;
      const code = getMaintCode();
      loadingActionReal.value = true;
      try {
        const verif = isVerification(item);
        await storeEtape.validerEtapeReal(code, {
          intervReal: item.etape_LIBELLE || item.code,
          action: item.action ,
          fournisseur: verif ? "" : (item.fournisseur || ""),
          marque: verif ? "" : (item.marque || ""),
          prix: verif ? null : (item.prix !== null && item.prix !== undefined && item.prix !== "" ? Number(item.prix) : null),
          dateReal: null, 
        });
        await chargerDonneesEtEtapes(false);
      } catch (err) {
        console.error("Erreur validation étape REAL :", err);
      } finally {
        loadingActionReal.value = false;
      }
    };

const dialogAjoutReal = ref(false);
const loadingAjoutReal = ref(false);
const erreurAjoutReal = ref("");
const formAjoutReal = ref({
      intervReal: "",
      datePrevu: dayjs().format("YYYY-MM-DD"),
      action: "",
      // fournisseur: "",
      // marque: "",
      // prix: null,
    });

    // const ouvrirDialogAjoutReal = () => {
    //   formAjoutReal.value = {
    //     intervReal: "",
    //     datePrevu: dayjs().format("YYYY-MM-DD"),
    //     action: "",
    //     fournisseur: "",
    //     marque: "",
    //     prix: null,
    //   };
    //   erreurAjoutReal.value = "";
    //   dialogAjoutReal.value = true;
    // };

    // const soumettreAjoutReal = async () => {
    //   if (!formAjoutReal.value.intervReal || !formAjoutReal.value.intervReal.trim()) {
    //     erreurAjoutReal.value = "Le libellé de l'intervention est obligatoire.";
    //     return;
    //   }
    //   const code = getMaintCode();
    //   if (!code) {
    //     erreurAjoutReal.value = "Code de maintenance introuvable.";
    //     return;
    //   }

    //   loadingAjoutReal.value = true;
    //   erreurAjoutReal.value = "";
    //   try {
    //     await storeEtape.ajouterEtapeReal(code, {
    //       intervReal: formAjoutReal.value.intervReal.trim(),
    //       datePrevu: formAjoutReal.value.datePrevu,
    //       action: formAjoutReal.value.action,
    //       fournisseur: formAjoutReal.value.fournisseur,
    //       marque: formAjoutReal.value.marque,
    //       prix: formAjoutReal.value.prix,
    //     });
    //     dialogAjoutReal.value = false;
    //     await chargerDonneesEtEtapes(false);
    //   } catch (err) {
    //     console.error("Erreur ajout étape REAL :", err);
    //     erreurAjoutReal.value = "Erreur lors de l'enregistrement de l'étape de réalisation.";
    //   } finally {
    //     loadingAjoutReal.value = false;
    //   }
    // };


  const ouvrirDialogAjoutReal = () => {
      formAjoutReal.value = {
        intervReal: "",
        datePrevu: dayjs().format("YYYY-MM-DD"),
         action: "",
        // fournisseur: "",
        // marque: "",
        // prix: null,
      };
      erreurAjoutReal.value = "";
      dialogAjoutReal.value = true;
    };

const soumettreAjoutReal = async () => {
      if (!formAjoutReal.value.intervReal || !formAjoutReal.value.intervReal.trim()) {
        erreurAjoutReal.value = "Le libellé de l'intervention est obligatoire.";
        return;
      }
      const code = getMaintCode();
      if (!code) {
        erreurAjoutReal.value = "Code de maintenance introuvable.";
        return;
      }

      loadingAjoutReal.value = true;
      erreurAjoutReal.value = "";
      try {
        await storeEtape.ajouterEtapeReal(code, {
          intervReal: formAjoutReal.value.intervReal.trim(),
          datePrevu: formAjoutReal.value.datePrevu,
           action: formAjoutReal.value.action,
          // fournisseur: formAjoutReal.value.fournisseur,
          // marque: formAjoutReal.value.marque,
          // prix: formAjoutReal.value.prix,
        });
        dialogAjoutReal.value = false;
        await chargerDonneesEtEtapes(false);
      } catch (err) {
        console.error("Erreur ajout étape REAL :", err);
        erreurAjoutReal.value = "Erreur lors de l'enregistrement de l'étape de réalisation.";
      } finally {
        loadingAjoutReal.value = false;
      }
    };




    
    // const ouvrirDialogAjoutReal = () => {
    //   formAjoutReal.value = {
    //     intervReal: "",
    //     datePrevu: dayjs().format("YYYY-MM-DD"),
    //     action: "",
    //     fournisseur: "",
    //     marque: "",
    //     prix: null,
    //   };
    //   erreurAjoutReal.value = "";
    //   dialogAjoutReal.value = true;
    // };

    // const soumettreAjoutReal = async () => {
    //   if (!formAjoutReal.value.intervReal || !formAjoutReal.value.intervReal.trim()) {
    //     erreurAjoutReal.value = "Le libellé de l'intervention est obligatoire.";
    //     return;
    //   }
    //   const code = getMaintCode();
    //   if (!code) {
    //     erreurAjoutReal.value = "Code de maintenance introuvable.";
    //     return;
    //   }

    //   loadingAjoutReal.value = true;
    //   erreurAjoutReal.value = "";
    //   try {
    //     await storeEtape.ajouterEtapeReal(code, {
    //       intervReal: formAjoutReal.value.intervReal.trim(),
    //       datePrevu: formAjoutReal.value.datePrevu,
    //       action: formAjoutReal.value.action,
    //       fournisseur: formAjoutReal.value.fournisseur,
    //       marque: formAjoutReal.value.marque,
    //       prix: formAjoutReal.value.prix,
    //     });
    //     dialogAjoutReal.value = false;
    //     await chargerDonneesEtEtapes(false);
    //   } catch (err) {
    //     console.error("Erreur ajout étape REAL :", err);
    //     erreurAjoutReal.value = "Erreur lors de l'enregistrement de l'étape de réalisation.";
    //   } finally {
    //     loadingAjoutReal.value = false;
    //   }
    // };




const demandeTerminee = ref(false);
const loadingCloture = ref(false);

const toutesEtapesValidees = computed(() => {
  const all = [...etapesPrepa.value, ...etapesReal.value];
  return all.length > 0 && all.every((e) => e.valide);
});

const choisirOngletInitial = () => {
  const prepaTerminee =
    etapesPrepa.value.length > 0 && etapesPrepa.value.every((e) => e.valide);
  tab.value = prepaTerminee && etapesReal.value.length > 0 ? "realisation" : "prepa";
};




    // const listEtape = async (classification = null) => {
    //   loadingEtapes.value = true;
    //   try {
    //     const classif = (classification || displayClassification.value ).trim();
    //     const repApi = await storeEtape.getListeEtapes("PREPA", classif);
    //     console.log("Étapes PREPA récupérées depuis l'API :", repApi);

    //     if (Array.isArray(repApi) && repApi.length > 0) {
    //       const baseDateRaw =
    //         displayDemandeDate.value ||
    //         displayDate.value ||
    //         itemData.value?.demande_DATE ||
    //         itemData.value?.maint_DATE ||
    //         new Date();

    //       let currentDate = dayjs(baseDateRaw);

    //       etapesPrepa.value = repApi.map((item, index) => {
    //         const dureeJours = Number(item.DUREE ?? item.duree ?? 0);
    //         currentDate = addBusinessDays(currentDate, dureeJours);

    //         return {
    //           ligne_NUMERO: item.ordre ?? index + 1,
    //           etape_LIBELLE:  item.code ?? item.valeur,
    //           duree: dureeJours,
    //           etape_DATE_PREV: currentDate.toISOString(),
    //           etape_DATE: null,
    //           etape_USER: "",
    //           enCours: index === 0,
    //           valide: false,
    //           menuOpen: false,
    //           tempDate: "",
    //           nature: "PREPA",
    //           code: item.code,
    //           valeur:item.valeur,
    //           ordre: item.ordre ?? index + 1,
    //           etat_ID: item.etat_ID,
    //           raw: item,
    //         };
    //       });
    //     } else {
    //       etapesPrepa.value = [];
    //     }
    //   } catch (error) {
    //     console.error("Erreur lors de la récupération des étapes PREPA :", error);
    //     etapesPrepa.value = [];
    //   }
    // };

    
    // const listEtapeReal = async (classification = null) => {
    //   loadingEtapes.value = true;
    //   try {
    //     const classif = (classification || displayClassification.value).trim();
    //     const repApi = await storeEtape.getListeEtapes("REAL", classif);
    //     console.log("Étapes REAL récupérées depuis l'API :", repApi);

    //     if (Array.isArray(repApi) && repApi.length > 0) {
    //       // La date de base REAL = fin de la dernière étape PREPA
    //       const baseDateRaw = (() => {
    //         if (etapesPrepa.value.length > 0) {
    //           return etapesPrepa.value[etapesPrepa.value.length - 1].etape_DATE_PREV;
    //         }
    //         return displayDemandeDate.value ||
    //           displayDate.value ||
    //           itemData.value?.demande_DATE ||
    //           itemData.value?.maint_DATE ||
    //           new Date();
    //       })();

    //       let currentDate = dayjs(baseDateRaw);

    //       etapesReal.value = repApi.map((item, index) => {
    //         const dureeJours = Number(item.DUREE ?? item.duree ?? 0);
    //         currentDate = addBusinessDays(currentDate, dureeJours);

    //         return {
    //           ligne_NUMERO: item.ordre ?? index + 1,
    //           etape_LIBELLE: item.code ??  item.valeur,
    //           duree: dureeJours,
    //           etape_DATE_PREV: currentDate.toISOString(),
    //           etape_DATE: null,
    //           etape_USER: "",
    //           enCours: false,
    //           valide: false,
    //           menuOpen: false,
    //           tempDate: "",
    //           nature: "REAL",
    //           code: item.code,
    //           valeur:  item.valeur,
    //           ordre:  item.ordre ?? index + 1,
    //           etat_ID: item.etat_ID,
    //           raw: item,
    //         };
    //       });
    //     } else {
    //       etapesReal.value = [];
    //     }
    //   } catch (error) {
    //     console.error("Erreur lors de la récupération des étapes REAL :", error);
    //     etapesReal.value = [];
    //   }
    // };
const getMaintCode = (maintCode = null) =>
  maintCode ||
  itemData.value?.maint_CODE ||
  itemData.value?.MAINT_CODE ||
  itemData.value?.maint_CODE_LIGNE ||
  itemData.value?.MAINT_CODE_LIGNE ||
  linkedMaintenance.value?.maint_CODE ||
  linkedMaintenance.value?.MAINT_CODE ||
  props.maintenance?.maint_CODE ||
  props.maintenance?.MAINT_CODE ||
  props.maintenance?.raw?.maint_CODE;

const toIso = (d) => (d ? dayjs(d).toISOString() : null);

const listEtape = async (maintCode = null) => {
  loadingEtapes.value = true;
  try {
const code = getMaintCode(maintCode);
    if (!code) {
      etapesPrepa.value = [];
      return;
    }
const repApi = await storeEtape.getListePrepaMaint(code);
    console.log("Étapes PREPA récupérées depuis l'API :", repApi);

    if (Array.isArray(repApi) && repApi.length > 0) {
      const liste = repApi.map((item, index) => ({
        ligne_NUMERO: index + 1,
        etape_LIBELLE: item.maint_ETAPE_LIGNE,
        etape_DATE_PREV: toIso(item.maint_ETAPE_PREVU),
        etape_DATE: item.maint_ETAPE_REEL ?? null,
        etape_USER: item.maint_ETAPE_USER ?? item.intervenant ?? item.MAINT_INTERVENANT ?? item.maint_USER ?? item.MAINT_USER ?? "", 
        enCours: Number(item.maint_ETAPE_ETAT) === 1,
        valide: Number(item.maint_ETAPE_ETAT) === 2,
        menuOpen: false,
        tempDate: "",
        nature: "PREPA",
        code: item.maint_ETAPE_LIGNE,
        valeur: item.maint_ETAPE_LIGNE,
        ordre: index + 1,
        etat_ID: item.maint_ETAPE_ETAT,
        raw: item,
      }));

    
      etapesPrepa.value = liste;
    } else {
      etapesPrepa.value = [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des étapes PREPA :", error);
    etapesPrepa.value = [];
  } finally {
    loadingEtapes.value = false;
  }
};

const listEtapeReal = async (maintCode = null) => {
  loadingEtapes.value = true;
  try {
const code = getMaintCode(maintCode);
    console.log("[listEtapeReal] code maintenance résolu :", code);
    
const repApi = await storeEtape.getListeRealMaint(code);
    // console.log("Étapes REAL tao amleAPI :", repApi);



    if (Array.isArray(repApi) && repApi.length > 0) {


      const prepaTerminee = etapesPrepa.value.length === 0 ||
        etapesPrepa.value.every((e) => Number(e.etat_ID) === 2);

      const liste = repApi.map((item, index) => {
        const action = item.maint_ACTION_REAL ?? item.MAINT_ACTION_REAL ?? item.maintActionReal ?? item.action ?? "";
        const fnr = item.maint_FNR_REAL ?? item.MAINT_FNR_REAL ?? item.maintFnrReal ?? item.fournisseur ?? "";
        const prix = item.maint_PRIX_REAL ?? item.MAINT_PRIX_REAL ?? item.maintPrixReal ?? item.prix ?? null;
        const marque = item.maint_MRAQUE_MARQUE ?? item.MAINT_MRAQUE_MARQUE ?? item.maint_MARQUE_REAL ?? item.MAINT_MARQUE_REAL ?? item.maintMraqueMarque ?? item.maintMarqueReal ?? item.marque ?? "";
        const dateReal = item.maint_DATE_REAL ?? item.MAINT_DATE_REAL ?? item.maintDateReal ?? null;
        const datePrev = item.maint_DATE_PREVU ?? item.MAINT_DATE_PREVU ?? item.maintDatePrevu ?? null;
        const interv = item.maint_INTERV_REAL ?? item.MAINT_INTERV_REAL ?? item.maintIntervReal ?? "";

        return {
          ligne_NUMERO: index + 1,
          etape_LIBELLE: interv,
          etape_DATE_PREV: toIso(datePrev),
          etape_DATE: dateReal ? toIso(dateReal) : null,
          etape_USER: item.maint_USER ?? item.MAINT_USER ?? "",
          action: action,
          fournisseur: fnr,
          prix: prix,
          marque: marque,
          enCours: false, 
          valide: prepaTerminee && !!dateReal,
          menuOpen: false,
          tempDate: "",
          nature: "REAL",
          code: interv,
          valeur: interv,
          ordre: index + 1,
          etat_ID: (prepaTerminee && dateReal) ? 2 : 0,
          raw: item,
        };
      });

      
      if (prepaTerminee) {
        const idx = liste.findIndex((e) => !e.valide);
        if (idx !== -1) {
          liste[idx].enCours = true;
          liste[idx].etat_ID = 1;
        }
      }

      etapesReal.value = liste;
    } else {
      etapesReal.value = [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des étapes REAL :", error);
    etapesReal.value = [];
  } finally {
    loadingEtapes.value = false;
  }
};


const calculerDemandeTerminee = () => {
  const allPrepaOk = etapesPrepa.value.length > 0 &&
    etapesPrepa.value.every((e) => Number(e.etat_ID) === 2);
  const allRealOk = etapesReal.value.length > 0 &&
    etapesReal.value.every((e) => e.valide);
  demandeTerminee.value = allPrepaOk && allRealOk;
};


const chargerDonneesEtEtapes = async (choisirOnglet = true) => {
      loadingEtapes.value = true;
      try {
        console.log("[chargerDonneesEtEtapes] props.maintenance.maint_CODE:", props.maintenance?.maint_CODE);
        await synchroniserDonnees();
        console.log("[chargerDonneesEtEtapes] getMaintCode() =", getMaintCode());

        const dmdCode =
          itemData.value?.demande_CODE ||
          itemData.value?.maint_DEMANDE ||
          displayDemandeCode.value;
        if (dmdCode && dmdCode !== "-") {
          const res = await storeEtape.getEtapeEnCours(dmdCode);
          if (res) etapeEnCoursData.value = res;
        }

        await listEtape();
        await listEtapeReal();
        calculerDemandeTerminee();
        if (choisirOnglet) choisirOngletInitial();
      } finally {
        loadingEtapes.value = false;
      }
    };

const fermerDmd = async () => {
        const code =
          itemData.value?.demande_CODE ||
          itemData.value?.maint_DEMANDE ||
          displayDemandeCode.value;
        if (!code || code === "-") return;

        loadingCloture.value = true;
        try {
          const ok = await storeEtape.cloturerDemande(code);
          if (ok) demandeTerminee.value = true;
          await chargerDonneesEtEtapes();
          
        } finally {
          loadingCloture.value = false;
          
        }
      };


// Quand l'action est "VERIFICATION", vider Marque, Fournisseur et Prix
const isVerification = (item) => {
      return String(item.action || "").toUpperCase() === "VERIFICATION";
    };
    
const actReparation = (item) => {
      return String(item.action || "").toUpperCase() === "REPARATION";
    };

  const requis = (item) => String(item.action || "").toUpperCase().startsWith("REMPLAC");

const incomplet = (item) => requis(item) && (!item.fournisseur || !item.marque || !(Number(item.prix) > 0)) ;

const onActionChange = (item) => {
      if (isVerification(item)) {
        item.fournisseur = "";
        item.marque = "";
        item.prix = null;
      }
      
    };

//FONCTION PRIX NEGATIF
      const prixInvalide = (v) => v !== '' && v !== null && v !== undefined && Number(v) <= 0

      function bloquerCaracteres(e) {
        if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault()
      }

        function corrigerPrix(item) {
          if (prixInvalide(item.prix)) item.prix = null
        }


    watch(
      () => props.maintenance,
      async () => {
        await chargerDonneesEtEtapes();
      }
    );

    onMounted(async () => {
      await chargerDonneesEtEtapes();
      await storeEtape.getTypeActionReal();
      await storeEtape.getFournisseurs();
      await storeEtape.getMarques();

    });

</script>


<template>
  <v-card class="detail-maintenance-card">
    <!-- En-tête : Titre, code et bouton fermer -->
    <v-card-title class="custom-card-dm">
      <div class="title-container">
        <div class="title-left">
          <v-icon size="24" color="deep-purple-accent-4" class="mr-2">mdi-wrench-cog</v-icon>
          <span class="title-text">
            <strong>Détail de la maintenance - </strong>
            <span class="maint-code">{{ displayCode }}</span>
            <span v-if="displayDate" class="maint-date"> - {{ formatDate(displayDate) }}</span>
          </span>
          <v-chip
          size="small"
          class="ml-3 font-weight-bold"
          :color="statusChipColor"
          variant="flat"
          >
          {{ statusChipText }}
        </v-chip>
      </div>
      
   

        <div class="d-flex align-center">
          <v-btn
            size="small"
            variant="tonal"
            color="deep-purple-accent-4"
            prepend-icon="mdi-refresh"
            class="mr-2 text-none"
            :loading="loadingEtapes"
            @click="chargerDonneesEtEtapes(false)"
          >
            Actualiser
          </v-btn>
          <v-btn
            icon
            variant="text"
            color="grey-darken-1"
            size="small"
            class="close-btn"
            aria-label="Fermer"
            @click="$emit('close')"
          >
            <v-icon size="22">mdi-close</v-icon>
          </v-btn>

        </div>
      </div>
    </v-card-title>

    <v-divider class="my-2"></v-divider>

    <!-- Informations principales (3 cartes alignées comme RH mais aérées) -->
    <v-card-text class="pt-0">
      <div class="info-principale-cards">
        <v-row dense class="info-row-container">
          <!-- Carte 1 : Demande -->
          <v-col cols="12" md="3">
            <v-card class="info-card" outlined>
              <v-card-title class="card-title">DEMANDE</v-card-title>
              <v-card-text class="pa-2">
                <div class="info-row">
                  <v-text-field
                    label="Code"
                    variant="outlined"
                    density="compact"
                    :model-value="displayDemandeCode"
                    readonly
                    hide-details
                    class="readonly-field"
                  />
                  <v-text-field
                    label="Date demande"
                    variant="outlined"
                    density="compact"
                    :model-value="formatDate(displayDemandeDate)"
                    readonly
                    hide-details
                    class="readonly-field"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Carte 2 : Véhicule & Travaux -->
          <v-col cols="12" md="5">
            <v-card class="info-card" outlined>
              <v-card-title class="card-title">VÉHICULE & TRAVAUX</v-card-title>
              <v-card-text class="pa-2">
                <div class="info-row">
                  <v-text-field
                    label="Type"
                    variant="outlined"
                    density="compact"
                    :model-value="displayType"
                    readonly
                    hide-details
                    class="readonly-field"
                    style="max-width: 130px"
                  />
                  <v-text-field
                    label="Véhicule / Immat."
                    variant="outlined"
                    density="compact"
                    :model-value="displayVehicule"
                    readonly
                    hide-details
                    class="readonly-field"
                  />
                  <v-text-field
                    label="Km"
                    variant="outlined"
                    density="compact"
                    :model-value="displayKm"
                    readonly
                    hide-details
                    class="readonly-field"
                    style="max-width: 100px"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Carte 3 : Traçabilité -->
          <v-col cols="12" md="4">
            <v-card class="info-card tracabilite-card" outlined>
              <v-card-title class="card-title" style="justify-content: flex-end">TRAÇABILITÉ</v-card-title>
              <v-card-text class="pa-2">
                <div class="info-row">
                  <v-text-field
                    label="Créé par"
                    variant="outlined"
                    density="compact"
                    :model-value="displayUserCre"
                    readonly
                    hide-details
                    class="readonly-field"
                    style="max-width: 130px"
                  />
                  <v-text-field
                    label="Date création"
                    variant="outlined"
                    density="compact"
                    :model-value="formatDate(displayDateCre)"
                    readonly
                    hide-details
                    class="readonly-field"
                  />
                  <v-text-field
                    v-if="displayUserModif"
                    label="Modifié par"
                    variant="outlined"
                    density="compact"
                    :model-value="displayUserModif"
                    readonly
                    hide-details
                    class="readonly-field"
                    style="max-width: 120px"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-divider class="my-2"></v-divider>

      
      <v-toolbar :elevation="1" density="compact" color="#d7ead5" class="tabs-toolbar">
        <v-tabs
          v-model="tab"
          color="deep-purple-accent-4"
          background-color="#d7ead5"
          class="custom-tabs"
          grow
          :show-arrows="false"
          slider-color="deep-purple-accent-4"
        >
          <v-tab value="prepa" class="tab-item">
            PRÉPARATION
            <v-badge
              :content="etapesPrepa.length"
              color="#FF8A65"
              inline
              class="ml-1"
            />
          </v-tab>
          <v-tab value="realisation" class="tab-item">
            RÉALISATION
            <v-badge
              :content="etapesReal.length"
              color="#388e3c"
              inline
              class="ml-1"
            />
          </v-tab>
           <!-- <v-tab value="description" class="tab-item">
            DESCRIPTION & OBSERVATIONS
          </v-tab> -->
    <!--      <v-tab value="pieces" class="tab-item">
            PIÈCES & FOURNITURES
            <v-badge
              content="0"
              color="#9E9E9E"
              inline
              class="ml-1"
            />
          </v-tab> -->
        </v-tabs>
      </v-toolbar>

      <v-card class="mt-3 tab-content-card" variant="outlined" style="border-color: #e0e0e0">


        <v-card-text class="pa-2 tab-content-body">


          <div v-if="tab === 'prepa'" class="tab1 tableau-maint-wrapper">
            <!-- Skeleton loading comme les listes -->
            <div v-if="loadingEtapes" class="pa-3 flex-grow-1 overflow-hidden">
              <div class="d-flex ga-2 mb-3">
                <v-skeleton-loader
                  v-for="(header, idx) in headersEtapes"
                  :key="'sk-prepa-head-' + idx"
                  type="chip"
                  class="flex-grow-1"
                />
              </div>
              <v-skeleton-loader
                v-for="n in 5"
                :key="'sk-prepa-row-' + n"
                type="table-row"
                class="my-1"
              />
            </div>

            <v-data-table
              v-else
              :headers="headersEtapes"
              :items="etapesPrepa"
              :row-props="getRowProps"
              density="compact"
              hover
              hide-default-footer
              class="custom-table1 dettab"
            >
            
              <template #headers="{ columns }">
                <tr>
                  <th
                    v-for="column in columns"
                    :key="column.key"
                    class="table-header"
                    :style="column.width ? { width: column.width, minWidth: column.width } : {}"
                  >
                    {{ column.title }}
                  </th>
                </tr>
              </template>

              <!-- Colonne N° -->
              <template v-slot:[`item.ligne_NUMERO`]="{ item }">
                <span class="font-weight-bold text-medium-emphasis">
                  #{{ item.ligne_NUMERO }}
                </span>
              </template>

              <!-- Colonne Libellé -->
              <template v-slot:[`item.etape_LIBELLE`]="{ item }">
                <span class="font-weight-bold">{{ item.etape_LIBELLE }}</span>
              </template>

              <!-- Colonne Date prévue -->
              <template v-slot:[`item.etape_DATE_PREV`]="{ item }">
                <span>{{ item.etape_DATE_PREV ? formatDate(item.etape_DATE_PREV) : "-" }}</span>
              </template>

              <!-- Colonne Date réalisation -->
              <template v-slot:[`item.etape_DATE`]="{ item }">
                <div class="cell-with-button d-flex align-center justify-center">
                  <template v-if="item.etape_DATE">
                    <v-icon size="16" color="green-darken-1" class="mr-1">mdi-check-circle</v-icon>
                    <span class="cell-text">{{ formatDate(item.etape_DATE) }}</span>
                  </template>

                  <template v-else-if="item.enCours">
                    <v-btn
                      size="x-small"
                      variant="tonal"
                      color="success"
                      class="tb-date-btn"
                      :loading="loadingActionPrepa"
                      @click="validerEtapePrepaAction(item)"
                    >
                      Valider
                    </v-btn>
                  </template>

                  <template v-else>
                    <span class="text-grey text-caption">—</span>
                  </template>
                </div>
              </template>

              <!-- Colonne Statut -->
              <template v-slot:[`item.etape_STATUT`]="{ item }">
                <v-chip
                  size="x-small"
                  :color="item.etape_DATE ? 'green-darken-1' : (item.enCours ? 'deep-purple-accent-4' : 'grey')"
                  variant="flat"
                  class="font-weight-medium"
                >
                  {{ item.etape_DATE ? 'Réalisée' : (item.enCours ? 'En cours' : 'À venir') }}
                </v-chip>
              </template>

              <!-- Colonne Intervenant -->
              <template v-slot:[`item.etape_USER`]="{ item }">
                <span class="text-caption text-medium-emphasis">
                  {{ item.etape_USER || "" }}
                </span>
              </template>
            </v-data-table>

            <div v-if="!loadingEtapes" class="summary-line mt-2">
              <b>{{ etapesPrepa.length }}</b> étape<span v-if="etapesPrepa.length > 1">s</span> de préparation &bull;
              <b>{{ etapesPrepaRealiseesCount }}</b> réalisée<span v-if="etapesPrepaRealiseesCount > 1">s</span> &bull;
              <b>{{ etapesPrepa.length - etapesPrepaRealiseesCount }}</b> restante<span v-if="etapesPrepa.length - etapesPrepaRealiseesCount > 1">s</span>.
            </div>
          </div>

          <div v-else-if="tab === 'realisation'" class="tab1 tableau-maint-wrapper">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-caption text-medium-emphasis d-flex align-center">
                <v-icon size="16" color="deep-purple-accent-4" class="mr-1">mdi-tools</v-icon>
              </div>
              <v-btn
                size="small"
                color="deep-purple-accent-4"
                variant="flat"
                prepend-icon="mdi-plus-circle"
                class="text-none font-weight-bold"
                @click="ouvrirDialogAjoutReal"
              >
                Ajouter une réalisation
              </v-btn>
            </div>

            <div v-if="loadingEtapes" class="pa-3 flex-grow-1 overflow-hidden">
              <div class="d-flex ga-2 mb-3">
                <v-skeleton-loader
                  v-for="(header, idx) in headersEtapesReal"
                  :key="'sk-real-head-' + idx"
                  type="chip"
                  class="flex-grow-1"
                />
              </div>
              <v-skeleton-loader
                v-for="n in 5"
                :key="'sk-real-row-' + n"
                type="table-row"
                class="my-1"
              />
            </div>

            <v-data-table
              v-else
              :headers="headersEtapesReal"
              :items="etapesReal"
              :row-props="getRowProps"
              density="compact"
              hover
              hide-default-footer
              class="custom-table1 dettab"
            >
              <template #headers="{ columns }">
                <tr>
                  <th
                    v-for="column in columns"
                    :key="column.key"
                    class="table-header"
                    :style="column.width ? { width: column.width, minWidth: column.width } : {}"
                  >
                    {{ column.title }}
                  </th>
                </tr>
              </template>

              <!-- Colonne N° -->
              <template v-slot:[`item.ligne_NUMERO`]="{ item }">
                <span class="font-weight-bold text-medium-emphasis">
                  #{{ item.ligne_NUMERO }}
                </span>
              </template>

              <!-- Colonne Libellé -->
              <template v-slot:[`item.etape_LIBELLE`]="{ item }">
                <span class="font-weight-bold">{{ item.etape_LIBELLE }}</span>
              </template>

              <!-- Colonne Date prévue -->
              <template v-slot:[`item.etape_DATE_PREV`]="{ item }">
                <span>{{ item.etape_DATE_PREV ? formatDate(item.etape_DATE_PREV) : "-" }}</span>
              </template>





              <!-- Colonne Action -->
              <template v-slot:[`item.action`]="{ item }">
                <template v-if="!item.etape_DATE && item.enCours">
                  <v-autocomplete
                    v-model="item.action"
                    :items="listeTypesActions"
                    placeholder="Action..."
                    density="compact"
                    variant="underlined"
                    clearable
                    hide-details
                    required
                    class="table-inline-input"
                    @update:modelValue="onActionChange(item)"
                  />
                </template>
                <template v-else>
                  <span class="text-caption">{{ item.action || "-" }}</span>
                </template>
              </template>

              <!-- Colonne Fournisseur -->
              <template v-slot:[`item.fournisseur`]="{ item }">
                <template v-if="!item.etape_DATE && item.enCours">
                  <v-autocomplete
                    v-model="item.fournisseur"
                    :items="listeFournisseurs"
                    placeholder="Fournisseur..."
                    density="compact"
                    variant="underlined"
                    clearable
                    hide-details
                    class="table-inline-input"
                    :disabled="isVerification(item)"
                    :error="requis(item) && !item.fournisseur"
                  />
                </template>
                <template v-else>
                  <span class="text-caption">{{ item.fournisseur || "-" }}</span>
                </template>
              </template>

              <!-- Colonne Marque -->
              <template v-slot:[`item.marque`]="{ item }">
                <template v-if="!item.etape_DATE && item.enCours">
                  <v-autocomplete 
                    v-model="item.marque"
                    :items="listeMarquePiece"
                    placeholder="Marque..."
                    density="compact"
                    variant="underlined"
                    clearable
                    hide-details
                    class="table-inline-input"
                    :disabled="isVerification(item)"
                    :error="requis(item) && !item.marque"
                    
                  />
                </template>
                <template v-else>
                  <span class="text-caption">{{ item.marque || "-" }}</span>
                </template>
              </template>





              <!-- Colonne Prix -->
              <template v-slot:[`item.prix`]="{ item }">
                <template v-if="!item.etape_DATE && item.enCours">
                  <v-text-field
                  v-model.number="item.prix"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Prix"
                  density="compact"
                  variant="underlined"
                  hide-details
                  :error="prixInvalide(item.prix)"
                  class="table-inline-input text-right"
                  :disabled="isVerification(item)"
                  @keydown="bloquerCaracteres"
                  @blur="corrigerPrix(item)"
                />
                </template>
                <template v-else>
                  <span class="font-weight-bold text-caption" :class="{ 'text-primary': !!item.prix }">
                    {{ formatMontant(item.prix) }}
                  </span>
                </template>
              </template>





              <!-- Colonne Date réalisation -->
              <template v-slot:[`item.etape_DATE`]="{ item }">
                <div class="d-flex align-center justify-center">
                  <template v-if="item.etape_DATE">
                    <v-icon size="16" color="green-darken-1" class="mr-1">mdi-check-circle</v-icon>
                    <span class="cell-text">{{ formatDate(item.etape_DATE) }}</span>
                  </template>
                  <template v-else>
                    <span class="text-grey text-caption">—</span>
                  </template>
                </div>
              </template>

              <!-- Colonne Statut -->
              <template v-slot:[`item.etape_STATUT`]="{ item }">
                <v-chip
                  size="x-small"
                  :color="item.etape_DATE ? 'green-darken-1' : (item.enCours ? 'deep-purple-accent-4' : 'grey')"
                  variant="flat"
                  class="font-weight-medium"
                >
                  {{ item.etape_DATE ? 'Réalisée' : (item.enCours ? 'En cours' : 'À venir') }}
                </v-chip>
              </template>

              <!-- Colonne Validation -->
              <template v-slot:[`item.actions`]="{ item }">
                <div class="d-flex align-center justify-center">
                  <template v-if="item.etape_DATE">
                    <v-icon size="18" color="green-darken-1">mdi-check-decagram</v-icon>
                  </template>
                  <template v-else-if="item.enCours">
                    <v-btn
                      size="x-small"
                      variant="tonal"
                      color="success"
                      class="tb-date-btn"
                      prepend-icon="mdi-check"
                      :loading="loadingActionReal"
                      :disabled="incomplet(item)" || {{ (!item.action) }}
                      @click="validerEtapeRealDirect(item)"
                    >
                      Valider
                    </v-btn>
                  </template>
                  <template v-else>
                    <span class="text-grey text-caption">—</span>
                  </template>
                </div>
              </template>
            </v-data-table>

            <div v-if="!loadingEtapes" class="summary-line mt-2">
              <b>{{ etapesReal.length }}</b> étape<span v-if="etapesReal.length > 1">s</span> de réalisation &bull;
              <b>{{ etapesRealRealiseesCount }}</b> réalisée<span v-if="etapesRealRealiseesCount > 1">s</span> &bull;
              <b>{{ etapesReal.length - etapesRealRealiseesCount }}</b> restante<span v-if="etapesReal.length - etapesRealRealiseesCount > 1">s</span>.
            </div>
          </div>

          <!-- Ito ONGLET DESCRIPTION -->
          <div v-else-if="tab === 'description'" class="pa-4">
            <h4 class="text-subtitle-2 mb-2 font-weight-bold" style="color: #388e3c">
              Motif & Description de l'intervention
            </h4>
            <v-card variant="flat" color="#f9fbf9" class="pa-3 rounded border">
              <p class="text-body-2 mb-0" style="white-space: pre-wrap">
                {{ displayDescription }}
              </p>
            </v-card>

            <v-row class="mt-4" dense>
              <v-col cols="6">
                <div class="text-caption text-medium-emphasis">Classification</div>
                <div class="text-body-2 font-weight-bold">{{ displayClassification }}</div>
              </v-col>
              <v-col cols="6">
                <div class="text-caption text-medium-emphasis">Véhicule</div>
                <div class="text-body-2 font-weight-bold">{{ displayVehicule }}</div>
              </v-col>
            </v-row>
          </div>

          <!-- ONGLETS PIÈCES REQUISES -->
          <!-- <div v-else-if="tab === 'pieces'" class="pa-6 text-center">
            <v-icon size="40" color="grey-lighten-1" class="mb-2">mdi-cog-box</v-icon>
            <div class="text-body-2 text-medium-emphasis">
              Aucune pièce détachée spécifique enregistrée pour cette maintenance.
            </div>
          </div> -->
        </v-card-text>
      </v-card>
    </v-card-text>

   
    <v-card-actions class="px-4 py-2">
  <div class="text-caption text-medium-emphasis ml-2">
    Module Maintenance &bull; ERPO
  </div>
  <v-spacer />

  <v-chip
    v-if="demandeTerminee"
    size="medium &"
    color="green-darken-1"
    variant="flat"
    class="mr-3 font-weight-bold"
    prepend-icon="mdi-check-decagram"
  >
    Demande clôturée
  </v-chip>

  <v-btn
    v-if="toutesEtapesValidees && !demandeTerminee"
    color="success"
    variant="flat"
    density="compact"
    class="px-4 mr-3 font-weight-bold"
    prepend-icon="mdi-flag-checkered"
    :loading="loadingCloture"
    @click="fermerDmd()"
  >
    CLOTURER DEMANDE
  </v-btn>

  <v-btn
    color="red-darken-1"
    density="compact"
    variant="outlined"
    class="px-4"
    @click="$emit('close')"
  >
    Fermer
  </v-btn>
</v-card-actions>


    <!-- Dialog Ajout Étape Réalisation -->




    <v-dialog v-model="dialogAjoutReal" max-width="580" scrim="black" persistent>
      <v-card class="pa-2 rounded-lg">
        <v-card-title class="d-flex align-center font-weight-bold" style="color: #6200ea">
          <v-icon color="deep-purple-accent-4" class="mr-2">mdi-plus-circle-outline</v-icon>
          <span>Nouvelle étape de réalisation</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" size="small" :disabled="loadingAjoutReal" @click="dialogAjoutReal = false" />
        </v-card-title>

        <v-card-text>
          <v-alert
            v-if="erreurAjoutReal"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-3"
            closable
            @click:close="erreurAjoutReal = ''"
          >
            {{ erreurAjoutReal }}
          </v-alert>

          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="formAjoutReal.intervReal"
                label="Intervention / Libellé de l'étape *"
                placeholder="Ex: Changement filtre à huile..."
                variant="outlined"
                density="compact"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formAjoutReal.datePrevu"
                label="Date prévue"
                type="date"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formAjoutReal.action"
                label="Action (optionnel)"
                placeholder="Ex: Remplacement"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <!-- <v-col cols="12" md="6">
              <v-text-field
                v-model="formAjoutReal.fournisseur"
                label="Fournisseur (optionnel)"
                placeholder="Ex: Fournisseur X"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formAjoutReal.marque"
                label="Marque (optionnel)"
                placeholder="Ex: Marque Y"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model.number="formAjoutReal.prix"
                label="Prix estimé / Coût (Ar)"
                type="number"
                suffix="Ar"
                variant="outlined"
                density="compact"
              />
            </v-col> -->
          </v-row>
        </v-card-text>

        <v-card-actions class="px-4 pb-3">
          <v-spacer />
          <v-btn
            variant="outlined"
            density="compact"
            :disabled="loadingAjoutReal"
            @click="dialogAjoutReal = false"
          >
            Annuler
          </v-btn>
          <v-btn
            color="deep-purple-accent-4"
            variant="flat"
            density="compact"
            prepend-icon="mdi-plus"
            class="px-4 font-weight-bold"
            :loading="loadingAjoutReal"
            @click="soumettreAjoutReal"
          >
            Ajouter l'étape
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>



<style>
/* ===== Card Container (hauteur fixe pour éviter tout saut lors du changement d'onglet) ===== */
.detail-maintenance-card {
  height: 680px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ===== Card Header ===== */
.detail-maintenance-card .custom-card-dm {
  background-color: #f7faf7;
  padding: 10px 18px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-maintenance-card .title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.detail-maintenance-card .title-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-maintenance-card .title-text {
  font-size: 16px;
  color: #333;
}

.detail-maintenance-card .maint-code {
  color: #7d2fdc;
  font-weight: 700;
}

.detail-maintenance-card .maint-date {
  font-size: 13px;
  color: #666;
  font-weight: 400;
}

/* ===== Info Cards ===== */
.detail-maintenance-card .info-principale-cards {
  margin-bottom: 4px;
  margin-top: 4px;
}

.detail-maintenance-card .info-card {
  padding: 8px 12px;
  background-color: #edededf2;
  border-radius: 20px;
  border: 1px solid #e8e8e8;
  min-height: 90px;
}

.detail-maintenance-card .card-title {
  font-size: 11px;
  margin-top: 5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #1976d2;
  padding: 0 0 4px 0;
}

.detail-maintenance-card .info-row {
  display: flex;
  border-radius: 35px;
  gap: 6px;
}

.detail-maintenance-card .readonly-field {
  cursor: not-allowed;
  background-color: #f9f9f9;
  pointer-events: none;
  user-select: none;
}

.detail-maintenance-card .readonly-field :deep(.v-field__input) {
  font-size: 12.5px;
  font-weight: 600;
  padding-top: 4px;
  padding-bottom: 4px;
}

.detail-maintenance-card .readonly-field :deep(.v-label) {
  font-size: 11px;
}

/* ===== Toolbar / Tabs permanents sans défilement ===== */
.detail-maintenance-card .tabs-toolbar {
  overflow: visible !important;
}

.detail-maintenance-card .custom-tabs {
  width: 100% !important;
  max-width: 100% !important;
}

.detail-maintenance-card .custom-tabs :deep(.v-slide-group__container) {
  overflow: visible !important;
  contain: none !important;
}

.detail-maintenance-card .custom-tabs :deep(.v-slide-group__content) {
  display: flex !important;
  width: 100% !important;
}

.detail-maintenance-card .custom-tabs :deep(.v-slide-group__prev),
.detail-maintenance-card .custom-tabs :deep(.v-slide-group__next) {
  display: none !important;
}

.detail-maintenance-card .custom-tabs .tab-item {
  flex: 1 1 0 !important;
  min-width: 0 !important;
  max-width: none !important;
  font-size: 13px !important;
  white-space: nowrap !important;
  padding: 0 12px !important;
}

/* ===== Conteneur d'onglets à taille constante ===== */
.detail-maintenance-card .tab-content-card {
  height: 410px;
  min-height: 410px;
  max-height: 410px;
  overflow: hidden;
}

.detail-maintenance-card .tab-content-body {
  height: 410px;
  min-height: 410px;
  max-height: 410px;
  overflow-y: auto;
}

/* ===== Tableau d'étapes (vrai tableau ERP propre) ===== */
.detail-maintenance-card .tab1 {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-maintenance-card .tableau-maint-wrapper .v-data-table .v-table__wrapper table th,
.detail-maintenance-card .tableau-maint-wrapper .v-data-table .v-table__wrapper table td {
  width: auto !important;
  max-width: none !important;
  min-width: 0 !important;
}

.detail-maintenance-card .custom-table1 {
  border-radius: 6px;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #e0e0e0;
}

.detail-maintenance-card .table-header {
  background-color: #0e4934fb !important;
  color: white !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  padding: 9px 12px !important;
  font-size: 12px !important;
  text-align: left !important;
  border-right: 1px solid rgba(255, 255, 255, 0.15) !important;
}

.detail-maintenance-card .v-data-table.custom-table1 .v-table__wrapper table th,
.detail-maintenance-card .v-data-table.custom-table1 .v-table__wrapper table td {
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  padding: 8px 12px;
}

.detail-maintenance-card .v-data-table.custom-table1 tbody tr:hover {
  background-color: #f7faf7 !important;
}

/* Ligne d'étape terminée / réalisée : mise en valeur douce façon hover / complétée */
.detail-maintenance-card .v-data-table.custom-table1 tbody tr.row-realisee,
.detail-maintenance-card .v-data-table.custom-table1 tbody tr.row-realisee > td {
  background-color: #f0f8f0 !important;
}

.detail-maintenance-card .v-data-table.custom-table1 tbody tr.row-realisee:hover,
.detail-maintenance-card .v-data-table.custom-table1 tbody tr.row-realisee:hover > td {
  background-color: #e2f2e2 !important;
}

.detail-maintenance-card .summary-line {
  background-color: #f4f8f3;
  border: 1px solid #d7ead5;
  border-radius: 3px;
  font-size: 12.5px;
  font-weight: 600;
  color: #2e7d32;
  padding: 6px 12px;
  text-align: left;
}

.detail-maintenance-card .cell-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.detail-maintenance-card .tb-date-btn {
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: none;
}

/* ===== Inputs intégrés directement dans les lignes du tableau REAL ===== */
.detail-maintenance-card .table-inline-input {
  min-width: 90px;
}

.detail-maintenance-card .table-inline-input :deep(.v-field__input) {
  font-size: 12px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
  min-height: 26px !important;
  height: 26px !important;
}

.detail-maintenance-card .table-inline-input :deep(.v-field) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
