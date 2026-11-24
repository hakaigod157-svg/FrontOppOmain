<script setup>
import { computed, reactive, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "saved"]);
const form = reactive({ voiture_IMMAT: "", beneficiaire: "", voiture_MARQUE: "", voiture_MODELE: "", voiture_ANNEE: null, voiture_KM: null, statut: "Actif", image: "" });
const erreur = computed(() => {
  if (!form.voiture_IMMAT.trim() || !form.voiture_MARQUE.trim() || !form.voiture_MODELE.trim() || !form.voiture_ANNEE || form.voiture_KM === null || form.voiture_KM === "") return "Renseignez les informations obligatoires pour enregistrer le véhicule.";
  if (form.voiture_ANNEE < 1900 || form.voiture_ANNEE > new Date().getFullYear() + 1) return "Vérifiez l’année de mise en circulation.";
  if (Number(form.voiture_KM) < 0) return "Le kilométrage doit être positif.";
  return "";
});
watch(() => props.modelValue, (open) => { if (open) Object.assign(form, { voiture_IMMAT: "", beneficiaire: "", voiture_MARQUE: "", voiture_MODELE: "", voiture_ANNEE: null, voiture_KM: null, statut: "Actif", image: "" }); });
const imageChange = (event) => { const file = event.target.files?.[0]; if (file) form.image = URL.createObjectURL(file); };
const fermer = () => emit("update:modelValue", false);
const enregistrer = () => {
  if (erreur.value || props.loading) return;
  emit("saved", { ...form, voiture_IMMAT: form.voiture_IMMAT.trim().toUpperCase(), voiture_MARQUE: form.voiture_MARQUE.trim().toUpperCase(), voiture_MODELE: form.voiture_MODELE.trim(), voiture_ANNEE: Number(form.voiture_ANNEE), voiture_KM: Number(form.voiture_KM), historique: [] });
};
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="980" :persistent="loading" @update:model-value="emit('update:modelValue', $event)">
    <v-card class="vehicle-dialog">
      <header class="dialog-header"><h2>Ajouter un véhicule</h2><v-btn icon="mdi-close" variant="text" aria-label="Fermer" :disabled="loading" @click="fermer" /></header>
      <v-divider />
      <v-card-text class="dialog-content">
        <div class="add-grid">
          <div>
            <div class="field-grid">
              <div class="field-row">
                <v-icon class="field-icon" icon="mdi-card-account-details-outline"/>
                <v-text-field
                 v-model="form.voiture_IMMAT" 
                 label="Immatriculation *" 
                 placeholder="Ex. 2099 TBP" 
                 variant="outlined" 
                 density="comfortable" 
                 maxlength="20" />
              </div>

          <div class="field-row">
            <v-icon class="field-icon" icon="mdi-account-outline"/>
              <v-text-field
               v-model="form.beneficiaire" 
               label="Bénéficiaire" 
               placeholder="Nom du bénéficiaire" 
               variant="outlined" 
               density="comfortable" />
              </div>

            <div class="field-row">
              <v-icon class="field-icon" 
              icon="mdi-domain"/>
              <v-text-field 
              v-model="form.voiture_MARQUE" 
              label="Marque *"
              placeholder="Ex. Toyota" 
              variant="outlined" 
              density="comfortable" />
            </div>

          <div class="field-row">
            <v-icon class="field-icon" icon="mdi-car-outline"/>
              <v-text-field 
              v-model="form.voiture_MODELE" 
              label="Modèle *" 
              placeholder="Ex. Hilux" 
              variant="outlined" 
              density="comfortable" />
            </div>

          <div class="field-row">
            <v-icon class="field-icon" icon="mdi-calendar-outline"/>
            <v-text-field 
            v-model.number="form.voiture_ANNEE" 
            label="Année *" 
            placeholder="2024" 
            type="number" min="1900" :max="new Date().getFullYear() + 1" 
            variant="outlined" 
            density="comfortable" />
          </div>

          <div class="field-row">
            <v-icon class="field-icon" icon="mdi-counter"/>
            <v-text-field 
            v-model.number="form.voiture_KM" 
            label="Kilométrage actuel *" 
            placeholder="0" 
            type="number" min="0" suffix="km" 
            variant="outlined" 
            density="comfortable" />
          </div>

        </div>
      </div>
      <label class="image-upload" 
      :class="{'image-upload--filled':form.image}">
      <img v-if="form.image" 
      :src="form.image" 
      alt="Aperçu du véhicule"/>
      <span v-else class="upload-empty">
        <v-icon icon="mdi-image-plus-outline" size="34"/>
        <strong>Ajouter une photo du véhicule</strong>
        <small>PNG, JPG ou WEBP</small>
      </span>
      <span class="upload-action">
        <v-icon icon="mdi-cloud-upload-outline" size="17"/>{{form.image?'Changer la photo':'Importer une image'}}</span>
        <input type="file" accept="image/*" @change="imageChange"/></label></div>
        <div v-if="erreur" class="form-hint"><v-icon icon="mdi-information-outline" size="16" />{{ erreur }}</div>
      </v-card-text>
      <v-divider />
      <footer class="dialog-footer"><span class="required-note"><span>*</span> Champs obligatoires</span><div><v-btn variant="text" :disabled="loading" @click="fermer">Annuler</v-btn><v-btn color="success" variant="flat" prepend-icon="mdi-content-save-outline" :loading="loading" :disabled="Boolean(erreur)" @click="enregistrer">Enregistrer le véhicule</v-btn></div></footer>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.vehicle-dialog{
  border-radius:12px!important;
  overflow:hidden
}
.dialog-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:22px 28px 18px}

.dialog-header h2{
  font-size:20px;
  font-weight:650;
  line-height:1.3;
  color:#202720
}
.dialog-content{padding:24px 28px}
.add-grid{
  display:grid;
  grid-template-columns:1fr 1fr;gap:28px;
  align-items:stretch
}
.field-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:4px 16px
}
.field-row{
  display:grid;
  grid-template-columns:16px minmax(0,1fr);
  align-items:center;
  gap:7px;
  min-width:0
}
.field-icon{
  width:14px;
  height:14px;
  font-size:14px;
  color:#687568
}
.image-upload{position:relative;min-height:300px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:14px;border:1px dashed #829782;border-radius:8px;background:#f8faf8;overflow:hidden;cursor:pointer}
.image-upload input{position:absolute;width:1px;height:1px;opacity:0}
.image-upload img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.upload-empty{display:flex;align-items:center;flex-direction:column;gap:9px;color:#376e39}
.upload-empty strong{font-size:14px;color:#263626}.upload-empty small{color:#5f6b60}
.upload-action{z-index:1;display:flex;gap:7px;align-items:center;padding:8px 12px;border:1px solid #c5d3c5;border-radius:6px;background:white;color:#285b2a;font-size:12px}
.form-hint{display:flex;gap:7px;align-items:center;margin-top:12px;color:#344934;font-size:13px}
.dialog-footer{display:flex;justify-content:space-between;align-items:center;padding:16px 28px 20px}
.dialog-footer>div{display:flex;gap:8px}.required-note{font-size:12px;color:#526052}
.required-note span{color:#b71c1c}@media(max-width:700px)
{.dialog-header,
.dialog-content{padding-inline:18px}
.add-grid{grid-template-columns:1fr}
.field-grid{grid-template-columns:1fr;gap:0}
.image-upload{min-height:190px}
.dialog-footer{align-items:flex-start;gap:12px;padding-inline:18px;flex-direction:column-reverse}
.dialog-footer>div{width:100%;justify-content:flex-end}}
</style>
