<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="close"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            Nueva Conversación
          </h2>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <!-- Search users -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Buscar usuario
          </label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Escribir nombre o email..."
              class="input-field pl-10"
            />
          </div>
        </div>

        <!-- User list -->
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            @click="selectUser(user)"
          >
            <!-- Avatar -->
            <div class="relative flex-shrink-0">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">
                  {{ getInitials(user.name) }}
                </span>
              </div>
              
              <!-- Online status -->
              <div
                v-if="user.isOnline"
                class="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
              ></div>
            </div>

            <!-- User info -->
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900">
                {{ user.name }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ user.email }}
              </p>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-xs text-gray-400">
                  {{ user.role }}
                </span>
                <span
                  v-if="user.isOnline"
                  class="text-xs text-green-600"
                >
                  En línea
                </span>
                <span
                  v-else
                  class="text-xs text-gray-400"
                >
                  {{ formatLastSeen(user.lastSeen) }}
                </span>
              </div>
            </div>

            <!-- Action indicator -->
            <div class="flex-shrink-0">
              <ChevronRightIcon class="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <!-- No users found -->
          <div v-if="filteredUsers.length === 0" class="text-center py-8">
            <UserGroupIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 class="text-sm font-medium text-gray-900 mb-2">
              {{ searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios disponibles' }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ searchQuery ? 'Intenta con otro término de búsqueda' : 'Todos los miembros ya tienen conversaciones abiertas' }}
            </p>
          </div>
        </div>

        <!-- Recent conversations -->
        <div v-if="!searchQuery && recentConversations.length > 0" class="mt-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">
            Conversaciones recientes
          </h3>
          <div class="space-y-2">
            <div
              v-for="conv in recentConversations"
              :key="conv.id"
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              @click="openConversation(conv)"
            >
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-gray-600">
                  {{ getInitials(conv.name) }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ conv.name }}</p>
                <p class="text-xs text-gray-500 truncate">{{ conv.lastMessage }}</p>
              </div>
              <span class="text-xs text-gray-400">{{ formatTime(conv.lastMessageTime) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200">
        <p class="text-xs text-gray-500 text-center">
          Las conversaciones directas son privadas entre tú y el otro usuario
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { mockUsers, mockChats } from '@/mock-data'
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'started'])

const authStore = useAuthStore()
const searchQuery = ref('')

const availableUsers = computed(() => {
  return mockUsers.filter(user => 
    user.workspaceId === authStore.currentWorkspace?.id &&
    user.id !== authStore.user?.id
  )
})

const filteredUsers = computed(() => {
  if (!searchQuery.value) return availableUsers.value
  
  const query = searchQuery.value.toLowerCase()
  return availableUsers.value.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

const recentConversations = computed(() => {
  return mockChats
    .filter(chat => 
      chat.type === 'direct' && 
      chat.workspaceId === authStore.currentWorkspace?.id &&
      chat.lastMessage
    )
    .slice(0, 3)
})

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return 'Hace mucho tiempo'
  
  const date = new Date(lastSeen)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Ahora'
  if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Hace ${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `Hace ${diffInDays}d`
  
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  } else {
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

const selectUser = (user) => {
  const dmData = {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    isOnline: user.isOnline
  }
  
  emit('started', dmData)
  close()
}

const openConversation = (conversation) => {
  // This would select the existing conversation
  console.log('Open existing conversation:', conversation)
  close()
}

const close = () => {
  emit('close')
  searchQuery.value = ''
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    searchQuery.value = ''
  }
})
</script>