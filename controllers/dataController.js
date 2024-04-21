const dataModel = require('../models/dataModel');
const userModel = require('../models/userModel');
const getAllData = async (req, res) => {
  try {
    let data = await dataModel
      .find().sort({createdAt:-1})
      .populate(['massacres', 'childData', 'lists']);
    res
      .status(201)
      .json({ message: 'Successfully fetched all the data', data: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const userr = await userModel.findById(id);
    if (userr) {
      const addNewData = await dataModel.create({
        name,
      });
      if (!addNewData) {
        return res.status(400).json({ error: 'Failed to add the data' });
      }
      const user = await userModel
        .findByIdAndUpdate(
          id,
          { data: [...userr.data, addNewData] },
          { new: true }
        )
        .populate('data');
      res.status(200).json({ success: 'data added successfully', data: user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteData = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.params;
  try {
    const data = await dataModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    const user = await userModel.find(userId);
    const filterUserData = user.data.filter((id) => id != data._id);
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        data: [...user.data, filterUserData],
      },
      { new: true }
    );
    res.status(200).json('data Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const acceptData = async (req, res) => {
  try {
    const { dataId } = req.params;
    const addNewData = await dataModel
      .findByIdAndUpdate(dataId, { isAccepted: true }, { new: true })
      .populate('massacres');
    if (!addNewData) {
      return res.status(400).json({ error: 'Failed to update the data' });
    }
    res
      .status(200)
      .json({ success: 'data updated successfully', data: addNewData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getSingleData = async (req, res) => {
  const { id } = req.params;
  const singleData = await dataModel.findById(id).populate('massacres');
  res.json(singleData);
};
const updateData = async (req, res) => {
  try {
    const { dataId } = req.params;
    const {
      nickname,
      dateOfBirth,
      responsibleAuthority,
      governorate,
      fatherName,
      motherName,
    } = req.body;

    const documents = req.files.map((file) => file.filename);
    console.log(req.files);
    const currentDate = new Date();
    if (new Date(dateOfBirth) > currentDate) {
      return res.status(400).json('Date of birth cannot be in the future');
    }
    const updateData = await dataModel.findByIdAndUpdate(
      dataId,
      {
        documents,
        nickname,
        dateOfBirth,
        responsibleAuthority,
        governorate,
        fatherName,
        motherName,
      },
      { new: true }
    );

    if (!updateData) {
      res.status(404).json('No data with this Id found.');
    }
    res.status(200).json({ data: updateData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const found = await dataModel.find({
      category: category,
    });
    res.json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllData,
  addData,
  deleteData,
  acceptData,
  getSingleData,
  updateData,
  searchByCategory,
};
