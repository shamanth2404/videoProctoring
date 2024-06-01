const express = require('express');
const router = express.Router();
const {attemptedTest, addAttempt} = require('../controllers/attempt.control')

router.get('/attempted-test', attemptedTest); //To check if test is already attempted by the student
router.post('/add-attempt',addAttempt);

module.exports = router;