const express = require('express');
const { register, signIn, signOut, getUserDetails } = require('../controllers/user.control');
const router = express.Router();
const multer = require('multer')
const shortid = require('shortid')
const path = require('path');
const { requireSignIn } = require('../middlewares');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

router.post('/register',  register);
router.post('/signin', signIn);
router.post('/signout', requireSignIn, signOut);
router.get('/user-details/:email', getUserDetails); // Add this line


module.exports = router;