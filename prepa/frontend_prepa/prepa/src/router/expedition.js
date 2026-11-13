import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/expedition_view',
        component: () => import('@/views/expedition/factureExped.vue'),
        name: 'expedition_view',
        beforeEnter: checkSessionID
    },
    {
        path: '/livraison',
        component: () => import('@/views/expedition/livraison_view.vue'),
        name: 'livraison_view',
        beforeEnter: checkSessionID
    },
    {
        path: '/edition',
        component: () => import('@/views/expedition/editionLv_view.vue'),
        name: 'editionLv_view',
        beforeEnter: checkSessionID
    },
    {
        path: '/params_lv',
        component: () => import('@/views/expedition/paramsLv_view.vue'),
        name: 'paramsLv_view',
        beforeEnter: checkSessionID
    },
    {
        path: '/attrib_axe',
        component: () => import('@/views/expedition/attrib_axe_view.vue'),
        name: 'attribAxe_view',
        beforeEnter: checkSessionID
    },
];
