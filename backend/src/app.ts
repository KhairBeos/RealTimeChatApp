import express from 'express';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message : 'Server is running' });
});


app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/chats", chatRoutes);


export default app;