const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        User_Name: {
            type: String,
        },
        User_Image: {
            type: String
        },
        User_Email: {
            type: String,
        },
        User_Mobile_No: {
            type: Number
        },
        User_Password: {
            type: String,
        },
        User_Otp: {
            type: Number,
            default: 1234
        },
        Is_Verify: {
            type: Boolean,
            default: false
        },
        Wallet: {
            type: Number,
            default: 0
        },
        Coins: {
            type: Number,
            default: 0
        },
        DOB: {
            type: String
        },
        User_Type: {
            type: String,
            default: "0"
        },
        Referral: {
            type: String
        },
        Referral_Use: {
            type: String
        },
        Block: {
            type: Boolean,
            default: false
        },
        isAbleWallet: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Users', UserSchema);
