const express = require('express');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

require('dotenv').config();

//jwt
const jwt = require('jsonwebtoken');

//scrpto
const crypto = require('crypto');

// import the User model
const User = require('../models/User');
const Profile = require('../models/Profile');
const PendingAuth = require('../models/PendingAuth');

const loginUser = require('../utils/loginUser');
const registerUser = require('../utils/registerUser');

//github
//const { Octokit } = require("@octokit/rest");

/**
 * This route should return a URL that the user can visit to log in
 * Url should include:
 * 
 * - `client_id` : The client ID of the application
 * - `Redirect_url` : The URL that the user should be redirected to after logging in
 * - `response_type` : The type of response the application is expecting (code etc)
 * - `state` = A random string that should be sent back to the application after the user logs in
 * - TODO: `authorization_session_id`
 * 
 * @param {string} client_id - The client ID of the application
 * 
 */
router.get('/generate-url', async (req, res) => {
    // Get the client ID from the query string
    const clientId = req.query.client_id || "unknown_client";

    // Generate a redirect URL, TODO: This should be unique to the client ex: https%3A%2F%2Fcursor.com%2Fapi%2Fauth%2Fcallback
    const redirectUrl = `${process.env.Redirect_URL}/callback`;

    // Response type
    const responseType = "code";

    // Generate a random state : Defer CSRF protection to the client
    const state = crypto.randomBytes(16).toString("hex");

    // Save to mongoDB
    
    await PendingAuth.create({ state, clientId, redirectUrl });
    
    //pendingAuth[state] = { clientId, redirectUrl };

    const authUrl = `${process.env.Website_URL}/login?client_id=${clientId}&redirectUrl=${redirectUrl}&response_type=${responseType}&state=${state}`;
    
    res.json({ authUrl, state });
});

router.get("/check-auth", async (req, res) => {
    const { state } = req.query;
    //res.json({ accessToken: pendingAuth[state]?.accessToken || null });
    const record = await PendingAuth.findOne({ state });
    res.json({ accessToken: record?.accessToken || null });
});

router.post('/login', async (req, res) => {
    const { email, password, state } = req.body;
    await new Promise(resolve => setTimeout(resolve, 3000));
    try {
        const { accessToken } = await loginUser({ email, password, state });
        return res.json({ accessToken });
    } catch (error) {
        if ( error.message === 'Invalid email' ) {
            console.error(error);
            return res.status(400).json({ message: "User not found, pls register" });
        }
        if ( error.message === 'Invalid password' ) {
            return res.status(400).json({ message: "Invalid password" });
        }
        if ( error.message === 'Invalid state' ) {
            return res.status(400).json({ message: "User not verified" });
        }
      console.error(error);
      return res.status(500).json({ message: 'Database error' });
    }
});

router.post('/register', async (req, res) => {
    const { email, password, state } = req.body;
  
    try {
      const { accessToken } = await registerUser({ email, password }, state);
      res.json({ message: "User registered!", accessToken });
    } catch (err) {
      if (err.message === 'User already exists') {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Database error" });
      }
    }
});

// POST /auth/google
router.post('/google', async (req, res) => {
    const { id_token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ message: 'Invalid Google token' });
        }

        const { email, name, picture } = payload;
        console.log('Google payload:', payload.picture);

        // 查找或注册用户
        let user = await User.findOne({ email });
        // register new user if not found
        if (!user) {
            const { email, name, picture } = payload;
            const newUser = new User({
                email,
                password: null,
                username: name,
                image_url: picture,
                vipLevel: 0,
                profile: null,
                projects: [],
            });
            console.log("found", newUser.image_url);

            const newProfile = new Profile({
                user: newUser._id,
                paymentMethods: []
            });

            newUser.profile = newProfile._id;

            await Promise.all([
                newUser.save(),
                newProfile.save()
            ]);

            // 生成你自己的 access token
            const accessToken = jwt.sign(
                { id: newUser._id, email: email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.json({ accessToken, user: newUser });
        }
        
        // 生成你自己的 access token
        const accessToken = jwt.sign(
            { id: user._id, email: email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.json({ accessToken, user });
        

    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Failed to verify Google token' });
    }
});

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/github', async (req, res) => {
    const { code } = req.body;
  
    if (!code) return res.status(400).json({ message: 'Missing GitHub code' });
  
    try {
      // 1️⃣ 用 code 换取 GitHub access_token
      const tokenRes = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: { Accept: 'application/json' },
        }
      );
  
      const githubAccessToken = tokenRes.data.access_token;
      if (!githubAccessToken) {
        return res.status(401).json({ message: 'GitHub token exchange failed' });
      }
  
      // 2️⃣ 用 token 获取 GitHub 用户信息
      const octokit = new Octokit({ auth: githubAccessToken });
      const { data: githubUser } = await octokit.rest.users.getAuthenticated();
  
      const email = githubUser.email || `${githubUser.login}@users.noreply.github.com`;
      const username = githubUser.name || githubUser.login;
      const avatar = githubUser.avatar_url;
  
      // 3️⃣ 查找或注册本地用户
      let user = await User.findOne({ email });
      if (!user) {
        const newUser = new User({
          email,
          password: null,
          username,
          image_url: avatar,
          vipLevel: 0,
          profile: null,
          projects: [],
        });
  
        const newProfile = new Profile({
          user: newUser._id,
          paymentMethods: [],
        });
  
        newUser.profile = newProfile._id;
  
        await Promise.all([newUser.save(), newProfile.save()]);
        user = newUser;
      }
  
      // 4️⃣ 生成 JWT access token
      const accessToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      return res.json({ accessToken, user });
    } catch (err) {
      console.error('GitHub login error:', err);
      return res.status(500).json({ message: 'GitHub login failed' });
    }
  });
  

module.exports = router;
