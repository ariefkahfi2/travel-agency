# Travel Agency Platform | Backend API

### Overview

The Travel Agency Platform is designed to manage tourist data and bookings efficiently. This backend API is built to handle RESTful requests and provides essential functionalities for managing tourists' information and their travel itineraries.

### Technology stacks

- Typescript
- Midtrans
- TypeORM
- Express
- Render
- Bcrypt
- JsonWebToken
- PostgreSQL

### Entities

- User
- Booking

### Role users

- admin
- customer

### Features

- Booking API
  - Authenticated and role based authorization with `Bearer` token
  - List bookings per customer
  - Detail specific booking data, including:
     - Origin/Pickup point
     - Destination
     - Start date (UTC Format)
     - Estimation time arrival date (UTC Format)
  - Create booking
    - Authenticated and role based authorization with `Bearer` token
    - Booking record saved to database
  - Handle transaction status
    - Payment gateway send webhook notification to backend and update booking payment to `paid`
- User management API
  - Only accessible by `admin` role
  - Authenticated and role based authorization with `Bearer` token
  - Create new `customer` along with their data identities
  - Update `customer` data
  - Delete `customer` data
  - List all `customer` data
- Login API
  - Accessible by `admin` and `customer` roles
  - User can login with their `email` and `password` attributes

### Local development guides

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and set the required environment variables. You can use the `.env.sample` file as a reference.
4. Build the project
   ```bash
   npm run build
   ```
5. Run the database migration
   ```bash
   npm run typeorm:run-migration
   ```
6. Make sure the database migration is successful
   ```bash
   npm run typeorm:show-migration
   ```
7. Start the server
   ```bash
   npm start
   ```
8. Access the API at `http://localhost:3000`



### Deployment guides

1. Create a PostgreSQL database on Render
2. Create a new Render for web service
3. Connect the Render web service to your GitHub repository
4. Set the environment variables in Render
5. Set the build command to `npm install && npm run build`
6. Deploy the service
7. Access the deployed service URL

### Notes

Postman collection link: 

- [Travel Agency API](https://ariefkahfi-1699390.postman.co/workspace/arief-kahfi's-Workspace~8426d587-b8eb-434e-83fc-c9813774a5ea/collection/44834567-333c406c-282b-4e84-a8dc-ab46cca5df2a?action=share&creator=44834567)