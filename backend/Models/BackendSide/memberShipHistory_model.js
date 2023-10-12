const mongoose = require('mongoose');

// MemberShip Schema
const MemberShipHistorySchema = mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    PaymentId: {
        type: String,
    },
    MemberShipData: {
        type: Array
    },
    Type: {
        type: String,
        default: "1"
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
    // MemberShip_Status: {
    //     type: Boolean,
    //     default: false
    // },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('MemberShipHistorys', MemberShipHistorySchema)
