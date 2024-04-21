const express = require('express');
const multer=require('multer');
const path=require("path");
const {auth, restrictTo}=require('../middlewares/auth')
const {getAllPosts,addPost,updatePost,deletePost,getSinglePost,searchByIdOrCategory}=require("../controllers/postsController");
//upload image
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../postImages'))
    },
    filename: function (req, file, cb) {
      cb(null,new Date().toISOString().replace(/:/g,'-')+file.originalname) 
    }    
})
const upload=multer({storage:storage})
const router = express.Router();
//search BY category OR ID
router.get('/search',searchByIdOrCategory);
//get All Users
router.get('/', getAllPosts)
//add new post
router.post('/:id',auth,restrictTo('admin', 'supervisor'),upload.single('photo'),addPost)
//update post
router.patch('/:id',auth,restrictTo('admin', 'supervisor'),upload.single('photo'),updatePost)
//get single post
router.get("/:id",getSinglePost)
//delete post
router.delete('/:id',auth,restrictTo('admin', 'supervisor'),deletePost)
module.exports=router