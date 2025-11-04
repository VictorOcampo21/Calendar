<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Resumen Financiero</h3>
      <router-link 
        to="/finance" 
        class="text-sm text-primary-600 hover:text-primary-700"
      >
        Ver detalles
      </router-link>
    </div>

    <!-- Balance cards -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-green-50 rounded-lg p-4">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <ArrowTrendingUpIcon class="w-5 h-5 text-green-600" />
          </div>
          <div class="ml-3">
            <p class="text-xs text-green-600 font-medium">Total Ingresos</p>
            <p class="text-lg font-semibold text-green-900">{{ totalIncome }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-red-50 rounded-lg p-4">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <ArrowTrendingDownIcon class="w-5 h-5 text-red-600" />
          </div>
          <div class="ml-3">
            <p class="text-xs text-red-600 font-medium">Total Gastos</p>
            <p class="text-lg font-semibold text-red-900">{{ totalExpenses }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Net balance -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">Balance Neto</span>
        <span 
          class="text-lg font-semibold"
          :class="netBalance >= 0 ? 'text-green-600' : 'text-red-600'"
        >
          {{ appStore.formatCurrency(netBalance) }}
        </span>
      </div>
    </div>

    <!-- Recent transactions -->
    <div>
      <h4 class="text-sm font-medium text-gray-700 mb-3">Transacciones Recientes</h4>
      <div class="space-y-2">
        <div
          v-for="transaction in recentTransactions.slice(0, 3)"
          :key="transaction.id"
          class="flex items-center justify-between py-2 hover:bg-gray-50 rounded px-2 -mx-2 cursor-pointer"
          @click="openTransaction(transaction)"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              :class="transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
            >
              {{ getCategoryIcon(transaction.categoryId) }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 truncate max-w-32">
                {{ transaction.description }}
              </p>
              <p class="text-xs text-gray-500">
                {{ appStore.formatDate(transaction.date) }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p 
              class="text-sm font-semibold"
              :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
            >
              {{ transaction.type === 'income' ? '+' : '' }}{{ appStore.formatCurrency(transaction.amount) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="showIncomeModal = true"
          class="text-xs bg-green-100 text-green-800 px-3 py-2 rounded-md hover:bg-green-200 transition-colors"
        >
          + Ingreso
        </button>
        <button
          @click="showExpenseModal = true"
          class="text-xs bg-red-100 text-red-800 px-3 py-2 rounded-md hover:bg-red-200 transition-colors"
        >
          - Gasto
        </button>
      </div>
    </div>

    <!-- Simple modals for quick add -->
    <QuickIncomeModal v-if="showIncomeModal" @close="showIncomeModal = false" />
    <QuickExpenseModal v-if="showExpenseModal" @close="showExpenseModal = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { mockTransactions, financeCategories } from '@/mock-data'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/vue/24/outline'
import QuickIncomeModal from '@/components/QuickIncomeModal.vue'
import QuickExpenseModal from '@/components/QuickExpenseModal.vue'
import { subDays } from 'date-fns'

const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const showIncomeModal = ref(false)
const showExpenseModal = ref(false)

const recentTransactions = computed(() => {
  return mockTransactions
    .filter(t => t.workspaceId === authStore.currentWorkspace?.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalIncome = computed(() => {
  const thirtyDaysAgo = subDays(new Date(), 30)
  const income = recentTransactions.value
    .filter(t => t.type === 'income' && new Date(t.date) >= thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0)
  
  return appStore.formatCurrency(income)
})

const totalExpenses = computed(() => {
  const thirtyDaysAgo = subDays(new Date(), 30)
  const expenses = recentTransactions.value
    .filter(t => t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  return appStore.formatCurrency(expenses)
})

const netBalance = computed(() => {
  const thirtyDaysAgo = subDays(new Date(), 30)
  return recentTransactions.value
    .filter(t => new Date(t.date) >= thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0)
})

const getCategoryIcon = (categoryId) => {
  const category = financeCategories.find(cat => cat.id === categoryId)
  return category?.icon || '💰'
}

const openTransaction = (transaction) => {
  router.push(`/finance?transaction=${transaction.id}`)
}
</script>