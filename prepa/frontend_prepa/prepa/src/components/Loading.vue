
  <template>
    <v-dialog v-model="dialog" persistent max-width="550">
      <v-card>
        <v-card-title>
          Traitement encours  <b class="text-teal-darken-2" >{{ articles }}</b>
        </v-card-title>
        <v-card-text>
          <v-progress-linear  indeterminate color="primary"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  <script>
  import { ref, watch } from 'vue';
  
  export default {
    props: {
      loading: {
        type: Boolean,
        required: true,
      },
      articles:String,
    },
    emits: ['close'],
    setup(props, { emit }) {
      const dialog = ref(false);
  
      watch(
        () => props.loading,
        (loading) => {
          dialog.value = loading;
        },
      );
  
      const handleClose = () => {
        emit('close');
      };
  
      return {
        dialog,
        handleClose,
      };
    },
  };
  </script>
  