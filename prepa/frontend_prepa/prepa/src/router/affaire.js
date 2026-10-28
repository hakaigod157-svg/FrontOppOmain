import Affaire_view from "@/views/amm/affaire.vue";
import Fabricant_view from "@/views/amm/fabricant.vue";
import useCheckSessionID from "@/composables/useCheckSessionID";
import Renouveler_view from "@/views/amm/renouveler.vue";
import gestion from "@/views/amm/PageGestionDossier.vue";
import midac from "@/views/amm/listeMidac.vue";
import abbrogation from "@/views/amm/listeAbbrogation.vue";

const { checkSessionID } = useCheckSessionID();

export default [
  {
    path: "/affaire_view",
    component: Affaire_view,
    name: "Affaire_view",
    beforeEnter: checkSessionID,
  },
  {
    path: "/renouveller",
    component: Renouveler_view,
    name: "Renouveler_view",
    beforeEnter: checkSessionID,
  },
  {
    path: "/fabricant",
    component: Fabricant_view,
    name: "Fabricant_view",
    beforeEnter: checkSessionID,
  },
  {
    path: "/gestion",
    component: gestion,
    name: "gestion",
    beforeEnter: checkSessionID,
  },
    {
    path: "/midac",
    component: midac,
    name: "midac_view",
    beforeEnter: checkSessionID,
  },

    {
    path: "/abbrogation",
    component: abbrogation,
    name: "abbrogation_view",
    beforeEnter: checkSessionID,
  },
];
