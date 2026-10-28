<template>
    <v-card>
        <v-list density="comfortable">
            <v-list-subheader class="pa-0.5 text-body-2 text-decoration-underline"><strong>{{ titre_list
            }}</strong></v-list-subheader>
            <v-list-item class="pa-0.5 text-body-2" v-for="(item, index) in items_list" :key="index"
                :style="{ backgroundColor: item.color }">
                <v-list-item-content> {{ item.text }} </v-list-item-content>     
            </v-list-item>

        </v-list>
    </v-card>
</template>

<script>
export default ({
    props: {
        items_list: Object,
        titre_list: String,
    },
})
</script>
<style>
.v-list-item--density-comfortable.v-list-item--one-line {
    min-height: 28px;
}

.v-list--density-comfortable .v-list-subheader {
    min-height: 28px;
    -webkit-padding-start: calc(16px + var(--indent-padding)) !important;
    padding-inline-start: calc(16px + var(--indent-padding)) !important;
}

.v-list {
    padding: 0px 0;
}</style>