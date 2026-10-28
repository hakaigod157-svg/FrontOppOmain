<template>
    <v-text-field :label="name_lab_text" :hint="hint_text" :type="type_text" variant="underlined" density="compact"
        color="deep-purple-accent-4"  clearable />
</template>
<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
    props: {
        name_lab_text: String,
        hint_text: String,
        type_text: String,
    },
    // setup(props, { emit }) {

    //     const text = ref(props.value);

    //     const convertToUpperCase = () => {
    //         text.value = text.value.toUpperCase();
    //         console.log(text.value )
    //         emit('update:value', text.value);
    //     };



    //     return {
    //         text, convertToUpperCase

    //     }
    // }
})


</script>  