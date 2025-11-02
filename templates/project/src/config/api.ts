export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/utilisateurs/login',
    REGISTER: '/utilisateurs/register',
    PROFILE: '/utilisateurs/profile',
  },
  BOUTIQUES: {
    BASE: '/boutiques',
    BY_ID: (id: number) => `/boutiques/${id}`,
    HISTORIQUE: (id: number) => `/boutiques/${id}/historique`,
  },
  UTILISATEURS: {
    BASE: '/utilisateurs',
    BY_ID: (id: number) => `/utilisateurs/${id}`,
    Update: (id: number) => `/utilisateurs/${id}`,
    UpdatePassword: '/utilisateurs/password/',
  },
  CLIENTS: {
    BASE: '/clients',
    BY_ID: (id: number) => `/clients/${id}`,
    SEARCH: '/clients/search',
  },
  VETEMENTS: {
    BASE: '/vetements',
    BY_ID: (id: number) => `/vetements/${id}`,
  },
  COMMANDES: {
    BASE: '/commandes',
    BY_ID: (id: number) => `/commandes/${id}`,
    BY_CLIENT: (clientId: number) => `/commandes/client/${clientId}`,
    BY_BOUTIQUE: '/commandes/boutique/',
    UPDATE_STATUS: (id: number) => `/commandes/${id}/status`,
  },
  COMMANDE_DETAILS: {
    BY_COMMANDE: (commandeId: number) => `/commande-details/commande/${commandeId}`,
    ADD: '/commande-details',
    UPDATE: (id: number) => `/commande-details/${id}`,
    DELETE: (id: number) => `/commande-details/${id}`,
  },
  PAIEMENTS: {
    BASE: '/paiements',
    BY_ID: (id: number) => `/paiements/${id}`,
    BY_COMMANDE: (commandeId: number) => `/paiements/commande/${commandeId}`,
    BY_BOUTIQUE: (boutiqueId: number) => `/paiements/boutique/${boutiqueId}`,
  },
  TARIFS: {
    BASE: '/tarifs',
    BY_ID: (id: number) => `/tarifs/${id}`,
    BY_VETEMENT: (vetementId: number) => `/tarifs/vetement/${vetementId}`,
  },
  HISTORIQUE: {
    GLOBAL: '/historique',
    BY_BOUTIQUE: (boutiqueId: number) => `/historique/boutique/${boutiqueId}`,
    BY_UTILISATEUR: (userId: number) => `/historique/utilisateur/${userId}`,
  },
  STATS: {
    GLOBAL: '/stats/global',
    BY_BOUTIQUE: (boutiqueId: number) => `/stats/boutique/${boutiqueId}`,
    BY_PERIOD: '/stats/period',
    TOP_CLIENTS: '/stats/top-clients',
    TOP_VETEMENTS: '/stats/top-vetements',
  },
  RAPPELS: {
    BASE: '/rappels',
    BY_ID: (id: number) => `/rappels/${id}`,
    BY_BOUTIQUE: (boutiqueId: number) => `/rappels/boutique/${boutiqueId}`,
    BY_CLIENT: (clientId: number) => `/rappels/clients/${clientId}`,
  },
}
