<template>
    <v-combobox :value="value_text" :items="items" :label="comb_lab" :item-text="text_items" color='deep-purple-accent-4'></v-combobox>
</template>
<script>
export default ({
    props: {
        items:Object,
        comb_lab: String,
        value_text: String,
        text_items: String,

    },
})

</script> 