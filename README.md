# NestJS Application with AWS S3 Integration

## Tech Stack:

○ Backend: Node.js, Express.js, NestJS
○ Database: Any (Mysql)
○ Authentication: JWT (JSON Web Tokens)
○ Unit Testing: Jest
○ API Documentation: Swagger
○ Additional: AWS S3 for storing profile pictures, Docker for containerization
This project is a NestJS application that allows users to upload profile pictures to AWS S3, send email notifications using AWS SES, and includes a periodic cleanup service for old files on S3.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [Cron Jobs](#cron-jobs)
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

2. **Install Dependencies**

npm install

3. **Set Up Environment Variables**
   Copy .env example file .env
4. **Database Setup**

5. **Development**
   npm run start:dev

6. **Production**
   npm run build
   npm run start:prod

7. **Testing**
   npm run test

8. **Linting**
   npm run lint

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

## API Documentation

This application uses Swagger for API documentation. You can access the Swagger UI to explore the available endpoints and test them directly from your browser.

### Swagger URL

After running the application, you can access the Swagger documentation at:

[http://localhost:4000/api-docs](http://localhost:4000/api-docs)

Replace `localhost:4000` with your actual server address if you're deploying this application in a different environment.

```

```

First create account

# appointment
