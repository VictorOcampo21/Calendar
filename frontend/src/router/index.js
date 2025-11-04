import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Auth Views
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import WorkspaceSelector from '@/views/auth/WorkspaceSelector.vue'

// Main Views
import DashboardView from '@/views/DashboardView.vue'
import CalendarView from '@/views/CalendarView.vue'
import EventProposalsView from '@/views/proposals/EventProposalsView.vue'
import ChatsView from '@/views/chats/ChatsView.vue'
import NotesView from '@/views/notes/NotesView.vue'
import FinanceView from '@/views/finance/FinanceView.vue'
import TagsView from '@/views/tags/TagsView.vue'
import HistoryView from '@/views/history/HistoryView.vue'
import SettingsView from '@/views/SettingsView.vue'
import DataExportView from '@/views/DataExportView.vue'
import HelpCenterView from '@/views/HelpCenterView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false }
  },
  {
    path: '/workspace-selector',
    name: 'WorkspaceSelector',
    component: WorkspaceSelector,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: CalendarView,
    meta: { requiresAuth: true }
  },
  {
    path: '/proposals',
    name: 'EventProposals',
    component: EventProposalsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/chats',
    name: 'Chats',
    component: ChatsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: NotesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/finance',
    name: 'Finance',
    component: FinanceView,
    meta: { requiresAuth: true }
  },
  {
    path: '/tags',
    name: 'Tags',
    component: TagsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/data-export',
    name: 'DataExport',
    component: DataExportView,
    meta: { requiresAuth: true }
  },
  {
    path: '/help',
    name: 'HelpCenter',
    component: HelpCenterView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Si va al login, siempre permitir
  if (to.path === '/login') {
    next()
  } 
  // Si está autenticado, permitir acceso
  else if (authStore.isAuthenticated) {
    next()
  }
  // Si no está autenticado y no va al login, redirigir al login
  else {
    next('/login')
  }
})

export default router