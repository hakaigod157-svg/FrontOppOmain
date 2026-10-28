import PageAttePrepa from '@/views/prepa/PageAttePrepa.vue';
import PageAtteCtrl from '@/views/prepa/PageAtteCtrl';
import PageEnCoursPrepa from '@/views/prepa/PageEnCoursPrepa.vue';
import PageEnCoursCtrl from '@/views/prepa/PageEnCoursCtrl';
import PageEmballage from '@/views/prepa/PageEmballage';
import voirCmd from '@/views/prepa/VoirCmd';
import preparerCmd from '@/views/prepa/PreparerCmd';
import useCheckSessionID from '@/composables/useCheckSessionID';
import enCoursPrepBP from '@/views/prepa/PageEnCoursPrepBP';
import PageAtteCtrlBP from '@/views/prepa/PageAtteCtrlBP';
import PageEnCoursCtrlBP from '@/views/prepa/PageEnCoursCtrlBP';
import PagePrepPartiel from '@/views/prepa/PagePrepPartiel';

import voirBP from '@/views/prepa/VoirBP.vue';


const { checkSessionID } = useCheckSessionID();

export default [
    {
        path: '/PageAttePrepa',
        component: PageAttePrepa,
        name: 'attePrepa',
        beforeEnter: checkSessionID 
    },
    {
        path: '/PageEnCoursPrepa',
        component: PageEnCoursPrepa,
        name: 'enCoursPrepa',
        beforeEnter: checkSessionID 
    },
    {
        path: '/PageAtteCtrl',
        component: PageAtteCtrl,
        name: 'atteCtrl',
        beforeEnter: checkSessionID 
    },
    {
        path: '/PageEnCoursCtrl',
        component: PageEnCoursCtrl,
        name: 'enCoursCtrl',
        beforeEnter: checkSessionID 
    },
    {
        path: '/PageEmballage',
        component: PageEmballage,
        name: 'emballage',
        beforeEnter: checkSessionID 
    },
    {
        path: '/voirCmd-:CC',
        component: voirCmd,
        name: 'voirCmd',
        beforeEnter: checkSessionID 
    },

    {
        path: '/voirBP-:BP',
        component: voirBP,
        name: 'voirBP',
        beforeEnter: checkSessionID 
    },

    {
        path: '/preparerCmd-:CC',
        component: preparerCmd,
        name: 'preparerCmd',
        beforeEnter: checkSessionID 
        
    },
    {
        path: '/PageEnCoursPrepBP',
        component: enCoursPrepBP,
        name: 'enCoursPrepBP',
        beforeEnter: checkSessionID 
        
    },



    {
        path: '/PageAtteCtrlBP',
        component: PageAtteCtrlBP,
        name: 'AtteCtrlBP',
        beforeEnter: checkSessionID 
        
    },
    {
        path: '/PageEnCoursCtrlBP',
        component: PageEnCoursCtrlBP,
        name: 'enCoursCtrlBP',
        beforeEnter: checkSessionID 
        
    },
    {
        path: '/PagePrepPartiel',
        component: PagePrepPartiel,
        name: 'prepPartiel',
        beforeEnter: checkSessionID 
        
    },
];

