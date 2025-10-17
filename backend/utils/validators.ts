import { body, param, query } from 'express-validator';

export const boutiqueValidators = {
  create: [
    body('nom').notEmpty().withMessage('Le nom est requis').isLength({ max: 100 }),
    body('adresse').notEmpty().withMessage('L\'adresse est requise'),
    body('telephone').notEmpty().withMessage('Le téléphone est requis'),
    body('email').optional().isEmail().withMessage('Email invalide')
  ],
  update: [
    param('id').isInt().withMessage('ID invalide'),
    body('nom').optional().isLength({ max: 100 }),
    body('email').optional().isEmail().withMessage('Email invalide')
  ]
};

export const utilisateurValidators = {
  create: [
    body('nom').notEmpty().withMessage('Le nom est requis'),
    body('prenom').notEmpty().withMessage('Le prénom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('role').isIn(['admin', 'gerant', 'employe']).withMessage('Rôle invalide'),
    body('boutiqueId').optional().isInt()
  ],
  login: [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Le mot de passe est requis')
  ]
};

export const clientValidators = {
  create: [
    body('nom').notEmpty().withMessage('Le nom est requis'),
    body('prenom').notEmpty().withMessage('Le prénom est requis'),
    body('telephone').notEmpty().withMessage('Le téléphone est requis'),
    body('boutiqueId').isInt().withMessage('ID boutique invalide'),
    body('email').optional().isEmail().withMessage('Email invalide')
  ],
  search: [
    query('q').notEmpty().withMessage('Le terme de recherche est requis')
  ]
};

export const commandeValidators = {
  create: [
    body('clientId').isInt().withMessage('ID client invalide'),
    body('dateDepot').optional().isISO8601().withMessage('Date invalide'),
    body('dateRetrait').optional().isISO8601().withMessage('Date invalide')
  ],
  updateStatus: [
    param('id').isInt().withMessage('ID invalide'),
    body('statut').isIn(['en_attente', 'en_cours', 'termine', 'livre', 'annule']).withMessage('Statut invalide')
  ]
};

export const rappelValidators = {
  create: [
    body('type').isIn(['commande_prete', 'non_retrait', 'fidelisation', 'paiement', 'alerte_rendement']).withMessage('Type de rappel invalide'),
    body('clientId').optional().isInt().withMessage('ID client invalide'),
    body('commandeId').optional().isInt().withMessage('ID commande invalide'),
    body('message').notEmpty().withMessage('Le message est requis'),
    body('boutiqueId').isInt().withMessage('ID boutique invalide'),
    body('canal').isIn(['whatsapp']).withMessage('Canal invalide'),
    body('statut').isIn(['envoyé', 'échec']).withMessage('Statut invalide'),
    body('dateEnvoi').optional().isISO8601().withMessage('Date invalide')
  ]
};

export const paiementValidators = {
  create: [
    body('commandeId').isInt().withMessage('ID commande invalide'),
    body('montant').isDecimal().withMessage('Montant invalide'),
    body('methodePaiement').isIn(['espece', 'carte', 'mobile money', 'orange money', 'virement', 'cheque']).withMessage('Méthode de paiement invalide'),
    body('statut').optional().isIn(['en_attente', 'paye', 'partiel', 'rembourse'])
  ]
};

export const tarifValidators = {
  create: [
    body('vetementId').isInt().withMessage('ID vêtement invalide'),
    body('typeService').isIn(['lavage', 'repassage', 'nettoyage_sec', 'detachage', 'pressing_complet']).withMessage('Type de service invalide'),
    body('prix').isDecimal().withMessage('Prix invalide')
  ]
};
