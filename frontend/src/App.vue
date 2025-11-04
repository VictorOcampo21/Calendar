<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation/Sidebar Component -->
    <div v-if="authStore.isAuthenticated" class="flex h-screen">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg border-r border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-xl font-bold text-gray-900 flex items-center">
            📅 <span class="ml-2">AgendaFinanciera</span>
          </h1>
          <p class="text-sm text-gray-500 mt-1">{{ authStore.currentWorkspace?.name || 'Demo Workspace' }}</p>
        </div>
        
        <nav class="p-4 space-y-2">
          <router-link 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.href"
            class="sidebar-link"
            :class="isActiveRoute(item.href) ? 'sidebar-link-active' : 'sidebar-link-inactive'"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </router-link>
          
          <!-- Divider -->
          <div class="border-t border-gray-200 my-4"></div>
          
          <!-- Global features -->
          <router-link 
            v-for="item in globalNavigation" 
            :key="item.name"
            :to="item.href"
            class="sidebar-link"
            :class="isActiveRoute(item.href) ? 'sidebar-link-active' : 'sidebar-link-inactive'"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </router-link>
        </nav>
        
        <!-- User Menu at bottom -->
        <div class="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div class="flex items-center">
            <img 
              :src="authStore.user.avatar" 
              :alt="authStore.user.name"
              class="w-8 h-8 rounded-full"
            >
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700">{{ authStore.user.name }}</p>
              <button 
                @click="logout"
                class="text-xs text-gray-500 hover:text-gray-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>
      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <!-- Global Search Bar -->
        <header class="bg-white border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex-1 max-w-lg">
              <div class="relative">
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en todo (Cmd+K)"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  @keydown.meta.k="openGlobalSearch"
                />
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button 
                @click="showNotifications = true"
                class="relative p-2 text-gray-400 hover:text-gray-600"
              >
                <BellIcon class="w-6 h-6" />
                <span v-if="unreadNotifications > 0" class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <!-- Settings -->
              <router-link 
                to="/settings"
                class="p-2 text-gray-400 hover:text-gray-600"
              >
                <CogIcon class="w-6 h-6" />
              </router-link>
              
              <!-- Privacy Mode Toggle -->
              <button 
                @click="togglePrivacyMode"
                :class="privacyMode ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ privacyMode ? '🔒 Privado' : '👁️ Normal' }}
              </button>
            </div>
          </div>
        </header>
        
        <!-- Router View -->
        <div class="p-6">
          <router-view />
        </div>
      </main>
    </div>
    
    <!-- Auth Views (when not authenticated) -->
    <div v-else class="min-h-screen">
      <router-view />
    </div>
    
    <!-- Global Search Modal -->
    <GlobalSearchModal v-if="showGlobalSearch" @close="showGlobalSearch = false" />
    
    <!-- Notification Center -->
    <NotificationCenter v-if="showNotifications" @close="showNotifications = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import GlobalSearchModal from '@/components/modals/GlobalSearchModal.vue'
import NotificationCenter from '@/components/global/NotificationCenter.vue'

// Icons
import { 
  HomeIcon, 
  CalendarIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  TagIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  BellIcon,
  CogIcon,
  ArrowDownTrayIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()

const showGlobalSearch = ref(false)
const showNotifications = ref(false)

const privacyMode = computed(() => appStore.privacyMode)
const unreadNotifications = computed(() => 3) // Mock unread count

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Calendario', href: '/calendar', icon: CalendarIcon },
  { name: 'Eventos Propuestos', href: '/proposals', icon: UsersIcon },
  { name: 'Chats', href: '/chats', icon: ChatBubbleLeftRightIcon },
  { name: 'Notas', href: '/notes', icon: DocumentTextIcon },
  { name: 'Finanzas', href: '/finance', icon: CurrencyDollarIcon },
  { name: 'Tags & Adjuntos', href: '/tags', icon: TagIcon },
  { name: 'Historial', href: '/history', icon: ClockIcon },
]

const globalNavigation = [
  { name: 'Configuración', href: '/settings', icon: CogIcon },
  { name: 'Exportar datos', href: '/data-export', icon: ArrowDownTrayIcon },
  { name: 'Centro de ayuda', href: '/help', icon: QuestionMarkCircleIcon },
]

const isActiveRoute = (href) => {
  return route.path.startsWith(href)
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const openGlobalSearch = () => {
  showGlobalSearch.value = true
}

const togglePrivacyMode = () => {
  appStore.togglePrivacyMode()
}
</script>