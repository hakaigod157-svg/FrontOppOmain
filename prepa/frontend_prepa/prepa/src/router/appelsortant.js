import AppelSortant from '@/views/suivifacturation/AppelSortant.vue';
import useCheckSessionID from '@/composables/useCheckSessionID';


const { checkSessionID } = useCheckSessionID();

export default [

    {
        path: '/appelsortant',
        component: AppelSortant,
        name: 'appelsortant',
        beforeEnter: checkSessionID 
    },
]



