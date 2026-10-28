import Facturio from '@/views/suivifacturation/facturio.vue';

import useCheckSessionID from '@/composables/useCheckSessionID';


const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/facturio',
        component: Facturio,
        name: 'facturio',
        beforeEnter: checkSessionID 
    },
]