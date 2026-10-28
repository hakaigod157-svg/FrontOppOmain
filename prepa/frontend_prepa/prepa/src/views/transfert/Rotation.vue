<template>
  <v-card>
    <v-app>
      <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
        <v-card density="compact">
          <TabsTrans></TabsTrans>
        </v-card>
        <v-spacer></v-spacer>
        <div>
          <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{ ip_server
              }}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;
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
              style="width: 150px; height: 35px;" @update:modelValue="handleSelectChange">
            </MySelect>
          </v-card-title>
          <v-card-title>
            <MySelect v-if="!isStock" comb_lab="Allée:" :items="listAlle" :disabled="loading" v-model="m_alle"
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
          <v-progress-linear v-if="loading" color="#6200ee" rounded indeterminate height="5" density="compact">
          </v-progress-linear>
          <MyLoading :loading="chagmt" @close="chagmt = false" :articles="articles"></MyLoading>
          <router-view></router-view>
          <TableTrans :headers="headers" :items="listRotation0" v-model="selected" return-object>
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
          <v-btn variant="tonal" color="error" @click="annuler" :disabled="loading || !disabled" density="compact"
            size="x-large" class="text-none mb-2" v-if="!isStock">
            Annuler
          </v-btn>
          <v-btn variant="tonal" color="green-darken-3" @click="transfer" :disabled="loading || !disabled"
            density="compact" class="text-none mb-2" size="x-large" v-if="!isStock">
            Transférer
          </v-btn>
        </v-card-actions>
      </v-main>
    </v-app>
  </v-card>
</template>

<script>
import { ref, computed, onMounted, watch, onBeforeMount, defineComponent } from 'vue';
import { useOnline } from '@vueuse/core';
import { useDepotStore } from "@/store/utils/depot.js";
import { useAlleeStore } from "@/store/utils/allee.js";
import MySelect from '@/components/MySelect.vue';
import TabsTrans from "@/components/transfert/TabsTrans.vue";
import TableTrans from '@/components/transfert/TableTrans.vue';
import { useRotationStore } from "@/store/Transfert/rotation.js";
import MyLoading from '@/components/Loading.vue';
import swal from 'sweetalert2';
import { useRouter } from 'vue-router'
import useSessionTimeout from '@/utils/useSessionTimeout';
import useValidationTransfert from '@/composables/useValidationTransfert';
import Config from "@/utils/config.js"
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
    const storeRotation = useRotationStore();
    const isOnline = useOnline();
    const user = localStorage.getItem('username');
    const loading = computed(() => storeRotation.loading);
    const selectedItem = ref(null);
    const selectedAlle = ref(null);
    const storeDepot = useDepotStore();
    const storeAlle = useAlleeStore();
    const articles = ref(null);
    const m_depot = ref(null);
    const m_alle = ref(null);
    const listRotation0 = ref([]);
    const listRotation1 = ref([]);
    const selected = ref([]);
    const disabled = ref(false);
    const router = useRouter();
    useSessionTimeout(Config.DURRE_SESSION, router);
    const ip_server = ref('');

    const depotCodes = computed(() => {
      return storeDepot.depots.map(depot => depot.code);
    });


    const totalArticles = computed(() => {
      return listRotation0.value.length;
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
        await run_list_rotation();
      }
    }

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
    } = useValidationTransfert(selected, listRotation1, 'ROTATION', articles, 'ROTATION EMPL', searchEvent, m_depot, m_depot);



    const headers = [
      { title: 'ARTICLE', align: 'start', key: 'article', sortable: true },
      { title: 'LIBELLE', align: 'start', key: 'libelle', sortable: true, minWidth: '300px' },
      { title: 'LOT', align: 'start', key: 'lot' },
      { title: 'DATE PER', align: 'start', key: 'datePer' },
      { title: 'DEPOT ORG', align: 'start', key: 'depot_org' },
      { title: 'EMPL ORG', align: 'center', key: 'empl_org' },
      { title: 'COLISAGE', align: 'end', key: 'colisage' },
      { title: 'DEPOT DEST', align: 'center', key: 'depot_dest' },
      { title: 'EMPL DEST', align: 'center', key: 'empl_dest' },
      { title: 'QUANTITE', align: 'center', key: 'qte' },
      // { title: 'Actions', align: 'start', key: 'actions', value: 'actions' },
    ];

    const run_list_rotation = async () => {
      selected.value = [];
      listRotation0.value = [];
      listRotation1.value = [];
      await storeRotation.fetchRotation(m_depot.value, m_alle.value);
      if (storeRotation.rotations0.length > 0 && storeRotation.rotations1.length > 0) {
        listRotation0.value = storeRotation.rotations0;
        listRotation1.value = storeRotation.rotations1;
        disabled.value = true;
      }
    }



    watch(m_depot, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        listRotation0.value = [];
        listRotation1.value = []; // Vider le tableau
      }
    });




    const listAlle = computed(() => {
      const allees = storeAlle.allees.map(item => item.alle);
      // Ajoutez l'élément souhaité à la liste
      //  allees.unshift('');
      return allees;
    });


    const handleSelectChange = async (selection) => {
      if (selection) {
        await storeAlle.fetchAllees(m_depot.value, 'isnull(xSTATUT,0)=0');
      }

    }
    const annuler = async () => {
      listRotation0.value = [];
      listRotation1.value = [];
      m_depot.value = null;
      selected.value = [];

    };
    const transfer = async () => {
      await valideTransfert();
    };



    onBeforeMount(async () => {
      await storeDepot.fetchDepots('isnull(DPCENTRAL,0)=1');
    })

    onMounted(async () => {

      const name_server = localStorage.getItem('name_server');
      if (name_server === 'SIMUL221') {
        ip_server.value = '192.168.130.221';
      } else if (name_server === 'SIMUL220') {
        ip_server.value = '192.168.130.220';
      }
      else if (name_server === 'OPHAM') {
        ip_server.value = '192.168.130.2';
      } else {
        ip_server.value = name_server || 'Inconnu';
      }
    })


    return {
      headers, selectedItem, selectedAlle, searchEvent, loading, totalArticles,
      isOnline, user,
      storeDepot, depotCodes, m_depot, m_alle, listAlle, listRotation0, run_list_rotation,
      selected, isSelect, transfer, handleSelectChange, listAtransferer, store, listRotation1,
      annuler, articles, chagmt, listStockError, isStock, isPasVide, empl, isPasEmp, m_article, disabled,
      ip_server,

    };
  },
});
</script>
<style>
.custom-td {
  width: 800px;
  /* Vous pouvez ajuster la valeur en fonction de vos besoins */
}
</style>