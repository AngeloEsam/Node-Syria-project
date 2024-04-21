const listModel = require('../models/listModel');
const dataModel = require('../models/dataModel');
const userModel = require('../models/userModel');
const mongoose = require('mongoose');

const getAllLists = async (req, res) => {
  try {
    let lists = await listModel.find().sort({createdAt:-1});
    res.status(201).json({
      message: 'Successfully fetched all the lists',
      data: lists,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAllListsUserView = async (req, res) => {
  try {
    let lists = await listModel.find({ isAccepted: true }).sort({createdAt:-1});
    res.status(201).json({
      message: 'Successfully fetched all the lists',
      data: lists,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteList = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await listModel.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json('Id Not Found');
    }
    res.status(200).json('list Deleted Successfully');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const getSingleList = async (req, res) => {
  try {
    const { id } = req.params;
    const singleMassacres = await listModel.findById(id).populate('user');
    res.json(singleMassacres);
  } catch (error) {
    res.status(400).json({ error: 'Error in Fetching Data' });
  }
};
const searchByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const found = await listModel.find({
      category: category,
    });
    res.json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const {name, content, governorate, externalLinks } = req.body;
    let selfImg = '';
    if (req.file !== undefined) {
      selfImg = req.file.filename; 
    } else {
      const existingUser = await listModel.findById(id);
      if (existingUser) {
        selfImg = existingUser.selfImg; 
      }
    }
   
    const updateList = await listModel.findByIdAndUpdate(
      id,
      {
        selfImg,
        content,
        governorate,
        name,
        externalLinks,
      },
      { new: true }
    );

    if (!updateList) {
      res.status(404).json('No list with this Id found.');
    }
    res.status(200).json({ data: updateList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const addNewList = async (req, res) => {
  try {
    const { userId } = req.params;
    const selfImg = req.file.filename;
    const { externalLinks, content, governorate, name, category,isAccepted } = req.body;
    const user = await userModel.findById(userId);
    const addNewList = await listModel
      .create({
        externalLinks,
        content,
        governorate,
        name,
        category,
        isAccepted: user.role === 'admin' || user.role==='supervisor', 
        selfImg,
        user: userId,
      })
      // .populate('lists');
    if (!addNewList) {
      return res.status(400).json({ error: 'Failed to add the list' });
    }
    //const data = await dataModel.findById(dataId);
    const updateData = await userModel
      .findByIdAndUpdate(
        userId,
        { lists: [...user.lists, addNewList] },
        { new: true }
      )
      .populate('lists');
  
   
    res.status(200).json(updateData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptDataList = async (req, res) => {
  try {
    const { listId } = req.params;

    const acceptedList = await listModel.findByIdAndUpdate(
      listId,
      {
        isAccepted: true,
        notification:"تم قبول منشورك بنجاح"
      },
      { new: true }
    );

    if (!acceptedList) {
      return res.status(400).json({ error: 'Failed to update the data' });
    }
    res
      .status(200)
      .json({ success: 'data updated successfully', data: acceptedList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllLists,
  deleteList,
  getSingleList,
  searchByCategory,
  updateList,
  addNewList,
  acceptDataList,
  getAllListsUserView,
};
