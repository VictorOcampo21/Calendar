<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-md w-full space-y-8 p-8">
      <!-- Logo y título -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <span class="text-3xl">📅</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Crear Cuenta
        </h2>
        <p class="text-gray-600">
          Únete a nuestra plataforma de gestión integral
        </p>
      </div>

      <!-- Formulario de registro -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            <input
              id="name"
              v-model="registerForm.name"
              type="text"
              required
              class="input"
              placeholder="Juan Pérez"
              :disabled="authStore.isLoading"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              v-model="registerForm.email"
              type="email"
              required
              class="input"
              placeholder="tu@email.com"
              :disabled="authStore.isLoading"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input pr-10"
                placeholder="••••••••"
                :disabled="authStore.isLoading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Mínimo 6 caracteres
            </p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              class="input"
              placeholder="••••••••"
              :disabled="authStore.isLoading"
            />
          </div>

          <!-- Error message -->
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <ExclamationCircleIcon class="h-5 w-5 text-red-400 mr-2" />
              <p class="text-sm text-red-700">{{ authStore.error }}</p>
            </div>
          </div>

          <!-- Validation error -->
          <div v-if="validationError" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <ExclamationCircleIcon class="h-5 w-5 text-red-400 mr-2" />
              <p class="text-sm text-red-700">{{ validationError }}</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="authStore.isLoading || !isFormValid"
              class="w-full btn btn-primary relative"
            >
              <span v-if="!authStore.isLoading">Crear Cuenta</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando cuenta...
              </span>
            </button>
          </div>
        </form>

        <!-- Enlaces -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
            </div>
          </div>

          <div class="mt-6">
            <router-link
              to="/login"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Iniciar sesión
            </router-link>
          </div>
        </div>
      </div>

      <!-- Términos y condiciones -->
      <div class="text-center text-xs text-gray-500">
        Al crear una cuenta, aceptas nuestros
        <a href="#" class="text-indigo-600 hover:text-indigo-500">Términos de Servicio</a>
        y
        <a href="#" class="text-indigo-600 hover:text-indigo-500">Política de Privacidad</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const showPassword = ref(false)
const validationError = ref('')

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  return registerForm.value.name && 
         registerForm.value.email && 
         registerForm.value.password.length >= 6 && 
         registerForm.value.password === registerForm.value.confirmPassword
})

const handleRegister = async () => {
  validationError.value = ''
  authStore.clearError()
  
  // Validaciones
  if (registerForm.value.password.length < 6) {
    validationError.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    validationError.value = 'Las contraseñas no coinciden'
    return
  }
  
  const result = await authStore.register({
    name: registerForm.value.name,
    email: registerForm.value.email,
    password: registerForm.value.password
  })
  
  if (result.success) {
    appStore.addToast({
      type: 'success',
      title: '¡Cuenta creada!',
      message: `Bienvenido ${registerForm.value.name}, tu cuenta ha sido creada exitosamente.`
    })
    router.push('/dashboard')
  }
}
</script>