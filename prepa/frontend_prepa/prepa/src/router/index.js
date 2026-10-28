import { createRouter,createWebHashHistory,createWebHistory } from "vue-router"
import preparation from "./preparation"
import adv from "./adv"
import transfert from "./transfert"
import home from "./home"
import admin from "./admin"
import facture from "./facture"
import etatcommande from "./etatcommande"
import facturio from "./facturio"
import appelentrant from "./appelentrant"
import appelsortant from "./appelsortant"
import useCheckSessionID from '@/composables/useCheckSessionID';
import capa from "./capa";
import suivianomalie from "./suivianomalie";
import catalogue from "./catalogue";
import inventaire from "./inventaire";
import expedition from "./expedition";
import lien from "./lien";
import affaire from "./affaire";
import rh from "./rh";
import bi from "./bi";
import mecano from "./mecano"

const { checkSessionID } = useCheckSessionID();

const routes = [
  ...home,
  ...preparation,
  ...adv,
  ...transfert,
  ...admin,
  ...facture,
  ...etatcommande,
  ...facturio,
  ...appelentrant,
  ...appelsortant,
  ...capa,
  ...suivianomalie,
  ...catalogue,
  ...inventaire,
  ...expedition,
  ...lien,
  ...affaire,
  ...rh,
  ...bi,
  ...mecano,

]

const router = createRouter({
 history: createWebHashHistory(),
  //history: createWebHistory('/erpo/'),
  routes,
});
router.beforeEach((to, from, next) => {
  checkSessionID(to, from, next);
});
export default router
