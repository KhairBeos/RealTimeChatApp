import mongoose, { Schema, type Document } from "mongoose";

export interface IChat extends Document {
    participants: mongoose.Types.ObjectId[]; // Array of User IDs
    lastMessage?: mongoose.Types.ObjectId; // Reference to the last message
    lastMessageAt?: Date; // Timestamp of the last message
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema: Schema = new Schema<IChat>({
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
    lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);