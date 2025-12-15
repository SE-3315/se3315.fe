import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import CreatePatientView from '../views/CreatePatientView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/create-patient',
      name: 'create-patient',
      component: CreatePatientView
    },
    {
      path: '/patients',
      name: 'patients',
      component: () => import('../views/PatientListView.vue')
    },
    {
      path: '/doctors',
      name: 'doctors',
      component: () => import('../views/DoctorListView.vue')
    },
    {
      path: '/departments',
      name: 'departments',
      component: () => import('../views/DepartmentListView.vue')
    }
  ],
})

// Route guards
router.beforeEach((to, from, next) => {
  const openRoutes = ['/login']
  const auth = useAuthStore()
  auth.checkAuth()
  if (!auth.user && !openRoutes.includes(to.path)) {
    next('/login')
  } else if (auth.user && to.path === '/login') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
