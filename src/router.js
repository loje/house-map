import Vue from 'vue'
import Router from 'vue-router'

const Index = (r) => require.ensure([], () => r(require('@/views/index')), 'init');

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
  ]
})
