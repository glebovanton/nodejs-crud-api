# nodejs-crud-api

## Overview
This repository offers a lightweight API for managing user records, utilizing an in-memory store. The system supports basic operations such as creating, retrieving, modifying, and deleting users.

## Key Features
Developed with either JavaScript or TypeScript.
Dependencies are limited to: nodemon, dotenv, cross-env, typescript, ts-node, ts-node-dev, eslint and its plugins, webpack-cli, webpack and its plugins, prettier, uuid, @types/*, and test libraries.
Requires Node.js version 22.x.x or higher.
Focuses on asynchronous functionality whenever feasible.

## To kill port

```bash     
lsof -i:3010
``` 
```bash 
kill -9 $PORT
```

## To start server  

```bash
npm run start:dev   
```    

## To start server in cluster mode

```bash
npm run start:multi   
```   

## To start server in production mode

```bash
npm run start:prod
```

## To build

```bash
npm run build
```

## To test  

```bash
npm run test
```

## API Functionality
1. **Endpoints for user management**:
    - `GET` `/api/users` - Retrieves all users.
    - `GET` `/api/users/{userId}` - Retrieves a specific user by their unique ID.
    - `POST` `/api/users` - Adds a new user to the system.
    - `PUT` `/api/users/{userId}` - Updates details of an existing user.
    - `DELETE` `/api/users/{userId}` - Removes a user from the system.

2. **User structure**:
    - `id`: Server-generated unique identifier (`string`, UUID format).
    - `username`: The user's name (`string`, **mandatory**).
    - `age`: The user's age (`number`, **mandatory**).
    - `hobbies`: An array of hobbies (`string[]`, can be empty but required).

3. Non-existent routes return a 404 error with a descriptive message.
4. Internal errors yield a 500 status with an informative error message.
5. The server port is configured via a `.env` file.

## Running the Application
### Development Mode
- To run the application in development mode with hot-reloading:
   ```sh
   npm run start:dev
### Production Mode
- To run the application in production mode:
   ```sh
   npm run start:prod
### Multi-Instance Mode
- To run the application with multiple instances using the Node.js `Cluster` API:
    ```sh
    npm run start:multi

### Example Requests
Get All Users
`curl -X GET http://localhost:3010/api/users`

Get User by ID
`curl -X GET http://localhost:3010/api/users/{userId}`

Create a New User
`curl -X POST http://localhost:3010/api/users -H "Content-Type: application/json" -d '{"username": "John Doe", "age": 30, "hobbies": ["reading", "gaming"]}'`

Update an Existing User
`curl -X PUT http://localhost:3010/api/users/{userId} -H "Content-Type: application/json" -d '{"username": "John Doe", "age": 31, "hobbies": ["reading", "gaming", "hiking"]}'`

Delete a User
`curl -X DELETE http://localhost:3010/api/users/{userId}`

## Testing
To run the tests:
`npm test`

## Horizontal Scaling
In multi-instance mode, the load balancer handles traffic at `localhost:3010/api`, distributing requests across multiple worker processes running on different ports, such as `localhost:3011/api`, `localhost:3012/api`, and so on.
