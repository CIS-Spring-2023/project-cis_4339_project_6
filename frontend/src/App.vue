<script>
import { useLoggedInUserStore } from '../stores/userLogin'
import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API

export default {
  name: 'App',
  data() {
    return {
      orgName: 'Dataplatform'
    }
  },
  setup() {
    const user = useLoggedInUserStore()
    return { user }
  },
  created() {
    axios.get(`${apiURL}/org`).then((res) => {
      this.orgName = res.data.name
    })
  },
  methods:{
    clearStore(){
      this.user.$reset
    }
  }
}
</script>
<template>
  <div
    class="d-flex flex-column flex-shrink-0 bg-light"
    style="width: 4.5rem"
  ></div>
  <main class="flex flex-row">
    <div
      id="_container"
      class="h-screen"
      style="width: 240px"
      v-if="user.isEditor || user.isViewer"
    >
      <header class="w-full">
        <section class="text-center mb-5 mt-3">
          <img class="m-auto" src="@\assets\DanPersona.svg" />
          <!-- Display username and role of logged in user -->
          <p class="userCred mt-10">
            Welcome <strong> {{ user.name }} </strong>
          </p>
          <p class="userCred mt-2">
            Logged in as: <strong> {{ user.role }} </strong>
          </p>
        </section>
        <hr />
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <li class="list-class">
              <router-link to="/" class="routerlink">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons mr-2"
                  >dashboard</span
                >
                Dashboard
              </router-link>
            </li>
            <li v-if="user.isEditor">
              <router-link to="/intakeform" class="routerlink">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons mr-2"
                  >person_add</span
                >
                Client Intake Form
              </router-link>
            </li>
            <li v-if="user.isEditor">
              <router-link to="/eventform" class="routerlink">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons mr-2"
                  >event</span
                >
                Create Event
              </router-link>
            </li>
            <li>
              <router-link to="/findclient" class="routerlink">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons mr-2"
                  >person_search</span
                >
                Find Client
              </router-link>
            </li>
            <li>
              <router-link to="/findevents" class="routerlink">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons mr-2"
                  >search</span
                >
                Find Event
              </router-link>
            </li>
            <li>
              <router-link to="/eventservices" class="routerlink">
                <span
                  style="position: relative; top: 6px"
                  class="material-icons mr-2"
                  ><span class="material-symbols-outlined">
                    volunteer_activism
                  </span></span
                >
                Services
              </router-link>
            </li>
          </ul>
          <hr class="mt-5" />
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <section
        class="justify-end items-center h-24 flex"
        style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)"
      >
        <h1 class="mr-20 text-3xl text-white">{{ this.orgName }}</h1>
        <ul>
          <li
            class="mr-10 fw-bold fs-5"
            v-if="!user.isEditor && !user.isViewer"
          >
            <router-link to="/loginView" class="routerlink">
              <span
                style="position: relative; top: 6px"
                class="material-icons mr-2"
                >login</span
              >
              Login
            </router-link>
          </li>
          <li class="mr-10 fw-bold fs-5" v-if="user.isEditor || user.isViewer">
            <a href="/" style="text-decoration: none; color: white">
              <span
                @click="store.logout(), useLoggedInUserStore.$reset"
                class="nav-link"
              >
                <span
                  style="position: relative; top: 6px"
                  class="material-icons mr-2"
                  >logout</span
                >
                Logout</span
              >
            </a>
          </li>
        </ul>
      </section>
      <div style="height: 95vh">
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>
<style>
#_container {
  background-color: #c8102e;
  color: white;
  padding: 18px;
}

.material-icons,
.routerlink {
  color: white;
  text-decoration: none;
}
.userCred {
  font-size: 14px;
  justify-items: start;
}
</style>
