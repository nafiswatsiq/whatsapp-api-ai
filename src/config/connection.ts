import mongoose, { connect } from "mongoose";
import bluebird from "bluebird";

export const dbConnect = async (dbConnection: string | undefined) => {
  try {
    if (!dbConnection) {
      throw new Error("MongoDB connection string is not provided")
    }

    mongoose.Promise = bluebird

    await connect(dbConnection as string)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error)
  }
}

