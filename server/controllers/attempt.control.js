const Attempts = require('../models/attempts');

const attemptedTest = async (req, res) => {
    const { email, testCode } = req.query;

    try {
        const result = await Attempts.find({ email, 'tests.testCode': testCode }).exec();
        return res.status(200).json(result);
    } catch (err) {
        console.error("Error finding attempt:", err);
        return res.status(404).json({ err });
    }
};


const addAttempt = async (req,res) => {
    const email = req.query.email;
    const testCode = req.query.testCode;
    try {
        const result = await Attempts.updateOne(
            { email: email },
            { $push: { tests: { testCode: testCode } } },
            { upsert: true } // This will create a new document if the email doesn't exist
        );
        console.log('Update result:', result);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error updating document:', error);
        res.json(error);
    }

}

const deleteAttempt = async () => {
    try {
        const result = await Attempts.deleteMany({});
        console.log('All documents deleted:', result);
    } catch (error) {
        console.error('Error deleting documents:', error);
    }
};

module.exports = {
    attemptedTest,
    addAttempt,
    deleteAttempt
}