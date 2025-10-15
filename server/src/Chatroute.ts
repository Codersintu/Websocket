import express from "express";
const router=express.Router();
import Chat from "./chatdb.js"
router.post("/create",async(req,res)=>{
    const {type,roomId}=req.body;
     try {
    // Check if room already exists
    const existingRoom = await Chat.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({ message: "Room already exists" });
    }

    // Create new room
    const newChat = new Chat({ type, roomId });
    await newChat.save();

    res.status(201).json({ message: "Room created successfully" });
  } catch (err) {
    console.error("Error creating chat room:", err);
    res.status(500).json({ message: "Internal server error" });
  }
})

export default router;