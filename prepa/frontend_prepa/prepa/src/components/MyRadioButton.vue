<template>
    <v-radio :label="label_radio" :value="value_radio" density="compact"
        color="green"   />
</template>
<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
    props: {
        
        label_radio: String,
        value_radio: Number,
        
    },

})


</script>  