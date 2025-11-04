<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Transactions header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-gray-900">Transacciones</h2>
        
        <div class="flex items-center space-x-3">
          <!-- Search -->
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar transacciones..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- Date range picker -->
          <div class="flex items-center space-x-2">
            <input
              v-model="dateRange.start"
              type="date"
              class="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span class="text-gray-400">a</span>
            <input
              v-model="dateRange.end"
              type="date"
              class="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <!-- Category filter -->
          <select
            v-model="selectedCategory"
            class="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Todas las categorías</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>

          <!-- Export -->
          <button
            @click="exportTransactions"
            class="btn-secondary"
          >
            <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      <!-- Quick stats -->
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-sm text-gray-500">Total transacciones</div>
          <div class="text-xl font-semibold text-gray-900">{{ filteredTransactions.length }}</div>
        </div>
        <div class="bg-green-50 rounded-lg p-4">
          <div class="text-sm text-green-600">Total ingresos</div>
          <div class="text-xl font-semibold text-green-900">{{ formatCurrency(totalIncome) }}</div>
        </div>
        <div class="bg-red-50 rounded-lg p-4">
          <div class="text-sm text-red-600">Total gastos</div>
          <div class="text-xl font-semibold text-red-900">{{ formatCurrency(totalExpenses) }}</div>
        </div>
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="text-sm text-blue-600">Balance neto</div>
          <div class="text-xl font-semibold" :class="netBalance >= 0 ? 'text-blue-900' : 'text-red-900'">
            {{ formatCurrency(netBalance) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions list -->
    <div class="flex-1 overflow-hidden">
      <div class="h-full overflow-y-auto">
        <!-- Desktop view -->
        <div class="hidden md:block">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="table-header">
                  <button
                    @click="toggleSort('date')"
                    class="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Fecha</span>
                    <ChevronUpDownIcon class="w-4 h-4" />
                  </button>
                </th>
                <th class="table-header">Descripción</th>
                <th class="table-header">Categoría</th>
                <th class="table-header">Cuenta</th>
                <th class="table-header">
                  <button
                    @click="toggleSort('amount')"
                    class="flex items-center space-x-1 hover:text-gray-900"
                  >
                    <span>Monto</span>
                    <ChevronUpDownIcon class="w-4 h-4" />
                  </button>
                </th>
                <th class="table-header">Estado</th>
                <th class="table-header"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="transaction in paginatedTransactions"
                :key="transaction.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- Date -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(transaction.date) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatTime(transaction.date) }}
                  </div>
                </td>

                <!-- Description -->
                <td class="table-cell">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div
                        class="h-8 w-8 rounded-full flex items-center justify-center"
                        :class="transaction.amount >= 0 ? 'bg-green-100' : 'bg-red-100'"
                      >
                        <ArrowTrendingUpIcon
                          v-if="transaction.amount >= 0"
                          class="w-4 h-4 text-green-600"
                        />
                        <ArrowTrendingDownIcon
                          v-else
                          class="w-4 h-4 text-red-600"
                        />
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ transaction.description }}
                      </div>
                      <div v-if="transaction.notes" class="text-xs text-gray-500">
                        {{ transaction.notes }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Category -->
                <td class="table-cell">
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :style="{
                      backgroundColor: getCategoryColor(transaction.categoryId) + '20',
                      color: getCategoryColor(transaction.categoryId)
                    }"
                  >
                    {{ getCategoryName(transaction.categoryId) }}
                  </span>
                </td>

                <!-- Account -->
                <td class="table-cell">
                  <div class="flex items-center">
                    <div
                      class="w-3 h-3 rounded-full mr-2"
                      :style="{ backgroundColor: getAccountColor(transaction.accountId) }"
                    ></div>
                    <span class="text-sm text-gray-900">
                      {{ getAccountName(transaction.accountId) }}
                    </span>
                  </div>
                </td>

                <!-- Amount -->
                <td class="table-cell">
                  <div
                    class="text-sm font-semibold"
                    :class="transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ formatCurrency(transaction.amount) }}
                  </div>
                </td>

                <!-- Status -->
                <td class="table-cell">
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getStatusClass(transaction.status)"
                  >
                    {{ getStatusLabel(transaction.status) }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="table-cell">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="$emit('edit-transaction', transaction)"
                      class="text-gray-400 hover:text-indigo-600"
                      title="Editar"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="duplicateTransaction(transaction)"
                      class="text-gray-400 hover:text-blue-600"
                      title="Duplicar"
                    >
                      <DocumentDuplicateIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteTransaction(transaction)"
                      class="text-gray-400 hover:text-red-600"
                      title="Eliminar"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile view -->
        <div class="md:hidden">
          <div class="space-y-4 p-4">
            <div
              v-for="transaction in paginatedTransactions"
              :key="transaction.id"
              class="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <div
                    class="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                    :class="transaction.amount >= 0 ? 'bg-green-100' : 'bg-red-100'"
                  >
                    <ArrowTrendingUpIcon
                      v-if="transaction.amount >= 0"
                      class="w-4 h-4 text-green-600"
                    />
                    <ArrowTrendingDownIcon
                      v-else
                      class="w-4 h-4 text-red-600"
                    />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ transaction.description }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ formatDate(transaction.date) }}
                    </div>
                  </div>
                </div>
                <div
                  class="text-lg font-semibold"
                  :class="transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatCurrency(transaction.amount) }}
                </div>
              </div>
              
              <div class="flex items-center justify-between text-sm text-gray-500">
                <div class="flex items-center space-x-4">
                  <span>{{ getCategoryName(transaction.categoryId) }}</span>
                  <span>{{ getAccountName(transaction.accountId) }}</span>
                </div>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(transaction.status)"
                >
                  {{ getStatusLabel(transaction.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredTransactions.length === 0" class="flex items-center justify-center h-64">
          <div class="text-center">
            <BanknotesIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              No hay transacciones
            </h3>
            <p class="text-gray-500 mb-4">
              {{ searchQuery ? 'No se encontraron transacciones que coincidan con tu búsqueda' : 'Comienza agregando tu primera transacción' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-white border-t border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} de {{ filteredTransactions.length }} transacciones
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              Anterior
            </button>
            
            <div class="flex space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                class="px-3 py-2 text-sm rounded-md transition-colors"
                :class="page === currentPage ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'"
              >
                {{ page }}
              </button>
            </div>
            
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ChevronUpDownIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  accounts: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit-transaction', 'delete-transaction'])

const appStore = useAppStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const dateRange = ref({
  start: '',
  end: ''
})
const sortBy = ref('date')
const sortOrder = ref('desc')
const currentPage = ref(1)
const itemsPerPage = 20

const filteredTransactions = computed(() => {
  let filtered = [...props.transactions]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(transaction =>
      transaction.description.toLowerCase().includes(query) ||
      transaction.notes?.toLowerCase().includes(query) ||
      getCategoryName(transaction.categoryId).toLowerCase().includes(query) ||
      getAccountName(transaction.accountId).toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(transaction => transaction.categoryId === selectedCategory.value)
  }

  // Apply date range filter
  if (dateRange.value.start) {
    filtered = filtered.filter(transaction => 
      new Date(transaction.date) >= new Date(dateRange.value.start)
    )
  }
  if (dateRange.value.end) {
    filtered = filtered.filter(transaction => 
      new Date(transaction.date) <= new Date(dateRange.value.end)
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy.value) {
      case 'date':
        aValue = new Date(a.date)
        bValue = new Date(b.date)
        break
      case 'amount':
        aValue = Math.abs(a.amount)
        bValue = Math.abs(b.amount)
        break
      default:
        aValue = a[sortBy.value]
        bValue = b[sortBy.value]
    }

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return filtered
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpenses = computed(() => {
  return Math.abs(filteredTransactions.value
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0))
})

const netBalance = computed(() => {
  return totalIncome.value - totalExpenses.value
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryName = (categoryId) => {
  const category = props.categories.find(c => c.id === categoryId)
  return category?.name || 'Sin categoría'
}

const getCategoryColor = (categoryId) => {
  const category = props.categories.find(c => c.id === categoryId)
  return category?.color || '#6B7280'
}

const getAccountName = (accountId) => {
  const account = props.accounts.find(a => a.id === accountId)
  return account?.name || 'Cuenta desconocida'
}

const getAccountColor = (accountId) => {
  const account = props.accounts.find(a => a.id === accountId)
  return account?.color || '#6B7280'
}

const getStatusLabel = (status) => {
  const labels = {
    completed: 'Completado',
    pending: 'Pendiente',
    failed: 'Fallido',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const toggleSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'desc'
  }
  currentPage.value = 1
}

const duplicateTransaction = (transaction) => {
  const duplicated = {
    ...transaction,
    id: Date.now(),
    description: `${transaction.description} (copia)`,
    date: new Date().toISOString(),
    status: 'pending'
  }
  
  emit('edit-transaction', duplicated)
  appStore.showToast('Transacción duplicada', 'info')
}

const deleteTransaction = (transaction) => {
  const confirmed = confirm(`¿Estás seguro de que quieres eliminar la transacción "${transaction.description}"?`)
  
  if (confirmed) {
    emit('delete-transaction', transaction.id)
  }
}

const exportTransactions = () => {
  const csvData = [
    ['Fecha', 'Descripción', 'Categoría', 'Cuenta', 'Monto', 'Estado', 'Notas'],
    ...filteredTransactions.value.map(t => [
      formatDate(t.date),
      t.description,
      getCategoryName(t.categoryId),
      getAccountName(t.accountId),
      t.amount,
      getStatusLabel(t.status),
      t.notes || ''
    ])
  ]
  
  const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transacciones-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  appStore.showToast('Transacciones exportadas exitosamente', 'success')
}

// Reset pagination when filters change
watch([searchQuery, selectedCategory, dateRange], () => {
  currentPage.value = 1
}, { deep: true })
</script>

<style scoped>
.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap;
}
</style>