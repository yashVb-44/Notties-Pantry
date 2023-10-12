const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({

    orderId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    Coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon"
    },
    CouponPrice: {
        type: Number,
        default: 0
    },
    cartData: {
        type: Array
    },
    Address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    Shipping_Charge: {
        type: Number
    },
    Trans_Charge: {
        type: Number,
        default: 0
    },
    OnlineCharge: {
        type: Number
    },
    total_weight: {
        type: Number
    },
    Company: {
        type: String
    },
    Track_id: {
        type: String,
        default: "0"
    },
    PaymentType: {
        type: String,
        default: "0"
    },
    ShippingType: {
        type: String,
        default: "0"
    },
    PaymentId: {
        type: String,
        default: "0"
    },
    OrderType: {
        type: String,
        default: "1"
    },
    OriginalPrice: {
        type: Number,
        default: 0
    },
    DiscountPrice: {
        type: Number,
        default: 0
    },
    CouponPrice: {
        type: Number,
        default: 0
    },
    FinalPrice: {
        type: Number
    },
    processed: {
        type: Boolean,
        default: false
    },
    reason: {
        type: String
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Orders', OrderSchema)