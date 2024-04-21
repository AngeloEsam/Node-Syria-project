const chilDataModel = require('../models/childDataModel');
const dataModel = require('../models/dataModel');
const userModel = require('../models/userModel');
const getAllChildData = async (req, res) => {
  try {
    let childData = await chilDataModel.find().sort({createdAt:-1});
    res.status(201).json({
      message: 'Successfully fetched all the childData',
      data: childData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllChildDataUserView = async (req, res) => {
  try {
    let childData = await chilDataModel.find({ isAccepted: true }).sort({createdAt:-1});
    res.status(201).json({
      message: 'Successfully fetched all the childData',
      data: childData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addChildData = async (req, res) => {
  try {
    const { userId } = req.params;
    //const documents = req.files.map((file) => file.filename);
   // const profileImage = req.files.find(file => file.fieldname === 'profileImage').filename;
   const files = req.files;
   const documents = files['documents'].map((file) => file.filename);
   const profileImage = files['profileImage'][0].filename
   //const profileImage=req.file.filename;
   //const profileImage = files['profileImage'].map((file) => file.filename);

    console.log(documents);
    const {
      category,
      name,
      nickname,
      dateOfBirth,
      responsibleAuthority,
      governorate,
      fatherName,
      motherName,
      place,
      details,
      externalLinks,
      isAccepted
    } = req.body;
    const user = await userModel.findById(userId);
    console.log(user)
    const addNewChildData = await chilDataModel.create({
      documents,
      category,
      name,
      nickname,
      dateOfBirth,
      responsibleAuthority,
      governorate,
      fatherName,
      motherName,
      place,
      details,
      isAccepted: user.role === 'admin' || user.role==='supervisor' ,
      externalLinks,
      profileImage,
      user:userId
    });
    if (!addNewChildData) {
      return res.status(400).json({ error: 'Failed to add the data' });
    }
    //const data = await dataModel.findById(dataId).populate('childData');
    const updateData = await userModel
      .findByIdAndUpdate(
        userId,
        { child: [...user.child, addNewChildData] },
        { new: true }
      ).populate('child')
      
  

    res.status(200).json(updateData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteChildData = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await chilDataModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    res.status(200).json('childData Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const acceptChildData = async (req, res) => {
  try {
    const { childId } = req.params;

    const acceptedChild = await chilDataModel.findByIdAndUpdate(
      childId,
      {
        isAccepted: true,
        notification:"تم قبول منشورك بنجاح"
      },
      { new: true }
    );

    if (!acceptedChild) {
      return res.status(400).json({ error: 'Failed to update the data' });
    }
    res
      .status(200)
      .json({ success: 'data updated successfully', data: acceptedChild });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const found = await chilDataModel.find({
      category: category,
    });
    res.json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateChildData = async (req, res) => {
  try {
    const { childDataId } = req.params;
    const {
      nickname,
      dateOfBirth,
      responsibleAuthority,
      governorate,
      fatherName,
      motherName,
    } = req.body;
    let profileImage = '';
    //let documents = [];
   
    if (req.file !== undefined) {
      profileImage = req.file.filename; 
      
    } else {
      const existingchild = await chilDataModel.findById(childDataId);
      if (existingchild) {
        profileImage = existingchild.profileImage; 
        
      }
    }
    const currentDate = new Date();
    if (new Date(dateOfBirth) > currentDate) {
      return res.status(400).json('Date of birth cannot be in the future');
    }
    const updateChildData = await chilDataModel.findByIdAndUpdate(
      childDataId,
      {
       // documents,
        nickname,
        dateOfBirth,
        responsibleAuthority,
        governorate,
        fatherName,
        motherName,
        profileImage
      },
      { new: true }
    );

    if (!updateChildData) {
      res.status(404).json('No chid data with this Id found.');
    }
    res.status(200).json({ data: updateChildData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const getSingleChildData = async (req, res) => {
  try {
    const { id } = req.params;
    const singlechildData = await chilDataModel.findById(id).populate('user');
    //const user=await userModel.findById(userId);
    res.json({childData:singlechildData});
  } catch (error) {
    res.json({message:error.message})
  }
};
module.exports = {
  getAllChildData,
  addChildData,
  deleteChildData,
  acceptChildData,
  searchByCategory,
  updateChildData,
  getSingleChildData,
  getAllChildDataUserView,
  acceptChildData,
};
