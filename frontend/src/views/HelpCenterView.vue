<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Help header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <button
              @click="$router.back()"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors mr-4"
            >
              <ArrowLeftIcon class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Centro de ayuda</h1>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="showFeedbackModal = true"
              class="btn-secondary"
            >
              <ChatBubbleLeftIcon class="w-4 h-4 mr-2" />
              Enviar feedback
            </button>
            
            <button
              @click="contactSupport"
              class="btn-primary"
            >
              <LifebuoyIcon class="w-4 h-4 mr-2" />
              Contactar soporte
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search help -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-8">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">¿En qué podemos ayudarte?</h2>
            <p class="text-gray-600 mb-6">Busca respuestas a tus preguntas o explora nuestras guías</p>
            
            <div class="max-w-2xl mx-auto relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar en la ayuda..."
                class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                @input="searchHelp"
              />
              <MagnifyingGlassIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              
              <!-- Search suggestions -->
              <div
                v-if="searchSuggestions.length > 0"
                class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                <div
                  v-for="suggestion in searchSuggestions"
                  :key="suggestion.id"
                  class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  @click="selectSuggestion(suggestion)"
                >
                  <div class="font-medium text-gray-900">{{ suggestion.title }}</div>
                  <div class="text-sm text-gray-600">{{ suggestion.summary }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Help categories sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Categorías</h3>
            </div>
            <nav class="px-2 py-4">
              <button
                v-for="category in helpCategories"
                :key="category.key"
                class="help-nav-item"
                :class="{ 'active': activeCategory === category.key }"
                @click="activeCategory = category.key"
              >
                <component :is="category.icon" class="w-5 h-5 mr-3" />
                {{ category.name }}
                <span class="ml-auto text-sm text-gray-500">{{ category.articleCount }}</span>
              </button>
            </nav>
          </div>

          <!-- Quick actions -->
          <div class="bg-white shadow rounded-lg mt-6">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Acciones rápidas</h3>
            </div>
            <div class="px-6 py-4 space-y-3">
              <button
                @click="openVideoTutorials"
                class="quick-action-btn"
              >
                <PlayIcon class="w-5 h-5 text-blue-600" />
                <span>Video tutoriales</span>
              </button>
              
              <button
                @click="downloadGuides"
                class="quick-action-btn"
              >
                <DocumentArrowDownIcon class="w-5 h-5 text-green-600" />
                <span>Descargar guías PDF</span>
              </button>
              
              <button
                @click="showKeyboardShortcuts = true"
                class="quick-action-btn"
              >
                <CommandLineIcon class="w-5 h-5 text-purple-600" />
                <span>Atajos de teclado</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Help content -->
        <div class="lg:col-span-3">
          <!-- Popular articles -->
          <div v-if="activeCategory === 'all'" class="space-y-8">
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Artículos populares</h3>
              </div>
              <div class="px-6 py-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <article
                    v-for="article in popularArticles"
                    :key="article.id"
                    class="help-article-card"
                    @click="openArticle(article)"
                  >
                    <div class="flex items-start space-x-3">
                      <component :is="article.icon" class="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900 mb-1">{{ article.title }}</h4>
                        <p class="text-sm text-gray-600 mb-2">{{ article.summary }}</p>
                        <div class="flex items-center text-xs text-gray-500">
                          <span>{{ article.views }} visualizaciones</span>
                          <span class="mx-2">•</span>
                          <span>{{ article.readTime }} min lectura</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>

            <!-- Getting started -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Primeros pasos</h3>
              </div>
              <div class="px-6 py-4">
                <div class="space-y-4">
                  <div
                    v-for="(step, index) in gettingStartedSteps"
                    :key="step.id"
                    class="getting-started-step"
                    @click="openStep(step)"
                  >
                    <div class="flex items-center space-x-4">
                      <div class="step-number">{{ index + 1 }}</div>
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900">{{ step.title }}</h4>
                        <p class="text-sm text-gray-600">{{ step.description }}</p>
                      </div>
                      <ChevronRightIcon class="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Category content -->
          <div v-else class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">
                {{ getCategoryName(activeCategory) }}
              </h3>
            </div>
            <div class="px-6 py-4">
              <div class="space-y-4">
                <article
                  v-for="article in getCategoryArticles(activeCategory)"
                  :key="article.id"
                  class="help-article-item"
                  @click="openArticle(article)"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900 mb-1">{{ article.title }}</h4>
                      <p class="text-sm text-gray-600 mb-2">{{ article.summary }}</p>
                      <div class="flex items-center text-xs text-gray-500">
                        <span>{{ article.views }} visualizaciones</span>
                        <span class="mx-2">•</span>
                        <span>{{ article.readTime }} min lectura</span>
                        <span class="mx-2">•</span>
                        <span>{{ article.lastUpdated }}</span>
                      </div>
                    </div>
                    <ChevronRightIcon class="w-5 h-5 text-gray-400 ml-4" />
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Article modal -->
    <div
      v-if="selectedArticle"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-8 mx-auto p-0 border max-w-4xl shadow-lg rounded-lg bg-white mb-8">
        <!-- Article header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ selectedArticle.title }}</h2>
            <div class="flex items-center text-sm text-gray-500 mt-1">
              <span>{{ selectedArticle.readTime }} min lectura</span>
              <span class="mx-2">•</span>
              <span>Actualizado {{ selectedArticle.lastUpdated }}</span>
            </div>
          </div>
          <button
            @click="selectedArticle = null"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Article content -->
        <div class="px-6 py-6">
          <div class="prose max-w-none" v-html="selectedArticle.content"></div>
        </div>

        <!-- Article footer -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">¿Te fue útil este artículo?</span>
              <div class="flex space-x-2">
                <button
                  @click="rateArticle(selectedArticle, true)"
                  class="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                >
                  <HandThumbUpIcon class="w-4 h-4" />
                </button>
                <button
                  @click="rateArticle(selectedArticle, false)"
                  class="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                >
                  <HandThumbDownIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              @click="shareArticle(selectedArticle)"
              class="btn-secondary-sm"
            >
              <ShareIcon class="w-4 h-4 mr-1" />
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Keyboard shortcuts modal -->
    <div
      v-if="showKeyboardShortcuts"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-0 border max-w-2xl shadow-lg rounded-lg bg-white">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Atajos de teclado</h3>
          <button
            @click="showKeyboardShortcuts = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="space-y-6">
            <div
              v-for="section in keyboardShortcuts"
              :key="section.category"
            >
              <h4 class="font-medium text-gray-900 mb-3">{{ section.category }}</h4>
              <div class="space-y-2">
                <div
                  v-for="shortcut in section.shortcuts"
                  :key="shortcut.action"
                  class="flex items-center justify-between py-2"
                >
                  <span class="text-sm text-gray-600">{{ shortcut.action }}</span>
                  <div class="flex space-x-1">
                    <kbd
                      v-for="key in shortcut.keys"
                      :key="key"
                      class="keyboard-key"
                    >
                      {{ key }}
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback modal -->
    <div
      v-if="showFeedbackModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-0 border max-w-lg shadow-lg rounded-lg bg-white">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Enviar feedback</h3>
          <button
            @click="showFeedbackModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="submitFeedback">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de feedback</label>
                <select v-model="feedback.type" class="feedback-input">
                  <option value="bug">Reportar error</option>
                  <option value="feature">Solicitar función</option>
                  <option value="improvement">Sugerir mejora</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                <textarea
                  v-model="feedback.message"
                  rows="4"
                  placeholder="Describe tu feedback en detalle..."
                  class="feedback-input"
                  required
                ></textarea>
              </div>
              
              <div class="flex items-center">
                <input
                  v-model="feedback.includeEmail"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">
                  Incluir mi email para seguimiento
                </label>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="showFeedbackModal = false"
                class="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmittingFeedback"
                class="btn-primary"
              >
                <span v-if="isSubmittingFeedback">Enviando...</span>
                <span v-else>Enviar feedback</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  LifebuoyIcon,
  XMarkIcon,
  ChevronRightIcon,
  PlayIcon,
  DocumentArrowDownIcon,
  CommandLineIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ShareIcon,
  BookOpenIcon,
  CalendarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CogIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const appStore = useAppStore()

const searchQuery = ref('')
const activeCategory = ref('all')
const selectedArticle = ref(null)
const showKeyboardShortcuts = ref(false)
const showFeedbackModal = ref(false)
const isSubmittingFeedback = ref(false)
const searchSuggestions = ref([])

const feedback = ref({
  type: 'improvement',
  message: '',
  includeEmail: true
})

const helpCategories = [
  { key: 'all', name: 'Todos', icon: BookOpenIcon, articleCount: 47 },
  { key: 'getting-started', name: 'Primeros pasos', icon: QuestionMarkCircleIcon, articleCount: 8 },
  { key: 'calendar', name: 'Calendario', icon: CalendarIcon, articleCount: 12 },
  { key: 'notes', name: 'Notas', icon: DocumentTextIcon, articleCount: 9 },
  { key: 'finance', name: 'Finanzas', icon: BanknotesIcon, articleCount: 7 },
  { key: 'settings', name: 'Configuración', icon: CogIcon, articleCount: 6 },
  { key: 'security', name: 'Seguridad', icon: ShieldCheckIcon, articleCount: 5 }
]

const popularArticles = [
  {
    id: 1,
    title: 'Cómo crear tu primer evento',
    summary: 'Aprende a crear y gestionar eventos en el calendario',
    category: 'calendar',
    icon: CalendarIcon,
    views: 1234,
    readTime: 3,
    lastUpdated: '2 días',
    content: `
      <h3>Creando tu primer evento</h3>
      <p>Crear eventos en el calendario es muy sencillo. Sigue estos pasos:</p>
      <ol>
        <li>Navega a la vista de calendario</li>
        <li>Haz clic en el botón "Nuevo evento" o directamente en una fecha</li>
        <li>Completa la información del evento</li>
        <li>Configura recordatorios si es necesario</li>
        <li>Guarda el evento</li>
      </ol>
      <h3>Consejos útiles</h3>
      <ul>
        <li>Usa colores para categorizar tus eventos</li>
        <li>Configura recordatorios para no olvidar eventos importantes</li>
        <li>Invita a otros usuarios si necesitas colaboración</li>
      </ul>
    `
  },
  {
    id: 2,
    title: 'Gestión de notas colaborativas',
    summary: 'Trabaja en equipo con notas compartidas',
    category: 'notes',
    icon: DocumentTextIcon,
    views: 987,
    readTime: 5,
    lastUpdated: '1 semana',
    content: `
      <h3>Colaboración en notas</h3>
      <p>Las notas colaborativas te permiten trabajar en equipo de forma eficiente.</p>
      <h3>Funciones principales</h3>
      <ul>
        <li>Edición en tiempo real</li>
        <li>Comentarios y sugerencias</li>
        <li>Control de versiones</li>
        <li>Gestión de permisos</li>
      </ul>
    `
  },
  {
    id: 3,
    title: 'Configurar notificaciones',
    summary: 'Personaliza cómo y cuándo recibir alertas',
    category: 'settings',
    icon: CogIcon,
    views: 765,
    readTime: 4,
    lastUpdated: '3 días',
    content: `
      <h3>Configuración de notificaciones</h3>
      <p>Personaliza tus notificaciones para mantenerte informado sin ser molestado.</p>
      <h3>Tipos de notificaciones</h3>
      <ul>
        <li>Eventos del calendario</li>
        <li>Notas compartidas</li>
        <li>Mensajes de chat</li>
        <li>Transacciones financieras</li>
      </ul>
    `
  },
  {
    id: 4,
    title: 'Exportar datos',
    summary: 'Cómo hacer una copia de seguridad de tu información',
    category: 'settings',
    icon: DocumentArrowDownIcon,
    views: 543,
    readTime: 6,
    lastUpdated: '5 días',
    content: `
      <h3>Exportación de datos</h3>
      <p>Puedes exportar todos tus datos en varios formatos.</p>
      <h3>Formatos disponibles</h3>
      <ul>
        <li>JSON - Para desarrolladores</li>
        <li>CSV - Para hojas de cálculo</li>
        <li>PDF - Para archivo</li>
        <li>XML - Para intercambio</li>
      </ul>
    `
  }
]

const gettingStartedSteps = [
  {
    id: 1,
    title: 'Configurar tu perfil',
    description: 'Personaliza tu información y preferencias'
  },
  {
    id: 2,
    title: 'Crear tu primer workspace',
    description: 'Organiza tu trabajo en espacios dedicados'
  },
  {
    id: 3,
    title: 'Invitar miembros del equipo',
    description: 'Colabora con otros usuarios'
  },
  {
    id: 4,
    title: 'Configurar notificaciones',
    description: 'Personaliza cómo recibir alertas'
  }
]

const keyboardShortcuts = [
  {
    category: 'Navegación general',
    shortcuts: [
      { action: 'Búsqueda global', keys: ['Ctrl', 'K'] },
      { action: 'Ir a calendario', keys: ['G', 'C'] },
      { action: 'Ir a notas', keys: ['G', 'N'] },
      { action: 'Ir a finanzas', keys: ['G', 'F'] }
    ]
  },
  {
    category: 'Calendario',
    shortcuts: [
      { action: 'Nuevo evento', keys: ['C'] },
      { action: 'Vista día', keys: ['D'] },
      { action: 'Vista semana', keys: ['W'] },
      { action: 'Vista mes', keys: ['M'] }
    ]
  },
  {
    category: 'Notas',
    shortcuts: [
      { action: 'Nueva nota', keys: ['N'] },
      { action: 'Guardar nota', keys: ['Ctrl', 'S'] },
      { action: 'Formato negrita', keys: ['Ctrl', 'B'] },
      { action: 'Formato cursiva', keys: ['Ctrl', 'I'] }
    ]
  }
]

const allArticles = [
  ...popularArticles,
  {
    id: 5,
    title: 'Configurar autenticación de dos factores',
    summary: 'Mejora la seguridad de tu cuenta',
    category: 'security',
    icon: ShieldCheckIcon,
    views: 432,
    readTime: 4,
    lastUpdated: '1 semana',
    content: '<h3>Seguridad adicional</h3><p>La autenticación de dos factores añade una capa extra de seguridad...</p>'
  },
  {
    id: 6,
    title: 'Importar datos desde otras aplicaciones',
    summary: 'Migra tu información fácilmente',
    category: 'getting-started',
    icon: DocumentArrowDownIcon,
    views: 321,
    readTime: 7,
    lastUpdated: '2 semanas',
    content: '<h3>Migración de datos</h3><p>Puedes importar datos desde múltiples fuentes...</p>'
  }
]

const getCategoryName = (categoryKey) => {
  const category = helpCategories.find(c => c.key === categoryKey)
  return category ? category.name : ''
}

const getCategoryArticles = (categoryKey) => {
  if (categoryKey === 'all') return allArticles
  return allArticles.filter(article => article.category === categoryKey)
}

const searchHelp = () => {
  if (searchQuery.value.length < 2) {
    searchSuggestions.value = []
    return
  }

  const filtered = allArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).slice(0, 5)

  searchSuggestions.value = filtered
}

const selectSuggestion = (suggestion) => {
  searchSuggestions.value = []
  searchQuery.value = ''
  openArticle(suggestion)
}

const openArticle = (article) => {
  selectedArticle.value = article
  
  // Track view
  article.views += 1
}

const openStep = (step) => {
  appStore.showToast(`Abriendo: ${step.title}`, 'info')
}

const rateArticle = (article, helpful) => {
  appStore.showToast(
    helpful ? 'Gracias por tu feedback positivo' : 'Gracias por tu feedback, lo mejoraremos',
    helpful ? 'success' : 'info'
  )
}

const shareArticle = (article) => {
  if (navigator.share) {
    navigator.share({
      title: article.title,
      text: article.summary,
      url: window.location.href
    })
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    appStore.showToast('Enlace copiado al portapapeles', 'success')
  }
}

const openVideoTutorials = () => {
  appStore.showToast('Abriendo video tutoriales...', 'info')
}

const downloadGuides = () => {
  appStore.showToast('Descargando guías PDF...', 'info')
}

const contactSupport = () => {
  appStore.showToast('Abriendo canal de soporte...', 'info')
}

const submitFeedback = async () => {
  isSubmittingFeedback.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    appStore.showToast('Feedback enviado exitosamente', 'success')
    showFeedbackModal.value = false
    
    // Reset form
    feedback.value = {
      type: 'improvement',
      message: '',
      includeEmail: true
    }
  } catch (error) {
    appStore.showToast('Error al enviar feedback', 'error')
  } finally {
    isSubmittingFeedback.value = false
  }
}
</script>

<style scoped>
.help-nav-item {
  @apply w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors;
}

.help-nav-item.active {
  @apply bg-indigo-100 text-indigo-700;
}

.quick-action-btn {
  @apply w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors;
}

.help-article-card {
  @apply p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all;
}

.help-article-item {
  @apply p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors last:border-b-0;
}

.getting-started-step {
  @apply p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all;
}

.step-number {
  @apply w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0;
}

.keyboard-key {
  @apply inline-flex items-center px-2 py-1 rounded bg-gray-100 border border-gray-300 text-xs font-mono text-gray-600;
}

.feedback-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500;
}

.prose h3 {
  @apply text-lg font-semibold text-gray-900 mt-6 mb-3;
}

.prose p {
  @apply text-gray-700 mb-4;
}

.prose ul, .prose ol {
  @apply text-gray-700 mb-4 pl-6;
}

.prose li {
  @apply mb-2;
}
</style>