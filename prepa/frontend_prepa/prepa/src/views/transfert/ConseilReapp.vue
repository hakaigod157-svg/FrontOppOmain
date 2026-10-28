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
      <v-main style="--v-layout-top: 45px" app>
        <v-card-actions density="compact">
          <v-card-title density="compact">
            <Autocomplete :isUpdating="isUpdating" :items="items" v-model:search="search" v-model="select"
              :loading="loading" @updateSelect="handleSelectChange" />
          </v-card-title>
          <v-card-title density="compact">
            <small class="text-subtitle-2">{{ libelle }}</small>
          </v-card-title>
          <searchArticle v-if="isSearch" :dialog="isSearch" @close="closeDialog" @getArticle="getArticleSearch"></searchArticle>
          <v-alert v-if="isSelect" type="error" @click="isSelect = false, dialog = false" colored-border elevation="1"
            density="compact">La liste des articles à transférer est vide
          </v-alert>
          <v-alert v-if="isVide" type="error" @click="isVide = false, dialog = false" colored-border elevation="1"
            density="compact">Pas d'article sélectionné
          </v-alert>
          <v-alert v-if="isPasEmpVide" type="error" @click="isPasEmpVide = false, dialog = false" colored-border
            elevation="1" density="compact">l'article {{ m_articles }} n'a pas d'emplacement par défaut au Depot DET
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
          <v-spacer />
          <v-btn variant="tonal" color="primary" @click="searchEvent" :disabled="loadings " density="compact">Conseil
            Réappro
          </v-btn>
        </v-card-actions>
        <div class="pa-2">
          <v-progress-linear v-if="loadings" color="#6200ee"  rounded indeterminate height="5" density="compact">
          </v-progress-linear>
          <MyLoading :loading="chagmt" @close="chagmt = false" :articles="articles"></MyLoading>
          <router-view></router-view>
       
          <TableTrans :headers="headers" :items="listConsRea0" height="300" v-model="selected" return-object
            item-selectable="selectable">
          </TableTrans>
          <v-card class="elevation-1">
            <v-card-actions density="compact" class="pa-1">
              <v-card-text density="compact" class="pa-1">
                <b> {{ totalArticles }}</b> Lignes Trouvées
              </v-card-text>
              <v-card-text density="compact" class="pa-1">
                <b> {{ selected.length }}</b> Lignes séléctionnée
              </v-card-text>
              <v-spacer />
              <v-btn prepend-icon="mdi-transfer-down" variant="tonal" :disabled="loadings ||!disbledTranst" color="primary"
                density="compact" @click="charger">Transfert partie séléctionnée </v-btn>
            </v-card-actions>
          </v-card>
          <MyTable :headers="headers_Second" :items="listSelection" height="300" action2="Enlever" @action2Item="enlever">
          </MyTable>
        </div>

        <v-card-actions class="d-flex justify-end">
          <v-btn variant="tonal" color="error" @click="annuler" :disabled="loadings ||!disabled" density="compact" size="x-large"
            class="text-none mb-2" v-if="!isStock">
            Annuler
          </v-btn>
          <v-btn variant="tonal" color="green-darken-3" @click="transfer" :disabled="loadings ||!disabled" density="compact"
            class="text-none mb-2" size="x-large" v-if="!isStock">
            Transférer
          </v-btn>
        </v-card-actions>
      </v-main>
    </v-app>
  </v-card>
</template>
  
<script>
import { defineComponent, ref, watch, computed } from "vue";
import { useOnline } from '@vueuse/core';
import Autocomplete from "@/components/MyAutocomplete.vue"
import TabsTrans from "@/components/transfert/TabsTrans.vue";
import TableTrans from '@/components/transfert/TableTrans.vue';
import MyTable from "@/components/MyTable.vue";
import useArticleSelection from "@/composables/useArticleSelection"
import { useConseilReapproStore } from "@/store/Transfert/conseilReappro";
import MyLoading from '@/components/Loading.vue';
import { useRouter } from 'vue-router';
import Config from "@/utils/config.js"
import useSessionTimeout from '@/utils/useSessionTimeout';
import useValidationTransfert from '@/composables/useValidationTransfert';
import searchArticle from "@/components/searchArticle.vue";
export default defineComponent({
  components: {
    TabsTrans,
    TableTrans,
    Autocomplete,
    MyLoading,
    MyTable,
    searchArticle
  },

  methods: {
    onHome() {
      this.$router.push("/AccueilPage");

    },
  },

  setup() {
    const isOnline = useOnline();
    const user = localStorage.getItem('username');
    const router = useRouter();
    useSessionTimeout(Config.DURRE_SESSION, router);
    const storeConsRea = useConseilReapproStore();
    const articles = ref(null);
    const selected = ref([]);
    const depOrg = ref('');
    const depDest = ref('');
    const listConsRea0 = ref([]);
    const listConsRea1 = ref([]);
    const listSelection = ref([]);
    const saveConstRea0 = ref([]);
    const isVide = ref(false);
    const isPasEmpVide = ref(false);
    const m_articles = ref('');
    const loadings = computed(() => storeConsRea.loading);
    const isSearch = ref(false);
    const dialog = ref(false);
    const disabled = ref(false);
    const disbledTranst = ref(false);
    

    const run_list_conseilReappro = async () => {
      listConsRea0.value = [];
      listConsRea1.value = [];
      saveConstRea0.value = [];
      depDest.value = 'DET'
      depOrg.value = 'GROS'
      console.log(select.value);
      await storeConsRea.fetchConseilReappro(select.value, depOrg.value, depDest.value);
      if (storeConsRea.conseilReappro0.length > 0 && storeConsRea.conseilReappro1.length > 0) {
        listConsRea0.value = storeConsRea.conseilReappro0;
        listConsRea1.value = storeConsRea.conseilReappro1;
        saveConstRea0.value = listConsRea0.value;
        disbledTranst.value = true;
       
      }
    }

    function closeDialog() {
      isSearch.value = false;
      dialog.value = false;
    }

    function getArticleSearch(item){
      select.value = item.article;
      libelle.value = item.libelle;
      closeDialog();
    }

    const totalArticles = computed(() => {
      return listConsRea0.value.length;
    });

    const { isUpdating, items, search, select, loading, handleSelectChange, libelle } = useArticleSelection(isSearch);

    const searchEvent = async () => {
     await run_list_conseilReappro();
      listSelection.value = [];
      selected.value = [];
      saveConstRea0.value = [];
    }

    const transfer = async () => {
      await valideTransfert();
    };

    const annuler = () => {
      listConsRea0.value = [];
      listConsRea1.value = [];
      listSelection.value = [];
      selected.value = [];
      saveConstRea0.value = [];
    };


    const charger = () => {
      if (!isPasEmpVide.value) {
        if (selected.value.length > 0) {
          selected.value.forEach(itemA => {
            const matchingItemsB = listConsRea1.value.filter(itemB => (itemB.article.trim() === itemA.article.trim()));
            if (matchingItemsB.length > 0) {
              matchingItemsB.forEach(itemB => {
                if (itemB.empl_dest.trim().length !== 0) {
                  listSelection.value.push(itemB);
                  listConsRea0.value = listConsRea0.value.filter(item => item.article.trim() !== itemB.article.trim());
                  disabled.value = true;
                } else {
                  isPasEmpVide.value = true;
                  m_articles.value = itemB.libelle;
                }
              });
            }
          });
          selected.value = [];
        } else {
          isVide.value = true;
        }
      }
    };

    function enlever(item) {
      const itemsToRemove = listSelection.value.filter(itemB => itemB.article.trim() === item.article.trim());

      if (itemsToRemove.length > 0) {
        // Supprimer les éléments correspondants de listSelection.value
        listSelection.value = listSelection.value.filter(itemB => itemB.article.trim() !== item.article.trim());

        // Ajouter itemC à listConsRea0.value une seule fois
        const itemC = saveConstRea0.value.find(itemC => itemC.article.trim() === itemsToRemove[0].article.trim());

        if (itemC) {
          listConsRea0.value.push(itemC);
          listConsRea0.value.sort((a, b) => a.couverture_det - b.couverture_det);
        }

        console.log("Articles supprimés et itemC ajouté une fois.");
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
      empl, isPasEmp, m_article
    } = useValidationTransfert(listSelection, listSelection, 'Conseil Reappro', articles, 'Conseil Reappro', searchEvent, depOrg, depDest);

    const headers = [
      { title: 'ARTICLE', align: 'start', key: 'article', sortable: true, width: '10%' },
      { title: 'LIBELLE', align: 'start', key: 'libelle', sortable: true, minWidth: '300px'},
      { title: 'COLISAGE', align: 'center', key: 'colisage', width: '4%' },
      { title: 'MOYENNE VTE', align: 'center', key: 'moyenne_vte_j', width: '4%' },
      { title: 'COUVERTURE DET', align: 'center', key: 'couverture_det', width: '4%' },
      { title: 'COUVERTURE BESOIN', align: 'center', key: 'couverture_besion', width: '4%' },
      { title: 'STK GROS', align: 'center', key: 'stick_gros', width: '4%' },
      { title: 'APPRO EXACT', align: 'center', key: 'qte_appro_exacte', width: '4%' },
      { title: 'QUANTITE', align: 'center', key: 'qte_appro', width: '4%' },
    ]


    const headers_Second = [
      { title: 'CODE', align: 'start', key: 'article', sortable: true },
      { title: 'LIBELLE', align: 'start', key: 'libelle', minWidth: '300px' },
      { title: 'LABO', align: 'center', key: 'labo' },
      { title: 'DEPOT DEPART', align: 'center', key: 'depot_org' },
      { title: 'EMP DEPART', align: 'center', key: 'empl_org' },
      { title: 'DEPOT DEST', align: 'center', key: 'depot_dest' },
      { title: 'EMP DEST', align: 'center', key: 'empl_dest' },
      { title: 'LOT', align: 'center', key: 'lot' },
      { title: 'DATE PER', align: 'center', key: 'datePer' },
      { title: 'LETTRE', align: 'center', key: 'lettre' },
      { title: 'QUANTITE', align: 'center', key: 'qte', width: 20 },
      { title: 'ACTION', align: 'center', key: 'actions', width: 40 },

    ]

  

    return {
      headers, headers_Second,
      isOnline, user, isUpdating,
      items,
      search,
      select,
      loading,
      handleSelectChange,
      libelle,
      isSelect,
      valideTransfert,
      listAtransferer,
      store,
      chagmt,
      empl, isPasEmp, m_article, transfer,
      listStockError, isPasVide,
      isStock, isSelect, selected, annuler, articles, storeConsRea, searchEvent, loadings, listConsRea0, totalArticles,
      listSelection, charger, enlever, isVide, isPasEmpVide, m_articles, isSearch, closeDialog, dialog,getArticleSearch,disabled,disbledTranst,loadings 
    };
  },
});
</script>