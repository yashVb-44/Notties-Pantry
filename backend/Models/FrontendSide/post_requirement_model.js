const mongoose = require('mongoose');

// PostRequirementSchema Schema
const PostRequirementSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    title: {
        type: String,
        required: true,
    },
    images: [{
        type: String
    }],
    desc: {
        type: String,
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('PostRequirement', PostRequirementSchema)
