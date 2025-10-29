import apiService from './api.service'
import { API_ENDPOINTS } from '@/config/api'
import type { Utilisateur, ApiResponse } from '@/types'

class UtilisateurService {
  async getAll(): Promise<Utilisateur[]> {
    return await apiService.get<Utilisateur[]>(API_ENDPOINTS.UTILISATEURS.BASE)
  }

  async getById(id: number): Promise<Utilisateur> {
    return await apiService.get<Utilisateur>(API_ENDPOINTS.UTILISATEURS.BY_ID(id))
  }

  async create(data: Partial<Utilisateur>): Promise<Utilisateur> {
    return await apiService.post<Utilisateur>(API_ENDPOINTS.UTILISATEURS.BASE, data)
  }

  async update(id: number, data: Partial<Utilisateur>): Promise<Utilisateur> {
    return await apiService.put<Utilisateur>(API_ENDPOINTS.UTILISATEURS.BY_ID(id), data)
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(API_ENDPOINTS.UTILISATEURS.BY_ID(id))
  }
}

export default new UtilisateurService()
