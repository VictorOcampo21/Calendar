import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    // Configuración de privacidad
    privacyMode: false,
    
    // Configuración de UI
    sidebarCollapsed: false,
    darkMode: false,
    
    // Configuración global
    language: 'es',
    currency: 'MXN',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    
    // Modal states
    showGlobalSearch: false,
    showNotifications: false,
    
    // Configuración de notificaciones
    notifications: {
      email: true,
      push: true,
      desktop: true,
      sound: true
    },
    
    // Estado de carga global
    isLoading: false,
    loadingMessage: '',
    
    // Errores globales
    errors: [],
    
    // Toast notifications
    toasts: []
  }),

  getters: {
    currencySymbol: (state) => {
      const symbols = {
        'MXN': '$',
        'USD': '$',
        'EUR': '€',
        'GBP': '£'
      }
      return symbols[state.currency] || '$'
    },
    
    isRTL: (state) => {
      return ['ar', 'he', 'fa'].includes(state.language)
    },
    
    hasUnreadNotifications: (state) => {
      return state.toasts.some(toast => toast.type === 'notification' && !toast.read)
    }
  },

  actions: {
    // Toggle privacy mode
    togglePrivacyMode() {
      this.privacyMode = !this.privacyMode
      localStorage.setItem('privacy_mode', this.privacyMode)
      
      this.addToast({
        type: 'success',
        title: 'Modo privacidad',
        message: this.privacyMode ? 'Activado - Datos sensibles ocultos' : 'Desactivado - Mostrando todos los datos'
      })
    },

    // Toggle sidebar
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem('sidebar_collapsed', this.sidebarCollapsed)
    },

    // Toggle dark mode
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      localStorage.setItem('dark_mode', this.darkMode)
      
      // Aplicar clase al body
      if (this.darkMode) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    },

    // Configuración de idioma
    setLanguage(lang) {
      this.language = lang
      localStorage.setItem('language', lang)
    },

    // Configuración de moneda
    setCurrency(currency) {
      this.currency = currency
      localStorage.setItem('currency', currency)
    },

    // Configuración de formato de fecha
    setDateFormat(format) {
      this.dateFormat = format
      localStorage.setItem('date_format', format)
    },

    // Configuración de formato de hora
    setTimeFormat(format) {
      this.timeFormat = format
      localStorage.setItem('time_format', format)
    },

    // Global loading state
    setLoading(isLoading, message = '') {
      this.isLoading = isLoading
      this.loadingMessage = message
    },

    // Modal controls
    openGlobalSearch() {
      this.showGlobalSearch = true
    },

    closeGlobalSearch() {
      this.showGlobalSearch = false
    },

    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },

    // Notification settings
    updateNotificationSettings(settings) {
      this.notifications = { ...this.notifications, ...settings }
      localStorage.setItem('notification_settings', JSON.stringify(this.notifications))
    },

    // Error handling
    addError(error) {
      this.errors.push({
        id: Date.now(),
        message: error.message || error,
        timestamp: new Date(),
        type: 'error'
      })
    },

    removeError(errorId) {
      this.errors = this.errors.filter(error => error.id !== errorId)
    },

    clearErrors() {
      this.errors = []
    },

    // Toast notifications
    addToast(toast) {
      const newToast = {
        id: Date.now(),
        type: toast.type || 'info', // success, error, warning, info, notification
        title: toast.title || '',
        message: toast.message,
        duration: toast.duration || 5000,
        read: false,
        timestamp: new Date()
      }
      
      this.toasts.unshift(newToast)
      
      // Auto remove after duration
      if (newToast.duration > 0) {
        setTimeout(() => {
          this.removeToast(newToast.id)
        }, newToast.duration)
      }
      
      return newToast.id
    },

    removeToast(toastId) {
      this.toasts = this.toasts.filter(toast => toast.id !== toastId)
    },

    markToastAsRead(toastId) {
      const toast = this.toasts.find(t => t.id === toastId)
      if (toast) {
        toast.read = true
      }
    },

    clearAllToasts() {
      this.toasts = []
    },

    // Formateo de datos según configuración
    formatCurrency(amount) {
      if (this.privacyMode && Math.abs(amount) > 100) {
        return '••••••'
      }
      
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: this.currency,
        minimumFractionDigits: 2
      }).format(amount)
    },

    formatDate(date, format = null) {
      if (!date) return ''
      
      const dateObj = typeof date === 'string' ? new Date(date) : date
      const formatToUse = format || this.dateFormat
      
      // Mapping de formatos
      const formatMap = {
        'DD/MM/YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' },
        'MM/DD/YYYY': { month: '2-digit', day: '2-digit', year: 'numeric' },
        'YYYY-MM-DD': { year: 'numeric', month: '2-digit', day: '2-digit' },
        'DD-MM-YYYY': { day: '2-digit', month: '2-digit', year: 'numeric' }
      }
      
      const options = formatMap[formatToUse] || formatMap['DD/MM/YYYY']
      return dateObj.toLocaleDateString('es-MX', options)
    },

    formatTime(time) {
      if (!time) return ''
      
      const timeObj = typeof time === 'string' ? new Date(`2000-01-01T${time}`) : time
      
      return timeObj.toLocaleTimeString('es-MX', {
        hour12: this.timeFormat === '12h',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    // Restore settings from localStorage
    restoreSettings() {
      const privacyMode = localStorage.getItem('privacy_mode')
      const sidebarCollapsed = localStorage.getItem('sidebar_collapsed')
      const darkMode = localStorage.getItem('dark_mode')
      const language = localStorage.getItem('language')
      const currency = localStorage.getItem('currency')
      const dateFormat = localStorage.getItem('date_format')
      const timeFormat = localStorage.getItem('time_format')
      const notificationSettings = localStorage.getItem('notification_settings')
      
      if (privacyMode !== null) this.privacyMode = JSON.parse(privacyMode)
      if (sidebarCollapsed !== null) this.sidebarCollapsed = JSON.parse(sidebarCollapsed)
      if (darkMode !== null) this.darkMode = JSON.parse(darkMode)
      if (language) this.language = language
      if (currency) this.currency = currency
      if (dateFormat) this.dateFormat = dateFormat
      if (timeFormat) this.timeFormat = timeFormat
      if (notificationSettings) this.notifications = JSON.parse(notificationSettings)
      
      // Aplicar dark mode si está activado
      if (this.darkMode) {
        document.body.classList.add('dark')
      }
    }
  }
})