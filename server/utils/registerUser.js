// utils/registerUser.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');

const PendingAuth = require('../models/PendingAuth');

async function registerUser({ email, password }, state = null) {
    // 检查是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // 密码加密
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户和初始 profile
    const newUser = new User({
        email,
        password: passwordHash,
        username: "User0001",
        image_url: "https://www.svgrepo.com/show/452030/avatar-default.svg",
        vipLevel: 0,
        profile: null,
        projects: [],
    });

    const newProfile = new Profile({
        user: newUser._id,
        paymentMethods: []
    });

    newUser.profile = newProfile._id;

    await Promise.all([
        newUser.save(),
        newProfile.save()
    ]);

    // 生成 token
    const accessToken = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const vscodeToken = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '10y' }
    );

    // 如果是 VS Code 注册，存储 token
    if (state) {
        await PendingAuth.findOneAndUpdate(
            { state },
            { accessToken: vscodeToken },
            { new: true }
        );
    }

    return { accessToken, vscodeToken, user: newUser };
}

module.exports = registerUser;
