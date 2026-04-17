import express, { json } from "express";
import "dotenv/config";
import cors from "cors";
import mongoose, { connect } from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({
  origin: "https://chic-bubblegum-8d6e99.netlify.app", // Aapka Netlify URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use("/api", chatRoutes)
app.use("/api/auth", authRoutes)

const connectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected with DataBase!")
  }catch(err){
    console.log("Failed to connect with Db", err)
  }
};

// app.post("/test", async(req,res)=>{

//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: "llama-3.1-8b-instant",
//       messages: [{
//         role: "user",
//         content: req.body.message
//       }]
//     })
//   }

//   try{
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options)
//     const data = await response.json();
//     console.log(data.choices[0].message.content)
//     res.send(data);
//   }catch(err){
//     console.log(err)
//   }
// });

app.listen(PORT, ()=>{
  console.log(`server running on ${PORT}`)
  connectDB();
});