# Real-Time Chat Application

A full-stack chat application with real-time messaging support across Web, iOS, and Android platforms. Built with modern technologies including TypeScript, Express.js backend, React for web, and React Native for mobile, powered by Socket.io for instant message delivery.

## Features

- 🔐 **Authentication** - Secure user authentication via Clerk
- 💬 **Real-Time Messaging** - Instant message delivery using WebSocket (Socket.io)
- 👥 **User List** - Browse and start conversations with other users
- 📱 **Cross-Platform** - Single backend serving Web, iOS, and Android clients
- 🎨 **Responsive UI** - Tailwind CSS for web, NativeWind for mobile
- 🔄 **Live Chat Updates** - Real-time message and chat list synchronization

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Real-Time**: Socket.io
- **Database**: (Configured in `src/config/database.ts`)
- **Authentication**: JWT

### Mobile (iOS & Android)

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Styling**: NativeWind with Tailwind CSS
- **State Management**: Custom hooks

### Web

- **Framework**: React
- **Language**: JavaScript
- **Build Tool**: Vite
- **Styling**: CSS

## Project Structure

```
RealTimeChatApp/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Data models (User, Chat, Message)
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Database seeding
│   │   └── utils/          # Socket.io configuration
│   └── app.ts             # Express app setup
│
├── mobile/                  # React Native (Expo) app
│   ├── app/               # Navigation & screens
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Axios & Socket.io clients
│   └── types/             # TypeScript definitions
│
├── web/                     # React web application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Axios, Socket.io, utils
│   │   └── pages/         # Page components
│   └── vite.config.js     # Vite configuration
│
└── Dockerfile             # Docker containerization
```

## Installation

### Prerequisites

- Bun (latest version)
- Docker (optional)

### Backend Setup

```bash
cd backend
bun install
```

Create a `.env` file in the `backend` directory with your configuration:

```env
PORT=3000
JWT_SECRET=your_secret_key
```

### Mobile Setup

```bash
cd mobile
bun install
```

### Web Setup

```bash
cd web
bun install
```

## Running the Application

### Backend

```bash
cd backend
bun run dev        # Development with hot reload
bun run build      # Build for production
bun start          # Run production build
```

### Mobile (Expo)

```bash
cd mobile
bun run start      # Start Expo development server
bun run android    # Run on Android
bun run ios        # Run on iOS
```

### Web

```bash
cd web
bun run dev        # Development server
bun run build      # Production build
bun run preview    # Preview production build
```

## Docker Deployment

```bash
docker build -t realtime-chat-app .
docker run -p 5000:5000 realtime-chat-app
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### Chats

- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `DELETE /api/chats/:id` - Delete chat

### Messages

- `GET /api/messages/:chatId` - Get messages from chat
- `POST /api/messages` - Send message
- `DELETE /api/messages/:id` - Delete message

## Socket Events

### Client to Server

- `send_message` - Send a new message
- `typing` - User is typing
- `online` - User is online

### Server to Client

- `receive_message` - New message received
- `user_typing` - User typing indicator
- `user_online` - User online status

## Development

### Code Quality

- Format code: `bun run format` (in respective directories)
- TypeScript strict mode enabled
- ESLint configured for code consistency

### Database Operations

```bash
cd backend
bun run seed      # Run database seed script
```

## Key Components

### Backend Authentication Middleware

Secure JWT-based authentication for protected routes

### Real-Time Socket Handling

Efficient WebSocket management for instant message delivery and user status updates

### Cross-Platform UI Components

Reusable components across web and mobile platforms for consistent user experience

## Database Schema

### User Model

- `clerkId` - Unique identifier from Clerk
- `name` - User's name
- `email` - User's email
- `avatar` - Avatar URL
- `createdAt`, `updatedAt` - Timestamps

### Chat Model

- `participants` - Array of user IDs in the chat
- `lastMessage` - Reference to last message
- `lastMessageAt` - Timestamp of last message
- `createdAt`, `updatedAt` - Timestamps

### Message Model

- `chat` - Reference to Chat
- `sender` - Reference to User who sent the message
- `text` - Message content
- `createdAt`, `updatedAt` - Timestamps

## Performance Considerations

- Message queries indexed by chat and creation time
- WebSocket rooms to isolate chat broadcasts
- JWT token verification for Socket.io connections
- Efficient user presence tracking with Map data structure

## Troubleshooting

### Connection Issues

- Ensure backend server is running
- Check Socket.io connection address
- Verify CORS configuration

### Build Issues

- Clear `node_modules` and reinstall: `bun install`
- Clear Bun cache: `bun cache clean`
- Ensure Bun is up to date: `bun upgrade`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly across all platforms
4. Submit a pull request

## Author

Created as a full-stack interview project demonstrating proficiency in:

- Backend API development (Node.js/Express)
- Real-time communication (Socket.io)
- Mobile development (React Native)
- Web development (React)
- TypeScript and modern tooling

## License

MIT License - feel free to use this project for learning and development purposes.

---

**Ready to run on Web, Mobile (iOS/Android), and deployed via Docker!**
