<script>
import { Chart, registerables } from 'chart.js'
import { resolveDirective } from 'vue'

Chart.register(...registerables)

export default {
  name: 'zipChart',
  props: {
    label: {
      type: Array
    },
    chartData: {
      type: Array
    }
  },
  async mounted() {
    const backgroundColor = this.chartData.map(() => this.getColor())
    const borderColor = backgroundColor.map((e) =>
      e.replace(/[\d\.]+\)$/g, '1)')
    )

    await new Chart(this.$refs.ZipCodeChart, {
      type: 'pie',
      data: {
        labels: this.label,
        datasets: [
          {
            borderWidth: 0,
            backgroundColor: backgroundColor,
            borderWidth: 3,
            data: this.chartData
          }
        ],
        hoverOffet: 4
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          },
          title: {
            display: true,
            text: 'Clients per zip code',
            font: {
              weight: 'bold',
              size: 30
            },

            padding: {
              top: 10,
              bottom: 20
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    })
  },
  methods: {
    getColor() {
      let channel = () => Math.random() * 255
      return `rgba(${channel()}, ${channel()}, ${channel()}, 0.7)`
    }
  }
}
</script>
<template>
  <div class="shadow-lg rounded-lg overflow-hidden">
    <canvas class="p-10" ref="ZipCodeChart"></canvas>
  </div>
</template>
