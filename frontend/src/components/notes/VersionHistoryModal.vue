<template>
  <Modal
    :is-open="isOpen"
    :size="'xl'"
    @close="$emit('close')"
  >
    <template #header>
      <h3 class="text-lg font-medium text-gray-900">
        Historial de versiones: {{ note.title }}
      </h3>
    </template>

    <template #body>
      <div class="flex h-96">
        <!-- Versions list -->
        <div class="w-1/3 border-r border-gray-200 pr-4">
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Versiones</h4>
            <p class="text-xs text-gray-500">
              Se guardan automáticamente los cambios importantes
            </p>
          </div>
          
          <div class="space-y-2 max-h-80 overflow-y-auto">
            <div
              v-for="version in versions"
              :key="version.id"
              class="version-item"
              :class="{ 'active': selectedVersion?.id === version.id }"
              @click="selectVersion(version)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="text-sm font-medium text-gray-900">
                      v{{ version.version }}
                    </span>
                    <span
                      v-if="version.id === note.id"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                    >
                      Actual
                    </span>
                    <span
                      v-else-if="version.isAutoSave"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      Auto
                    </span>
                  </div>
                  
                  <p class="text-xs text-gray-500 mb-1">
                    {{ formatDate(version.createdAt) }}
                  </p>
                  
                  <p class="text-xs text-gray-600 line-clamp-2">
                    {{ version.description || 'Sin descripción' }}
                  </p>
                </div>
                
                <div class="flex flex-col items-end space-y-1 ml-2">
                  <div class="text-xs text-gray-400">
                    {{ getWordCount(version.content) }} palabras
                  </div>
                  
                  <div class="flex items-center text-xs text-gray-400">
                    <UserIcon class="w-3 h-3 mr-1" />
                    <span>{{ version.author?.name || 'Desconocido' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Version preview -->
        <div class="flex-1 pl-4">
          <div v-if="!selectedVersion" class="flex items-center justify-center h-full text-gray-500">
            <div class="text-center">
              <ClockIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>Selecciona una versión para ver el contenido</p>
            </div>
          </div>
          
          <div v-else class="h-full flex flex-col">
            <!-- Version header -->
            <div class="mb-4 pb-4 border-b border-gray-200">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-lg font-semibold text-gray-900">
                  {{ selectedVersion.title || 'Sin título' }}
                </h4>
                
                <div class="flex items-center space-x-2">
                  <button
                    v-if="selectedVersion.id !== note.id"
                    @click="compareWithCurrent"
                    class="btn-secondary-sm"
                  >
                    <EyeIcon class="w-4 h-4 mr-1" />
                    Comparar
                  </button>
                  
                  <button
                    v-if="selectedVersion.id !== note.id"
                    @click="restoreVersion"
                    class="btn-primary-sm"
                  >
                    <ArrowUturnLeftIcon class="w-4 h-4 mr-1" />
                    Restaurar
                  </button>
                </div>
              </div>
              
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <div class="flex items-center">
                  <CalendarIcon class="w-4 h-4 mr-1" />
                  <span>{{ formatDate(selectedVersion.createdAt, true) }}</span>
                </div>
                
                <div class="flex items-center">
                  <UserIcon class="w-4 h-4 mr-1" />
                  <span>{{ selectedVersion.author?.name || 'Desconocido' }}</span>
                </div>
                
                <div class="flex items-center">
                  <DocumentTextIcon class="w-4 h-4 mr-1" />
                  <span>{{ getWordCount(selectedVersion.content) }} palabras</span>
                </div>
              </div>
              
              <!-- Tags at this version -->
              <div v-if="selectedVersion.tags && selectedVersion.tags.length > 0" class="mt-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in selectedVersion.tags"
                    :key="tag"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Version content -->
            <div class="flex-1 overflow-y-auto">
              <div
                v-if="showComparison"
                class="prose prose-sm max-w-none"
              >
                <h5 class="text-sm font-medium text-gray-900 mb-2">Comparación con versión actual:</h5>
                <div v-html="comparisonContent" class="border border-gray-200 rounded p-4"></div>
              </div>
              
              <div
                v-else
                class="prose prose-sm max-w-none"
                v-html="selectedVersion.content"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="exportVersions"
            class="btn-secondary"
          >
            <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
            Exportar historial
          </button>
          
          <label class="flex items-center text-sm text-gray-600">
            <input
              v-model="autoSaveEnabled"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
            />
            Guardar versiones automáticamente
          </label>
        </div>
        
        <div class="flex space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Cerrar
          </button>
          
          <button
            v-if="selectedVersion && selectedVersion.id !== note.id"
            @click="restoreVersion"
            :disabled="isRestoring"
            class="btn-primary"
          >
            <div v-if="isRestoring" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2"></div>
              Restaurando...
            </div>
            <span v-else>
              <ArrowUturnLeftIcon class="w-4 h-4 mr-2" />
              Restaurar esta versión
            </span>
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import Modal from '@/components/ui/Modal.vue'
import {
  ClockIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowUturnLeftIcon,
  ArrowDownTrayIcon
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

const emit = defineEmits(['close', 'restore'])

const appStore = useAppStore()

const selectedVersion = ref(null)
const showComparison = ref(false)
const autoSaveEnabled = ref(true)
const isRestoring = ref(false)

// Mock version history data
const versions = computed(() => [
  {
    id: props.note.id,
    version: props.note.version || 1,
    title: props.note.title,
    content: props.note.content,
    tags: props.note.tags,
    createdAt: props.note.updatedAt,
    author: { id: 1, name: 'Usuario Actual' },
    description: 'Versión actual',
    isAutoSave: false
  },
  {
    id: Date.now() - 1,
    version: (props.note.version || 1) - 1,
    title: props.note.title,
    content: props.note.content.replace(/último/g, 'anterior'),
    tags: props.note.tags?.slice(0, -1) || [],
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    author: { id: 1, name: 'Usuario Actual' },
    description: 'Cambios en el contenido principal',
    isAutoSave: true
  },
  {
    id: Date.now() - 2,
    version: (props.note.version || 1) - 2,
    title: props.note.title.replace(/nota/i, 'documento'),
    content: props.note.content.substring(0, props.note.content.length * 0.8),
    tags: ['borrador'],
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    author: { id: 1, name: 'Usuario Actual' },
    description: 'Versión inicial del documento',
    isAutoSave: false
  },
  {
    id: Date.now() - 3,
    version: (props.note.version || 1) - 3,
    title: 'Borrador inicial',
    content: '<p>Contenido inicial muy básico...</p>',
    tags: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    author: { id: 1, name: 'Usuario Actual' },
    description: 'Primera versión',
    isAutoSave: false
  }
])

const comparisonContent = computed(() => {
  if (!selectedVersion.value || selectedVersion.value.id === props.note.id) {
    return ''
  }
  
  // Simple diff highlighting (in a real app, use a proper diff library)
  const currentContent = getTextContent(props.note.content)
  const versionContent = getTextContent(selectedVersion.value.content)
  
  return `
    <div class="space-y-4">
      <div>
        <h6 class="text-xs font-medium text-red-600 mb-1">Versión anterior:</h6>
        <div class="bg-red-50 p-2 rounded text-sm">${versionContent}</div>
      </div>
      <div>
        <h6 class="text-xs font-medium text-green-600 mb-1">Versión actual:</h6>
        <div class="bg-green-50 p-2 rounded text-sm">${currentContent}</div>
      </div>
    </div>
  `
})

const formatDate = (dateString, detailed = false) => {
  const date = new Date(dateString)
  
  if (detailed) {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Ahora'
  if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Hace ${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays < 7) return `Hace ${diffInDays}d`
  
  return date.toLocaleDateString('es-ES', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const getTextContent = (html) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

const getWordCount = (content) => {
  const text = getTextContent(content)
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

const selectVersion = (version) => {
  selectedVersion.value = version
  showComparison.value = false
}

const compareWithCurrent = () => {
  showComparison.value = !showComparison.value
}

const restoreVersion = async () => {
  if (!selectedVersion.value || selectedVersion.value.id === props.note.id) {
    return
  }
  
  const confirmed = confirm(
    `¿Estás seguro de que quieres restaurar esta versión? ` +
    `Se perderán los cambios actuales y se creará una nueva versión.`
  )
  
  if (!confirmed) return
  
  isRestoring.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('restore', {
      title: selectedVersion.value.title,
      content: selectedVersion.value.content,
      tags: selectedVersion.value.tags || []
    })
    
    appStore.showToast('Versión restaurada exitosamente', 'success')
  } catch (error) {
    console.error('Error restoring version:', error)
    appStore.showToast('Error al restaurar la versión', 'error')
  } finally {
    isRestoring.value = false
  }
}

const exportVersions = () => {
  const versionsData = versions.value.map(v => ({
    version: v.version,
    title: v.title,
    content: getTextContent(v.content),
    createdAt: v.createdAt,
    author: v.author?.name,
    description: v.description
  }))
  
  const jsonData = JSON.stringify(versionsData, null, 2)
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `historial-${props.note.title || 'nota'}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  appStore.showToast('Historial exportado exitosamente', 'success')
}

// Auto-select current version when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedVersion.value = versions.value[0] // Current version
    showComparison.value = false
  }
})
</script>

<style scoped>
.version-item {
  @apply p-3 border border-gray-200 rounded-lg cursor-pointer transition-all hover:border-indigo-300 hover:bg-indigo-50;
}

.version-item.active {
  @apply border-indigo-500 bg-indigo-100;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>