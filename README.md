# NestJS Application with AWS S3 Integration

## Tech Stack

- **Backend**: Node.js, Express.js, NestJS
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Unit Testing**: Jest
- **API Documentation**: Swagger
- **Additional**: AWS S3 for storing profile pictures, Docker for containerization
- **Additional Services**: AWS SES for sending email notifications, Cron jobs for periodic cleanup on S3

This project is a NestJS application that allows users to upload profile pictures to AWS S3, send email notifications using AWS SES, and includes a periodic cleanup service for old files on S3.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [Cron Jobs](#cron-jobs)
- [API Documentation](#api-documentation)
- [License](#license)

## Installation

### Prerequisites

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- AWS Account with access to S3 and SES
- AWS CLI (optional but recommended)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-repo/nestjs-s3-application.git
   cd nestjs-s3-application

   ```

2. **Install Dependencies and node version**

   - node 18
   - npm install

3. **Set Up Environment Variables**
   - Copy .env example file .env in src folder
4. **Database Setup**

5. **Development**

   - npm run start:dev
   - Create Admin using(seed)

6. **Production**

   - npm run build
   - npm run start:prod

7. **Testing**

   - npm run test

8. **Linting**

   - npm run lint

9. **Using docker**
   - docker-compose up -d (setup container)
   - docker-compose down (remove container)
   - docker-compose build (start container)
   - docker-compose restart <container id> (restart container)

**Folder Structure**
src/
├── app.module.ts
├── config/
│ └── config.service.ts
├── modules/
│ ├── user/
│ ├── appointment/
│ ├── availability/
│ ├── appointment-service
├── services/
│ ├── s3.service.ts
│ └── email.service.ts
├── validation/
├── enum/
├── database/
├── constant/
├── middleware/
`

## API Documentation

This application uses Swagger for API documentation. You can access the Swagger UI to explore the available endpoints and test them directly from your browser.

### Swagger URL

After running the application, you can access the Swagger documentation at:

[http://localhost:4000/api-docs](http://localhost:4000/api-docs)

## login details

- Admin email: admin@yopmail.com
- password: Test@123

Replace `localhost:4000` with your actual server address if you're deploying this application in a different environment.

**API Related**

- 1.  User Signup and Login
      `Implement user authentication, allowing users to sign up and log in to the platform. `
- 2. Admin Add Service
     - Admin Role: The Admin can add new services to the platform.
     - Service Details: Admin provides the following details:
     - Name: The name of the service (e.g., "Haircut").
     - Duration: The duration of the service in minutes (e.g., 30 minutes).
     - Price: The cost of the service. `

- 3.  Provider Add Availability
      - Provider Role: Providers can add their availability for the services they offer.
      - Availability Details:
      - Start Time: The start time of the availability window (e.g., 9:00 AM).
      - End Time: The end time of the availability window (e.g., 5:00 PM).
      - Service Duration: The service duration is used to automatically create time slots within the availability - window. For - example, if a service duration is 30 minutes, slots like 9:00 AM - 9:30 AM, 9:30 AM - 10:00 AM, etc., will be generated.

- 4. User Create Booking
     - User Role: Users can create bookings for services.
     - Booking Process:
     - Select Service: The user selects a service they wish to book.
     - Select Provider: The user selects a provider offering that service.
     - Select Date: The user selects a date for the booking.
     - Slot Availability API Call: An API call retrieves the available time slots for the selected date based on the provider’s availability and the service duration.
     - Select Slot: The user selects an available time slot to complete the booking.`
