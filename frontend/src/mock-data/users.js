// Mock data para usuarios
export const mockUsers = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'admin',
    timezone: 'America/Mexico_City',
    language: 'es',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'María González',
    email: 'maria@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'user',
    timezone: 'America/Mexico_City',
    language: 'es',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 3,
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'user',
    timezone: 'America/Mexico_City',
    language: 'es',
    createdAt: '2024-02-01T09:45:00Z'
  }
]

// Mock data para workspaces
export const mockWorkspaces = [
  {
    id: 1,
    name: 'Mi Espacio Personal',
    description: 'Workspace personal para gestión individual',
    type: 'personal',
    ownerId: 1,
    members: [1],
    settings: {
      currency: 'MXN',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      defaultCalendarView: 'month'
    },
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Empresa TechCorp',
    description: 'Workspace empresarial para el equipo de desarrollo',
    type: 'business',
    ownerId: 1,
    members: [1, 2, 3],
    settings: {
      currency: 'MXN',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      defaultCalendarView: 'week'
    },
    createdAt: '2024-01-20T11:00:00Z'
  },
  {
    id: 3,
    name: 'Familia García',
    description: 'Gestión familiar de eventos y finanzas',
    type: 'family',
    ownerId: 2,
    members: [1, 2],
    settings: {
      currency: 'MXN',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      defaultCalendarView: 'month'
    },
    createdAt: '2024-02-01T16:20:00Z'
  }
]

export default {
  mockUsers,
  mockWorkspaces
}