const express = require('express');
const bodyParser = require('body-parser');
const crypt = require("crypto");
let jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const TOKEN = crypt.randomBytes(128).toString('hex');
exports.TOKEN = TOKEN;

const app = express();
exports.app = app;

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Server error." });
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let users = {administrator:{username:"administrator",password:crypt.randomBytes(20).toString(),role:"admin"},
    user:{username:"user",password:"user",role:"user"}}; //Object to simulate database with users.
exports.users = users;


app.get("/",(req,res) =>{
    if(req.cookies.access_token){
        try{
            let jwt_token = req.cookies.access_token;
            let decoded_token = jwt.verify(jwt_token,TOKEN,{complete: true}); //Fix: verifying the token signature instead of simply decoding it
            if(decoded_token){
                let username = decoded_token.payload['username']
                res.send(`<h2>Your role is:${users[username]['role']}</h2><br><a href="/logout"><button>Logout</button></a>`);
            }else{
                res.redirect('/login');
            }  
        }catch{
            res.status(500).send("JWT not valid!")
        }
      
    }else{
        res.status(401).redirect('/login');
    }    
});


app.get("/login", (req,res) => {
    res.send('<form action="/login" method="post"><label for="username">username:</label><br><input type="text" name="username"><br><label for="password">password:</label><br><input type="text" name="password"><br><br><input type="submit" value="Submit"></form>');
});

app.get("/logout",(req,res)=> {
    res.clearCookie("access_token");
    res.send("Logged out");
});

app.listen(3000,()=>{
    console.log("Listening on port 3000")
})
