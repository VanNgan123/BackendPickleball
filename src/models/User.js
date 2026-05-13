const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {type: String, required:true},
    email : {type: String,required : true},
    password :{type: String , required : true},
    phone:{type: String},
    avatar: {type: String, default: null},
    role: {type: String ,enum: ["customer","admin","manager","support"],default: "customer"},
    address:[{type : String}],
    isActive:{type:Boolean,default: true},
},{timestamps:true});

const User = mongoose.model("User",userSchema);
module.exports= User;
