<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Gestionar categorías</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="flex space-x-6">
        <!-- Categories list -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-medium text-gray-900">Categorías existentes</h4>
            <button @click="showCreateForm = true" class="btn-primary-sm">
              <PlusIcon class="w-4 h-4 mr-1" />
              Nueva
            </button>
          </div>

          <div class="space-y-2 max-h-80 overflow-y-auto">
            <div
              v-for="category in categories"
              :key="category.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <div>
                  <p class="font-medium text-gray-900">{{ category.name }}</p>
                  <p class="text-sm text-gray-500">{{ category.type === 'income' ? 'Ingreso' : 'Gasto' }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="editCategory(category)"
                  class="text-indigo-600 hover:text-indigo-900 text-sm"
                >
                  Editar
                </button>
                <button
                  @click="deleteCategory(category.id)"
                  class="text-red-600 hover:text-red-900 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Create/Edit form -->
        <div v-if="showCreateForm || editingCategory" class="w-80">
          <h4 class="font-medium text-gray-900 mb-4">
            {{ editingCategory ? 'Editar categoría' : 'Nueva categoría' }}
          </h4>

          <form @submit.prevent="saveCategory">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  v-model="categoryForm.name"
                  type="text"
                  placeholder="Nombre de la categoría"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  v-model="categoryForm.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="expense">Gasto</option>
                  <option value="income">Ingreso</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div class="flex space-x-2">
                  <button
                    v-for="color in colorOptions"
                    :key="color"
                    type="button"
                    @click="categoryForm.color = color"
                    class="w-8 h-8 rounded-full border-2"
                    :class="categoryForm.color === color ? 'border-gray-400' : 'border-gray-200'"
                    :style="{ backgroundColor: color }"
                  ></button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  v-model="categoryForm.description"
                  rows="3"
                  placeholder="Descripción opcional..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="cancelEdit"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                {{ editingCategory ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { XMarkIcon, PlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'category-created', 'category-updated', 'category-deleted'])

const showCreateForm = ref(false)
const editingCategory = ref(null)

const categoryForm = ref({
  name: '',
  type: 'expense',
  color: '#3B82F6',
  description: ''
})

const colorOptions = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6B7280'
]

const categories = ref([
  { id: 1, name: 'Alimentación', type: 'expense', color: '#EF4444', description: 'Comida y bebida' },
  { id: 2, name: 'Transporte', type: 'expense', color: '#3B82F6', description: 'Transporte público y combustible' },
  { id: 3, name: 'Salario', type: 'income', color: '#10B981', description: 'Ingresos por trabajo' },
  { id: 4, name: 'Entretenimiento', type: 'expense', color: '#8B5CF6', description: 'Ocio y diversión' }
])

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = { ...category }
  showCreateForm.value = false
}

const cancelEdit = () => {
  editingCategory.value = null
  showCreateForm.value = false
  resetForm()
}

const resetForm = () => {
  categoryForm.value = {
    name: '',
    type: 'expense',
    color: '#3B82F6',
    description: ''
  }
}

const saveCategory = () => {
  if (editingCategory.value) {
    // Update existing category
    const index = categories.value.findIndex(c => c.id === editingCategory.value.id)
    if (index !== -1) {
      categories.value[index] = { ...categoryForm.value, id: editingCategory.value.id }
      emit('category-updated', categories.value[index])
    }
  } else {
    // Create new category
    const newCategory = {
      id: Date.now(),
      ...categoryForm.value
    }
    categories.value.push(newCategory)
    emit('category-created', newCategory)
  }
  
  cancelEdit()
}

const deleteCategory = (categoryId) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
    categories.value = categories.value.filter(c => c.id !== categoryId)
    emit('category-deleted', categoryId)
  }
}
</script>