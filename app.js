const express = require("express");
const app = express();

app.set("view engine" , "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

const authRouter = require("./routers/authRouter");

app.use("/" , authRouter );

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