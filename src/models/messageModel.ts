import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  remoteJid: string;
  sender: string;
  senderName: string;
  recipient: string;
  message: string;
  isGroup: boolean;
  timestamp: Date;
}

const messageSchema = new Schema({
  remoteJid: { type: String, required: true },
  sender: { type: String, required: true },
  senderName: { type: String, required: true },
  recipient: { type: String, required: true },
  message: { type: String, required: true },
  isGroup: { type: Boolean, required: true },
  timestamp: { type: Date, required: true }
})

export const messageModel = mongoose.model<IMessage>('Message', messageSchema)