import apiService from './api.service'
import { API_ENDPOINTS } from '@/config/api'
import type { LoginCredentials, AuthResponse, Utilisateur, ApiResponse } from '@/types'

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.LOGIN, credentials)

    if (response.data?.token && response.data?.user) {
      localStorage.setItem('token', response.data?.token)
      localStorage.setItem('user', JSON.stringify(response.data?.user))
    }

    return response
  }

  async getProfile(): Promise<Utilisateur> {
    return await apiService.get<Utilisateur>(API_ENDPOINTS.AUTH.PROFILE)
  }

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  getCurrentUser(): Utilisateur | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export default new AuthService()
