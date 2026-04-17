
import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import authMiddleware from "../middleware/auth.js";
import { generateTitle } from "../utils/openai.js";

const router = express.Router();

//test
router.post("/test", async(req,res)=>{
    try{
        const thread = new Thread({
            threadId: "xyz",
            title: "Testing New Thread"
        })

        const response = await thread.save();
        res.send(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to save in Db"})
    }
});

// Get all threads:
router.get("/thread", authMiddleware, async(req,res) =>{
    try{
        const threads = await Thread.find({}).sort({updatedAt: -1});
        // descending order of updatedAt...most recent data on top
        res.json(threads)
    }catch(err){
        console.log(err);
    res.status(500).json({error: "Failed to fetch  thread"})
    }
});

router.get("/thread/:threadId", authMiddleware, async(req,res) =>{
    const {threadId} = req.params;

    try{
        const thread = await Thread.findOne({threadId});

        if(!thread){
            res.status(404).json({error: "Thread not found"})
        }

        res.json(thread.messages)
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"})
    }
});

// delet route
router.delete("/thread/:threadId", authMiddleware, async(req,res) =>{
    const {threadId} = req.params;

    try{
        const deletThread = await Thread.findOneAndDelete(threadId);

        if(!deletThread){
            res.status(404).json({error: "Failed to fetch chat"});
        }
        res.status(200).json({success: "Thread deleted successfull"})
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"})
    }
});

router.post("/chat", authMiddleware, async(req,res) =>{
    const {threadId, message} = req.body;

    if(!threadId || !message){
        res.status(400).json({error: "missing required fields"});
    }

    try{
        let thread = await Thread.findOne({threadId});

        if(!thread){
    const title = await generateTitle(message);
    thread = new Thread({
        threadId,
        title: title,  // pehle sirf message tha
        messages: [{role: "user", content: message}]
    });
}else{
            thread.messages.push({role: "user", content: message})
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({role: "assistant", content: assistantReply})
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: assistantReply})
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Something went wrong"})
    }
});

export default router;




