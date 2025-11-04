<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="close"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ modalTitle }}
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
      <div class="px-6 py-4 overflow-y-auto max-h-96">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              ref="titleInput"
              v-model="form.title"
              type="text"
              required
              placeholder="Ingresa el título del evento"
              class="input-field"
            />
          </div>

          <!-- Date and time -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Start date/time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha y hora de inicio *
              </label>
              <div class="space-y-2">
                <input
                  v-model="form.startDate"
                  type="date"
                  required
                  class="input-field"
                />
                <input
                  v-if="!form.allDay"
                  v-model="form.startTime"
                  type="time"
                  required
                  class="input-field"
                />
              </div>
            </div>

            <!-- End date/time -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha y hora de fin *
              </label>
              <div class="space-y-2">
                <input
                  v-model="form.endDate"
                  type="date"
                  required
                  class="input-field"
                />
                <input
                  v-if="!form.allDay"
                  v-model="form.endTime"
                  type="time"
                  required
                  class="input-field"
                />
              </div>
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
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label
                v-for="category in eventCategories"
                :key="category.id"
                class="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors"
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
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <span class="text-sm font-medium text-gray-700">
                  {{ category.name }}
                </span>
              </label>
            </div>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ubicación
            </label>
            <input
              v-model="form.location"
              type="text"
              placeholder="Agregar ubicación"
              class="input-field"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Agregar descripción del evento"
              class="input-field"
            ></textarea>
          </div>

          <!-- Attendees -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Participantes
            </label>
            <div class="space-y-2">
              <div class="flex space-x-2">
                <input
                  v-model="newAttendee"
                  type="email"
                  placeholder="Agregar email del participante"
                  class="input-field flex-1"
                  @keyup.enter="addAttendee"
                />
                <button
                  type="button"
                  @click="addAttendee"
                  class="btn-secondary"
                  :disabled="!newAttendee.trim()"
                >
                  Agregar
                </button>
              </div>
              
              <!-- Attendee list -->
              <div v-if="form.attendees.length > 0" class="space-y-2">
                <div
                  v-for="(attendee, index) in form.attendees"
                  :key="index"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span class="text-sm text-gray-700">{{ attendee }}</span>
                  <button
                    type="button"
                    @click="removeAttendee(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Reminders -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Recordatorios
            </label>
            <div class="space-y-2">
              <div class="flex space-x-2">
                <select v-model="newReminder" class="input-field flex-1">
                  <option value="">Seleccionar recordatorio</option>
                  <option value="0">En el momento</option>
                  <option value="5">5 minutos antes</option>
                  <option value="15">15 minutos antes</option>
                  <option value="30">30 minutos antes</option>
                  <option value="60">1 hora antes</option>
                  <option value="1440">1 día antes</option>
                  <option value="10080">1 semana antes</option>
                </select>
                <button
                  type="button"
                  @click="addReminder"
                  class="btn-secondary"
                  :disabled="!newReminder"
                >
                  Agregar
                </button>
              </div>
              
              <!-- Reminder list -->
              <div v-if="form.reminders.length > 0" class="space-y-2">
                <div
                  v-for="(reminder, index) in form.reminders"
                  :key="index"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span class="text-sm text-gray-700">
                    {{ formatReminderTime(reminder) }}
                  </span>
                  <button
                    type="button"
                    @click="removeReminder(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Recurrence -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Repetir
            </label>
            <select v-model="form.recurrence" class="input-field">
              <option value="">No repetir</option>
              <option value="daily">Diariamente</option>
              <option value="weekly">Semanalmente</option>
              <option value="monthly">Mensualmente</option>
              <option value="yearly">Anualmente</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center space-x-2">
                <input
                  v-model="form.status"
                  value="confirmed"
                  type="radio"
                  class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span class="text-sm text-gray-700">Confirmado</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  v-model="form.status"
                  value="tentative"
                  type="radio"
                  class="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                />
                <span class="text-sm text-gray-700">Tentativo</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-between">
        <div>
          <button
            v-if="mode === 'edit'"
            @click="handleDelete"
            class="btn-danger"
          >
            <TrashIcon class="w-4 h-4 mr-2" />
            Eliminar
          </button>
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="close"
            type="button"
            class="btn-secondary"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmit"
            type="button"
            class="btn-primary"
            :disabled="!isFormValid"
          >
            {{ mode === 'edit' ? 'Actualizar' : 'Crear' }} Evento
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import { XMarkIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  event: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create', // 'create', 'edit', 'view'
    validator: value => ['create', 'edit', 'view'].includes(value)
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

const emit = defineEmits(['close', 'save', 'delete'])

const appStore = useAppStore()
const titleInput = ref(null)

// Form data
const form = ref({
  title: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  allDay: false,
  category: 'work',
  location: '',
  description: '',
  attendees: [],
  reminders: [],
  recurrence: '',
  status: 'confirmed'
})

const newAttendee = ref('')
const newReminder = ref('')

// Event categories
const eventCategories = [
  { id: 'work', name: 'Trabajo', color: '#3B82F6' },
  { id: 'personal', name: 'Personal', color: '#10B981' },
  { id: 'meeting', name: 'Reuniones', color: '#F59E0B' },
  { id: 'reminder', name: 'Recordatorios', color: '#EF4444' },
  { id: 'holiday', name: 'Vacaciones', color: '#8B5CF6' }
]

const modalTitle = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'Crear Nuevo Evento'
    case 'edit':
      return 'Editar Evento'
    case 'view':
      return 'Detalles del Evento'
    default:
      return 'Evento'
  }
})

const isFormValid = computed(() => {
  return form.value.title.trim() && 
         form.value.startDate && 
         form.value.endDate &&
         (form.value.allDay || (form.value.startTime && form.value.endTime))
})

const formatReminderTime = (minutes) => {
  if (minutes === 0) return 'En el momento'
  if (minutes < 60) return `${minutes} minutos antes`
  if (minutes < 1440) return `${Math.floor(minutes / 60)} horas antes`
  if (minutes < 10080) return `${Math.floor(minutes / 1440)} días antes`
  return `${Math.floor(minutes / 10080)} semanas antes`
}

const resetForm = () => {
  form.value = {
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    allDay: false,
    category: 'work',
    location: '',
    description: '',
    attendees: [],
    reminders: [],
    recurrence: '',
    status: 'confirmed'
  }
  newAttendee.value = ''
  newReminder.value = ''
}

const loadEventData = () => {
  if (props.event) {
    const startDate = new Date(props.event.start)
    const endDate = new Date(props.event.end)
    
    form.value = {
      title: props.event.title || '',
      startDate: startDate.toISOString().split('T')[0],
      startTime: props.event.allDay ? '' : startDate.toTimeString().slice(0, 5),
      endDate: endDate.toISOString().split('T')[0],
      endTime: props.event.allDay ? '' : endDate.toTimeString().slice(0, 5),
      allDay: props.event.allDay || false,
      category: props.event.category || 'work',
      location: props.event.location || '',
      description: props.event.description || '',
      attendees: [...(props.event.attendees || [])],
      reminders: [...(props.event.reminders || [])],
      recurrence: props.event.recurrence || '',
      status: props.event.status || 'confirmed'
    }
  }
}

const setInitialDateTime = () => {
  if (props.initialDate) {
    const date = props.initialDate.toISOString().split('T')[0]
    form.value.startDate = date
    form.value.endDate = date
    
    if (props.initialTime) {
      const time = props.initialTime.toTimeString().slice(0, 5)
      form.value.startTime = time
      
      // Set end time 1 hour later
      const endTime = new Date(props.initialTime)
      endTime.setHours(endTime.getHours() + 1)
      form.value.endTime = endTime.toTimeString().slice(0, 5)
    }
  }
}

const addAttendee = () => {
  const email = newAttendee.value.trim()
  if (email && !form.value.attendees.includes(email)) {
    form.value.attendees.push(email)
    newAttendee.value = ''
  }
}

const removeAttendee = (index) => {
  form.value.attendees.splice(index, 1)
}

const addReminder = () => {
  const minutes = parseInt(newReminder.value)
  if (!isNaN(minutes) && !form.value.reminders.includes(minutes)) {
    form.value.reminders.push(minutes)
    form.value.reminders.sort((a, b) => a - b)
    newReminder.value = ''
  }
}

const removeReminder = (index) => {
  form.value.reminders.splice(index, 1)
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  const startDateTime = new Date(`${form.value.startDate}T${form.value.startTime || '00:00'}`)
  const endDateTime = new Date(`${form.value.endDate}T${form.value.endTime || '23:59'}`)
  
  const eventData = {
    ...form.value,
    start: startDateTime.toISOString(),
    end: endDateTime.toISOString(),
    id: props.event?.id || Date.now()
  }
  
  emit('save', eventData)
}

const handleDelete = () => {
  if (props.event?.id) {
    emit('delete', props.event.id)
  }
}

const close = () => {
  emit('close')
}

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
    
    if (props.mode === 'edit' || props.mode === 'view') {
      loadEventData()
    } else {
      setInitialDateTime()
    }
    
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
    form.value.startTime = '09:00'
    form.value.endTime = '10:00'
  }
})
</script>