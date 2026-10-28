import Lien_view from '@/views/lien/lien.vue';
import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/lien_view',
        component: Lien_view,
        name: 'Lien_view',
        beforeEnter: checkSessionID
    },
];