const express = require("express");
const bcrypt = require("bcryptjs");
const {pool} = require("../config/db");

const authRouter = express.Router();

authRouter.get("/" , (req,res)=>{
    res.render("login");

});

authRouter.get("/signup" , (req,res)=>{
    res.render("signup");
});

authRouter.post("/login" , (req,res)=>{
    const {username,password} = req.body;


    res.redirect("/")
})

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
module.exports = authRouter;