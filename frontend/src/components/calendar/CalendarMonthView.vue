<template>
  <div class="calendar-month">
    <!-- Days of week header -->
    <div class="grid grid-cols-7 border-b border-gray-200">
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="px-3 py-2 text-sm font-medium text-gray-500 text-center bg-gray-50"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 border-l border-t border-gray-200">
      <div
        v-for="(day, index) in calendarDays"
        :key="`${day.date}-${index}`"
        class="min-h-[120px] border-r border-b border-gray-200 relative group"
        :class="{
          'bg-gray-50': !day.isCurrentMonth,
          'bg-blue-50': day.isToday,
          'hover:bg-gray-50': day.isCurrentMonth && !day.isToday
        }"
        @click="handleDateClick(day.date)"
      >
        <!-- Day number -->
        <div class="p-2">
          <div
            class="flex items-center justify-center w-6 h-6 text-sm"
            :class="{
              'text-gray-400': !day.isCurrentMonth,
              'text-gray-900': day.isCurrentMonth && !day.isToday,
              'bg-indigo-600 text-white rounded-full': day.isToday
            }"
          >
            {{ day.dayNumber }}
          </div>
        </div>

        <!-- Events for this day -->
        <div class="px-1 space-y-1">
          <div
            v-for="event in day.events.slice(0, 3)"
            :key="event.id"
            class="event-item"
            :style="{ backgroundColor: getCategoryColor(event.category) }"
            @click.stop="handleEventClick(event)"
          >
            <div class="flex items-center min-w-0">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-white truncate">
                  {{ event.title }}
                </p>
                <p v-if="event.allDay" class="text-xs text-white opacity-75">
                  Todo el día
                </p>
                <p v-else class="text-xs text-white opacity-75">
                  {{ formatEventTime(event.start) }}
                </p>
              </div>
              
              <!-- Event status indicator -->
              <div
                v-if="event.status !== 'confirmed'"
                class="ml-1 w-2 h-2 rounded-full flex-shrink-0"
                :class="{
                  'bg-yellow-300': event.status === 'tentative',
                  'bg-red-300': event.status === 'cancelled'
                }"
              ></div>
            </div>
          </div>

          <!-- More events indicator -->
          <div
            v-if="day.events.length > 3"
            class="text-xs text-gray-500 px-1 py-1 cursor-pointer hover:text-gray-700"
            @click.stop="showMoreEvents(day)"
          >
            +{{ day.events.length - 3 }} más
          </div>
        </div>

        <!-- Quick add button (appears on hover) -->
        <div
          v-if="day.isCurrentMonth"
          class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            @click.stop="handleQuickAdd(day.date)"
            class="w-6 h-6 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full flex items-center justify-center"
          >
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- More events modal -->
    <div
      v-if="showMoreModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeMoreModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-hidden"
        @click.stop
      >
        <div class="px-4 py-3 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            Eventos - {{ formatSelectedDate }}
          </h3>
        </div>
        
        <div class="px-4 py-3 max-h-80 overflow-y-auto">
          <div class="space-y-2">
            <div
              v-for="event in selectedDayEvents"
              :key="event.id"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="handleEventClick(event)"
            >
              <div
                class="w-3 h-3 rounded-full flex-shrink-0"
                :style="{ backgroundColor: getCategoryColor(event.category) }"
              ></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ event.title }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ event.allDay ? 'Todo el día' : formatEventTime(event.start) }}
                </p>
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
import { PlusIcon } from '@heroicons/vue/24/outline'

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

const emit = defineEmits(['event-click', 'date-click', 'event-create'])

const showMoreModal = ref(false)
const selectedDayEvents = ref([])
const selectedDate = ref(null)

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Category colors
const categoryColors = {
  work: '#3B82F6',
  personal: '#10B981',
  meeting: '#F59E0B',
  reminder: '#EF4444',
  holiday: '#8B5CF6'
}

const calendarDays = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()
  
  // Get first day of month and calculate the starting date of the calendar
  const firstDayOfMonth = new Date(year, month, 1)
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
  
  const days = []
  const today = new Date()
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    
    const dayEvents = getEventsForDate(currentDate)
    
    days.push({
      date: new Date(currentDate),
      dayNumber: currentDate.getDate(),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: currentDate.toDateString() === today.toDateString(),
      events: dayEvents
    })
  }
  
  return days
})

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const getEventsForDate = (date) => {
  return props.events.filter(event => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    
    // Check if event occurs on this date
    const dateStart = new Date(date)
    dateStart.setHours(0, 0, 0, 0)
    const dateEnd = new Date(date)
    dateEnd.setHours(23, 59, 59, 999)
    
    return (eventStart <= dateEnd && eventEnd >= dateStart)
  }).sort((a, b) => {
    // Sort by start time, all-day events first
    if (a.allDay && !b.allDay) return -1
    if (!a.allDay && b.allDay) return 1
    return new Date(a.start) - new Date(b.start)
  })
}

const getCategoryColor = (category) => {
  return categoryColors[category] || '#6B7280'
}

const formatEventTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const handleDateClick = (date) => {
  emit('date-click', date)
}

const handleEventClick = (event) => {
  emit('event-click', event)
  closeMoreModal()
}

const handleQuickAdd = (date) => {
  emit('date-click', date)
}

const showMoreEvents = (day) => {
  selectedDayEvents.value = day.events
  selectedDate.value = day.date
  showMoreModal.value = true
}

const closeMoreModal = () => {
  showMoreModal.value = false
  selectedDayEvents.value = []
  selectedDate.value = null
}
</script>

<style scoped>
.calendar-month {
  @apply bg-white;
}

.event-item {
  @apply px-2 py-1 rounded text-xs cursor-pointer transition-opacity;
  @apply hover:opacity-80;
}

.calendar-month .group:hover .opacity-0 {
  @apply opacity-100;
}
</style>