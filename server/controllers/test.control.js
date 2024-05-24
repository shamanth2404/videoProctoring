const Test = require('../models/test');
const User = require('../models/user');
const shortid = require('shortid');

const createTest = (req, res) => {
    const { email, organizationName, testName, testLink, startTime, duration, totalCandidates } = req.body;

    const end_time = new Date(startTime);
    end_time.setMinutes(end_time.getMinutes() + parseInt(duration));

    const test = new Test({
        userId: req.user.id,
        email: email,
        test_name: testName,
        test_link_by_user: testLink,
        test_code: shortid.generate() + "-" + shortid.generate(),
        start_time: new Date(startTime),
        end_time: end_time,
        no_of_candidates_appear: totalCandidates,
        total_threshold_warnings: 3
    });

    test.save((error, data) => {
        if (error) {
            if (error.code === 11000) {
                // Duplicate key error
                return res.status(400).json({ msg: "A test with this link already exists", error });
            }
            return res.status(400).json({ msg: "Something happened while creating new test", error });
        }
        if (data) {
            return res.status(201).json({ msg: "Successfully created new Test on platform" });
        }
    });
};

const userCreatedTests = (req, res) => {
    const userId = req.user.id;
    if (userId) {
        Test.find({ userId: userId })
            .exec((error, _allTests) => {
                if (error) return res.status(400).json({ msg: "Something went wrong while fetching user tests", error })
                if (_allTests) return res.status(200).json({ _allTests })
            })
    } else {
        return res.status(400).json({
            msg: {
                one: "check user id, something wrong with it",
                two: "can't pass empty userId"
            }
        })
    }
}

const testRegister = async (req, res) => {
    const { test_code } = req.params;
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            test_code: test_code
        });
        // res.status(200).json({ updateData });
        res.status(200).json({ msg: "Now you are register" })
    }
}

const testAdminData = (req, res) => {
    const { test_code } = req.params;
    if (test_code) {
        User.find({ test_code: test_code })
            .exec((error, candidates) => {
                if (error) return res.status(400).json({ msg: "Something went wrong while fetching candidates-status" });
                if (candidates) return res.status(200).json({ candidates })
            })
    }
}

const increasePersonDetected = async (req, res) => {
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            $inc: { person_detected: 1 }
        })
        res.status(200).json({ msg: "warning of person detected" });
    }
}

const increaseVoiceDetected = async (req, res) => {
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            $inc: { voice_detected: 1 }
        })
        res.status(200).json({ msg: "warning of voice detected" });
    }
}

const increaseFaceCovering = async (req, res) => {
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            $inc: { face_covered: 1 }
        })
        res.status(200).json({ msg: "warning for face covering" });
    }
}

const totalWarnings = (req, res) => {
    const userId = req.user.id;
    if (userId) {
        User.findOne({ _id: userId })
            .exec((error, data) => {
                if (data) {
                    let total_warnings = data.person_detected + data.voice_detected + data.face_covered;
                    return res.status(200).json({ totalWarnings: total_warnings })
                }
            })
    } else {
        return res.status(200).json({ msg: "check user-id" });
    }
}

const terminateExam = async (req, res) => {
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            status: "block"
        });
        // res.status(200).json({ updateData });
        res.status(200).json({ msg: "candidate has been blocked" })
    }
}

const allowInExam = async (req, res) => {
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            status: "safe"
        });
        // res.status(200).json({ updateData });
        res.status(200).json({ msg: "candidate is now allowed to give exam" })
    }
}

const getTestDetails = async (req, res) => {
    const { test_code } = req.params;
    try {
        const test = await Test.findOne({ test_code });
        if (!test) {
            return res.status(404).json({ msg: "Test not found" });
        }
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ msg: "Error fetching test details", error });
    }
};

module.exports = {
    createTest,
    userCreatedTests,
    testRegister,
    testAdminData,
    increasePersonDetected,
    increaseVoiceDetected,
    increaseFaceCovering,
    increasePersonDetected,
    increaseVoiceDetected,
    increaseFaceCovering,
    totalWarnings,
    terminateExam,
    allowInExam,
    getTestDetails
}