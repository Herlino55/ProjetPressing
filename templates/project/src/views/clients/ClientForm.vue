<template>
  <div>
    <div class="mb-6">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="{ name: 'Clients' }" class="text-none mb-4">
        Retour
      </v-btn>
      <h1 class="text-h4 font-weight-bold">
        {{ isEdit ? 'Modifier' : 'Nouveau' }} client
      </h1>
      <p class="text-subtitle-1 text-grey mt-1">
        {{ isEdit ? 'Modifier les informations du client' : 'Ajouter un nouveau client à votre base' }}
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
                v-model="form.telephone"
                label="Téléphone *"
                :rules="[rules.required, rules.phone]"
                placeholder="Ex: 0612345678"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                :rules="[rules.email]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.adresse"
                label="Adresse"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-alert type="info" variant="tonal" density="compact">
                <template v-slot:prepend>
                  <v-icon>mdi-information</v-icon>
                </template>
                Les clients peuvent recevoir des rappels via WhatsApp et participer à des promotions de fidélisation.
              </v-alert>
            </v-col>
          </v-row>

          <v-divider class="my-6"></v-divider>

          <div class="d-flex justify-end gap-2">
            <v-btn variant="text" :to="{ name: 'Clients' }" class="text-none">
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
import clientService from '@/services/client.service'
import type { Client } from '@/types'

const route = useRoute()
const router = useRouter()

const formRef = ref()
const valid = ref(false)
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const isEdit = computed(() => !!route.params.id)

const form = ref<Partial<Client>>({
  nom: '',
  prenom: '',
  telephone: '',
  email: '',
  adresse: '',
})

const rules = {
  required: (v: string) => !!v || 'Ce champ est requis',
  email: (v: string) => !v || /.+@.+\..+/.test(v) || 'Email invalide',
  phone: (v: string) => /^[0-9]{9}$/.test(v) || 'Téléphone invalide (09 chiffres)',
}

onMounted(async () => {
  if (isEdit.value) {
    await loadClient()
  }
})

const loadClient = async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const client = await (await clientService.getById(id)).data
    form.value = {
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
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
    if (isEdit.value) {
      const id = parseInt(route.params.id as string)
      await clientService.update(id, form.value)
      showSnackbar('Client modifié avec succès', 'success')
    } else {
      await clientService.create(form.value)
      showSnackbar('Client créé avec succès', 'success')
    }

    setTimeout(() => {
      router.push({ name: 'Clients' })
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
