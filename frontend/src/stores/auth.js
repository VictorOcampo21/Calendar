import { defineStore } from 'pinia'
import { mockUsers, mockWorkspaces } from '@/mock-data'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    currentWorkspace: null,
    availableWorkspaces: [],
    isLoading: false,
    error: null
  }),

  getters: {
    userFullName: (state) => state.user?.name || '',
    isAdmin: (state) => state.user?.role === 'admin',
    hasMultipleWorkspaces: (state) => state.availableWorkspaces.length > 1,
    currentWorkspaceMembers: (state) => {
      if (!state.currentWorkspace) return []
      return mockUsers.filter(user => 
        state.currentWorkspace.members.includes(user.id)
      )
    }
  },

  actions: {
    // Simular login
    async login(credentials) {
      this.isLoading = true
      this.error = null

      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Buscar usuario por email (mock)
        const user = mockUsers.find(u => u.email === credentials.email)
        
        if (!user || credentials.password !== 'demo123') {
          throw new Error('Credenciales incorrectas')
        }

        this.user = user
        this.isAuthenticated = true
        
        // Obtener workspaces del usuario
        this.availableWorkspaces = mockWorkspaces.filter(ws => 
          ws.members.includes(user.id)
        )

        // Auto-seleccionar primer workspace
        if (this.availableWorkspaces.length > 0) {
          this.currentWorkspace = this.availableWorkspaces[0]
        }

        // Guardar en localStorage para persistencia
        localStorage.setItem('auth_user', JSON.stringify(user))
        localStorage.setItem('current_workspace', JSON.stringify(this.currentWorkspace))
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    // Simular registro
    async register(userData) {
      this.isLoading = true
      this.error = null

      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Verificar si email ya existe
        const existingUser = mockUsers.find(u => u.email === userData.email)
        if (existingUser) {
          throw new Error('El email ya está registrado')
        }

        // Crear nuevo usuario mock
        const newUser = {
          id: mockUsers.length + 1,
          name: userData.name,
          email: userData.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3B82F6&color=fff`,
          role: 'user',
          timezone: 'America/Mexico_City',
          language: 'es',
          createdAt: new Date().toISOString()
        }

        // Crear workspace personal
        const personalWorkspace = {
          id: mockWorkspaces.length + 1,
          name: `Espacio de ${userData.name}`,
          description: 'Mi espacio personal',
          type: 'personal',
          ownerId: newUser.id,
          members: [newUser.id],
          settings: {
            currency: 'MXN',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            defaultCalendarView: 'month'
          },
          createdAt: new Date().toISOString()
        }

        // Simular guardar en "base de datos"
        mockUsers.push(newUser)
        mockWorkspaces.push(personalWorkspace)

        this.user = newUser
        this.isAuthenticated = true
        this.availableWorkspaces = [personalWorkspace]
        this.currentWorkspace = personalWorkspace

        localStorage.setItem('auth_user', JSON.stringify(newUser))
        localStorage.setItem('current_workspace', JSON.stringify(personalWorkspace))

        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    // Cambiar workspace activo
    switchWorkspace(workspace) {
      this.currentWorkspace = workspace
      localStorage.setItem('current_workspace', JSON.stringify(workspace))
    },

    // Cerrar sesión
    async logout() {
      this.user = null
      this.isAuthenticated = false
      this.currentWorkspace = null
      this.availableWorkspaces = []
      this.error = null
      
      localStorage.removeItem('auth_user')
      localStorage.removeItem('current_workspace')
    },

    // Restaurar sesión desde localStorage
    restoreSession() {
      const savedUser = localStorage.getItem('auth_user')
      const savedWorkspace = localStorage.getItem('current_workspace')
      
      if (savedUser && savedWorkspace) {
        this.user = JSON.parse(savedUser)
        this.currentWorkspace = JSON.parse(savedWorkspace)
        this.isAuthenticated = true
        
        // Recargar workspaces disponibles
        this.availableWorkspaces = mockWorkspaces.filter(ws => 
          ws.members.includes(this.user.id)
        )
      }
    },

    // Actualizar perfil de usuario
    async updateProfile(updates) {
      this.isLoading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.user = { ...this.user, ...updates }
        localStorage.setItem('auth_user', JSON.stringify(this.user))
        
        return { success: true }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    // Limpiar errores
    clearError() {
      this.error = null
    },

    // Inicialización automática para demo
    async initializeDemo() {
      try {
        // Auto-login con usuario demo
        const demoUser = mockUsers[0] // Primer usuario como demo
        this.user = demoUser
        this.isAuthenticated = true
        
        // Obtener workspaces del usuario
        this.availableWorkspaces = mockWorkspaces.filter(ws => 
          ws.members.includes(demoUser.id)
        )
        
        // Auto-seleccionar primer workspace
        if (this.availableWorkspaces.length > 0) {
          this.currentWorkspace = this.availableWorkspaces[0]
        }
        
        // Guardar en localStorage
        localStorage.setItem('auth_user', JSON.stringify(this.user))
        localStorage.setItem('auth_workspace', JSON.stringify(this.currentWorkspace))
        
        return { success: true }
      } catch (error) {
        console.error('Error initializing demo:', error)
        return { success: false, error: error.message }
      }
    }
  }
})