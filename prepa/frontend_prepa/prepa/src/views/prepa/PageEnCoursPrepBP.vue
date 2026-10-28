<template >
    <PageCommunBP etape="PrepBP" etat_bp="1" :isprint="true" ></PageCommunBP>
</template>
<script>
import PageCommunBP from './PageCommunBP.vue';
import { ref, reactive, onMounted, computed, onBeforeMount, defineComponent, watch } from "vue";
export default defineComponent({
    components: {
        PageCommunBP,
    },
    name: "enCoursPrepBP"
});
</script>