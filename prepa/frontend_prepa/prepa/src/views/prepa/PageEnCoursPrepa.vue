<template >
    <PageCommunPrep etape="Prep" prepspecif="0" isVisible="0" ></PageCommunPrep>

</template>
<script>
import PageCommunPrep from './PageCommunPrep.vue';
import { ref, reactive, onMounted, computed, onBeforeMount, defineComponent, watch } from "vue";
export default defineComponent({
    components: {
        PageCommunPrep,
    },
    name: "enCoursPrepa"
});
</script>