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
            Crear Canal
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
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Channel name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del canal *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">#</span>
              <input
                ref="nameInput"
                v-model="form.name"
                type="text"
                required
                placeholder="nombre-del-canal"
                class="input-field pl-8"
                @input="formatChannelName"
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Use letras minúsculas, números y guiones
            </p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="¿De qué trata este canal?"
              class="input-field"
            ></textarea>
          </div>

          <!-- Privacy -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Privacidad
            </label>
            <div class="space-y-3">
              <label class="flex items-start space-x-3 cursor-pointer">
                <input
                  v-model="form.isPrivate"
                  :value="false"
                  type="radio"
                  class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900">🌐 Público</span>
                  </div>
                  <p class="text-sm text-gray-500">
                    Cualquier miembro del workspace puede unirse
                  </p>
                </div>
              </label>
              
              <label class="flex items-start space-x-3 cursor-pointer">
                <input
                  v-model="form.isPrivate"
                  :value="true"
                  type="radio"
                  class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900">🔒 Privado</span>
                  </div>
                  <p class="text-sm text-gray-500">
                    Solo los miembros invitados pueden ver y unirse
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- Initial members (for private channels) -->
          <div v-if="form.isPrivate">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Invitar miembros
            </label>
            <div class="space-y-2">
              <div class="flex space-x-2">
                <select v-model="selectedMember" class="input-field flex-1">
                  <option value="">Seleccionar miembro</option>
                  <option
                    v-for="member in availableMembers"
                    :key="member.id"
                    :value="member"
                  >
                    {{ member.name }}
                  </option>
                </select>
                <button
                  type="button"
                  @click="addMember"
                  class="btn-secondary"
                  :disabled="!selectedMember"
                >
                  Agregar
                </button>
              </div>
              
              <!-- Selected members -->
              <div v-if="form.members.length > 0" class="space-y-1">
                <div
                  v-for="(member, index) in form.members"
                  :key="member.id"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span class="text-sm text-gray-700">{{ member.name }}</span>
                  <button
                    type="button"
                    @click="removeMember(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
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
          @click="handleSubmit"
          type="button"
          class="btn-primary"
          :disabled="!isFormValid"
        >
          Crear Canal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { mockUsers } from '@/mock-data'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'created'])

const authStore = useAuthStore()
const nameInput = ref(null)
const selectedMember = ref('')

const form = ref({
  name: '',
  description: '',
  isPrivate: false,
  members: []
})

const availableMembers = computed(() => {
  return mockUsers
    .filter(user => 
      user.workspaceId === authStore.currentWorkspace?.id &&
      user.id !== authStore.user?.id &&
      !form.value.members.find(member => member.id === user.id)
    )
})

const isFormValid = computed(() => {
  return form.value.name.trim().length >= 3
})

const formatChannelName = () => {
  form.value.name = form.value.name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const addMember = () => {
  if (selectedMember.value && !form.value.members.find(m => m.id === selectedMember.value.id)) {
    form.value.members.push(selectedMember.value)
    selectedMember.value = ''
  }
}

const removeMember = (index) => {
  form.value.members.splice(index, 1)
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    isPrivate: false,
    members: []
  }
  selectedMember.value = ''
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  const channelData = {
    name: form.value.name,
    description: form.value.description,
    isPrivate: form.value.isPrivate,
    members: [authStore.user?.id, ...form.value.members.map(m => m.id)]
  }
  
  emit('created', channelData)
  close()
}

const close = () => {
  emit('close')
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
    nextTick(() => {
      nameInput.value?.focus()
    })
  }
})
</script>