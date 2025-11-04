<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Analytics header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-gray-900">Análisis financiero</h2>
        
        <div class="flex items-center space-x-3">
          <!-- Period selector -->
          <select
            v-model="selectedPeriod"
            class="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 3 meses</option>
            <option value="365">Último año</option>
          </select>

          <!-- Export chart -->
          <button
            @click="exportCharts"
            class="btn-secondary"
          >
            <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      <!-- Key metrics -->
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90">Ingresos totales</div>
              <div class="text-2xl font-bold">{{ formatCurrency(totalIncome) }}</div>
              <div class="text-xs opacity-75 flex items-center mt-1">
                <ArrowTrendingUpIcon class="w-3 h-3 mr-1" />
                +{{ incomeGrowth }}% vs período anterior
              </div>
            </div>
            <BanknotesIcon class="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div class="bg-gradient-to-r from-red-400 to-red-600 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90">Gastos totales</div>
              <div class="text-2xl font-bold">{{ formatCurrency(totalExpenses) }}</div>
              <div class="text-xs opacity-75 flex items-center mt-1">
                <ArrowTrendingDownIcon class="w-3 h-3 mr-1" />
                {{ expenseGrowth > 0 ? '+' : '' }}{{ expenseGrowth }}% vs período anterior
              </div>
            </div>
            <CreditCardIcon class="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div class="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90">Balance neto</div>
              <div class="text-2xl font-bold">{{ formatCurrency(netBalance) }}</div>
              <div class="text-xs opacity-75 flex items-center mt-1">
                <component 
                  :is="netBalance >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon" 
                  class="w-3 h-3 mr-1" 
                />
                {{ netBalance >= 0 ? 'Positivo' : 'Negativo' }}
              </div>
            </div>
            <ChartBarIcon class="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div class="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90">Promedio diario</div>
              <div class="text-2xl font-bold">{{ formatCurrency(dailyAverage) }}</div>
              <div class="text-xs opacity-75">
                Últimos {{ selectedPeriod }} días
              </div>
            </div>
            <CalendarIcon class="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts section -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Income vs Expenses Chart -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Ingresos vs Gastos</h3>
            <select
              v-model="chartType"
              class="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="line">Líneas</option>
              <option value="bar">Barras</option>
              <option value="area">Área</option>
            </select>
          </div>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <ChartBarIcon class="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p class="text-sm text-gray-500">Gráfico de ingresos vs gastos</p>
              <div class="mt-4 space-y-2">
                <div class="flex items-center justify-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-green-500 rounded"></div>
                    <span class="text-xs text-gray-600">Ingresos: {{ formatCurrency(totalIncome) }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-red-500 rounded"></div>
                    <span class="text-xs text-gray-600">Gastos: {{ formatCurrency(totalExpenses) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Gastos por categoría</h3>
            <button
              @click="showCategoryDetails = !showCategoryDetails"
              class="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {{ showCategoryDetails ? 'Ocultar' : 'Ver' }} detalles
            </button>
          </div>
          <div class="h-64">
            <!-- Pie chart simulation -->
            <div class="flex items-center justify-center h-full">
              <div class="w-48 h-48 rounded-full border-8 border-gray-200 relative">
                <div
                  v-for="(category, index) in topExpenseCategories"
                  :key="category.id"
                  class="absolute inset-0 rounded-full"
                  :style="getPieSliceStyle(category, index)"
                ></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-sm font-medium text-gray-900">Total</div>
                    <div class="text-lg font-bold text-gray-900">{{ formatCurrency(totalExpenses) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Category legend -->
          <div class="mt-4 space-y-2">
            <div
              v-for="(category, index) in topExpenseCategories"
              :key="category.id"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center space-x-2">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <span class="text-gray-700">{{ category.name }}</span>
              </div>
              <div class="text-right">
                <div class="font-medium text-gray-900">{{ formatCurrency(category.total) }}</div>
                <div class="text-xs text-gray-500">{{ category.percentage }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly trends -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Account balances -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Balances por cuenta</h3>
          <div class="space-y-3">
            <div
              v-for="account in accounts"
              :key="account.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: account.color }"
                ></div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ account.name }}</div>
                  <div class="text-xs text-gray-500">{{ account.type }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(account.balance) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ getAccountPercentage(account.balance) }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly comparison -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Comparación mensual</h3>
          <div class="space-y-4">
            <div
              v-for="month in monthlyComparison"
              :key="month.name"
              class="space-y-2"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-700">{{ month.name }}</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(month.total) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :class="month.total >= 0 ? 'bg-green-500' : 'bg-red-500'"
                  :style="{ width: `${Math.min(100, Math.abs(month.total) / maxMonthlyAmount * 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Savings rate -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Tasa de ahorro</h3>
          <div class="text-center">
            <div class="relative w-32 h-32 mx-auto">
              <svg class="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  class="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  stroke-dasharray="351.86"
                  :stroke-dashoffset="351.86 - (savingsRate / 100 * 351.86)"
                  class="text-indigo-600 transition-all duration-1000 ease-out"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">{{ savingsRate }}%</div>
                  <div class="text-xs text-gray-500">Ahorro</div>
                </div>
              </div>
            </div>
            <div class="mt-4 text-sm text-gray-600">
              <div class="mb-2">Meta de ahorro: 20%</div>
              <div
                class="text-xs"
                :class="savingsRate >= 20 ? 'text-green-600' : 'text-red-600'"
              >
                {{ savingsRate >= 20 ? 'Meta alcanzada ✓' : `Faltan ${20 - savingsRate}% para la meta` }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed analytics -->
      <div v-if="showCategoryDetails" class="bg-white border border-gray-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Análisis detallado por categoría</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-header">Categoría</th>
                <th class="table-header">Transacciones</th>
                <th class="table-header">Total gastado</th>
                <th class="table-header">Promedio</th>
                <th class="table-header">% del total</th>
                <th class="table-header">Tendencia</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="category in categoryAnalytics"
                :key="category.id"
                class="hover:bg-gray-50"
              >
                <td class="table-cell">
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: category.color }"
                    ></div>
                    <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
                  </div>
                </td>
                <td class="table-cell">
                  <span class="text-sm text-gray-900">{{ category.transactionCount }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-sm font-medium text-gray-900">{{ formatCurrency(category.total) }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-sm text-gray-900">{{ formatCurrency(category.average) }}</span>
                </td>
                <td class="table-cell">
                  <span class="text-sm text-gray-900">{{ category.percentage }}%</span>
                </td>
                <td class="table-cell">
                  <div class="flex items-center">
                    <component
                      :is="category.trend >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon"
                      class="w-4 h-4 mr-1"
                      :class="category.trend >= 0 ? 'text-red-500' : 'text-green-500'"
                    />
                    <span
                      class="text-sm"
                      :class="category.trend >= 0 ? 'text-red-600' : 'text-green-600'"
                    >
                      {{ Math.abs(category.trend) }}%
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
  CalendarIcon
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

const appStore = useAppStore()

const selectedPeriod = ref(30)
const chartType = ref('line')
const showCategoryDetails = ref(false)

// Calculate period start date
const periodStart = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() - selectedPeriod.value)
  return date
})

// Filter transactions by period
const periodTransactions = computed(() => {
  return props.transactions.filter(transaction => 
    new Date(transaction.date) >= periodStart.value
  )
})

const totalIncome = computed(() => {
  return periodTransactions.value
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpenses = computed(() => {
  return Math.abs(periodTransactions.value
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0))
})

const netBalance = computed(() => {
  return totalIncome.value - totalExpenses.value
})

const dailyAverage = computed(() => {
  return netBalance.value / selectedPeriod.value
})

const incomeGrowth = computed(() => {
  // Mock calculation - in real app, compare with previous period
  return 12.5
})

const expenseGrowth = computed(() => {
  // Mock calculation - in real app, compare with previous period
  return -5.2
})

const savingsRate = computed(() => {
  if (totalIncome.value === 0) return 0
  return Math.round((netBalance.value / totalIncome.value) * 100)
})

const topExpenseCategories = computed(() => {
  const categoryTotals = {}
  
  periodTransactions.value
    .filter(t => t.amount < 0)
    .forEach(transaction => {
      const categoryId = transaction.categoryId
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0
      }
      categoryTotals[categoryId] += Math.abs(transaction.amount)
    })
  
  return props.categories
    .map(category => ({
      ...category,
      total: categoryTotals[category.id] || 0,
      percentage: totalExpenses.value > 0 ? 
        Math.round((categoryTotals[category.id] || 0) / totalExpenses.value * 100) : 0
    }))
    .filter(category => category.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
})

const categoryAnalytics = computed(() => {
  const categoryStats = {}
  
  periodTransactions.value
    .filter(t => t.amount < 0)
    .forEach(transaction => {
      const categoryId = transaction.categoryId
      if (!categoryStats[categoryId]) {
        categoryStats[categoryId] = {
          total: 0,
          transactionCount: 0,
          amounts: []
        }
      }
      
      const amount = Math.abs(transaction.amount)
      categoryStats[categoryId].total += amount
      categoryStats[categoryId].transactionCount++
      categoryStats[categoryId].amounts.push(amount)
    })
  
  return props.categories
    .map(category => {
      const stats = categoryStats[category.id] || { total: 0, transactionCount: 0, amounts: [] }
      return {
        ...category,
        total: stats.total,
        transactionCount: stats.transactionCount,
        average: stats.transactionCount > 0 ? stats.total / stats.transactionCount : 0,
        percentage: totalExpenses.value > 0 ? 
          Math.round(stats.total / totalExpenses.value * 100) : 0,
        trend: Math.random() * 20 - 10 // Mock trend data
      }
    })
    .filter(category => category.total > 0)
    .sort((a, b) => b.total - a.total)
})

const monthlyComparison = computed(() => {
  const months = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    const monthTransactions = props.transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= monthStart && transactionDate <= monthEnd
    })
    
    const income = monthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = Math.abs(monthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0))
    
    months.push({
      name: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
      total: income - expenses,
      income,
      expenses
    })
  }
  
  return months
})

const maxMonthlyAmount = computed(() => {
  return Math.max(...monthlyComparison.value.map(m => Math.abs(m.total)))
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getAccountPercentage = (balance) => {
  const totalBalance = props.accounts.reduce((sum, account) => sum + account.balance, 0)
  return totalBalance > 0 ? Math.round((balance / totalBalance) * 100) : 0
}

const getPieSliceStyle = (category, index) => {
  // Simplified pie chart styling - in real app, use proper chart library
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9'
  ]
  
  return {
    backgroundColor: colors[index % colors.length],
    opacity: 0.8
  }
}

const exportCharts = () => {
  // Mock export functionality
  const data = {
    period: `${selectedPeriod.value} días`,
    totalIncome: totalIncome.value,
    totalExpenses: totalExpenses.value,
    netBalance: netBalance.value,
    savingsRate: savingsRate.value,
    topCategories: topExpenseCategories.value,
    monthlyComparison: monthlyComparison.value
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analisis-financiero-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  appStore.showToast('Análisis exportado exitosamente', 'success')
}
</script>

<style scoped>
.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap;
}
</style>