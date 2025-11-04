<template>
  <div class="space-y-6">
    <!-- Report filters -->
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Filtros de reporte</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
          <select
            v-model="filters.period"
            @change="generateReport"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="last7">Últimos 7 días</option>
            <option value="last30">Últimos 30 días</option>
            <option value="currentMonth">Mes actual</option>
            <option value="lastMonth">Mes pasado</option>
            <option value="currentYear">Año actual</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
        
        <div v-if="filters.period === 'custom'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input
            v-model="filters.dateFrom"
            @change="generateReport"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div v-if="filters.period === 'custom'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input
            v-model="filters.dateTo"
            @change="generateReport"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            v-model="filters.category"
            @change="generateReport"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
        </div>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-lg shadow">
        <h4 class="text-sm font-medium text-gray-500">Ingresos totales</h4>
        <p class="text-2xl font-bold text-green-600">{{ formatCurrency(summary.totalIncome) }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h4 class="text-sm font-medium text-gray-500">Gastos totales</h4>
        <p class="text-2xl font-bold text-red-600">{{ formatCurrency(summary.totalExpenses) }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h4 class="text-sm font-medium text-gray-500">Balance neto</h4>
        <p class="text-2xl font-bold" :class="summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatCurrency(summary.netBalance) }}
        </p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h4 class="text-sm font-medium text-gray-500">Transacciones</h4>
        <p class="text-2xl font-bold text-gray-900">{{ summary.transactionCount }}</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Expenses by category chart -->
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Gastos por categoría</h3>
        <div class="space-y-3">
          <div
            v-for="item in expensesByCategory"
            :key="item.category"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: item.color }"
              ></div>
              <span class="text-sm text-gray-700">{{ item.category }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-sm font-medium">{{ formatCurrency(item.amount) }}</span>
              <span class="text-xs text-gray-500">{{ item.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly trend chart -->
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Tendencia mensual</h3>
        <div class="space-y-3">
          <div
            v-for="month in monthlyTrend"
            :key="month.month"
            class="flex items-center justify-between"
          >
            <span class="text-sm text-gray-700">{{ month.month }}</span>
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-xs text-gray-600">{{ formatCurrency(month.income) }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-xs text-gray-600">{{ formatCurrency(month.expenses) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top transactions -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Transacciones más grandes</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in topTransactions" :key="transaction.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(transaction.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaction.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ transaction.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" 
                  :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'">
                {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(Math.abs(transaction.amount)) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Export options -->
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Exportar reporte</h3>
      <div class="flex space-x-3">
        <button
          @click="exportToPDF"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
        >
          Exportar a PDF
        </button>
        <button
          @click="exportToExcel"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
        >
          Exportar a Excel
        </button>
        <button
          @click="exportToCSV"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Exportar a CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const filters = ref({
  period: 'currentMonth',
  dateFrom: '',
  dateTo: '',
  category: ''
})

const summary = ref({
  totalIncome: 0,
  totalExpenses: 0,
  netBalance: 0,
  transactionCount: 0
})

const expensesByCategory = ref([
  { category: 'Alimentación', amount: 450, percentage: 35, color: '#EF4444' },
  { category: 'Transporte', amount: 280, percentage: 22, color: '#3B82F6' },
  { category: 'Entretenimiento', amount: 200, percentage: 15, color: '#8B5CF6' },
  { category: 'Salud', amount: 150, percentage: 12, color: '#10B981' },
  { category: 'Otros', amount: 205, percentage: 16, color: '#6B7280' }
])

const monthlyTrend = ref([
  { month: 'Enero', income: 2500, expenses: 1800 },
  { month: 'Febrero', income: 2800, expenses: 2100 },
  { month: 'Marzo', income: 2600, expenses: 1950 },
  { month: 'Abril', income: 3000, expenses: 2200 },
  { month: 'Mayo', income: 2750, expenses: 2050 },
  { month: 'Junio', income: 2900, expenses: 2300 }
])

const topTransactions = ref([
  { id: 1, date: '2024-01-15', description: 'Salario mensual', category: 'Salario', amount: 2500, type: 'income' },
  { id: 2, date: '2024-01-10', description: 'Alquiler', category: 'Vivienda', amount: -800, type: 'expense' },
  { id: 3, date: '2024-01-08', description: 'Compra supermercado', category: 'Alimentación', amount: -120, type: 'expense' },
  { id: 4, date: '2024-01-05', description: 'Freelance proyecto', category: 'Freelance', amount: 500, type: 'income' },
  { id: 5, date: '2024-01-03', description: 'Gasolina', category: 'Transporte', amount: -65, type: 'expense' }
])

const categories = ref([
  { id: 1, name: 'Alimentación' },
  { id: 2, name: 'Transporte' },
  { id: 3, name: 'Entretenimiento' },
  { id: 4, name: 'Salud' },
  { id: 5, name: 'Vivienda' }
])

const generateReport = () => {
  // Mock report generation based on filters
  summary.value = {
    totalIncome: 3500,
    totalExpenses: 1285,
    netBalance: 2215,
    transactionCount: 24
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const exportToPDF = () => {
  // Mock PDF export
  console.log('Exporting to PDF...')
}

const exportToExcel = () => {
  // Mock Excel export
  console.log('Exporting to Excel...')
}

const exportToCSV = () => {
  // Mock CSV export
  const csvData = topTransactions.value.map(t => 
    `${t.date},${t.description},${t.category},${t.amount}`
  ).join('\n')
  
  const header = 'Fecha,Descripción,Categoría,Monto\n'
  const blob = new Blob([header + csvData], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reporte-financiero-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  generateReport()
})
</script>