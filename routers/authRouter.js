const express = require("express");
const bcrypt = require("bcryptjs");
const {pool} = require("../config/db");
const passport = require("../config/passport");

const authRouter = express.Router();

authRouter.get("/" , (req,res)=>{
    res.render("login");

});

authRouter.get("/signup" , (req,res)=>{
    res.render("signup");
});

authRouter.get("/index" , isAuth , async (req,res) =>{
    try
    {
        const results = await pool.query(
            `SELECT m.*, u.username
             FROM messages m
                      JOIN "user" u ON m.user_id = u.id`
        );
        const messages = results.rows;
        res.render("index" , {messages , isMember:req.user.is_member});
    }
    catch(err)
    {
        console.error(err);
        res.render("index" , {messages:[]})
    }


});

authRouter.post("/login" ,
    passport.authenticate("local" ,
        {
            successRedirect:"/index",
            failureRedirect:"/"
        })
);

authRouter.post("/signup" , async (req,res)=>{
    const {username,firstName,lastName,password,confirmPassword} = req.body;

    if(password !== confirmPassword)
    {
        return res.send("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(password,10);
    await createUser(firstName,lastName,username,hashedPassword);
    res.redirect("/");
});

async function createUser(firstName , lastName , username , hashedPassword)
{

    await pool.query(
        `insert into "user"(first_name,last_name,username,password_hash)
         values($1,$2,$3,$4)`,[firstName,lastName,username,hashedPassword]
    );
}

function isAuth(req , res , next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/");
}
module.exports = {authRouter , isAuth};