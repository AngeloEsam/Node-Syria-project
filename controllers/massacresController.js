const dataModel = require('../models/dataModel');
const massacresModel = require('../models/massacresModel');
const userModel = require('../models/userModel');
const getAllMassacres = async (req, res) => {
  try {
    let massacres = await massacresModel.find().sort({createdAt:-1});
    res.status(201).json({
      message: 'Successfully fetched all the massacres',
      massacres,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllMassacresUserView = async (req, res) => {
  try {
    let massacres = await massacresModel.find({ isAccepted: true }).sort({createdAt:-1});
    res.status(201).json({
      message: 'Successfully fetched all the massacres',
      data: massacres,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/*
const addMassacres = async (req, res) => {
  try {
    const { userId } = req.params;
    // const documents = req.files.map((file) => file.filename);
    const files = req.files;
   // const documents = files['documents'].map((file) => file.filename);

   const documents = files['documents'].map((file) => file.filename);
   const profileImage = files['profileImage'][0].filename
   
    const { title, responsibleAuthority, governorate, details } = req.body;

    const user = await userModel.findById(userId);
    if (user ) {
      const addNewMassacres = await massacresModel.create({
        documents,
        title,
        responsibleAuthority,
        governorate,
        details,
        profileImage
      });
      if (!addNewMassacres) {
        return res.status(400).json({ error: 'Failed to add the massacres' });
      }

      const updateData = await userModel
        .findByIdAndUpdate(
          userId,
          { massacres: [...user.massacres, addNewMassacres] },
          { new: true }
        )
        .populate('massacres');
      res.status(200).json(updateData);
    } else {
      res.status(400).json({ message: 'user or data not found in database' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/
//////////////
const addMassacres = async (req, res) => {
  try {
    const { userId } = req.params;
    const files = req.files;
    const documents = files['documents'].map((file) => file.filename);
   
      const profileImage = files['profileImage'][0].filename;
    const {
      title, responsibleAuthority, governorate, details ,isAccepted
      
    } = req.body;
    const user = await userModel.findById(userId);
    console.log(user)
   
    const addNewMassacres = await massacresModel.create({
      documents,
      title,
      responsibleAuthority,
      governorate,
      details,
      profileImage,
      user:userId,
      isAccepted: user.role === 'admin' || user.role==='supervisor', 
    });
    if (!addNewMassacres) {
      return res.status(400).json({ error: 'Failed to add the data' });
    }
  
    //const data = await dataModel.findById(dataId).populate('childData');
    const updateData = await userModel
      .findByIdAndUpdate(
        userId,
        { massacres: [...user.massacres, addNewMassacres] },
        { new: true }
      ).populate('massacres')
      
  

    res.status(200).json(updateData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/////////////
/*
const deleteMassacres = async (req, res) => {
  const { id, userId } = req.params;
  try {
    const data = await massacresModel.findByIdAndDelete(id);
    console.log(data)
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    const user = await userModel.find(userId);
    console.log(user)
    if (!user || !user.data) {
      return res.status(404).json('User or User Data Not Found');
    }
    
    const filterUserData = user.data.map((data) =>
      data.massacres.filter((id) => id != data._id)
    );
    console.log(filterUserData)
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        data: [...user.data.massacres, filterUserData],
      },
      { new: true }
    );

    res.status(200).json('massacres Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
*/
const deleteMassacres = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await massacresModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    res.status(200).json('massacres Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const getSingleMassacres = async (req, res) => {
  try {
    const { id } = req.params;
    const singleMassacres = await massacresModel.findById(id).populate('user');
    res.json(singleMassacres);
  } catch (error) {

    res.status(400).json({ error: 'Error in Fetching Data' });
  }
};
const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    console.log(req.query)
    const found = await massacresModel.find({
      title: title,
    });
    res.json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMassacres = async (req, res) => {
  try {
    const { id } = req.params;
    const { responsibleAuthority, governorate, title, details } = req.body;
    let profileImage = '';
    if (req.file !== undefined) {
      profileImage = req.file.filename; 
      
    } else {
      const existingMassacres = await massacresModel.findById(id);
      if (existingMassacres) {
        profileImage = existingMassacres.profileImage; 
        
      }
    }
    const updateMassacres = await massacresModel.findByIdAndUpdate(
      id,
      {
        profileImage,
        responsibleAuthority,
        governorate,
        title,
        details
      },
      { new: true }
    );

    if (!updateMassacres) {
      res.status(404).json('No Massacres with this Id found.');
    }
    res.status(200).json({ data: updateMassacres });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const acceptMassacresData = async (req, res) => {
  try {
    const { masId } = req.params;

    const acceptedMas = await massacresModel.findByIdAndUpdate(
      masId,
      {
        isAccepted: true,
        notification:"تم قبول منشورك بنجاح"
      },
      { new: true }
    );

    if (!acceptedMas) {
      return res.status(400).json({ error: 'Failed to update the data' });
    }
    res
      .status(200)
      .json({ success: 'data updated successfully', data: acceptedMas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMassacres,
  addMassacres,
  deleteMassacres,
  getSingleMassacres,
  searchByTitle,
  updateMassacres,
  getAllMassacresUserView,
  acceptMassacresData,
};
