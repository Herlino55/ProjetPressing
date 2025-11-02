import apiService from './api.service'
import { API_ENDPOINTS } from '@/config/api'
import type { Utilisateur, ApiResponse } from '@/types'
import { da } from 'vuetify/locale'

class UtilisateurService {
  async getAll(): Promise<ApiResponse<Utilisateur[]>> {
    return await apiService.get<ApiResponse<Utilisateur[]>>(API_ENDPOINTS.UTILISATEURS.BASE)
  }

  async getById(id: number): Promise<ApiResponse<Utilisateur>> {
    return await apiService.get<ApiResponse<Utilisateur>>(API_ENDPOINTS.UTILISATEURS.BY_ID(id))
  }

  async create(data: Partial<Utilisateur>): Promise<Utilisateur> {
    return await apiService.post<Utilisateur>(API_ENDPOINTS.UTILISATEURS.BASE, data)
  }

  async update(id: number, data: Partial<Utilisateur>): Promise<Utilisateur> {
    return await apiService.put<Utilisateur>(API_ENDPOINTS.UTILISATEURS.BY_ID(id), data)
  }

  async updatePassword(data: {oldPassword: string, newPassword: string} ): Promise<any> {
    return await apiService.put<any>(API_ENDPOINTS.UTILISATEURS.UpdatePassword, data)
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(API_ENDPOINTS.UTILISATEURS.BY_ID(id))
  }
}

export default new UtilisateurService()
