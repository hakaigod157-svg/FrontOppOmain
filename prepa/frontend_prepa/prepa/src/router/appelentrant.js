import AppelEntrant from '@/views/suivifacturation/AppelEntrant.vue';
import useCheckSessionID from '@/composables/useCheckSessionID';


const { checkSessionID } = useCheckSessionID();

export default [

    {
        path: '/appelentrant',
        component: AppelEntrant,
        name: 'appelentrant',
        beforeEnter: checkSessionID 
    },
]