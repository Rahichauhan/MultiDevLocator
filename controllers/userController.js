const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const config = require("../config/config");
const mongoose=require("mongoose");

const frontLoad=async(req,res)=>{
    try {
       res.render("front"); 
    } catch (error) {
       console.log(error.message); 
    }
}
const LoadRegister = async (req, res) => {
    try {
        res.render("registeration");
    } catch (error) {
        console.log(error.message);
    }
}

const securePassword = (password) => {
    try {
        const userPassword = bcrypt.hashSync(password);
        return userPassword;
    } catch (error) {
        console.log(error.message);
    }
}

const InsertUser = async (req, res) => {
    try {
        const { name, email, password, mobileNo, deviceName, deviceID } = req.body;
        const devices = [{ deviceID, deviceName }]


        const hashedPassword = securePassword(password);
        const user = new User({
            name,
            email,
            mobileNo,
            password: hashedPassword,
            devices,
            is_Admin: 0,
        });

        const userData = await user.save();
        if (userData) {
            sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render("registeration", { message: "Your registration has been successfully recorded,please verify your mail" })

        }
        else {
            res.render('registeration', { message: "Your registration has been failed" });
        }


    } catch (error) {
        console.log(error.message);

    }

};


const sendVerifyMail = async (name, email, user_id) => {
    try {


        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword,
            }
        });
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'for verification mail',
            html: '<p>Hii' + name + ',please click here to <a href="http://localhost:3000/verify?id=' + user_id + '">verify</a>your mail. </p>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been sent :-", info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}


const verifyMail = async (req, res) => {
    try {
        const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });
        res.render("emailVerified");
    } catch (error) {
        console.log(error.message);
    }
}



const LoadLogin = async (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password;
        //match email
        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_verified === 0) {
                    res.render('login', { message: "Please verify your mail" });

                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }

            } else {
                res.render('login', { message: "Email and login are incorrect" });
            }
        }
        else {
            res.render('login', { message: "Email and login are incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
}


const loadHome = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render("home", { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}

const loadMap=async(req,res)=>{
    try {
       res.render("map"); 
    } catch (error) {
      console.log("error.message");  
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
}

const loadEdit = async (req, res) => {
    try { 
        res.render('edit',);
    
    } catch (error) {
      console.log(error.message);
    }
  };
  



const updateProfile = async (req, res) => {
    try {
      const { email, deviceID, deviceName } = req.body;
      // Check if email, deviceID, and deviceName are provided
      if (!email || !deviceID || !deviceName) {
        return res.status(400).json({ Message: 'Email, deviceID, and deviceName are required.' });
      }
  
      // Find the user by email
      const devices = [{deviceID, deviceName}];
      const userData = await User.findOneAndUpdate({ email : email },{$addToSet:{devices}},{new:true});
  
      if (!userData) {
        throw new Error('User not found.');
      }
  
      // Update the devices
     
      await userData.save();
  
      console.log('New device added:', { deviceID, deviceName }); // Debugging statement
      res.redirect('/home');
    } catch (error) {
      console.error(error);
      res.status(500).json({ Message: 'An error occurred.' });
    }
  };
  



module.exports = {
    frontLoad,
    LoadRegister,
    InsertUser,
    verifyMail,
    LoadLogin,
    verifyLogin,
    loadHome,
    userLogout,
    loadEdit,
    updateProfile,
    loadMap

}