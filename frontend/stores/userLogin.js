import { defineStore } from 'pinia'
import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API

// Defining a pinia store via method "definestore"
export const useLoggedInUserStore = defineStore({
  // id is only required for devtools with the Pinia store
  id: 'loggedInUser', //id is optional, used for debugging

  // Central part of the store
  state: () => {
    // "variables" to track
    return {
      user: {
        username: '',
        password: ''
      },
      name: '',
      role: '',
      isViewer: false, // View user role
      isEditor: false //Editor user role
    }
  },

  // Make use of persist functionality to prevent store from resetting when
  // page is refressed
  persist: true,

  /** User Logout and store reset is handled in App.vue line 149  */

  actions: {
    async login(username, password) {
      try {
        // utilize user authentication login API
        const response = await axios.post(
          `${apiURL}/users/userAuthentication`,
          { username, password }
        )
        /** If user role is viewer then mutate the state of
         *  the corresponding state variable (isViewer) */
        if (response.data.role === 'viewer') {
          this.$patch({
            name: response.data.username,
            role: response.data.role,
            isViewer: true
          })
          this.$router.push('/')
        }
        /** If user role is editor then mutate the state of
         *  the corresponding state variable (isEditor) */
        if (response.data.role === 'editor') {
          this.$patch({
            name: response.data.username,
            role: response.data.role,
            isEditor: true
          })
          this.$router.push('/')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
})
