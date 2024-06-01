const Attempts = require('../models/attempts');

const attemptedTest = (req,res) =>{
    const {email,testCode} = req.query;
    Attempts.find({email,test_code: testCode}, (err,result) =>{
        if(err){
            console.log("error finding attempt",err);
            return res.status(404).json({err});
        }else{
            return res.status(200).json(result);
        }
    })
}

const addAttempt = (req,res) => {
    const email = req.query.email;
    const testCode = req.query.testCode;
    const attempt = new Attempts({
        email,
        test_code: testCode
    })

    attempt.save((err,data) => {
        if(err){
            return res.status(401).json({msg:"Error adding attempt"});
        }else{
            return res.status(200).json({attempt:data});
        }
    })

}

module.exports = {
    attemptedTest,
    addAttempt
}