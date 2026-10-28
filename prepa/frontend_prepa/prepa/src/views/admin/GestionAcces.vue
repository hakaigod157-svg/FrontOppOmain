<template>
    <v-card>
        <v-app>
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabs></MyTabs>
                </v-card>
                <v-spacer></v-spacer>


                <v-divider vertical></v-divider>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div>
                    <u>Login</u> :&nbsp;<b><span style="color: #388E3C;">{{ user }}</span></b>
                </div>&nbsp;&nbsp;
                <div>
                    <span
                        :style="{ backgroundColor: isOnline ? 'green' : 'red', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }"></span>
                </div>
                <div>
                    <v-btn @click="onHome">
                        <v-img :width="20" :src="require('@/assets/home.png')">
                        </v-img>
                    </v-btn>
                </div>
            </v-app-bar>
            <v-container fluid>
                <v-main style="--v-layout-top: 45px" app>
                    <MyLoading :loading="chagmt" @close="chagmt = false" :articles="articles"></MyLoading>
                    <router-view></router-view>
                    <v-alert v-if="ok" type="success" @click="ok = false, dialog = false" colored-border elevation="1"
                        width="300px" density="compact">Mise à jour effectuée avec succès.
                    </v-alert>
                    <v-row class="pt-0 mt-0">
                        <v-col cols="12" sm="6" md="2">
                            <v-row>
                                <v-col cols="12" sm="6" md="10">
                                    <v-sheet class="pa-1 ma-1" density="compact">
                                        <v-autocomplete :disabled="isUpdating" :items="items" 
                                            item-title="code" item-value="code" label="Groupe" density="compact"
                                            clearable hide-no-data hide-details v-model:search="search" v-model="select"
                                            :loading="loading" color="deep-purple-accent-4"
                                            @update:modelValue="handleSelectChange">
                                            <template v-slot:item="{ props, item }">
                                                <v-list-item v-bind="props">
                                                    <div class="text-grey lighten-1">{{ item.libelle }}</div>
                                                </v-list-item>
                                            </template>
                                        </v-autocomplete>

                                    </v-sheet>
                                </v-col>
                                <v-col cols="12" sm="6" md="2">
                                    <Icon @click="ajoutGroupe" icon="ic:sharp-group-add" class="text-h4"
                                        style="color:rgb(98,0,238);margin-top:15px;margin-right: 20px;" />
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols="12" sm="6" md="2">
                            <v-sheet class="pa-1 ma-1" density="compact">
                                <small class="text-grey lighten-1" style="font-size: 16px;">Liste des Utilisateurs
                                    activés</small>
                                <div style="height: 500px; overflow-y: auto; border: dashed #d7ead5">
                                    <VueDraggableNext :list="listUsers" group="user-group" :ghost-class="'dragging'">
                                        <v-list-item v-for="(item, i) in listUsers" :key="i" :value="item">
                                            <template v-slot:prepend>
                                                <v-icon icon="mdi-star"></v-icon>
                                            </template>
                                            <v-list-item-title density="compact" v-text="item.name"></v-list-item-title>
                                            <v-list-item-subtitle
                                                v-text="'Name: ' + item.fullname"></v-list-item-subtitle>
                                        </v-list-item>
                                    </VueDraggableNext>
                                </div>
                                <v-card-text density="compact" class="pa-1">
                                    <b density="compact"> {{ listUsers.length }}</b> Lignes Trouvées </v-card-text>
                            </v-sheet>

                        </v-col>
                        <v-col cols="12" sm="6" md="2">
                            <v-sheet class="pa-1 ma-1">
                                <small class="text-grey lighten-1 " style="font-size: 16px;">Membres du Groupe</small>
                                <div style="height: 500px; overflow-y: auto; border: dashed #d7ead5">
                                    <VueDraggableNext :list="listMembres" group="user-group" :ghost-class="'dragging'">
                                        <v-list-item v-for="(item, i) in listMembres" :key="i" :value="item">
                                            <template v-slot:prepend>
                                                <v-icon icon="mdi-star"></v-icon>
                                            </template>
                                            <v-list-item-title v-text="item.name" density="compact"></v-list-item-title>
                                            <v-list-item-subtitle
                                                v-text="'Name: ' + item.fullname"></v-list-item-subtitle>
                                        </v-list-item>
                                    </VueDraggableNext>
                                </div>
                                <v-card-text density="compact" class="pa-1">
                                    <b density="compact"> {{ listMembres.length }}</b> Lignes Trouvées </v-card-text>
                            </v-sheet>

                        </v-col>
                        <!-- <v-col cols="12" sm="6" md="1">
                        <v-divider vertical color="primary">
                            <div class="d-flex justify-center align-center "
                                style="margin-left: 20px;margin-right: 20px;">
                            </div>
                        </v-divider>
                        </v-col> -->
                        <v-col cols="12" sm="6" md="3">
                            <v-sheet class="pa-1 ma-1">
                                <small class="text-grey lighten-1 " style="font-size: 16px;">Liste des Accès</small>
                                <div style="height: 500px; overflow-y: auto; border: dashed #d7ead5;">
                                    <VueDraggableNext :list="listAccess" group="acces-group" :ghost-class="'dragging'">
                                        <v-list-item v-for="(item, i) in listAccess" :key="i" :value="item">
                                            <template v-slot:prepend>
                                                <v-icon icon="mdi-star"></v-icon>
                                            </template>
                                            <v-list-item-title v-text="item.code" density="compact">
                                            </v-list-item-title>
                                            <v-list-item-subtitle v-text="'Desc: ' + item.desc"></v-list-item-subtitle>
                                            <template v-slot:append>
                                                <v-card-subtitle class="text-grey lighten-3 text-right"
                                                    style="font-size: 10px;">{{ item.categorie }}</v-card-subtitle>
                                            </template>

                                        </v-list-item>
                                    </VueDraggableNext>
                                </div>
                                <v-card-text density="compact" class="pa-1">
                                    <b density="compact"> {{ listAccess.length }}</b> Lignes Trouvées </v-card-text>
                            </v-sheet>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-sheet class="pa-1 ma-1">
                                <small class="text-grey lighten-1 " style="font-size: 16px;">Vos Accès</small>
                                <div style="height: 500px; overflow-y: auto; border: dashed #d7ead5;">
                                    <VueDraggableNext :list="listSesDroits" group="acces-group"
                                        :ghost-class="'dragging'">
                                        <v-list-item v-for="(item, i) in listSesDroits" :key="i" :value="item">
                                            <template v-slot:prepend>
                                                <v-icon icon="mdi-star"></v-icon>
                                                <v-checkbox density="compact" label="W" v-model="item.write"
                                                    hide-details color="primary"
                                                    @change="handleCheckboxChange(item)"></v-checkbox>
                                                <v-checkbox density="compact" label="R" v-model="item.read" hide-details
                                                    color="primary" @change="handleCheckboxChange(item)"></v-checkbox>
                                            </template>
                                            <v-list-item-title v-text="item.code" density="compact">
                                            </v-list-item-title>
                                            <v-list-item-subtitle
                                                v-text="'Desc: ' + item.desc + ' - ' + item.type"></v-list-item-subtitle>
                                        </v-list-item>
                                    </VueDraggableNext>
                                </div>
                                <v-card-text density="compact" class="pa-1">
                                    <b density="compact"> {{ listSesDroits.length }}</b> Lignes Trouvées </v-card-text>
                            </v-sheet>
                        </v-col>
                    </v-row>
                    <v-card-actions class="d-flex justify-end">
                        <v-spacer></v-spacer>
                        <v-btn variant="tonal" @click="majAcces" density="compact" class="text-none mb-2" size="x-large"
                            :disabled="!disabled" color="primary">
                            Mise à Jour
                        </v-btn>
                    </v-card-actions>

                </v-main>
            </v-container>
            <AjoutGroup v-if="isAjoutGroupe" :dialog="isAjoutGroupe" @close="closeDialog" :listGroupes=listAGroupe
                @valide="onValideGroup"></AjoutGroup>
        </v-app>
    </v-card>
</template>
<script>
import {
    VApp,
    VAppBar,
} from 'vuetify/lib/components';
import { defineComponent, ref, onMounted, onBeforeUnmount, watchEffect, computed } from "vue";
import { useOnline } from '@vueuse/core';
import { useGroupeStore } from '@/store/Admins/Groupe';
import { Icon } from '@iconify/vue';
import { VueDraggableNext } from 'vue-draggable-next';
import MyLoading from '@/components/Loading.vue'
import { useRouter } from 'vue-router'
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js"
import MyTabs from "@/components/admin/MyTabs.vue"
import AjoutGroup from '@/components/admin/AjoutGroupe.vue'
export default defineComponent({
    components: {
        Icon,
        VueDraggableNext,
        MyLoading,
        MyTabs,
        AjoutGroup
    },

    methods: {
        onHome() {
            this.$router.push('/AccueilPage');

        },

    },

    name: 'gestionAcces',
    setup() {
        const isOnline = useOnline();
        const user = localStorage.getItem('username');
        const storeGroupe = useGroupeStore();
        const listGroupe = ref([]);
        const listUsers = ref([]);
        const backListMembre = ref([]);
        const backListAcces = ref([]);
        const listMembres = ref([]);
        const listAccess = ref([]);
        const listSesDroits = ref([]);
        const search = ref('');
        const loading = computed(() => storeGroupe.loading);
        const select = ref('');
        const items = ref([]);
        const selectedItems = ref('');
        const articles = ref('');
        const chagmt = ref(false);
        const disabled = ref(false);
        const ok = ref(false);
        const listupdateDroit = ref([]);
        const isAjoutGroupe = ref(false);

        const router = useRouter();
        useSessionTimeout(Config.DURRE_SESSION, router);

        onMounted(async () => {
            await chargeGroupe();
        });

        const chargeGroupe = async () => {
            await storeGroupe.fetchGroupe();
            listGroupe.value = storeGroupe.groupes;
        }


        const listG = computed(() => {
            return listGroupe.value.map(depot => ({
                code: depot.code,
                libelle: depot.libelle,
            }));
        });


        const listAGroupe = computed(() => {
            return listGroupe.value.map(depot => ({
                code: depot.code.toLowerCase().trim()
            }));
        });

        const filtreUsers = computed(() => {
            return listMembres.value.filter(itemU =>
                !backListMembre.value.some(itemM => itemM.name === itemU.name)
            );
        });

        const filtreUsersEnleve = computed(() => {
            return backListMembre.value.filter(itemB =>
                !listMembres.value.some(itemM => itemM.name === itemB.name)
            );
        });

        const filtresAcces = computed(() => {
            return listSesDroits.value.filter(itemU =>
                !backListAcces.value.some(itemM => itemM.code === itemU.code)
            );
        });

        const filtresAccesEnleve = computed(() => {
            return backListAcces.value.filter(itemU =>
                !listSesDroits.value.some(itemM => itemM.code === itemU.code)
            );
        });

        const majAcces = async () => {
            if ((filtreUsers.value.length > 0 || filtreUsersEnleve.value.length > 0 || filtresAcces.value.length > 0
                || filtresAccesEnleve.value.length > 0 || listupdateDroit.value.length > 0) && (selectedItems)) {
                chagmt.value = true;
                for (let i = 0; i < filtreUsers.value.length; i++) {
                    const item = filtreUsers.value[i];
                    articles.value = item.name + ' => ' + selectedItems.value
                    await storeGroupe.insert_Membres(selectedItems.value, item.name);
                }
                for (let i = 0; i < filtreUsersEnleve.value.length; i++) {
                    const item = filtreUsersEnleve.value[i];
                    articles.value = item.name + ' <=' + selectedItems.value
                    await storeGroupe.delete_Membres(selectedItems.value, item.name);
                }
                for (let i = 0; i < filtresAcces.value.length; i++) {
                    const item = filtresAcces.value[i];
                    articles.value = item.code + ' =>' + selectedItems.value
                    const { code, desc, groupe, read, write, type } = item;
                    item.groupe = selectedItems.value;
                    await storeGroupe.insert_droit(item);
                }
                for (let i = 0; i < filtresAccesEnleve.value.length; i++) {
                    const item = filtresAccesEnleve.value[i];
                    articles.value = item.code + ' <=' + selectedItems.value
                    await storeGroupe.delete_Droit(selectedItems.value, item.code);
                }
                for (let i = 0; i < listupdateDroit.value.length; i++) {
                    const item = listupdateDroit.value[i];
                    articles.value = item.code + ' =>' + selectedItems.value
                    const { code, desc, groupe, read, write, type } = item;
                    item.groupe = selectedItems.value;
                    await storeGroupe.update_Droit(item.read, item.write, item.groupe, item.code);
                }

                ok.value = true;
                chagmt.value = false;
            }
        }
        const handleCheckboxChange = (item) => {
            if (item) {
                listupdateDroit.value.push(item);
            }
        }

        const querySelections = (v) => {
            if (v && v.length >= 1) {
                loading.value = true;
                // Simulated ajax query
                setTimeout(() => {
                    items.value = listG.value.filter((e) => {
                        const eArticle = e.code ? e.code.toLowerCase() : '';
                        const eLibelle = e.libelle ? e.code.toLowerCase() : '';
                        const vString = v.toLowerCase();
                        return eArticle.includes(vString) || eLibelle.includes(vString);
                    });
                    loading.value = false;
                }, 500);
            }
        };


        watchEffect(() => {
            if (search.value && search.value !== select.value) {
                querySelections(search.value);
            }
        });

        const handleSelectChange = async (selection) => {
            if (selection) {
                selectedItems.value = selection;
                await storeGroupe.fetchUsers(selection);
                await storeGroupe.fetchMembres(selection);
                await storeGroupe.fetchAcces(selection);
                await storeGroupe.fetchSesDroits(selection);
                listUsers.value = storeGroupe.users;
                listMembres.value = storeGroupe.membres;
                listAccess.value = storeGroupe.acces;
                listSesDroits.value = storeGroupe.sesDroits;
                backListMembre.value = listMembres.value.slice();
                backListAcces.value = listSesDroits.value.slice();
                disabled.value = true;
            } else {
                listUsers.value = [];
                listAccess.value = [];
                listSesDroits.value = [];
                listMembres.value = [];
                backListMembre.value = [];
                backListAcces.value = [];
                listupdateDroit.value = [];
                disabled.value = false;
            }

        }

        const ajoutGroupe = () => {
            isAjoutGroupe.value = true;
        }

        function closeDialog() {
            isAjoutGroupe.value = false;

        }
        const onValideGroup = async (values) => {
            isAjoutGroupe.value = false;
            select.value = values.groupe;
            await chargeGroupe();
            await handleSelectChange(select.value);
        }
        // function onValideGroup (values){
        //     isAjoutGroupe.value = false;
        //     select.value = values.groupe;
        //     chargeGroupe();
        //     handleSelectChange(select.value);

        // }

        return {
            isOnline, user, listGroupe, select, items, querySelections, search, handleSelectChange, selectedItems,
            listMembres, listUsers, listAccess, listSesDroits, filtresAcces, filtresAccesEnleve, majAcces, articles, chagmt, handleCheckboxChange,
            disabled, ok, ajoutGroupe, isAjoutGroupe, closeDialog, listAGroupe, onValideGroup
        }
    },



});
</script>


<style>
.dragging {
    color: rgb(98, 0, 238)
}
</style>