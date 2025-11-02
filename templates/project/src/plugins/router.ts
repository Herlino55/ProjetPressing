import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'utilisateurs',
        name: 'Utilisateurs',
        component: () => import('@/views/utilisateurs/UtilisateursList.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin', 'gerant'] as UserRole[],
        },
      },
      {
        path: 'utilisateurs/nouveau',
        name: 'NouvelUtilisateur',
        component: () => import('@/views/utilisateurs/UtilisateurForm.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin', 'gerant'] as UserRole[],
        },
      },
      {
        path: 'utilisateurs/:id',
        name: 'ModifierUtilisateur',
        component: () => import('@/views/utilisateurs/UtilisateurForm.vue'),
        meta: {
          requiresAuth: true,
          roles: ['admin', 'gerant'] as UserRole[],
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'rappels',
        name: 'Rappels',
        component: () => import('@/views/rappels/RappelsList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'clients',
        name: 'Clients',
        component: () => import('@/views/clients/ClientsList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'clients/nouveau',
        name: 'NouveauClient',
        component: () => import('@/views/clients/ClientForm.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'clients/:id',
        name: 'ModifierClient',
        component: () => import('@/views/clients/ClientForm.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  console.log('Route guard:', to.name, 'isAuthenticated:', authStore.isAuthenticated)

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else if (to.meta.roles) {
    const roles = to.meta.roles as UserRole[]
    if (authStore.hasRole(roles)) {
      next()
    } else {
      next({ name: 'Dashboard' })
    }
  } else {
    next()
  }
})

export default router
