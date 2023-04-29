<script>
import axios from "axios";
import { useLoggedInUserStore } from "../../stores/userLogin";
const apiURL = import.meta.env.VITE_ROOT_API;

export default {
  props: ["id"],
  setup() {
    const user = useLoggedInUserStore();
    return { user };
  },
  data() {
    return {
      servicesAll: [],
      serviceToUpdate: [],

      service: {
        name: "",
        description: "",
      },
      showUpdate: false,
      showNewSer: false,
      addBtn: true,
      modalSave: true,
      modalDelete: true,
      modalUpdate: true,
    };
  },
  created() {
    this.getServices();
  },
  methods: {
    /** Method to get all services */
    getServices() {
      axios.get(`${apiURL}/services`).then((res) => {
        this.servicesAll = res.data;
      });
      window.scrollTo(0, 0);
    },

    /** Show add new service form */
    showNewSerContainer() {
      this.clearServiceInfo();
      this.showNewSer = true;
    },

    /** Clear service name and description */
    clearServiceInfo() {
      (this.service.name = ""),
        (this.service.description = ""),
        (this.showUpdate = false);
    },

    /** close update form and clear service name and information */
    cancelUpdate() {
      (this.addBtn = true), (this.showUpdate = false), this.clearServiceInfo();
    },

    /** Close insert new service form */
    canselInsert() {
      this.showNewSer = false;
    },

    /** Update existing service */
    updateService() {
      axios
        .put(
          `${apiURL}/services/update/${this.serviceToUpdate._id}`,
          this.service
        )
        .then(() => {
          //alert('Service has been updated.')
          this.getServices();
        });
    },

    serviceDelete() {
      axios
        .delete(`${apiURL}/services/${this.serviceToUpdate._id}`)
        .then(() => {
          // alert('Event has been deleted.')
          (this.showUpdate = false), (this.addBtn = true), this.getServices();
        });
      this.clearServiceInfo();
    },

    /** Post new service to database */
    addNewService() {
      axios.post(`${apiURL}/services`, this.service).then(() => {
        (this.showNewSer = false),
          (this.showUpdateContainer = false),
          // alert('Service has been added.'),

          this.getServices();
      });
    },

    /** Retrieve information of selected service to be updated   */
    editService(serviceID) {
      axios.get(`${apiURL}/services/id/${serviceID}`).then((res) => {
        (this.serviceToUpdate = res.data),
          (this.service.name = res.data.name),
          (this.service.description = res.data.description),
          (this.showUpdate = true),
          (this.addBtn = false),
          (tis.showNewSer = false);
      });
    },
  },
};

/** Main view for event services */
</script>
<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
      >
        Event Services
      </h1>
    </div>
    <div class="container ml-10 mt-10">
      <div class="row">
        <div class="col-sm-3">
          <h2 class="text-2xl font-bold">List of Services</h2>

          <h6 class="italic">Click table row to edit/display an entry</h6>

          <div class="row">
            <button
              v-show="addBtn"
              v-if="user.isEditor"
              @click="showNewSerContainer()"
              type="button"
              class="btn btn-success ml-5 mt-5 text-white rounded mr-20 fw-bold"
              style="width: 100px"
            >
              Add
            </button>
          </div>
        </div>
        <div class="col-sm-9">
          <div class="row">
            <div class="col-8 col-sm-8">
              <div class="table-responsive" style="height: 300px">
                <table
                  class="table shadow-md rounded table-hover"
                  style="height: 100px; overflow-y: auto"
                >
                  <thead
                    class="table-heading text-l"
                    style="position: sticky; top: 0"
                  >
                    <tr>
                      <th class="p-3 text-left">Service Name</th>
                      <th class="p-3 text-left">Service Description</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-300">
                    <tr
                      @click="
                        editService(service._id);
                        canselInsert();
                      "
                      v-for="service in servicesAll"
                      :key="service._id"
                    >
                      <td class="p-3 pt-2 pb-2 text-left">
                        {{ service.name }}
                      </td>
                      <td class="p-3 pt-2 pb-2 text-left">
                        {{ service.description }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row"></div>

    <!-- Add new Services Form -->
    <div v-if="user.isEditor && showNewSer" class="container mt-10 ml-10">
      <form>
        <div class="card p-3 shadow p-3 mb-5 bg-body rounded">
          <div class="row">
            <div class="col-sm-3">
              <h2 class="text-2xl font-bold">Add Service</h2>
            </div>
            <div class="col-sm-9">
              <div class="row">
                <div class="col-8 col-sm-8">
                  <label class="block mt-4">
                    <span class="text-gray-700">Service Name</span>
                    <span style="color: #ff0000">*</span>
                    <input
                      class="w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      v-model="service.name"
                      type="text"
                    />
                  </label>
                </div>
              </div>
              <div class="row">
                <div class="col-8 col-sm-8">
                  <label class="block mt-4">
                    <span class="text-gray-700">Service Description</span>
                    <textarea
                      class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      v-model="service.description"
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
                @click="addNewService()"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#saveModal"
                class="btn btn-success rounded mr-20 fw-bold"
                style="width: 100px"
              >
                Save
              </button>
              <button
                type="reset"
                class="btn btn-outline-danger rounded fw-bold"
                style="width: 100px"
                @click="
                  canselInsert();
                  clearServiceInfo();
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!--Show update form for existing service when clicked on in table -->
    <div v-if="showUpdate" class="container mt-10 ml-10">
      <form>
        <div class="card p-3 shadow p-3 mb-5 bg-body rounded">
          <div class="row">
            <div class="col-sm-3">
              <h2 class="text-2xl font-bold" v-if="user.isEditor">
                Update/ Delete Event
              </h2>
              <h2 class="text-2xl font-bold" v-if="user.isViewer">
                Service Information
              </h2>
            </div>
            <div class="col-sm-9">
              <div class="row">
                <div class="col-8 col-sm-8">
                  <label class="block mt-4">
                    <span class="text-gray-700">Service Name </span>
                    <span style="color: #ff0000">*</span>
                    <input
                      class="w-full form-control mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      v-model="service.name"
                      :disabled="!user.isEditor"
                      type="text"
                    />
                  </label>
                </div>
              </div>
              <div class="row">
                <div class="col-8 col-sm-8">
                  <label class="block mt-4">
                    <span class="text-gray-700">Service Description</span>
                    <textarea
                      class="mt-2 form-control block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      v-model="service.description"
                      :disabled="!user.isEditor"
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
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#updateModal"
                class="btn btn-success mr-20 fw-bold"
                style="width: 100px"
                v-if="user.isEditor"
              >
                Save
              </button>
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#deleteModal"
                class="btn mr-20 fw-bold"
                style="width: 100px; background-color: #b91c1c; color: white"
                v-if="user.isEditor"
              >
                Delete
              </button>
              <button
                type="reset"
                class="btn btn-outline-success fw-bold"
                style="width: 100px"
                @click="cancelUpdate"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Confirm new service saved - Modal -->
    <div
      v-if="modalSave"
      class="modal fade"
      id="saveModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header text-center">
            <h5 class="modal-title" id="exampleModalLabel">New Service</h5>
            <button
              type="button"
              class="btn btn-light"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body text-center">
            <p>
              "<strong>{{ service.name }}</strong
              >" added successfully.
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-success rounded fw-bold"
              data-bs-dismiss="modal"
              style="width: 100px"
              @click="canselInsert"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div
      v-if="modalDelete"
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header text-center">
            <h5 class="modal-title" id="exampleModalLabel">Delete Service</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body text-center">
            <p>
              Are you sure you want to delete
              <strong> "{{ service.name }}"</strong>?
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger rounded fw-bold"
              data-bs-dismiss="modal"
              style="width: 100px"
              @click="serviceDelete()"
            >
              Yes
            </button>
            <button
              type="button"
              class="btn btn-success rounded fw-bold"
              data-bs-dismiss="modal"
              style="width: 100px"
              @click="cancelUpdate"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Update - Modal -->
    <div
      v-if="modalUpdate"
      class="modal fade"
      id="updateModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header text-center">
            <h5 class="modal-title" id="exampleModalLabel">Update Service</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body text-center">
            <p>
              <strong> "{{ service.name }}"</strong> updated.
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-success rounded fw-bold"
              data-bs-dismiss="modal"
              style="width: 100px"
              @click="cancelUpdate"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.table-heading {
  background-color: #b91c1c;
  color: white;
}
</style>