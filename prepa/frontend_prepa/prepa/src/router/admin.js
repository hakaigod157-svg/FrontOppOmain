import GestionAcces from '@/views/admin/GestionAcces';
import useCheckSessionID from '@/composables/useCheckSessionID';
const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/GestionAcces',
        component: GestionAcces,
        name: 'gestionAcces',
        beforeEnter: checkSessionID 
    },
]