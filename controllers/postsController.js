
const postModel=require('../models/postsModel');
const userModel = require('../models/userModel');
const getAllPosts=async (req,res)=>{
    try{
        let posts = await postModel.find().sort({createdAt:-1});
        res.status(201).json({message:"Successfully fetched all the posts",data:posts});
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
const addPost = async (req, res) => {
    try {
      let photo='';
      const {id}=req.params
      if(req.file!=undefined){
        photo=req.file.filename;
      }
        const {category,description} = req.body;
        const addNewPost = await postModel.create({photo,category,description,user:id});
        const userr=await userModel.findById(id)
        if (!addNewPost) {
            return res.status(400).json({ error: 'Failed to add the post' });
        }
        const user=await userModel.findByIdAndUpdate(id,{posts:[...userr.posts,addNewPost]},{new:true}).populate('posts');

        res.status(200).json({ success: 'Post added successfully', data: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }
  const updatePost=async (req,res)=>{
    const id=req.params.id;
    let photo='';
    if(req.file!=undefined){
      photo=req.file.filename;
    }
    const {category,description}=req.body; 
    const updatePost=await postModel.findByIdAndUpdate(id,{category,description,photo},{new: true});
      if (!updatePost) {
        return res.status(404).json("No post with this Id found.");
      }
      res.status(200).json({user: updatePost});
    }  

    const deletePost = async (req, res) => {
      const id = req.params.id;
      try {
          const data = await postModel.findByIdAndDelete(id);
          if (!data) {
              return res.status(404).json('Id Not Found');
          }
          res.status(200).json('Post Deleted Successfully');
      } catch (error) {
          return res.status(500).json(error.message);
      }
  }
  const getSinglePost= async (req,res)=>{
    try {
      const {id} = req.params;
      const singlePost=await postModel.findById(id).populate('user');
      res.json(singlePost);
    } catch (error) {
      res.json({message:error.message})
    }
 }
 const searchByIdOrCategory=async (req, res) => {
  try {
    const {id}=req.query
    const {category}= req.query;
    const posts = await postModel.find({
      $or: [
        { category: category }, 
        { _id: id } 
      ]
    });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports={
    getAllPosts,
    addPost,
    updatePost,
    deletePost,
    getSinglePost,
    searchByIdOrCategory
}




