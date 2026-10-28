import Inventaire_view from '@/views/inventaire/PageEmplacementDesactive.vue';
import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/inventaire_view',
        component: Inventaire_view,
        name: 'inventaire_view',
        beforeEnter: checkSessionID
    },
];
