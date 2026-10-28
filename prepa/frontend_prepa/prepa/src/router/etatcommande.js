import EtatCommande from '@/views/etatcommande/EtatCommande.vue';
import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/EtatCommande',
        component: EtatCommande,
        name: 'etatcommande',
        beforeEnter: checkSessionID 
    },
]