import mongoose from "mongoose";

const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected'.bgMagenta.white);
    } catch (error) {
        console.log(`Error in MongoDB: ${error}`.bgRed.white);
        process.exit(1);
    }
}

export default connectDatabase