<template>
    <v-textarea :label="name_lab_area" :hint="hint_area"  :rules="rules_area" density="compact" color="deep-purple-accent-4" clearable
   />
</template>
<script>
export default ({
    props: {
        name_lab_area: String,
        hint_area: String,
        rules_area: String,

    },
})

</script>  