const User = require('../models/user');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
    console.log('Request body:', req.body); // Debugging line
    console.log('Request file:', req.file); // Debugging line

    User.findOne({ email: req.body.email }).exec((error, user) => {
        if (user) return res.status(409).json({ msg: 'User already registered' });

        const { fullName, email, password } = req.body;
        const profilePicture = req.file ? req.file.filename : '';

        const _user = new User({
            fullName,
            email,
            password,
            profilePicture
        });

        _user.save((error, data) => {
            if (error) return res.status(400).json({ msg: 'Something happened while storing new user', error });
            if (data) return res.status(201).json({ msg: 'New user successfully registered!' });
        });
    });
}

const signIn = (req, res) => {
    User.findOne({ email: req.body.email }) // finding user by email
        .exec((error, user) => {
            // if something happend like internal error
            if (error) return res.status(400).json({ msg: "Bad luck!, Must be internal error or you messed up", error });
            // if user found then we will verify his password
            if (user) {
                // if password is correct then we will create a token
                if (user.authenticate(req.body.password)) {
                    // we will create token
                    const token = jwt.sign(
                        { id: user._id, email: user.email },
                        process.env.jwt_secret_key,
                        { expiresIn: '2d' }
                    )
                    const { _id, fullName, email, profilePicture } = user;
                    res.cookie('token', token, { expiresIn: '2d' });
                    res.status(200).json({
                        token, user: {
                            _id, fullName, email, profilePicture
                        }
                    })
                } else {
                    return res.status(401).json({ msg: "Invalid password" })
                }
            }
            if (!user) {
                return res.status(404).json({ msg: "User dose not exit" });
            }
        })
}

const signOut = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ msg: `Sign-out Successfully...!` });
}

const getUserDetails = (req, res) => {
    const { email } = req.params;
    User.findOne({ email }).exec((error, user) => {
        if (error) return res.status(400).json({ msg: "Something went wrong", error });
        if (user) {
            const { _id, fullName, email, profilePicture } = user;
            return res.status(200).json({ user: { _id, fullName, email, profilePicture } });
        } else {
            return res.status(404).json({ msg: "User not found" });
        }
    });
}


module.exports = {
    register,
    signIn,
    signOut,
    getUserDetails
}