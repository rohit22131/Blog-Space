import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const Connection = async () => {
    const URL = process.env.MONGO_URI;
    try {
        await mongoose.connect(URL,
            { useNewUrlParser: true }
        )
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting to the database ', error);
    }
};

export default Connection;