import Suivi_anomalie from '@/views/capa/suivi_anomalie.vue';
import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/suivi_anomalie',
        component: Suivi_anomalie,
        name: 'suivi_anomalie',
        beforeEnter: checkSessionID
    },
];
