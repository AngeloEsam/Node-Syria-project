const express = require('express');
const multer = require('multer');
const path = require('path');
const {auth, restrictTo}=require('../middlewares/auth')
const {
  getAllLists,
  deleteList,
  getSingleList,
  searchByCategory,
  updateList,
  addNewList,
  acceptDataList,
  getAllListsUserView,
} = require('../controllers/listController');
//upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../postImages'));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();
// search by category
router.patch('/accept/:listId',auth, restrictTo('admin', 'supervisor'), acceptDataList);
router.get('/search',auth, searchByCategory);
// get all lists
router.get('/', getAllLists);
router.get('/userView', getAllListsUserView);
// add new list
router.post('/:userId',auth, restrictTo('admin', 'supervisor'), upload.single('selfImg'), addNewList);
//delete list
router.delete('/:id', auth, restrictTo('admin', 'supervisor'), deleteList);
//get single list
router.get('/:id', getSingleList);
// update list
router.patch('/:id',auth, restrictTo('admin', 'supervisor'),upload.single("image"), updateList);
module.exports = router;
