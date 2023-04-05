const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req,res)=>{
    if(req.user){
        res.sendFile(path.join(__dirname, ".." , "/secure/dashboard/dashboard.html"));
    }else{
        res.redirect("/login");
    }
    
})
router.get("/blog_builder", (req,res)=>{
    if(req.user){
        res.sendFile(path.join(__dirname, ".." , "/secure/dashboard/blog_builder.html"));
    }else{
        res.redirect("/login");
    }
    
})
router.get("/blog_editor", (req,res)=>{
    if(req.user){
        res.sendFile(path.join(__dirname, ".." , "/secure/dashboard/blog_editor.html"));
    }else{
        res.redirect("/login");
    }
    
})

module.exports = router;