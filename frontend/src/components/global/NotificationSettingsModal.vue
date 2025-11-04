<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Configuración de notificaciones</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-900">Mostrar todas las notificaciones</span>
          <label class="toggle-switch">
            <input
              v-model="settings.showAll"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="toggle-slider"></div>
          </label>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-900">Sonidos de notificación</span>
          <label class="toggle-switch">
            <input
              v-model="settings.sounds"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="toggle-slider"></div>
          </label>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-900">Notificaciones de escritorio</span>
          <label class="toggle-switch">
            <input
              v-model="settings.desktop"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="toggle-slider"></div>
          </label>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-900">Modo no molestar</span>
          <label class="toggle-switch">
            <input
              v-model="settings.doNotDisturb"
              type="checkbox"
              class="sr-only peer"
            />
            <div class="toggle-slider"></div>
          </label>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cerrar
        </button>
        <button
          @click="saveSettings"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close', 'settings-updated'])

const settings = ref({
  showAll: true,
  sounds: true,
  desktop: true,
  doNotDisturb: false
})

const saveSettings = () => {
  emit('settings-updated', settings.value)
  emit('close')
}
</script>

<style scoped>
.toggle-switch {
  @apply relative inline-flex items-center cursor-pointer;
}

.toggle-slider {
  @apply w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer transition-colors;
}

.toggle-slider::after {
  @apply content-[''] absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-all;
}

/* Peer states for toggle */
input[type="checkbox"]:checked + .toggle-slider {
  @apply bg-indigo-600;
}

input[type="checkbox"]:checked + .toggle-slider::after {
  @apply translate-x-full border-white;
}

input[type="checkbox"]:focus + .toggle-slider {
  @apply outline-none ring-4 ring-indigo-300;
}
</style>