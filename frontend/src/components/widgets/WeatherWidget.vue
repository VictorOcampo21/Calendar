<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Clima Hoy</h3>
      <button
        @click="refreshWeather"
        class="text-gray-400 hover:text-gray-600"
      >
        <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" />
      </button>
    </div>

    <div class="text-center">
      <!-- Weather icon and temp -->
      <div class="mb-4">
        <div class="text-6xl mb-2">{{ weatherData.icon }}</div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ weatherData.temperature }}°C
        </div>
        <div class="text-sm text-gray-600 mb-2">
          {{ weatherData.description }}
        </div>
        <div class="text-xs text-gray-500">
          <MapPinIcon class="w-3 h-3 inline mr-1" />
          {{ weatherData.location }}
        </div>
      </div>

      <!-- Weather details -->
      <div class="grid grid-cols-2 gap-4 text-center">
        <div class="bg-blue-50 rounded-lg p-3">
          <div class="text-2xl mb-1">💧</div>
          <div class="text-xs text-gray-600">Humedad</div>
          <div class="text-sm font-semibold">{{ weatherData.humidity }}%</div>
        </div>
        
        <div class="bg-green-50 rounded-lg p-3">
          <div class="text-2xl mb-1">💨</div>
          <div class="text-xs text-gray-600">Viento</div>
          <div class="text-sm font-semibold">{{ weatherData.windSpeed }} km/h</div>
        </div>
      </div>

      <!-- Quick forecast -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <div class="text-xs text-gray-500 mb-2">Próximos días</div>
        <div class="flex justify-between">
          <div
            v-for="day in forecast"
            :key="day.day"
            class="text-center"
          >
            <div class="text-xs text-gray-500 mb-1">{{ day.day }}</div>
            <div class="text-lg mb-1">{{ day.icon }}</div>
            <div class="text-xs font-medium">{{ day.high }}°</div>
            <div class="text-xs text-gray-400">{{ day.low }}°</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowPathIcon, MapPinIcon } from '@heroicons/vue/24/outline'

const isRefreshing = ref(false)

const weatherData = ref({
  temperature: 24,
  description: 'Parcialmente nublado',
  icon: '⛅',
  location: 'Ciudad de México',
  humidity: 65,
  windSpeed: 12
})

const forecast = ref([
  { day: 'Mañana', icon: '☀️', high: 26, low: 16 },
  { day: 'Mar', icon: '🌤️', high: 23, low: 14 },
  { day: 'Mié', icon: '🌧️', high: 19, low: 12 },
  { day: 'Jue', icon: '⛅', high: 22, low: 15 }
])

const refreshWeather = async () => {
  isRefreshing.value = true
  
  // Simular llamada a API del clima
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simular datos aleatorios
  const temperatures = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
  const conditions = [
    { description: 'Soleado', icon: '☀️' },
    { description: 'Parcialmente nublado', icon: '⛅' },
    { description: 'Nublado', icon: '☁️' },
    { description: 'Lluvia ligera', icon: '🌦️' }
  ]
  
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]
  weatherData.value.temperature = temperatures[Math.floor(Math.random() * temperatures.length)]
  weatherData.value.description = randomCondition.description
  weatherData.value.icon = randomCondition.icon
  weatherData.value.humidity = Math.floor(Math.random() * 30) + 50
  weatherData.value.windSpeed = Math.floor(Math.random() * 20) + 5
  
  isRefreshing.value = false
}

onMounted(() => {
  // Simular carga inicial
  refreshWeather()
})
</script>