<template>
  <div class="calendar-day">
    <!-- Day header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">
          {{ dayName }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ formattedDate }}
        </p>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Weather widget (mini) -->
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <span class="text-lg">{{ weatherData.icon }}</span>
          <span>{{ weatherData.temperature }}°C</span>
        </div>
        
        <!-- Quick stats -->
        <div class="flex items-center space-x-4 text-sm text-gray-600">
          <div class="flex items-center space-x-1">
            <CalendarIcon class="w-4 h-4" />
            <span>{{ dayEvents.length }} eventos</span>
          </div>
          <div class="flex items-center space-x-1">
            <ClockIcon class="w-4 h-4" />
            <span>{{ busyHours }}h ocupado</span>
          </div>
        </div>
      </div>
    </div>

    <!-- All day events -->
    <div
      v-if="allDayEvents.length > 0"
      class="p-4 border-b border-gray-200 bg-gray-50"
    >
      <h3 class="text-sm font-medium text-gray-700 mb-3">Todo el día</h3>
      <div class="space-y-2">
        <div
          v-for="event in allDayEvents"
          :key="event.id"
          class="event-item all-day-event"
          :style="{ backgroundColor: getCategoryColor(event.category) }"
          @click="handleEventClick(event)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center min-w-0">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">
                  {{ event.title }}
                </p>
                <p v-if="event.location" class="text-xs text-white opacity-75">
                  📍 {{ event.location }}
                </p>
              </div>
            </div>
            <div
              v-if="event.status !== 'confirmed'"
              class="ml-2 w-2 h-2 rounded-full flex-shrink-0"
              :class="{
                'bg-yellow-300': event.status === 'tentative',
                'bg-red-300': event.status === 'cancelled'
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Time schedule -->
    <div class="flex-1 overflow-y-auto">
      <div class="relative">
        <!-- Time slots -->
        <div class="grid grid-cols-12 gap-0">
          <!-- Time column -->
          <div class="col-span-2 bg-gray-50 border-r border-gray-200">
            <div
              v-for="hour in hours"
              :key="hour"
              class="h-16 border-b border-gray-200 px-3 py-2 flex items-start"
            >
              <span class="text-xs text-gray-500 font-medium">
                {{ formatHour(hour) }}
              </span>
            </div>
          </div>

          <!-- Events column -->
          <div class="col-span-10 relative">
            <!-- Hour grid -->
            <div
              v-for="hour in hours"
              :key="`hour-${hour}`"
              class="h-16 border-b border-gray-200 relative group"
              :class="{
                'bg-blue-50': hour === currentHour && isToday,
                'hover:bg-gray-50': hour !== currentHour || !isToday
              }"
              @click="handleTimeClick(hour)"
            >
              <!-- Quarter hour lines -->
              <div class="absolute inset-0">
                <div class="h-full border-r border-gray-100" style="left: 25%"></div>
                <div class="h-full border-r border-gray-100" style="left: 50%"></div>
                <div class="h-full border-r border-gray-100" style="left: 75%"></div>
              </div>

              <!-- Quick add button -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700"
                  @click.stop="handleQuickAdd(hour)"
                >
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Events positioned absolutely -->
            <div
              v-for="event in timedEvents"
              :key="event.id"
              class="absolute left-2 right-2 event-item timed-event"
              :style="getEventStyle(event)"
              @click="handleEventClick(event)"
            >
              <div class="p-2 h-full">
                <div class="flex items-start justify-between mb-1">
                  <h4 class="text-sm font-medium text-white leading-tight">
                    {{ event.title }}
                  </h4>
                  <div
                    v-if="event.status !== 'confirmed'"
                    class="ml-1 w-2 h-2 rounded-full flex-shrink-0"
                    :class="{
                      'bg-yellow-300': event.status === 'tentative',
                      'bg-red-300': event.status === 'cancelled'
                    }"
                  ></div>
                </div>
                
                <p class="text-xs text-white opacity-90 mb-1">
                  {{ formatEventTimeRange(event) }}
                </p>
                
                <div v-if="event.location" class="text-xs text-white opacity-75 mb-1">
                  📍 {{ event.location }}
                </div>
                
                <div v-if="event.attendees && event.attendees.length > 0" class="text-xs text-white opacity-75">
                  👥 {{ event.attendees.length }} participantes
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Current time indicator -->
        <div
          v-if="showCurrentTimeIndicator"
          class="absolute left-0 right-0 pointer-events-none z-20"
          :style="{ top: currentTimePosition + 'px' }"
        >
          <div class="flex items-center">
            <div class="w-24 text-right pr-3">
              <div class="text-xs text-red-500 font-medium bg-white px-1 rounded">
                {{ currentTimeString }}
              </div>
            </div>
            <div class="flex-1 h-0.5 bg-red-500 relative">
              <div class="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day summary -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ dayEvents.length }}</p>
          <p class="text-xs text-gray-500">Eventos</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ busyHours }}h</p>
          <p class="text-xs text-gray-500">Tiempo ocupado</p>
        </div>
        <div>
          <p class="text-2xl font-bold text-gray-900">{{ freeHours }}h</p>
          <p class="text-xs text-gray-500">Tiempo libre</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { CalendarIcon, ClockIcon, PlusIcon } from '@heroicons/vue/24/outline'

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

const emit = defineEmits(['event-click', 'time-click', 'event-create'])

const currentTime = ref(new Date())
let timeInterval = null

// Mock weather data
const weatherData = ref({
  icon: '⛅',
  temperature: 24
})

// Category colors
const categoryColors = {
  work: '#3B82F6',
  personal: '#10B981',
  meeting: '#F59E0B',
  reminder: '#EF4444',
  holiday: '#8B5CF6'
}

const hours = Array.from({ length: 24 }, (_, i) => i)

const dayName = computed(() => {
  return props.currentDate.toLocaleDateString('es-ES', { 
    weekday: 'long' 
  })
})

const formattedDate = computed(() => {
  return props.currentDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const isToday = computed(() => {
  const today = new Date()
  return props.currentDate.toDateString() === today.toDateString()
})

const currentHour = computed(() => {
  return currentTime.value.getHours()
})

const dayEvents = computed(() => {
  return props.events.filter(event => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    
    const dateStart = new Date(props.currentDate)
    dateStart.setHours(0, 0, 0, 0)
    const dateEnd = new Date(props.currentDate)
    dateEnd.setHours(23, 59, 59, 999)
    
    return (eventStart <= dateEnd && eventEnd >= dateStart)
  }).sort((a, b) => new Date(a.start) - new Date(b.start))
})

const allDayEvents = computed(() => {
  return dayEvents.value.filter(event => event.allDay)
})

const timedEvents = computed(() => {
  return dayEvents.value.filter(event => !event.allDay)
})

const busyHours = computed(() => {
  let totalMinutes = 0
  
  timedEvents.value.forEach(event => {
    const start = new Date(event.start)
    const end = new Date(event.end)
    const duration = (end - start) / (1000 * 60) // minutes
    totalMinutes += duration
  })
  
  return Math.round(totalMinutes / 60 * 10) / 10 // round to 1 decimal
})

const freeHours = computed(() => {
  return Math.round((24 - busyHours.value) * 10) / 10
})

const showCurrentTimeIndicator = computed(() => {
  return isToday.value
})

const currentTimePosition = computed(() => {
  const hour = currentTime.value.getHours()
  const minute = currentTime.value.getMinutes()
  return (hour * 64) + (minute * 64 / 60) // 64px per hour
})

const currentTimeString = computed(() => {
  return currentTime.value.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
})

const getCategoryColor = (category) => {
  return categoryColors[category] || '#6B7280'
}

const formatHour = (hour) => {
  return `${hour.toString().padStart(2, '0')}:00`
}

const getEventStyle = (event) => {
  const start = new Date(event.start)
  const end = new Date(event.end)
  
  const startHour = start.getHours()
  const startMinute = start.getMinutes()
  const endHour = end.getHours()
  const endMinute = end.getMinutes()
  
  const top = (startHour * 64) + (startMinute * 64 / 60)
  const duration = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60
  const height = duration * 64
  
  return {
    top: top + 'px',
    height: Math.max(height, 30) + 'px',
    backgroundColor: getCategoryColor(event.category),
    zIndex: 10
  }
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

const handleEventClick = (event) => {
  emit('event-click', event)
}

const handleTimeClick = (hour) => {
  const clickTime = new Date(props.currentDate)
  clickTime.setHours(hour, 0, 0, 0)
  emit('time-click', props.currentDate, clickTime)
}

const handleQuickAdd = (hour) => {
  const startTime = new Date(props.currentDate)
  startTime.setHours(hour, 0, 0, 0)
  emit('time-click', props.currentDate, startTime)
}

const updateCurrentTime = () => {
  currentTime.value = new Date()
}

onMounted(() => {
  timeInterval = setInterval(updateCurrentTime, 60000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.calendar-day {
  @apply h-full flex flex-col bg-white;
}

.event-item {
  @apply rounded cursor-pointer transition-all duration-200;
  @apply hover:shadow-lg hover:scale-105 border border-white border-opacity-20;
}

.all-day-event {
  @apply px-3 py-2;
}

.timed-event {
  @apply min-h-[30px] shadow-sm;
  overflow: hidden;
}
</style>