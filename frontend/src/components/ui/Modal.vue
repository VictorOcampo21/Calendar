<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
      <div 
        class="modal-container"
        :class="sizeClass"
        @click.stop
      >
        <!-- Header -->
        <div v-if="showHeader" class="modal-header">
          <h3 v-if="title" class="modal-title">{{ title }}</h3>
          <button 
            v-if="showCloseButton"
            @click="closeModal"
            class="modal-close-button"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body" :class="{ 'modal-body-no-header': !showHeader }">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="showFooter" class="modal-footer">
          <slot name="footer">
            <button
              v-if="showCancelButton"
              @click="handleCancel"
              class="modal-button modal-button-secondary"
            >
              {{ cancelText }}
            </button>
            <button
              v-if="showConfirmButton"
              @click="handleConfirm"
              class="modal-button modal-button-primary"
            >
              {{ confirmText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'].includes(value)
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: false
  },
  showConfirmButton: {
    type: Boolean,
    default: false
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'cancel', 'confirm'])

const sizeClass = computed(() => {
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4'
  }
  return sizes[props.size]
})

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    closeModal()
  }
}

const handleCancel = () => {
  emit('cancel')
  closeModal()
}

const handleConfirm = () => {
  emit('confirm')
}

const handleEscape = (event) => {
  if (event.key === 'Escape' && props.closeOnEscape && props.isOpen) {
    closeModal()
  }
}

// Handle escape key
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4;
}

.modal-container {
  @apply relative bg-white rounded-lg shadow-xl w-full;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200;
}

.modal-title {
  @apply text-lg font-medium text-gray-900;
}

.modal-close-button {
  @apply text-gray-400 hover:text-gray-600 transition-colors;
}

.modal-body {
  @apply p-4 overflow-y-auto;
  flex: 1;
}

.modal-body-no-header {
  @apply pt-6;
}

.modal-footer {
  @apply flex justify-end space-x-3 p-4 border-t border-gray-200;
}

.modal-button {
  @apply px-4 py-2 text-sm font-medium rounded-md transition-colors;
}

.modal-button-primary {
  @apply text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500;
}

.modal-button-secondary {
  @apply text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500;
}
</style>