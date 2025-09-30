# structure Definitive

pressing-backend/
│
├── src/
│   ├── app.ts                
│   ├── server.ts             
│
├── config/                   
│   ├── db.config.ts          
│   ├── auth.config.ts        
│   ├── cloudinary.config.ts  
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
│   └── historique.model.ts
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
│   └── stats.controller.ts
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
│   └── stats.routes.ts
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
│   └── stats.service.ts
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
