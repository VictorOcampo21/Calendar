<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-start justify-center pt-20">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
      <!-- Search Header -->
      <div class="border-b border-gray-200 p-6">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Buscar eventos, notas, transacciones, chats..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            @keydown.esc="$emit('close')"
            @keydown.down="navigateDown"
            @keydown.up="navigateUp"
            @keydown.enter="selectResult"
          />
        </div>
        
        <!-- Quick filters -->
        <div class="flex space-x-2 mt-4">
          <button
            v-for="filter in quickFilters"
            :key="filter.type"
            @click="activeFilter = activeFilter === filter.type ? 'all' : filter.type"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
            :class="activeFilter === filter.type 
              ? 'bg-primary-100 text-primary-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ filter.icon }} {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Search Results -->
      <div class="overflow-y-auto max-h-96">
        <!-- No results -->
        <div v-if="filteredResults.length === 0 && searchQuery" class="p-8 text-center">
          <MagnifyingGlassIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
          <p class="text-gray-500">Intenta con otros términos de búsqueda</p>
        </div>

        <!-- Recent items when no search -->
        <div v-if="!searchQuery && recentItems.length > 0" class="p-4">
          <h3 class="text-sm font-medium text-gray-500 mb-3 px-2">Elementos recientes</h3>
          <div class="space-y-1">
            <div
              v-for="(item, index) in recentItems"
              :key="`recent-${item.id}`"
              @click="selectItem(item)"
              class="p-3 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
              :class="{ 'bg-primary-50': selectedIndex === index }"
            >
              <span class="text-2xl">{{ getItemIcon(item.type) }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</p>
                <p class="text-xs text-gray-500">{{ item.type }} • {{ formatDate(item.date) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Search results -->
        <div v-if="searchQuery && filteredResults.length > 0" class="p-4">
          <div class="space-y-1">
            <div
              v-for="(item, index) in filteredResults"
              :key="`result-${item.id}`"
              @click="selectItem(item)"
              class="p-3 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
              :class="{ 'bg-primary-50': selectedIndex === index }"
            >
              <span class="text-2xl">{{ getItemIcon(item.type) }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  <span v-html="highlightText(item.title, searchQuery)"></span>
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ item.type }} • {{ formatDate(item.date) }}
                  <span v-if="item.preview" class="ml-2">{{ item.preview }}</span>
                </p>
              </div>
              <div class="text-xs text-gray-400">
                {{ getItemLocation(item) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 p-4 bg-gray-50">
        <div class="flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center space-x-4">
            <span class="flex items-center">
              <kbd class="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
              <span class="ml-1">Navegar</span>
            </span>
            <span class="flex items-center">
              <kbd class="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
              <span class="ml-1">Seleccionar</span>
            </span>
            <span class="flex items-center">
              <kbd class="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
              <span class="ml-1">Cerrar</span>
            </span>
          </div>
          <div>
            {{ filteredResults.length }} resultado{{ filteredResults.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { mockEvents, mockNotes, mockTransactions, mockChats } from '@/mock-data'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close'])
const router = useRouter()
const appStore = useAppStore()

const searchInput = ref(null)
const searchQuery = ref('')
const activeFilter = ref('all')
const selectedIndex = ref(0)

const quickFilters = [
  { type: 'all', label: 'Todo', icon: '🔍' },
  { type: 'events', label: 'Eventos', icon: '📅' },
  { type: 'notes', label: 'Notas', icon: '📝' },
  { type: 'transactions', label: 'Finanzas', icon: '💰' },
  { type: 'chats', label: 'Chats', icon: '💬' }
]

// Combinar todos los elementos para búsqueda
const allItems = computed(() => {
  const items = []
  
  // Eventos
  mockEvents.forEach(event => {
    items.push({
      id: `event-${event.id}`,
      type: 'Evento',
      category: 'events',
      title: event.title,
      preview: event.description?.substring(0, 50) + '...',
      date: event.start,
      location: event.location,
      route: `/calendar?event=${event.id}`
    })
  })
  
  // Notas
  mockNotes.forEach(note => {
    items.push({
      id: `note-${note.id}`,
      type: 'Nota',
      category: 'notes',
      title: note.title,
      preview: note.content.substring(0, 50) + '...',
      date: note.updatedAt,
      location: note.isShared ? 'Compartida' : 'Personal',
      route: `/notes?note=${note.id}`
    })
  })
  
  // Transacciones
  mockTransactions.forEach(transaction => {
    items.push({
      id: `transaction-${transaction.id}`,
      type: 'Transacción',
      category: 'transactions',
      title: transaction.description,
      preview: appStore.formatCurrency(transaction.amount),
      date: transaction.date,
      location: 'Finanzas',
      route: `/finance?transaction=${transaction.id}`
    })
  })
  
  // Chats
  mockChats.forEach(chat => {
    items.push({
      id: `chat-${chat.id}`,
      type: 'Chat',
      category: 'chats',
      title: chat.name,
      preview: `${chat.participants.length} participantes`,
      date: chat.lastMessageAt,
      location: 'Mensajería',
      route: `/chats?chat=${chat.id}`
    })
  })
  
  return items.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const recentItems = computed(() => {
  return allItems.value.slice(0, 8)
})

const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  
  let results = allItems.value.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         item.preview.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesFilter = activeFilter.value === 'all' || item.category === activeFilter.value
    
    return matchesSearch && matchesFilter
  })
  
  return results.slice(0, 20) // Limitar resultados
})

const getItemIcon = (type) => {
  const icons = {
    'Evento': '📅',
    'Nota': '📝',
    'Transacción': '💰',
    'Chat': '💬'
  }
  return icons[type] || '📄'
}

const getItemLocation = (item) => {
  return item.location || ''
}

const formatDate = (date) => {
  return appStore.formatDate(date)
}

const highlightText = (text, query) => {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}

const navigateDown = () => {
  const maxIndex = searchQuery.value ? filteredResults.value.length - 1 : recentItems.value.length - 1
  selectedIndex.value = Math.min(selectedIndex.value + 1, maxIndex)
}

const navigateUp = () => {
  selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
}

const selectResult = () => {
  const items = searchQuery.value ? filteredResults.value : recentItems.value
  if (items[selectedIndex.value]) {
    selectItem(items[selectedIndex.value])
  }
}

const selectItem = (item) => {
  emit('close')
  router.push(item.route)
  
  appStore.addToast({
    type: 'info',
    title: 'Navegando a resultado',
    message: `Abriendo: ${item.title}`
  })
}

onMounted(async () => {
  await nextTick()
  searchInput.value?.focus()
})
</script>