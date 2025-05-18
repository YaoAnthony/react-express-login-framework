// utils/loginUser.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PendingAuth = require('../models/PendingAuth');

async function loginUser({ email, password, state = null }) {

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    
    console.log('Login attempt:', email, password, state);

    // 短期 token（用于网站）
    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

  // VS Code 登录时：更新数据库中的 pendingAuth
  if (state) {
      const pending = await PendingAuth.findOne({ state });
      if (!pending) {
        throw new Error('Invalid state');
      }

      const vscodeToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '10y' }
      );

      pending.accessToken = vscodeToken;
      await pending.save();
  }

  return { accessToken };
}

module.exports = loginUser;
