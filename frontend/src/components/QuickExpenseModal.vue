<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Gasto rápido</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="submitExpense">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input
              v-model="expense.amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              v-model="expense.description"
              type="text"
              placeholder="Descripción del gasto..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              v-model="expense.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="food">Alimentación</option>
              <option value="transport">Transporte</option>
              <option value="entertainment">Entretenimiento</option>
              <option value="utilities">Servicios</option>
              <option value="shopping">Compras</option>
              <option value="other">Otros</option>
            </select>
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
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            Agregar gasto
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close', 'expense-added'])

const expense = ref({
  amount: '',
  description: '',
  category: 'other'
})

const submitExpense = () => {
  const newExpense = {
    id: Date.now(),
    type: 'expense',
    amount: parseFloat(expense.value.amount),
    description: expense.value.description,
    category: expense.value.category,
    date: new Date().toISOString()
  }
  
  emit('expense-added', newExpense)
  emit('close')
}
</script>