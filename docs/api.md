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
2. Get user details - `/api/user/get/:userId`
   1. method: GET
   2. param: userId - string  
3. Get user details using username - `/api/user/:username`
   1. method: GET
   2. param: username - string  
4. Get all users - `/api/user/`
   1. method: GET  

### Conversation  
1. Create a conversation - `/api/conversations/`  
   1. method: POST
   2. body: { senderId: string, receiverId: string }  
2. Get conversations of a user - `/api/conversations/:userId`  
   1. method: GET
   2. body: null
   3. param: userId - string  

### Messages  
1. Create a message - `/api/messages/`  
   1. method: POST
   2. body: { sender: string, conversationId: string, text: string }  
2. Get messages under a conversation - `/api/conversations/:conversationId`  
   1. method: GET
   2. body: null
   3. param: conversationId - string  