<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Accueil</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-divider vertical></v-divider>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div>
        <u>Login</u> :&nbsp;<b><span style="color: #388E3C;">{{ user }}</span></b>
      </div>
      <v-btn @click="logout">
        <v-img :width="30" :src="require('@/assets/logout.png')">
        </v-img>
      </v-btn>
      <!-- <v-tab @click="logout" class="text-red-lighten-1">Déconnecter</v-tab> -->
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <!-- class="bg-deep-purple-lighten-5" -->

      <v-list color="transparent" density="compact">
        <v-list-subheader><b>CATEGORIE</b></v-list-subheader>
        <v-list-item v-for="menu in filteredMenus" :key="menu.title" color="primary" variant="plain">
          <v-list-item-title
            class="lighten-1 v-list-item v-list-item--link v-list-item--nav v-theme--dark v-list-item--density-compact v-list-item--rounded v-list-item--variant-text"
            :style="{ fontSize: '14px' }" @click="menuClick(menu)" color="primary">{{
              menu.title }} </v-list-item-title>
          <v-divider class="border-opacity-100" color="warning"></v-divider>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      <v-container>
        <v-row>
          <v-col>
            <strong><u>Catégorie</u></strong>
          </v-col>
        </v-row>

        <v-row justify="start">
          <v-col cols="6" md="2" v-for="(menu, i) in filteredMenus" :key="i">
            <v-hover v-slot="{ isHovering, props }">
              <!-- <v-card class="mx-auto" max-width="159" @click="menuClick(menu)" v-if="menu.visible" v-bind="props"
                :color="isHovering ? 'deep-purple-lighten-1' : undefined">
                <v-img max-height="100" class="mx-4" :src="menu.img"></v-img>
                <v-card-item class="mt-n3">
                  <v-card-title class="text-center lighten-1" style="font-size: 13px; ">{{ menu.title }}</v-card-title>
                </v-card-item>
              </v-card> -->

              <!-- <v-card class="mx-auto" max-width="159" @click="menuClick(menu)" v-if="menu.visible" :style="{
                border: menu.showBorder ? '5px solid #4caf50' : 'none',
                boxShadow: menu.showBorder ? '0px 6px 50px rgba(0, 0, 0, 0.9)' : 'none'
              }" v-bind="props" :color="isHovering ? 'deep-purple-lighten-1' : undefined">
                <v-img max-height="100" class="mx-4" :src="menu.img"></v-img>
                <v-card-item class="mt-n3">
                  <v-card-title class="text-center lighten-1" style="font-size: 13px;">
                    {{ menu.title }}
                  </v-card-title>
                </v-card-item>
              </v-card> -->

              <v-card class="mx-auto" max-width="159"  @click="menuClick(menu)" v-if="menu.visible" :style="{
                border: menu.showBorder ? (menu.action === 'capaio' || menu.action === 'inventaire' || menu.action === 'rh' || menu.action === 'bi' ? '4px solid #FF5252' : '4px solid #4caf50') : 'none',
                boxShadow: menu.showBorder ? '0px 6px 50px rgba(0, 0, 0, 0.9)' : 'none'
              }" v-bind="props" :color="isHovering ? 'deep-purple-lighten-1' : undefined">
                <v-img max-height="100" class="mx-4" :src="menu.img"></v-img>
                <v-card-item class="mt-n3">
                  <v-card-title class="text-center lighten-1" style="font-size: 13px;">
                    {{ menu.title }}
                  </v-card-title>
                </v-card-item>
              </v-card>

            </v-hover>
          </v-col>
        </v-row>

      </v-container>

    </v-main>
    <v-card>
      <v-row>
        <v-col class="text-right">
          <v-sheet class="custom-bg">
            Version {{ version }}
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
  </v-app>
</template>

<script>
import { ref, defineComponent, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import swal from 'sweetalert2';
import { useAuthStore } from '@/store/utils/login';
import { fetchdroits } from "@/composables/useDroit";
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";
import Version from "@/utils/version.js";

export default defineComponent({
  name: 'accueilpage',

  methods: {
    // fiche() {
    //   router.push('/fiches')
    // }
  },

  setup() {
    const drawer = ref(null);
    const router = useRouter();
    const useLogoutStore = useAuthStore();
    const showMagsin = ref(false);
    const showPreparation = ref(false);
    const showArticle = ref(false);
    const showADV = ref(false);
    const showExpedition = ref(false);
    const showPriseCmd = ref(false);
    const showSuiviCmd = ref(false);
    const showAdmin = ref(false);
    const showSuiviFact = ref(false);
    const showCapa = ref(false);
    const showCatalogue = ref(false);
    const showInventaire = ref(false);
    const showLien = ref(false);
    const showAffaire = ref(false);
    const showRh = ref(false);
    const showBI = ref(false);

    const user = localStorage.getItem('username');

    const version = ref(Version.APP_VERSION);

    useSessionTimeout(Config.DURRE_SESSION, router);

    const admin = () => {
      const tabDefautAdmin = getAdminDroit();
      router.push('/' + tabDefautAdmin);
    }

    const fiche = () => {
      //router.push('/fiches')
      window.location = 'http://192.168.130.6/fiches';
    }

    const transfert = () => {
      const tabDefautTransfert = getTransfertDroit();
      router.push('/' + tabDefautTransfert);
    };

    const prepa = () => {
      const tabDefautPrepa = getPrepaDroit();
      router.push('/' + tabDefautPrepa);
    };

    const adv = () => {
      router.push('/CmdAvalider');
    };

    const facture = () => {
      // console.log('clicked')
      router.push('/facture');
    };

    const suivi = () => {
      // console.log('clicked suivi')
      router.push('/EtatCommande');
    };

    const facturio = () => {
      //  console.log('clicked facturio')
      router.push('/appelentrant');
    };

    const capaio = () => {
      //  console.log('clicked capa')
      router.push('/capa_view');
    };
    const validCatal = () => {
      //  console.log('clicked capa')
      router.push('/catalogue_view');
    };
    const inventaire = () => {
      router.push('/inventaire_view');
    };
    const expedition = () => {
      const tabExped = getExpeditionDroit()
      router.push('/' + tabExped);
    };

    const lien = () => {
      router.push('/lien_view');
    };

    const affaire = () => {
      router.push('/affaire_view');
    };

    const rh = () => {
      router.push('/rh');
    };

    const bi = () => {
      router.push('/bi');
    };
    const maintenance = () => {
      router.push('/maintenance');
    };


    

    const menuClick = (menu) => {

      document.title = menu.title;

      if (menu.action === 'transfert') {
        transfert();
        
  
      } else if (menu.action === 'prepa') {
        prepa();
      } else if (menu.action === 'fiche') {
        fiche();
      } else if (menu.action === 'admin') {
        admin();
      }
      else if (menu.action === 'adv') {
        adv();
      }
      else if (menu.action === 'facture') {
        facture();
      }
      else if (menu.action === 'suivi') {
        suivi();
      }
      else if (menu.action === 'facturio') {
        facturio();
      }
      else if (menu.action === 'capaio') {
        capaio();
      }
      else if (menu.action === 'validCatal') {
        validCatal();
      }
      
      else if (menu.action === 'inventaire') {
        inventaire();
      }
      else if (menu.action === 'expedition') {
        expedition();
      }
      else if (menu.action === 'lien') {
        lien();
      }
      else if (menu.action === 'affaire') {
        affaire();
      }
      else if (menu.action === 'rh') {
        rh();
      }
      else if (menu.action === 'bi') {
        bi();
      } else if (menu.action === 'maintenance') { // NOUVEAU
    maintenance();
      }
  
    };

    const getPrepaDroit = () => {
      const lstDroit = localStorage.getItem('listeDroits');
      if (lstDroit) {
        const listePages = ['PageAttePrepa', 'PageEnCoursPrepa', 'PageAtteCtrl', 'PageEnCoursCtrl', 'PageEmballage', 'PageEnCoursPrepBP', 'PageAtteCtrlBP', 'PageEnCoursCtrlBP', 'PagePrepPartiel'];
        const droits = JSON.parse(lstDroit);
        const element = listePages.find(page => droits.some(item => item.descAcces.trim() === page));
        if (element) {
          return element;
        } else {
          return 'tabPrepa';
        }
      }
    };



    const getTransfertDroit = () => {
      const lstDroit = localStorage.getItem('listeDroits');
      if (lstDroit) {
        const listePages = ['Rotation', 'ColisIncomplet', 'PetitColis', 'Rangement', 'ConseilReappro', 'SuiviTD'];
        const droits = JSON.parse(lstDroit);
        const element = listePages.find(page => droits.some(item => item.descAcces.trim() === page));
        if (element) {
          return element;
        } else {
          return 'tabPrepa';
        }
      }
    };



    const getExpeditionDroit = () => {
      const lstDroit = localStorage.getItem('listeDroits');
      if (lstDroit) {
        const listePages = ['expedition_view', 'livraison', 'edition', 'params_lv','params_axe'];
        const droits = JSON.parse(lstDroit);
        const element = listePages.find(page => droits.some(item => item.descAcces.trim() === page));
        if (element) {
          return element;
        } else {
          return 'edition';
        }
      }
    };

    const getAdminDroit = () => {
      const lstDroit = localStorage.getItem('listeDroits');
      if (lstDroit) {
        const listePages = ['GestionAcces'];
        const droits = JSON.parse(lstDroit);
        const element = listePages.find(page => droits.some(item => item.descAcces.trim() === page));
        if (element) {
          return element;
        } else {
          return 'tabPrepa';
        }
      }
    };

    onMounted(async () => {

      document.title = 'ACCUEIL';

      showMagsin.value = await fetchdroits('MAGASIN');
      showPreparation.value = await fetchdroits('PREPARATION');
      showArticle.value = await fetchdroits('FICHE ARTICLE');
      showADV.value = await fetchdroits('ADV');
      showExpedition.value = await fetchdroits('EXPEDITION');
      showPriseCmd.value = await fetchdroits('PRISE DE COMMANDE')
      showSuiviCmd.value = await fetchdroits('SUIVI DE COMMANDE')
      showAdmin.value = await fetchdroits('Administration')
      showSuiviFact.value = await fetchdroits('FACTURIO')
      showCapa.value = await fetchdroits('CAPA')
      showCatalogue.value = await fetchdroits('CATALOGUE');
      showInventaire.value = await fetchdroits('INVENTAIRE');
      showLien.value = await fetchdroits('LIEN');
      showAffaire.value = await fetchdroits('AFFAIRE');
      showRh.value = await fetchdroits('RH');
      showBI.value = await fetchdroits('BI');
    })


    const logout = () => {
      swal
        .fire({
          title: 'Voulez-vous vraiment Déconnecter ?',
          showDenyButton: true,
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: 'Oui',
          denyButtonText: `Non`,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await useLogoutStore.logout();
            localStorage.clear();
            router.push({ name: 'login' });
          } else if (result.isDenied) {
            // swal.fire('Transfert annuler', '', 'info');
          }
        });
    };

    const menus = ref([
      {
        img: require('@/assets/admin.png'),
        title: "Administration",
        visible: showAdmin,
        action: "admin",
        showBorder: true,
      },
      {
        img: require('@/assets/transfert.png'),
        title: "Magasin",
        visible: showMagsin,
        action: "transfert",
        showBorder: true,
      },
      {
        img: require('@/assets/prepa.png'),
        title: "Préparation",
        visible: showPreparation,
        action: "prepa",
        showBorder: true,
      },
      {
        img: require('@/assets/fiche.png'),
        title: "Fiche Article",
        visible: showArticle,
        action: "fiche",
        showBorder: true,
      },
      {
        img: require('@/assets/adv.png'),
        title: "Validation commande",
        visible: showADV,
        action: "adv",
        showBorder: true,
      },
      {
        img: require('@/assets/exped.png'),
        title: "Expédition",
        visible: showExpedition,
        action: "expedition",
        showBorder: true,
      },
      {
        img: require('@/assets/priseCom.png'),
        title: "Prise de Commande",
        visible: showPriseCmd,
        action: "commande",
      },
      {
        img: require('@/assets/suivicom.png'),
        title: "Suivi de Commande",
        visible: showSuiviCmd,
        action: "suivi",
        showBorder: true,
      },
      {
        img: require('@/assets/facture.png'),
        title: "Facture",
        visible: showSuiviCmd,
        action: "facture",
      },
      {
        img: require('@/assets/facturio.png'),
        title: "Call center",
        visible: showSuiviFact,
        action: "facturio",
        showBorder: true,
      },
      {
        img: require('@/assets/841606.svg'),
        title: "CAPA",
        visible: showCapa,
        action: "capaio",
        showBorder: true,
      },

      {
        img: require('@/assets/res_fact.png'),
        title: "Résérvation Facture",
        visible: showCapa,
        action: "resfact",
      },

      {
        img: require('@/assets/validation.png'),
        title: "PAO",
        visible: showCatalogue,
        action: "validCatal",
        showBorder: true,
      },

      {
        img: require('@/assets/inventaire.png'),
        title: "Inventaire",
        visible: showInventaire,
        action: "inventaire",
        showBorder: true,
      },

      {
        img: require('@/assets/lien.png'),
        title: "Lien",
        visible: showLien,
        action: "lien",
        showBorder: true,
      },
      {
        img: require('@/assets/amm.png'),
        title: "Affaire Réglementaire",
        visible: showAffaire,
        action: "affaire",
        showBorder: true,
      },
      {
        img: require('@/assets/recrut.png'),
        title: "RH",
        visible: showLien,
        action: "rh",
        showBorder: true,
      },
      {
        img: require('@/assets/BI.png'),
        title: "Business Intelligence",
        visible: showLien,
        action: "bi",
        showBorder: true,
      },
      {
        img: require('@/assets/avatar-01.png'), 
        title: "OMAIN",
        visible: true, 
        action: "maintenance", 
        showBorder: true,
    },

    ])

    const filteredMenus = computed(() => menus.value.filter(menu => menu.visible));

    return {
      drawer, showArticle, showADV, showExpedition, showPriseCmd, showCapa, showSuiviCmd, user, showAdmin, showCatalogue, showInventaire, showLien, showAffaire,
      transfert,
      prepa,
      adv,
      suivi,
      facturio,
      capaio,
      validCatal,
      inventaire, expedition, lien, affaire,
      logout,
      admin,
      showMagsin,
      showPreparation,
      version, fiche, menus, menuClick, filteredMenus,
      facture

    }
  }
});
</script>
<style>
.custom-bg {
  background-color: #ffffff;
  color: grey;
}

.text-right {
  text-align: right;
}

.small-title {
  font-size: 12px;
  /* Ajustez la taille selon vos besoins */
}

.menu-card {
   
  transition: border 0.3s ease-in-out;
}

.menu-card-border {
 
  border: 2px solid #4caf50;
  /* Bordure verte */
  border-radius: 8px;
  /* Arrondir les coins */
}
</style>