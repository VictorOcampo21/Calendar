<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-md w-full space-y-8 p-8">
      <!-- Logo y título -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <span class="text-3xl">📅</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Demo Agenda-Financiera
        </h2>
        <p class="text-gray-600">
          Click en "Entrar Demo" para acceder
        </p>
      </div>

      <!-- Botón de demo -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="space-y-6">
          <div class="text-center">
            <p class="text-gray-600 mb-4">
              Usuario de demostración
            </p>
            <p class="text-sm text-gray-500">
              Email: demo@example.com<br>
              Contraseña: demo123
            </p>
          </div>
          
          <button
            @click="loginDemo"
            class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">🚀 Entrar Demo</span>
            <span v-else>Cargando...</span>
          </button>
          
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const error = ref('')

const loginDemo = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    // Login automático con datos demo
    const result = await authStore.initializeDemo()
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Error al inicializar demo'
    }
  } catch (err) {
    error.value = 'Error al cargar la aplicación'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>