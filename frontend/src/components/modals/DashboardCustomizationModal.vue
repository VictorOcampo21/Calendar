<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="close"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            Personalizar Dashboard
          </h2>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <p class="text-sm text-gray-600 mt-1">
          Configura qué widgets mostrar y cómo organizar tu dashboard
        </p>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 overflow-y-auto max-h-96">
        <!-- Widget visibility -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-3">
            Widgets Disponibles
          </h3>
          <div class="space-y-3">
            <div
              v-for="widget in availableWidgets"
              :key="widget.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="widget.iconClass"
                >
                  <component :is="widget.icon" class="w-5 h-5" />
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ widget.name }}</h4>
                  <p class="text-sm text-gray-600">{{ widget.description }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="widget.enabled"
                    @change="toggleWidget(widget.id)"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
                
                <button
                  v-if="widget.enabled"
                  @click="moveWidget(widget.id, 'up')"
                  :disabled="isFirstWidget(widget.id)"
                  class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ChevronUpIcon class="w-4 h-4" />
                </button>
                
                <button
                  v-if="widget.enabled"
                  @click="moveWidget(widget.id, 'down')"
                  :disabled="isLastWidget(widget.id)"
                  class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ChevronDownIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Layout options -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-3">
            Diseño del Dashboard
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Columnas del grid
              </label>
              <select
                v-model="settings.gridColumns"
                class="input-field"
              >
                <option value="1">1 columna</option>
                <option value="2">2 columnas</option>
                <option value="3">3 columnas</option>
              </select>
            </div>

            <div>
              <label class="flex items-center space-x-2">
                <input
                  v-model="settings.compactMode"
                  type="checkbox"
                  class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span class="text-sm font-medium text-gray-700">Modo compacto</span>
              </label>
              <p class="text-xs text-gray-500 ml-6">
                Reduce el espaciado entre widgets
              </p>
            </div>

            <div>
              <label class="flex items-center space-x-2">
                <input
                  v-model="settings.showQuickStats"
                  type="checkbox"
                  class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span class="text-sm font-medium text-gray-700">Mostrar estadísticas rápidas</span>
              </label>
              <p class="text-xs text-gray-500 ml-6">
                Muestra tarjetas de resumen en la parte superior
              </p>
            </div>
          </div>
        </div>

        <!-- Theme options -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-3">
            Tema
          </h3>
          
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="theme in themes"
              :key="theme.id"
              @click="settings.theme = theme.id"
              class="p-3 border-2 rounded-lg text-left transition-colors"
              :class="settings.theme === theme.id 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="flex items-center space-x-2 mb-2">
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: theme.primaryColor }"
                ></div>
                <span class="font-medium">{{ theme.name }}</span>
              </div>
              <p class="text-xs text-gray-600">{{ theme.description }}</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="resetToDefaults"
          class="btn-secondary"
        >
          Restaurar por defecto
        </button>
        <button
          @click="saveChanges"
          class="btn-primary"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  CloudIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const appStore = useAppStore()

const availableWidgets = ref([
  {
    id: 'upcoming-events',
    name: 'Próximos Eventos',
    description: 'Muestra eventos programados para hoy y esta semana',
    icon: CalendarIcon,
    iconClass: 'bg-blue-100 text-blue-600',
    enabled: true,
    order: 1
  },
  {
    id: 'financial-summary',
    name: 'Resumen Financiero',
    description: 'Balance actual e ingresos/gastos del mes',
    icon: CurrencyDollarIcon,
    iconClass: 'bg-green-100 text-green-600',
    enabled: true,
    order: 2
  },
  {
    id: 'recent-notes',
    name: 'Notas Recientes',
    description: 'Últimas notas creadas o modificadas',
    icon: DocumentTextIcon,
    iconClass: 'bg-yellow-100 text-yellow-600',
    enabled: true,
    order: 3
  },
  {
    id: 'weather',
    name: 'Clima',
    description: 'Condiciones climáticas actuales y pronóstico',
    icon: CloudIcon,
    iconClass: 'bg-sky-100 text-sky-600',
    enabled: true,
    order: 4
  },
  {
    id: 'tasks',
    name: 'Tareas Pendientes',
    description: 'Lista de tareas por completar',
    icon: CheckCircleIcon,
    iconClass: 'bg-purple-100 text-purple-600',
    enabled: true,
    order: 5
  },
  {
    id: 'activity-feed',
    name: 'Actividad Reciente',
    description: 'Feed de actividades del workspace',
    icon: ClockIcon,
    iconClass: 'bg-indigo-100 text-indigo-600',
    enabled: true,
    order: 6
  }
])

const settings = ref({
  gridColumns: '2',
  compactMode: false,
  showQuickStats: true,
  theme: 'default'
})

const themes = ref([
  {
    id: 'default',
    name: 'Por defecto',
    description: 'Tema claro estándar',
    primaryColor: '#4F46E5'
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Diseño limpio y simple',
    primaryColor: '#6B7280'
  },
  {
    id: 'warm',
    name: 'Cálido',
    description: 'Tonos naranjas y rojos',
    primaryColor: '#EA580C'
  },
  {
    id: 'cool',
    name: 'Fresco',
    description: 'Tonos azules y verdes',
    primaryColor: '#0891B2'
  }
])

const enabledWidgets = computed(() =>
  availableWidgets.value
    .filter(widget => widget.enabled)
    .sort((a, b) => a.order - b.order)
)

const toggleWidget = (widgetId) => {
  const widget = availableWidgets.value.find(w => w.id === widgetId)
  if (widget) {
    widget.enabled = !widget.enabled
  }
}

const moveWidget = (widgetId, direction) => {
  const enabledList = enabledWidgets.value
  const index = enabledList.findIndex(w => w.id === widgetId)
  
  if (direction === 'up' && index > 0) {
    const temp = enabledList[index].order
    enabledList[index].order = enabledList[index - 1].order
    enabledList[index - 1].order = temp
  } else if (direction === 'down' && index < enabledList.length - 1) {
    const temp = enabledList[index].order
    enabledList[index].order = enabledList[index + 1].order
    enabledList[index + 1].order = temp
  }
}

const isFirstWidget = (widgetId) => {
  const enabledList = enabledWidgets.value
  return enabledList.length > 0 && enabledList[0].id === widgetId
}

const isLastWidget = (widgetId) => {
  const enabledList = enabledWidgets.value
  return enabledList.length > 0 && enabledList[enabledList.length - 1].id === widgetId
}

const resetToDefaults = () => {
  availableWidgets.value.forEach((widget, index) => {
    widget.enabled = true
    widget.order = index + 1
  })
  
  settings.value = {
    gridColumns: '2',
    compactMode: false,
    showQuickStats: true,
    theme: 'default'
  }
  
  appStore.showToast('Configuración restaurada por defecto', 'info')
}

const saveChanges = () => {
  const dashboardConfig = {
    widgets: availableWidgets.value.map(widget => ({
      id: widget.id,
      enabled: widget.enabled,
      order: widget.order
    })),
    settings: { ...settings.value }
  }
  
  // Guardar en localStorage
  localStorage.setItem('dashboardConfig', JSON.stringify(dashboardConfig))
  
  emit('save', dashboardConfig)
  appStore.showToast('Configuración guardada exitosamente', 'success')
  close()
}

const close = () => {
  emit('close')
}

// Cargar configuración guardada
const loadSavedConfig = () => {
  const saved = localStorage.getItem('dashboardConfig')
  if (saved) {
    try {
      const config = JSON.parse(saved)
      
      // Aplicar configuración de widgets
      if (config.widgets) {
        config.widgets.forEach(savedWidget => {
          const widget = availableWidgets.value.find(w => w.id === savedWidget.id)
          if (widget) {
            widget.enabled = savedWidget.enabled
            widget.order = savedWidget.order
          }
        })
      }
      
      // Aplicar configuración general
      if (config.settings) {
        settings.value = { ...settings.value, ...config.settings }
      }
    } catch (error) {
      console.error('Error loading dashboard config:', error)
    }
  }
}

// Cargar configuración al abrir el modal
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadSavedConfig()
  }
})
</script>