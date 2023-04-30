<script>
// import store
import { useLoggedInUserStore } from '../../stores/userLogin'

export default {
  data: () => {
    return {
      username: '',
      password: ''
    }
  },
  // setup is from composition api
  // allows to add additional functionality not part of the standard VUEjs framework (pini is an additional library)
  setup() {
    const store = useLoggedInUserStore()
    return {
      // you can return the whole store instance to use it in the template
      store
    }
  }
}

// at level of button call store.login providing the variables
</script>

<template>
  <div class="row justify-content-center">
    <div class="card p-6" style="margin-top: 40px; width: 500px">
      <div
        class="card-header text-center p-2"
        style="background-color: #b91c1c; color: white"
      >
        <h4>Login</h4>
        <p>Please enter username and password</p>
      </div>
      <form @submit.prevent="store.login(username, password)">
        <div class="form-group" style="margin-top: 20px; margin-bottom: 10px">
          <label style="margin-bottom: 5px">Username</label>
          <input
            type="text"
            class="form-control"
            v-model="username"
            placeholder="username"
            required
          />
        </div>
        <div class="form-group">
          <label style="margin-bottom: 5px">Password</label>
          <input
            type="password"
            class="form-control"
            v-model="password"
            placeholder="password"
            required
          />
        </div>
        <div class="row justify-content-center">
          <button
            class="btn mt-3"
            style="background-color: #b91c1c; color: white; width: 100px"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
