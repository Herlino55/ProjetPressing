export enum UserRole {
  ADMIN = 'admin',
  GERANT = 'gerant',
  EMPLOYE = 'employe'
}

// export enum UserStatus {
//   ACTIF = 'true',
//   INACTIF = 'false'
// }

export enum CommandeStatus {
  EN_ATTENTE = 'en_attente',
  EN_COURS = 'en_cours',
  TERMINE = 'termine',
  LIVRE = 'livre',
  ANNULE = 'annule'
}

export enum PaiementStatus {
  EN_ATTENTE = 'en_attente',
  PARTIEL = 'partiel',
  COMPLET = 'complet'
}

export enum PaiementMethod {
  ESPECES = 'especes',
  CARTE = 'carte',
  MOBILE = 'mobile_money',
  VIREMENT = 'virement'
}

export enum RappelType {
  COMMANDE_PRETE = 'commande_prete',
  NON_RETRAIT = 'non_retrait',
  FIDELISATION = 'fidelisation',
  PAIEMENT = 'paiement',
  ALERTE_RENDEMENT = 'alerte_rendement'
}

export enum RappelStatus {
  ENVOYE = 'envoyé',
  ECHEC = 'échec'
}

export enum RappelCanal {
  WHATSAPP = 'whatsapp'
}

export interface Boutique {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  boutiqueId?: number;
  boutique?: Boutique;
  actif: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  id: number;
  boutiqueId: number;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vetement {
  id: number;
  nom: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tarif {
  id: number;
  boutiqueId: number;
  vetementId: number;
  service: string;
  prix: number;
  createdAt: string;
  updatedAt: string;
  vetement?: Vetement;
}

export interface Commande {
  id: number;
  boutiqueId: number;
  clientId: number;
  utilisateurId: number;
  numeroCommande: string;
  dateDepot: string;
  dateRetrait: string;
  statut: CommandeStatus;
  montantTotal: number;
  montantPaye: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  client?: Client;
  utilisateur?: Utilisateur;
  boutique?: Boutique;
  details?: CommandeDetail[];
  paiements?: Paiement[];
}

export interface Rappel {
  id: number;
  type: RappelType;
  boutiqueId: number;
  clientId?: number;
  commandeId?: number;
  statut: RappelStatus;
  canal: RappelCanal;
  message: string;
  dateEnvoi: string;
  createdAt: string;
  updatedAt: string;
  boutique?: Boutique;
  client?: Client;
  commande?: Commande;
}

export interface CommandeDetail {
  id: number;
  commandeId: number;
  vetementId: number;
  tarifId: number;
  quantite: number;
  prixUnitaire: number;
  sousTotal: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  vetement?: Vetement;
  tarif?: Tarif;
}

export interface Paiement {
  id: number;
  commandeId: number;
  montant: number;
  methodePaiement: PaiementMethod;
  statut: PaiementStatus;
  reference?: string;
  datePaiement: string;
  createdAt: string;
  updatedAt: string;
}

export interface Historique {
  id: number;
  boutiqueId: number;
  utilisateurId: number;
  action: string;
  entite: string;
  entiteId: number;
  details?: string;
  createdAt: string;
  utilisateur?: Utilisateur;
}

export interface Stats {
  totalCommandes: number;
  commandesParStatut: CommandesParStatut;
  caTotal: number;
  chiffreAffairesJour: number;
  chiffreAffairesMois: number;
  nbClients: number;
  nouveauxClients: number;
}

interface CommandesParStatut {
  [statut: string]: number
}

export interface CreateRappelData {
  type: RappelType;
  clientId?: number;
  commandeId?: number;
  message: string;
}

export interface RappelResponse {
  rappel: Rappel;
  whatsappUrl: string | null;
}

export interface AdminRappel{
  success: boolean;
  data: AdminGetRappels;
}

export interface AdminGetRappels{
  items: Rappel[]; 
  count: number; 
  totalPages: number; 
  currentPage: number
}

export interface GetAllModels<T> {
  items: T; 
  count: number; 
  totalPages: number; 
  currentPage: number
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Utilisateur;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    tension?: number;
  }[];
}
