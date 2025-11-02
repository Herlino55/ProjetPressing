import apiService from './api.service'
import { API_ENDPOINTS } from '@/config/api'
import type { Client, ApiResponse, UserRole, GetAllModels } from '@/types'

interface ClientsResponse {
  success: boolean
  data: {
    items: Client[]
    totalItems: number
    totalPages: number
    currentPage: number
  }
}

class ClientService {
    async getAll(): Promise<GetAllModels<Client[]>> {
        const response = await apiService.get<ApiResponse<GetAllModels<Client[]>>>(API_ENDPOINTS.CLIENTS.BASE)
        return response.data
    }

    async getAlle(params?: {
    page?: number
    limit?: number
  }): Promise<ClientsResponse> {
    return await apiService.get<ClientsResponse>(API_ENDPOINTS.CLIENTS.BASE, { params })
  }

    async getById(id: number): Promise<ApiResponse<Client>> {
    return await apiService.get<ApiResponse<Client>>(API_ENDPOINTS.CLIENTS.BY_ID(id))
  }

  async create(data: Partial<Client>): Promise<Client> {
    return await apiService.post<Client>(API_ENDPOINTS.CLIENTS.BASE, data)
  }

  async update(id: number, data: Partial<Client>): Promise<Client> {
    return await apiService.put<Client>(API_ENDPOINTS.CLIENTS.BY_ID(id), data)
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return await apiService.delete<ApiResponse<void>>(API_ENDPOINTS.CLIENTS.BY_ID(id))
  }

  async search(query: string, boutiqueId?: number): Promise<ApiResponse<Client[]>> {
    const params: any = { q: query }
    if (boutiqueId) {
      params.boutiqueId = boutiqueId
    }
    return await apiService.get<ApiResponse<Client[]>>(API_ENDPOINTS.CLIENTS.SEARCH, { params })
  }
}

export default new ClientService()