<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-xl font-semibold text-gray-900">Historial de actividad</h1>
          <div class="flex space-x-3">
            <select class="border-gray-300 rounded-md">
              <option>Todos los tipos</option>
              <option>Eventos</option>
              <option>Notas</option>
              <option>Transacciones</option>
            </select>
            <button class="btn-secondary">
              <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="text-center py-12">
          <ClockIcon class="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay actividad reciente</h3>
          <p class="text-gray-500">Tu historial de actividad aparecerá aquí</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowDownTrayIcon, ClockIcon } from '@heroicons/vue/24/outline'
</script>