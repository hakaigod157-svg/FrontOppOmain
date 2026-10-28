import Catalogue_view from '@/views/catalogue/catalogue.vue';
import CodeBarre_view from '@/views/catalogue/code_barre.vue';
import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/catalogue_view',
        component: Catalogue_view,
        name: 'catalogue_view',
        beforeEnter: checkSessionID
    },
    {
        path: '/codeBarre_view',
        component: CodeBarre_view,
        name: 'codeBarre_view',
        beforeEnter: checkSessionID
    },
];