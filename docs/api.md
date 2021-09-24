# API Documentation

### Authentication
1. Login - `/api/auth/login`  
   1. method: POST
   2. body: {username: String, password: String}
2. Register - `/api/auth/register`
   1. method: POST
   2. body: {username: String, password: String}
   
### User
1. Get username - `/api/user/getUsername`
   1. method: GET
   2. header: {"x-access-token": Pass the token stored in localStorage}
   3. body: null