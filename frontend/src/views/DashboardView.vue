<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">
          Bienvenido de nuevo, {{ authStore.user?.name }}
        </p>
      </div>
      
      <div class="flex space-x-3">
        <button
          @click="showGlobalSearch = true"
          class="btn-secondary"
        >
          <MagnifyingGlassIcon class="w-4 h-4 mr-2" />
          Buscar
        </button>
        
        <button
          @click="showCustomization = true"
          class="btn-secondary"
        >
          <CogIcon class="w-4 h-4 mr-2" />
          Personalizar
        </button>
        
        <button
          @click="showCreateWorkspace = true"
          class="btn-primary"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Nuevo Workspace
        </button>
      </div>
    </div>

    <!-- Quick stats -->
    <div v-if="dashboardConfig.settings.showQuickStats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Events today -->
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-blue-100">
            <CalendarIcon class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Eventos hoy</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.eventsToday }}</p>
          </div>
        </div>
      </div>

      <!-- Recent notes -->
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-yellow-100">
            <DocumentTextIcon class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Notas nuevas</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.newNotes }}</p>
          </div>
        </div>
      </div>

      <!-- Balance -->
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-green-100">
            <CurrencyDollarIcon class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Balance</p>
            <p class="text-2xl font-bold text-gray-900">{{ appStore.formatCurrency(stats.balance) }}</p>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-purple-100">
            <ChatBubbleLeftIcon class="w-6 h-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Mensajes</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.unreadMessages }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard widgets -->
    <div 
      class="grid gap-6"
      :class="gridClasses"
    >
      <!-- Dynamic widgets based on configuration -->
      <component
        v-for="widget in enabledWidgets"
        :key="widget.id"
        :is="widgetComponents[widget.id]"
      />
    </div>

    <!-- Modals -->
    <GlobalSearchModal
      :is-open="showGlobalSearch"
      @close="showGlobalSearch = false"
    />
    
    <CreateWorkspaceModal
      :is-open="showCreateWorkspace"
      @close="showCreateWorkspace = false"
      @created="handleWorkspaceCreated"
    />
    
    <DashboardCustomizationModal
      :is-open="showCustomization"
      @close="showCustomization = false"
      @save="handleDashboardConfigSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import {
  CalendarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

// Components
import UpcomingEventsWidget from '@/components/widgets/UpcomingEventsWidget.vue'
import FinancialSummaryWidget from '@/components/widgets/FinancialSummaryWidget.vue'
import RecentNotesWidget from '@/components/widgets/RecentNotesWidget.vue'
import WeatherWidget from '@/components/widgets/WeatherWidget.vue'
import TasksWidget from '@/components/widgets/TasksWidget.vue'
import ActivityFeedWidget from '@/components/widgets/ActivityFeedWidget.vue'

// Modals
import GlobalSearchModal from '@/components/modals/GlobalSearchModal.vue'
import CreateWorkspaceModal from '@/components/modals/CreateWorkspaceModal.vue'
import DashboardCustomizationModal from '@/components/modals/DashboardCustomizationModal.vue'

const authStore = useAuthStore()
const appStore = useAppStore()

const showGlobalSearch = ref(false)
const showCreateWorkspace = ref(false)
const showCustomization = ref(false)

// Widget components mapping
const widgetComponents = {
  'upcoming-events': UpcomingEventsWidget,
  'financial-summary': FinancialSummaryWidget,
  'recent-notes': RecentNotesWidget,
  'weather': WeatherWidget,
  'tasks': TasksWidget,
  'activity-feed': ActivityFeedWidget
}

// Dashboard configuration
const dashboardConfig = ref({
  widgets: [
    { id: 'upcoming-events', enabled: true, order: 1 },
    { id: 'financial-summary', enabled: true, order: 2 },
    { id: 'recent-notes', enabled: true, order: 3 },
    { id: 'weather', enabled: true, order: 4 },
    { id: 'tasks', enabled: true, order: 5 },
    { id: 'activity-feed', enabled: true, order: 6 }
  ],
  settings: {
    gridColumns: '2',
    compactMode: false,
    showQuickStats: true,
    theme: 'default'
  }
})

// Quick stats
const stats = ref({
  eventsToday: 3,
  newNotes: 7,
  balance: 15420.50,
  unreadMessages: 12
})

// Computed properties
const enabledWidgets = computed(() => {
  return dashboardConfig.value.widgets
    .filter(widget => widget.enabled)
    .sort((a, b) => a.order - b.order)
})

const gridClasses = computed(() => {
  const columns = dashboardConfig.value.settings.gridColumns
  const compact = dashboardConfig.value.settings.compactMode
  
  let classes = 'grid '
  
  switch (columns) {
    case '1':
      classes += 'grid-cols-1 '
      break
    case '2':
      classes += 'grid-cols-1 lg:grid-cols-2 '
      break
    case '3':
      classes += 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 '
      break
    default:
      classes += 'grid-cols-1 lg:grid-cols-2 '
  }
  
  classes += compact ? 'gap-4' : 'gap-6'
  
  return classes
})

// Methods
const handleWorkspaceCreated = (workspace) => {
  appStore.showToast(`Workspace "${workspace.name}" creado exitosamente`, 'success')
  // Aquí podrías recargar datos o actualizar la UI
}

const handleDashboardConfigSave = (config) => {
  dashboardConfig.value = config
  appStore.showToast('Configuración del dashboard actualizada', 'success')
}

const loadDashboardConfig = () => {
  const saved = localStorage.getItem('dashboardConfig')
  if (saved) {
    try {
      const config = JSON.parse(saved)
      dashboardConfig.value = { ...dashboardConfig.value, ...config }
    } catch (error) {
      console.error('Error loading dashboard config:', error)
    }
  }
}

const loadStats = () => {
  // Simular carga de estadísticas
  // En una app real, esto vendría de una API
  stats.value = {
    eventsToday: Math.floor(Math.random() * 10),
    newNotes: Math.floor(Math.random() * 20),
    balance: Math.random() * 50000,
    unreadMessages: Math.floor(Math.random() * 30)
  }
}

onMounted(() => {
  loadDashboardConfig()
  loadStats()
})
</script>