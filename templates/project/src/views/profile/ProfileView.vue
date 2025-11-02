<template>
  <div>
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">Mon profil</h1>
      <p class="text-subtitle-1 text-grey mt-1">
        Gérez vos informations personnelles
      </p>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-text class="text-center pa-6">
            <v-avatar size="120" color="primary" class="mb-4">
              <!-- <v-img v-if="authStore.user?.photo" :src="authStore.user.photo"></v-img> -->
              <span class="text-h3 text-white">{{ getInitials() }}</span>
            </v-avatar>
            <h2 class="text-h5 font-weight-bold">
              {{ authStore.user?.prenom }} {{ authStore.user?.nom }}
            </h2>
            <p class="text-subtitle-2 text-grey mt-1">{{ authStore.user?.email }}</p>
            <v-chip :color="getRoleColor(authStore.user?.role)" class="mt-3">
              {{ getRoleLabel(authStore.user?.role) }}
            </v-chip>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="mt-4">
          <v-card-text>
            <h3 class="text-h6 font-weight-bold mb-4">Informations</h3>
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-phone">
                <v-list-item-title class="text-caption text-grey">Téléphone</v-list-item-title>
                <v-list-item-subtitle class="text-body-2">
                  {{ authStore.user?.telephone }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-store">
                <v-list-item-title class="text-caption text-grey">Boutique</v-list-item-title>
                <v-list-item-subtitle class="text-body-2">
                  {{ authStore.user?.boutique?.nom || 'Non assigné' }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-shield-check">
                <v-list-item-title class="text-caption text-grey">Statut</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    :color="authStore.user?.actif ? 'success' : 'error'"
                    size="x-small"
                  >
                    {{ authStore.user?.actif ? 'Actif' : 'Inactif' }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-text class="pa-6">
            <h3 class="text-h6 font-weight-bold mb-4">Informations personnelles</h3>
            <v-form ref="formRef" v-model="valid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.nom"
                    label="Nom"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.prenom"
                    label="Prénom"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.email"
                    label="Email"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    variant="outlined"
                    density="comfortable"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.telephone"
                    label="Téléphone"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-alert type="info" variant="tonal" density="compact" class="mt-4">
                <template v-slot:prepend>
                  <v-icon>mdi-information</v-icon>
                </template>
                Pour modifier vos informations, contactez votre administrateur.
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>

        <v-card elevation="2" class="mt-4">
          <v-card-text class="pa-6">
            <h3 class="text-h6 font-weight-bold mb-4">Changer le mot de passe</h3>
            <v-form ref="passwordFormRef" v-model="passwordValid" @submit.prevent="handleChangePassword">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="passwordForm.currentPassword"
                    label="Mot de passe actuel"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    :append-inner-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showCurrentPassword = !showCurrentPassword"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="passwordForm.newPassword"
                    label="Nouveau mot de passe"
                    :type="showNewPassword ? 'text' : 'password'"
                    :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showNewPassword = !showNewPassword"
                    :rules="[rules.required, rules.minLength]"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="passwordForm.confirmPassword"
                    label="Confirmer le mot de passe"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    :rules="[rules.required, rules.matchPassword]"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
              </v-row>

              <div class="d-flex justify-end mt-4">
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="loading"
                  :disabled="!passwordValid || loading"
                  class="text-none"
                >
                  Changer le mot de passe
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'
import { useUiStore } from '@/stores/ui'
import utilisateurService from '@/services/utilisateur.service'

const authStore = useAuthStore()
const uistore = useUiStore()

// Refs pour les formulaires
const formRef = ref<{ reset?: () => void } | null>(null)
const passwordFormRef = ref<{ reset?: () => void } | null>(null)

// Formulaires et états
const valid = ref(false)
const passwordValid = ref(false)
const loading = ref(false)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
})

// Mot de passe
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Règles de validation
const rules = {
  required: (v: string) => !!v || 'Ce champ est requis',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email invalide',
  minLength: (v: string) => (v && v.length >= 6) || 'Minimum 6 caractères',
  matchPassword: (v: string) => v === passwordForm.value.newPassword || 'Les mots de passe ne correspondent pas',
}

// Mettre à jour le formulaire dès que l'utilisateur est chargé
watch(
  () => authStore.user,
  (user) => {
    if (user) {
      form.value = {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
      }
    }
  },
  { immediate: true }
)

// Helpers
const currentUser = computed(() => authStore.user)

const getInitials = (): string => {
  if (!currentUser.value) return ''
  return `${currentUser.value.prenom.charAt(0)}${currentUser.value.nom.charAt(0)}`.toUpperCase()
}

const getRoleColor = (role?: UserRole): string => {
  switch (role) {
    case 'admin': return 'error'
    case 'gerant': return 'warning'
    case 'employe': return 'info'
    default: return 'grey'
  }
}

const getRoleLabel = (role?: UserRole): string => {
  switch (role) {
    case 'admin': return 'Administrateur'
    case 'gerant': return 'Gérant'
    case 'employe': return 'Employé'
    default: return 'Inconnu'
  }
}

// Changer le mot de passe
const handleChangePassword = async () => {
  if (!passwordValid.value) return

  uistore.showLoader()
  try {
    const data = {
      oldPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    }

    const result = await utilisateurService.updatePassword(data)
    uistore.showToast(result.message, 'success')

    // Reset formulaire
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    passwordFormRef.value?.reset?.()
  } catch (error: any) {
    const message = error.response?.data?.message || 'Erreur lors du changement de mot de passe'
    uistore.showToast(message, 'error')
  } finally {
    uistore.hideLoader()
  }
}
</script>

