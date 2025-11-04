import { addMinutes, subMinutes, subHours, subDays, format } from 'date-fns'

// Mock chats
export const mockChats = [
  {
    id: 1,
    name: 'Reunión Trimestral Q4',
    type: 'event', // event, proposal, direct, group
    relatedId: 1, // ID del evento/propuesta relacionada
    participants: [1, 2, 3],
    workspaceId: 2,
    createdAt: subDays(new Date(), 5),
    lastMessageAt: subMinutes(new Date(), 30)
  },
  {
    id: 2,
    name: 'Cena de Fin de Año',
    type: 'proposal',
    relatedId: 2,
    participants: [1, 2, 3],
    workspaceId: 2,
    createdAt: subDays(new Date(), 10),
    lastMessageAt: subHours(new Date(), 2)
  },
  {
    id: 3,
    name: 'Chat General',
    type: 'group',
    relatedId: null,
    participants: [1, 2, 3],
    workspaceId: 2,
    createdAt: subDays(new Date(), 30),
    lastMessageAt: subMinutes(new Date(), 15)
  },
  {
    id: 4,
    name: 'María González',
    type: 'direct',
    relatedId: null,
    participants: [1, 2],
    workspaceId: 2,
    createdAt: subDays(new Date(), 20),
    lastMessageAt: subHours(new Date(), 4)
  },
  {
    id: 5,
    name: 'Planificación Familiar',
    type: 'group',
    relatedId: null,
    participants: [1, 2],
    workspaceId: 3,
    createdAt: subDays(new Date(), 15),
    lastMessageAt: subHours(new Date(), 6)
  }
]

// Mock mensajes de chat
export const mockChatMessages = [
  // Chat 1 - Reunión Trimestral Q4
  {
    id: 1,
    chatId: 1,
    senderId: 1,
    message: '¿Ya revisaron la agenda que envié por email?',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 2),
    reactions: [
      { userId: 2, emoji: '👍' },
      { userId: 3, emoji: '✅' }
    ]
  },
  {
    id: 2,
    chatId: 1,
    senderId: 2,
    message: 'Sí, perfecto. ¿Podemos agregar el tema de presupuesto Q1?',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 1.5),
    reactions: []
  },
  {
    id: 3,
    chatId: 1,
    senderId: 3,
    message: 'De acuerdo con María. También sería bueno revisar los KPIs.',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 1),
    reactions: []
  },
  {
    id: 4,
    chatId: 1,
    senderId: 1,
    message: 'Perfecto, actualizaré la agenda.',
    type: 'text',
    attachments: [
      { id: 1, name: 'agenda_actualizada.pdf', type: 'application/pdf', url: '#' }
    ],
    isEdited: false,
    createdAt: subMinutes(new Date(), 30),
    reactions: [
      { userId: 2, emoji: '🙌' }
    ]
  },

  // Chat 2 - Cena de Fin de Año
  {
    id: 5,
    chatId: 2,
    senderId: 2,
    message: 'Chicos, ¿qué opinan de hacer la cena en El Patio?',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 8),
    reactions: []
  },
  {
    id: 6,
    chatId: 2,
    senderId: 1,
    message: 'Me parece excelente opción. La comida está muy buena.',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 7),
    reactions: []
  },
  {
    id: 7,
    chatId: 2,
    senderId: 3,
    message: 'Yo voté por mi casa porque podemos estar más relajados, pero El Patio también está bien.',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 6),
    reactions: []
  },
  {
    id: 8,
    chatId: 2,
    senderId: 2,
    message: 'Ya reservé mesa para 6 personas en El Patio 🎉',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 2),
    reactions: [
      { userId: 1, emoji: '🎉' },
      { userId: 3, emoji: '👏' }
    ]
  },

  // Chat 3 - Chat General
  {
    id: 9,
    chatId: 3,
    senderId: 3,
    message: 'Buenos días equipo! ☀️',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 3),
    reactions: [
      { userId: 1, emoji: '👋' },
      { userId: 2, emoji: '☀️' }
    ]
  },
  {
    id: 10,
    chatId: 3,
    senderId: 1,
    message: 'Buen día Carlos! ¿Cómo van los avances del proyecto?',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 2.5),
    reactions: []
  },
  {
    id: 11,
    chatId: 3,
    senderId: 3,
    message: 'Todo en orden, ya tengo el 80% del frontend listo.',
    type: 'text',
    attachments: [
      { id: 2, name: 'screenshot_frontend.png', type: 'image/png', url: '#' }
    ],
    isEdited: false,
    createdAt: subHours(new Date(), 2),
    reactions: [
      { userId: 1, emoji: '🚀' },
      { userId: 2, emoji: '💪' }
    ]
  },
  {
    id: 12,
    chatId: 3,
    senderId: 2,
    message: 'Excelente trabajo Carlos! 👏',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subMinutes(new Date(), 15),
    reactions: []
  },

  // Chat 4 - María González (DM)
  {
    id: 13,
    chatId: 4,
    senderId: 2,
    message: 'Juan, ¿tienes un momento para revisar el presupuesto?',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 5),
    reactions: []
  },
  {
    id: 14,
    chatId: 4,
    senderId: 1,
    message: 'Claro, ¿es urgente o podemos verlo mañana?',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 4.5),
    reactions: []
  },
  {
    id: 15,
    chatId: 4,
    senderId: 2,
    message: 'Mañana está perfecto. Te envío el archivo.',
    type: 'text',
    attachments: [
      { id: 3, name: 'presupuesto_q4.xlsx', type: 'application/vnd.ms-excel', url: '#' }
    ],
    isEdited: false,
    createdAt: subHours(new Date(), 4),
    reactions: [
      { userId: 1, emoji: '👍' }
    ]
  },

  // Chat 5 - Planificación Familiar
  {
    id: 16,
    chatId: 5,
    senderId: 2,
    message: 'Ya confirmé las fechas del viaje a Cancún 🏖️',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 8),
    reactions: []
  },
  {
    id: 17,
    chatId: 5,
    senderId: 1,
    message: '¡Genial! ¿Ya tienes el itinerario?',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 7),
    reactions: []
  },
  {
    id: 18,
    chatId: 5,
    senderId: 2,
    message: 'Sí, lo subo a las notas compartidas.',
    type: 'text',
    attachments: [],
    isEdited: false,
    createdAt: subHours(new Date(), 6),
    reactions: []
  }
]

// Emojis disponibles para reacciones
export const availableEmojis = [
  '👍', '👎', '❤️', '😊', '😂', '😮', '😢', '😡',
  '🎉', '🚀', '👏', '🙌', '💪', '✅', '❌', '⭐',
  '🔥', '💡', '🤔', '👀', '💯', '🙏', '☀️', '👋'
]

export default {
  mockChats,
  mockChatMessages,
  availableEmojis
}