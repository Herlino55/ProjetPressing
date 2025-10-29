<template>
  <div>
    <div class="mb-6">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="{ name: 'Utilisateurs' }" class="text-none mb-4">
        Retour
      </v-btn>
      <h1 class="text-h4 font-weight-bold">
        {{ isEdit ? 'Modifier' : 'Nouvel' }} utilisateur
      </h1>
      <p class="text-subtitle-1 text-grey mt-1">
        {{ isEdit ? 'Modifier les informations' : 'Créer un nouveau compte utilisateur' }}
      </p>
    </div>

    <v-card elevation="2" max-width="800">
      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.nom"
                label="Nom *"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.prenom"
                label="Prénom *"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                label="Email *"
                type="email"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.telephone"
                label="Téléphone *"
                :rules="[rules.required, rules.phone]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="form.role"
                label="Rôle *"
                :items="roleItems"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="form.statut"
                label="Statut *"
                :items="statusItems"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>

            <v-col v-if="!isEdit" cols="12" md="6">
              <v-text-field
                v-model="form.password"
                label="Mot de passe *"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                :rules="[rules.required, rules.minLength]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col v-if="!isEdit" cols="12" md="6">
              <v-text-field
                v-model="form.confirmPassword"
                label="Confirmer mot de passe *"
                :type="showConfirmPassword ? 'text' : 'password'"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                :rules="[rules.required, rules.matchPassword]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-alert type="info" variant="tonal" density="compact" class="mb-4">
                <template v-slot:prepend>
                  <v-icon>mdi-information</v-icon>
                </template>
                <div class="text-caption">
                  <strong>Permissions par rôle :</strong>
                  <ul class="mt-2">
                    <li><strong>Admin :</strong> Accès complet à toutes les fonctionnalités</li>
                    <li><strong>Gérant :</strong> Gestion utilisateurs, clients, commandes, statistiques</li>
                    <li><strong>Employé :</strong> Gestion clients et commandes uniquement</li>
                  </ul>
                </div>
              </v-alert>
            </v-col>
          </v-row>

          <v-divider class="my-6"></v-divider>

          <div class="d-flex justify-end gap-2">
            <v-btn variant="text" :to="{ name: 'Utilisateurs' }" class="text-none">
              Annuler
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              :loading="loading"
              :disabled="!valid || loading"
              class="text-none"
            >
              {{ isEdit ? 'Modifier' : 'Créer' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import utilisateurService from '@/services/utilisateur.service'
import type { Utilisateur, UserRole, UserStatus } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const valid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const isEdit = computed(() => !!route.params.id)

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  role: 'employe' as UserRole,
  statut: 'actif' as UserStatus,
  password: '',
  confirmPassword: '',
  boutiqueId: authStore.user?.boutiqueId || 1,
})

const roleItems = [
  { title: 'Admin', value: 'admin' },
  { title: 'Gérant', value: 'gerant' },
  { title: 'Employé', value: 'employe' },
]

const statusItems = [
  { title: 'Actif', value: 'actif' },
  { title: 'Inactif', value: 'inactif' },
]

const rules = {
  required: (v: string) => !!v || 'Ce champ est requis',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email invalide',
  phone: (v: string) => /^[0-9]{10}$/.test(v) || 'Téléphone invalide (10 chiffres)',
  minLength: (v: string) => (v && v.length >= 6) || 'Minimum 6 caractères',
  matchPassword: (v: string) => v === form.value.password || 'Les mots de passe ne correspondent pas',
}

onMounted(async () => {
  if (isEdit.value) {
    await loadUtilisateur()
  }
})

const loadUtilisateur = async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const user = await utilisateurService.getById(id)
    form.value = {
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      statut: user.statut,
      password: '',
      confirmPassword: '',
      boutiqueId: user.boutiqueId,
    }
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Erreur de chargement', 'error')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!valid.value) return

  loading.value = true
  try {
    const data: Partial<Utilisateur> = {
      nom: form.value.nom,
      prenom: form.value.prenom,
      email: form.value.email,
      telephone: form.value.telephone,
      role: form.value.role,
      statut: form.value.statut,
      boutiqueId: form.value.boutiqueId,
    }

    if (isEdit.value) {
      const id = parseInt(route.params.id as string)
      await utilisateurService.update(id, data)
      showSnackbar('Utilisateur modifié avec succès', 'success')
    } else {
      await utilisateurService.create({ ...data, password: form.value.password } as any)
      showSnackbar('Utilisateur créé avec succès', 'success')
    }

    setTimeout(() => {
      router.push({ name: 'Utilisateurs' })
    }, 1500)
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Erreur lors de la sauvegarde', 'error')
  } finally {
    loading.value = false
  }
}

const showSnackbar = (text: string, color: string = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
