<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import axios from "axios";
const apiURL = import.meta.env.VITE_ROOT_API;

export default {
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  data() {
    return {
      // removed unnecessary extra array to track services
      servicesAll: [],
      selectedServices: [],
      event: {
        name: "",
        services: [],
        date: "",
        address: {
          line1: "",
          line2: "",
          city: "",
          county: "",
          zip: "",
        },
        description: "",
      },
    };
  },
  created() {
    this.getServices();
  },
  methods: {
    getServices() {
      axios.get(`${apiURL}/services`).then((res) => {
      
        this.servicesAll = res.data.map((item) => item)
      });
    },
    async handleSubmitForm() {
      // Checks to see if there are any errors in validation
      const isFormCorrect = await this.v$.$validate();
      // If no errors found. isFormCorrect = True then the form is submitted
      if (isFormCorrect) {
        axios
          .post(`${apiURL}/events`, this.event)
          .then(() => {
            alert("Event has been added.");
            this.$router.push({ name: "findevents" });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  // sets validations for the various data properties
  validations() 
 {
    return {
      event: {
        name: { required },
        date: { required },
      },
    };
  },
};
</script>
<template>
  <main>
    <form @submit.prevent="handleSubmitForm">
      <div>
        <h1
          class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
        >
          Create New Event
        </h1>
      </div>
      <div class="container mt-10">
        <div class="row">
          <div class="col-sm-3">
            <h2 class="text-2xl font-bold">Event Details</h2>
          </div>
          <div class="col-sm-9">
            <div class="row">
              <div class="col-8 col-sm-4 mb-4">
                <label class="block">
                  <span class="text-gray-700">Event Name</span>
                  <span style="color: #ff0000">*</span>
                  <input
                    type="text"
                    class="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    v-model="event.name"
                  />
                  <span class="text-black" v-if="v$.event.name.$error">
                    <p
                      class="text-red-700"
                      v-for="error of v$.event.name.$errors"
                      :key="error.$uid"
                    >
                      {{ error.$message }}!
                    </p>
                  </span>
                </label>
              </div>
              <div class="col-4 col-sm-4">
                <label class="block">
                  <span class="text-gray-700">Date</span>
                  <span style="color: #ff0000">*</span>
                  <input
                    class="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    v-model="event.date"
                    type="date"
                  />
                  <span class="text-black" v-if="v$.event.date.$error">
                    <p
                      class="text-red-700"
                      v-for="error of v$.event.date.$errors"
                      :key="error.$uid"
                    >
                      {{ error.$message }}!
                    </p>
                  </span>
                </label>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-8">
                <label class="block">
                  <span class="text-gray-700">Description</span>
                  <textarea
                    class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    v-model="event.description"
                    rows="2"
                  ></textarea>
                </label>
              </div>
            </div>
  
        

            <div class="row mt-5">
              <div class="col-lg-6">
                <div class="card" style="width: auto">
                  <div class="card-header fw-bold">Services Offered at Event</div>
                  <div>
                    <div class="card-body " style="overflow-y: auto; height:120px">
                      <ul class="">
                        <li v-for="serv in servicesAll" :key="servicesAll._id">
                          <input type="checkbox" class="mr-2"  :value="serv._id" v-model="event.services" />
                          <span>{{ serv.name }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row mt-4">
          <div class="col-sm-3">
            <h2 class="text-2xl font-bold">Event Address</h2>
          </div>
          <div class="col-sm-9">
            <div class="row">
              <div class="col-8 col-sm-4 mb-4">
                <label class="block">
                  <span class="text-gray-700">Address Line 1</span>
                  <input
                    type="text"
                    class="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder
                    v-model="event.address.line1"
                  />
                </label>
              </div>
              <div class="col-4 col-sm-4">
                <label class="block">
                  <span class="text-gray-700">Address Line 2</span>
                  <input
                    type="text"
                    class="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder
                    v-model="event.address.line2"
                  />
                </label>
              </div>
              <div class="col-4 col-sm-4">
                <label class="block">
                  <span class="text-gray-700">City</span>
                  <input
                    type="text"
                    class="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder
                    v-model="event.address.city"
                  />
                </label>
              </div>
            </div>
            <div class="row">
              <div class="col-8 col-sm-4 mb-4">
                <label class="block">
                  <span class="text-gray-700">County</span>
                  <input
                    type="text"
                    class="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder
                    v-model="event.address.county"
                  />
                </label>
              </div>
              <div class="col-8 col-sm-4 mb-4">
                <label class="block">
                  <span class="text-gray-700">Zip Code</span>
                  <input
                    type="text"
                    class="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder
                    v-model="event.address.zip"
                  />
                </label>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-8 col-sm-4 mb-4">
                <button
                  class="bg-red-700 text-white rounded fw-bold"
                  type="submit"
                  style="width: 100px"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </form>
  </main>
</template>
