<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Configuración financiera</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-6">
        <!-- Currency Settings -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">Moneda predeterminada</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Moneda principal</label>
              <select
                v-model="settings.defaultCurrency"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dólar estadounidense ($)</option>
                <option value="GBP">Libra esterlina (£)</option>
                <option value="JPY">Yen japonés (¥)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Formato de números</label>
              <select
                v-model="settings.numberFormat"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="1,234.56">1,234.56</option>
                <option value="1.234,56">1.234,56</option>
                <option value="1 234,56">1 234,56</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Budget Settings -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">Configuración de presupuestos</h4>
          <div class="space-y-4">
            <label class="flex items-center">
              <input
                v-model="settings.budgetAlerts"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Activar alertas de presupuesto</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="settings.autoRenewBudgets"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Renovar presupuestos automáticamente</span>
            </label>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Día de inicio del mes fiscal</label>
              <select
                v-model="settings.fiscalMonthStart"
                class="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option v-for="day in 31" :key="day" :value="day">{{ day }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Transaction Settings -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">Configuración de transacciones</h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoría predeterminada para gastos</label>
              <select
                v-model="settings.defaultExpenseCategory"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sin categoría predeterminada</option>
                <option
                  v-for="category in expenseCategories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoría predeterminada para ingresos</label>
              <select
                v-model="settings.defaultIncomeCategory"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sin categoría predeterminada</option>
                <option
                  v-for="category in incomeCategories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            <label class="flex items-center">
              <input
                v-model="settings.requireDescription"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Requerir descripción en transacciones</span>
            </label>
          </div>
        </div>

        <!-- Data Management -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">Gestión de datos</h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Retener datos por</label>
              <select
                v-model="settings.dataRetention"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="1">1 año</option>
                <option value="2">2 años</option>
                <option value="5">5 años</option>
                <option value="forever">Para siempre</option>
              </select>
            </div>
            <div class="flex space-x-3">
              <button
                @click="exportData"
                class="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-md"
              >
                Exportar datos
              </button>
              <button
                @click="importData"
                class="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-md"
              >
                Importar datos
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium text-gray-900 mb-3">Notificaciones</h4>
          <div class="space-y-4">
            <label class="flex items-center">
              <input
                v-model="settings.emailNotifications"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Notificaciones por email</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="settings.pushNotifications"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Notificaciones push</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="settings.weeklyReports"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Informes semanales</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="settings.monthlyReports"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Informes mensuales</span>
            </label>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-6">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancelar
        </button>
        <button
          @click="saveSettings"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'settings-saved', 'settings-updated'])

const settings = ref({
  defaultCurrency: 'EUR',
  numberFormat: '1,234.56',
  budgetAlerts: true,
  autoRenewBudgets: false,
  fiscalMonthStart: 1,
  defaultExpenseCategory: '',
  defaultIncomeCategory: '',
  requireDescription: false,
  dataRetention: '2',
  emailNotifications: true,
  pushNotifications: true,
  weeklyReports: false,
  monthlyReports: true
})

// Mock categories for demo
const expenseCategories = ref([
  { id: 1, name: 'Alimentación' },
  { id: 2, name: 'Transporte' },
  { id: 3, name: 'Entretenimiento' },
  { id: 4, name: 'Salud' }
])

const incomeCategories = ref([
  { id: 5, name: 'Salario' },
  { id: 6, name: 'Freelance' },
  { id: 7, name: 'Inversiones' }
])

const saveSettings = () => {
  // In a real app, save to backend
  // Emit both legacy and current events for compatibility
  emit('settings-saved', settings.value)
  emit('settings-updated', settings.value)
  emit('close')
}

const exportData = () => {
  // Mock export functionality
  const data = {
    transactions: [],
    budgets: [],
    categories: [],
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          console.log('Imported data:', data)
          // Process imported data
        } catch (error) {
          console.error('Error parsing imported file:', error)
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}
</script>