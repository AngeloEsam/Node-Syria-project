const express = require('express');
const multer=require('multer');
const path=require("path");
//const {auth}=require('../middlewares/auth')
const {getAllUsers,registerNewUser,loginUser,deleteUser,updateUser,searchByGovernment,
  forgetPassword,updatePassword,isAcceptedDoc,upToAdmin,
  upToSupervisor,downToUser,filterWithSub,filterWithAdmin,
  getAllUsersAndAdminAndSup,updateUserDocImg,getSingleUser}=require("../controllers/userController");
const { restrictTo, auth } = require('../middlewares/auth');
//upload image
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../images'))
    },
    filename: function (req, file, cb) {
      cb(null,new Date().toISOString().replace(/:/g,'-')+file.originalname) 
    }    
})
const upload=multer({storage:storage})
const router = express.Router();
// Login User
router.post( '/login', loginUser);
//register new User
//router.post("/register",upload.single('selfImg'), registerNewUser)
router.post("/register", upload.fields([{ name: 'selfImg', maxCount: 1 }, { name: 'docImg', maxCount: 1 }]), registerNewUser)
//up to admin
router.patch('/up/:userId',auth,restrictTo('admin'),upToAdmin)
//up to supervisor
router.patch('/upS/:userId',auth,restrictTo('admin'),upToSupervisor)
///down to user
router.patch('/down/:userId',auth,restrictTo('admin'),downToUser)

router.patch('/accept/:userId',auth,restrictTo('admin','supervisor'),isAcceptedDoc)
//get all supervisors
router.get('/supervisor',auth,restrictTo('admin'),filterWithSub)
//get all admins
router.get('/admin',auth,restrictTo('admin'),filterWithAdmin)
// forget password
router.post('/forgetPassword',forgetPassword)
//reset password
router.patch('/success/:id',updatePassword)
//get All Users
router.get('/',auth,restrictTo('admin','supervisor'), getAllUsers)
//get all users and admins and supervisors
router.get('/all', getAllUsersAndAdminAndSup)
//search by government
router.get('/search',auth, restrictTo('admin', 'supervisor'),searchByGovernment)
///update docImg user
router.patch("/doc/:id",auth, upload.single("image"), updateUserDocImg);
//router.post("/register",upload.fields([{name:'selfImg',maxCount:1},{name:'docImg',maxCount:1}]), registerNewUser)
//delete user
router.delete('/:id',auth,restrictTo('admin','supervisor'), deleteUser)
//update user
router.patch('/:id',auth, upload.single('photo'),updateUser)
// get single user
router.get('/single/:id',auth,getSingleUser )
module.exports=router