import mongoose from 'mongoose';

const connectBD = async () => {
    try {
        const connectInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected: ${connectInstance.connection.name}`);
    } catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1);
    }
}

export default connectBD;