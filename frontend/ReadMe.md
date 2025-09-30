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
