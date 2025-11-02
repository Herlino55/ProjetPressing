<template>
  <v-overlay
    v-model="isLoading"
    class="align-center justify-center"
    persistent
  >
    <div class="pulse-loader" />
  </v-overlay>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useUiStore } from '@/stores/ui'

  const uiStore = useUiStore()
  const isLoading = computed(() => uiStore.isLoading)
</script>

<style scoped>
.pulse-loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #1867C0; /* Couleur primary de Vuetify */
  animation: pulse-animation 1.5s infinite ease-in-out;
}

@keyframes pulse-animation {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
    box-shadow: 0 0 0 0 rgba(24, 103, 192, 0.7);
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
    box-shadow: 0 0 0 15px rgba(24, 103, 192, 0);
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
    box-shadow: 0 0 0 0 rgba(24, 103, 192, 0);
  }
}
</style>
