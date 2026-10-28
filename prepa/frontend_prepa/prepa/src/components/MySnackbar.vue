<template>
    <div class="text-center">
        <v-snackbar v-model="snackbarVisible" vertical v-if="isVoir">
            <div class="text-subtitle-1 pb-2">{{ titre }}</div>
            <p>{{ contenu }}</p>
            <template v-slot:actions>
                <v-btn icon dark @click="closeSnackbar">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import { ref,defineComponent } from 'vue';

export  default defineComponent( {
    props: {
        titre:String,
        contenu:String,
        isVoir: {
            Boolean,
            default: false
        }
    },
    setup() {
        const snackbarVisible = ref(false);

        const closeSnackbar = () => {
            snackbarVisible.value = false;
            isVoir.value =false;
        };

        return {
            snackbarVisible,
            closeSnackbar,isVoir
        };
    },
})
</script>
