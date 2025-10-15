import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    type: { type: String, required: true },
    roomId: { type: String, required: true },
});
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;