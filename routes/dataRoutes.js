const express = require('express');
const multer = require('multer');
const path = require('path');
const {auth, restrictTo}=require('../middlewares/auth')
const {
  getAllData,
  addData,
  deleteData,
  acceptData,
  getSingleData,
  updateData,
  searchByCategory,
} = require('../controllers/dataController');
//upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../imgData'));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();
//search by category
router.get('/search',auth, searchByCategory);
//get all data
router.get('/',auth, getAllData);
//add data
router.post('/:id',auth, addData);
//delete data
router.delete('/:id/:userId',auth, restrictTo('admin', 'supervisor'), deleteData);
router.patch('/:dataId', auth, restrictTo('admin', 'supervisor'), acceptData);
router.patch('/update/:dataId', upload.array('documents'),auth, restrictTo('admin', 'supervisor'), updateData);
router.get('/:id',auth, getSingleData);

module.exports = router;
