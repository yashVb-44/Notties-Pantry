const mongoose = require('mongoose');

const ReferralSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        name: {
            type: String,
        },
        usedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Referral', ReferralSchema);
