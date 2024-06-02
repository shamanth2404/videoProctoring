const express = require('express');
const router = express.Router();
const {attemptedTest, addAttempt, deleteAttempt} = require('../controllers/attempt.control')

router.get('/attempted-test', attemptedTest); //To check if test is already attempted by the student
router.post('/add-attempt',addAttempt);
router.delete('/deleteattempt',deleteAttempt);

module.exports = router;