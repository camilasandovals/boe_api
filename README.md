# BOE API

Backend API for the BOE platform. This API is built using Firebase Functions and provides endpoints for managing schools, programs, users, blogs, events, subscriptions and more.

## Technologies Used

- Node.js 18
- Firebase Functions
- Express.js
- MongoDB/Mongoose
- Firebase Authentication
- Mailchimp Integration
- JWT Authentication
- GridFS for file storage

## Project Structure

```
functions/
├── src/
│   ├── controllers/     # Business logic for each entity
│   │   ├── blogs.js
│   │   ├── events.js
│   │   ├── messages.js
│   │   ├── premiumApplication.js
│   │   ├── programs.js
│   │   ├── schools.js
│   │   ├── subscriber.js
│   │   ├── userlikes.js
│   │   └── users.js
│   ├── middlewares/     # Authentication middleware
│   │   └── token.js
│   ├── models/          # Database schemas
│   │   ├── blogsSchema.js
│   │   ├── eventsSchema.js
│   │   ├── fileSchema.js
│   │   ├── messagesSchema.js
│   │   ├── premiumApplicationSchema.js
│   │   ├── programsSchema.js
│   │   ├── schoolSchema.js
│   │   ├── subscribeSchema.js
│   │   ├── userLikeSchema.js
│   │   └── userSchema.js
│   └── routes/          # API route definitions
│       └── myRoutes.js
```

## Setup Instructions

1. Install dependencies:
```bash
cd functions
npm install
```

2. Set up environment variables:
Create an `env.js` file in the functions directory with the following variables:
```javascript
export const MONGOURI = "your_mongodb_connection_string";
export const MAILCHIMP_API_KEY = "your_mailchimp_api_key";
export const MAILCHIMP_SERVER_PREFIX = "your_mailchimp_server_prefix";
```

3. Run locally:
```bash
npm run serve
```

4. Deploy to Firebase:
```bash
npm run deploy
```

## API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `PATCH /api/users` - Update user information (requires authentication)

### Schools & Members
- `GET /api/members` - Get all members
- `POST /api/members/signup` - School member registration
- `POST /verify` - Verify member

### Programs
- `GET /api/programs` - Get all programs with schools (requires authentication)
- `POST /api/programs` - Add new program (requires authentication)
- `GET /memberPrograms` - Get school programs (requires authentication)
- `DELETE /api/programs/:id` - Delete a program

### Content
- `GET /api/events` - Get all events
- `GET /api/blogs` - Get all blogs
- `POST /subscribe` - Subscribe to newsletter

### User Interactions
- `GET /userlikes` - Get user likes (requires authentication)
- `GET /memberlikes` - Get member likes (requires authentication)
- `POST /userlikes` - Add new like (requires authentication)

### Premium Applications
- `POST /premiumApplication` - Submit premium application (requires authentication)
- `GET /premiumApplication` - Get premium applications (requires authentication)
- `GET /memberApplications` - Get member applications (requires authentication)

### Messages
- `GET /messages` - Get all messages (requires authentication)
- `GET /userMessages` - Get user messages (requires authentication)
- `POST /messages` - Create new message

## Features

- JWT-based authentication
- File upload support using GridFS
- Mailchimp integration for newsletter subscriptions
- CORS enabled
- MongoDB integration with Mongoose ODM
- Express middleware for request handling
- Secure password hashing with bcrypt

## Scripts

- `npm run serve` - Start Firebase emulator
- `npm run shell` - Start Firebase Functions shell
- `npm run deploy` - Deploy to Firebase
- `npm run logs` - View Firebase Functions logs

## Dependencies

- express: ^4.18.2
- firebase-admin: ^11.8.0
- firebase-functions: ^4.8.2
- mongoose: ^7.3.2
- @mailchimp/mailchimp_marketing: ^3.0.80
- bcrypt: ^5.1.0
- jsonwebtoken: ^9.0.2
- multer: ^1.4.2
- nodemailer: ^6.9.13
- sharp: ^0.33.3
