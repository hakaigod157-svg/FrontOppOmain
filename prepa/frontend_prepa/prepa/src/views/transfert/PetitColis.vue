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
          <v-card-title>
            <MySelect v-if="!isStock" comb_lab="Allée:" :items="listAlle" :disabled="loading" v-model="m_alle"
              style="width: 150px; height: 35px;">
            </MySelect>
          </v-card-title>
          <v-alert v-if="isSelect" type="error" @click="isSelect = false, dialog = false" colored-border elevation="1"
            density="compact">La liste des
            articles à transférer est vide
          </v-alert>
          <v-alert v-if="isPasEmp" type="error" @click="isPasEmp = false, dialog = false" colored-border elevation="1"
            density="compact">Pas d'emplacement du destinataire pour l'article : {{ m_article }}
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
          <v-row>
            <v-col>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>GROS</b>&nbsp;&nbsp;&nbsp;&nbsp;
              <span style="color:rgb(98,0,238)">vers</span> &nbsp;&nbsp;&nbsp;&nbsp; <b>DET</b><br>
              <v-card color="#D7CCC8" width="460"></v-card>
            </v-col>
          </v-row>
          <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loading" density="compact"
            v-if="!isStock">Rechercher
          </v-btn>
        </v-card-actions>
        <div class="pa-2">
          <v-progress-linear v-if="loading" color="#6200ee"  rounded indeterminate height="5" density="compact">
          </v-progress-linear>
          <MyLoading :loading="chagmt" @close="chagmt = false" :articles="articles"></MyLoading>
          <router-view></router-view>
          <TableTrans :headers="headers" :items="listPetit0" v-model="selected" return-object height="600">
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
          <v-btn variant="tonal" color="error" @click="annuler" :disabled="loading||!disabled" density="compact" size="x-large"
            class="text-none mb-2" v-if="!isStock">
            Annuler
          </v-btn>
          <v-btn variant="tonal" color="green-darken-3" @click="transfer" :disabled="loading||!disabled" density="compact"
            class="text-none mb-2" size="x-large" v-if="!isStock">
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
import { usePetitStore } from "@/store/Transfert/petit.js";
import MySelect from '@/components/MySelect.vue';
import { useAlleeStore } from "@/store/utils/allee.js";
import { useRouter } from 'vue-router'
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js"
import MyLoading from '@/components/Loading.vue';
import swal from 'sweetalert2';
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
      // Gérez la réponse du backend
    },
  },

  setup() {
    const storePetit = usePetitStore();
    const listPetit0 = ref([]);
    const listPetit1 = ref([]);
    const m_alle = ref(null);
    const storeAlle = useAlleeStore();
    const loading = computed(() => storePetit.loading);
    const router = useRouter();
    const isOnline = useOnline();
    const user = localStorage.getItem('username');
    const articles = ref(null);
    const selected = ref([]);
    const depOrg = ref('');
    const depDest = ref('');
    const disabled = ref(false);

    useSessionTimeout(Config.DURRE_SESSION, router);

    const run_list_petit = async () => {
      listPetit0.value = [];
      listPetit1.value = [];
      selected.value = [];
      if (!m_alle.value) {
        m_alle.value = ""
      }
      depDest.value = 'DET'
      depOrg.value = 'GROS'
      await storePetit.fetchPetit(depOrg.value, depDest.value, m_alle.value);
      if (storePetit.petits0.length > 0 && storePetit.petits1.length > 0) {
        listPetit0.value = storePetit.petits0;
        listPetit1.value = storePetit.petits1;
        disabled.value = true;
      }
    }


    const listAlle = computed(() => {
      return storeAlle.allees.map(item => item.alle);
    });

    const totalArticles = computed(() => {
      return listPetit0.value.length;
    });

    onMounted(async () => {
      await storeAlle.fetchAllees('GROS', null);
    })

    const searchEvent = async () => {
     await run_list_petit();
    }

    const transfer = async () => {
      await valideTransfert();
    };

    const annuler = async () => {
      listPetit0.value = [];
      listPetit1.value = [];
      m_alle.value = null;
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
      empl, isPasEmp, m_article
    } = useValidationTransfert(selected, listPetit1, 'PETIT COLIS', articles, 'PETIT COLIS', searchEvent, depOrg, depDest);

    const headers = [
      { title: 'ARTICLE', align: 'start', key: 'article', width: 20 },
      { title: 'LIBELLE', align: 'start', key: 'libelle', minWidth: '300px' },
      { title: 'LOT', align: 'center', key: 'lot', width: 10 },
      { title: 'DATE PER', align: 'start', key: 'datePer', width: 10 },
      { title: 'DEPOT ORG', align: 'start', key: 'depot_org', width: 10 },
      { title: 'EMPL ORG', align: 'center', key: 'empl_org', width: 10 },
      { title: 'COLISAGE', align: 'end', key: 'colisage', width: 10},
      { title: 'PALETTE', align: 'end', key: 'palette', width: 10 },
      { title: 'NB_COLIS', align: 'center', key: 'nbColis', width: 10 },
      { title: '%', align: 'end', key: 'perc', width: 10 },
      { title: 'LOT_VTE', align: 'center', key: 'lot_vte', width: 10 },
      { title: 'NB_J_VTE', align: 'end', key: 'nb_j_vte', width:10 },
      { title: 'DEPOT DEST', align: 'end', key: 'depot_dest', width: 10 },
      { title: 'EMPL DEST', align: 'center', key: 'empl_dest', width: 10 },
      { title: 'QTE A TRT', align: 'center', key: 'qte', width: 10 },
 
    ]
    return {
      headers,
      isOnline, user,
      storePetit, listAlle, searchEvent, loading, listPetit0, run_list_petit, totalArticles, m_alle,
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