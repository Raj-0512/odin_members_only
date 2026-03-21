const express = require("express");
const messageRouter = express.Router();
const {pool} = require("../config/db");
const {isAuth} = require("./authRouter");

messageRouter.get("/newMessage" , (req,res) => {
    res.render("newMessage");
})

messageRouter.post("/newMessage" , isAuth , async (req,res) =>{
    const {title , content} = req.body;

    try
    {
        await pool.query(
                `insert into messages(title,content,user_id)
                 values($1,$2,$3) ` , [title,content,req.user.id]
        );

        res.redirect("/index");
    }
    catch(err)
    {
        console.error(err);
        res.redirect("/newMessage")
    }
});


module.exports = messageRouter;