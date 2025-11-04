import { addDays, subDays, addHours, addMinutes, format } from 'date-fns'

// Categorías para eventos
export const eventCategories = [
  { id: 1, name: 'Trabajo', color: '#3B82F6', icon: '💼' },
  { id: 2, name: 'Personal', color: '#10B981', icon: '🏠' },
  { id: 3, name: 'Familia', color: '#F59E0B', icon: '👨‍👩‍👧‍👦' },
  { id: 4, name: 'Salud', color: '#EF4444', icon: '🏥' },
  { id: 5, name: 'Educación', color: '#8B5CF6', icon: '📚' },
  { id: 6, name: 'Finanzas', color: '#059669', icon: '💰' },
  { id: 7, name: 'Cumpleaños', color: '#EC4899', icon: '🎂' },
  { id: 8, name: 'Viajes', color: '#06B6D4', icon: '✈️' }
]

// Mock events para el calendario
export const mockEvents = [
  {
    id: 1,
    title: 'Reunión de equipo',
    description: 'Revisión semanal del proyecto y planificación de tareas',
    start: addHours(new Date(), 2),
    end: addHours(new Date(), 3),
    categoryId: 1,
    workspaceId: 2,
    userId: 1,
    isAllDay: false,
    location: 'Sala de conferencias A',
    attendees: [1, 2, 3],
    attachments: [
      { id: 1, name: 'agenda.pdf', type: 'application/pdf', url: '#' }
    ],
    isRecurring: true,
    recurringPattern: 'weekly',
    reminders: [
      { minutes: 15, type: 'notification' },
      { minutes: 60, type: 'email' }
    ],
    tags: ['reunión', 'equipo', 'proyecto'],
    createdAt: '2024-10-28T10:00:00Z',
    updatedAt: '2024-10-30T15:30:00Z'
  },
  {
    id: 2,
    title: 'Consulta médica',
    description: 'Chequeo anual con Dr. Martínez',
    start: addDays(new Date(), 1),
    end: addDays(addMinutes(new Date(), 60), 1),
    categoryId: 4,
    workspaceId: 1,
    userId: 1,
    isAllDay: false,
    location: 'Hospital San José, Consultorio 205',
    attendees: [1],
    attachments: [],
    isRecurring: false,
    reminders: [
      { minutes: 60, type: 'notification' },
      { minutes: 1440, type: 'email' } // 24 horas
    ],
    tags: ['salud', 'médico', 'chequeo'],
    relatedExpenses: [
      { amount: 800, description: 'Consulta médica' }
    ],
    createdAt: '2024-10-20T09:15:00Z'
  },
  {
    id: 3,
    title: 'Cumpleaños de María',
    description: 'Celebración en casa de María',
    start: addDays(new Date(), 3),
    end: addDays(new Date(), 3),
    categoryId: 7,
    workspaceId: 3,
    userId: 2,
    isAllDay: true,
    location: 'Casa de María',
    attendees: [1, 2, 3],
    attachments: [
      { id: 2, name: 'lista_regalos.txt', type: 'text/plain', url: '#' }
    ],
    isRecurring: true,
    recurringPattern: 'yearly',
    reminders: [
      { minutes: 1440, type: 'notification' }, // 1 día
      { minutes: 10080, type: 'email' } // 1 semana
    ],
    tags: ['cumpleaños', 'familia', 'celebración'],
    relatedExpenses: [
      { amount: 1500, description: 'Regalo para María' },
      { amount: 500, description: 'Pastel' }
    ],
    createdAt: '2024-09-15T12:00:00Z'
  },
  {
    id: 4,
    title: 'Presentación de proyecto',
    description: 'Presentación final del proyecto Q4 al cliente',
    start: addDays(addHours(new Date(), 14), 2),
    end: addDays(addHours(new Date(), 16), 2),
    categoryId: 1,
    workspaceId: 2,
    userId: 1,
    isAllDay: false,
    location: 'Oficina del cliente - Zoom',
    attendees: [1, 2],
    attachments: [
      { id: 3, name: 'presentacion_final.pptx', type: 'application/vnd.ms-powerpoint', url: '#' },
      { id: 4, name: 'demo_video.mp4', type: 'video/mp4', url: '#' }
    ],
    isRecurring: false,
    reminders: [
      { minutes: 30, type: 'notification' },
      { minutes: 120, type: 'email' }
    ],
    tags: ['presentación', 'cliente', 'proyecto'],
    createdAt: '2024-10-25T16:45:00Z'
  },
  {
    id: 5,
    title: 'Curso de Vue.js',
    description: 'Sesión 3: Composición API y estado reactivo',
    start: addDays(addHours(new Date(), 19), 1),
    end: addDays(addHours(new Date(), 21), 1),
    categoryId: 5,
    workspaceId: 1,
    userId: 1,
    isAllDay: false,
    location: 'Online - Plataforma EDU',
    attendees: [1],
    attachments: [
      { id: 5, name: 'ejercicios_sesion3.zip', type: 'application/zip', url: '#' }
    ],
    isRecurring: true,
    recurringPattern: 'weekly',
    reminders: [
      { minutes: 15, type: 'notification' }
    ],
    tags: ['educación', 'programación', 'vue'],
    relatedExpenses: [
      { amount: 2500, description: 'Pago curso Vue.js (mensual)' }
    ],
    createdAt: '2024-10-01T20:00:00Z'
  },
  {
    id: 6,
    title: 'Viaje a Cancún',
    description: 'Vacaciones familiares de fin de año',
    start: addDays(new Date(), 15),
    end: addDays(new Date(), 22),
    categoryId: 8,
    workspaceId: 3,
    userId: 2,
    isAllDay: true,
    location: 'Cancún, Quintana Roo',
    attendees: [1, 2],
    attachments: [
      { id: 6, name: 'itinerario_cancun.pdf', type: 'application/pdf', url: '#' },
      { id: 7, name: 'confirmacion_hotel.pdf', type: 'application/pdf', url: '#' }
    ],
    isRecurring: false,
    reminders: [
      { minutes: 10080, type: 'email' }, // 1 semana
      { minutes: 2880, type: 'notification' } // 2 días
    ],
    tags: ['viaje', 'vacaciones', 'familia'],
    relatedExpenses: [
      { amount: 25000, description: 'Vuelos a Cancún' },
      { amount: 35000, description: 'Hotel 7 noches' },
      { amount: 8000, description: 'Seguro de viaje' }
    ],
    createdAt: '2024-09-10T11:30:00Z'
  }
]

// Eventos recurrentes pasados para historial
export const pastEvents = [
  {
    id: 101,
    title: 'Reunión de equipo',
    start: subDays(new Date(), 7),
    end: subDays(addHours(new Date(), 1), 7),
    categoryId: 1,
    workspaceId: 2,
    userId: 1,
    completed: true
  },
  {
    id: 102,
    title: 'Pago de renta',
    start: subDays(new Date(), 3),
    end: subDays(new Date(), 3),
    categoryId: 6,
    workspaceId: 1,
    userId: 1,
    completed: true,
    relatedExpenses: [
      { amount: 12000, description: 'Renta departamento noviembre' }
    ]
  }
]

export default {
  eventCategories,
  mockEvents,
  pastEvents
}