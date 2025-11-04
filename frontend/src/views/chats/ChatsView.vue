<template>
  <div class="h-full flex">
    <!-- Sidebar with chat list -->
    <div class="w-80 border-r border-gray-200 flex flex-col bg-white">
      <!-- Chat header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Chats</h2>
          <div class="flex space-x-2">
            <button
              @click="showCreateChannel = true"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Crear canal"
            >
              <PlusIcon class="w-5 h-5" />
            </button>
            <button
              @click="showChatSettings = true"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Configuración"
            >
              <CogIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar chats..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <!-- Chat type tabs -->
      <div class="flex border-b border-gray-200">
        <button
          v-for="tab in chatTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
          :class="activeTab === tab.id 
            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
            : 'text-gray-600 hover:text-gray-900'"
        >
          <div class="flex items-center justify-center space-x-2">
            <component :is="tab.icon" class="w-4 h-4" />
            <span>{{ tab.label }}</span>
            <span 
              v-if="tab.unreadCount > 0"
              class="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center"
            >
              {{ tab.unreadCount }}
            </span>
          </div>
        </button>
      </div>

      <!-- Chat list -->
      <div class="flex-1 overflow-y-auto">
        <div class="space-y-0">
          <div
            v-for="chat in filteredChats"
            :key="chat.id"
            class="chat-item"
            :class="{ 'active': selectedChat?.id === chat.id }"
            @click="selectChat(chat)"
          >
            <div class="flex items-center space-x-3 p-4">
              <!-- Avatar/Icon -->
              <div class="relative flex-shrink-0">
                <div
                  v-if="chat.type === 'channel'"
                  class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                >
                  <span class="text-indigo-600 font-medium text-sm">#</span>
                </div>
                <div
                  v-else
                  class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <UserIcon class="w-5 h-5 text-gray-600" />
                </div>
                
                <!-- Online status -->
                <div
                  v-if="chat.type === 'direct' && chat.isOnline"
                  class="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                ></div>
              </div>

              <!-- Chat info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-sm font-medium text-gray-900 truncate">
                    {{ chat.name }}
                  </h3>
                  <span class="text-xs text-gray-500">
                    {{ formatMessageTime(chat.lastMessage?.timestamp) }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-600 truncate">
                    <span v-if="chat.lastMessage?.sender !== authStore.user?.name" class="font-medium">
                      {{ chat.lastMessage?.sender }}:
                    </span>
                    {{ chat.lastMessage?.content || 'No hay mensajes' }}
                  </p>
                  
                  <div class="flex items-center space-x-1">
                    <!-- Unread count -->
                    <span
                      v-if="chat.unreadCount > 0"
                      class="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center"
                    >
                      {{ chat.unreadCount }}
                    </span>
                    
                    <!-- Muted indicator -->
                    <SpeakerXMarkIcon
                      v-if="chat.isMuted"
                      class="w-4 h-4 text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredChats.length === 0" class="p-8 text-center">
          <ChatBubbleLeftIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 class="text-sm font-medium text-gray-900 mb-2">No hay chats</h3>
          <p class="text-sm text-gray-500 mb-4">
            {{ activeTab === 'channels' ? 'Crea un canal' : 'Inicia una conversación' }}
          </p>
          <button
            @click="activeTab === 'channels' ? showCreateChannel = true : showStartDM = true"
            class="btn-primary-sm"
          >
            {{ activeTab === 'channels' ? 'Crear canal' : 'Nueva conversación' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main chat area -->
    <div class="flex-1 flex flex-col">
      <!-- No chat selected -->
      <div v-if="!selectedChat" class="flex-1 flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <ChatBubbleLeftIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Selecciona un chat
          </h3>
          <p class="text-gray-500">
            Elige una conversación del panel izquierdo para comenzar
          </p>
        </div>
      </div>

      <!-- Chat conversation -->
      <ChatConversation
        v-else
        :chat="selectedChat"
        @send-message="handleSendMessage"
        @message-action="handleMessageAction"
      />
    </div>

    <!-- Modals -->
    <CreateChannelModal
      :is-open="showCreateChannel"
      @close="showCreateChannel = false"
      @created="handleChannelCreated"
    />

    <StartDirectMessageModal
      :is-open="showStartDM"
      @close="showStartDM = false"
      @started="handleDMStarted"
    />

    <ChatSettingsModal
      :is-open="showChatSettings"
      @close="showChatSettings = false"
      @settings-updated="handleSettingsUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { mockChats } from '@/mock-data'
import {
  PlusIcon,
  CogIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  SpeakerXMarkIcon,
  HashtagIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

// Components
import ChatConversation from '@/components/chat/ChatConversation.vue'
import CreateChannelModal from '@/components/chat/CreateChannelModal.vue'
import StartDirectMessageModal from '@/components/chat/StartDirectMessageModal.vue'
import ChatSettingsModal from '@/components/chat/ChatSettingsModal.vue'

const authStore = useAuthStore()
const appStore = useAppStore()

const searchQuery = ref('')
const activeTab = ref('all')
const selectedChat = ref(null)
const showCreateChannel = ref(false)
const showStartDM = ref(false)
const showChatSettings = ref(false)

const chatTabs = ref([
  {
    id: 'all',
    label: 'Todos',
    icon: ChatBubbleLeftIcon,
    unreadCount: 0
  },
  {
    id: 'channels',
    label: 'Canales',
    icon: HashtagIcon,
    unreadCount: 0
  },
  {
    id: 'direct',
    label: 'Directos',
    icon: UserGroupIcon,
    unreadCount: 0
  }
])

const chats = ref([])

const filteredChats = computed(() => {
  let filtered = chats.value

  // Filter by workspace
  filtered = filtered.filter(chat => 
    chat.workspaceId === authStore.currentWorkspace?.id
  )

  // Filter by tab
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(chat => chat.type === activeTab.value.slice(0, -1))
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(chat =>
      chat.name.toLowerCase().includes(query) ||
      chat.lastMessage?.content.toLowerCase().includes(query)
    )
  }

  return filtered.sort((a, b) => {
    // Sort by last message timestamp, most recent first
    const aTime = a.lastMessage?.timestamp || 0
    const bTime = b.lastMessage?.timestamp || 0
    return new Date(bTime) - new Date(aTime)
  })
})

const formatMessageTime = (timestamp) => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Ahora'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d`
  
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

const selectChat = (chat) => {
  selectedChat.value = chat
  
  // Mark messages as read
  if (chat.unreadCount > 0) {
    chat.unreadCount = 0
    updateUnreadCounts()
  }
}

const updateUnreadCounts = () => {
  const allUnread = chats.value.reduce((sum, chat) => sum + chat.unreadCount, 0)
  const channelUnread = chats.value.filter(c => c.type === 'channel').reduce((sum, chat) => sum + chat.unreadCount, 0)
  const directUnread = chats.value.filter(c => c.type === 'direct').reduce((sum, chat) => sum + chat.unreadCount, 0)
  
  chatTabs.value[0].unreadCount = allUnread
  chatTabs.value[1].unreadCount = channelUnread
  chatTabs.value[2].unreadCount = directUnread
}

const handleSendMessage = (messageData) => {
  // In a real app, this would send the message to the server
  console.log('Sending message:', messageData)
  
  // Add message to selected chat
  if (selectedChat.value) {
    const message = {
      id: Date.now(),
      content: messageData.content,
      sender: authStore.user?.name,
      timestamp: new Date().toISOString(),
      type: messageData.type || 'text',
      attachments: messageData.attachments || [],
      reactions: []
    }
    
    selectedChat.value.messages.push(message)
    selectedChat.value.lastMessage = {
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp
    }
  }
  
  appStore.showToast('Mensaje enviado', 'success')
}

const handleMessageAction = (action, messageId, data) => {
  console.log('Message action:', action, messageId, data)
  
  switch (action) {
    case 'react':
      // Add/remove reaction
      break
    case 'reply':
      // Set reply context
      break
    case 'edit':
      // Edit message
      break
    case 'delete':
      // Delete message
      break
  }
}

const handleChannelCreated = (channelData) => {
  console.log('Channel created:', channelData)
  
  const newChannel = {
    id: Date.now(),
    type: 'channel',
    name: channelData.name,
    description: channelData.description,
    workspaceId: authStore.currentWorkspace?.id,
    members: channelData.members,
    isPrivate: channelData.isPrivate,
    unreadCount: 0,
    isMuted: false,
    messages: [],
    lastMessage: null
  }
  
  chats.value.unshift(newChannel)
  selectedChat.value = newChannel
  appStore.showToast(`Canal "${channelData.name}" creado`, 'success')
}

const handleDMStarted = (dmData) => {
  console.log('DM started:', dmData)
  
  // Check if DM already exists
  const existingDM = chats.value.find(chat =>
    chat.type === 'direct' && 
    chat.members.includes(dmData.userId) &&
    chat.members.includes(authStore.user?.id)
  )
  
  if (existingDM) {
    selectedChat.value = existingDM
    return
  }
  
  const newDM = {
    id: Date.now(),
    type: 'direct',
    name: dmData.userName,
    workspaceId: authStore.currentWorkspace?.id,
    members: [authStore.user?.id, dmData.userId],
    isOnline: dmData.isOnline,
    unreadCount: 0,
    isMuted: false,
    messages: [],
    lastMessage: null
  }
  
  chats.value.unshift(newDM)
  selectedChat.value = newDM
  appStore.showToast(`Conversación iniciada con ${dmData.userName}`, 'success')
}

const handleSettingsUpdated = (settings) => {
  console.log('Chat settings updated:', settings)
  appStore.showToast('Configuración actualizada', 'success')
}

// Simulate receiving new messages
const simulateIncomingMessages = () => {
  setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every interval
      const randomChat = chats.value[Math.floor(Math.random() * chats.value.length)]
      if (randomChat && randomChat.id !== selectedChat.value?.id) {
        const message = {
          id: Date.now(),
          content: 'Mensaje simulado de ejemplo',
          sender: 'Usuario Demo',
          timestamp: new Date().toISOString(),
          type: 'text',
          reactions: []
        }
        
        randomChat.messages.push(message)
        randomChat.lastMessage = {
          content: message.content,
          sender: message.sender,
          timestamp: message.timestamp
        }
        randomChat.unreadCount++
        
        updateUnreadCounts()
      }
    }
  }, 10000) // Every 10 seconds
}

onMounted(() => {
  // Load chats from mock data
  chats.value = [...mockChats]
  updateUnreadCounts()
  
  // Start message simulation
  simulateIncomingMessages()
})
</script>

<style scoped>
.chat-item {
  @apply cursor-pointer transition-colors border-b border-gray-100 hover:bg-gray-50;
}

.chat-item.active {
  @apply bg-indigo-50 border-indigo-200;
}

.chat-item:last-child {
  @apply border-b-0;
}
</style>