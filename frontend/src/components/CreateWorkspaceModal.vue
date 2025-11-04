<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            Crear Nuevo Espacio
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="createWorkspace" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del espacio
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="input"
              placeholder="Mi nuevo espacio"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="input"
              placeholder="Descripción del espacio de trabajo"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de espacio
            </label>
            <select v-model="form.type" class="input">
              <option value="personal">👤 Personal</option>
              <option value="business">🏢 Empresa</option>
              <option value="family">👨‍👩‍👧‍👦 Familia</option>
              <option value="team">👥 Equipo</option>
              <option value="project">📋 Proyecto</option>
            </select>
          </div>

          <!-- Settings preview -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Configuración inicial</h4>
            <div class="text-xs text-gray-600 space-y-1">
              <p>💰 Moneda: {{ form.settings.currency }}</p>
              <p>📅 Formato fecha: {{ form.settings.dateFormat }}</p>
              <p>🕐 Formato hora: {{ form.settings.timeFormat }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 btn btn-primary"
            >
              <span v-if="!isLoading">Crear Espacio</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { mockWorkspaces } from '@/mock-data'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close', 'created'])

const authStore = useAuthStore()
const isLoading = ref(false)

const form = ref({
  name: '',
  description: '',
  type: 'personal',
  settings: {
    currency: 'MXN',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    defaultCalendarView: 'month'
  }
})

const createWorkspace = async () => {
  isLoading.value = true
  
  try {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Crear nuevo workspace mock
    const newWorkspace = {
      id: mockWorkspaces.length + 1,
      name: form.value.name,
      description: form.value.description || `Espacio ${form.value.type}`,
      type: form.value.type,
      ownerId: authStore.user.id,
      members: [authStore.user.id],
      settings: { ...form.value.settings },
      createdAt: new Date().toISOString()
    }

    // Simular guardar en "base de datos"
    mockWorkspaces.push(newWorkspace)
    authStore.availableWorkspaces.push(newWorkspace)

    emit('created', newWorkspace)
  } catch (error) {
    console.error('Error creating workspace:', error)
  } finally {
    isLoading.value = false
  }
}
</script>