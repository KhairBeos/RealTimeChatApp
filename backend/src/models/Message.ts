import mongoose, { Schema, type Document } from "mongoose";

export interface IMessage extends Document {
  chat: mongoose.Types.ObjectId; // Reference to the Chat
  sender: mongoose.Types.ObjectId; // Reference to the User
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema<IMessage>({
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
}, { timestamps: true });

MessageSchema.index({ chat: 1, createdAt: 1 }); // Index to optimize queries by chat and creation time

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
