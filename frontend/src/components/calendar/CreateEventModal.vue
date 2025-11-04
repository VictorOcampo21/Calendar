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
            Crear Evento Rápido
          </h2>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <p v-if="selectedDateText" class="text-sm text-gray-600 mt-1">
          {{ selectedDateText }}
        </p>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Título del evento *
            </label>
            <input
              ref="titleInput"
              v-model="form.title"
              type="text"
              required
              placeholder="¿Qué tienes planeado?"
              class="input-field"
            />
          </div>

          <!-- Time selection -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Hora inicio
              </label>
              <input
                v-model="form.startTime"
                type="time"
                class="input-field"
                :disabled="form.allDay"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Hora fin
              </label>
              <input
                v-model="form.endTime"
                type="time"
                class="input-field"
                :disabled="form.allDay"
              />
            </div>
          </div>

          <!-- All day toggle -->
          <div>
            <label class="flex items-center space-x-2">
              <input
                v-model="form.allDay"
                type="checkbox"
                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span class="text-sm font-medium text-gray-700">Todo el día</span>
            </label>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <div class="grid grid-cols-2 gap-2">
              <label
                v-for="category in eventCategories"
                :key="category.id"
                class="flex items-center space-x-2 p-2 border rounded cursor-pointer transition-colors"
                :class="form.category === category.id 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-gray-300'"
              >
                <input
                  v-model="form.category"
                  :value="category.id"
                  type="radio"
                  class="sr-only"
                />
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <span class="text-xs font-medium text-gray-700">
                  {{ category.name }}
                </span>
              </label>
            </div>
          </div>

          <!-- Quick options -->
          <div class="flex items-center justify-between text-sm">
            <button
              type="button"
              @click="showMoreOptions = !showMoreOptions"
              class="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {{ showMoreOptions ? 'Menos opciones' : 'Más opciones' }}
            </button>
            
            <div class="flex items-center space-x-3">
              <label class="flex items-center space-x-1">
                <input
                  v-model="form.addReminder"
                  type="checkbox"
                  class="w-3 h-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span class="text-xs text-gray-600">Recordatorio</span>
              </label>
              
              <label class="flex items-center space-x-1">
                <input
                  v-model="form.addLocation"
                  type="checkbox"
                  class="w-3 h-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span class="text-xs text-gray-600">Ubicación</span>
              </label>
            </div>
          </div>

          <!-- Expanded options -->
          <div v-if="showMoreOptions" class="space-y-3 pt-3 border-t border-gray-200">
            <!-- Location -->
            <div v-if="form.addLocation">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <input
                v-model="form.location"
                type="text"
                placeholder="¿Dónde será el evento?"
                class="input-field"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                v-model="form.description"
                rows="2"
                placeholder="Detalles adicionales..."
                class="input-field"
              ></textarea>
            </div>

            <!-- Reminder -->
            <div v-if="form.addReminder">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Recordatorio
              </label>
              <select v-model="form.reminderTime" class="input-field">
                <option value="15">15 minutos antes</option>
                <option value="30">30 minutos antes</option>
                <option value="60">1 hora antes</option>
                <option value="1440">1 día antes</option>
              </select>
            </div>

            <!-- Repeat -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Repetir
              </label>
              <select v-model="form.recurrence" class="input-field">
                <option value="">No repetir</option>
                <option value="daily">Todos los días</option>
                <option value="weekly">Todas las semanas</option>
                <option value="monthly">Todos los meses</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="close"
          type="button"
          class="btn-secondary"
        >
          Cancelar
        </button>
        <button
          @click="openDetailedModal"
          type="button"
          class="btn-secondary"
        >
          Más detalles
        </button>
        <button
          @click="handleSubmit"
          type="button"
          class="btn-primary"
          :disabled="!isFormValid"
        >
          Crear Evento
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  initialDate: {
    type: Date,
    default: null
  },
  initialTime: {
    type: Date,
    default: null
  }
})

const emit = defineEmits(['close', 'save', 'open-detailed'])

const appStore = useAppStore()
const titleInput = ref(null)
const showMoreOptions = ref(false)

// Form data
const form = ref({
  title: '',
  startTime: '',
  endTime: '',
  allDay: false,
  category: 'work',
  location: '',
  description: '',
  addReminder: false,
  addLocation: false,
  reminderTime: '15',
  recurrence: ''
})

// Event categories
const eventCategories = [
  { id: 'work', name: 'Trabajo', color: '#3B82F6' },
  { id: 'personal', name: 'Personal', color: '#10B981' },
  { id: 'meeting', name: 'Reunión', color: '#F59E0B' },
  { id: 'reminder', name: 'Recordatorio', color: '#EF4444' }
]

const selectedDateText = computed(() => {
  if (!props.initialDate) return ''
  
  const date = props.initialDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  if (props.initialTime) {
    const time = props.initialTime.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    return `${date} a las ${time}`
  }
  
  return date
})

const isFormValid = computed(() => {
  return form.value.title.trim() && 
         (form.value.allDay || (form.value.startTime && form.value.endTime))
})

const resetForm = () => {
  form.value = {
    title: '',
    startTime: '',
    endTime: '',
    allDay: false,
    category: 'work',
    location: '',
    description: '',
    addReminder: false,
    addLocation: false,
    reminderTime: '15',
    recurrence: ''
  }
  showMoreOptions.value = false
}

const setInitialTime = () => {
  if (props.initialTime) {
    const startTime = props.initialTime.toTimeString().slice(0, 5)
    form.value.startTime = startTime
    
    // Set end time 1 hour later
    const endTime = new Date(props.initialTime)
    endTime.setHours(endTime.getHours() + 1)
    form.value.endTime = endTime.toTimeString().slice(0, 5)
  } else {
    // Default to current time + 1 hour
    const now = new Date()
    form.value.startTime = now.toTimeString().slice(0, 5)
    
    now.setHours(now.getHours() + 1)
    form.value.endTime = now.toTimeString().slice(0, 5)
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  const baseDate = props.initialDate || new Date()
  let startDateTime, endDateTime
  
  if (form.value.allDay) {
    startDateTime = new Date(baseDate)
    startDateTime.setHours(0, 0, 0, 0)
    endDateTime = new Date(baseDate)
    endDateTime.setHours(23, 59, 59, 999)
  } else {
    const [startHour, startMinute] = form.value.startTime.split(':')
    const [endHour, endMinute] = form.value.endTime.split(':')
    
    startDateTime = new Date(baseDate)
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0)
    
    endDateTime = new Date(baseDate)
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0)
  }
  
  const eventData = {
    id: Date.now(),
    title: form.value.title,
    start: startDateTime.toISOString(),
    end: endDateTime.toISOString(),
    allDay: form.value.allDay,
    category: form.value.category,
    location: form.value.addLocation ? form.value.location : '',
    description: form.value.description,
    reminders: form.value.addReminder ? [parseInt(form.value.reminderTime)] : [],
    recurrence: form.value.recurrence,
    status: 'confirmed',
    attendees: []
  }
  
  emit('save', eventData)
  appStore.showToast('Evento creado exitosamente', 'success')
  close()
}

const openDetailedModal = () => {
  // Emit event to open detailed modal with current form data
  const eventData = {
    title: form.value.title,
    initialDate: props.initialDate,
    initialTime: props.initialTime,
    category: form.value.category,
    allDay: form.value.allDay,
    startTime: form.value.startTime,
    endTime: form.value.endTime,
    location: form.value.location,
    description: form.value.description
  }
  
  emit('open-detailed', eventData)
  close()
}

const close = () => {
  emit('close')
}

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
    setInitialTime()
    
    // Focus title input
    nextTick(() => {
      if (titleInput.value) {
        titleInput.value.focus()
      }
    })
  }
})

// Watch for all day toggle
watch(() => form.value.allDay, (allDay) => {
  if (allDay) {
    form.value.startTime = ''
    form.value.endTime = ''
  } else if (!form.value.startTime) {
    setInitialTime()
  }
})
</script>