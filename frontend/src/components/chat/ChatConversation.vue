<template>
  <div class="flex flex-col h-full">
    <!-- Chat header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div class="flex items-center space-x-3">
        <!-- Chat avatar/icon -->
        <div v-if="chat.type === 'channel'" class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
          <HashtagIcon class="w-4 h-4 text-indigo-600" />
        </div>
        <div v-else class="relative">
          <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <UserIcon class="w-4 h-4 text-gray-600" />
          </div>
          <div
            v-if="chat.isOnline"
            class="absolute -bottom-0 -right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"
          ></div>
        </div>

        <!-- Chat info -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ chat.name }}</h2>
          <p class="text-sm text-gray-500">
            <span v-if="chat.type === 'channel'">
              {{ chat.members?.length || 0 }} miembros
            </span>
            <span v-else>
              {{ chat.isOnline ? 'En línea' : 'Desconectado' }}
            </span>
          </p>
        </div>
      </div>

      <!-- Chat actions -->
      <div class="flex items-center space-x-2">
        <button
          @click="toggleMute"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          :title="chat.isMuted ? 'Activar notificaciones' : 'Silenciar'"
        >
          <SpeakerWaveIcon v-if="!chat.isMuted" class="w-5 h-5" />
          <SpeakerXMarkIcon v-else class="w-5 h-5" />
        </button>

        <button
          @click="showChatInfo = true"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          title="Información del chat"
        >
          <InformationCircleIcon class="w-5 h-5" />
        </button>

        <div class="relative">
          <button
            @click="showOptionsMenu = !showOptionsMenu"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <EllipsisVerticalIcon class="w-5 h-5" />
          </button>

          <!-- Options menu -->
          <div
            v-if="showOptionsMenu"
            class="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
            @click="showOptionsMenu = false"
          >
            <button
              v-if="chat.type === 'channel'"
              @click="inviteMembers"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <UserPlusIcon class="w-4 h-4" />
              <span>Invitar miembros</span>
            </button>
            
            <button
              @click="searchInChat"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <MagnifyingGlassIcon class="w-4 h-4" />
              <span>Buscar en el chat</span>
            </button>
            
            <button
              @click="exportChat"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <DocumentArrowDownIcon class="w-4 h-4" />
              <span>Exportar conversación</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages area -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
    >
      <!-- Date separator -->
      <div
        v-for="(group, date) in groupedMessages"
        :key="date"
        class="space-y-4"
      >
        <!-- Date header -->
        <div class="flex items-center justify-center">
          <div class="bg-white px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-500">
            {{ formatDate(date) }}
          </div>
        </div>

        <!-- Messages for this date -->
        <div
          v-for="message in group"
          :key="message.id"
          class="flex items-start space-x-3"
          :class="{ 'flex-row-reverse space-x-reverse': message.sender === authStore.user?.name }"
        >
          <!-- Avatar -->
          <div
            v-if="message.sender !== authStore.user?.name"
            class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <span class="text-sm font-medium text-gray-600">
              {{ getInitials(message.sender) }}
            </span>
          </div>

          <!-- Message bubble -->
          <div
            class="max-w-xs lg:max-w-md"
            :class="message.sender === authStore.user?.name ? 'ml-auto' : ''"
          >
            <!-- Sender name (for other users) -->
            <div
              v-if="message.sender !== authStore.user?.name && chat.type === 'channel'"
              class="text-xs text-gray-500 mb-1"
            >
              {{ message.sender }}
            </div>

            <!-- Message content -->
            <div
              class="message-bubble group"
              :class="message.sender === authStore.user?.name 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-900'"
            >
              <!-- Text message -->
              <div v-if="message.type === 'text'" class="break-words">
                {{ message.content }}
              </div>

              <!-- Image message -->
              <div v-else-if="message.type === 'image'" class="space-y-2">
                <img
                  :src="message.content"
                  :alt="message.alt || 'Imagen'"
                  class="rounded-lg max-w-full h-auto"
                  @click="showImageModal(message.content)"
                />
                <p v-if="message.caption" class="text-sm">{{ message.caption }}</p>
              </div>

              <!-- File message -->
              <div v-else-if="message.type === 'file'" class="flex items-center space-x-2">
                <DocumentIcon class="w-5 h-5" />
                <div>
                  <p class="font-medium">{{ message.fileName }}</p>
                  <p class="text-xs opacity-75">{{ message.fileSize }}</p>
                </div>
              </div>

              <!-- System message -->
              <div v-else-if="message.type === 'system'" class="text-center italic">
                {{ message.content }}
              </div>
            </div>

            <!-- Message metadata -->
            <div class="flex items-center justify-between mt-1">
              <div class="flex items-center space-x-2">
                <!-- Timestamp -->
                <span class="text-xs text-gray-500">
                  {{ formatMessageTime(message.timestamp) }}
                </span>

                <!-- Read status (for own messages) -->
                <div
                  v-if="message.sender === authStore.user?.name"
                  class="flex items-center space-x-1"
                >
                  <CheckIcon v-if="message.status === 'sent'" class="w-3 h-3 text-gray-400" />
                  <div v-else-if="message.status === 'delivered'" class="flex">
                    <CheckIcon class="w-3 h-3 text-gray-400" />
                    <CheckIcon class="w-3 h-3 text-gray-400 -ml-1" />
                  </div>
                  <div v-else-if="message.status === 'read'" class="flex">
                    <CheckIcon class="w-3 h-3 text-indigo-500" />
                    <CheckIcon class="w-3 h-3 text-indigo-500 -ml-1" />
                  </div>
                </div>
              </div>

              <!-- Message actions -->
              <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="addReaction(message.id, '👍')"
                  class="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <HandThumbUpIcon class="w-3 h-3" />
                </button>
                
                <button
                  @click="handleReplyToMessage(message)"
                  class="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <ArrowUturnLeftIcon class="w-3 h-3" />
                </button>
                
                <button
                  @click="showMessageOptions(message)"
                  class="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <EllipsisHorizontalIcon class="w-3 h-3" />
                </button>
              </div>
            </div>

            <!-- Reactions -->
            <div v-if="message.reactions && message.reactions.length > 0" class="flex flex-wrap gap-1 mt-2">
              <button
                v-for="reaction in message.reactions"
                :key="reaction.emoji"
                @click="toggleReaction(message.id, reaction.emoji)"
                class="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200 transition-colors"
                :class="{ 'bg-indigo-100 text-indigo-700': reaction.users.includes(authStore.user?.name) }"
              >
                <span>{{ reaction.emoji }}</span>
                <span>{{ reaction.count }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="typingUsers.length > 0" class="flex items-center space-x-2 text-sm text-gray-500">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
        <span>
          {{ typingUsers.join(', ') }}
          {{ typingUsers.length === 1 ? 'está escribiendo...' : 'están escribiendo...' }}
        </span>
      </div>
    </div>

    <!-- Message input -->
    <div class="border-t border-gray-200 bg-white p-4">
      <!-- Reply context -->
      <div v-if="replyToMessage" class="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-gray-900">
            Respondiendo a {{ replyToMessage.sender }}
          </span>
          <button
            @click="cancelReply"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
        <p class="text-sm text-gray-600 truncate">{{ replyToMessage.content }}</p>
      </div>

      <!-- Input area -->
      <div class="flex items-end space-x-3">
        <!-- Attachment button -->
        <button
          @click="showAttachmentOptions = !showAttachmentOptions"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 flex-shrink-0"
        >
          <PaperClipIcon class="w-5 h-5" />
        </button>

        <!-- Message input -->
        <div class="flex-1 relative">
          <textarea
            ref="messageInput"
            v-model="messageText"
            placeholder="Escribe un mensaje..."
            rows="1"
            class="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            @keydown="handleKeyDown"
            @input="handleTyping"
          ></textarea>

          <!-- Emoji picker button -->
          <button
            @click="showEmojiPicker = !showEmojiPicker"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <FaceSmileIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Send button -->
        <button
          @click="sendMessage"
          :disabled="!messageText.trim()"
          class="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Attachment options -->
      <div
        v-if="showAttachmentOptions"
        class="absolute bottom-20 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10"
      >
        <button
          @click="attachFile('image')"
          class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
        >
          <PhotoIcon class="w-4 h-4" />
          <span>Imagen</span>
        </button>
        
        <button
          @click="attachFile('file')"
          class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
        >
          <DocumentIcon class="w-4 h-4" />
          <span>Archivo</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import {
  HashtagIcon,
  UserIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  InformationCircleIcon,
  EllipsisVerticalIcon,
  EllipsisHorizontalIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  CheckIcon,
  HandThumbUpIcon,
  ArrowUturnLeftIcon,
  XMarkIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  chat: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['send-message', 'message-action'])

const authStore = useAuthStore()
const appStore = useAppStore()

const messagesContainer = ref(null)
const messageInput = ref(null)
const messageText = ref('')
const showOptionsMenu = ref(false)
const showChatInfo = ref(false)
const showAttachmentOptions = ref(false)
const showEmojiPicker = ref(false)
const replyToMessage = ref(null)
const typingUsers = ref([])

// Group messages by date
const groupedMessages = computed(() => {
  const groups = {}
  
  props.chat.messages?.forEach(message => {
    const date = new Date(message.timestamp).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
  })
  
  return groups
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hoy'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer'
  } else {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = () => {
  if (!messageText.value.trim()) return
  
  const messageData = {
    content: messageText.value.trim(),
    type: 'text',
    replyTo: replyToMessage.value?.id || null
  }
  
  emit('send-message', messageData)
  
  messageText.value = ''
  replyToMessage.value = null
  showAttachmentOptions.value = false
  
  scrollToBottom()
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const handleTyping = () => {
  // Simulate typing indicator
  // In a real app, this would send typing events to other users
}

const toggleMute = () => {
  props.chat.isMuted = !props.chat.isMuted
  appStore.showToast(
    props.chat.isMuted ? 'Chat silenciado' : 'Notificaciones activadas',
    'info'
  )
}

const addReaction = (messageId, emoji) => {
  const message = props.chat.messages.find(m => m.id === messageId)
  if (!message) return
  
  if (!message.reactions) message.reactions = []
  
  let reaction = message.reactions.find(r => r.emoji === emoji)
  if (!reaction) {
    reaction = { emoji, count: 0, users: [] }
    message.reactions.push(reaction)
  }
  
  const userIndex = reaction.users.indexOf(authStore.user?.name)
  if (userIndex === -1) {
    reaction.users.push(authStore.user?.name)
    reaction.count++
  } else {
    reaction.users.splice(userIndex, 1)
    reaction.count--
    if (reaction.count === 0) {
      message.reactions = message.reactions.filter(r => r !== reaction)
    }
  }
}

const toggleReaction = (messageId, emoji) => {
  addReaction(messageId, emoji)
}

const handleReplyToMessage = (message) => {
  replyToMessage.value = message
  nextTick(() => {
    messageInput.value?.focus()
  })
}

const cancelReply = () => {
  replyToMessage.value = null
}

const attachFile = (type) => {
  // In a real app, this would open file picker
  console.log('Attach file:', type)
  showAttachmentOptions.value = false
  appStore.showToast('Función de adjuntos en desarrollo', 'info')
}

const inviteMembers = () => {
  console.log('Invite members')
  appStore.showToast('Función de invitar miembros en desarrollo', 'info')
}

const searchInChat = () => {
  console.log('Search in chat')
  appStore.showToast('Función de búsqueda en desarrollo', 'info')
}

const exportChat = () => {
  console.log('Export chat')
  appStore.showToast('Función de exportar en desarrollo', 'info')
}

const showImageModal = (imageSrc) => {
  console.log('Show image:', imageSrc)
  appStore.showToast('Modal de imagen en desarrollo', 'info')
}

const showMessageOptions = (message) => {
  console.log('Message options:', message)
  appStore.showToast('Opciones de mensaje en desarrollo', 'info')
}

// Watch for new messages to scroll to bottom
watch(() => props.chat.messages?.length, () => {
  scrollToBottom()
})

// Scroll to bottom when chat changes
watch(() => props.chat.id, () => {
  scrollToBottom()
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.message-bubble {
  @apply px-4 py-2 rounded-2xl shadow-sm;
}

.message-bubble:hover .group-hover\:opacity-100 {
  @apply opacity-100;
}
</style>