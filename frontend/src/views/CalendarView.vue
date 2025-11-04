<template>
  <div class="space-y-6">
    <!-- Calendar header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold text-gray-900">Calendario</h1>
        
        <!-- View selector -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            v-for="view in calendarViews"
            :key="view.id"
            @click="currentView = view.id"
            class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            :class="currentView === view.id 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'"
          >
            {{ view.label }}
          </button>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <!-- Date navigation -->
        <div class="flex items-center space-x-2">
          <button
            @click="navigateDate('prev')"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-md"
          >
            <ChevronLeftIcon class="w-5 h-5" />
          </button>
          
          <button
            @click="goToToday"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hoy
          </button>
          
          <button
            @click="navigateDate('next')"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-md"
          >
            <ChevronRightIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Current date display -->
        <div class="text-lg font-semibold text-gray-900">
          {{ formattedCurrentDate }}
        </div>

        <!-- Action buttons -->
        <div class="flex space-x-2">
          <button
            @click="showFilters = !showFilters"
            class="btn-secondary"
            :class="{ 'bg-indigo-50 text-indigo-700': hasActiveFilters }"
          >
            <FunnelIcon class="w-4 h-4 mr-2" />
            Filtros
          </button>
          
          <button
            @click="showCreateEvent = true"
            class="btn-primary"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Nuevo Evento
          </button>
        </div>
      </div>
    </div>

    <!-- Filters panel -->
    <div
      v-if="showFilters"
      class="bg-gray-50 rounded-lg p-4 border border-gray-200"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-900">Filtros</h3>
        <button
          @click="clearFilters"
          class="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Limpiar filtros
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Category filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Categorías
          </label>
          <div class="space-y-2">
            <label
              v-for="category in eventCategories"
              :key="category.id"
              class="flex items-center"
            >
              <input
                v-model="filters.categories"
                :value="category.id"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">
                <span
                  class="w-3 h-3 rounded-full inline-block mr-2"
                  :style="{ backgroundColor: category.color }"
                ></span>
                {{ category.name }}
              </span>
            </label>
          </div>
        </div>

        <!-- Status filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select v-model="filters.status" class="input-field">
            <option value="">Todos los estados</option>
            <option value="confirmed">Confirmado</option>
            <option value="tentative">Tentativo</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Buscar eventos
          </label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Título, descripción..."
            class="input-field"
          />
        </div>
      </div>
    </div>

    <!-- Calendar content -->
    <div class="bg-white rounded-lg shadow">
      <!-- Month view -->
      <CalendarMonthView
        v-if="currentView === 'month'"
        :current-date="currentDate"
        :events="filteredEvents"
        @event-click="handleEventClick"
        @date-click="handleDateClick"
        @event-create="handleEventCreate"
      />

      <!-- Week view -->
      <CalendarWeekView
        v-else-if="currentView === 'week'"
        :current-date="currentDate"
        :events="filteredEvents"
        @event-click="handleEventClick"
        @time-click="handleTimeClick"
        @event-create="handleEventCreate"
      />

      <!-- Day view -->
      <CalendarDayView
        v-else-if="currentView === 'day'"
        :current-date="currentDate"
        :events="filteredEvents"
        @event-click="handleEventClick"
        @time-click="handleTimeClick"
        @event-create="handleEventCreate"
      />

      <!-- Agenda view -->
      <CalendarAgendaView
        v-else-if="currentView === 'agenda'"
        :current-date="currentDate"
        :events="filteredEvents"
        @event-click="handleEventClick"
      />
    </div>

    <!-- Modals -->
    <EventModal
      :is-open="showEventModal"
      :event="selectedEvent"
      :mode="eventModalMode"
      @close="closeEventModal"
      @save="handleEventSave"
      @delete="handleEventDelete"
    />

    <CreateEventModal
      :is-open="showCreateEvent"
      :initial-date="createEventDate"
      :initial-time="createEventTime"
      @close="showCreateEvent = false"
      @save="handleEventCreate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { mockEvents } from '@/mock-data'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline'

// Components
import CalendarMonthView from '@/components/calendar/CalendarMonthView.vue'
import CalendarWeekView from '@/components/calendar/CalendarWeekView.vue'
import CalendarDayView from '@/components/calendar/CalendarDayView.vue'
import CalendarAgendaView from '@/components/calendar/CalendarAgendaView.vue'
import EventModal from '@/components/calendar/EventModal.vue'
import CreateEventModal from '@/components/calendar/CreateEventModal.vue'

const appStore = useAppStore()
const authStore = useAuthStore()

// Calendar state
const currentDate = ref(new Date())
const currentView = ref('month')
const showFilters = ref(false)
const showEventModal = ref(false)
const showCreateEvent = ref(false)
const selectedEvent = ref(null)
const eventModalMode = ref('view') // 'view', 'edit', 'create'
const createEventDate = ref(null)
const createEventTime = ref(null)

// Calendar views
const calendarViews = [
  { id: 'month', label: 'Mes' },
  { id: 'week', label: 'Semana' },
  { id: 'day', label: 'Día' },
  { id: 'agenda', label: 'Agenda' }
]

// Event categories
const eventCategories = ref([
  { id: 'work', name: 'Trabajo', color: '#3B82F6' },
  { id: 'personal', name: 'Personal', color: '#10B981' },
  { id: 'meeting', name: 'Reuniones', color: '#F59E0B' },
  { id: 'reminder', name: 'Recordatorios', color: '#EF4444' },
  { id: 'holiday', name: 'Vacaciones', color: '#8B5CF6' }
])

// Filters
const filters = ref({
  categories: [],
  status: '',
  search: ''
})

// Computed properties
const formattedCurrentDate = computed(() => {
  const options = { 
    year: 'numeric', 
    month: 'long' 
  }
  
  if (currentView.value === 'day') {
    options.day = 'numeric'
    options.weekday = 'long'
  } else if (currentView.value === 'week') {
    // Show week range
    const startOfWeek = getStartOfWeek(currentDate.value)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
      return `${startOfWeek.getDate()}-${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
    } else {
      return `${startOfWeek.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`
    }
  }
  
  return currentDate.value.toLocaleDateString('es-ES', options)
})

const filteredEvents = computed(() => {
  let events = mockEvents.filter(event => 
    event.workspaceId === authStore.currentWorkspace?.id
  )

  // Apply category filter
  if (filters.value.categories.length > 0) {
    events = events.filter(event => 
      filters.value.categories.includes(event.category)
    )
  }

  // Apply status filter
  if (filters.value.status) {
    events = events.filter(event => 
      event.status === filters.value.status
    )
  }

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    events = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm) ||
      event.description?.toLowerCase().includes(searchTerm)
    )
  }

  return events
})

const hasActiveFilters = computed(() => {
  return filters.value.categories.length > 0 ||
         filters.value.status !== '' ||
         filters.value.search !== ''
})

// Methods
const navigateDate = (direction) => {
  const newDate = new Date(currentDate.value)
  
  switch (currentView.value) {
    case 'month':
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
      break
    case 'week':
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
      break
    case 'day':
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
      break
    case 'agenda':
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
      break
  }
  
  currentDate.value = newDate
}

const goToToday = () => {
  currentDate.value = new Date()
}

const getStartOfWeek = (date) => {
  const start = new Date(date)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  start.setDate(diff)
  return start
}

const clearFilters = () => {
  filters.value = {
    categories: [],
    status: '',
    search: ''
  }
}

const handleEventClick = (event) => {
  selectedEvent.value = event
  eventModalMode.value = 'view'
  showEventModal.value = true
}

const handleDateClick = (date) => {
  createEventDate.value = date
  createEventTime.value = null
  showCreateEvent.value = true
}

const handleTimeClick = (date, time) => {
  createEventDate.value = date
  createEventTime.value = time
  showCreateEvent.value = true
}

const handleEventCreate = (eventData) => {
  // In a real app, this would make an API call
  console.log('Creating event:', eventData)
  appStore.showToast('Evento creado exitosamente', 'success')
  showCreateEvent.value = false
}

const handleEventSave = (eventData) => {
  // In a real app, this would make an API call
  console.log('Saving event:', eventData)
  appStore.showToast('Evento actualizado exitosamente', 'success')
  closeEventModal()
}

const handleEventDelete = (eventId) => {
  // In a real app, this would make an API call
  console.log('Deleting event:', eventId)
  appStore.showToast('Evento eliminado', 'info')
  closeEventModal()
}

const closeEventModal = () => {
  showEventModal.value = false
  selectedEvent.value = null
  eventModalMode.value = 'view'
}

// Load saved view preference
onMounted(() => {
  const savedView = localStorage.getItem('calendarView')
  if (savedView && calendarViews.find(v => v.id === savedView)) {
    currentView.value = savedView
  }
})

// Save view preference
watch(currentView, (newView) => {
  localStorage.setItem('calendarView', newView)
})
</script>