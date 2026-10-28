import LoginPage from '@/views/LoginPage'
import AccueilPage from '@/views/AccueilPage.vue'
import useCheckSessionID from '@/composables/useCheckSessionID';

const { checkSessionID } = useCheckSessionID();

export default [
    {
        name: 'Home',
        path: '/',
        redirect: '/LoginPage',
        beforeEnter: checkSessionID 
      },
      {
        path: '/AccueilPage',
        component: AccueilPage,
        name: 'AccueilPage',
        beforeEnter: checkSessionID 
      },
      {
        path: '/LoginPage',
        component: LoginPage,
        name: 'login',
        beforeEnter: checkSessionID 
      },
  
      
]