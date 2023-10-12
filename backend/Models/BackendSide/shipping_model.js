const mongoose = require('mongoose');

const WeightSchema = mongoose.Schema({
    name: String,
    price: Number,
});

const ShippingSchema = mongoose.Schema(
    {
        type: {
            type: String
        },
        userType: {
            type: String
        },
        state: {
            type: String,
        },
        city: {
            type: String,
        },
        weights: {
            type: [WeightSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Shipping', ShippingSchema);
