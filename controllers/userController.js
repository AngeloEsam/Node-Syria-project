const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({role:"user"}).sort({createdAt:-1}).populate(['posts','lists','massacres','child'])
    res.status(201).json({
      message: 'Successfully fetched all the users',
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllUsersAndAdminAndSup = async (req, res) => {
  try {
    const users = await userModel.find({}).sort({createdAt:-1}).populate(['posts','lists','massacres','child'])
    console.log(users.data);
    res.status(201).json({
      message: 'Successfully fetched all the users',
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*
const registerNewUser = async (req, res) => {
  try {
    let selfImg = '';
    //const docImg1 = req.files.docImg[0].filename;
    if (req.file != undefined) {
      selfImg = req.file.filename;
    }
    const { email, username, name, password, phone, government, key,role } =
      req.body;
    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
      return res.status(409).json('email already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await userModel.create({
      username,
      key,
      email,
      name,
      role,
      phone,
      government,
      selfImg,
      password: hashedPassword,
    });

    res.json(createUser);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
*/


const registerNewUser = async (req, res) => {
  try {
    const files = req.files;
    let selfImg='';
    let docImg='';
    
    if (files && files['selfImg'] && files['selfImg'][0]) {
      selfImg = files['selfImg'][0].filename;
    }

    if (files && files['docImg'] && files['docImg'][0]) {
      docImg = files['docImg'][0].filename;
    }

   
    const { email, username, name,role, password,isConfident, phone, government, key } =
      req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(409).json('email already exist');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await userModel.create({
      username,
      key,
      email,
      name,
      phone,
      government,
      isConfident,
      selfImg,
      role,
      docImg,
      password: hashedPassword,
    });

    res.json(createUser);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};














const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter email and password' });
  }
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ msg: 'invalid email' });
  }
  let isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ msg: 'Invalid Password' });
  }
  //Create JWT
  let token = jwt.sign(
    { data: { email: user.email, id: user._id, role: user.role } },
    process.env.SECRET_KEY
  );
  res.json({ message: 'success', token: token ,user:user});
};
const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await userModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    res.status(200).json('User Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


const updateUser = async (req, res) => {
  try {
    const {id} = req.params;
    let selfImg = '';
    // if (req.file != undefined) {
    //   selfImg = req.file.filename;
    // }
    if (req.file !== undefined) {
      selfImg = req.file.filename; 
    } else {
      const existingUser = await userModel.findById(id);
      if (existingUser) {
        selfImg = existingUser.selfImg; 
      }
    }
    const { name, phone, government,role } = req.body;
   
    const updateUser = await userModel.findByIdAndUpdate(
      id,
      {selfImg,name, phone, government,role },
      { new: true }
    );
    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
};


const updateUserDocImg = async (req, res) => {
  try {
    const {id} = req.params;
    let docImg = '';                  
    if (req.file != undefined) {
      docImg = req.file.filename;
    }
    //const { name, phone, government } = req.body;
  
    const updateUser = await userModel.findByIdAndUpdate(
      id,
      {docImg },
      { new: true }
    );
    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
};


const searchByGovernment = async (req, res) => {
  try {
    const { government } = req.query;
    const users = await userModel.find({ government: government });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email, key } = req.body;
  let user = await userModel.findOne({ email });
  if (user) {
    if (user.key == key) {
      //res.redirect(`/success/${user._id}`);
      res.json({ success: true, userId: user._id });
    } else {
      res.json({ message: 'key is wrong' });
    }
  } else {
    res.json({ message: 'email not found' });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.json(err);
  }
};

const isAcceptedDoc=async(req,res)=>{
  try {
    const {userId} = req.params;
   
    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      {  isConfident: true,notification:"تم توثيق حسابك" },
      { new: true }
    );
    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
}
const upToAdmin=async(req,res)=>{
  try {
    const {userId} = req.params;
    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { role:  "admin" , isConfident:true},

      { new: true }
    );
   
    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
}
const upToSupervisor=async(req,res)=>{
  try {
    const {userId} = req.params;
    
    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { role:  "supervisor",isConfident:true },
      { new: true }
    );

    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
}
const downToUser=async(req,res)=>{
  try {
    const {userId} = req.params;
    
    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { role:  "user"},
      { new: true }
    );

    if (!updateUser) {
      res.status(404).json('No user with this Id found.');
    }
    res.status(200).json({ user: updateUser });
  } catch (err) {
    res.status(500).json('Error updating the User');
  }
}
const filterWithSub=async(req,res)=>{
  try {
    const supervisors=await userModel.find({role:"supervisor"}).sort({createdAt:-1}).populate(['posts','lists','massacres','child'])
    
    res.status(201).json({
      message: 'Successfully fetched all the supervisors',
      data: supervisors,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
const filterWithAdmin=async(req,res)=>{
  try {
    const admins=await userModel.find({role:"admin"}).sort({createdAt:-1}).populate(['posts','lists','massacres','child'])
    
    res.status(201).json({
      message: 'Successfully fetched all the admins',
      data: admins,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const singleUser = await userModel.findById(id).populate(['posts','lists','massacres','child'])
  res.json(singleUser);
  } catch (error) {
    res.json({ message: error.message })
  }
};
module.exports = {
  getAllUsers,
  registerNewUser,
  loginUser,
  getSingleUser,
  deleteUser,
  updateUser,
  searchByGovernment,
  forgetPassword,
  updatePassword,
  isAcceptedDoc,
  upToAdmin,
  upToSupervisor,
  downToUser,
  filterWithSub,
  filterWithAdmin,
  getAllUsersAndAdminAndSup,
  updateUserDocImg
};
