const mongoose = require('mongoose');

const HomeFeaturesSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('HomeFeatures', HomeFeaturesSchema);
