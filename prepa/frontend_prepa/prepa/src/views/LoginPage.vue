<template>
   <div class="py-4">
      <v-img class="mx-auto mb-10" max-width="100" src="../assets/opham.png"></v-img>

      <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
         <div class="text-subtitle-1 text-medium-emphasis">Nom d'utilisateur</div>

         <v-text-field v-model="authStore.username" density="compact" placeholder="Nom d'utilisateur" clearable
            prepend-inner-icon="mdi-email-outline" variant="outlined" @keydown.enter="onLogin"></v-text-field>

         <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            Mot de passe
         </div>

         <v-text-field v-model="authStore.password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" clearable
            :type="visible ? 'text' : 'password'" density="compact" placeholder="Entrer votre mot de passe"
            prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
            @keydown.enter="onLogin">
         </v-text-field>

         <v-select variant="underlined" label="Serveurs" :items="authStore.servers"
            v-model="authStore.name_server"></v-select>

         <v-btn block class="mb-8" color="cyan-darken-4" size="large" variant="tonal" @click="onLogin">
            Se connecter
         </v-btn>
      </v-card>

   </div>

   <!-- <v-card class="fixed-bottom custom-bg" elevation="4"> -->

   <!-- <v-footer>
      <v-row justify="end">
         <v-col class="text-right">
            Version {{ version }}
         </v-col>
      </v-row>
   </v-footer> -->

   <footer class="v-footer v-theme--light" style="height: auto;">
      <div class="v-row justify-end">
         <div class="v-col text-right" style="padding-right: 0px; padding-left: 140px; padding-top: 250px;">
            Version {{ version }}
         </div>
      </div>
   </footer>

</template>

<script>
import { ref, defineComponent, onMounted } from 'vue';
import { useAuthStore } from '@/store/utils/login'
import { useRouter } from 'vue-router'
import { useStoreDroit } from "@/store/utils/droit.js";
import swal from 'sweetalert2';
import Config from "@/utils/config.js"
import Version from "@/utils/version.js";
import { encryptPassword, decryptPassword } from '@/utils/cryptoUtils';

export default defineComponent({
   name: 'login',
   setup() {
      const visible = ref(false);
      const authStore = useAuthStore();
      const router = useRouter();
      const storeDroit = useStoreDroit();
      const isLoggingIn = ref(false);

      const version = ref(Version.APP_VERSION);

      onMounted(async () => {
         await authStore.getlisteServer();
         authStore.name_server = authStore.servers[0];
      })


      const onLogin = async () => {

         if (isLoggingIn.value) return; 
         isLoggingIn.value = true;

         try {
            const response = await authStore.login();

            const Toast = swal.mixin({
               toast: true,
               position: 'center',
               showConfirmButton: false,
               timer: 1000,
               timerProgressBar: true,
               // didOpen: (toast) => {
               //    toast.addEventListener('mouseenter', swal.stopTimer)
               //    toast.addEventListener('mouseleave', swal.resumeTimer)
               // }
            });

            Toast.fire({
               icon: 'info',
               title: 'Connexion en cours ...'
            }).then(async () => {
               localStorage.clear();
               localStorage.setItem('username', authStore.username);
               if (authStore.password) {
                  localStorage.setItem('password', encryptPassword(authStore.password.toString()));
               } else {
                  localStorage.setItem('password', encryptPassword(""));
               }

               localStorage.setItem('sessionId', authStore.sessionId);
               localStorage.setItem('name_server', authStore.name_server);
               await authStore.fetchLocalIp();
               localStorage.setItem('ip_local', authStore.ip_local);

               await fetchData(localStorage.getItem('username'));
               const expirationTime = Date.now() + Config.DURRE_SESSION;
               localStorage.setItem('sessionExpiration', expirationTime);

               authStore.username = '';
               authStore.password = '';

               router.push('/AccueilPage');
            });
         } catch (error) {
            console.error("Erreur de connexion:", error);

            // Toast d'erreur pour un login échoué
            swal.fire({
               icon: 'error',
               title: error.message,
               toast: true,
               position: 'top-end',
               showConfirmButton: false,
               timer: 4000,
               timerProgressBar: true,
               didOpen: (toast) => {
                  toast.addEventListener('mouseenter', swal.stopTimer)
                  toast.addEventListener('mouseleave', swal.resumeTimer)
               }
            });
            // Réactiver le bouton en cas d'erreur
            isLoggingIn.value = false;
         }
      };

      async function fetchData(user) {
         try {
            await storeDroit.listeDroit(user);
            // console.log(storeDroit.droits);
            localStorage.setItem('listeDroits', JSON.stringify(storeDroit.droits));
         } catch (error) {
            console.error(error);
         }
      }

      return {
         visible,
         authStore,
         storeDroit,
         onLogin,
         fetchData,
         version
      };
   },
});
</script>
<style>
.fixed-bottom {
   position: fixed;
   bottom: 0;
   left: 0;
   width: 100%;
   z-index: 999;
   /* Ajustez ceci si nécessaire */
}
</style>