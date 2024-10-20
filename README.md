# Event Booking Platform
Documentation link: [Click Here](https://docs.google.com/document/d/1Vfga3JkGtsqLixfphA_O2wdbQb4rKne5eR3wHyY05-I/edit?tab=t.0#heading=h.k0viym8mh1o3)

## Overview
This project is a backend system for an event booking platform that allows users to book services such as venues, hotels, caterers, cameramen, DJs, etc. The platform includes user and admin features for managing bookings and services.

## Technology Stack
- **Node.js** Runtime Env
- **Express.js** Framework
- **MongoDB** Database
- **JWT** for authentication
- **Express Validator** for data validation
- **Jest** for Tesing

## Features
### User Features
- User registration and authentication (passwords are securely hashed)
- Search for services (venues, hotels, caterers, etc.)
- Filter services by:
  - Price range
  - Service category
  - Location
  - Availability
- View service details (description, pricing, availability, contact information)
- Book services for specific dates
- View past and upcoming bookings

### Admin Features
- Admin login and authentication
- Manage services (add, edit, remove)
- View all bookings for services

### Other Functionalities
- Search and filter services
- Calculate total booking price based on duration
- **Implemented pagination and sorting for the services list**
- **Send email notifications for booking confirmations**
- **Send email to all booked users on cancellation of a event.**

## Installation
1. Clone the repository: `git clone https://github.com/iamarijit360x/Event-Management.git`
2. Navigate to the project directory: `cd Event-Management/api`
3. Install the dependencies: `npm install`
4. Create a `.env` file in the `api` directory and set the following variables: 
    - DB_URL=mongodb://127.0.0.1:27017/Event-management 
    - EMAIL='your-email' EMAIL_PASSWORD='your-password' 
    - SECRET='your-secret-key' (you can generate this using the following command `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" `) 
    - EMAIL_CC='abc@gmail.com' 
    - PORT=3015
5. Connect to your MongoDB.

## Running the Application
To start the server, run: `npm run dev`
The server will be running on [http://localhost:3015](http://localhost:3015).
## Testing the Application
1.run `npm test`
