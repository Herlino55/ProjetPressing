<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Rappels WhatsApp</h1>
        <p class="text-subtitle-1 text-grey mt-1">
          Gérez vos rappels et notifications clients
        </p>
      </div>
      <v-btn
        color="success"
        prepend-icon="mdi-whatsapp"
        class="text-none"
        @click="openCreateDialog"
      >
        Nouveau rappel
      </v-btn>
    </div>

    <v-card elevation="2">
      <v-card-text>
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-select
              v-model="filterType"
              label="Type de rappel"
              :items="typeItems"
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
          :items="authStore.user?.role === 'admin' ? rappelAdmin?.data.items : rappels"
          :loading="loading"
          :items-per-page="10"
          class="elevation-0"
        >
          <template v-if="authStore.user?.role === 'admin'" v-slot:item.message="{ item }">
            <div class="message-preview">
              {{ item.boutique?.nom }}
            </div>
          </template>

          <template v-slot:item.type="{ item }">
            <v-chip :color="getTypeColor(item.type)" size="small">
              {{ getTypeLabel(item.type) }}
            </v-chip>
          </template>

          <template v-slot:item.client="{ item }">
            <div v-if="item.client">
              <div class="font-weight-medium">{{ item.client.nom }}</div>
              <div class="text-caption text-grey">{{ item.client.telephone }}</div>
            </div>
            <span v-else class="text-grey">-</span>
          </template>

          <template v-slot:item.commande="{ item }">
            <span v-if="item.commande" class="font-weight-medium">
              #{{ item.commande.numeroCommande }}
            </span>
            <span v-else class="text-grey">-</span>
          </template>

          <template v-slot:item.message="{ item }">
            <div class="message-preview">
              {{ item.message }}
            </div>
          </template>

          <template v-slot:item.statut="{ item }">
            <v-chip :color="item.statut === 'envoyé' ? 'success' : 'error'" size="small">
              <v-icon size="small" start>
                {{ item.statut === 'envoyé' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
              </v-icon>
              {{ item.statut === 'envoyé' ? 'Envoyé' : 'Échec' }}
            </v-chip>
          </template>

          <template v-slot:item.dateEnvoi="{ item }">
            {{ formatDateTime(item.dateEnvoi) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              size="small"
              variant="text"
              color="success"
              @click="resendRappel(item)"
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

    <v-dialog v-model="createDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold d-flex align-center">
          <v-icon color="success" class="mr-2">mdi-whatsapp</v-icon>
          Nouveau rappel WhatsApp
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="valid">
            <v-select
              v-model="form.type"
              label="Type de rappel *"
              :items="typeItems"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            ></v-select>

            <v-autocomplete
              v-model="form.clientId"
              label="Client"
              :items="clients"
              item-title="nom"
              item-value="id"
              variant="outlined"
              density="comfortable"
              clearable
              class="mb-3"
              placeholder="Rechercher un client..."
            ></v-autocomplete>

            <v-autocomplete
              v-model="form.commandeId"
              label="choisir la Commande..."
              :items="commandes"
              item-title="numeroCommande"
              item-value="id"
              variant="outlined"
              density="comfortable"
              clearable
              class="mb-3"
              placeholder="Rechercher une commande..."
            ></v-autocomplete>

            <v-textarea
              v-model="form.message"
              label="Message *"
              :rules="[rules.required, rules.minLength]"
              variant="outlined"
              rows="5"
              counter
              maxlength="500"
              hint="Le message sera envoyé via WhatsApp"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="createDialog = false">Annuler</v-btn>
          <v-btn
            color="success"
            variant="flat"
            @click="handleCreate"
            :loading="creating"
            :disabled="!valid || creating"
            prepend-icon="mdi-whatsapp"
          >
            Envoyer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Confirmer la suppression
        </v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer ce rappel ? Cette action est irréversible.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="deleteRappel" :loading="deleting">
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
import {useUiStore} from '@/stores/ui'
import rappelService from '@/services/rappel.service'
import clientService from '@/services/client.service'
import commandeService from '@/services/commande.service'
import { type Rappel, type RappelType, type RappelStatus, type CreateRappelData, type AdminRappel, type Client, type Commande, CommandeStatus } from '@/types'

const authStore = useAuthStore()

const uiStore = useUiStore()

const rappels = ref<Rappel[]>([])
const rappelAdmin = ref<AdminRappel>()
const clients = ref<Client[]>([])
const commandes = ref<Commande[]>([])
const loading = ref(false)
const filterType = ref<RappelType | null>(null)
const filterStatus = ref<RappelStatus | null>(null)
const createDialog = ref(false)
const deleteDialog = ref(false)
const selectedRappel = ref<Rappel | null>(null)
const creating = ref(false)
const deleting = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const formRef = ref()
const valid = ref(false)

const form = ref<CreateRappelData>({
  type: 'commande_prete' as RappelType,
  clientId: undefined,
  commandeId: undefined,
  message: '',
})

const headers = [
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Client', key: 'client', sortable: false },
  { title: 'Commande', key: 'commande', sortable: false },
  { title: 'Message', key: 'message', sortable: false },
  { title: 'Statut', key: 'statut', sortable: true },
  { title: 'Date envoi', key: 'dateEnvoi', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' as const },
]

const typeItems = [
  { title: 'Commande prête', value: 'commande_prete' },
  { title: 'Non retrait', value: 'non_retrait' },
  { title: 'Fidélisation', value: 'fidelisation' },
  { title: 'Paiement', value: 'paiement' },
  { title: 'Alerte rendement', value: 'alerte_rendement' },
]

const statusItems = [
  { title: 'Envoyé', value: 'envoyé' },
  { title: 'Échec', value: 'échec' },
]

const rules = {
  required: (v: string) => !!v || 'Ce champ est requis',
  minLength: (v: string) => (v && v.length >= 10) || 'Minimum 10 caractères',
}

const filteredRappels = computed(() => {
  let result = rappels.value

  if (filterType.value) {
    result = result.filter((r) => r.type === filterType.value)
  }

  if (filterStatus.value) {
    result = result.filter((r) => r.statut === filterStatus.value)
  }

  return result
})

onMounted(async () => {
  await loadRappels()
  await loadMockData()
})

const loadRappels = async () => {
  loading.value = true
  try {
    if (authStore.user?.role === 'gerant' || authStore.user?.role === 'employe') {
      rappels.value = await rappelService.getByBoutique(authStore.user?.boutiqueId || 0)
      console.log('donnee gerant:', rappels.value[0])

    }
    if (authStore.user?.role === 'admin') {
      rappelAdmin.value = await rappelService.getAll()
      console.log('donnee admin:', rappelAdmin.value.data.items[0])
    }
  } catch (error: any) {
    // showSnackbar(error.response?.data?.message || 'Erreur de chargement', 'error')
    uiStore.showToast(error.response?.data?.message || 'Erreur de chargement', 'error')
    console.log(error.response.data?.message)
  } finally {
    loading.value = false
  }
}

const loadMockData = async () => {
  uiStore.showLoader()
  try {
    const role  = authStore.user?.role
    clients.value = await (await clientService.getAll()).items

    console.log("liste de client", clients.value)

    commandes.value = (await commandeService.getAll(role)).data.items
    console.log("liste de commande", commandes.value)
  } catch (error: any) {
    // showSnackbar(error.response?.data?.message || 'Erreur de chargement', 'error')
    uiStore.showToast(error.response?.data?.message || 'Erreur de chargement', 'error')
    console.log(error.response.data?.message)
  } finally {
    uiStore.hideLoader()
  }

}

const openCreateDialog = () => {
  form.value = {
    type: 'commande_prete' as RappelType,
    clientId: undefined,
    commandeId: undefined,
    message: '',
  }
  createDialog.value = true
}

const handleCreate = async () => {
  if (!valid.value) return

  creating.value = true
  console.log('form data:', form.value)
  try {
    const response = await rappelService.create(form.value)

    if (response.data?.whatsappUrl) {
      rappelService.openWhatsApp(response.data?.whatsappUrl)
    }

    await loadRappels()
    showSnackbar('Rappel créé et envoyé avec succès', 'success')
    createDialog.value = false
  } catch (error: any) {
    showSnackbar(error.response?.data?.error || 'Erreur lors de la création', 'error')
    console.log(error.response.data?.errors)
  } finally {
    creating.value = false
  }
}

const resendRappel = async (rappel: Rappel) => {
  if (rappel.client?.telephone) {
    const message = encodeURIComponent(rappel.message)
    const phone = rappel.client.telephone.replace(/\D/g, '')
    const url = `https://wa.me/237${phone}?text=${message}`
    window.open(url, '_blank')
  }
}

const confirmDelete = (rappel: Rappel) => {
  selectedRappel.value = rappel
  deleteDialog.value = true
}

const deleteRappel = async () => {
  if (!selectedRappel.value) return

  deleting.value = true
  try {
    await rappelService.delete(selectedRappel.value.id)
    rappels.value = rappels.value.filter((r) => r.id !== selectedRappel.value?.id)
    showSnackbar('Rappel supprimé avec succès', 'success')
    deleteDialog.value = false
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Erreur de suppression', 'error')
  } finally {
    deleting.value = false
  }
}

const getTypeColor = (type: RappelType): string => {
  switch (type) {
    case 'commande_prete':
      return 'success'
    case 'non_retrait':
      return 'warning'
    case 'fidelisation':
      return 'info'
    case 'paiement':
      return 'error'
    case 'alerte_rendement':
      return 'purple'
    default:
      return 'grey'
  }
}

const getTypeLabel = (type: RappelType): string => {
  switch (type) {
    case 'commande_prete':
      return 'Commande prête'
    case 'non_retrait':
      return 'Non retrait'
    case 'fidelisation':
      return 'Fidélisation'
    case 'paiement':
      return 'Paiement'
    case 'alerte_rendement':
      return 'Alerte rendement'
    default:
      return type
  }
}

const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const showSnackbar = (text: string, color: string = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}
</script>

<style scoped>
.message-preview {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
