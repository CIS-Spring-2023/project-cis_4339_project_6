<script>
import { useLoggedInUserStore } from '../../stores/userLogin'
import axios from 'axios'
import ZipCodeChart from './pieChart.vue'
const apiURL = import.meta.env.VITE_ROOT_API

export default {
  components: {
    ZipCodeChart
  },
  data() {
    return {
      zipCodeData: [],
      zipCodeArray: [],
      labels: [],
      zipCounts: [],
      chartData: [],
      loading: false,
      error: null
    }
  },
  setup() {
    const user = useLoggedInUserStore();
    return { user };
  },
  mounted() {
    this.getAttendanceData()
  },
  methods: {
    async getAttendanceData() {
      try {
        this.error = null
        this.loading = true
        const response = await axios.get(`${apiURL}/clients`)
        this.zipCodeArray = response.data
        this.zipCodeData = response.data.map((item) => item.address.zip)
        this.labels = this.findZipCount().map((item) => item.zip)
        this.chartData = this.findZipCount().map((item) => item.zipC)
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: 'Server Response',
            message: err.message
          }
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: 'Unable to Reach Server',
            message: err.message
          }
        } else {
          // There's probably an error in your code
          this.error = {
            title: 'Application Error',
            message: err.message
          }
        }
      }
      this.loading = false
    },

    /** The followig two mwthods are not required
     * for data display in pie chart
    formattedDate(datetimeDB) {
      const dt = DateTime.fromISO(datetimeDB, {
        zone: 'utc'
      })
      return dt
        .setZone(DateTime.now().zoneName, { keepLocalTime: true })
        .toLocaleString()
    },
    // method to allow click through table to event details
    editEvent(eventID) {
      this.$router.push({ name: 'eventdetails', params: { id: eventID } })
    },
    */

    /** 
     * The following implementation of counting duplicate values 
     * of zip codes for chart was derrived from 
     * https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript
     */
    findZipCount() {
      const duplicateZips = {}
      this.zipCodeData.forEach(function (x) {
        duplicateZips[x] = (duplicateZips[x] || 0) + 1
      })
      let zipArray = Object.entries(duplicateZips).map(([key, value]) => ({
        zip: key,
        zipC: value
      }))
      return zipArray
    }
  }
}
</script>

<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
      >
        Welcome
      </h1>
      <p class="text-center" style="font-style: oblique; color: #b91c1c" v-if="!user.isEditor && !user.isViewer">
        Please log in to access menu options
      </p>
      <br />
      <div class="container">
        <div class="row">
          <div class="col">

          </div>
          <div class="col-8">
            <div class="flex flex-col col-span-2">
              <div style="max-height: 80%">
                <ZipCodeChart v-if="!loading && !error" :label="labels" :chart-data="chartData"></ZipCodeChart>

                <!-- Start of loading animation -->
                <div class="mt-40" v-if="loading">
                  <p class="text-6xl font-bold text-center text-gray-500 animate-pulse">
                    Loading...
                  </p>
                </div>
                <!-- End of loading animation -->

                <!-- Start of error alert -->
                <div class="mt-12 bg-red-50" v-if="error">
                  <h3 class="px-4 py-1 text-4xl font-bold text-white bg-red-800">
                    {{ error.title }}
                  </h3>
                  <p class="p-4 text-lg font-bold text-red-900">
                    {{ error.message }}
                  </p>
                </div>
                <!-- End of error alert -->
              </div>
            </div>
          </div>
          <div class="col">

          </div>
        </div>
      </div>

    </div>
  </main>
</template>
