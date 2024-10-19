# Event Booking Platform

## Description

This project is a backend system for an event booking platform built with Node.js and Express.js. It allows users to search for and book services like venues, hotels, caterers, cameramen, and DJs. An admin interface is provided for service providers to manage their offerings.

## Features

### User Features
- **User Registration & Authentication:** 
  - Users can sign up and log in.
  - User passwords are stored securely using hashing.
  
- **Event Booking:**
  - Search for services with filters for:
    - Price range
    - Service category
    - Location
    - Availability (date-based filter)
  - Each service displays:
    - Description
    - Pricing
    - Availability status
    - Contact information
  - Users can book services for specific dates, with confirmations stored in the database.

- **View Bookings:**
  - Users can view their past and upcoming bookings.

### Admin Features
- **Admin Login & Authentication:** 
  - Admins can log in to manage the platform.
  
- **Service Management:**
  - Add, edit, or remove services.
  - Each service includes:
    - Title
    - Category (venue, caterer, DJ, etc.)
    - Price per day
    - Description
    - Availability dates
    - Contact details
  - Admins can view all bookings for their services.

### Other Functionalities
- **Search & Filter:** 
  - Search services based on keywords and apply multiple filters.
  
- **Price Calculation:** 
  - Calculate total price based on the number of days booked.

## Technologies Used
- Node.js
- Express.js
- MongoDB (or any preferred relational database)
- JSON Web Token (JWT) for authentication
- Swagger or Postman for API documentation

## Getting Started

### Prerequisites
- Node.js (version X.X.X)
- MongoDB or a relational database (PostgreSQL, MySQL)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
2. Create .evn file in the api according to the .env.example
3. cd api
4.npm install
5.npm run dev

