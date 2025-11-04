<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Notas Recientes</h3>
      <router-link 
        to="/notes" 
        class="text-sm text-primary-600 hover:text-primary-700"
      >
        Ver todas
      </router-link>
    </div>

    <div v-if="recentNotes.length === 0" class="text-center py-8">
      <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p class="text-gray-500">No hay notas recientes</p>
      <button
        @click="createNote"
        class="mt-3 text-sm text-primary-600 hover:text-primary-700"
      >
        Crear primera nota
      </button>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="note in recentNotes.slice(0, 4)"
        :key="note.id"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-all"
        @click="openNote(note)"
      >
        <!-- Note header -->
        <div class="flex items-start justify-between mb-2">
          <h4 class="text-sm font-semibold text-gray-900 truncate flex-1 mr-2">
            {{ note.title }}
          </h4>
          <div class="flex items-center space-x-1 flex-shrink-0">
            <!-- Encrypted indicator -->
            <LockClosedIcon 
              v-if="note.isEncrypted" 
              class="w-4 h-4 text-yellow-500" 
              title="Nota encriptada"
            />
            <!-- Shared indicator -->
            <ShareIcon 
              v-if="note.isShared" 
              class="w-4 h-4 text-blue-500" 
              title="Nota compartida"
            />
          </div>
        </div>

        <!-- Note preview -->
        <p class="text-xs text-gray-600 mb-3 line-clamp-2">
          {{ getPreviewText(note) }}
        </p>

        <!-- Note metadata -->
        <div class="flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center space-x-3">
            <span>{{ appStore.formatDate(note.updatedAt) }}</span>
            <div v-if="note.tags?.length" class="flex items-center space-x-1">
              <TagIcon class="w-3 h-3" />
              <span>{{ note.tags.slice(0, 2).join(', ') }}</span>
              <span v-if="note.tags.length > 2">+{{ note.tags.length - 2 }}</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <span v-if="note.attachments?.length" class="flex items-center">
              <PaperClipIcon class="w-3 h-3 mr-1" />
              {{ note.attachments.length }}
            </span>
            <div 
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: getCategoryColor(note.categoryId) }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick create note -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <button
        @click="showQuickCreate = !showQuickCreate"
        class="w-full text-left text-sm text-gray-500 hover:text-gray-700 flex items-center"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Crear nota rápida
      </button>
      
      <div v-if="showQuickCreate" class="mt-3 space-y-2">
        <input
          v-model="quickNoteTitle"
          type="text"
          placeholder="Título de la nota..."
          class="w-full text-sm border border-gray-300 rounded-md px-3 py-2"
          @keydown.esc="cancelQuickCreate"
        />
        <textarea
          v-model="quickNoteContent"
          rows="3"
          placeholder="Contenido de la nota..."
          class="w-full text-sm border border-gray-300 rounded-md px-3 py-2"
          @keydown.esc="cancelQuickCreate"
        />
        <div class="flex space-x-2">
          <button
            @click="createQuickNote"
            :disabled="!quickNoteTitle.trim()"
            class="text-xs bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            Crear
          </button>
          <button
            @click="cancelQuickCreate"
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
import { useAuthStore } from '@/stores/auth'
import { mockNotes, noteCategories } from '@/mock-data'
import { 
  DocumentTextIcon, 
  LockClosedIcon, 
  ShareIcon, 
  TagIcon, 
  PaperClipIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const showQuickCreate = ref(false)
const quickNoteTitle = ref('')
const quickNoteContent = ref('')

const recentNotes = computed(() => {
  return mockNotes
    .filter(note => note.workspaceId === authStore.currentWorkspace?.id)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
})

const getPreviewText = (note) => {
  if (note.isEncrypted && appStore.privacyMode) {
    return '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
  }
  
  // Remove markdown formatting for preview
  let preview = note.content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/`(.*?)`/g, '$1') // Remove code
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim()
  
  return preview.length > 100 ? preview.substring(0, 100) + '...' : preview
}

const getCategoryColor = (categoryId) => {
  const category = noteCategories.find(cat => cat.id === categoryId)
  return category?.color || '#6B7280'
}

const openNote = (note) => {
  router.push(`/notes?note=${note.id}`)
}

const createNote = () => {
  router.push('/notes?action=create')
}

const createQuickNote = () => {
  if (!quickNoteTitle.value.trim()) return
  
  appStore.addToast({
    type: 'success',
    title: 'Nota creada',
    message: `"${quickNoteTitle.value}" se agregó a tus notas`
  })
  
  cancelQuickCreate()
}

const cancelQuickCreate = () => {
  showQuickCreate.value = false
  quickNoteTitle.value = ''
  quickNoteContent.value = ''
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>