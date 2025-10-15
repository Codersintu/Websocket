import express from "express";
import mongoose from "mongoose";
import chatroute from "./Chatroute.js"
import cors from "cors";
const app=express();
app.use(cors());
app.use(express.json());
mongoose.connect("MONGO_URL=mongodb+srv://codewithbihari:codebihari9199@cluster0.vrkl8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log("error connecting to db",err)
})
const PORT=5000;
app.use("/chat",chatroute);
app.listen(PORT,()=>{
    console.log("server started at port "+PORT)
})