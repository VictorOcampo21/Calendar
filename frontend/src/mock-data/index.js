// Exportación central de todos los datos mock
export { mockUsers, mockWorkspaces } from './users.js'
export { eventCategories, mockEvents, pastEvents } from './events.js'
export { 
  financeCategories, 
  mockCategories,
  accountTypes, 
  mockAccounts, 
  mockTransactions, 
  mockBudgets,
  mockEnvelopes, 
  mockDebts 
} from './finance.js'
export { mockNotes, noteCategories, mockEventProposals } from './notes.js'
export { mockChats, mockChatMessages, availableEmojis } from './chats.js'

// Tags globales utilizados en todo el sistema
export const globalTags = [
  'trabajo', 'personal', 'familia', 'urgente', 'importante',
  'finanzas', 'salud', 'educación', 'viajes', 'entretenimiento',
  'reunión', 'proyecto', 'cliente', 'planificación', 'ideas',
  'confidencial', 'público', 'draft', 'aprobado', 'pendiente'
]

// Tipos de archivos soportados
export const supportedFileTypes = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  spreadsheets: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  presentations: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  archive: ['application/zip', 'application/rar'],
  video: ['video/mp4', 'video/avi', 'video/mov'],
  audio: ['audio/mp3', 'audio/wav', 'audio/aac'],
  text: ['text/plain', 'text/csv']
}

// Configuración de notificaciones
export const notificationTypes = [
  { id: 'email', name: 'Email', icon: '📧' },
  { id: 'notification', name: 'Notificación push', icon: '🔔' },
  { id: 'sms', name: 'SMS', icon: '📱' }
]

// Monedas soportadas
export const supportedCurrencies = [
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
  { code: 'USD', name: 'Dólar Americano', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£' }
]

// Formatos de fecha disponibles
export const dateFormats = [
  { code: 'DD/MM/YYYY', example: '31/12/2024' },
  { code: 'MM/DD/YYYY', example: '12/31/2024' },
  { code: 'YYYY-MM-DD', example: '2024-12-31' },
  { code: 'DD-MM-YYYY', example: '31-12-2024' }
]

// Zonas horarias comunes
export const commonTimezones = [
  { code: 'America/Mexico_City', name: 'México (CDMX)' },
  { code: 'America/New_York', name: 'Nueva York (EST)' },
  { code: 'America/Los_Angeles', name: 'Los Ángeles (PST)' },
  { code: 'Europe/Madrid', name: 'Madrid (CET)' },
  { code: 'Europe/London', name: 'Londres (GMT)' }
]

export default {
  globalTags,
  supportedFileTypes,
  notificationTypes,
  supportedCurrencies,
  dateFormats,
  commonTimezones
}