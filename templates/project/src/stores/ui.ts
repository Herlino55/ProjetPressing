// src/stores/ui.ts
import { defineStore } from 'pinia'

interface UiState {
  isLoading: boolean
  toast: {
    show: boolean
    message: string
    type: 'success' | 'info' | 'error'
  }
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    isLoading: false,
    toast: {
      show: false,
      message: '',
      type: 'info',
    },
  }),
  actions: {
    showLoader () {
      this.isLoading = true
    },
    hideLoader () {
      this.isLoading = false
    },
    showToast (message: string, type: 'success' | 'info' | 'error' = 'info') {
      this.toast.message = message
      this.toast.type = type
      this.toast.show = true
      // Optionnel : masquer automatiquement le toast après 5 secondes
      setTimeout(() => {
        this.hideToast()
      }, 5000)
    },
    hideToast () {
      this.toast.show = false
      this.toast.message = ''
    },
  },
})
