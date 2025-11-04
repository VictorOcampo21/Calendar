<template>
  <div class="space-y-6">
    <!-- Budgets header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-medium text-gray-900">Presupuestos</h3>
        <p class="text-sm text-gray-500">Gestiona tus presupuestos mensuales</p>
      </div>
      <button @click="$emit('create-budget')" class="btn-primary">
        <PlusIcon class="w-4 h-4 mr-2" />
        Nuevo presupuesto
      </button>
    </div>

    <!-- Budget overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BanknotesIcon class="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Presupuesto total</dt>
              <dd class="text-lg font-medium text-gray-900">€2,500.00</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon class="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Gastado</dt>
              <dd class="text-lg font-medium text-gray-900">€1,847.32</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClockIcon class="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Disponible</dt>
              <dd class="text-lg font-medium text-gray-900">€652.68</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget list -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h4 class="text-lg font-medium text-gray-900">Presupuestos activos</h4>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="budget in budgets"
            :key="budget.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <div>
                <h5 class="font-medium text-gray-900">{{ budget.name }}</h5>
                <p class="text-sm text-gray-500">{{ budget.category }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">
                  €{{ budget.spent.toFixed(2) }} / €{{ budget.limit.toFixed(2) }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ ((budget.spent / budget.limit) * 100).toFixed(0) }}% utilizado
                </p>
              </div>
            </div>
            
            <!-- Progress bar -->
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full"
                :class="getProgressBarColor(budget.spent / budget.limit)"
                :style="{ width: Math.min((budget.spent / budget.limit) * 100, 100) + '%' }"
              ></div>
            </div>
            
            <div class="flex justify-between items-center mt-3">
              <span class="text-sm text-gray-500">
                Restante: €{{ Math.max(budget.limit - budget.spent, 0).toFixed(2) }}
              </span>
              <div class="flex space-x-2">
                <button class="text-indigo-600 hover:text-indigo-900 text-sm">
                  Editar
                </button>
                <button class="text-red-600 hover:text-red-900 text-sm">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="budgets.length === 0" class="text-center py-12">
          <BanknotesIcon class="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay presupuestos</h3>
          <p class="text-gray-500 mb-4">Crea tu primer presupuesto para controlar tus gastos</p>
          <button @click="$emit('create-budget')" class="btn-primary">
            Crear presupuesto
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  PlusIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['create-budget'])

const budgets = ref([
  {
    id: 1,
    name: 'Alimentación',
    category: 'Gastos básicos',
    limit: 600,
    spent: 347.82,
    period: 'monthly'
  },
  {
    id: 2,
    name: 'Entretenimiento',
    category: 'Ocio',
    limit: 200,
    spent: 156.50,
    period: 'monthly'
  },
  {
    id: 3,
    name: 'Transporte',
    category: 'Movilidad',
    limit: 150,
    spent: 89.20,
    period: 'monthly'
  }
])

const getProgressBarColor = (percentage) => {
  if (percentage >= 0.9) return 'bg-red-500'
  if (percentage >= 0.7) return 'bg-orange-500'
  return 'bg-green-500'
}
</script>