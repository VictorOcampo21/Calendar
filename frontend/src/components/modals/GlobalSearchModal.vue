<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="$emit('close')">
    <div class="relative top-20 mx-auto p-0 border max-w-2xl shadow-lg rounded-lg bg-white" @click.stop>
      <div class="p-4 border-b border-gray-200">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Buscar en todo..."
            class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            @keydown.esc="$emit('close')"
            @keydown.down.prevent="highlightNext"
            @keydown.up.prevent="highlightPrev"
            @keydown.enter.prevent="selectResult"
          />
          <XMarkIcon 
            class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
            @click="$emit('close')"
          />
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="searchQuery.length === 0" class="p-6 text-center text-gray-500">
          <MagnifyingGlassIcon class="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Escribe para buscar en todos tus datos</p>
        </div>

        <div v-else-if="filteredResults.length === 0" class="p-6 text-center text-gray-500">
          <p>No se encontraron resultados para "{{ searchQuery }}"</p>
        </div>

        <div v-else class="py-2">
          <div
            v-for="(result, index) in filteredResults"
            :key="result.id"
            class="search-result-item"
            :class="{ 'highlighted': highlightedIndex === index }"
            @click="openResult(result)"
            @mouseenter="highlightedIndex = index"
          >
            <div class="flex items-start space-x-3">
              <component :is="result.icon" class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ result.title }}</p>
                  <span class="result-type-badge">{{ result.type }}</span>
                </div>
                <p class="text-sm text-gray-500 truncate">{{ result.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div class="flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center space-x-4">
            <span><kbd class="px-1 bg-white border rounded">↑↓</kbd> Navegar</span>
            <span><kbd class="px-1 bg-white border rounded">↵</kbd> Abrir</span>
            <span><kbd class="px-1 bg-white border rounded">Esc</kbd> Cerrar</span>
          </div>
          <span>{{ filteredResults.length }} resultado{{ filteredResults.length !== 1 ? 's' : '' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  BanknotesIcon,
  UserIcon,
  TagIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])
const router = useRouter()

const searchInput = ref(null)
const searchQuery = ref('')
const highlightedIndex = ref(0)

const searchData = [
  {
    id: 1,
    type: 'Evento',
    title: 'Reunión con el equipo',
    description: 'Reunión semanal del equipo de desarrollo',
    url: '/calendar',
    icon: CalendarIcon
  },
  {
    id: 2,
    type: 'Nota',
    title: 'Plan de proyecto Q1',
    description: 'Objetivos y estrategias para el primer trimestre',
    url: '/notes',
    icon: DocumentTextIcon
  }
]

const filteredResults = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return searchData.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  ).slice(0, 8)
})

const highlightNext = () => {
  if (highlightedIndex.value < filteredResults.value.length - 1) {
    highlightedIndex.value++
  }
}

const highlightPrev = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  }
}

const selectResult = () => {
  if (filteredResults.value[highlightedIndex.value]) {
    openResult(filteredResults.value[highlightedIndex.value])
  }
}

const openResult = (result) => {
  router.push(result.url)
  emit('close')
}

onMounted(async () => {
  await nextTick()
  searchInput.value?.focus()
})
</script>

<style scoped>
.search-result-item {
  @apply px-4 py-3 cursor-pointer transition-colors;
}

.search-result-item:hover,
.search-result-item.highlighted {
  @apply bg-gray-50;
}

.result-type-badge {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex-shrink-0;
}
</style>