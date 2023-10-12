const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema(
    {
        newsTitle: {
            type: String,
        },
        newsImage: {
            type: String
        },
        desc: {
            type: String
        },
        newsStatus: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('News', NewsSchema);
