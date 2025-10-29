# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

src/
├── config/
│   └── api.ts              # Configuration des endpoints
├── layouts/
│   └── MainLayout.vue      # Layout principal avec sidebar
├── plugins/
│   ├── vuetify.ts          # Configuration Vuetify
│   └── router.ts           # Router avec guards
├── services/
│   ├── api.service.ts      # Service HTTP de base
│   ├── auth.service.ts     # Service d'authentification
│   ├── utilisateur.service.ts
│   └── stats.service.ts
├── stores/
│   └── auth.ts             # Store Pinia pour l'auth
├── types/
│   └── index.ts            # Interfaces TypeScript
└── views/
    ├── auth/
    │   └── LoginView.vue
    ├── dashboard/
    │   └── DashboardView.vue
    ├── profile/
    │   └── ProfileView.vue
    └── utilisateurs/
        ├── UtilisateursList.vue
        └── UtilisateurForm.vue
