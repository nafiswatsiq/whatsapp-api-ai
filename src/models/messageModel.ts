import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  recipient: string;
  message: string;
  timestamp: Date;
}

const messageSchema = new Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true }
})

export const messageModel = mongoose.model<IMessage>('Message', messageSchema)