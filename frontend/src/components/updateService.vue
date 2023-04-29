<script>
import { DateTime } from 'luxon'
import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API

export default {
  data() {
    return {
      service: {
        id: '',
        name: '',
        description: ''
      },

      updateData: [],
      modalToggle: true
    }
  },
  created() {
    axios.get(`${apiURL}/services/id/${this.service.id}`).then((res) => {
      // simplified setting client
      this.updateData = res.data
    })
  }
}
</script>
<template>
  <main>
    <!-- Service Information to be updated  -->
    <div class="container mt-10 ml-10">
      <form>
        <div class="card p-3 shadow p-3 mb-5 bg-body rounded">
          <p>{{ updateData._id }}</p>
          <div class="row">
            <div class="col-sm-3">
              <h2 class="text-2xl font-bold">Update/ Delete Event</h2>
            </div>
            <div class="col-sm-9">
              <div class="row">
                <div class="col-8 col-sm-8">
                  <label class="block mt-4">
                    <span class="text-gray-700"
                      >Service Name {{ updateData._id }}</span
                    >
                    <span style="color: #ff0000">*</span>
                    <input
                      class="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      v-model="updateData.name"
                      type="text"
                    />
                  </label>
                  <p>Service ID: {{ updateData._id }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-8 col-sm-8">
                  <label class="block mt-4">
                    <span class="text-gray-700">Service Description</span>
                    <textarea
                      class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      v-model="updateData.description"
                      rows="2"
                    ></textarea>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="row mt-5 text-center">
            <div class="col-12 mb-3">
              <button
                @click="updateService"
                type="submit"
                class="bg-green-700 text-white rounded mr-20 fw-bold"
                style="width: 100px"
              >
                Save
              </button>
              <button
                @click="serviceDelete"
                type="submit"
                class="bg-red-700 text-white rounded mr-20 fw-bold"
                style="width: 100px"
              >
                Delete
              </button>
              <button
                type="reset"
                class="border border-red-700 bg-white text-red-700 rounded fw-bold"
                style="width: 100px"
                @click="
                  hideUpdateContainer()
                  showAddBtn()
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>

<style>
.card-header {
  background-color: #c8102e;
  color: white;
}
</style>
