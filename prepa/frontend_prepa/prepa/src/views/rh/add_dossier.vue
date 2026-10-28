<template>
    <div class="nouveau-dossier">

        <!-- Header -->
        <div class="header">
            <h2>NOUVEAU DOSSIER</h2>
            <span class="badge">{{ dossierCode }}</span>
        </div>

        <!-- Contenu -->
        <div class="content">

            <!-- Colonne gauche -->
            <div class="left">
                <div class="photo-upload">
                    <div class="photo-circle">
                        <span class="icon">+</span>
                        <span>AJOUTER PHOTO</span>
                    </div>
                </div>
            </div>

            <!-- Colonne droite -->
            <div class="right">

                <div class="form-row">
                    <label>Date de réception</label>
                    <input type="date" v-model="dateReception"  class="compact-input"/>
                </div>

                <div class="form-row">
                    <label>Numéro CIN</label>
                    <input type="text" v-model="numeroCIN" class="compact-input1"/>
                </div>

                <!-- Documents -->
                <div class="documents">

                    <div class="doc-row" v-for="doc in documents" :key="doc.key">
                        <label class="doc-label">{{ doc.label }}</label>

                        <div class="doc-input-group">
                            <input type="file" @change="handleFileUpload($event, doc.key)" />

                            <button class="preview-btn" :disabled="!doc.file" @click="previewFile(doc.key)">
                                Aperçu
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <button class="btn-cancel" @click="cancel">Annuler</button>
            <button class="btn-save">Enregistrer</button>
        </div>

    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    name: 'NouveauDossier',

    emits: ["saved", "cancel"],

    setup(props, { emit }) {
        const dossierCode = ref('')
        const dateReception = ref('')
        const numeroCIN = ref('')

        const documents = ref([
            { key: 'residence', label: 'Certificat de résidence', file: null },
            { key: 'mariage', label: 'Certificat de mariage', file: null },
            { key: 'n3', label: 'Bulletin N3', file: null },
            { key: 'cnaps', label: 'Filiation CNAPS', file: null },
            { key: 'diplome', label: 'Diplôme', file: null },
            { key: 'rib', label: "Relevé d'Identité Bancaire", file: null }
        ])

        function handleFileUpload(event, key) {
            const file = event.target.files[0]
            const doc = documents.value.find(d => d.key === key)
            if (doc) doc.file = file
        }

        function previewFile(key) {
            const doc = documents.value.find(d => d.key === key)
            if (doc?.file) {
                const url = URL.createObjectURL(doc.file)
                window.open(url, '_blank')
            }
        }

        function cancel() {
            emit("cancel");
        }

        return {
            dossierCode,
            dateReception,
            numeroCIN,
            documents,
            handleFileUpload,
            previewFile,
            cancel,
        }
    }
}
</script>


<style>
.nouveau-dossier {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    max-width: 900px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.badge {
    background: #e8f7d4;
    color: #6fbf2c;
    padding: 6px 14px;
    border-radius: 20px;
    font-weight: 600;
}

.content {
    display: flex;
    gap: 40px;
    margin-top: 24px;
}

.left {
    width: 200px;
}

.right {
    flex: 1;
}

.photo-circle {
    width: 160px;
    height: 160px;
    border: 2px dashed #ccc;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #aaa;
    text-align: center;
}

.photo-circle .icon {
    font-size: 32px;
    margin-bottom: 6px;
}

.form-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 18px;
}

.form-row label {
    font-size: 13px;
    color: #777;
    margin-bottom: 4px;
}

.form-row input {
    border: none;
    border-bottom: 1px solid #ccc;
    padding: 6px 4px;
    outline: none;
}

/* Documents */
.documents {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 40px;
    margin-top: 20px;
}

.doc-row {
    display: flex;
    flex-direction: column;
}

.doc-label {
    font-size: 13px;
    margin-bottom: 6px;
    color: #555;
}

.doc-input-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.preview-btn {
    background: #f0f0f0;
    border: none;
    padding: 5px 14px;
    border-radius: 6px;
    cursor: pointer;
}

.preview-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.footer {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 32px;
}

.btn-save {
    background: #9acd32;
    border: none;
    color: white;
    padding: 8px 20px;
    border-radius: 20px;
    cursor: pointer;
}

.compact-input {
  width: 100px;        /* change ici la taille */
  border: none;
  border-bottom: 1px solid #bbb;
  padding: 4px 2px;
  font-size: 13px;
}

.compact-input1 {
  width: 120px;        /* change ici la taille */
  border: none;
  border-bottom: 1px solid #bbb;
  padding: 4px 2px;
  font-size: 13px;
}
</style>
