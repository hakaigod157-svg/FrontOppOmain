<script setup>
import { ref } from "vue";

defineProps({
  vehicule: { type: Object, required: true },
  dateHeure: { type: String, default: "" },
});

const emit = defineEmits(["back"]);
const ongletDetail = ref("historique");
const maintenanceExpandedId = ref(null);
const toggleMaintenanceExpand = (maintenanceId) => {
  maintenanceExpandedId.value = maintenanceExpandedId.value === maintenanceId ? null : maintenanceId;
};
const voirDetailMaintenance = (maintenance) => emit("voir-detail-maintenance", maintenance);
const formatKm = (value) => value === null || value === undefined || value === ""
  ? ""
  : `${Number(value).toLocaleString("fr-FR")} km`;
</script>

<template>
  <section class="detail-vehicule-page">
    <header class="detail-page-header">
      <v-btn variant="text" class="detail-back" @click="emit('back')">← Retour à la liste</v-btn>
      <div class="detail-page-title">
        <div><h1>Détails complets : {{ vehicule.voiture_IMMAT }}</h1></div>
        <!--  <span>{{ dateHeure }}</span> -->
      </div>
      <nav class="detail-tabs" aria-label="Sections de la fiche véhicule">
        <button :class="{ active: ongletDetail === 'historique' }" @click="ongletDetail = 'historique'">Historique</button>
        <button :class="{ active: ongletDetail === 'prevision' }" @click="ongletDetail = 'prevision'">Prévision</button>
        <button :class="{ active: ongletDetail === 'immatriculation' }" @click="ongletDetail = 'immatriculation'">Immatriculation</button>
      </nav>
    </header>
    <div class="detail-page-content">
      <aside class="detail-page-list">
        <template v-if="ongletDetail === 'historique'">
          <h2>Maintenances récentes</h2>
          <div v-for="maintenance in vehicule.historique || []" :key="maintenance.id" class="detail-history-item" @click="toggleMaintenanceExpand(maintenance.id)">
            <div class="detail-history-summary">
              <v-icon size="16" class="detail-history-chevron" :class="{ 'detail-history-chevron--open': maintenanceExpandedId === maintenance.id }">mdi-chevron-right</v-icon>
              <strong>{{ maintenance.type }}</strong><span>{{ maintenance.date }}</span>
            </div>
            <Transition name="expand-detail">
              <div v-if="maintenanceExpandedId === maintenance.id" class="detail-history-details">
                <div class="detail-history-details__row"><span>Description</span><strong>{{ maintenance.description || '—' }}</strong></div>
                <div class="detail-history-details__row"><span>Kilométrage</span><strong>{{ formatKm(maintenance.km) || '—' }}</strong></div>
                <div class="detail-history-details__row"><span>Date</span><strong>{{ maintenance.date }}</strong></div>
                <v-btn size="small" variant="elevated" color="#144f0e" class="detail-history-action" prepend-icon="mdi-eye-outline" @click.stop="voirDetailMaintenance(maintenance)">VOIR DÉTAIL</v-btn>
              </div>
            </Transition>
          </div>
          <p v-if="!vehicule.historique?.length" class="detail-empty">Aucune maintenance enregistrée.</p>
        </template>
        <template v-else-if="ongletDetail === 'prevision'"><h2>Prévision</h2><p class="detail-empty">Aucune prévision enregistrée.</p></template>
        <template v-else><h2>Immatriculation</h2><strong class="detail-plate">{{ vehicule.voiture_IMMAT }}</strong></template>
      </aside>
      <main class="detail-page-main">
        <div class="detail-page-identity">
          <div class="identity-primary">
            <div><span class="field-caption">VÉHICULE</span><h2>{{ vehicule.voiture_MARQUE }} {{ vehicule.voiture_MODELE }}</h2><span class="identity-registration">{{ vehicule.voiture_IMMAT }}</span></div>
            <span class="detail-status" :class="{ 'detail-status--inactive': vehicule.statut !== 'Actif' }">{{ vehicule.statut }}</span>
          </div>
          <dl class="detail-specifications">
            <div><dt>Bénéficiaire</dt><dd>{{ vehicule.beneficiaire || 'Non renseigné' }}</dd></div>
            <div><dt>Année</dt><dd>{{ vehicule.voiture_ANNEE || 'Non renseignée' }}</dd></div>
            <div><dt>Kilométrage</dt><dd>{{ formatKm(vehicule.voiture_KM) || 'Non renseigné' }}</dd></div>
            <div><dt>Immatriculation</dt><dd>{{ vehicule.voiture_IMMAT || 'Non renseignée' }}</dd></div>
          </dl>
        </div>
        <div class="detail-photo-block">
          <h3>Photo du véhicule</h3>
          <div class="detail-page-image">
            <img v-if="vehicule.image" :src="vehicule.image" :alt="`${vehicule.voiture_MARQUE} ${vehicule.voiture_MODELE}`" />
            <span v-else>Photo non disponible</span>
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<style scoped>
.detail-vehicule-page{min-height:calc(100vh - 120px);
  padding:24px 3.4%;
  background:#f5f7f5;
  color:#202720}
  .detail-page-header{max-width:1440px;margin:0 auto 20px}
  .detail-back{color:#285b2a;margin:-8px 0 8px -12px}
  .detail-page-title{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:16px}
    .detail-page-title h1{color:#202720;font-size:24px;line-height:1.25;font-weight:650}.detail-page-title>span{color:#526052;font-size:13px}.detail-tabs{display:flex;gap:56px;margin-top:16px;padding-left:18px}.detail-tabs button{padding:4px 0 8px;border:0;border-bottom:2px solid transparent;background:transparent;color:#526052;text-transform:uppercase;font-size:13px;cursor:pointer}.detail-tabs button.active{color:#285b2a;border-bottom-color:#2e7d32;font-weight:650}.detail-page-content{max-width:1440px;min-height:68vh;margin:0 auto;padding:clamp(22px,3vw,40px);display:grid;grid-template-columns:minmax(200px,25%) minmax(0,1fr);gap:clamp(24px,4vw,56px);align-items:stretch;border:1px solid #dce5dc;border-radius:8px;background:#fff;color:#202720;box-shadow:0 1px 4px rgba(20,79,14,.06)}.detail-page-list{max-height:58vh;overflow-y:auto;align-self:stretch;border:1px solid #aeb9ad;border-radius:6px;background:#fff}.detail-page-list h2{padding:14px;font-size:15px;font-weight:650;border-bottom:1px solid #d9dfd8}.detail-history-item{display:flex;flex-direction:column;gap:5px;padding:13px 14px;border-bottom:1px solid #d9dfd8}.detail-history-item strong{color:#263626;font-size:13px}.detail-history-item span,.detail-history-item small,.detail-empty{color:#526052;font-size:12px}.detail-empty{padding:14px}.detail-plate{display:block;padding:12px 14px;color:#202720;font-size:14px}.detail-page-main{min-width:0;display:flex;flex-direction:column;gap:24px}.detail-page-identity{display:flex;flex-direction:column;gap:22px}.identity-primary{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding-bottom:16px;border-bottom:1px solid #e2e8e2}.field-caption{color:#607160;font-size:10px;font-weight:700;letter-spacing:.07em}.identity-primary h2{margin-top:4px;color:#202720;font-size:22px;font-weight:650;line-height:1.25}.identity-registration{display:inline-block;margin-top:4px;color:#526052;font-size:13px}.detail-status{padding:4px 10px;border-radius:4px;background:#dcfce7;color:#14532d;font-size:12px;font-weight:600}.detail-status--inactive{background:#fee2e2;color:#991b1b}.detail-specifications{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 24px;margin:0}.detail-specifications>div{min-width:0}.detail-specifications dt{color:#607160;font-size:12px}.detail-specifications dd{margin:4px 0 0;color:#202720;font-size:14px;font-weight:600;overflow-wrap:anywhere}.detail-photo-block h3{margin-bottom:9px;color:#344934;font-size:13px;font-weight:600}.detail-page-image{width:100%;height:clamp(180px,28vh,300px);overflow:hidden;display:flex;align-items:center;justify-content:center;border:1px solid #dce5dc;border-radius:6px;background:#f4f6f4;color:#526052}.detail-page-image img{display:block;width:100%;height:100%;object-fit:contain;object-position:center}.detail-page-image span{padding:16px;text-align:center}.detail-history-data{display:grid;gap:5px;margin:6px 0 0;padding:8px;border-radius:5px;background:#f5f7f5}.detail-history-data>div{display:flex;justify-content:space-between;gap:8px;font-size:11px}.detail-history-data dt{color:#607160}.detail-history-data dd{margin:0;text-align:right;overflow-wrap:anywhere}
.detail-history-item{display:block;padding:0;border-bottom:1px solid #d9dfd8;cursor:pointer}.detail-history-item:hover{background:#f0f4f0}.detail-history-summary{display:flex;align-items:center;gap:8px;padding:13px 14px}.detail-history-summary strong{flex:1;color:#263626;font-size:13px}.detail-history-summary span{color:#526052;font-size:12px}.detail-history-chevron{color:#607160;transition:transform .2s}.detail-history-chevron--open{transform:rotate(90deg)}.detail-history-details{display:grid;gap:10px;padding:0 14px 14px 38px}.detail-history-details__row{display:flex;justify-content:space-between;gap:12px;font-size:12px}.detail-history-details__row>span{color:#607160}.detail-history-details__row>strong{color:#263626;text-align:right;overflow-wrap:anywhere}.detail-history-action{justify-self:start;margin-top:2px;font-size:11px}.expand-detail-enter-active,.expand-detail-leave-active{transition:opacity .2s ease,transform .2s ease}.expand-detail-enter-from,.expand-detail-leave-to{opacity:0;transform:translateY(-5px)}
@media(max-width:700px){
  .detail-vehicule-page{padding:16px}
  .detail-page-title h1{font-size:21px}
  .detail-tabs{gap:20px;padding-left:0}
  .detail-page-content{grid-template-columns:1fr;padding:18px}
  .detail-page-list{max-height:220px}
  .detail-page-image{height:clamp(180px,36vh,280px)}}
</style>
