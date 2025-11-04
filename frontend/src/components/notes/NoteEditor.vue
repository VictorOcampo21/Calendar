<template>
  <div class="flex-1 flex flex-col bg-white">
    <!-- Editor toolbar -->
    <div class="border-b border-gray-200 p-4">
      <!-- Note title -->
      <div class="flex items-center space-x-4 mb-4">
        <input
          v-model="localNote.title"
          type="text"
          placeholder="Título de la nota..."
          class="flex-1 text-xl font-semibold text-gray-900 border-none outline-none resize-none bg-transparent"
          @input="debouncedSave"
        />
        
        <!-- Actions -->
        <div class="flex items-center space-x-2">
          <!-- Save status -->
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <div v-if="isSaving" class="flex items-center">
              <div class="animate-spin rounded-full h-3 w-3 border border-gray-300 border-t-indigo-600"></div>
              <span class="ml-2">Guardando...</span>
            </div>
            <div v-else-if="lastSaved" class="flex items-center">
              <CheckIcon class="w-3 h-3 text-green-500" />
              <span class="ml-1">Guardado {{ formatTime(lastSaved) }}</span>
            </div>
          </div>

          <!-- Note actions -->
          <button
            @click="toggleFavorite"
            class="p-2 text-gray-400 hover:text-yellow-500 rounded-full hover:bg-gray-100"
            :title="localNote.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          >
            <StarIcon
              class="w-5 h-5"
              :class="localNote.isFavorite ? 'text-yellow-500 fill-current' : ''"
            />
          </button>

          <button
            @click="showShareModal = true"
            class="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100"
            title="Compartir nota"
          >
            <ShareIcon class="w-5 h-5" />
          </button>

          <button
            @click="toggleEncryption"
            class="p-2 text-gray-400 hover:text-amber-500 rounded-full hover:bg-gray-100"
            :title="localNote.isEncrypted ? 'Desencriptar' : 'Encriptar'"
          >
            <LockClosedIcon
              class="w-5 h-5"
              :class="localNote.isEncrypted ? 'text-amber-500' : ''"
            />
          </button>

          <div class="relative">
            <button
              @click="showOptions = !showOptions"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Más opciones"
            >
              <EllipsisVerticalIcon class="w-5 h-5" />
            </button>

            <!-- Options dropdown -->
            <div
              v-if="showOptions"
              v-click-outside="() => showOptions = false"
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
            >
              <div class="py-1">
                <button
                  @click="exportNote"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowDownTrayIcon class="w-4 h-4 inline mr-2" />
                  Exportar
                </button>
                <button
                  @click="duplicateNote"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <DocumentDuplicateIcon class="w-4 h-4 inline mr-2" />
                  Duplicar
                </button>
                <button
                  @click="showVersionHistory = true"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ClockIcon class="w-4 h-4 inline mr-2" />
                  Historial de versiones
                </button>
                <hr class="my-1">
                <button
                  @click="confirmDelete"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <TrashIcon class="w-4 h-4 inline mr-2" />
                  Eliminar nota
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formatting toolbar -->
      <div class="flex items-center space-x-1 mb-4">
        <!-- Format buttons -->
        <div class="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
          <button
            @click="execCommand('bold')"
            class="toolbar-btn"
            :class="{ 'active': isFormatActive('bold') }"
            title="Negrita (Ctrl+B)"
          >
            <BoldIcon class="w-4 h-4" />
          </button>
          <button
            @click="execCommand('italic')"
            class="toolbar-btn"
            :class="{ 'active': isFormatActive('italic') }"
            title="Cursiva (Ctrl+I)"
          >
            <ItalicIcon class="w-4 h-4" />
          </button>
          <button
            @click="execCommand('underline')"
            class="toolbar-btn"
            :class="{ 'active': isFormatActive('underline') }"
            title="Subrayado (Ctrl+U)"
          >
            <UnderlineIcon class="w-4 h-4" />
          </button>
          <button
            @click="execCommand('strikeThrough')"
            class="toolbar-btn"
            :class="{ 'active': isFormatActive('strikeThrough') }"
            title="Tachado"
          >
            <StrikethroughIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Lists -->
        <div class="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
          <button
            @click="execCommand('insertUnorderedList')"
            class="toolbar-btn"
            title="Lista con viñetas"
          >
            <ListBulletIcon class="w-4 h-4" />
          </button>
          <button
            @click="execCommand('insertOrderedList')"
            class="toolbar-btn"
            title="Lista numerada"
          >
            <list-numbered-icon class="w-4 h-4" />
          </button>
        </div>

        <!-- Alignment -->
        <div class="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
          <button
            @click="execCommand('justifyLeft')"
            class="toolbar-btn"
            title="Alinear a la izquierda"
          >
            <align-left-icon class="w-4 h-4" />
          </button>
          <button
            @click="execCommand('justifyCenter')"
            class="toolbar-btn"
            title="Centrar"
          >
            <align-center-icon class="w-4 h-4" />
          </button>
          <button
            @click="execCommand('justifyRight')"
            class="toolbar-btn"
            title="Alinear a la derecha"
          >
            <align-right-icon class="w-4 h-4" />
          </button>
        </div>

        <!-- Insert -->
        <div class="flex items-center space-x-1">
          <button
            @click="insertLink"
            class="toolbar-btn"
            title="Insertar enlace"
          >
            <LinkIcon class="w-4 h-4" />
          </button>
          <button
            @click="$refs.imageInput.click()"
            class="toolbar-btn"
            title="Insertar imagen"
          >
            <PhotoIcon class="w-4 h-4" />
          </button>
          <button
            @click="insertTable"
            class="toolbar-btn"
            title="Insertar tabla"
          >
            <TableCellsIcon class="w-4 h-4" />
          </button>
        </div>

        <input
          ref="imageInput"
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          class="hidden"
        />
      </div>

      <!-- Tags -->
      <div class="flex items-center space-x-2">
        <TagIcon class="w-4 h-4 text-gray-400" />
        <div class="flex flex-wrap gap-2 flex-1">
          <span
            v-for="tag in localNote.tags"
            :key="tag"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
          >
            {{ tag }}
            <button
              @click="removeTag(tag)"
              class="ml-1 text-indigo-600 hover:text-indigo-800"
            >
              <XMarkIcon class="w-3 h-3" />
            </button>
          </span>
          
          <input
            v-model="newTag"
            @keydown.enter="addTag"
            @keydown.comma.prevent="addTag"
            type="text"
            placeholder="Agregar etiqueta..."
            class="text-xs border border-gray-300 rounded-full px-2 py-1 min-w-0 flex-1 max-w-32"
          />
        </div>
      </div>
    </div>

    <!-- Editor content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Rich text editor -->
      <div class="flex-1 p-6 overflow-y-auto">
        <div
          ref="editor"
          contenteditable="true"
          class="min-h-full prose prose-lg max-w-none focus:outline-none"
          style="line-height: 1.7;"
          @input="handleContentChange"
          @paste="handlePaste"
          @keydown="handleKeydown"
          v-html="localNote.content"
        ></div>
      </div>

      <!-- Collaborators sidebar -->
      <div
        v-if="localNote.collaborators && localNote.collaborators.length > 0"
        class="w-64 border-l border-gray-200 bg-gray-50 p-4"
      >
        <h3 class="text-sm font-medium text-gray-900 mb-4">Colaboradores</h3>
        <div class="space-y-3">
          <div
            v-for="collaborator in localNote.collaborators"
            :key="collaborator.id"
            class="flex items-center space-x-3"
          >
            <img
              :src="collaborator.avatar"
              :alt="collaborator.name"
              class="w-8 h-8 rounded-full"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ collaborator.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ collaborator.permission }}
              </p>
            </div>
            <div
              v-if="collaborator.isOnline"
              class="w-2 h-2 bg-green-400 rounded-full"
              title="En línea"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ShareNoteModal
      :is-open="showShareModal"
      :note="localNote"
      @close="showShareModal = false"
      @shared="handleNoteShared"
    />

    <VersionHistoryModal
      :is-open="showVersionHistory"
      :note="localNote"
      @close="showVersionHistory = false"
      @restore="handleVersionRestore"
    />

    <!-- Delete confirmation -->
    <ConfirmDialog
      :is-open="showDeleteConfirm"
      title="Eliminar nota"
      message="¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer."
      confirm-text="Eliminar"
      confirm-class="btn-danger"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import { useAppStore } from '@/stores/app'
import {
  StarIcon,
  ShareIcon,
  LockClosedIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  TagIcon,
  XMarkIcon,
  LinkIcon,
  PhotoIcon,
  TableCellsIcon,
  ListBulletIcon
} from '@heroicons/vue/24/outline'

// Typography icons (simplified representations)
const BoldIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h8c3.31 0 6 2.69 6 6 0 2.22-1.21 4.15-3 5.19 2.54 1.11 4.5 3.54 4.5 6.31 0 3.86-3.14 7-7 7H6V4zm4 7h4c1.1 0 2-.9 2-2s-.9-2-2-2h-4v4zm0 9h5c1.1 0 2-.9 2-2s-.9-2-2-2h-5v4z"/></svg>' }
const ItalicIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/></svg>' }
const UnderlineIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>' }
const StrikethroughIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"/></svg>' }

// Components
import ShareNoteModal from '@/components/notes/ShareNoteModal.vue'
import VersionHistoryModal from '@/components/notes/VersionHistoryModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const props = defineProps({
  note: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['save', 'delete', 'share', 'encrypt'])

const appStore = useAppStore()

const localNote = reactive({})
const editor = ref(null)
const imageInput = ref(null)
const newTag = ref('')
const isSaving = ref(false)
const lastSaved = ref(null)
const showOptions = ref(false)
const showShareModal = ref(false)
const showVersionHistory = ref(false)
const showDeleteConfirm = ref(false)

// Copy note data to local reactive object
const updateLocalNote = () => {
  Object.assign(localNote, {
    ...props.note,
    tags: [...(props.note.tags || [])],
    collaborators: [...(props.note.collaborators || [])]
  })
}

// Debounced save function
const debouncedSave = debounce(async () => {
  if (!localNote.title && !localNote.content) return
  
  isSaving.value = true
  
  // Simulate saving delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  emit('save', {
    title: localNote.title,
    content: localNote.content,
    tags: localNote.tags
  })
  
  isSaving.value = false
  lastSaved.value = new Date()
}, 1000)

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return 'ahora'
  if (diff < 3600000) return `hace ${Math.floor(diff / 60000)}m`
  
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const handleContentChange = () => {
  localNote.content = editor.value.innerHTML
  debouncedSave()
}

const handlePaste = (event) => {
  // Clean pasted content
  event.preventDefault()
  const text = event.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

const handleKeydown = (event) => {
  // Handle keyboard shortcuts
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'b':
        event.preventDefault()
        execCommand('bold')
        break
      case 'i':
        event.preventDefault()
        execCommand('italic')
        break
      case 'u':
        event.preventDefault()
        execCommand('underline')
        break
      case 's':
        event.preventDefault()
        debouncedSave()
        break
    }
  }
}

const execCommand = (command, value = null) => {
  document.execCommand(command, false, value)
  editor.value.focus()
}

const isFormatActive = (command) => {
  return document.queryCommandState(command)
}

const insertLink = () => {
  const url = prompt('Introduce la URL del enlace:')
  if (url) {
    execCommand('createLink', url)
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = `<img src="${e.target.result}" alt="Imagen" style="max-width: 100%; height: auto;" />`
      execCommand('insertHTML', img)
    }
    reader.readAsDataURL(file)
  }
}

const insertTable = () => {
  const rows = prompt('Número de filas:', '3')
  const cols = prompt('Número de columnas:', '3')
  
  if (rows && cols) {
    let table = '<table border="1" style="border-collapse: collapse; width: 100%;">'
    for (let i = 0; i < parseInt(rows); i++) {
      table += '<tr>'
      for (let j = 0; j < parseInt(cols); j++) {
        table += '<td style="padding: 8px; border: 1px solid #ccc;">&nbsp;</td>'
      }
      table += '</tr>'
    }
    table += '</table><p>&nbsp;</p>'
    
    execCommand('insertHTML', table)
  }
}

const addTag = () => {
  const tag = newTag.value.trim().replace(',', '')
  if (tag && !localNote.tags.includes(tag)) {
    localNote.tags.push(tag)
    newTag.value = ''
    debouncedSave()
  }
}

const removeTag = (tag) => {
  const index = localNote.tags.indexOf(tag)
  if (index > -1) {
    localNote.tags.splice(index, 1)
    debouncedSave()
  }
}

const toggleFavorite = () => {
  localNote.isFavorite = !localNote.isFavorite
  debouncedSave()
}

const toggleEncryption = () => {
  emit('encrypt', !localNote.isEncrypted)
}

const exportNote = () => {
  const content = `# ${localNote.title}\n\n${getPlainText(localNote.content)}`
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${localNote.title || 'nota'}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  showOptions.value = false
  appStore.showToast('Nota exportada exitosamente', 'success')
}

const duplicateNote = () => {
  const duplicatedNote = {
    ...localNote,
    title: `${localNote.title} (copia)`,
    id: Date.now()
  }
  
  // This would typically emit to parent to create new note
  console.log('Duplicating note:', duplicatedNote)
  showOptions.value = false
  appStore.showToast('Nota duplicada', 'success')
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
  showOptions.value = false
}

const handleDelete = () => {
  emit('delete', localNote.id)
  showDeleteConfirm.value = false
}

const handleNoteShared = (shareData) => {
  emit('share', shareData)
}

const handleVersionRestore = (version) => {
  localNote.content = version.content
  localNote.title = version.title
  editor.value.innerHTML = version.content
  debouncedSave()
}

const getPlainText = (html) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

// Watch for note changes from parent
watch(() => props.note, updateLocalNote, { immediate: true })

onMounted(() => {
  updateLocalNote()
})
</script>

<style scoped>
.toolbar-btn {
  @apply p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded border-0 transition-colors;
}

.toolbar-btn.active {
  @apply bg-indigo-100 text-indigo-700;
}

.prose {
  @apply text-gray-900;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  @apply text-gray-900 font-semibold;
}

.prose a {
  @apply text-indigo-600 hover:text-indigo-800;
}

.prose blockquote {
  @apply border-l-4 border-indigo-200 bg-indigo-50 italic;
}

.prose table {
  @apply border-collapse border border-gray-300;
}

.prose th, .prose td {
  @apply border border-gray-300 px-3 py-2;
}

.prose th {
  @apply bg-gray-50 font-semibold;
}
</style>