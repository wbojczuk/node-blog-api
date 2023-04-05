const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const path = require("path");
const session = require("express-session");
const passport = require("passport");

app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: true,
  }));

const whitelist = ["***** PUT WHITELISTED DOMAINS HERE *****"];
const corsOptions = {
    origin: (origin, callback)=>{
        if(whitelist.includes(origin) || !origin){
            callback(null, true);
        }else{
            callback(new Error("CORS Not Supported"));
        }
    }
};

app.use(cors(corsOptions))

app.use(express.json());
app.use(express.urlencoded({extended: false}));

  
app.use(passport.authenticate('session'));

app.use("/login", require("./auth/login.js"));
app.use("/dashboard", require("./secure/dashboard.js"))
app.use("/api", require("./api/api.js"));

// SERVING THE STATIC ADMIN PANEL
app.use(express.static("public"));
app.use("/tinyEditor", express.static("public/tinymce"));
app.use(express.static("secure"));



app.listen(PORT);