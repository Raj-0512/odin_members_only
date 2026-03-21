const express = require("express");
const app = express();
const passport = require("./config/passport");
const session = require("express-session");

app.set("view engine" , "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

const {authRouter} = require("./routers/authRouter");
const messageRouter = require("./routers/messageRouter");

app.use(session(
    {
        secret:"secret",
        resave:false,
        saveUninitialized: false,
        cookie:
            {
                maxAge: 1000 * 60 * 60
            }
    }
));

app.use(passport.initialize());
app.use(passport.session(undefined));

app.use("/" , authRouter );
app.use("/" , messageRouter);

app.listen(3000 , (err)=>{
    if(err)
    {
        console.error(err);
    }
    else
    {
        console.log("Server is running on port 3000");
    }
})