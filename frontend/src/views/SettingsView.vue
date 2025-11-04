<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Settings header -->
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
            <h1 class="text-xl font-semibold text-gray-900">Configuración</h1>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="exportSettings"
              class="btn-secondary"
            >
              <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
              Exportar configuración
            </button>
            
            <button
              @click="saveAllSettings"
              :disabled="isSaving"
              class="btn-primary"
            >
              <div v-if="isSaving" class="flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2"></div>
                Guardando...
              </div>
              <span v-else>Guardar cambios</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex">
        <!-- Settings sidebar -->
        <div class="w-64 mr-8">
          <nav class="space-y-1">
            <button
              v-for="section in settingSections"
              :key="section.key"
              class="settings-nav-item"
              :class="{ 'active': activeSection === section.key }"
              @click="activeSection = section.key"
            >
              <component :is="section.icon" class="w-5 h-5 mr-3" />
              {{ section.label }}
              <span
                v-if="hasUnsavedChanges(section.key)"
                class="ml-auto w-2 h-2 bg-orange-400 rounded-full"
              ></span>
            </button>
          </nav>
        </div>

        <!-- Settings content -->
        <div class="flex-1">
          <!-- General settings -->
          <div v-if="activeSection === 'general'" class="space-y-6">
            <SettingsCard title="Perfil de usuario" description="Información personal y preferencias básicas">
              <div class="space-y-4">
                <!-- Avatar -->
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <img
                      :src="settings.general.avatar"
                      :alt="settings.general.name"
                      class="w-16 h-16 rounded-full object-cover"
                    />
                    <button
                      @click="uploadAvatar"
                      class="absolute inset-0 w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <CameraIcon class="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900">Foto de perfil</h3>
                    <p class="text-sm text-gray-500">JPG, PNG hasta 2MB</p>
                  </div>
                </div>

                <!-- Personal info -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      v-model="settings.general.name"
                      type="text"
                      class="settings-input"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      v-model="settings.general.email"
                      type="email"
                      class="settings-input"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                    <select v-model="settings.general.language" class="settings-input">
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Zona horaria</label>
                    <select v-model="settings.general.timezone" class="settings-input">
                      <option value="Europe/Madrid">Madrid (CET)</option>
                      <option value="Europe/London">Londres (GMT)</option>
                      <option value="America/New_York">Nueva York (EST)</option>
                      <option value="America/Los_Angeles">Los Ángeles (PST)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Formato de fecha</label>
                  <select v-model="settings.general.dateFormat" class="settings-input">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard title="Configuración de workspace" description="Gestiona tu espacio de trabajo actual">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del workspace</label>
                  <input
                    v-model="settings.general.workspaceName"
                    type="text"
                    class="settings-input"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    v-model="settings.general.workspaceDescription"
                    rows="3"
                    class="settings-input"
                  ></textarea>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="settings.general.workspacePublic"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">
                    Workspace público (visible para otros usuarios)
                  </label>
                </div>
              </div>
            </SettingsCard>
          </div>

          <!-- Appearance settings -->
          <div v-if="activeSection === 'appearance'" class="space-y-6">
            <SettingsCard title="Tema y apariencia" description="Personaliza la apariencia de la aplicación">
              <div class="space-y-6">
                <!-- Theme selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">Tema</label>
                  <div class="grid grid-cols-3 gap-3">
                    <div
                      v-for="theme in themes"
                      :key="theme.key"
                      class="theme-option"
                      :class="{ 'selected': settings.appearance.theme === theme.key }"
                      @click="settings.appearance.theme = theme.key"
                    >
                      <div class="theme-preview" :class="theme.preview"></div>
                      <span class="text-sm font-medium">{{ theme.name }}</span>
                    </div>
                  </div>
                </div>

                <!-- Color scheme -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">Color principal</label>
                  <div class="flex space-x-3">
                    <div
                      v-for="color in colorOptions"
                      :key="color.key"
                      class="color-option"
                      :class="{ 'selected': settings.appearance.primaryColor === color.key }"
                      @click="settings.appearance.primaryColor = color.key"
                    >
                      <div
                        class="w-8 h-8 rounded-full"
                        :style="{ backgroundColor: color.value }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Layout options -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Sidebar compacta</label>
                      <p class="text-sm text-gray-500">Reduce el tamaño de la barra lateral</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        v-model="settings.appearance.compactSidebar"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="toggle-slider"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Animaciones reducidas</label>
                      <p class="text-sm text-gray-500">Reduce las animaciones para mejor rendimiento</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        v-model="settings.appearance.reducedAnimations"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="toggle-slider"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Modo de alto contraste</label>
                      <p class="text-sm text-gray-500">Mejora la legibilidad</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        v-model="settings.appearance.highContrast"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="toggle-slider"></div>
                    </label>
                  </div>
                </div>

                <!-- Font settings -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tamaño de fuente</label>
                    <div class="flex items-center space-x-4">
                      <span class="text-sm text-gray-500">Pequeño</span>
                      <input
                        v-model="settings.appearance.fontSize"
                        type="range"
                        min="12"
                        max="20"
                        step="1"
                        class="flex-1"
                      />
                      <span class="text-sm text-gray-500">Grande</span>
                      <span class="text-sm font-medium text-gray-900 w-8">{{ settings.appearance.fontSize }}px</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Familia de fuente</label>
                    <select v-model="settings.appearance.fontFamily" class="settings-input">
                      <option value="system">Sistema</option>
                      <option value="inter">Inter</option>
                      <option value="roboto">Roboto</option>
                      <option value="open-sans">Open Sans</option>
                    </select>
                  </div>
                </div>
              </div>
            </SettingsCard>
          </div>

          <!-- Notifications settings -->
          <div v-if="activeSection === 'notifications'" class="space-y-6">
            <SettingsCard title="Configuración de notificaciones" description="Gestiona cómo y cuándo recibir notificaciones">
              <div class="space-y-6">
                <!-- General notification settings -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Notificaciones push</label>
                      <p class="text-sm text-gray-500">Recibir notificaciones del navegador</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        v-model="settings.notifications.pushEnabled"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="toggle-slider"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Sonidos</label>
                      <p class="text-sm text-gray-500">Reproducir sonidos para notificaciones</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        v-model="settings.notifications.soundEnabled"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="toggle-slider"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Modo no molestar</label>
                      <p class="text-sm text-gray-500">Silenciar notificaciones temporalmente</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        v-model="settings.notifications.doNotDisturb"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="toggle-slider"></div>
                    </label>
                  </div>
                </div>

                <!-- Notification types -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Tipos de notificaciones</h4>
                  <div class="space-y-3">
                    <div
                      v-for="type in notificationTypes"
                      :key="type.key"
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div class="flex items-center space-x-3">
                        <component :is="type.icon" class="w-5 h-5 text-gray-400" />
                        <div>
                          <label class="text-sm font-medium text-gray-900">{{ type.label }}</label>
                          <p class="text-sm text-gray-500">{{ type.description }}</p>
                        </div>
                      </div>
                      <label class="toggle-switch">
                        <input
                          v-model="settings.notifications.types[type.key]"
                          type="checkbox"
                          class="sr-only peer"
                        />
                        <div class="toggle-slider"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Quiet hours -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Horario silencioso</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                      <input
                        v-model="settings.notifications.quietHours.start"
                        type="time"
                        class="settings-input"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                      <input
                        v-model="settings.notifications.quietHours.end"
                        type="time"
                        class="settings-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SettingsCard>
          </div>

          <!-- Privacy & Security -->
          <div v-if="activeSection === 'privacy'" class="space-y-6">
            <SettingsCard title="Privacidad y seguridad" description="Controla tu privacidad y configuración de seguridad">
              <div class="space-y-6">
                <!-- Privacy settings -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Perfil público</label>
                      <p class="text-sm text-gray-500">Permitir que otros usuarios vean tu perfil</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        v-model="settings.privacy.publicProfile"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="toggle-slider"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Estado en línea</label>
                      <p class="text-sm text-gray-500">Mostrar cuando estás activo</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        v-model="settings.privacy.showOnlineStatus"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="toggle-slider"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-gray-900">Analíticas de uso</label>
                      <p class="text-sm text-gray-500">Ayudar a mejorar la aplicación compartiendo datos de uso</p>
                    </div>
                    <label class="toggle-switch">
                      <input
                        v-model="settings.privacy.analytics"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div class="toggle-slider"></div>
                    </label>
                  </div>
                </div>

                <!-- Security settings -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Seguridad</h4>
                  <div class="space-y-3">
                    <button class="security-action-btn">
                      <ShieldCheckIcon class="w-5 h-5 text-green-600" />
                      <div class="text-left">
                        <div class="text-sm font-medium text-gray-900">Autenticación de dos factores</div>
                        <div class="text-sm text-gray-500">Activada - Configurar</div>
                      </div>
                    </button>

                    <button class="security-action-btn">
                      <KeyIcon class="w-5 h-5 text-blue-600" />
                      <div class="text-left">
                        <div class="text-sm font-medium text-gray-900">Cambiar contraseña</div>
                        <div class="text-sm text-gray-500">Última actualización hace 30 días</div>
                      </div>
                    </button>

                    <button class="security-action-btn">
                      <DevicePhoneMobileIcon class="w-5 h-5 text-purple-600" />
                      <div class="text-left">
                        <div class="text-sm font-medium text-gray-900">Dispositivos conectados</div>
                        <div class="text-sm text-gray-500">3 dispositivos activos</div>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Data management -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Gestión de datos</h4>
                  <div class="space-y-3">
                    <button
                      @click="exportAllData"
                      class="data-action-btn"
                    >
                      <ArrowDownTrayIcon class="w-5 h-5 text-indigo-600" />
                      <div class="text-left">
                        <div class="text-sm font-medium text-gray-900">Exportar todos los datos</div>
                        <div class="text-sm text-gray-500">Descargar una copia de toda tu información</div>
                      </div>
                    </button>

                    <button
                      @click="deleteAllData"
                      class="data-action-btn border-red-200 hover:bg-red-50"
                    >
                      <TrashIcon class="w-5 h-5 text-red-600" />
                      <div class="text-left">
                        <div class="text-sm font-medium text-red-900">Eliminar cuenta</div>
                        <div class="text-sm text-red-600">Permanentemente eliminar tu cuenta y todos los datos</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </SettingsCard>
          </div>

          <!-- Integration settings -->
          <div v-if="activeSection === 'integrations'" class="space-y-6">
            <SettingsCard title="Integraciones" description="Conecta con servicios externos y APIs">
              <div class="space-y-6">
                <div
                  v-for="integration in integrations"
                  :key="integration.key"
                  class="integration-item"
                >
                  <div class="flex items-center space-x-4">
                    <img
                      :src="integration.logo"
                      :alt="integration.name"
                      class="w-10 h-10 rounded-lg"
                    />
                    <div class="flex-1">
                      <h4 class="text-sm font-medium text-gray-900">{{ integration.name }}</h4>
                      <p class="text-sm text-gray-500">{{ integration.description }}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="integration.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                      >
                        {{ integration.connected ? 'Conectado' : 'Desconectado' }}
                      </span>
                      <button
                        @click="toggleIntegration(integration)"
                        class="btn-secondary-sm"
                      >
                        {{ integration.connected ? 'Desconectar' : 'Conectar' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsCard>
          </div>

          <!-- Advanced settings -->
          <div v-if="activeSection === 'advanced'" class="space-y-6">
            <SettingsCard title="Configuración avanzada" description="Opciones para usuarios avanzados">
              <div class="space-y-6">
                <!-- Developer options -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Opciones de desarrollador</h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-900">Modo desarrollador</label>
                        <p class="text-sm text-gray-500">Habilitar funciones experimentales</p>
                      </div>
                      <label class="toggle-switch">
                        <input
                          v-model="settings.advanced.developerMode"
                          type="checkbox"
                          class="sr-only peer"
                        />
                        <div class="toggle-slider"></div>
                      </label>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-900">Debug mode</label>
                        <p class="text-sm text-gray-500">Mostrar información de depuración</p>
                      </div>
                      <label class="toggle-switch">
                        <input
                          v-model="settings.advanced.debugMode"
                          type="checkbox"
                          class="sr-only peer"
                        />
                        <div class="toggle-slider"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Performance settings -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Rendimiento</h4>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Límite de elementos por página
                      </label>
                      <select v-model="settings.advanced.itemsPerPage" class="settings-input">
                        <option :value="10">10</option>
                        <option :value="25">25</option>
                        <option :value="50">50</option>
                        <option :value="100">100</option>
                      </select>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-gray-900">Precarga de datos</label>
                        <p class="text-sm text-gray-500">Cargar datos antes de navegar</p>
                      </div>
                      <label class="toggle-switch">
                        <input
                          v-model="settings.advanced.preloadData"
                          type="checkbox"
                          class="sr-only peer"
                        />
                        <div class="toggle-slider"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Storage management -->
                <div>
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Almacenamiento</h4>
                  <div class="space-y-3">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Caché de la aplicación</span>
                        <span class="text-sm text-gray-600">45.2 MB</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-indigo-600 h-2 rounded-full" style="width: 35%"></div>
                      </div>
                    </div>

                    <button
                      @click="clearCache"
                      class="btn-secondary w-full"
                    >
                      Limpiar caché
                    </button>
                  </div>
                </div>
              </div>
            </SettingsCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  UserIcon,
  PaintBrushIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  PuzzlePieceIcon,
  CameraIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  TrashIcon,
  CalendarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChatBubbleLeftIcon
} from '@heroicons/vue/24/outline'

// Components
import SettingsCard from '@/components/global/SettingsCard.vue'

const router = useRouter()
const appStore = useAppStore()

const activeSection = ref('general')
const isSaving = ref(false)

const settingSections = [
  { key: 'general', label: 'General', icon: UserIcon },
  { key: 'appearance', label: 'Apariencia', icon: PaintBrushIcon },
  { key: 'notifications', label: 'Notificaciones', icon: BellIcon },
  { key: 'privacy', label: 'Privacidad', icon: ShieldCheckIcon },
  { key: 'integrations', label: 'Integraciones', icon: PuzzlePieceIcon },
  { key: 'advanced', label: 'Avanzado', icon: CogIcon }
]

const themes = [
  { key: 'light', name: 'Claro', preview: 'bg-white border-2 border-gray-300' },
  { key: 'dark', name: 'Oscuro', preview: 'bg-gray-900 border-2 border-gray-700' },
  { key: 'system', name: 'Sistema', preview: 'bg-gradient-to-r from-white to-gray-900 border-2 border-gray-300' }
]

const colorOptions = [
  { key: 'indigo', value: '#6366F1' },
  { key: 'blue', value: '#3B82F6' },
  { key: 'green', value: '#10B981' },
  { key: 'purple', value: '#8B5CF6' },
  { key: 'pink', value: '#EC4899' },
  { key: 'orange', value: '#F59E0B' }
]

const notificationTypes = [
  {
    key: 'events',
    label: 'Eventos del calendario',
    description: 'Recordatorios y notificaciones de eventos',
    icon: CalendarIcon
  },
  {
    key: 'notes',
    label: 'Notas compartidas',
    description: 'Cuando alguien comparte una nota contigo',
    icon: DocumentTextIcon
  },
  {
    key: 'finance',
    label: 'Transacciones financieras',
    description: 'Nuevas transacciones y alertas de presupuesto',
    icon: BanknotesIcon
  },
  {
    key: 'chat',
    label: 'Mensajes de chat',
    description: 'Nuevos mensajes y menciones',
    icon: ChatBubbleLeftIcon
  }
]

const integrations = ref([
  {
    key: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sincronizar eventos con Google Calendar',
    logo: 'https://developers.google.com/calendar/images/calendar_icon.png',
    connected: false
  },
  {
    key: 'slack',
    name: 'Slack',
    description: 'Recibir notificaciones en Slack',
    logo: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png',
    connected: true
  },
  {
    key: 'dropbox',
    name: 'Dropbox',
    description: 'Sincronizar archivos con Dropbox',
    logo: 'https://cfl.dropboxstatic.com/static/images/logo_catalog/dropbox_logo_glyph_blue.svg',
    connected: false
  }
])

// Settings state
const settings = reactive({
  general: {
    name: 'Usuario Demo',
    email: 'usuario@demo.com',
    avatar: 'https://ui-avatars.com/api/?name=Usuario+Demo&background=6366f1&color=fff',
    language: 'es',
    timezone: 'Europe/Madrid',
    dateFormat: 'DD/MM/YYYY',
    workspaceName: 'Mi Workspace',
    workspaceDescription: 'Espacio de trabajo personal',
    workspacePublic: false
  },
  appearance: {
    theme: 'light',
    primaryColor: 'indigo',
    compactSidebar: false,
    reducedAnimations: false,
    highContrast: false,
    fontSize: 16,
    fontFamily: 'system'
  },
  notifications: {
    pushEnabled: true,
    soundEnabled: true,
    doNotDisturb: false,
    types: {
      events: true,
      notes: true,
      finance: true,
      chat: true
    },
    quietHours: {
      start: '22:00',
      end: '08:00'
    }
  },
  privacy: {
    publicProfile: false,
    showOnlineStatus: true,
    analytics: true
  },
  advanced: {
    developerMode: false,
    debugMode: false,
    itemsPerPage: 25,
    preloadData: true
  }
})

// Track original settings for change detection
const originalSettings = JSON.parse(JSON.stringify(settings))

const hasUnsavedChanges = (section) => {
  return JSON.stringify(settings[section]) !== JSON.stringify(originalSettings[section])
}

const uploadAvatar = () => {
  // Mock avatar upload
  appStore.showToast('Funcionalidad de carga de avatar', 'info')
}

const saveAllSettings = async () => {
  isSaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update original settings
    Object.assign(originalSettings, JSON.parse(JSON.stringify(settings)))
    
    // Save to localStorage
    localStorage.setItem('app-settings', JSON.stringify(settings))
    
    appStore.showToast('Configuración guardada exitosamente', 'success')
  } catch (error) {
    console.error('Error saving settings:', error)
    appStore.showToast('Error al guardar la configuración', 'error')
  } finally {
    isSaving.value = false
  }
}

const exportSettings = () => {
  const dataStr = JSON.stringify(settings, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'configuracion-app.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  appStore.showToast('Configuración exportada', 'success')
}

const toggleIntegration = (integration) => {
  integration.connected = !integration.connected
  appStore.showToast(
    `${integration.name} ${integration.connected ? 'conectado' : 'desconectado'}`,
    integration.connected ? 'success' : 'info'
  )
}

const exportAllData = () => {
  appStore.showToast('Preparando exportación de datos...', 'info')
  // Mock data export
  setTimeout(() => {
    appStore.showToast('Datos exportados exitosamente', 'success')
  }, 2000)
}

const deleteAllData = () => {
  const confirmed = confirm(
    '¿Estás seguro de que quieres eliminar permanentemente tu cuenta y todos los datos? Esta acción no se puede deshacer.'
  )
  
  if (confirmed) {
    const doubleConfirm = prompt('Escribe "ELIMINAR" para confirmar:')
    if (doubleConfirm === 'ELIMINAR') {
      appStore.showToast('Eliminando cuenta...', 'error')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }
}

const clearCache = () => {
  // Mock cache clearing
  appStore.showToast('Caché limpiada exitosamente', 'success')
}

// Load settings from localStorage on mount
const loadSettings = () => {
  const saved = localStorage.getItem('app-settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      Object.assign(settings, parsed)
      Object.assign(originalSettings, parsed)
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }
}

loadSettings()
</script>

<style scoped>
.settings-nav-item {
  @apply w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors;
}

.settings-nav-item.active {
  @apply bg-indigo-100 text-indigo-700;
}

.settings-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500;
}

.theme-option {
  @apply p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors;
}

.theme-option.selected {
  @apply border-indigo-500 bg-indigo-50;
}

.theme-preview {
  @apply w-full h-12 rounded mb-2;
}

.color-option {
  @apply p-1 border-2 border-transparent rounded-lg cursor-pointer hover:border-gray-300 transition-colors;
}

.color-option.selected {
  @apply border-gray-400;
}

.toggle-switch {
  @apply relative inline-flex items-center cursor-pointer;
}

.toggle-slider {
  @apply w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer transition-colors;
}

.toggle-slider::after {
  @apply content-[''] absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-5 w-5 transition-all;
}

/* Peer states for toggle */
input[type="checkbox"]:checked + .toggle-slider {
  @apply bg-indigo-600;
}

input[type="checkbox"]:checked + .toggle-slider::after {
  @apply translate-x-full border-white;
}

input[type="checkbox"]:focus + .toggle-slider {
  @apply outline-none ring-4 ring-indigo-300;
}

.security-action-btn {
  @apply w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors;
}

.data-action-btn {
  @apply w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors;
}

.integration-item {
  @apply p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors;
}
</style>