import { createRouter, createWebHistory } from 'vue-router'
import UsersView from '../views/UsersView.vue'
import EmployeesView from '../views/EmployeesView.vue'
import RolesView from '../views/RolesView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/users' },
    { path: '/users', component: UsersView },
    { path: '/employees', component: EmployeesView },
    { path: '/roles', component: RolesView }
  ]
})