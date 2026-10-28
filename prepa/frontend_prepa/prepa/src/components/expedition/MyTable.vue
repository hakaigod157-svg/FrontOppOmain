<template>

    <!-- <div style="height: 100%; display: flex; flex-direction: column;"> -->
    <!-- Zone scrollable contenant le tableau -->
    <!-- <div style="flex: 1; overflow: auto;"> -->
    <div style="min-width: max-content;">


        <v-data-table class="blue-header" :headers="headers" :items="items" :fixed-header="true" v-if="!loading"
            :loading="loading" density="compact" hide-default-footer :etape="etape" hover="true"
            no-data-text="Pas données disponibles" :items-per-page="-1" :row-props="rowColor" height="620px">

            <template v-slot:[`item.actions`]="{ item }">
                <template v-if="showAction1">
                    <v-btn size="x-small" block variant="flat" color="#27F573" @click="action1PItem(item)"
                        style="margin-top:2px;margin-bottom:2px">
                        {{ action1 }}
                    </v-btn>
                    <v-spacer />
                </template>

                <template v-if="showAction3">
                    <v-btn variant="flat" block size="x-small" color="#FFF8E1" @click="action3PItem(item)">
                        {{ action3 }}
                    </v-btn>
                </template>

                <v-spacer />
                <v-btn variant="flat" block size="x-small" :color="color2" @click="action2PItem(item)"
                    style="margin-top:2px;margin-bottom:2px">
                    {{ action2 }}
                </v-btn>

            </template>


            <template v-slot:[`item.coms`]="{ item }">
                <b>
                    <span style="color: red;">
                        {{ item.coms }}
                    </span>
                </b>
            </template>
            <template v-slot:[`item.arriveClt`]="{ item }">
                <div class="flex justify-center items-center w-full">
                    <v-text-field v-model="item.arriveClt" type="time" density="compact" hide-details hide-no-data
                        variant="outlined" style="width: 80px" @change="onArriveChange(item)"
                        class="text-center custom-time-field" />
                </div>
            </template>

            <template v-slot:[`item.departClt`]="{ item }">
                <div class="flex justify-center items-center w-full">
                    <v-text-field v-model="item.departClt" type="time" density="compact" hide-details hide-no-data
                        variant="outlined" style="width: 80px" @change="onDepartChange(item)"
                        class="text-center custom-time-field" />
                </div>
            </template>
            <template v-slot:[`item.liv_axe`]="{ item }">
                <div style="line-height: 1.2;font-size: 0.95em; text-align:center;">
                    {{ item.liv_axe }}
                </div>
                <div style="line-height: 1.2;font-size: 0.95em; text-align:center;"
                    v-if="item[`duree`] !== 0 && item[`duree`] != null">
                    ({{ item.duree }} mn)
                </div>
            </template>
            <template v-slot:[`item.livrempli`]="{ item }">
                <div style="line-height: 1.8;font-size: 0.95em;">
                    {{ item.livrempli }}
                </div>
            </template>
            <template v-slot:[`item.liv_sortie`]="{ item }">
                <div style="line-height: 1.2; font-size: 0.95em; text-align:center;">

                    <!-- Ligne 1 : Date -->
                    <div>
                        {{ item.liv_sortie ? formatDate(item.liv_sortie) : '' }}
                    </div>

                    <!-- Ligne 2 : Heure -->
                    <div>
                        {{ item.liv_sortie ? formatTime(item.liv_sortie) : '' }}
                    </div>

                </div>
            </template>

            <template v-slot:[`item.ret_vehicule`]="{ item }">
                <div style="line-height: 1.2; font-size: 0.95em; text-align:center;">
                    <div>
                        {{ item.liv_sortie ? formatDate(item.ret_vehicule) : '' }}
                    </div>
                    <div>
                        {{ item.liv_sortie ? formatTime(item.ret_vehicule) : '' }}
                    </div>
                </div>
            </template>

            <template v-slot:[`item.sortie_sec`]="{ item }">
                <div style="line-height: 1.2; font-size: 0.95em; text-align:center;">
                    <div>
                        {{ item.sortie_sec ? formatDate(item.sortie_sec) : '' }}
                    </div>
                    <div>
                        {{ item.sortie_sec ? formatTime(item.sortie_sec) : '' }}
                    </div>
                </div>
            </template>


            <template v-slot:[`item.date`]="{ item }">
                {{ formatDate(item.date) }}
            </template>
            <template v-slot:[`item.liv_com`]="{ item, index }">
                <div class="midac-cell" :class="{ expanded: isExpanded(item, index, 'liv_com') }"
                    style="max-width: 700px; display: flex; flex-direction: column; align-items: flex-start;">
                    <!-- Ligne 1 : texte -->
                    <span v-if="!isExpanded(item, index, 'liv_com')"
                        style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%; line-height: 1.8;font-size: 0.95em;">

                        {{ truncatedText(item.liv_com) }}
                    </span>

                    <span v-else
                        style="white-space: normal; word-break: break-word; width: 100%; line-height: 1.8;font-size: 0.95em;">
                        {{ item.liv_com }}
                    </span>

                    <!-- Ligne 2 : bouton -->
                    <template v-if="shouldShowToggle(item, 'liv_com')">
                        <v-btn size="x-small" variant="text" class="mt-1 px-1 see-more-btn"
                            style="color: #1976d2; align-self: flex-start;"
                            @click.stop="toggleExpand(item, index, 'liv_com')">
                            {{ isExpanded(item, index, 'liv_com') ? 'Voir moins' : 'Voir plus' }}
                        </v-btn>
                    </template>
                </div>
            </template>


            <template v-slot:[`item.liv_voit`]="{ item }">
                <div class="text-center w-full flex flex-col items-center gap-1">
                    <div style="line-height: 1.4; font-size: 0.95em;">

                        <!-- Ligne 1 -->
                        <div>
                            {{ item.liv_voit }}
                        </div>

                        <!-- Ligne 2 -->
                        <div style="font-size: 0.85em; font-size: 0.95em;">
                            {{ item.liv_chauf }}
                            <span v-if="item.liv_livreur">
                                {{ item.liv_livreur }}
                            </span>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:[`item.saisie`]="{ item }">
                <div class="text-center w-full">
                    <template v-if="item.liv_saisie == 0 && item.ret_vehicule !== null && item.ret_vehicule !== ''">
                        <v-btn size="small" color="primary" density="comfortable" @click="onSaisir(item)"
                            style="font-size: 9px;">
                            Saisir
                        </v-btn>
                    </template>

                    <template
                        v-else-if="(item.ret_vehicule === null || item.ret_vehicule == '') && item.liv_saisie == 0">
                        <span class="text-light-blue-darken-1" style="line-height: 1.8;font-size: 0.95em;">Non
                            Retournée</span>
                    </template>

                    <template v-else>
                        <span style="line-height: 1.8;font-size: 0.95em;">{{ item.saisie }}</span>
                    </template>
                </div>
            </template>
            <template v-slot:[`item.liv_code`]="{ item }">
                <div class="text-center w-full flex flex-col items-center gap-1"
                    style="line-height: 1.8;font-size: 0.95em;">
                    <template
                        v-if="(item.liv_saisie == 0 /*|| item.xCode!=='11111'*/) && item.inc1 == 1 && item.is_sortiesec == 0">

                        <!-- Valeur liv_code -->
                        <div>{{ item.liv_code }}</div>

                        <!-- Bouton Ajout Commande -->
                        <v-btn size="small" color="secondary" density="compact" @click="onAjoutCommande(item)"
                            style="font-size: 9px;">
                            Ajout CMD
                        </v-btn>
                    </template>
                    <template v-else>
                        <template v-if="item.inc1 === 0">
                            <v-chip label color="light-green-darken-3" density="compact" variant="tonal">{{
                                item.liv_code }}</v-chip>
                        </template>
                        <template v-else>
                            <span>{{ item.liv_code }}</span>
                        </template>
                    </template>
                </div>
            </template>




            <template v-slot:[`item.m_modeliv`]="{ item }">
                <div style="line-height: 1.2; font-size: 0.95em; text-align:start;">
                    {{ item.m_modeliv }}
                </div>
            </template>

            <template v-slot:[`item.m_liv`]="{ item }">
                <span style="cursor: pointer;line-height: 1.2; font-size: 0.95em; text-align:center;"
                    v-if="item[`m_liv`] !== 0 && item[`m_liv`] != null" @click="action3PItem(item)">
                    {{ item.m_liv }}</span>
            </template>

            <template v-slot:[`item.m_ctrl`]="{ item }">
                <span style="cursor: pointer;line-height: 1.2; font-size: 0.95em; text-align:center;"
                    v-if="item[`m_ctrl`] !== 0 && item[`m_ctrl`] != null" @click="action4PItem(item)">
                    {{ item.m_ctrl }}</span>
            </template>

            <template v-slot:[`item.m_fact`]="{ item }">
                <span style="cursor: pointer;line-height: 1.2; font-size: 0.95em; text-align:center;"
                    v-if="item[`m_fact`] !== 0 && item[`m_fact`] != null" @click="action5PItem(item)">
                    {{ item.m_fact }}</span>
            </template>

            <template v-slot:[`item.m_prep`]="{ item }">
                <span style="cursor: pointer;line-height: 1.2; font-size: 0.95em; text-align:center;"
                    v-if="item[`m_prep`] !== 0 && item[`m_prep`] != null" @click="action6PItem(item)">
                    {{ item.m_prep }}</span>
            </template>

            <template v-slot:[`item.m_axe`]="{ item }">
                <span style="line-height: 1.2; font-size: 0.95em; text-align:center;">
                    {{ item.m_axe }}</span>
            </template>

            <template v-slot:header.m_liv="{ column }">
                <span>
                    {{ column.title }}
                    <br>
                    <span style="color: #D81B60; font-weight: bold;">
                        ({{ totalLiv }})
                    </span>

                </span>
            </template>

            <template v-slot:header.m_fact="{ column }">
                <span>
                    {{ column.title }}
                    <br>
                    <span style="color: #D81B60; font-weight: bold;">
                        ({{ totalFacture }})
                    </span>

                </span>
            </template>

            <template v-slot:header.m_ctrl="{ column }">
                <span>
                    {{ column.title }}
                    <br>
                    <span style="color: #D81B60; font-weight: bold;">
                        ({{ totalControle }})
                    </span>

                </span>
            </template>

            <template v-slot:header.m_prep="{ column }">
                <span>
                    {{ column.title }}
                    <br>
                    <span style="color: #D81B60; font-weight: bold;">
                        ({{ totalPreparation }})
                    </span>
                </span>
            </template>

               <template v-slot:[`item.dispo`]="{ item }">
                <div class="text-center w-full">
                    <template v-if="item.dispo == 0 && item.code !== '11111'">
                        <v-btn size="small" color="#EF5350" density="comfortable" @click="onSupprs(item)"
                            style="font-size: 9px;">
                            Supprimer
                        </v-btn>
                    </template>           

                    <template v-else>
               
                    </template>
                </div>
            </template>


        </v-data-table>
    </div>
    <!-- </div> -->
    <!-- </div> -->
    <!-- <v-card density="compact" v-if="showNbLignes">
                    <v-card>
                        <v-row>
                            <v-col>
                                <v-sheet class="pl-2 custom-grey">
                                    <b> {{ totalArticles }}</b> Lignes Trouvées
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </v-card>
        </v-card> -->
</template>
<script>
import { defineComponent } from 'vue';
import {
    VDataTableVirtual,
    VDataTable,
    VDataTableServer,
} from "vuetify/lib/components";
import { useAlerteStore } from "@/store/utils/alerte.js"
import { ref, onMounted, onBeforeMount, computed, reactive } from 'vue';
import dayjs from 'dayjs';

export default defineComponent({
    components: {
        VDataTable,
        VDataTableServer,
        VDataTableVirtual,
    },
    emits: ['action1Item', 'action2Item', 'handleCheckboxClick'],

    props: {
        headers: Object,
        items: Array,
        headerColor: {
            String,
            default: 'blue'
        },

        loading: {
            type: Boolean,
            default: false
        },
        color2: {
            type: String,
            default: "#FFF8E1"
        },
        action1: String,
        action2: String,
        action3: String,
        titre_list: String,
        itemslist: Object,
        header_text: String,
        alerte: String,
        etape: String,

        showAction1: {
            type: Boolean,
            default: false
        },

        showAction3: {
            type: Boolean,
            default: false
        },
        showNbLigne: {
            type: Boolean,
            default: true
        }
    },
    defaults: {
        VDataTable: {
            fixedHeader: true,
            noDataText: 'Pas de resultats',
        },
    },

    setup(props, { emit }) {
        // const m_date = ref(null);
        // const useformatDate = useformatDate();
        const showNbLignes = ref(props.showNbLigne);
        // showNbLignes.value = props.showNbLigne
        const storeAlert = useAlerteStore();
        const loading = ref(false);
        const alerte = ref('');
        const action1PItem = (item) => {
            emit('action1Item', item);
        };
        const action2PItem = (item) => {
            emit('action2Item', item);
        };

        const action3PItem = (item) => {
            emit('action3Item', item);
        };

        const action4PItem = (item) => {
            emit('action4Item', item);
        };

        const action5PItem = (item) => {
            emit('action5Item', item);
        };

        const action6PItem = (item) => {
            emit('action6Item', item);
        };

        const handleCheckboxClick = (item) => {
            emit('handleCheckboxClick', item);
        };
        const emitEvent = () => {
            emit('my-alert', alerte);
            emit('my-val', storeAlert.alertes.val)
        };

        const onSaisir = (item) => {
            emit('onSaisir', item)
        }
        const onAjoutCommande = (item) => {
            emit('onAjoutCommande', item)
        }
        const fetchAlerte = async () => {
            storeAlert.params.code = props.etape;
            if (props.etape) {
                await storeAlert.fetchAlerte();
                alerte.value = storeAlert.alertes.alerte;
            }
        }

        const onArriveChange = (row) => {
            emit('onArriveChange', row)
        };

        const onSupprs =(item) => {
            emit('onSupprVoitCh', item)
        }


        const onDepartChange = (row) => {
            emit('onDepartChange', row)
        };

        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY HH:mm');
            } else {
                return '';
            }

        };

        const formatDateTimeSecond = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
            } else {
                return '';
            }

        };

        const formatDate = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }

        };


        const getColor = (valeur) => {
            if (valeur.trim() == "OR") return '#ff66ff';
            else if (valeur.trim() == "ARGENT") return '#ffff00';
            else if (valeur.trim() == "BRONZE") return '#99ffff';
            else if (valeur.trim() == "FER") return '#c0c0c0';
        };
        onMounted(async () => {
            await fetchAlerte();
            emitEvent();

        })

        const formatTime = (date) => {
            if (!date) return '';
            return dayjs(date).format('HH:mm');
        };

        const totalArticles = computed(() => {
            return props.items.length;
        });

        const getUrgent = (item) => {

            if (item.prioritaire == 1 && item.province == 1 && item.duree_atte_prep >= alerte.value) {
                item.urgent = 1

            }
            if ((item.urgent + item.aprendre) == 2) {
                return '#FF0000';
            }
            else if (item.urgent == 0 && item.aprendre == 0 && item.garde == 1) {
                return '#ff9933';
            }
            else if (item.urgent == 1 && item.aprendre == 0) {
                return '#00cc00';
            }
            else if (item.urgent == 0 && item.aprendre == 1) {
                return '#0099ff';
            }

        };

        const expanded = ref([])
        const state = reactive({
            expandedMap: {},
            maxLength: 11,
        });


        // --- Voir plus / Voir moins logic ---

        // ✅ Génère une clé unique stable (priorité à l'ID si dispo)
        const keyFor = (item, index, field) => {
            if (item && item.arlib_id != null) return `id_${item.arlib_id}_${field}`;
            return `idx_${index}_${field}`;
        };

        // ✅ Vérifie si un texte est actuellement développé
        const isExpanded = (item, index, field) => {
            const key = keyFor(item, index, field);
            return !!state.expandedMap[key];
        };

        // ✅ Bascule l'état développé/réduit
        const toggleExpand = (item, index, field) => {
            const key = keyFor(item, index, field);
            state.expandedMap[key] = !state.expandedMap[key];
        };

        // ✅ Vérifie si on doit afficher "Voir plus"
        const shouldShowToggle = (item, field) => {
            const text = String(item?.[field] ?? "").trim();
            return text.length > state.maxLength;
        };

        // ✅ Tronque le texte si trop long
        const truncatedText = (text) => {
            if (!text) return "";
            const s = String(text).trim();
            return s.length > state.maxLength ? s.slice(0, state.maxLength) + "…" : s;
        };

        const totalLiv = computed(() => {
            return (props.items || []).reduce((sum, item) => {
                return sum + (Number(item.m_liv) || 0);
            }, 0);
        });

        const totalFacture = computed(() => {
            return (props.items || []).reduce((sum, item) => {
                return sum + (Number(item.m_fact) || 0);
            }, 0);
        });

        const totalControle = computed(() => {
            return (props.items || []).reduce((sum, item) => {
                return sum + (Number(item.m_ctrl) || 0);
            }, 0);
        });

        const totalPreparation = computed(() => {
            return (props.items || []).reduce((sum, item) => {
                return sum + (Number(item.m_prep) || 0);
            }, 0);
        });

        // const rowColor = computed(() => (item) => {
        //     // 🟩 Si cc2_pass_bal == 1 → ligne colorée
        //     if (item.item.liv_voit === 'RETOUR'){
        //          return { class: 'redCar-bg' };
        //     }
        //     else 
        //         if (item.item.xcode === '11111' && item.item.liv_voit != 'RETOUR')  {
        //         return { class: 'colorCar-bg' };


        //     }
        //     else {
        //         return { class: 'default' };
        //     }
        // });

        const rowColor = (props) => {
            const item = props.item;

            const isRetour =
                (item.liv_chauf && item.liv_chauf.includes('RETOUR')) ||
                (item.liv_voit && item.liv_voit.includes('RETOUR'));

            if (isRetour) {
                return { class: 'redCar-bg' };
            }

            if (item.xcode === '11111' && !isRetour) {
                return { class: 'colorCar-bg' };
            }

            return {};
        };

        return {
            action1PItem, action2PItem, action3PItem, action4PItem, action5PItem, action6PItem,
            getColor, getUrgent, fetchAlerte, emitEvent, handleCheckboxClick,
            formatDate, formatDateTime, formatDateTimeSecond,
            totalArticles, showNbLignes, truncatedText, shouldShowToggle, toggleExpand, isExpanded, keyFor, state, expanded,
            onSaisir, onAjoutCommande, formatTime, onArriveChange, onDepartChange,
            totalLiv, totalFacture, totalControle, totalPreparation,onSupprs,
            rowColor,
        };
    }

});
</script>


<style>
.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
    /* padding: 0 !important; */
    /* width: 1px !important;
    max-width: 1px !important; */
    overflow: hidden;
    white-space: nowrap;
}



/* .headerColor {
    background-color: #b6b5b6;
} */


/** Manisy barre vertical am tableau */
.v-data-table tr>td:first-child {
    /* border-left: 4px solid #969696; */
    /* border-right: 1px solid #dddddd; */
    /* border-bottom: 2px solid #dddddd; */

}

/* .v-data-table tr >td:nth-child(n+3) {
border-left: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
} */

.v-data-table tr>td:last-child {
    /* border-left: 1px solid #dddddd; */
    /* border-right: 4px solid #969696; */
    /* border-bottom: 1px solid #dddddd; */

}

.blue-header.v-data-table tr>td:first-child {
    border-left: 4px solid #969696;
}

.blue-header.v-data-table tr>td:last-child {
    border-right: 4px solid #969696;
}


/* .v-data-table tr >td:nth-child(n+3) {
    border-bottom: 1px solid #dddddd;
    background: lightgray
} */

.custom-button {
    pointer-events: none;
    /* Désactive les interactions avec le bouton */
    opacity: 1;
    /* Garde l'opacité du bouton à 100% */
    cursor: not-allowed;
    /* Curseur de souris indiquant que le bouton est désactivé */
    color: black;
    border: none;
    border-radius: 2px;
    width: 120px;

}

.custom-time-field .v-field__input {
    text-align: center !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    min-height: 28px !important;
}

.custom-time-field .v-field__outline {
    min-height: 28px !important;
}

/* .v-table > .v-table__wrapper > table > tbody > tr:nth-child(-n+2) td{
      background: #e1eed7;
    } */


/* .space_css {
    color: black;
    padding: 0 3px;
    min-width: px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    text-align: center;
    border-radius: 50%;
    display: inline-block;

} */

.custom-grey {
    background-color: #E8EAF6 !important;
}

.colorCar-bg {
    background-color: #B2DFDB !important;
}

.redCar-bg {
    background-color: red !important;
}
</style>
