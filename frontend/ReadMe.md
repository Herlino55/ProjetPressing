# structure temporaire

pressing_app/
│
├── lib/
│   ├── main.dart              # Point d'entrée de l'application
│   ├── app.dart               # Configuration globale (thème, routes)
│
├── lib/config/                # Configurations globales
│   ├── api_config.dart        # Base URL API, endpoints
│   ├── theme.dart             # Thème de l’application (couleurs, fonts)
│   └── constants.dart         # Valeurs constantes
│
├── lib/models/                # Modèles de données (DTOs)
│   ├── boutique.dart
│   ├── utilisateur.dart
│   ├── client.dart
│   ├── vetement.dart
│   ├── commande.dart
│   ├── commande_detail.dart
│   ├── paiement.dart
│   └── tarif.dart
│
├── lib/services/              # Services pour appeler l’API et gérer les données
│   ├── api_service.dart       # Gestion des requêtes HTTP (GET, POST, PUT, DELETE)
│   ├── auth_service.dart      # Authentification JWT, login/logout
│   ├── boutique_service.dart
│   ├── client_service.dart
│   ├── vetement_service.dart
│   ├── commande_service.dart
│   ├── paiement_service.dart
│   ├── tarif_service.dart
│   └── stats_service.dart
│
├── lib/providers/             # State management (ex: Riverpod ou Provider)
│   ├── auth_provider.dart
│   ├── boutique_provider.dart
│   ├── client_provider.dart
│   ├── vetement_provider.dart
│   ├── commande_provider.dart
│   ├── paiement_provider.dart
│   └── stats_provider.dart
│
├── lib/screens/               # Écrans de l'application
│   ├── auth/
│   │   ├── login_screen.dart
│   │   └── register_screen.dart
│   ├── boutique/
│   │   ├── boutique_list_screen.dart
│   │   └── boutique_detail_screen.dart
│   ├── client/
│   │   ├── client_list_screen.dart
│   │   └── client_detail_screen.dart
│   ├── vetement/
│   │   ├── vetement_list_screen.dart
│   │   └── vetement_detail_screen.dart
│   ├── commande/
│   │   ├── commande_list_screen.dart
│   │   └── commande_detail_screen.dart
│   ├── paiement/
│   │   └── paiement_list_screen.dart
│   └── stats/
│       └── stats_screen.dart
│
├── lib/widgets/               # Composants réutilisables (boutons, cartes, formulaires)
│   ├── custom_button.dart
│   ├── custom_card.dart
│   ├── form_input.dart
│   └── loading_indicator.dart
│
├── lib/routes/                # Définition des routes (Navigator ou GoRouter)
│   └── app_routes.dart
│
├── lib/utils/                 # Fonctions utilitaires
│   ├── validators.dart        # Validation des champs formulaire
│   ├── helpers.dart
│   └── constants.dart
│
├── assets/                    # Images, icônes, polices
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── pubspec.yaml
└── README.md


# endpoint

 1. vetements
    - list: vetements/
    - create: vetements/
    - byBoutique: vetements/boutique
    - byId: vetements/:id
    - update: vetements/:id
    - delete: vetements/:id

 2. utilisateur
    - login: utilisateurs/login
    - register: utilisateurs/register
    - getprofile: utilisateurs/profile
    - list: utilisateurs/
    - create: utilisateurs/
    - byId: utilisateurs/:id
    - update: utilisateurs/:id
    - delete: utilisateurs/:id

 3. tarif
    - list: tarifs/
    - create: tarifs/
    - byId: tarifs/:id
    - byVetementId: tarifs/:vetementId
    - update: tarifs/:id
    - delete: tarifs/:id

 4. paiement
    - list: paiements/
    - create: paiements/
    - byId: paiements/:id
    - byCommandeId: paiements/:commandeId
    - byBoutiqueId: paiements/:boutiqueId
    - update: paiements/:id
    - delete: paiements/:id

 5. stats
    - global: stats/global
    - byBoutique: stats/boutique/:boutiqueId
    - periode: stats/period
    - topClient: stats/top-clients
    - topVetement: stats/top-vetements

 6. historique
    - global: historiques/
    - byBoutique: historiques/boutique/:boutiqueId
    - byUser: historiques/utilisateur/:userId

 7. commandeDetail
    - list: commandes/:commandeId/details
    - create: commandes/:commandeId/details
    - update: commandes/details/:detailId
    - delete: commandes/details/:detailId

 8. commande
    - list: commandes/
    - create: commandes/
    - byId: commandes/:id
    - byClientId: commandes/client/:clientId
    - byBoutique: commandes/boutique/:boutiqueId
    - update: commandes/:id
    - delete: commandes/:id
    - updateStatut: commandes/:id/statut

 9. client
    - list: clients/
    - create: clients/
    - search: clients/search
    - byId: clients/:id
    - update: clients/:id
    - delete: clients/:id

 10. boutique
    - list: boutiques/
    - create: boutiques/
    - historique: boutiques/:id/historique
    - byId: boutiques/:id
    - update: boutiques/:id
    - delete: boutiques/:id
    