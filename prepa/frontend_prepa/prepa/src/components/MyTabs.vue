<template >
    <v-card density="compact">
        <v-tabs v-model="tabs" bg-color="#d7ead5" color="deep-purple-accent-4" align-tabs="center" density="compact">

            <v-tab v-if="showTabAttePrepa" to="/PageAttePrepa" name="tabAttePrepa">CC A préparer<v-badge
                    color="red-darken-4" :content="storeEtape.etapes.attePrep" inline></v-badge></v-tab>
            <v-tab v-if="showTabEncousPrep" to="/PageEnCoursPrepa" name="tabEnCoursPrepa">CC En préparation
                <v-badge color="indigo" :content="storeEtape.etapes.encoursPrep" inline></v-badge></v-tab>
            <v-tab v-if="showTabAtteCtrl" to="/PageAtteCtrl" name="tabAtteCtrl">CC Attente Ctrl <v-badge color="teal"
                    :content="storeEtape.etapes.atteCtrl" inline></v-badge>
            </v-tab>
            <v-tab v-if="showTabEncoursCtrl" to="/PageEnCoursCtrl" name="tabEnCoursCtrl">CC EnCours Ctrl <v-badge
                    color="lime" :content="storeEtape.etapes.encoursCtrl" inline></v-badge></v-tab>
            <v-tab v-if="showTabEmballage" to="/PageEmballage" name="tabEmballage">CC Emballage <v-badge color="orange"
                    :content="storeEtape.etapes.emballage" inline></v-badge></v-tab>

            <v-tab v-if="showTabEnCoursBP" to="/PageEnCoursPrepBP">BP En Prépa <v-badge color="#F57F17"
                    :content="storeEtape.etapes.encoursPrepBP" inline></v-badge></v-tab>
            <v-tab v-if="showTabAtteCtrlBP" to="/PageAtteCtrlBP">BP Attente CTRL <v-badge color="#0091EA"
                    :content="storeEtape.etapes.atteCtrlBP" inline></v-badge></v-tab>
            <v-tab v-if="showTabEnCoursCtrlBP" to="/PageEnCoursCtrlBP">BP En CTRL <v-badge color="#C51162"
                    :content="storeEtape.etapes.encoursCtrlBP" inline></v-badge></v-tab>

            <v-tab v-if="showTabPrepPartiel" to="/PagePrepPartiel">PRÉPA RÉSERVATION
                <v-badge color="#00E676"
                    :content="storeEtape.etapes.encoursPP" inline>
                </v-badge>
                </v-tab>

        </v-tabs>
        <v-spacer></v-spacer>

        <router-view />
    </v-card>
</template>
  
<style></style>
  
<script>
import { useEtapeStore } from "@/store/utils/etape.js"
import { ref, onMounted, onBeforeMount, computed, defineComponent } from 'vue';
//import { fetchdroits } from "@/composables/useDroit";
export default defineComponent({
    props: {
        storeEtape: Object,
    },
    setup() {
        const storeEtape = useEtapeStore();
        const showTabAttePrepa = ref(false);
        const showTabAtteCtrl = ref(false);
        const showTabEncousPrep = ref(false);
        const showTabEncoursCtrl = ref(false);
        const showTabEmballage = ref(false);
        const showTabEnCoursBP = ref(false);
        const showTabAtteCtrlBP = ref(false);
        const showTabEnCoursCtrlBP = ref(false);
        const showTabPrepPartiel = ref(false);
        


        // const tabs = ref(0);

        onMounted(() => {
            fetchEtaps();
            showTabAttePrepa.value = fetchdroits('PageAttePrepa');
            showTabAtteCtrl.value = fetchdroits('PageAtteCtrl');
            showTabEncousPrep.value = fetchdroits('PageEnCoursPrepa');
            showTabEncoursCtrl.value = fetchdroits('PageEnCoursCtrl');
            showTabEmballage.value = fetchdroits('PageEmballage');
            showTabEnCoursBP.value = fetchdroits('PageEnCoursPrepBP');
            showTabAtteCtrlBP.value = fetchdroits('PageAtteCtrlBP');
            showTabEnCoursCtrlBP.value = fetchdroits('PageEnCoursCtrlBP');
            showTabPrepPartiel.value = fetchdroits('PagePrepPartiel');

        });
        const fetchEtaps = async () => {
            await storeEtape.fetchEtape();
        }

        // const fetchdroits = async (nameTable) => {
        //     try {
        //         await storeDroit.fetchDroit(localStorage.getItem('username', authStore.username), nameTable);
        //         if (storeDroit.droits.write === 1) {
        //             return true;
        //         } else {
        //             return false;
        //         }
        //     } catch (error) {
        //         console.error('Erreur lors de la récupération des droits :', error);
        //         return false;
        //     }
        // };
      

        const fetchdroits = (nameTable) => {
            const lstDroit = localStorage.getItem('listeDroits');
            if (lstDroit) {
                const droits = JSON.parse(lstDroit);
                const element = droits.find((item) => item.descAcces === nameTable);
                if (element) {
                    return element.write === 1 ? true : false;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };


        return {
            storeEtape, fetchEtaps, showTabAttePrepa, showTabAtteCtrl, showTabEncousPrep, showTabEncoursCtrl, showTabEmballage, fetchdroits, showTabEnCoursBP, showTabAtteCtrlBP,
            showTabEnCoursCtrlBP,showTabPrepPartiel
        }
    }

});
</script> 