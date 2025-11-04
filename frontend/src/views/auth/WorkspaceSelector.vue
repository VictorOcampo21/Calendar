<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-2xl w-full space-y-8 p-8">
      <!-- Logo y título -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <span class="text-3xl">📅</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Seleccionar Espacio de Trabajo
        </h2>
        <p class="text-gray-600">
          Elige el espacio donde quieres trabajar hoy
        </p>
      </div>

      <!-- Lista de workspaces -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="grid gap-4 md:grid-cols-2">
          <div
            v-for="workspace in authStore.availableWorkspaces"
            :key="workspace.id"
            @click="selectWorkspace(workspace)"
            class="relative cursor-pointer rounded-lg border-2 border-gray-200 p-6 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:shadow-md"
            :class="{ 'border-indigo-500 bg-indigo-50': selectedWorkspace?.id === workspace.id }"
          >
            <!-- Workspace icon -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                     :class="getWorkspaceIconBg(workspace.type)">
                  {{ getWorkspaceIcon(workspace.type) }}
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">
                  {{ workspace.name }}
                </h3>
                <p class="text-sm text-gray-500 mb-2">
                  {{ workspace.description }}
                </p>
                
                <!-- Workspace info -->
                <div class="flex items-center space-x-4 text-xs text-gray-400">
                  <span class="flex items-center">
                    <UsersIcon class="w-4 h-4 mr-1" />
                    {{ workspace.members.length }} miembro{{ workspace.members.length > 1 ? 's' : '' }}
                  </span>
                  <span class="flex items-center">
                    <BuildingOfficeIcon class="w-4 h-4 mr-1" />
                    {{ getWorkspaceTypeLabel(workspace.type) }}
                  </span>
                </div>
              </div>
              
              <!-- Selected indicator -->
              <div v-if="selectedWorkspace?.id === workspace.id" 
                   class="flex-shrink-0">
                <CheckCircleIcon class="w-6 h-6 text-indigo-600" />
              </div>
            </div>

            <!-- Owner indicator -->
            <div v-if="workspace.ownerId === authStore.user.id" 
                 class="absolute top-2 right-2">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <span class="mr-1" aria-hidden="true">👑</span>
                Propietario
              </span>
            </div>
          </div>

          <!-- Crear nuevo workspace -->
          <div
            @click="showCreateWorkspace = true"
            class="relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:bg-gray-50 flex flex-col items-center justify-center text-center min-h-[160px]"
          >
            <PlusIcon class="w-12 h-12 text-gray-400 mb-3" />
            <h3 class="text-lg font-medium text-gray-900 mb-1">
              Crear Nuevo Espacio
            </h3>
            <p class="text-sm text-gray-500">
              Organiza un nuevo proyecto o equipo
            </p>
          </div>
        </div>

        <!-- Botón de continuar -->
        <div class="mt-8 flex justify-between items-center">
          <button
            @click="logout"
            class="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <ArrowLeftOnRectangleIcon class="w-4 h-4 mr-1" />
            Cerrar sesión
          </button>
          
          <button
            @click="continueToApp"
            :disabled="!selectedWorkspace"
            class="btn btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': !selectedWorkspace }"
          >
            Continuar
            <ArrowRightIcon class="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal crear workspace -->
    <CreateWorkspaceModal 
      v-if="showCreateWorkspace" 
      @close="showCreateWorkspace = false"
      @created="onWorkspaceCreated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import CreateWorkspaceModal from '@/components/CreateWorkspaceModal.vue'

import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  CheckCircleIcon, 
  PlusIcon,
  ArrowRightIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const selectedWorkspace = ref(null)
const showCreateWorkspace = ref(false)

onMounted(() => {
  // Auto-seleccionar el workspace actual si existe
  if (authStore.currentWorkspace) {
    selectedWorkspace.value = authStore.currentWorkspace
  }
})

const selectWorkspace = (workspace) => {
  selectedWorkspace.value = workspace
}

const continueToApp = () => {
  if (selectedWorkspace.value) {
    authStore.switchWorkspace(selectedWorkspace.value)
    appStore.addToast({
      type: 'success',
      title: 'Espacio seleccionado',
      message: `Trabajando en: ${selectedWorkspace.value.name}`
    })
    router.push('/dashboard')
  }
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const onWorkspaceCreated = (workspace) => {
  selectedWorkspace.value = workspace
  showCreateWorkspace.value = false
  appStore.addToast({
    type: 'success',
    title: 'Espacio creado',
    message: `${workspace.name} ha sido creado exitosamente`
  })
}

const getWorkspaceIcon = (type) => {
  const icons = {
    personal: '👤',
    business: '🏢',
    family: '👨‍👩‍👧‍👦',
    team: '👥',
    project: '📋'
  }
  return icons[type] || '📁'
}

const getWorkspaceIconBg = (type) => {
  const backgrounds = {
    personal: 'bg-blue-100',
    business: 'bg-purple-100',
    family: 'bg-yellow-100',
    team: 'bg-green-100',
    project: 'bg-indigo-100'
  }
  return backgrounds[type] || 'bg-gray-100'
}

const getWorkspaceTypeLabel = (type) => {
  const labels = {
    personal: 'Personal',
    business: 'Empresa',
    family: 'Familia',
    team: 'Equipo',
    project: 'Proyecto'
  }
  return labels[type] || 'General'
}
</script>