<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Utilisateurs</h1>
        <p class="text-subtitle-1 text-grey mt-1">
          Gestion des utilisateurs du système
        </p>
      </div>
      <v-btn
        v-if="authStore.hasPermission('users.create')"
        color="primary"
        prepend-icon="mdi-plus"
        class="text-none"
        :to="{ name: 'NouvelUtilisateur' }"
      >
        Nouvel utilisateur
      </v-btn>
    </div>

    <v-card elevation="2">
      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Rechercher"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterRole"
              label="Rôle"
              :items="roleItems"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterStatus"
              label="Statut"
              :items="statusItems"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            ></v-select>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="filteredUtilisateurs"
          :loading="loading"
          :items-per-page="10"
          class="elevation-0"
        >
          <template v-slot:item.nom="{ item }">
            <div class="d-flex align-center py-2">
              <v-avatar size="40" color="primary" class="mr-3">
                <span class="text-white">{{ getInitials(item) }}</span>
              </v-avatar>
              <div>
                <div class="font-weight-bold">{{ item.prenom }} {{ item.nom }}</div>
                <div class="text-caption text-grey">{{ item.email }}</div>
              </div>
            </div>
          </template>

          <template v-slot:item.role="{ item }">
            <v-chip :color="getRoleColor(item.role)" size="small">
              {{ getRoleLabel(item.role) }}
            </v-chip>
          </template>

          <template v-slot:item.statut="{ item }">
            <v-chip :color="item.actif ? 'success' : 'error'" size="small">
              {{ item.actif ? 'Actif' : 'Inactif' }}
            </v-chip>
          </template>

          <template v-slot:item.boutique="{ item }">
            {{ item.boutique?.nom || '-' }}
          </template>

          <template v-slot:item.telephone="{ item }">
            {{ item.telephone }}
          </template>

          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              v-if="authStore.hasPermission('users.update')"
              icon
              size="small"
              variant="text"
              color="info"
              :to="{ name: 'ModifierUtilisateur', params: { id: item.id } }"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="authStore.hasPermission('users.delete') && item.id !== authStore.user?.id"
              icon
              size="small"
              variant="text"
              color="error"
              @click="confirmDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Confirmer la suppression
        </v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer l'utilisateur
          <strong>{{ selectedUser?.prenom }} {{ selectedUser?.nom }}</strong> ?
          Cette action est irréversible.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="deleteUser" :loading="deleting">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import utilisateurService from '@/services/utilisateur.service'
import type { Utilisateur, UserRole } from '@/types'

const authStore = useAuthStore()

const utilisateurs = ref<Utilisateur[]>([])
const loading = ref(false)
const search = ref('')
const filterRole = ref<UserRole | null>(null)
const filterStatus = ref('')
const deleteDialog = ref(false)
const selectedUser = ref<Utilisateur | null>(null)
const deleting = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const headers = [
  { title: 'Utilisateur', key: 'nom', sortable: true },
  { title: 'Rôle', key: 'role', sortable: true },
  { title: 'Statut', key: 'statut', sortable: true },
  { title: 'Boutique', key: 'boutique', sortable: true },
  { title: 'Téléphone', key: 'telephone', sortable: false },
  { title: 'Date création', key: 'createdAt', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

const roleItems = [
  { title: 'Admin', value: 'admin' },
  { title: 'Gérant', value: 'gerant' },
  { title: 'Employé', value: 'employe' },
]

const statusItems = [
  { title: 'Actif', value: 'actif' },
  { title: 'Inactif', value: 'inactif' },
]

const filteredUtilisateurs = computed(() => {
  let result = utilisateurs.value

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter(
      (u) =>
        u.nom.toLowerCase().includes(searchLower) ||
        u.prenom.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.telephone.includes(searchLower)
    )
  }

  if (filterRole.value) {
    result = result.filter((u) => u.role === filterRole.value)
  }

  if (filterStatus.value === 'actif') {
    result = result.filter((u) => u.actif === true)
  }else if (filterStatus.value === 'inactif'){
    result = result.filter((u) => u.actif === false)
  }

  return result
})

onMounted(async () => {
  await loadUtilisateurs()
})

const loadUtilisateurs = async () => {
  loading.value = true
  try {
    utilisateurs.value = await (await utilisateurService.getAll()).data
    console.log("utilisateur : ", utilisateurs.value)
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Erreur de chargement', 'error')
    utilisateurs.value = [
      {
        id: 1,
        boutiqueId: 1,
        nom: 'Admin',
        prenom: 'Super',
        email: 'admin@pressing.com',
        telephone: '0123456789',
        role: 'admin' as UserRole,
        actif: true,
        createdAt: '2024-01-15T10:00:00',
        updatedAt: '2024-01-15T10:00:00',
      },
      {
        id: 2,
        boutiqueId: 1,
        nom: 'Martin',
        prenom: 'Jean',
        email: 'jean.martin@pressing.com',
        telephone: '0123456788',
        role: 'gerant' as UserRole,
        actif: true,
        createdAt: '2024-02-20T14:30:00',
        updatedAt: '2024-02-20T14:30:00',
      },
      {
        id: 3,
        boutiqueId: 1,
        nom: 'Dupont',
        prenom: 'Marie',
        email: 'marie.dupont@pressing.com',
        telephone: '0123456787',
        role: 'employe' as UserRole,
        actif: true,
        createdAt: '2024-03-10T09:15:00',
        updatedAt: '2024-03-10T09:15:00',
      },
    ]
  } finally {
    loading.value = false
  }
}

const confirmDelete = (user: Utilisateur) => {
  selectedUser.value = user
  deleteDialog.value = true
}

const deleteUser = async () => {
  if (!selectedUser.value) return

  deleting.value = true
  try {
    await utilisateurService.delete(selectedUser.value.id)
    utilisateurs.value = utilisateurs.value.filter((u) => u.id !== selectedUser.value?.id)
    showSnackbar('Utilisateur supprimé avec succès', 'success')
    deleteDialog.value = false
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Erreur de suppression', 'error')
  } finally {
    deleting.value = false
  }
}

const getInitials = (user: Utilisateur): string => {
  return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase()
}

const getRoleColor = (role: UserRole): string => {
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

const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Admin'
    case 'gerant':
      return 'Gérant'
    case 'employe':
      return 'Employé'
    default:
      return role
  }
}

const formatDate = (date: string | undefined): string => {
  if(date){
    return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    })
  }else{
    return 'undifined'
  }
  
}

const showSnackbar = (text: string, color: string = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}
</script>
