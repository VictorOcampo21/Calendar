<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
      <button
        @click="refreshFeed"
        class="text-gray-400 hover:text-gray-600"
      >
        <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" />
      </button>
    </div>

    <!-- Activity feed -->
    <div class="space-y-4 max-h-96 overflow-y-auto">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex space-x-3"
      >
        <!-- Activity icon -->
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="activityIconClasses[activity.type]"
          >
            <component :is="activityIcons[activity.type]" class="w-4 h-4" />
          </div>
        </div>

        <!-- Activity content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-900">
              {{ activity.user }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatTimeAgo(activity.timestamp) }}
            </p>
          </div>
          
          <p class="text-sm text-gray-600 mt-1">
            {{ activity.description }}
          </p>
          
          <!-- Activity details -->
          <div v-if="activity.details" class="mt-2">
            <div
              v-if="activity.type === 'event'"
              class="bg-blue-50 border border-blue-200 rounded-lg p-2"
            >
              <div class="flex items-center space-x-2">
                <CalendarIcon class="w-4 h-4 text-blue-600" />
                <span class="text-sm font-medium text-blue-900">{{ activity.details.title }}</span>
              </div>
              <p class="text-xs text-blue-700 mt-1">
                {{ formatEventTime(activity.details.date) }}
              </p>
            </div>

            <div
              v-else-if="activity.type === 'finance'"
              class="bg-green-50 border border-green-200 rounded-lg p-2"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-green-900">
                  {{ activity.details.description }}
                </span>
                <span
                  class="text-sm font-bold"
                  :class="activity.details.amount > 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatCurrency(activity.details.amount) }}
                </span>
              </div>
            </div>

            <div
              v-else-if="activity.type === 'note'"
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-2"
            >
              <p class="text-sm text-yellow-900 line-clamp-2">
                {{ activity.details.content }}
              </p>
            </div>

            <div
              v-else-if="activity.type === 'chat'"
              class="bg-purple-50 border border-purple-200 rounded-lg p-2"
            >
              <div class="flex items-center space-x-2">
                <ChatBubbleLeftIcon class="w-4 h-4 text-purple-600" />
                <span class="text-sm font-medium text-purple-900">
                  {{ activity.details.channel }}
                </span>
              </div>
              <p class="text-sm text-purple-700 mt-1 line-clamp-1">
                {{ activity.details.message }}
              </p>
            </div>
          </div>

          <!-- Activity actions -->
          <div v-if="activity.actions" class="mt-2 flex space-x-2">
            <button
              v-for="action in activity.actions"
              :key="action.label"
              class="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              @click="handleAction(action.type, activity)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="activities.length === 0" class="text-center py-8 text-gray-500">
        <ClockIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No hay actividad reciente</p>
        <p class="text-sm">Las acciones aparecerán aquí cuando ocurran</p>
      </div>
    </div>

    <!-- Load more -->
    <div v-if="activities.length > 0" class="mt-4 text-center">
      <button
        @click="loadMore"
        class="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        :disabled="isLoadingMore"
      >
        {{ isLoadingMore ? 'Cargando...' : 'Ver más actividad' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  ArrowPathIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserPlusIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

const appStore = useAppStore()

const isRefreshing = ref(false)
const isLoadingMore = ref(false)
const activities = ref([])

const activityIcons = {
  event: CalendarIcon,
  finance: CurrencyDollarIcon,
  note: DocumentTextIcon,
  chat: ChatBubbleLeftIcon,
  user: UserPlusIcon,
  system: CogIcon
}

const activityIconClasses = {
  event: 'bg-blue-100 text-blue-600',
  finance: 'bg-green-100 text-green-600',
  note: 'bg-yellow-100 text-yellow-600',
  chat: 'bg-purple-100 text-purple-600',
  user: 'bg-indigo-100 text-indigo-600',
  system: 'bg-gray-100 text-gray-600'
}

const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now - time) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Ahora'
  if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Hace ${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `Hace ${diffInDays}d`
  
  return time.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

const formatEventTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount) => {
  return appStore.formatCurrency(amount)
}

const refreshFeed = async () => {
  isRefreshing.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simular nuevas actividades
  const newActivities = generateRandomActivities(3)
  activities.value = [...newActivities, ...activities.value]
  
  isRefreshing.value = false
  appStore.showToast('Actividad actualizada', 'success')
}

const loadMore = async () => {
  isLoadingMore.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const moreActivities = generateRandomActivities(5)
  activities.value = [...activities.value, ...moreActivities]
  
  isLoadingMore.value = false
}

const handleAction = (actionType, activity) => {
  switch (actionType) {
    case 'view':
      appStore.showToast(`Viendo ${activity.type}`, 'info')
      break
    case 'edit':
      appStore.showToast(`Editando ${activity.type}`, 'info')
      break
    case 'reply':
      appStore.showToast('Respondiendo mensaje', 'info')
      break
    default:
      console.log('Action:', actionType, activity)
  }
}

const generateRandomActivities = (count) => {
  const users = ['Ana García', 'Carlos López', 'María Rodríguez', 'Juan Pérez', 'Tú']
  const activities = []
  
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    
    const activityTypes = [
      {
        type: 'event',
        description: 'creó un nuevo evento',
        details: {
          title: 'Reunión con equipo',
          date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        actions: [
          { label: 'Ver evento', type: 'view' },
          { label: 'Editar', type: 'edit' }
        ]
      },
      {
        type: 'finance',
        description: 'registró una nueva transacción',
        details: {
          description: 'Pago de servicios',
          amount: -Math.random() * 500 - 50
        },
        actions: [
          { label: 'Ver detalles', type: 'view' }
        ]
      },
      {
        type: 'note',
        description: 'creó una nueva nota',
        details: {
          content: 'Ideas para el próximo proyecto. Necesitamos evaluar las opciones disponibles y tomar una decisión pronto.'
        },
        actions: [
          { label: 'Leer nota', type: 'view' },
          { label: 'Comentar', type: 'reply' }
        ]
      },
      {
        type: 'chat',
        description: 'envió un mensaje',
        details: {
          channel: '#general',
          message: '¿Alguien puede revisar el documento que compartí?'
        },
        actions: [
          { label: 'Responder', type: 'reply' },
          { label: 'Ver chat', type: 'view' }
        ]
      },
      {
        type: 'user',
        description: 'se unió al workspace',
        actions: [
          { label: 'Ver perfil', type: 'view' }
        ]
      }
    ]
    
    const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)]
    
    activities.push({
      id: Date.now() + i,
      user,
      timestamp: timestamp.toISOString(),
      ...randomActivity
    })
  }
  
  return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

onMounted(() => {
  activities.value = generateRandomActivities(8)
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>