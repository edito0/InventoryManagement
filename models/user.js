const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },    
    image:{
        type:String,
        default:""
    },
    token:{
        type:String
    }

})

mongoose.model("User",userSchema)