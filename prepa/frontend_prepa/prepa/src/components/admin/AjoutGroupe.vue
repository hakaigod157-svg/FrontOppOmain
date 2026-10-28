<template  >
    <v-dialog v-model="dialog" persistent density="compact" transition="dialog-bottom-transition" width="500"
        :style="{ height: '700px' }">
        <v-card density="compact" flat>
            <v-toolbar dark color="primary" density="compact">
                <v-toolbar-title>Ajout d'un Groupe</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeDialog" density="compact">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form @submit="valider">
                <v-card-actions density="compact">
                    <v-card-title density="compact">
                        <MyTextField name_lab_text="Groupe" :error-messages="groupeErrorMessages" hide-details="auto"
                             style="width: 400px" v-model="groupe" >
                        </MyTextField>
                    </v-card-title>
                </v-card-actions>
                <v-card-actions density="compact">
                    <v-card-title density="compact">
                        <MyTextField name_lab_text="Description" style="width: 400px" hide-details="auto"
                            :error-messages="descriptionErrorMessages" v-model="description">
                        </MyTextField>
                    </v-card-title>
                </v-card-actions>
                <v-card-actions class="d-flex justify-end">
                    <v-btn variant="tonal" color="error" @click="annuler" density="compact" size="large"
                        prepend-icon="mdi-cancel" class="text-none mb-2">
                        Annuler
                    </v-btn>
                    <v-btn variant="tonal" color="green-darken-3" type="submit" density="compact" class="text-none mb-2"
                        prepend-icon="mdi-check" size="large">
                        Valider
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>

import MyTextField from '@/components/MyTextField.vue';
import { ref, defineComponent, watchEffect, onMounted, onBeforeUnmount, computed, reactive } from "vue";
import { useGroupeStore } from '@/store/Admins/Groupe.js';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup'
export default defineComponent({
    props: {
        dialog: {
            type: Boolean,
            required: true,
        },
        listGroupes: Array,


    },
    components: {
        MyTextField,
    },

    name: 'ajoutGroupe',
    setup(props, { emit }) {

        const dialog = ref(props.dialog)
        const list = props.listGroupes;
        const store = useGroupeStore();

        const formState = reactive({
            groupe: '',
            description: '',
        })

        const closeDialog = () => {
            emit('close');
        };

        const annuler = () => {
            emit('close');
        };
        const { handleSubmit } = useForm();
        const description = useField('description', yup.string().required('Decription est un champ obligatoire.'))

        const groupe = useField('groupe', (value) => {
            if(!value){
                return 'Groupe est un champ obligatoire';
            } 
            const lowerCaseValue = value.toLowerCase().trim();
            const lowerCaseExistingNames = list.map(name => name.code.toLowerCase());

            if (!lowerCaseExistingNames.includes(lowerCaseValue)) {
                return true;
            } else {
                return 'Cette valeur ' + lowerCaseValue + ' est déjà incluse dans la liste du groupe';
            }
        });


        const valider = handleSubmit(async (values) => {
            console.log(values.groupe);
            console.log(values.description);
            if (values.groupe.length > 0) {

                const group = {
                    code: values.groupe,
                    libelle: values.description,
                };
                await store.insert_groupe(group);
                emit('valide',values);
            }
        });


        const groupeErrorMessages = groupe.errorMessage;
        const descriptionErrorMessages = description.errorMessage;


        const checkListA = (value) => {
            if (!value) {
                return true;
            }
            const lowercaseListA = list.map((item) => item.code.toLowerCase());
            const lowercaseValue = value.toLowerCase().trim();
            if (lowercaseListA.includes(lowercaseValue)) {
                return 'Cette valeur ' + lowercaseValue + ' est déjà incluse dans la liste du Groupe';
            }

            return true;
        };


        return {
            groupe: groupe.value, description: description.value, dialog, checkListA, list, closeDialog,
            annuler,
            valider,
             groupeErrorMessages, descriptionErrorMessages

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
