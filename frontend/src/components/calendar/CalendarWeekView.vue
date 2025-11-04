<template>
  <div class="calendar-week">
    <!-- Header with days -->
    <div class="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
      <!-- Time column header -->
      <div class="p-3 text-sm font-medium text-gray-500"></div>
      
      <!-- Day headers -->
      <div
        v-for="day in weekDays"
        :key="day.date.toISOString()"
        class="p-3 text-center border-l border-gray-200"
      >
        <div class="text-sm font-medium text-gray-500">
          {{ day.dayName }}
        </div>
        <div
          class="text-lg font-semibold mt-1"
          :class="{
            'text-indigo-600': day.isToday,
            'text-gray-900': !day.isToday
          }"
        >
          {{ day.dayNumber }}
        </div>
        <div
          v-if="day.isToday"
          class="w-6 h-6 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center mx-auto mt-1"
        >
          •
        </div>
      </div>
    </div>

    <!-- All day events row -->
    <div class="grid grid-cols-8 border-b border-gray-200 bg-gray-50 min-h-[60px]">
      <!-- All day label -->
      <div class="p-3 text-sm font-medium text-gray-500 flex items-center">
        Todo el día
      </div>
      
      <!-- All day events -->
      <div
        v-for="day in weekDays"
        :key="`allday-${day.date.toISOString()}`"
        class="border-l border-gray-200 p-2 space-y-1"
      >
        <div
          v-for="event in day.allDayEvents"
          :key="event.id"
          class="event-item all-day-event"
          :style="{ backgroundColor: getCategoryColor(event.category) }"
          @click="handleEventClick(event)"
        >
          <span class="text-xs font-medium text-white truncate">
            {{ event.title }}
          </span>
        </div>
      </div>
    </div>

    <!-- Time grid -->
    <div class="relative overflow-y-auto max-h-[600px]">
      <div class="grid grid-cols-8">
        <!-- Time column -->
        <div class="bg-gray-50 border-r border-gray-200">
          <div
            v-for="hour in hours"
            :key="hour"
            class="h-16 border-b border-gray-200 px-3 py-2 text-xs text-gray-500"
          >
            {{ formatHour(hour) }}
          </div>
        </div>

        <!-- Day columns -->
        <div
          v-for="day in weekDays"
          :key="`day-${day.date.toISOString()}`"
          class="relative border-l border-gray-200"
        >
          <!-- Hour cells -->
          <div
            v-for="hour in hours"
            :key="`${day.date.toISOString()}-${hour}`"
            class="h-16 border-b border-gray-200 relative group"
            :class="{
              'bg-blue-50': day.isToday && hour === currentHour,
              'hover:bg-gray-50': !day.isToday || hour !== currentHour
            }"
            @click="handleTimeClick(day.date, hour)"
          >
            <!-- Quick add button -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                class="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-indigo-700"
                @click.stop="handleQuickAdd(day.date, hour)"
              >
                <PlusIcon class="w-3 h-3" />
              </button>
            </div>
          </div>

          <!-- Events positioned absolutely -->
          <div
            v-for="event in day.timedEvents"
            :key="event.id"
            class="absolute left-1 right-1 event-item timed-event"
            :style="getEventStyle(event)"
            @click="handleEventClick(event)"
          >
            <div class="p-1">
              <div class="text-xs font-medium text-white truncate">
                {{ event.title }}
              </div>
              <div class="text-xs text-white opacity-75">
                {{ formatEventTimeRange(event) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Current time indicator -->
      <div
        v-if="showCurrentTimeIndicator"
        class="absolute left-0 right-0 pointer-events-none z-10"
        :style="{ top: currentTimePosition + 'px' }"
      >
        <div class="flex items-center">
          <div class="w-16 text-right pr-2">
            <div class="text-xs text-red-500 font-medium">
              {{ currentTimeString }}
            </div>
          </div>
          <div class="flex-1 h-0.5 bg-red-500"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const emit = defineEmits(['event-click', 'time-click', 'event-create'])

const currentTime = ref(new Date())
let timeInterval = null

// Category colors
const categoryColors = {
  work: '#3B82F6',
  personal: '#10B981',
  meeting: '#F59E0B',
  reminder: '#EF4444',
  holiday: '#8B5CF6'
}

const hours = Array.from({ length: 24 }, (_, i) => i)

const weekDays = computed(() => {
  const startOfWeek = getStartOfWeek(props.currentDate)
  const days = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    
    const dayEvents = getEventsForDate(date)
    
    days.push({
      date: new Date(date),
      dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase(),
      dayNumber: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
      allDayEvents: dayEvents.filter(event => event.allDay),
      timedEvents: dayEvents.filter(event => !event.allDay)
    })
  }

  return days
})

const currentHour = computed(() => {
  return currentTime.value.getHours()
})

const showCurrentTimeIndicator = computed(() => {
  const today = new Date()
  return weekDays.value.some(day => day.isToday)
})

const currentTimePosition = computed(() => {
  const hour = currentTime.value.getHours()
  const minute = currentTime.value.getMinutes()
  return (hour * 64) + (minute * 64 / 60) + 60 // 64px per hour + header offset
})

const currentTimeString = computed(() => {
  return currentTime.value.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
})

const getStartOfWeek = (date) => {
  const start = new Date(date)
  const day = start.getDay()
  const diff = start.getDate() - day
  start.setDate(diff)
  return start
}

const getEventsForDate = (date) => {
  return props.events.filter(event => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    
    const dateStart = new Date(date)
    dateStart.setHours(0, 0, 0, 0)
    const dateEnd = new Date(date)
    dateEnd.setHours(23, 59, 59, 999)
    
    return (eventStart <= dateEnd && eventEnd >= dateStart)
  }).sort((a, b) => new Date(a.start) - new Date(b.start))
}

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
    height: Math.max(height, 20) + 'px',
    backgroundColor: getCategoryColor(event.category),
    zIndex: 1
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

const handleTimeClick = (date, hour) => {
  const clickTime = new Date(date)
  clickTime.setHours(hour, 0, 0, 0)
  emit('time-click', date, clickTime)
}

const handleQuickAdd = (date, hour) => {
  const startTime = new Date(date)
  startTime.setHours(hour, 0, 0, 0)
  emit('time-click', date, startTime)
}

const updateCurrentTime = () => {
  currentTime.value = new Date()
}

onMounted(() => {
  // Update current time every minute
  timeInterval = setInterval(updateCurrentTime, 60000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.calendar-week {
  @apply bg-white;
}

.event-item {
  @apply rounded cursor-pointer transition-opacity border border-white border-opacity-20;
  @apply hover:opacity-80;
}

.all-day-event {
  @apply px-2 py-1;
}

.timed-event {
  @apply min-h-[20px];
  overflow: hidden;
}
</style>