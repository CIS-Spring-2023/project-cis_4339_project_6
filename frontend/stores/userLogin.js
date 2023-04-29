import { defineStore } from 'pinia'
//defining a pinia store via method "definestore"
export const useLoggedInUserStore = defineStore({
  // id is only required for devtools with the Pinia store
  id: 'loggedInUser', //id is optional, used for debugging
  //central part of the store
  state: () => {
    // "variables" to track
    return {
      name: '',
      role: '',
      isViewer: false, // View user role
      isEditor: false //Editor user role
    };
  },
  //persist: true,

  actions: {
    async login(username, password) {
      try {
        const response = await apiLogin(username, password);
        // change or mutate the state (pinia way of persorming mutation of state variable)
        this.$patch({
          isViewer: response.isViewer,
          isEditor: response.isEditor,
          name: response.name,
          role: response.role,
        });

        // redirect to dashboard view
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    },

    //set values back to initial values 
    logout() {
      this.patch({
        name: '',
        role: '',
        isEditor: false,
        isViewer: false,
      });
      // redirect to dashboard view
      this.$router.push("/");
    },
  },
});

//simulate a login - we will later use our backend to handle authentication
function apiLogin(u, p) {
  if (u === "ViewUser" && p === "ViewUser")
    return Promise.resolve({
      isViewer: true,
      name: "ViewUser",
      role: "Viewer",
    });
  else if (u === "EditUser" && p === "EditUser")
    return Promise.resolve({
      isEditor: true,
      name: "EditUser",
      role: "Editor",
    });
  else return Promise.reject(new Error("invalid credentials"));
}
