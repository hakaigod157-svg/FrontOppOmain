import Rh from '@/views/rh/rh.vue';
import Pagedemande from '@/views/rh/pagedemande.vue';
import Pagerecrutement from '@/views/rh/pageRecrutement.vue';
import PageCVglobal from '@/views/rh/pageCv.vue';
import PageIntegration from '@/views/rh/pageIntegration.vue';
import PageEmployee from '@/views/rh/pageEmployee.vue';
import PageParams from '@/views/rh/pageParams.vue';
import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [
  {
    path: '/rh',
    name: 'rh',
    component: Rh,
    beforeEnter: checkSessionID,
    children: [
      {
        path: 'demande',       
        name: 'rh-demande',
        component: Pagedemande
      },
      {
        path: '',             
        redirect: { name: 'rh-demande' }
      },
      {
        path: 'recrutement',       
        name: 'rh-recrutement',
        component: Pagerecrutement
      },
      {
        path: 'cv',       
        name: 'rh-cv',
        component: PageCVglobal
      },
      {
        path: 'integration',       
        name: 'rh-integration',
        component: PageIntegration
      },
      {
        path: 'employee',       
        name: 'rh-employee',
        component: PageEmployee
      },
      {
        path: 'params',       
        name: 'rh-params',
        component: PageParams
      },
      {
        path: '',             
        redirect: { name: 'rh-demande' }
      }
    ]
  }
];
