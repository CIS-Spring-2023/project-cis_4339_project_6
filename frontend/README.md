# Data Platform Frontend

This project uses [VueJS 3](https://vuejs.org/) with [Vite](https://vitejs.dev/) and [TailwindCSS](https://tailwindcss.com/).
For form validation [Vuelidate](https://vuelidate-next.netlify.app/) is used.

**IMPORTANT:** Frontend Testing
   - The frontend relies on data from the backend to fucntion.  Please ensure backend is running before testing the frontend for Srint 2.
   - Backend utilizes a cloud instance of MongoDB

## Index:
1. Frontend
2. User Login - Frontend
3. Backend - Main
4. Backend - MongoDB DataSchema

### 1. Frontend
within terminal
```
cd frontend
npm install
npm run dev
```
### 2. User Login Frontend

| User name | Password | Role |
|-----------|----------|------|
| ViewUser | ViewUser | Limited access - only able to view information but not edit|
| EditUser | EditUser | Full access - user can view, update and delete data |

*Note: user login is currently hard coded, to be updated in sprint 3*

### 3. Backend - Main
within terminal
```
cd backend
npm install
npm start
```

### 4. Backend - MongoDB DataSchema
*Note: The dataschema structure is based on presumtions from demo application provided and will be updated as neccessary during sprint 3.* 
The follwing depicts examples of the current data schema:
#### 1. ORG dataschema

