<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height class="login-container">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="5" lg="4">
            <v-card elevation="8" class="rounded-lg">
              <v-card-text class="pa-8">
                <div class="text-center mb-8">
                  <v-icon color="primary" size="64">mdi-washing-machine</v-icon>
                  <h1 class="text-h4 font-weight-bold primary--text mt-4">Pressing</h1>
                  <p class="text-subtitle-1 text-grey">Management System</p>
                </div>

                <v-form ref="formRef" v-model="valid" @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="credentials.email"
                    label="Email"
                    prepend-inner-icon="mdi-email"
                    type="email"
                    :rules="emailRules"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>

                  <v-text-field
                    v-model="credentials.password"
                    label="Mot de passe"
                    prepend-inner-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    :rules="passwordRules"
                    variant="outlined"
                    density="comfortable"
                    class="mb-4"
                  ></v-text-field>

                  <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
                    {{ error }}
                  </v-alert>

                  <v-btn
                    type="submit"
                    block
                    color="primary"
                    size="large"
                    :loading="loading"
                    :disabled="!valid || loading"
                    class="text-none"
                  >
                    Se connecter
                  </v-btn>
                </v-form>

                <div class="text-center mt-6">
                  <p class="text-caption text-grey">
                    Connectez-vous avec vos identifiants
                  </p>
                </div>
              </v-card-text>
            </v-card>

            <div class="text-center mt-8">
              <p class="text-caption text-grey">
                &copy; 2024 Pressing Management System. Tous droits réservés.
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref()
const valid = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const credentials = ref<LoginCredentials>({
  email: '',
  password: '',
})

const emailRules = [
  (v: string) => !!v || 'Email requis',
  (v: string) => /.+@.+\..+/.test(v) || 'Email invalide',
]

const passwordRules = [
  (v: string) => !!v || 'Mot de passe requis',
  (v: string) => v.length >= 6 || 'Minimum 6 caractères',
]

const handleLogin = async () => {
  if (!valid.value) return

  loading.value = true
  error.value = null

  try {
    await authStore.login(credentials.value)
    await nextTick()
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
    console.log(2)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Une erreur c\'est produite. Veuillez reessayer plutard '
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.v-card {
  backdrop-filter: blur(10px);
}
</style>
