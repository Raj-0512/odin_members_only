const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const {pool} = require("./db");

passport.use(new LocalStrategy(
    async (username , password , done) => {
        try
        {
            const result = await pool.query(
                `select * from "user" 
                 where username = $1` , [username]
            );

            const user = result.rows[0];

            if(!user)
            {
                console.log("User does not exist")
                return done(null,false);
            }

            const match = await bcrypt.compare(password , user.password_hash);

            if(!match)
            {
                console.log("Password or username is incorrect");
                return done(null ,false);
            }

            console.log("Successful login");
            return done(null,user);
        }
        catch(err)
        {
            console.error(err);
            return done(err);
        }
    }
));

passport.serializeUser((user,done) =>{
    done(null,user.id);
});

passport.deserializeUser(async (id , done) => {
    try
    {
        const result = await pool.query(
            `select * from "user" where id = $1` , [id]
        );

        const user = result.rows[0];
        return done(null , user);
    }
    catch(err)
    {
        done(err);
    }
});

module.exports = passport;