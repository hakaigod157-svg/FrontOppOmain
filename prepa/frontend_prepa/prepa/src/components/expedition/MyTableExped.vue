<template>
    <v-data-table class="header_exped" :headers="headers" :items="items" density="compact"
        no-data-text="Pas de données disponibles" :fixed-header="true" :items-per-page="-1" hide-default-footer
        item-value="seq" select-strategy="single" :row-props="rowColor" :item-class="getRowClass">

        <template v-slot:item.trans_montant="{ item }">
            <span>
                {{ item.trans_montant === 0 ? '' : formatPrice(item.trans_montant) }}
            </span>
        </template>

        <template v-slot:item.trans_date_fact="{ item }">
            <span>{{ formatDate(item.trans_date_fact) }}</span>
        </template>

        <template v-slot:item.date_commande="{ item }">
            <span>{{ formatDate(item.date_commande) }}</span>
        </template>

        <template v-slot:item.dateliv_prevu="{ item }">
            <span>{{ formatDateTimeAdv(item.dateliv_prevu) }}</span>
        </template>


        <template v-slot:item.livraison_ind="{ item }">
            <span>{{ formatDateTimeAdv(item.livraison_ind) }}</span>
        </template>

        <template v-slot:item.livraison_prevu_marge="{ item }">
            <span>{{ formatDateTimeAdv(item.livraison_prevu_marge) }}</span>
        </template>

        <template v-slot:item.sortie_securite="{ item }">
            <span>{{ formatDateTimeAdv(item.sortie_securite) }}</span>
        </template>






        <template v-slot:item.date_a_livrer="{ item }">
            <span>{{ formatDate(item.date_a_livrer) }}</span>
        </template>

        <template v-slot:item.nb_lv="{ item }">
            <v-btn @click="edit(item)" style="margin: 0; padding: 0; min-width: 100%;"
                @mouseenter="showTooltip($event, 'Nombre Livraison')" @mouseleave="hideTooltip" density="compact"
                variant="text">
                <b>{{ (item.nb_lv) }}</b>
            </v-btn>
        </template>

        <template v-slot:item.nb_cmd="{ item }">
            <v-btn @click="detail_nb_cmd(item)" style="margin: 0; padding: 0; min-width: 100%;"
                @mouseenter="showTooltip($event, 'Nombre de commande')" @mouseleave="hideTooltip" density="compact"
                variant="text">
                <b>{{ (item.nb_cmd) }}</b>
            </v-btn>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <template v-if="item.trans_valide === 1">
            </template>

            <template v-else>
                <v-btn size="x-small" color="#CCFF90" class="action-button" @click.stop="actionValider(item)"
                    style="margin-top:5px;margin-bottom:5px">
                    {{ valider }}
                </v-btn>
            </template>

        </template>



        <template v-slot:[`item.centre`]="{ item }">
            <span v-if="item.centre > 0" class="red-bg-soft-liv" style="cursor: pointer;"
                @click="onDetail(item, 'centre')">{{ item.centre }}</span>
            <span v-else>{{ item.centre }}</span>
            <br>
            <span v-if="item.centre_colis > 0" class="red-bg-soft-colis" style="cursor: pointer;"
                @click="onDetail(item, 'centre')">{{ item.centre_colis }} colis</span>
            <span v-else class="colis-placeholder">&nbsp;</span>
        </template>

        <template v-slot:[`item.tourne_1`]="{ item }">
            <div class="text-start">
                <div v-if="item.tourne_1_duree !== 0">
                    <span><b>{{ item.tourne_1 }}</b></span>
                    <br>
                    <b>({{ item.tourne_1_duree }} mn )</b>
                </div>
            </div>
        </template>

        <template v-slot:[`item.tourne_2`]="{ item }">
            <div v-if="item.tourne_2_duree !== 0">
                <span><b>{{ item.tourne_2 }}</b></span>
                <br>
                <b>({{ item.tourne_2_duree }} mn )</b>
            </div>
        </template>

        <template v-slot:[`item.tourne_3`]="{ item }">
            <div v-if="item.tourne_3_duree !== 0">
                <span><b>{{ item.tourne_3 }}</b></span>
                <br>
                <b>({{ item.tourne_3_duree }} mn)</b>
            </div>
        </template>

        <!-- Nouveau données -->

        <template v-slot:[`item.vague`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <div class="vague-container">
                    <span class="vague-top">
                        {{ item.vague }}
                    </span>

                    <span v-if="item.heure && formatHeure(item.heure) !== '00:00'" class="vague-bottom">
                        ( {{ formatHeure(item.heure) }} )
                    </span>
                    <span v-else>&nbsp;</span>
                </div>
            </div>
        </template>

        <template v-slot:[`item.vague_ind`]="{ item }">
            <div :class="{ 'cell-red-bg1': item.vague_ind === 'TOTAL' }">
                <div class="vague-containerInd">
                    <span class="vague-topInd">
                        {{ item.vague_ind }}
                    </span>

                    <span v-if="item.heure_ind && formatHeure(item.heure_ind) !== '00:00'" class="vague-bottomInd">
                        ( {{ formatHeure(item.heure_ind) }} )
                    </span>

                </div>
            </div>
        </template>


        <template v-slot:[`item.sans_axe_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <!-- CDE -->
                <span v-if="item.sans_axe_cde > 0" :class="{
                    'green-bg-soft-liv': item.sans_axe_couleur == 1,
                    'red-bg-liv-demi': item.sans_axe_couleur == 2,
                    'red-bg-soft-liv': item.sans_axe_couleur == 3,
                    'blue-bg-soft-liv': item.sans_axe_couleur == 4,
                    'multi-bg-soft-liv': item.sans_axe_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'sans_axe_cde')">
                    {{ item.sans_axe_cde }}
                </span>
                <!-- rien si 0 -->
                <span v-else>
                    &nbsp;
                </span>
                <br>
                <!-- COLIS -->
                <span v-if="item.sans_axe_colis > 0" :class="{
                    'green-bg-soft-colis': item.sans_axe_couleur == 1,
                    'red-bg-soft-demi': item.sans_axe_couleur == 2,
                    'red-bg-soft-colis': item.sans_axe_couleur == 3,
                    'blue-bg-soft-colis': item.sans_axe_couleur == 4,
                    'multi-bg-soft-colis': item.sans_axe_couleur == 5,


                }" style="cursor: pointer; " @click="onDetail(item, 'sans_axe_cde')">

                    {{ item.sans_axe_colis }} colis
                </span>
                <!-- rien si 0 -->
                <span v-else class="colis-placeholder">
                    &nbsp;
                </span>
            </div>
        </template>



        <!-- Gestion d'espacement -->
        <template v-slot:[`item.total_cde_ind`]="{ item }">
            <div :class="{ 'cell-red-bg1': item.vague_ind === 'TOTAL' }">
                <div v-if="item.total_cde_ind !== 0"
                    style="line-height: 44px; text-align: center; font-size: 13px; cursor: pointer;"
                    @click="onDetail_ind(item, 'total_cde_ind')">
                    <b>{{ item.total_cde_ind }}</b>
                </div>
            </div>
        </template>

        <template v-slot:[`item.prepa`]="{ item }">
            <div :class="{ 'cell-red-bg1': item.vague_ind === 'TOTAL' }">
                <div v-if="item.prepa !== 0"
                    style="line-height: 44px; text-align: center; font-size: 13px;cursor: pointer;"
                    @click="onDetail_ind(item, 'prepa')">
                    <b>{{ item.prepa }}</b>
                </div>
            </div>
        </template>

        <template v-slot:[`item.ctrl`]="{ item }">
            <div :class="{ 'cell-red-bg1': item.vague_ind === 'TOTAL' }">
                <div v-if="item.ctrl !== 0"
                    style="line-height: 44px; text-align: center; font-size: 13px;cursor: pointer;"
                    @click="onDetail_ind(item, 'ctrl')">
                    <b>{{ item.ctrl }}</b>
                </div>
            </div>
        </template>

        <template v-slot:[`item.facture`]="{ item }">
            <div :class="{ 'cell-red-bg1': item.vague_ind === 'TOTAL' }">
                <div v-if="item.facture !== 0"
                    style="line-height: 44px; text-align: center; font-size: 13px;cursor: pointer;"
                    @click="onDetail_ind(item, 'facture')">
                    <b>{{ item.facture }}</b>
                </div>
            </div>
        </template>

        <template v-slot:[`item.livraison`]="{ item }">
            <div :class="{ 'cell-red-bg1': item.vague_ind === 'TOTAL' }">
                <div v-if="item.livraison !== 0"
                    style="line-height: 44px; text-align: center; font-size: 13px;cursor: pointer;"
                    @click="onDetail_ind(item, 'livraison')">
                    <b>{{ item.livraison }}</b>
                </div>
            </div>
        </template>

        <template v-slot:[`item.livre`]="{ item }">
            <div v-if="item.livre !== 0" :class="{ 'cell-red-bg': item.vague_ind === 'TOTAL' }" style="cursor: pointer;"
                @click="onDetail_ind(item, 'livre')">
                <span class="circle-value" :class="item.coul_livre === 1 ? 'circle-green' : 'circle-red'">
                    {{ item.livre }}
                </span>
                <br>
                <span v-if="item.percent_livre" :class="item.coul_livre === 1 ? 'green-bg-ind' : 'red-bg-ind'">
                    ( {{ item.percent_livre }}%)
                </span>
                <span v-else>&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.livraison_hier`]="{ item }">
            <div v-if="item.livraison_hier !== 0" :class="{ 'cell-red-bg': item.vague_ind === 'TOTAL' }" style="cursor: pointer;"
                @click="onDetail_ind(item, 'livraison_hier')">
                <!-- <span class="circle-value" :class="item.coul_livre === 1 ? 'circle-green' : 'circle-red'"> -->
                    <b>{{ item.livraison_hier }}</b>
                <!-- </span> -->
                <br>
                <!-- <span v-if="item.percent_livre" :class="item.coul_livre === 1 ? 'green-bg-ind' : 'red-bg-ind'"> -->
                    <b>({{ item.percent_liv_hier }}%)</b>
                <!-- </span> -->
                <!-- <span v-else>&nbsp;</span> -->
            </div>
        </template>


        <template v-slot:[`item.livraison_ok`]="{ item }">
            <div v-if="item.livre !== 0" :class="{ 'cell-red-bg': item.vague_ind === 'TOTAL' }" style="cursor: pointer;"
                @click="onDetail_ind(item, 'livraison_ok')">

                <span class="circle-value" :class="item.coul_livraison_ok === 1 ? 'circle-green' : 'circle-red'">
                    {{ item.livraison_ok }}
                </span>
                <br>
                <span v-if="item.percent_livre" :class="item.coul_livraison_ok === 1 ? 'green-bg-ind' : 'red-bg-ind'">
                    ( {{ item.percent_ok }}%)
                </span>

                <span v-else>&nbsp;</span>
            </div>
        </template>

        <!--  -->

        <template v-slot:[`item.anosy_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <span v-if="item.anosy_cde > 0" :class="{
                    'green-bg-soft-liv': item.anosy_couleur == 1,
                    'red-bg-liv-demi': item.anosy_couleur == 2,
                    'red-bg-soft-liv': item.anosy_couleur == 3,
                    'blue-bg-soft-liv': item.anosy_couleur == 4,
                    'multi-bg-soft-liv': item.anosy_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'anosy_cde')">{{ item.anosy_cde
                    }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.anosy_cde > 0" :class="{
                    'green-bg-soft-colis': item.anosy_couleur == 1,
                    'red-bg-soft-demi': item.anosy_couleur == 2,
                    'red-bg-soft-colis': item.anosy_couleur == 3,
                    'blue-bg-soft-colis': item.anosy_couleur == 4,
                    'multi-bg-soft-colis': item.anosy_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'anosy_cde')">{{ item.anosy_colis }} colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.centre_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">

                <span v-if="item.centre_cde > 0" :class="{
                    'green-bg-soft-liv': item.centre_couleur == 1,
                    'red-bg-liv-demi': item.centre_couleur == 2,
                    'red-bg-soft-liv': item.centre_couleur == 3,
                    'blue-bg-soft-liv': item.centre_couleur == 4,
                    'multi-bg-soft-liv': item.centre_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'centre_cde')">{{ item.centre_cde
                    }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.centre_cde > 0" :class="{
                    'green-bg-soft-colis': item.centre_couleur == 1,
                    'red-bg-soft-demi': item.centre_couleur == 2,
                    'red-bg-soft-colis': item.centre_couleur == 3,
                    'blue-bg-soft-colis': item.centre_couleur == 4,
                    'multi-bg-soft-colis': item.centre_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'centre_cde')">{{ item.centre_colis }} colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.est_meteo_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <span v-if="item.est_meteo_cde > 0" :class="{
                    'green-bg-soft-liv': item.est_meteo_couleur == 1,
                    'red-bg-liv-demi': item.est_meteo_couleur == 2,
                    'red-bg-soft-liv': item.est_meteo_couleur == 3,
                    'blue-bg-soft-liv': item.est_meteo_couleur == 4,
                    'multi-bg-soft-liv': item.est_meteo_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'est_meteo_cde')">{{
                    item.est_meteo_cde }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.est_meteo_cde > 0" :class="{
                    'green-bg-soft-colis': item.est_meteo_couleur == 1,
                    'red-bg-soft-demi': item.est_meteo_couleur == 2,
                    'red-bg-soft-colis': item.est_meteo_couleur == 3,
                    'blue-bg-soft-colis': item.est_meteo_couleur == 4,
                    'multi-bg-soft-colis': item.est_meteo_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'est_meteo_cde')">{{ item.est_meteo_colis }}
                    colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.est_rn2_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <span v-if="item.est_rn2_cde > 0" :class="{
                    'green-bg-soft-liv': item.est_rn2_couleur == 1,
                    'red-bg-liv-demi': item.est_rn2_couleur == 2,
                    'red-bg-soft-liv': item.est_rn2_couleur == 3,
                    'blue-bg-soft-liv': item.est_rn2_couleur == 4,
                    'multi-bg-soft-liv': item.est_rn2_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'est_rn2_cde')">{{ item.est_rn2_cde
                    }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.est_rn2_cde > 0" :class="{
                    'green-bg-soft-colis': item.est_rn2_couleur == 1,
                    'red-bg-soft-demi': item.est_rn2_couleur == 2,
                    'red-bg-soft-colis': item.est_rn2_couleur == 3,
                    'blue-bg-soft-colis': item.est_rn2_couleur == 4,
                    'multi-bg-soft-colis': item.est_rn2_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'est_rn2_cde')">{{ item.est_rn2_colis }}
                    colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.itaosy_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <span v-if="item.itaosy_cde > 0" :class="{
                    'green-bg-soft-liv': item.itaosy_couleur == 1,
                    'red-bg-liv-demi': item.itaosy_couleur == 2,
                    'red-bg-soft-liv': item.itaosy_couleur == 3,
                    'blue-bg-soft-liv': item.itaosy_couleur == 4,
                    'multi-bg-soft-liv': item.itaosy_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'itaosy_cde')">{{ item.itaosy_cde
                    }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.itaosy_cde > 0" :class="{
                    'green-bg-soft-colis': item.itaosy_couleur == 1,
                    'red-bg-soft-demi': item.itaosy_couleur == 2,
                    'red-bg-soft-colis': item.itaosy_couleur == 3,
                    'blue-bg-soft-colis': item.itaosy_couleur == 4,
                    'multi-bg-soft-colis': item.itaosy_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'itaosy_cde')">{{ item.itaosy_colis }} colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.itaosy_rn1_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">

                <span v-if="item.itaosy_rn1_cde > 0" :class="{
                    'green-bg-soft-liv': item.itaosy_rn1_couleur == 1,
                    'red-bg-liv-demi': item.itaosy_rn1_couleur == 2,
                    'red-bg-soft-liv': item.itaosy_rn1_couleur == 3,
                    'blue-bg-soft-liv': item.itaosy_rn1_couleur == 4,
                    'multi-bg-soft-liv': item.itaosy_rn1_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'itaosy_rn1_cde')">{{
                    item.itaosy_rn1_cde }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.itaosy_rn1_cde > 0" :class="{
                    'green-bg-soft-colis': item.itaosy_rn1_couleur == 1,
                    'red-bg-soft-demi': item.itaosy_rn1_couleur == 2,
                    'red-bg-soft-colis': item.itaosy_rn1_couleur == 3,
                    'blue-bg-soft-colis': item.itaosy_rn1_couleur == 4,
                    'multi-bg-soft-colis': item.itaosy_rn1_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'itaosy_rn1_cde')">{{ item.itaosy_rn1_colis }}
                    colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.ivato_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <span v-if="item.ivato_cde > 0" :class="{
                    'green-bg-soft-liv': item.ivato_couleur == 1,
                    'red-bg-liv-demi': item.ivato_couleur == 2,
                    'red-bg-soft-liv': item.ivato_couleur == 3,
                    'blue-bg-soft-liv': item.ivato_couleur == 4,
                    'multi-bg-soft-liv': item.ivato_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'ivato_cde')">{{ item.ivato_cde
                    }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.ivato_cde > 0" :class="{
                    'green-bg-soft-colis': item.ivato_couleur == 1,
                    'red-bg-soft-demi': item.ivato_couleur == 2,
                    'red-bg-soft-colis': item.ivato_couleur == 3,
                    'blue-bg-soft-colis': item.ivato_couleur == 4,
                    'multi-bg-soft-colis': item.ivato_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'ivato_cde')">{{ item.ivato_colis }} colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.mahitsy_rn4_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <span v-if="item.mahitsy_rn4_cde > 0" :class="{
                    'green-bg-soft-liv': item.mahitsy_rn4_couleur == 1,
                    'red-bg-liv-demi': item.mahitsy_rn4_couleur == 2,
                    'red-bg-soft-liv': item.mahitsy_rn4_couleur == 3,
                    'blue-bg-soft-liv': item.mahitsy_rn4_couleur == 4,
                    'multi-bg-soft-liv': item.mahitsy_rn4_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'mahitsy_rn4_cde')">{{
                    item.mahitsy_rn4_cde
                    }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.mahitsy_rn4_cde > 0" :class="{
                    'green-bg-soft-colis': item.mahitsy_rn4_couleur == 1,
                    'red-bg-soft-demi': item.mahitsy_rn4_couleur == 2,
                    'red-bg-soft-colis': item.mahitsy_rn4_couleur == 3,
                    'blue-bg-soft-colis': item.mahitsy_rn4_couleur == 4,
                    'multi-bg-soft-colis': item.mahitsy_rn4_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'mahitsy_rn4_cde')">{{ item.mahitsy_rn4_colis }}
                    colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.nord_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <span v-if="item.nord_cde > 0" :class="{
                    'green-bg-soft-liv': item.nord_couleur == 1,
                    'red-bg-liv-demi': item.nord_couleur == 2,
                    'red-bg-soft-liv': item.nord_couleur == 3,
                    'blue-bg-soft-liv': item.nord_couleur == 4,
                    'multi-bg-soft-liv': item.nord_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'nord_cde')">{{ item.nord_cde
                    }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.nord_cde > 0" :class="{
                    'green-bg-soft-colis': item.nord_couleur == 1,
                    'red-bg-soft-demi': item.nord_couleur == 2,
                    'red-bg-soft-colis': item.nord_couleur == 3,
                    'blue-bg-soft-colis': item.nord_couleur == 4,
                    'multi-bg-soft-colis': item.nord_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'nord_cde')">{{ item.nord_colis }} colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.sixsept_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <span v-if="item.sixsept_cde > 0" :class="{
                    'green-bg-soft-liv': item.sixsept_couleur == 1,
                    'red-bg-liv-demi': item.sixsept_couleur == 2,
                    'red-bg-soft-liv': item.sixsept_couleur == 3,
                    'blue-bg-soft-liv': item.sixsept_couleur == 4,
                    'multi-bg-soft-liv': item.sixsept_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'sixsept_cde')">{{ item.sixsept_cde
                    }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.sixsept_cde > 0" :class="{
                    'green-bg-soft-colis': item.sixsept_couleur == 1,
                    'red-bg-soft-demi': item.sixsept_couleur == 2,
                    'red-bg-soft-colis': item.sixsept_couleur == 3,
                    'blue-bg-soft-colis': item.sixsept_couleur == 4,
                    'multi-bg-soft-colis': item.sixsept_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'sixsept_cde')">{{ item.sixsept_colis }}
                    colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.sud_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <span v-if="item.sud_cde > 0" :class="{
                    'green-bg-soft-liv': item.sud_couleur == 1,
                    'red-bg-liv-demi': item.sud_couleur == 2,
                    'red-bg-soft-liv': item.sud_couleur == 3,
                    'blue-bg-soft-liv': item.sud_couleur == 4,
                    'multi-bg-soft-liv': item.sud_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'sud_cde')">{{ item.sud_cde
                    }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.sud_cde > 0" :class="{
                    'green-bg-soft-colis': item.sud_couleur == 1,
                    'red-bg-soft-demi': item.sud_couleur == 2,
                    'red-bg-soft-colis': item.sud_couleur == 3,
                    'blue-bg-soft-colis': item.sud_couleur == 4,
                    'multi-bg-soft-colis': item.sud_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'sud_cde')">{{ item.sud_colis }} colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.sud_est_cde`]="{ item }">
            <div :class="{ 'cell-red-bg': item.vague === 'TOTAL' }">
                <span v-if="item.sud_est_cde > 0" :class="{
                    'green-bg-soft-liv': item.sud_est_couleur == 1,
                    'red-bg-liv-demi': item.sud_est_couleur == 2,
                    'red-bg-soft-liv': item.sud_est_couleur == 3,
                    'blue-bg-soft-liv': item.sud_est_couleur == 4,
                    'multi-bg-soft-liv': item.sud_est_couleur == 5,
                }" style="cursor: pointer;font-size: 13px;" @click="onDetail(item, 'sud_est_cde')">{{ item.sud_est_cde
                    }}</span>
                <span v-else>&nbsp;</span>
                <br>
                <span v-if="item.sud_est_cde > 0" :class="{
                    'green-bg-soft-colis': item.sud_est_couleur == 1,
                    'red-bg-soft-demi': item.sud_est_couleur == 2,
                    'red-bg-soft-colis': item.sud_est_couleur == 3,
                    'blue-bg-soft-colis': item.sud_est_couleur == 4,
                    'multi-bg-soft-colis': item.sud_est_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'sud_est_cde')">{{ item.sud_est_colis }}
                    colis</span>
                <span v-else class="colis-placeholder">&nbsp;</span>
            </div>
        </template>

        <template v-slot:[`item.total_cde`]="{ item }">

            <div class="cell-red-bg">

                <!-- CDE -->
                <span v-if="item.total_cde > 0" :class="{
                    'green-bg-soft-liv': item.total_couleur == 1,
                    'red-bg-liv-demi': item.total_couleur == 2,
                    'red-bg-soft-liv': item.total_couleur == 3,
                    'blue-bg-soft-liv': item.total_couleur == 4,
                    'multi-bg-soft-liv': item.total_couleur == 5,
                }" style="cursor: pointer; font-size: 13px;" @click="onDetail(item, 'total_cde')">
                    {{ item.total_cde }}
                </span>
                <span v-else>&nbsp;</span>

                <br>

                <!-- COLIS -->
                <span v-if="item.total_cde > 0" :class="{
                    'green-bg-soft-colis': item.total_couleur == 1,
                    'red-bg-soft-demi': item.total_couleur == 2,
                    'red-bg-soft-colis': item.total_couleur == 3,
                    'blue-bg-soft-colis': item.total_couleur == 4,
                    'multi-bg-soft-colis': item.total_couleur == 5,
                }" style="cursor: pointer;" @click="onDetail(item, 'total_cde')">
                    {{ item.total_colis }} colis
                </span>
                <span v-else>&nbsp;</span>

            </div>

        </template>

        <!--  -->


        <template v-slot:[`item.est`]="{ item }">
            <span v-if="item.est > 0" class="red-bg-soft-liv" style="cursor: pointer;" @click="onDetail(item, 'est')">{{
                item.est }}</span>
            <span v-else>{{ item.est }}</span>
            <br>
            <span v-if="item.est_colis > 0" class="red-bg-soft-colis" style="cursor: pointer;"
                @click="onDetail(item, 'est')">{{ item.est_colis }}
                colis</span>
            <span v-else class="colis-placeholder">&nbsp;</span>
        </template>

        <template v-slot:[`item.itaosy`]="{ item }">
            <span v-if="item.itaosy > 0" class="red-bg-soft-liv" style="cursor: pointer;"
                @click="onDetail(item, 'itaosy')">{{ item.itaosy
                }}</span>
            <span v-else>{{ item.itaosy }}</span>
            <br>
            <span v-if="item.itaosy_colis > 0" class="red-bg-soft-colis" style="cursor: pointer;"
                @click="onDetail(item, 'itaosy')">{{
                    item.itaosy_colis }} colis</span>
            <span v-else class="colis-placeholder">&nbsp;</span>
        </template>

        <template v-slot:[`item.ivato`]="{ item }">
            <span v-if="item.ivato > 0" class="red-bg-soft-liv" style="cursor: pointer;"
                @click="onDetail(item, 'ivato')">{{ item.ivato }}</span>
            <span v-else>{{ item.ivato }}</span>
            <br>
            <span v-if="item.ivato_colis > 0" class="red-bg-soft-colis" style="cursor: pointer;"
                @click="onDetail(item, 'ivato')">{{
                    item.ivato_colis }} colis</span>
            <span v-else class="colis-placeholder">&nbsp;</span>
        </template>

        <template v-slot:[`item.nord`]="{ item }">
            <span v-if="item.nord > 0" class="red-bg-soft-liv" style="cursor: pointer;"
                @click="onDetail(item, 'nord')">{{ item.nord }}</span>
            <span v-else>{{ item.nord }}</span>
            <br>
            <span v-if="item.nord_colis > 0" class="red-bg-soft-colis" style="cursor: pointer;"
                @click="onDetail(item, 'nord')">{{ item.nord_colis
                }} colis</span>
            <span v-else class="colis-placeholder">&nbsp;</span>
        </template>

        <template v-slot:[`item.sixsept`]="{ item }">
            <span v-if="item.sixsept > 0" class="red-bg-soft-liv" style="cursor: pointer;"
                @click="onDetail(item, 'sixsept')">{{ item.sixsept
                }}</span>
            <span v-else>{{ item.sixsept }}</span>
            <br>
            <span v-if="item.six_sept_colis > 0" class="red-bg-soft-colis" style="cursor: pointer;"
                @click="onDetail(item, 'sixsept')">{{
                    item.six_sept_colis }} colis</span>
            <span v-else class="colis-placeholder">&nbsp;</span>
        </template>

        <template v-slot:[`item.sud`]="{ item }">
            <span v-if="item.sud > 0" class="red-bg-soft-liv" style="cursor: pointer;" @click="onDetail(item, 'sud')">{{
                item.sud }}</span>
            <span v-else>{{ item.sud }}</span>
            <br>
            <span v-if="item.sud_colis > 0" class="red-bg-soft-colis" style="cursor: pointer;"
                @click="onDetail(item, 'sud')">{{ item.sud_colis }}
                colis</span>
            <span v-else class="colis-placeholder">&nbsp;</span>
        </template>

        <template v-slot:[`item.sud_est`]="{ item }">
            <span v-if="item.sud_est > 0" class="red-bg-soft-liv" style="cursor: pointer;"
                @click="onDetail(item, 'sud-est')">{{ item.sud_est
                }}</span>
            <span v-else>{{ item.sud_est }}</span>
            <br>
            <span v-if="item.sud_est_colis > 0" class="red-bg-soft-colis" style="cursor: pointer;"
                @click="onDetail(item, 'sud-est')">{{
                    item.sud_est_colis }} colis</span>
            <span v-else class="colis-placeholder">&nbsp;</span>
        </template>

        <template v-slot:[`item.total`]="{ item }">
            <span v-if="item.total > 0" class="red-bg" style="cursor: pointer;" @click="onDetail(item, 'total')">{{
                item.total }}</span>
            <span v-else>{{ item.total }}</span>
            <br>
            <span v-if="item.total_colis > 0" class="red-bg-colis" style="cursor: pointer;"
                @click="onDetail(item, 'total')">{{ item.total_colis
                }} colis</span>
            <span v-else class="colis-placeholder">&nbsp;</span>
        </template>

        <template v-slot:[`item.date_validation_adv`]="{ item }">
            {{ formatDateTimeAdv(item.date_validation_adv) }}
        </template>

        <!-- <template v-slot:[`item.xDISPO`]="{ item }">
            <div class="text-center">
                <div>
                    {{ item.xDISPO }}
                </div>
                <div class="text-caption">
                    ({{ item.DEPUIS }} mn)
                </div>
            </div>
        </template> -->

        <!-- <template v-slot:[`item.CHAUFFEUR`]="{ item }">
            <div class="text-start" :class="getDispoClass(item.xDISPO)">
                <div>
                    {{ item.CHAUFFEUR }} — 
                    
                    <span class="text-right d-inline-block" style="min-width: 40px;">
                        {{ item.NB_TOTAL }} Tour
                    </span>
                </div>
                <div style="font-size: 12px;color: #666;">
                    ( {{ item.xNUM_VOIT }} )
                </div>
            </div>
        </template> -->

        <template v-slot:[`item.CHAUFFEUR`]="{ item }">
            <div class="text-start" :class="getDispoClass(item.xDISPO)">

                <div class="d-flex align-center">
                    <span>{{ item.CHAUFFEUR }} </span>

                    <span class="ml-auto text-right" style="min-width: 20px;margin-right: 5px;">
                        {{ item.NB_TOTAL }} Tour
                    </span>
                </div>

                <div style="font-size: 12px;color: #666;">
                    ( {{ item.xNUM_VOIT }} )
                </div>

            </div>
        </template>


        <template v-slot:[`item.VOITURE`]="{ item }">
            <div class="text-start" :class="getDispoClass(item.xDISPO)">
                <div>
                    {{ item.VOITURE }}
                    <span v-if="item.VOITURE && item.VOITURE.includes('MOTO')" style="margin-left: 68px;">
                        <img :src="require('@/assets/moto.png')" alt="moto" style="width: 20px; height: 20px;" />
                    </span>

                    <span
                        v-else-if="item.VOITURE && (item.VOITURE.includes('DAMAS') || item.VOITURE.includes('KEYTON'))"
                        style="margin-left: 60px;">
                        <img :src="require('@/assets/minibus.png')" alt="minibus" style="width: 20px; height: 20px;" />
                    </span>

                    <span v-else-if="item.VOITURE && item.VOITURE.includes('ISUZU')" style="margin-left: 68px;">
                        <img :src="require('@/assets/camion.png')" alt="camion" style="width: 20px; height: 20px;" />
                    </span>

                    <span v-else-if="item.VOITURE && item.VOITURE.includes('BT 50')" style="margin-left: 68px;">
                        <img :src="require('@/assets/ford.png')" alt="pickup"
                            style="width: 20px; height: 20px; transform: scale(1.8); transform-origin: center;" />
                    </span>

                    <span v-else-if="item.VOITURE && item.VOITURE.includes('NISSAN')" style="margin-left: 62px;">
                        <img :src="require('@/assets/ford.png')" alt="pickup"
                            style="width: 20px; height: 20px; transform: scale(1.8); transform-origin: center;" />
                    </span>

                    <span v-else-if="item.VOITURE && item.VOITURE.includes('MERCEDES')" style="margin-left: 40px;">
                        <img :src="require('@/assets/benz.png')" alt="mercedes"
                            style="width: 20px; height: 20px;transform: scale(1.8);transform-origin: center;" />
                    </span>

                </div>

                <div style="font-size: 12px;color: #666;" :class="{
                    'bg-soft-nonSortie': item.NON_SORTIE_SEC === 0 && item.xDISPO?.trim() === 'LIVR'
                }">

                    {{ item.xDISPO }}
                    <span v-if="item.NON_SORTIE_SEC === 0 && item.xDISPO?.trim() === 'LIVR'" class="blink-slow">
                        - NON SORTIE
                    </span>

                    - ({{ item.DEPUIS }} mn)

                </div>
            </div>
        </template>


        <template v-for="n in 4" v-slot:[`item.TOURNE_${n}`]="{ item }">
            <div class="text-center"
                :class="{ 'bg-soft-depasse': item[`TOURNE_${n}_OBJ`] == 1, 'bg-soft-blue': item[`TOURNE_${n}_OBJ`] == 2 }">
                <div>{{ item[`TOURNE_${n}`] }}</div>

                <div style="font-size: 12px;color: #666;"
                    v-if="item[`TOURNE_${n}_DUREE`] !== 0 && item[`TOURNE_${n}_DUREE`] != null">

                    <!-- <div :class="{ 'bg-soft-depasse': item[`TOURNE_${n}_OBJ`] === 1 }"> -->
                    ({{ item[`TOURNE_${n}_DUREE`] }} mn)
                    <!-- </div> -->

                </div>
            </div>
        </template>

        <template v-slot:[`item.DERNIERE_SORTIE`]="{ item }">
            <div style="line-height: 1.2; font-size: 0.9em; text-align:center;">

                <!-- Ligne 1 : Date -->
                <div>
                    {{ item.DERNIERE_SORTIE ? formatDate(item.DERNIERE_SORTIE) : '' }}
                </div>

                <!-- Ligne 2 : Heure -->
                <div>
                    {{ item.DERNIERE_SORTIE ? formatDateTime(item.DERNIERE_SORTIE) : '' }}
                </div>

            </div>
        </template>

    </v-data-table>
</template>
<script>
import { defineComponent, ref, watch, onMounted, computed, onUnmounted } from 'vue';
import { VDataTable } from "vuetify/lib/components";
import dayjs from 'dayjs';

export default defineComponent({
    components: {
        VDataTable,
    },

    //   emits: ['action1Item', 'action2Item','action4Item','action5Item'],

    props: {
        headers: Object,
        items: Array,
        valider: String,
        hasPassBalGlobal: Boolean,
    },

    emits: ['action1Item', 'edit', 'detail_nb_cmd', 'onDetail', 'onDetail_ind'],
    setup(props, context) {

        const actionValider = (item) => {
            context.emit('action1Item', item);
        };

        const getDispoClass = (dispo) => {
            const value = dispo?.trim()

            if (value === 'DISPO') return 'bg-dispo'
            if (value === 'MISS') return 'bg-miss'
            if (value === 'LIVR') return 'bg-livr'

            return ''
        }


        const formatDate = (date) => {
            if (date !== null && date !== '') {
                return dayjs(date).format('DD/MM/YYYY');
            } else {
                return '';
            }
        };

        // const formatDateTime = (date) => {
        //     if (date !== null && date !== '') {
        //         return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
        //     } else {
        //         return '';
        //     }
        // };


        const formatDateTime = (date) => {
            if (!date) return ''
            // On parse explicitement le format d’entrée
            const parsed = dayjs(date, 'HH:mm')
            // Si la date est valide, on la reformate
            return parsed.isValid() ? parsed.format('HH:mm') : ''
        }

        const formatDateTimeAdv = (date) => {
            if (!date) return ''
            // On parse explicitement le format d’entrée
            const parsed = dayjs(date, 'DD/MM/YYYY HH:mm:ss')
            // Si la date est valide, on la reformate
            return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm') : ''
        }

        const formatHeure = (heure) => {
            return heure ? heure.substring(0, 5) : ''
        }

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

        const edit = (item) => {
            // Votre logique de recherche ici
            context.emit("edit", item);
        };

        const detail_nb_cmd = (item) => {
            // Votre logique de recherche ici
            context.emit("detail_nb_cmd", item);
        };

        const onDetail = (item, axeClique) => {
            context.emit("onDetail", { item, axeClique });
        };

        const onDetail_ind = (item, etapeClique) => {
            context.emit("onDetail_ind", { item, etapeClique });
        };





        /* const edit = () => {
             const targetElement = event.target;
             const isActionButton = targetElement.closest(".action-button");
 
             if (!isActionButton) {
 
                 const rowElement = targetElement.closest("tr");
                 if (rowElement) {
                     const firstCell = rowElement.querySelector("td:first-child");
                     if (firstCell) {
                         const firstColumnData = firstCell.textContent;
                         const item = props.items.find(item => item.trans_code === firstColumnData);
                         if (item) {
                             editItem(item);
                         }
                     }
                 }
             }
         }*/


        //const onRowClick = (event) => {

        // const targetElement = event.target;
        // const isActionButton = targetElement.closest(".action-button");

        // if (!isActionButton) {


        //     const rowElement = targetElement.closest("tr");
        //     if (rowElement) {
        //         const firstCell = rowElement.querySelector("td:first-child");
        //         if (firstCell) {
        //             const firstColumnData = firstCell.textContent;
        //             const item = props.items.find(item => item.trans_code === firstColumnData);
        //             if (item) {
        //                 editItem(item);
        //             }
        //         }
        //     }
        // }
        // };


        const rowColorsValide = computed(() => (item) => {
            if (item.item.trans_valide == 1) {
                return { class: 'couleur_valide' };
            }
        });


        // Computed pour la classe de ligne
        // const rowColor = computed(() => (item) => {
        //     const values = ['centre', 'est', 'itaosy', 'ivato', 'nord', 'six_sept', 'sud', 'sud_est', 'total'];
        //     const hasPositive = values.some(key => item.item[key] > 0);

        //     if (hasPositive) {
        //         return { class: 'soft-bg' }; // fond soft si aucune autre condition
        //     } else {
        //         return { class: 'default' };
        //     }
        // });

        // ✅ Computed pour la classe de ligne
        const rowColor = computed(() => (item) => {
            const values = ['est', 'itaosy', 'ivato', 'nord', 'six_sept', 'sud', 'sud_est', 'total'];
            const hasPositive = values.some(key => item.item[key] > 0);

            // 🟩 Si cc2_pass_bal == 1 → ligne colorée
            if (item.item.cc2_pass_bal === 1) {
                return { class: 'highlight-bg' };
            }
            // 🟨 Sinon si au moins une valeur > 0
            else if (hasPositive) {
                return { class: 'soft-bg' };
            }
            // ⚪ Sinon couleur par défaut
            else {
                return { class: 'default' };
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




        return {
            formatDate,
            formatDateTime, formatPrice,
            actionValider, rowColor,
            edit, detail_nb_cmd,
            showTooltip, hideTooltip, onDetail, onDetail_ind,
            formatHeure, formatDateTimeAdv,
            getDispoClass,

        }

    }
});
</script>
<style>
.v-data-table.header_exped .v-table__wrapper>table>thead>tr th,
.v-data-table.header_exped .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc !important;
    white-space: nowrap;
    color: #000000 !important;
}

.couleur_valide {
    background-color: #B9F6CA;
}

.header_exped.v-data-table tr>td:first-child {
    border-left: 4px solid #969696;
}

.header_exped.v-data-table tr>td:last-child {
    border-right: 4px solid #969696;
}

.red-bg {
    background-color: red;
    color: white;
    width: 20px;
    /* largeur fixe pour le cercle */
    height: 20px;
    /* hauteur fixe pour le cercle */
    line-height: 20px;
    /* centrer le texte verticalement */
    text-align: center;
    /* centrer le texte horizontalement */
    border-radius: 50%;
    /* cercle parfait */
    display: inline-block;
    font-weight: bold;
}

.red-bg-soft {
    background-color: #EF9A9A;
    color: black;
    width: 30px;
    /* largeur fixe pour le cercle */
    height: 30px;
    /* hauteur fixe pour le cercle */
    line-height: 30px;
    /* centrer le texte verticalement */
    text-align: center;
    /* centrer le texte horizontalement */
    border-radius: 50%;
    /* cercle parfait */
    display: inline-block;
    font-weight: bold;
}

.soft-bg {
    background-color: rgba(65, 226, 28, 0.213);
    /* background-color: rgba(255, 210, 200, 0.458); */
    /* rouge très clair */
}


/* .red-bg-soft-colis {
    background-color: #EF9A9A;
    color: black;
    width: 50px;
    height: 20px;
    line-height: 25px;
    text-align: center;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
}

.red-bg-soft-liv {
    background-color: #EF9A9A;
    color: black;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    display: inline-block;
    font-weight: bold;
} */

.red-bg-soft-liv {
    background-color: #EF9A9A;
    color: black;
    padding: 0 3px;
    min-width: 19px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    text-align: center;
    border-radius: 50%;
    display: inline-block;
    font-weight: bold;
}

.blue-bg-soft-liv {
    background-color: #BBDEFB;
    color: black;
    padding: 0 3px;
    min-width: 19px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    text-align: center;
    border-radius: 50%;
    display: inline-block;
    font-weight: bold;
}

.multi-bg-soft-liv {
    background: linear-gradient(to right,
            #EF9A9A 0% 33%,
            #90EE90 33% 66%,
            #90CAF9 66% 100%);
    color: black;
    padding: 0 3px;
    min-width: 19px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    text-align: center;
    border-radius: 50%;
    display: inline-block;
    font-weight: bold;
}

.green-bg-soft-liv {
    background-color: #90EE90;
    color: black;
    padding: 0 3px;
    min-width: 19px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    text-align: center;
    border-radius: 50%;
    display: inline-block;
    font-weight: bold;
}

.red-bg-liv-demi {
    background: linear-gradient(to right,
            #EF9A9A 50%,
            #90EE90 50%);
    color: black;
    padding: 0 3px;
    min-width: 19px;
    height: 18px;
    line-height: 18px;
    font-size: 11px;
    text-align: center;
    border-radius: 50%;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #EF9A9A;
}

.red-bg-soft-colis {
    background-color: #EF9A9A;
    color: black;
    padding: 0 3px;
    min-width: 25px;
    height: 19px;
    line-height: 20px;
    font-size: 11px;
    text-align: center;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #EF9A9A;
}

.blue-bg-soft-colis {
    background-color: #BBDEFB;
    color: black;
    padding: 0 3px;
    min-width: 25px;
    height: 19px;
    line-height: 20px;
    font-size: 11px;
    text-align: center;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #EF9A9A;
}

.bg-soft-depasse {
    background-color: #EF9A9A;
    color: black;
    padding: 0 3px;
    min-width: 20px;
    height: 30px;
    line-height: 20px;
    font-size: 11px;
    text-align: center;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #EF9A9A;
}

.green-bg-soft-colis {
    background-color: #90EE90;
    color: black;
    padding: 0 3px;
    min-width: 25px;
    height: 19px;
    line-height: 20px;
    font-size: 11px;
    text-align: center;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #bdbdbd;
}

.bg-soft-nonSortie {
    background-color: #EF9A9A;
    color: black;
    padding: 0 3px;
    min-width: 25px;
    height: 19px;
    line-height: 20px;
    font-size: 11px;
    text-align: center;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #bdbdbd;
}

.red-bg-soft-demi {
    background: linear-gradient(to right,
            #EF9A9A 50%,
            #90EE90 50%);
    color: black;
    padding: 0 3px;
    min-width: 25px;
    height: 19px;
    line-height: 20px;
    font-size: 11px;
    text-align: center;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #EF9A9A;
}

.multi-bg-soft-demi {
    background: linear-gradient(to right,
            #EF9A9A 0% 33%,
            #90EE90 33% 66%,
            #90CAF9 66% 100%);
    color: black;
    padding: 0 3px;
    min-width: 25px;
    height: 19px;
    line-height: 20px;
    font-size: 11px;
    text-align: center;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #EF9A9A;
}

.cell-red-bg {
    background-color: #fde0e0;
    padding: 2px;
    border-radius: 0px;
}

.cell-red-bg1 {
    background-color: #fde0e0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2px;
    box-sizing: border-box;
}


.red-bg-colis {
    background-color: red;
    color: white;
    width: 50px;
    /* un peu plus large pour le texte */
    height: 20px;
    line-height: 25px;
    /* centrer verticalement */
    text-align: center;
    /* centrer horizontalement */
    border-radius: 4px;
    /* petit arrondi pour un carré */
    display: inline-block;
    font-weight: bold;
}

.colis-placeholder {
    display: inline-block;
    height: 20px;
    /* 🔹 ajuste ici selon la hauteur de ton texte ou badge */
    line-height: 30px;
    /* 🔹 optionnel pour centrer verticalement */
    visibility: hidden;
    /* garde l’espace sans afficher le contenu */
}

.highlight-bg {
    background-color: #ffe5a1 !important;
}

.v-data-table.header_exped td,
.v-data-table.header_exped th {
    padding: 1px 2px !important;
    font-size: 12px;
    line-height: 1.2 !important;
}

.v-data-table.header_exped td div {
    margin: 0 !important;
    padding: 0 !important;
    line-height: 1.3;
}

.vague-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* 🔥 centre horizontalement */
    justify-content: center;
}

.vague-top {
    font-size: 13px;
    font-weight: bold;
    text-align: center;
}

.vague-bottom {
    font-weight: bold;
    font-size: 12px;
    text-align: center;
    color: #666;
}

.vague-containerInd {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* 🔥 colle à gauche */
    justify-content: flex-start;
    /* 🔥 colle en haut */
}

.vague-topInd {
    font-weight: bold;
    text-align: center;
}

.vague-bottomInd {
    font-weight: bold;
    font-size: 12px;
    text-align: center;
    color: #666;
}

.percent-bottom {
    font-weight: bold;
    font-size: 12px;
    text-align: center;
    color: #666;
}

.circle-value {
    width: 24px;
    height: 24px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    font-size: 11px;
    font-weight: bold;

    border-radius: 50%;
}

.circle-green {
    background-color: #90EE90;
    color: black;
}

.circle-red {
    background-color: #EF9A9A;
    color: black;
}

.green-bg-ind {
    background-color: #90EE90;
    color: black;
    padding: 0 3px;
    min-width: 25px;
    height: 19px;
    line-height: 20px;
    font-size: 11px;
    text-align: center;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #bdbdbd;
}

.red-bg-ind {
    background-color: #EF9A9A;
    color: black;
    padding: 0 3px;
    min-width: 25px;
    height: 19px;
    line-height: 20px;
    font-size: 11px;
    text-align: center;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #bdbdbd;
}


.bg-dispo {
    background: #bdf1c9;
    height: 100%;
}

.bg-miss {
    background: #9ccffa;
    height: 100%;
}

.bg-livr {
    background: #fde0e0;
    height: 100%;
}


.bg-soft-blue {
    background-color: #9ccffa;
    color: black;
    padding: 0 3px;
    min-width: 60px;
    height: 30px;
    line-height: 20px;
    font-size: 11px;
    text-align: center;
    border-radius: 4px;
    display: inline-block;
    font-weight: bold;
    border: 1px solid #EF9A9A;
}

/* .blink-slow {
    animation: blinkSoft 2.5s infinite;
}

@keyframes blinkSoft {
    0%   { opacity: 1; }
    50%  { opacity: 0.3; }
    100% { opacity: 1; }
} */
</style>