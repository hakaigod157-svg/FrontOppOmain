import CmdAvalider from '@/views/adv/PageCmdAvalider.vue'
import CmdValider from '@/views/adv/PageCmdValider.vue'
import BonALivrer from '@/views/adv/PageBonAlivrer.vue'
import CmdTraite from '@/views/adv/PageCmdTraite.vue'
import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [

    {
        path: '/CmdAvalider',
        component: CmdAvalider,
        name: 'cmdavalider',
        beforeEnter: checkSessionID 
    },
    {
        path: '/CmdValider',
        component: CmdValider,
        name: 'cmdvalider',
        beforeEnter: checkSessionID 
    },
    {
        path: '/BonALivrer',
        component: BonALivrer,
        name: 'bonalivrer',
        beforeEnter: checkSessionID 
    },
    {
        path: '/CmdTraite',
        component: CmdTraite,
        name: 'cmdtraite',
        beforeEnter: checkSessionID 
    },
]