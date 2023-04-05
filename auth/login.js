const express = require("express");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const path = require("path");
const router = express.Router();
const bcrypt = require("bcryptjs");
const sessionStorage = require("sessionstorage-for-nodejs");

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});



passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});



  router.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname + "../.." + "/secure/login.html"))
  })

  router.get("/failedlogin", (req, res)=>{

    if(!isNaN(req.session.loginAttempts)){
      if(req.session.loginAttempts <= 5){
        req.session.loginAttempts += 1;
        req.session.lastFailedAttempt = new Date().getTime();
        req.session.save();
      }
    }else{
      req.session.loginAttempts = 0;
      req.session.lastFailedAttempt = new Date().getTime();
      req.session.save();
    }
    
    console.log(req.session.loginAttempts)
    res.redirect("/login")
  })

  router.get("/successlogin", (req,res)=>{
    console.log(req.session.loginAttempts)
    if(!isNaN(req.session.loginAttempts) && req.session.loginAttempts >= 5){
      if((new Date(req.session.lastFailedAttempt).getTime() + 60000) < new Date().getTime()){
        req.session.loginAttempts = 0;
        req.session.save();
        res.redirect("/dashboard")
      }else{
        req.logout((err)=>{
          if(err){console.log(err)}
          res.redirect("/login")
        })
      }
    }else{
      res.redirect("/dashboard")
    }
  })

  passport.use(new LocalStrategy(async function verify(username, password, cb) {
    if(isNaN(sessionStorage.getItem("loginAttempts"))){
      sessionStorage.setItem("loginAttempts", 0);
      sessionStorage.setItem("lastLoginAttempt", 0);
    }

    const loginAttempts = parseInt(sessionStorage.getItem("loginAttempts"));
    const lastLoginAttempt = parseInt(sessionStorage.getItem("lastLoginAttempt"));
    
    if((loginAttempts < 5 || (new Date()).getTime() > lastLoginAttempt + 1000)){

/*

  HASH USERNAME AND PASSWORD HERE
  bcrypt.hash("DATA", 10).then((data)=>{console.log(data)})

*/

    const isPasswordCorrect = await bcrypt.compare(password, "***** HASHED PASSWORD HERE *****");
    if(isPasswordCorrect){
        const isUsernameCorrect = await bcrypt.compare(username.trim().toLowerCase(), "***** HASHED USERNAME HERE *****");
        if(isUsernameCorrect){
          return cb(null, {username: username, password: password});
        }else{
            sessionStorage.setItem("loginAttempts", parseInt(sessionStorage.getItem("loginAttempts")) + 1)
            sessionStorage.setItem("lastLoginAttempt", (new Date()).getTime())
            return cb(null, false);
        }
    }else{
      sessionStorage.setItem("loginAttempts", parseInt(sessionStorage.getItem("loginAttempts")) + 1)
      sessionStorage.setItem("lastLoginAttempt", (new Date()).getTime())
      return cb(null, false);
    } 
  }else{
    return cb(null, false);
  }
      }));

  router.post('/password', passport.authenticate('local', {failureRedirect: "/login?failed=true", successRedirect: "/dashboard"}));
  module.exports = router;