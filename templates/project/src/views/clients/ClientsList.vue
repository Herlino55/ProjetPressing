<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Clients</h1>
        <p class="text-subtitle-1 text-grey mt-1">
          Gestion de votre portefeuille clients
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        class="text-none"
        :to="{ name: 'NouveauClient' }"
      >
        Nouveau client
      </v-btn>
    </div>

    <v-card elevation="2">
      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              label="Rechercher"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              @input="handleSearch"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="currentPage"
                  label="Page"
                  :items="pageItems"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="pageSize"
                  label="Par page"
                  :items="[5, 10, 20, 50]"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="displayClients"
          :loading="loading"
          :server-items-length="totalClients"
          :items-per-page="pageSize"
          :page="currentPage"
          @update:page="currentPage = $event"
          class="elevation-0"
        >
          <template v-slot:item.nom="{ item }">
            <div class="d-flex align-center py-2">
              <v-avatar size="40" color="primary" class="mr-3">
                <span class="text-white text-h6">
                  {{ getInitials(item) }}
                </span>
              </v-avatar>
              <div>
                <div class="font-weight-bold">{{ item.prenom }} {{ item.nom }}</div>
                <div class="text-caption text-grey">{{ item.email || '-' }}</div>
              </div>
            </div>
          </template>

          <template v-slot:item.telephone="{ item }">
            <a :href="`tel:${item.telephone}`" class="font-weight-medium">
              {{ item.telephone }}
            </a>
          </template>

          <template v-slot:item.adresse="{ item }">
            <div class="text-truncate" style="max-width: 250px">
              {{ item.adresse || '-' }}
            </div>
          </template>

          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              size="small"
              variant="text"
              color="info"
              :to="{ name: 'ModifierClient', params: { id: item.id } }"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              color="success"
              @click="openRappelDialog(item)"
            >
              <v-icon>mdi-whatsapp</v-icon>
            </v-btn>
            <v-btn
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
          Êtes-vous sûr de vouloir supprimer le client
          <strong>{{ selectedClient?.prenom }} {{ selectedClient?.nom }}</strong> ?
          Cette action est irréversible.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="deleteClient" :loading="deleting">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="rappelDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold d-flex align-center">
          <v-icon color="success" class="mr-2">mdi-whatsapp</v-icon>
          Envoyer un rappel à {{ selectedClient?.prenom }}
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="rappelMessage"
            label="Message"
            variant="outlined"
            rows="4"
            counter
            maxlength="300"
            placeholder="Entrez votre message..."
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="rappelDialog = false">Annuler</v-btn>
          <v-btn
            color="success"
            variant="flat"
            @click="sendRappel"
            :loading="sendingRappel"
            prepend-icon="mdi-whatsapp"
          >
            Envoyer
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
import clientService from '@/services/client.service'
import rappelService from '@/services/rappel.service'
import type { Client, RappelType } from '@/types'

const authStore = useAuthStore()

const clients = ref<Client[]>([])
const displayClients = ref<Client[]>([])
const loading = ref(false)
const deleting = ref(false)
const sendingRappel = ref(false)
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalClients = ref(0)
const deleteDialog = ref(false)
const rappelDialog = ref(false)
const selectedClient = ref<Client | null>(null)
const rappelMessage = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const headers = [
  { title: 'Client', key: 'nom', sortable: true },
  { title: 'Téléphone', key: 'telephone', sortable: false },
  { title: 'Adresse', key: 'adresse', sortable: false },
  { title: 'Date inscription', key: 'createdAt', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

const pageItems = computed(() => {
  const pages = []
  for (let i = 1; i <= Math.ceil(totalClients.value / pageSize.value); i++) {
    pages.push(i)
  }
  return pages
})

onMounted(async () => {
  await loadClients()
})

const loadClients = async () => {
  loading.value = true
  try {
    const response = await clientService.getAlle({
      page: currentPage.value,
      limit: pageSize.value,
    })
    clients.value = response.data.items
    displayClients.value = response.data.items
    totalClients.value = response.data.totalItems
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Erreur de chargement', 'error')
    clients.value = mockClients
    displayClients.value = mockClients
    totalClients.value = mockClients.length
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  if (search.value.length > 0) {
    try {
      const results = await clientService.search(search.value)
      displayClients.value = results.data
    } catch (error) {
      displayClients.value = clients.value.filter(
        (c) =>
          c.nom.toLowerCase().includes(search.value.toLowerCase()) ||
          c.prenom.toLowerCase().includes(search.value.toLowerCase()) ||
          c.telephone.includes(search.value) ||
          c.email?.toLowerCase().includes(search.value.toLowerCase())
      )
    }
  } else {
    displayClients.value = clients.value
  }
}

const confirmDelete = (client: Client) => {
  selectedClient.value = client
  deleteDialog.value = true
}

const deleteClient = async () => {
  if (!selectedClient.value) return

  deleting.value = true
  try {
    await clientService.delete(selectedClient.value.id)
    clients.value = clients.value.filter((c) => c.id !== selectedClient.value?.id)
    displayClients.value = displayClients.value.filter((c) => c.id !== selectedClient.value?.id)
    totalClients.value--
    showSnackbar('Client supprimé avec succès', 'success')
    deleteDialog.value = false
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Erreur de suppression', 'error')
  } finally {
    deleting.value = false
  }
}

const openRappelDialog = (client: Client) => {
  selectedClient.value = client
  rappelMessage.value = ''
  rappelDialog.value = true
}

const sendRappel = async () => {
  if (!selectedClient.value || !rappelMessage.value) return

  sendingRappel.value = true
  try {
    const response = await rappelService.create({
      type: 'fidelisation' as RappelType,
      clientId: selectedClient.value.id,
      message: rappelMessage.value,
    })

    if (response.data.whatsappUrl) {
      rappelService.openWhatsApp(response.data.whatsappUrl)
    }

    showSnackbar('Rappel envoyé avec succès', 'success')
    rappelDialog.value = false
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Erreur lors de l\'envoi', 'error')
  } finally {
    sendingRappel.value = false
  }
}

const getInitials = (client: Client): string => {
  return `${client.prenom.charAt(0)}${client.nom.charAt(0)}`.toUpperCase()
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const showSnackbar = (text: string, color: string = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const mockClients: Client[] = [
  {
    id: 1,
    boutiqueId: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    telephone: '0612345678',
    email: 'jean.dupont@email.com',
    adresse: '123 Rue de Paris, 75001 Paris',
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-01-15T10:00:00',
  },
  {
    id: 2,
    boutiqueId: 1,
    nom: 'Martin',
    prenom: 'Marie',
    telephone: '0623456789',
    email: 'marie.martin@email.com',
    adresse: '456 Avenue de Lyon, 75012 Paris',
    createdAt: '2024-02-10T14:30:00',
    updatedAt: '2024-02-10T14:30:00',
  },
  {
    id: 3,
    boutiqueId: 1,
    nom: 'Bernard',
    prenom: 'Pierre',
    telephone: '0634567890',
    email: 'pierre.bernard@email.com',
    adresse: '789 Boulevard Saint-Germain, 75006 Paris',
    createdAt: '2024-03-05T09:15:00',
    updatedAt: '2024-03-05T09:15:00',
  },
]
</script>

<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
