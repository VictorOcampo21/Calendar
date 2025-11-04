<template>
  <div class="h-full flex flex-col">
    <!-- Finance header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Finanzas</h1>
          <p class="text-sm text-gray-600 mt-1">
            Gestiona tus finanzas personales y de empresa
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <!-- Quick actions -->
          <button
            @click="showAddTransaction = true"
            class="btn-primary"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Nueva transacción
          </button>
          
          <div class="relative">
            <button
              @click="showQuickMenu = !showQuickMenu"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <EllipsisVerticalIcon class="w-5 h-5" />
            </button>
            
            <div
              v-if="showQuickMenu"
              v-click-outside="() => showQuickMenu = false"
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
            >
              <div class="py-1">
                <button
                  @click="showAddAccount = true; showQuickMenu = false"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <CreditCardIcon class="w-4 h-4 inline mr-2" />
                  Agregar cuenta
                </button>
                <button
                  @click="showCreateBudget = true; showQuickMenu = false"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <CalculatorIcon class="w-4 h-4 inline mr-2" />
                  Crear presupuesto
                </button>
                <button
                  @click="showFinanceSettings = true; showQuickMenu = false"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <CogIcon class="w-4 h-4 inline mr-2" />
                  Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Finance content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar -->
      <div class="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <!-- Account summary -->
        <div class="p-6 bg-white border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Resumen</h3>
          
          <!-- Total balance -->
          <div class="mb-6">
            <div class="text-3xl font-bold text-gray-900">
              {{ formatCurrency(totalBalance) }}
            </div>
            <div class="flex items-center mt-1">
              <span class="text-sm text-gray-500">Balance total</span>
              <div class="flex items-center ml-2">
                <ArrowTrendingUpIcon
                  v-if="balanceChange >= 0"
                  class="w-4 h-4 text-green-500"
                />
                <ArrowTrendingDownIcon
                  v-else
                  class="w-4 h-4 text-red-500"
                />
                <span
                  class="text-sm ml-1"
                  :class="balanceChange >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatCurrency(Math.abs(balanceChange)) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Monthly summary -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-green-50 rounded-lg p-3">
              <div class="text-sm text-green-600 font-medium">Ingresos</div>
              <div class="text-lg font-semibold text-green-900">
                {{ formatCurrency(monthlyIncome) }}
              </div>
            </div>
            <div class="bg-red-50 rounded-lg p-3">
              <div class="text-sm text-red-600 font-medium">Gastos</div>
              <div class="text-lg font-semibold text-red-900">
                {{ formatCurrency(monthlyExpenses) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Accounts list -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-medium text-gray-900">Cuentas</h4>
              <button
                @click="showAddAccount = true"
                class="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                Agregar
              </button>
            </div>
            
            <div class="space-y-2">
              <div
                v-for="account in accounts"
                :key="account.id"
                class="account-item"
                :class="{ 'active': selectedAccount?.id === account.id }"
                @click="selectAccount(account)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: account.color }"
                    ></div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ account.name }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ account.type }}
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">
                      {{ formatCurrency(account.balance) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick filters -->
          <div class="p-4 border-t border-gray-200">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Filtros rápidos</h4>
            <div class="space-y-2">
              <button
                v-for="filter in quickFilters"
                :key="filter.key"
                class="filter-btn"
                :class="{ 'active': activeFilter === filter.key }"
                @click="applyFilter(filter.key)"
              >
                <component :is="filter.icon" class="w-4 h-4 mr-2" />
                {{ filter.label }}
              </button>
            </div>
          </div>

          <!-- Categories -->
          <div class="p-4 border-t border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-medium text-gray-900">Categorías</h4>
              <button
                @click="showCategoryManager = true"
                class="text-indigo-600 hover:text-indigo-800 text-xs"
              >
                Gestionar
              </button>
            </div>
            
            <div class="space-y-1">
              <div
                v-for="category in topCategories"
                :key="category.id"
                class="flex items-center justify-between py-1"
              >
                <div class="flex items-center space-x-2">
                  <div
                    class="w-2 h-2 rounded-full"
                    :style="{ backgroundColor: category.color }"
                  ></div>
                  <span class="text-xs text-gray-600">{{ category.name }}</span>
                </div>
                <span class="text-xs font-medium text-gray-900">
                  {{ formatCurrency(category.total) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Tabs -->
        <div class="border-b border-gray-200 bg-white">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="tab-btn"
              :class="{ 'active': activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              <component :is="tab.icon" class="w-4 h-4 mr-2" />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab content -->
        <div class="flex-1 overflow-hidden">
          <!-- Transactions tab -->
          <TransactionsTab
            v-if="activeTab === 'transactions'"
            :transactions="filteredTransactions"
            :accounts="accounts"
            :categories="categories"
            @edit-transaction="editTransaction"
            @delete-transaction="deleteTransaction"
          />

          <!-- Analytics tab -->
          <AnalyticsTab
            v-else-if="activeTab === 'analytics'"
            :transactions="transactions"
            :accounts="accounts"
            :categories="categories"
          />

          <!-- Budgets tab -->
          <BudgetsTab
            v-else-if="activeTab === 'budgets'"
            :budgets="budgets"
            :transactions="transactions"
            :categories="categories"
            @create-budget="showCreateBudget = true"
            @edit-budget="editBudget"
            @delete-budget="deleteBudget"
          />

          <!-- Reports tab -->
          <ReportsTab
            v-else-if="activeTab === 'reports'"
            :transactions="transactions"
            :accounts="accounts"
            :categories="categories"
          />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddTransactionModal
      :is-open="showAddTransaction"
      :accounts="accounts"
      :categories="categories"
      @close="showAddTransaction = false"
      @transaction-added="handleTransactionAdded"
    />

    <AddAccountModal
      :is-open="showAddAccount"
      @close="showAddAccount = false"
      @account-added="handleAccountAdded"
    />

    <CreateBudgetModal
      :is-open="showCreateBudget"
      :categories="categories"
      @close="showCreateBudget = false"
      @budget-created="handleBudgetCreated"
    />

    <CategoryManagerModal
      :is-open="showCategoryManager"
      :categories="categories"
      @close="showCategoryManager = false"
      @categories-updated="handleCategoriesUpdated"
    />

    <FinanceSettingsModal
      :is-open="showFinanceSettings"
      @close="showFinanceSettings = false"
      @settings-updated="handleSettingsUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { mockAccounts, mockTransactions, mockBudgets, mockCategories } from '@/mock-data'
import {
  PlusIcon,
  EllipsisVerticalIcon,
  CreditCardIcon,
  CalculatorIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  TagIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline'

// Components
import TransactionsTab from '@/components/finance/TransactionsTab.vue'
import AnalyticsTab from '@/components/finance/AnalyticsTab.vue'
import BudgetsTab from '@/components/finance/BudgetsTab.vue'
import ReportsTab from '@/components/finance/ReportsTab.vue'
import AddTransactionModal from '@/components/finance/AddTransactionModal.vue'
import AddAccountModal from '@/components/finance/AddAccountModal.vue'
import CreateBudgetModal from '@/components/finance/CreateBudgetModal.vue'
import CategoryManagerModal from '@/components/finance/CategoryManagerModal.vue'
import FinanceSettingsModal from '@/components/finance/FinanceSettingsModal.vue'

const authStore = useAuthStore()
const appStore = useAppStore()

const activeTab = ref('transactions')
const selectedAccount = ref(null)
const activeFilter = ref('all')
const showQuickMenu = ref(false)
const showAddTransaction = ref(false)
const showAddAccount = ref(false)
const showCreateBudget = ref(false)
const showCategoryManager = ref(false)
const showFinanceSettings = ref(false)

const accounts = ref([])
const transactions = ref([])
const budgets = ref([])
const categories = ref([])

const tabs = [
  { key: 'transactions', label: 'Transacciones', icon: BanknotesIcon },
  { key: 'analytics', label: 'Análisis', icon: ChartBarIcon },
  { key: 'budgets', label: 'Presupuestos', icon: ClipboardDocumentListIcon },
  { key: 'reports', label: 'Reportes', icon: DocumentChartBarIcon }
]

const quickFilters = [
  { key: 'all', label: 'Todas', icon: FunnelIcon },
  { key: 'today', label: 'Hoy', icon: CalendarIcon },
  { key: 'week', label: 'Esta semana', icon: CalendarIcon },
  { key: 'month', label: 'Este mes', icon: CalendarIcon },
  { key: 'income', label: 'Ingresos', icon: ArrowTrendingUpIcon },
  { key: 'expenses', label: 'Gastos', icon: ArrowTrendingDownIcon }
]

const totalBalance = computed(() => {
  return accounts.value.reduce((sum, account) => sum + account.balance, 0)
})

const balanceChange = computed(() => {
  // Calculate balance change from last month (mock data)
  return 1250.75
})

const monthlyIncome = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return transactions.value
    .filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear && 
             t.amount > 0
    })
    .reduce((sum, t) => sum + t.amount, 0)
})

const monthlyExpenses = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return Math.abs(transactions.value
    .filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear && 
             t.amount < 0
    })
    .reduce((sum, t) => sum + t.amount, 0))
})

const topCategories = computed(() => {
  const categoryTotals = {}
  
  transactions.value.forEach(transaction => {
    const categoryId = transaction.categoryId
    if (!categoryTotals[categoryId]) {
      categoryTotals[categoryId] = 0
    }
    categoryTotals[categoryId] += Math.abs(transaction.amount)
  })
  
  return categories.value
    .map(category => ({
      ...category,
      total: categoryTotals[category.id] || 0
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
})

const filteredTransactions = computed(() => {
  let filtered = [...transactions.value]
  
  // Filter by account
  if (selectedAccount.value) {
    filtered = filtered.filter(t => t.accountId === selectedAccount.value.id)
  }
  
  // Apply quick filters
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  
  switch (activeFilter.value) {
    case 'today':
      filtered = filtered.filter(t => new Date(t.date) >= today)
      break
    case 'week':
      filtered = filtered.filter(t => new Date(t.date) >= weekStart)
      break
    case 'month':
      filtered = filtered.filter(t => new Date(t.date) >= monthStart)
      break
    case 'income':
      filtered = filtered.filter(t => t.amount > 0)
      break
    case 'expenses':
      filtered = filtered.filter(t => t.amount < 0)
      break
  }
  
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const selectAccount = (account) => {
  selectedAccount.value = selectedAccount.value?.id === account.id ? null : account
}

const applyFilter = (filterKey) => {
  activeFilter.value = filterKey
}

const handleTransactionAdded = (transactionData) => {
  const newTransaction = {
    id: Date.now(),
    ...transactionData,
    workspaceId: authStore.currentWorkspace?.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  transactions.value.unshift(newTransaction)
  
  // Update account balance
  const account = accounts.value.find(a => a.id === transactionData.accountId)
  if (account) {
    account.balance += transactionData.amount
  }
  
  appStore.showToast('Transacción agregada exitosamente', 'success')
}

const handleAccountAdded = (accountData) => {
  const newAccount = {
    id: Date.now(),
    ...accountData,
    workspaceId: authStore.currentWorkspace?.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  accounts.value.push(newAccount)
  appStore.showToast('Cuenta agregada exitosamente', 'success')
}

const handleBudgetCreated = (budgetData) => {
  const newBudget = {
    id: Date.now(),
    ...budgetData,
    workspaceId: authStore.currentWorkspace?.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  budgets.value.push(newBudget)
  appStore.showToast('Presupuesto creado exitosamente', 'success')
}

const handleCategoriesUpdated = (updatedCategories) => {
  categories.value = updatedCategories
  appStore.showToast('Categorías actualizadas', 'success')
}

const handleSettingsUpdated = (settings) => {
  console.log('Finance settings updated:', settings)
  appStore.showToast('Configuración actualizada', 'success')
}

const editTransaction = (transaction) => {
  console.log('Edit transaction:', transaction)
  // Implementation would open edit modal
}

const deleteTransaction = (transactionId) => {
  const index = transactions.value.findIndex(t => t.id === transactionId)
  if (index > -1) {
    const transaction = transactions.value[index]
    
    // Update account balance
    const account = accounts.value.find(a => a.id === transaction.accountId)
    if (account) {
      account.balance -= transaction.amount
    }
    
    transactions.value.splice(index, 1)
    appStore.showToast('Transacción eliminada', 'info')
  }
}

const editBudget = (budget) => {
  console.log('Edit budget:', budget)
  // Implementation would open edit modal
}

const deleteBudget = (budgetId) => {
  const index = budgets.value.findIndex(b => b.id === budgetId)
  if (index > -1) {
    budgets.value.splice(index, 1)
    appStore.showToast('Presupuesto eliminado', 'info')
  }
}

onMounted(() => {
  // Load finance data from mock data
  accounts.value = [...mockAccounts]
  transactions.value = [...mockTransactions]
  budgets.value = [...mockBudgets]
  categories.value = [...mockCategories]
})
</script>

<style scoped>
.account-item {
  @apply p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100;
}

.account-item.active {
  @apply bg-indigo-100 border border-indigo-200;
}

.filter-btn {
  @apply w-full flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors;
}

.filter-btn.active {
  @apply bg-indigo-100 text-indigo-700;
}

.tab-btn {
  @apply flex items-center py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors;
}

.tab-btn.active {
  @apply border-indigo-500 text-indigo-600;
}
</style>