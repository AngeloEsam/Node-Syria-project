const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
   category:{type:String,required:true},
   description:{type:String,required:true},
   photo:{ type: String},
   user:{type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
   
});

const postModel = mongoose.model("Post", postSchema);
module.exports = postModel;
