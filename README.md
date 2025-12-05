# YouApp Backend Challenge

## Tech Stack

- **NestJS**  
- **Node.js**
- **MongoDB** (Mongoose)
- **Docker**
- **RabbitMQ** (Message Queue for chat/notification)
- **JWT** (Authentication)
- **Socket.io** (optional, bonus feature)
- **DTO & Validation** (`class-validator`)
- **Unit Test** (`jest`)
---

## Quick Start

### Development (Run Locally)

```bash
docker-compose up --build
# Or for local only, set up .env then:
npm install
npm run start:dev
```

### Environmental variables

Set in `.env` or pass via Docker Compose.  
Example:

```env
MONGO_URI=mongodb://localhost:27017/<namadb>
JWT_SECRET=<your_jwt_secret_here>
RABBITMQ_URI=amqp://<rabbit_user>:<rabbit_pass>@localhost:5672
```

---

## API Endpoints

All endpoints prefixed with `/api`

### **Auth & Profile**

| Endpoint              | Method | Params/Body                    | Description                   |
|-----------------------|--------|-------------------------------|-------------------------------|
| `/api/register`       | POST   | `{ username, password }`       | Register new user             |
| `/api/login`          | POST   | `{ username, password }`       | Login, returns JWT            |
| `/api/createProfile`  | POST   | `{ ...profile fields }`        | Create user profile           |
| `/api/getProfile`     | GET    | Auth Header                    | Get own profile               |
| `/api/updateProfile`  | PUT    | `{ ...profile fields }`        | Update own profile            |

#### **Profile fields (Figma)**
- `fullName`: String
- `birthdate`: Date (ISO)
- `zodiac`: String (calculated)
- `horoscope`: String (calculated)
---

### **Chat & Notification**

| Endpoint               | Method | Params/Body                 | Description                      |
|------------------------|--------|-----------------------------|----------------------------------|
| `/api/sendMessage`     | POST   | `{ receiverId, content }`   | Send message, RabbitMQ notify    |
| `/api/viewMessages`    | GET    | `?partnerId=` (query)       | Get chat history w/ user         |
| `/api/getNotification` | GET    | Auth Header                 | Get recent notifications         |

#### **Notification Response Example**

```json
[
  {
    "_id": "656f34ab9a6c12345abcde01",
    "userId": "6932e5ab8419339d4e006ca7",
    "title": "New Message",
    "message": "You have a new message",
    "isRead": false,
    "timestamp": "2025-12-05T15:28:00.000Z",
    "createdAt": "2025-12-05T15:28:00.000Z"
  }
]
```

---

## Data Structures & Design

- Schema planning uses ObjectId, references, index
- Microservices: RabbitMQ decouples chat/notification send
- Validation: DTOs via class-validator on every request
- Authentication: JWT in `Authorization: Bearer ...`
- MongoDB/Mongoose: profile, message, notification collections

---

## Unit Test

Run all tests:
```bash
npm run test
```

---

## Docker Compose

Includes Node/NestJS app, MongoDB, RabbitMQ.

```yaml
services:
  api:
    build: .
    ports:
      - 3000:3000
    env_file:
      - .env
    depends_on:
      - mongodb
      - rabbitmq

  mongodb:
    image: mongo:latest
    ports:
      - 27017:27017

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - 5672:5672
      - 15672:15672
```

---

## How to Use

1. `POST /api/register` → Register user
2. `POST /api/login` → Get JWT
3. Auth header: `Authorization: Bearer <JWT>`
4. Create/Update profile (`/api/createProfile`, `/api/updateProfile`)
5. Chat: `/api/sendMessage`, `/api/viewMessages`
6. Notifications: `/api/getNotification`


## Notes

- All requests need JWT Auth except register/login.
- Validation error: HTTP 400 JSON with field errors.
- Notifications auto-generated per message/receive.

---

## Maintainer

Rizki Ardiansyah Novianto
