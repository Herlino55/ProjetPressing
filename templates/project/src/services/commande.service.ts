import apiService from './api.service'
import { API_ENDPOINTS } from '@/config/api'
import type { Commande, ApiResponse, UserRole, GetAllModels } from '@/types'

class CommandeService {
    /*async getAll(): Promise<ApiResponse<Commande[]>> {
        return await apiService.get<ApiResponse<Commande[]>>(API_ENDPOINTS.COMMANDES.BASE)
    }

    async getAllCommandeByBoutique(boutiqueId: number): Promise<ApiResponse<Commande[]>> {
        return await apiService.get<ApiResponse<Commande[]>>(API_ENDPOINTS.COMMANDES.BY_BOUTIQUE(boutiqueId))
    }*/

    async getAll( role?: UserRole): Promise<ApiResponse<GetAllModels<Commande[]>>> {
        if(role === 'admin')
            return await apiService.get<ApiResponse<GetAllModels<Commande[]>>>(API_ENDPOINTS.COMMANDES.BASE)
        else
            return await apiService.get<ApiResponse<GetAllModels<Commande[]>>>(API_ENDPOINTS.COMMANDES.BY_BOUTIQUE)
    }
}
export default new CommandeService()