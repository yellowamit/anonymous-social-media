//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser")
const ejs=require("ejs")
const mongoose = require ("mongoose");
const app=express();
mongoose.connect("mongodb://localhost:27017/socialDb");
const encript=require("mongoose-encryption");





app.use(express.static("public"))
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({
    extended:true 
}))


const userSchema= mongoose.Schema({email:String,password:String})
const secret="pepepupupepepupu";
userSchema.plugin(encript,{secret:secret,encryptedFields:['password']});
const User=new mongoose.model("User",userSchema)





app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.post("/register",async(req,res)=>{
    let email1=req.body.username;
       let password1=req.body.password;
    let user1=new User({
        email:email1,
        password:password1
    })
    try {
        const foundUser= await user1.save();
        console.log("save");
        res.render("secrets")
    } catch (error) {
        console.log("usernotfound")
    }
   
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.post("/login", async (req, res) => {
    let email1 = req.body.username;
    let password1 = req.body.password;

    try {
        // Use findOne to get a single matching document
        const foundUser = await User.find({ email: email1, password: password1 });
       console.log("1")
        if (foundUser) {
            // User exists, render secrets page
            console.log("2");
            res.render("secrets");
            console.log("3");
        } else {
            // No matching user found, handle the case
            console.log("4");
            console.log("Invalid credentials or user not found");
            res.redirect("/login"); // Redirect back to login
            console.log("5");
        }
    } catch (error) {
        console.error("Error during login:", error);
        console.log("6");
        res.redirect("/"); // Redirect to home or an error page
    }
});
















app.listen(3000,()=>{
    console.log("listenting at 3000")
}) 