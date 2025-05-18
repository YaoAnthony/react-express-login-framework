
//MongoDB model
const User = require('../models/User');
const UserProfile = require('../models/Profile');
const Counter = require('../models/Counter');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * //set JWT token, return accesstoken, refresh token, expire time
 * @param {*} user 
 * @returns 
 */
const generateToken = (user) => {
    
    // Return jsonwebtoken
    const payload = {
        user: {
            id: user.id
        }
    };

    //access token
    const accessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // 设置accessToken的过期时间为1小时
    );

    //refresh token
    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' } // 设置refreshToken的过期时间为7天
    );

    //expire time
    const expireTime = jwt.decode(accessToken).exp;

    //return token
    return { accessToken, refreshToken, expireTime };
}

const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        { _id: sequenceName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.seq;
};


const createProfile = async (user,res) => {
    const userId = user.id;
    console.log("Detect Someone create the profile. User ID: ",userId)

    let profile = {
        id: userId,
        plan: 'free',
        project: [],
    }

    try {
        // Create a new profile
        const test = await UserProfile.create(profile);
        console.log("create profile success!");
        return test;
    } catch (error) {
        console.error("Error creating profile:", error);
        throw new Error("Server Error");
    }
}


const register = async (req, res) => {
    console.log("someone are register a new account...");
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // require email and password, state
    const { email, password,state } = req.body;
    console.log("register email: ",email);
    try {
        // See if user exists
        let user = await User.findOne({ email });
        if (user) {
            // TODO: 如果存在，则直接登录
            return res.status(400).json({ message: 'User already exists with this email, Would you like to login?' });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nextId = await getNextSequenceValue('userId');
        const userId = nextId.toString().padStart(8, '0');

        user = new User({
            // 如果没有提供 username，使用 Guest + id 作为默认值
            userId,
            username: username || `Guest`,
            isVerified: false,
            email,
            password: hashedPassword,
            image_url: "default_avatar.png",
        });

        await user.save();

        // Return jsonwebtoken
        console.log("register user: ",user.email," success!");
        const token = generateToken(user);
        // 


        //-----------------create profile-----------------
        console.log("create profile for the new user...");
        //get user id from mongoDB according email
        let userInMongoDB = await User.findOne({ 
            email : email
        });

        createProfile(userInMongoDB,res);

        //return token
        res.json({
            token : token, 
            user : userInMongoDB
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};



const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        console.log("start to search: ",email);
        
        let user = await User.findOne({ 
            email : email
        });
        
        if (!user) {
            return res.status(400).json({ message: 'Email doesnt register... Would you like to create an account? ' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        //const isMatch = user.password === password;
        if (!isMatch) {
            return res.status(400).json({ message: 'The email and password is not matched.' });
        }

        const token = generateToken(user);
        res.json({token: token, user: user});


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

//module export
module.exports = {
    register,
    login
};