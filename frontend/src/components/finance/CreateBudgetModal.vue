<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">
          {{ editingBudget ? 'Editar presupuesto' : 'Crear presupuesto' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="saveBudget">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del presupuesto</label>
            <input
              v-model="budgetForm.name"
              type="text"
              placeholder="Ej: Gastos de octubre"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              v-model="budgetForm.categoryId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Seleccionar categoría</option>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Límite de gasto</label>
            <div class="relative">
              <input
                v-model.number="budgetForm.limit"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <span class="absolute right-3 top-2 text-gray-500">€</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select
              v-model="budgetForm.period"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="monthly">Mensual</option>
              <option value="weekly">Semanal</option>
              <option value="yearly">Anual</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
            <input
              v-model="budgetForm.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alertas</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="budgetForm.alertAt75"
                  type="checkbox"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-700">Alerta al 75% del límite</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="budgetForm.alertAt90"
                  type="checkbox"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-700">Alerta al 90% del límite</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="budgetForm.alertAtLimit"
                  type="checkbox"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-700">Alerta al alcanzar el límite</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              v-model="budgetForm.description"
              rows="3"
              placeholder="Descripción opcional del presupuesto..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            {{ editingBudget ? 'Actualizar' : 'Crear' }} presupuesto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  budget: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'budget-created', 'budget-updated'])

const editingBudget = computed(() => !!props.budget)

const budgetForm = ref({
  name: '',
  categoryId: '',
  limit: 0,
  period: 'monthly',
  startDate: new Date().toISOString().split('T')[0],
  alertAt75: true,
  alertAt90: true,
  alertAtLimit: true,
  description: ''
})

// Mock categories for demo
const expenseCategories = ref([
  { id: 1, name: 'Alimentación' },
  { id: 2, name: 'Transporte' },
  { id: 3, name: 'Entretenimiento' },
  { id: 4, name: 'Salud' },
  { id: 5, name: 'Compras' },
  { id: 6, name: 'Vivienda' }
])

// Initialize form with existing budget data if editing
if (props.budget) {
  budgetForm.value = { ...props.budget }
}

const saveBudget = () => {
  const budgetData = {
    id: editingBudget.value ? props.budget.id : Date.now(),
    ...budgetForm.value,
    spent: editingBudget.value ? props.budget.spent : 0,
    createdAt: editingBudget.value ? props.budget.createdAt : new Date().toISOString()
  }

  if (editingBudget.value) {
    emit('budget-updated', budgetData)
  } else {
    emit('budget-created', budgetData)
  }

  emit('close')
}
</script>