<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="closeSearch"
  >
    <div class="flex min-h-screen items-start justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <!-- Search modal -->
      <div
        class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6"
        @click.stop
      >
        <!-- Search input -->
        <div class="relative mb-6">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Buscar en toda la aplicación..."
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            @keydown.escape="closeSearch"
            @keydown.enter="selectResult(selectedIndex)"
            @keydown.arrow-down.prevent="navigateResults(1)"
            @keydown.arrow-up.prevent="navigateResults(-1)"
          />
          
          <!-- Quick filters -->
          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="filter in quickFilters"
              :key="filter.key"
              class="quick-filter-btn"
              :class="{ 'active': activeFilter === filter.key }"
              @click="setFilter(filter.key)"
            >
              <component :is="filter.icon" class="w-4 h-4 mr-1" />
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- Search results -->
        <div v-if="searchQuery.length > 0" class="max-h-96 overflow-y-auto">
          <!-- No results -->
          <div v-if="filteredResults.length === 0" class="text-center py-8">
            <div class="text-gray-400 mb-2">
              <MagnifyingGlassIcon class="w-12 h-12 mx-auto" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No se encontraron resultados</h3>
            <p class="text-gray-500">Intenta con otros términos de búsqueda</p>
          </div>

          <!-- Results by category -->
          <div v-else class="space-y-6">
            <div
              v-for="category in resultCategories"
              :key="category.key"
              v-show="category.results.length > 0"
            >
              <h3 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <component :is="category.icon" class="w-4 h-4 mr-2" />
                {{ category.label }} ({{ category.results.length }})
              </h3>
              
              <div class="space-y-1">
                <div
                  v-for="(result, index) in category.results"
                  :key="`${category.key}-${result.id}`"
                  class="search-result-item"
                  :class="{ 'selected': getGlobalIndex(category.key, index) === selectedIndex }"
                  @click="selectResult(getGlobalIndex(category.key, index))"
                  @mouseover="selectedIndex = getGlobalIndex(category.key, index)"
                >
                  <div class="flex items-center space-x-3">
                    <!-- Result icon -->
                    <div
                      class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      :class="getResultIconClass(result.type)"
                    >
                      <component :is="getResultIcon(result.type)" class="w-4 h-4" />
                    </div>
                    
                    <!-- Result content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          <span v-html="highlightMatch(result.title)"></span>
                        </p>
                        <span class="text-xs text-gray-500 ml-2">{{ result.module }}</span>
                      </div>
                      
                      <p class="text-sm text-gray-500 truncate mt-1">
                        <span v-html="highlightMatch(result.description)"></span>
                      </p>
                      
                      <!-- Meta information -->
                      <div class="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                        <span v-if="result.date">{{ formatDate(result.date) }}</span>
                        <span v-if="result.tags && result.tags.length > 0">
                          {{ result.tags.slice(0, 2).join(', ') }}
                          <span v-if="result.tags.length > 2">+{{ result.tags.length - 2 }}</span>
                        </span>
                        <span v-if="result.status">{{ result.status }}</span>
                      </div>
                    </div>

                    <!-- Quick actions -->
                    <div class="flex items-center space-x-2">
                      <button
                        v-if="result.quickActions"
                        v-for="action in result.quickActions"
                        :key="action.key"
                        @click.stop="executeQuickAction(action, result)"
                        class="quick-action-btn"
                        :title="action.label"
                      >
                        <component :is="action.icon" class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent searches -->
        <div v-else-if="recentSearches.length > 0" class="space-y-4">
          <h3 class="text-sm font-medium text-gray-900">Búsquedas recientes</h3>
          <div class="space-y-1">
            <button
              v-for="search in recentSearches"
              :key="search"
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              @click="searchQuery = search"
            >
              <ClockIcon class="w-4 h-4 inline mr-2 text-gray-400" />
              {{ search }}
            </button>
          </div>
        </div>

        <!-- Quick shortcuts -->
        <div v-else class="space-y-4">
          <h3 class="text-sm font-medium text-gray-900">Accesos rápidos</h3>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="shortcut in quickShortcuts"
              :key="shortcut.key"
              class="shortcut-btn"
              @click="navigateToShortcut(shortcut)"
            >
              <component :is="shortcut.icon" class="w-5 h-5 mb-2 text-gray-400" />
              <span class="text-sm font-medium text-gray-900">{{ shortcut.label }}</span>
              <span class="text-xs text-gray-500 mt-1">{{ shortcut.description }}</span>
            </button>
          </div>
        </div>

        <!-- Search tips -->
        <div class="mt-6 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <div class="flex items-center space-x-4">
              <span><kbd class="kbd">↑↓</kbd> navegar</span>
              <span><kbd class="kbd">Enter</kbd> seleccionar</span>
              <span><kbd class="kbd">Esc</kbd> cerrar</span>
            </div>
            <span>{{ filteredResults.length }} resultados</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import {
  MagnifyingGlassIcon,
  ClockIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  BanknotesIcon,
  UserGroupIcon,
  CogIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const searchInput = ref(null)
const searchQuery = ref('')
const selectedIndex = ref(0)
const activeFilter = ref('all')
const recentSearches = ref([])

// Mock search data - in real app, this would come from API
const searchData = ref([
  // Calendar events
  {
    id: 1,
    type: 'event',
    module: 'Calendario',
    title: 'Reunión de equipo',
    description: 'Revisión semanal del proyecto',
    date: '2025-11-05T10:00:00Z',
    tags: ['trabajo', 'equipo'],
    status: 'confirmado',
    url: '/calendar',
    quickActions: [
      { key: 'view', label: 'Ver', icon: EyeIcon },
      { key: 'edit', label: 'Editar', icon: PencilIcon }
    ]
  },
  {
    id: 2,
    type: 'event',
    module: 'Calendario',
    title: 'Cita médica',
    description: 'Consulta de rutina',
    date: '2025-11-07T15:30:00Z',
    tags: ['personal', 'salud'],
    status: 'pendiente',
    url: '/calendar'
  },
  
  // Notes
  {
    id: 3,
    type: 'note',
    module: 'Notas',
    title: 'Ideas para el proyecto',
    description: 'Lista de funcionalidades a implementar',
    date: '2025-11-03T09:15:00Z',
    tags: ['trabajo', 'ideas'],
    url: '/notes',
    quickActions: [
      { key: 'view', label: 'Ver', icon: EyeIcon },
      { key: 'edit', label: 'Editar', icon: PencilIcon },
      { key: 'share', label: 'Compartir', icon: ShareIcon }
    ]
  },
  {
    id: 4,
    type: 'note',
    module: 'Notas',
    title: 'Recetas de cocina',
    description: 'Colección de recetas favoritas',
    date: '2025-11-02T18:20:00Z',
    tags: ['personal', 'cocina'],
    url: '/notes'
  },

  // Transactions
  {
    id: 5,
    type: 'transaction',
    module: 'Finanzas',
    title: 'Compra en supermercado',
    description: 'Compras semanales',
    date: '2025-11-03T14:30:00Z',
    tags: ['gastos', 'alimentación'],
    amount: -125.50,
    url: '/finance'
  },
  {
    id: 6,
    type: 'transaction',
    module: 'Finanzas',
    title: 'Salario noviembre',
    description: 'Pago mensual',
    date: '2025-11-01T08:00:00Z',
    tags: ['ingresos', 'trabajo'],
    amount: 2500.00,
    url: '/finance'
  },

  // Chats
  {
    id: 7,
    type: 'chat',
    module: 'Chat',
    title: 'Equipo de desarrollo',
    description: 'Conversación grupal sobre el proyecto',
    date: '2025-11-03T16:45:00Z',
    tags: ['trabajo', 'equipo'],
    url: '/chats'
  },

  // Users
  {
    id: 8,
    type: 'user',
    module: 'Contactos',
    title: 'María García',
    description: 'Diseñadora UX/UI',
    tags: ['equipo', 'diseño'],
    url: '/contacts'
  }
])

const quickFilters = [
  { key: 'all', label: 'Todo', icon: MagnifyingGlassIcon },
  { key: 'event', label: 'Eventos', icon: CalendarIcon },
  { key: 'note', label: 'Notas', icon: DocumentTextIcon },
  { key: 'transaction', label: 'Finanzas', icon: BanknotesIcon },
  { key: 'chat', label: 'Chats', icon: ChatBubbleLeftIcon },
  { key: 'user', label: 'Contactos', icon: UserGroupIcon }
]

const quickShortcuts = [
  {
    key: 'new-event',
    label: 'Nuevo evento',
    description: 'Crear evento en calendario',
    icon: CalendarIcon,
    action: () => router.push('/calendar?new=true')
  },
  {
    key: 'new-note',
    label: 'Nueva nota',
    description: 'Crear nueva nota',
    icon: DocumentTextIcon,
    action: () => router.push('/notes?new=true')
  },
  {
    key: 'new-transaction',
    label: 'Nueva transacción',
    description: 'Registrar gasto/ingreso',
    icon: BanknotesIcon,
    action: () => router.push('/finance?new=true')
  },
  {
    key: 'settings',
    label: 'Configuración',
    description: 'Ajustes de la aplicación',
    icon: CogIcon,
    action: () => router.push('/settings')
  }
]

const filteredResults = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    return []
  }

  const query = searchQuery.value.toLowerCase()
  let results = searchData.value.filter(item => {
    const matchesQuery = 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query))

    const matchesFilter = activeFilter.value === 'all' || item.type === activeFilter.value

    return matchesQuery && matchesFilter
  })

  // Sort by relevance (title matches first, then description, then tags)
  results.sort((a, b) => {
    const aTitle = a.title.toLowerCase().includes(query) ? 1 : 0
    const bTitle = b.title.toLowerCase().includes(query) ? 1 : 0
    
    if (aTitle !== bTitle) return bTitle - aTitle
    
    // Then by date (most recent first)
    return new Date(b.date || 0) - new Date(a.date || 0)
  })

  return results
})

const resultCategories = computed(() => {
  const categories = [
    { key: 'event', label: 'Eventos', icon: CalendarIcon, results: [] },
    { key: 'note', label: 'Notas', icon: DocumentTextIcon, results: [] },
    { key: 'transaction', label: 'Transacciones', icon: BanknotesIcon, results: [] },
    { key: 'chat', label: 'Chats', icon: ChatBubbleLeftIcon, results: [] },
    { key: 'user', label: 'Contactos', icon: UserGroupIcon, results: [] }
  ]

  // Group results by category
  filteredResults.value.forEach(result => {
    const category = categories.find(cat => cat.key === result.type)
    if (category) {
      category.results.push(result)
    }
  })

  return categories.filter(cat => cat.results.length > 0)
})

const getGlobalIndex = (categoryKey, localIndex) => {
  let globalIndex = 0
  
  for (const category of resultCategories.value) {
    if (category.key === categoryKey) {
      return globalIndex + localIndex
    }
    globalIndex += category.results.length
  }
  
  return globalIndex
}

const getResultIcon = (type) => {
  const icons = {
    event: CalendarIcon,
    note: DocumentTextIcon,
    transaction: BanknotesIcon,
    chat: ChatBubbleLeftIcon,
    user: UserGroupIcon
  }
  return icons[type] || DocumentTextIcon
}

const getResultIconClass = (type) => {
  const classes = {
    event: 'bg-blue-100 text-blue-600',
    note: 'bg-green-100 text-green-600',
    transaction: 'bg-purple-100 text-purple-600',
    chat: 'bg-orange-100 text-orange-600',
    user: 'bg-gray-100 text-gray-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const highlightMatch = (text) => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    return text
  }
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-0.5 rounded">$1</mark>')
}

const setFilter = (filterKey) => {
  activeFilter.value = filterKey
  selectedIndex.value = 0
}

const navigateResults = (direction) => {
  const maxIndex = filteredResults.value.length - 1
  selectedIndex.value = Math.max(0, Math.min(maxIndex, selectedIndex.value + direction))
}

const selectResult = (index) => {
  const result = filteredResults.value[index]
  if (result) {
    // Add to recent searches
    if (!recentSearches.value.includes(searchQuery.value)) {
      recentSearches.value.unshift(searchQuery.value)
      recentSearches.value = recentSearches.value.slice(0, 5)
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
    }

    // Navigate to result
    router.push(result.url)
    closeSearch()
  }
}

const executeQuickAction = (action, result) => {
  console.log('Quick action:', action.key, result)
  appStore.showToast(`${action.label}: ${result.title}`, 'info')
}

const navigateToShortcut = (shortcut) => {
  shortcut.action()
  closeSearch()
}

const closeSearch = () => {
  emit('close')
  searchQuery.value = ''
  selectedIndex.value = 0
  activeFilter.value = 'all'
}

// Handle keyboard shortcuts
const handleGlobalKeydown = (event) => {
  // Cmd/Ctrl + K to open search
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    if (!props.isOpen) {
      emit('open')
    }
  }
}

// Load recent searches
onMounted(() => {
  const saved = localStorage.getItem('recentSearches')
  if (saved) {
    try {
      recentSearches.value = JSON.parse(saved)
    } catch (error) {
      console.error('Error loading recent searches:', error)
    }
  }

  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})

// Focus search input when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})

// Reset selection when query changes
watch(searchQuery, () => {
  selectedIndex.value = 0
})
</script>

<style scoped>
.quick-filter-btn {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer;
}

.quick-filter-btn.active {
  @apply bg-indigo-100 text-indigo-700;
}

.search-result-item {
  @apply p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors;
}

.search-result-item.selected {
  @apply bg-indigo-50 ring-2 ring-indigo-200;
}

.quick-action-btn {
  @apply p-1 text-gray-400 hover:text-gray-600 rounded transition-colors;
}

.shortcut-btn {
  @apply flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer;
}

.kbd {
  @apply inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-600 border border-gray-300;
}

mark {
  @apply bg-yellow-200 text-yellow-900 px-0.5 rounded;
}
</style>