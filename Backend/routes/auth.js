import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// register.router:
router.post("/register", async(req,res) =>{
    try{

    const {name, email, password} = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser){
        res.status(404).json({error: "This email already existing"});
        return;
    };

     const hashedPassword = await bcrypt.hash(password, 10);

     const user = await User.create({
        name,
        email,
        password: hashedPassword
     });

     res.status(201).json({message: "user registered successfully"});

     }catch(error){
        res.status(500).json({ message: "Server error" });
     }
});

// login:
router.post("/login", async(req,res) =>{
    try{

    
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        res.status(404).json({message: "Invalid credentials"})
        return;
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        res.status(400).json({message: "Inavlid credentials"});
        return;
    };

    const token = jwt.sign(
        {userId: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );

    res.json({token, user: {id: user._id, name: user.name, email: user.email}})

}catch(error){
    res.status(500).json({ message: "Server error" });
}
});

export default router;