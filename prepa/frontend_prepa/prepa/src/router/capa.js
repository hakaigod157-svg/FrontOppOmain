// capa.js
import Capa_view from '@/views/capa/capa_view.vue';
import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/capa_view',
        component: Capa_view,
        name: 'capa_view',
        beforeEnter: checkSessionID
    },
];
