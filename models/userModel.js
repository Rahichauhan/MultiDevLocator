const mongoose=require("mongoose");

const devices=new mongoose.Schema({
    deviceName:{
        type:String,
        
    },
    deviceID:{
        type:String,
        
    },
});
const userSchema= new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
mobileNo:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
devices:[devices],

is_Admin:{
    type:Number,

 },
 is_verified:{
    type:Number,
    default:0
 },

token:{
    type:String,
    default:''
 },
 

});
module.exports= mongoose.model("AntiLGF",userSchema);