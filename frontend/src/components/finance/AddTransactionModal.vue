<template>
  <Modal
    :is-open="isOpen"
    :size="'lg'"
    :show-footer="true"
    title="Nueva transacción"
    @close="$emit('close')"
  >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Transaction type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Tipo de transacción
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="transaction-type-btn"
              :class="{ 'selected': form.type === 'expense' }"
              @click="form.type = 'expense'"
            >
              <ArrowTrendingDownIcon class="w-5 h-5 mb-2 text-red-500" />
              <span class="text-sm font-medium">Gasto</span>
            </button>
            <button
              type="button"
              class="transaction-type-btn"
              :class="{ 'selected': form.type === 'income' }"
              @click="form.type = 'income'"
            >
              <ArrowTrendingUpIcon class="w-5 h-5 mb-2 text-green-500" />
              <span class="text-sm font-medium">Ingreso</span>
            </button>
          </div>
        </div>

        <!-- Amount -->
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
            Monto *
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">€</span>
            </div>
            <input
              id="amount"
              v-model="form.amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="block w-full pl-8 pr-12 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-300': errors.amount }"
              required
            />
          </div>
          <p v-if="errors.amount" class="mt-1 text-sm text-red-600">
            {{ errors.amount }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <input
            id="description"
            v-model="form.description"
            type="text"
            placeholder="Descripción de la transacción..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            :class="{ 'border-red-300': errors.description }"
            required
          />
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">
            {{ errors.description }}
          </p>
        </div>

        <!-- Category and Account -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <div class="relative">
              <select
                id="category"
                v-model="form.categoryId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                :class="{ 'border-red-300': errors.categoryId }"
                required
              >
                <option value="">Seleccionar categoría</option>
                <option
                  v-for="category in filteredCategories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <button
                type="button"
                @click="showCategoryForm = true"
                class="absolute right-8 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
                title="Crear nueva categoría"
              >
                <PlusIcon class="w-4 h-4" />
              </button>
            </div>
            <p v-if="errors.categoryId" class="mt-1 text-sm text-red-600">
              {{ errors.categoryId }}
            </p>
          </div>

          <div>
            <label for="account" class="block text-sm font-medium text-gray-700 mb-2">
              Cuenta *
            </label>
            <select
              id="account"
              v-model="form.accountId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-300': errors.accountId }"
              required
            >
              <option value="">Seleccionar cuenta</option>
              <option
                v-for="account in accounts"
                :key="account.id"
                :value="account.id"
              >
                {{ account.name }} ({{ formatCurrency(account.balance) }})
              </option>
            </select>
            <p v-if="errors.accountId" class="mt-1 text-sm text-red-600">
              {{ errors.accountId }}
            </p>
          </div>
        </div>

        <!-- Date and Time -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
              Fecha *
            </label>
            <input
              id="date"
              v-model="form.date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              :max="new Date().toISOString().split('T')[0]"
              required
            />
          </div>

          <div>
            <label for="time" class="block text-sm font-medium text-gray-700 mb-2">
              Hora
            </label>
            <input
              id="time"
              v-model="form.time"
              type="time"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Notas adicionales
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            placeholder="Información adicional sobre la transacción..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas
          </label>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="tag in form.tags"
              :key="tag"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeTag(tag)"
                class="ml-1 text-indigo-600 hover:text-indigo-800"
              >
                <XMarkIcon class="w-3 h-3" />
              </button>
            </span>
          </div>
          
          <div class="flex">
            <input
              v-model="newTag"
              type="text"
              placeholder="Agregar etiqueta..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
              @keydown.enter.prevent="addTag"
              @keydown.comma.prevent="addTag"
            />
            <button
              type="button"
              @click="addTag"
              class="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors"
            >
              <PlusIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Options -->
        <div class="space-y-3">
          <div class="flex items-center">
            <input
              id="recurring"
              v-model="form.isRecurring"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="recurring" class="ml-2 block text-sm text-gray-900">
              Transacción recurrente
            </label>
          </div>

          <!-- Recurring options -->
          <div v-if="form.isRecurring" class="ml-6 space-y-3">
            <div>
              <label for="frequency" class="block text-sm font-medium text-gray-700 mb-1">
                Frecuencia
              </label>
              <select
                id="frequency"
                v-model="form.recurringFrequency"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="recurringEnd" class="block text-sm font-medium text-gray-700 mb-1">
                  Terminar el
                </label>
                <input
                  id="recurringEnd"
                  v-model="form.recurringEndDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  :min="form.date"
                />
              </div>

              <div>
                <label for="recurringCount" class="block text-sm font-medium text-gray-700 mb-1">
                  O después de
                </label>
                <div class="flex items-center">
                  <input
                    id="recurringCount"
                    v-model="form.recurringCount"
                    type="number"
                    min="1"
                    max="999"
                    placeholder="10"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span class="px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-500">
                    veces
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick category creation -->
        <div v-if="showCategoryForm" class="p-4 bg-gray-50 rounded-lg border">
          <h4 class="text-sm font-medium text-gray-900 mb-3">Crear nueva categoría</h4>
          <div class="space-y-3">
            <div>
              <input
                v-model="newCategory.name"
                type="text"
                placeholder="Nombre de la categoría"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <select
                v-model="newCategory.type"
                class="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
                <option value="both">Ambos</option>
              </select>
              <div class="flex items-center space-x-2">
                <input
                  v-model="newCategory.color"
                  type="color"
                  class="h-8 w-8 border border-gray-300 rounded cursor-pointer"
                />
                <span class="text-sm text-gray-600">Color</span>
              </div>
            </div>
            <div class="flex space-x-2">
              <button
                type="button"
                @click="createCategory"
                class="btn-primary-sm"
              >
                Crear
              </button>
              <button
                type="button"
                @click="showCategoryForm = false"
                class="btn-secondary-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('close')"
          class="btn-secondary"
        >
          Cancelar
        </button>
        <button
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="btn-primary"
        >
          <div v-if="isSubmitting" class="flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2"></div>
            Guardando...
          </div>
          <span v-else>Crear transacción</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import Modal from '@/components/ui/Modal.vue'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
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

const emit = defineEmits(['close', 'transaction-added'])

const appStore = useAppStore()

const form = reactive({
  type: 'expense',
  amount: '',
  description: '',
  categoryId: '',
  accountId: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  notes: '',
  tags: [],
  isRecurring: false,
  recurringFrequency: 'monthly',
  recurringEndDate: '',
  recurringCount: ''
})

const newTag = ref('')
const showCategoryForm = ref(false)
const isSubmitting = ref(false)
const errors = reactive({})

const newCategory = reactive({
  name: '',
  type: 'expense',
  color: '#6366F1'
})

const filteredCategories = computed(() => {
  return props.categories.filter(category => 
    category.type === form.type || category.type === 'both'
  )
})

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  if (!form.amount || parseFloat(form.amount) <= 0) {
    errors.amount = 'El monto debe ser mayor a 0'
    isValid = false
  }

  if (!form.description.trim()) {
    errors.description = 'La descripción es requerida'
    isValid = false
  }

  if (!form.categoryId) {
    errors.categoryId = 'Selecciona una categoría'
    isValid = false
  }

  if (!form.accountId) {
    errors.accountId = 'Selecciona una cuenta'
    isValid = false
  }

  return isValid
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const addTag = () => {
  const tag = newTag.value.trim().toLowerCase()
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (tagToRemove) => {
  const index = form.tags.indexOf(tagToRemove)
  if (index > -1) {
    form.tags.splice(index, 1)
  }
}

const createCategory = () => {
  if (!newCategory.name.trim()) {
    return
  }

  const category = {
    id: Date.now(),
    name: newCategory.name.trim(),
    type: newCategory.type,
    color: newCategory.color,
    icon: 'tag'
  }

  // Add to categories (in real app, this would be an API call)
  props.categories.push(category)
  
  // Select the new category
  form.categoryId = category.id
  
  // Reset form
  newCategory.name = ''
  newCategory.type = 'expense'
  newCategory.color = '#6366F1'
  showCategoryForm.value = false
  
  appStore.showToast('Categoría creada exitosamente', 'success')
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    const transactionData = {
      type: form.type,
      amount: form.type === 'expense' ? -Math.abs(parseFloat(form.amount)) : Math.abs(parseFloat(form.amount)),
      description: form.description.trim(),
      categoryId: form.categoryId,
      accountId: form.accountId,
      date: `${form.date}T${form.time || '12:00'}:00.000Z`,
      notes: form.notes.trim(),
      tags: form.tags,
      status: 'completed',
      isRecurring: form.isRecurring,
      recurringFrequency: form.isRecurring ? form.recurringFrequency : null,
      recurringEndDate: form.isRecurring ? form.recurringEndDate : null,
      recurringCount: form.isRecurring ? parseInt(form.recurringCount) || null : null
    }

    emit('transaction-added', transactionData)
    resetForm()
  } catch (error) {
    console.error('Error creating transaction:', error)
    appStore.showToast('Error al crear la transacción', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    type: 'expense',
    amount: '',
    description: '',
    categoryId: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: '',
    tags: [],
    isRecurring: false,
    recurringFrequency: 'monthly',
    recurringEndDate: '',
    recurringCount: ''
  })
  
  newTag.value = ''
  showCategoryForm.value = false
  
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

// Reset form when modal opens/closes
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
    // Pre-select first account if available
    if (props.accounts.length > 0) {
      form.accountId = props.accounts[0].id
    }
  }
})

// Update category selection when type changes
watch(() => form.type, () => {
  // Clear category if it's not compatible with new type
  if (form.categoryId) {
    const category = props.categories.find(c => c.id === form.categoryId)
    if (category && category.type !== form.type && category.type !== 'both') {
      form.categoryId = ''
    }
  }
})
</script>

<style scoped>
.transaction-type-btn {
  @apply flex flex-col items-center p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:border-gray-300 hover:bg-gray-50;
}

.transaction-type-btn.selected {
  @apply border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200;
}
</style>