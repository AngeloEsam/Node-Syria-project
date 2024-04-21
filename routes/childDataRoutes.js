const express = require('express');
const multer = require('multer');
const path = require('path');
const {auth, restrictTo}=require('../middlewares/auth')
const {
  getAllChildData,
  addChildData,
  deleteChildData,
  acceptChildData,
  searchByCategory,
  updateChildData,
  getSingleChildData,
  getAllChildDataUserView,
} = require('../controllers/childDataContoller');
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
// update child data
router.patch('/:childId',auth, restrictTo('admin', 'supervisor'), acceptChildData);
// get all chid data
router.get('/', getAllChildData);
router.get('/userView', getAllChildDataUserView);
//add child data
//router.post('/:userId',auth, upload.array('documents'),addChildData);
router.post('/:userId',auth, upload.fields([{ name: 'documents', maxCount: 10 }, { name: 'profileImage', maxCount: 1 }]), addChildData);

//delete data
router.delete('/:id',auth, restrictTo('admin', 'supervisor'), deleteChildData);


router.patch(
  '/update/:childDataId',
  upload.single( 'profileImage' ),
  auth, restrictTo('admin', 'supervisor'),
  updateChildData
);


//get single child data
router.get('/:id', getSingleChildData);


module.exports = router;
