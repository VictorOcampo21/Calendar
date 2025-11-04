<template>
  <Modal
    :is-open="isOpen"
    :size="'lg'"
    @close="$emit('close')"
  >
    <template #header>
      <h3 class="text-lg font-medium text-gray-900">
        Configuración de notas
      </h3>
    </template>

    <template #body>
      <div class="space-y-8">
        <!-- Editor settings -->
        <div>
          <h4 class="text-base font-medium text-gray-900 mb-4">Editor</h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tema del editor
              </label>
              <select
                v-model="settings.editor.theme"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="sepia">Sepia</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tamaño de fuente
              </label>
              <div class="flex items-center space-x-4">
                <input
                  v-model="settings.editor.fontSize"
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  class="flex-1"
                />
                <span class="text-sm text-gray-600 w-8">{{ settings.editor.fontSize }}px</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Familia de fuente
              </label>
              <select
                v-model="settings.editor.fontFamily"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="system">Sistema</option>
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Resaltado de sintaxis</label>
                <p class="text-sm text-gray-500">Resaltar código en las notas</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.editor.syntaxHighlighting"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Corrector ortográfico</label>
                <p class="text-sm text-gray-500">Verificar ortografía mientras escribes</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.editor.spellCheck"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Modo focus</label>
                <p class="text-sm text-gray-500">Ocultar distracciones al escribir</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.editor.focusMode"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Auto-save settings -->
        <div>
          <h4 class="text-base font-medium text-gray-900 mb-4">Guardado automático</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Guardado automático</label>
                <p class="text-sm text-gray-500">Guardar cambios automáticamente</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.autoSave.enabled"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div v-if="settings.autoSave.enabled">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Intervalo de guardado (segundos)
              </label>
              <div class="flex items-center space-x-4">
                <input
                  v-model="settings.autoSave.interval"
                  type="range"
                  min="5"
                  max="300"
                  step="5"
                  class="flex-1"
                />
                <span class="text-sm text-gray-600 w-12">{{ settings.autoSave.interval }}s</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Historial de versiones</label>
                <p class="text-sm text-gray-500">Guardar versiones anteriores automáticamente</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.autoSave.versionHistory"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div v-if="settings.autoSave.versionHistory">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Retener versiones por (días)
              </label>
              <select
                v-model="settings.autoSave.retentionDays"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option :value="7">7 días</option>
                <option :value="30">30 días</option>
                <option :value="90">90 días</option>
                <option :value="365">1 año</option>
                <option :value="-1">Indefinido</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Security settings -->
        <div>
          <h4 class="text-base font-medium text-gray-900 mb-4">Seguridad</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Encriptación por defecto</label>
                <p class="text-sm text-gray-500">Encriptar nuevas notas automáticamente</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.security.defaultEncryption"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de bloqueo automático (minutos)
              </label>
              <select
                v-model="settings.security.autoLockMinutes"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option :value="0">Nunca</option>
                <option :value="5">5 minutos</option>
                <option :value="15">15 minutos</option>
                <option :value="30">30 minutos</option>
                <option :value="60">1 hora</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Confirmación para eliminar</label>
                <p class="text-sm text-gray-500">Pedir confirmación antes de eliminar notas</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.security.deleteConfirmation"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Export settings -->
        <div>
          <h4 class="text-base font-medium text-gray-900 mb-4">Exportación</h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Formato por defecto
              </label>
              <select
                v-model="settings.export.defaultFormat"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="markdown">Markdown (.md)</option>
                <option value="html">HTML (.html)</option>
                <option value="pdf">PDF (.pdf)</option>
                <option value="txt">Texto plano (.txt)</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Incluir metadatos</label>
                <p class="text-sm text-gray-500">Incluir fechas, etiquetas y autor en exportaciones</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.export.includeMetadata"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Incluir adjuntos</label>
                <p class="text-sm text-gray-500">Incluir imágenes y archivos adjuntos</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.export.includeAttachments"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Collaboration settings -->
        <div>
          <h4 class="text-base font-medium text-gray-900 mb-4">Colaboración</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Mostrar cursores en tiempo real</label>
                <p class="text-sm text-gray-500">Ver dónde están editando otros colaboradores</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.collaboration.showCursors"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Notificaciones de cambios</label>
                <p class="text-sm text-gray-500">Recibir notificaciones cuando otros editen</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.collaboration.changeNotifications"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Permisos por defecto para nuevas notas
              </label>
              <select
                v-model="settings.collaboration.defaultPermissions"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="private">Privada</option>
                <option value="view">Solo lectura</option>
                <option value="edit">Edición</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Storage settings -->
        <div>
          <h4 class="text-base font-medium text-gray-900 mb-4">Almacenamiento</h4>
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Espacio utilizado</span>
                <span class="text-sm text-gray-600">2.3 GB de 5 GB</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-indigo-600 h-2 rounded-full" style="width: 46%"></div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Sincronización offline</label>
                <p class="text-sm text-gray-500">Permitir edición sin conexión</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.storage.offlineSync"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div>
              <button
                @click="clearCache"
                class="btn-secondary"
              >
                <TrashIcon class="w-4 h-4 mr-2" />
                Limpiar caché local
              </button>
              <p class="text-xs text-gray-500 mt-1">
                Libera espacio eliminando archivos temporales
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between">
        <button
          @click="resetToDefaults"
          class="btn-secondary"
        >
          Restaurar por defecto
        </button>
        
        <div class="flex space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Cancelar
          </button>
          <button
            @click="saveSettings"
            :disabled="isSaving"
            class="btn-primary"
          >
            <div v-if="isSaving" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2"></div>
              Guardando...
            </div>
            <span v-else>Guardar cambios</span>
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import Modal from '@/components/ui/Modal.vue'
import { TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'settings-updated'])

const appStore = useAppStore()

const isSaving = ref(false)

const settings = reactive({
  editor: {
    theme: 'light',
    fontSize: 16,
    fontFamily: 'system',
    syntaxHighlighting: true,
    spellCheck: true,
    focusMode: false
  },
  autoSave: {
    enabled: true,
    interval: 30,
    versionHistory: true,
    retentionDays: 90
  },
  security: {
    defaultEncryption: false,
    autoLockMinutes: 30,
    deleteConfirmation: true
  },
  export: {
    defaultFormat: 'markdown',
    includeMetadata: true,
    includeAttachments: true
  },
  collaboration: {
    showCursors: true,
    changeNotifications: true,
    defaultPermissions: 'private'
  },
  storage: {
    offlineSync: true
  }
})

const defaultSettings = {
  editor: {
    theme: 'light',
    fontSize: 16,
    fontFamily: 'system',
    syntaxHighlighting: true,
    spellCheck: true,
    focusMode: false
  },
  autoSave: {
    enabled: true,
    interval: 30,
    versionHistory: true,
    retentionDays: 90
  },
  security: {
    defaultEncryption: false,
    autoLockMinutes: 30,
    deleteConfirmation: true
  },
  export: {
    defaultFormat: 'markdown',
    includeMetadata: true,
    includeAttachments: true
  },
  collaboration: {
    showCursors: true,
    changeNotifications: true,
    defaultPermissions: 'private'
  },
  storage: {
    offlineSync: true
  }
}

const loadSettings = () => {
  // Load settings from localStorage or API
  const saved = localStorage.getItem('notes-settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      Object.assign(settings, parsed)
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }
}

const saveSettings = async () => {
  isSaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Save to localStorage
    localStorage.setItem('notes-settings', JSON.stringify(settings))
    
    emit('settings-updated', { ...settings })
    appStore.showToast('Configuración guardada exitosamente', 'success')
  } catch (error) {
    console.error('Error saving settings:', error)
    appStore.showToast('Error al guardar la configuración', 'error')
  } finally {
    isSaving.value = false
  }
}

const resetToDefaults = () => {
  const confirmed = confirm('¿Estás seguro de que quieres restaurar todas las configuraciones por defecto?')
  
  if (confirmed) {
    Object.assign(settings, JSON.parse(JSON.stringify(defaultSettings)))
    appStore.showToast('Configuración restaurada por defecto', 'info')
  }
}

const clearCache = async () => {
  const confirmed = confirm('¿Estás seguro de que quieres limpiar la caché local? Esto puede afectar el rendimiento temporalmente.')
  
  if (confirmed) {
    try {
      // Clear various caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
      }
      
      // Clear specific localStorage items
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('notes-cache-') || key.startsWith('notes-temp-')
      )
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      appStore.showToast('Caché limpiada exitosamente', 'success')
    } catch (error) {
      console.error('Error clearing cache:', error)
      appStore.showToast('Error al limpiar la caché', 'error')
    }
  }
}

// Load settings when component mounts
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadSettings()
  }
}, { immediate: true })
</script>

<style scoped>
.toggle-switch {
  @apply w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer transition-colors;
}

.toggle-switch::after {
  @apply content-[''] absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-all;
}

/* Peer states for toggle */
input[type="checkbox"]:checked + .toggle-switch {
  @apply bg-indigo-600;
}

input[type="checkbox"]:checked + .toggle-switch::after {
  @apply translate-x-full border-white;
}

input[type="checkbox"]:focus + .toggle-switch {
  @apply outline-none ring-4 ring-indigo-300;
}
</style>