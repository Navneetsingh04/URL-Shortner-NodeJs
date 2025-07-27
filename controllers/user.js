const User = require("../models/user")
const {v4 : uuidV4} = require("uuid")
const {setUser,getUser} = require("../service/auth")

async function handleuserSignUp(req,res) {
    const {name,email,password} = req.body;
    await User.create({
        name,email,password
    });
    return res.redirect("/")
}

async function handleuserLogin(req,res) {
    const {email,password} = req.body;
    const user = await User.findOne({email,password});
    // console.log("user",user)
    if(!user) {
        return res.render("login",{
            error : "Invalid username or Password",
        });
    }
    // const sessionId = uuidV4();
    // setUser(sessionId,user);
    const token = setUser(user)
    res.cookie('token', token,{
        maxAge: 1000 * 60 * 60 * 8, // 8 hours
        httpOnly: true, // Helps prevent XSS attacks
        sameSite: 'Strict' // Helps prevent CSRF attacks
    });
    return res.redirect("/");

}
module.exports = {handleuserSignUp,handleuserLogin}