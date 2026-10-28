import Expedition_view from '@/views/expedition/factureExped.vue';
import Livraison_view from '@/views/expedition/livraison_view.vue';
import editionLv_view from '@/views/expedition/editionLv_view.vue';
import paramsLv_view from '@/views/expedition/paramsLv_view.vue';
import attribAxe_view from '@/views/expedition/attrib_axe_view.vue';
import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/expedition_view',
        component: Expedition_view,
        name: 'expedition_view',
        beforeEnter: checkSessionID
    },
    {
        path: '/livraison',
        component: Livraison_view,
        name: 'livraison_view',
        beforeEnter: checkSessionID
    },
    {
        path: '/edition',
        component: editionLv_view,
        name: 'editionLv_view',
        beforeEnter: checkSessionID
    },
    {
        path: '/params_lv',
        component: paramsLv_view,
        name: 'paramsLv_view',
        beforeEnter: checkSessionID
    },
    {
        path: '/attrib_axe',
        component: attribAxe_view,
        name: 'attribAxe_view',
        beforeEnter: checkSessionID
    },
];
