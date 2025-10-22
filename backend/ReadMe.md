pressing-backend/
│
├── src/
│   ├── app.ts                     # Configuration principale Express
│   ├── server.ts                  # Démarrage du serveur et connexion DB
│
├── config/
│   ├── db.config.ts               # Configuration Sequelize + PostgreSQL
│   ├── auth.config.ts             # Config JWT + sécurité
│   ├── cloudinary.config.ts       # Config Cloudinary pour les médias
│   ├── whatsapp.config.ts         # ✅ Config API WhatsApp (Twilio / Meta)
│
├── models/
│   ├── boutique.model.ts
│   ├── utilisateur.model.ts
│   ├── client.model.ts
│   ├── vetement.model.ts
│   ├── commande.model.ts
│   ├── commandeDetail.model.ts
│   ├── paiement.model.ts
│   ├── tarif.model.ts
│   ├── historique.model.ts
│   └── rappel.model.ts            # ✅ Nouveau modèle pour gérer tous les rappels
│
├── controllers/
│   ├── boutique.controller.ts
│   ├── utilisateur.controller.ts
│   ├── client.controller.ts
│   ├── vetement.controller.ts
│   ├── commande.controller.ts
│   ├── commandeDetail.controller.ts
│   ├── paiement.controller.ts
│   ├── tarif.controller.ts
│   ├── historique.controller.ts
│   ├── stats.controller.ts
│   └── rappel.controller.ts       # ✅ Contrôleur pour gérer les rappels et historiques d’envoi
│
├── routes/
│   ├── boutique.routes.ts
│   ├── utilisateur.routes.ts
│   ├── client.routes.ts
│   ├── vetement.routes.ts
│   ├── commande.routes.ts
│   ├── commandeDetail.routes.ts
│   ├── paiement.routes.ts
│   ├── tarif.routes.ts
│   ├── historique.routes.ts
│   ├── stats.routes.ts
│   └── rappel.routes.ts           # ✅ Route pour accéder ou tester les rappels
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── upload.middleware.ts
│   └── validation.middleware.ts
│
├── services/
│   ├── auth.service.ts
│   ├── cloudinary.service.ts
│   ├── stats.service.ts
│   ├── whatsapp.service.ts        # ✅ Service d’envoi WhatsApp
│   ├── rappel.service.ts          # ✅ Gestion des rappels automatiques
│   └── scheduler.service.ts       # ✅ Planification automatique (cron jobs)
│
├── utils/
│   ├── logger.ts
│   ├── validators.ts
│   └── helpers.ts
│
├── package.json
├── tsconfig.json
├── .env
├── .gitignore
└── README.md

gestion de l'historique des commandes