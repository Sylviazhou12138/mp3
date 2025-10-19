import userRoutes from './routes/users.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import taskRoutes from './routes/tasks.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Llama.io API is running 🦙',
    data: null
  });
});

const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
});