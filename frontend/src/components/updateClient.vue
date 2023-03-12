<script>
import { useLoggedInUserStore } from '../../stores/userLogin'
import useVuelidate from "@vuelidate/core";
import { required, email, alpha, numeric } from "@vuelidate/validators";
import VueMultiselect from "vue-multiselect";
import axios from "axios";
import { DateTime } from "luxon";
const apiURL = import.meta.env.VITE_ROOT_API;

export default {
  props: ["id"],
  components: { VueMultiselect },
  setup() {
    const user = useLoggedInUserStore();
    return { v$: useVuelidate({ $autoDirty: true }), user };
  },
  data() {
    return {
      // rename events arrays for added clarity
      eventsAll: [],
      eventsSelected: [],
      eventsRegistered: [],
      client: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: {
          primary: "",
          alternate: "",
        },
        address: {
          line1: "",
          line2: "",
          city: "",
          county: "",
          zip: "",
        },
      },
    };
  },
  created() {
    axios.get(`${apiURL}/clients/id/${this.$route.params.id}`).then((res) => {
      // simplified setting client
      this.client = res.data;
    });
    axios.get(`${apiURL}/events`).then((res) => {
      // simplified setting eventsAll
      this.eventsAll = res.data;
    });
    this.getEventsRegistered();
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    // better formattedDate function
    formattedDate(datetimeDB) {
      const dt = DateTime.fromISO(datetimeDB, {
        zone: "utc",
      });
      return dt
        .setZone(DateTime.now().zoneName, { keepLocalTime: true })
        .toLocaleString();
    },
    nameWithDate({ name, date }) {
      return `${name} (${this.formattedDate(date)})`;
    },
    getEventsRegistered() {
      axios
        .get(`${apiURL}/events/client/${this.$route.params.id}`)
        .then((res) => {
          // simplified setting eventsRegistered
          this.eventsRegistered = res.data;
        });
    },
    async updateClient() {
      // Checks to see if there are any errors in validation
      const isFormCorrect = await this.v$.$validate();
      // If no errors found. isFormCorrect = True then the form is submitted
      if (isFormCorrect) {
        axios
          .put(`${apiURL}/clients/update/${this.id}`, this.client)
          .then(() => {
            alert("Update has been saved.");
            this.$router.back();
          });
      }
    },
    addToEvent() {
      this.eventsSelected.forEach((event) => {
        axios
          .put(`${apiURL}/events/register`, null, {
            params: { event: event._id, client: this.id },
          })
          .then(() => this.getEventsRegistered())
          .catch((error) => {
            if (error.response.data) {
              alert(`${event.name}: ${error.response.data}`);
            }
          });
      });
      // clear events selection after attempting to register for events
      this.eventsSelected = [];
    },
    // replaces client hard delete
    // find all events where client appears in attendees array and pull it
    // then pull org from client org array
    deregisterClient() {
      axios
        .get(`${apiURL}/events/client/${this.id}`)
        .then((res) => {
          res.data.forEach((e) => {
            axios.put(`${apiURL}/events/deregister`, null, {
              params: { event: e._id, client: this.id },
            });
          });
        })
        .finally(
          axios.put(`${apiURL}/clients/deregister/${this.id}`).then(() => {
            alert("Client has been deleted.");
            this.$router.push({ name: "findclient" });
          })
        );
    },
    // unused hard delete method
    deleteClient() {
      axios.delete(`${apiURL}/clients/${this.id}`).then(() => {
        alert("Client has been deleted.");
        this.$router.push({ name: "findclient" });
      });
    },
    // function to allow click through to event details
    editEvent(eventID) {
      this.$router.push({ name: "eventdetails", params: { id: eventID } });
    },
  },
  validations() {
    return {
      client: {
        firstName: { required, alpha },
        lastName: { required, alpha },
        email: { email },
        phoneNumber: {
          primary: { required, numeric },
        },
      },
    };
  },
};
</script>
<template>
  <main>
    <h1
      class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
      v-if="user.isEditor"
    >
      Update Client
    </h1>
    <h1
      class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
      v-if="user.isViewer"
    >
      View Client Information
    </h1>
    <div class="px-10 py-10">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <!-- grid container -->
        <div class="card shadow-md p-3 mb-4 bg-body-tertiary rounded">
          <div
            class="grid mt-3 mb-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <h2 class="text-2xl font-bold">Personal Details</h2>
            <!-- form field -->
            <div class="flex flex-col">
              <label class="block">
                <span class="text-gray-700">First Name</span>
                <span style="color: #ff0000">*</span>
                <input
                  type="text"
                  class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  v-model="client.firstName"
                  :disabled="!user.isEditor"
                />
                <span class="text-black" v-if="v$.client.firstName.$error">
                  <p
                    class="text-red-700"
                    v-for="error of v$.client.firstName.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}!
                  </p>
                </span>
              </label>
            </div>

            <!-- form field -->
            <div class="flex flex-col">
              <label class="block">
                <span class="text-gray-700">Middle Name</span>
                <input
                  type="text"
                  class="w-full mt-2 form-control rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder
                  v-model="client.middleName"
                  :disabled="!user.isEditor"
                />
              </label>
            </div>

            <!-- form field -->
            <div class="flex flex-col">
              <label class="block">
                <span class="text-gray-700">Last Name</span>
                <span style="color: #ff0000">*</span>
                <input
                  type="text"
                  class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder
                  v-model="client.lastName"
                  :disabled="!user.isEditor"
                />
                <span class="text-black" v-if="v$.client.lastName.$error">
                  <p
                    class="text-red-700"
                    v-for="error of v$.client.lastName.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}!
                  </p>
                </span>
              </label>
            </div>

            <div></div>
            <!-- form field -->
            <!-- updated email validation pattern, existing pattern gives error when there is none -->
            <!-- https://regex101.com/r/zQ3mH7/1 -->
            <div class="flex flex-col">
              <label class="block">
                <span class="text-gray-700">Email</span>
                <input
                  type="email"
                  class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  pattern="^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,4}$"
                  v-model="client.email"
                  :disabled="!user.isEditor"
                />
                <span class="text-black" v-if="v$.client.email.$error">
                  <p
                    class="text-red-700"
                    v-for="error of v$.client.email.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}!
                  </p>
                </span>
              </label>
            </div>
            <!-- form field -->
            <div class="flex flex-col">
              <label class="block">
                <span class="text-gray-700">Phone Number</span>
                <span style="color: #ff0000">*</span>
                <input
                  type="text"
                  class="form-control w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                  v-model="client.phoneNumber.primary"
                  :disabled="!user.isEditor"
                />
                <span
                  class="text-black"
                  v-if="v$.client.phoneNumber.primary.$error"
                >
                  <p
                    class="text-red-700"
                    v-for="error of v$.client.phoneNumber.primary.$errors"
                    :key="error.$uid"
                  >
                    {{ error.$message }}!
                  </p>
                </span>
              </label>
            </div>
            <!-- form field -->
            <div class="flex flex-col">
              <label class="block">
                <span class="text-gray-700">Alternative Phone Number</span>
                <input
                  type="text"
                  class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                  v-model="client.phoneNumber.alternate"
                  :disabled="!user.isEditor"
                />
              </label>
            </div>
          </div>
        </div>

        <!-- Client Address Information -->
        <div class="card shadow-md p-3 mb-4 bg-body-tertiary rounded">
          <div
            class="grid mt-3 mb-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
          >
            <h2 class="text-2xl font-bold">Address Details</h2>
            <!-- form field -->
            <div class="flex flex-col">
              <label class="block">
                <span class="text-gray-700">Address Line 1</span>
                <input
                  type="text"
                  class="w-full mt-2 form-control rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  v-model="client.address.line1"
                  :disabled="!user.isEditor"
                />
              </label>
            </div>
            <!-- form field -->
            <div class="flex flex-col">
              <label class="block">
                <span class="text-gray-700">Address Line 2</span>
                <input
                  type="text"
                  class="w-full mt-2 form-control rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  v-model="client.address.line2"
                  :disabled="!user.isEditor"
                />
              </label>
            </div>
            <!-- form field -->
            <div class="flex flex-col">
              <label class="block">
                <span class="text-gray-700">City</span>
                <span style="color: #ff0000">*</span>
                <input
                  type="text"
                  class="w-full mt-2 form-control rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  v-model="client.address.city"
                  :disabled="!user.isEditor"
                />
              </label>
            </div>
            <div></div>
            <!-- form field -->
            <div class="flex flex-col">
              <label class="block">
                <span class="text-gray-700">County</span>
                <input
                  type="text"
                  class="w-full mt-2 form-control rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  v-model="client.address.county"
                  :disabled="!user.isEditor"
                />
              </label>
            </div>
            <!-- form field -->
            <div class="flex flex-col">
              <label class="block">
                <span class="text-gray-700">Zip Code</span>
                <input
                  type="text"
                  class="w-full mt-2 form-control rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  v-model="client.address.zip"
                  :disabled="!user.isEditor"
                />
              </label>
            </div>
            <div></div>
          </div>
        </div>
        <!-- grid container -->

        <div class="row mt-5">
          <div class="col-12 mb-3 text-center">
            <button
              @click="updateClient"
              type="submit"
              class="btn btn-success mr-20 fw-bold"
              v-if="user.isEditor"
              style="width: 100px"
            >
              Update
            </button>

            <button
              @click="deleteClient"
              type="submit"
              class="btn mr-20 fw-bold"
              v-if="user.isEditor"
              style="width: 100px; background-color: #b91c1c; color: white"
            >
              Delete
            </button>

            <button
              type="reset"
              class="btn btn-outline-danger rounded fw-bold"
              @click="$router.back()"
              style="width: 100px"
            >
              Back
            </button>
          </div>
        </div>

        <hr class="mt-4 mb-10" />

        <!-- Client Event Information -->
        <div
          class="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
        >
          <h2 class="text-2xl font-bold">Events for Client</h2>

          <div class="flex flex-col col-span-2">
            <div class="table-responsive" style="height: 300px">
              <table class="table min-w-full shadow-md rounded">
                <thead
                  class="table-heading text-l"
                  style="position: sticky; top: 0"
                >
                  <tr>
                    <th class="p-3 text-left">Event Name</th>
                    <th class="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-300">
                  <!-- allow click through to event details -->
                  <tr
                    @click="editEvent(event._id)"
                    v-for="event in eventsRegistered"
                    :key="event._id"
                  >
                    <td class="p-3 pt-2 pb-2 text-left">{{ event.name }}</td>
                    <td class="p-3 pt-2 pb-2 text-left">
                      {{ formattedDate(event.date) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex flex-col">
            <!-- fixed weird selection duplication bug -->
            <VueMultiselect
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-if="user.isEditor"
              v-model="eventsSelected"
              :options="eventsAll"
              :custom-label="nameWithDate"
              :multiple="true"
              :close-on-select="true"
              placeholder="Select Events to be added"
              label="date"
              track-by="name"
            />
            <div class="flex justify-between">
              <button
                @click="addToEvent"
                type="submit"
                class="mt-5 bg-red-700 text-white rounded"
                v-if="user.isEditor"
              >
                Add Client to Selected Events
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
