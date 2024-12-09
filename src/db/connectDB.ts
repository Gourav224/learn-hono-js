import mongoose from "mongoose";

export default async function dbConnect() {
	try {
		await mongoose.connect(process.env.MONGO_URI!);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log(error);
		throw new Error("Failed to connect to MongoDB");
	}
}
