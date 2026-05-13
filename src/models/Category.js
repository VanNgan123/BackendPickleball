
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name : {
        type: String ,
        required : true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    image: {
        type: String,
        default: null
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        default: null
    }
},{timestamps:true});

const Category = mongoose.model("Category",CategorySchema)
module.exports= Category;