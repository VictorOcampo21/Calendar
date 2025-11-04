<template>
  <Modal
    :is-open="isOpen"
    :size="'lg'"
    @close="$emit('close')"
  >
    <template #header>
      <h3 class="text-lg font-medium text-gray-900">
        Compartir nota: {{ note.title }}
      </h3>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Share link -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Enlace de la nota
          </label>
          <div class="flex">
            <input
              :value="shareLink"
              readonly
              class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-700"
            />
            <button
              @click="copyShareLink"
              class="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors"
            >
              <ClipboardIcon class="w-4 h-4" />
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-500">
            Cualquier persona con este enlace podrá ver la nota
          </p>
        </div>

        <!-- Access level -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Nivel de acceso
          </label>
          <div class="space-y-3">
            <label class="flex items-start">
              <input
                v-model="shareSettings.accessLevel"
                type="radio"
                value="view"
                class="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">Solo lectura</div>
                <div class="text-sm text-gray-500">
                  Los colaboradores pueden ver y comentar la nota
                </div>
              </div>
            </label>
            
            <label class="flex items-start">
              <input
                v-model="shareSettings.accessLevel"
                type="radio"
                value="edit"
                class="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">Edición</div>
                <div class="text-sm text-gray-500">
                  Los colaboradores pueden editar el contenido de la nota
                </div>
              </div>
            </label>
            
            <label class="flex items-start">
              <input
                v-model="shareSettings.accessLevel"
                type="radio"
                value="admin"
                class="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900">Administrador</div>
                <div class="text-sm text-gray-500">
                  Control total: editar, compartir y eliminar la nota
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Invite collaborators -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Invitar colaboradores
          </label>
          
          <!-- Search users -->
          <div class="relative mb-4">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="collaboratorSearch"
              type="text"
              placeholder="Buscar usuarios por nombre o email..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- Search results -->
          <div v-if="collaboratorSearch && searchResults.length > 0" class="mb-4">
            <div class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              <div
                v-for="user in searchResults"
                :key="user.id"
                class="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                @click="addCollaborator(user)"
              >
                <div class="flex items-center space-x-3">
                  <img
                    :src="user.avatar"
                    :alt="user.name"
                    class="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
                <button
                  class="btn-primary-sm"
                  :disabled="isUserAdded(user.id)"
                >
                  {{ isUserAdded(user.id) ? 'Agregado' : 'Agregar' }}
                </button>
              </div>
            </div>
          </div>

          <!-- No results -->
          <div v-else-if="collaboratorSearch && searchResults.length === 0" class="text-center py-4 text-gray-500">
            No se encontraron usuarios
          </div>
        </div>

        <!-- Current collaborators -->
        <div v-if="selectedCollaborators.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Colaboradores seleccionados
          </label>
          <div class="space-y-2">
            <div
              v-for="collaborator in selectedCollaborators"
              :key="collaborator.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <img
                  :src="collaborator.avatar"
                  :alt="collaborator.name"
                  class="w-8 h-8 rounded-full"
                />
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ collaborator.name }}</div>
                  <div class="text-sm text-gray-500">{{ collaborator.email }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <select
                  v-model="collaborator.permission"
                  class="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="view">Solo lectura</option>
                  <option value="edit">Edición</option>
                  <option value="admin">Administrador</option>
                </select>
                
                <button
                  @click="removeCollaborator(collaborator.id)"
                  class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Share options -->
        <div class="border-t pt-6">
          <h4 class="text-sm font-medium text-gray-900 mb-4">Opciones de compartir</h4>
          
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                v-model="shareSettings.allowComments"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-900">Permitir comentarios</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="shareSettings.allowDownload"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-900">Permitir descarga</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="shareSettings.requireLogin"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-900">Requerir inicio de sesión</span>
            </label>
            
            <div>
              <label class="flex items-center mb-2">
                <input
                  v-model="shareSettings.hasExpiration"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-900">Fecha de expiración</span>
              </label>
              
              <input
                v-if="shareSettings.hasExpiration"
                v-model="shareSettings.expirationDate"
                type="datetime-local"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                :min="new Date().toISOString().slice(0, 16)"
              />
            </div>
          </div>
        </div>

        <!-- Current sharing status -->
        <div v-if="note.isShared" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start">
            <InformationCircleIcon class="w-5 h-5 text-blue-400 mt-0.5" />
            <div class="ml-3">
              <h4 class="text-sm font-medium text-blue-800">Esta nota ya está compartida</h4>
              <div class="mt-2 text-sm text-blue-700">
                <p>{{ note.collaborators?.length || 0 }} colaboradores tienen acceso a esta nota.</p>
                <button
                  @click="stopSharing"
                  class="mt-2 text-blue-800 underline hover:no-underline"
                >
                  Dejar de compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between">
        <button
          v-if="note.isShared"
          @click="stopSharing"
          class="btn-danger"
        >
          Dejar de compartir
        </button>
        <div v-else></div>
        
        <div class="flex space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Cancelar
          </button>
          <button
            @click="handleShare"
            :disabled="isSharing"
            class="btn-primary"
          >
            <div v-if="isSharing" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2"></div>
              Compartiendo...
            </div>
            <span v-else>
              {{ note.isShared ? 'Actualizar' : 'Compartir' }}
            </span>
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { mockUsers } from '@/mock-data'
import Modal from '@/components/ui/Modal.vue'
import {
  ClipboardIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  note: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'shared'])

const appStore = useAppStore()

const collaboratorSearch = ref('')
const selectedCollaborators = ref([])
const isSharing = ref(false)

const shareSettings = reactive({
  accessLevel: 'view',
  allowComments: true,
  allowDownload: true,
  requireLogin: false,
  hasExpiration: false,
  expirationDate: ''
})

const shareLink = computed(() => {
  return `${window.location.origin}/notes/shared/${props.note.id}`
})

const searchResults = computed(() => {
  if (!collaboratorSearch.value || collaboratorSearch.value.length < 2) {
    return []
  }
  
  const query = collaboratorSearch.value.toLowerCase()
  return mockUsers.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  ).slice(0, 5)
})

const isUserAdded = (userId) => {
  return selectedCollaborators.value.some(c => c.id === userId)
}

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    appStore.showToast('Enlace copiado al portapapeles', 'success')
  } catch (error) {
    console.error('Error copying link:', error)
    appStore.showToast('Error al copiar el enlace', 'error')
  }
}

const addCollaborator = (user) => {
  if (!isUserAdded(user.id)) {
    selectedCollaborators.value.push({
      ...user,
      permission: shareSettings.accessLevel
    })
    collaboratorSearch.value = ''
  }
}

const removeCollaborator = (userId) => {
  const index = selectedCollaborators.value.findIndex(c => c.id === userId)
  if (index > -1) {
    selectedCollaborators.value.splice(index, 1)
  }
}

const handleShare = async () => {
  isSharing.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const shareData = {
      collaborators: selectedCollaborators.value,
      settings: { ...shareSettings },
      shareLink: shareLink.value
    }
    
    emit('shared', shareData)
    appStore.showToast('Nota compartida exitosamente', 'success')
  } catch (error) {
    console.error('Error sharing note:', error)
    appStore.showToast('Error al compartir la nota', 'error')
  } finally {
    isSharing.value = false
  }
}

const stopSharing = async () => {
  const confirmed = confirm('¿Estás seguro de que quieres dejar de compartir esta nota? Todos los colaboradores perderán el acceso.')
  
  if (confirmed) {
    isSharing.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      emit('shared', {
        collaborators: [],
        settings: null,
        shareLink: null
      })
      
      appStore.showToast('Se dejó de compartir la nota', 'info')
    } catch (error) {
      console.error('Error stopping share:', error)
      appStore.showToast('Error al dejar de compartir', 'error')
    } finally {
      isSharing.value = false
    }
  }
}

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Load existing collaborators if note is already shared
    if (props.note.isShared && props.note.collaborators) {
      selectedCollaborators.value = [...props.note.collaborators]
    } else {
      selectedCollaborators.value = []
    }
    
    collaboratorSearch.value = ''
    shareSettings.accessLevel = 'view'
    shareSettings.allowComments = true
    shareSettings.allowDownload = true
    shareSettings.requireLogin = false
    shareSettings.hasExpiration = false
    shareSettings.expirationDate = ''
  }
})
</script>

<style scoped>
</style>