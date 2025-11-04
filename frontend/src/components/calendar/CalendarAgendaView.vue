<template>
  <div class="calendar-agenda">
    <!-- Agenda controls -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center space-x-4">
        <h2 class="text-lg font-semibold text-gray-900">Vista Agenda</h2>
        
        <!-- Time range selector -->
        <select v-model="timeRange" class="input-field text-sm">
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="3months">Próximos 3 meses</option>
          <option value="6months">Próximos 6 meses</option>
        </select>
      </div>

      <div class="flex items-center space-x-3">
        <!-- View options -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            @click="groupBy = 'date'"
            class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            :class="groupBy === 'date' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'"
          >
            Por fecha
          </button>
          <button
            @click="groupBy = 'category'"
            class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
            :class="groupBy === 'category' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'"
          >
            Por categoría
          </button>
        </div>

        <!-- Export button -->
        <button class="btn-secondary text-sm">
          <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
          Exportar
        </button>
      </div>
    </div>

    <!-- Summary stats -->
    <div class="p-4 bg-blue-50 border-b border-gray-200">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-blue-600">{{ totalEvents }}</p>
          <p class="text-sm text-gray-600">Total eventos</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-green-600">{{ confirmedEvents }}</p>
          <p class="text-sm text-gray-600">Confirmados</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-yellow-600">{{ tentativeEvents }}</p>
          <p class="text-sm text-gray-600">Tentativo</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-purple-600">{{ totalHours }}h</p>
          <p class="text-sm text-gray-600">Tiempo total</p>
        </div>
      </div>
    </div>

    <!-- Events list -->
    <div class="flex-1 overflow-y-auto">
      <!-- Group by date -->
      <div v-if="groupBy === 'date'" class="space-y-0">
        <div
          v-for="group in eventsByDate"
          :key="group.date"
          class="border-b border-gray-200"
        >
          <!-- Date header -->
          <div class="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ group.dayName }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ group.formattedDate }} • {{ group.events.length }} eventos
                </p>
              </div>
              
              <div class="text-sm text-gray-500">
                {{ group.totalDuration }}h ocupado
              </div>
            </div>
          </div>

          <!-- Events for this date -->
          <div class="space-y-0">
            <div
              v-for="event in group.events"
              :key="event.id"
              class="event-row"
              @click="handleEventClick(event)"
            >
              <div class="flex items-center space-x-4 p-4 hover:bg-gray-50 cursor-pointer">
                <!-- Time -->
                <div class="w-20 flex-shrink-0 text-sm text-gray-500">
                  {{ event.allDay ? 'Todo el día' : formatEventTime(event.start) }}
                </div>

                <!-- Category indicator -->
                <div
                  class="w-1 h-12 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: getCategoryColor(event.category) }"
                ></div>

                <!-- Event details -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <h4 class="text-sm font-medium text-gray-900 truncate">
                      {{ event.title }}
                    </h4>
                    
                    <!-- Status badge -->
                    <span
                      v-if="event.status !== 'confirmed'"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="{
                        'bg-yellow-100 text-yellow-800': event.status === 'tentative',
                        'bg-red-100 text-red-800': event.status === 'cancelled'
                      }"
                    >
                      {{ statusLabels[event.status] }}
                    </span>
                  </div>

                  <div class="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                    <span v-if="!event.allDay">
                      {{ formatEventTimeRange(event) }}
                    </span>
                    <span v-if="event.location">
                      📍 {{ event.location }}
                    </span>
                    <span v-if="event.attendees && event.attendees.length > 0">
                      👥 {{ event.attendees.length }} participantes
                    </span>
                  </div>

                  <p v-if="event.description" class="mt-1 text-sm text-gray-600 line-clamp-2">
                    {{ event.description }}
                  </p>
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-2">
                  <button
                    @click.stop="editEvent(event)"
                    class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  
                  <button
                    @click.stop="duplicateEvent(event)"
                    class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <DocumentDuplicateIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- No events for this date -->
            <div v-if="group.events.length === 0" class="p-4 text-center text-gray-500">
              <CalendarIcon class="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p class="text-sm">No hay eventos programados</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Group by category -->
      <div v-else class="space-y-6 p-4">
        <div
          v-for="category in eventsByCategory"
          :key="category.id"
          class="card"
        >
          <!-- Category header -->
          <div class="flex items-center space-x-3 mb-4">
            <div
              class="w-4 h-4 rounded-full"
              :style="{ backgroundColor: category.color }"
            ></div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ category.name }}
            </h3>
            <span class="text-sm text-gray-500">
              ({{ category.events.length }} eventos)
            </span>
          </div>

          <!-- Events in this category -->
          <div class="space-y-3">
            <div
              v-for="event in category.events"
              :key="event.id"
              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              @click="handleEventClick(event)"
            >
              <div class="text-sm text-gray-500 w-24 flex-shrink-0">
                {{ formatEventDate(event.start) }}
              </div>
              
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 truncate">
                  {{ event.title }}
                </h4>
                <p class="text-xs text-gray-500">
                  {{ event.allDay ? 'Todo el día' : formatEventTimeRange(event) }}
                </p>
              </div>

              <div class="flex items-center space-x-2">
                <span
                  v-if="event.status !== 'confirmed'"
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-yellow-500': event.status === 'tentative',
                    'bg-red-500': event.status === 'cancelled'
                  }"
                ></span>
                
                <button
                  @click.stop="editEvent(event)"
                  class="p-1 text-gray-400 hover:text-gray-600"
                >
                  <PencilIcon class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  CalendarIcon,
  DocumentArrowDownIcon,
  PencilIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  currentDate: {
    type: Date,
    required: true
  },
  events: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['event-click'])

const timeRange = ref('month')
const groupBy = ref('date')

// Category data
const categories = {
  work: { name: 'Trabajo', color: '#3B82F6' },
  personal: { name: 'Personal', color: '#10B981' },
  meeting: { name: 'Reuniones', color: '#F59E0B' },
  reminder: { name: 'Recordatorios', color: '#EF4444' },
  holiday: { name: 'Vacaciones', color: '#8B5CF6' }
}

const statusLabels = {
  tentative: 'Tentativo',
  cancelled: 'Cancelado'
}

// Computed properties
const filteredEvents = computed(() => {
  const now = new Date()
  let endDate = new Date()

  switch (timeRange.value) {
    case 'week':
      endDate.setDate(now.getDate() + 7)
      break
    case 'month':
      endDate.setMonth(now.getMonth() + 1)
      break
    case '3months':
      endDate.setMonth(now.getMonth() + 3)
      break
    case '6months':
      endDate.setMonth(now.getMonth() + 6)
      break
  }

  return props.events
    .filter(event => {
      const eventStart = new Date(event.start)
      return eventStart >= now && eventStart <= endDate
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start))
})

const eventsByDate = computed(() => {
  const groups = {}
  
  filteredEvents.value.forEach(event => {
    const date = new Date(event.start).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
  })

  return Object.entries(groups).map(([dateString, events]) => {
    const date = new Date(dateString)
    const totalDuration = events
      .filter(e => !e.allDay)
      .reduce((total, event) => {
        const start = new Date(event.start)
        const end = new Date(event.end)
        return total + ((end - start) / (1000 * 60 * 60))
      }, 0)

    return {
      date: dateString,
      dayName: date.toLocaleDateString('es-ES', { weekday: 'long' }),
      formattedDate: date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      events: events.sort((a, b) => {
        if (a.allDay && !b.allDay) return -1
        if (!a.allDay && b.allDay) return 1
        return new Date(a.start) - new Date(b.start)
      }),
      totalDuration: Math.round(totalDuration * 10) / 10
    }
  }).sort((a, b) => new Date(a.date) - new Date(b.date))
})

const eventsByCategory = computed(() => {
  const groups = {}
  
  filteredEvents.value.forEach(event => {
    const category = event.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(event)
  })

  return Object.entries(groups).map(([categoryId, events]) => ({
    id: categoryId,
    name: categories[categoryId]?.name || categoryId,
    color: categories[categoryId]?.color || '#6B7280',
    events: events.sort((a, b) => new Date(a.start) - new Date(b.start))
  })).sort((a, b) => b.events.length - a.events.length)
})

const totalEvents = computed(() => filteredEvents.value.length)

const confirmedEvents = computed(() => 
  filteredEvents.value.filter(e => e.status === 'confirmed').length
)

const tentativeEvents = computed(() => 
  filteredEvents.value.filter(e => e.status === 'tentative').length
)

const totalHours = computed(() => {
  const hours = filteredEvents.value
    .filter(e => !e.allDay)
    .reduce((total, event) => {
      const start = new Date(event.start)
      const end = new Date(event.end)
      return total + ((end - start) / (1000 * 60 * 60))
    }, 0)
  
  return Math.round(hours * 10) / 10
})

// Methods
const getCategoryColor = (category) => {
  return categories[category]?.color || '#6B7280'
}

const formatEventTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const formatEventTimeRange = (event) => {
  const start = new Date(event.start)
  const end = new Date(event.end)
  
  return `${start.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })} - ${end.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })}`
}

const formatEventDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric'
  })
}

const handleEventClick = (event) => {
  emit('event-click', event)
}

const editEvent = (event) => {
  console.log('Edit event:', event)
  // This would trigger edit mode in the event modal
}

const duplicateEvent = (event) => {
  console.log('Duplicate event:', event)
  // This would create a copy of the event
}
</script>

<style scoped>
.calendar-agenda {
  @apply h-full flex flex-col bg-white;
}

.event-row {
  @apply border-b border-gray-100 last:border-b-0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>