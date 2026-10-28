import Bi_view from "@/views/businessIntelligence/bi_view.vue";
import useCheckSessionID from "@/composables/useCheckSessionID";
const { checkSessionID } = useCheckSessionID();

export default [
  {
    path: "/bi",
    component: Bi_view,
    name: "Bi_view",
    beforeEnter: checkSessionID,
  },
];
