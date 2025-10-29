import apiService from './api.service'
import { API_ENDPOINTS } from '@/config/api'
import type { ApiResponse, Stats } from '@/types'

class StatsService {
  async getGlobalStats(): Promise<ApiResponse<Stats>> {
    return await apiService.get<ApiResponse<Stats>>(API_ENDPOINTS.STATS.GLOBAL)
  }

  async getStatsByBoutique(boutiqueId: number): Promise<ApiResponse<Stats>> {
    return await apiService.get<ApiResponse<Stats>>(API_ENDPOINTS.STATS.BY_BOUTIQUE(boutiqueId))
  }

  async getStatsByPeriod(startDate: string, endDate: string): Promise<any> {
    return await apiService.get<any>(API_ENDPOINTS.STATS.BY_PERIOD, {
      params: { startDate, endDate }
    })
  }

  async getTopClients(limit: number = 10): Promise<any[]> {
    return await apiService.get<any[]>(API_ENDPOINTS.STATS.TOP_CLIENTS, {
      params: { limit }
    })
  }

  async getTopVetements(limit: number = 10): Promise<any[]> {
    return await apiService.get<any[]>(API_ENDPOINTS.STATS.TOP_VETEMENTS, {
      params: { limit }
    })
  }
}

export default new StatsService()
