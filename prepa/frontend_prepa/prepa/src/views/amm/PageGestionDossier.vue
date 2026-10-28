<template>
    <v-card>
        <v-app>
            <!-- === APP BAR === -->
            <v-app-bar :elevation="1" density="compact" color="#d7ead5" app>
                <v-card density="compact">
                    <MyTabsAmm />
                </v-card>
                <v-spacer />
                <div>
                    <span><u>Serveur</u> : <span style="color: red; font-weight: bold;">{{ ip_server }}</span></span>&nbsp;&nbsp;&nbsp;&nbsp; 
                    
                    <u>Login</u> : <b><span style="color: #388E3C">{{ user
                            }}</span></b>
                </div>&nbsp;&nbsp;
                <div>
                    <span
                        :style="{ backgroundColor: isOnline ? 'green' : 'red', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }"></span>
                </div>
                <div>
                    <v-btn @click="onHome"><v-img :width="20" :src="require('@/assets/home.png')" /></v-btn>
                </div>
            </v-app-bar>

            <v-main :class="{ 'blur-effect': dialogVisibleNewInsert }" style="--v-layout-top: 40px" app>
                <div class="pa-2">
                    <div style="width:1700px; margin:auto;">
                        <!-- === BARRE BOUTONS PRINCIPAUX === -->
                        <div
                            style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;margin-top: 25px;">
                            <v-btn variant="tonal" color="#F50057" @click="newInsertDossier" :disabled="loading"
                                density="compact">
                                Nouveau
                            </v-btn>
                        </div>

                        <div class="d-flex" style="gap: 40px; align-items: start;">
                            <!-- === TABLEAU PRINCIPAL GAUCHE === -->
                            <div style="flex:2;">
                                <v-tabs v-model="activeTab" bg-color="#FFFFFF" color="deep-purple-accent-4"
                                    align-tabs="center" density="compact">
                                    <v-tab value="GENERIQUE" style="visibility: hidden;">Générique</v-tab>
                                    <v-tab value="SPECIALITE" style="visibility: hidden;">Spécialité</v-tab>
                                </v-tabs>
                                <v-tabs v-model="activeTab" bg-color="#FFFFFF" color="deep-purple-accent-4"
                                    align-tabs="center" density="compact">
                                    <v-tab value="GENERIQUE" style="visibility: hidden;">Générique</v-tab>
                                    <v-tab value="SPECIALITE" style="visibility: hidden;">Spécialité</v-tab>
                                </v-tabs>

                                <div class="mt-2">
                                    <div class="spacer"></div>
                                    <MyTableAmm :headers="headers" :items="list" density="compact"
                                        v-model:selected="selectedItem" @row-selected="onSelectMain"
                                        @row-click="onSelectMain" @delete-item="onDeleteMain" :show-actions="true"
                                        style="width: 100%;" />
                                </div>
                            </div>

                            <!-- === BOUTONS ENTRE TABLEAUX === -->
                            <div class="d-flex flex-column align-center" style="gap: 12px;">
                                <v-btn icon color="green" :disabled="!canMoveDown" @click="moveDown"
                                    title="Ajouter vers l'onglet actif"
                                    :style="{ transform: `translateY(${offset}px)` }">→</v-btn>
                                <v-btn icon color="red" :disabled="!canMoveUp" @click="moveUp"
                                    title="Supprimer de l'onglet actif">←</v-btn>
                            </div>

                            <!-- === TABLEAU ACTIF DROITE SELON TAB === -->
                            <div style="flex:2;">
                                <!-- Tabs principal : Générique / Spécialité -->
                                <v-tabs v-model="activeTab" bg-color="#CFD8DC" color="deep-purple-accent-4"
                                    align-tabs="center" density="compact">
                                    <v-tab value="GENERIQUE">Générique</v-tab>
                                    <v-tab value="SPECIALITE">Spécialité</v-tab>
                                </v-tabs>

                                <!-- Nouveau Tabs : Type de dossier -->
                                <!-- <v-tabs v-model="activeTypeDossier" bg-color="#CFD8DC" color="deep-purple-accent-4"
                                    align-tabs="center" density="compact" class="mt-2">
                                    <v-tab value="NOUVELLE DEMANDE">Nouvelle demande</v-tab>
                                    <v-tab value="RENOUVELLEMENT">Renouvellement</v-tab>
                                </v-tabs> -->

                                <!-- Remplacement des Tabs par Radio group -->
                                <v-radio-group v-model="activeTypeDossier" inline class="mt-2 no-padding-radio"
                                    hide-details>
                                    <v-radio label="Nouvelle demande" value="NOUVELLE DEMANDE"></v-radio>
                                    <v-radio label="Renouvellement" value="RENOUVELLEMENT"></v-radio>
                                </v-radio-group>

                                <!-- Contenu selon onglet principal -->
                                <div v-if="activeTab === 'GENERIQUE'" class="mt-2">
                                    <MyTableAmm :headers="headersTabs" :items="filteredGeneriqueList" density="compact"
                                        style="width:100%;" v-model:selected="selectedTabItem"
                                        @row-selected="onSelectTab" class="generique-table" :show-actions="false" />
                                    <div v-if="filteredGeneriqueList.length === 0" class="pa-2 text-grey">
                                    </div>
                                </div>

                                <div v-if="activeTab === 'SPECIALITE'" class="mt-2">
                                    <MyTableAmm :headers="headersTabs" :items="filteredSpecialiteList" density="compact"
                                        style="width:100%;" v-model:selected="selectedTabItem"
                                        @row-selected="onSelectTab" class="specialite-table" :show-actions="false" />
                                    <div v-if="filteredSpecialiteList.length === 0" class="pa-2 text-grey">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- === DIALOG === -->
                        <v-dialog v-if="dialogVisibleNewInsert" v-model="dialogVisibleNewInsert" :persistent="true"
                            width="450px">
                            <dossierNewF @annuler="onAnnuler" @save="onSave" />
                        </v-dialog>
                    </div>
                </div>
            </v-main>
        </v-app>
    </v-card>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOnline } from "@vueuse/core";
import Swal from "sweetalert2";

import MyTabsAmm from "@/components/amm/MyTabsAmm.vue";
import MyTableAmm from "@/components/amm/MyTableAddDossier.vue";
import dossierNewF from "@/views/amm/PageNewDocF.vue";
import { uselistDossier } from "@/store/Amm/amm_dossier.js";

export default defineComponent({
    components: { MyTabsAmm, MyTableAmm, dossierNewF },

    setup() {
        const isOnline = useOnline();
        const router = useRouter();
        const user = localStorage.getItem("username");
        const loading = ref(false);

        const list = ref([]);
        const generiqueList = ref([]);
        const specialiteList = ref([]);

        const selectedItem = ref(null);
        const selectedTabItem = ref(null);
        const activeTab = ref("GENERIQUE");
        const activeTypeDossier = ref("NOUVELLE DEMANDE"); // Nouvelle variable pour type de dossier
        const type_dossier = ref(activeTypeDossier.value);
        const storeNumDS = uselistDossier();
        const numDS = ref([]);

        // Watch pour mettre à jour type_dossier
        watch(activeTypeDossier, (newVal) => {
            type_dossier.value = newVal;
            // console.log("Type dossier sélectionné :", type_dossier.value);
        });

        const dialogVisibleNewInsert = ref(false);

        const storeAllListF = uselistDossier();
        const storeInsertDocFournir = uselistDossier();
        const storeDeleteFournir = uselistDossier();
        const ip_server = ref('');

        const headers = [
            // { title: "CODE DOSSIER", align: "start", key: "dossier_code", sortable: false },
            { title: "LIBELLE DOSSIER", align: "start", key: "dossier_lib", sortable: false },
            { title: "", align: "center", key: "actions", sortable: false },
        ];

        const headersTabs = [
            { title: "", align: "start", key: "dossier_lib", sortable: false }
        ];

        // === Fetch initial data ===
        const listAllFournir = async () => {
            await storeAllListF.fetchAllListAFournir();
            list.value = storeAllListF.listAllFournirs || [];
        };

        // const listGenerique = async () => {
        //     await storeAllListF.fetchListGen();
        //     generiqueList.value = storeAllListF.listGens.map(i => ({
        //         dossier_code: i.code_dossier_gen,
        //         dossier_lib: i.dossier_lib_gen,
        //         classification: "GENERIQUE"
        //     }));
        // };

        // const listSpecialite = async () => {
        //     await storeAllListF.fetchListSpe();
        //     specialiteList.value = storeAllListF.listSpes.map(i => ({
        //         dossier_code: i.code_dossier_spe,
        //         dossier_lib: i.dossier_lib_spe,
        //         classification: "SPECIALITE"
        //     }));
        // };


        // === Chargement données ===
        const listGenerique = async () => {
            await storeAllListF.fetchListGen()
            generiqueList.value = storeAllListF.listGens.map(i => ({
                dossier_code: i.code_dossier_gen,
                dossier_lib: i.dossier_lib_gen,
                type_dossier: i.type_dossier_gen,   // ⚠️ suppose que le champ existe
                classification: "GENERIQUE"
            }))
        }

        const listSpecialite = async () => {
            await storeAllListF.fetchListSpe()
            specialiteList.value = storeAllListF.listSpes.map(i => ({
                dossier_code: i.code_dossier_spe,
                dossier_lib: i.dossier_lib_spe,
                type_dossier: i.type_dossier_spe,   // ⚠️ suppose que le champ existe
                classification: "SPECIALITE"
            }))
        }

        // === Listes filtrées dynamiquement ===
        // const filteredGeneriqueList = computed(() =>
        //     generiqueList.value.filter(
        //         i => i.type_dossier === activeTypeDossier.value
        //     )
        // )

        // const filteredSpecialiteList = computed(() =>
        //     specialiteList.value.filter(
        //         i => i.type_dossier === activeTypeDossier.value
        //     )
        // )

        // === Listes filtrées dynamiquement ===
        const filteredGeneriqueList = computed(() =>
            generiqueList.value.filter(
                i => i.type_dossier === activeTypeDossier.value
            )
        )

        const filteredSpecialiteList = computed(() =>
            specialiteList.value.filter(
                i => i.type_dossier === activeTypeDossier.value
            )
        )



        onMounted(async () => {
            await listAllFournir();
            await listGenerique();
            await listSpecialite();


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
        });

        const actualiser = async () => {
            await listAllFournir();
            await listGenerique();
            await listSpecialite();
        };

        const onSelectMain = (item) => selectedItem.value = item;
        const onSelectTab = (item) => selectedTabItem.value = item;

        // const targetList = () => activeTab.value === "GENERIQUE" ? generiqueList : specialiteList;

        // === Ajouter directement en DB ===
        // const moveDown = async () => {
        //     if (!selectedItem.value) return;
        //     const target = targetList();
        //     const exists = target.value.some(
        //         i =>
        //             i.dossier_code === selectedItem.value.dossier_code &&
        //             i.type_dossier === activeTypeDossier.value
        //     )
        //     if (exists) {
        //         Swal.fire("", "Élément déjà présent pour ce type de dossier.", "warning")
        //         return
        //     }

        //     const newItem = {
        //         dossier_code: selectedItem.value.dossier_code,
        //         dossier_lib: selectedItem.value.dossier_lib,
        //         classification: activeTab.value,     
        //         type_dossier: activeTypeDossier.value 
        //     };

        //     target.value.push(newItem);

        //     try {
        //         await storeInsertDocFournir.insertDossierDefaut(activeTypeDossier.value, [newItem]);
        //         Swal.fire("Succès", "Élément ajouté.", "success");
        //     } catch (error) {
        //         target.value = target.value.filter(i => i.dossier_code !== newItem.dossier_code);
        //         console.error(error);
        //         Swal.fire("Erreur", "Impossible d'ajouter l'élément.", "error");
        //     }
        //     selectedItem.value = null;
        // };

        // === Supprimer directement en DB ===
        // const moveUp = async () => {
        //     if (!selectedTabItem.value) return;
        //     const target = targetList();
        //     const item = target.value.find(i => i.dossier_code === selectedTabItem.value.dossier_code);
        //     if (!item) return;

        //     try {
        //         await storeInsertDocFournir.deleteDossierDefaut([item]);
        //         // ⚠️ supprime dans la liste brute
        //         target.value = target.value.filter(i => i.dossier_code !== item.dossier_code);
        //         Swal.fire("Succès", "Élément supprimé", "success");
        //     } catch (error) {
        //         console.error(error);
        //         Swal.fire("Erreur", "Impossible de supprimer l'élément.", "error");
        //     }

        //     selectedTabItem.value = null;
        // };

        const targetList = () => (activeTab.value === "GENERIQUE" ? generiqueList : specialiteList)

        // === Ajouter directement en DB ===
        const moveDown = async () => {
            if (!selectedItem.value) return

            const target = targetList()
            const typeDossier = activeTypeDossier.value

            // Vérifier si l'élément existe déjà pour ce type de dossier
            const exists = target.value.some(
                i => i.dossier_code === selectedItem.value.dossier_code && i.type_dossier === typeDossier
            )
            if (exists) {
                Swal.fire("", "Élément déjà présent pour ce type de dossier.", "warning")
                return
            }

            // ⚠️ Créer un nouvel objet pour éviter de partager la référence
            const newItem = {
                dossier_code: selectedItem.value.dossier_code,
                dossier_lib: selectedItem.value.dossier_lib,
                classification: activeTab.value,      // GENERIQUE ou SPECIALITE
                type_dossier: typeDossier             // NOUVELLE DEMANDE ou RENOUVELLEMENT
            }

            target.value.push(newItem)

            try {
                await storeInsertDocFournir.insertDossierDefaut(typeDossier, [newItem])
                Swal.fire("Succès", "Élément ajouté.", "success")
            } catch (error) {
                // Supprimer uniquement le nouvel objet ajouté
                target.value = target.value.filter(i => i !== newItem)
                console.error(error)
                Swal.fire("Erreur", "Impossible d'ajouter l'élément.", "error")
            }

            selectedItem.value = null
        }

        // === Supprimer directement en DB ===
        const moveUp = async () => {
            if (!selectedTabItem.value) return

            const target = targetList()
            const typeDossier = activeTypeDossier.value
            const code = selectedTabItem.value.dossier_code

            // Trouver l'élément exact dans la liste brute (code + type_dossier)
            const index = target.value.findIndex(
                i => i.dossier_code === code && i.type_dossier === typeDossier
            )
            if (index === -1) return

            const item = target.value[index]

            try {
                // console.log([item])
                await storeInsertDocFournir.deleteDossierDefaut([item])
                target.value.splice(index, 1) // supprimer seulement cet item
                Swal.fire("Succès", "Élément supprimé", "success")
            } catch (error) {
                console.error(error)
                Swal.fire("Erreur", "Impossible de supprimer l'élément.", "error")
            }

            selectedTabItem.value = null
        }




        const canMoveDown = computed(() => !!selectedItem.value);
        const canMoveUp = computed(() => !!selectedTabItem.value);

        // === Dialog Nouveau ===
        const newInsertDossier = async () => dialogVisibleNewInsert.value = true;
        const onAnnuler = async () => dialogVisibleNewInsert.value = false;

        const onSave = async (payload) => {
            if (!payload || !payload.code || !payload.libelle) return;

            await storeNumDS.fetchNumDS('DOSSIER', 1);
            numDS.value = storeNumDS.listnumdss;

            payload.code = numDS.value[0].num_ds

            await storeInsertDocFournir.insertDocFournir(payload.code, payload.libelle);
            dialogVisibleNewInsert.value = false;
            await listAllFournir();
        };

        const onHome = () => router.push("/AccueilPage");

        const onDeleteMain = async (item) => {
            const dossierCode = item.dossier_code;

            // Vérifier si le code existe dans spécialité ou générique
            const existsInGenerique = generiqueList.value.some(el => el.dossier_code === dossierCode);
            const existsInSpecialite = specialiteList.value.some(el => el.dossier_code === dossierCode);

            if (existsInGenerique || existsInSpecialite) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Impossible de supprimer',
                    text: 'Le code est utilisé dans la liste Générique ou Spécialité !',
                    timer: 3000,
                    showConfirmButton: false,
                    position: 'top',
                    toast: true,
                    background: '#ffeeba',
                    color: '#856404',
                    iconColor: '#856404',
                    customClass: {
                        popup: 'shadow-lg rounded-lg p-3'
                    }
                });
                return;
            }

            Swal.fire({
                text: `Supprimer ${dossierCode} ?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui, supprimer",
                cancelButtonText: "Annuler"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await storeDeleteFournir.fetchDeleteFournir(dossierCode);
                    await listAllFournir();
                }
            });
        };

        return {
            headers, isOnline, user, list, loading, headersTabs,ip_server,
            dialogVisibleNewInsert, newInsertDossier, onAnnuler, onSave,
            activeTab, activeTypeDossier, type_dossier, selectedItem, selectedTabItem,
            generiqueList, specialiteList, filteredGeneriqueList, filteredSpecialiteList,
            moveDown, moveUp,
            canMoveDown, canMoveUp,
            onSelectMain, onSelectTab,
            actualiser,
            onHome, onDeleteMain
        };
    }
});
</script>

<style>
/* .generique-table tr {
    background-color: #e3f2fd;
}

.specialite-table tr {
    background-color: #fff9c4;
} */

/* centre le bloc sans perdre le gap */
.d-flex.flex-column.align-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    /* ✅ rétablit l’espacement */

    position: sticky;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
}

.no-padding-radio {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
}

.spacer {
    height: 12px;
    /* ajuste facilement la hauteur */
}
</style>
