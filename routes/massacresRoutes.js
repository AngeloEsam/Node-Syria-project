const express = require('express');
const multer = require('multer');
const path = require('path');
const {auth, restrictTo}=require('../middlewares/auth')
const {
  getAllMassacres,
  addMassacres,
  deleteMassacres,
  getSingleMassacres,
  searchByTitle,
  updateMassacres,
  acceptMassacresData,
  getAllMassacresUserView,
} = require('../controllers/massacresController');
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
//search by title
router.get('/search',auth, searchByTitle);
// accept massacers data
router.patch('/accept/:masId',auth, restrictTo('admin', 'supervisor'), acceptMassacresData);

// get all massacres
router.get('/', getAllMassacres);
router.get('/userView', getAllMassacresUserView);
// add massacres
//router.post('/:userId',auth, upload.array('documents'), addMassacres);
router.post('/:userId',auth,restrictTo('admin', 'supervisor'), upload.fields([{ name: 'documents', maxCount: 10 }, { name: 'profileImage', maxCount: 1 }]), addMassacres);

//delete massacres
router.delete('/:id',auth,restrictTo('admin', 'supervisor'), deleteMassacres);
//get single massacres
router.get('/:id', getSingleMassacres);
//update Massacres
router.patch('/update/:id',
upload.single( 'profileImage' ),
auth, restrictTo('admin', 'supervisor'),
 updateMassacres);
module.exports = router;
