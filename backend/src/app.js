
import express from 'express';
import cors from 'cors';
import usersRouter from './router/user.router.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:4200', // autorise ton frontend
  credentials: true,               // si tu veux envoyer cookies ou auth
}));

app.use(express.json());

// ✅ CORRECTION ICI
app.use('/api/users', usersRouter);

// test route
app.get('/', (req, res) => {
    res.send("API working 🚀");
});

export default app; 