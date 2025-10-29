export enum UserRole {
  ADMIN = 'admin',
  GERANT = 'gerant',
  EMPLOYE = 'employe'
}

export enum UserStatus {
  ACTIF = 'actif',
  INACTIF = 'inactif'
}

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
  password: string;
  telephone?: string;
  role: UserRole;
  boutiqueId?: number;
  actif: boolean;
  boutique?: Boutique;
  createdAt?: Date;
  updatedAt?: Date;
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
  id?: number;
  type:
    | "commande_prete"
    | "non_retrait"
    | "fidelisation"
    | "paiement"
    | "alerte_rendement";
  boutiqueId: number;
  clientId?: number;
  commandeId?: number;
  statut: "envoyé" | "échec";
  canal: "whatsapp";
  message: string;
  dateEnvoi: Date;
  createdAt: string;
  updatedAt: string;
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
/*
"caTotal": 0,
		"nbClients": 2,
		"totalCommandes": 0,
     */
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
  data?: T;
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
