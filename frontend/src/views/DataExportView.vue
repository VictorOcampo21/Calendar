<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Export header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <button
              @click="$router.back()"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors mr-4"
            >
              <ArrowLeftIcon class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Exportar datos</h1>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="clearAllSelections"
              class="btn-secondary"
            >
              Limpiar selección
            </button>
            
            <button
              @click="selectAllData"
              class="btn-secondary"
            >
              Seleccionar todo
            </button>
            
            <button
              @click="exportSelectedData"
              :disabled="!hasSelectedData || isExporting"
              class="btn-primary"
            >
              <div v-if="isExporting" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2"></div>
                Exportando...
              </div>
              <span v-else>Exportar datos</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main content -->
        <div class="lg:col-span-2">
          <!-- Export options -->
          <div class="bg-white shadow rounded-lg mb-6">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Opciones de exportación</h3>
              <p class="mt-1 text-sm text-gray-500">Selecciona el formato y configuración para la exportación</p>
            </div>
            <div class="px-6 py-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Format selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">Formato de exportación</label>
                  <div class="space-y-3">
                    <label
                      v-for="format in exportFormats"
                      :key="format.key"
                      class="export-format-option"
                      :class="{ 'selected': selectedFormat === format.key }"
                    >
                      <input
                        v-model="selectedFormat"
                        :value="format.key"
                        type="radio"
                        class="sr-only"
                      />
                      <div class="flex items-center space-x-3">
                        <component :is="format.icon" class="w-5 h-5 text-gray-400" />
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ format.name }}</div>
                          <div class="text-sm text-gray-500">{{ format.description }}</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Date range -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">Rango de fechas</label>
                  <div class="space-y-3">
                    <label
                      v-for="range in dateRanges"
                      :key="range.key"
                      class="date-range-option"
                      :class="{ 'selected': selectedDateRange === range.key }"
                    >
                      <input
                        v-model="selectedDateRange"
                        :value="range.key"
                        type="radio"
                        class="sr-only"
                      />
                      <span class="text-sm">{{ range.label }}</span>
                    </label>

                    <!-- Custom date range -->
                    <div v-if="selectedDateRange === 'custom'" class="space-y-3 ml-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
                        <input
                          v-model="customDateRange.start"
                          type="date"
                          class="export-input"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
                        <input
                          v-model="customDateRange.end"
                          type="date"
                          class="export-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Additional options -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Opciones adicionales</h4>
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input
                      v-model="exportOptions.includeAttachments"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-900">Incluir archivos adjuntos</span>
                  </label>

                  <label class="flex items-center">
                    <input
                      v-model="exportOptions.compressFiles"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-900">Comprimir archivos (ZIP)</span>
                  </label>

                  <label class="flex items-center">
                    <input
                      v-model="exportOptions.includeMetadata"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-900">Incluir metadatos y timestamps</span>
                  </label>

                  <label class="flex items-center">
                    <input
                      v-model="exportOptions.anonymizeData"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-900">Anonimizar datos personales</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Data selection -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Seleccionar datos</h3>
              <p class="mt-1 text-sm text-gray-500">Elige qué información quieres incluir en la exportación</p>
            </div>
            <div class="px-6 py-4">
              <div class="space-y-4">
                <div
                  v-for="category in dataCategories"
                  :key="category.key"
                  class="data-category"
                >
                  <div class="flex items-center justify-between">
                    <label class="flex items-center cursor-pointer">
                      <input
                        v-model="selectedCategories"
                        :value="category.key"
                        type="checkbox"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div class="ml-3">
                        <div class="flex items-center space-x-2">
                          <component :is="category.icon" class="w-5 h-5 text-gray-400" />
                          <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
                        </div>
                        <p class="text-sm text-gray-500">{{ category.description }}</p>
                      </div>
                    </label>
                    <div class="text-right">
                      <div class="text-sm font-medium text-gray-900">{{ category.count }} elementos</div>
                      <div class="text-sm text-gray-500">{{ formatFileSize(category.size) }}</div>
                    </div>
                  </div>

                  <!-- Subcategories -->
                  <div
                    v-if="selectedCategories.includes(category.key) && category.subcategories"
                    class="mt-3 ml-7 space-y-2"
                  >
                    <label
                      v-for="sub in category.subcategories"
                      :key="sub.key"
                      class="flex items-center justify-between cursor-pointer"
                    >
                      <div class="flex items-center">
                        <input
                          v-model="selectedSubcategories"
                          :value="sub.key"
                          type="checkbox"
                          class="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span class="ml-2 text-sm text-gray-700">{{ sub.name }}</span>
                      </div>
                      <div class="text-sm text-gray-500">{{ sub.count }} items</div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Export summary -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Resumen de exportación</h3>
            </div>
            <div class="px-6 py-4">
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Categorías seleccionadas:</span>
                  <span class="text-sm font-medium text-gray-900">{{ selectedCategories.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Total de elementos:</span>
                  <span class="text-sm font-medium text-gray-900">{{ totalSelectedItems }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Tamaño estimado:</span>
                  <span class="text-sm font-medium text-gray-900">{{ formatFileSize(totalSelectedSize) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Formato:</span>
                  <span class="text-sm font-medium text-gray-900">{{ selectedFormatName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Tiempo estimado:</span>
                  <span class="text-sm font-medium text-gray-900">{{ estimatedTime }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent exports -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Exportaciones recientes</h3>
            </div>
            <div class="px-6 py-4">
              <div class="space-y-3">
                <div
                  v-for="export_ in recentExports"
                  :key="export_.id"
                  class="recent-export-item"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ export_.name }}</div>
                      <div class="text-sm text-gray-500">{{ export_.date }}</div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="export_.status === 'completed' ? 'bg-green-100 text-green-800' : 
                               export_.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                               'bg-red-100 text-red-800'"
                      >
                        {{ getStatusLabel(export_.status) }}
                      </span>
                      <button
                        v-if="export_.status === 'completed'"
                        @click="downloadExport(export_)"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        <ArrowDownTrayIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="recentExports.length === 0" class="text-sm text-gray-500 text-center py-4">
                  No hay exportaciones recientes
                </div>
              </div>
            </div>
          </div>

          <!-- Help -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <InformationCircleIcon class="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 class="text-sm font-medium text-blue-900">Información sobre exportación</h4>
                <div class="mt-2 text-sm text-blue-700 space-y-1">
                  <p>• Los archivos grandes pueden tardar varios minutos</p>
                  <p>• Recibirás una notificación cuando esté listo</p>
                  <p>• Los exports están disponibles por 30 días</p>
                  <p>• Puedes cancelar una exportación en progreso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Export progress modal -->
    <div
      v-if="showProgressModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
            <ArrowDownTrayIcon class="w-6 h-6 text-indigo-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Exportando datos</h3>
          <p class="text-sm text-gray-500 mb-4">{{ exportProgress.message }}</p>
          
          <!-- Progress bar -->
          <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: exportProgress.percentage + '%' }"
            ></div>
          </div>
          
          <div class="flex justify-between text-sm text-gray-600 mb-4">
            <span>{{ exportProgress.currentStep }}</span>
            <span>{{ exportProgress.percentage }}%</span>
          </div>
          
          <button
            @click="cancelExport"
            class="btn-secondary"
          >
            Cancelar exportación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  BanknotesIcon,
  UserGroupIcon,
  PhotoIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const appStore = useAppStore()

const selectedFormat = ref('json')
const selectedDateRange = ref('all')
const selectedCategories = ref(['calendar', 'notes'])
const selectedSubcategories = ref(['events', 'notes-personal'])
const isExporting = ref(false)
const showProgressModal = ref(false)

const customDateRange = ref({
  start: '',
  end: ''
})

const exportOptions = ref({
  includeAttachments: true,
  compressFiles: true,
  includeMetadata: true,
  anonymizeData: false
})

const exportProgress = ref({
  percentage: 0,
  message: '',
  currentStep: ''
})

const exportFormats = [
  {
    key: 'json',
    name: 'JSON',
    description: 'Formato estructurado para desarrolladores',
    icon: DocumentTextIcon
  },
  {
    key: 'csv',
    name: 'CSV',
    description: 'Compatible con Excel y hojas de cálculo',
    icon: DocumentTextIcon
  },
  {
    key: 'pdf',
    name: 'PDF',
    description: 'Documento legible para archivo',
    icon: DocumentTextIcon
  },
  {
    key: 'xml',
    name: 'XML',
    description: 'Formato estándar para intercambio',
    icon: DocumentTextIcon
  }
]

const dateRanges = [
  { key: 'all', label: 'Todos los datos' },
  { key: 'last-month', label: 'Último mes' },
  { key: 'last-3-months', label: 'Últimos 3 meses' },
  { key: 'last-year', label: 'Último año' },
  { key: 'custom', label: 'Rango personalizado' }
]

const dataCategories = [
  {
    key: 'calendar',
    name: 'Calendario',
    description: 'Eventos, recordatorios y configuración',
    icon: CalendarIcon,
    count: 157,
    size: 2457600, // 2.4MB
    subcategories: [
      { key: 'events', name: 'Eventos', count: 89 },
      { key: 'reminders', name: 'Recordatorios', count: 45 },
      { key: 'calendar-settings', name: 'Configuración', count: 23 }
    ]
  },
  {
    key: 'notes',
    name: 'Notas',
    description: 'Documentos, borradores y colaboraciones',
    icon: DocumentTextIcon,
    count: 234,
    size: 8947200, // 8.9MB
    subcategories: [
      { key: 'notes-personal', name: 'Notas personales', count: 156 },
      { key: 'notes-shared', name: 'Notas compartidas', count: 78 }
    ]
  },
  {
    key: 'chat',
    name: 'Mensajes',
    description: 'Conversaciones y archivos compartidos',
    icon: ChatBubbleLeftIcon,
    count: 1432,
    size: 15728640, // 15.7MB
    subcategories: [
      { key: 'messages', name: 'Mensajes', count: 1287 },
      { key: 'chat-files', name: 'Archivos compartidos', count: 145 }
    ]
  },
  {
    key: 'finance',
    name: 'Finanzas',
    description: 'Transacciones, cuentas y reportes',
    icon: BanknotesIcon,
    count: 89,
    size: 1536000, // 1.5MB
    subcategories: [
      { key: 'transactions', name: 'Transacciones', count: 67 },
      { key: 'accounts', name: 'Cuentas', count: 12 },
      { key: 'reports', name: 'Reportes', count: 10 }
    ]
  },
  {
    key: 'contacts',
    name: 'Contactos',
    description: 'Información de contactos y equipos',
    icon: UserGroupIcon,
    count: 45,
    size: 512000, // 512KB
    subcategories: [
      { key: 'personal-contacts', name: 'Contactos personales', count: 28 },
      { key: 'team-members', name: 'Miembros del equipo', count: 17 }
    ]
  },
  {
    key: 'media',
    name: 'Archivos multimedia',
    description: 'Imágenes, videos y documentos',
    icon: PhotoIcon,
    count: 167,
    size: 52428800, // 52.4MB
    subcategories: [
      { key: 'images', name: 'Imágenes', count: 124 },
      { key: 'documents', name: 'Documentos', count: 43 }
    ]
  },
  {
    key: 'settings',
    name: 'Configuración',
    description: 'Preferencias y configuración de la app',
    icon: CogIcon,
    count: 1,
    size: 51200, // 51.2KB
    subcategories: []
  }
]

const recentExports = ref([
  {
    id: 1,
    name: 'Exportación completa',
    date: '15 Nov 2024',
    status: 'completed',
    size: 45728640
  },
  {
    id: 2,
    name: 'Solo calendario',
    date: '10 Nov 2024',
    status: 'completed',
    size: 2457600
  },
  {
    id: 3,
    name: 'Datos octubre',
    date: '1 Nov 2024',
    status: 'failed',
    size: 0
  }
])

const hasSelectedData = computed(() => selectedCategories.value.length > 0)

const totalSelectedItems = computed(() => {
  return dataCategories
    .filter(cat => selectedCategories.value.includes(cat.key))
    .reduce((total, cat) => total + cat.count, 0)
})

const totalSelectedSize = computed(() => {
  return dataCategories
    .filter(cat => selectedCategories.value.includes(cat.key))
    .reduce((total, cat) => total + cat.size, 0)
})

const selectedFormatName = computed(() => {
  const format = exportFormats.find(f => f.key === selectedFormat.value)
  return format ? format.name : ''
})

const estimatedTime = computed(() => {
  const sizeInMB = totalSelectedSize.value / (1024 * 1024)
  if (sizeInMB < 10) return '< 1 minuto'
  if (sizeInMB < 50) return '2-5 minutos'
  if (sizeInMB < 100) return '5-10 minutos'
  return '10+ minutos'
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getStatusLabel = (status) => {
  const labels = {
    completed: 'Completado',
    processing: 'Procesando',
    failed: 'Error'
  }
  return labels[status] || status
}

const selectAllData = () => {
  selectedCategories.value = dataCategories.map(cat => cat.key)
  selectedSubcategories.value = dataCategories
    .flatMap(cat => cat.subcategories || [])
    .map(sub => sub.key)
}

const clearAllSelections = () => {
  selectedCategories.value = []
  selectedSubcategories.value = []
}

const exportSelectedData = async () => {
  if (!hasSelectedData.value) return

  isExporting.value = true
  showProgressModal.value = true

  const steps = [
    'Preparando exportación...',
    'Recopilando datos...',
    'Procesando archivos...',
    'Comprimiendo datos...',
    'Finalizando...'
  ]

  try {
    for (let i = 0; i < steps.length; i++) {
      exportProgress.value = {
        percentage: Math.round(((i + 1) / steps.length) * 100),
        message: 'Esto puede tardar unos minutos dependiendo del tamaño de los datos',
        currentStep: steps[i]
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    // Create and download file
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        format: selectedFormat.value,
        categories: selectedCategories.value,
        dateRange: selectedDateRange.value,
        options: exportOptions.value
      },
      data: generateMockExportData()
    }

    const dataStr = selectedFormat.value === 'json' 
      ? JSON.stringify(exportData, null, 2)
      : convertToFormat(exportData, selectedFormat.value)
    
    const dataBlob = new Blob([dataStr], { 
      type: selectedFormat.value === 'json' ? 'application/json' : 'text/plain'
    })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `export-${new Date().toISOString().split('T')[0]}.${selectedFormat.value}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Add to recent exports
    recentExports.value.unshift({
      id: Date.now(),
      name: `Exportación ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleDateString(),
      status: 'completed',
      size: totalSelectedSize.value
    })

    appStore.showToast('Datos exportados exitosamente', 'success')
  } catch (error) {
    console.error('Export error:', error)
    appStore.showToast('Error al exportar los datos', 'error')
  } finally {
    isExporting.value = false
    showProgressModal.value = false
  }
}

const generateMockExportData = () => {
  const data = {}
  
  selectedCategories.value.forEach(categoryKey => {
    const category = dataCategories.find(c => c.key === categoryKey)
    if (!category) return

    switch (categoryKey) {
      case 'calendar':
        data.calendar = {
          events: Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            title: `Evento ${i + 1}`,
            date: new Date(Date.now() + i * 86400000).toISOString(),
            description: `Descripción del evento ${i + 1}`
          }))
        }
        break
      case 'notes':
        data.notes = {
          documents: Array.from({ length: 30 }, (_, i) => ({
            id: i + 1,
            title: `Nota ${i + 1}`,
            content: `Contenido de la nota ${i + 1}`,
            createdAt: new Date(Date.now() - i * 86400000).toISOString()
          }))
        }
        break
      // Add more categories as needed
    }
  })

  return data
}

const convertToFormat = (data, format) => {
  switch (format) {
    case 'csv':
      // Simple CSV conversion for demo
      return 'Category,Item,Date\nCalendar,Event 1,2024-11-20\nNotes,Note 1,2024-11-19'
    case 'xml':
      return `<?xml version="1.0" encoding="UTF-8"?>\n<export>\n  <metadata>\n    <date>${new Date().toISOString()}</date>\n  </metadata>\n</export>`
    default:
      return JSON.stringify(data, null, 2)
  }
}

const cancelExport = () => {
  isExporting.value = false
  showProgressModal.value = false
  appStore.showToast('Exportación cancelada', 'info')
}

const downloadExport = (export_) => {
  appStore.showToast(`Descargando ${export_.name}`, 'info')
}
</script>

<style scoped>
.export-format-option {
  @apply p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors;
}

.export-format-option.selected {
  @apply border-indigo-500 bg-indigo-50;
}

.date-range-option {
  @apply flex items-center p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors;
}

.date-range-option.selected {
  @apply bg-indigo-50 border-indigo-500;
}

.export-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500;
}

.data-category {
  @apply p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors;
}

.recent-export-item {
  @apply p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors;
}
</style>