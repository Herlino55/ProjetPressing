<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app :permanent="$vuetify.display.mdAndUp">
      <div class="pa-4">
        <div class="d-flex align-center mb-4">
          <v-icon color="primary" size="40">mdi-washing-machine</v-icon>
          <div class="ml-3">
            <div class="text-h6 font-weight-bold primary--text">{{authStore.user?.boutique?.nom}}</div>
            <div class="text-caption text-grey">Management System</div>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <v-list nav density="compact">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Tableau de bord"
          value="dashboard"
          :to="{ name: 'Dashboard' }"
          exact
        ></v-list-item>

        <v-list-item
          v-if="authStore.hasPermission('users.view')"
          prepend-icon="mdi-account-group"
          title="Utilisateurs"
          value="utilisateurs"
          :to="{ name: 'Utilisateurs' }"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-multiple"
          title="Clients"
          value="clients"
          disabled
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-hanger"
          title="Vêtements"
          value="vetements"
          disabled
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-clipboard-list"
          title="Commandes"
          value="commandes"
          disabled
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cash-multiple"
          title="Paiements"
          value="paiements"
          disabled
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-tag-multiple"
          title="Tarifs"
          value="tarifs"
          disabled
        ></v-list-item>

        <v-list-item
          v-if="authStore.isAdmin"
          prepend-icon="mdi-store"
          title="Boutiques"
          value="boutiques"
          disabled
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-chart-bar"
          title="Statistiques"
          value="stats"
          disabled
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-history"
          title="Historique"
          value="historique"
          disabled
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="white" elevation="1">
      <v-app-bar-nav-icon
        v-if="$vuetify.display.smAndDown"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title class="text-h6 font-weight-medium">
        {{ pageTitle }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="40" color="primary">
              <v-icon>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title class="font-weight-bold">
              {{ authStore.user?.prenom }} {{ authStore.user?.nom }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-chip size="x-small" :color="getRoleColor(authStore.user?.role)" class="mt-1">
                {{ authStore.user?.role }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item prepend-icon="mdi-account" :to="{ name: 'Profile' }">
            <v-list-item-title>Mon profil</v-list-item-title>
          </v-list-item>

          <v-list-item prepend-icon="mdi-logout" @click="handleLogout">
            <v-list-item-title>Déconnexion</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" top>
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'

const router = useRouter()
const route = useRoute()
const theme = useTheme()
const authStore = useAuthStore()

const drawer = ref(true)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const isDark = computed(() => theme.global.current.value.dark)

const pageTitle = computed(() => {
  return route.meta.title || (route.name as string) || 'Dashboard'
})

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'pressingTheme' : 'dark'
}

const getRoleColor = (role?: UserRole) => {
  switch (role) {
    case 'admin':
      return 'error'
    case 'gerant':
      return 'warning'
    case 'employe':
      return 'info'
    default:
      return 'grey'
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
  showSnackbar('Déconnexion réussie', 'success')
}

const showSnackbar = (text: string, color: string = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.v-list-item {
  border-radius: 8px;
  margin: 4px 8px;
}

.v-list-item--active {
  background-color: rgba(25, 118, 210, 0.1);
}
</style>
