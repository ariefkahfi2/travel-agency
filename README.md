# Travel Agency Platform | Backend API

### Overview

The Travel Agency Platform is designed to manage tourist data and bookings efficiently. This backend API is built to handle RESTful requests and provides essential functionalities for managing tourists' information and their travel itineraries.

### Technology stacks

- Sendgrid
- Midtrans
- TypeORM
- Express
- Supabase
- Bcrypt
- JsonWebToken

### Entities

- User
- Booking

### Role users

- admin
- customer

### Features

- Booking API
  - Accessible by `admin` and `customer` role
    - `admin` can view list and detail specific all customer booking data
    - `customer` can only view list and detail their booking data
  - Authenticated and role based authorization with `Bearer` token
  - List bookings per customer
  - Detail specific booking data, including:
     - Origin/Pickup point
     - Destination
     - Start date (UTC Format)
     - Estimation time arrival date (UTC Format)
  - Create booking
    - Accessible via `admin` and `customer` role
    - Authenticated and role based authorization with `Bearer` token
    - Booking record saved to database
    - System send booking payment notification via `customer` email
    - `customer` can pay their booking via link that has been sent via their email previously
    - Payment gateway send webhook notification to backend and update booking payment to `paid`
- User management API
  - Only accessible by `admin` role
  - Authenticated and role based authorization with `Bearer` token
  - Create new `customer` along with their data identities
  - Update `customer` data
  - Delete `customer` data
- Register API
  - Accessible by `admin` and `customer` roles
  - When user registered by `admin`. system will send account creation notification via their email for their default generated password
- Login API
  - Accessible by `admin` and `customer` roles
  - User can login with their `email` and `password` attributes