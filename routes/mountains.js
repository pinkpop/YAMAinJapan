const express = require('express');
const router = express.Router();
const mountains = require('../controllers/mountains')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateMountain } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Mountain = require('../models/mountain');


router.route('/')
    .get(catchAsync(mountains.index))
    .post(isLoggedIn, upload.array('image'), validateMountain, catchAsync(mountains.createMountain))

//NEW
router.get('/new', isLoggedIn, mountains.renderNewForm)


//SHOW
router.route('/:id')
    .get(catchAsync(mountains.showMountain))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateMountain, catchAsync(mountains.updateMountain))
    .delete(isLoggedIn, isAuthor, catchAsync(mountains.deleteMountain));

//EDIT
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(mountains.renderEditForm))


module.exports = router;