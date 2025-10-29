<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Tableau de bord</h1>
        <p class="text-subtitle-1 text-grey mt-1">
          Vue d'ensemble de votre activité
        </p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" class="text-none" disabled>
        Nouvelle commande
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2" hover>
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-subtitle-2 text-grey mb-2">Total Commandes</p>
                <h2 class="text-h4 font-weight-bold">{{ stats.totalCommandes }}</h2>
                <p class="text-caption text-success mt-1">
                  <v-icon size="small" color="success">mdi-arrow-up</v-icon>
                  +12% ce mois
                </p>
              </div>
              <v-avatar color="primary" size="56">
                <v-icon size="32" color="white">mdi-clipboard-list</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2" hover>
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-subtitle-2 text-grey mb-2">En cours</p>
                <h2 class="text-h4 font-weight-bold">{{ stats.commandesParStatut['en_cours'] }}</h2>
                <p class="text-caption text-info mt-1">
                  <v-icon size="small" color="info">mdi-clock-outline</v-icon>
                  À traiter
                </p>
              </div>
              <v-avatar color="info" size="56">
                <v-icon size="32" color="white">mdi-progress-clock</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2" hover>
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-subtitle-2 text-grey mb-2">Chiffre d'affaires</p>
                <h2 class="text-h4 font-weight-bold">{{ formatCurrency(stats.caTotal) }}</h2>
                <p class="text-caption text-success mt-1">
                  <v-icon size="small" color="success">mdi-trending-up</v-icon>
                  +8% ce mois
                </p>
              </div>
              <v-avatar color="success" size="56">
                <v-icon size="32" color="white">mdi-cash-multiple</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" elevation="2" hover>
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-subtitle-2 text-grey mb-2">Clients</p>
                <h2 class="text-h4 font-weight-bold">{{ stats.nbClients }}</h2>
                <p class="text-caption text-warning mt-1">
                  <v-icon size="small" color="warning">mdi-account-plus</v-icon>
                  {{ stats.nouveauxClients }} nouveaux
                </p>
              </div>
              <v-avatar color="warning" size="56">
                <v-icon size="32" color="white">mdi-account-group</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-bold">Évolution des commandes</span>
            <v-chip color="primary" size="small">30 derniers jours</v-chip>
          </v-card-title>
          <v-card-text>
            <canvas ref="lineChartRef"></canvas>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title class="text-h6 font-weight-bold">
            Statut des commandes
          </v-card-title>
          <v-card-text>
            <canvas ref="doughnutChartRef"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-bold">Commandes récentes</span>
            <v-btn variant="text" color="primary" class="text-none" disabled>
              Voir tout
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Client</th>
                  <th>Date dépôt</th>
                  <th>Date retrait</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="commande in recentCommandes" :key="commande.id">
                  <td class="font-weight-bold">#{{ commande.numeroCommande }}</td>
                  <td>{{ commande.client }}</td>
                  <td>{{ formatDate(commande.dateDepot) }}</td>
                  <td>{{ formatDate(commande.dateRetrait) }}</td>
                  <td class="font-weight-bold">{{ formatCurrency(commande.montant) }}</td>
                  <td>
                    <v-chip :color="getStatusColor(commande.statut)" size="small">
                      {{ commande.statut }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn icon size="small" variant="text" disabled>
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" sm="6" md="3">
        <v-card class="action-card" elevation="2" hover>
          <v-card-text class="text-center pa-6">
            <v-icon color="primary" size="48">mdi-account-plus</v-icon>
            <h3 class="text-h6 font-weight-bold mt-4">Nouveau client</h3>
            <p class="text-caption text-grey mt-2">Enregistrer un nouveau client</p>
            <v-btn color="primary" variant="outlined" block class="mt-4 text-none" disabled>
              Ajouter
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="action-card" elevation="2" hover>
          <v-card-text class="text-center pa-6">
            <v-icon color="info" size="48">mdi-clipboard-plus</v-icon>
            <h3 class="text-h6 font-weight-bold mt-4">Nouvelle commande</h3>
            <p class="text-caption text-grey mt-2">Créer une nouvelle commande</p>
            <v-btn color="info" variant="outlined" block class="mt-4 text-none" disabled>
              Créer
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="action-card" elevation="2" hover>
          <v-card-text class="text-center pa-6">
            <v-icon color="success" size="48">mdi-cash-register</v-icon>
            <h3 class="text-h6 font-weight-bold mt-4">Paiement</h3>
            <p class="text-caption text-grey mt-2">Enregistrer un paiement</p>
            <v-btn color="success" variant="outlined" block class="mt-4 text-none" disabled>
              Saisir
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="action-card" elevation="2" hover>
          <v-card-text class="text-center pa-6">
            <v-icon color="warning" size="48">mdi-file-chart</v-icon>
            <h3 class="text-h6 font-weight-bold mt-4">Rapport</h3>
            <p class="text-caption text-grey mt-2">Générer un rapport</p>
            <v-btn color="warning" variant="outlined" block class="mt-4 text-none" disabled>
              Générer
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import statsService from '@/services/stats.service'
import type { Stats, CommandeStatus } from '@/types'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'

Chart.register(...registerables)

const lineChartRef = ref<HTMLCanvasElement | null>(null)
const doughnutChartRef = ref<HTMLCanvasElement | null>(null)
const uiStore = useUiStore()
const authStore = useAuthStore()

const stats = ref<Stats>({
  totalCommandes: 0,
  commandesParStatut: {},
  caTotal: 0,
  chiffreAffairesJour: 0,
  chiffreAffairesMois: 0,
  nbClients: 0,
  nouveauxClients: 0,
})

const Refstats = ref<Stats>({
  totalCommandes: 0,
  commandesParStatut: {},
  caTotal: 0,
  chiffreAffairesJour: 0,
  chiffreAffairesMois: 0,
  nbClients: 0,
  nouveauxClients: 0,
})

const recentCommandes = ref([
  {
    id: 1,
    numeroCommande: 'CMD001',
    client: 'Jean Dupont',
    dateDepot: '2024-10-25',
    dateRetrait: '2024-10-28',
    montant: 45000,
    statut: 'en_cours' as CommandeStatus,
  },
  {
    id: 2,
    numeroCommande: 'CMD002',
    client: 'Marie Martin',
    dateDepot: '2024-10-24',
    dateRetrait: '2024-10-27',
    montant: 32000,
    statut: 'termine' as CommandeStatus,
  },
  {
    id: 3,
    numeroCommande: 'CMD003',
    client: 'Pierre Durant',
    dateDepot: '2024-10-26',
    dateRetrait: '2024-10-29',
    montant: 58000,
    statut: 'en_attente' as CommandeStatus,
  },
])

onMounted(async () => {
  await loadStats()
  createLineChart()
  createDoughnutChart()
})

const loadStats = async () => {
  try {
    if(authStore.user?.role === 'admin'){
      const data = await statsService.getGlobalStats()
      stats.value = data.data || Refstats.value;
      console.log('stats', data.data)
      uiStore.showToast('affichage reussi.', 'success')
    }
    if(authStore.user?.role === 'gerant'){
      const data = await statsService.getStatsByBoutique(authStore.user?.boutiqueId || 0)
      stats.value = data.data || Refstats.value;
      console.log('stats', data.data)
      uiStore.showToast('affichage reussi.', 'success')
    }
  } catch (error: any) {
    stats.value = {
      totalCommandes: 248,
      commandesParStatut: {},
      caTotal: 5420000,
      chiffreAffairesJour: 180000,
      chiffreAffairesMois: 1250000,
      nbClients: 156,
      nouveauxClients: 12,
    }
    const message = error.response?.data.message || 'aucune connexion au serveur.'
    uiStore.showToast(message, 'error')
    console.error('Erreur lors du chargement des statistiques :', error.response?.data.message || error.message)
  }
}

const createLineChart = () => {
  if (!lineChartRef.value) return

  new Chart(lineChartRef.value, {
    type: 'line',
    data: {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      datasets: [
        {
          label: 'Commandes',
          data: [45, 62, 58, 83],
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  })
}

const createDoughnutChart = () => {
  if (!doughnutChartRef.value) return

  new Chart(doughnutChartRef.value, {
    type: 'doughnut',
    data: {
      labels: ['En attente', 'En cours', 'Terminé', 'Livré'],
      datasets: [
        {
          data: [15, 32, 145, 56],
          backgroundColor: ['#FFA726', '#42A5F5', '#66BB6A', '#AB47BC'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getStatusColor = (statut: CommandeStatus): string => {
  switch (statut) {
    case 'en_attente':
      return 'warning'
    case 'en_cours':
      return 'info'
    case 'termine':
      return 'success'
    case 'livre':
      return 'purple'
    default:
      return 'grey'
  }
}
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.action-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}
</style>
