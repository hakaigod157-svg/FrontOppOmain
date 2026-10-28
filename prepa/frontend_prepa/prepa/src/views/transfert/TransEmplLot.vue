<template>
    <v-card>
      <v-app>
        <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
          <v-card density="compact">
            <TabsTrans></TabsTrans>
          </v-card>
          <v-spacer></v-spacer>
          <div>
            <u>Login</u> :&nbsp;<b><span style="color: #388E3C;">{{ user }}</span></b>
          </div>&nbsp;&nbsp;
          <div>
            <span
              :style="{ backgroundColor: isOnline ? 'green' : 'red', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }"></span>
          </div>
  
          <div>
            <v-btn @click="onHome">
              <v-img :width="20" :src="require('@/assets/home.png')"></v-img>
            </v-btn>
          </div>
  
        </v-app-bar>
  
        <v-main style="--v-layout-top: 40px" app>
          <v-card-actions density="compact">
            <v-card-title density="compact">
              <MySelect v-if="!isStock" comb_lab="Dépot" :items="depotCodes" v-model="m_depot" :disabled="loading"
                style="width: 150px; height: 35px;">
              </MySelect>
            </v-card-title>
            <v-alert v-if="isPasEmp" type="error" @click="isPasEmp = false, dialog = false" colored-border elevation="1"
              density="compact">Pas d'emplacement du destinataire pour l'article : {{ m_article }}
            </v-alert>
            <v-alert v-if="isSelect" type="error" @click="isSelect = false, dialog = false" colored-border elevation="1"
              density="compact">La liste des
              articles à transférer est vide
            </v-alert>
            <v-alert v-if="isPasVide" type="error" @click="isPasVide = false, dialog = false" colored-border elevation="1"
              density="compact">il y a des
              stocks dans l'emplacement destinataire :<b> {{ empl }}</b>
            </v-alert>
            <v-alert v-if="isStock" title="Stock Négatif" type="error" @click="isStock = false, dialog = false"
              colored-border elevation="1" density="compact">
              <v-table fixed-header height="200px" density="compact">
                <thead>
                  <tr>
                    <th class="text-center" style="background-color: #b8b3cc; color: black;">
                      ARTICLE
                    </th>
                    <th class="text-center" style="background-color: #b8b3cc; color: black; width:800px">
                      LIBELLE
                    </th>
                    <th class="text-center" style="background-color: #b8b3cc; color: black;">
                      DEPOT
                    </th>
                    <th class="text-center" style="background-color: #b8b3cc; color: black;">
                      LOT
                    </th>
                    <th class="text-center" style="background-color: #b8b3cc; color: black;">
                      LETTRE
                    </th>
                    <th class="text-center" style="background-color: #b8b3cc; color: black;">
                      EMPL
                    </th>
                    <th class="text-center" style="background-color: #b8b3cc; color: black;">
                      QTE
                    </th>
                    <th class="text-center" style="background-color: #b8b3cc; color: black;">
                      TRANSFERT
                    </th>
                    <th class="text-center" style="background-color: #b8b3cc; color: black;">
                      REST
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in listStockError" :key="item.article">
                    <td>{{ item.article }}</td>
                    <td class="custom-td">{{ item.libelle }}</td>
                    <td>{{ item.depot }}</td>
                    <td>{{ item.lot }}</td>
                    <td>{{ item.lettre }}</td>
                    <td>{{ item.empl }}</td>
                    <td>{{ item.qteStock }}</td>
                    <td>{{ item.qteTransfert }}</td>
                    <td>{{ item.rest }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-alert>
            <v-spacer />
            <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading" density="compact"
              v-if="!isStock">Rechercher
            </v-btn>
          </v-card-actions>
          <div class="pa-2">
            <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5" density="compact">
            </v-progress-linear>
            <MyLoading :loading="chagmt" @close="chagmt = false" :articles="articles"></MyLoading>
            <router-view></router-view>
            <TableTrans :headers="headers" :items="listRangement0" v-model="selected" return-object>
            </TableTrans>
            <v-card>
              <v-row>
                <v-col>
                  <v-sheet class="pl-2">
                    <b> {{ totalArticles }}</b> Lignes Trouvées
                  </v-sheet>
                </v-col>
  
                <v-col>
                  <v-sheet>
                    <b> {{ selected.length }}</b> Lignes séléctionnée
                  </v-sheet>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <v-card-actions class="d-flex justify-end">
            <v-btn variant="tonal" color="error" @click="annuler" :disabled="loading||!disabled" density="compact" size="x-large" class="text-none mb-2"
              v-if="!isStock">
              Annuler
            </v-btn>
            <v-btn variant="tonal" color="green-darken-3" @click="transfer" :disabled="loading||!disabled" density="compact" class="text-none mb-2"
              size="x-large" v-if="!isStock">
              Transférer
            </v-btn>
          </v-card-actions>
        </v-main>
      </v-app>
    </v-card>
  </template>
  
  <script>
  import { defineComponent, ref, computed, onMounted } from "vue";
  import { useOnline } from '@vueuse/core';
  import TabsTrans from "@/components/transfert/TabsTrans.vue";
  import TableTrans from '@/components/transfert/TableTrans.vue';
  import { useRangementStore } from "@/store/Transfert/rangement.js";
  import MySelect from '@/components/MySelect.vue';
  import { useDepotStore } from "@/store/utils/depot.js";
  import swal from 'sweetalert2';
  import { useRouter } from 'vue-router'
  import useSessionTimeout from '@/utils/useSessionTimeout';
  import Config from "@/utils/config.js"
  import MyLoading from '@/components/Loading.vue';
  import useValidationTransfert from '@/composables/useValidationTransfert';
  export default defineComponent({
    components: {
      TabsTrans,
      TableTrans,
      MySelect,
      MyLoading
  
    },
  
    methods: {
      onHome() {
        this.$router.push("/AccueilPage");
      },
    },
  
    setup() {
      const storeRangement = useRangementStore();
      const listRangement0 = ref([]);
      const listRangement1 = ref([]);
      const m_depot = ref(null);
      const storeDepot = useDepotStore();
      const loading = computed(() => storeRangement.loading);
      const router = useRouter();
      useSessionTimeout(Config.DURRE_SESSION, router);
      const isOnline = useOnline();
      const user = localStorage.getItem('username');
      const articles = ref(null);
      const selected = ref([]);
      const disabled = ref(false);
  
      const run_list_rangement = async () => {
        selected.value = [];
        await storeRangement.fetchRangement(m_depot.value);
        if (storeRangement.rangements0.length > 0 && storeRangement.rangements1.length > 0) {
          listRangement0.value = storeRangement.rangements0;
          listRangement1.value = storeRangement.rangements1;
          disabled.value = true;
        }
      }
  
      const depotCodes = computed(() => {
        return storeDepot.depots.map(depot => depot.code);
      });
  
      const totalArticles = computed(() => {
        return listRangement0.value.length;
      });
  
  
      const searchEvent = async () => {
        if (m_depot.value == null) {
          const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener('mouseenter', swal.stopTimer)
              toast.addEventListener('mouseleave', swal.resumeTimer)
            }
          });
  
          Toast.fire({
            icon: 'warning',
            title: 'Veuillez choisir un Dépôt'
          });
        } else {
          run_list_rangement();
        }
      }
  
      onMounted(async () => {
        await storeDepot.fetchDepots('isnull(DPCENTRAL,0)=1');
      })
  
  
  
  
      const transfer = async () => {
        await valideTransfert();
      };
  
      const annuler = async () => {
        listRangement0.value = [];
        listRangement1.value = [];
        m_depot.value = null;
        selected.value = [];
  
      };
  
      const {
        isSelect,
        valideTransfert,
        listAtransferer,
        store,
        chagmt,
        listStockError,
        isStock,
        isPasVide,
        empl,
        isPasEmp, m_article
      } = useValidationTransfert(selected, listRangement1, 'RANGEMENT', articles, 'RANGEMENT', searchEvent, m_depot, m_depot);
  
      const headers = [
        { title: 'ARTICLE', align: 'start', key: 'article', sortable: true, width: '9%'},
        { title: 'LIBELLE', align: 'start', key: 'libelle', sortable: true, minWidth: '300px'},
        { title: 'LOT', align: 'center', key: 'lot', width: '8%'  },
        { title: 'DATE PER', align: 'center', key: 'datePer', width: '8%'  },
        { title: 'DEPOT ORG', align: 'center', key: 'depot_org', width: '5%'  },
        { title: 'EMPL ORG', align: 'center', key: 'empl_org', width: '5%'  },
        { title: 'COLISAGE', align: 'end', key: 'colisage', width: '3%'  },
        { title: 'DEPOT DEST', align: 'center', key: 'depot_dest', width: '5%'  },
        { title: 'EMPL DEST', align: 'center', key: 'empl_dest', width: '5%'  },
        { title: 'QUANTITE', align: 'center', key: 'qte', width: '2%'  },
        // { title: 'Actions', align: 'start', key: 'actions', value: 'actions' },
      ]
      return {
        headers,
        isOnline, user,
        storeRangement, storeDepot, searchEvent, loading, listRangement0, run_list_rangement, totalArticles, depotCodes, m_depot,
        transfer, listAtransferer,
        store,
        chagmt,
        listStockError, isPasVide,
        empl,
        isStock, isSelect, selected, annuler, articles, isPasEmp, m_article,disabled
      };
    },
  });
  </script>