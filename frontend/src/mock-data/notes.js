import { addDays, subDays, format } from 'date-fns'

// Mock notas
export const mockNotes = [
  {
    id: 1,
    title: 'Plan de Desarrollo Q1 2025',
    content: `# Plan de Desarrollo Q1 2025

## Objetivos principales
1. Implementar nuevo módulo de reportes
2. Optimizar performance de la aplicación
3. Actualizar documentación técnica

## Tareas específicas
- [ ] Diseño de wireframes para reportes
- [ ] Desarrollo de API endpoints
- [ ] Testing y QA
- [x] Reunión con stakeholders

## Notas adicionales
El proyecto debe estar listo para el 31 de marzo. 
Coordinar con el equipo de UX para los mockups.`,
    categoryId: 1,
    workspaceId: 2,
    userId: 1,
    isEncrypted: false,
    isShared: true,
    sharedWith: [2, 3],
    tags: ['trabajo', 'planificación', 'Q1'],
    attachments: [
      { id: 1, name: 'wireframes_v1.fig', type: 'application/figma', url: '#' }
    ],
    versions: [
      {
        id: 1,
        content: 'Contenido inicial...',
        createdAt: subDays(new Date(), 5),
        userId: 1
      }
    ],
    createdAt: subDays(new Date(), 7),
    updatedAt: subDays(new Date(), 1)
  },
  {
    id: 2,
    title: 'Recetas Favoritas',
    content: `# Mis Recetas Favoritas 👨‍🍳

## Pasta Carbonara
**Ingredientes:**
- 400g spaghetti
- 200g panceta
- 4 huevos
- 100g queso parmesano
- Pimienta negra

**Preparación:**
1. Cocinar la pasta al dente
2. Freír la panceta hasta dorar
3. Mezclar huevos con queso
4. Combinar todo fuera del fuego

## Tacos de Pastor
**Ingredientes:**
- Carne de cerdo marinada
- Tortillas de maíz
- Piña
- Cebolla
- Cilantro
- Salsa verde

**Tiempo de cocción:** 20 minutos`,
    categoryId: 2,
    workspaceId: 1,
    userId: 1,
    isEncrypted: false,
    isShared: false,
    sharedWith: [],
    tags: ['cocina', 'recetas', 'personal'],
    attachments: [
      { id: 2, name: 'foto_carbonara.jpg', type: 'image/jpeg', url: '#' }
    ],
    versions: [],
    createdAt: subDays(new Date(), 15),
    updatedAt: subDays(new Date(), 3)
  },
  {
    id: 3,
    title: 'Datos Bancarios (Confidencial)',
    content: `# Información Financiera Confidencial 🔒

## Cuentas principales
- Banco: •••••••••••••
- Número: •••••••••••••
- CLABE: •••••••••••••

## Passwords importantes
- Banking: •••••••••••••
- Inversiones: •••••••••••••

*Nota: Esta información está encriptada para mayor seguridad.*`,
    categoryId: 3,
    workspaceId: 1,
    userId: 1,
    isEncrypted: true,
    isShared: false,
    sharedWith: [],
    tags: ['finanzas', 'confidencial', 'passwords'],
    attachments: [],
    versions: [],
    createdAt: subDays(new Date(), 20),
    updatedAt: subDays(new Date(), 10)
  },
  {
    id: 4,
    title: 'Ideas para el viaje a Cancún',
    content: `# Viaje a Cancún - Diciembre 2024 🏖️

## Lugares por visitar
- [x] Chichen Itzá
- [ ] Xcaret
- [ ] Cenote Dos Ojos
- [ ] Isla Mujeres
- [ ] Cozumel

## Restaurantes recomendados
1. **La Parrilla** - Comida mexicana tradicional
2. **Porfirio's** - Cocina gourmet mexicana
3. **Harry's** - Steakhouse
4. **Mariscos El Galeon** - Mariscos frescos

## Presupuesto estimado
- Excursiones: $8,000 MXN
- Comidas: $6,000 MXN
- Souvenirs: $2,000 MXN
- **Total: $16,000 MXN**

## Documentos necesarios
- [x] Pasaportes
- [x] Confirmación hotel
- [ ] Seguro de viaje
- [ ] Itinerario de vuelos`,
    categoryId: 4,
    workspaceId: 3,
    userId: 2,
    isEncrypted: false,
    isShared: true,
    sharedWith: [1],
    tags: ['viaje', 'cancún', 'vacaciones', 'familia'],
    attachments: [
      { id: 3, name: 'mapa_riviera_maya.pdf', type: 'application/pdf', url: '#' }
    ],
    versions: [],
    eventId: 6, // Relacionado con evento de viaje
    createdAt: subDays(new Date(), 25),
    updatedAt: subDays(new Date(), 2)
  },
  {
    id: 5,
    title: 'Reunión con Cliente - Notas',
    content: `# Reunión Cliente TechStart - 28 Oct 2024

## Participantes
- Juan Pérez (nosotros)
- María González (nosotros)  
- Roberto Silva (TechStart - CEO)
- Ana López (TechStart - CTO)

## Puntos discutidos
1. **Alcance del proyecto**
   - Desarrollo de plataforma e-commerce
   - Integración con sistemas existentes
   - Timeline: 4 meses

2. **Requerimientos técnicos**
   - Frontend: React/Vue.js
   - Backend: Node.js/Python
   - Base de datos: PostgreSQL
   - Hosting: AWS

3. **Presupuesto**
   - Estimación inicial: $150,000 MXN
   - Pagos: 30% inicial, 40% a mitad, 30% entrega

## Próximos pasos
- [ ] Enviar propuesta formal (viernes)
- [ ] Definir mockups iniciales
- [ ] Programar sesión de wireframing
- [ ] Cotizar hosting y servicios

## Notas adicionales
Cliente muy interesado en el proyecto. Enfatizan la importancia de la experiencia móvil.`,
    categoryId: 1,
    workspaceId: 2,
    userId: 1,
    isEncrypted: false,
    isShared: true,
    sharedWith: [2],
    tags: ['cliente', 'reunión', 'proyecto', 'techstart'],
    attachments: [],
    versions: [],
    createdAt: subDays(new Date(), 4),
    updatedAt: subDays(new Date(), 4)
  }
]

// Categorías de notas
export const noteCategories = [
  { id: 1, name: 'Trabajo', color: '#3B82F6', icon: '💼' },
  { id: 2, name: 'Personal', color: '#10B981', icon: '📝' },
  { id: 3, name: 'Confidencial', color: '#EF4444', icon: '🔒' },
  { id: 4, name: 'Familia', color: '#F59E0B', icon: '👨‍👩‍👧‍👦' },
  { id: 5, name: 'Ideas', color: '#8B5CF6', icon: '💡' }
]

// Mock propuestas de eventos
export const mockEventProposals = [
  {
    id: 1,
    title: 'Reunión Trimestral Q4',
    description: 'Revisión de objetivos y planificación Q1 2025',
    proposedBy: 1,
    workspaceId: 2,
    status: 'voting', // voting, approved, rejected, draft
    options: [
      {
        id: 1,
        date: addDays(new Date(), 5),
        time: '10:00',
        duration: 120,
        location: 'Sala de conferencias A',
        votes: [1, 2]
      },
      {
        id: 2,
        date: addDays(new Date(), 6),
        time: '14:00',
        duration: 120,
        location: 'Sala de conferencias B',
        votes: [3]
      },
      {
        id: 3,
        date: addDays(new Date(), 7),
        time: '09:00',
        duration: 120,
        location: 'Online - Zoom',
        votes: [1]
      }
    ],
    invitees: [1, 2, 3],
    externalInvites: [
      { email: 'cliente@empresa.com', token: 'abc123', hasVoted: false }
    ],
    chatId: 1,
    tags: ['reunión', 'trimestral', 'planificación'],
    attachments: [],
    deadline: addDays(new Date(), 3),
    createdAt: subDays(new Date(), 5),
    updatedAt: subDays(new Date(), 1)
  },
  {
    id: 2,
    title: 'Cena de Fin de Año',
    description: 'Celebración navideña del equipo',
    proposedBy: 2,
    workspaceId: 2,
    status: 'approved',
    approvedOptionId: 4,
    options: [
      {
        id: 4,
        date: addDays(new Date(), 30),
        time: '20:00',
        duration: 180,
        location: 'Restaurante El Patio',
        votes: [1, 2, 3]
      },
      {
        id: 5,
        date: addDays(new Date(), 31),
        time: '19:30',
        duration: 180,
        location: 'Casa de María',
        votes: [2]
      }
    ],
    invitees: [1, 2, 3],
    externalInvites: [],
    chatId: 2,
    tags: ['cena', 'navidad', 'equipo'],
    attachments: [],
    createdAt: subDays(new Date(), 10),
    convertedToEventId: 25
  }
]

export default {
  mockNotes,
  noteCategories,
  mockEventProposals
}