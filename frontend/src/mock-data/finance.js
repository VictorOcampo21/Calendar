import { addDays, subDays, subMonths, format } from 'date-fns'

// Categorías financieras
export const financeCategories = [
  { id: 1, name: 'Alimentación', color: '#F59E0B', icon: '🍕', type: 'expense' },
  { id: 2, name: 'Transporte', color: '#3B82F6', icon: '🚗', type: 'expense' },
  { id: 3, name: 'Vivienda', color: '#10B981', icon: '🏠', type: 'expense' },
  { id: 4, name: 'Salud', color: '#EF4444', icon: '🏥', type: 'expense' },
  { id: 5, name: 'Entretenimiento', color: '#8B5CF6', icon: '🎮', type: 'expense' },
  { id: 6, name: 'Educación', color: '#06B6D4', icon: '📚', type: 'expense' },
  { id: 7, name: 'Salario', color: '#059669', icon: '💼', type: 'income' },
  { id: 8, name: 'Freelance', color: '#10B981', icon: '💻', type: 'income' },
  { id: 9, name: 'Inversiones', color: '#8B5CF6', icon: '📈', type: 'income' },
  { id: 10, name: 'Otros ingresos', color: '#6B7280', icon: '💰', type: 'income' }
]

// Alias para compatibilidad
export const mockCategories = financeCategories

// Mock presupuestos
export const mockBudgets = [
  {
    id: 1,
    name: 'Presupuesto Alimentación Noviembre',
    categoryId: 1,
    limit: 8000.00,
    spent: 5750.50,
    period: 'monthly',
    startDate: '2024-11-01T00:00:00Z',
    endDate: '2024-11-30T23:59:59Z',
    alertAt75: true,
    alertAt90: true,
    alertAtLimit: true,
    description: 'Presupuesto mensual para gastos de alimentación',
    workspaceId: 1,
    userId: 1,
    isActive: true,
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'Presupuesto Transporte Noviembre',
    categoryId: 2,
    limit: 3000.00,
    spent: 1850.00,
    period: 'monthly',
    startDate: '2024-11-01T00:00:00Z',
    endDate: '2024-11-30T23:59:59Z',
    alertAt75: true,
    alertAt90: true,
    alertAtLimit: true,
    description: 'Presupuesto mensual para gastos de transporte',
    workspaceId: 1,
    userId: 1,
    isActive: true,
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 3,
    name: 'Presupuesto Entretenimiento Noviembre',
    categoryId: 5,
    limit: 2500.00,
    spent: 2299.00,
    period: 'monthly',
    startDate: '2024-11-01T00:00:00Z',
    endDate: '2024-11-30T23:59:59Z',
    alertAt75: true,
    alertAt90: true,
    alertAtLimit: true,
    description: 'Presupuesto mensual para entretenimiento',
    workspaceId: 1,
    userId: 1,
    isActive: true,
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 4,
    name: 'Presupuesto Salud Trimestral',
    categoryId: 4,
    limit: 6000.00,
    spent: 1200.00,
    period: 'quarterly',
    startDate: '2024-10-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    alertAt75: true,
    alertAt90: true,
    alertAtLimit: true,
    description: 'Presupuesto trimestral para gastos de salud',
    workspaceId: 1,
    userId: 1,
    isActive: true,
    createdAt: '2024-10-01T10:00:00Z'
  }
]

// Tipos de cuenta
export const accountTypes = [
  { id: 'checking', name: 'Cuenta Corriente', icon: '🏦' },
  { id: 'savings', name: 'Cuenta de Ahorros', icon: '💰' },
  { id: 'credit', name: 'Tarjeta de Crédito', icon: '💳' },
  { id: 'cash', name: 'Efectivo', icon: '💵' },
  { id: 'investment', name: 'Inversión', icon: '📈' }
]

// Mock cuentas bancarias
export const mockAccounts = [
  {
    id: 1,
    name: 'Banco Principal - Nómina',
    type: 'checking',
    balance: 25750.50,
    currency: 'MXN',
    bankName: 'BBVA México',
    accountNumber: '****1234',
    workspaceId: 1,
    userId: 1,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Cuenta de Ahorros',
    type: 'savings',
    balance: 85000.00,
    currency: 'MXN',
    bankName: 'Santander',
    accountNumber: '****5678',
    workspaceId: 1,
    userId: 1,
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 3,
    name: 'Tarjeta de Crédito',
    type: 'credit',
    balance: -8500.00, // Negativo = deuda
    creditLimit: 50000.00,
    currency: 'MXN',
    bankName: 'Citibank',
    accountNumber: '****9012',
    workspaceId: 1,
    userId: 1,
    isActive: true,
    createdAt: '2024-01-20T14:00:00Z'
  },
  {
    id: 4,
    name: 'Efectivo Cartera',
    type: 'cash',
    balance: 2500.00,
    currency: 'MXN',
    workspaceId: 1,
    userId: 1,
    isActive: true,
    createdAt: '2024-02-01T09:00:00Z'
  }
]

// Mock transacciones
export const mockTransactions = [
  {
    id: 1,
    description: 'Salario Noviembre',
    amount: 45000.00,
    type: 'income',
    categoryId: 7,
    accountId: 1,
    workspaceId: 1,
    userId: 1,
    date: subDays(new Date(), 2),
    tags: ['salario', 'nómina'],
    attachments: [
      { id: 1, name: 'recibo_nomina_nov.pdf', type: 'application/pdf', url: '#' }
    ],
    notes: 'Pago de nómina correspondiente a noviembre',
    isEncrypted: false,
    eventId: null,
    createdAt: subDays(new Date(), 2)
  },
  {
    id: 2,
    description: 'Supermercado Soriana',
    amount: -1250.50,
    type: 'expense',
    categoryId: 1,
    accountId: 1,
    workspaceId: 1,
    userId: 1,
    date: subDays(new Date(), 1),
    tags: ['comida', 'despensa'],
    attachments: [
      { id: 2, name: 'ticket_soriana.jpg', type: 'image/jpeg', url: '#' }
    ],
    notes: 'Compras de despensa semanal',
    isEncrypted: false,
    eventId: null,
    createdAt: subDays(new Date(), 1)
  },
  {
    id: 3,
    description: 'Gasolina Shell',
    amount: -850.00,
    type: 'expense',
    categoryId: 2,
    accountId: 1,
    workspaceId: 1,
    userId: 1,
    date: new Date(),
    tags: ['gasolina', 'transporte'],
    attachments: [],
    notes: 'Tanque lleno para la semana',
    isEncrypted: false,
    eventId: null,
    createdAt: new Date()
  },
  {
    id: 4,
    description: 'Renta Departamento',
    amount: -12000.00,
    type: 'expense',
    categoryId: 3,
    accountId: 1,
    workspaceId: 1,
    userId: 1,
    date: subDays(new Date(), 5),
    tags: ['renta', 'vivienda'],
    attachments: [],
    notes: 'Pago de renta noviembre 2024',
    isEncrypted: false,
    eventId: 102, // Relacionado con evento
    createdAt: subDays(new Date(), 5)
  },
  {
    id: 5,
    description: 'Freelance - Desarrollo Web',
    amount: 15000.00,
    type: 'income',
    categoryId: 8,
    accountId: 2,
    workspaceId: 1,
    userId: 1,
    date: subDays(new Date(), 7),
    tags: ['freelance', 'programación'],
    attachments: [
      { id: 3, name: 'factura_freelance_oct.pdf', type: 'application/pdf', url: '#' }
    ],
    notes: 'Pago por desarrollo de aplicación web para cliente',
    isEncrypted: false,
    eventId: null,
    createdAt: subDays(new Date(), 7)
  },
  {
    id: 6,
    description: 'Netflix Suscripción',
    amount: -299.00,
    type: 'expense',
    categoryId: 5,
    accountId: 3, // Tarjeta de crédito
    workspaceId: 1,
    userId: 1,
    date: subDays(new Date(), 10),
    tags: ['streaming', 'entretenimiento'],
    attachments: [],
    notes: 'Suscripción mensual Netflix',
    isEncrypted: false,
    eventId: null,
    createdAt: subDays(new Date(), 10)
  },
  {
    id: 7,
    description: 'Curso Vue.js',
    amount: -2500.00,
    type: 'expense',
    categoryId: 6,
    accountId: 1,
    workspaceId: 1,
    userId: 1,
    date: subDays(new Date(), 15),
    tags: ['educación', 'programación'],
    attachments: [],
    notes: 'Pago mensual curso online Vue.js',
    isEncrypted: false,
    eventId: 5, // Relacionado con evento del curso
    createdAt: subDays(new Date(), 15)
  }
]

// Mock sobres (budgeting envelopes)
export const mockEnvelopes = [
  {
    id: 1,
    name: 'Alimentación',
    budgetAmount: 8000.00,
    currentAmount: 6749.50,
    categoryIds: [1],
    workspaceId: 1,
    userId: 1,
    period: 'monthly',
    isActive: true,
    color: '#F59E0B',
    createdAt: '2024-10-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Transporte',
    budgetAmount: 3000.00,
    currentAmount: 2150.00,
    categoryIds: [2],
    workspaceId: 1,
    userId: 1,
    period: 'monthly',
    isActive: true,
    color: '#3B82F6',
    createdAt: '2024-10-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Entretenimiento',
    budgetAmount: 2500.00,
    currentAmount: 2201.00,
    categoryIds: [5],
    workspaceId: 1,
    userId: 1,
    period: 'monthly',
    isActive: true,
    color: '#8B5CF6',
    createdAt: '2024-10-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Emergencias',
    budgetAmount: 10000.00,
    currentAmount: 10000.00,
    categoryIds: [],
    workspaceId: 1,
    userId: 1,
    period: 'monthly',
    isActive: true,
    color: '#EF4444',
    createdAt: '2024-10-01T00:00:00Z'
  }
]

// Mock deudas
export const mockDebts = [
  {
    id: 1,
    name: 'Préstamo Auto',
    creditorName: 'Banco Azteca',
    totalAmount: 250000.00,
    remainingAmount: 180000.00,
    interestRate: 12.5,
    monthlyPayment: 5200.00,
    dueDate: '15', // Día del mes
    workspaceId: 1,
    userId: 1,
    status: 'active',
    startDate: '2023-06-15T00:00:00Z',
    endDate: '2027-06-15T00:00:00Z',
    tags: ['auto', 'préstamo'],
    notes: 'Préstamo para compra de vehículo',
    payments: [
      {
        id: 1,
        amount: 5200.00,
        date: subDays(new Date(), 30),
        accountId: 1,
        notes: 'Pago octubre 2024'
      }
    ],
    createdAt: '2023-06-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Deuda con Juan',
    creditorName: 'Juan Pérez',
    totalAmount: 8000.00,
    remainingAmount: 3000.00,
    interestRate: 0,
    monthlyPayment: 1000.00,
    dueDate: '28',
    workspaceId: 1,
    userId: 1,
    status: 'active',
    startDate: '2024-08-01T00:00:00Z',
    endDate: '2024-12-01T00:00:00Z',
    tags: ['personal', 'amigo'],
    notes: 'Préstamo personal de Juan para emergencia médica',
    payments: [
      {
        id: 2,
        amount: 1000.00,
        date: subDays(new Date(), 60),
        accountId: 4, // Efectivo
        notes: 'Primer pago'
      },
      {
        id: 3,
        amount: 1000.00,
        date: subDays(new Date(), 30),
        accountId: 4,
        notes: 'Segundo pago'
      }
    ],
    createdAt: '2024-08-01T12:00:00Z'
  }
]

export default {
  financeCategories,
  mockCategories,
  accountTypes,
  mockAccounts,
  mockTransactions,
  mockBudgets,
  mockEnvelopes,
  mockDebts
}