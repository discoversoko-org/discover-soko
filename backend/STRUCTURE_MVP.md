# MVP Backend Structure Guide

## Overview
Minimal working backend with only essential features: Authentication, Business CRUD, User management, Hero Slider, and Admin controls.

## Directory Structure

```
backend/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   │
│   ├── config/
│   │   ├── index.js              # Config exports
│   │   ├── db.js                 # MongoDB connection
│   │   ├── jwt.js                # JWT configuration
│   │   └── cloudinary.js         # Cloudinary configuration
│   │
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── business.controller.js
│   │   │   ├── admin.controller.js
│   │   │   └── hero.controller.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── user.service.js
│   │   │   ├── business.service.js
│   │   │   ├── admin.service.js
│   │   │   └── hero.service.js
│   │   │
│   │   ├── repositories/
│   │   │   ├── auth.repository.js
│   │   │   ├── user.repository.js
│   │   │   ├── business.repository.js
│   │   │   ├── admin.repository.js
│   │   │   └── hero.repository.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── business.routes.js
│   │   │   ├── admin.routes.js
│   │   │   └── hero.routes.js
│   │   │
│   │   ├── validations/
│   │   │   ├── auth.validation.js
│   │   │   ├── user.validation.js
│   │   │   ├── business.validation.js
│   │   │   └── hero.validation.js
│   │   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Business.js
│   │   └── HeroSlide.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   ├── ratelimit.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── sendResponse.js
│   │   ├── generateToken.js
│   │   └── pagination.js
│   │
│   └── constants/
│       ├── index.js
│       ├── roles.js
│       └── status.js
│
├── package.json
├── .env
└── .gitignore
```

## API Routes

### 1. Authentication (`/api/auth`)
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
```

### 2. Users (`/api/users`)
```
POST   /api/users/avatar       - Upload user avatar (protected)
```

### 3. Business (`/api/business`)
```
GET    /api/business           - List all approved businesses
GET    /api/business/:id       - Get business by ID
POST   /api/business           - Create business (protected)
PUT    /api/business/:id       - Update business (protected)
DELETE /api/business/:id       - Delete business (protected)
```

### 4. Hero Slides (`/api/hero`)
```
GET    /api/hero               - Get all active hero slides (public)
```

### 5. Admin (`/api/admin`)
```
GET    /api/admin/businesses/pending          - Get pending businesses
PUT    /api/admin/businesses/:id/approve      - Approve business
PUT    /api/admin/businesses/:id/reject       - Reject business
DELETE /api/admin/businesses/:id              - Delete business

GET    /api/admin/users                       - List all users
GET    /api/admin/users/:id                   - Get user details
DELETE /api/admin/users/:id                   - Delete user

GET    /api/admin/slides                      - Get all hero slides
POST   /api/admin/slides                      - Create hero slide
PUT    /api/admin/slides/:id                  - Update hero slide
DELETE /api/admin/slides/:id                  - Delete hero slide
```

## Layer Responsibilities

### Controllers
- Handle HTTP requests/responses
- Input validation via validations layer
- Call appropriate service methods
- Use `asyncHandler` for error handling
- Return standardized responses via `sendResponse`

### Services
- Business logic and validation
- Orchestrate repository calls
- Throw errors as `{ status, message }` objects

### Repositories
- Pure database operations
- Execute CRUD operations
- No business logic

### Validations
- Input validation rules
- Return `{ isValid: boolean, errors: [] }`

## Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: { url, public_id },
  role: enum["user", "admin"],
  businesses: [ObjectId],
  timestamps
}
```

### Business
```javascript
{
  name: String (required),
  location: String (required),
  description: String,
  contact: String,
  image: { url, public_id },
  owner: ObjectId (required),
  status: enum["pending", "approved", "rejected"],
  rejectionReason: String,
  timestamps
}
```

### HeroSlide
```javascript
{
  title: String (required, max 100),
  description: String (required, max 500),
  image: { url (required), public_id },
  order: Number (default 0),
  isActive: Boolean (default true),
  timestamps
}
```

## Constants

### ROLES
- `ADMIN` = "admin"
- `USER` = "user"

### BUSINESS_STATUS
- `PENDING` = "pending"
- `APPROVED` = "approved"
- `REJECTED` = "rejected"

### STATUS_LABELS
- "pending" → "Pending Review"
- "approved" → "Approved"
- "rejected" → "Rejected"

## Key Business Rules

1. **One user = One business** (MAX_BUSINESSES = 1)
2. **New businesses start as "pending"** (require admin approval)
3. **Only owner or admin can modify business**
4. **Admin can approve/reject/delete any business**
5. **Non-admin updates reset business to pending**
6. **Users cannot self-promote to admin**
7. **Password minimum: 6 characters**
8. **JWT expires after 1 day**
9. **Rate limiting on auth endpoints**

## Middleware Stack

### Authentication
- `authMiddleware` - Validates JWT token, attaches user to request
- `isAdmin` - Checks if user role is admin
- `isBusiness` - Checks if user is business owner

### Upload
- `uploadAvatar` - Avatar upload (5MB max)
- `uploadBusinessImage` - Business image upload (10MB max)

### Rate Limiting
- `authLimiter` - Auth endpoint rate limiting
- `apiLimiter` - General API rate limiting

## Response Format

All responses follow standardized format:
```javascript
{
  success: boolean,
  message: string,
  data?: any  // Only if success and data exists
}
```

## Error Handling

Errors are thrown as objects:
```javascript
throw { status: 400, message: "Error description" };
```

`asyncHandler` catches these and passes to error middleware, which returns:
```javascript
{
  success: false,
  message: "Error description"
}
```

## Dependencies

**Core**
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- cors: CORS middleware

**File Upload**
- multer: File upload middleware
- cloudinary: Image storage
- multer-storage-cloudinary: Cloudinary storage driver

**Rate Limiting**
- express-rate-limit: Rate limiting

**Development**
- nodemon: Auto-reload on file changes
- dotenv: Environment variables

## Testing Flow

1. **Register User**: POST `/api/auth/register`
2. **Login**: POST `/api/auth/login` → Get JWT token
3. **Create Business**: POST `/api/business` (with token)
4. **Admin Approves**: PUT `/api/admin/businesses/:id/approve` (admin token)
5. **View Business**: GET `/api/business/:id` (public)
6. **Create Hero Slide**: POST `/api/admin/slides` (admin token)
7. **View Hero Slides**: GET `/api/hero` (public)

## Deployment Notes

- MongoDB connection string in `.env` as `MONGODB_URI`
- JWT secret in `.env` as `JWT_SECRET`
- Cloudinary credentials in `.env` as `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`
- CORS origin configured for frontend URL
- Rate limiting enabled on sensitive endpoints
- All passwords are bcrypt hashed (never stored in plain text)
