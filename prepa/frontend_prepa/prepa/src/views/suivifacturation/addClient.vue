<template>
  <v-card>
    <v-card-title class="custom-card-dm">
      <div class="d-flex justify-space-between align-center">
        <span class="text-h5"> <u>Ajouter le nom du client associé au numéro</u> : <b>{{ formatNumero(Tnumero) }}</b> </span>
        <v-icon @click="closeDetail">mdi-close</v-icon>
      </div>
    </v-card-title>

    <!-- <pre>{{ selected_client }}</pre> Affichage de la sélection -->

    <div class="pa-2">
      <v-card>
        <!-- Utilisation du composant MyTableAnnuaire -->
        <MyTableAnnuaire :headers="headers" :items="list" v-model="selected_client" return-object />
      </v-card>
    </div>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="#B71C1C" variant="outlined" @click="annuler">
        Annuler
      </v-btn>
      <v-btn color="#26A69A" variant="outlined" @click="save">
        Enregistrer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import MyTableAnnuaire from '@/components/facturio/MyTableAnnuaire.vue';
import { useClientStore } from "@/store/utils/client.js";
import swal from 'sweetalert2';

export default defineComponent({
  components: {
    MyTableAnnuaire,
  },

  props: {
    numero: String,
    seqEntrant: Number,
  },

  setup(props, { emit }) {
    const dialogVisible = ref(false);
    const list = ref([]);
    const store = useClientStore();
    const Tnumero = props.numero;
    const user = localStorage.getItem('username');

    const selected_client = ref(null); // Changer en objet unique

    const formatNumero = (numero) => {
            if (numero && numero.length === 10) {
                return numero.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, '$1 $2 $3 $4');
            }
            return numero;
        };

    // Fetch de la liste des clients à l'initialisation
    onMounted(async () => {
      await listClient();
    });

    // Fonction pour récupérer les clients
    const listClient = async () => {
      await store.fetchlListClient();
      list.value = store.ListClients;
    };

    // Fonction pour annuler
    const annuler = () => {
      dialogVisible.value = false;
      emit('annuler');
    };

    // Fermer le détail
    const closeDetail = () => {
      dialogVisible.value = false;
      emit('annuler');
    };

    // En-têtes de la table
    const headers = [
      // { title: 'SEQ', align: 'center', key: 'seq', sortable: true },
      { title: 'CODE CLIENT', align: 'start', key: 'clcode', sortable: true },
      { title: 'CLIENT', align: 'start', key: 'clnom1', sortable: true },
    ];

    // Fonction pour enregistrer la sélection
    const save = async () => {
      if (selected_client.value) {
        const { clcode, clnom1, clsa } = selected_client.value;
        const code = clcode;
        const nom = clnom1;
        const type = clsa;
        const numero = Tnumero;
        const user_cree = user;

        // Utilisation des données sélectionnées pour sauvegarder
        await store.updateAnnuaire(nom, code, type, numero, user_cree);
        swal.fire({
          icon: "info",
          title: "Enregistrement effectué",
          // text: "Enregistrement effectuée",
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          dialogVisible.value = false;

          emit('annuler');
        });

      } else {
        const Toast = swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000, //40s d'affichage
          timerProgressBar: true,
          onOpen: (toast) => {
            toast.addEventListener('mouseenter', swal.stopTimer)
            toast.addEventListener('mouseleave', swal.resumeTimer)
          }
        });

        Toast.fire({
          icon: 'warning',
          title: 'Aucune donnée sélectionnée',
          background: '#FFF3E0'

        });
        return; // Arrêter l'exécution de la fonction
      }
    };

    return {
      dialogVisible, headers, list, selected_client, annuler, closeDetail, save, Tnumero, user,formatNumero,
    };
  },
});
</script>
