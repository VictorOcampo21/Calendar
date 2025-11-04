<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-xl font-semibold text-gray-900">Eventos Propuestos</h1>
          <button class="btn-primary">
            <PlusIcon class="w-4 h-4 mr-2" />
            Proponer evento
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="text-center py-12">
          <CalendarIcon class="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay eventos propuestos</h3>
          <p class="text-gray-500">Los eventos propuestos por tu equipo aparecerán aquí</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, CalendarIcon } from '@heroicons/vue/24/outline'
</script>