import TransfertRotation from '@/views/transfert/Rotation.vue';
import TransfertIncomplet from '@/views/transfert/ColisIncomplet.vue';
import TransfertPetit from '@/views/transfert/PetitColis.vue';
import TransfertRange from '@/views/transfert/Rangement.vue';
import TransfertReappro from  '@/views/transfert/ConseilReapp.vue';
import useCheckSessionID from '@/composables/useCheckSessionID';
import SuiviTD from '@/views/transfert/SuiviTD';
import TransEmplLot from '@/views/transfert/TransEmplLot';

const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/Rotation',
        component: TransfertRotation,
        name: 'rotation',
        beforeEnter: checkSessionID 
    },

    {
        path: '/ColisIncomplet',
        component: TransfertIncomplet,
        name: 'colisIncomplet',
        beforeEnter: checkSessionID 
    },

    {
        path: '/PetitColis',
        component: TransfertPetit,
        name: 'petitColis',
        beforeEnter: checkSessionID 
    },

    {
        path: '/Rangement',
        component: TransfertRange,
        name: 'rangement',
        beforeEnter: checkSessionID 
    },

    {
        path: '/ConseilReappro',
        component: TransfertReappro,
        name: 'conseilReappro',
        beforeEnter: checkSessionID 
    },
    {
        path: '/SuiviTD',
        component: SuiviTD,
        name: 'SuiviTD',
        beforeEnter: checkSessionID 
    },
    {
        path: '/TransEmplLot',
        component: TransEmplLot,
        name: 'TransEmplLot',
        beforeEnter: checkSessionID 
    }

]