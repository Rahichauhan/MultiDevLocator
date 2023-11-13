
const express=require("express");
const routes=express();
const user=require("../controllers/userController");
const session=require("express-session");
const config=require("../config/config");
routes.use(session({secret:config.sessionsecret,resave: true, saveUninitialized: true}));
const auth=require("../middleware/auth");
routes.set('view engine','ejs');
routes.set('views','./views/users');
const bodyParser=require("body-parser");
routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({extended:true}));
const path=require("path");
//for images
routes.use(express.static('public'));



routes.get("/",user.frontLoad);
routes.get("/registeration",auth.isLogout,user.LoadRegister);
routes.post("/registeration",user.InsertUser);
routes.get("/verify",user.verifyMail);
// routes.get("/",auth.isLogout,user.LoadLogin);
routes.get("/login",auth.isLogout,user.LoadLogin);
routes.post("/login",user.verifyLogin);
routes.get("/home",auth.isLogin,user.loadHome);
routes.get("/map",user.loadMap);
routes.get("/logout",auth.isLogin,user.userLogout);
routes.get("/edit",auth.isLogin,user.loadEdit);
routes.post("/edit",user.updateProfile);
module.exports=routes;
