<script>
import { useLoggedInUserStore } from "../../stores/userLogin";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import axios from "axios";
import { DateTime } from "luxon";
const apiURL = import.meta.env.VITE_ROOT_API;

export default {
  props: ["id"],
  setup() {
    const user = useLoggedInUserStore();
    return { v$: useVuelidate({ $autoDirty: true }), user };
  },
  data() {
    return {
      //array to hold all available event services
      servicesAll: [],
      clientAttendees: [],
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
        attendees: [],
      },
    };
  },

  created() {
    axios.get(`${apiURL}/events/id/${this.$route.params.id}`).then((res) => {
      this.event = res.data;

      this.event.date = this.formattedDate(this.event.date);
      this.getServices();

      this.event.attendees.forEach((e) => {
        axios.get(`${apiURL}/clients/id/${e}`).then((res) => {
          this.clientAttendees.push(res.data);
        });
      });
    });
  },

  methods: {
    /** GET all available services to enbale user to select services
     * associated with respective events
     */
    getServices() {
      axios.get(`${apiURL}/services`).then((res) => {
        this.servicesAll = res.data;
      });
    },
    // better formatted date, converts UTC to local time
    formattedDate(datetimeDB) {
      const dt = DateTime.fromISO(datetimeDB, {
        zone: "utc",
      });
      return dt
        .setZone(DateTime.now().zoneName, { keepLocalTime: true })
        .toISODate();
    },
    handleEventUpdate() {
      axios.put(`${apiURL}/events/update/${this.id}`, this.event).then(() => {
        alert("Update has been saved.");
        this.$router.back();
      });
    },
    editClient(clientID) {
      this.$router.push({ name: "updateclient", params: { id: clientID } });
    },
    eventDelete() {
      axios.delete(`${apiURL}/events/${this.id}`).then(() => {
        alert("Event has been deleted.");
        this.$router.push({ name: "findevents" });
      });
    },
  },
  // sets validations for the various data properties
  validations() {
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
    <div>
      <h1
        class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
        v-if="user.isEditor"
      >
        Update Event
      </h1>
      <h1
        class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
        v-if="user.isViewer"
      >
        View Event Details
      </h1>
    </div>

    <form @submit.prevent="handleSubmitForm">
      <div class="container mt-8">
        <div class="row">
          <div class="col-sm-3">
            <h2 class="text-2xl font-bold">Event Details</h2>
          </div>
          <div class="col-sm-9">
            <div class="row">
              <div class="col-8 col-sm-4 mb-3">
                <label class="block">
                  <span class="text-gray-700">Event Name</span>
                  <span style="color: #ff0000">*</span>
                  <input
                    type="text"
                    class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    v-model="event.name"
                    :disabled="!user.isEditor"
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
                    class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    v-model="event.date"
                    type="date"
                    :disabled="!user.isEditor"
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
                    class="mt-1 block w-full form-control rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    rows="2"
                    v-model="event.description"
                    :disabled="!user.isEditor"
                  ></textarea>
                </label>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-lg-6">
                <div class="card" style="width: auto">
                <!--Added functionality to select from all availavle services -->
                  <div class="card-header fw-bold">
                    Services Offered at Event
                  </div>
                  <div>
                    <div
                      class="card-body"
                      style="overflow-y: auto; height: 120px"
                    >
                      <ul>
                        <li v-for="serv in servicesAll" :key="serv._id">
                          <input
                            type="checkbox"
                            :disabled="!user.isEditor"
                            class="mr-2"
                            v-model="event.services"
                            :value="serv._id"
                          />
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

        <div class="row mt-3">
          <div class="col-sm-3">
            <h2 class="text-2xl font-bold">Event Address</h2>
          </div>
          <div class="col-sm-9">
            <div class="row">
              <div class="col-8 col-sm-4 mb-3">
                <label class="block">
                  <span class="text-gray-700">Address Line 1</span>
                  <input
                    type="text"
                    class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder
                    v-model="event.address.line1"
                    :disabled="!user.isEditor"
                  />
                </label>
              </div>
              <div class="col-4 col-sm-4">
                <label class="block">
                  <span class="text-gray-700">Address Line 2</span>
                  <input
                    type="text"
                    class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder
                    v-model="event.address.line2"
                    :disabled="!user.isEditor"
                  />
                </label>
              </div>
              <div class="col-4 col-sm-4">
                <label class="block">
                  <span class="text-gray-700">City</span>
                  <input
                    type="text"
                    class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder
                    v-model="event.address.city"
                    :disabled="!user.isEditor"
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
                    class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder
                    v-model="event.address.county"
                    :disabled="!user.isEditor"
                  />
                </label>
              </div>
              <div class="col-8 col-sm-4 mb-3">
                <label class="block">
                  <span class="text-gray-700">Zip Code</span>
                  <input
                    type="text"
                    class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder
                    v-model="event.address.zip"
                    :disabled="!user.isEditor"
                  />
                </label>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12 mb-3">
                <button
                  @click="handleEventUpdate"
                  type="submit"
                  class="btn btn-success rounded mr-20 fw-bold"
                  v-if="user.isEditor"
                  style="width: 100px"
                >
                  Save
                </button>
                <button
                  @click="eventDelete"
                  type="submit"
                  class="btn mr-20 fw-bold"
                  v-if="user.isEditor"
                  style="width: 100px; background-color: #b91c1c; color: white"
                >
                  Delete
                </button>
                <button
                  type="reset"
                  class="btn btn-outline-danger rounded rounded fw-bold"
                  style="width: 100px"
                  @click="$router.back()"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr class="mt-3 mb-10" />
      <div class="container mt-5">
        <div class="row mt-4">
          <div class="col-sm-3">
            <h2 class="text-2xl font-bold">List of Attendees</h2>
            <h6 class="italic">Click table row to edit/display an entry</h6>
          </div>
          <div class="col-8 mb-4">
            <div class="table-responsive" style="height: 300px">
              <table class="table min-w-full shadow-md rounded table-hover">
                <thead
                  class="table-heading text-l"
                  style="position: sticky; top: 0"
                >
                  <tr>
                    <th class="p-3 text-left">Name</th>
                    <th class="p-3 text-left">City</th>
                    <th class="p-3 text-left">Phone Number</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-300">
                  <tr
                    @click="editClient(client._id)"
                    v-for="client in clientAttendees"
                    :key="client._id"
                  >
                    <td class="p-3 pt-2 pb-2 text-left">
                      {{ client.firstName + ' ' + client.lastName }}
                    </td>
                    <td class="p-3 pt-2 pb-2 text-left">
                      {{ client.address.city }}
                    </td>
                    <td class="p-3 pt-2 pb-2 text-left">
                      {{ client.phoneNumber.primary }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </form>
  </main>
</template>
<style>
.table-heading,
.card-header {
  background-color: #b91c1c;
  color: white;
}

.border {
  border-color: #b91c1c;
  border-width: 2px;
}
</style>
