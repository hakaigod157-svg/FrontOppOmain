<template>
    <v-data-table class="adv_header" :headers="headers" :fixed-header="true" v-if="!loading" :loading="loading"
        density="compact" :items="items" :items-per-page="-1" hover="true" @click:row="handleClick"
        hide-default-footer="true" :row-props="rowColorsAdv">

        <template v-slot:item.date="{ item }">
            <span>{{ formatDateTime(item.date) }}</span>
        </template>

        <template v-slot:item.date_commande_valider="{ item }">
            <span>{{ formatDateTime(item.date_commande_valider) }}</span>
        </template>

        <template v-slot:item.date_commande_traite="{ item }">
            <span>{{ formatDateTimeSecond(item.date_commande_traite) }}</span>
        </template>

        <template v-slot:item.date_valide_adv_traite="{ item }">
            <span>{{ formatDateTimeSecond(item.date_valide_adv_traite) }}</span>
        </template>

        <template v-slot:item.date_validation_adv_valider="{ item }">
            <span>{{ formatDateTimeSecond(item.date_validation_adv_valider) }}</span>
            <span style="display: flex; justify-content: center; align-items: center; width: 80%;">
                <b>({{ item.user_valid_valider }})</b>
            </span>
        </template>

        <template v-slot:['header.ttc']>
            MONTANT TTC
            <br>
            <!-- (MONTANT PAYE) -->
            <span style="color: #FF1744;">(MONTANT PAYE)</span>
        </template>


        <!-- <template v-slot:item.ttc="{ item }">
            <span>{{ formatPrice(item.ttc) }}</span>
        </template> -->


        <!-- <template v-slot:item.ttc="{ item }">
            <v-btn @click="actionTtc(item)" @mouseenter="showTooltip($event, 'TTC')" @mouseleave="hideTooltip"
                variant="text" style="padding: 0; justify-content: flex-end; min-width: 100%;">
                {{ item.ttc === 0 ? '' : formatPrice(item.ttc) }}
            </v-btn>
            <span v-if="item.montant_payer && item.montant_payer !== 0">
                <b>({{ formatPrice(item.montant_payer) }})</b>
            </span>
        </template> -->

        <template v-slot:item.ttc="{ item }">
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
                <v-btn @click="actionTtc(item)" @mouseenter="showTooltip($event, 'TTC')" @mouseleave="hideTooltip"
                    density="compact" variant="text" style="padding: 0; justify-content: flex-end; min-width: 100%;">
                    {{ item.ttc === 0 ? '' : formatPrice(item.ttc) }}
                </v-btn>
                <v-btn @click="actionreglement(item)" v-if="item.montant_payer && item.montant_payer !== 0"
                    style="margin: 0; color: #FF1744;padding: 0; justify-content: flex-end; min-width: 100%;"
                    @mouseenter="showTooltip($event, 'Montant payer')" @mouseleave="hideTooltip" density="compact"
                    variant="text">
                    <b>({{ formatPrice(item.montant_payer) }})</b>
                </v-btn>
            </div>
        </template>

        <template v-slot:item.codeclient="{ item }">
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
                <v-btn @click="actionSolde(item)" @mouseenter="showTooltip($event, 'Solde')" @mouseleave="hideTooltip"
                    density="compact" variant="text"
                    style="padding: 0; justify-content: flex-start; min-width: 100%; text-align: left;">
                    {{ item.codeclient }}
                </v-btn>
            </div>
        </template>

        <template v-slot:item.commande="{ item }">
            <span>{{ item.commande }}</span>
            <br>
            <b>( {{ item.etape }} )</b>
        </template>

        <template v-slot:item.commentaire_valider="{ item }">
            <span style="display: inline-block; width: 260px;">{{ item.commentaire_valider }}</span>
        </template>


        <template v-slot:item.condition_client_valider="{ item }">
            <p style="white-space: nowrap; display: flex; justify-content: center;">{{ (item.condition_client_valider)
            }}</p>
            <div style="display: flex; justify-content: center;">
                ({{ item.comptant_valider }})
            </div>
        </template>

        <!-- Page CommandeValider  -->

        <template v-slot:['header.plafond']>
            PLAFOND
            <br>
            (DEPASSEMENT)
        </template>

        <template v-slot:item.plafond_valider="{ item }">
            <span>
                {{ item.plafond_valider === 0 ? '' : formatPrice(item.plafond_valider) }}
            </span>
            <br>
            <span v-if="item.depassement_valider && item.depassement_valider !== 0" class="text-sm text-left"
                style="display: inline-block; margin-left: 2px;white-space: nowrap;">
                <b>({{ formatPrice(item.depassement_valider) }})</b>
            </span>
        </template>

        <template v-slot:item.nom_client_valider="{ item }">
            <div :class="{ 'fond-vert': item.bon_a_livrer_valider === 1 }">
                <v-btn variant="text" density="compact" size="small" :disabled="true" class="disabled-text-black"
                    style="padding: 0; justify-content: flex-start; width: auto;">
                    {{ item.nom_client_valider }}
                </v-btn>
                <br>
                ({{ item.etape_valider }})
            </div>

        </template>

        <template v-slot:item.solde_client_valider="{ item }">
            <span>{{ item.solde_client_valider === 0 ? '' : formatPrice(item.solde_client_valider) }}</span>

        </template>

        <template v-slot:item.facture_echue_valider="{ item }">
            <span>{{ item.facture_echue_valider === 0 ? '' : formatPrice(item.facture_echue_valider) }}</span>
        </template>

        <template v-slot:item.cmd_encours_valider="{ item }">
            <span>{{ item.cmd_encours_valider === 0 ? '' : formatPrice(item.cmd_encours_valider) }}</span>
        </template>

        <template v-slot:item.montant_cmd_valider="{ item }">
            <span>{{ formatPrice(item.montant_cmd_valider) }}</span>
        </template>

        <template v-slot:item.reglement_encours_valider="{ item }">
            <span>{{ item.reglement_encours_valider === 0 ? '' : formatPrice(item.reglement_encours_valider) }}</span>
        </template>

        <template v-slot:item.depassement_valider="{ item }">
            <span>{{ item.depassement_valider === 0 ? '' : formatPrice(item.depassement_valider) }}</span>
        </template>

        <template v-slot:item.code_valider="{ item }">
            <div :class="{ 'highlight-cell': item.garde_valider == 1 }" class="centered-text">
                {{ item.code_valider }}
                <br>
                <span v-if="item.garde_valider === 1">
                    ( GARDE )
                </span>
            </div>
        </template>

        <!-- Page CommandeValider -->

        <template v-slot:item.plafond="{ item }">
            <div>
                <span>{{ item.plafond === 0 ? '' : formatPrice(item.plafond) }}</span>
                <br>
                <span v-if="item.depassement && item.depassement !== 0" class="text-sm text-left"
                    style="display: inline-block; margin-left: 4px;white-space: nowrap; ">
                    <b>({{ formatPrice(item.depassement) }})</b>
                </span>
            </div>

        </template>


        <template v-slot:item.solde="{ item }">
            <v-btn @click="actionSolde(item)" @mouseenter="showTooltip($event, 'solde')" @mouseleave="hideTooltip"
                variant="text" density="compact" style="padding: 0; justify-content: flex-end; min-width: 100%;">
                <div
                    style="min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right;">
                    {{ item.solde === 0 ? '' : formatPrice(item.solde) }}
                </div>
            </v-btn>
        </template>


        <template v-slot:item.nomclient="{ item }">
            <v-btn v-bind="props" @click="actionClient(item)" @mouseenter="showTooltip($event, 'Règlement fait')"
                @mouseleave="hideTooltip" variant="text" density="compact" size="small"
                style="padding: 0; justify-content: flex-start; min-width: 100%;">
                {{ formatNomClient(item.nomclient) }}
            </v-btn>
        </template>




        <!-- Add procedure reglement fait -->
        <template v-slot:item.nom_client="{ item }">
            <v-btn v-bind="props" @click="actionClient(item)" @mouseenter="showTooltip($event, 'Règlement fait')"
                @mouseleave="hideTooltip" variant="text" density="compact" size="small"
                style="padding: 0; justify-content: flex-start; ">
                {{ formatNomClient(item.nom_client.trim()) }}
            </v-btn>
            <br>
            <div v-if="item.adr_liv && item.adr_liv.trim() !== ''"
                style="white-space: nowrap; display: inline; justify-content: left;">

                (<u>A livrer</u> : {{ item.adr_liv }})
            </div>
            <span style="color: #212121; font-size: 0.9em;">(<u>MOD LIV</u>: {{ item.mode_liv }})</span>
        </template>



        <template v-slot:item.code="{ item }">
            <div :class="{ 'highlight-cell': item.garde && item.garde.trim() !== '' }">
                {{ item.code }}
                <br>
                <span v-if="item.garde && item.garde.trim() !== ''">
                    <b>( {{ item.garde }} )</b>
                </span>
            </div>
        </template>



        <!-- avance -->
        <template v-slot:item.rg_encours="{ item }">
            <v-btn @click="actionAvance(item)" @mouseenter="showTooltip($event, 'Avance')" @mouseleave="hideTooltip"
                variant="text" density="compact" :disabled="item.rg_encours === 0"
                style="padding: 0; justify-content: flex-end; min-width: 100%;">

                {{ item.rg_encours === 0 ? '' : formatPrice(item.rg_encours) }}
            </v-btn>
        </template>

        <template v-slot:item.facture_echue="{ item }">
            <v-btn @click="actionEchue(item)" @mouseenter="showTooltip($event, 'Facture Échue')"
                @mouseleave="hideTooltip" variant="text" :disabled="item.facture_echue === 0"
                style="padding: 0; justify-content: flex-end; min-width: 100%;">
                {{ item.facture_echue === 0 ? '' :
                    formatPrice(item.facture_echue) }} </v-btn>
        </template>

        <template v-slot:item.code_client="{ item }">
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 50px;">
                {{ item.code_client }}
            </div>
            <div style="display: flex; justify-content: left;">
                ({{ item.com_a_valider?.toString().trim() }})
            </div>

        </template>

        <template v-slot:item.cmd="{ item }">
            <v-btn @click="actionCommande(item)" @mouseenter="showTooltip($event, 'Commande')" @mouseleave="hideTooltip"
                variant="text" style="padding: 0; justify-content: flex-end; min-width: 100%;">
                {{ item.cmd === 0 ? '' : formatPrice(item.cmd) }}
            </v-btn>
        </template>

        <template v-slot:item.cmd_encours="{ item }">

            <v-btn @click="actionCmdEncours(item)" @mouseenter="showTooltip($event, 'Commande encours')"
                @mouseleave="hideTooltip" variant="text" :disabled="item.cmd_encours === 0"
                style="padding: 0; justify-content: flex-end; min-width: 100%;">
                {{ item.cmd_encours === 0 ? '' : formatPrice(item.cmd_encours) }}
            </v-btn>
        </template>

        <template v-slot:item.condition="{ item }">
            <p style="white-space: nowrap; display: flex; justify-content: center;">{{ (item.condition) }}</p>
            <div style="display: flex; justify-content: center;">
                ({{ item.comptant }})
            </div>
        </template>

        <template v-slot:item.validation_auto="{ item }">
            <p style="display: flex; justify-content: center;">{{ item.validation_auto }}</p>
            <div v-if="item.user_bloque && item.user_bloque.trim() !== ''"
                style="display: flex; justify-content: center;">
                <b>({{ item.user_bloque }})</b>
            </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <v-btn size="x-small" color="#FFB74D" @click="actionValiderBon(item)"
                style="margin-top:2px;margin-bottom:2px">
                {{ action_valider }}
            </v-btn>
            <br />
            <v-btn v-if="!item.montant_payer" size="x-small" color="#D50000" @click="action1PItem(item)">
                {{ action_annuler }}
            </v-btn>
        </template>

        <template v-slot:[`item.action`]="{ item }">
            <!-- Afficher le commentaire si item.commentaire existe -->
            <template v-if="item.commentaire">
                <p>{{ item.commentaire }}</p>
            </template>
            <!-- Afficher {{ valider }} si item.bloque === 1 ou item.bloque === 2 -->
            <template v-if="item.bloque === 1 || item.bloque === 2">
                <v-btn size="x-small" color="#69F0AE" @click="action1PItem(item)"
                    style="margin-top:9px;margin-bottom:1px">
                    {{ action1 }}
                </v-btn>
            </template>
            <br>
            <!-- Afficher {{ bloquer }} uniquement si item.bloque === 1 -->
            <template v-if="item.bloque === 1">
                <v-btn size="x-small" color="#BBDEFB" @click="action2PItem(item)"
                    style="margin-top:2px;margin-bottom:7px">
                    {{ action2 }}
                </v-btn>

            </template>

            <!-- Cacher les deux boutons si item.bloque === 0 -->
            <template v-if="item.bloque === 0">
                <!-- Aucun bouton affiché -->
            </template>

            <v-spacer />
        </template>


        <template v-slot:[`item.action_cmd_valider`]="{ item }">
            <template v-if="item.bon_a_livrer_valider === 1">
                <v-btn size="x-small" color="#FFB74D" @click="actionValiderBon(item)"
                    style="margin-top:2px;margin-bottom:2px">
                    {{ action_valider }}
                </v-btn>
            </template>
        </template>


        <template v-slot:[`item.action_traite`]="{ item }">
            <v-btn size="x-small" color="#80DEEA" @click="actionTraite(item)" style="margin-top:9px;margin-bottom:1px">
                {{ action_traite }}
            </v-btn>
        </template>


        <template v-slot:[`item.action1`]="{ item }">
            <template v-if="showAction3">
                <v-btn size="x-small" color="#E8F5E9" @click="action3PItem(item)">
                    {{ action3 }}
                </v-btn>
            </template>

            <v-spacer />

            <template v-if="showAction4">
                <v-btn size="x-small" color="#FFF8E1" @click="action4PItem(item)">
                    {{ action4 }}
                </v-btn>
            </template>
        </template>

        <template v-slot:[`item.commentaire_client`]="{ item }">
            <div style="white-space: pre-wrap; /* permet les retours à la ligne */ 
                word-wrap: break-word; 
                padding: 4px; 
                border-radius: 4px;
                max-width: 350px;
                line-height: 1.3;"> <!-- réduit l'interligne -->
                {{ item.commentaire_client }}
            </div>
        </template>

                <template v-slot:[`item.commentaires`]="{ item }">
            <div style="white-space: pre-wrap; /* permet les retours à la ligne */ 
                word-wrap: break-word; 
                padding: 4px; 
                border-radius: 4px;
                max-width: 350px;
                line-height: 1.2;"> <!-- réduit l'interligne -->
                {{ item.commentaires }}
            </div>
        </template>
    </v-data-table>
</template>

<script>
import { defineComponent, ref, computed, onUnmounted } from 'vue';
import { VDataTable } from "vuetify/lib/components";
import dayjs from 'dayjs';


export default defineComponent({
    components: {
        VDataTable,
    },

    props: {
        headers: Object,
        items: Object,
        action1: String,
        action2: String,
        action3: String,
        action4: String,
        action_annuler: String,
        action_valider: String,
        action_traite: String,
        action_cmd_valider_bon: String,

        loading: {
            type: Boolean,
            default: false
        },

        showAction1: {
            type: Boolean,
            default: false
        },

        showAction2: {
            type: Boolean,
            default: false
        },

        showAction3: {
            type: Boolean,
            default: false
        },

        showAction4: {
            type: Boolean,
            default: false
        }
    },

    setup(props, { emit }) {
        const action1PItem = (item) => {
            emit('action1Item', item);
        };

        const action2PItem = (item) => {
            emit('action2Item', item);
        };

        const actionSolde = (item) => {
            emit('actionSolde', item);
        };

        const actionAvance = (item) => {
            emit('actionAvance', item);
        };

        const actionEchue = (item) => {
            emit('actionEchue', item);
        };

        const actionCmdEncours = (item) => {
            emit('actionCmdEncours', item);
        };

        const actionClient = (item) => {
            emit('actionClient', item);
        };

        const actionCommande = (item) => {
            emit('actionCommande', item);
        };

        const actionValiderBon = (item) => {
            emit('actionValiderBon', item);
        };

        const actionTtc = (item) => {
            emit('actionTtc', item);
        };

        const actionreglement = (item) => {
            emit('actionreglement', item);
        };

        const actionTraite = (item) => {
            emit('action_traite', item);
        };

        const loading = ref(false);

        const handleClick = (item) => {
            highlightClickedRow(item);
        };

        const highlightClickedRow = (item) => {
            const rowElement = document.querySelector(`[data-item-id="${item.id}"]`);
            if (rowElement) {
                rowElement.classList.add('highlight');
            }
        };

        const formatDateTime = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
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

        const formatPrice = (price) => {
            if (price == null || isNaN(price)) {
                return "";
            }
            let [integerPart, decimalPart] = price.toString().split('.');
            // Formatage de la partie entière avec un espace comme séparateur de millier
            let formattedInteger = integerPart
                .split('')
                .reverse()
                .map((digit, index) => (index > 0 && index % 3 === 0 ? digit + ' ' : digit))
                .reverse()
                .join('');
            // Ajouter la partie décimale si elle existe
            return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
        };

        const rowColorsAdv = computed(() => (item) => {
            if (item.item.couleur == 4) {
                return { class: 'couleur_plafond_depasse_retard_de_paiement' };
            } else

                if (item.item.couleur == 3) {
                    return { class: 'couleur_retard_impaye' };
                } else

                    if (item.item.couleur == 2) {
                        return { class: 'couleur_plafond_depasse' };
                    } else

                        if (item.item.couleur == 1) {
                            return { class: 'couleur_aucomptant' };
                        }

                        else

                            if (item.item.etape_valider == "Attente Prep") {
                                return { class: 'couleur_Attente_Prep' };
                            }

                            else
                                if (item.item.etape_valider == "Attente Ctrl") {
                                    return { class: 'couleur_Attente_Ctrl' };
                                }

                                else
                                    if (item.item.etape_valider == "En cours Ctrl") {
                                        return { class: 'couleur_Encours_Ctrl' };
                                    }
                                    else
                                        if (item.item.etape_valider == "En cours Prep") {
                                            return { class: 'couleur_Encours_Prep' };
                                        }

                                        else {

                                        }
        });

        const tooltip = ref();

        // Fonction pour afficher l'info-bulle
        const showTooltip = (event, message) => {
            if (tooltip.value) {
                hideTooltip();
            }

            const div = document.createElement('div');
            div.id = 'tooltip';
            div.innerText = message;
            div.style.position = 'absolute';
            div.style.backgroundColor = '#333';
            div.style.color = '#fff';
            div.style.padding = '5px 10px';
            div.style.borderRadius = '4px';
            div.style.fontSize = '12px';
            div.style.pointerEvents = 'none';
            div.style.top = `${event.clientY + 10}px`;
            div.style.left = `${event.clientX + 10}px`;
            div.style.zIndex = '1000';

            document.body.appendChild(div);
            tooltip.value = div;
        };

        const hideTooltip = () => {
            if (tooltip.value) {
                tooltip.value.remove();
                tooltip.value = null;
            }
        };

        onUnmounted(() => {
            hideTooltip();
        });

        const formatNomClient = (nom) => {
            return nom ? nom.replace(/\s*->\(\s*\)\s*$/, '') : '';
        };


        return {
            formatDateTime,
            action1PItem, action2PItem, actionSolde, actionEchue, actionCmdEncours, actionAvance, actionClient, actionCommande, actionValiderBon, actionTtc, actionreglement,
            actionTraite,
            loading,
            handleClick,
            highlightClickedRow, formatPrice,
            rowColorsAdv,
            showTooltip, hideTooltip,
            formatDateTimeSecond, formatNomClient,

        };
    }
});
</script>

<style>
.v-data-table.adv_header .v-table__wrapper>table>thead>tr th,
.v-data-table.adv_header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
}

.highlight {
    background-color: red;
    /* Couleur de surbrillance */
}

.couleur_plafond_depasse_retard_de_paiement {
    background-color: #EF5350;
}

/* .couleur_Attente_Prep {
    background-color: #E53935;
}
.couleur_Attente_Ctrl {
    background-color: #5C6BC0;
}
.couleur_Encours_Ctrl {
    background-color: #FF9933;
}
.couleur_Encours_Prep {
    background-color: #43A047;
} */

.couleur_retard_impaye {
    background-color: #FFCC99;
}

.couleur_plafond_depasse {
    background-color: #FF99CC;
}

.couleur_aucomptant {
    background-color: #00BB00;
}

.highlight-cell {
    color: green;
    font-weight: 900;
    font-size: 0.8rem;
    white-space: nowrap;
}

.disabled-text-black.v-btn--disabled {
    color: black !important;
    /* Force le texte à être noir */
    opacity: 1 !important;
    /* Annule la transparence par défaut */
    pointer-events: none;
    /* Conserve l'état désactivé */
}

.centered-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    /* Assurez-vous que le conteneur occupe tout l'espace nécessaire */
}

.fond-vert {
    background-color: #d4edda;
    padding: 4px;
    border-radius: 4px;
}

.v-data-table.adv_header .v-table__wrapper table tbody td {
    line-height: 2;
    /* Augmente l'espacement entre les lignes */
}
</style>