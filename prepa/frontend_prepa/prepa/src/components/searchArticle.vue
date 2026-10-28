<template  >
    <v-dialog v-model="dialog" persistent density="compact" transition="dialog-bottom-transition" width="1000"
        :style="{ height: '800px' }">
        <v-card density="compact" flat>
            <v-toolbar dark color="primary" density="compact">
                <v-toolbar-title>Recherche des Articles</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeDialog" density="compact">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-actions density="compact">
                <v-card-title density="compact">
                    <MyTextField name_lab_text="Code Article" hide-details="auto" style="width: 300px" v-model="codeArticle"
                        @input="convertToUpperCase" @keydown.enter="searchArticle">
                    </MyTextField>
                </v-card-title>
                <v-card-title density="compact">
                    <MyTextField name_lab_text="Libellé" style="width: 300px" hide-details="auto" v-model="libelle"
                        @input="convertToUpperCase" @keydown.enter="searchArticle">
                    </MyTextField>
                </v-card-title>
                <v-spacer></v-spacer>

                <v-btn icon @click="searchArticle" color="deep-purple-accent-4">
                    <v-icon color="deep-purple-accent-4">mdi-magnify</v-icon>
                </v-btn>
            </v-card-actions>
            <v-card-actions density="compact">
                <v-card-title density="compact">
                    <MyTextField name_lab_text="Nom Commercial" hide-details="auto" style="width: 300px"
                        v-model="nomCommercial" @input="convertToUpperCase" @keydown.enter="searchArticle">
                    </MyTextField>
                </v-card-title>
                <v-card-title density="compact">
                    <MyTextField name_lab_text="DCI" hide-details="auto" style="width: 300px" v-model="dci"
                        @input="convertToUpperCase" @keydown.enter="searchArticle">
                    </MyTextField>
                </v-card-title>
            </v-card-actions>
            <v-card-actions density="compact">
                <v-card-title density="compact">
                    <v-autocomplete :disabled="isUpdating" :items="items" style="width: 300px" item-title="code"
                        item-value="code" label="Labo" :min-length="2" density="compact" clearable hide-no-data
                        v-model:search="search" v-model="select" :loading="loading" color="deep-purple-accent-4"
                        @keydown.enter="searchArticle">
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                                <div class="text-grey lighten-1">{{ item.nom }}</div>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                </v-card-title>
                <v-card-title density="compact">
                    <v-autocomplete :disabled="isUpdating" :items="famille" style="width: 300px" item-title="code"
                        item-value="code" label="Famille" density="compact" clearable v-model="famis" :loading="loading"
                        color="deep-purple-accent-4" @keydown.enter="searchArticle">
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                                <div class="text-grey lighten-1">{{ item.libelle }}</div>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                </v-card-title>

                <!-- <v-card-title density="compact">
                    <v-radio-group v-model="inline" column density="compact">
                        <v-radio density="compact" color="primary" label="Exact" value="r1"></v-radio>
                        <v-radio density="compact" color="primary" label="Contient" value="r2"></v-radio>
                    </v-radio-group>
                </v-card-title> -->
            </v-card-actions>
            <v-progress-linear v-if="load" color="primary" rounded indeterminate height="5" density="compact">
            </v-progress-linear>
            <div style="max-height: 400px; overflow-y: auto;">
                <v-data-table-virtual :headers="headers" :items="articles" height="400" class="blue-header"
                    density="compact" :fixed-header="true" no-data-text="Pas données disponibles" hover="true">
                    <template #item="{ item, isSelected }">
                        <tr :class="{ 'selected-row': isSelected }" @click="showArticleSelect(item)">
                            <td style="width: 30;">{{ item.article }}</td>
                            <td style="width: 300;">{{ item.libelle }}</td>
                            <td style="width: 100;">{{ item.nomLabo }}</td>
                            <td style="width: 80;">{{ item.nomFamille }}</td>
                            <td style="width: 10;">{{ item.colisage }}</td>
                        </tr>
                    </template>
                </v-data-table-virtual>
            </div>
            <v-card density="compact">
                <v-card-text density="compact" class="pa-1 pl-5">
                    <b density="compact"> {{ totalArticles }}</b> Lignes Trouvées </v-card-text>
            </v-card>
        </v-card>
    </v-dialog>
</template>

<script>

import MyTextField from '@/components/MyTextField.vue';
import { useArticleStore } from '@/store/utils/article.js';
import {
    VDataTableVirtual,
}  from "vuetify/lib/components";
import { ref, defineComponent, watchEffect, onMounted, onBeforeUnmount, computed } from "vue";
export default defineComponent({
    props: {
        dialog: {
            type: Boolean,
            required: true,
        },


    },
    components: {
        MyTextField,
        VDataTableVirtual,
    },
    methods: {
        closeDialog() {
            this.$emit('close');
        },
        showArticleSelect(item) {
            this.$emit("getArticle", item);
        }
    },
    name: 'searchArticles',
    setup(props, { emit }) {
        // const inline = ref('r1');
        const items = ref([]);
        const dialog = ref(props.dialog)
        const storeLabo = useArticleStore();
        const listLabo = ref([]);
        const search = ref('');
        const loading = computed(() => storeLabo.loading);
        const select = ref('');
        const famis = ref('');
        const listFamille = ref([]);
        const listArticle = ref([]);
        const codeArticle = ref('');
        const articles = ref([]);
        const libelle = ref('');
        const dci = ref('');
        const nomCommercial = ref('');
        const load = ref(false);

        const handleKeydown = (event) => {
            if (event.key === "Escape") {
                emit("close");
            }
        };


        const labo = computed(() => {
            return listLabo.value.map(depot => ({
                code: depot.code,
                nom: depot.nom,
            }));
        });

        const famille = computed(() => {
            return listFamille.value.map(depot => ({
                code: depot.code,
                libelle: depot.libelle,
            }));
        });

        const headers = [
            { title: 'Code ', align: 'start', key: 'article', width: 30 },
            { title: 'Libellé', align: 'start', key: 'libelle', width: 300 },
            { title: 'Labo', align: 'start', key: 'nomLabo', width: 100 },
            { title: 'Famille', align: 'start', key: 'nomFamille', width: 80 },
            { title: 'Colisage', align: 'start', key: 'colisage', width: 10 },
        ]

        const totalArticles = computed(() => {
            return articles.value.length;
        });

        onMounted(async () => {
            window.addEventListener("keydown", handleKeydown);
            await storeLabo.fetchLabo(' isnull(FOMARQUE,0)=1');
            listLabo.value = storeLabo.labos;
            await storeLabo.fetchFamille();
            listFamille.value = storeLabo.familles;
            await storeLabo.fetchArticle('');
            listArticle.value = storeLabo.articles;
            articles.value = [];
        });

        onBeforeUnmount(() => {
            window.removeEventListener("keydown", handleKeydown);
        });

        const convertToUpperCase = () => {
            codeArticle.value = codeArticle.value?codeArticle.value.toUpperCase():null;
            libelle.value = libelle.value?libelle.value.toUpperCase():null;
            dci.value = dci.value? dci.value.toUpperCase():null;
            nomCommercial.value = nomCommercial.value.toUpperCase();
        };

        const querySelections = (v) => {
            if (v && v.length >= 2) {
                loading.value = true;
                // Simulated ajax query
                setTimeout(() => {
                    items.value = labo.value.filter((e) => {
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




        const searchArticle = async () => {
            try {
                load.value = true;

                articles.value = filteredArticles();
                console.log(articles.value)
            } catch (error) {
                console.error(error);
            } finally {
                load.value = false;
            }
        };


        const filteredArticles = (() => {
            if (
                codeArticle.value ||
                select.value ||
                famis.value ||
                nomCommercial.value ||
                dci.value ||
                libelle.value
            ) {
                return listArticle.value.filter((item) => {
                    return (
                        (!codeArticle.value || (item.article && item.article.trim().toUpperCase().includes(codeArticle.value.trim().toUpperCase()))) &&
                        (!libelle.value || (item.libelle && item.libelle.trim().toUpperCase().includes(libelle.value.trim().toUpperCase()))) &&
                        (!dci.value || (item.dci && item.dci.trim().toUpperCase().includes(dci.value.trim().toUpperCase()))) &&
                        (!nomCommercial.value || (item.nomCom && item.nomCom.trim().toUpperCase().includes(nomCommercial.value.trim().toUpperCase()))) &&
                        (!famis.value || (item.famille && item.famille.trim().toUpperCase() === famis.value.trim().toUpperCase())) &&
                        (!select.value || (item.labo && item.labo.trim().toUpperCase() === select.value.trim().toUpperCase()))
                    );
                });
            } else {
                return listArticle.value;
            }
        });



        return {
            dialog, headers, items, querySelections, search, loading, select, famille, famis, listArticle, codeArticle,
            searchArticle, articles, convertToUpperCase, libelle, dci, nomCommercial, load, totalArticles
        }
    }
});
</script>
<style>
.v-data-table.blue-header .v-table__wrapper>table>thead>tr th,
.v-data-table.blue-header .v-table__wrapper>table tbody>tr th {
    background-color: #b8b3cc;
    white-space: nowrap;
}

.selected-row {
    background-color: #64B5F6;
}
</style>
