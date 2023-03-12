import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // make all paths and names lowercase for consistency
  routes: [
    {
      path: '/',
      props: true,
      component: () => import('../components/homePage.vue')
    },
    {
      path: '/intakeform',
      name: 'intakeform',
      props: true,
      component: () => import('../components/intakeForm.vue')
    },
    {
      path: '/findclient',
      name: 'findclient',
      component: () => import('../components/findClient.vue')
    },
    {
      path: '/updateclient/:id',
      name: 'updateclient',
      props: true,
      component: () => import('../components/updateClient.vue')
    },
    {
      path: '/eventform',
      name: 'eventform',
      component: () => import('../components/eventForm.vue')
    },
    {
      path: '/findevents',
      name: 'findevents',
      component: () => import('../components/findEvents.vue')
    },
    {
      path: '/eventdetails/:id',
      name: 'eventdetails',
      props: true,
      component: () => import('../components/eventDetails.vue')
    },
    {
      path: '/loginView',
      name: 'loginView',
      props: true,
      component: () => import('../components/loginView.vue')
    },
    {
      path: '/eventservices',
      name: 'eventservices',
      props: true,
      component: () => import('../components/eventServices.vue')
    },
    {
      path: '/registeruser',
      name: 'registeruser',
      props: true,
      component: () => import('../components/registerUser.vue')
    }
   
  ]
})
export default router
