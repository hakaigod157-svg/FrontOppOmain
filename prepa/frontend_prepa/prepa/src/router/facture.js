import Facture from '@/views/facture/facture.vue'
import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/facture',
        component: Facture,
        name: 'facture',
        beforeEnter: checkSessionID 
    },
]