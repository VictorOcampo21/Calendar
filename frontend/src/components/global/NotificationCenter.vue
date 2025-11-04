<template>
  <div class="relative">
    <!-- Notification bell -->
    <button
      @click="togglePanel"
      class="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
      :class="{ 'text-indigo-600': hasUnread }"
    >
      <BellIcon class="w-6 h-6" />
      
      <!-- Unread indicator -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Notifications panel -->
    <div
      v-if="showPanel"
      v-click-outside="() => showPanel = false"
      class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
    >
      <!-- Panel header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Notificaciones</h3>
          <div class="flex items-center space-x-2">
            <!-- Mark all as read -->
            <button
              v-if="hasUnread"
              @click="markAllAsRead"
              class="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Marcar todas como leídas
            </button>
            
            <!-- Settings -->
            <button
              @click="showSettings = true"
              class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
              title="Configuración de notificaciones"
            >
              <CogIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Filter tabs -->
        <div class="flex space-x-4 mt-3">
          <button
            v-for="filter in filters"
            :key="filter.key"
            class="notification-filter"
            :class="{ 'active': activeFilter === filter.key }"
            @click="activeFilter = filter.key"
          >
            {{ filter.label }}
            <span
              v-if="filter.count > 0"
              class="ml-1 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full"
            >
              {{ filter.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Notifications list -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="filteredNotifications.length === 0" class="p-8 text-center">
          <BellSlashIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 class="text-sm font-medium text-gray-900 mb-2">
            {{ activeFilter === 'all' ? 'No hay notificaciones' : 'No hay notificaciones de este tipo' }}
          </h3>
          <p class="text-sm text-gray-500">
            {{ activeFilter === 'all' 
              ? 'Te notificaremos cuando tengas algo importante'
              : 'Cambia el filtro para ver otras notificaciones'
            }}
          </p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ 'unread': !notification.read }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start space-x-3 p-4">
              <!-- Notification icon -->
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                :class="getNotificationIconClass(notification.type)"
              >
                <component :is="getNotificationIcon(notification.type)" class="w-4 h-4" />
              </div>

              <!-- Notification content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ notification.title }}
                  </p>
                  <div class="flex items-center space-x-2">
                    <!-- Priority indicator -->
                    <span
                      v-if="notification.priority === 'high'"
                      class="inline-block w-2 h-2 bg-red-400 rounded-full"
                      title="Alta prioridad"
                    ></span>
                    
                    <!-- Timestamp -->
                    <span class="text-xs text-gray-500">
                      {{ formatNotificationTime(notification.createdAt) }}
                    </span>
                  </div>
                </div>
                
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                  {{ notification.message }}
                </p>

                <!-- Actions -->
                <div v-if="notification.actions && notification.actions.length > 0" class="flex space-x-2 mt-2">
                  <button
                    v-for="action in notification.actions"
                    :key="action.key"
                    @click.stop="executeNotificationAction(action, notification)"
                    class="notification-action-btn"
                    :class="action.primary ? 'btn-primary-sm' : 'btn-secondary-sm'"
                  >
                    {{ action.label }}
                  </button>
                </div>

                <!-- Tags -->
                <div v-if="notification.tags && notification.tags.length > 0" class="flex space-x-1 mt-2">
                  <span
                    v-for="tag in notification.tags"
                    :key="tag"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Menu -->
              <div class="flex-shrink-0">
                <div class="relative">
                  <button
                    @click.stop="toggleNotificationMenu(notification.id)"
                    class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  >
                    <EllipsisVerticalIcon class="w-4 h-4" />
                  </button>
                  
                  <div
                    v-if="activeMenu === notification.id"
                    v-click-outside="() => activeMenu = null"
                    class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
                  >
                    <div class="py-1">
                      <button
                        @click="markAsRead(notification)"
                        class="menu-item"
                        :disabled="notification.read"
                      >
                        <CheckIcon class="w-4 h-4 mr-2" />
                        {{ notification.read ? 'Leída' : 'Marcar como leída' }}
                      </button>
                      <button
                        @click="snoozeNotification(notification)"
                        class="menu-item"
                      >
                        <ClockIcon class="w-4 h-4 mr-2" />
                        Posponer
                      </button>
                      <button
                        @click="deleteNotification(notification)"
                        class="menu-item text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon class="w-4 h-4 mr-2" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel footer -->
      <div class="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div class="flex items-center justify-between">
          <button
            @click="showAllNotifications"
            class="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Ver todas las notificaciones
          </button>
          
          <div class="flex items-center space-x-2">
            <button
              @click="clearAllNotifications"
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar todo
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification settings modal -->
    <NotificationSettingsModal
      :is-open="showSettings"
      @close="showSettings = false"
      @settings-updated="handleSettingsUpdate"
    />

    <!-- Snooze modal -->
    <SnoozeModal
      :is-open="showSnoozeModal"
      :notification="selectedNotification"
      @close="showSnoozeModal = false"
      @snoozed="handleNotificationSnoozed"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  BellIcon,
  BellSlashIcon,
  CogIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  ClockIcon,
  TrashIcon,
  CalendarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

// Components
import NotificationSettingsModal from '@/components/global/NotificationSettingsModal.vue'
import SnoozeModal from '@/components/global/SnoozeModal.vue'

const router = useRouter()
const appStore = useAppStore()

const showPanel = ref(false)
const showSettings = ref(false)
const showSnoozeModal = ref(false)
const activeFilter = ref('all')
const activeMenu = ref(null)
const selectedNotification = ref(null)

// Mock notifications data
const notifications = ref([
  {
    id: 1,
    type: 'event',
    title: 'Reunión en 15 minutos',
    message: 'Reunión de equipo programada para las 10:00 AM',
    priority: 'high',
    read: false,
    createdAt: new Date(Date.now() - 900000), // 15 minutes ago
    actions: [
      { key: 'join', label: 'Unirse', primary: true },
      { key: 'snooze', label: 'Posponer', primary: false }
    ],
    tags: ['calendario', 'trabajo'],
    url: '/calendar'
  },
  {
    id: 2,
    type: 'finance',
    title: 'Nuevo gasto registrado',
    message: 'Se registró un gasto de €125.50 en Supermercado',
    priority: 'normal',
    read: false,
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    actions: [
      { key: 'view', label: 'Ver detalles', primary: true }
    ],
    tags: ['finanzas', 'gastos'],
    url: '/finance'
  },
  {
    id: 3,
    type: 'note',
    title: 'Nota compartida contigo',
    message: 'María García compartió "Ideas para el proyecto" contigo',
    priority: 'normal',
    read: false,
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    actions: [
      { key: 'view', label: 'Abrir nota', primary: true },
      { key: 'decline', label: 'Rechazar', primary: false }
    ],
    tags: ['notas', 'colaboración'],
    url: '/notes'
  },
  {
    id: 4,
    type: 'chat',
    title: 'Nuevo mensaje',
    message: 'Tienes 3 mensajes nuevos en el canal #desarrollo',
    priority: 'normal',
    read: true,
    createdAt: new Date(Date.now() - 10800000), // 3 hours ago
    actions: [
      { key: 'view', label: 'Ver chat', primary: true }
    ],
    tags: ['chat', 'equipo'],
    url: '/chats'
  },
  {
    id: 5,
    type: 'system',
    title: 'Actualización disponible',
    message: 'Nueva versión 2.1.0 disponible con mejoras de rendimiento',
    priority: 'low',
    read: true,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    actions: [
      { key: 'update', label: 'Actualizar', primary: true },
      { key: 'later', label: 'Más tarde', primary: false }
    ],
    tags: ['sistema', 'actualización']
  }
])

const filters = computed(() => [
  {
    key: 'all',
    label: 'Todas',
    count: notifications.value.length
  },
  {
    key: 'unread',
    label: 'No leídas',
    count: notifications.value.filter(n => !n.read).length
  },
  {
    key: 'event',
    label: 'Eventos',
    count: notifications.value.filter(n => n.type === 'event').length
  },
  {
    key: 'finance',
    label: 'Finanzas',
    count: notifications.value.filter(n => n.type === 'finance').length
  },
  {
    key: 'note',
    label: 'Notas',
    count: notifications.value.filter(n => n.type === 'note').length
  }
])

const filteredNotifications = computed(() => {
  let filtered = [...notifications.value]

  switch (activeFilter.value) {
    case 'unread':
      filtered = filtered.filter(n => !n.read)
      break
    case 'event':
    case 'finance':
    case 'note':
    case 'chat':
    case 'system':
      filtered = filtered.filter(n => n.type === activeFilter.value)
      break
  }

  // Sort by priority and date
  return filtered.sort((a, b) => {
    // Priority order: high > normal > low
    const priorityOrder = { high: 3, normal: 2, low: 1 }
    const aPriority = priorityOrder[a.priority] || 1
    const bPriority = priorityOrder[b.priority] || 1
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    
    // Then by date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
})

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const hasUnread = computed(() => {
  return unreadCount.value > 0
})

const getNotificationIcon = (type) => {
  const icons = {
    event: CalendarIcon,
    finance: BanknotesIcon,
    note: DocumentTextIcon,
    chat: ChatBubbleLeftIcon,
    system: CogIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
    success: CheckCircleIcon
  }
  return icons[type] || InformationCircleIcon
}

const getNotificationIconClass = (type) => {
  const classes = {
    event: 'bg-blue-100 text-blue-600',
    finance: 'bg-green-100 text-green-600',
    note: 'bg-purple-100 text-purple-600',
    chat: 'bg-orange-100 text-orange-600',
    system: 'bg-gray-100 text-gray-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600'
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

const formatNotificationTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

const togglePanel = () => {
  showPanel.value = !showPanel.value
  activeMenu.value = null
}

const toggleNotificationMenu = (notificationId) => {
  activeMenu.value = activeMenu.value === notificationId ? null : notificationId
}

const handleNotificationClick = (notification) => {
  if (!notification.read) {
    markAsRead(notification)
  }
  
  if (notification.url) {
    router.push(notification.url)
    showPanel.value = false
  }
}

const markAsRead = (notification) => {
  notification.read = true
  activeMenu.value = null
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
  appStore.showToast('Todas las notificaciones marcadas como leídas', 'success')
}

const snoozeNotification = (notification) => {
  selectedNotification.value = notification
  showSnoozeModal.value = true
  activeMenu.value = null
}

const deleteNotification = (notification) => {
  const index = notifications.value.findIndex(n => n.id === notification.id)
  if (index > -1) {
    notifications.value.splice(index, 1)
    appStore.showToast('Notificación eliminada', 'info')
  }
  activeMenu.value = null
}

const executeNotificationAction = (action, notification) => {
  console.log('Executing action:', action.key, notification)
  
  switch (action.key) {
    case 'join':
      appStore.showToast('Uniéndose a la reunión...', 'info')
      break
    case 'view':
      if (notification.url) {
        router.push(notification.url)
        showPanel.value = false
      }
      break
    case 'snooze':
      snoozeNotification(notification)
      break
    case 'update':
      appStore.showToast('Iniciando actualización...', 'info')
      break
    default:
      appStore.showToast(`Acción: ${action.label}`, 'info')
  }
  
  if (!notification.read) {
    markAsRead(notification)
  }
}

const showAllNotifications = () => {
  router.push('/notifications')
  showPanel.value = false
}

const clearAllNotifications = () => {
  const confirmed = confirm('¿Estás seguro de que quieres eliminar todas las notificaciones?')
  if (confirmed) {
    notifications.value = []
    appStore.showToast('Todas las notificaciones eliminadas', 'info')
  }
}

const handleSettingsUpdate = (settings) => {
  console.log('Notification settings updated:', settings)
  appStore.showToast('Configuración de notificaciones actualizada', 'success')
}

const handleNotificationSnoozed = (snoozeData) => {
  console.log('Notification snoozed:', snoozeData)
  appStore.showToast(`Notificación pospuesta por ${snoozeData.duration}`, 'info')
}

// Simulate receiving new notifications
const simulateNotifications = () => {
  setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every interval
      const newNotification = {
        id: Date.now(),
        type: ['event', 'finance', 'note', 'chat'][Math.floor(Math.random() * 4)],
        title: 'Nueva notificación',
        message: 'Esta es una notificación de prueba generada automáticamente',
        priority: 'normal',
        read: false,
        createdAt: new Date(),
        tags: ['simulación']
      }
      
      notifications.value.unshift(newNotification)
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/favicon.ico'
        })
      }
    }
  }, 30000) // Check every 30 seconds
}

// Request notification permission
const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission()
  }
}

onMounted(() => {
  requestNotificationPermission()
  simulateNotifications()
})
</script>

<style scoped>
.notification-filter {
  @apply text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer;
}

.notification-filter.active {
  @apply text-indigo-600 border-b-2 border-indigo-600 pb-1;
}

.notification-item {
  @apply hover:bg-gray-50 cursor-pointer transition-colors;
}

.notification-item.unread {
  @apply bg-blue-50 border-l-4 border-blue-400;
}

.notification-action-btn {
  @apply px-3 py-1 text-xs font-medium rounded transition-colors;
}

.menu-item {
  @apply w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors;
}

.menu-item:disabled {
  @apply text-gray-400 cursor-not-allowed;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>