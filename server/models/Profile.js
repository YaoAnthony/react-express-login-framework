const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentMethods: [{
        cardNumber: { type: String, required: true },
        cardHolderName: { type: String, required: true },
        expiryDate: { type: String, required: true },
        billingAddress: { type: String, required: true }
    }]
});

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;
