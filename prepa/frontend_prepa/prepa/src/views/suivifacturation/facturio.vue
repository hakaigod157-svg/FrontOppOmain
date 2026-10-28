<template>

    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">

                    <MyTabsFacturio :StoreAdv="useEtapeStoreAdv"></MyTabsFacturio>


                </v-card>
                <v-spacer></v-spacer>

                <div>
                    <u>Login</u> :&nbsp;<b><span style="color: #388E3C;">{{ user }}</span></b>
                </div>&nbsp;&nbsp;
                <div>
                    <span
                        :style="{ backgroundColor: isOnline ? 'green' : 'red', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }">
                    </span>
                </div>

                <div>
                    <v-btn @click="onHome">
                        <v-img :width="20" :src="require('@/assets/home.png')"></v-img>
                    </v-btn>
                </div>
            </v-app-bar>

            <v-main style="--v-layout-top: 40px" app>
                <v-card-actions density="compact">
                    <v-container>
                        <v-row justify="center">
                            <v-col cols="12" class="text-center">
                                <h1>Facturio</h1>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-actions>
            </v-main>
        </v-app>
    </v-card>
</template>

<script>
  import { defineComponent , ref , computed ,onMounted} from "vue";
  import { useRouter } from 'vue-router'
  import { useOnline } from '@vueuse/core';
  import { useEtapeStoreAdv } from "@/store/utils/etapeadv.js";
  import MyTabsFacturio from '@/components/facturio/MyTabsFacturio.vue';


export default defineComponent({
    components: {
        MyTabsFacturio
    },

    methods: {
        onHome() {
            this.$router.push("/AccueilPage");
        },
    },

    setup(props) {

        const isOnline = useOnline();
        const user = localStorage.getItem('username');
        const StoreAdv = useEtapeStoreAdv();

        return {
            isOnline,user,StoreAdv,
        };

    }

})

</script>