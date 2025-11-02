import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/auth.service'
import type { Utilisateur, LoginCredentials, UserRole } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<Utilisateur | null>(authService.getCurrentUser())
  const token = ref<string | null>(authService.getToken())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isGerant = computed(() => user.value?.role === 'gerant')
  const isEmploye = computed(() => user.value?.role === 'employe')

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)
      user.value = response.data?.user || null
      token.value = response.data?.token || null
      console.log('isAthenticate', isAuthenticated.value )
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    loading.value = true
    error.value = null

    try {
      const profile = await authService.getProfile()
      user.value = profile
      localStorage.setItem('user', JSON.stringify(profile))
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la récupération du profil'
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    authService.logout()
    user.value = null
    token.value = null
  }

  function hasRole(roles: UserRole | UserRole[]): boolean {
    if (!user.value) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.value.role)
  }

  function hasPermission(permission: string): boolean {
    if (!user.value) return false

    const permissions: Record<string, string[]> = {
      admin: ['*'],
      gerant: [
        'users.view',
        'users.create',
        'users.update',
        'users.delete',
        'clients.view',
        'clients.create',
        'clients.update',
        'clients.delete',
        'commandes.view',
        'commandes.create',
        'commandes.update',
        'stats.view',
        'boutique.manage',
      ],
      employe: [
        'clients.view',
        'clients.create',
        'clients.update',
        'commandes.view',
        'commandes.create',
        'commandes.update',
      ],
    }

    const userPermissions = permissions[user.value.role] || []
    return userPermissions.includes('*') || userPermissions.includes(permission)
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    isAdmin,
    isGerant,
    isEmploye,
    login,
    logout,
    fetchProfile,
    hasRole,
    hasPermission,
  }
})
