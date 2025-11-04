<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="close"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            Configuración de Chat
          </h2>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 space-y-6">
        <!-- Notifications -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Notificaciones</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Sonido de notificación
                </label>
                <p class="text-xs text-gray-500">
                  Reproducir sonido cuando lleguen mensajes
                </p>
              </div>
              <input
                v-model="settings.soundEnabled"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Notificaciones push
                </label>
                <p class="text-xs text-gray-500">
                  Mostrar notificaciones en el escritorio
                </p>
              </div>
              <input
                v-model="settings.pushEnabled"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Mostrar preview
                </label>
                <p class="text-xs text-gray-500">
                  Mostrar contenido del mensaje en notificaciones
                </p>
              </div>
              <input
                v-model="settings.showPreview"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <!-- Appearance -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Apariencia</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tema
              </label>
              <select v-model="settings.theme" class="input-field">
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tamaño de fuente
              </label>
              <select v-model="settings.fontSize" class="input-field">
                <option value="small">Pequeña</option>
                <option value="medium">Mediana</option>
                <option value="large">Grande</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Emojis animados
                </label>
                <p class="text-xs text-gray-500">
                  Animar emojis en los mensajes
                </p>
              </div>
              <input
                v-model="settings.animatedEmojis"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <!-- Privacy -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Privacidad</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Confirmación de lectura
                </label>
                <p class="text-xs text-gray-500">
                  Mostrar cuando has leído mensajes
                </p>
              </div>
              <input
                v-model="settings.readReceipts"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Estado en línea
                </label>
                <p class="text-xs text-gray-500">
                  Mostrar cuando estás en línea
                </p>
              </div>
              <input
                v-model="settings.showOnlineStatus"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Indicador de escritura
                </label>
                <p class="text-xs text-gray-500">
                  Mostrar cuando estás escribiendo
                </p>
              </div>
              <input
                v-model="settings.showTyping"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <!-- Advanced -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Avanzado</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Formato de hora
              </label>
              <select v-model="settings.timeFormat" class="input-field">
                <option value="12">12 horas (AM/PM)</option>
                <option value="24">24 horas</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Enter para enviar
                </label>
                <p class="text-xs text-gray-500">
                  Enviar mensaje al presionar Enter
                </p>
              </div>
              <input
                v-model="settings.enterToSend"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Auto-scroll
                </label>
                <p class="text-xs text-gray-500">
                  Desplazar automáticamente a nuevos mensajes
                </p>
              </div>
              <input
                v-model="settings.autoScroll"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <!-- Storage -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Almacenamiento</h3>
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">
                  Caché de mensajes
                </span>
                <span class="text-sm text-gray-500">2.3 MB</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-indigo-600 h-2 rounded-full" style="width: 23%"></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Mensajes almacenados localmente
              </p>
            </div>

            <button
              @click="clearCache"
              class="w-full btn-secondary text-sm"
            >
              Limpiar caché de mensajes
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="resetToDefaults"
          type="button"
          class="btn-secondary"
        >
          Restaurar por defecto
        </button>
        <button
          @click="saveSettings"
          type="button"
          class="btn-primary"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'settings-updated'])

const appStore = useAppStore()

const settings = ref({
  // Notifications
  soundEnabled: true,
  pushEnabled: true,
  showPreview: true,
  
  // Appearance
  theme: 'light',
  fontSize: 'medium',
  animatedEmojis: true,
  
  // Privacy
  readReceipts: true,
  showOnlineStatus: true,
  showTyping: true,
  
  // Advanced
  timeFormat: '24',
  enterToSend: true,
  autoScroll: true
})

const loadSettings = () => {
  const saved = localStorage.getItem('chatSettings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      settings.value = { ...settings.value, ...parsed }
    } catch (error) {
      console.error('Error loading chat settings:', error)
    }
  }
}

const saveSettings = () => {
  localStorage.setItem('chatSettings', JSON.stringify(settings.value))
  emit('settings-updated', settings.value)
  appStore.showToast('Configuración guardada', 'success')
  close()
}

const resetToDefaults = () => {
  settings.value = {
    soundEnabled: true,
    pushEnabled: true,
    showPreview: true,
    theme: 'light',
    fontSize: 'medium',
    animatedEmojis: true,
    readReceipts: true,
    showOnlineStatus: true,
    showTyping: true,
    timeFormat: '24',
    enterToSend: true,
    autoScroll: true
  }
  
  appStore.showToast('Configuración restaurada', 'info')
}

const clearCache = () => {
  // In a real app, this would clear message cache
  appStore.showToast('Caché limpiado', 'success')
}

const close = () => {
  emit('close')
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadSettings()
  }
})
</script>