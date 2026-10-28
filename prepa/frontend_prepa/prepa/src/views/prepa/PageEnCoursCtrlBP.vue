<template >
    <PageCommunBP etape="CtrlBP" etat_bp="3"></PageCommunBP>

</template>
<script>
import PageCommunBP from './PageCommunBP.vue';
import { ref, reactive, onMounted, computed, onBeforeMount, defineComponent, watch } from "vue";
export default defineComponent({
    components: {
        PageCommunBP,
    },
    name: "enCoursCtrlBP"
});
</script>