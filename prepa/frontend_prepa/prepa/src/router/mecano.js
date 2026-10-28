import Maintenance from "@/views/mecano/maintenance.vue";
import listDemande from "@/views/mecano/listDemande.vue";
import listeMaintenance from "@/views/mecano/listeMaintenance.vue";

import useCheckSessionID from "@/composables/useCheckSessionID";
import EditDemande from "@/views/mecano/editDemande.vue";
import Calendrier from "@/views/mecano/calendrier.vue";
import NouvelleDMD from "@/views/mecano/nouvelleDMD.vue";

const { checkSessionID } = useCheckSessionID();

export default [
  {
    path: "/maintenance",
    name: "maintenance",
    component: Maintenance,
    beforeEnter: checkSessionID,

    children: [
      {
        path: "demandeList",
        name: "maintenance-demande",
        component: listDemande,
      },

      {
        path: "listMain",
        name: "maintenance-liste",
        component: listeMaintenance,
      },
      
      {
        path: "editDMD/:code",
        name: "formUpdt-demande",
        component: EditDemande,
      },
      {
        path: "calendar",
        name: "maintenance-calendar",
        component: Calendrier,
      },

      {
        path: "",
                redirect: {
                    name: "maintenance-demande",
                },
              }
    ],
  },
];