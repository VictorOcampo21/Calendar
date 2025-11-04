<template>
  <div class="h-full flex">
    <!-- Notes sidebar -->
    <div class="w-80 border-r border-gray-200 flex flex-col bg-white">
      <!-- Notes header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Notas</h2>
          <div class="flex space-x-2">
            <button
              @click="showCreateNote = true"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Nueva nota"
            >
              <PlusIcon class="w-5 h-5" />
            </button>
            <button
              @click="showNotesSettings = true"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Configuración"
            >
              <CogIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="relative mb-4">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar notas..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <!-- Filters -->
        <div class="flex space-x-2">
          <select v-model="filterBy" class="flex-1 text-sm border border-gray-300 rounded px-2 py-1">
            <option value="all">Todas las notas</option>
            <option value="recent">Recientes</option>
            <option value="favorites">Favoritas</option>
            <option value="shared">Compartidas</option>
            <option value="encrypted">Encriptadas</option>
          </select>
          
          <select v-model="sortBy" class="flex-1 text-sm border border-gray-300 rounded px-2 py-1">
            <option value="updated">Modificación</option>
            <option value="created">Creación</option>
            <option value="title">Título</option>
            <option value="size">Tamaño</option>
          </select>
        </div>
      </div>

      <!-- Notes list -->
      <div class="flex-1 overflow-y-auto">
        <div class="space-y-0">
          <div
            v-for="note in filteredNotes"
            :key="note.id"
            class="note-item"
            :class="{ 'active': selectedNote?.id === note.id }"
            @click="selectNote(note)"
          >
            <div class="p-4">
              <!-- Note header -->
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2 flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 truncate">
                    {{ note.title || 'Sin título' }}
                  </h3>
                  
                  <!-- Note badges -->
                  <div class="flex items-center space-x-1 flex-shrink-0">
                    <LockClosedIcon
                      v-if="note.isEncrypted"
                      class="w-3 h-3 text-amber-500"
                      title="Encriptada"
                    />
                    <ShareIcon
                      v-if="note.isShared"
                      class="w-3 h-3 text-blue-500"
                      title="Compartida"
                    />
                    <StarIcon
                      v-if="note.isFavorite"
                      class="w-3 h-3 text-yellow-500 fill-current"
                      title="Favorita"
                    />
                  </div>
                </div>
                
                <button
                  @click.stop="toggleFavorite(note)"
                  class="p-1 text-gray-300 hover:text-yellow-500 transition-colors"
                >
                  <StarIcon
                    class="w-4 h-4"
                    :class="note.isFavorite ? 'text-yellow-500 fill-current' : ''"
                  />
                </button>
              </div>

              <!-- Note preview -->
              <p class="text-sm text-gray-600 line-clamp-3 mb-3">
                {{ getTextPreview(note.content) }}
              </p>

              <!-- Note metadata -->
              <div class="flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center space-x-2">
                  <span>{{ formatDate(note.updatedAt) }}</span>
                  <span v-if="note.tags.length > 0" class="flex items-center space-x-1">
                    <TagIcon class="w-3 h-3" />
                    <span>{{ note.tags.length }}</span>
                  </span>
                </div>
                
                <div class="flex items-center space-x-1">
                  <span>{{ getWordCount(note.content) }} palabras</span>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="note.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="tag in note.tags.slice(0, 3)"
                  :key="tag"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {{ tag }}
                </span>
                <span
                  v-if="note.tags.length > 3"
                  class="text-xs text-gray-500"
                >
                  +{{ note.tags.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredNotes.length === 0" class="p-8 text-center">
          <DocumentTextIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 class="text-sm font-medium text-gray-900 mb-2">
            {{ searchQuery ? 'No se encontraron notas' : 'No hay notas' }}
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            {{ searchQuery ? 'Intenta con otro término de búsqueda' : 'Crea tu primera nota para comenzar' }}
          </p>
          <button
            v-if="!searchQuery"
            @click="showCreateNote = true"
            class="btn-primary-sm"
          >
            Crear nota
          </button>
        </div>
      </div>
    </div>

    <!-- Main editor area -->
    <div class="flex-1 flex flex-col">
      <!-- No note selected -->
      <div v-if="!selectedNote" class="flex-1 flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <DocumentTextIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Selecciona una nota
          </h3>
          <p class="text-gray-500 mb-4">
            Elige una nota del panel izquierdo para editarla
          </p>
          <button
            @click="showCreateNote = true"
            class="btn-primary"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Crear nueva nota
          </button>
        </div>
      </div>

      <!-- Note editor -->
      <NoteEditor
        v-else
        :note="selectedNote"
        @save="handleNoteSave"
        @delete="handleNoteDelete"
        @share="handleNoteShare"
        @encrypt="handleNoteEncrypt"
      />
    </div>

    <!-- Modals -->
    <CreateNoteModal
      :is-open="showCreateNote"
      @close="showCreateNote = false"
      @created="handleNoteCreated"
    />

    <NotesSettingsModal
      :is-open="showNotesSettings"
      @close="showNotesSettings = false"
      @settings-updated="handleSettingsUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { mockNotes } from '@/mock-data'
import {
  PlusIcon,
  CogIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  StarIcon,
  LockClosedIcon,
  ShareIcon,
  TagIcon
} from '@heroicons/vue/24/outline'

// Components
import NoteEditor from '@/components/notes/NoteEditor.vue'
import CreateNoteModal from '@/components/notes/CreateNoteModal.vue'
import NotesSettingsModal from '@/components/notes/NotesSettingsModal.vue'

const authStore = useAuthStore()
const appStore = useAppStore()

const searchQuery = ref('')
const filterBy = ref('all')
const sortBy = ref('updated')
const selectedNote = ref(null)
const showCreateNote = ref(false)
const showNotesSettings = ref(false)

const notes = ref([])

const filteredNotes = computed(() => {
  let filtered = notes.value

  // Filter by workspace
  filtered = filtered.filter(note => 
    note.workspaceId === authStore.currentWorkspace?.id
  )

  // Apply filters
  switch (filterBy.value) {
    case 'recent':
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      filtered = filtered.filter(note => new Date(note.updatedAt) > sevenDaysAgo)
      break
    case 'favorites':
      filtered = filtered.filter(note => note.isFavorite)
      break
    case 'shared':
      filtered = filtered.filter(note => note.isShared)
      break
    case 'encrypted':
      filtered = filtered.filter(note => note.isEncrypted)
      break
  }

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'updated':
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'size':
        return b.content.length - a.content.length
      default:
        return 0
    }
  })

  return filtered
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Ahora'
  if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Hace ${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays < 7) return `Hace ${diffInDays}d`
  
  return date.toLocaleDateString('es-ES', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const getTextPreview = (content) => {
  // Remove HTML tags and get plain text
  const div = document.createElement('div')
  div.innerHTML = content
  return div.textContent || div.innerText || ''
}

const getWordCount = (content) => {
  const text = getTextPreview(content)
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

const selectNote = (note) => {
  selectedNote.value = note
}

const toggleFavorite = (note) => {
  note.isFavorite = !note.isFavorite
  appStore.showToast(
    note.isFavorite ? 'Nota agregada a favoritos' : 'Nota removida de favoritos',
    'success'
  )
}

const handleNoteCreated = (noteData) => {
  const newNote = {
    id: Date.now(),
    title: noteData.title || 'Sin título',
    content: noteData.content || '',
    tags: noteData.tags || [],
    category: noteData.category || 'general',
    isEncrypted: noteData.isEncrypted || false,
    isShared: false,
    isFavorite: false,
    workspaceId: authStore.currentWorkspace?.id,
    authorId: authStore.user?.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    collaborators: []
  }
  
  notes.value.unshift(newNote)
  selectedNote.value = newNote
  showCreateNote.value = false
  appStore.showToast('Nota creada exitosamente', 'success')
}

const handleNoteSave = (noteData) => {
  if (selectedNote.value) {
    Object.assign(selectedNote.value, {
      ...noteData,
      updatedAt: new Date().toISOString(),
      version: selectedNote.value.version + 1
    })
    
    appStore.showToast('Nota guardada', 'success')
  }
}

const handleNoteDelete = (noteId) => {
  const index = notes.value.findIndex(note => note.id === noteId)
  if (index !== -1) {
    notes.value.splice(index, 1)
    if (selectedNote.value?.id === noteId) {
      selectedNote.value = null
    }
    appStore.showToast('Nota eliminada', 'info')
  }
}

const handleNoteShare = (noteData) => {
  if (selectedNote.value) {
    selectedNote.value.isShared = true
    selectedNote.value.collaborators = noteData.collaborators || []
    appStore.showToast('Nota compartida exitosamente', 'success')
  }
}

const handleNoteEncrypt = (isEncrypted) => {
  if (selectedNote.value) {
    selectedNote.value.isEncrypted = isEncrypted
    appStore.showToast(
      isEncrypted ? 'Nota encriptada' : 'Encriptación removida',
      'success'
    )
  }
}

const handleSettingsUpdated = (settings) => {
  console.log('Notes settings updated:', settings)
  appStore.showToast('Configuración actualizada', 'success')
}

onMounted(() => {
  // Load notes from mock data
  notes.value = [...mockNotes]
})
</script>

<style scoped>
.note-item {
  @apply cursor-pointer transition-colors border-b border-gray-100 hover:bg-gray-50;
}

.note-item.active {
  @apply bg-indigo-50 border-indigo-200;
}

.note-item:last-child {
  @apply border-b-0;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>