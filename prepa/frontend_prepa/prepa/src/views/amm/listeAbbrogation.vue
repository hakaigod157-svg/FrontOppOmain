<template>
    <v-card>
        <v-app>
            <!-- Barre d'application -->
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <MyTabsAmm />
                <v-spacer />
                <div>
                    <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{ ip_server
                            }}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <u>Login</u> : <b><span style="color: #388E3C;">{{ user
                    }}</span></b>
                </div>
                <div class="status-indicator"></div>
                <v-btn @click="onHome">
                    <v-img :width="20" :src="require('@/assets/home.png')" />
                </v-btn>
            </v-app-bar>

            <!-- Contenu principal -->
            <v-main :class="{ 'blur-effect': dialogLier || drawer }" style="--v-layout-top: 40px" app>
                <!-- Actions -->
                <v-card-actions density="compact">
                    <v-card-title density="compact">
                        <!-- <div class="checkbox-badge-wrapper">
                            <v-checkbox v-model="showOnlyValidated" color="orange" label="PAS DE CODE OPHAM"
                                density="compact" hide-details />
                            <div class="badge">{{ displayedTotal }}</div>
                        </div>

                        <div class="attente-box d-flex align-center ml-6">
                            <div class="color-square mr-2 d-flex justify-center align-center">
                                {{ attenteCount }}
                            </div>
                            <span>Gérer par opham</span>
                        </div> -->

                        <div class="d-flex align-center">
                            <div class="checkbox-badge-wrapper d-flex align-center">
                                <v-checkbox v-model="showOnlyValidated" color="orange" label="ABROGÉS" density="compact"
                                    hide-details />
                                <div class="badge ml-2">{{ displayedTotal }}</div>
                            </div>

                            <!-- ✅ Juste un petit espace à droite -->
                            <!-- <div class="d-flex align-center ml-6">
                                <div class="color-square2 mr-2 d-flex justify-center align-center">
                                    {{ attenteCount }}
                                </div>
                                <span style="color: #856404; font-weight: 500;font-size: 13px;"><u>ABROGÉS</u></span>
                            </div> -->
                        </div>

                    </v-card-title>

                </v-card-actions>

                <div class="pt-1 pb-1 px-2">
                    <!-- Recherche -->
                    <v-card flat>
                        <v-card-title class="d-flex align-center pe-2 pa-0">
                            <v-spacer></v-spacer>
                            <v-text-field v-model="searchTerm" prepend-inner-icon="mdi-magnify" density="compact"
                                label="Rechercher" flat hide-details variant="solo-filled" />
                        </v-card-title>
                        <v-divider></v-divider>
                    </v-card>

                    <v-progress-linear v-if="loading" color="primary" rounded indeterminate height="5"
                        density="compact" />

                    <MyTableVirtual :headers="headers" :items="listAbrog" :search="searchTerm" height="590"
                        class="custom-tablefabricant" :showPagination="true" action5="LIER" @action5Item="showLier"
                        @action2Item="updateAbrog" />
                </div>

            </v-main>

            <!-- Drawer ajout -->
            <ajoutListeMidac v-if="drawer" :drawer="drawer" @close="drawer = false" @onValide="onValideNew" />
        </v-app>
    </v-card>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useOnline } from "@vueuse/core";
import ajoutListeMidac from "./ajoutListeMidac.vue";
import MyTabsAmm from "@/components/amm/MyTabsAmm.vue";
import MyTableAmm from "@/components/amm/MyTableAmm.vue";
import MyTableVirtual from "@/components/amm/MyTableVirtual.vue";
import { uselistAbrogation } from "@/store/Amm/amm_abrogation.js";
import lier from "@/views/amm/lier_liste_midac.vue";
import { useDebounceFn } from '@vueuse/core';
import useSessionTimeout from '@/utils/useSessionTimeout';
import Config from "@/utils/config.js";
import Swal from "sweetalert2";
import { date } from "yup";

export default defineComponent({
    components: { MyTabsAmm, MyTableAmm, lier, MyTableVirtual },
    setup() {
        const store = uselistAbrogation();
        const router = useRouter();
        const isOnline = useOnline();
        useSessionTimeout(Config.DURRE_SESSION, router);
        const user = localStorage.getItem("username");
        const drawer = ref(false);
        const dialogLier = ref(false);
        const showOnlyValidated = ref(false);
        const listAbrogation = ref([]);
        const listLastImport = ref([]);
        const searchTerm = ref("");
        const code_pro = ref();
        // const listAbrog = ref([]);

        const listAbrog = computed(() => {
            if (showOnlyValidated.value) {
                return listAbrogation.value.filter(
                    item => Number(item.abrog_bouton) === 0
                );
            }

            return listAbrogation.value;
        });

        const ip_server = ref('');

        const headers = [
            { title: "CODE", align: "start", key: "abrog_code", sortable: true },
            { title: "LIBELE", align: "start", key: "abrog_libelle", sortable: true },
            { title: "TITULAIRE", align: "center", key: "abrog_titulaire", sortable: true },
            { title: "AMM INTERPRETE", align: "center", key: "abrog_amm_interprete", sortable: true },
            { title: "AMM", align: "start", key: "abroge_amm", sortable: true },
            { title: "AMM DATE", align: "start", key: "abrog_ammdate", sortable: true },
            { title: "EXPIRE", align: "start", key: "abrog_expire", sortable: true },
            { title: "DATE ABROGATION", align: "start", key: "abrog_expirationdate", sortable: true },
            { title: "ACTION", align: "start", key: "abrog_bouton", sortable: true }

            // { title: "AMM GERE OPHAM", align: "start", key: "amm_gere_opham", sortable: true },
        ];

        const loading = computed(() => store.loading);


        // const fetchlistAbrogation = async () => {
        //     try {
        //         await store.fetchListAbrogation();
        //         listAbrog.value = store.listAbrogations
        //     } catch (error) {
        //         console.error('Erreur lors du fetch :', error);
        //         return []; 
        //     }
        // };

        const fetchlistAbrogation = async () => {
            try {
                await store.fetchListAbrogation();

                listAbrogation.value = [...store.listAbrogations];

            } catch (error) {
                console.error('Erreur lors du fetch :', error);
            }
        };

        const updateAbrog = async (item) => {

            console.log(item);

            const code = item.abrog_code;
            const libelle = item.abrog_libelle;
            const labo = item.abrog_titulaire;

            const result = await Swal.fire({
                title: "Date d'Abrogation",
                width: "650px",
                html: `
            <div style="
                text-align: left;
                margin-top: 10px;
                
            ">
                <!-- LIBELLE -->
                <div style="
                    margin-bottom: 12px;
                ">
                    <label style="
                        display: block;
                        font-size: 13px;
                        font-weight: 500;
                        color: #777;
                        margin-bottom: 3px;
                    ">
                        
                    </label>

                    <div style="
                    display:flex;
                        justify-content: center;
                        align-items: flex-end;
                        font-size: 15px;
                        font-weight: 600;
                        color: #333;
                        padding: 8px 10px;
                        background-color: #f5f5f5;
                        border-radius: 4px;

                    ">
                        ${libelle ?? ''} 
                    </div>
                    <div style="
                        font-size: 15px;
                        font-weight: 600;
                        color: #333;
                        padding: 8px 10px;
                        background-color: #f5f5f5;
                        border-radius: 4px;
                        display: flex;
                        justify-content: center;
                        align-items: flex-end;
                    ">
                    (${labo ?? ''} )
                </div>
    
                </div>

                <!-- DATE -->
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    gap: 15px;
                    margin-top: 20px;
                ">

                    <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                    ">

                        <label style="
                            font-size: 14px;
                            font-weight: 500;
                            margin-bottom: 6px;
                            color: #555;
                        ">
                        </label>

                        <input
                            id="dateValidation"
                            type="date"
                            class="swal2-input"
                            style="
                                margin: 0;
                                width: 180px;
                                height: 45px;
                                box-sizing: border-box;
                            "
                        >

                    </div>

                </div>

            </div>
        `,

                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Valider",
                cancelButtonText: "Annuler",
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",

                allowOutsideClick: false,
                allowEscapeKey: false,

                customClass: {
                    confirmButton: "swal-button-white",
                    cancelButton: "swal-button-white"
                },

                preConfirm: () => {

                    const date = document.getElementById("dateValidation").value;

                    if (!date) {
                        Swal.showValidationMessage(
                            "Veuillez sélectionner une date."
                        );

                        return false;
                    }

                    return {
                        date
                    };
                }
            });

            if (!result.isConfirmed) {
                return;
            }

            const dateValidation = result.value.date;

            try {

                console.log("Code :", code);
                console.log("Libellé :", libelle);

                console.log("Date :", dateValidation);

                await store.updateAbrogation(
                    code,
                    dateValidation
                );

                Swal.fire({
                    icon: "success",
                    title: "Succès",
                    text: "L'abrogation a été enregistrée.",
                    timer: 2000,
                    showConfirmButton: false
                });
            
               await fetchlistAbrogation() ;

            } catch (err) {

                console.error(err);

                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Une erreur est survenue."
                });
            }
        };

        const onValideNew = async () => {
            const result = await fetchlistAbrogation();
            listAbrogation.value = result;
        }

        const onSaveReclam = async () => {

            const result = await fetchlistAbrogation();
            listAbrogation.value = result;
        }

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
            fetchlistAbrogation()


        })

        const newImportMidac = () => (drawer.value = true);
        const onHome = () => router.push("/AccueilPage");
        const onAnnulerLier = async () => {
            dialogLier.value = false;
            await fetchlistAbrogation();
        };
        // const showLier = () => (dialogLier.value = true);


        const displayedTotal = computed(() => {
            return listAbrogation.value.filter(
                item => Number(item.abrog_bouton) === 0
            ).length;
        });

        return {
            headers, ip_server,
            isOnline,
            user,
            drawer,
            dialogLier,
            showOnlyValidated,
            listAbrog,
            updateAbrog,
            listAbrogation, listLastImport,
            loading,
            searchTerm,
            newImportMidac,
            onHome,
            onAnnulerLier, code_pro,
            onValideNew,
            onSaveReclam, displayedTotal,
        };
    },
});
</script>

<style>
.custom-tablefabricant {
    font-size: 15px;
}

.blur-effect {
    filter: blur(5px);
    pointer-events: none;
    user-select: none;
}

.checkbox-badge-wrapper .badge {
    margin-top: 4px;
}

.btn-space {
    margin-left: 150px;
}

.status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: green;
    display: inline-block;
    margin-left: 8px;
}

.status-indicator.offline {
    background-color: red;
}

.dialog-lier {
    transform: translateY(-200px) !important;
    /* Remonte le dialog de 60px */
}

.color-square2 {
    width: 32px;
    height: 20px;
    color: #B2DFDB;
    background-color: #B2DFDB;
    border: 1px solid #f0ad4e;
    border-radius: 4px;
}
</style>
