import mongoose, { connect } from "mongoose";
import bluebird from "bluebird";
import logger from "../utils/logger";

export const dbConnect = async (dbConnection: string | undefined) => {
  try {
    if (!dbConnection) {
      throw new Error("MongoDB connection string is not provided")
    }

    mongoose.Promise = bluebird

    await connect(dbConnection as string)
    logger.info("Connected to MongoDB")
  } catch (error) {
    logger.error("Error connecting to MongoDB: ", error)
  }
}

