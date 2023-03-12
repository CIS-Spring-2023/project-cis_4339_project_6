This project uses [VueJS 3](https://vuejs.org/) with [Vite](https://vitejs.dev/) and [TailwindCSS](https://tailwindcss.com/).
For form validation [Vuelidate](https://vuelidate-next.netlify.app/) is used.

**IMPORTANT:** Frontend Testing
   - The front end relies on data from the backend to function. Please ensure the backend is running before testing the front end for Sprint 2.
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
Vite API in frontend .env file 
```
 VITE_ROOT_API=http://localhost:3000
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

MongoDB setup information in the .env file (backend)
```
MONGO_URL=mongodb+srv://UH_CIS_Projects:8e9KZEH44u3ndOTo@ciscluster.xj0hvfk.mongodb.net/CIS4339_Project
PORT = 3000
org = Org6
```

### 4. Backend - MongoDB DataSchema
*Note: The dataschema structure is based on presumtions from demo application provided and will be updated as neccessary during sprint 3.* 
The follwing depicts examples of the current data schema in the cloud MongoDB instance:
#### ORG data Schema
![OrgDataSchema](https://github.com/CIS-Spring-2023/project-cis_4339_project_6/blob/main/frontend/src/assets/OrgDataSchema.jpg)

#### Client data Schema
![ClientDataSchema](https://github.com/CIS-Spring-2023/project-cis_4339_project_6/blob/main/frontend/src/assets/ClienDataSchema.jpg)

#### Event Data Schema
![EventsDataSchema](https://github.com/CIS-Spring-2023/project-cis_4339_project_6/blob/main/frontend/src/assets/EventDataSchema.jpg)

#### Service Data Schema
![ServicesDataSchema](https://github.com/CIS-Spring-2023/project-cis_4339_project_6/blob/main/frontend/src/assets/ServiceDataSchema.jpg)

#### User Data Schema
![userDataSchema](https://github.com/CIS-Spring-2023/project-cis_4339_project_6/blob/main/frontend/src/assets/UserDataSchema.jpg)
