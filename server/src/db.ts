import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error('Missing MONGO_URI in environment variables');
        process.exit(1);
    }

    const dbName = process.env.DB_NAME || 'recipe_app';

    try {
        await mongoose.connect(mongoUri, {
            dbName
        });

        console.log(`Connected to MongoDB (db: ${dbName})`);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}
