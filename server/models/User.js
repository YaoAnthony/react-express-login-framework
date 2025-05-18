const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
    username: { 
        type: String, 
        required: true,  
        default: "User0001" 
    },
    isVerified: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: false,
        default: null
    },
    vipLevel: { 
        type: Number, 
        default: 0 
    },
    image_url: { 
        type: String, 
        default: "https://www.svgrepo.com/show/452030/avatar-default.svg" 
    },
    profile: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Profile' 
    },
}, {
    // 明确指定集合名字为 "Accounts"
    collection: 'User'
});

module.exports = mongoose.model('User', UserSchema);
