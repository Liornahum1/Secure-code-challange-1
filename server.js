const express = require('express');
const bodyParser = require('body-parser');
const crypt = require("crypto");
let jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const TOKEN = crypt.randomBytes(128).toString('hex');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let users = {administrator:{username:"administrator",password:crypt.randomBytes(20).toString(),role:"admin"},
    user:{username:"user",password:"user",role:"user"}}; //Object to simulate database with users.


app.get("/",(req,res) =>{
    if(req.cookies.access_token){
        try{
            let jwt_token = req.cookies.access_token;
            let decoded_token = jwt.decode(jwt_token,{complete: true})
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

app.post("/login", (req,res) => {
    let user = req.body.username;
    let pass = req.body.password
    if(user == users[user]['username'] && pass == users[user]['password']){
        let json_token = jwt.sign({username:user},TOKEN,{ expiresIn : '1800s' ,algorithm : "HS256"});
        res.cookie('access_token', json_token);
        return res.redirect("/")
    }
});

app.get("/logout",(req,res)=> {
    res.clearCookie("access_token")
});

app.listen(3000,()=>{
    console.log("Listening on port 3000")
})