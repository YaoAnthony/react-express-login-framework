Fullstack React + Node.js Authentication App
============================================

This is a fullstack web application built with **React** (client) and **Node.js/Express** (server), featuring:

- User registration and login  
- Google OAuth 2.0 login (you must register your own credentials)  
- JWT-based authentication  
- MongoDB database integration

Getting Started
---------------

1. Clone the Repository

```
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
```

2. Install Dependencies

Important: All npm dependencies are currently empty. You must run `npm install` manually in both the `client` and `server` folders.

```
cd client
npm install

cd ../server
npm install
```

Environment Variables
---------------------

Create a `.env` file in the **server root** directory with the following structure:

```
# Server Port
PORT=3000

# MongoDB Connection URL
MongoDB_URL=your-mongodb-url

# OpenAI API Key (if applicable)
OPENAI_API_KEY=your-openai-key

# URLs
Website_URL=http://localhost:5173
Redirect_URL=http://localhost:5000/auth/check-auth

# Google OAuth Client ID
GOOGLE_CLIENT_ID=your-google-client-id

# JWT Configuration
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
```

⚠️ Never expose sensitive data (e.g. MongoDB URL, API keys, secrets) in public repositories.

Google OAuth Setup
------------------

To enable Google Login, you must set up your own **Google OAuth 2.0 credentials** via [Google Cloud Console](https://console.cloud.google.com/):

1. Create a new project
2. Enable **Google+ API**
3. Set up OAuth 2.0 credentials
4. Add your `Website_URL` and `Redirect_URL` to **Authorized JavaScript origins** and **Redirect URIs**

Paste your `GOOGLE_CLIENT_ID` into the `.env` file as shown above.

Running the App
---------------

Start Backend (server):

```
cd server
npm start
```

Start Frontend (client):

```
cd client
npm run dev
```

Now visit `http://localhost:5173` in your browser.

Project Structure
-----------------

```
/client     → React frontend (Vite)
/server     → Express backend (API + auth)
/.env       → Your server environment configuration (create manually)
```

Notes
-----

- This project uses JWT for authentication.
- MongoDB is used as the primary database.
- Google login requires you to configure your own OAuth credentials.
- You must install dependencies manually due to empty `node_modules`.