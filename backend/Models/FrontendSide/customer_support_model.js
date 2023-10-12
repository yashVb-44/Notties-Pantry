const mongoose = require('mongoose');

// CustomerSupportSchema Schema
const CustomerSupportSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    subject: {
        type: String,
        required: true,
    },
    orderId: {
        type: String
    },
    image: {
        type: String
    },
    solution: {
        type: String
    },
    comment: {
        type: String,
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('CustomerSupport', CustomerSupportSchema)
