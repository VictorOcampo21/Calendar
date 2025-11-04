<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Próximos Eventos</h3>
      <router-link 
        to="/calendar" 
        class="text-sm text-primary-600 hover:text-primary-700"
      >
        Ver todos
      </router-link>
    </div>

    <div v-if="upcomingEvents.length === 0" class="text-center py-8">
      <CalendarIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p class="text-gray-500">No hay eventos próximos</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="event in upcomingEvents.slice(0, 5)"
        :key="event.id"
        class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        @click="openEvent(event)"
      >
        <!-- Event color indicator -->
        <div 
          class="w-3 h-3 rounded-full mt-1 flex-shrink-0"
          :style="{ backgroundColor: getCategoryColor(event.categoryId) }"
        ></div>
        
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ event.title }}
          </p>
          <div class="flex items-center space-x-2 text-xs text-gray-500">
            <span>{{ formatEventTime(event) }}</span>
            <span v-if="event.location" class="flex items-center">
              <MapPinIcon class="w-3 h-3 mr-1" />
              {{ event.location }}
            </span>
          </div>
        </div>
        
        <!-- Event status indicators -->
        <div class="flex items-center space-x-1">
          <span v-if="event.attendees?.length > 1" class="text-xs text-gray-400">
            {{ event.attendees.length }}👥
          </span>
          <span v-if="event.attachments?.length" class="text-xs text-gray-400">
            📎
          </span>
          <span v-if="isEventToday(event)" class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
            Hoy
          </span>
        </div>
      </div>
    </div>

    <!-- Quick add event -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <button
        @click="showQuickAdd = !showQuickAdd"
        class="w-full text-left text-sm text-gray-500 hover:text-gray-700 flex items-center"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Agregar evento rápido
      </button>
      
      <div v-if="showQuickAdd" class="mt-3">
        <input
          v-model="quickEventTitle"
          type="text"
          placeholder="Título del evento..."
          class="w-full text-sm border border-gray-300 rounded-md px-3 py-2 mb-2"
          @keydown.enter="addQuickEvent"
          @keydown.esc="showQuickAdd = false"
        />
        <div class="flex space-x-2">
          <button
            @click="addQuickEvent"
            :disabled="!quickEventTitle.trim()"
            class="text-xs bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            Agregar
          </button>
          <button
            @click="showQuickAdd = false"
            class="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400"
          >
            Cancelar
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
import { mockEvents, eventCategories } from '@/mock-data'
import { CalendarIcon, MapPinIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { addDays, isToday, isSameDay } from 'date-fns'

const router = useRouter()
const appStore = useAppStore()

const showQuickAdd = ref(false)
const quickEventTitle = ref('')

const upcomingEvents = computed(() => {
  const now = new Date()
  return mockEvents
    .filter(event => new Date(event.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
})

const formatEventTime = (event) => {
  const startDate = new Date(event.start)
  const endDate = new Date(event.end)
  
  if (event.isAllDay) {
    return `Todo el día • ${appStore.formatDate(startDate)}`
  }
  
  const timeString = appStore.formatTime(startDate)
  if (isToday(startDate)) {
    return `Hoy ${timeString}`
  } else if (isSameDay(startDate, addDays(new Date(), 1))) {
    return `Mañana ${timeString}`
  } else {
    return `${appStore.formatDate(startDate)} ${timeString}`
  }
}

const getCategoryColor = (categoryId) => {
  const category = eventCategories.find(cat => cat.id === categoryId)
  return category?.color || '#6B7280'
}

const isEventToday = (event) => {
  return isToday(new Date(event.start))
}

const openEvent = (event) => {
  router.push(`/calendar?event=${event.id}`)
}

const addQuickEvent = () => {
  if (!quickEventTitle.value.trim()) return
  
  appStore.addToast({
    type: 'success',
    title: 'Evento agregado',
    message: `"${quickEventTitle.value}" se agregó a tu calendario`
  })
  
  quickEventTitle.value = ''
  showQuickAdd.value = false
}
</script>