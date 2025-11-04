<template>
  <Modal
    :is-open="isOpen"
    :size="'md'"
    :show-footer="true"
    title="Crear nueva nota"
    @close="$emit('close')"
  >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Título de la nota
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            placeholder="Introduce un título..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            :class="{ 'border-red-300': errors.title }"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">
            {{ errors.title }}
          </p>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            id="category"
            v-model="form.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="general">General</option>
            <option value="work">Trabajo</option>
            <option value="personal">Personal</option>
            <option value="ideas">Ideas</option>
            <option value="projects">Proyectos</option>
            <option value="meeting">Reuniones</option>
            <option value="research">Investigación</option>
            <option value="todo">Por hacer</option>
          </select>
        </div>

        <!-- Template -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Plantilla (opcional)
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="template in templates"
              :key="template.id"
              type="button"
              class="template-btn"
              :class="{ 'selected': selectedTemplate === template.id }"
              @click="selectTemplate(template)"
            >
              <component :is="template.icon" class="w-5 h-5 mb-2" />
              <span class="text-sm font-medium">{{ template.name }}</span>
            </button>
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas
          </label>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="tag in form.tags"
              :key="tag"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeTag(tag)"
                class="ml-1 text-indigo-600 hover:text-indigo-800"
              >
                <XMarkIcon class="w-3 h-3" />
              </button>
            </span>
          </div>
          
          <div class="flex">
            <input
              v-model="newTag"
              type="text"
              placeholder="Agregar etiqueta..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
              @keydown.enter.prevent="addTag"
              @keydown.comma.prevent="addTag"
            />
            <button
              type="button"
              @click="addTag"
              class="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors"
            >
              <PlusIcon class="w-4 h-4" />
            </button>
          </div>
          
          <!-- Popular tags -->
          <div class="mt-2">
            <p class="text-xs text-gray-500 mb-1">Etiquetas populares:</p>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="tag in popularTags"
                :key="tag"
                type="button"
                @click="addPopularTag(tag)"
                class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                :disabled="form.tags.includes(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <!-- Initial content -->
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
            Contenido inicial (opcional)
          </label>
          <textarea
            id="content"
            v-model="form.content"
            rows="4"
            placeholder="Escribe el contenido inicial de tu nota..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <!-- Options -->
        <div class="space-y-3">
          <div class="flex items-center">
            <input
              id="isEncrypted"
              v-model="form.isEncrypted"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="isEncrypted" class="ml-2 block text-sm text-gray-900">
              Encriptar esta nota
            </label>
            <LockClosedIcon class="w-4 h-4 ml-1 text-amber-500" />
          </div>
          
          <div class="flex items-center">
            <input
              id="addToFavorites"
              v-model="form.addToFavorites"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="addToFavorites" class="ml-2 block text-sm text-gray-900">
              Agregar a favoritos
            </label>
            <StarIcon class="w-4 h-4 ml-1 text-yellow-500" />
          </div>
        </div>
      </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('close')"
          class="btn-secondary"
        >
          Cancelar
        </button>
        <button
          @click="handleSubmit"
          :disabled="isCreating"
          class="btn-primary"
        >
          <div v-if="isCreating" class="flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2"></div>
            Creando...
          </div>
          <span v-else>Crear nota</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import {
  XMarkIcon,
  PlusIcon,
  LockClosedIcon,
  StarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'created'])

const form = reactive({
  title: '',
  category: 'general',
  tags: [],
  content: '',
  isEncrypted: false,
  addToFavorites: false
})

const newTag = ref('')
const selectedTemplate = ref(null)
const isCreating = ref(false)
const errors = reactive({})

const popularTags = [
  'importante',
  'urgente',
  'trabajo',
  'personal',
  'ideas',
  'reunión',
  'proyecto',
  'seguimiento'
]

const templates = [
  {
    id: 'blank',
    name: 'En blanco',
    icon: DocumentTextIcon,
    content: ''
  },
  {
    id: 'meeting',
    name: 'Reunión',
    icon: UserGroupIcon,
    content: `# Reunión - [Título]

## Información General
- **Fecha:** ${new Date().toLocaleDateString('es-ES')}
- **Hora:** 
- **Participantes:** 

## Agenda
1. 
2. 
3. 

## Notas
- 

## Acuerdos
- 

## Próximos pasos
- [ ] 
- [ ] `
  },
  {
    id: 'todo',
    name: 'Lista de tareas',
    icon: ClipboardDocumentListIcon,
    content: `# Lista de tareas

## Pendientes
- [ ] 
- [ ] 
- [ ] 

## En progreso
- [ ] 

## Completadas
- [x] `
  },
  {
    id: 'project',
    name: 'Proyecto',
    icon: BriefcaseIcon,
    content: `# Proyecto: [Nombre]

## Objetivo
Describir el objetivo principal del proyecto...

## Alcance
- 
- 
- 

## Cronograma
- **Inicio:** 
- **Fin:** 
- **Hitos importantes:**

## Recursos necesarios
- 
- 

## Riesgos identificados
- 
- 

## Notas adicionales
`
  },
  {
    id: 'research',
    name: 'Investigación',
    icon: AcademicCapIcon,
    content: `# Investigación: [Tema]

## Pregunta de investigación
¿Cuál es la pregunta principal que queremos responder?

## Fuentes
1. 
2. 
3. 

## Hallazgos clave
- 
- 
- 

## Conclusiones preliminares
- 

## Próximos pasos
- [ ] 
- [ ] `
  },
  {
    id: 'daily',
    name: 'Diario',
    icon: CalendarIcon,
    content: `# ${new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}

## ¿Cómo me siento hoy?


## ¿Qué logré hoy?
- 
- 
- 

## ¿Qué aprendí?


## ¿Qué podría mejorar mañana?


## Reflexión del día

`
  }
]

const validateForm = () => {
  errors.title = ''
  
  if (!form.title.trim()) {
    errors.title = 'El título es requerido'
    return false
  }
  
  if (form.title.trim().length < 2) {
    errors.title = 'El título debe tener al menos 2 caracteres'
    return false
  }
  
  return true
}

const addTag = () => {
  const tag = newTag.value.trim().toLowerCase()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
    newTag.value = ''
  }
}

const addPopularTag = (tag) => {
  if (!form.tags.includes(tag)) {
    form.tags.push(tag)
  }
}

const removeTag = (tagToRemove) => {
  const index = form.tags.indexOf(tagToRemove)
  if (index > -1) {
    form.tags.splice(index, 1)
  }
}

const selectTemplate = (template) => {
  selectedTemplate.value = template.id
  form.content = template.content
  
  // Auto-add relevant tags based on template
  const templateTags = {
    meeting: ['reunión'],
    todo: ['tareas', 'pendientes'],
    project: ['proyecto'],
    research: ['investigación'],
    daily: ['diario', 'personal']
  }
  
  if (templateTags[template.id]) {
    templateTags[template.id].forEach(tag => {
      if (!form.tags.includes(tag)) {
        form.tags.push(tag)
      }
    })
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  isCreating.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const noteData = {
      title: form.title.trim(),
      content: form.content,
      tags: form.tags,
      category: form.category,
      isEncrypted: form.isEncrypted,
      isFavorite: form.addToFavorites
    }
    
  emit('created', noteData)
  // Close the modal automatically after creating the note
  emit('close')
    resetForm()
  } catch (error) {
    console.error('Error creating note:', error)
  } finally {
    isCreating.value = false
  }
}

const resetForm = () => {
  form.title = ''
  form.category = 'general'
  form.tags = []
  form.content = ''
  form.isEncrypted = false
  form.addToFavorites = false
  selectedTemplate.value = null
  newTag.value = ''
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

// Reset form when modal opens/closes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>

<style scoped>
.template-btn {
  @apply flex flex-col items-center p-3 border border-gray-200 rounded-lg cursor-pointer transition-all hover:border-indigo-300 hover:bg-indigo-50;
}

.template-btn.selected {
  @apply border-indigo-500 bg-indigo-100 text-indigo-700;
}
</style>