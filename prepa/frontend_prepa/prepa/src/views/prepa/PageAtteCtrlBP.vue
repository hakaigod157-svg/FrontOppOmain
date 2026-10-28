<template >
    <PageCommunBP etape="atteCtrlBP" etat_bp="2"></PageCommunBP>

</template>
<script>
import PageCommunBP from './PageCommunBP.vue';
import { ref, reactive, onMounted, computed, onBeforeMount, defineComponent, watch } from "vue";
export default defineComponent({
    components: {
        PageCommunBP,
    },
    name: "AtteCtrlBP"
});
</script>