import express from 'express';
import usersRouter from './router/user.router.js';

const app = express();

app.use(express.json());

// ✅ CORRECTION ICI
app.use('/api/users', usersRouter);

// test route
app.get('/', (req, res) => {
    res.send("API working 🚀");
});

export default app;