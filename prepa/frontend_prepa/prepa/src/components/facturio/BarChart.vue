<template>
  <Line
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
    :height="height"
    :width="width"
  />
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default defineComponent({
  name: 'LineChart',
  components: { Line },
  props: {
    height: {
      type: Number,
      default: 100 // hauteur par défaut
    },
    width: {
      type: Number,
      default: 600 // largeur par défaut
    }
  },
  setup() {
    const chartData = ref({
      labels: ['Lundi', 'Mardi', 'Mercredi','Jeudi','Vendredi','Samedi'],
      datasets: [{
        label: 'Moyenne',
        data: [10, 8, 3, 6, 7, 13],
        borderColor: 'blue', // couleur de la ligne
        fill: false // éviter de remplir sous la ligne
      }]
    })
    
    const chartOptions = ref({
      responsive: false,
      scales: {
        y: {
          min: 0, // Valeur minimale de l'axe Y
          max: 15 // Valeur maximale de l'axe Y
        }
      }
    })

    onMounted(() => {
      // Code that should run when the component is mounted can be placed here
    })

    return {
      chartData,
      chartOptions
    }
  }
})
</script>
