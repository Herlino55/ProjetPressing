import apiService from './api.service'
import { API_ENDPOINTS } from '@/config/api'
import type { Rappel, CreateRappelData, RappelResponse, ApiResponse } from '@/types'

class RappelService {
  async create(data: CreateRappelData): Promise<ApiResponse<RappelResponse>> {
    return await apiService.post<ApiResponse<RappelResponse>>(API_ENDPOINTS.RAPPELS.BASE, data)
  }

  async getAll(params?: {
    page?: number
    limit?: number
    boutiqueId?: number
    type?: string
    statut?: string
  }): Promise<{ success: boolean; data: { items: Rappel[]; count: number; totalPages: number; currentPage: number } }> {
    return await apiService.get<any>(API_ENDPOINTS.RAPPELS.BASE, { params })
  }

  async getById(id: number): Promise<ApiResponse<Rappel>> {
    return await apiService.get<ApiResponse<Rappel>>(API_ENDPOINTS.RAPPELS.BY_ID(id))
  }

  async getByBoutique(boutiqueId: number): Promise<Rappel[]> {
    const response = await apiService.get<{ success: boolean; data: Rappel[] }>(
      API_ENDPOINTS.RAPPELS.BY_BOUTIQUE(boutiqueId)
    )
    return response.data
  }

  async getByClient(clientId: number): Promise<Rappel[]> {
    const response = await apiService.get<{ success: boolean; data: Rappel[] }>(
      API_ENDPOINTS.RAPPELS.BY_CLIENT(clientId)
    )
    return response.data
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(API_ENDPOINTS.RAPPELS.BY_ID(id))
  }

  openWhatsApp(url: string) {
    window.open(url, '_blank')
  }
}

export default new RappelService()
