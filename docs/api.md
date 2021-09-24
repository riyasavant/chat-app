# API Documentation

### Authentication
1. Login - `/api/auth/login`  
   1. method: POST
   2. body: {username: String, password: String}
2. Register - `/api/auth/register`
   1. method: POST
   2. body: {username: String, password: String}
3. Verify Auth (Used for Protected Routes) - `/api/auth/verifyAuth`
   1. method: GET
   2. headers: {"x-access-token": Token stored in local storage}
   
### User
1. Get username - `/api/user/getUsername`
   1. method: GET
   2. header: {"x-access-token": Pass the token stored in localStorage}
   3. body: null