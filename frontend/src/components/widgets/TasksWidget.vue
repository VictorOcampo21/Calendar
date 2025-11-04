<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Tareas Pendientes</h3>
      <button
        @click="showCreateTask = true"
        class="btn-primary-sm"
      >
        <PlusIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Tasks list -->
    <div class="space-y-3 max-h-80 overflow-y-auto">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggleTask(task.id)"
          class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium"
            :class="task.completed ? 'text-gray-500 line-through' : 'text-gray-900'"
          >
            {{ task.title }}
          </p>
          <div class="flex items-center space-x-2 mt-1">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="priorityClasses[task.priority]"
            >
              {{ priorityLabels[task.priority] }}
            </span>
            <span class="text-xs text-gray-500">
              <ClockIcon class="w-3 h-3 inline mr-1" />
              {{ formatDate(task.dueDate) }}
            </span>
          </div>
        </div>

        <button
          @click="deleteTask(task.id)"
          class="text-red-400 hover:text-red-600"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>

      <div v-if="tasks.length === 0" class="text-center py-8 text-gray-500">
        <CheckCircleIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>¡No hay tareas pendientes!</p>
        <p class="text-sm">Crea una nueva tarea para comenzar</p>
      </div>
    </div>

    <!-- Quick add task -->
    <div v-if="showCreateTask" class="mt-4 pt-4 border-t border-gray-200">
      <div class="space-y-3">
        <input
          v-model="newTask.title"
          type="text"
          placeholder="Título de la tarea..."
          class="input-field"
          @keyup.enter="createTask"
        />
        
        <div class="flex space-x-2">
          <select v-model="newTask.priority" class="input-field flex-1">
            <option value="low">Baja prioridad</option>
            <option value="medium">Prioridad media</option>
            <option value="high">Alta prioridad</option>
          </select>
          
          <input
            v-model="newTask.dueDate"
            type="date"
            class="input-field flex-1"
          />
        </div>
        
        <div class="flex space-x-2">
          <button
            @click="createTask"
            class="btn-primary flex-1"
            :disabled="!newTask.title.trim()"
          >
            Crear Tarea
          </button>
          <button
            @click="cancelCreate"
            class="btn-secondary flex-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Progress summary -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Progreso del día</span>
        <span class="font-medium">{{ completedCount }}/{{ totalCount }}</span>
      </div>
      <div class="mt-2 bg-gray-200 rounded-full h-2">
        <div
          class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  PlusIcon,
  ClockIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

const appStore = useAppStore()

const showCreateTask = ref(false)
const tasks = ref([])

const newTask = ref({
  title: '',
  priority: 'medium',
  dueDate: new Date().toISOString().split('T')[0]
})

const priorityClasses = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
}

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta'
}

const completedCount = computed(() => 
  tasks.value.filter(task => task.completed).length
)

const totalCount = computed(() => tasks.value.length)

const progressPercentage = computed(() => 
  totalCount.value === 0 ? 0 : Math.round((completedCount.value / totalCount.value) * 100)
)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hoy'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Mañana'
  } else {
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

const toggleTask = (taskId) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
    
    if (task.completed) {
      appStore.showToast('Tarea completada', 'success')
    }
  }
}

const createTask = () => {
  if (!newTask.value.title.trim()) return
  
  const task = {
    id: Date.now(),
    title: newTask.value.title,
    priority: newTask.value.priority,
    dueDate: newTask.value.dueDate,
    completed: false,
    createdAt: new Date().toISOString()
  }
  
  tasks.value.unshift(task)
  
  // Reset form
  newTask.value = {
    title: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  }
  
  showCreateTask.value = false
  appStore.showToast('Tarea creada exitosamente', 'success')
}

const cancelCreate = () => {
  newTask.value = {
    title: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  }
  showCreateTask.value = false
}

const deleteTask = (taskId) => {
  const index = tasks.value.findIndex(t => t.id === taskId)
  if (index !== -1) {
    tasks.value.splice(index, 1)
    appStore.showToast('Tarea eliminada', 'info')
  }
}

onMounted(() => {
  // Cargar tareas de ejemplo
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  
  tasks.value = [
    {
      id: 1,
      title: 'Revisar reportes financieros',
      priority: 'high',
      dueDate: today.toISOString().split('T')[0],
      completed: false,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 2,
      title: 'Llamar al cliente ABC Corp',
      priority: 'medium',
      dueDate: today.toISOString().split('T')[0],
      completed: true,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 3,
      title: 'Preparar presentación para reunión',
      priority: 'high',
      dueDate: tomorrow.toISOString().split('T')[0],
      completed: false,
      createdAt: '2024-01-15T11:00:00Z'
    },
    {
      id: 4,
      title: 'Actualizar documentación del proyecto',
      priority: 'low',
      dueDate: tomorrow.toISOString().split('T')[0],
      completed: false,
      createdAt: '2024-01-15T12:00:00Z'
    }
  ]
})
</script>