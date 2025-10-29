<template>

  <v-snackbar

    v-model="show"

    :color="toastType"

    location="bottom right"

    :timeout="4000"
  >

    {{ toastMessage }}

    <template #actions>

      <v-btn

        text

        @click="hideToast"
      >

        Fermer

      </v-btn>

    </template>

  </v-snackbar>

</template>

<script setup lang="ts">
  import { useUiStore } from '@/stores/ui'
import { computed } from 'vue'

  const uiStore = useUiStore()

  const show = computed({
    get: () => uiStore.toast.show,
    set: val => {
      if (!val) uiStore.hideToast()
    },
  })
  const toastMessage = computed(() => uiStore.toast.message)
  const toastType = computed(() => uiStore.toast.type)

  const hideToast = () => {
    uiStore.hideToast()
  }
</script>

<style scoped>
.couture-snackbar {
  background-color: #f7f3f2 !important;
  color: #5d4d54 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.v-snackbar__content .v-icon) {
  color: #b76e79 !important;
}

:deep(.v-btn) {
  color: #9c898c !important;
}

:deep(.v-snackbar.v-snackbar--rounded) {
  border-radius: 20px;
}
</style>
