import dotenv from 'dotenv'
import connectBD from './config/database.js'
import app from './app.js';

dotenv.config({
    path: './.env'
})

const startServer = async () => {
    try {
        await connectBD();

        app.on('error', (error) => {
            console.error('ERROR', error);
            throw error;
        });
        app.listen(process.env.PORT || 8000);
        console.log(`server running on port: ${process.env.PORT || 8000}`);
    } catch (error) {
        console.error('Failed to start server', error);
    }
}

startServer();